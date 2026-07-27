"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", kakao_id: "", message: "", channel: "instagram" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      setStatus("error");
      setError("이름과 연락처는 필수입니다.");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "전송 실패");
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "전송 실패");
    }
  };

  return (
    <main style={{ padding: "120px 22px 80px", maxWidth: 640, margin: "0 auto" }}>
      <div className="eyebrow" style={{ letterSpacing: ".5em", fontSize: 10.5, color: "var(--gold)", fontWeight: 500, textTransform: "uppercase", marginBottom: 18, textAlign: "center" }}>
        CONSULTATION
      </div>
      <h1 className="serif" style={{ fontSize: 42, fontWeight: 300, lineHeight: 1.25, marginBottom: 14, textAlign: "center", letterSpacing: "-.01em" }}>
        상담 <em style={{ fontStyle: "normal", color: "var(--gold-light)", fontWeight: 800 }}>신청</em>
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 14, textAlign: "center", marginBottom: 48, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
        같은 기수에 소수만. 무게 있는 시작을 원하시면 아래 정보 남겨주세요. 영업일 기준 24시간 내 연락드립니다.
      </p>

      {status === "ok" ? (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--gold)", padding: "48px 32px", textAlign: "center", borderRadius: 2 }}>
          <div style={{ fontSize: 48, color: "var(--gold)", marginBottom: 18 }}>✓</div>
          <h2 className="serif" style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: "var(--gold-light)" }}>상담 신청이 접수되었습니다</h2>
          <p style={{ color: "var(--text-soft)", fontSize: 13.5, lineHeight: 1.85 }}>
            영업일 기준 24시간 내 카카오 채널 또는 휴대전화로 연락드립니다.<br />
            급한 문의는 인스타그램 DM 으로도 가능합니다.
          </p>
          <a href="/" style={{ display: "inline-block", marginTop: 24, padding: "12px 28px", border: "1px solid var(--line)", color: "var(--text)", fontSize: 12, letterSpacing: ".15em", fontWeight: 600 }}>← 홈으로</a>
        </div>
      ) : (
        <form onSubmit={onSubmit} style={{ background: "var(--bg-card)", border: "1px solid var(--line)", padding: 36, borderRadius: 2 }}>
          <Field label="성함 *" name="name" value={form.name} onChange={onChange} placeholder="홍길동" />
          <Field label="휴대전화 *" name="phone" value={form.phone} onChange={onChange} placeholder="010-0000-0000" />
          <Field label="카카오 ID (선택)" name="kakao_id" value={form.kakao_id} onChange={onChange} placeholder="@yourID" />

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 11, color: "var(--gold)", letterSpacing: ".25em", marginBottom: 8, textTransform: "uppercase", fontWeight: 600 }}>유입 채널</label>
            <select name="channel" value={form.channel} onChange={onChange} style={inputStyle}>
              <option value="instagram">인스타그램</option>
              <option value="youtube">유튜브</option>
              <option value="naver">네이버</option>
              <option value="kakao">카카오</option>
              <option value="wechat">위챗</option>
              <option value="direct">직접 입력 / 지인 추천</option>
            </select>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: 11, color: "var(--gold)", letterSpacing: ".25em", marginBottom: 8, textTransform: "uppercase", fontWeight: 600 }}>문의 사항 (선택)</label>
            <textarea name="message" value={form.message} onChange={onChange} rows={4} style={{ ...inputStyle, resize: "vertical" }} placeholder="궁금한 점이나 일정·수강 가능 여부 등을 자유롭게 적어주세요." />
          </div>

          {status === "error" && (
            <div style={{ color: "#E07060", fontSize: 12.5, marginBottom: 16, padding: "10px 14px", border: "1px solid #5A2422", background: "#1E1410", borderRadius: 2 }}>
              ⚠ {error}
            </div>
          )}

          <button type="submit" disabled={status === "sending"}
            style={{ width: "100%", padding: "16px 24px", background: "var(--gold)", color: "var(--bg-deep)", border: "none", fontSize: 13, letterSpacing: ".2em", fontWeight: 700, textTransform: "uppercase", cursor: status === "sending" ? "wait" : "pointer", opacity: status === "sending" ? 0.6 : 1 }}>
            {status === "sending" ? "전송 중..." : "상담 신청 보내기 →"}
          </button>

          <p style={{ marginTop: 18, color: "var(--muted)", fontSize: 11.5, textAlign: "center", letterSpacing: ".05em" }}>
            제출된 정보는 상담 응대 목적으로만 사용되며, 외부에 공유되지 않습니다.
          </p>
        </form>
      )}
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--bg-deep)",
  border: "1px solid var(--line)",
  color: "var(--text)",
  padding: "12px 14px",
  fontSize: 14,
  fontFamily: "inherit",
  borderRadius: 2,
};

function Field(props: { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 11, color: "var(--gold)", letterSpacing: ".25em", marginBottom: 8, textTransform: "uppercase", fontWeight: 600 }}>{props.label}</label>
      <input type="text" name={props.name} value={props.value} onChange={props.onChange} placeholder={props.placeholder} style={inputStyle} />
    </div>
  );
}
