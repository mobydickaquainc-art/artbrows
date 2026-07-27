-- ============================================================================
-- eyebrows-main · 초기 스키마 (R2 도입)
-- 작성: 2026-06-15 · 한승철 (CTO AI 에이전트)
-- 적용: Supabase SQL Editor 에 통째 붙여넣기 → Run
-- ============================================================================

-- 확장
create extension if not exists "uuid-ossp";

-- ============================================================================
-- ① LEADS (상담 신청 — 인스타·위챗·랜딩 폼에서 들어오는 lead 모두 여기로)
-- ============================================================================
create table public.leads (
  id           uuid primary key default uuid_generate_v4(),
  created_at   timestamptz not null default now(),
  -- 신청자 정보
  name         text,
  phone        text,
  kakao_id     text,
  wechat_id    text,
  email        text,
  -- 유입·맥락
  channel      text,                 -- 'instagram' | 'wechat' | 'kakao' | 'naver' | 'youtube' | 'direct'
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  referrer     text,
  lang         text default 'ko',    -- 'ko' | 'en' | 'zh'
  -- 메시지·상태
  message      text,
  status       text not null default 'new',  -- 'new' | 'contacted' | 'converted' | 'closed'
  notes        text,                          -- 관리자 메모
  assigned_to  uuid                            -- 담당자 (members.id)
);
create index on public.leads (created_at desc);
create index on public.leads (status);
create index on public.leads (channel);

-- ============================================================================
-- ② MEMBERS (수강생·관리자 모두 — Supabase Auth.users 와 1:1)
-- ============================================================================
create table public.members (
  id          uuid primary key references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  email       text unique,
  name        text,
  phone       text,
  role        text not null default 'student',  -- 'student' | 'admin' | 'staff'
  lang        text default 'ko',
  -- 락인 정보
  k1_invited_at  timestamptz,                    -- K1 카톡방 초대 발송 시각
  k1_joined      boolean default false,
  enrolled_at    timestamptz,                    -- 첫 수강 완료 시각
  -- 메타
  avatar_url     text,
  notes          text
);
create index on public.members (role);
create index on public.members (created_at desc);

-- ============================================================================
-- ③ PRODUCTS (강의 + 시술 재료 + 학원 굿즈 — 자체 쇼핑몰 = /shop)
-- ============================================================================
create table public.products (
  id           uuid primary key default uuid_generate_v4(),
  created_at   timestamptz not null default now(),
  sku          text unique,
  name         text not null,
  category     text not null,        -- 'course' | 'material' | 'goods'
  description  text,
  price_krw    integer not null default 0,
  -- 강의용
  duration_hr  integer,              -- 수강 시간(시간 단위)
  lifetime     boolean default false, -- 평생 수강 여부 (69만원 평생 수강 모델 대응)
  -- 재고
  stock        integer,              -- null = 무한 (강의·평생수강), 숫자 = 재고 한정 (재료·굿즈)
  active       boolean not null default true,
  -- 노출
  thumbnail_url text,
  gallery_urls  text[],
  lang_versions jsonb default '{}'   -- {ko:{name,desc}, en:{...}, zh:{...}}
);
create index on public.products (category);
create index on public.products (active);

-- ============================================================================
-- ④ ORDERS (주문 — 토스 + 카카오 PG 양쪽 지원)
-- ============================================================================
create table public.orders (
  id           uuid primary key default uuid_generate_v4(),
  created_at   timestamptz not null default now(),
  member_id    uuid references public.members(id),
  -- 비회원 주문도 받을 수 있도록
  guest_email  text,
  guest_phone  text,
  -- 금액
  subtotal_krw integer not null default 0,
  discount_krw integer not null default 0,
  total_krw    integer not null default 0,
  -- 상태
  status       text not null default 'pending', -- 'pending' | 'paid' | 'fulfilled' | 'refunded' | 'cancelled'
  -- PG
  pg_provider  text,                            -- 'toss' | 'kakao'
  pg_payment_id text,
  -- 메타
  notes        text
);
create index on public.orders (member_id);
create index on public.orders (status);
create index on public.orders (created_at desc);

create table public.order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  uuid not null references public.products(id),
  quantity    integer not null default 1,
  price_krw   integer not null,                 -- 주문 시점 가격 스냅샷
  created_at  timestamptz not null default now()
);
create index on public.order_items (order_id);

-- ============================================================================
-- ⑤ POSTS (게시판 4종: 공지·이벤트·빠른상담·수강문의·후기)
-- ============================================================================
create table public.posts (
  id           uuid primary key default uuid_generate_v4(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  board        text not null,        -- 'notice' | 'event' | 'quick' | 'inquiry' | 'review'
  title        text not null,
  body         text,
  author_id    uuid references public.members(id),
  guest_name   text,                  -- 비회원 작성용
  guest_phone  text,
  is_secret    boolean default false,  -- 빠른상담·수강문의는 비공개 기본
  secret_pw    text,                   -- 비밀글 비밀번호 (해시 저장)
  view_count   integer default 0,
  lang         text default 'ko'
);
create index on public.posts (board, created_at desc);
create index on public.posts (author_id);

create table public.post_replies (
  id          uuid primary key default uuid_generate_v4(),
  post_id     uuid not null references public.posts(id) on delete cascade,
  created_at  timestamptz not null default now(),
  author_id   uuid references public.members(id),
  body        text not null
);
create index on public.post_replies (post_id);

-- ============================================================================
-- ⑥ UPLOADS (Supabase Storage 메타)
-- ============================================================================
create table public.uploads (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz not null default now(),
  bucket      text not null,
  path        text not null,
  uploader_id uuid references public.members(id),
  size_bytes  bigint,
  mime_type   text,
  -- 활용처
  tag         text,                  -- 'gallery' | 'product' | 'avatar' | 'post' | ...
  ref_id      uuid                   -- 연결된 다른 테이블 row id
);
create index on public.uploads (tag);

-- ============================================================================
-- ⑦ EVENTS (UTM 추적·광고 효과 분석)
-- ============================================================================
create table public.events (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz not null default now(),
  session_id  text,
  member_id   uuid references public.members(id),
  event_type  text not null,        -- 'pageview' | 'click' | 'lead_submit' | 'order_paid' | ...
  page_path   text,
  utm_source  text,
  utm_medium  text,
  utm_campaign text,
  referrer    text,
  ua          text,
  data        jsonb                  -- 부가 데이터
);
create index on public.events (event_type, created_at desc);
create index on public.events (utm_source);

-- ============================================================================
-- RLS (Row Level Security) — 기본은 모두 차단, 정책으로 풀어준다
-- ============================================================================
alter table public.leads        enable row level security;
alter table public.members      enable row level security;
alter table public.products     enable row level security;
alter table public.orders       enable row level security;
alter table public.order_items  enable row level security;
alter table public.posts        enable row level security;
alter table public.post_replies enable row level security;
alter table public.uploads      enable row level security;
alter table public.events       enable row level security;

-- LEADS: 누구나 INSERT 가능 (상담 신청), SELECT 는 관리자만
create policy leads_insert_anon on public.leads
  for insert with check (true);
create policy leads_select_admin on public.leads
  for select using (
    exists (select 1 from public.members m where m.id = auth.uid() and m.role in ('admin','staff'))
  );

-- MEMBERS: 본인만 조회·수정, 관리자는 전체
create policy members_self on public.members
  for select using (id = auth.uid());
create policy members_self_update on public.members
  for update using (id = auth.uid());
create policy members_admin_all on public.members
  for all using (
    exists (select 1 from public.members m where m.id = auth.uid() and m.role = 'admin')
  );

-- PRODUCTS: 누구나 활성 제품 SELECT, 관리자만 변경
create policy products_public_read on public.products
  for select using (active = true);
create policy products_admin_write on public.products
  for all using (
    exists (select 1 from public.members m where m.id = auth.uid() and m.role = 'admin')
  );

-- ORDERS: 본인 주문만 조회, 관리자는 전체
create policy orders_self on public.orders
  for select using (member_id = auth.uid());
create policy orders_insert_self on public.orders
  for insert with check (member_id = auth.uid() or member_id is null);
create policy orders_admin_all on public.orders
  for all using (
    exists (select 1 from public.members m where m.id = auth.uid() and m.role in ('admin','staff'))
  );

-- ORDER_ITEMS: 부모 주문 권한 그대로 (간단 정책)
create policy order_items_via_orders on public.order_items
  for select using (
    exists (select 1 from public.orders o where o.id = order_items.order_id
            and (o.member_id = auth.uid()
                 or exists (select 1 from public.members m where m.id = auth.uid() and m.role in ('admin','staff'))))
  );

-- POSTS: 공개 글은 누구나 SELECT, 비밀글은 작성자+관리자
create policy posts_public_read on public.posts
  for select using (is_secret = false);
create policy posts_author_self on public.posts
  for all using (author_id = auth.uid());
create policy posts_admin_all on public.posts
  for all using (
    exists (select 1 from public.members m where m.id = auth.uid() and m.role in ('admin','staff'))
  );
create policy posts_insert_anon on public.posts
  for insert with check (true);  -- 비회원도 글 작성 가능 (빠른상담)

-- POST_REPLIES: 게시글 권한 따라감, 관리자 작성
create policy post_replies_via_posts on public.post_replies
  for select using (
    exists (select 1 from public.posts p where p.id = post_replies.post_id and p.is_secret = false)
    or author_id = auth.uid()
    or exists (select 1 from public.members m where m.id = auth.uid() and m.role in ('admin','staff'))
  );
create policy post_replies_admin_write on public.post_replies
  for insert with check (
    exists (select 1 from public.members m where m.id = auth.uid() and m.role in ('admin','staff'))
  );

-- UPLOADS: 본인 업로드 + 관리자
create policy uploads_self on public.uploads
  for all using (uploader_id = auth.uid());
create policy uploads_admin on public.uploads
  for all using (
    exists (select 1 from public.members m where m.id = auth.uid() and m.role = 'admin')
  );

-- EVENTS: 누구나 INSERT (analytics), SELECT 는 관리자만
create policy events_insert_all on public.events
  for insert with check (true);
create policy events_admin_select on public.events
  for select using (
    exists (select 1 from public.members m where m.id = auth.uid() and m.role = 'admin')
  );

-- ============================================================================
-- 트리거 — updated_at 자동 갱신
-- ============================================================================
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger trg_posts_updated_at before update on public.posts
  for each row execute function public.tg_set_updated_at();

-- ============================================================================
-- 기본 데이터 (선택 — 첫 관리자 본인 등록은 가입 후 SQL 한 줄로)
-- ============================================================================
-- 가입 후 본인 id 확인 → 다음 한 줄 실행 (Supabase Auth Users 에서 본인 id 복사):
-- update public.members set role = 'admin' where id = '<your-auth-user-uuid>';
