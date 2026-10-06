'use client';

import React, { useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { Modal } from '@/components/ui/Modal';
import {
  GraduationCap,
  BookOpen,
  HelpCircle,
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Award,
} from 'lucide-react';
import { QuizQuestion, Flashcard } from '@/types';

const SAMPLE_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is the primary advantage of Transformer architecture in AI over traditional RNNs?',
    options: [
      'Sequential word-by-word computation',
      'Parallelized self-attention mechanism across entire context',
      'Strict dependence on hidden state memory buffers',
      'Inability to process multimodal embeddings',
    ],
    correctAnswer: 1,
    explanation: 'Transformers process entire sequences simultaneously using self-attention, eliminating sequential bottlenecks present in RNNs.',
  },
  {
    id: 'q2',
    question: 'In Python, what is the time complexity of looking up a key in a standard dictionary?',
    options: ['O(n)', 'O(log n)', 'O(1) average time', 'O(n^2)'],
    correctAnswer: 2,
    explanation: 'Python dictionaries are implemented using hash tables, yielding O(1) average time lookup.',
  },
  {
    id: 'q3',
    question: 'What does ACID stand for in database management systems?',
    options: [
      'Atomicity, Consistency, Isolation, Durability',
      'Asynchronous, Cached, Indexed, Distributed',
      'Authentication, Cryptography, Integrity, Decryption',
      'Allocation, Concurrency, Iteration, Deletion',
    ],
    correctAnswer: 0,
    explanation: 'ACID guarantees reliable database transaction processing through Atomicity, Consistency, Isolation, and Durability.',
  },
];

const SAMPLE_FLASHCARDS: Flashcard[] = [
  {
    id: 'f1',
    front: 'What is Dynamic Programming (DP)?',
    back: 'An algorithmic optimization method that solves complex problems by breaking them into overlapping subproblems and storing the sub-solutions (memoization/tabulation).',
    category: 'Algorithms',
  },
  {
    id: 'f2',
    front: 'Explain the CAP Theorem in Distributed Systems.',
    back: 'A distributed data store can guarantee at most two of three properties: Consistency, Availability, and Partition Tolerance.',
    category: 'Systems Design',
  },
  {
    id: 'f3',
    front: 'What is the difference between Synchronous and Asynchronous execution?',
    back: 'Synchronous blocks execution until a task finishes. Asynchronous allows tasks to execute in the background while other work continues uninterrupted.',
    category: 'Programming',
  },
];

export const StudyModeModal: React.FC = () => {
  const { activeModal, closeModal, sendMessage, setActiveModeId } = useChat();
  const isOpen = activeModal === 'study';

  const [activeTab, setActiveTab] = useState<'topic' | 'quiz' | 'flashcards' | 'notes'>('quiz');
  const [topicInput, setTopicInput] = useState('');

  // Interactive Quiz state
  const [quizQuestions] = useState<QuizQuestion[]>(SAMPLE_QUIZ);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  // Flashcards state
  const [flashcards] = useState<Flashcard[]>(SAMPLE_FLASHCARDS);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (showQuizResults) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) score++;
    });
    return score;
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowQuizResults(false);
  };

  const handleGenerateTopicAI = (type: 'explain' | 'notes' | 'mcq' | 'flashcards') => {
    const topic = topicInput.trim() || 'Modern Multimodal AI Systems & Transformers';
    closeModal();
    setActiveModeId('study');

    switch (type) {
      case 'explain':
        sendMessage(`Please explain the topic "${topic}" thoroughly. Include an intuitive real-world analogy, step-by-step breakdown, and key takeaways.`);
        break;
      case 'notes':
        sendMessage(`Please generate comprehensive study notes for "${topic}". Include definitions, core principles, bulleted summary, and review questions.`);
        break;
      case 'mcq':
        sendMessage(`Please generate 5 multiple-choice quiz questions on "${topic}" with options A, B, C, D, marked correct answers, and thorough explanations.`);
        break;
      case 'flashcards':
        sendMessage(`Please create 6 study flashcards for "${topic}" formatted with clear Question Fronts and Answer Backs.`);
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Study Mode & Interactive Learning" maxWidth="3xl">
      <div className="space-y-4 select-none">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#050505] border border-[#1C1C1C] rounded-xl">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'quiz' ? 'bg-[#1C1C1C] text-white shadow-sm' : 'text-[#8A8A8A] hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Interactive Quiz</span>
          </button>

          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'flashcards' ? 'bg-[#1C1C1C] text-white shadow-sm' : 'text-[#8A8A8A] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Flashcards</span>
          </button>

          <button
            onClick={() => setActiveTab('topic')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'topic' ? 'bg-[#1C1C1C] text-white shadow-sm' : 'text-[#8A8A8A] hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Topic Explainer</span>
          </button>
        </div>

        {/* TAB 1: INTERACTIVE QUIZ */}
        {activeTab === 'quiz' && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
            {/* Questions List */}
            {quizQuestions.map((q, qIndex) => {
              const selected = selectedAnswers[q.id];
              const isAnswered = selected !== undefined;
              const isCorrect = selected === q.correctAnswer;

              return (
                <div key={q.id} className="p-4 bg-[#080808] border border-[#1C1C1C] rounded-xl space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-[#1C1C1C] flex items-center justify-center text-[11px] text-neutral-300 font-mono">
                        {qIndex + 1}
                      </span>
                      {q.question}
                    </span>
                    {showQuizResults && (
                      <span className="flex-shrink-0">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400" />
                        )}
                      </span>
                    )}
                  </div>

                  {/* Options */}
                  <div className="space-y-1.5">
                    {q.options.map((opt, optIndex) => {
                      const isOptionSelected = selected === optIndex;
                      let btnStyle = 'bg-[#050505] border-[#1C1C1C] text-[#8A8A8A] hover:border-neutral-700 hover:text-white';

                      if (showQuizResults) {
                        if (optIndex === q.correctAnswer) {
                          btnStyle = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-semibold';
                        } else if (isOptionSelected && !isCorrect) {
                          btnStyle = 'bg-rose-500/10 border-rose-500/40 text-rose-300';
                        }
                      } else if (isOptionSelected) {
                        btnStyle = 'bg-white text-black font-semibold border-white shadow-sm';
                      }

                      return (
                        <button
                          key={optIndex}
                          onClick={() => handleSelectOption(q.id, optIndex)}
                          className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all flex items-center gap-2.5 cursor-pointer ${btnStyle}`}
                        >
                          <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px] font-mono flex-shrink-0">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submit */}
                  {showQuizResults && (
                    <div className="p-2.5 bg-[#050505] border border-[#1C1C1C] rounded-lg text-[11px] text-neutral-300">
                      <span className="font-semibold text-white block mb-0.5">Explanation:</span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Quiz Action Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#1C1C1C]">
              {showQuizResults ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold text-white">
                      Final Score: {calculateScore()} / {quizQuestions.length} (
                      {Math.round((calculateScore() / quizQuestions.length) * 100)}%)
                    </span>
                  </div>
                  <button
                    onClick={handleResetQuiz}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1C1C1C] hover:bg-neutral-800 text-xs font-medium text-white rounded-xl transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Quiz</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-[#8A8A8A]">
                    Answered: {Object.keys(selectedAnswers).length} / {quizQuestions.length}
                  </span>
                  <button
                    onClick={() => setShowQuizResults(true)}
                    disabled={Object.keys(selectedAnswers).length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    <span>Submit & Check Answers</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: FLASHCARDS */}
        {activeTab === 'flashcards' && (
          <div className="space-y-4">
            {/* Flippable Card Container */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="min-h-56 p-6 bg-[#080808] hover:bg-[#0B0B0B] border border-[#1C1C1C] hover:border-neutral-700 rounded-2xl flex flex-col justify-between cursor-pointer transition-all shadow-md group relative"
            >
              <div className="flex items-center justify-between text-[11px] text-[#8A8A8A] font-mono">
                <span className="px-2 py-0.5 rounded bg-[#141414] text-neutral-300">
                  {flashcards[currentCardIndex].category || 'Study'}
                </span>
                <span>{isFlipped ? 'BACK (ANSWER)' : 'FRONT (QUESTION)'} • CLICK TO FLIP</span>
              </div>

              <div className="py-6 text-center">
                <h3 className="text-sm sm:text-base font-semibold text-white leading-relaxed max-w-lg mx-auto">
                  {isFlipped
                    ? flashcards[currentCardIndex].back
                    : flashcards[currentCardIndex].front}
                </h3>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#8A8A8A]">
                <span>Card {currentCardIndex + 1} of {flashcards.length}</span>
                <span className="text-sky-400 group-hover:underline">Click card to reveal {isFlipped ? 'question' : 'answer'} ↻</span>
              </div>
            </div>

            {/* Flashcard Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B0B0B] hover:bg-[#141414] border border-[#1C1C1C] text-xs text-white rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Card</span>
              </button>

              <button
                onClick={() => handleGenerateTopicAI('flashcards')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B0B0B] hover:bg-[#141414] border border-[#1C1C1C] text-xs text-[#8A8A8A] hover:text-white rounded-xl transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Generate Flashcards with AI</span>
              </button>

              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentCardIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0));
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                <span>Next Card</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: TOPIC EXPLAINER & NOTES GENERATOR */}
        {activeTab === 'topic' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-white block mb-1.5">
                What concept or topic are you studying?
              </label>
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="e.g. Neural Networks, Quantum Key Distribution, Thermodynamics..."
                className="w-full px-3.5 py-2.5 bg-[#050505] border border-[#1C1C1C] rounded-xl text-xs text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#2D3748] transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => handleGenerateTopicAI('explain')}
                className="p-3.5 rounded-xl bg-[#080808] hover:bg-[#0E0E0E] border border-[#1C1C1C] hover:border-neutral-700 text-left transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>Explain Topic with Analogy</span>
                </div>
                <p className="text-[11px] text-[#8A8A8A]">
                  Breaks down the core concept into simple mental models and real-world parallels.
                </p>
              </button>

              <button
                onClick={() => handleGenerateTopicAI('notes')}
                className="p-3.5 rounded-xl bg-[#080808] hover:bg-[#0E0E0E] border border-[#1C1C1C] hover:border-neutral-700 text-left transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Generate Study Notes</span>
                </div>
                <p className="text-[11px] text-[#8A8A8A]">
                  Creates structured bullet points, key definitions, and revision summaries.
                </p>
              </button>

              <button
                onClick={() => handleGenerateTopicAI('mcq')}
                className="p-3.5 rounded-xl bg-[#080808] hover:bg-[#0E0E0E] border border-[#1C1C1C] hover:border-neutral-700 text-left transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Generate Custom Quiz</span>
                </div>
                <p className="text-[11px] text-[#8A8A8A]">
                  Creates 5 challenging MCQs with answer keys and thorough explanations.
                </p>
              </button>

              <button
                onClick={() => handleGenerateTopicAI('flashcards')}
                className="p-3.5 rounded-xl bg-[#080808] hover:bg-[#0E0E0E] border border-[#1C1C1C] hover:border-neutral-700 text-left transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>Generate Flashcards</span>
                </div>
                <p className="text-[11px] text-[#8A8A8A]">
                  Creates high-yield question & answer memory retention flashcards.
                </p>
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
