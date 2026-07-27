import Link from 'next/link';
import { listRecentVisits, listConsults } from '@/lib/admin/storage';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const STATUS_LABEL: Record<string, string> = {
  new: '신규',
  contacted: '연락함',
  booked: '예약',
  done: '완료',
  canceled: '취소',
};

const UA_LABEL: Record<string, string> = {
  mobile: '📱 모바일',
  desktop: '💻 데스크톱',
  tablet: '🔲 태블릿',
  bot: '🤖 봇',
  unknown: '?',
};

export default async function AdminHome() {
  const [days, consults] = await Promise.all([listRecentVisits(30), listConsults()]);
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const todayVisits = days.find((d) => d.date === today)?.total ?? 0;
  const yesterdayVisits = days.find((d) => d.date === yesterday)?.total ?? 0;
  const totalVisits = days.reduce((s, d) => s + d.total, 0);

  const byPath: Record<string, number> = {};
  const byLang: Record<string, number> = {};
  const byUa: Record<string, number> = {};
  for (const d of days) {
    for (const [k, v] of Object.entries(d.byPath)) byPath[k] = (byPath[k] ?? 0) + v;
    for (const [k, v] of Object.entries(d.byLang)) byLang[k] = (byLang[k] ?? 0) + v;
    for (const [k, v] of Object.entries(d.byUa)) byUa[k] = (byUa[k] ?? 0) + v;
  }
  const topPaths = Object.entries(byPath).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const consultCounts = consults.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = (acc[c.status] ?? 0) + 1;
    return acc;
  }, {});
  const newConsults = consults.filter((c) => c.status === 'new').length;

  // 30 일 차트 (SVG)
  const maxVal = Math.max(1, ...days.map((d) => d.total));
  const chartH = 90;

  return (
    <div style={{ padding: 32, maxWidth: 1400, margin: '0 auto' }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 28, color: 'var(--ab-gold)', margin: 0 }}>📊 운영자 대시보드</h1>
        <p style={{ fontSize: 13, color: 'var(--ab-ivory-mute)', marginTop: 6 }}>
          최근 30일 · {new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })} 현재
        </p>
      </header>

      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14, marginBottom: 32 }}>
        <Kpi label="오늘 방문" value={todayVisits} sub={`어제 ${yesterdayVisits}`} accent />
        <Kpi label="30일 방문" value={totalVisits} sub="누적" />
        <Kpi label="신규 상담" value={newConsults} sub="미처리" accent={newConsults > 0} />
        <Kpi label="총 상담" value={consults.length} sub="전체 접수" />
      </div>

      {/* 30일 방문 차트 */}
      <div style={card}>
        <h3 style={cardH}>일별 방문수 (30일)</h3>
        {days.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--ab-ivory-mute)', fontSize: 13 }}>
            아직 방문 데이터가 없습니다. 홈페이지에 접속하면 자동으로 기록됩니다.
          </div>
        ) : (
          <svg viewBox={`0 0 ${days.length * 20 + 20} ${chartH + 30}`} style={{ width: '100%', height: chartH + 30 }}>
            {days.map((d, i) => {
              const h = (d.total / maxVal) * chartH;
              return (
                <g key={d.date}>
                  <rect x={i * 20 + 10} y={chartH - h + 10} width={16} height={h} fill="var(--ab-gold)" opacity={d.date === today ? 1 : 0.5} rx={2} />
                  <title>{d.date} · {d.total}</title>
                  {i % 5 === 0 && (
                    <text x={i * 20 + 18} y={chartH + 24} fontSize={9} fill="var(--ab-ivory-mute)" textAnchor="middle">{d.date.slice(5)}</text>
                  )}
                </g>
              );
            })}
          </svg>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        {/* 인기 페이지 */}
        <div style={card}>
          <h3 style={cardH}>인기 페이지 (30일)</h3>
          {topPaths.length === 0 ? (
            <Empty />
          ) : (
            <ul style={list}>
              {topPaths.map(([path, cnt]) => {
                const pct = totalVisits > 0 ? Math.round((cnt / totalVisits) * 100) : 0;
                return (
                  <li key={path} style={li}>
                    <div style={{ flex: 1, fontSize: 13, fontFamily: 'monospace', color: 'var(--ab-ivory)' }}>{path}</div>
                    <div style={{ width: 100, height: 6, background: '#1A1614', borderRadius: 3, overflow: 'hidden', marginRight: 10 }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'var(--ab-gold)' }} />
                    </div>
                    <div style={{ width: 40, textAlign: 'right', fontSize: 12, color: 'var(--ab-gold-light)', fontWeight: 600 }}>{cnt}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* 언어/기기 */}
        <div style={card}>
          <h3 style={cardH}>언어 · 기기</h3>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--ab-ivory-mute)', marginBottom: 6 }}>언어</div>
            {Object.keys(byLang).length === 0 ? <Empty /> : (
              <ul style={list}>
                {Object.entries(byLang).sort((a, b) => b[1] - a[1]).map(([lang, cnt]) => (
                  <li key={lang} style={li}>
                    <div style={{ flex: 1, fontSize: 13 }}>{lang === 'ko' ? '🇰🇷 한국어' : lang === 'en' ? '🇬🇧 English' : lang === 'zh' ? '🇨🇳 中文' : lang}</div>
                    <div style={{ fontSize: 12, color: 'var(--ab-gold-light)', fontWeight: 600 }}>{cnt}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ab-ivory-mute)', marginBottom: 6 }}>기기</div>
            {Object.keys(byUa).length === 0 ? <Empty /> : (
              <ul style={list}>
                {Object.entries(byUa).sort((a, b) => b[1] - a[1]).map(([ua, cnt]) => (
                  <li key={ua} style={li}>
                    <div style={{ flex: 1, fontSize: 13 }}>{UA_LABEL[ua] ?? ua}</div>
                    <div style={{ fontSize: 12, color: 'var(--ab-gold-light)', fontWeight: 600 }}>{cnt}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* 상담 상태 + 최근 5건 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginTop: 16 }}>
        <div style={card}>
          <h3 style={cardH}>상담 상태</h3>
          {consults.length === 0 ? <Empty /> : (
            <ul style={list}>
              {['new', 'contacted', 'booked', 'done', 'canceled'].map((s) => (
                <li key={s} style={li}>
                  <div style={{ flex: 1, fontSize: 13 }}>{STATUS_LABEL[s]}</div>
                  <div style={{ fontSize: 14, color: 'var(--ab-gold)', fontWeight: 700 }}>{consultCounts[s] ?? 0}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ ...cardH, margin: 0 }}>최근 상담 5건</h3>
            <Link href="/admin/consult" style={{ fontSize: 11, color: 'var(--ab-gold)', textDecoration: 'none' }}>전체 →</Link>
          </div>
          {consults.slice(0, 5).length === 0 ? <Empty /> : (
            <ul style={list}>
              {consults.slice(0, 5).map((c) => (
                <li key={c.id} style={li}>
                  <div style={{ width: 60, fontSize: 11, color: 'var(--ab-ivory-mute)' }}>
                    {new Date(c.createdAt).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', timeZone: 'Asia/Seoul' })}
                  </div>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ width: 60, fontSize: 11, color: 'var(--ab-ivory-mute)' }}>{c.type}</div>
                  <div style={{ width: 60, fontSize: 11, color: 'var(--ab-gold-light)' }}>{STATUS_LABEL[c.status]}</div>
                  <Link href={`/admin/consult/${c.id}`} style={{ fontSize: 11, color: 'var(--ab-gold)', textDecoration: 'none' }}>보기</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 메시지 / 링크 */}
      <div style={{ ...card, marginTop: 16 }}>
        <h3 style={cardH}>메시지 발송 (준비 중)</h3>
        <p style={{ fontSize: 13, color: 'var(--ab-ivory-mute)', margin: '0 0 12px' }}>
          상담 신청자에게 카카오 알림톡 · SMS · 이메일 일괄 발송. Solapi API 키 등록 후 활성화됩니다.
        </p>
        <Link href="/admin/message" style={btnGold}>메시지 발송 열기 →</Link>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, accent }: { label: string; value: number; sub?: string; accent?: boolean }) {
  return (
    <div style={{
      padding: 18,
      border: '1px solid ' + (accent ? 'var(--ab-gold)' : 'var(--ab-line)'),
      borderRadius: 6,
      background: '#0F0D0B',
    }}>
      <div style={{ fontSize: 11, color: 'var(--ab-ivory-mute)', letterSpacing: '0.08em' }}>{label}</div>
      <div style={{ fontSize: 34, color: accent ? 'var(--ab-gold)' : 'var(--ab-ivory)', fontFamily: 'var(--ab-font-headline)', fontWeight: 800, marginTop: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--ab-ivory-mute)', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Empty() {
  return <div style={{ padding: 20, textAlign: 'center', fontSize: 12, color: 'var(--ab-ivory-mute)' }}>데이터 없음</div>;
}

const card: React.CSSProperties = { padding: 16, border: '1px solid var(--ab-line)', borderRadius: 6, background: '#0F0D0B' };
const cardH: React.CSSProperties = { margin: '0 0 12px', fontSize: 13, color: 'var(--ab-gold)', letterSpacing: '0.08em', fontFamily: 'var(--ab-font-headline)' };
const list: React.CSSProperties = { listStyle: 'none', margin: 0, padding: 0 };
const li: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--ab-line)' };
const btnGold: React.CSSProperties = {
  display: 'inline-block',
  padding: '8px 18px',
  fontSize: 12,
  background: 'var(--ab-gold)',
  color: '#0B0907',
  textDecoration: 'none',
  borderRadius: 3,
  fontWeight: 700,
  letterSpacing: '0.05em',
};
