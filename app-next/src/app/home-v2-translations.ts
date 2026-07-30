/**
 * HomeV2Content 다국어 번역 (2026-07-30 · AI 초벌 · 원장님 검수 대기)
 * 언어 3종: ko (정본) · en (editorial magazine tone) · zh (简体中文 · formal)
 * ⚠️ EN/ZH 는 초벌 번역 · 원장님 검수 후 확정
 */
import type { Lang } from '@/lib/i18n/messages';

type T3 = { ko: string; en: string; zh: string };

export const t = {
  // ═══ HERO ═══
  heroBadge: { ko: 'HYPERREAL BROW', en: 'HYPERREAL BROW', zh: 'HYPERREAL BROW' },
  heroTitleTop: { ko: '진짜에 가깝게!', en: 'As real as it gets.', zh: '无限接近真实。' },
  heroTitleBig: { ko: '극사실눈썹', en: 'Hyperreal Brow', zh: '超写实眉' },
  heroSubL1: {
    ko: '진짜 눈썹처럼 자연스러운 극사실기법 특허 기술!',
    en: 'A patented hyperreal technique — indistinguishable from your own brows.',
    zh: '与真实眉毛无异的超写实专利技术！',
  },
  heroSubL2: {
    ko: '아트브로우가 최고의 반영구 전문가를 양성합니다.',
    en: 'ARTbrows trains the finest permanent makeup masters.',
    zh: 'ARTbrows 培养顶级半永久美妆专家。',
  },
  heroCtaPrimary: { ko: '시술/교육 상담 →', en: 'Consult · Procedure or Course →', zh: '施术/教育咨询 →' },
  heroCtaGhost: { ko: '커리큘럼 보기', en: 'View Curriculum', zh: '查看课程' },

  // proof strip
  proof1n: { ko: '20년+', en: '20+ yrs', zh: '20年+' },
  proof1d: { ko: '창시자 경력', en: 'Founder craft', zh: '创始人经验' },
  proof2n: { ko: '10,000+', en: '10,000+', zh: '10,000+' },
  proof2d: { ko: '누적 시술', en: 'Procedures', zh: '累计施术' },
  proof3n: { ko: '1,000+', en: '1,000+', zh: '1,000+' },
  proof3d: { ko: '누적 수강생', en: 'Graduates', zh: '累计学员' },

  // ═══ 01 · Origin ═══
  originLabel: { ko: '01 · The Origin', en: '01 · The Origin', zh: '01 · The Origin' },
  originTitle: { ko: '극사실눈썹의 시작', en: 'The Origin of Hyperreal Brow', zh: '超写实眉的起点' },
  originLead: {
    ko: '천 명의 고객, 단 하나의 눈썹 패턴.',
    en: 'A thousand faces — one single brow pattern.',
    zh: '一千位客户,只有一种眉形。',
  },
  originP1: {
    ko: '20년간 장미지 원장은 늘 같은 장면을 마주했습니다.',
    en: 'For 20 years, founder Jang Mi-ji witnessed the same scene.',
    zh: '20年间,张美芝院长始终目睹同一场景。',
  },
  originP2: {
    ko: '둥근 얼굴, 각진 얼굴, 긴 얼굴, 평평한 얼굴, 역삼각형 얼굴 등 — 얼굴형은 달라도 모든 사람에게, 모든 반영구 시술자가 일자눈썹만 시술했습니다. "왜 진짜 눈썹이랑 결도 다르고, 방향도 어색하게 따로 놀까?"',
    en: 'Round, angular, elongated, flat, or heart-shaped faces — no matter the shape, every technician drew the same straight brow. "Why does the direction and flow feel so disconnected from a real brow?"',
    zh: '圆脸、方脸、长脸、扁脸、倒三角脸——不论脸型,所有师傅都只做直线眉。"为何眉毛的纹理和方向,总与真实眉毛脱节?"',
  },
  originP3: {
    ko: '그렇게 답을 찾기 시작했고, 만화가를 꿈꾸며 어릴 적 보던 해부학 책을 다시 펼쳐보며, 눈썹은 그 사람만의 골격과 모류 방향을 읽어내는 데서 시작해야 한다는 것을 깨달았습니다. 반영구 기법에 소묘의 원리를 정식으로 접목한 것 — 그것이 극사실눈썹의 시작이었습니다.',
    en: 'The search for the answer led back to childhood anatomy books — from a would-be cartoonist. The realization: brows must begin from reading each person\'s bone structure and hair flow. Grafting the principles of drawing onto permanent makeup — that was the birth of Hyperreal Brow.',
    zh: '为寻求答案,她重新翻开了童年时因憧憬漫画而阅读的解剖学书籍,悟出眉毛应从阅读每个人的骨骼与毛流方向开始。将素描原理正式融入半永久技法——这便是超写实眉的起点。',
  },
  originQuote: {
    ko: '"나는 고객이 원하는 눈썹을 그리고 있는가."',
    en: '"Am I drawing the brow the customer truly wants?"',
    zh: '"我画的,是客户真正想要的眉毛吗?"',
  },

  // ═══ 02 · Define ═══
  defineLabel: { ko: '02 · What is Hyperreal Brow', en: '02 · What is Hyperreal Brow', zh: '02 · What is Hyperreal Brow' },
  defineTitle: { ko: '극사실눈썹이란?', en: 'What is Hyperreal Brow?', zh: '什么是超写实眉?' },
  defineBody: {
    ko: '극사실눈썹은 정해진 패턴을 그리는 시술이 아니라, 얼굴을 소묘하듯 관찰하고 설계하는 기법입니다. 골격, 눈매, 원래 모류의 결과 방향을 먼저 읽고 단순히 그리는 것이 아닌, 본연의 아름다움에 한 올 한 올 생장감을 불어넣는 작업. 똑같은 시간을 쓰더라도 전혀 다른 차원의 결과가 나오는 이유입니다.',
    en: 'Hyperreal Brow is not a preset pattern — it is a technique of observing and designing the face like drawing. Reading the bone structure, eye shape, and the direction of the original hair flow first, then breathing life into each strand with the client\'s own natural beauty. That is why the same amount of time yields a result on an entirely different level.',
    zh: '超写实眉并非套用固定模板,而是像素描一样观察并设计脸部的技法。先读取骨骼、眼型和原生毛流方向,再一根一根地赋予自然生长感——这就是为何同样时间,能产出截然不同层次的成果。',
  },
  defineCaption: {
    ko: '"진짜를 그리면 인상이 달라진다, 인생이 달라진다"',
    en: '"Draw the real — and both the face and the life shift."',
    zh: '"画出真实,则面貌改变,人生也改变。"',
  },
  defineMantra: { ko: '패턴이 아닌 · 소묘', en: 'Not a pattern — a drawing', zh: '非模板 · 而是素描' },

  // ═══ 03 · Master ═══
  masterLabel: { ko: '03 · Master', en: '03 · Master', zh: '03 · Master' },
  masterCrown: {
    ko: '국내 눈썹문신의 정점에 있는 MASTER',
    en: 'The Master at the pinnacle of brow art in Korea',
    zh: '韩国眉部艺术顶尖大师',
  },
  masterName: { ko: '장미지 대표원장', en: 'Jang Mi-ji · Founder', zh: '张美芝 大院长' },
  masterRole: { ko: 'ARTBROWS ACADEMY · FOUNDER', en: 'ARTBROWS ACADEMY · FOUNDER', zh: 'ARTBROWS ACADEMY · FOUNDER' },
  masterStat1n: { ko: '20년+', en: '20+ yrs', zh: '20年+' },
  masterStat1d: { ko: '시술 경력', en: 'Career', zh: '施术经验' },
  masterStat2n: { ko: '10,000+', en: '10,000+', zh: '10,000+' },
  masterStat2d: { ko: '누적 시술', en: 'Procedures', zh: '累计施术' },
  masterStat3n: { ko: '1,000+', en: '1,000+', zh: '1,000+' },
  masterStat3d: { ko: '누적 수강생', en: 'Graduates', zh: '累计学员' },
  masterStat4n: { ko: '3장', en: '3 IPs', zh: '3项' },
  masterStat4d: { ko: '특허·상표', en: 'Patents · Trademarks', zh: '专利·商标' },
  masterBio: {
    ko: '「극사실눈썹」 기법 · 상표 · 머신 특허 3장 보유 (특허 10-2863985). 경력 5~10년차 원장님들도 스킬업 재교육을 받으러 오는 정본 방법론의 원본입니다.',
    en: 'Holder of 3 IPs (technique · trademark · machine) for "Hyperreal Brow" (Patent 10-2863985). The source methodology that 5–10 year-experienced masters return to for advanced retraining.',
    zh: '拥有「超写实眉」技法·商标·机器 3项专利(专利号 10-2863985)。5~10年资历的师傅也回来进行技能升级的正统方法论源头。',
  },
  cred1: { ko: 'ARTBROWS ACADEMY 총괄 대표원장', en: 'Head Master · ARTBROWS ACADEMY', zh: 'ARTBROWS ACADEMY 总院长' },
  cred2: { ko: '극사실눈썹 기법·상표·머신 특허 3장 등록', en: '3 registered IPs · technique, trademark, machine', zh: '超写实眉技法·商标·机器 3项专利注册' },
  cred3: { ko: '누적 수강생 1,000+ · 창업 수백여명 배출', en: '1,000+ graduates · hundreds launched studios', zh: '1,000+ 累计学员 · 数百人创业开店' },
  cred4: { ko: '2027-10 반영구 준합법화 대비 · 국내 유일 표준 방법론', en: 'Korea\'s only standard methodology for the 2027-10 semi-legalization', zh: '2027年10月半永久合法化前 · 韩国唯一标准方法论' },
  masterQuote: {
    ko: '"극사실눈썹은 단순한 시술이 아니라, 한 사람의 표정과 인생을 바꾸는 일입니다."',
    en: '"Hyperreal Brow is not a mere procedure — it changes a person\'s expression and life."',
    zh: '"超写实眉不只是一项施术,而是改变一个人的神情与人生。"',
  },
  masterSignRole: { ko: 'ARTBROWS 대표원장', en: 'Head Master · ARTBROWS', zh: 'ARTBROWS 大院长' },
  masterSignName: { ko: '장미지', en: 'Jang Mi-ji', zh: '张美芝' },

  // ═══ 04 · Art Gallery ═══
  galleryLabel: { ko: '04 · Art Gallery', en: '04 · Art Gallery', zh: '04 · Art Gallery' },
  galleryTag: { ko: '국내 ONE TOP!', en: 'ONE TOP in Korea!', zh: '韩国 ONE TOP!' },
  galleryTitle: { ko: '장미지 원장의 Art Gallery', en: 'Art Gallery by Jang Mi-ji', zh: '张美芝院长的 Art Gallery' },
  galleryDesc: {
    ko: '극사실눈썹으로 완성한 실제 작품들입니다.',
    en: 'Actual works completed with Hyperreal Brow.',
    zh: '以超写实眉完成的真实作品。',
  },
  galleryNote: {
    ko: '작품 이미지는 원장님 승인 후 순차 업데이트됩니다',
    en: 'Images will be updated as approved by the Founder.',
    zh: '作品图片将依院长审核陆续更新。',
  },

  // ═══ 05 · Roadmap ═══
  roadmapLabel: { ko: '05 · Curriculum Roadmap', en: '05 · Curriculum Roadmap', zh: '05 · Curriculum Roadmap' },
  roadmapTitle: {
    ko: '국내유일 극사실눈썹 교육 아카데미',
    en: 'Korea\'s Only Hyperreal Brow Academy',
    zh: '韩国唯一超写实眉教育学院',
  },
  roadmapDesc: {
    ko: '아트브로우 아카데미는 진짜 내 눈썹처럼 섬세하고 자연스러운 극사실 기법을 처음으로 정립하고 시술·교육하는 전문 뷰티 아카데미입니다.',
    en: 'ARTbrows Academy is the professional beauty academy that first established and now teaches the Hyperreal technique — as delicate and natural as real brows.',
    zh: 'ARTbrows Academy 是首个建立并教授「细腻自然如真眉」超写实技法的专业美妆学院。',
  },
  roadmapLead: {
    ko: '입문부터 심화까지 3단계로 이어지는 원장 직강 정규 커리큘럼',
    en: 'A 3-stage master-led curriculum from beginner to advanced',
    zh: '由入门到进阶 3阶段 · 院长亲授正规课程',
  },
  roadmapSub: {
    ko: '각 과정은 독립적으로도 수강하실 수 있습니다.',
    en: 'Each stage can also be taken independently.',
    zh: '各阶段亦可独立报名。',
  },
  // 3 courses
  courseAtitle: { ko: '이지클래스', en: 'Easy Class', zh: 'Easy Class 入门班' },
  courseAprice: { ko: '69만원', en: 'KRW 690,000', zh: '69万韩元' },
  courseAaud: { ko: '반영구 입문자, 오래전에 배운 분, 아직 선 하나가 자신 없는 분', en: 'Beginners · returners · anyone unsure of a single line', zh: '半永久新手 · 曾学多年前 · 尚不敢一笔者' },
  courseAdesc: { ko: '눈썹의 기초 이론과 실습을 처음부터 제대로 배우는 입문 과정.', en: 'A proper introduction to brow theory and practice — from zero.', zh: '从零开始学习眉部基础理论与实操的入门课程。' },
  courseAmeta: { ko: '일요일 5주 · 3시간×5회 (15H)', en: 'Sundays · 5 weeks · 3h × 5 (15H)', zh: '周日 · 5周 · 每次3小时×5次 (15H)' },
  courseBtitle: { ko: '극사실기초 소묘수업', en: 'Hyperreal Sketch Class', zh: '超写实基础素描班' },
  courseBprice: { ko: '66만원', en: 'KRW 660,000', zh: '66万韩元' },
  courseBaud: { ko: '이지클래스 졸업생, 경력자, 헤어스트록 수강자', en: 'Easy Class grads · experienced pros · hairstroke students', zh: 'Easy Class 毕业生 · 有经验者 · 学过 hairstroke 者' },
  courseBdesc: { ko: '진짜 눈썹을 보고 그리는 원리 수업. 배운 이론을 실전 시술에 녹여내는 과정.', en: 'Learn the principle of drawing what you see — merging theory into real work.', zh: '学习「观察真眉再作画」的原理 · 将理论融入实战。' },
  courseBmeta: { ko: '3일 집중', en: '3-day intensive', zh: '3日集训' },
  courseCtitle: { ko: '극사실눈썹 강의', en: 'Hyperreal Brow · Master Class', zh: '超写实眉大师课' },
  courseCprice: { ko: '169만원', en: 'KRW 1,690,000', zh: '169万韩元' },
  courseCaud: { ko: '소묘 과정 이수자, 극사실눈썹을 실전 시술로 완성하고 싶은 분', en: 'Sketch class alumni · pros ready to complete the real thing', zh: '素描课程结业者 · 想以真实施术完成超写实眉者' },
  courseCdesc: { ko: '원장 직강 · 결의 재현 원리 · 실전 케이스 중심.', en: 'Founder-led · flow reproduction principle · real cases.', zh: '院长亲授 · 纹理再现原理 · 实战案例导向。' },
  courseCmeta: { ko: '3일 집중 · 원장 직강', en: '3-day intensive · Founder-led', zh: '3日集训 · 院长亲授' },

  // ═══ 06 · Flagship ═══
  flagshipLabel: { ko: '06 · Flagship', en: '06 · Flagship', zh: '06 · Flagship' },
  flagshipTitleL1: { ko: '극사실눈썹 단기창업반', en: 'Hyperreal Brow · Startup Program', zh: '超写实眉短期创业班' },
  flagshipTitleL2: { ko: '(교육+창업멘토링)', en: '(Course + Startup Mentoring)', zh: '(教育+创业辅导)' },
  flagshipDesc: {
    ko: '이지클래스부터 실전실습까지 전 과정을 통합한 6개월 플래그십 과정. 기술 습득은 물론 실제 창업까지 이어지는 로드맵을 함께 설계합니다.',
    en: 'A 6-month flagship uniting Easy Class through real practice. Skill mastery plus a full roadmap to launching your studio.',
    zh: '整合 Easy Class 到实战演练的 6 个月旗舰课程。学技术,也共同规划创业蓝图。',
  },
  flagshipWhyTitle: { ko: '왜 단기창업반인가요?', en: 'Why the Startup Program?', zh: '为何选择创业班?' },
  flagshipWhy1: {
    ko: '이지클래스부터 창업 컨설팅까지, 기술과 창업을 하나의 로드맵으로 연결합니다',
    en: 'From Easy Class to startup consulting — one seamless roadmap',
    zh: '从 Easy Class 到创业咨询 · 技术与创业融为一条路径',
  },
  flagshipWhy2: {
    ko: '소묘·강의 각 4회 반복 수강으로 실력의 완성도를 끌어올립니다',
    en: 'Sketch and Master Class repeat 4× each — pushing skill to completion',
    zh: '素描·讲课各重复4次 · 将技艺完成度推向极致',
  },
  flagshipWhy3: {
    ko: '장미지 대표원장이 전 과정을 직접 지도하고, 창업 이후까지 함께합니다',
    en: 'Founder Jang Mi-ji guides the entire program and stays with you after launch',
    zh: '张美芝院长全程亲自指导 · 创业后也一路陪伴',
  },
  step1t: { ko: '이지클래스', en: 'Easy Class', zh: 'Easy Class' },
  step1d: { ko: '반영구 입문 정석과정', en: 'Standard beginner course', zh: '半永久入门正规课程' },
  step2t: { ko: '극사실기초 소묘', en: 'Hyperreal Sketch', zh: '超写实基础素描' },
  step2d: { ko: '4회 반복 수강', en: '4× repeat sessions', zh: '重复4次' },
  step3t: { ko: '극사실눈썹 강의', en: 'Hyperreal Master Class', zh: '超写实眉讲课' },
  step3d: { ko: '4회 반복 수강', en: '4× repeat sessions', zh: '重复4次' },
  step4t: { ko: '실전실습', en: 'Real Practice', zh: '实战实习' },
  step4d: { ko: '창업 실전 과정', en: 'Live studio practice', zh: '创业实战阶段' },
  step5t: { ko: '무제한 실습', en: 'Unlimited Practice', zh: '无限实习' },
  step5d: { ko: '베드 무료오픈', en: 'Free bed access', zh: '施术床免费开放' },
  step6t: { ko: '창업 컨설팅', en: 'Startup Consulting', zh: '创业咨询' },
  step6d: { ko: '인테리어+마케팅', en: 'Interior + marketing', zh: '室内设计+营销' },
  eduTitle: { ko: '창업반의 체계적인 교육시스템', en: 'Systematic Training Flow', zh: '系统化教学流程' },
  eduLabel1: { ko: '수업', en: 'Class', zh: '授课' },
  eduLabel2: { ko: '원장시연', en: 'Demo by Founder', zh: '院长示范' },
  eduLabel3: { ko: '실습', en: 'Practice', zh: '实习' },
  eduLabel4: { ko: '피드백', en: 'Feedback', zh: '反馈' },
  targetTitle: { ko: '이런 분께 추천합니다', en: 'Recommended for', zh: '推荐给以下人士' },
  target1: { ko: '반영구 전문가로 확실하게 자리 잡고 싶은 분', en: 'Those aiming to establish themselves as full pros', zh: '想稳固立足半永久专业领域者' },
  target2: { ko: '기술 습득을 넘어 실제 창업까지 계획하고 있는 분', en: 'Those planning actual launch beyond skill', zh: '计划从学技术进而实际创业者' },
  target3: { ko: '단발성 수강이나 독학으로는 한계를 느낀 분', en: 'Those who felt limits of one-off classes or self-study', zh: '感觉一次性课程或自学有瓶颈者' },
  target4: { ko: '창업 준비부터 사후 지원까지 든든하게 받고 싶은 분', en: 'Those wanting reliable support from prep through post-launch', zh: '希望从创业准备到后续支援皆稳固者' },
  priceNotice: { ko: '수강료는 상담을 통해 안내드립니다', en: 'Course fee provided through consultation', zh: '学费通过咨询详细告知' },
  flagshipCta: { ko: '단기창업반 상담 신청 →', en: 'Apply for Startup Program →', zh: '申请创业班咨询 →' },

  // ═══ 07 · Graduates ═══
  gradsLabel: { ko: "07 · Graduates' Work", en: "07 · Graduates' Work", zh: "07 · Graduates' Work" },
  gradsTag: { ko: '수강생 졸업작품', en: 'Graduation Works', zh: '学员毕业作品' },
  gradsTitle: { ko: '아카데미 수강생 Gallery', en: 'Academy Graduates Gallery', zh: '学院学员作品集' },
  gradsDesc: {
    ko: 'ARTBROWS ACADEMY를 수료한 수강생들의 실제 작품입니다.',
    en: 'Actual works of ARTBROWS ACADEMY graduates.',
    zh: 'ARTBROWS ACADEMY 结业学员的真实作品。',
  },
  gradsNote: {
    ko: '작품 이미지는 수강생 동의 후 순차 업데이트됩니다',
    en: 'Images updated with graduates\' consent.',
    zh: '作品图片将于取得学员同意后陆续更新。',
  },

  // ═══ 08 · Location ═══
  locLabel: { ko: '08 · Location', en: '08 · Location', zh: '08 · Location' },
  locTitle: { ko: '찾아오시는 길', en: 'Location', zh: '前来路线' },
  locName: { ko: 'ARTBROWS ACADEMY', en: 'ARTBROWS ACADEMY', zh: 'ARTBROWS ACADEMY' },
  locAddr: {
    ko: '서울 강남구 봉은사로68길 55-3 2층',
    en: '2F · 55-3 Bongeunsa-ro 68-gil · Gangnam-gu · Seoul',
    zh: '首尔江南区奉恩寺路68街 55-3 2楼',
  },
  locStation: { ko: '선릉역 · 삼성중앙역 인근', en: 'Near Seolleung / Samseong-jungang Station', zh: '宣陵站·三成中央站附近' },
  locNaver: { ko: '네이버 지도에서 보기 →', en: 'Open in Naver Map →', zh: 'Naver 地图查看 →' },
  locKakao: { ko: '카카오맵에서 보기 →', en: 'Open in Kakao Map →', zh: 'Kakao 地图查看 →' },

  // ═══ 09 · FAQ ═══
  faqLabel: { ko: '09 · FAQ', en: '09 · FAQ', zh: '09 · FAQ' },
  faqTitle: { ko: '자주 묻는 질문', en: 'Frequently Asked Questions', zh: '常见问题' },
  faq1q: { ko: '어떤 순서로 수강해야 하나요?', en: 'What order should I take the classes in?', zh: '应以何种顺序报名?' },
  faq1a: {
    ko: '이지클래스 → 극사실눈썹 소묘 3일 → 극사실눈썹 3일 집중수업 → 실전실습 순으로 진행하시는 것을 권장합니다. 이미 현직 경력이 있다면 심화반부터 바로 시작하실 수도 있습니다.',
    en: 'Recommended: Easy Class → 3-day Hyperreal Sketch → 3-day Hyperreal Master Class → Real Practice. With existing experience, you can start from the advanced stage.',
    zh: '推荐顺序:Easy Class → 3日超写实素描 → 3日超写实集训 → 实战实习。已有资历者亦可直接从进阶班开始。',
  },
  faq2q: { ko: '재료비도 포함인가요?', en: 'Is the material fee included?', zh: '材料费也包含在内吗?' },
  faq2a: {
    ko: '수강료에 재료비는 별도이며, 개인 재료 사용도 가능합니다.',
    en: 'Material fees are separate; you may also bring your own materials.',
    zh: '材料费另计,亦可使用个人材料。',
  },
  faq3q: { ko: '수업 일정은 어떻게 확인하나요?', en: 'How can I check the schedule?', zh: '如何查询课程时间?' },
  faq3a: {
    ko: '수업 일정은 매달 계획되어 전월에 스케줄이 공지됩니다. 정확한 다음 일정은 전화 또는 카카오채널로 문의해 주세요.',
    en: 'Schedules are planned monthly and announced the prior month. For the exact next date, please contact us by phone or KakaoTalk channel.',
    zh: '课程按月安排,并于上一个月公告。确切时间请以电话或 Kakao 官方账号联系。',
  },
  faq4q: { ko: '경력이 없어도 창업반 수강이 가능한가요?', en: 'Can beginners with no experience join the Startup Program?', zh: '无经验者也可报名创业班吗?' },
  faq4a: {
    ko: '네, 단기창업반은 이지클래스부터 실전실습까지 전 과정을 포함하고 있어 입문자도 창업까지 이어지는 커리큘럼을 밟으실 수 있습니다.',
    en: 'Yes. The Startup Program includes everything from Easy Class through Real Practice — beginners can follow the full path to launching.',
    zh: '可以。创业班涵盖从 Easy Class 到实战实习的全过程 · 新手也可完整走完至创业。',
  },

  // ═══ FINAL CTA ═══
  finalLabel: { ko: 'Start Now', en: 'Start Now', zh: 'Start Now' },
  finalTitleL1: { ko: '극사실눈썹 창시자', en: 'By the Founder of Hyperreal Brow', zh: '超写实眉创始人' },
  finalTitleL2: { ko: '장미지의 아트브로우', en: 'Jang Mi-ji · ARTbrows', zh: '张美芝 · ARTbrows' },
  finalTitleL3: { ko: '에서 시작하세요.', en: 'Begin here.', zh: '从这里开始。' },
  finalDesc: {
    ko: '궁금하신 부분이나 자세한 상담은 언제든 전화 또는 카카오채널로 안내해드리겠습니다.',
    en: 'Any questions or detailed consultation — reach us anytime by phone or KakaoTalk channel.',
    zh: '任何疑问或详细咨询 · 请随时透过电话或 Kakao 官方账号联系。',
  },
  ctaTel: { ko: '전화 상담', en: 'Call', zh: '电话咨询' },
  ctaKakaoK1: { ko: '카톡 K1 무료 강의방 →', en: 'Kakao K1 · Free Class Room →', zh: 'Kakao K1 · 免费讲义群 →' },
  ctaInsta: { ko: '@artbrows_academy 팔로우', en: 'Follow @artbrows_academy', zh: '追踪 @artbrows_academy' },
  finalFooter: { ko: '서울 강남구 · 선릉역 · 삼성중앙역 인근', en: 'Gangnam-gu Seoul · Near Seolleung / Samseong-jungang', zh: '首尔江南区 · 宣陵站·三成中央站附近' },

  // ═══ Footer ═══
  footBrand: { ko: 'ARTBROWS ACADEMY', en: 'ARTBROWS ACADEMY', zh: 'ARTBROWS ACADEMY' },
  footBrandDesc: { ko: '극사실눈썹전문 아카데미', en: 'The Hyperreal Brow Academy', zh: '超写实眉专门学院' },
  footAddr: { ko: '서울 강남구 · 선릉역 · 삼성중앙역 인근', en: 'Gangnam-gu Seoul · Near Seolleung / Samseong-jungang', zh: '首尔江南区 · 宣陵站·三成中央站附近' },
  footContact: { ko: 'TEL 010-3239-5453 · 인스타 @artbrows_academy', en: 'TEL 010-3239-5453 · IG @artbrows_academy', zh: 'TEL 010-3239-5453 · Instagram @artbrows_academy' },
  footCopyright: { ko: '© ARTBROWS ACADEMY (주식회사 미지아카데미). All rights reserved.', en: '© ARTBROWS ACADEMY (Miji Academy Inc.). All rights reserved.', zh: '© ARTBROWS ACADEMY (株式会社 Miji Academy). All rights reserved.' },

  // Sticky bar
  stickyCall: { ko: '📞 전화 상담', en: '📞 Call', zh: '📞 电话咨询' },
  stickyKakao: { ko: '💬 카카오 상담', en: '💬 KakaoTalk', zh: '💬 Kakao 咨询' },

  // Section headings for GNB
  gnbMasterMenu: { ko: '대표원장', en: 'Founder', zh: '院长' },
  gnbHyperMenu: { ko: '장미지 극사실눈썹', en: 'Hyperreal Brow', zh: '张美芝超写实眉' },
  gnbGalleryMenu: { ko: '포트폴리오', en: 'Portfolio', zh: '作品集' },
  gnbAcademyMenu: { ko: '아카데미', en: 'Academy', zh: '学院' },
  gnbCtaCourse: { ko: '교육 상담', en: 'COURSE CONSULT', zh: '课程咨询' },
  gnbCtaProc: { ko: '시술 상담', en: 'PROCEDURE CONSULT', zh: '施术咨询' },
} satisfies Record<string, T3>;

export type TKey = keyof typeof t;

/** Helper · look up translation for given lang · fallback ko */
export function tr(key: TKey, lang: Lang): string {
  const entry = t[key];
  return (entry[lang] ?? entry.ko) as string;
}
