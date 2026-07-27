'use client';

import { useRef, useState } from 'react';

type Props = {
  value: string;
  onChange: (path: string) => void;
  placeholder?: string;
};

/**
 * 이미지 경로 입력 필드 + 「📁 업로드」 버튼 + 미리보기 썸네일
 * - 클릭 → 로컬 파일 다이얼로그 → POST /api/cardnews/upload → path 자동 입력
 * - 텍스트 필드 직접 편집도 유지 (기존 이미지 경로 재사용 시)
 */
export function ImageInput({ value, onChange, placeholder }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function upload(file: File) {
    setBusy(true); setErr(null); setOk(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await fetch('/api/cardnews/upload', { method: 'POST', body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'upload failed');
      onChange(j.path);
      setOk(`업로드 완료 · ${(j.size / 1024).toFixed(0)} KB`);
      setTimeout(() => setOk(null), 2500);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'upload failed');
    } finally { setBusy(false); }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? '/brand/... (수동 입력 or 업로드 →)'}
          style={{ flex: 1, padding: '10px 12px', background: '#0F0D0B', border: '1px solid var(--ab-line)', color: 'var(--ab-ivory)', fontFamily: 'var(--ab-font-body)', fontSize: 13, borderRadius: 3, boxSizing: 'border-box' }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          title="로컬 파일 선택 → 업로드 → 경로 자동 삽입"
          style={{ padding: '10px 14px', background: 'transparent', color: 'var(--ab-gold-light)', border: '1px solid var(--ab-gold-line)', fontFamily: 'var(--ab-font-body-latin)', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', cursor: 'pointer', borderRadius: 3, whiteSpace: 'nowrap' }}
        >
          {busy ? '⏳ 업로드…' : '📁 업로드'}
        </button>
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            title="경로 지우기"
            style={{ padding: '10px 12px', background: 'transparent', color: '#E8B0B0', border: '1px solid var(--ab-line)', fontSize: 13, cursor: 'pointer', borderRadius: 3 }}
          >
            ×
          </button>
        ) : null}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = '';  // 같은 파일 재선택 가능하도록
        }}
      />

      {err ? (
        <div style={{ marginTop: 6, fontSize: 11, color: '#E8B0B0' }}>⚠ {err}</div>
      ) : ok ? (
        <div style={{ marginTop: 6, fontSize: 11, color: '#A8D8B3' }}>✓ {ok}</div>
      ) : null}

      {value ? (
        <div style={{ marginTop: 8, padding: 6, border: '1px solid var(--ab-line)', borderRadius: 3, display: 'inline-block', background: '#0B0907' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="preview"
            style={{ maxWidth: 200, maxHeight: 140, display: 'block', objectFit: 'cover' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.3'; }}
          />
        </div>
      ) : null}
    </div>
  );
}
