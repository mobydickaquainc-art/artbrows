"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

// 회의 시연용 임시 우회 자격증명 (2026-06-22 대표님 요청)
// 정식 운영진 계정 만들기 전까지 한정. 회의 후 제거 예정.
const DEMO_CREDENTIALS: Record<string, string> = {
  admin: "admin",
  guest: "guest",
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");

    // 1) 시연용 자격증명 (admin/admin · guest/guest) 먼저 체크
    const id = email.trim().toLowerCase();
    if (DEMO_CREDENTIALS[id] && DEMO_CREDENTIALS[id] === password) {
      try {
        sessionStorage.setItem("artbrows_admin", id);
      } catch {}
      setStatus("ok");
      setTimeout(() => (window.location.href = "/admin"), 400);
      return;
    }

    // 2) 정식 Supabase Auth (이메일/패스워드)
    if (!supabase) {
      setStatus("error");
      setError("Supabase env not loaded");
      return;
    }
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setStatus("error");
      setError(err.message);
      return;
    }
    setStatus("ok");
    setTimeout(() => (window.location.href = "/admin"), 600);
    void data;
  };

  return (
    <main style={{ padding: "140px 22px 80px", maxWidth: 440, margin: "0 auto" }}>
      <div style={{ letterSpacing: ".5em", fontSize: 10.5, color: "var(--gold)", fontWeight: 500, textTransform: "uppercase", marginBottom: 18, textAlign: "center" }}>
        ADMIN · LOGIN
      </div>
      <h1 className="serif" style={{ fontSize: 36, fontWeight: 300, marginBottom: 28, textAlign: "center" }}>
        관리자 <em style={{ fontStyle: "normal", color: "var(--gold-light)", fontWeight: 800 }}>로그인</em>
      </h1>

      <form onSubmit={onSubmit} style={{ background: "var(--bg-card)", border: "1px solid var(--line)", padding: 32, borderRadius: 2 }}>
        <div style={{ marginBottom: 18 }}>
          <label style={lbl}>이메일 또는 ID</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required style={inp} placeholder="admin 또는 admin@example.com" autoComplete="username" />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={lbl}>비밀번호</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inp} placeholder="••••••••" />
        </div>
        {status === "error" && (
          <div style={{ color: "#E07060", fontSize: 12.5, marginBottom: 14, padding: "9px 12px", border: "1px solid #5A2422", background: "#1E1410", borderRadius: 2 }}>⚠ {error}</div>
        )}
        {status === "ok" && (
          <div style={{ color: "var(--gold-light)", fontSize: 12.5, marginBottom: 14, textAlign: "center" }}>✓ 로그인 완료 — 이동 중...</div>
        )}
        <button type="submit" disabled={status === "sending"} style={{ width: "100%", padding: "14px 24px", background: "var(--gold)", color: "var(--bg-deep)", border: "none", fontSize: 13, letterSpacing: ".2em", fontWeight: 700, textTransform: "uppercase", cursor: status === "sending" ? "wait" : "pointer", opacity: status === "sending" ? 0.6 : 1 }}>
          {status === "sending" ? "확인 중..." : "로그인"}
        </button>
      </form>

      <p style={{ marginTop: 20, color: "var(--muted)", fontSize: 12, textAlign: "center" }}>
        이메일에서 받은 임시 비밀번호 또는 재설정 링크 사용
      </p>
    </main>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: 11, color: "var(--gold)", letterSpacing: ".25em", marginBottom: 8, textTransform: "uppercase", fontWeight: 600 };
const inp: React.CSSProperties = { width: "100%", background: "var(--bg-deep)", border: "1px solid var(--line)", color: "var(--text)", padding: "12px 14px", fontSize: 14, fontFamily: "inherit", borderRadius: 2 };
