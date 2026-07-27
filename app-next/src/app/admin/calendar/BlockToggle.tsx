'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

export function BlockToggle({ date, isBlocked }: { date: string; isBlocked: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  async function toggle() {
    await fetch('/api/calendar/block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date }),
    });
    start(() => router.refresh());
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      style={{
        fontSize: 10,
        background: 'transparent',
        border: '1px solid var(--ab-line)',
        color: isBlocked ? '#E07060' : 'var(--ab-ivory-mute)',
        padding: '2px 6px',
        borderRadius: 3,
        cursor: pending ? 'wait' : 'pointer',
      }}
    >
      {pending ? '…' : isBlocked ? '휴무 해제' : '휴무'}
    </button>
  );
}
