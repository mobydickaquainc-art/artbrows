# Alembic — ARTbrows Platform DB 마이그레이션

- **DB 정본:** `db/init_v1.sql` (한승철 06-30 초안 → 07-02 v1.0 확정)
- **첫 마이그레이션:** `versions/0001_initial_schema.py` = init_v1.sql 을 그대로 실행
- **DB URL:** 환경변수 `ARTBROWS_DB_URL` 우선, 없으면 `sqlite:///data/artbrows.db`

## 사용법

```bash
# 새 마이그레이션 만들기 (스키마 수정 시)
alembic revision -m "add xxx column"

# 최신 상태로 업그레이드
alembic upgrade head

# 이력 확인
alembic history
alembic current
```

## 개발 → 베타 전환

SQLite → PostgreSQL 로 옮길 때 `alembic.ini` 의 `sqlalchemy.url` 만 교체하거나
`ARTBROWS_DB_URL=postgresql+psycopg://...` 설정하면 됨.
