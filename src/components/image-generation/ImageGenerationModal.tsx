'use client';

import React, { useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { Modal } from '@/components/ui/Modal';
import { GeneratedImage } from '@/types';
import { Palette, RefreshCw, Download, Check, MessageSquare, Sparkles, AlertCircle, Wand2 } from 'lucide-react';
import { getTranslation } from '@/lib/translations';

export const ImageGenerationModal: React.FC = () => {
  const { isImageGenModalOpen, setIsImageGenModalOpen, generateImageAction, userSettings } = useChat();
  const t = getTranslation(userSettings.language);

  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<GeneratedImage['style']>('Cinematic');
  const [aspectRatio, setAspectRatio] = useState<GeneratedImage['aspectRatio']>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GeneratedImage | null>(null);

  const stylesList: GeneratedImage['style'][] = [
    'Realistic',
    'Cinematic',
    '3D',
    'Anime',
    'Illustration',
    'Product Photography',
    'Minimal',
    'Cyberpunk',
    'Watercolor',
    'Custom',
  ];

  const aspectRatiosList: { ratio: GeneratedImage['aspectRatio']; label: string }[] = [
    { ratio: '1:1', label: '1:1 Square' },
    { ratio: '16:9', label: '16:9 Landscape' },
    { ratio: '9:16', label: '9:16 Portrait' },
    { ratio: '4:3', label: '4:3 Standard' },
    { ratio: '3:4', label: '3:4 Vertical' },
  ];

  const samplePrompts = [
    'A futuristic glowing cyberpunk metropolis at twilight with neon rain reflections',
    'Hyperrealistic portrait of an astronaut on Mars with Earth visible in the helmet reflection',
    'Cozy wooden cabin in snowy pine forest with warm glowing fireplace light, 8k render',
    'Anime girl in cherry blossom garden with glowing lanterns, Makoto Shinkai aesthetic',
    'Minimalist ceramic vase on textured concrete podium with soft morning sunlight',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setIsImageLoaded(false);
    setImageError(false);
    try {
      const result = await generateImageAction(prompt.trim(), style, aspectRatio);
      setGeneratedResult(result);
    } catch (err: any) {
      console.error('Image Generation Error:', err);
      setImageError(true);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal
      isOpen={isImageGenModalOpen}
      onClose={() => setIsImageGenModalOpen(false)}
      title="AI Image Studio"
      maxWidth="2xl"
    >
      <div className="space-y-4 select-none">
        {/* Prompt Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-neutral-300">
              {t.promptLabel}
            </label>
            <span className="text-[11px] text-indigo-400 font-medium flex items-center gap-1">
              <Wand2 className="w-3 h-3" />
              <span>Enhanced AI Prompts</span>
            </span>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate in detail (e.g., A majestic lion with golden crown in a lush jungle)..."
            rows={3}
            className="w-full p-3 bg-neutral-950 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none resize-none transition-colors"
          />

          {/* Sample Prompts */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(p)}
                className="px-2.5 py-1 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-[11px] text-neutral-400 hover:text-neutral-200 transition-colors text-left truncate max-w-xs"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Options Row: Style & Aspect Ratio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Style Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              {t.aestheticStyle}
            </label>
            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto custom-scrollbar p-1.5 bg-neutral-950 border border-neutral-800 rounded-xl">
              {stylesList.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStyle(s)}
                  className={`px-2 py-1.5 text-xs font-medium rounded-lg text-left transition-all ${
                    style === s
                      ? 'bg-neutral-800 text-neutral-100 font-semibold ring-1 ring-neutral-700'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              {t.aspectRatio}
            </label>
            <div className="space-y-1 max-h-36 overflow-y-auto custom-scrollbar p-1.5 bg-neutral-950 border border-neutral-800 rounded-xl">
              {aspectRatiosList.map((item) => (
                <button
                  key={item.ratio}
                  type="button"
                  onClick={() => setAspectRatio(item.ratio)}
                  className={`w-full px-2.5 py-1.5 text-xs font-medium rounded-lg text-left flex items-center justify-between transition-all ${
                    aspectRatio === item.ratio
                      ? 'bg-neutral-800 text-neutral-100 font-semibold ring-1 ring-neutral-700'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                  }`}
                >
                  <span>{item.label}</span>
                  {aspectRatio === item.ratio && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className={`w-full py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-semibold rounded-xl transition-all shadow-sm ${
            !prompt.trim() || isGenerating
              ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              : 'bg-neutral-100 hover:bg-white text-neutral-950 shadow-md'
          }`}
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-neutral-950" />
              <span>{t.generatingArtwork}</span>
            </div>
          ) : (
            <>
              <Palette className="w-3.5 h-3.5" />
              <span>{t.generateImageBtn}</span>
            </>
          )}
        </button>

        {/* Error message if generation failed */}
        {imageError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>Failed to generate image. Please try another prompt.</span>
          </div>
        )}

        {/* Result Preview */}
        {generatedResult && (
          <div className="mt-3 p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3">
            <div className="relative rounded-lg overflow-hidden bg-neutral-900 flex items-center justify-center min-h-[240px]">
              {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 animate-pulse text-xs text-neutral-400">
                  <Sparkles className="w-5 h-5 text-indigo-400 animate-spin mr-2" />
                  <span>Loading visual render...</span>
                </div>
              )}
              <img
                src={generatedResult.imageUrl}
                alt={generatedResult.prompt}
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setIsImageLoaded(true)}
                className={`w-full max-h-80 object-contain rounded-lg transition-opacity duration-300 ${
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-neutral-400 truncate max-w-[240px]">
                {generatedResult.prompt}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsImageGenModalOpen(false)}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-lg text-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{t.viewInChat}</span>
                </button>
                <a
                  href={generatedResult.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  download={`nexus_image_${Date.now()}.jpg`}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-neutral-100 hover:bg-white text-neutral-950 font-semibold rounded-lg text-xs transition-colors"
                  title="Download image"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.download}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
