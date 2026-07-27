# PRD · 인프라 이관 & 하이브리드 배포 v0.1
> 2026-07-27 · 담당 김다은 (PM · 홈페이지) + 한승철 (기술 검토)
> 배경: 대표님 지시 「artbrow.co.kr 도메인 · 선릉 장미지 서버 활용 · 오늘까지 작업 이어서 개발」
> 병행: [PRD-KAKAO-INTEGRATION-v0.1.md](./PRD-KAKAO-INTEGRATION-v0.1.md)

---

## 1. 배경

### 1-1. 현재 상태 (2026-07-27)

- **개발 환경**: 대표님 PC 로컬 (`d:\work\jangmi\artbrows-project\app-next`) · `npm run dev` on port 3000
- **외부 노출**: Cloudflare quick tunnel (`https://commit-website-portfolio-jose.trycloudflare.com`) · 세션마다 URL 바뀜
- **배포 상태**: Vercel 미배포 · Netlify 는 numjou 크레딧 소진 · 실사용 도메인 없음
- **선릉 서버**: 원장님 사무실 Windows PC · AnyDesk ID `1 373 180 108` · KT 회선 `14.52.141.172` · 아직 서비스 안 함
- **도메인 정본**: `artbrow.co.kr` (07-13 회의 결정 · 오픈일 8월 말 · [[meeting-2026-07-13-decisions]])

### 1-2. 문제

1. **URL 불안정** — Cloudflare quick tunnel 은 세션마다 바뀜 · 대표님·원장님 북마크 불가
2. **KT 회선 인바운드 차단** — 선릉 서버에 포트 개방하기 어려움 (개인 회선 NAT · ISP 제한)
3. **정적 자산 병목** — Vercel Free 100GB/월 대역폭 · 이미지·영상 대량 서빙 시 곧 소진
4. **버전 관리 부재** — 오늘 작업 커밋 안 됨 · 대표님 PC 장애 시 손실 위험
5. **배포 자동화 없음** — dev 서버가 대표님 PC 의존 · 대표님 PC 종료 시 사이트 다운

### 1-3. 기회

- 선릉 서버는 이미 준비됨 (AnyDesk · 관리자 계정 · 스크립트 준비 완료 · 이관 가이드 존재)
- Cloudflare Named Tunnel = KT NAT 무시하고 outbound 만으로 뚫음 · 무료 무제한
- GitHub + Vercel 조합 = 자동 배포 · 도메인 매핑 5분
- 하이브리드 구조 (Vercel=코드 · 선릉=자산) 로 각 층 최적화

## 2. 목표

| 지표 | 현재 | 목표 |
|---|---|---|
| 사이트 URL 안정성 | 세션마다 바뀜 | `artbrow.co.kr` 영구 · 24/7 |
| 배포 시간 | 수동 · N/A | git push → 자동 (60초 이내) |
| 코드 백업 | 없음 (대표님 PC만) | GitHub main branch |
| 정적 자산 대역폭 | Vercel Free 100GB 한계 | 무제한 (선릉 서버 · Cloudflare 캐시) |
| 서버 uptime | 대표님 PC on/off | 24/7 (선릉 상시 켜기 + Vercel 자동) |
| 이미지 원본 저장 | 프로젝트 폴더 | 선릉 서버 `D:\media` (SSD 크기까지) |

## 3. 아키텍처 (하이브리드)

```
                        ┌──────────────────────────┐
                        │      artbrow.co.kr        │
                        │   Cloudflare 프록시 (무료) │
                        │   · DDoS 방어             │
                        │   · SSL 자동              │
                        │   · 캐시 오프로드          │
                        └───────┬──────────┬───────┘
                                │           │
                    HTML/JS/API │           │ /media/* /uploads/* /cdn/*
                    (경량)      │           │ (대용량)
                                ↓           ↓
                         ┌──────────┐  ┌──────────────────┐
                         │  Vercel  │  │   선릉 서버       │
                         │          │  │                  │
                         │ Next.js  │  │ Cloudflare Named │
                         │ 코드+API │  │ Tunnel (KT NAT   │
                         │ (경량)   │  │ 뚫음 · outbound) │
                         │          │  │                  │
                         │ 자동 배포 │  │ Nginx 정적 서빙   │
                         │  (Git    │  │ /media/* 원본    │
                         │   push)  │  │ /cdn/*  리사이즈  │
                         └────┬─────┘  └────────┬─────────┘
                              │                  │
                              └────── GitHub ────┘
                              (main branch = 정본)
```

## 4. 스코프

### 4-1. 1차 (Day 0~2 · 즉시 필요)

1. **GitHub 리포 생성** — private · `mobydickaquainc-art/artbrows-main` (or 대표님 계정)
2. **오늘 작업 전부 커밋** — 카카오 통합 코드 · sophia 페이지 · 문서 등
3. **Vercel 배포** — main branch 자동 배포 · 임시 URL 발급 (`artbrows-xxx.vercel.app`)
4. **artbrow.co.kr DNS** — 가비아 → Vercel (또는 Cloudflare 이관)
5. **환경변수 등록** — Vercel dashboard 에 `.env.local` 값 이관

### 4-2. 2차 (Day 3~7 · 선릉 서버 하이브리드)

1. **선릉 서버 셋업** — Node.js 20+ · Git · Nginx · Cloudflare tunnel client
2. **Cloudflare Named Tunnel** — `cdn.artbrow.co.kr` → 선릉 서버 :80 (Nginx)
3. **`/media` 라우팅 분리** — Next.js `next.config.ts` 의 `rewrites` 로 `/media/*` 를 `cdn.artbrow.co.kr` 로
4. **자산 마이그레이션** — 현재 `app-next/public/brand/*` 대용량 이미지 → 선릉 서버 `D:\media\brand\*`
5. **선릉 서버 자동 시작** — Windows 부팅 시 Nginx · Tunnel 자동 실행 (`scripts/install-autostart.ps1` 활용)

### 4-3. 3차 (Day 7+ · 안정화)

1. **선릉 서버 백업** — `D:\media` 를 매일 자정 rsync/robocopy 로 외장 SSD
2. **모니터링** — UptimeRobot 무료 · 선릉·Vercel 각각 5분 간격 헬스체크
3. **RDP 원격 관리** — 대표님이 어디서든 선릉 서버 접속 (Cloudflare Access + WireGuard)

### 4-4. 명시적 제외 (v0.1)

- Vercel Pro 유료 전환 (필요 시 별도 결정)
- Kubernetes · Docker Swarm 등 컨테이너 오케스트레이션 (오버킬)
- 다중 리전 배포 (선릉 하나로 충분)
- 자체 이메일 서버 (아웃룩·Gmail 유지)

## 5. 도메인 · DNS 설계

| 서브도메인 | 대상 | 용도 |
|---|---|---|
| `artbrow.co.kr` | Vercel | 메인 사이트 (Next.js) |
| `www.artbrow.co.kr` | Vercel (301 → 루트) | 리다이렉트 |
| `cdn.artbrow.co.kr` | 선릉 서버 (Cloudflare Named Tunnel) | 이미지·영상 원본 |
| `admin.artbrow.co.kr` | Vercel `/admin` (path or subdomain) | 관리자 (인증 필수) |
| `rdp.artbrow.co.kr` | 선릉 서버 (Cloudflare Access) | 원격 데스크톱 (2차) |

**DNS 등록 방식**:
- 옵션 A: 가비아 DNS 그대로 · A record + CNAME 설정
- 옵션 B (권장): 가비아 네임서버 → Cloudflare 이관 · Cloudflare DNS 관리 (`staris.cloud` 처럼)

## 6. 이관 순서 (실행 계획)

### Day 0 (오늘 저녁)
- [ ] GitHub 리포 생성 (대표님 or 우리)
- [ ] `git init` · 첫 커밋 (`.gitignore` 정비 · secrets 제외 · `_admood.mp4` 등 대용량 제외)
- [ ] 첫 push
- [ ] Vercel 프로젝트 등록 (GitHub 연결 자동)
- [ ] 임시 URL (`artbrows-xxx.vercel.app`) 검증

### Day 1
- [ ] 가비아 → `artbrow.co.kr` A record `76.76.21.21` (Vercel) + CNAME `www` (또는 Cloudflare 이관)
- [ ] Vercel dashboard 도메인 추가 · SSL 자동
- [ ] `.env.local` 값 Vercel Environment Variables 등록
- [ ] 배포 검증

### Day 2~3 (병렬)
- [ ] 선릉 서버 원격 접속 확인 (AnyDesk)
- [ ] Node.js 20+ · Git · Nginx 설치
- [ ] Cloudflare CLI (`cloudflared`) 설치 · `cloudflared tunnel login`
- [ ] Named tunnel 생성 (`cloudflared tunnel create artbrows-cdn`)
- [ ] Cloudflare DNS 에 `cdn.artbrow.co.kr` CNAME (`<tunnel-id>.cfargotunnel.com`)
- [ ] Nginx 설정 (`D:\media` 정적 서빙 · gzip · 캐시 헤더)

### Day 4~5
- [ ] `app-next/public/brand/*` 대용량 파일 → 선릉 `D:\media\brand\*` 이관 (초기 rsync)
- [ ] Next.js `next.config.ts` rewrites 설정:
  ```ts
  async rewrites() {
    return [
      { source: '/media/:path*', destination: 'https://cdn.artbrow.co.kr/:path*' },
    ];
  }
  ```
- [ ] 홈피 이미지 경로 변경 (`/brand/` → `/media/brand/`) · 자동 스크립트 or 순차
- [ ] Vercel 재배포 · 검증

### Day 6~7
- [ ] `scripts/install-autostart.ps1` 실행 (Windows 부팅 시 Nginx + Tunnel 자동)
- [ ] 백업 스크립트 등록 (외장 SSD)
- [ ] UptimeRobot 헬스체크 2개 등록

## 7. 「포트 인식 문제」 해결

**대표님 우려**: KT 회선은 인바운드 포트 개방이 어려움.

**해결**: Cloudflare Named Tunnel = **outbound 연결만 사용**
- 선릉 서버에서 Cloudflare 로 outgoing WebSocket 연결
- Cloudflare 가 이 연결을 통해 요청 프록시
- 방화벽·NAT·ISP 차단 무관하게 뚫림
- HTTPS 자동 · 무료

즉 **포트 개방 불필요**. 대표님 우려 자동 해결.

## 8. 「용량 제한」 답변

**Next.js 코드 자체**: 제한 없음
**Vercel Hobby**:
- 대역폭: 100GB/월
- 함수 실행: 100k회/일
- 이미지 최적화: 1k장/월
- 배포 빌드: 프로젝트당 무제한

**우리 예상 사용량 (오픈 초기 · 일 방문자 100명)**:
- HTML+JS 페이지 로드 = ~500KB × 100 × 30일 = 1.5GB/월 → Vercel 여유
- 이미지 로드 (10장 × 500KB × 100 × 30) = 150GB/월 → **Vercel 초과 · 하이브리드 필수**

**하이브리드 후**:
- HTML+JS = Vercel (1.5GB · 여유)
- 이미지·영상 = 선릉 서버 → Cloudflare 캐시 → **최종 사용자는 Cloudflare 캐시 히트 (선릉 부하 X)**
- Cloudflare 무제한 무료 · 선릉 서버는 초기 로딩만 · SSD 크기 = 저장 한계

## 9. GitHub 하이브리드 정책

**GitHub 에 올릴 것**:
- 모든 코드 (`.ts`, `.tsx`, `.css`, `package.json`, `next.config.ts`, `.env.local.example`)
- 문서 (`docs/`, `README.md`, `CLAUDE.md`)
- 작은 브랜드 자산 (< 500KB · 로고 · 파비콘 · 아이콘)
- 참조용 스크린샷 5장 이내

**GitHub 에 올리지 않을 것** (`.gitignore` 로 제외):
- 대용량 이미지·영상 (`.mp4`, > 2MB `.jpg/.png`)
- `content/leads/*.json` (개인정보 · 별도 백업)
- `.env.local` (secrets)
- `node_modules/`, `.next/`
- 임시 파일 (`.log`, `_temp/`)

**대용량 자산 관리**:
- 선릉 서버 `D:\media\` 가 정본
- 대표님 PC → 선릉 서버 초기 sync (한 번)
- 이후는 대표님이 새 이미지 만들면 선릉에 직접 업로드 (SFTP or AnyDesk)
- 또는 admin 페이지에 「이미지 업로드」 신설 → Vercel API → 선릉 저장 (2차)

## 10. 비용 (월 예상)

| 항목 | 비용 |
|---|---|
| GitHub Private repo (Free plan) | 무료 |
| Vercel Hobby | 무료 (Pro 승격 시 $20/월) |
| Cloudflare (프록시·Named Tunnel) | 무료 |
| 가비아 도메인 (`artbrow.co.kr`) | 연 15,000원 (이미 결제됨) |
| 선릉 서버 전기 (Windows PC 24/7) | 월 2,000~3,000원 (전기료) |
| KT 회선 (이미 사무실 회선) | 별도 청구 없음 |
| **합계 (신규)** | **월 ~3,000원** |

## 11. 리스크 매트릭스

| 리스크 | 확률 | 영향 | 대응 |
|---|---|---|---|
| KT 회선 다운 | 소 | 대 | Vercel 만으로도 사이트 유지 (이미지 없이 fallback) |
| 선릉 서버 전원 차단·정전 | 중 | 대 | UPS (무정전 전원) 도입 · 재부팅 시 자동 시작 |
| 대표님 PC 장애로 코드 손실 | 소 (곧 낮아짐) | 대 | GitHub push 완료 시 해결 |
| Vercel Free 대역폭 초과 | 중 | 중 | Cloudflare 캐시로 90% 오프로드 → 자동 해결 |
| Cloudflare Named Tunnel 서비스 중단 | 매우 소 | 중 | Vercel 이미지 fallback path 유지 |
| DNS 이관 실수로 사이트 다운 | 소 | 대 | DNS TTL 짧게 (300초) · 문제 시 즉시 롤백 |
| 선릉 서버 해킹 (개방 포트 없어도) | 매우 소 | 대 | Cloudflare Access 인증 · Windows Defender · RDP 강력 비번 |

## 12. 결정 대기 항목 (대표님)

1. **GitHub 리포 소유자** = 회사 계정 (`mobydickaquainc-art`) or 대표님 개인 or 우리 조직?
2. **Cloudflare 이관 여부** = 가비아 DNS 그대로 or Cloudflare 로 완전 이관 (staris.cloud 방식)?
3. **선릉 서버 상시 켜기** = 24/7 or 필요 시만? (전원 자동 절약 없이 상시)
4. **초기 이관 시점** = 오늘 저녁 · 내일 · 이번 주말?
5. **`_admood.mp4` 등 기존 대용량 파일** 처리 = 삭제 · 아카이브 · 선릉 이동?

## 13. 관련 문서·자산

- 이관 가이드 정본: `artbrows-platform-py/docs/MIGRATION-2026-07-13.md` (07-13 세션에서 준비)
- 자동 셋업: `artbrows-platform-py/scripts/setup-new-server.ps1`
- 자동 시작: `artbrows-platform-py/scripts/install-autostart.ps1`
- 접속 정보: `_brief/선릉서버-접속정보.md`
- 포트포워딩 가이드: `_brief/포트포워딩-가이드-선릉서버.md` (선릉 서버용 · 하지만 하이브리드에선 불필요)
- 메모리: [[artbrows-dev-mode-only-no-mac-mini]] · [[meeting-2026-07-13-decisions]] · [[artbrows-netlify-deploy]]

---

**승인 요청**: 대표님 §12 5항목 답 주시면 v0.2 확정 · Day 0 오늘 저녁 GitHub 커밋 착수.
