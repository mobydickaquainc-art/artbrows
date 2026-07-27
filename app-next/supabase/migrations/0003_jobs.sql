-- 0003 · 영상 번역 잡 통합 테이블
-- watcher.py 가 양쪽 PC 에서 처리 완료 시 insert/upsert
-- /admin 또는 translate-zh 페이지에서 fetch

create table if not exists public.jobs (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),
  base_name     text unique not null,
  source        text,                 -- 원본 파일명
  duration      float,                -- 영상 길이 (초)
  size_bytes    bigint,
  language      text,                 -- 'zh'
  engine        text,                 -- 'gpt' | 'claude' | 'gemini'
  status        text not null default 'completed',  -- queued | processing | completed | failed
  processed_at  timestamptz,
  total_elapsed_s float,
  segments      jsonb,                -- 전체 자막 (KB~MB 단위)
  source_pc     text,                 -- 'office' | 'jangmiji' | 기타
  notes         text
);
create index if not exists idx_jobs_created on public.jobs (created_at desc);
create index if not exists idx_jobs_status on public.jobs (status);

alter table public.jobs enable row level security;

-- 누구나 SELECT (시청 페이지) — 단 segments 는 큰 데이터라 별도 endpoint 가 안전
create policy jobs_public_read on public.jobs
  for select using (true);

-- INSERT/UPDATE 는 service_role (워처가 secret key 사용)
-- 별도 정책 필요 없음 — service_role 은 RLS 우회
