"use client";

/**
 * /kakao-demo — 카카오 채널 챗봇 DB화 실시간 데모 (2026-08-03 회의 시연용)
 *
 * 시나리오:
 *   임원진(대표·회장·원장·본부장)에게 카톡 채널 → 실 API → DB → admin/leads 흐름을
 *   카톡 없이 웹만으로 시연.
 *
 *   4트랙 프리셋 (창업 890 · 이지 69 · 극사실 169 · 시술 문의) 즉시 전송 or 폼 편집 후 전송
 *   → /api/webhook/kakao-channel/skill 실 호출
 *   → 결과 카카오 응답 렌더 + 저장된 리드 ID + admin/leads 딥링크
 */
import { useState } from "react";

type Preset = {
  key: string;
  title: string;
  chip: string;
  color: string;
  bg: string;
  params: Record<string, string>;
};

const PRESETS: Preset[] = [
  {
    key: "startup_890",
    title: "창업반 890 상담",
    chip: "수강 · 890만원",
    color: "#0B0907",
    bg: "#E0C088",
    params: {
      name: "김민서",
      phone: "010-2345-6789",
      track: "academy",
      interest: "startup_890",
      visitTime: "weekday_pm",
      note: "창업 준비 · 상권 상담 원함",
    },
  },
  {
    key: "easy_69",
    title: "이지반 69 상담",
    chip: "수강 · 69만원",
    color: "#0B0907",
    bg: "#FFB78A",
    params: {
      name: "박서연",
      phone: "010-3456-7890",
      track: "academy",
      interest: "easy_69",
      visitTime: "weekend",
      note: "주말반 · 취미 시작",
    },
  },
  {
    key: "hyperreal_169",
    title: "극사실 169 상담",
    chip: "수강 · 169만원",
    color: "#0B0907",
    bg: "#FF8FBB",
    params: {
      name: "이지원",
      phone: "010-4567-8901",
      track: "academy",
      interest: "hyperreal_169",
      visitTime: "weekday_evening",
      note: "재교육 · 극사실 심화 관심",
    },
  },
  {
    key: "brow_procedure",
    title: "눈썹 시술 상담",
    chip: "시술 · 선릉",
    color: "#F5EDE3",
    bg: "#A8E6B3",
    params: {
      name: "최유진",
      phone: "010-5678-9012",
      track: "procedure",
      interest: "brow",
      visitTime: "weekend",
      location: "seonleung",
      note: "털결 극사실 · 시술 가격 문의",
    },
  },
];

type ApiResponse = {
  ok?: boolean;
  version?: string;
  template?: {
    outputs?: Array<{ simpleText?: { text?: string } }>;
    quickReplies?: Array<{ label: string; action?: string; messageText?: string; webLinkUrl?: string }>;
  };
};

export default function KakaoDemoPage() {
  const [form, setForm] = useState<Record<string, string>>(PRESETS[0].params);
  const [selectedKey, setSelectedKey] = useState<string>(PRESETS[0].key);
  const [sending, setSending] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ role: "user" | "bot"; text: string; leadId?: string | null }>>([]);

  const selectPreset = (p: Preset) => {
    setSelectedKey(p.key);
    setForm(p.params);
    setResponse(null);
    setError(null);
    setLeadId(null);
  };

  const send = async () => {
    setSending(true);
    setResponse(null);
    setError(null);
    setLeadId(null);
    // 임원진 시연용 · 실 카톡 유저 ID 대신 demo_ prefix (테스트 필터에 자동 잡힘)
    const demoUserId = `demo_${Date.now()}`;
    const summaryLine = [
      `📋 ${form.track === "procedure" ? "시술" : "수강"} 상담 요청`,
      `이름 ${form.name} · 연락처 ${form.phone}`,
      `관심 ${form.interest} · 방문 ${form.visitTime}`,
      form.location ? `지점 ${form.location}` : null,
      form.note ? `메모: ${form.note}` : null,
    ]
      .filter(Boolean)
      .join(" · ");
    setHistory((h) => [...h, { role: "user", text: summaryLine }]);

    try {
      const body = {
        intent: { name: "상담_접수" },
        userRequest: { user: { id: demoUserId } },
        action: { params: form },
      };
      const r = await fetch("/api/webhook/kakao-channel/skill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = (await r.json()) as ApiResponse;
      setResponse(j);
      const txt = j.template?.outputs?.[0]?.simpleText?.text ?? "(응답 없음)";
      // 저장된 lead ID 는 응답에 직접 안 옴 · admin/leads 최신에서 pull
      try {
        const l = await fetch("/api/leads?limit=1", { cache: "no-store" });
        if (l.ok) {
          const arr = (await l.json()) as Array<{ id: string }>;
          if (arr[0]?.id) setLeadId(arr[0].id);
        }
      } catch {
        /* ignore */
      }
      setHistory((h) => [...h, { role: "bot", text: txt, leadId }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setHistory((h) => [...h, { role: "bot", text: `⚠ 실패: ${msg}` }]);
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setHistory([]);
    setResponse(null);
    setError(null);
    setLeadId(null);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0B0907", color: "#F5EDE3", fontFamily: "Pretendard, sans-serif", padding: "40px 20px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div style={{ display: "inline-block", background: "#161617", color: "#FFB78A", fontWeight: 700, fontSize: 11, letterSpacing: 5, padding: "8px 22px", borderRadius: 24, marginBottom: 16, border: "1px solid #2A2A2A" }}>
            LIVE DEMO · KAKAO CHANNEL DB INTEGRATION · 2026-08-03
          </div>
          <h1 style={{ fontFamily: "'Nanum Myeongjo', serif", fontWeight: 900, fontSize: 40, lineHeight: 1.15, margin: "0 0 12px" }}>
            카카오 채널 <span style={{ color: "#E0C088" }}>DB화 실시간 데모</span>
          </h1>
          <p style={{ color: "#CBC8C1", fontSize: 15, margin: 0 }}>
            챗봇 프리셋 선택 → 실 <code style={{ background: "#161617", color: "#E0C088", padding: "2px 8px", borderRadius: 4 }}>/api/webhook/kakao-channel/skill</code> 호출 → 리드 파일 저장 → admin/leads 즉시 확인
          </p>
        </div>

        {/* 3-col layout */}
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr 320px", gap: 20, alignItems: "start" }}>
          {/* Left: presets + form */}
          <div style={{ background: "#161617", borderRadius: 14, padding: 22, border: "1px solid #2A2A2A" }}>
            <h3 style={{ fontFamily: "'Nanum Myeongjo', serif", color: "#E0C088", fontSize: 17, margin: "0 0 12px" }}>1. 시나리오 선택</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {PRESETS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => selectPreset(p)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: selectedKey === p.key ? `2px solid ${p.bg}` : "1px solid #2A2A2A",
                    background: selectedKey === p.key ? p.bg : "#0B0907",
                    color: selectedKey === p.key ? p.color : "#CBC8C1",
                    fontWeight: 700,
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    fontSize: 13,
                  }}
                >
                  <div style={{ fontFamily: "'Nanum Myeongjo', serif", fontSize: 15 }}>{p.title}</div>
                  <div style={{ fontSize: 11, opacity: 0.8, marginTop: 3 }}>{p.chip}</div>
                </button>
              ))}
            </div>

            <h3 style={{ fontFamily: "'Nanum Myeongjo', serif", color: "#E0C088", fontSize: 17, margin: "16px 0 12px" }}>2. 편집 (선택)</h3>
            {(["name", "phone", "interest", "visitTime", "location", "note"] as const).map((k) => (
              <div key={k} style={{ marginBottom: 8 }}>
                <label style={{ display: "block", fontSize: 10.5, color: "#8A8A84", letterSpacing: 1, marginBottom: 3 }}>{k.toUpperCase()}</label>
                <input
                  value={form[k] ?? ""}
                  onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                  style={{ width: "100%", background: "#0B0907", border: "1px solid #2A2A2A", color: "#F5EDE3", padding: "8px 10px", borderRadius: 6, fontSize: 12.5, fontFamily: "Pretendard, sans-serif" }}
                />
              </div>
            ))}

            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button
                onClick={send}
                disabled={sending || !form.name || !form.phone}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  background: sending ? "#3A3A3A" : "#FFB78A",
                  color: "#0B0907",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: sending ? "wait" : "pointer",
                  letterSpacing: 1,
                }}
              >
                {sending ? "전송 중..." : "▶ 카톡 전송 시뮬"}
              </button>
              <button
                onClick={reset}
                style={{ padding: "12px 14px", background: "transparent", color: "#E0C088", border: "1.5px solid #E0C088", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 12 }}
              >
                초기화
              </button>
            </div>
          </div>

          {/* Center: chat transcript */}
          <div style={{ background: "#0a0908", borderRadius: 14, padding: 20, border: "1px solid #2A2A2A", minHeight: 500, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #2A2A2A" }}>
              <div>
                <div style={{ fontFamily: "'Nanum Myeongjo', serif", color: "#E0C088", fontSize: 15, fontWeight: 700 }}>💬 카카오 채널 채팅 재현</div>
                <div style={{ fontSize: 11, color: "#8A8A84", marginTop: 2, letterSpacing: 1 }}>ARTbrows · 극사실눈썹 · 24시간 응답</div>
              </div>
              <div style={{ fontSize: 10.5, color: "#8A8A84", letterSpacing: 1 }}>DEMO PREVIEW</div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "0 4px" }}>
              {history.length === 0 && (
                <div style={{ color: "#8A8A84", textAlign: "center", padding: "80px 20px", fontStyle: "italic", fontSize: 13 }}>
                  좌측에서 시나리오 선택 후 「카톡 전송 시뮬」 클릭
                </div>
              )}
              {history.map((h, i) => (
                <div key={i} style={{ display: "flex", justifyContent: h.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
                  <div
                    style={{
                      maxWidth: "80%",
                      background: h.role === "user" ? "#FFEB3B" : "#161617",
                      color: h.role === "user" ? "#0B0907" : "#F5EDE3",
                      padding: "12px 16px",
                      borderRadius: h.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                      fontSize: 13,
                      lineHeight: 1.65,
                      whiteSpace: "pre-wrap",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                    }}
                  >
                    {h.role === "user" && <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 4, fontWeight: 700 }}>고객 (시뮬)</div>}
                    {h.role === "bot" && <div style={{ fontSize: 10, color: "#E0C088", marginBottom: 4, fontWeight: 700 }}>ARTbrows 봇</div>}
                    {h.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: result + admin link */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#161617", borderRadius: 14, padding: 20, border: `1px solid ${leadId ? "#A8E6B3" : "#2A2A2A"}` }}>
              <h3 style={{ fontFamily: "'Nanum Myeongjo', serif", color: leadId ? "#A8E6B3" : "#E0C088", fontSize: 16, margin: "0 0 12px" }}>
                {leadId ? "✅ DB 저장 완료" : "3. 처리 결과"}
              </h3>
              {!response && !error && <div style={{ color: "#8A8A84", fontSize: 12.5, fontStyle: "italic" }}>전송 후 여기에 결과 표시</div>}
              {error && (
                <div style={{ color: "#FF4D7E", fontSize: 12.5, background: "#3A1A22", padding: 10, borderRadius: 6 }}>
                  <b>실패</b>: {error}
                </div>
              )}
              {response && (
                <div style={{ fontSize: 12, color: "#CBC8C1", lineHeight: 1.7 }}>
                  <div>
                    응답 버전 <code style={{ background: "#0B0907", color: "#E0C088", padding: "1px 6px", borderRadius: 3 }}>{response.version}</code>
                  </div>
                  {leadId && (
                    <div style={{ marginTop: 8 }}>
                      Lead ID
                      <div style={{ background: "#0B0907", padding: 8, borderRadius: 6, marginTop: 4, fontSize: 10.5, wordBreak: "break-all", fontFamily: "Consolas, monospace", color: "#A8E6B3" }}>{leadId}</div>
                    </div>
                  )}
                  <div style={{ marginTop: 10 }}>
                    QuickReplies: <b style={{ color: "#F5EDE3" }}>{response.template?.quickReplies?.length ?? 0}</b>
                  </div>
                </div>
              )}
            </div>

            <a
              href="/admin/leads"
              target="_blank"
              rel="noopener"
              style={{
                display: "block",
                background: leadId ? "#A8E6B3" : "#2A2A2A",
                color: leadId ? "#0B0907" : "#8A8A84",
                padding: "14px 18px",
                borderRadius: 10,
                textAlign: "center",
                fontWeight: 800,
                textDecoration: "none",
                letterSpacing: 1,
                fontSize: 13,
                pointerEvents: leadId ? "auto" : "none",
                transition: "all 0.2s",
              }}
            >
              📊 admin/leads 에서 확인 →
            </a>

            <div style={{ background: "#161617", borderRadius: 12, padding: 16, border: "1px solid #2A2A2A", fontSize: 11.5, color: "#8A8A84", lineHeight: 1.7 }}>
              <div style={{ color: "#E0C088", fontWeight: 700, marginBottom: 6, fontSize: 12 }}>💡 시연 흐름</div>
              <ol style={{ margin: 0, paddingLeft: 18 }}>
                <li>좌측 4트랙 프리셋 중 하나 선택</li>
                <li>필요 시 이름·전화 등 편집</li>
                <li>「카톡 전송 시뮬」 클릭</li>
                <li>가운데 카톡 대화 재현 확인</li>
                <li>우측 Lead ID 저장 확인</li>
                <li>「admin/leads에서 확인」 → 실시간 반영</li>
              </ol>
              <div style={{ marginTop: 10, fontSize: 10, color: "#FFB78A" }}>
                ⚠ 시연용 <code>demo_</code> prefix 자동 부착 · 실 리드와 분리
              </div>
            </div>
          </div>
        </div>

        {/* Footer meta */}
        <div style={{ marginTop: 30, textAlign: "center", color: "#8A8A84", fontSize: 11, letterSpacing: 1 }}>
          ARTBROWS · 카카오 채널 DB화 시연 v1.0 · 2026-08-03 · 회의 전 데모 · <a href="/" style={{ color: "#E0C088" }}>포털</a> · <a href="/admin/leads" style={{ color: "#E0C088" }}>관리자</a>
        </div>
      </div>
    </main>
  );
}
