"use client";

/**
 * 교육 상담 신청서 (원장님 공식자료 2026-07-19 반영)
 *  · 4대 기본 과정 + Master Course
 *  · 가격 미공개 (프리미엄 상담 유도)
 *  · 파일 저장: content/leads/{id}.json (POST /api/leads)
 */
import { useState } from "react";

const COURSES = [
  {
    key: "easy_class",
    label: "이지클래스",
    tag: "초보",
    meta: "5주차 · 15시간",
    desc: "반영구 입문의 정석 · 매일 피드백",
  },
  {
    key: "sketch",
    label: "극사실기초 소묘수업",
    tag: "초보 · 경력자",
    meta: "3일 · 21시간",
    desc: "눈썹결의 원리를 이해하는 수업 · 진짜 눈썹을 보고 그린다",
  },
  {
    key: "hyperreal",
    label: "극사실눈썹 강의",
    tag: "경력자",
    meta: "3일 · 21시간",
    desc: "3일 시술중심의 완성과정",
  },
  {
    key: "startup_pack",
    label: "★★ 반영구 창업반 (종합 패키지)",
    tag: "초보 · 초기 시장진입자",
    meta: "이지 1 + 소묘 1 + 눈썹 3 + 제거 1 + 창업 컨설팅",
    desc: "입문부터 개원까지 원스톱 · 학비는 상담에서 안내",
  },
  {
    key: "custom",
    label: "맞춤 · 파트너 클래스 협의",
    tag: "상담",
    meta: "일정·내용·강사 조율",
    desc: "상황에 맞게 커스터마이즈 (그룹·해외·언어 등)",
  },
];

const CHANNELS = [
  { v: "instagram", l: "인스타그램" },
  { v: "instagram_ad", l: "인스타 광고" },
  { v: "naver", l: "네이버" },
  { v: "youtube", l: "유튜브" },
  { v: "kakao", l: "카카오" },
  { v: "wechat", l: "위챗" },
  { v: "referral", l: "지인 추천" },
  { v: "direct", l: "기타 / 직접 검색" },
];

const EXPERIENCE = [
  { v: "none", l: "처음 입문 (경력 0)" },
  { v: "beginner", l: "다른 학원 수강 경험" },
  { v: "professional", l: "현직 시술자 / 동종 업계" },
  { v: "owner", l: "본인 스튜디오 운영 중" },
];

const GOAL = [
  { v: "explore", l: "일단 알아보는 중" },
  { v: "hobby", l: "취미 / 자기계발" },
  { v: "career", l: "이직·부업 준비" },
  { v: "professional", l: "전문가 성장" },
  { v: "startup", l: "창업 준비" },
];

const START_WHEN = [
  { v: "asap", l: "최대한 빨리" },
  { v: "1mo", l: "1개월 이내" },
  { v: "3mo", l: "3개월 이내" },
  { v: "flexible", l: "유연하게 조율" },
];

export default function EnrollPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    kakao_id: "",
    instagram: "",
    email: "",
    course: "hyperreal",
    goal: "career",
    experience: "none",
    channel: "instagram",
    start_when: "asap",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      setStatus("error");
      setError("성함과 휴대전화는 필수입니다.");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const selectedCourse = COURSES.find((c) => c.key === form.course);
      const msgParts = [
        form.message,
        `\n— 관심 과정: ${selectedCourse?.label ?? form.course}`,
        `— 목적: ${GOAL.find((g) => g.v === form.goal)?.l}`,
        `— 현재 경력: ${EXPERIENCE.find((c) => c.v === form.experience)?.l}`,
        `— 시작 가능: ${START_WHEN.find((s) => s.v === form.start_when)?.l ?? form.start_when}`,
        form.instagram ? `— 인스타: ${form.instagram}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          kakao_id: form.kakao_id,
          email: form.email,
          channel: form.channel,
          message: msgParts,
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "전송 실패");
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "전송 실패");
    }
  };

  if (status === "ok") {
    return (
      <main style={{ padding: "120px 22px 80px", maxWidth: 640, margin: "0 auto" }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--gold-deep)", padding: "60px 40px", textAlign: "center" }}>
          <div style={{ fontSize: 44, color: "var(--gold)", marginBottom: 22, fontFamily: "var(--ab-font-headline)", fontWeight: 300 }}>✓</div>
          <div style={{ letterSpacing: ".5em", fontSize: 10.5, color: "var(--gold)", fontWeight: 500, textTransform: "uppercase", marginBottom: 12 }}>
            CONSULT REQUEST RECEIVED
          </div>
          <h2 className="serif" style={{ fontSize: 28, fontWeight: 300, marginBottom: 18, color: "var(--gold-light)", letterSpacing: "-0.005em" }}>
            교육 상담 신청이 접수되었습니다
          </h2>
          <p style={{ color: "var(--text-soft)", fontSize: 14, lineHeight: 2 }}>
            영업일 기준 <b style={{ color: "var(--gold-light)" }}>24시간 내</b> 담당자가<br />
            카카오·인스타 DM·휴대전화 중 편하신 채널로 연락드립니다.
          </p>
          <div style={{ marginTop: 32, padding: "22px 26px", background: "var(--bg-deep)", border: "1px solid var(--line)", textAlign: "left", fontSize: 13, color: "var(--text-soft)", lineHeight: 2.1 }}>
            <div style={{ color: "var(--gold)", letterSpacing: ".3em", fontSize: 10.5, marginBottom: 10, textTransform: "uppercase", fontWeight: 600 }}>NEXT STEP</div>
            ① 담당자 신청 내용 검토 · 회신 (24h)<br />
            ② 1:1 화상 or 선릉·삼성 본원 방문 상담 조율<br />
            ③ 관심 과정 상세 안내 (커리큘럼 · 일정 · 학비)<br />
            ④ 수강 결정 시 결제 안내 (토스 · 카카오페이)<br />
            ⑤ 수강 시작 + 평생 K1 카톡방 자동 초대
          </div>
          <a href="/" style={{ display: "inline-block", marginTop: 34, padding: "13px 30px", border: "1px solid var(--gold-deep)", color: "var(--gold-light)", fontSize: 11, letterSpacing: ".28em", fontWeight: 500, textTransform: "uppercase", textDecoration: "none" }}>
            ← 홈으로
          </a>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: "120px 22px 80px", maxWidth: 780, margin: "0 auto" }}>
      <div style={{ letterSpacing: ".5em", fontSize: 10.5, color: "var(--gold)", fontWeight: 500, textTransform: "uppercase", marginBottom: 18, textAlign: "center" }}>
        COURSE CONSULT · 교육 상담 신청
      </div>
      <h1 className="serif" style={{ fontSize: 42, fontWeight: 300, lineHeight: 1.25, marginBottom: 12, textAlign: "center", letterSpacing: "-.01em" }}>
        극사실눈썹 <em style={{ fontStyle: "normal", color: "var(--gold-light)", fontWeight: 800 }}>창시자</em>에게<br />
        직접 배웁니다
      </h1>
      <p style={{ color: "var(--text-soft)", fontSize: 14, textAlign: "center", marginBottom: 16, maxWidth: 560, marginLeft: "auto", marginRight: "auto", lineHeight: 1.9 }}>
        <b style={{ color: "var(--text)" }}>장미지 대표원장</b> · 20년+ 경력 · 국내 유일 「극사실눈썹」 특허 보유<br />
        선릉·삼성 본원 · 누적 수강생 900여명 · 창업 수백여명 · 만족도 4.5★
      </p>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 46, flexWrap: "wrap" }}>
        <span style={pill}>원장 직강</span>
        <span style={pill}>1:1 코칭</span>
        <span style={pill}>실전 시술 실습</span>
        <span style={pill}>평생 K1 카톡방</span>
        <span style={{ ...pill, borderColor: "var(--gold)", color: "var(--gold-light)" }}>창업반 · 입문→개원 원스톱</span>
      </div>

      <form onSubmit={onSubmit} style={{ background: "var(--bg-card)", border: "1px solid var(--line)", padding: 36 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <Field label="성함 *" v={form.name} onChange={(v) => set("name", v)} placeholder="홍길동" />
          <Field label="휴대전화 *" v={form.phone} onChange={(v) => set("phone", v)} placeholder="010-0000-0000" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <Field label="카카오 ID" v={form.kakao_id} onChange={(v) => set("kakao_id", v)} placeholder="@yourID" />
          <Field label="인스타 (선택)" v={form.instagram} onChange={(v) => set("instagram", v)} placeholder="@yourinsta" />
        </div>
        <div style={{ marginBottom: 14 }}>
          <Field label="이메일 (선택)" v={form.email} onChange={(v) => set("email", v)} placeholder="you@example.com" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <Label>관심 과정 *</Label>
          <div style={{ display: "grid", gap: 10 }}>
            {COURSES.map((c) => {
              const active = form.course === c.key;
              return (
                <label
                  key={c.key}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "22px 1fr auto",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    background: active ? "var(--bg-deep)" : "transparent",
                    border: `1px solid ${active ? "var(--gold)" : "var(--line)"}`,
                    cursor: "pointer",
                    transition: "border-color .15s",
                  }}
                >
                  <input
                    type="radio"
                    name="course"
                    checked={active}
                    onChange={() => set("course", c.key)}
                    style={{ accentColor: "var(--gold)" }}
                  />
                  <div>
                    <div className="serif" style={{ fontSize: 15, fontWeight: 700, color: active ? "var(--gold-light)" : "var(--text)", marginBottom: 3 }}>
                      {c.label}
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--text-soft)" }}>{c.desc}</div>
                  </div>
                  <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <div style={{ fontFamily: "var(--ab-font-body-latin)", fontSize: 9.5, letterSpacing: ".28em", color: "var(--gold)", marginBottom: 3, fontWeight: 600 }}>
                      {c.tag}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{c.meta}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <Label>수강 목적 *</Label>
            <select style={inp} value={form.goal} onChange={(e) => set("goal", e.target.value)}>
              {GOAL.map((g) => <option key={g.v} value={g.v}>{g.l}</option>)}
            </select>
          </div>
          <div>
            <Label>현재 경력 *</Label>
            <select style={inp} value={form.experience} onChange={(e) => set("experience", e.target.value)}>
              {EXPERIENCE.map((c) => <option key={c.v} value={c.v}>{c.l}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <Label>알게 된 경로 *</Label>
            <select style={inp} value={form.channel} onChange={(e) => set("channel", e.target.value)}>
              {CHANNELS.map((c) => <option key={c.v} value={c.v}>{c.l}</option>)}
            </select>
          </div>
          <div>
            <Label>시작 가능 시점</Label>
            <select style={inp} value={form.start_when} onChange={(e) => set("start_when", e.target.value)}>
              {START_WHEN.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <Label>문의 · 자기소개 (선택)</Label>
          <textarea
            style={{ ...inp, resize: "vertical", minHeight: 110 }}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="궁금한 점, 현재 상황, 진로, 커스터마이즈 요청 등을 자유롭게 적어주세요."
          />
        </div>

        {status === "error" && (
          <div style={{ color: "#E07060", fontSize: 12.5, marginBottom: 14, padding: "10px 14px", border: "1px solid #5A2422", background: "#1E1410" }}>
            ⚠ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          style={{
            width: "100%", padding: "16px 24px",
            background: "var(--gold)", color: "var(--bg-deep)",
            border: "none", fontSize: 13, letterSpacing: ".28em",
            fontWeight: 700, textTransform: "uppercase",
            cursor: status === "sending" ? "wait" : "pointer",
            opacity: status === "sending" ? 0.6 : 1,
          }}
        >
          {status === "sending" ? "전송 중..." : "교육 상담 신청 →"}
        </button>

        <p style={{ marginTop: 18, color: "var(--muted)", fontSize: 11.5, textAlign: "center", letterSpacing: ".05em", lineHeight: 1.85 }}>
          제출된 정보는 상담 응대 목적으로만 사용되며, 외부에 공유되지 않습니다.<br />
          시술 상담은 <a href="/consult" style={{ color: "var(--gold-light)", textDecoration: "underline" }}>여기</a>로 신청해주세요.
        </p>
      </form>
    </main>
  );
}

const pill: React.CSSProperties = {
  fontSize: 11,
  padding: "6px 14px",
  border: "1px solid var(--gold-deep)",
  color: "var(--gold-light)",
  letterSpacing: ".18em",
  fontWeight: 500,
  textTransform: "uppercase",
};
const inp: React.CSSProperties = {
  width: "100%",
  background: "var(--bg-deep)",
  border: "1px solid var(--line)",
  color: "var(--text)",
  padding: "12px 14px",
  fontSize: 14,
  fontFamily: "inherit",
  borderRadius: 2,
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: "block", fontSize: 11, color: "var(--gold)", letterSpacing: ".28em", marginBottom: 8, textTransform: "uppercase", fontWeight: 600 }}>
      {children}
    </label>
  );
}

function Field({ label, v, onChange, placeholder }: { label: string; v: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <input type="text" value={v} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inp} />
    </div>
  );
}
