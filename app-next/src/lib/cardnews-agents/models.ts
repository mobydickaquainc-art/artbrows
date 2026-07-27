/**
 * 모델 공통 인터페이스 · Gemini + OpenAI 어댑터
 * 서버 사이드 전용 (Route Handler 에서만 import).
 * Anthropic 은 키 있으면 추후 확장 · 지금은 지원 X.
 */

import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
import type { ModelId } from './types';

// ── 클라이언트 lazy init ──
let _gemini: GoogleGenAI | null = null;
let _openai: OpenAI | null = null;

function gemini(): GoogleGenAI {
  if (!_gemini) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('GEMINI_API_KEY not set');
    _gemini = new GoogleGenAI({ apiKey: key });
  }
  return _gemini;
}
function openai(): OpenAI {
  if (!_openai) {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error('OPENAI_API_KEY not set');
    _openai = new OpenAI({ apiKey: key });
  }
  return _openai;
}

// ── 어떤 모델 사용 가능한가 ──
export function availableModels(): ModelId[] {
  const list: ModelId[] = [];
  if (process.env.GEMINI_API_KEY) list.push('gemini');
  if (process.env.OPENAI_API_KEY) list.push('openai');
  if (process.env.ANTHROPIC_API_KEY) list.push('claude');
  return list;
}

// ── 공통 인터페이스 ──
export interface ChatOptions {
  system?: string;
  temperature?: number;
  maxTokens?: number;
}

// 텍스트 응답 · 항상 최신 모델 우선 폴백 체인 (2026-07-21 대표님 원칙)
export async function chatText(model: ModelId, prompt: string, opts: ChatOptions = {}): Promise<string> {
  if (model === 'gemini') {
    // 폴백 체인 · 최신 우선 (2026-07-27 대표님 지시 「gemini 3.1 pro 이게 더 좋다」)
    const models = [
      'gemini-3.1-pro',
      'gemini-3.1-pro-latest',
      'gemini-3-pro',
      'gemini-3.0-pro',
      'gemini-3.1-flash',
      'gemini-3-flash',
      'gemini-3.0-flash',
      'gemini-pro-latest',
      'gemini-flash-latest',
      'gemini-2.5-flash',
    ];
    let lastErr: unknown = null;
    for (const m of models) {
      try {
        const r = await gemini().models.generateContent({
          model: m,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            systemInstruction: opts.system,
            temperature: opts.temperature ?? 0.7,
            maxOutputTokens: opts.maxTokens ?? 4096,
          },
        });
        return r.text ?? '';
      } catch (e) {
        lastErr = e;
        const msg = e instanceof Error ? e.message : String(e);
        if (!/503|UNAVAILABLE|404|NOT_FOUND|not\s*available/i.test(msg)) throw e;
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error('all gemini text models failed');
  }
  if (model === 'openai') {
    // 폴백 체인 · 최신 우선 (2026-07-27 대표님 지시 · 「제일 좋은걸로」)
    const models = ['gpt-5.1', 'gpt-5.1-mini', 'gpt-5-pro', 'gpt-5', 'gpt-5-mini', 'gpt-4.1', 'gpt-4o'];
    let lastErr: unknown = null;
    for (const m of models) {
      try {
        const r = await openai().chat.completions.create({
          model: m,
          messages: [
            ...(opts.system ? [{ role: 'system' as const, content: opts.system }] : []),
            { role: 'user' as const, content: prompt },
          ],
          temperature: opts.temperature ?? 0.7,
          max_tokens: opts.maxTokens ?? 4096,
        });
        return r.choices[0]?.message?.content ?? '';
      } catch (e) {
        lastErr = e;
        const msg = e instanceof Error ? e.message : String(e);
        if (!/404|not\s*found|does not exist|model_not_found/i.test(msg)) throw e;
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error('all openai models failed');
  }
  throw new Error(`model not supported yet: ${model}`);
}

// JSON 응답 (강제 · 실패 시 정제 재시도)
export async function chatJson<T = unknown>(model: ModelId, prompt: string, opts: ChatOptions = {}): Promise<T> {
  const wrapped = `${prompt}\n\n반드시 JSON 만 응답. 코드 블록 감싸지 말고 순수 JSON.`;
  const raw = await chatText(model, wrapped, { ...opts, temperature: opts.temperature ?? 0.5 });
  return parseJson<T>(raw);
}

function parseJson<T>(raw: string): T {
  // markdown 코드 블록 정제
  let s = raw.trim();
  if (s.startsWith('```')) {
    s = s.replace(/^```(?:json)?\s*/, '').replace(/```$/, '').trim();
  }
  // JSON 시작 위치 찾기
  const start = s.indexOf('{');
  const arrStart = s.indexOf('[');
  const first = (arrStart !== -1 && (start === -1 || arrStart < start)) ? arrStart : start;
  if (first > 0) s = s.slice(first);
  // 끝 위치
  const lastObj = s.lastIndexOf('}');
  const lastArr = s.lastIndexOf(']');
  const last = Math.max(lastObj, lastArr);
  if (last !== -1 && last < s.length - 1) s = s.slice(0, last + 1);
  return JSON.parse(s) as T;
}

// Gemini Vision (이미지 파일 경로 리스트 + 프롬프트)
export async function geminiVision(imagePaths: string[], prompt: string, opts: ChatOptions = {}): Promise<string> {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const parts = [] as Array<
    | { text: string }
    | { inlineData: { mimeType: string; data: string } }
  >;
  parts.push({ text: prompt });
  for (const p of imagePaths) {
    // 웹 경로 (/brand/...) 우선 감지 · Windows path.isAbsolute 은 슬래시 시작을 true 처리하므로 회피
    const isWebPath = p.startsWith('/') && !p.match(/^[a-zA-Z]:[\\/]/);
    const abs = isWebPath
      ? path.join(process.cwd(), 'public', p.replace(/^\//, ''))
      : path.isAbsolute(p) ? p : path.join(process.cwd(), 'public', p);
    const buf = await fs.readFile(abs);
    const ext = path.extname(abs).toLowerCase().replace('.', '');
    const mimeType = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'webp' ? 'image/webp' : 'image/png';
    parts.push({ inlineData: { mimeType, data: buf.toString('base64') } });
  }
  // 모델 폴백 체인: 3.1+ 최신 우선 · 순차 폴백 (2026-07-27 대표님 지시 · Gemini Vision)
  const models = [
    'gemini-3.1-pro',
    'gemini-3.1-pro-latest',
    'gemini-3-pro',
    'gemini-3.0-pro',
    'gemini-3.1-flash',
    'gemini-3-flash',
    'gemini-3.0-flash',
    'gemini-pro-latest',
    'gemini-flash-latest',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
  ];
  let lastErr: unknown = null;
  for (const model of models) {
    try {
      const r = await gemini().models.generateContent({
        model,
        contents: [{ role: 'user', parts }],
        config: {
          systemInstruction: opts.system,
          temperature: opts.temperature ?? 0.5,
          maxOutputTokens: opts.maxTokens ?? 2048,
        },
      });
      return r.text ?? '';
    } catch (e) {
      lastErr = e;
      const msg = e instanceof Error ? e.message : String(e);
      // 503 UNAVAILABLE / 404 NOT_FOUND 만 폴백 · 다른 에러는 즉시 throw
      if (!/503|UNAVAILABLE|404|NOT_FOUND|not\s*available/i.test(msg)) throw e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('all gemini vision models failed');
}

/**
 * Gemini Image Edit — 원본 이미지 + 프롬프트 → 편집된 이미지 (base64 PNG 반환)
 * 2026-07-21 · 수강생·손님 얼굴 익명화 · 재가공 용도
 */
export async function geminiImageEdit(imagePath: string, prompt: string): Promise<{ base64: string; mimeType: string }> {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const isWebPath = imagePath.startsWith('/') && !imagePath.match(/^[a-zA-Z]:[\\/]/);
  const abs = isWebPath
    ? path.join(process.cwd(), 'public', imagePath.replace(/^\//, ''))
    : path.isAbsolute(imagePath) ? imagePath : path.join(process.cwd(), 'public', imagePath);
  const buf = await fs.readFile(abs);
  const ext = path.extname(abs).toLowerCase().replace('.', '');
  const inputMime = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'webp' ? 'image/webp' : 'image/png';

  // Gemini 이미지 편집 · 3.1+ 최신 우선 · 순차 폴백 (2026-07-27 대표님 지시)
  const models = [
    'gemini-3.1-pro-image',
    'gemini-3.1-pro-image-preview',
    'gemini-3-pro-image-preview',
    'gemini-3-pro-image',
    'gemini-3.0-pro-image',
    'gemini-3.1-flash-image',
    'gemini-3-flash-image',
    'gemini-2.5-flash-image-preview',
    'gemini-2.5-flash-image',
    'gemini-2.0-flash-preview-image-generation',
  ];
  let lastErr: unknown = null;
  for (const model of models) {
    try {
      const r = await gemini().models.generateContent({
        model,
        contents: [{ role: 'user', parts: [
          { text: prompt },
          { inlineData: { mimeType: inputMime, data: buf.toString('base64') } },
        ] }],
        config: {
          // image generation 시 responseModalities 필수
          responseModalities: ['IMAGE'] as unknown as string[],
        },
      });
      const parts = r.candidates?.[0]?.content?.parts ?? [];
      for (const p of parts) {
        const inline = (p as { inlineData?: { data?: string; mimeType?: string } }).inlineData;
        if (inline?.data) {
          return { base64: inline.data, mimeType: inline.mimeType ?? 'image/png' };
        }
      }
      lastErr = new Error(`${model} returned no image part`);
    } catch (e) {
      lastErr = e;
      const msg = e instanceof Error ? e.message : String(e);
      if (!/503|UNAVAILABLE|404|NOT_FOUND|not\s*available/i.test(msg)) throw e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('all gemini image edit models failed');
}
