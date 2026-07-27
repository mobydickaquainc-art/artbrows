import Link from 'next/link';
import { getConfig, listSlots, listBlocks, type SlotKind } from '@/lib/admin/calendar';
import { CalendarControls } from './CalendarControls';
import { BlockToggle } from './BlockToggle';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const KIND_LABEL: Record<SlotKind, string> = {
  treatment_consult: '시술 상담',
  course_consult: '수강 상담',
  treatment_session: '실 시술',
};

const KIND_COLOR: Record<SlotKind, string> = {
  treatment_consult: '#C9A66B',
  course_consult: '#7ABF9A',
  treatment_session: '#FF7A9C',
};

const DAY_LABEL = ['일', '월', '화', '수', '목', '금', '토'];

export default async function AdminCalendarPage({ searchParams }: { searchParams: Promise<{ week?: string }> }) {
  const params = await searchParams;
  const config = await getConfig();

  // 표시 주 계산 (기본: 이번주 월요일)
  const base = params.week ? new Date(params.week + 'T00:00:00') : new Date();
  const weekStart = new Date(base);
  weekStart.setDate(base.getDate() - ((base.getDay() + 6) % 7)); // 월요일
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6);
  const f = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const [tSlots, cSlots, sSlots, blocks] = await Promise.all([
    listSlots({ from: f(weekStart), to: f(weekEnd), kind: 'treatment_consult' }),
    listSlots({ from: f(weekStart), to: f(weekEnd), kind: 'course_consult' }),
    listSlots({ from: f(weekStart), to: f(weekEnd), kind: 'treatment_session' }),
    listBlocks(f(weekStart), f(weekEnd)),
  ]);

  const allSlots = [...tSlots, ...cSlots, ...sSlots];
  const blockSet = new Set(blocks.map((b) => b.date));

  // 날짜별 그룹
  const days: { date: string; day: string; slots: typeof allSlots; isBlocked: boolean; isWorking: boolean }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart); d.setDate(weekStart.getDate() + i);
    const ds = f(d);
    days.push({
      date: ds,
      day: DAY_LABEL[d.getDay()],
      slots: allSlots.filter((s) => s.date === ds).sort((a, b) => a.time.localeCompare(b.time)),
      isBlocked: blockSet.has(ds),
      isWorking: config.workingDays.includes(d.getDay()),
    });
  }

  const prevWeek = new Date(weekStart); prevWeek.setDate(weekStart.getDate() - 7);
  const nextWeek = new Date(weekStart); nextWeek.setDate(weekStart.getDate() + 7);

  const summary = {
    total: allSlots.length,
    held: allSlots.filter((s) => s.status === 'held').length,
    confirmed: allSlots.filter((s) => s.status === 'confirmed').length,
  };

  return (
    <div style={{ padding: 32, maxWidth: 1400, margin: '0 auto' }}>
      <header style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 28, color: 'var(--ab-gold)', margin: 0 }}>
          📅 예약 캘린더
        </h1>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginLeft: 20 }}>
          <Link href={`/admin/calendar?week=${f(prevWeek)}`} style={navBtn}>← 지난 주</Link>
          <div style={{ padding: '6px 14px', fontSize: 12, color: 'var(--ab-ivory)' }}>
            {f(weekStart)} – {f(weekEnd)}
          </div>
          <Link href={`/admin/calendar?week=${f(nextWeek)}`} style={navBtn}>다음 주 →</Link>
          <Link href="/admin/calendar" style={navBtn}>이번 주</Link>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ab-ivory-mute)' }}>
          이번 주 · 슬롯 {summary.total} · 홀드 <b style={{ color: '#FF7A9C' }}>{summary.held}</b> · 확정 <b style={{ color: 'var(--ab-gold)' }}>{summary.confirmed}</b>
        </div>
      </header>

      <CalendarControls config={config} />

      {/* 주간 그리드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginTop: 20 }}>
        {days.map((d) => (
          <div key={d.date} style={{
            padding: 10,
            background: d.isBlocked ? '#1A0A0A' : '#0F0D0B',
            border: '1px solid ' + (d.isBlocked ? '#5A2422' : 'var(--ab-line)'),
            borderRadius: 4,
            minHeight: 220,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--ab-ivory-mute)' }}>{d.day}</div>
                <div style={{ fontSize: 16, color: d.isWorking && !d.isBlocked ? 'var(--ab-gold)' : 'var(--ab-ivory-mute)', fontWeight: 700 }}>
                  {d.date.slice(5)}
                </div>
              </div>
              <BlockToggle date={d.date} isBlocked={d.isBlocked} />
            </div>
            {!d.isWorking && <div style={{ fontSize: 11, color: 'var(--ab-ivory-mute)', textAlign: 'center', padding: 20 }}>비근무일</div>}
            {d.isBlocked && d.isWorking && <div style={{ fontSize: 11, color: '#E07060', textAlign: 'center', padding: 10 }}>휴무</div>}
            {d.isWorking && !d.isBlocked && d.slots.length === 0 && (
              <div style={{ fontSize: 11, color: 'var(--ab-ivory-mute)', padding: 10, textAlign: 'center' }}>슬롯 없음</div>
            )}
            {d.slots.map((s, i) => (
              <div key={i} style={{
                padding: '6px 8px',
                marginBottom: 4,
                fontSize: 11,
                background: s.status === 'available' ? 'transparent' : s.status === 'confirmed' ? 'rgba(201, 166, 107, 0.15)' : 'rgba(255, 122, 156, 0.12)',
                border: '1px solid ' + (s.status === 'available' ? 'var(--ab-line)' : s.status === 'confirmed' ? 'var(--ab-gold)' : '#FF7A9C'),
                borderRadius: 3,
                color: s.status === 'available' ? 'var(--ab-ivory-mute)' : 'var(--ab-ivory)',
              }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 3, background: KIND_COLOR[s.kind] }} />
                  <b>{s.time}</b>
                  <span style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.75 }}>{KIND_LABEL[s.kind]}</span>
                </div>
                {s.heldByConsultId && (
                  <Link href={`/admin/consult/${s.heldByConsultId}`} style={{ fontSize: 10, color: s.status === 'confirmed' ? 'var(--ab-gold)' : '#FF7A9C', textDecoration: 'none', marginTop: 3, display: 'block' }}>
                    → 상세 · {s.status === 'held' ? '홀드' : '확정'}
                  </Link>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, fontSize: 11, color: 'var(--ab-ivory-mute)' }}>
        범례:
        <span style={{ marginLeft: 10 }}>● <span style={{ color: KIND_COLOR.treatment_consult }}>시술 상담</span></span>
        <span style={{ marginLeft: 10 }}>● <span style={{ color: KIND_COLOR.course_consult }}>수강 상담</span></span>
        <span style={{ marginLeft: 10 }}>● <span style={{ color: KIND_COLOR.treatment_session }}>실 시술</span></span>
        <span style={{ marginLeft: 20 }}>홀드 {config.holdHours}h · 예약 가능 {config.horizonDays}일</span>
      </div>
    </div>
  );
}

const navBtn: React.CSSProperties = {
  padding: '6px 12px',
  fontSize: 11,
  color: 'var(--ab-gold-light)',
  textDecoration: 'none',
  border: '1px solid var(--ab-line)',
  borderRadius: 3,
};

