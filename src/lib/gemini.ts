import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

function sanitizeKey(raw?: string): string | undefined {
  if (!raw) return undefined;
  const clean = raw.trim().replace(/^["']|["']$/g, '').trim();
  return clean.length > 5 ? clean : undefined;
}

export function getEnvApiKey(): string | undefined {
  if (process.env.GEMINI_API_KEY) {
    const key = sanitizeKey(process.env.GEMINI_API_KEY);
    if (key) return key;
  }

  // Fallback: Read directly from .env.local or .env file if process.env wasn't loaded
  try {
    const envLocalPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envLocalPath)) {
      const content = fs.readFileSync(envLocalPath, 'utf-8');
      const match = content.match(/GEMINI_API_KEY\s*=\s*(.+)/);
      if (match && match[1]) {
        const key = sanitizeKey(match[1]);
        if (key) return key;
      }
    }

    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const match = content.match(/GEMINI_API_KEY\s*=\s*(.+)/);
      if (match && match[1]) {
        const key = sanitizeKey(match[1]);
        if (key) return key;
      }
    }
  } catch (err) {
    console.error('Error reading .env file directly:', err);
  }

  return undefined;
}

export function getGeminiClient(customApiKey?: string): GoogleGenerativeAI {
  const apiKey = sanitizeKey(customApiKey) || getEnvApiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Please add your API key in Settings or in .env.local.');
  }
  return new GoogleGenerativeAI(apiKey);
}

export function mapModelId(modelId: string): string {
  switch (modelId) {
    case 'nexus-pro':
      return 'gemini-2.0-flash';
    case 'nexus-flash':
      return 'gemini-1.5-flash';
    case 'nexus-ultra':
      return 'gemini-1.5-pro';
    case 'nexus-coder':
      return 'gemini-2.0-flash';
    default:
      return 'gemini-2.0-flash';
  }
}
