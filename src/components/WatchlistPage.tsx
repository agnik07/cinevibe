import React from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';

interface WatchlistPageProps {
  savedMovies: Movie[];
  onToggleSave: (movie: Movie) => void;
  onClearWatchlist: () => void;
}

export const WatchlistPage: React.FC<WatchlistPageProps> = ({
  savedMovies,
  onToggleSave,
  onClearWatchlist,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#383A3D] pb-5 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1B1C1E] border border-[#383A3D] text-xs text-[#D6A85F] font-semibold uppercase tracking-wider mb-2">
            <Bookmark className="w-3.5 h-3.5 text-[#D6A85F]" />
            <span>Personal Collection</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#F2F0EB] font-normal tracking-tight">
            My Watchlist
          </h1>
          <p className="text-xs text-[#73736F] font-sans mt-1">
            {savedMovies.length} saved {savedMovies.length === 1 ? 'movie' : 'movies'} saved locally.
          </p>
        </div>

        {savedMovies.length > 0 && (
          <button
            onClick={onClearWatchlist}
            className="text-xs text-[#73736F] hover:text-[#F2F0EB] flex items-center gap-1 transition-colors self-start sm:self-auto underline"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Watchlist
          </button>
        )}
      </div>

      {/* Movies Grid or Empty State */}
      {savedMovies.length === 0 ? (
        <div className="py-16 text-center space-y-3 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full bg-[#1B1C1E] border border-[#383A3D] flex items-center justify-center text-[#73736F] mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl text-[#F2F0EB] font-normal">Your Watchlist is Empty</h3>
          <p className="text-xs text-[#73736F] font-sans leading-relaxed">
            Explore movies by vibe or use "Surprise Me" to bookmark titles you want to watch later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {savedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isSaved={true}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
};
