import '@/lib/artbrows/tokens.css';
import '../cardnews.css';
import Link from 'next/link';

export const metadata = {
  title: 'ARTbrows · 카드뉴스 튜토리얼',
  description: '카드뉴스 프로젝트 관리·자동 생성·편집 안내서',
};

const Section = ({ n, title, children }: { n: string; title: string; children: React.ReactNode }) => (
  <section style={sec}>
    <div style={secHead}>
      <span style={secNum}>{n}</span>
      <h2 style={secTitle}>{title}</h2>
    </div>
    <div style={secBody}>{children}</div>
  </section>
);

const Step = ({ i, title, children }: { i: number; title: string; children?: React.ReactNode }) => (
  <div style={stepBox}>
    <div style={stepHead}>
      <span style={stepNum}>{i}</span>
      <strong style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 15, color: 'var(--ab-ivory)' }}>{title}</strong>
    </div>
    {children ? <div style={stepBody}>{children}</div> : null}
  </div>
);

const Tip = ({ children }: { children: React.ReactNode }) => (
  <div style={tip}>
    <span style={{ marginRight: 6, color: 'var(--ab-gold)' }}>💡</span>{children}
  </div>
);

const Kbd = ({ children }: { children: React.ReactNode }) => <code style={kbd}>{children}</code>;

export default function TutorialPage() {
  return (
    <main className="cardnews-page">
      <div className="cn-wrap" style={{ maxWidth: 900 }}>
        <Link href="/cardnews" style={{ fontSize: 11.5, color: 'var(--ab-gold-light)', textDecoration: 'none', letterSpacing: '0.06em' }}>← 카드뉴스 프로젝트</Link>

        <div className="cn-title" style={{ marginTop: 12 }}>카드뉴스 튜토리얼</div>
        <div className="cn-subtitle">How To · 원장님·본부장·직원용 안내서</div>
        <div className="cn-meta">
          이 화면은 <Link href="/cardnews" style={{ color: 'var(--ab-gold-light)', textDecoration: 'underline' }}>카드뉴스 프로젝트</Link> 대시보드 사용 방법을 정리한 안내서입니다.<br />
          <b>2026-07-17 기준 · 오늘 만든 기능 전수 반영</b> · 원장님 정본 톤 (딥 블랙+골드+아이보리 · 명조체 · 「결·손끝·무게」) 준수.
        </div>

        {/* ─────────── 0. 개요 ─────────── */}
        <Section n="00" title="이 시스템은 무엇인가">
          <p>인스타·카톡·위챗에 게시할 <b>카드뉴스 콘텐츠</b> 를 프로젝트 단위로 관리합니다.</p>
          <ul style={ul}>
            <li>한 프로젝트 = 하나의 카드뉴스 세트 (예: 「14기 이지클래스 모집」 · 6~12장 슬라이드)</li>
            <li>3 언어 (한국어 · English · 中文) 각각 별도 슬라이드 세트 유지</li>
            <li>저장 = 프로젝트마다 하나의 JSON 파일 (<Kbd>content/cardnews/{'{'}id{'}'}.json</Kbd>) · git 관리 · 언제든 편집·복제·삭제</li>
            <li>AI 자동 생성 → 편집자 검수 → 게시 흐름 (원장님·본부장이 골라 확정)</li>
          </ul>
          <Tip>모든 색·폰트는 <Link href="/cardnews/layouts" style={{ color: 'var(--ab-gold-light)' }}>원장님 정본 6톤 팔레트</Link>만 사용 · 임의 컬러 X · 원장님 톤 통일 자동.</Tip>
        </Section>

        {/* ─────────── 1. 대시보드 ─────────── */}
        <Section n="01" title="대시보드 (프로젝트 목록)">
          <p><Link href="/cardnews" style={link}>/cardnews</Link> 접속 → 저장된 프로젝트 목록. 각 행:</p>
          <ul style={ul}>
            <li><b>제목 · ID</b> — 클릭 시 편집기</li>
            <li><b>상태</b> — 작성 중 / 게시 / 보관</li>
            <li><b>언어 pill</b> — KO/EN/中 각 언어별 슬라이드 수 (골드 테두리 = 기본 언어)</li>
            <li><b>수정일</b></li>
            <li><b>작업 버튼</b>: [편집] [미리보기] [내보내기] [복제] [보관] [🗑 삭제]</li>
          </ul>
          <p>상단 3 버튼:</p>
          <Step i={1} title="[+ 새 프로젝트]">
            제목 입력 → 클릭 → 빈 프로젝트 생성 → 편집기 자동 진입.
          </Step>
          <Step i={2} title="[↑ JSON 가져오기]">
            로컬에 있는 카드뉴스 JSON 파일을 선택 → 프로젝트로 등록. 팀 간 공유·백업 복원용.
          </Step>
          <Step i={3} title="[🪄 자동 생성]">
            AI 모델이 카드뉴스 세트를 자동 생성 (§03 참조).
          </Step>
          <Tip>대시보드 상단 우측 <b>[📖 튜토리얼]</b> 버튼 = 이 페이지.</Tip>
        </Section>

        {/* ─────────── 2. 편집기 ─────────── */}
        <Section n="02" title="편집기 (프로젝트 편집)">
          <p>대시보드에서 [편집] 클릭 → 3 분할 화면.</p>
          <Step i={1} title="상단 툴바">
            <ul style={ul}>
              <li>제목 (인라인 편집 · 클릭해서 수정)</li>
              <li>DEFAULT 언어 · 상태 (작성 중/게시/보관) 드롭다운</li>
              <li>[미리보기 ↗] · [저장] · <b style={{ color: '#E8B0B0' }}>[🗑 삭제]</b></li>
              <li>수정 후 저장 안 하면 「● 저장 안 됨」 · 저장하면 「✓ 저장됨」</li>
            </ul>
          </Step>
          <Step i={2} title="언어 탭 (KO / EN / 中)">
            <ul style={ul}>
              <li>탭 클릭 → 그 언어의 슬라이드 세트로 전환</li>
              <li>기본 언어(KO) 아닐 때 <b>[⇥ 한국어에서 복사]</b> 버튼 → 기본 언어 슬라이드 전체 복제 (번역 초안 시작 편함)</li>
              <li>언어별 제목 입력 필드도 함께 (미리보기 상단 표시용 · 선택)</li>
            </ul>
          </Step>
          <Step i={3} title="좌 · 슬라이드 리스트">
            <ul style={ul}>
              <li>순서대로 슬라이드 카드 · 클릭 → 편집 중 슬라이드 전환</li>
              <li>각 카드 하단: [↑ 위로] [↓ 아래로] [× 삭제]</li>
              <li>맨 아래 [+ 슬라이드 추가]</li>
            </ul>
          </Step>
          <Step i={4} title="중 · 폼 (kind별 필드)">
            <ul style={ul}>
              <li><b>레이아웃 kind</b> 드롭다운 · 12종 (§05 참조)</li>
              <li><b>카테고리 (6톤)</b> 드롭다운 · 각 슬라이드의 배경·톤 결정 (§04 참조)</li>
              <li>kind 별로 필요한 필드 자동 표시 (예: cover-founder = eyebrow · headline · highlight · quote · imageSrc 등)</li>
              <li>이미지 필드 옆 <b>[📁 업로드]</b> 버튼 → 로컬 이미지 선택 → 자동 업로드 (15MB 제한) → 경로 자동 입력 → 미리보기 썸네일 표시</li>
              <li><b>[×]</b> = 경로 지우기</li>
            </ul>
          </Step>
          <Step i={5} title="우 · 실시간 미리보기">
            <ul style={ul}>
              <li>편집 즉시 반영되는 슬라이드 렌더 (실제 인스타 크기 4:5)</li>
              <li>하단 라벨: <Kbd>KO · COVER-FOUNDER · 원장 컷</Kbd></li>
              <li>자동 생성 프로젝트일 때 <b>🪄 AI 대안 안 카드</b> 표시 (§03-6 참조)</li>
            </ul>
          </Step>
        </Section>

        {/* ─────────── 3. 자동 생성 ─────────── */}
        <Section n="03" title="🪄 자동 생성 (AI 파이프라인)">
          <p>대시보드 [🪄 자동 생성] 클릭 → 4-스텝 위저드.</p>
          <Step i={1} title="설정 (setup)">
            <ul style={ul}>
              <li><b>목적 · 시리즈명</b>: 예 「15기 이지클래스 모집」 · 「9월 시술 후기」 · 「브랜드 무드 시리즈」</li>
              <li><b>언어</b>: KO · EN · 中 중 하나 (그 언어 슬라이드만 생성)</li>
              <li><b>슬라이드 수</b>: 4~12장</li>
              <li>
                <b>스타일 (10 프리셋)</b>:
                <ol style={{ ...ul, listStyle: 'decimal', paddingLeft: 22 }}>
                  <li><b>ARTbrows 정본 (기본)</b> — 원장님 정본 톤 · 「결·손끝·무게」</li>
                  <li>Minimal Editorial — 여백 · 조용</li>
                  <li>Bold Question — 질문형 후크</li>
                  <li>Numbered Steps — 스텝 · 넘버</li>
                  <li>Quote Focus — 인용 · 격언</li>
                  <li>Before / After — 결과 대비</li>
                  <li>Data Card — 숫자·통계</li>
                  <li>Poem / Verse — 시적 · 감성</li>
                  <li>Announcement — 공지 · 확실한 CTA</li>
                  <li><b>🔴 LIVE · 지금 최신 트렌드 조사</b> — 실시간 Gemini/OpenAI 조사 (기존 자동 방식 · 15~20초 추가)</li>
                </ol>
              </li>
              <li>
                <b>모델 선택 (최대 2개 · 병렬)</b>:
                <ul style={ul}>
                  <li>Gemini 2.5 Flash · Google Search · 중국어 강점</li>
                  <li>OpenAI GPT-4o · 창의성 · 다양성</li>
                  <li>Claude Sonnet 4.5 · 브랜드 톤 유지 (API 키 필요 · 지금은 회색)</li>
                </ul>
              </li>
              <li>
                <b>옵션</b>: 벤치마크 5장 자동 분석 (Gemini Vision · 참고 폴더 <Kbd>public/brand/ref/</Kbd> 5장 스타일 자동 요약)
              </li>
            </ul>
            <p>[🪄 생성 시작] 클릭.</p>
          </Step>
          <Step i={2} title="준비 (preparing · 10~20초)">
            트렌드 힌트 + 스켈레톤 결정 (12종 레이아웃 × 6톤 카테고리 매트릭스 · 스타일리스트 AI 판단).
          </Step>
          <Step i={3} title="슬라이드 팝업 (한 장씩 · 반복)">
            <ul style={ul}>
              <li>슬라이드 하나 완성될 때마다 팝업 등장 · 2 모델 안 나란히 (선택된 2 모델이면)</li>
              <li>클릭 → 골드 테두리 선택</li>
              <li><b>[다음 슬라이드 → (Xs)]</b> = 그 안 확정 · 다음 슬라이드 생성 요청</li>
              <li><b>[여기까지 저장]</b> = 지금까지 확정된 슬라이드로 프로젝트 저장 · 편집기 이동</li>
              <li><b>20초 카운트다운 · 답 없으면 자동 [다음]</b> (설정 시간 · 방치해도 완성됨)</li>
            </ul>
          </Step>
          <Step i={4} title="저장 (saving) · 편집기 자동 이동">
            프로젝트가 대시보드 목록에 등장 · 편집기에서 검수·수정 시작.
          </Step>
          <Step i={5} title="🪄 AI 대안 안 카드 (편집기)">
            자동 생성 프로젝트는 각 슬라이드마다 「대안 안」 저장됨. 편집기 우측 미리보기 하단에 카드로 표시:
            <ul style={ul}>
              <li>선택한 안 = <b>● GEMINI · 현재</b> (골드 테두리)</li>
              <li>다른 안 = <b>○ OPENAI</b> · 클릭 → confirm → 슬라이드 즉시 교체</li>
              <li>하단에 「왜 이 조합인가」 스타일리스트 코멘트 (이탤릭)</li>
            </ul>
          </Step>
          <Tip>스타일 프리셋 사용 시 트렌드 조사 스킵 → <b>10~15초 단축</b> (대량 생성 시 유리). 「지금 최신 트렌드 조사」 = 매번 새 조사 (매체 최신 트렌드 반영).</Tip>
        </Section>

        {/* ─────────── 4. 6톤 카테고리 ─────────── */}
        <Section n="04" title="6톤 카테고리 (원장님 정본)">
          <p>모든 슬라이드는 6가지 카테고리 중 하나. 카테고리 = 배경·톤·용도 자동 결정.</p>
          <table style={tbl}>
            <thead><tr><th style={th}>카테고리</th><th style={th}>배경</th><th style={th}>용도</th></tr></thead>
            <tbody>
              <tr><td style={td}><b>treatment</b></td><td style={td}>다크 챠콜</td><td style={td}>시술 결과 Before/After</td></tr>
              <tr><td style={td}><b>founder</b></td><td style={td}>뉴트럴 베이지</td><td style={td}>원장 컷 · 브랜드 무드</td></tr>
              <tr><td style={td}><b>review</b></td><td style={td}>딥 버건디</td><td style={td}>고객 후기 텍스트카드</td></tr>
              <tr><td style={td}><b>classroom</b></td><td style={td}>딥 세이지</td><td style={td}>교육 현장 · 클래스 컷</td></tr>
              <tr><td style={td}><b>detail</b></td><td style={td}>밝은 아이보리</td><td style={td}>디테일 클로즈업 · 눈썹</td></tr>
              <tr><td style={td}><b>reels</b></td><td style={td}>미디엄 챠콜</td><td style={td}>릴스 썸네일</td></tr>
            </tbody>
          </table>
          <p><b>주간 콘텐츠 필러 배분 (원장님 정본)</b>: Before/After 40% · 교육 20% · 브랜드 무드 15% · 후기 15% · 릴스 10%</p>
        </Section>

        {/* ─────────── 5. 12종 레이아웃 ─────────── */}
        <Section n="05" title="12종 레이아웃 (kind)">
          <p>각 슬라이드는 12종 레이아웃 중 하나. 자동 생성 시 스타일리스트 AI 가 선택 · 편집기에서 kind 변경 가능.</p>
          <ol style={{ ...ul, listStyle: 'decimal', paddingLeft: 22 }}>
            <li><b>cover-founder</b> — 커버 · 인물+헤드+인용</li>
            <li><b>number-big</b> — 큰 넘버 + 헤드</li>
            <li><b>icon-duo</b> — 아이콘 2개 카드</li>
            <li><b>icon-trio</b> — 아이콘 3개 카드</li>
            <li><b>checklist</b> — 골드 체크 리스트</li>
            <li><b>portrait-frame</b> — 전면 인물 사진</li>
            <li><b>product-hero</b> — 상단 이미지 + 하단 카피</li>
            <li><b>quote-bold</b> — 큰 이탤릭 인용</li>
            <li><b>signature-style</b> — Brand Concept + Signature Style</li>
            <li><b>curriculum-row</b> — 회차 리스트</li>
            <li><b>price-table</b> — 가격 명조 + 조건</li>
            <li><b>closing-cta</b> — 마무리 · 시그니처 + CTA</li>
          </ol>
          <p>실제 렌더 예시: <Link href="/cardnews/layouts" style={link}>12종 데모 갤러리</Link></p>
        </Section>

        {/* ─────────── 6. 미리보기·게시 ─────────── */}
        <Section n="06" title="미리보기 · 게시">
          <p>편집기 상단 [미리보기 ↗] 클릭 → 완성본 갤러리.</p>
          <ul style={ul}>
            <li>URL: <Kbd>/cardnews/view/{'{'}id{'}'}?lang=ko|en|zh</Kbd></li>
            <li>상단 언어 스위처 (KO/EN/中 각 슬라이드 수 표시 · 빈 언어 회색)</li>
            <li>슬라이드 그리드 · 인스타 4:5 비율</li>
          </ul>
          <p>지금은 <b>PNG 저장·자동 게시 미구현</b>. 각 슬라이드 <b>스크린샷</b> 이나 <b>브라우저 인쇄 → PDF</b> 로 임시 저장 → 인스타 수동 업로드.</p>
          <Tip>PNG 자동 저장·인스타 API 자동 게시는 R4~R5 라운드 (SaaS B · 자동 포스팅 축) 에서 구현 예정.</Tip>
        </Section>

        {/* ─────────── 7. 백업·공유 ─────────── */}
        <Section n="07" title="백업 · 공유 (JSON export/import)">
          <ul style={ul}>
            <li>대시보드 각 행 <b>[내보내기]</b> → <Kbd>cardnews-{'{'}id{'}'}.json</Kbd> 파일 다운로드</li>
            <li>이 파일을 이메일·카톡·클라우드로 공유 · 다른 PC 에서 <b>[↑ JSON 가져오기]</b> 로 복원 가능</li>
            <li><b>[복제]</b> = 같은 프로젝트를 이 PC 안에서 사본으로 (예: 14기 → 15기 재작성)</li>
          </ul>
          <Tip>실제 파일 위치: <Kbd>D:\work\jangmi\artbrows-project\app-next\content\cardnews\{'{'}id{'}'}.json</Kbd> · 파일 직접 편집도 가능.</Tip>
        </Section>

        {/* ─────────── 8. 삭제·보관 ─────────── */}
        <Section n="08" title="삭제 · 보관">
          <ul style={ul}>
            <li><b>[보관]</b> = 상태를 「보관」 으로 변경 (파일은 유지 · 목록에서 흐리게)</li>
            <li>보관 상태에서 <b>[완전삭제]</b> = 파일 완전 삭제 (되돌릴 수 없음)</li>
            <li>또는 대시보드 draft 상태에서 즉시 <b>[🗑 삭제]</b> = 확인 후 완전 삭제</li>
            <li>편집기 상단 우측 <b>[🗑 삭제]</b> = 편집 중 즉시 삭제 · confirm 후 대시보드 이동</li>
          </ul>
          <Tip>실수 방지 · 완전삭제 전 <b>[내보내기]</b> 로 JSON 백업 권장.</Tip>
        </Section>

        {/* ─────────── 9. 자주 묻는 문제 ─────────── */}
        <Section n="09" title="자주 묻는 문제 (FAQ)">
          <Step i={1} title="Q. 「불러오는 중…」 만 나오고 목록 안 나옴">
            <ul style={ul}>
              <li>대부분 브라우저 캐시 문제 · <Kbd>Ctrl + Shift + R</Kbd> 강제 새로고침</li>
              <li>안 되면 dev 서버 재시작 (터미널에서 <Kbd>Ctrl+C</Kbd> → <Kbd>npm run dev</Kbd>)</li>
            </ul>
          </Step>
          <Step i={2} title="Q. 자동 생성이 안 됨 · API 키 없음">
            <ul style={ul}>
              <li>Gemini · OpenAI API 키가 <Kbd>.env.local</Kbd> 에 있어야 함 · dev 서버 재시작 필요</li>
              <li>Claude 키는 선택 (없어도 다른 2 모델로 작동)</li>
            </ul>
          </Step>
          <Step i={3} title="Q. 자동 생성 결과에 <gold> 같은 태그가 텍스트로 나옴">
            자동 sanitizer 가 제거하지만 드물게 새 태그 발견 시 편집기에서 수동 수정. <Kbd>src/lib/cardnews-agents/sanitize.ts</Kbd> 에 태그 이름 추가 가능.
          </Step>
          <Step i={4} title="Q. 슬라이드 순서 바꾸면 대안 안이 어긋남">
            자동 생성 시 원래 순서 기준 저장 · 순서 변경 후에는 대안 안 매칭이 어긋날 수 있음. 순서 결정 후 대안 교체 권장. (개선 예정)
          </Step>
          <Step i={5} title="Q. 프로덕션(라이브 도메인) 에서 편집·저장이 안 됨">
            <ul style={ul}>
              <li>카드뉴스 시스템은 <b>로컬 파일 시스템 기반</b> · Vercel serverless 는 파일 쓰기 불가</li>
              <li>편집·자동 생성은 dev 서버 (로컬 or 연구소 PC) 에서만</li>
              <li>07-13 회의 계획: 연구소 PC + Cloudflare Named Tunnel 로 노출 예정</li>
            </ul>
          </Step>
        </Section>

        <div style={{ marginTop: 60, padding: 20, borderTop: '1px solid var(--ab-gold-line)', fontSize: 11, color: 'var(--ab-text-muted)', textAlign: 'center', letterSpacing: '0.05em' }}>
          문서 갱신: 2026-07-18 · 정본: <Kbd>src/app/cardnews/tutorial/page.tsx</Kbd>
        </div>
      </div>
    </main>
  );
}

// ─────────── 스타일 ───────────
const sec: React.CSSProperties = { marginTop: 40, paddingBottom: 20, borderBottom: '1px solid var(--ab-line-soft)' };
const secHead: React.CSSProperties = { display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 16 };
const secNum: React.CSSProperties = { fontFamily: 'var(--ab-font-body-latin)', fontSize: 11, letterSpacing: '0.3em', color: 'var(--ab-gold)', fontWeight: 700 };
const secTitle: React.CSSProperties = { fontFamily: 'var(--ab-font-headline)', fontSize: 22, fontWeight: 800, color: 'var(--ab-ivory)', margin: 0 };
const secBody: React.CSSProperties = { fontSize: 14, lineHeight: 1.75, color: 'var(--ab-text-soft)' };
const stepBox: React.CSSProperties = { marginTop: 14, padding: '12px 14px', border: '1px solid var(--ab-line)', borderRadius: 5, background: '#0F0D0B' };
const stepHead: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 10 };
const stepNum: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', background: 'var(--ab-gold)', color: 'var(--ab-black)', fontSize: 11, fontWeight: 800, fontFamily: 'var(--ab-font-body-latin)' };
const stepBody: React.CSSProperties = { marginTop: 8, fontSize: 13, color: 'var(--ab-text-soft)', lineHeight: 1.65 };
const ul: React.CSSProperties = { paddingLeft: 22, margin: '6px 0', lineHeight: 1.8 };
const link: React.CSSProperties = { color: 'var(--ab-gold-light)', textDecoration: 'underline' };
const kbd: React.CSSProperties = { fontFamily: 'var(--ab-font-body-latin)', fontSize: 11.5, padding: '2px 6px', background: '#161311', border: '1px solid var(--ab-line)', borderRadius: 3, color: 'var(--ab-gold-light)' };
const tip: React.CSSProperties = { marginTop: 12, padding: '10px 14px', background: 'rgba(201, 166, 107, 0.08)', border: '1px solid var(--ab-gold-line)', borderRadius: 4, fontSize: 12.5, color: 'var(--ab-ivory)' };
const tbl: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: 12, fontSize: 12.5 };
const th: React.CSSProperties = { textAlign: 'left', padding: '8px 10px', borderBottom: '1px solid var(--ab-gold-line)', color: 'var(--ab-gold)', letterSpacing: '0.1em', fontFamily: 'var(--ab-font-body-latin)', fontSize: 10.5, textTransform: 'uppercase', fontWeight: 700 };
const td: React.CSSProperties = { padding: '8px 10px', borderBottom: '1px solid var(--ab-line-soft)', color: 'var(--ab-text-soft)' };
