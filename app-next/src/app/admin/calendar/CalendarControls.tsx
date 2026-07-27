'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { CalendarConfig } from '@/lib/admin/calendar';

const DAY_LABEL = ['일', '월', '화', '수', '목', '금', '토'];

export function CalendarControls({ config }: { config: CalendarConfig }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [expanded, setExpanded] = useState(false);
  const [workingDays, setWorkingDays] = useState<number[]>(config.workingDays);
  const [holdHours, setHoldHours] = useState(config.holdHours);
  const [horizonDays, setHorizonDays] = useState(config.horizonDays);
  const [msg, setMsg] = useState('');

  const toggleDay = (d: number) => {
    setWorkingDays((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort());
  };

  async function save() {
    setMsg('');
    const res = await fetch('/api/calendar/block', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workingDays, holdHours, horizonDays }),
    });
    if (res.ok) {
      setMsg('✓ 저장됨');
      start(() => router.refresh());
    } else {
      setMsg('✗ 실패');
    }
  }

  return (
    <div style={{ padding: 12, background: '#0F0D0B', border: '1px solid var(--ab-line)', borderRadius: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          style={{ fontSize: 12, background: 'transparent', border: '1px solid var(--ab-line)', color: 'var(--ab-gold-light)', padding: '6px 12px', borderRadius: 3, cursor: 'pointer' }}
        >
          {expanded ? '▼' : '▶'} 근무 규칙
        </button>
        <span style={{ fontSize: 12, color: 'var(--ab-ivory-mute)' }}>
          현재: {config.workingDays.map((d) => DAY_LABEL[d]).join('·')} · 홀드 {config.holdHours}h · {config.horizonDays}일 미리
        </span>
      </div>
      {expanded && (
        <div style={{ marginTop: 14, padding: 12, background: '#0B0907', borderRadius: 3 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--ab-gold)', letterSpacing: '.08em', marginBottom: 6 }}>근무 요일</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {DAY_LABEL.map((label, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDay(i)}
                  style={{
                    width: 40,
                    padding: '8px 0',
                    fontSize: 12,
                    background: workingDays.includes(i) ? 'var(--ab-gold)' : 'transparent',
                    color: workingDays.includes(i) ? '#0B0907' : 'var(--ab-ivory-mute)',
                    border: '1px solid ' + (workingDays.includes(i) ? 'var(--ab-gold)' : 'var(--ab-line)'),
                    borderRadius: 3,
                    cursor: 'pointer',
                    fontWeight: workingDays.includes(i) ? 700 : 400,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <label>
              <div style={{ fontSize: 11, color: 'var(--ab-gold)', letterSpacing: '.08em', marginBottom: 6 }}>홀드 시간 (시간)</div>
              <input type="number" min={1} max={168} value={holdHours} onChange={(e) => setHoldHours(Number(e.target.value))} style={inp} />
            </label>
            <label>
              <div style={{ fontSize: 11, color: 'var(--ab-gold)', letterSpacing: '.08em', marginBottom: 6 }}>예약 가능 미래 (일)</div>
              <input type="number" min={1} max={90} value={horizonDays} onChange={(e) => setHorizonDays(Number(e.target.value))} style={inp} />
            </label>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              type="button"
              onClick={save}
              disabled={pending}
              style={{ padding: '8px 18px', fontSize: 12, background: 'var(--ab-gold)', color: '#0B0907', border: 'none', borderRadius: 3, fontWeight: 700, cursor: pending ? 'wait' : 'pointer' }}
            >
              {pending ? '저장 중…' : '저장'}
            </button>
            <span style={{ fontSize: 12, color: msg.startsWith('✓') ? 'var(--ab-gold)' : '#FF7A9C' }}>{msg}</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ab-ivory-mute)' }}>
              슬롯 시간대 편집은 config.json 직접 · 곧 UI 추가
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

const inp: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  fontSize: 13,
  background: '#0B0907',
  color: 'var(--ab-ivory)',
  border: '1px solid var(--ab-line)',
  borderRadius: 3,
};
