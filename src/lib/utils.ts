import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export function extractInteractiveElements(content: string) {
  const codeBlocks: { id: string; language: string; code: string; title?: string }[] = [];
  const tables: { headers: string[]; rows: string[][] }[] = [];

  // Extract code blocks
  const codeRegex = /```([a-zA-Z0-9_\-\+\#]*)\r?\n([\s\S]*?)```/g;
  let codeMatch;
  let blockIndex = 0;
  while ((codeMatch = codeRegex.exec(content)) !== null) {
    const lang = codeMatch[1]?.trim() || 'code';
    const code = codeMatch[2]?.trim() || '';
    if (code) {
      codeBlocks.push({
        id: `code-${blockIndex++}-${Math.random().toString(36).substring(2, 6)}`,
        language: lang,
        code,
        title: `${lang.toUpperCase()} Snippet`,
      });
    }
  }

  // Extract tables
  const lines = content.split(/\r?\n/);
  let tableLines: string[] = [];
  let inTable = false;

  const processTableLines = (tLines: string[]) => {
    if (tLines.length >= 2) {
      const cleanCols = (row: string) =>
        row
          .split('|')
          .map((c) => c.trim())
          .slice(1, -1);

      const headers = cleanCols(tLines[0]);
      const rows: string[][] = [];
      for (let j = 2; j < tLines.length; j++) {
        const rowCols = cleanCols(tLines[j]);
        if (rowCols.length > 0) {
          rows.push(rowCols);
        }
      }
      if (headers.length > 0 && rows.length > 0) {
        tables.push({ headers, rows });
      }
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      inTable = true;
      tableLines.push(line);
    } else {
      if (inTable) {
        processTableLines(tableLines);
      }
      inTable = false;
      tableLines = [];
    }
  }

  if (inTable) {
    processTableLines(tableLines);
  }

  return {
    codeBlocks: codeBlocks.length > 0 ? codeBlocks : undefined,
    tables: tables.length > 0 ? tables : undefined,
  };
}
