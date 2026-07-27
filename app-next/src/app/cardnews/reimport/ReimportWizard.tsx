'use client';

/**
 * ReimportWizard · 2026-07-27
 * 패턴 B: 대표님 지시 「기존 카드뉴스 이미지 여러 장 → 재편집·리뉴얼」
 * 이미지 여러 장 (6장 등) 업로드 → hero-portrait 슬라이드로 등록 → 프로젝트 생성 → 편집기
 */

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { STYLE_PRESET_LIST } from '@/lib/cardnews-agents/style-presets';

function fmtSec(sec: number): string {
  if (sec < 0 || !Number.isFinite(sec)) sec = 0;
  const m = Math.floor(sec / 60); const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

interface Uploaded { file: File; preview: string; }

export default function ReimportWizard() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<Uploaded[]>([]);
  const [title, setTitle] = useState('');
  const [stylePreset, setStylePreset] = useState<string>('artbrows-real');
  const [aiCopy, setAiCopy] = useState<boolean>(false);
  const [busy, setBusy] = useState(false);
  const [busyMsg, setBusyMsg] = useState<string>('');
  const [err, setErr] = useState<string | null>(null);
  // 진행 UI 상태 (2026-07-27 대표님 지시 「모래시계·경과·ETA」)
  const [startMs, setStartMs] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);       // 초
  const [etaSec, setEtaSec] = useState<number>(0);
  const [stageIdx, setStageIdx] = useState<number>(0);
  const stages = [
    '📤 이미지 업로드 중…',
    '🔍 각 이미지에서 텍스트 위치·크기·색 detect 중…',
    aiCopy ? '✍️ AI 가 스타일 톤에 맞게 문장 재작성 중…' : '📐 오버레이 좌표 정렬 중…',
    '💾 프로젝트 저장 · 편집기 이동 준비 중…',
  ];

  useEffect(() => {
    if (!busy || !startMs) return;
    const t = setInterval(() => {
      const s = Math.floor((Date.now() - startMs) / 1000);
      setElapsed(s);
      // 진행 단계 시뮬레이션 (전체 ETA 기준 · 4단계 균등 분할)
      if (etaSec > 0) {
        const pct = s / etaSec;
        const nextIdx = Math.min(stages.length - 1, Math.floor(pct * stages.length));
        setStageIdx(nextIdx);
      }
    }, 500);
    return () => clearInterval(t);
  }, [busy, startMs, etaSec, stages.length]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const arr: Uploaded[] = [];
    for (const f of Array.from(list)) {
      if (!f.type.startsWith('image/')) continue;
      arr.push({ file: f, preview: URL.createObjectURL(f) });
    }
    setFiles((prev) => [...prev, ...arr].slice(0, 20));
  };

  const removeAt = (i: number) => setFiles((prev) => prev.filter((_, j) => j !== i));
  const move = (i: number, dir: -1 | 1) => setFiles((prev) => {
    const j = i + dir;
    if (j < 0 || j >= prev.length) return prev;
    const next = [...prev];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  });

  async function submit() {
    if (files.length === 0) return;
    // ETA 추정 · 업로드 5s + OCR n*6s + rewrite n*4s if aiCopy + save 3s
    const eta = 5 + files.length * 6 + (aiCopy ? files.length * 4 : 0) + 3;
    setBusy(true); setErr(null);
    setStartMs(Date.now()); setElapsed(0); setEtaSec(eta); setStageIdx(0);
    setBusyMsg(aiCopy ? `총 ${files.length}장 · AI OCR + 문장 재작성 (예상 ${fmtSec(eta)})` : `총 ${files.length}장 · AI OCR (예상 ${fmtSec(eta)})`);
    try {
      const fd = new FormData();
      files.forEach((u) => fd.append('images', u.file));
      if (title.trim()) fd.append('title', title.trim());
      fd.append('stylePreset', stylePreset);
      if (aiCopy) fd.append('aiCopy', '1');
      const r = await fetch('/api/cardnews/reimport', { method: 'POST', body: fd });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d.error || `HTTP ${r.status}`);
      }
      const d = await r.json();
      // 뷰어로 이동 (편집·검토 시작점 · hover 「✏️ 텍스트」 로 카피 검토 가능)
      router.push(d.viewUrl || `/cardnews/view/${d.projectId}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : '업로드 실패');
      setBusy(false);
      setBusyMsg('');
      setStartMs(null);
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0A0806', color: '#F5EDE3', padding: '32px 20px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <Link href="/cardnews" style={{ fontSize: 12, color: '#C9A66B', textDecoration: 'none', letterSpacing: '0.06em' }}>← 프로젝트 목록</Link>
        </div>
        <div style={{ letterSpacing: '.32em', fontSize: 11, color: '#C9A66B', fontWeight: 800, marginBottom: 6, textTransform: 'uppercase' }}>Pattern B · Reimport</div>
        <h1 style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 34, fontWeight: 500, margin: '0 0 8px', lineHeight: 1.3 }}>기존 카드뉴스 재편집·리뉴얼</h1>
        <p style={{ color: '#8A7B6C', fontSize: 14, lineHeight: 1.65, margin: '0 0 28px', maxWidth: 640 }}>
          이미 만들어놓은 카드뉴스 이미지 여러 장을 업로드하세요. 각 이미지를 슬라이드로 등록해서 라이브러리에 편입하고, <b style={{ color: '#E0C088' }}>편집·리뉴얼</b> 이 가능해집니다.<br/>
          <span style={{ fontSize: 12.5, color: '#6B5A48' }}>텍스트만 수정하려면 뷰어의 「✏️ 텍스트」 · 톤·레이아웃 바꾸려면 편집기 「🎨」</span>
        </p>

        {/* 제목 */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#C9A66B', letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 5 }}>프로젝트 제목 (선택)</div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 극사실소묘 3일 집중 · 8월 15기 (원본 리뉴얼)"
            style={{ width: '100%', background: '#0F0C0A', color: '#F5EDE3', border: '1px solid #3A2E26', borderRadius: 6, padding: '10px 14px', fontFamily: 'inherit', fontSize: 14 }}
          />
        </div>

        {/* 드롭존 */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
          style={{
            border: '2px dashed #A8854E', borderRadius: 14, padding: '40px 24px', textAlign: 'center',
            background: 'rgba(224,192,136,.04)', cursor: 'pointer', marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 8 }}>📥</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#F5EDE3', marginBottom: 4 }}>여기로 카드뉴스 이미지들을 드래그하세요</div>
          <div style={{ fontSize: 12, color: '#8A7B6C' }}>PNG · JPG · WEBP · 최대 20장 · 순서대로 슬라이드로 등록됩니다</div>
          <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />
        </div>

        {/* 미리보기 그리드 */}
        {files.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: '#C9A66B', letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>업로드 예정 {files.length}장 · 순서 조정 가능</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: 12 }}>
              {files.map((u, i) => (
                <div key={i} style={{ background: '#1E1A17', border: '1px solid #3A2E26', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u.preview} alt="" style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }} />
                  <div style={{ padding: '8px 10px', fontSize: 11, color: '#D6C9B8' }}>
                    <b style={{ color: '#E0C088' }}>#{i + 1}</b> · {u.file.name.slice(0, 20)}
                  </div>
                  <div style={{ display: 'flex', gap: 4, padding: '0 8px 8px' }}>
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} style={{ flex: 1, background: '#0F0C0A', color: '#C9A66B', border: '1px solid #3A2E26', borderRadius: 4, padding: '4px', cursor: 'pointer', fontSize: 11 }}>↑</button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === files.length - 1} style={{ flex: 1, background: '#0F0C0A', color: '#C9A66B', border: '1px solid #3A2E26', borderRadius: 4, padding: '4px', cursor: 'pointer', fontSize: 11 }}>↓</button>
                    <button type="button" onClick={() => removeAt(i)} style={{ flex: 1, background: '#0F0C0A', color: '#C86478', border: '1px solid rgba(200,60,60,.4)', borderRadius: 4, padding: '4px', cursor: 'pointer', fontSize: 11 }}>×</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 스타일 선택 + AI 카피 옵션 */}
        <div style={{ marginBottom: 20, padding: 20, background: 'linear-gradient(135deg,#1E1A17,#14100C)', border: '1px solid #3A2E26', borderRadius: 10 }}>
          <div style={{ fontSize: 11, color: '#C9A66B', letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>🎨 스타일 · AI 카피 옵션</div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 260px' }}>
              <label style={{ display: 'block', fontSize: 12, color: '#8A7B6C', marginBottom: 4 }}>적용 스타일</label>
              <select
                value={stylePreset}
                onChange={(e) => setStylePreset(e.target.value)}
                style={{ width: '100%', background: '#0F0C0A', color: '#F5EDE3', border: '1px solid #3A2E26', borderRadius: 6, padding: '10px 12px', fontSize: 13, fontFamily: 'inherit' }}
              >
                {STYLE_PRESET_LIST.filter((p) => !p.isCustom).map((p) => (
                  <option key={p.key} value={p.key}>{p.label} · {p.tag}</option>
                ))}
              </select>
            </div>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', background: aiCopy ? 'rgba(224,192,136,.12)' : 'transparent', border: `1px solid ${aiCopy ? '#E0C088' : '#3A2E26'}`, borderRadius: 6, cursor: 'pointer', maxWidth: 320 }}>
              <input type="checkbox" checked={aiCopy} onChange={(e) => setAiCopy(e.target.checked)} style={{ marginTop: 2, accentColor: '#E0C088' }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: aiCopy ? '#E0C088' : '#F5EDE3' }}>🤖 AI 카피 자동 생성</div>
                <div style={{ fontSize: 11, color: '#8A7B6C', marginTop: 2, lineHeight: 1.4 }}>스타일에 맞게 각 이미지에 AI 가 헤드라인·서브·라벨 제안. 완료 후 뷰어에서 <b>✏️ 텍스트</b> 로 검토·수정 가능.</div>
              </div>
            </label>
          </div>
        </div>

        {err ? (
          <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(200,60,60,.15)', border: '1px solid rgba(200,60,60,.4)', color: '#FFC8C8', borderRadius: 6, fontSize: 13 }}>⚠ {err}</div>
        ) : null}

        {busy && busyMsg ? (
          <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(224,192,136,.1)', border: '1px solid #A8854E', color: '#E0C088', borderRadius: 6, fontSize: 13 }}>⏳ {busyMsg}</div>
        ) : null}

        {/* ── 진행 오버레이 · 모래시계 + 경과 + ETA + 단계 (대표님 지시) ── */}
        {busy ? (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(5,3,2,.88)', backdropFilter: 'blur(6px)',
            zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          }}>
            <div style={{ maxWidth: 520, width: '100%', background: 'linear-gradient(180deg,#1E1A17,#0B0907)', border: '1px solid #A8854E', borderRadius: 16, padding: '36px 32px', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,.5)' }}>
              <div style={{ fontSize: 60, marginBottom: 14, animation: 'rw-flip 2s ease-in-out infinite', display: 'inline-block' }}>⏳</div>
              <div style={{ letterSpacing: '.32em', fontSize: 10.5, color: '#C9A66B', fontWeight: 800, marginBottom: 6, textTransform: 'uppercase' }}>Reimport · AI 리뉴얼 진행 중</div>
              <div style={{ fontFamily: "'Nanum Myeongjo',serif", fontSize: 20, fontWeight: 500, color: '#F5EDE3', marginBottom: 18, lineHeight: 1.4 }}>
                {stages[stageIdx] || stages[0]}
              </div>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 18, fontVariantNumeric: 'tabular-nums' }}>
                <div style={{ padding: '8px 14px', background: '#14100C', border: '1px solid #3A2E26', borderRadius: 8, minWidth: 100 }}>
                  <div style={{ fontSize: 10, color: '#8A7B6C', letterSpacing: '.12em', textTransform: 'uppercase' }}>경과</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#E0C088', fontFamily: 'Inter,sans-serif' }}>{fmtSec(elapsed)}</div>
                </div>
                <div style={{ padding: '8px 14px', background: '#14100C', border: '1px solid #3A2E26', borderRadius: 8, minWidth: 100 }}>
                  <div style={{ fontSize: 10, color: '#8A7B6C', letterSpacing: '.12em', textTransform: 'uppercase' }}>예상 남은</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#E0C088', fontFamily: 'Inter,sans-serif' }}>{fmtSec(Math.max(0, etaSec - elapsed))}</div>
                </div>
                <div style={{ padding: '8px 14px', background: '#14100C', border: '1px solid #3A2E26', borderRadius: 8, minWidth: 100 }}>
                  <div style={{ fontSize: 10, color: '#8A7B6C', letterSpacing: '.12em', textTransform: 'uppercase' }}>총 이미지</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#E0C088', fontFamily: 'Inter,sans-serif' }}>{files.length}장</div>
                </div>
              </div>
              {/* 진행바 · elapsed / eta 기준 */}
              <div style={{ width: '100%', height: 6, background: '#3A2E26', borderRadius: 99, overflow: 'hidden', marginBottom: 12 }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(98, Math.round((elapsed / Math.max(1, etaSec)) * 100))}%`,
                  background: 'linear-gradient(90deg,#B08862,#E0C088)',
                  transition: 'width .4s ease',
                }} />
              </div>
              <div style={{ fontSize: 11.5, color: '#6B5A48', lineHeight: 1.5 }}>
                4단계 · <b style={{ color: '#8A7B6C' }}>{stageIdx + 1}/{stages.length}</b> 진행 중
                <br/>완료되면 자동으로 뷰어로 이동합니다 · 새 문장은 뷰어의 <b style={{ color: '#E0C088' }}>✏️ 텍스트</b> 로 수정
              </div>
            </div>
            <style>{`@keyframes rw-flip { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(180deg); } }`}</style>
          </div>
        ) : null}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Link href="/cardnews" style={{ padding: '12px 22px', background: 'transparent', color: '#8A7B6C', border: '1px solid #3A2E26', borderRadius: 99, textDecoration: 'none', fontWeight: 700, fontSize: 13 }}>취소</Link>
          <button
            onClick={submit}
            disabled={busy || files.length === 0}
            style={{
              padding: '12px 30px',
              background: busy || files.length === 0 ? '#3A2E26' : 'linear-gradient(135deg,#E0C088,#B08862)',
              color: '#0B0907',
              border: 'none',
              borderRadius: 99,
              cursor: busy || files.length === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: '.02em',
              boxShadow: '0 4px 12px rgba(224,192,136,.3)',
            }}
          >
            {busy ? '⏳ 업로드 중…' : `📥 ${files.length}장 재편집·라이브러리 편입`}
          </button>
        </div>
      </div>
    </main>
  );
}
