import React from 'react';
import { MovieCard } from './MovieCard';
import { Movie, FilterState } from '../types';
import { VIBE_DEFINITIONS } from '../data/vibeDefinitions';
import { SlidersHorizontal } from 'lucide-react';

interface MovieGridProps {
  movies: Movie[];
  filters: FilterState;
  loading: boolean;
  onSortChange: (sort: string) => void;
  savedMovieIds: string[];
  onToggleSave: (movie: Movie) => void;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  filters,
  loading,
  onSortChange,
  savedMovieIds,
  onToggleSave,
}) => {
  const selectedVibeLabels = filters.vibes.map((vId) => {
    const def = VIBE_DEFINITIONS.find((v) => v.id === vId);
    return def ? def.label : vId;
  });

  const filterSummaryParts = [];
  if (selectedVibeLabels.length > 0) filterSummaryParts.push(selectedVibeLabels.join(' · '));
  if (filters.country && filters.country !== 'All Countries') filterSummaryParts.push(filters.country);
  if (filters.rating > 0) filterSummaryParts.push(`Rating ${filters.rating}+`);
  if (filters.yearMin || filters.yearMax)
    filterSummaryParts.push(filters.yearMin ? `${filters.yearMin}+` : `Before ${filters.yearMax}`);

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Banner & Sort Control */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 mb-8 border-b border-[#383A3D] gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#D6A85F] font-semibold">
            Discovery Results
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#F2F0EB] font-normal tracking-tight mt-1">
            Movies for your mood
          </h2>
          {filterSummaryParts.length > 0 && (
            <p className="text-xs text-[#A8A7A3] mt-1.5 font-sans">
              Based on{' '}
              <span className="text-[#D6A85F] font-medium">
                {filterSummaryParts.join(' • ')}
              </span>
            </p>
          )}
        </div>

        {/* Counter & Sort Selector */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#A8A7A3] font-medium">
            <span className="text-[#F2F0EB] font-semibold">{movies.length}</span> movies found
          </span>

          <div className="flex items-center gap-2 bg-[#1B1C1E] border border-[#383A3D] rounded-lg px-3 py-2 text-xs text-[#F2F0EB]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D6A85F]" />
            <select
              value={filters.sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-xs text-[#F2F0EB] focus:outline-none cursor-pointer"
            >
              <option value="best_match" className="bg-[#1B1C1E] text-[#F2F0EB]">Best Match</option>
              <option value="rating" className="bg-[#1B1C1E] text-[#F2F0EB]">Highest Rated</option>
              <option value="popular" className="bg-[#1B1C1E] text-[#F2F0EB]">Most Popular</option>
              <option value="newest" className="bg-[#1B1C1E] text-[#F2F0EB]">Newest First</option>
              <option value="oldest" className="bg-[#1B1C1E] text-[#F2F0EB]">Oldest First</option>
              <option value="hidden_gems" className="bg-[#1B1C1E] text-[#F2F0EB]">Hidden Gems</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Movie Cards or Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div
              key={idx}
              className="aspect-[2/3] rounded-lg skeleton-shimmer border border-[#383A3D]"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isSaved={savedMovieIds.includes(movie.id)}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      )}
    </section>
  );
};
