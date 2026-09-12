import React, { useState } from 'react';
import { Star, Bookmark, ExternalLink, Film } from 'lucide-react';
import { Movie } from '../types';
import { VIBE_DEFINITIONS } from '../data/vibeDefinitions';

interface MovieCardProps {
  movie: Movie;
  isSaved?: boolean;
  onToggleSave?: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isSaved = false,
  onToggleSave,
}) => {
  const [imageError, setImageError] = useState(false);

  // Extract top 3 vibe tags for display
  const topVibes = Object.entries(movie.vibes || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([vibeId]) => {
      const def = VIBE_DEFINITIONS.find((v) => v.id === vibeId);
      return def ? def.label : vibeId;
    });

  // Dynamic Google Search Redirect
  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.save-btn')) {
      return;
    }
    const googleQuery = `${movie.title} movie`;
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(googleQuery)}`;
    window.open(googleUrl, '_blank', 'noopener,noreferrer');
  };

  const rating = movie.imdbRating || movie.tmdbRating || 7.5;

  return (
    <div
      onClick={handleClick}
      className="group relative bg-[#1B1C1E] rounded-lg overflow-hidden border border-[#383A3D] hover:bg-[#232426] transition-all duration-300 shadow-subtle hover:shadow-card-hover cursor-pointer flex flex-col h-full"
    >
      {/* Poster Container (occupying 65-70% height) */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#151617] shrink-0">
        
        {/* Poster Image or Fallback */}
        {!imageError && movie.posterPath ? (
          <img
            src={movie.posterPath}
            alt={movie.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-300 ease-out"
            loading="lazy"
          />
        ) : (
          /* Neutral Fallback Poster */
          <div className="w-full h-full flex flex-col justify-between p-4 bg-[#151617] border-b border-[#383A3D] relative overflow-hidden group-hover:scale-[1.03] transition-transform duration-300">
            <div className="flex items-center justify-between text-[#73736F] text-[11px] font-mono uppercase">
              <span>{movie.country}</span>
              <span>{movie.year}</span>
            </div>

            <div className="my-auto text-center py-4">
              <Film className="w-7 h-7 text-[#73736F] mx-auto mb-2" />
              <h3 className="font-serif text-lg font-bold text-[#F2F0EB] tracking-tight line-clamp-3 leading-snug">
                {movie.title}
              </h3>
              <p className="text-[11px] text-[#73736F] mt-1.5 font-sans">
                {movie.language} • {movie.director}
              </p>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#A8A7A3] uppercase tracking-wider pt-2 border-t border-[#383A3D]">
              <span>CINEVIBE</span>
              <span>★ {rating.toFixed(1)}</span>
            </div>
          </div>
        )}

        {/* Poster Dark Overlay (rgba(13,14,15,0.70)) */}
        <div className="absolute inset-0 bg-[#0D0E0F]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5">
          <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300 space-y-2">
            <p className="text-xs text-[#F2F0EB] line-clamp-3 leading-relaxed font-sans">
              {movie.overview}
            </p>
            <div className="pt-2 flex items-center justify-between text-[#D6A85F] text-xs font-semibold border-t border-white/10">
              <span className="flex items-center gap-1">
                View Movie <ExternalLink className="w-3 h-3" />
              </span>
              <span className="text-[10px] text-[#A8A7A3] uppercase tracking-wider">
                Google Search
              </span>
            </div>
          </div>
        </div>

        {/* Top Badges: Rating & Save Toggle */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          {/* Rating Badge: #28231A background, #6B5634 border */}
          <div className="px-2 py-0.5 rounded-md bg-[#28231A]/95 border border-[#8F6B36]/60 text-xs font-bold text-[#F2F0EB] flex items-center gap-1">
            <Star className="w-3 h-3 text-[#D6A85F] fill-[#D6A85F]" />
            <span>{rating.toFixed(1)}</span>
          </div>

          {onToggleSave && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(movie);
              }}
              className={`save-btn p-1.5 rounded-md border transition-all ${
                isSaved
                  ? 'bg-[#D6A85F] text-[#11100E] border-[#D6A85F]'
                  : 'bg-[#0D0E0F]/80 text-[#F2F0EB] border-[#383A3D] hover:bg-[#1B1C1E] hover:text-[#D6A85F]'
              }`}
              title={isSaved ? 'Remove from Watchlist' : 'Save to Watchlist'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#11100E]' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-3 flex flex-col flex-grow justify-between bg-[#1B1C1E] group-hover:bg-[#232426] transition-colors">
        <div>
          <div className="flex items-baseline justify-between gap-1.5">
            <h3 className="font-sans text-sm font-semibold text-[#F2F0EB] tracking-tight line-clamp-1 group-hover:text-[#D6A85F] transition-colors">
              {movie.title}
            </h3>
            <span className="text-[11px] text-[#73736F] font-sans shrink-0">{movie.year}</span>
          </div>

          <div className="text-[11px] text-[#A8A7A3] mt-0.5 flex items-center gap-1.5">
            <span>{movie.country}</span>
            <span>•</span>
            <span>{movie.language}</span>
          </div>
        </div>

        {/* Vibe Tags */}
        <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-[#383A3D]/60">
          {topVibes.map((vibeName, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 rounded-md bg-[#28292B] text-[#A8A7A3] border border-[#383A3D]"
            >
              {vibeName}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
