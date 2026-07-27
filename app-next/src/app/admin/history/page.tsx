"use client";

import { useEffect, useState } from "react";

// 파일 기반 (모비딕 방식 · Supabase 걷어냄 2026-07-20)
// TODO: admin 인증은 별도 세션/미들웨어로

type EventRow = {
  id: string;
  created_at: string;
  event_type: string;
  page_path: string | null;
  data: Record<string, unknown> | null;
};

const LABELS: Record<string, { icon: string; ko: string; color: string }> = {
  lead_submit: { icon: "📨", ko: "모집 신청 접수", color: "var(--gold)" },
  sms_sent: { icon: "💬", ko: "문자 발송", color: "#7EAB8E" },
  page_view: { icon: "👁", ko: "페이지 방문", color: "var(--muted)" },
  login: { icon: "🔐", ko: "로그인", color: "var(--text-soft)" },
  order_paid: { icon: "💳", ko: "결제 완료", color: "var(--gold-light)" },
  member_signup: { icon: "✨", ko: "회원 가입", color: "var(--gold-light)" },
  default: { icon: "•", ko: "활동", color: "var(--muted)" },
};

export default function HistoryPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/events?months=6&limit=500");
        const data = await res.json();
        if (data.error) setErr(data.error);
        else setEvents((data.items ?? []) as EventRow[]);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "load failed");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const types = Array.from(new Set(events.map((e) => e.event_type))).sort();
  const visible = filter === "all" ? events : events.filter((e) => e.event_type === filter);

  return (
    <main style={{ padding: "100px 22px 80px", maxWidth: 980, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid var(--line)", paddingBottom: 18, marginBottom: 28, gap: 14 }}>
        <h1 className="serif" style={{ fontSize: 28, fontWeight: 300, flex: 1 }}>
          활동 <em style={{ fontStyle: "normal", color: "var(--gold-light)", fontWeight: 800 }}>히스토리</em>
        </h1>
        <a href="/admin" style={{ background: "transparent", border: "1px solid var(--line)", color: "var(--text)", padding: "8px 18px", fontSize: 11, letterSpacing: ".15em", fontWeight: 600, textTransform: "uppercase", textDecoration: "none" }}>
          ← 대시보드
        </a>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        <button onClick={() => setFilter("all")} style={tabBtn(filter === "all")}>전체 ({events.length})</button>
        {types.map((t) => {
          const c = LABELS[t] ?? LABELS.default;
          const count = events.filter((e) => e.event_type === t).length;
          return (
            <button key={t} onClick={() => setFilter(t)} style={tabBtn(filter === t)}>
              {c.icon} {c.ko} ({count})
            </button>
          );
        })}
      </div>

      {loading && <div style={{ color: "var(--muted)" }}>로딩 중...</div>}
      {err && <div style={{ color: "#E07060", padding: "12px 16px", border: "1px solid #5A2422", background: "#1E1410", fontSize: 13, marginBottom: 14 }}>⚠ {err}</div>}

      {!loading && !err && visible.length === 0 && (
        <div style={{ background: "var(--bg-card)", border: "1px dashed var(--line)", padding: 48, textAlign: "center", color: "var(--muted)", fontSize: 14 }}>
          아직 활동 기록이 없습니다.<br />
          <span style={{ fontSize: 12 }}>새 신청·문자 발송·결제 등이 일어나면 자동 기록됩니다.</span>
        </div>
      )}

      <div style={{ position: "relative", paddingLeft: 28 }}>
        <div style={{ position: "absolute", left: 11, top: 8, bottom: 8, width: 1, background: "var(--line)" }} />
        {visible.map((ev) => {
          const c = LABELS[ev.event_type] ?? LABELS.default;
          return (
            <div key={ev.id} style={{ position: "relative", marginBottom: 16 }}>
              <div style={{ position: "absolute", left: -28, top: 12, width: 23, height: 23, borderRadius: "50%", background: "var(--bg-deep)", border: `1px solid ${c.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>
                {c.icon}
              </div>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--line)", padding: "14px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                  <span style={{ color: c.color, fontWeight: 700, fontSize: 13, letterSpacing: ".05em" }}>{c.ko}</span>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>{new Date(ev.created_at).toLocaleString("ko-KR")}</span>
                  {ev.page_path && <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: "var(--muted)", border: "1px solid var(--line)", padding: "2px 8px", borderRadius: 99 }}>{ev.page_path}</span>}
                </div>
                {ev.data && (
                  <pre style={{ fontSize: 12, color: "var(--text-soft)", whiteSpace: "pre-wrap", wordBreak: "break-all", fontFamily: "inherit", lineHeight: 1.8, margin: 0 }}>
                    {Object.entries(ev.data)
                      .filter(([, v]) => v !== null && v !== undefined && v !== "")
                      .slice(0, 6)
                      .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : String(v).slice(0, 120)}`)
                      .join(" · ")}
                  </pre>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

const tabBtn = (active: boolean): React.CSSProperties => ({
  background: active ? "var(--gold)" : "transparent",
  color: active ? "var(--bg-deep)" : "var(--text-soft)",
  border: `1px solid ${active ? "var(--gold)" : "var(--line)"}`,
  padding: "6px 14px",
  fontSize: 11.5,
  letterSpacing: ".05em",
  cursor: "pointer",
  fontWeight: 700,
});
