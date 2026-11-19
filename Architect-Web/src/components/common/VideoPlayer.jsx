import React, { useState } from 'react';
import { FaPlay, FaYoutube, FaFacebook, FaExternalLinkAlt } from 'react-icons/fa';
import { parseVideoInfo } from '../../lib/videoHelper';

export default function VideoPlayer({
  videoUrl,
  title = 'Watch Video',
  coverImage = '',
  autoPlayOnClick = true,
  className = '',
}) {
  const [isPlaying, setIsPlaying] = useState(!coverImage);
  const videoInfo = parseVideoInfo(videoUrl);

  if (!videoInfo) return null;

  const handleStartPlay = () => {
    setIsPlaying(true);
  };

  // Add autoplay parameter if user clicked play on cover thumbnail
  const embedSrc =
    autoPlayOnClick && isPlaying && coverImage && videoInfo.type === 'youtube'
      ? `${videoInfo.embedUrl}&autoplay=1`
      : videoInfo.embedUrl;

  return (
    <div
      className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-xl group ${className}`}
    >
      {/* Cover / Poster state with animated Play Button */}
      {!isPlaying && coverImage ? (
        <div className="relative w-full h-full cursor-pointer" onClick={handleStartPlay}>
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Subtle dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

          {/* Platform badge */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
            {videoInfo.type === 'youtube' && <FaYoutube className="text-red-500 text-sm" />}
            {videoInfo.type === 'facebook' && <FaFacebook className="text-blue-500 text-sm" />}
            <span className="capitalize">{videoInfo.type} Video</span>
          </div>

          {/* Centered Pulse Play Button using brand camel */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="relative flex items-center justify-center">
              {/* Ripple Rings */}
              <span
                className="absolute h-16 w-16 rounded-full opacity-60 animate-ping"
                style={{ backgroundColor: 'var(--brand-camel)' }}
              />
              <button
                type="button"
                className="relative h-16 w-16 rounded-full flex items-center justify-center text-black font-bold shadow-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: 'var(--brand-camel)' }}
                aria-label="Play Video"
              >
                <FaPlay className="ml-1 text-black text-lg" />
              </button>
            </div>
            <span className="text-white text-sm font-medium tracking-wide drop-shadow">
              Click to Play
            </span>
          </div>
        </div>
      ) : (
        /* Active Video Embed Player */
        <div className="w-full h-full relative bg-black">
          {videoInfo.type === 'direct' ? (
            <video
              src={videoInfo.embedUrl}
              controls
              autoPlay={isPlaying}
              className="w-full h-full object-cover"
            />
          ) : (
            <iframe
              src={embedSrc}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}

          {/* Bottom Bar with Platform Info & Original Link */}
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <a
              href={videoInfo.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-white text-[11px] hover:text-(--brand-camel) transition-colors"
            >
              <span>Watch on {videoInfo.type === 'youtube' ? 'YouTube' : videoInfo.type === 'facebook' ? 'Facebook' : 'Source'}</span>
              <FaExternalLinkAlt className="text-[10px]" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
