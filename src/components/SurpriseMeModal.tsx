import React from 'react';
import { X, Sparkles, Star, ExternalLink, RefreshCw, Bookmark } from 'lucide-react';
import { Movie } from '../types';
import { VIBE_DEFINITIONS } from '../data/vibeDefinitions';

interface SurpriseMeModalProps {
  movie: Movie | null;
  onClose: () => void;
  onSpinAgain: () => void;
  isSaved?: boolean;
  onToggleSave?: (movie: Movie) => void;
}

export const SurpriseMeModal: React.FC<SurpriseMeModalProps> = ({
  movie,
  onClose,
  onSpinAgain,
  isSaved = false,
  onToggleSave,
}) => {
  if (!movie) return null;

  const topVibes = Object.entries(movie.vibes || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([vibeId]) => {
      const def = VIBE_DEFINITIONS.find((v) => v.id === vibeId);
      return def ? def.label : vibeId;
    });

  const rating = movie.imdbRating || movie.tmdbRating || 8.0;

  const handleOpenGoogle = () => {
    const googleQuery = `${movie.title} movie`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(googleQuery)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#28292B] border border-[#383A3D] rounded-xl p-6 sm:p-7 shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#73736F] hover:text-[#F2F0EB] bg-[#151617] rounded-md transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#28231A] border border-[#8F6B36] text-xs text-[#D6A85F] font-bold uppercase tracking-wider mb-5">
          <Sparkles className="w-3.5 h-3.5 text-[#D6A85F]" />
          <span>Tonight's Pick</span>
        </div>

        {/* Card Layout */}
        <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
          {/* Poster */}
          <div className="w-36 sm:w-44 aspect-[2/3] shrink-0 rounded-lg overflow-hidden border border-[#383A3D] relative bg-[#151617]">
            {movie.posterPath ? (
              <img
                src={movie.posterPath}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#151617]">
                <h4 className="font-serif text-lg font-bold text-[#F2F0EB]">{movie.title}</h4>
                <span className="text-xs text-[#73736F] mt-2">{movie.year}</span>
              </div>
            )}
          </div>

          {/* Metadata & Actions */}
          <div className="flex-grow text-center sm:text-left space-y-2.5">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[#28231A] border border-[#8F6B36]/60 text-[#F2F0EB] text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 text-[#D6A85F] fill-[#D6A85F]" /> {rating.toFixed(1)}
                </span>
                <span className="text-xs text-[#A8A7A3]">{movie.year}</span>
                <span className="text-xs text-[#73736F]">•</span>
                <span className="text-xs text-[#A8A7A3]">{movie.country}</span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#F2F0EB] tracking-tight mt-1 leading-snug">
                {movie.title}
              </h3>
              <p className="text-xs text-[#A8A7A3] font-normal mt-0.5 font-sans">
                Directed by {movie.director || 'Acclaimed Director'}
              </p>
            </div>

            <p className="text-xs text-[#A8A7A3] line-clamp-3 leading-relaxed pt-0.5 font-sans">
              {movie.overview}
            </p>

            {/* Vibe Chips */}
            <div className="flex flex-wrap gap-1 justify-center sm:justify-start pt-1">
              {topVibes.map((vibe, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-[#1B1C1E] text-[#A8A7A3] border border-[#383A3D]"
                >
                  {vibe}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center gap-2.5 justify-center sm:justify-start">
              <button
                onClick={handleOpenGoogle}
                className="flex-grow sm:flex-grow-0 px-4 py-2 rounded-lg bg-[#D6A85F] hover:bg-[#E2BA73] text-[#11100E] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-subtle"
              >
                <span>Watch / View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onSpinAgain}
                className="px-3.5 py-2 rounded-lg bg-[#1B1C1E] hover:bg-[#232426] border border-[#383A3D] text-[#F2F0EB] text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="Pick another movie"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#D6A85F]" />
                <span>Spin Again</span>
              </button>

              {onToggleSave && (
                <button
                  onClick={() => onToggleSave(movie)}
                  className={`p-2 rounded-lg border transition-colors ${
                    isSaved
                      ? 'bg-[#D6A85F] text-[#11100E] border-[#D6A85F]'
                      : 'bg-[#1B1C1E] text-[#F2F0EB] border-[#383A3D] hover:text-[#D6A85F]'
                  }`}
                  title="Save to Watchlist"
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#11100E]' : ''}`} />
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
