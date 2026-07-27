import '@/lib/artbrows/tokens.css';
import '../../cardnews.css';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject } from '@/lib/cardnews-storage';
import { LANGS, LANG_LABEL, LANG_FULL, type Lang } from '../../types';
import { shouldShowInstaChrome } from '@/lib/cardnews-agents/style-presets';
import SlidesWithQuickEdit from './SlidesWithQuickEdit';

export const dynamic = 'force-dynamic';

function isLang(v: unknown): v is Lang {
  return typeof v === 'string' && (LANGS as readonly string[]).includes(v);
}

export default async function ViewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const project = await getProject(id);
  if (!project) notFound();

  const requestedLang = isLang(sp.lang) ? sp.lang : project.defaultLang;
  const content = project.translations[requestedLang];
  const hasContent = !!content && content.slides.length > 0;
  const displayTitle = content?.title || project.title;

  return (
    <main className="cardnews-page">
      <div className="cn-wrap">
        <Link href="/cardnews" style={{ fontSize: 11.5, color: 'var(--ab-gold-light)', textDecoration: 'none', letterSpacing: '0.06em' }}>← 프로젝트 목록</Link>
        <div className="cn-title" style={{ marginTop: 10 }}>{displayTitle}</div>
        <div className="cn-subtitle">
          {project.id} · {LANG_FULL[requestedLang]} · 슬라이드 {content?.slides.length ?? 0}개 · {project.status} · 수정 {project.updatedAt?.slice(0, 16).replace('T', ' ')}
        </div>

        {/* 언어 스위처 */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {LANGS.map((l) => {
            const count = project.translations[l]?.slides?.length ?? 0;
            const active = l === requestedLang;
            const disabled = count === 0;
            const style: React.CSSProperties = {
              padding: '7px 14px',
              border: `1px solid ${active ? 'var(--ab-gold)' : 'var(--ab-line)'}`,
              background: active ? 'rgba(201, 166, 107, 0.1)' : 'transparent',
              color: disabled ? 'var(--ab-text-muted)' : active ? 'var(--ab-ivory)' : 'var(--ab-gold-light)',
              fontFamily: 'var(--ab-font-body-latin)',
              fontSize: 12,
              letterSpacing: '0.1em',
              fontWeight: 700,
              borderRadius: 3,
              textDecoration: 'none',
              opacity: disabled ? 0.55 : 1,
            };
            return (
              <Link key={l} href={`/cardnews/view/${project.id}?lang=${l}`} style={style}>
                {LANG_LABEL[l]} · {LANG_FULL[l]} <span style={{ opacity: 0.7, marginLeft: 6, fontSize: 11 }}>{count > 0 ? `${count}장` : '—'}</span>
              </Link>
            );
          })}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <Link href={`/cardnews/edit/${project.id}`} style={{
              padding: '9px 20px',
              background: 'linear-gradient(135deg,#E0C088,#B08862)',
              color: '#0B0907',
              border: 'none',
              borderRadius: 99,
              fontFamily: 'var(--ab-font-body-latin)',
              fontSize: 13,
              letterSpacing: '0.06em',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 3px 10px rgba(224,192,136,.25)',
            }}>🖊 편집 모드로 열기</Link>
          </div>
        </div>

        {hasContent ? (
          <SlidesWithQuickEdit
            projectId={project.id}
            lang={requestedLang}
            slides={content!.slides}
            translations={project.translations as unknown as Record<string, unknown>}
            gridClassName={`cn-grid${shouldShowInstaChrome(project.stylePreset) ? '' : ' no-insta-chrome'}`}
            stylePreset={project.stylePreset}
          />
        ) : (
          <div style={{ padding: '60px 20px', textAlign: 'center', border: '1px dashed var(--ab-line)', borderRadius: 8, color: 'var(--ab-text-muted)', fontSize: 13 }}>
            {LANG_FULL[requestedLang]} 슬라이드가 아직 없어요.<br />
            <Link href={`/cardnews/edit/${project.id}`} style={{ color: 'var(--ab-gold-light)', textDecoration: 'underline', display: 'inline-block', marginTop: 10 }}>
              편집기에서 이 언어 슬라이드 만들기 →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
