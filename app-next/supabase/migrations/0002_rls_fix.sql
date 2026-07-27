-- ============================================================================
-- 0002_rls_fix.sql — RLS 무한 재귀 패치
-- 문제: members 테이블 정책이 members 를 다시 조회 → infinite recursion
-- 해결: SECURITY DEFINER 함수로 우회 (RLS 무시하고 members 조회 가능)
-- ============================================================================

-- 1) 헬퍼 함수 — RLS 우회로 현재 사용자의 role 조회
create or replace function public.current_user_role()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role from public.members where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (select role = 'admin' from public.members where id = auth.uid()),
    false
  );
$$;

create or replace function public.is_staff_or_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (select role in ('admin','staff') from public.members where id = auth.uid()),
    false
  );
$$;

-- 2) 기존 문제 정책 제거 후 새 정책 (헬퍼 함수 사용)
drop policy if exists leads_select_admin       on public.leads;
drop policy if exists members_admin_all        on public.members;
drop policy if exists products_admin_write     on public.products;
drop policy if exists orders_admin_all         on public.orders;
drop policy if exists order_items_via_orders   on public.order_items;
drop policy if exists posts_admin_all          on public.posts;
drop policy if exists post_replies_select      on public.post_replies;
drop policy if exists post_replies_admin_write on public.post_replies;
drop policy if exists uploads_admin            on public.uploads;
drop policy if exists events_admin_select      on public.events;

create policy leads_select_admin on public.leads
  for select using (public.is_staff_or_admin());

create policy members_admin_all on public.members
  for all using (public.is_admin());

create policy products_admin_write on public.products
  for all using (public.is_admin());

create policy orders_admin_all on public.orders
  for all using (public.is_staff_or_admin());

create policy order_items_via_orders on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.member_id = auth.uid() or public.is_staff_or_admin())
    )
  );

create policy posts_admin_all on public.posts
  for all using (public.is_staff_or_admin());

create policy post_replies_select on public.post_replies
  for select using (
    exists (select 1 from public.posts p where p.id = post_replies.post_id and p.is_secret = false)
    or author_id = auth.uid()
    or public.is_staff_or_admin()
  );

create policy post_replies_admin_write on public.post_replies
  for insert with check (public.is_staff_or_admin());

create policy uploads_admin on public.uploads
  for all using (public.is_admin());

create policy events_admin_select on public.events
  for select using (public.is_admin());
