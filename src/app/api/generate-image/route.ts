import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, style = 'Cinematic', aspectRatio = '16:9' } = await req.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    const cleanPrompt = prompt.trim();

    // Style prompt modifiers tailored for high-fidelity generation
    const styleModifiers: Record<string, string> = {
      Realistic: 'hyperrealistic, 8k resolution, photorealistic photography, sharp focus, natural volumetric lighting, award-winning photo',
      Cinematic: 'cinematic 35mm film still, dramatic lighting, anamorphic lens flare, depth of field, masterpiece, 8k cinematic composition',
      '3D': '3D digital render, Octane render 8k, Unreal Engine 5 aesthetic, volumetric global illumination, ray-traced reflections',
      Anime: 'modern high quality anime aesthetic, Makoto Shinkai and Ufotable style, vibrant colors, clean intricate lineart, luminous atmosphere',
      Illustration: 'digital art masterpiece, expressive concept art illustration, rich colors, intricate detailed brushstrokes',
      'Product Photography': 'commercial studio product photography, clean neutral studio lighting, ultra-sharp 8k detail, professional setup',
      Minimal: 'minimalist composition, elegant negative space, clean geometric balance, soft lighting, modern aesthetic',
      Cyberpunk: 'cyberpunk aesthetic, glowing neon lights, futuristic cityscape reflections, moody rain-slicked atmosphere, 8k',
      Watercolor: 'delicate watercolor painting, fluid wet-on-wet paint textures, artistic paper bleed, luminous color washes',
      Custom: 'high aesthetic quality, masterpiece, detailed, 8k',
    };

    const modifier = styleModifiers[style] || styleModifiers['Cinematic'];
    const enhancedPrompt = `${cleanPrompt}, ${modifier}`;

    // Standard aspect ratio dimensions optimized for neural diffusion models
    const dimensionMap: Record<string, { width: number; height: number }> = {
      '1:1': { width: 1024, height: 1024 },
      '16:9': { width: 1024, height: 576 },
      '9:16': { width: 576, height: 1024 },
      '4:3': { width: 1024, height: 768 },
      '3:4': { width: 768, height: 1024 },
    };

    const dimensions = dimensionMap[aspectRatio] || { width: 1024, height: 1024 };
    const seed = Math.floor(Math.random() * 10000000);

    // Primary High-Speed Diffusion endpoint
    const primaryUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      enhancedPrompt
    )}?width=${dimensions.width}&height=${dimensions.height}&seed=${seed}&nologo=true&model=turbo`;

    try {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 12000);

      const fetchRes = await fetch(primaryUrl, {
        signal: abortController.signal,
        headers: {
          'Accept': 'image/jpeg, image/png, image/webp, */*',
        },
      });
      clearTimeout(timeoutId);

      if (fetchRes.ok) {
        const arrayBuf = await fetchRes.arrayBuffer();
        if (arrayBuf.byteLength > 1000) {
          const base64Str = Buffer.from(arrayBuf).toString('base64');
          const mimeType = fetchRes.headers.get('content-type') || 'image/jpeg';
          return NextResponse.json({
            imageUrl: `data:${mimeType};base64,${base64Str}`,
            revisedPrompt: `${cleanPrompt} (${style})`,
          });
        }
      }
    } catch (primaryErr) {
      console.warn('Primary image buffer fetch failed, trying direct URL delivery:', primaryErr);
    }

    // Fallback: return direct image URL with safe cache buster
    return NextResponse.json({
      imageUrl: primaryUrl,
      revisedPrompt: `${cleanPrompt} (${style})`,
    });
  } catch (error: any) {
    console.error('Image Gen API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image.' },
      { status: 500 }
    );
  }
}
