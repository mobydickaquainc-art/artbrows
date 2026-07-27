/**
 * Supabase stub (2026-07-20 · 모비딕 파일 방식 채택 · Supabase 걷어냄)
 *
 * 이 프로젝트는 파일 기반 저장을 사용합니다:
 *   - Lead:   content/leads/{id}.json      → src/lib/leads.ts
 *   - Event:  content/events/YYYY-MM.jsonl → src/lib/events.ts
 *   - Consult:content/consult/{id}.json    → src/lib/admin/storage.ts
 *   - Cardnews: content/cardnews/{id}.json → src/lib/cardnews-agents/*
 *
 * 미래에 관리자 인증(자체 세션) 또는 SQLite/Postgres 로 이행할 때
 * 여기 exports 를 실제 구현으로 교체하세요.
 */

export const supabase = null as null;
export const supabaseAdmin = null as null;
export const isSupabaseReady = () => false;
export const isSupabaseAdminReady = () => false;
