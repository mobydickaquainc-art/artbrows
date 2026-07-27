'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { ConsultStatus } from '@/lib/admin/storage';

const STATUS: { key: ConsultStatus; label: string }[] = [
  { key: 'new', label: '신규' },
  { key: 'contacted', label: '연락함' },
  { key: 'booked', label: '예약' },
  { key: 'done', label: '완료' },
  { key: 'canceled', label: '취소' },
];

export function ConsultDetailForm({ id, status: initStatus, notes: initNotes }: { id: string; status: ConsultStatus; notes: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<ConsultStatus>(initStatus);
  const [notes, setNotes] = useState(initNotes);
  const [msg, setMsg] = useState('');
  const [pending, start] = useTransition();

  async function save() {
    setMsg('');
    const res = await fetch(`/api/consult/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    });
    if (res.ok) {
      setMsg('✓ 저장됨');
      start(() => router.refresh());
    } else {
      setMsg('✗ 저장 실패');
    }
  }

  return (
    <div style={{ marginTop: 24, padding: 16, border: '1px solid var(--ab-line)', borderRadius: 6, background: '#0F0D0B' }}>
      <h3 style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--ab-gold)', letterSpacing: '0.08em', fontFamily: 'var(--ab-font-headline)' }}>
        운영자 관리
      </h3>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {STATUS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setStatus(s.key)}
            style={{
              padding: '6px 12px',
              fontSize: 12,
              border: '1px solid ' + (status === s.key ? 'var(--ab-gold)' : 'var(--ab-line)'),
              background: status === s.key ? 'var(--ab-gold)' : 'transparent',
              color: status === s.key ? '#0B0907' : 'var(--ab-ivory)',
              borderRadius: 3,
              cursor: 'pointer',
              fontWeight: status === s.key ? 700 : 400,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="내부 메모 (원장님·직원 공유용)"
        rows={5}
        style={{
          width: '100%',
          padding: 10,
          fontSize: 13,
          background: '#0B0907',
          color: 'var(--ab-ivory)',
          border: '1px solid var(--ab-line)',
          borderRadius: 3,
          fontFamily: 'var(--ab-font-body)',
          resize: 'vertical',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <span style={{ fontSize: 12, color: msg.startsWith('✓') ? 'var(--ab-gold)' : '#FF7A9C' }}>{msg}</span>
        <button
          type="button"
          onClick={save}
          disabled={pending}
          style={{
            padding: '8px 20px',
            fontSize: 12,
            background: 'var(--ab-gold)',
            color: '#0B0907',
            border: 'none',
            borderRadius: 3,
            cursor: pending ? 'wait' : 'pointer',
            fontWeight: 700,
            letterSpacing: '0.05em',
          }}
        >
          {pending ? '저장 중…' : '저장'}
        </button>
      </div>
    </div>
  );
}
