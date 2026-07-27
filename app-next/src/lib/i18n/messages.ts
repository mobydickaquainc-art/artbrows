/**
 * ARTbrows 홈페이지 3언어 메시지 (2026-07-17 · 원장님 정본 톤 유지)
 *
 * KO = 원본 정본
 * EN = 미주 시장 진출 (R7 · 2026-09 LA) · atelier/master/founder vocabulary
 * ZH = 중국 진출 (R6 · 위챗) · 간체 · 「超写实野生眉」 벤치마크 (메모리 참조) 하지만 원장님 방향 = 「아트」로 통일
 *
 * ⚠️ EN/ZH 번역은 초안 · 원장님·본부장 검수 대기 (2026-07-17 오후 착수)
 */

import type { Lang } from '@/app/cardnews/types';

export type HomeMessages = {
  meta: { title: string; description: string };
  utility: {
    brand: string;
    menu: { founder: string; hyperreal: string; academy: string; curriculum: string; pricing: string };
    cta: { inquiry: string; consult: string };
  };
  gnb: {
    brand: string;
    brandSub: string;
    menu: { philosophy: string; signature: string; tracks: string; newTracks: string; global: string; admin: string };
    consult: string;
  };
  hero: {
    eyebrow: string;
    headline: string[];               // 여러 줄 (배열)
    highlight: string;                // headline 안 골드 강조 단어
    lead: string;
    ctaPrimary: string;
    ctaGhost: string;
    figureLabel: string;
    figureAlt: string;
  };
  stmt: {
    mark: string;
    lines: string[];                  // 여러 문장
    boldPart?: string;                // 「골격의 연장」 등 강조
    signature: string;
  };
  pillars: {
    mark: string;
    title: string;
    boldPart?: string;
    lead: string;
    items: { ord: string; title: string; alt: string; desc: string }[];  // 4개
  };
  tracks: {
    mark: string;
    title: string;
    boldPart?: string;
    lead: string;
    a: { ord: string; title: string; boldPart?: string; desc: string; stats: { num: string; lbl: string }[]; go: string };
    b: { ord: string; title: string; boldPart?: string; desc: string; stats: { num: string; lbl: string }[]; go: string };
  };
  axes: {
    mark: string;
    title: string;
    boldPart?: string;
    lead: string;
    items: { ord: string; title: string; desc: string; status: string }[];  // 4개 + 5번째 별개
    axis5: { ord: string; title: string; descHtml: string; status: string };
  };
  global: {
    mark: string;
    title: string;
    boldPart?: string;
    lead: string;
    cards: { flag: string; head: string; body: string; ch: string }[];   // 3개
  };
  ctaBand: {
    lines: string[];
    boldPart?: string;
    body: string;
    button: string;
  };
  footer: {
    brand: string; brandSub: string; blurb: string;
    brandCol: { title: string; links: { text: string; href: string; external?: boolean }[] };
    tracksCol: { title: string; links: { text: string; href: string }[] };
    contactCol: { title: string; links: { text: string; href?: string }[]; k1: string; k1Note: string };
    bottom: string;
  };
  langLabels: { ko: string; en: string; zh: string };
};

export const MESSAGES: Record<Lang, HomeMessages> = {
  ko: {
    meta: { title: '장미지 · 극사실눈썹 창시자', description: '선릉·봉은사 아틀리에 · 극사실눈썹 창시자 장미지 원장의 소수 정예 마스터클래스' },
    utility: {
      brand: 'ARTBROWS & ACADEMY',
      menu: { founder: '대표원장', hyperreal: '극사실눈썹이란', academy: '아카데미', curriculum: '커리큘럼', pricing: '시술가격' },
      cta: { inquiry: '교육문의', consult: '시술상담' },
    },
    gnb: {
      brand: '장미지', brandSub: 'artbrows',
      menu: { philosophy: '철학', signature: '시그니처', tracks: '메뉴', newTracks: '새 트랙', global: '글로벌', admin: '운영진 ↗' },
      consult: '상담 신청',
    },
    hero: {
      eyebrow: 'SINCE THE ORIGINAL · SEONLEUNG-BONGEUNSA ATELIER',
      headline: ['극사실눈썹,', '그 원본의 손에서.'],
      highlight: '원본',
      lead: '사람의 얼굴을 가장 사람답게 — 그것이 우리가 매일 찾는 한 줄의 결입니다. 선릉의 무게로, 손끝의 깊이로, 다시 정의합니다.',
      ctaPrimary: '수강 상담 신청',
      ctaGhost: '철학 읽기',
      figureLabel: '原相机直出 · NATURAL · ART BROW',
      figureAlt: '극사실 아트 눈썹 시술 후 자연 무드 — 글로벌 라인',
    },
    stmt: {
      mark: 'PHILOSOPHY',
      lines: ['눈썹은 화장이 아니라 골격의 연장입니다.', '그 결을 사람답게 따라가는 일이, 우리가 12년간 다듬어 온 단 하나의 기술입니다.'],
      boldPart: '골격의 연장',
      signature: '— JANG MI-JI, FOUNDER',
    },
    pillars: {
      mark: 'SIGNATURE',
      title: '네 개의 중심축',
      boldPart: '중심축',
      lead: '창시자의 손에서 직접 — 선릉·봉은사 아틀리에가 다듬어 온 네 가지 기준.',
      items: [
        { ord: '01', title: '극사실 시그니처', alt: '극사실 눈썹 매크로', desc: '한 올 한 올의 결, 모공의 깊이, 골상의 흐름. 자연 그대로의 사실성을 시술의 첫 기준으로.' },
        { ord: '02', title: '소수 정예 마스터클래스', alt: '시술 손과 펜', desc: '창시자가 직접 가르치는 1:1 코칭. 같은 기수에 소수만 — 손끝까지 닿게.' },
        { ord: '03', title: '한·중·미 글로벌 라인', alt: '선릉·봉은사 인근 야경', desc: '국내를 넘어 그 결을 그대로. 위챗·인스타·미주 시장으로 확장 중.' },
        { ord: '04', title: '평생 케어 · 평생 락인', alt: '선릉·봉은사 본진 아틀리에', desc: '수강 1회로 끝나지 않습니다. 수강생 전용 K1 카톡방과 평생 업데이트로 연결.' },
      ],
    },
    tracks: {
      mark: 'CHOOSE YOUR PATH',
      title: '두 갈래로 들어옵니다',
      boldPart: '들어옵니다',
      lead: '이미 만들어 온 길과, 오늘부터의 새 흐름. 어느 쪽이든 같은 손에서 시작됩니다.',
      a: {
        ord: 'A · EXISTING WORKS',
        title: '기존 작업물과 모집 시리즈',
        boldPart: '모집 시리즈',
        desc: '지금까지 다듬어 온 6편의 STORY 시리즈, 갤러리, 모집 상세페이지, 회의록·개발 과정.',
        stats: [{ num: '6', lbl: 'STORY 시리즈' }, { num: '12+', lbl: '콘텐츠 자료' }, { num: '∞', lbl: '평생 라이브러리' }],
        go: '기존 포털 진입',
      },
      b: {
        ord: 'B · TODAY ONWARDS',
        title: '오늘부터의 새 흐름 5축',
        boldPart: '새 흐름 5축',
        desc: '일일 자동 포스팅, 다채널 AI 응답, 중국·미국 진출, 통합 자동화 웹앱. 2026-06-15부터 시작된 새 트랙.',
        stats: [{ num: '5', lbl: '전략 축' }, { num: '3', lbl: '언어' }, { num: '2026-09', lbl: 'LA 진출' }],
        go: '새 트랙 보기',
      },
    },
    axes: {
      mark: 'FIVE AXES', title: '오늘부터의 5축', boldPart: '5축',
      lead: '2026-06-15 정해진 새 전략 트랙. 각각의 라운드로 진행됩니다.',
      items: [
        { ord: 'AXIS 01', title: '일일 자동 포스팅', desc: '인스타·위챗 매일 발행. 스케줄러 + AI 카피·이미지 자동 생성.', status: 'PLANNED · R4' },
        { ord: 'AXIS 02', title: '다채널 AI 응답', desc: 'DM·카카오·위챗·전화. 24시간 1차 응대 → 상담 신청 유도.', status: 'PLANNED · R5' },
        { ord: 'AXIS 03', title: '중국 진출 — 위챗', desc: '위챗 광고·공식계정·중문 콘텐츠 운영. 중화권 수강 라인 구축.', status: 'PLANNED · R6' },
        { ord: 'AXIS 04', title: '미국 진출 — LA', desc: '2026-09 초 LA 시장조사 출장. 영문 채널 + 미주 한인·아시안 라인.', status: 'SCHEDULED · 2026-09' },
      ],
      axis5: { ord: 'AXIS 05', title: '통합 자동화 웹앱', descHtml: '위 1·2·3·4를 한 대시보드로. <a href="/translate-zh" style="color:var(--gold-light);text-decoration:underline">중국어 강의 번역</a> 메뉴 작동 중.', status: 'IN PROGRESS · R3' },
    },
    global: {
      mark: 'GLOBAL · 한 · 영 · 중', title: '그 결, 세 언어로', boldPart: '세 언어로',
      lead: '한국에서 시작된 기술을 영어·중국어로 동시 운영합니다.',
      cards: [
        { flag: '韓', head: '한국 — 본진', body: '선릉·봉은사 아틀리에 · 인스타 · 카카오 채널 · 모집 시리즈 6편', ch: '서비스 중' },
        { flag: '中', head: '中文 — 위챗 라인', body: '위챗 광고 · 공식계정 · 中文 콘텐츠 톤 매뉴얼 (라운드 6)', ch: '준비 중' },
        { flag: 'EN', head: 'English — LA', body: '9월 초 LA 시장조사 · 영문 랜딩 · 미주 한인·아시안 라인 (라운드 7)', ch: '2026 / 09 시작' },
      ],
    },
    ctaBand: { lines: ['소수에게만 직접 가르칩니다.', '창시자의 손에서.'], boldPart: '창시자의 손에서.', body: '같은 기수에 소수만 — 무게 있는 시작을 원하시면 상담을 신청하세요.', button: '상담 신청 →' },
    footer: {
      brand: '장미지', brandSub: 'artbrows',
      blurb: '극사실눈썹 창시자 장미지 원장의 선릉·봉은사 아틀리에. 한·영·중 3개 언어로 동시 운영.',
      brandCol: { title: 'BRAND', links: [{ text: '철학', href: '#stmt' }, { text: '시그니처', href: '#pillars' }, { text: '기존 작업물', href: 'https://jangmiji.staris.cloud', external: true }] },
      tracksCol: { title: 'NEW TRACKS', links: [{ text: '5축 전체', href: '#axes' }, { text: '중국어 강의 번역', href: '/translate-zh' }] },
      contactCol: {
        title: 'CONTACT',
        links: [{ text: '상담 신청', href: '/enroll' }, { text: '카카오 채널 · 인스타 DM' }, { text: '위챗 (中文) · 영문 (Coming)' }],
        k1: 'K1 수강생 전용 카톡방', k1Note: '(수강 완료 후 안내)',
      },
      bottom: '© 2026 JANGMIJI · STARIS · ALL RIGHTS RESERVED',
    },
    langLabels: { ko: 'KO', en: 'EN', zh: '中' },
  },

  en: {
    meta: { title: 'JANG MI-JI · Founder of Hyper Realistic Eyebrow', description: 'The Seonleung–Bongeunsa atelier. A masterclass in hyper realistic brows — hand-taught by the founder.' },
    utility: {
      brand: 'ARTBROWS & ACADEMY',
      menu: { founder: 'The Founder', hyperreal: 'What is Hyper Real', academy: 'Academy', curriculum: 'Curriculum', pricing: 'Pricing' },
      cta: { inquiry: 'Course Inquiry', consult: 'Book Consult' },
    },
    gnb: {
      brand: 'JANG MI-JI', brandSub: 'artbrows',
      menu: { philosophy: 'Philosophy', signature: 'Signature', tracks: 'Menu', newTracks: 'New Tracks', global: 'Global', admin: 'Admin ↗' },
      consult: 'Book Consult',
    },
    hero: {
      eyebrow: 'SINCE THE ORIGINAL · SEONLEUNG–BONGEUNSA ATELIER',
      headline: ['Hyper Realistic Brow,', 'from the Original Hand.'],
      highlight: 'Original',
      lead: 'To make a face most itself — that single strand of the brow we search for every day. Defined again by the weight of Seonleung, by the depth of the hand.',
      ctaPrimary: 'Book a Consult',
      ctaGhost: 'Read the Philosophy',
      figureLabel: '原相机直出 · NATURAL · ART BROW',
      figureAlt: 'Post-treatment natural mood — global line',
    },
    stmt: {
      mark: 'PHILOSOPHY',
      lines: ['Brows are not makeup — they are an extension of the bone.', 'To follow that line, human-first, is the single craft we have refined over 12 years.'],
      boldPart: 'extension of the bone',
      signature: '— JANG MI-JI, FOUNDER',
    },
    pillars: {
      mark: 'SIGNATURE', title: 'Four Pillars', boldPart: 'Pillars',
      lead: 'Directly from the founder’s hand — the four standards our Seonleung atelier has refined.',
      items: [
        { ord: '01', title: 'Hyper Realistic Signature', alt: 'Macro of hyper realistic brow', desc: 'Every strand, every pore’s depth, the flow of bone. Realism as the first standard.' },
        { ord: '02', title: 'Small-cohort Masterclass', alt: 'Working hand and pencil', desc: 'One-on-one coaching, taught directly by the founder. Few per class — carried to the fingertips.' },
        { ord: '03', title: 'Korea · China · US Global Line', alt: 'Seonleung–Bongeunsa night skyline', desc: 'Beyond Korea, the same craft. Expanding into WeChat, Instagram and the US market.' },
        { ord: '04', title: 'Lifelong Care · Lifelong Lock-in', alt: 'Seonleung–Bongeunsa main atelier', desc: 'Not one class and done. Alumni K1 KakaoTalk room and lifelong updates.' },
      ],
    },
    tracks: {
      mark: 'CHOOSE YOUR PATH', title: 'Two Ways In', boldPart: 'Ways In',
      lead: 'The paths already built, and the new current from today. Either way begins in the same hands.',
      a: {
        ord: 'A · EXISTING WORKS', title: 'Existing Works & Enrollment Series', boldPart: 'Enrollment Series',
        desc: '6 STORY episodes, gallery, enrollment detail pages, meeting notes & build history.',
        stats: [{ num: '6', lbl: 'STORY series' }, { num: '12+', lbl: 'Content assets' }, { num: '∞', lbl: 'Lifelong library' }],
        go: 'Enter Existing Portal',
      },
      b: {
        ord: 'B · TODAY ONWARDS', title: 'Five Axes from Today', boldPart: 'Five Axes',
        desc: 'Daily auto-posting, multi-channel AI reply, China & US launches, unified automation webapp. New tracks since 2026-06-15.',
        stats: [{ num: '5', lbl: 'Strategic axes' }, { num: '3', lbl: 'Languages' }, { num: '2026-09', lbl: 'LA launch' }],
        go: 'See New Tracks',
      },
    },
    axes: {
      mark: 'FIVE AXES', title: 'Five Axes from Today', boldPart: 'Five Axes',
      lead: 'The new strategy tracks set on 2026-06-15. Each ships as its own round.',
      items: [
        { ord: 'AXIS 01', title: 'Daily Auto Posting', desc: 'Daily publishing to Instagram & WeChat. Scheduler + AI copy & image generation.', status: 'PLANNED · R4' },
        { ord: 'AXIS 02', title: 'Multi-channel AI Reply', desc: 'DM · KakaoTalk · WeChat · phone. 24/7 first-touch → consult booking.', status: 'PLANNED · R5' },
        { ord: 'AXIS 03', title: 'China Launch — WeChat', desc: 'WeChat ads · Official account · CN copy ops. Building the Sinophone enrollment line.', status: 'PLANNED · R6' },
        { ord: 'AXIS 04', title: 'US Launch — LA', desc: 'LA market visit early 2026-09. English channel + Korean-American & Asian-American line.', status: 'SCHEDULED · 2026-09' },
      ],
      axis5: { ord: 'AXIS 05', title: 'Unified Automation Webapp', descHtml: 'Axes 1·2·3·4 in one dashboard. <a href="/translate-zh" style="color:var(--gold-light);text-decoration:underline">Chinese class translation</a> menu is live.', status: 'IN PROGRESS · R3' },
    },
    global: {
      mark: 'GLOBAL · KO · EN · ZH', title: 'The Same Line, in Three Languages', boldPart: 'Three Languages',
      lead: 'A craft born in Korea, run in English and Chinese in parallel.',
      cards: [
        { flag: '韓', head: 'Korea — Home', body: 'Seonleung–Bongeunsa atelier · Instagram · KakaoTalk · 6 STORY series', ch: 'Live' },
        { flag: '中', head: '中文 — WeChat Line', body: 'WeChat ads · Official account · CN copy manual (Round 6)', ch: 'Preparing' },
        { flag: 'EN', head: 'English — LA', body: 'Sept LA visit · EN landing · Korean/Asian-American line (Round 7)', ch: 'Starts 2026 / 09' },
      ],
    },
    ctaBand: { lines: ['We teach only a few, directly.', 'From the founder’s hand.'], boldPart: 'From the founder’s hand.', body: 'Few per class — for those who want a weighty beginning, book a consult.', button: 'Book a Consult →' },
    footer: {
      brand: 'JANG MI-JI', brandSub: 'artbrows',
      blurb: 'The Seonleung–Bongeunsa atelier of Jang Mi-ji, founder of hyper realistic brow. Operated in Korean, English, and Chinese.',
      brandCol: { title: 'BRAND', links: [{ text: 'Philosophy', href: '#stmt' }, { text: 'Signature', href: '#pillars' }, { text: 'Existing Works', href: 'https://jangmiji.staris.cloud', external: true }] },
      tracksCol: { title: 'NEW TRACKS', links: [{ text: 'All Five Axes', href: '#axes' }, { text: 'CN Class Translation', href: '/translate-zh' }] },
      contactCol: {
        title: 'CONTACT',
        links: [{ text: 'Book a Consult', href: '/enroll' }, { text: 'KakaoTalk · Instagram DM' }, { text: 'WeChat (中文) · English (Coming)' }],
        k1: 'K1 Alumni-only KakaoTalk room', k1Note: '(guided after course completion)',
      },
      bottom: '© 2026 JANGMIJI · STARIS · ALL RIGHTS RESERVED',
    },
    langLabels: { ko: 'KO', en: 'EN', zh: '中' },
  },

  zh: {
    meta: { title: '张美芝 · 超写实艺术眉创始人', description: '首尔宣陵·奉恩寺 atelier · 超写实艺术眉创始人张美芝院长的小班精英大师课' },
    utility: {
      brand: 'ARTBROWS & ACADEMY',
      menu: { founder: '院长介绍', hyperreal: '何为超写实眉', academy: '学院', curriculum: '课程', pricing: '价格' },
      cta: { inquiry: '教育咨询', consult: '预约操作' },
    },
    gnb: {
      brand: '张美芝', brandSub: 'artbrows',
      menu: { philosophy: '理念', signature: '标志', tracks: '菜单', newTracks: '新赛道', global: '全球', admin: '后台 ↗' },
      consult: '预约咨询',
    },
    hero: {
      eyebrow: 'SINCE THE ORIGINAL · SEONLEUNG-BONGEUNSA ATELIER',
      headline: ['超写实艺术眉,', '出自本源之手。'],
      highlight: '本源',
      lead: '让面容最像自己 — 这是我们每天寻找的那一根眉线。以宣陵之重、指尖之深,重新定义。',
      ctaPrimary: '预约课程咨询',
      ctaGhost: '阅读理念',
      figureLabel: '原相机直出 · NATURAL · ART BROW',
      figureAlt: '术后自然妆感 — 全球线路',
    },
    stmt: {
      mark: 'PHILOSOPHY',
      lines: ['眉毛不是妆容,而是骨骼的延伸。', '顺着那一道线,以人为本 — 这是我们打磨了 12 年的唯一手艺。'],
      boldPart: '骨骼的延伸',
      signature: '— JANG MI-JI, FOUNDER',
    },
    pillars: {
      mark: 'SIGNATURE', title: '四大核心', boldPart: '核心',
      lead: '出自创始人之手 — 宣陵·奉恩寺 atelier 打磨的四项标准。',
      items: [
        { ord: '01', title: '超写实标志', alt: '超写实眉近景', desc: '一根一根的走向、毛孔的深度、骨相的流动。以自然的真实感作为操作的第一标准。' },
        { ord: '02', title: '小班精英大师课', alt: '操作之手与笔', desc: '创始人亲授的一对一指导。同一期只收少数几人 — 抵达指尖。' },
        { ord: '03', title: '韩·中·美全球线路', alt: '宣陵·奉恩寺夜景', desc: '超越本土,将同一手艺延伸至微信·Instagram·美国市场。' },
        { ord: '04', title: '终身照护 · 终身锁定', alt: '宣陵·奉恩寺本店 atelier', desc: '一次学习不是终点。学员专属 K1 KakaoTalk 群与终身更新。' },
      ],
    },
    tracks: {
      mark: 'CHOOSE YOUR PATH', title: '两条路径 进入', boldPart: '进入',
      lead: '已有的路径,与自今日开始的新流。无论哪一边,都始于同一双手。',
      a: {
        ord: 'A · EXISTING WORKS', title: '既有作品与招募系列', boldPart: '招募系列',
        desc: '至今打磨的 6 集 STORY 系列、画廊、招募详情页、会议记录·开发历程。',
        stats: [{ num: '6', lbl: 'STORY 系列' }, { num: '12+', lbl: '内容资料' }, { num: '∞', lbl: '终身资料库' }],
        go: '进入既有门户',
      },
      b: {
        ord: 'B · TODAY ONWARDS', title: '自今日起的新五轴', boldPart: '新五轴',
        desc: '每日自动发帖、多渠道 AI 回复、中·美进军、整合自动化 Web 应用。2026-06-15 起启动的新赛道。',
        stats: [{ num: '5', lbl: '战略轴' }, { num: '3', lbl: '语言' }, { num: '2026-09', lbl: 'LA 进军' }],
        go: '查看新赛道',
      },
    },
    axes: {
      mark: 'FIVE AXES', title: '自今日起的五轴', boldPart: '五轴',
      lead: '2026-06-15 确定的新战略赛道。分轮次推进。',
      items: [
        { ord: 'AXIS 01', title: '每日自动发帖', desc: 'Instagram·微信每日发布。调度器 + AI 文案·图像自动生成。', status: 'PLANNED · R4' },
        { ord: 'AXIS 02', title: '多渠道 AI 回复', desc: 'DM·KakaoTalk·微信·电话。24 小时首轮应答 → 引导预约咨询。', status: 'PLANNED · R5' },
        { ord: 'AXIS 03', title: '中国进军 — 微信', desc: '微信广告·公众号·中文内容运营。构建中文圈课程线路。', status: 'PLANNED · R6' },
        { ord: 'AXIS 04', title: '美国进军 — 洛杉矶', desc: '2026-09 初 LA 市场调研出差。英文频道 + 韩裔·亚裔线路。', status: 'SCHEDULED · 2026-09' },
      ],
      axis5: { ord: 'AXIS 05', title: '整合自动化 Web 应用', descHtml: '将上述 1·2·3·4 汇入同一控制面板。<a href="/translate-zh" style="color:var(--gold-light);text-decoration:underline">中文课程翻译</a>菜单已运行。', status: 'IN PROGRESS · R3' },
    },
    global: {
      mark: 'GLOBAL · 韩 · 英 · 中', title: '同一根眉线,三种语言', boldPart: '三种语言',
      lead: '发源于韩国的手艺,以英文·中文同步运营。',
      cards: [
        { flag: '韓', head: '韩国 — 本店', body: '宣陵·奉恩寺 atelier · Instagram · KakaoTalk · 6 集 STORY 系列', ch: '正在服务' },
        { flag: '中', head: '中文 — 微信线', body: '微信广告·公众号·中文内容语气手册(第 6 轮)', ch: '筹备中' },
        { flag: 'EN', head: 'English — LA', body: '9 月初 LA 市场调研·英文着陆页·韩裔·亚裔线(第 7 轮)', ch: '2026 / 09 启动' },
      ],
    },
    ctaBand: { lines: ['只对少数人 亲自教授。', '出自创始人之手。'], boldPart: '出自创始人之手。', body: '每期仅收少数几位 — 若您想要一个有分量的开始,请预约咨询。', button: '预约咨询 →' },
    footer: {
      brand: '张美芝', brandSub: 'artbrows',
      blurb: '超写实艺术眉创始人张美芝院长的宣陵·奉恩寺 atelier。以韩·英·中三语同步运营。',
      brandCol: { title: 'BRAND', links: [{ text: '理念', href: '#stmt' }, { text: '标志', href: '#pillars' }, { text: '既有作品', href: 'https://jangmiji.staris.cloud', external: true }] },
      tracksCol: { title: 'NEW TRACKS', links: [{ text: '五轴全览', href: '#axes' }, { text: '中文课程翻译', href: '/translate-zh' }] },
      contactCol: {
        title: 'CONTACT',
        links: [{ text: '预约咨询', href: '/enroll' }, { text: 'KakaoTalk · Instagram DM' }, { text: '微信(中文)· English(Coming)' }],
        k1: 'K1 学员专属 KakaoTalk 群', k1Note: '(完成课程后引导加入)',
      },
      bottom: '© 2026 JANGMIJI · STARIS · ALL RIGHTS RESERVED',
    },
    langLabels: { ko: 'KO', en: 'EN', zh: '中' },
  },
};

export function getMessages(lang: Lang): HomeMessages {
  return MESSAGES[lang] ?? MESSAGES.ko;
}
