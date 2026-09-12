import React, { useState, useEffect } from 'react';
import { Search, X, Star, ExternalLink, Film } from 'lucide-react';
import { Movie } from '../types';
import seedMoviesData from '../data/seedMovies.json';
import { MovieRecord } from '../../server/vibeEngine';

interface SearchModalProps {
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/movies/search?q=${encodeURIComponent(query.trim())}`)
        .then((res) => {
          if (!res.ok) throw new Error('Search API non-200');
          return res.json();
        })
        .then((data) => {
          setResults(data.movies || []);
          setLoading(false);
        })
        .catch(() => {
          const q = query.toLowerCase().trim();
          const matches = (seedMoviesData as unknown as MovieRecord[]).filter((m) =>
            m.title.toLowerCase().includes(q) ||
            (m.director && m.director.toLowerCase().includes(q)) ||
            (m.cast && m.cast.some((c) => c.toLowerCase().includes(q))) ||
            (m.country && m.country.toLowerCase().includes(q)) ||
            (m.language && m.language.toLowerCase().includes(q)) ||
            (m.genres && m.genres.some((g) => g.toLowerCase().includes(q)))
          );
          setResults(matches.slice(0, 20) as unknown as Movie[]);
          setLoading(false);
        });
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleMovieClick = (title: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(title + ' movie')}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#28292B] border border-[#383A3D] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#383A3D] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#D6A85F] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by movie title, director, cast, or country..."
            className="w-full bg-transparent text-[#F2F0EB] placeholder-[#73736F] focus:outline-none text-sm sm:text-base font-sans"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-[#73736F] hover:text-[#F2F0EB] bg-[#151617] rounded-md transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2 flex-grow">
          {loading ? (
            <div className="text-center py-8 text-[#73736F] text-xs font-sans">
              Searching database...
            </div>
          ) : query.trim() && results.length === 0 ? (
            <div className="text-center py-10 text-[#73736F] space-y-2">
              <Film className="w-7 h-7 text-[#73736F] mx-auto" />
              <p className="text-sm text-[#F2F0EB]">No movies found matching "{query}"</p>
              <p className="text-xs text-[#73736F]">Try searching for popular titles like "Swades", "3 Idiots", or "Dangal"</p>
            </div>
          ) : results.length > 0 ? (
            results.map((movie) => {
              const rating = movie.imdbRating || movie.tmdbRating || 7.5;
              return (
                <div
                  key={movie.id}
                  onClick={() => handleMovieClick(movie.title)}
                  className="p-3 rounded-lg bg-[#1B1C1E] hover:bg-[#232426] border border-[#383A3D] transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-14 rounded-md overflow-hidden bg-[#151617] shrink-0 border border-[#383A3D]">
                      {movie.posterPath ? (
                        <img src={movie.posterPath} alt={movie.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#151617] text-[10px] text-[#D6A85F] font-serif">
                          {movie.title[0]}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-sans text-base font-semibold text-[#F2F0EB] truncate group-hover:text-[#D6A85F] transition-colors">
                        {movie.title}
                      </h4>
                      <p className="text-xs text-[#A8A7A3] font-sans truncate">
                        {movie.year} • {movie.country} • {movie.director || 'Director'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded-md bg-[#28231A] text-[#F2F0EB] text-xs font-bold flex items-center gap-1 border border-[#8F6B36]">
                      <Star className="w-3 h-3 text-[#D6A85F] fill-[#D6A85F]" /> {rating.toFixed(1)}
                    </span>
                    <ExternalLink className="w-4 h-4 text-[#73736F] group-hover:text-[#D6A85F] transition-colors" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-xs text-[#73736F] font-sans">
              Type above to search across titles, directors, actors, and countries.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
