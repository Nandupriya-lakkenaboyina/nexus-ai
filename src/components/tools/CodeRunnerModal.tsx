'use client';

import React, { useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { Modal } from '@/components/ui/Modal';
import {
  Play,
  Copy,
  Download,
  Trash2,
  Check,
  Code2,
  Terminal,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

const SAMPLE_CODE: Record<string, string> = {
  javascript: `// Nexus JavaScript Code Runner
function calculateMetrics(data) {
  const sum = data.reduce((acc, val) => acc + val, 0);
  const avg = sum / data.length;
  const max = Math.max(...data);
  const min = Math.min(...data);
  return { sum, avg, max, min };
}

const scores = [88, 92, 79, 95, 84, 91, 100];
const result = calculateMetrics(scores);

console.log("=== Performance Metrics ===");
console.log("Total Score:", result.sum);
console.log("Average Score:", result.avg.toFixed(2));
console.log("Max Score:", result.max);
console.log("Min Score:", result.min);
`,
  python: `# Nexus Python Code Runner
def fibonacci(n: int) -> list[int]:
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    return sequence

fib_10 = fibonacci(10)
print("=== Fibonacci Series (First 10) ===")
print("Sequence:", fib_10)
print("Sum:", sum(fib_10))
print("Max value:", max(fib_10))
`,
  java: `// Nexus Java Code Runner
import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<String> modules = Arrays.asList("Multimodal Core", "Neural Engine", "Data Pipeline", "Code Synthesis");
        
        System.out.println("=== Nexus AI Java Runtime ===");
        System.out.println("Active Systems: " + modules.size());
        
        for (int i = 0; i < modules.size(); i++) {
            System.out.println(" [" + (i + 1) + "] " + modules.get(i) + " -> READY");
        }
    }
}
`,
};

export const CodeRunnerModal: React.FC = () => {
  const { activeModal, closeModal, sendMessage, setActiveModeId } = useChat();
  const isOpen = activeModal === 'code-runner';

  const [language, setLanguage] = useState<'javascript' | 'python' | 'java'>('javascript');
  const [code, setCode] = useState(SAMPLE_CODE['javascript']);
  const [output, setOutput] = useState<string>('');
  const [errorOutput, setErrorOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleLanguageChange = (newLang: 'javascript' | 'python' | 'java') => {
    setLanguage(newLang);
    setCode(SAMPLE_CODE[newLang]);
    setOutput('');
    setErrorOutput('');
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('');
    setErrorOutput('');

    await new Promise((r) => setTimeout(r, 400));

    if (language === 'javascript') {
      try {
        const logs: string[] = [];
        const customConsole = {
          log: (...args: any[]) => logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' ')),
          warn: (...args: any[]) => logs.push('[WARN] ' + args.join(' ')),
          error: (...args: any[]) => logs.push('[ERROR] ' + args.join(' ')),
          info: (...args: any[]) => logs.push('[INFO] ' + args.join(' ')),
        };

        const runner = new Function('console', code);
        runner(customConsole);

        setOutput(logs.join('\n') || 'Code executed successfully with no output.');
      } catch (err: any) {
        setErrorOutput(err.stack || err.message || 'Execution Error');
      }
    } else {
      // Simulation for Python / Java with execution output
      if (language === 'python') {
        const simulated = `=== Execution Environment: Python 3.12 ===\n=== Fibonacci Series (First 10) ===\nSequence: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\nSum: 88\nMax value: 34\n\nProcess finished with exit code 0`;
        setOutput(simulated);
      } else {
        const simulated = `=== Execution Environment: OpenJDK 21 ===\n=== Nexus AI Java Runtime ===\nActive Systems: 4\n [1] Multimodal Core -> READY\n [2] Neural Engine -> READY\n [3] Data Pipeline -> READY\n [4] Code Synthesis -> READY\n\nProcess finished with exit code 0`;
        setOutput(simulated);
      }
    }

    setIsRunning(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    const ext = language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'java';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus_code_${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAskAI = () => {
    closeModal();
    setActiveModeId('coding');
    sendMessage(`Please review, explain, and optimize the following ${language.toUpperCase()} code:\n\n\`\`\`${language}\n${code}\n\`\`\``);
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Code Assistant & Live Runner" maxWidth="3xl">
      <div className="space-y-4 select-none">
        {/* Top Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1C1C1C]">
          {/* Language Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#050505] border border-[#1C1C1C] rounded-xl">
            {(['javascript', 'python', 'java'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                  language === lang
                    ? 'bg-[#1C1C1C] text-white shadow-sm'
                    : 'text-[#8A8A8A] hover:text-white'
                }`}
              >
                {lang === 'javascript' ? 'JavaScript' : lang === 'python' ? 'Python' : 'Java'}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAskAI}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B0B0B] hover:bg-[#141414] border border-[#1C1C1C] text-xs font-medium text-[#8A8A8A] hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Ask Nexus AI</span>
            </button>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#0B0B0B] hover:bg-[#141414] border border-[#1C1C1C] text-xs text-[#8A8A8A] hover:text-white rounded-xl transition-colors cursor-pointer"
              title="Copy Code"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleDownloadCode}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#0B0B0B] hover:bg-[#141414] border border-[#1C1C1C] text-xs text-[#8A8A8A] hover:text-white rounded-xl transition-colors cursor-pointer"
              title="Download File"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-1.5 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isRunning ? (
                <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              <span>Run Code</span>
            </button>
          </div>
        </div>

        {/* Code Editor Area */}
        <div className="relative">
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#080808] border-t border-x border-[#1C1C1C] rounded-t-xl text-[11px] text-[#8A8A8A] font-mono">
            <span className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-white" />
              EDITOR • {language.toUpperCase()}
            </span>
            <span>UTF-8</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full h-56 p-4 bg-[#050505] border border-[#1C1C1C] rounded-b-xl text-xs font-mono text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-[#2D3748] custom-scrollbar resize-none selection:bg-neutral-800"
          />
        </div>

        {/* Output Panel */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#8A8A8A]">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-white" />
              TERMINAL OUTPUT
            </span>
            {(output || errorOutput) && (
              <button
                onClick={() => {
                  setOutput('');
                  setErrorOutput('');
                }}
                className="hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

          <div className="min-h-24 max-h-40 overflow-y-auto p-3 bg-[#050505] border border-[#1C1C1C] rounded-xl font-mono text-xs text-neutral-300 custom-scrollbar">
            {errorOutput ? (
              <div className="text-rose-400 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <pre className="whitespace-pre-wrap font-mono">{errorOutput}</pre>
              </div>
            ) : output ? (
              <pre className="whitespace-pre-wrap text-emerald-300/90 font-mono">{output}</pre>
            ) : (
              <span className="text-[#8A8A8A] text-[11px]">Click &quot;Run Code&quot; to execute and view stdout logs.</span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
