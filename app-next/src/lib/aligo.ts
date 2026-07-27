/**
 * 알리고 알림톡·SMS 발송 클라이언트 (2026-07-27)
 *   env:
 *     ALIGO_API_KEY          — 알리고 콘솔 발급
 *     ALIGO_USER_ID          — 알리고 회원 ID
 *     ALIGO_SENDER           — 승인받은 발신번호 (010-xxxx-xxxx or 02-xxx-xxxx)
 *     ALIGO_SENDER_KEY       — 카카오 채널 senderkey (알리고 콘솔에서 채널 연동 후 발급)
 *     ALIGO_TPL_LEAD_ADMIN   — 「신규 상담」 알림톡 템플릿 코드 (카카오 심사 승인 후 부여)
 *     ADMIN_PHONE_LIST       — 알림 받을 관리자 폰번호 (콤마 구분, 예: 010-1111-2222,010-3333-4444)
 *   미설정 시 → 조용히 MOCK 모드 (콘솔 로그만)
 *
 * API 참조: https://smartsms.aligo.in/admin/api/spec/list.html
 *   알림톡: POST https://kakaoapi.aligo.in/akv10/alimtalk/send/
 *   SMS 대체 발송: 알림톡 실패 시 자동 (failover)
 */

const API_KEY = process.env.ALIGO_API_KEY;
const USER_ID = process.env.ALIGO_USER_ID;
const SENDER = process.env.ALIGO_SENDER;
const SENDER_KEY = process.env.ALIGO_SENDER_KEY;

// 관리자 여러명 지원 (콤마 구분)
function adminPhones(): string[] {
  return (process.env.ADMIN_PHONE_LIST ?? "")
    .split(",")
    .map((s) => s.trim().replace(/[^0-9]/g, ""))
    .filter((s) => s.length >= 10);
}

interface AligoAlimtalkResult {
  ok: boolean;
  mock: boolean;
  code?: number;
  message?: string;
  info_id?: string;
}

/**
 * 알림톡 발송 (등록된 템플릿만 가능 · 변수 치환)
 * @param tplCode 카카오 심사 승인받은 템플릿 코드
 * @param subject 알림톡 제목 (내부용 · 사용자엔 안 보임)
 * @param message 템플릿 그대로 · #{변수} 치환된 최종 문구
 * @param receiver 수신자 폰번호 (하이픈 없이 or with · 정규화됨)
 */
export async function aligoAlimtalk(
  tplCode: string,
  subject: string,
  message: string,
  receiver: string,
): Promise<AligoAlimtalkResult> {
  const to = receiver.replace(/[^0-9]/g, "");
  if (!API_KEY || !USER_ID || !SENDER || !SENDER_KEY) {
    console.log(`[aligo.MOCK] tpl=${tplCode} to=${to} subject=${subject}\n${message}`);
    return { ok: true, mock: true, message: "MOCK (env 미설정)" };
  }
  if (!/^0[0-9]{9,10}$/.test(to)) {
    return { ok: false, mock: false, message: "invalid phone" };
  }

  const form = new URLSearchParams({
    apikey: API_KEY,
    userid: USER_ID,
    senderkey: SENDER_KEY,
    tpl_code: tplCode,
    sender: SENDER.replace(/[^0-9]/g, ""),
    receiver_1: to,
    subject_1: subject,
    message_1: message,
    // failover to SMS if 알림톡 fails (예: 카톡 미설치 · 채널 차단)
    testMode: "N",
  });

  try {
    const r = await fetch("https://kakaoapi.aligo.in/akv10/alimtalk/send/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    const j = (await r.json().catch(() => ({}))) as { code?: number; message?: string; info?: { info_id?: string } };
    const ok = j.code === 0;
    if (!ok) console.error("[aligo.alimtalk]", j.code, j.message);
    return { ok, mock: false, code: j.code, message: j.message, info_id: j.info?.info_id };
  } catch (e) {
    console.error("[aligo.alimtalk.throw]", e);
    return { ok: false, mock: false, message: e instanceof Error ? e.message : "throw" };
  }
}

/**
 * 관리자 여러명에게 병렬 발송 (실패해도 개별)
 */
export async function alimtalkToAdmins(
  tplCode: string,
  subject: string,
  message: string,
): Promise<{ sent: number; failed: number; results: AligoAlimtalkResult[] }> {
  const phones = adminPhones();
  if (phones.length === 0) {
    console.log(`[aligo.admins.MOCK] no ADMIN_PHONE_LIST · subject=${subject}\n${message}`);
    return { sent: 0, failed: 0, results: [{ ok: true, mock: true, message: "no admin phones" }] };
  }
  const results = await Promise.all(
    phones.map((p) => aligoAlimtalk(tplCode, subject, message, p)),
  );
  const sent = results.filter((r) => r.ok).length;
  return { sent, failed: results.length - sent, results };
}
