'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

export function SlotConfirmButtons({ id, status }: { id: string; status: 'held' | 'confirmed' | 'released' }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  async function run(action: 'confirm' | 'release') {
    const res = await fetch(`/api/consult/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slotAction: action }),
    });
    if (res.ok) start(() => router.refresh());
  }

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {status !== 'confirmed' && (
        <button
          type="button"
          onClick={() => run('confirm')}
          disabled={pending}
          style={{
            padding: '10px 20px',
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
          ✓ 예약 확정
        </button>
      )}
      {status !== 'released' && (
        <button
          type="button"
          onClick={() => run('release')}
          disabled={pending}
          style={{
            padding: '10px 20px',
            fontSize: 12,
            background: 'transparent',
            color: '#FF7A9C',
            border: '1px solid #FF7A9C',
            borderRadius: 3,
            cursor: pending ? 'wait' : 'pointer',
            fontWeight: 600,
            letterSpacing: '0.05em',
          }}
        >
          해제
        </button>
      )}
    </div>
  );
}
