"use client";

import { useEffect, useState } from "react";

// 파일 기반 (모비딕 방식 · Supabase 걷어냄 2026-07-20)
// TODO: admin 인증은 별도 세션/미들웨어로 붙일 것

type Lead = {
  id: string;
  created_at: string;
  name: string | null;
  phone: string | null;
  kakao_id: string | null;
  email: string | null;
  channel: string | null;
  // 2026-07-27 · 카톡 챗봇 시나리오 확장 필드
  source?: string | null;
  kakao_user_id?: string | null;
  track?: string | null;
  interest?: string | null;
  visit_time?: string | null;
  location?: string | null;
  message: string | null;
  status: string;
  lang: string | null;
  notion_page_id?: string | null;
};

// 2026-07-27 · 소스별 뱃지 색상 + 라벨
const SOURCE_META: Record<string, { label: string; color: string; bg: string }> = {
  kakao_channel: { label: "💬 카톡 채널", color: "#FFE812", bg: "rgba(255,232,18,0.10)" },
  kakao_k1:      { label: "🎓 K1 방", color: "#FFE812", bg: "rgba(255,232,18,0.06)" },
  instagram:     { label: "📸 인스타", color: "#E85A9E", bg: "rgba(232,90,158,0.10)" },
  web_form:      { label: "🌐 홈피", color: "#E0C088", bg: "rgba(224,192,136,0.10)" },
  phone:         { label: "☎ 전화", color: "#8AB48A", bg: "rgba(138,180,138,0.10)" },
  direct:        { label: "직접", color: "#B89880", bg: "transparent" },
};
const INTEREST_LABEL: Record<string, string> = {
  startup_890: "창업반 890", easy_69: "이지반 69", hyperreal_169: "극사실 169",
  brow: "눈썹", eyeline: "아이라인", lip: "입술", hairline: "헤어라인", scar_removal: "잔흔복구", unsure: "미정",
};
const VISIT_LABEL: Record<string, string> = {
  weekday_am: "평일 오전", weekday_pm: "평일 오후", weekday_evening: "평일 저녁", weekend: "주말", any: "무관",
};
const LOCATION_LABEL: Record<string, string> = { seonleung: "선릉", samseong: "삼성", any: "무관" };

const K1_OPENCHAT = "https://open.kakao.com/o/gWeAkSzi"; // 수강생 전용 평생 락인 채팅방

const QUICK_TEMPLATES = [
  {
    label: "상담 안내 (24h)",
    text: (name?: string) =>
      `[장미지눈썹연구소] ${name || ""}님, 모집 신청 감사합니다. 영업일 기준 24시간 내 담당자가 연락드립니다. 급한 문의는 인스타 DM 또는 카카오 채널로 가능합니다.`,
  },
  {
    label: "1:1 상담 일정",
    text: (name?: string) =>
      `[장미지눈썹연구소] ${name || ""}님, 1:1 상담 일정 안내드립니다. 선릉 본진 아틀리에 방문 또는 화상 상담 가능합니다. 회신 부탁드립니다.`,
  },
  {
    label: "수강 결제 안내",
    text: (name?: string) =>
      `[장미지눈썹연구소] ${name || ""}님, 수강 확정 감사합니다. 평생 수강 69만원 결제 안내드립니다. 토스페이먼츠 / 카카오페이 선택 가능합니다.\n결제 완료 후 수강생 전용 K1 카톡방에 자동 초대드립니다: ${K1_OPENCHAT}`,
  },
  {
    label: "수강 완료 · K1 초대",
    text: (name?: string) =>
      `[장미지눈썹연구소] ${name || ""}님, 수강 완료를 축하드립니다. 이제 수강생 전용 K1 카톡방에 평생 참여하실 수 있습니다.\n${K1_OPENCHAT}\n원장님과 동기들이 함께하는 평생 락인 채널입니다.`,
  },
];

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [smsLead, setSmsLead] = useState<Lead | null>(null);
  const [smsText, setSmsText] = useState("");
  const [smsStatus, setSmsStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [smsResult, setSmsResult] = useState("");
  // 2026-07-27 · 소스 필터 (all · kakao_channel · instagram · web_form · phone)
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const filteredLeads = sourceFilter === "all"
    ? leads
    : leads.filter((l) => (l.source ?? l.channel ?? "direct") === sourceFilter);
  const sourceCounts = leads.reduce((acc, l) => {
    const s = l.source ?? l.channel ?? "direct";
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/leads?limit=200");
        const data = await res.json();
        if (data.error) setErr(data.error);
        else setLeads(data.items ?? []);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "load failed");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openSms = (l: Lead) => {
    setSmsLead(l);
    setSmsText(QUICK_TEMPLATES[0].text(l.name || ""));
    setSmsStatus("idle");
    setSmsResult("");
  };

  const sendSms = async () => {
    if (!smsLead?.phone || !smsText) return;
    setSmsStatus("sending");
    try {
      const res = await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: smsLead.id, to: smsLead.phone, text: smsText }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "전송 실패");
      setSmsStatus("ok");
      setSmsResult(data.mock ? "✓ MOCK 전송 (Solapi 키 미설정 — UI 흐름만 검증)" : "✓ 실 전송 완료");
    } catch (e) {
      setSmsStatus("error");
      setSmsResult(e instanceof Error ? e.message : "전송 실패");
    }
  };

  return (
    <main style={{ padding: "100px 22px 80px", maxWidth: 1180, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid var(--line)", paddingBottom: 18, marginBottom: 28, gap: 14 }}>
        <h1 className="serif" style={{ fontSize: 28, fontWeight: 300, flex: 1 }}>
          관리자 <em style={{ fontStyle: "normal", color: "var(--gold-light)", fontWeight: 800 }}>대시보드</em>
        </h1>
        <a href="/admin/history" style={{ background: "transparent", border: "1px solid var(--gold-deep)", color: "var(--gold-light)", padding: "8px 16px", fontSize: 11, letterSpacing: ".15em", fontWeight: 600, textTransform: "uppercase", textDecoration: "none" }}>
          📜 히스토리
        </a>
      </div>

      <div style={{ marginBottom: 14, color: "var(--gold)", fontSize: 11, letterSpacing: ".3em", textTransform: "uppercase", fontWeight: 600 }}>
        상담·모집 신청 ({leads.length}{sourceFilter !== "all" ? ` · 필터 ${filteredLeads.length}` : ""})
      </div>

      {/* 2026-07-27 · 소스 필터 (통합 DB · 5개 채널 대응) */}
      {leads.length > 0 && (
        <div style={{ marginBottom: 20, display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button onClick={() => setSourceFilter("all")}
            style={filterBtn(sourceFilter === "all")}>
            전체 ({leads.length})
          </button>
          {Object.entries(SOURCE_META).map(([key, meta]) => {
            const count = sourceCounts[key] ?? 0;
            if (count === 0 && key !== "kakao_channel") return null;   // 카톡 채널은 곧 활성될 것 · 항상 표시
            return (
              <button key={key} onClick={() => setSourceFilter(key)}
                style={{ ...filterBtn(sourceFilter === key), color: sourceFilter === key ? meta.color : undefined }}>
                {meta.label} ({count})
              </button>
            );
          })}
        </div>
      )}

      {loading && <div style={{ color: "var(--muted)" }}>로딩 중...</div>}
      {err && <div style={{ color: "#E07060", fontSize: 13, padding: "12px 16px", border: "1px solid #5A2422", background: "#1E1410", marginBottom: 14 }}>⚠ {err}</div>}

      {!loading && !err && leads.length === 0 && (
        <div style={{ background: "var(--bg-card)", border: "1px dashed var(--line)", padding: 48, textAlign: "center", color: "var(--muted)", fontSize: 14 }}>
          아직 신청이 없습니다. <a href="/enroll" style={{ color: "var(--gold-light)", textDecoration: "underline" }}>모집 페이지</a> 에서 첫 lead 를 만들어 확인해보세요.
        </div>
      )}

      {leads.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--bg-card)" }}>
              <th style={th}>시간</th>
              <th style={th}>이름</th>
              <th style={th}>연락처</th>
              <th style={th}>소스</th>
              <th style={th}>관심 · 방문</th>
              <th style={th}>메시지</th>
              <th style={th}>상태</th>
              <th style={th}>액션</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((l) => {
              const srcKey = l.source ?? l.channel ?? "direct";
              const srcMeta = SOURCE_META[srcKey] ?? SOURCE_META.direct;
              return (
                <tr key={l.id} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={td}>{new Date(l.created_at).toLocaleString("ko-KR")}</td>
                  <td style={{ ...td, fontWeight: 700 }}>{l.name || "-"}</td>
                  <td style={td}>
                    {l.phone || "-"}
                    {l.kakao_id && <div style={{ fontSize: 11, color: "var(--muted)" }}>{l.kakao_id}</div>}
                  </td>
                  <td style={td}>
                    <span style={{ fontSize: 11, padding: "3px 10px", background: srcMeta.bg, border: `1px solid ${srcMeta.color}44`, borderRadius: 99, color: srcMeta.color, fontWeight: 600, whiteSpace: "nowrap" }}>
                      {srcMeta.label}
                    </span>
                    {l.track ? <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>트랙: {l.track === "academy" ? "수강" : l.track === "procedure" ? "시술" : l.track}</div> : null}
                  </td>
                  <td style={td}>
                    {l.interest ? <div style={{ color: "var(--gold-light)", fontWeight: 700, fontSize: 12 }}>{INTEREST_LABEL[l.interest] ?? l.interest}</div> : <span style={{ color: "var(--muted)" }}>-</span>}
                    {l.visit_time ? <div style={{ fontSize: 11, color: "var(--text-soft)", marginTop: 3 }}>⏱ {VISIT_LABEL[l.visit_time] ?? l.visit_time}</div> : null}
                    {l.location ? <div style={{ fontSize: 11, color: "var(--text-soft)" }}>📍 {LOCATION_LABEL[l.location] ?? l.location}</div> : null}
                  </td>
                  <td style={{ ...td, color: "var(--text-soft)", maxWidth: 260, whiteSpace: "pre-wrap" }}>{l.message || "-"}</td>
                  <td style={td}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: l.status === "new" ? "var(--gold)" : "var(--muted)", padding: "2px 8px", border: `1px solid ${l.status === "new" ? "var(--gold-deep)" : "var(--line)"}`, borderRadius: 99 }}>
                      {l.status}
                    </span>
                    {l.notion_page_id ? <div style={{ fontSize: 10, color: "#8AB48A", marginTop: 4 }} title={l.notion_page_id}>📝 Notion</div> : null}
                  </td>
                  <td style={td}>
                    {l.phone && (
                      <button onClick={() => openSms(l)} style={{ background: "transparent", color: "var(--gold-light)", border: "1px solid var(--gold-deep)", padding: "5px 12px", fontSize: 11, letterSpacing: ".1em", fontWeight: 700, cursor: "pointer" }}>
                        💬 문자
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* SMS Modal */}
      {smsLead && (
        <div onClick={() => setSmsLead(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.78)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 22 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--bg-card)", border: "1px solid var(--gold-deep)", padding: 30, maxWidth: 540, width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "var(--gold)", letterSpacing: ".3em", fontWeight: 600, textTransform: "uppercase" }}>SMS · 문자 발송</div>
                <h3 className="serif" style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>{smsLead.name} · {smsLead.phone}</h3>
              </div>
              <button onClick={() => setSmsLead(null)} style={{ background: "transparent", border: "none", color: "var(--muted)", fontSize: 24, cursor: "pointer" }}>×</button>
            </div>

            <div style={{ marginBottom: 14, display: "flex", gap: 6, flexWrap: "wrap" }}>
              {QUICK_TEMPLATES.map((t) => (
                <button key={t.label} onClick={() => setSmsText(t.text(smsLead.name || ""))} style={{ background: "var(--bg-deep)", border: "1px solid var(--line)", color: "var(--text-soft)", padding: "6px 12px", fontSize: 11, cursor: "pointer" }}>
                  {t.label}
                </button>
              ))}
            </div>

            <textarea value={smsText} onChange={(e) => setSmsText(e.target.value)} rows={6}
              style={{ width: "100%", background: "var(--bg-deep)", border: "1px solid var(--line)", color: "var(--text)", padding: "14px", fontSize: 14, fontFamily: "inherit", resize: "vertical", marginBottom: 14 }} />

            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 14 }}>
              글자수: {smsText.length} (90자 이하 SMS · 그 이상 LMS) · 발신: SOLAPI_SENDER 환경변수
            </div>

            {smsResult && (
              <div style={{ fontSize: 12, padding: "10px 14px", marginBottom: 14, background: smsStatus === "ok" ? "#0F2A1C" : "#1E1410", border: `1px solid ${smsStatus === "ok" ? "var(--ok)" : "#5A2422"}`, color: smsStatus === "ok" ? "#7EAB8E" : "#E07060" }}>
                {smsResult}
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setSmsLead(null)} style={{ flex: 1, background: "transparent", color: "var(--text)", border: "1px solid var(--line)", padding: "12px 18px", fontSize: 12, letterSpacing: ".15em", fontWeight: 600, cursor: "pointer", textTransform: "uppercase" }}>
                취소
              </button>
              <button onClick={sendSms} disabled={smsStatus === "sending"} style={{ flex: 2, background: "var(--gold)", color: "var(--bg-deep)", border: "none", padding: "12px 18px", fontSize: 12, letterSpacing: ".2em", fontWeight: 700, cursor: smsStatus === "sending" ? "wait" : "pointer", textTransform: "uppercase", opacity: smsStatus === "sending" ? 0.6 : 1 }}>
                {smsStatus === "sending" ? "전송 중..." : "💬 발송"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const th: React.CSSProperties = { textAlign: "left", padding: "12px 14px", fontSize: 11, color: "var(--gold)", letterSpacing: ".15em", textTransform: "uppercase", fontWeight: 600, borderBottom: "1px solid var(--line)" };
const td: React.CSSProperties = { padding: "14px", verticalAlign: "top", color: "var(--text)" };
function filterBtn(active: boolean): React.CSSProperties {
  return {
    background: active ? "rgba(224,192,136,0.10)" : "var(--bg-card)",
    border: `1px solid ${active ? "var(--gold)" : "var(--line)"}`,
    color: active ? "var(--gold-light)" : "var(--text-soft)",
    padding: "6px 12px",
    fontSize: 11,
    letterSpacing: ".08em",
    fontWeight: 700,
    cursor: "pointer",
    borderRadius: 4,
    whiteSpace: "nowrap",
    transition: "all .15s",
  };
}
