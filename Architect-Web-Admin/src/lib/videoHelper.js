/**
 * Utility to parse and format YouTube, Facebook, and direct video links for embedding.
 */
export function parseVideoInfo(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // 1. YouTube
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      id: videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      originalUrl: trimmed,
      title: 'YouTube Video',
    };
  }

  // 2. Facebook Video / Reel / Watch
  if (trimmed.includes('facebook.com') || trimmed.includes('fb.watch')) {
    const encoded = encodeURIComponent(trimmed);
    return {
      type: 'facebook',
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=0&width=560`,
      originalUrl: trimmed,
      title: 'Facebook Video',
    };
  }

  // 3. Direct HTML5 video (.mp4, .webm, .ogg, .mov)
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed)) {
    return {
      type: 'direct',
      embedUrl: trimmed,
      originalUrl: trimmed,
      title: 'Direct Video Stream',
    };
  }

  // 4. Fallback / generic iframe
  return {
    type: 'other',
    embedUrl: trimmed,
    originalUrl: trimmed,
    title: 'Embedded Video',
  };
}
