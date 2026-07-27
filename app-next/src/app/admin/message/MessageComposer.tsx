'use client';

import { useMemo, useState } from 'react';

interface Recipient {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  kakao_id?: string;
  status: string;
  type: string;
  createdAt: string;
}

type Channel = 'sms' | 'kakao' | 'email';
type Filter = 'all' | 'new' | 'contacted' | 'booked' | 'treatment' | 'course';

const TEMPLATES: Record<Channel, { label: string; body: string }[]> = {
  sms: [
    { label: '접수 확인', body: '[ARTbrows] {name}님, 상담 신청 감사합니다. 담당자가 영업일 24시간 내 연락드립니다.' },
    { label: '예약 확정', body: '[ARTbrows] {name}님, {date} 시술 예약이 확정되었습니다. 문의는 카톡 채널로 부탁드립니다.' },
    { label: '수강 안내', body: '[ARTbrows] {name}님, 극사실 수강 안내입니다. 상세 커리큘럼과 가격 정보를 아래 링크에서 확인하세요.' },
  ],
  kakao: [
    { label: '알림톡 · 접수', body: '[ARTbrows]\n{name}님, 상담 신청이 접수되었습니다.\n영업일 24시간 내 담당자가 카톡으로 연락드립니다.' },
    { label: '알림톡 · 리마인드', body: '[ARTbrows]\n{name}님, 예약 하루 전 안내입니다.\n시술 전 3일간 각질 자극 최소화 부탁드려요.' },
  ],
  email: [
    { label: '상세 안내 (초대)', body: '{name}님, 안녕하세요. 장미지 원장님 극사실 살롱 · 아카데미 상담 신청 감사합니다.\n\n담당자가 24시간 내 개별 연락드립니다.\n\n— ARTbrows' },
  ],
};

export function MessageComposer({ recipients, hasSolapi }: { recipients: Recipient[]; hasSolapi: boolean }) {
  const [channel, setChannel] = useState<Channel>('sms');
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [body, setBody] = useState<string>(TEMPLATES.sms[0].body);
  const [previewIdx, setPreviewIdx] = useState(0);
  const [result, setResult] = useState<string>('');
  const [sending, setSending] = useState(false);

  const filtered = useMemo(() => {
    return recipients.filter((r) => {
      // 채널별 필드 존재
      if (channel === 'sms' && !r.phone) return false;
      if (channel === 'email' && !r.email) return false;
      if (channel === 'kakao' && !(r.kakao_id || r.phone)) return false;
      // 상태·유형 필터
      if (filter === 'all') return true;
      if (['new', 'contacted', 'booked'].includes(filter)) return r.status === filter;
      if (['treatment', 'course'].includes(filter)) return r.type === filter;
      return true;
    });
  }, [recipients, channel, filter]);

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((r) => r.id)));
    }
  };

  const applyTemplate = (idx: number) => {
    setBody(TEMPLATES[channel][idx].body);
    setPreviewIdx(0);
  };

  const previewRecipient = filtered[Math.min(previewIdx, filtered.length - 1)];
  const previewBody = previewRecipient
    ? body.replace(/\{name\}/g, previewRecipient.name).replace(/\{date\}/g, '2026-07-25')
    : body.replace(/\{name\}/g, '{name}');

  async function send() {
    setResult('');
    setSending(true);
    try {
      const targets = filtered.filter((r) => selected.has(r.id));
      const res = await fetch('/api/message/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel, body, targets: targets.map((t) => t.id) }),
      });
      const data = await res.json();
      if (data.ok) {
        setResult(`✓ ${data.dryRun ? '드라이런' : '발송'} · ${data.count}건 (${data.channel})`);
      } else {
        setResult(`✗ 실패: ${data.error ?? '알 수 없음'}`);
      }
    } catch (err) {
      setResult(`✗ 오류: ${err instanceof Error ? err.message : ''}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {/* 왼쪽 : 채널 · 필터 · 대상 */}
      <div style={card}>
        <h3 style={cardH}>① 채널</h3>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {(['sms', 'kakao', 'email'] as Channel[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => { setChannel(c); setBody(TEMPLATES[c][0].body); setSelected(new Set()); }}
              style={{
                flex: 1,
                padding: '10px 12px',
                fontSize: 13,
                border: '1px solid ' + (channel === c ? 'var(--ab-gold)' : 'var(--ab-line)'),
                background: channel === c ? 'var(--ab-gold)' : 'transparent',
                color: channel === c ? '#0B0907' : 'var(--ab-ivory)',
                borderRadius: 3,
                cursor: 'pointer',
                fontWeight: channel === c ? 700 : 400,
              }}
            >
              {c === 'sms' ? '📱 SMS' : c === 'kakao' ? '💬 카톡 알림톡' : '📧 이메일'}
            </button>
          ))}
        </div>

        <h3 style={cardH}>② 대상 필터</h3>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 14 }}>
          {(['all', 'new', 'contacted', 'booked', 'treatment', 'course'] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => { setFilter(f); setSelected(new Set()); }}
              style={{
                padding: '5px 10px',
                fontSize: 11,
                border: '1px solid ' + (filter === f ? 'var(--ab-gold)' : 'var(--ab-line)'),
                background: filter === f ? 'var(--ab-gold-soft)' : 'transparent',
                color: filter === f ? 'var(--ab-gold)' : 'var(--ab-ivory-mute)',
                borderRadius: 3,
                cursor: 'pointer',
              }}
            >
              {filterLabel(f)}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--ab-ivory-mute)' }}>
            {filtered.length}명 매칭 · <b style={{ color: 'var(--ab-gold)' }}>{selected.size}</b>명 선택
          </span>
          <button
            type="button"
            onClick={toggleAll}
            style={{ fontSize: 11, background: 'transparent', border: '1px solid var(--ab-line)', color: 'var(--ab-ivory)', padding: '3px 8px', borderRadius: 3, cursor: 'pointer' }}
          >
            {selected.size === filtered.length ? '전체 해제' : '전체 선택'}
          </button>
        </div>

        <div style={{ maxHeight: 260, overflow: 'auto', border: '1px solid var(--ab-line)', borderRadius: 4 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 30, textAlign: 'center', fontSize: 12, color: 'var(--ab-ivory-mute)' }}>매칭 대상 없음</div>
          ) : filtered.map((r) => (
            <label key={r.id} style={{
              display: 'flex',
              gap: 10,
              alignItems: 'center',
              padding: '8px 10px',
              borderBottom: '1px solid var(--ab-line)',
              cursor: 'pointer',
              background: selected.has(r.id) ? 'rgba(201, 166, 107, 0.08)' : 'transparent',
            }}>
              <input
                type="checkbox"
                checked={selected.has(r.id)}
                onChange={(e) => {
                  const next = new Set(selected);
                  if (e.target.checked) next.add(r.id);
                  else next.delete(r.id);
                  setSelected(next);
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: 'var(--ab-ivory-mute)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {channel === 'email' ? r.email : channel === 'sms' ? r.phone : (r.kakao_id ?? r.phone)}
                </div>
              </div>
              <span style={{ fontSize: 10, color: 'var(--ab-gold-light)' }}>{r.status}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 오른쪽 : 본문 · 프리뷰 · 발송 */}
      <div style={card}>
        <h3 style={cardH}>③ 본문</h3>
        <div style={{ display: 'flex', gap: 4, marginBottom: 8, flexWrap: 'wrap' }}>
          {TEMPLATES[channel].map((t, i) => (
            <button
              key={i}
              type="button"
              onClick={() => applyTemplate(i)}
              style={{ fontSize: 11, padding: '4px 8px', border: '1px solid var(--ab-line)', background: 'transparent', color: 'var(--ab-gold-light)', borderRadius: 3, cursor: 'pointer' }}
            >
              📋 {t.label}
            </button>
          ))}
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={7}
          placeholder="본문 · {name} 은 자동으로 이름 치환"
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
        <div style={{ fontSize: 11, color: 'var(--ab-ivory-mute)', marginTop: 4 }}>
          {body.length} chars · 치환 토큰: <code>{'{name}'}</code>, <code>{'{date}'}</code>
        </div>

        <h3 style={{ ...cardH, marginTop: 20 }}>④ 프리뷰</h3>
        {filtered.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <button type="button" onClick={() => setPreviewIdx(Math.max(0, previewIdx - 1))} style={smallBtn}>‹</button>
            <span style={{ fontSize: 12, color: 'var(--ab-ivory-mute)' }}>
              {Math.min(previewIdx, filtered.length - 1) + 1} / {filtered.length}
              {previewRecipient && ` · ${previewRecipient.name}`}
            </span>
            <button type="button" onClick={() => setPreviewIdx(Math.min(filtered.length - 1, previewIdx + 1))} style={smallBtn}>›</button>
          </div>
        )}
        <div style={{
          padding: 14,
          background: '#141210',
          border: '1px solid var(--ab-line)',
          borderRadius: 4,
          fontSize: 13,
          whiteSpace: 'pre-wrap',
          lineHeight: 1.55,
          minHeight: 80,
        }}>
          {previewBody}
        </div>

        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: result.startsWith('✓') ? 'var(--ab-gold)' : '#FF7A9C' }}>{result}</span>
          <button
            type="button"
            onClick={send}
            disabled={sending || selected.size === 0 || !body.trim()}
            style={{
              padding: '10px 22px',
              fontSize: 13,
              background: sending || selected.size === 0 ? 'var(--ab-line)' : 'var(--ab-gold)',
              color: '#0B0907',
              border: 'none',
              borderRadius: 3,
              cursor: sending || selected.size === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            {sending ? '발송 중…' : hasSolapi ? `${selected.size}명에게 발송` : `드라이런 ${selected.size}건`}
          </button>
        </div>
      </div>
    </div>
  );
}

const card: React.CSSProperties = { padding: 16, border: '1px solid var(--ab-line)', borderRadius: 6, background: '#0F0D0B' };
const cardH: React.CSSProperties = { margin: '0 0 10px', fontSize: 12, color: 'var(--ab-gold)', letterSpacing: '0.08em', fontFamily: 'var(--ab-font-headline)' };
const smallBtn: React.CSSProperties = { padding: '2px 8px', fontSize: 14, background: 'transparent', border: '1px solid var(--ab-line)', color: 'var(--ab-ivory)', borderRadius: 3, cursor: 'pointer' };

function filterLabel(f: Filter) {
  return { all: '전체', new: '신규', contacted: '연락함', booked: '예약', treatment: '시술', course: '수강' }[f];
}
