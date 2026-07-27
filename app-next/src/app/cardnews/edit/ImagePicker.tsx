'use client';

import { useMemo, useRef, useState } from 'react';
import {
  FOUNDER_IMAGE_POOL,
  PORTRAIT_IMAGE_POOL,
  PRODUCT_IMAGE_POOL,
} from '@/lib/cardnews-agents/agents';

type Props = {
  value: string;
  onChange: (path: string) => void;
  label?: string;
};

type PoolKey = 'all' | 'founder' | 'portrait' | 'product';

const POOL_LABEL: Record<PoolKey, string> = {
  all:      '전체',
  founder:  '원장·아틀리에',
  portrait: '인물·시술',
  product:  '매크로·클로즈업',
};

/**
 * SimpleEditor 전용 이미지 선택기.
 * - 자산 갤러리 (SAFE POOL) 썸네일 그리드에서 클릭 교체
 * - 파일 업로드 (드래그 or 클릭) → 자동 경로 삽입
 * - 텍스트 경로 편집은 「고급」 접힘 안에 숨김
 */
type ReimaginePreset = 'anonymize' | 'silhouette' | 'back-view' | 'illustration' | 'artistic' | 'custom';
const PRESET_META: { key: ReimaginePreset; label: string; desc: string; icon: string }[] = [
  { key: 'anonymize',    label: '얼굴 익명화',   desc: '수강생·손님 얼굴을 다른 사람으로 · 톤·구도·의상 유지', icon: '👤' },
  { key: 'silhouette',   label: '실루엣',       desc: '어두운 실루엣 + 골드 rim light · 얼굴 완전 숨김',     icon: '🖤' },
  { key: 'back-view',    label: '뒷모습',       desc: '뒤로 돌아선 각도 재구성 · 머리·의상만 노출',        icon: '↩️' },
  { key: 'illustration', label: '일러스트',     desc: '실사 → 미니멀 편집 일러스트 톤 (신원 완전 숨김)',    icon: '✏️' },
  { key: 'artistic',     label: '아트 리터치', desc: '신원 유지 · Maison Noir 톤·색감 향상 (얼굴 X)',      icon: '✨' },
  { key: 'custom',       label: '직접 서술',    desc: '자유 프롬프트 입력 (영어 권장)',                    icon: '📝' },
];

export function ImagePicker({ value, onChange, label }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pool, setPool] = useState<PoolKey>('all');
  const [advanced, setAdvanced] = useState(false);
  const [reimagineOpen, setReimagineOpen] = useState(false);
  const [reimagineBusy, setReimagineBusy] = useState<ReimaginePreset | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');

  const gallery = useMemo(() => {
    const uniq = (arr: string[]) => Array.from(new Set(arr));
    switch (pool) {
      case 'founder':  return uniq(FOUNDER_IMAGE_POOL);
      case 'portrait': return uniq(PORTRAIT_IMAGE_POOL);
      case 'product':  return uniq(PRODUCT_IMAGE_POOL);
      case 'all':
      default:         return uniq([...FOUNDER_IMAGE_POOL, ...PORTRAIT_IMAGE_POOL, ...PRODUCT_IMAGE_POOL]);
    }
  }, [pool]);

  async function upload(file: File) {
    setBusy(true); setErr(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await fetch('/api/cardnews/upload', { method: 'POST', body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'upload failed');
      onChange(j.path);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'upload failed');
    } finally { setBusy(false); }
  }

  async function reimagine(preset: ReimaginePreset) {
    if (!value) { setErr('먼저 이미지를 선택하거나 업로드해주세요.'); return; }
    if (preset === 'custom' && customPrompt.trim().length < 10) {
      setErr('프롬프트를 10자 이상 입력하세요.'); return;
    }
    setReimagineBusy(preset); setErr(null);
    try {
      const r = await fetch('/api/cardnews/reimagine-image', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalPath: value, preset, customPrompt: preset === 'custom' ? customPrompt : undefined }),
      });
      const text = await r.text();
      const ct = r.headers.get('content-type') || '';
      if (!ct.includes('json')) throw new Error(`서버 응답 이상 (${r.status}) · 잠시 후 다시 시도`);
      const j = JSON.parse(text);
      if (!r.ok || !j.ok) throw new Error(j?.error || 'AI 재가공 실패');
      onChange(j.path);
      setReimagineOpen(false);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'reimagine failed');
    } finally { setReimagineBusy(null); }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {label ? (
        <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 11, letterSpacing: '0.2em', color: 'var(--ab-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
          {label}
        </div>
      ) : null}

      {/* 현재 선택 미리보기 + 업로드 · 초기화 */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{
          width: 120, height: 150,
          background: '#0B0907', border: '1px solid var(--ab-line)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', flexShrink: 0, borderRadius: 3,
        }}>
          {value ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={value} alt="선택된 이미지" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.3'; }} />
          ) : (
            <div style={{ fontSize: 11, color: 'var(--ab-text-muted)', textAlign: 'center', padding: 12, lineHeight: 1.5 }}>
              이미지<br />없음
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          <button type="button" onClick={() => fileRef.current?.click()} disabled={busy}
            style={{ padding: '10px 14px', background: 'transparent', color: 'var(--ab-gold-light)', border: '1px solid var(--ab-gold-line)', fontFamily: 'var(--ab-font-body-latin)', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', cursor: 'pointer', borderRadius: 3 }}>
            {busy ? '⏳ 업로드…' : '📁 새 이미지 업로드'}
          </button>
          {value ? (
            <>
              <button type="button" onClick={() => setReimagineOpen(!reimagineOpen)}
                title="Gemini 3.0+ 이미지 편집으로 얼굴 익명화·실루엣·아트 리터치"
                style={{ padding: '8px 12px', background: 'transparent', color: 'var(--ab-gold)', borderWidth: 1, borderStyle: 'dashed', borderColor: 'var(--ab-gold-line)', fontSize: 11, cursor: 'pointer', borderRadius: 3, fontFamily: 'var(--ab-font-body-latin)', fontWeight: 700, letterSpacing: '0.05em' }}>
                🎨 AI 재가공 (얼굴 익명화)
              </button>
              <button type="button" onClick={() => onChange('')}
                style={{ padding: '8px 12px', background: 'transparent', color: '#E8B0B0', border: '1px solid var(--ab-line)', fontSize: 11, cursor: 'pointer', borderRadius: 3 }}>
                × 이미지 지우기
              </button>
            </>
          ) : null}
          {err ? <div style={{ fontSize: 11, color: '#E8B0B0' }}>⚠ {err}</div> : null}
        </div>
      </div>

      {/* 재가공 패널 (접힘) · 2026-07-21 · 대표님 요구 */}
      {reimagineOpen && value ? (
        <div style={{ marginTop: 12, padding: 14, background: '#0B0907', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--ab-gold-line)', borderRadius: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 11, letterSpacing: '0.2em', color: 'var(--ab-gold)', textTransform: 'uppercase', fontWeight: 700 }}>
              🎨 AI 재가공 · Gemini 3.0+
            </div>
            <button type="button" onClick={() => setReimagineOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--ab-text-muted)', cursor: 'pointer', fontSize: 12 }}>× 닫기</button>
          </div>
          <div style={{ fontSize: 11, color: 'var(--ab-text-muted)', marginBottom: 12, lineHeight: 1.6 }}>
            수강생·손님 얼굴 노출 방지 · 원본은 보존되고 새 이미지가 저장됩니다.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
            {PRESET_META.map((p) => {
              const isBusy = reimagineBusy === p.key;
              const anyBusy = reimagineBusy !== null;
              return (
                <button key={p.key} type="button"
                  onClick={() => reimagine(p.key)}
                  disabled={anyBusy}
                  style={{
                    padding: 10, textAlign: 'left',
                    background: isBusy ? 'rgba(201, 166, 107, 0.1)' : 'transparent',
                    borderWidth: 1, borderStyle: 'solid',
                    borderColor: isBusy ? 'var(--ab-gold)' : 'var(--ab-line)',
                    color: 'var(--ab-ivory)',
                    cursor: anyBusy ? 'wait' : 'pointer',
                    opacity: anyBusy && !isBusy ? 0.4 : 1,
                    borderRadius: 3, fontFamily: 'inherit',
                  }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 16 }}>{p.icon}</span>
                    <b style={{ fontSize: 12 }}>{p.label}</b>
                    {isBusy ? <span className="ab-spin" style={{ marginLeft: 'auto', fontSize: 14 }}>⏳</span> : null}
                  </div>
                  <div style={{ fontSize: 10.5, color: 'var(--ab-text-muted)', lineHeight: 1.5 }}>{p.desc}</div>
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 10.5, color: 'var(--ab-gold)', letterSpacing: '0.15em', fontFamily: 'var(--ab-font-body-latin)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
              직접 프롬프트 (선택)
            </div>
            <input value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="영어 권장 · 예: Replace face with different Korean woman, keep Maison Noir tone"
              style={{ width: '100%', padding: '8px 10px', background: '#0F0D0B', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--ab-line)', color: 'var(--ab-ivory)', fontFamily: 'var(--ab-font-body)', fontSize: 12, borderRadius: 3, boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginTop: 10, fontSize: 10, color: 'var(--ab-text-muted)', lineHeight: 1.6 }}>
            소요 ~10~30초 · 결과는 <code style={{ background: '#1A1512', padding: '1px 6px', borderRadius: 2 }}>/brand/uploads/reimagined/</code> 에 저장 · 실패 시 다시 시도
          </div>
        </div>
      ) : null}

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ''; }}
      />

      {/* 자산 갤러리 (SAFE POOL) */}
      <div style={{ marginTop: 4 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
          {(Object.keys(POOL_LABEL) as PoolKey[]).map((k) => (
            <button key={k} type="button" onClick={() => setPool(k)}
              style={{
                padding: '5px 12px',
                background: k === pool ? 'var(--ab-gold)' : 'transparent',
                color: k === pool ? 'var(--ab-black)' : 'var(--ab-text-soft)',
                border: `1px solid ${k === pool ? 'var(--ab-gold)' : 'var(--ab-line)'}`,
                fontSize: 11, fontFamily: 'var(--ab-font-body-latin)', letterSpacing: '0.08em',
                cursor: 'pointer', borderRadius: 3, fontWeight: k === pool ? 700 : 400,
              }}>
              {POOL_LABEL[k]}
            </button>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
          gap: 6,
          maxHeight: 240,
          overflowY: 'auto',
          padding: 8,
          background: '#0B0907',
          border: '1px solid var(--ab-line)',
          borderRadius: 3,
        }}>
          {gallery.map((src) => {
            const selected = src === value;
            return (
              <button
                key={src}
                type="button"
                onClick={() => onChange(src)}
                title={src.split('/').pop()}
                style={{
                  padding: 0,
                  border: `2px solid ${selected ? 'var(--ab-gold)' : 'transparent'}`,
                  background: '#000',
                  cursor: 'pointer',
                  aspectRatio: '4/5',
                  overflow: 'hidden',
                  position: 'relative',
                  borderRadius: 2,
                }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2'; }} />
                {selected ? (
                  <div style={{ position: 'absolute', top: 2, right: 2, background: 'var(--ab-gold)', color: 'var(--ab-black)', fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 2 }}>
                    ●
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* 고급 · 경로 직접 편집 */}
      <details style={{ marginTop: 4 }} open={advanced} onToggle={(e) => setAdvanced((e.target as HTMLDetailsElement).open)}>
        <summary style={{ cursor: 'pointer', fontSize: 11, color: 'var(--ab-text-muted)', fontFamily: 'var(--ab-font-body-latin)', letterSpacing: '0.1em' }}>
          ▽ 고급 · 경로 직접 편집
        </summary>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/brand/... (경로 수동 입력)"
          style={{
            marginTop: 6, width: '100%', padding: '8px 10px',
            background: '#0F0D0B', border: '1px solid var(--ab-line)',
            color: 'var(--ab-ivory)', fontFamily: 'monospace', fontSize: 11,
            borderRadius: 3, boxSizing: 'border-box',
          }}
        />
      </details>
    </div>
  );
}
