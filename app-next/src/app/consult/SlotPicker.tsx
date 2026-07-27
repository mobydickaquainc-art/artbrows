'use client';

import { useEffect, useMemo, useState } from 'react';

interface Slot {
  date: string;
  time: string;
  kind: 'treatment_consult' | 'course_consult' | 'treatment_session';
  label: string;
  durationMin: number;
  status: 'available' | 'held' | 'confirmed';
}

interface Props {
  kind: 'treatment_consult' | 'course_consult';
  onSelect: (slot: { date: string; time: string; kind: Slot['kind']; label: string }) => void;
  selected?: { date: string; time: string } | null;
}

export function SlotPicker({ kind, onSelect, selected }: Props) {
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [err, setErr] = useState('');

  const { from, to } = useMemo(() => {
    const today = new Date();
    const later = new Date(); later.setDate(today.getDate() + 20);
    const f = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return { from: f(today), to: f(later) };
  }, []);

  useEffect(() => {
    let stop = false;
    setSlots(null);
    fetch(`/api/calendar/slots?from=${from}&to=${to}&kind=${kind}`)
      .then((r) => r.json())
      .then((d) => { if (!stop) setSlots(d.slots ?? []); })
      .catch(() => { if (!stop) setErr('슬롯 불러오기 실패'); });
    return () => { stop = true; };
  }, [from, to, kind]);

  // 날짜별 그룹핑
  const byDate = useMemo(() => {
    const m = new Map<string, Slot[]>();
    (slots ?? []).forEach((s) => {
      const arr = m.get(s.date) ?? [];
      arr.push(s);
      m.set(s.date, arr);
    });
    return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [slots]);

  if (err) return <div style={errBox}>⚠ {err}</div>;
  if (slots === null) return <div style={{ padding: 30, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>슬롯 불러오는 중…</div>;
  if (byDate.length === 0) return <div style={errBox}>가능한 슬롯이 없습니다. 원장님 근무 일정 확인 필요.</div>;

  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10, letterSpacing: '.05em' }}>
        가능한 슬롯 · 신청 후 원장님 승인 시 예약 확정 (24시간 홀드)
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8, maxHeight: 320, overflow: 'auto', padding: 8, background: 'var(--bg-deep)', border: '1px solid var(--line)' }}>
        {byDate.map(([date, ss]) => (
          <div key={date}>
            <div style={{ fontSize: 11, color: 'var(--gold-light)', letterSpacing: '.1em', marginBottom: 6, fontWeight: 600 }}>
              {formatDate(date)}
            </div>
            {ss.map((s) => {
              const active = selected?.date === date && selected?.time === s.time;
              const disabled = s.status !== 'available';
              return (
                <button
                  key={s.time}
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelect({ date, time: s.time, kind: s.kind, label: s.label })}
                  style={{
                    display: 'block',
                    width: '100%',
                    marginBottom: 4,
                    padding: '8px 10px',
                    fontSize: 12,
                    fontFamily: 'inherit',
                    background: active ? 'var(--gold)' : disabled ? 'transparent' : 'var(--bg-card)',
                    color: active ? 'var(--bg-deep)' : disabled ? 'var(--muted)' : 'var(--text)',
                    border: '1px solid ' + (active ? 'var(--gold)' : 'var(--line)'),
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    opacity: disabled ? 0.5 : 1,
                    borderRadius: 2,
                    fontWeight: active ? 700 : 400,
                  }}
                >
                  <div>{s.time} · {s.durationMin}분</div>
                  <div style={{ fontSize: 10, opacity: 0.75 }}>
                    {disabled ? (s.status === 'confirmed' ? '예약 확정' : '홀드 중') : s.label}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDate(d: string) {
  const dt = new Date(d + 'T00:00:00');
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${dt.getMonth() + 1}/${dt.getDate()} (${days[dt.getDay()]})`;
}

const errBox: React.CSSProperties = {
  padding: 20,
  textAlign: 'center',
  color: '#E07060',
  fontSize: 13,
  border: '1px solid #5A2422',
  background: '#1E1410',
  borderRadius: 2,
};
