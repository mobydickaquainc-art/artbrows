"use client";

import { useState } from "react";
import { SlotPicker } from "./SlotPicker";

const TREATMENTS = [
  { key: "hyperreal_brow", label: "극사실 눈썹 (시그니처)", price: "150 - 200만원" },
  { key: "eyeliner", label: "아이라인", price: "상담 시 안내" },
  { key: "lips", label: "입술", price: "상담 시 안내" },
  { key: "combo", label: "패키지 (눈썹 + α)", price: "상담 시 안내" },
  { key: "retouch", label: "리터치 · 수정", price: "상담 시 안내" },
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
  { v: "first", l: "처음 시술받음" },
  { v: "retry", l: "과거 다른 곳에서 받음" },
  { v: "retouch_needed", l: "리터치·수정 목적" },
];

const PREFERRED = [
  { v: "asap", l: "최대한 빨리" },
  { v: "1mo", l: "1개월 이내" },
  { v: "3mo", l: "3개월 이내" },
  { v: "flexible", l: "일정 조율 가능" },
];

export default function ConsultPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    kakao_id: "",
    instagram: "",
    email: "",
    course: "hyperreal_brow",     // treatment key (재사용)
    channel: "instagram",
    experience: "first",
    start_when: "asap",
    message: "",
  });
  const [slot, setSlot] = useState<{ date: string; time: string; kind: 'treatment_consult'; label: string } | null>(null);
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
    if (!slot) {
      setStatus("error");
      setError("먼저 상담 시간을 선택해주세요.");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const treatment = TREATMENTS.find((t) => t.key === form.course);
      const message = [
        form.message,
        `\n— 관심 시술: ${treatment?.label}`,
        `— 시술 경험: ${EXPERIENCE.find((c) => c.v === form.experience)?.l}`,
        `— 희망 일정: ${PREFERRED.find((p) => p.v === form.start_when)?.l}`,
        `— 신청 슬롯: ${slot.date} ${slot.time} · ${slot.label}`,
      ].filter(Boolean).join("\n");

      const params = new URLSearchParams(window.location.search);
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "treatment",
          name: form.name,
          phone: form.phone,
          kakao_id: form.kakao_id || undefined,
          instagram: form.instagram || undefined,
          email: form.email || undefined,
          course: form.course,
          channel: form.channel,
          experience: form.experience,
          message,
          utm_source: params.get("utm_source") || undefined,
          utm_medium: params.get("utm_medium") || undefined,
          utm_campaign: params.get("utm_campaign") || undefined,
          referer: document.referrer || undefined,
          slot: { date: slot.date, time: slot.time, kind: slot.kind },
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
      <main style={{ padding: "120px 22px 80px", maxWidth: 620, margin: "0 auto" }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--gold)", padding: "60px 36px", textAlign: "center" }}>
          <div style={{ fontSize: 56, color: "var(--gold)", marginBottom: 22 }}>✓</div>
          <h2 className="serif" style={{ fontSize: 28, fontWeight: 700, marginBottom: 14, color: "var(--gold-light)" }}>
            시술 상담 신청이 접수되었습니다
          </h2>
          <p style={{ color: "var(--text-soft)", fontSize: 14, lineHeight: 1.95 }}>
            영업일 기준 <b style={{ color: "var(--gold-light)" }}>24시간 내</b> 카카오 채널 또는 휴대전화로 연락드립니다.<br />
            급한 문의는 인스타그램 DM 으로도 가능합니다.
          </p>
          <div style={{ marginTop: 30, padding: "20px 24px", background: "var(--bg-deep)", border: "1px dashed var(--gold-deep)", borderRadius: 2, textAlign: "left", fontSize: 13, color: "var(--text-soft)", lineHeight: 2 }}>
            <b style={{ color: "var(--gold)", letterSpacing: ".15em", fontSize: 11 }}>NEXT STEP</b><br />
            ① 담당자가 신청 내용 검토 · 연락 (24h)<br />
            ② 1:1 화상 또는 방문 사전 상담<br />
            ③ 골상 분석 후 최종 견적 안내<br />
            ④ 시술 예약 확정
          </div>
          <a href="/" style={{ display: "inline-block", marginTop: 30, padding: "14px 32px", border: "1px solid var(--line)", color: "var(--text)", fontSize: 12, letterSpacing: ".2em", fontWeight: 600, textTransform: "uppercase" }}>← 홈으로</a>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: "120px 22px 80px", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ letterSpacing: ".5em", fontSize: 10.5, color: "var(--gold)", fontWeight: 500, textTransform: "uppercase", marginBottom: 18, textAlign: "center" }}>
        BOOKING · CONSULT
      </div>
      <h1 className="serif" style={{ fontSize: 44, fontWeight: 300, lineHeight: 1.25, marginBottom: 12, textAlign: "center", letterSpacing: "-.01em" }}>
        시술 <em style={{ fontStyle: "normal", color: "var(--gold-light)", fontWeight: 800 }}>상담</em>
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 14, textAlign: "center", marginBottom: 14, maxWidth: 540, marginLeft: "auto", marginRight: "auto", lineHeight: 1.85 }}>
        극사실눈썹 창시자 <b style={{ color: "var(--text)" }}>장미지 원장</b>이 직접 시술하는 아틀리에.<br />
        골상 분석 · 시술 전 펜슬 미리 그리기로 완성한 얼굴을 미리 봅니다.
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 40, flexWrap: "wrap" }}>
        <span style={pill}>원장 직접 시술</span>
        <span style={pill}>시술 전 펜슬 미리 그리기</span>
        <span style={pill}>골상 분석 후 확정</span>
        <span style={{ ...pill, background: "var(--gold)", color: "var(--bg-deep)", borderColor: "var(--gold)" }}>150 – 200만원</span>
      </div>

      <form onSubmit={onSubmit} style={{ background: "var(--bg-card)", border: "1px solid var(--line)", padding: 36 }}>
        <div style={{ marginBottom: 24 }}>
          <Label>① 상담 시간 선택 *</Label>
          <SlotPicker
            kind="treatment_consult"
            onSelect={(s) => setSlot(s as typeof slot)}
            selected={slot ? { date: slot.date, time: slot.time } : null}
          />
          {slot && (
            <div style={{ marginTop: 10, padding: "10px 14px", background: "var(--bg-deep)", border: "1px solid var(--gold-deep)", fontSize: 13, color: "var(--gold-light)" }}>
              ✓ 선택됨: {slot.date} {slot.time} · {slot.label}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 14, fontSize: 11, color: "var(--gold)", letterSpacing: ".25em", textTransform: "uppercase", fontWeight: 600 }}>
          ② 연락처
        </div>
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

        <div style={{ marginBottom: 14 }}>
          <Label>관심 시술 *</Label>
          <select style={inp} value={form.course} onChange={(e) => set("course", e.target.value)}>
            {TREATMENTS.map((t) => <option key={t.key} value={t.key}>{t.label} — {t.price}</option>)}
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <Label>시술 경험 *</Label>
            <select style={inp} value={form.experience} onChange={(e) => set("experience", e.target.value)}>
              {EXPERIENCE.map((c) => <option key={c.v} value={c.v}>{c.l}</option>)}
            </select>
          </div>
          <div>
            <Label>알게 된 경로 *</Label>
            <select style={inp} value={form.channel} onChange={(e) => set("channel", e.target.value)}>
              {CHANNELS.map((c) => <option key={c.v} value={c.v}>{c.l}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <Label>희망 일정</Label>
          <select style={inp} value={form.start_when} onChange={(e) => set("start_when", e.target.value)}>
            {PREFERRED.map((p) => <option key={p.v} value={p.v}>{p.l}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 24 }}>
          <Label>문의 · 상황 (선택)</Label>
          <textarea
            style={{ ...inp, resize: "vertical", minHeight: 100 }}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="눈썹 상태·과거 시술 경험·희망 스타일 등 자유롭게 적어주세요."
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
          style={{ width: "100%", padding: "16px 24px", background: "var(--gold)", color: "var(--bg-deep)", border: "none", fontSize: 13, letterSpacing: ".25em", fontWeight: 700, textTransform: "uppercase", cursor: status === "sending" ? "wait" : "pointer", opacity: status === "sending" ? 0.6 : 1 }}
        >
          {status === "sending" ? "전송 중..." : "시술 상담 신청 →"}
        </button>

        <p style={{ marginTop: 18, color: "var(--muted)", fontSize: 11.5, textAlign: "center", letterSpacing: ".05em", lineHeight: 1.8 }}>
          제출된 정보는 상담 응대 목적으로만 사용되며 외부에 공유되지 않습니다.<br />
          수강 문의는 <a href="/enroll" style={{ color: "var(--gold-light)", textDecoration: "underline" }}>모집 페이지</a> 로 가주세요.
        </p>
      </form>
    </main>
  );
}

const pill: React.CSSProperties = {
  fontSize: 11.5,
  padding: "6px 14px",
  border: "1px solid var(--gold-deep)",
  color: "var(--gold-light)",
  letterSpacing: ".1em",
  fontWeight: 600,
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
    <label style={{ display: "block", fontSize: 11, color: "var(--gold)", letterSpacing: ".25em", marginBottom: 8, textTransform: "uppercase", fontWeight: 600 }}>
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
