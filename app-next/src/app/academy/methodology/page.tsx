/**
 * 극사실눈썹 방법론 (Master Method) · 원장 시그니처 페이지
 * 2026-07-20 · 26artbrows.pdf 117p 강의 자료 흡수 (사용자 지시 옵션 B)
 * URL: /academy/methodology
 */
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '극사실눈썹 방법론 · 결의 법칙 1234321 | ARTBROWS',
  description: '장미지 원장 26년 노하우 · 결의 법칙 1234321 · 극사실 단선 3구간 · 특허 3장 · 극사실 머신 · 인증 색소 A0-A3. 극사실눈썹의 정본 방법론.',
};

const SECTION = { padding: '90px 0', borderTop: '1px solid var(--line)' } as const;
const WRAP = { maxWidth: 1120, marginInline: 'auto', padding: '0 24px' } as const;
const MARK = { fontFamily: 'var(--ab-font-body-latin)', fontSize: 10.5, letterSpacing: '0.32em', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: 14 };
const H2 = { fontFamily: 'var(--ab-font-headline)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.25, color: 'var(--gold-light)', marginBottom: 18 };
const P = { fontSize: 15, lineHeight: 1.85, color: 'var(--text-soft)', maxWidth: 680 };
const CARD = { padding: '28px 24px', border: '1px solid var(--gold-line)', background: 'var(--bg-card)' };

export default function MethodologyPage() {
  return (
    <main style={{ background: 'var(--bg-deep)', color: 'var(--text)', minHeight: '100vh' }}>

      {/* 참고용 안내 배지 · 2026-07-20 사용자 지시 · 원장님 최종 정리 대기 */}
      <div style={{ padding: '14px 24px', background: 'rgba(176,136,98,0.08)', borderBottom: '1px solid var(--gold-line)' }}>
        <div style={{ ...WRAP, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 12, color: 'var(--gold-light)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--gold)', letterSpacing: '0.15em', fontFamily: 'var(--ab-font-body-latin)', fontSize: 10, textTransform: 'uppercase' }}>DRAFT · 참고용</strong>
            <span style={{ marginLeft: 10 }}>원장님 자료 「깔끔하게 정리」 진행 중 · 콘텐츠는 원장님 최종 검토 후 확정</span>
          </div>
        </div>
      </div>

      {/* NAV crumb */}
      <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--line)', fontFamily: 'var(--ab-font-body-latin)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--gold)', textTransform: 'uppercase' }}>
        <div style={WRAP}>
          <Link href="/" style={{ color: 'var(--gold)', textDecoration: 'none' }}>ARTBROWS</Link>
          <span style={{ opacity: 0.4, margin: '0 12px' }}>/</span>
          <Link href="/#academy" style={{ color: 'var(--gold-light)', textDecoration: 'none' }}>ACADEMY</Link>
          <span style={{ opacity: 0.4, margin: '0 12px' }}>/</span>
          <span style={{ color: 'var(--ivory)' }}>METHODOLOGY (DRAFT)</span>
        </div>
      </div>

      {/* HERO · 결의 법칙 1234321 */}
      <section style={{ padding: '120px 24px 100px', textAlign: 'center', background: 'radial-gradient(ellipse at center top, rgba(176,136,98,0.10), transparent 60%)' }}>
        <div style={{ ...MARK, marginBottom: 22 }}>MASTER METHOD · SINCE 2000</div>
        <h1 style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 'clamp(44px, 8vw, 84px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.02em', color: 'var(--ivory)', marginBottom: 22 }}>
          결의 법칙<br /><span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>1234321</span>
        </h1>
        <div style={{ fontFamily: 'var(--ab-font-headline)', fontStyle: 'italic', fontSize: 'clamp(16px, 2.2vw, 22px)', color: 'var(--text-soft)', maxWidth: 640, marginInline: 'auto', lineHeight: 1.6, marginBottom: 34 }}>
          장미지 원장 26년 노하우 · 극사실눈썹의 정본 방법론<br />
          「고객이 원하는 것은 그린 눈썹이 아니라 털 같은 눈썹이다」
        </div>
        <div style={{ display: 'inline-flex', gap: 20, alignItems: 'center' }}>
          <hr style={{ width: 80, height: 1, background: 'var(--gold)', border: 'none' }} />
          <span style={{ fontFamily: 'var(--ab-font-signature)', fontSize: 30, color: 'var(--gold)' }}>Miji Jang</span>
          <hr style={{ width: 80, height: 1, background: 'var(--gold)', border: 'none' }} />
        </div>
      </section>

      {/* 원장 연혁 */}
      <section style={SECTION}>
        <div style={WRAP}>
          <div style={MARK}>SINCE 2000 · 원장 연혁</div>
          <h2 style={H2}>26년 시술 · 6년 아카데미 · 4년 극사실 정본</h2>
          <p style={P}>2000년 시술 시작 이래 5,000회 이상 · 900여명 수강생 배출 · 창업 수백여명. 2019년 「극사실」 개념을 한국 최초 정립 후 특허 3장으로 기법·상표·머신을 모두 인증.</p>
          <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {[
              { y: '2012', t: '반영구 시작', d: '기초 · 원장 커리어의 출발' },
              { y: '2019', t: '야생눈썹 한국 최초 도입', d: '극사실 개념 정립' },
              { y: '2024', t: '(주)미지아카데미 법인 설립', d: '체계적 커리큘럼 완성' },
              { y: '2025', t: '특허·상표·MOU·표창', d: '3장 특허 · 국내 유일' },
              { y: '2026', t: '창업반 890 · 강사반 · AI', d: '통합 프리미엄 브랜드' },
            ].map((y) => (
              <div key={y.y} style={CARD}>
                <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 26, color: 'var(--gold)', fontWeight: 500, marginBottom: 8 }}>{y.y}</div>
                <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 15, color: 'var(--ivory)', marginBottom: 6, fontWeight: 700 }}>{y.t}</div>
                <div style={{ fontSize: 12, color: 'var(--text-soft)', lineHeight: 1.6 }}>{y.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 결의 법칙 · 원리 */}
      <section style={{ ...SECTION, background: 'var(--bg-card)' }}>
        <div style={WRAP}>
          <div style={MARK}>PRINCIPLE 01 · 결의 법칙</div>
          <h2 style={H2}>「1234321」 · 손이 리듬을 기억할 때<br />진짜 눈썹이 태어난다</h2>
          <p style={P}>결 방향과 농도의 대칭 리듬. 시작(1) → 서서히 진해지는 상승(2·3) → 정점(4) → 다시 서서히 옅어지는 하강(3·2·1). 이 대칭 안에서 자연 눈썹의 흐름이 재현된다.</p>
          <div style={{ marginTop: 44, padding: '38px 28px', border: '1px solid var(--gold-deep)', background: 'var(--bg-deep)', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 'clamp(48px, 10vw, 110px)', color: 'var(--gold)', letterSpacing: '0.08em', fontWeight: 400 }}>1 · 2 · 3 · 4 · 3 · 2 · 1</div>
            <div style={{ marginTop: 20, fontFamily: 'var(--ab-font-body-latin)', fontSize: 11, letterSpacing: '0.28em', color: 'var(--gold-light)', textTransform: 'uppercase' }}>
              START · RISE · PEAK · RETURN · END
            </div>
          </div>
        </div>
      </section>

      {/* 극사실 단선 3구간 */}
      <section style={SECTION}>
        <div style={WRAP}>
          <div style={MARK}>PRINCIPLE 02 · 극사실 단선 3구간</div>
          <h2 style={H2}>털의 합 · 3층이 하나로</h2>
          <p style={P}>하나의 눈썹은 하나의 선이 아니다. 세 가지 길이의 단선이 층을 이루며 겹칠 때 자연 눈썹이 완성된다.</p>
          <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
            {[
              { n: '주요선', l: '3~4mm', d: '중심 결 · 밀도 최대 · 눈썹의 뼈대' },
              { n: '보조선', l: '1.5~2.5mm', d: '층 사이 · 자연스러운 연결' },
              { n: '솜털', l: '0.5~1mm', d: '디테일 · 눈썹 가장자리 · 자연 표현' },
            ].map((s) => (
              <div key={s.n} style={CARD}>
                <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 10, letterSpacing: '0.3em', color: 'var(--gold)', marginBottom: 10, textTransform: 'uppercase' }}>{s.n}</div>
                <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 32, color: 'var(--gold-light)', marginBottom: 12, fontWeight: 300 }}>{s.l}</div>
                <div style={{ fontSize: 13, color: 'var(--text-soft)', lineHeight: 1.7 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 디자인 4단계 */}
      <section style={{ ...SECTION, background: 'var(--bg-card)' }}>
        <div style={WRAP}>
          <div style={MARK}>PRINCIPLE 03 · 디자인 4단계</div>
          <h2 style={H2}>설계 · 4 STEPS to Real</h2>
          <p style={P}>1234321을 얼굴 위에 얹기 전 · 반드시 거쳐야 하는 4개의 설계 단계.</p>
          <div style={{ marginTop: 44 }}>
            {[
              { n: '01', t: '테두리 잡기', d: '시술 영역 지정 · 프레임 · 얼굴 균형의 시작' },
              { n: '02', t: '모류선 그리기', d: '결의 방향 결정 · 흐름의 스케치 · 1234321을 어디서 시작할지' },
              { n: '03', t: '시술결 그리기', d: '3구간 단선을 리듬대로 · 3~4mm 주요 · 1.5~2.5 보조 · 0.5~1 솜털' },
              { n: '04', t: '테두리 제거·확인', d: '프레임 지우고 · 자연 결만 남긴다 · 원장 최종 검수' },
            ].map((s) => (
              <div key={s.n} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 24, padding: '28px 0', borderTop: '1px solid var(--line)', alignItems: 'baseline' }}>
                <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 44, color: 'var(--gold)', fontWeight: 300 }}>{s.n}</div>
                <div>
                  <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 22, color: 'var(--ivory)', marginBottom: 8 }}>{s.t}</div>
                  <div style={{ fontSize: 14, color: 'var(--text-soft)', lineHeight: 1.7 }}>{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 원장 측정 규격 */}
      <section style={SECTION}>
        <div style={WRAP}>
          <div style={MARK}>DESIGN GRID · 원장 규격</div>
          <h2 style={H2}>측정 없이 · 자연은 없다</h2>
          <p style={P}>얼굴의 좌표를 잡는 원장의 정밀 규격. 눈썹의 시작·산·꼬리 위치를 밀리미터 단위로 통제한다.</p>
          <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {[
              { k: '6cm', d: '총 눈썹 길이 기준' },
              { k: '3.7cm', d: '얼굴 중앙 → 눈동자 끝' },
              { k: '1/4 · 1/2 · 1/4', d: '앞머리 · 산 · 뒤 비율' },
              { k: '1/3', d: '꼬리 각도 하강' },
              { k: '0.5cm', d: '3cm 지점 위 수평선 오프셋' },
              { k: '1.3 · 1', d: '상단 · 미간 두께' },
            ].map((m) => (
              <div key={m.k} style={{ ...CARD, textAlign: 'center', padding: '22px 16px' }}>
                <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 22, color: 'var(--gold-light)', marginBottom: 8, fontWeight: 300 }}>{m.k}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-soft)', lineHeight: 1.6 }}>{m.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 특허 3장 */}
      <section style={{ ...SECTION, background: 'var(--bg-card)' }}>
        <div style={WRAP}>
          <div style={MARK}>PATENT · 국내 유일 인증 3장</div>
          <h2 style={H2}>기법 · 상표 · 머신 · 모두 원장 등록</h2>
          <p style={P}>극사실이라는 개념 · ARTbrow 라는 이름 · 극사실 머신이라는 도구 · 세 가지 모두 원장 본인이 등록한 특허.</p>
          <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { i: '①', k: '특허 10-2639903', t: '극사실 기법', d: '「진짜 눈썹」의 결·리듬·명도를 재현하는 기법 · 원장 개발' },
              { i: '②', k: '상표 40-2300477', t: 'ARTbrow', d: '브랜드명 상표 등록 · 국내에서 유일하게 이 이름 사용 가능' },
              { i: '③', k: '특허 10-2863985', t: '극사실 머신', d: '일반캡 · 샤프캡 · 핸들 3부품 특허 · 자석·2중 안전·다이아몬드 커팅' },
            ].map((p) => (
              <div key={p.k} style={CARD}>
                <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 42, color: 'var(--gold)', marginBottom: 12, fontWeight: 400 }}>{p.i}</div>
                <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 10.5, letterSpacing: '0.22em', color: 'var(--gold-light)', marginBottom: 10, textTransform: 'uppercase', fontWeight: 700 }}>{p.k}</div>
                <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 18, color: 'var(--ivory)', marginBottom: 10 }}>{p.t}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-soft)', lineHeight: 1.7 }}>{p.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 극사실 머신 3부품 */}
      <section style={SECTION}>
        <div style={WRAP}>
          <div style={MARK}>PATENT MACHINE · 10-2863985</div>
          <h2 style={H2}>ARTbrow 머신 · 3부품의 정밀함</h2>
          <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { t: '일반캡', d: '니들 미세 조절 · 색소 역류방지 이중캡 · 투명캡으로 잔량 실시간 확인 · 모래시계 흐름 · 2중 안전 구조' },
              { t: '샤프캡', d: '피부 침투 깊이를 물리적으로 제한 · 정확한층(0.4~1.6mm) 유지 · 2중 안전 · 초보도 안정 시술' },
              { t: '핸들', d: '자석 흡착 캡 · 과학적 발열방지 설계 · 니들 지지대 · 다이아몬드 커팅 슬림 외관' },
              { t: 'SAFETY', d: '2중 안전 구조 · 감염 방지 · 니들 재사용 절대 금지 · 원장 손끝의 30년 신뢰' },
            ].map((p) => (
              <div key={p.t} style={CARD}>
                <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 20, color: 'var(--gold-light)', marginBottom: 12, fontWeight: 500 }}>{p.t}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-soft)', lineHeight: 1.75 }}>{p.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 인증 색소 A0-A3 */}
      <section style={{ ...SECTION, background: 'var(--bg-card)' }}>
        <div style={WRAP}>
          <div style={MARK}>COLOR · 인증 색소 4종</div>
          <h2 style={H2}>양주시 보건소 등록 · 위생용품 품목제조</h2>
          <p style={P}>색소도 공인이 필요하다. 원장이 사용하는 4종은 모두 정식 등록된 위생용품.</p>
          <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {[
              { k: 'A0', t: '솔루션', d: '원액 진하므로 농도 조절 · 진정 랩핑' },
              { k: 'A1', t: '브라운', d: '밝은 자연 · 청담 시크' },
              { k: 'A2', t: '딥브라운', d: '중간톤 · 매혹적 깊이' },
              { k: 'A3', t: '블랙브라운', d: '짙은 마감 · 프리미엄 존재감' },
            ].map((c) => (
              <div key={c.k} style={{ ...CARD, padding: '26px 20px' }}>
                <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 12, letterSpacing: '0.28em', color: 'var(--gold)', marginBottom: 10, fontWeight: 700 }}>{c.k}</div>
                <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 22, color: 'var(--ivory)', marginBottom: 10, fontWeight: 500 }}>{c.t}</div>
                <div style={{ fontSize: 12, color: 'var(--text-soft)', lineHeight: 1.7 }}>{c.d}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 26, padding: '20px 24px', border: '1px solid var(--gold-line)', background: 'var(--bg-deep)', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 10.5, letterSpacing: '0.22em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>배합 레시피 · 원장 정본</div>
            <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 16, color: 'var(--gold-light)', lineHeight: 1.7 }}>
              디자인터치 = 색소 6방울 + 솔루션 4방울<br />
              질감터치 = 색소 6방울 + 솔루션 1방울
            </div>
          </div>
        </div>
      </section>

      {/* 진단 프레임워크 */}
      <section style={SECTION}>
        <div style={WRAP}>
          <div style={MARK}>DIAGNOSIS · 진단 프레임워크</div>
          <h2 style={H2}>얼굴 · 피부 · 스타일 · 3축 진단</h2>
          <p style={P}>같은 눈썹은 없다. 원장은 세 개의 축으로 각 고객을 진단하고 설계한다.</p>
          <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { k: '8 스타일 진단', a: '곡선감 ↔ 직선감', b: '소량감 ↔ 대량감', c: '소녀 · 소년 · 우아 · 전위 · 낭만 · 고전 · 연극 · 자연' },
              { k: '피부톤 색 매칭', a: '브라운 ↔ 그레이', b: '연함 ↔ 진함', c: '부드럽고 따뜻 · 건강하고 세련 · 맑고 깨끗 · 도시적 시크' },
              { k: '피부 타입 5분류', a: '민감 · 지성 · 건성', b: '중성 · 복합성', c: '중성 = 이상적 · 지성 = 색 유지 저하' },
              { k: '표피 3층 · 5층', a: '얕은층 · 정확한층 · 깊은층', b: '각질·투명·과립·가시·기저', c: '시술 깊이 = 정확한층 0.4~1.6mm · 이상 초과 금지' },
            ].map((d) => (
              <div key={d.k} style={CARD}>
                <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 18, color: 'var(--gold-light)', marginBottom: 12, fontWeight: 600 }}>{d.k}</div>
                <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: 6, textTransform: 'uppercase' }}>{d.a}</div>
                <div style={{ fontFamily: 'var(--ab-font-body-latin)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: 12, textTransform: 'uppercase' }}>{d.b}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-soft)', lineHeight: 1.7 }}>{d.c}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 실습 · 위생 프로토콜 */}
      <section style={{ ...SECTION, background: 'var(--bg-card)' }}>
        <div style={WRAP}>
          <div style={MARK}>PROTOCOL · 실습·위생 · 정본</div>
          <h2 style={H2}>26년의 프로토콜 · 절대 원칙</h2>
          <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            <div style={CARD}>
              <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 17, color: 'var(--gold-light)', marginBottom: 14, fontWeight: 600 }}>모델 실습 · 9단계</div>
              <ol style={{ margin: 0, paddingLeft: 20, fontSize: 12.5, color: 'var(--text-soft)', lineHeight: 2 }}>
                <li>계약서 · 동의서 작성</li>
                <li>정면 · 측면 시술 전 촬영</li>
                <li>오른쪽 진정제 도포 · 랩(15~20분)</li>
                <li>오른쪽 시술</li>
                <li>왼쪽 진정제 · 랩</li>
                <li>대칭 맞춰 왼쪽 시술</li>
                <li>완성 촬영</li>
                <li>자리 정돈 · 다음 준비</li>
                <li>사후 관리 안내</li>
              </ol>
            </div>
            <div style={CARD}>
              <div style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 17, color: 'var(--gold-light)', marginBottom: 14, fontWeight: 600 }}>위생 · 절대 원칙</div>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12.5, color: 'var(--text-soft)', lineHeight: 2 }}>
                <li>바늘 재사용 · 절대 금지</li>
                <li>니들 휴지통 (샤프 컨테이너) 필수</li>
                <li>솜은 당일 폐기 · 재활용 X</li>
                <li>고객 한쪽당 바늘·캡 2개 이상</li>
                <li>2차 감염 방지 · 라텍스 장갑</li>
                <li>3일차 실습 준비물 19개 체크리스트</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '110px 24px', textAlign: 'center', background: 'radial-gradient(ellipse at center, rgba(176,136,98,0.10), transparent 65%)' }}>
        <div style={{ ...MARK, marginBottom: 24 }}>MASTER CLASS · 원장 1:1 직강</div>
        <h2 style={{ fontFamily: 'var(--ab-font-headline)', fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 300, color: 'var(--ivory)', marginBottom: 20, lineHeight: 1.3 }}>
          1234321을 손이 기억할 때까지<br /><span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>원장에게 직접</span>
        </h2>
        <div style={{ fontSize: 14, color: 'var(--text-soft)', maxWidth: 560, marginInline: 'auto', lineHeight: 1.8, marginBottom: 34 }}>
          이지 클래스 → 소묘 → 극사실눈썹 · 3일 원장 1:1 완성<br />
          창업반 890 · 6+6개월 무제한 실습 · 강사반 자격
        </div>
        <div style={{ display: 'inline-flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/enroll" style={{ padding: '14px 32px', background: 'var(--gold)', color: 'var(--bg-deep)', fontFamily: 'var(--ab-font-body-latin)', fontSize: 12, letterSpacing: '0.24em', fontWeight: 700, textDecoration: 'none', textTransform: 'uppercase' }}>
            교육 상담 →
          </Link>
          <Link href="/#academy" style={{ padding: '14px 32px', border: '1px solid var(--gold)', color: 'var(--gold-light)', fontFamily: 'var(--ab-font-body-latin)', fontSize: 12, letterSpacing: '0.24em', fontWeight: 700, textDecoration: 'none', textTransform: 'uppercase' }}>
            커리큘럼 보기 →
          </Link>
        </div>
      </section>
    </main>
  );
}
