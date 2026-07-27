# PROMPTS · 장미지 원장님 극사실 톤 정본 (2026-07-20)

> 원장님이 좋아하시는 극사실 에디토리얼 톤을 힉스필드·Claude Code·Gemini 3 Pro Image·나노바나나 프로 등에서 재현 가능한 프롬프트 라이브러리
> 정본 위치: `docs/PROMPTS-JANGMIJI-HYPERREAL.md`
> 참조 축적: `visual-direction-hyperreal`, `artbrows-persona-tone-standard`, `artbrows-luxury-dark-tone-final`, `artbrows-china-market-keywords-2026-06-29`, `artbrows-pre-treatment-pencil`, `artbrows-official-facts-2026-07-19`

---

## 0. 핵심 3원칙 (외우세요)

1. **극사실 = 진짜 사람** · AI 티 절대 없음 · 일러스트·애니·CGI·플랫 그래픽 절대 금지
2. **극사실눈썹 = 털 같은 눈썹** · 원장님 원문 「고객이 원하는 것은 그린 눈썹이 아니라 털 같은 눈썹이다」
3. **에디토리얼 뷰티 매거진** 격 · 인스타 필터·틱톡 뷰티캠 X · Vogue Beauty 급

---

## 1. 원장님 「좋다」 6가지 시각 코드

원장님이 반복 언급/제공한 참조에서 추출한 공통 코드:

| # | 코드 | 원장님 원문 · 근거 |
|---|---|---|
| 1 | **자연 텍스처 (모공·주근깨·잔털)** | 「원상기 직출 (原相机直出) 느낌」 · 「因瑕疵而鲜活 = 흠결로 인해 생생」 |
| 2 | **털 같은 눈썹 (feathered hair-like)** | 「고객이 원하는 것은 그린 눈썹이 아니라 털 같은 눈썹」 |
| 3 | **웜 림 라이트 (right-back)** | persona-ref 2장 공통 · 우측 위 따뜻 조명 |
| 4 | **뉴트럴 자연광 · 필터 X** | 소홍서 「직출」 · Luxury Dark 배경 + 자연광 인물 |
| 5 | **명품 브랜드 감성 (프라다·에르메스급)** | 「싸구려 시술 컨셉 X · 명품 판매 컨셉」 (2026-07-20 회의) |
| 6 | **친숙한 청순 (20대 청순 or 30대 우아 마니아)** | 어려 보이는 자연 · 무표정 or 미세 미소 · 정면 or 살짝 옆 |

---

## 2. 마스터 프롬프트 (English · 힉스필드/나노바나나/Gemini 공용)

### 2-1. Base Positive Prompt (짧은 버전)

```
Ultra-photorealistic beauty editorial portrait of a Korean woman, 
hyper-realistic pore-level skin texture with visible fine hair and natural freckles, 
feathered hair-like eyebrows with individual strands visible (each strand razor sharp), 
soft warm rim light from upper right, neutral daylight fill, 
clean black background (#0B0907 warm undertone), 
raw camera output feel (no filter, no beauty retouch), 
Vogue Beauty magazine quality, 85mm portrait lens compression, 
shallow depth of field with tack-sharp brows and eyes, 
subtle film grain, natural gloss on lips (no makeup), 
professional editorial photography, shot on Hasselblad
```

### 2-2. Full Expanded Prompt (긴 버전 · nano_banana_pro 권장)

```
SUBJECT:
A Korean or East Asian woman, aged 25-35, natural face with subtle asymmetry, 
looks-younger-than-age quality, confident subtle expression 
(neither overly smiling nor stiff), direct eye contact or slight three-quarter angle.

SKIN (극한 텍스처 · 원장님 절대 원칙):
- Pore-level visible skin texture across cheeks and nose bridge
- Preserve natural freckles, moles, fine peach fuzz on cheek edges
- Slight natural sebum sheen on T-zone (nose bridge, forehead center)
- NO airbrush, NO plastic smoothing, NO beauty filter
- Skin tone: warm neutral (Fitzpatrick II-III), no orange cast, no cool blue

EYEBROWS (핵심 · 극사실눈썹 창시자 정체성):
- Feathered natural-hair texture with each strand individually visible
- Slightly sparse at inner head, denser body, thin natural tail
- Hair direction: upward at head, sideways-outward mid, downward-outward at tail
- Warm dark brown color matching hair (not black, not artificial gray)
- Semi-permanent finish appearance: looks LIKE REAL HAIR, not drawn
- NO blocky microblading, NO overdrawn shape, NO shading fill

EYES:
- Warm dark brown iris with subtle catchlight from rim light (upper right)
- Individual eyelash separation visible, natural mascara only
- Slight natural under-eye shadow (not concealer-hidden)

LIPS:
- Nude peach or soft rose, natural gloss (not lipstick)
- Slight natural texture, no matte flatness
- Slight parted or gently closed

HAIR:
- Warm dark brown with subtle highlights (not black, not blonde)
- Naturally falling shoulder-length or long
- Loose flyaway strands framing face (NOT slicked back)
- Slight natural wave, unstyled feel

STYLING:
- Black tank top or simple black crew neck (minimal)
- ONE cubic earring (small square sparkle) - optional
- No necklace or single thin chain
- No visible logos or brand markings

LIGHTING:
- Warm rim light from upper-right (3200K, softbox at 45° above)
- Soft neutral fill from front-left (5000K, large diffused source)
- Natural shadow falling on left cheek side
- Slight catchlight in eyes from key light
- Golden hour or warm indoor daylight mood

BACKGROUND:
- Deep warm black #0B0907 seamless OR
- Soft neutral warm gray studio backdrop OR
- Very shallow bokeh natural environment (blurred beyond recognition)

CAMERA & LENS:
- Full-frame medium format feel (Hasselblad H6D or Phase One IQ4)
- 85mm-135mm portrait lens compression
- Aperture f/2.8-f/4 (razor sharp on brows/eyes, shallow DOF)
- ISO 100-400 for clean detail
- RAW straight-out-of-camera aesthetic
- Slight subtle film grain overlay (Kodak Portra 400 emulation)

POST GRADE:
- Neutral white balance (no amber wash, no cool tint)
- Slight shadow lift (+3-5%) to preserve texture detail
- Highlight roll-off (avoid clipping on T-zone shine)
- Modest saturation (+10-15% only)
- Contrast +12% for editorial feel
- Subtle warm bias (+3-5 red midtones only)

MOOD / KEYWORDS:
editorial beauty, Vogue Beauty section, Harper's Bazaar, 
prestige skincare campaign, quiet luxury, hyperrealism, 
documentary beauty photography, 因瑕疵而鲜活 (vivid through imperfection), 
super realistic wild brow (超写实野生眉), 극사실 아트 눈썹
```

### 2-3. Negative Prompt (반드시 포함 · 힉스필드/Gemini)

```
illustration, anime, manga, cartoon, comic book, cel shading, ghibli, 
3D render, CGI, unreal engine, octane, blender, digital painting, painterly, 
vector art, flat design, stylized, chibi, kawaii, 
airbrushed, plastic skin, smooth skin, no pores, doll-like, uncanny valley, 
heavy makeup, drag makeup, contouring, obvious foundation, 
overdrawn eyebrows, drawn brows, painted brows, blocky microblading, 
shaded brow filler, ombre brow, powder brow, tattooed brow flat, 
Instagram filter, TikTok beauty cam, FaceApp, snap filter, cheesy glow, 
lens flare, overexposed, blown highlights, HDR crush, oversaturated, 
neon colors, cool blue tint, teal-and-orange, cyberpunk, 
fantasy elements, magical, ethereal glow, sparkle particles, 
watermark, text overlay, logo, subtitle, brand text, 
extra fingers, deformed hands, distorted face, asymmetric weirdness, 
multiple faces (unless before-after paired panel), 
low quality, blurry, noisy, jpeg artifacts, compression artifacts, 
generic stock photo, corporate stock, cliché smiling model, 
white background overexposed, harsh flash, direct on-camera flash
```

---

## 3. 시나리오별 프롬프트 변형

### 3-1. 홈페이지 히어로 (풀샷 · Chest-up)

```
[Base positive prompt above]
+ shot from chest-up, subject looks directly at camera with subtle confidence, 
warm rim light from upper right creating rim glow on hair, 
deep black backdrop with subtle vignette, 
slight three-quarter body angle, hands not visible, 
Vogue September issue cover mood, 
composition: subject centered with slight negative space above head
```

### 3-2. 눈썹 클로즈업 (극사실 시그니처)

```
Extreme close-up macro beauty shot of a Korean woman's eyebrow area, 
frame includes: one full eyebrow, upper eye lid, browbone, part of forehead, 
each individual eyebrow hair strand razor sharp with visible texture, 
strands showing natural hair direction (upward at head, sideways-out at body, down at tail), 
warm dark brown color with subtle highlights on individual hairs, 
skin surrounding brow shows visible pores and fine peach fuzz, 
soft warm rim light from upper right, 
shallow depth of field with tack-sharp brow, softer temple/forehead, 
shot on 100mm macro lens f/4, 
mood: hyperreal beauty documentary, 
show the finish of semi-permanent hyperrealistic brow technique (극사실눈썹) 
that looks INDISTINGUISHABLE from real hair growth
```

### 3-3. Before / After 페어드 패널 (아카데미·광고)

```
Split-panel beauty comparison, two frames side by side or top-bottom:
LEFT (BEFORE): 
  - Same Korean woman, sparse or irregular natural eyebrows, 
  - Slightly bare inner head, uneven tail, some gaps, 
  - Same lighting and expression as AFTER frame
RIGHT (AFTER): 
  - Same subject with完美 극사실눈썹 semi-permanent treatment result, 
  - Feathered hair-like brows, individual strands visible, 
  - Natural gradient shape (sparse head → dense body → thin tail), 
  - Looks like enhanced natural hair, NOT drawn on
Both frames: identical lighting (warm rim + neutral fill), 
identical background (soft warm gray or deep black), 
identical angle and framing, 
minimal white gap between frames with clean "BEFORE" / "AFTER" text 
in serif font (Cormorant Garamond or similar), 
overall mood: editorial magazine comparison, prestige clinic case study
```

### 3-4. 원장님 시술 장면 (아틀리에)

```
Editorial documentary shot of a female eyebrow artist working on client's brow, 
artist in warm neutral studio, close-up on her precise hand movement 
holding pigmentation tool over client's brow, 
soft daylight from north-facing window, 
warm interior tones (walnut wood, brass fixtures, marble table edge), 
Maison Noir luxury atelier mood (like Hermès workshop or Bulgari salon), 
subject: professional woman aged 40s, calm expert focus, 
short dark hair, neutral wardrobe (black or ivory), 
hands: extremely detailed, sharp precise grip, 
client's face partially visible (mostly brow area in focus), 
mood: quiet luxury, master craftsman, 30-year experience credibility, 
NOT clinical medical, NOT ad-cheesy, 
Vanity Fair profile piece feel
```

### 3-5. 인스타 세로 릴스 (9:16 · 광고용)

```
Vertical 9:16 aspect ratio, 
half-body portrait of Korean woman, 
subject slightly off-center (rule of thirds, right third), 
extra space on left for text overlay opportunity, 
warm rim light from left this time (matching layout), 
deep black background, 
subject in black minimal top, 
subtle motion in hair (slight breeze feel), 
suitable for Instagram Reels or TikTok organic post, 
duration: still frame that would loop naturally, 
mood: quiet-luxury lifestyle documentary, 
NOT ad hard-sell, NOT influencer selfie
```

### 3-6. 극사실 4대 카테고리 우산 (Coming Soon)

각 카테고리는 subject가 다르지만 톤 통일:

```
[BROW · 진행 중]
Close-up of perfect feathered semi-permanent brow, hyperreal hair-strand texture

[EYELINE · 준비 중]  
Close-up of subtle enhanced upper lash line, invisible enhancement look, 
NOT thick eyeliner, natural lash root definition only

[LIP · 준비 중]  
Close-up of naturally-colored lip, "was that her natural color?" moment, 
subtle enhanced pink-nude tone, natural lip texture preserved

[HAIRLINE · 준비 중]  
Close-up of forehead hairline with tiny individual hair strands filled in, 
NOT obvious tattoo, looks like real baby hair growth

All 4: identical lighting (warm rim + neutral fill), identical grade, 
create a cohesive 우산 브랜드 (umbrella brand) collection
```

---

## 4. 힉스필드 (Higgsfield) MCP 사용 요령

### 4-1. 이미지 · nano_banana_pro (2D)
- **입력 시**: 위 「Full Expanded Prompt」 그대로 · negative prompt는 지원 안 되므로 부정 요소는 positive에서 배제
- **참조 이미지 첨부**: 원장님 preferred references 첨부 시 정합도 상승
  - `회의-자료/원장님-신규자료-20260629-1740/persona-ref-01-dark-luxury-tone-portrait.jpg`
  - `회의-자료/원장님-신규자료-20260629-1740/persona-ref-02-dark-luxury-tone-portrait-alt.jpg`
- **크레딧**: 장당 1 크레딧 (풀 프롬프트) · 여러 seed 실험 시 3~5장 권장

### 4-2. 영상 · Veo 3.1 (image-to-video)
- **이미지 우선 생성** → 마음에 드는 컷을 Veo 3.1 input으로 사용
- **모션 프롬프트 추가**:
  ```
  subtle head turn to camera, slight breath movement, 
  natural eye blink once, hair strands moving slightly in air, 
  4 seconds duration, cinematic slow motion, 
  no camera zoom, no dramatic pan, quiet composed motion, 
  editorial fashion film mood
  ```

### 4-3. 3D · image_to_3d
- 눈썹 클로즈업 프롬프트 결과물 → 3D 변환 시 PBR + quad + symmetry 옵션 (30 크레딧/회 · [[higgsfield-usage]] 참조)

---

## 5. Claude Code 자체 프롬프트 사용 요령

Gemini 2.5 Pro Image / Nano Banana Pro Text-to-Image API 직접 호출 시:

```javascript
const prompt = "위 Base Positive Prompt";
const negativePrompt = "위 Negative Prompt";
const params = {
  model: "gemini-2.5-pro-image" || "nano_banana_pro",
  prompt,
  negative_prompt: negativePrompt,
  aspect_ratio: "9:16" | "1:1" | "4:5" | "16:9",  // 용도별
  guidance_scale: 8.5,  // 6.5-9.5 사이 · 프롬프트 존중도
  num_inference_steps: 40,  // 25-60
  seed: null,  // 다양성 위해 랜덤
};
```

**팁**:
- **첫 3장** 은 자유롭게 → 좋은 seed 확보 → 이후 그 seed로 세부 조정
- **CFG (guidance scale)**: 낮으면 (5-7) 자연스러움 · 높으면 (9-12) 프롬프트 정확
- 원장님 톤은 **CFG 7.5-8.5** 권장 (너무 프롬프트 정확하면 부자연)

---

## 6. 원장님 검수 체크리스트 (생성 후 필수)

각 생성 이미지는 아래 6가지 통과해야 채택:

- [ ] **AI 티 안 남**? (얼굴 대칭 이상 · 손 이상 · 눈 이상 · 귀 이상 검사)
- [ ] **모공 보임**? (매끈한 플라스틱 톤 X)
- [ ] **눈썹이 진짜 털 같음**? (그린 티 X · 블록 티 X)
- [ ] **필터 티 안 남**? (인스타 뷰티캠 X · 오버 필터 X)
- [ ] **명품 감성**? (싸구려 광고 티 X · 편집샵 뷰티 매거진 O)
- [ ] **한국·아시아 자연 얼굴**? (백인화 X · 과도한 성형 티 X)

**하나라도 X = 재생성**

---

## 7. 실 프롬프트 라이브러리 (복사 · 붙여넣기)

### 라이브러리 A: 홈피 히어로 (한 번에 다양성)

```
Ultra-photorealistic beauty editorial portrait of a Korean woman aged 30, hyperreal pore-level skin texture with visible freckles and fine peach fuzz, feathered hair-like eyebrows with individual strands razor sharp, soft warm rim light from upper right (3200K softbox), neutral daylight fill from front, deep black background (#0B0907), Hasselblad medium format 100mm f/2.8, subtle film grain (Kodak Portra 400), no filter no retouch raw camera output, Vogue Beauty magazine quality, subject wears simple black tank top with one small cubic earring, warm dark brown hair naturally falling shoulder length with loose flyaways, natural nude peach lip gloss, subtle confident expression direct eye contact, quiet luxury 명품 브랜드 mood
```

### 라이브러리 B: 극사실눈썹 클로즈업 (시그니처)

```
Extreme macro close-up of one Korean woman's eyebrow, frame from mid-forehead to upper eyelid, each individual eyebrow hair strand tack sharp with visible natural direction (upward at head, sideways outward mid, downward tail), warm dark brown strands with subtle highlights, feathered natural gradient shape (sparse head, dense body, thin tail), skin around brow shows visible pores and fine peach fuzz, semi-permanent hyperrealistic brow finish indistinguishable from real hair growth, warm rim light upper right, shallow depth of field brow tack sharp temple soft, 100mm macro f/4 Phase One IQ4, editorial beauty documentary mood, no filter no retouch, 극사실눈썹 창시자 signature finish
```

### 라이브러리 C: Before / After 광고

```
Editorial split-panel beauty comparison of same Korean woman aged 32, BEFORE frame shows sparse irregular natural brows with gaps and bare inner head, AFTER frame shows perfect feathered hair-like semi-permanent brow result with individual strand visibility natural gradient sparse-to-dense-to-thin shape, both frames identical lighting warm rim upper right neutral fill soft warm gray studio backdrop, identical camera angle and framing, chest-up composition with clean minimal white gap between frames, elegant serif labels BEFORE and AFTER in Cormorant Garamond, no cheesy ad text, prestige clinic case study mood, Hasselblad medium format editorial quality
```

### 라이브러리 D: 원장님 아틀리에 (마스터 크래프트)

```
Editorial documentary portrait of Korean female eyebrow master artist in her twenties-of-experience atelier, close-up on precise hand movement holding brow pigmentation tool over client's brow, subject: professional woman aged 40s calm expert focus short dark hair neutral black outfit, hands extremely detailed sharp precise grip, client's brow area in focus face partially visible, warm north-facing window daylight, atelier interior with walnut wood brass fixtures marble table edge, Maison Noir luxury atelier mood like Hermès workshop, quiet luxury master craftsman 30-year experience credibility, Vanity Fair profile piece feel, no clinical medical vibe no ad-cheesy vibe
```

### 라이브러리 E: 극사실 4대 카테고리 (Coming Soon 우산)

```
[BROW]
Extreme close-up of perfect feathered semi-permanent brow with hyperreal individual hair strand texture, warm rim light, deep black background, Vogue Beauty macro shot

[EYELINE]
Extreme close-up of natural enhanced upper lash line invisible-enhancement subtle definition NOT thick eyeliner, warm rim light, deep black background, matching mood to BROW frame

[LIP]
Extreme close-up of naturally colored enhanced pink-nude lip with preserved natural texture "was that her natural color" moment, warm rim light, deep black background, matching mood

[HAIRLINE]  
Extreme close-up of forehead hairline with tiny individual hair strand semi-permanent enhancement NOT obvious tattoo looks like real baby hair growth, warm rim light, deep black background, matching mood
```

---

## 8. 실패 사례 학습 (원장님이 거절한 톤 · 재발 방지)

| 실패 톤 | 원장님 지적 | 재발 방지 프롬프트 추가 |
|---|---|---|
| 웜 필터 강함 (`-vivid` 실험) | 「너무 노란기 · 필터 티」 | `no amber wash, neutral white balance` |
| 뷰티 필터 스무딩 | 「AI 티 · 진짜 아님」 | `pore-level texture, no smoothing, no airbrush` |
| 애니풍·일러스트 (STORY 7편) | 「극사실로 가야 · 코믹스러운건 안통함」 | `no illustration, no anime, no cartoon` |
| 광고 뷰티캠 (`-bright` 초기) | 「표가 잘 안 나 · 광고용으로 세게」 | 광고용은 별도 · 에디토리얼은 subtle |
| 클리니컬 의료 톤 | 「명품 판매 컨셉 · 싸구려 X」 | `Vogue Beauty, quiet luxury, no clinical medical` |
| 오버 성형 얼굴 | 「자연 얼굴 우대」 | `natural face with subtle asymmetry, no filler-heavy` |

---

## 9. 자산 참조 링크

### 참조 이미지 (원장님 확정)
- `회의-자료/원장님-신규자료-20260629-1740/persona-ref-01-dark-luxury-tone-portrait.jpg`
- `회의-자료/원장님-신규자료-20260629-1740/persona-ref-02-dark-luxury-tone-portrait-alt.jpg`

### 참조 (오늘 2026-07-20)
- 小红书 「因瑕疵而鲜活」 스크린샷 · 웜 필름 자연 톤 (但 웜 필터 방향으론 X · 자연 텍스처만 참조)
- Hyperreal editorial 뷰티 클로즈업 (모공·주근깨·눈썹결 극대 · 뉴트럴 WB) — **이 톤이 원장님 최선호 확정**

### 실제 영상 자산 (오늘 처리)
- `app-next/public/brand/ref/01.mp4` — 원본 극사실눈썹 비포·애프터 세로
- `app-next/public/brand/ref/02.mp4` — 원본 폴라로이드 스타일 정사각
- `01-real.mp4` `02-real.mp4` — 에디토리얼 극사실 그레이드 (프롬프트 정합)

---

## 10. 다음 액션 (프롬프트 활용)

1. **홈피 히어로 재생성** — 라이브러리 A로 3~5장 뽑고 원장님 픽
2. **극사실눈썹 시그니처 클로즈업** — 라이브러리 B로 hero 하단 노출
3. **Before/After 3세트** — 라이브러리 C로 아카데미 신뢰 근거
4. **원장님 아틀리에 씬 1컷** — 라이브러리 D로 About 섹션
5. **극사실 4대 카테고리 4컷** — 라이브러리 E로 우산 브랜드 카드 강화
6. **광고 인스타 릴스 3편** — 3-5 세로 프롬프트 + Veo 3.1 모션

**우선순위**: 1 → 2 → 3 (홈피 방향성 12항 우선) → 4 → 5 → 6

---

## 11. 관련 메모리 (컨텍스트)

- [[visual-direction-hyperreal]] — 극사실 통일 · 일러스트 절대 금지 (원장님 3회 반복)
- [[artbrows-persona-tone-standard]] — persona-ref 2장 · 20~25세 청순 톤
- [[artbrows-luxury-dark-tone-final]] — Maison Noir 다크 · #0B0907 + Champagne Gold
- [[artbrows-china-market-keywords-2026-06-29]] — 「超写实野生眉」 = 극사실 야생눈썹
- [[artbrows-main-keyword-art-brow]] — 「극사실 아트 눈썹」 메인 키워드
- [[artbrows-pre-treatment-pencil]] — 「극사실 = 펜슬 정확성」 30년 노하우
- [[artbrows-official-facts-2026-07-19]] — 「털 같은 눈썹」 원장님 원문
- [[higgsfield-usage]] — nano_banana_pro 1크/장 · image_to_3d 30크/회
- [[artbrows-higgsfield-policy-revised]] — 간단=Claude Code / 고품질=Gemini / Higgsfield=3D·영상

---

**최종 업데이트**: 2026-07-20 · 오늘 참조 이미지 2건 (小红书 + Hyperreal editorial) 흡수 반영
**정본 담당**: 이 파일은 원장님 검수 후 확정 · 프롬프트 개선 시 이 파일에 직접 갱신
