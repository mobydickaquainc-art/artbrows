'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { CardnewsProjectSummary, CardnewsProject } from '@/lib/cardnews-storage';
import { LANGS, LANG_LABEL, type Lang } from './types';
import { GenerateModal } from './GenerateModal';

type Status = CardnewsProjectSummary['status'];

const STATUS_LABEL: Record<Status, string> = {
  draft: '작성 중',
  published: '게시',
  archived: '보관',
};

export default function Dashboard() {
  const router = useRouter();
  const [items, setItems] = useState<CardnewsProjectSummary[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [genOpen, setGenOpen] = useState(false);
  const [isProd, setIsProd] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const host = window.location.hostname;
    setIsProd(host !== 'localhost' && host !== '127.0.0.1' && !host.startsWith('192.168.') && !host.endsWith('.local') && !host.endsWith('.trycloudflare.com'));
  }, []);

  async function refresh() {
    try {
      const r = await fetch('/api/cardnews', { cache: 'no-store' });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'failed');
      setItems(j.items ?? []);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'failed');
    }
  }
  useEffect(() => { refresh(); }, []);

  async function onCreate() {
    if (!newTitle.trim()) { setErr('제목을 입력하세요'); return; }
    setBusy(true); setErr(null);
    try {
      const r = await fetch('/api/cardnews', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'failed');
      router.push(`/cardnews/edit/${j.project.id}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'failed');
      setBusy(false);
    }
  }

  async function onArchive(id: string) {
    if (!confirm(`「${id}」 보관 처리?`)) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/cardnews/${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error('failed');
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'failed');
    } finally { setBusy(false); }
  }

  async function onHardDelete(id: string) {
    if (!confirm(`「${id}」 완전 삭제? 되돌릴 수 없음.`)) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/cardnews/${id}?mode=hard`, { method: 'DELETE' });
      if (!r.ok) throw new Error('failed');
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'failed');
    } finally { setBusy(false); }
  }

  async function onDuplicate(id: string) {
    setBusy(true);
    try {
      const r = await fetch(`/api/cardnews/${id}?action=duplicate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      if (!r.ok) throw new Error('failed');
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'failed');
    } finally { setBusy(false); }
  }

  async function onExport(id: string) {
    try {
      const r = await fetch(`/api/cardnews/${id}`, { cache: 'no-store' });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'failed');
      const blob = new Blob([JSON.stringify(j.project, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `cardnews-${id}.json`; a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'failed');
    }
  }

  function onImportClick() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setBusy(true); setErr(null);
      try {
        const text = await file.text();
        const project = JSON.parse(text) as CardnewsProject;
        if (!project.id || !project.title) throw new Error('project.id / project.title 필요');
        const r = await fetch('/api/cardnews', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ project }),
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j?.error || 'import failed');
        await refresh();
      } catch (e) {
        setErr(e instanceof Error ? e.message : 'import failed');
      } finally { setBusy(false); }
    };
    input.click();
  }

  return (
    <main className="cardnews-page">
      <div className="cn-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div>
            <div className="cn-title">카드뉴스 프로젝트</div>
            <div className="cn-subtitle">Project Management · Local JSON</div>
          </div>
          <Link
            href="/cardnews/tutorial"
            style={{ flexShrink: 0, marginTop: 6, padding: '10px 16px', border: '1px solid var(--ab-gold-line)', color: 'var(--ab-gold-light)', textDecoration: 'none', fontFamily: 'var(--ab-font-body-latin)', fontSize: 12, letterSpacing: '0.08em', fontWeight: 700, borderRadius: 4, background: 'transparent', whiteSpace: 'nowrap' }}
            title="카드뉴스 시스템 사용 안내서"
          >
            📖 튜토리얼
          </Link>
        </div>
        <div className="cn-meta">
          원장님 통합 브랜드 가이드 6톤 × 12종 레이아웃 기반. 저장 = <code>app-next/content/cardnews/{'{id}'}.json</code>.
          <br />
          참고: <Link href="/cardnews/layouts" style={{ color: 'var(--ab-gold-light)', textDecoration: 'underline' }}>12종 레이아웃 데모</Link>
        </div>

        {isProd ? (
          <div style={{ margin: '0 0 24px', padding: '14px 18px', background: 'rgba(201, 166, 107, 0.08)', border: '1px solid var(--ab-gold-line)', borderRadius: 6, color: 'var(--ab-ivory)', fontSize: 12.5, lineHeight: 1.7 }}>
            <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 10.5, letterSpacing: '0.2em', color: 'var(--ab-gold)', marginBottom: 6, fontWeight: 700 }}>📌 안내 · 프로덕션 환경</div>
            <div>
              이 화면은 편집·저장·자동 생성 기능이 <b>로컬 개발 서버에서만 작동</b>합니다.
              프로덕션 배포는 07-13 회의 계획대로 <b>연구소 PC + Cloudflare Named Tunnel</b> 로 별도 진행 예정입니다.
              <br />
              지금 여기서는 <b>기존 저장된 프로젝트 목록·미리보기</b> 만 조회 가능하며, 신규 생성·편집·삭제·자동 생성은 아직 사용할 수 없습니다.
            </div>
          </div>
        ) : null}

        {/* 신규·가져오기 */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'stretch', marginBottom: 34, flexWrap: 'wrap' }}>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="새 프로젝트 제목 (예: 15기 이지클래스 모집)"
            onKeyDown={(e) => { if (e.key === 'Enter') onCreate(); }}
            style={{ flex: 1, minWidth: 260, padding: '12px 16px', background: '#161311', border: '1px solid var(--ab-line)', color: 'var(--ab-ivory)', fontFamily: 'var(--ab-font-body)', fontSize: 14, borderRadius: 4 }}
          />
          <button
            onClick={onCreate}
            disabled={busy}
            style={{ padding: '12px 22px', background: 'var(--ab-gold)', color: 'var(--ab-black)', border: 'none', fontFamily: 'var(--ab-font-body-latin)', fontSize: 13, letterSpacing: '0.06em', fontWeight: 700, cursor: 'pointer', borderRadius: 4 }}
          >
            + 새 프로젝트
          </button>
          <button
            onClick={onImportClick}
            disabled={busy}
            style={{ padding: '12px 22px', background: 'transparent', color: 'var(--ab-gold-light)', border: '1px solid var(--ab-gold-line)', fontFamily: 'var(--ab-font-body-latin)', fontSize: 13, letterSpacing: '0.06em', fontWeight: 700, cursor: 'pointer', borderRadius: 4 }}
          >
            ↑ JSON 가져오기
          </button>
          <button
            onClick={() => setGenOpen(true)}
            disabled={busy}
            title="Gemini · OpenAI · Claude 최대 2 모델 병렬로 자동 생성"
            style={{ padding: '12px 22px', background: 'linear-gradient(135deg, var(--ab-gold-deep), var(--ab-gold))', color: 'var(--ab-black)', border: 'none', fontFamily: 'var(--ab-font-body-latin)', fontSize: 13, letterSpacing: '0.06em', fontWeight: 700, cursor: 'pointer', borderRadius: 4 }}
          >
            🪄 자동 생성
          </button>
          <Link
            href="/cardnews/from-images"
            title="패턴 A · 이미지 1장 → AI 분석 → 다양한 스타일로 6장 자동 생성"
            style={{ padding: '12px 22px', background: 'transparent', color: 'var(--ab-gold)', border: '1px dashed var(--ab-gold)', fontFamily: 'var(--ab-font-body-latin)', fontSize: 13, letterSpacing: '0.06em', fontWeight: 700, cursor: 'pointer', borderRadius: 4, textDecoration: 'none' }}
          >
            📸 이미지로 시작 (A · 자동 생성)
          </Link>
          <Link
            href="/cardnews/reimport"
            title="패턴 B · 이미 만든 카드뉴스 이미지 여러 장 → 라이브러리 편입 · 편집·리뉴얼 (2026-07-27 신설)"
            style={{ padding: '12px 22px', background: 'transparent', color: 'var(--ab-gold)', border: '1px dashed var(--ab-gold)', fontFamily: 'var(--ab-font-body-latin)', fontSize: 13, letterSpacing: '0.06em', fontWeight: 700, cursor: 'pointer', borderRadius: 4, textDecoration: 'none' }}
          >
            🔄 기존 카드뉴스 재편집 (B)
          </Link>
        </div>
        <GenerateModal open={genOpen} onClose={() => setGenOpen(false)} onDone={() => { setGenOpen(false); refresh(); }} />

        {err ? (
          <div style={{ marginBottom: 20, padding: '10px 14px', background: 'rgba(122, 53, 56, 0.15)', border: '1px solid rgba(122, 53, 56, 0.4)', color: '#F5EEE0', fontSize: 12.5, borderRadius: 4 }}>
            ⚠ {err}
          </div>
        ) : null}

        {items === null ? (
          <div style={{ color: 'var(--ab-text-muted)', padding: '40px 0' }}>불러오는 중…</div>
        ) : items.length === 0 ? (
          <div style={{ color: 'var(--ab-text-muted)', padding: '60px 0', textAlign: 'center', border: '1px dashed var(--ab-line)', borderRadius: 8 }}>
            아직 저장된 프로젝트가 없어요.<br />위에서 「새 프로젝트」로 시작하거나 JSON 을 가져오세요.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--ab-ivory)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--ab-gold-line)', textAlign: 'left', color: 'var(--ab-gold)', fontFamily: 'var(--ab-font-body-latin)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 8px' }}>제목 / ID</th>
                <th style={{ padding: '12px 8px' }}>상태</th>
                <th style={{ padding: '12px 8px' }}>언어</th>
                <th style={{ padding: '12px 8px' }}>수정일</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>작업</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} style={{ borderBottom: '1px solid var(--ab-line-soft)', opacity: it.status === 'archived' ? 0.55 : 1 }}>
                  <td style={{ padding: '14px 8px' }}>
                    <div style={{ fontFamily: 'var(--ab-font-headline)', fontWeight: 700, fontSize: 15 }}>{it.title}</div>
                    <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 10.5, color: 'var(--ab-text-muted)', marginTop: 2, letterSpacing: '0.05em' }}>{it.id}</div>
                  </td>
                  <td style={{ padding: '14px 8px', fontSize: 12 }}>
                    <span style={{ padding: '3px 10px', borderRadius: 10, border: '1px solid var(--ab-gold-line)', color: 'var(--ab-gold)', fontSize: 10.5, letterSpacing: '0.1em' }}>
                      {STATUS_LABEL[it.status] ?? it.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 8px' }}>
                    <div style={{ display: 'inline-flex', gap: 4 }}>
                      {LANGS.map((l) => {
                        const count = it.langs?.[l] ?? 0;
                        const has = count > 0;
                        const isDefault = it.defaultLang === l;
                        return (
                          <span
                            key={l}
                            title={`${LANG_LABEL[l]}: ${count}장${isDefault ? ' · 기본' : ''}`}
                            style={{
                              padding: '2px 8px',
                              borderRadius: 10,
                              fontSize: 10.5,
                              letterSpacing: '0.1em',
                              fontFamily: 'var(--ab-font-body-latin)',
                              fontWeight: 700,
                              border: `1px solid ${isDefault ? 'var(--ab-gold)' : has ? 'var(--ab-gold-line)' : 'var(--ab-line)'}`,
                              color: has ? 'var(--ab-gold-light)' : 'var(--ab-text-muted)',
                              background: isDefault ? 'rgba(201, 166, 107, 0.08)' : 'transparent',
                              opacity: has ? 1 : 0.55,
                            }}
                          >
                            {LANG_LABEL[l]}
                            <span style={{ opacity: 0.7, marginLeft: 4, fontWeight: 400 }}>{has ? count : '—'}</span>
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td style={{ padding: '14px 8px', color: 'var(--ab-text-muted)', fontFamily: 'var(--ab-font-body-latin)', fontSize: 11.5 }}>
                    {it.updatedAt?.slice(0, 16).replace('T', ' ')}
                  </td>
                  <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <Link href={`/cardnews/edit/${it.id}`} style={btnStyle('primary')}>편집</Link>
                      <Link href={`/cardnews/view/${it.id}`} style={btnStyle('ghost')}>미리보기</Link>
                      <button onClick={() => onExport(it.id)} style={btnStyle('ghost')}>내보내기</button>
                      <button onClick={() => onDuplicate(it.id)} disabled={busy} style={btnStyle('ghost')}>복제</button>
                      {it.status === 'archived' ? (
                        <button onClick={() => onHardDelete(it.id)} disabled={busy} style={btnStyle('danger')}>완전삭제</button>
                      ) : (
                        <>
                          <button onClick={() => onArchive(it.id)} disabled={busy} style={btnStyle('ghost')}>보관</button>
                          <button onClick={() => onHardDelete(it.id)} disabled={busy} style={btnStyle('danger')} title="파일 완전 삭제 · 되돌릴 수 없음">🗑 삭제</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

function btnStyle(kind: 'primary' | 'ghost' | 'danger'): React.CSSProperties {
  const base: React.CSSProperties = {
    padding: '6px 12px',
    fontSize: 11.5,
    fontFamily: 'var(--ab-font-body-latin)',
    letterSpacing: '0.05em',
    fontWeight: 700,
    borderRadius: 3,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    border: '1px solid var(--ab-gold-line)',
  };
  if (kind === 'primary') return { ...base, background: 'var(--ab-gold)', color: 'var(--ab-black)', border: 'none' };
  if (kind === 'danger') return { ...base, color: '#E8B0B0', borderColor: 'rgba(232,120,120,0.4)', background: 'transparent' };
  return { ...base, color: 'var(--ab-gold-light)', background: 'transparent' };
}
