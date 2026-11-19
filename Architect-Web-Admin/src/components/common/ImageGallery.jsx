import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export default function ImageGallery({ open, images, currentIndex, onClose, onPrevious, onNext }) {
  if (!open || !images || !Array.isArray(images) || images.length === 0) return null;

  const safeIndex = Math.max(0, Math.min(currentIndex || 0, images.length - 1));
  const currentImage = images[safeIndex];
  const isVideo = currentImage?.type === 'Video';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      {/* Close Button */}
      <button
        type="button"
        className="absolute top-6 right-8 text-white text-2xl bg-black/60 hover:bg-black/80 rounded-full w-12 h-12 flex items-center justify-center transition-colors"
        onClick={onClose}
        title="Close preview"
      >
        ×
      </button>

      {/* Previous Button */}
      {images.length > 1 && (
        <button
          type="button"
          className="absolute left-8 top-1/2 -translate-y-1/2 text-white text-3xl bg-black/60 hover:bg-black/80 rounded-full w-12 h-12 flex items-center justify-center transition-colors"
          onClick={onPrevious}
          title="Previous"
          aria-label="Previous image"
        >
          <FaArrowLeft size={24} />
        </button>
      )}

      {/* Image/Video Display */}
      {isVideo ? (
        <video
          src={currentImage.url}
          controls
          className="max-h-[80vh] max-w-[90vw] rounded-xl shadow-2xl border-4 border-white"
        />
      ) : (
        <img
          src={typeof currentImage === 'string' ? currentImage : currentImage.url}
          alt={currentImage.type || 'Image'}
          className="max-h-[80vh] max-w-[90vw] rounded-xl shadow-2xl border-4 border-white cursor-pointer"
          onClick={images.length > 1 ? onNext : undefined}
        />
      )}

      {/* Next Button */}
      {images.length > 1 && (
        <button
          type="button"
          className="absolute right-8 top-1/2 -translate-y-1/2 text-white text-3xl bg-black/60 hover:bg-black/80 rounded-full w-12 h-12 flex items-center justify-center transition-colors"
          onClick={onNext}
          title="Next"
          aria-label="Next image"
        >
          <FaArrowRight size={24} />
        </button>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-xs bg-black/60 rounded px-3 py-1">
          {isVideo 
            ? `Video ${safeIndex + 1} / ${images.length}`
            : `${currentImage.type || 'Image'} ${safeIndex + 1} / ${images.length}`
          }
        </div>
      )}
    </div>
  );
}
