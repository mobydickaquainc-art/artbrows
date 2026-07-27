# Graph Report - D:/work/jangmi/_extracted  (2026-06-28)

## Corpus Check
- Large corpus: 66 files · ~686,141 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 118 nodes · 135 edges · 16 communities detected
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.78)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_안면 해부·비율 기준점|안면 해부·비율 기준점]]
- [[_COMMUNITY_눈썹뼈·입체감·비율 규칙|눈썹뼈·입체감·비율 규칙]]
- [[_COMMUNITY_극사실 시술 기법·스타일|극사실 시술 기법·스타일]]
- [[_COMMUNITY_이지클래스 파트너십 (B2B)|이지클래스 파트너십 (B2B)]]
- [[_COMMUNITY_눈썹뼈 5요소 + 안면 골격|눈썹뼈 5요소 + 안면 골격]]
- [[_COMMUNITY_얼굴 구역·피부 생리 도해|얼굴 구역·피부 생리 도해]]
- [[_COMMUNITY_ARTbrows 안면 윤곽 미학|ARTbrows 안면 윤곽 미학]]
- [[_COMMUNITY_얼굴 미학 커리큘럼 4 챕터|얼굴 미학 커리큘럼 4 챕터]]
- [[_COMMUNITY_이지클래스 5단계 커리큘럼|이지클래스 5단계 커리큘럼]]
- [[_COMMUNITY_피부톤 × 눈썹 색 매트릭스|피부톤 × 눈썹 색 매트릭스]]
- [[_COMMUNITY_3 윤곽 구조 (내·외·대외)|3 윤곽 구조 (내·외·대외)]]
- [[_COMMUNITY_코드 — extract.py|코드 — extract.py]]
- [[_COMMUNITY_코드 — resize.py|코드 — resize.py]]
- [[_COMMUNITY_코드 — text_extract.py|코드 — text_extract.py]]
- [[_COMMUNITY_코드 — thumb.py|코드 — thumb.py]]
- [[_COMMUNITY_부록 — 극사실 디테일 표지|부록 — 극사실 디테일 표지]]

## God Nodes (most connected - your core abstractions)
1. `극사실 눈썹` - 13 edges
2. `안면 비율 미학` - 11 edges
3. `안면 골격 미학` - 10 edges
4. `이지클래스 파트너 모집` - 9 edges
5. `Chapter 01 — 안면 비율 미학 (얼굴 각 부위 간의 황금비·이상적 비율 규칙 모음)` - 9 edges
6. `ARTbrows 아트브로우` - 7 edges
7. `분위기를 만드는 눈썹 뼈 5가지 요소` - 7 edges
8. `안면 윤곽 미학 (내·외·대외윤곽)` - 6 edges
9. `얼굴 3구역 분할 — 액면구·연중구·하악구` - 6 edges
10. `이지클래스 (펜으로 그리고 머신으로 완성)` - 5 edges

## Surprising Connections (you probably didn't know these)
- `8가지 스타일 진단 (소녀·소년·자연·전위·우아·연극·낭만·고전)` --conceptually_related_to--> `안면 비율 미학`  [INFERRED]
  D:\work\jangmi\_extracted\0302-추가-text.txt → D:\work\jangmi\_extracted\01-안면비율-text.txt
- `이지클래스 (펜으로 그리고 머신으로 완성)` --conceptually_related_to--> `극사실 눈썹`  [INFERRED]
  D:\work\jangmi\_extracted\파트너쉽-text.txt → D:\work\jangmi\_extracted\0302-극사실강의-추가.txt
- `이마 고랑·미간 연결` --leads_to--> `분위기를 만드는 눈썹 뼈 5가지 요소`  [INFERRED]
  01-안면비율-p16.png → 01-안면비율-p18.png
- `분위기를 만드는 눈썹 뼈 5가지 요소` --input_to--> `극사실 시술 기법 적용`  [INFERRED]
  01-안면비율-p18.png → 0302-추가-*.png
- `선 결 밀도·흐름 다이어그램` --technique_for--> `극사실 시술 기법 적용`  [INFERRED]
  0302-추가-p03.png → 0302-추가-*.png

## Hyperedges (group relationships)
- **이상적 안면 비율 규칙 세트 — 챕터 01 안면 비율 미학의 8가지 규칙 일괄** — rule_eye_to_brow_vs_philtrum_1to3, rule_eye_corner_to_hairline_1to2, rule_nostril_vs_nose_bridge_1to1, rule_nostril_vs_glabella_1to1, rule_facial_depth_parallel, rule_forehead_curve_position, rule_temple_vs_jaw_1to1, rule_negative_space_aesthetic [INFERRED]
- **안면 골격 디자인 요소 — 챕터 02 안면 골격 미학의 핵심 골격 변수** — browbone_eye_socket_relationship, nasal_bone_width_height_design_rule, anatomy_term_migung_browbone, anatomy_term_sangun [INFERRED]
- **안면비율 미학 방법론 (5요소 + 윤곽 + 3구역 + 대비법칙)** — face_proportion_p14_bone_aesthetics, face_proportion_p16_forehead_brow_bone, face_proportion_p18_five_brow_bone_factors, face_proportion_p20_comparison, face_proportion_p22_contour_classification, face_proportion_p24_three_zones, face_proportion_p26_contrast_law [INFERRED 0.85]
- **극사실 시술 디테일 추가 자료 (선·톤·해부)** — extreme_realistic_p01_intro, extreme_realistic_p03_line_density, extreme_realistic_p05_skin_tone_match, extreme_realistic_p07_tone_matrix, extreme_realistic_p09_skin_structure, skill_application_extreme_realistic [INFERRED 0.80]
- **이지클래스 B2B 파트너십 프로그램** — partnership_p01_easy_class_hook, partnership_p02_partner_principle, partnership_p03_5_session_3rd, partnership_p04_5_step_curriculum, partnership_p05_teaching_materials, partnership_p06_anyone_can_teach, business_model_partnership [INFERRED 0.85]

## Communities

### Community 0 - "안면 해부·비율 기준점"
Cohesion: 0.19
Nodes (18): 해부 용어 — 이마 결절(액결절, frontal tubercle): 이마 좌우 융기. 광대 너비 판단의 중요 참조점, 이마 상단 1/3 지점에 위치하는 것이 이상적, 해부 용어 — 미궁(눈썹뼈) / 미심(눈썹 사이): 눈썹 위 골격 융기. 안구 보호 및 입체감 생성. 30도 이내 돌출이 이상적, 해부 용어 — 산근(山根): 콧대 시작점, 미간 아래. 콧볼 너비와 1:1, 미간(양안) 거리와 1:1 비교 기준점, 해부 용어 — 관자놀이(측두각) & 하악: 측두각 너비와 하악 너비 1:1 비율로 얼굴 균형 판단, 미궁(눈썹뼈)과 안구의 관계 — 이상적 형태: 눈썹뼈가 적절히 돌출되어 안구를 감싸는 형태가 입체감을 준다. 눈썹뼈가 너무 낮으면 평면적으로 보이고, 너무 높으면 인상이 강해 보인다, Chapter 01 — 안면 비율 미학 (얼굴 각 부위 간의 황금비·이상적 비율 규칙 모음), 강의 패턴 — 3-케이스 진단 다이어그램: '평행/정상' vs '높은/넓은/많은 경우' vs '낮은/좁은/적은 경우' 비교사진으로 이상적 vs 비이상적 시각화, 비교 다이어그램 — 눈/눈썹 거리 비율 =1:3(이상), <1:3(좁음), >1:3(넓음) 3가지 케이스 사진 대조 (+10 more)

### Community 1 - "눈썹뼈·입체감·비율 규칙"
Cohesion: 0.14
Nodes (17): 눈썹 뼈 5요소 (높이·너비·곡률·연결·접힌각도), 미궁(눈썹뼈)-안구 관계 입체감, 눈 주변 지지 골격 4점 (내안각·미궁·외안각·광대경계), 눈꼬리-헤어라인 : 눈 1개 = 1:2, 눈-눈썹 거리 : 중안부 = 1:3, 안면 입체감 (미심-산근-비배) 평행 이상, 안면 비율 미학, 안면 골격 미학 (+9 more)

### Community 2 - "극사실 시술 기법·스타일"
Cohesion: 0.16
Nodes (14): 회색 변색 방지 / 브라운 유지, 색상 레이어링 (부위별 굵기·깊이·색 중첩), 8가지 스타일 진단 (소녀·소년·자연·전위·우아·연극·낭만·고전), 표피·진피 피부 구조 이해, 극사실 눈썹, 전류 기기 기법 — 높은 색 유지율, 수동 기법(반포) — 색 유지력 우수, 바늘 운용 프로세스 (모간·모첨 조작) (+6 more)

### Community 3 - "이지클래스 파트너십 (B2B)"
Cohesion: 0.17
Nodes (12): 누구나 교육할 수 있게 (강사용 PPT + 교재), 이지클래스 (펜으로 그리고 머신으로 완성), 이지클래스 파트너 모집, 아트브로우 종합반 졸업생만 신청 가능, 브랜딩·홍보 지원 (SNS·웹사이트), 파트너 커뮤니티·네트워크, 안정적 수익 창출, 전용 특별 교육·신규 테크닉 업데이트 (+4 more)

### Community 4 - "눈썹뼈 5요소 + 안면 골격"
Cohesion: 0.24
Nodes (10): 연결 (이마와 연결 정도), 곡률, 접힌 각도 (눈 위쪽의 접힘 정도), 높이, 너비, 안면 골격 미학 — 광대뼈·관자놀이 연결, 이마 고랑·미간 연결, 분위기를 만드는 눈썹 뼈 5가지 요소 (+2 more)

### Community 5 - "얼굴 구역·피부 생리 도해"
Cohesion: 0.22
Nodes (9): 선 결 밀도·흐름 다이어그램, 피부 생리 구조 도해, 얼굴 3구역 분할 — 액면구·연중구·하악구, 액면구 (이마 영역), 하악구 (하안부), 연중구 (중안부), 동안 이미지, 성숙 이미지 (+1 more)

### Community 6 - "ARTbrows 안면 윤곽 미학"
Cohesion: 0.29
Nodes (8): ARTbrows 아트브로우, 조소 얼굴 구역 (액면구·면중구·하악구), 안면 윤곽 미학 (내·외·대외윤곽), 안면 참조 법칙 (상대적 미학·대비), 내윤곽·외윤곽·대외윤곽 계단식 구조, 장미지 원장 (극사실눈썹 창시자), 이목구비 ↔ 여백 상대 대비, T존 입체 3구역 (앞·중간·옆/뒤)

### Community 7 - "얼굴 미학 커리큘럼 4 챕터"
Cohesion: 0.29
Nodes (8): Chapter 02 — 안면 골격 미학 (눈썹뼈·콧대·미간 등 골격이 만드는 입체감과 디자인 보완), Chapter 03 — 안면 윤곽 미학, Chapter 04 — 안면 참조 (실제 적용·참고 사례), 디자인 보완 원칙 — 골격적 결함(매부리코·휘어진 뼈·여백 부족 등)은 눈썹 디자인으로 보완 필요. 비율 측정 → 결함 진단 → 디자인 보완 워크플로, 안면 미학 커리큘럼 목차 — 01 안면 비율 미학 / 02 안면 골격 미학 / 03 안면 윤곽 미학 / 04 안면 참조, ARTbrows 특별자료 — 얼굴 미학 표지 (아트브로우 강의 교재 표지, 손글씨 로고 ARTbrows + 얼굴 미학 부제), 지적재산권 안내 — 아트브로우 및 소속 원장 외 본 교재로 교육·2차가공·배포 시 지재권 침해, 사진 촬영 금지, 연락처 010-3239-5453, 비골(콧뼈)의 너비와 높이 — 골격적 특징: 콧대의 시작점(산근)부터 끝까지의 골격 라인이 매끄러워야 한다. 매부리코나 휘어진 뼈의 위치를 파악하여 디자인 시 보완 필요

### Community 8 - "이지클래스 5단계 커리큘럼"
Cohesion: 0.33
Nodes (7): B2B 파트너십 비즈니스 모델, 극사실 이지클래스 — 펜으로 그리고 머신으로 완성하다, 이지클래스 파트너 모집 — 핵심 원칙, 5회완성 이지클래스 3기 모집 — 69만원, 이지클래스 5단계 커리큘럼, 강사용 PPT 사용설명서 + 수업 PPT 패키지, 누구나 보고 설명할 수 있다 — 표준 교본

### Community 9 - "피부톤 × 눈썹 색 매트릭스"
Cohesion: 0.33
Nodes (6): 피부 톤 별 눈썹 색 맞추는 법 (비교), 피부 톤 × 눈썹 색 2×2 매트릭스, 맑고 깨끗한 이미지 (연하게×그레이), 건강하고 세련된 이미지 (진하게×브라운), 도시적이고 시크한 이미지 (진하게×그레이), 부드럽고 따뜻한 이미지 (연하게×브라운)

### Community 10 - "3 윤곽 구조 (내·외·대외)"
Cohesion: 0.5
Nodes (4): 내윤곽, 대외윤곽, 외윤곽, 03 내윤곽 — 얼굴 윤곽 경계 구분

### Community 11 - "코드 — extract.py"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "코드 — resize.py"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "코드 — text_extract.py"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "코드 — thumb.py"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "부록 — 극사실 디테일 표지"
Cohesion: 1.0
Nodes (1): 극사실 눈썹 디테일 추가 자료 (표지)

## Knowledge Gaps
- **55 isolated node(s):** `장미지 원장 (극사실눈썹 창시자)`, `눈-눈썹 거리 : 중안부 = 1:3`, `눈꼬리-헤어라인 : 눈 1개 = 1:2`, `콧망울 : 산근 너비 = 1:1`, `콧볼 : 미간 거리 = 1:1` (+50 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `코드 — extract.py`** (1 nodes): `extract.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `코드 — resize.py`** (1 nodes): `resize.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `코드 — text_extract.py`** (1 nodes): `text_extract.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `코드 — thumb.py`** (1 nodes): `thumb.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `부록 — 극사실 디테일 표지`** (1 nodes): `극사실 눈썹 디테일 추가 자료 (표지)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ARTbrows 아트브로우` connect `ARTbrows 안면 윤곽 미학` to `눈썹뼈·입체감·비율 규칙`, `극사실 시술 기법·스타일`, `이지클래스 파트너십 (B2B)`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Why does `극사실 눈썹` connect `극사실 시술 기법·스타일` to `이지클래스 파트너십 (B2B)`, `ARTbrows 안면 윤곽 미학`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `이지클래스 (펜으로 그리고 머신으로 완성)` connect `이지클래스 파트너십 (B2B)` to `극사실 시술 기법·스타일`, `ARTbrows 안면 윤곽 미학`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `안면 비율 미학` (e.g. with `8가지 스타일 진단 (소녀·소년·자연·전위·우아·연극·낭만·고전)` and `안면 골격 미학`) actually correct?**
  _`안면 비율 미학` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `안면 골격 미학` (e.g. with `안면 비율 미학` and `안면 윤곽 미학 (내·외·대외윤곽)`) actually correct?**
  _`안면 골격 미학` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `장미지 원장 (극사실눈썹 창시자)`, `눈-눈썹 거리 : 중안부 = 1:3`, `눈꼬리-헤어라인 : 눈 1개 = 1:2` to the rest of the system?**
  _55 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `눈썹뼈·입체감·비율 규칙` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._