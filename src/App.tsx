import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { MovieGrid } from './components/MovieGrid';
import { EmptyState } from './components/EmptyState';
import { ExploreRails } from './components/ExploreRails';
import { WatchlistPage } from './components/WatchlistPage';
import { AboutPage } from './components/AboutPage';
import { SurpriseMeModal } from './components/SurpriseMeModal';
import { PickForMeQuiz } from './components/PickForMeQuiz';
import { SearchModal } from './components/SearchModal';
import { Movie, FilterState } from './types';
import seedMoviesData from './data/seedMovies.json';
import { rankMoviesByVibes, parseNaturalLanguageQuery, MovieRecord } from '../server/vibeEngine';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discover' | 'explore' | 'watchlist' | 'about'>('discover');

  // Filter State initialized from URL Query Parameters
  const [filters, setFilters] = useState<FilterState>(() => {
    const params = new URLSearchParams(window.location.search);
    const vibesParam = params.get('vibe') || '';
    return {
      vibes: vibesParam ? vibesParam.split(',').filter(Boolean) : [],
      country: params.get('country') || 'All Countries',
      language: params.get('language') || 'All Languages',
      rating: parseFloat(params.get('rating') || '0'),
      yearMin: params.get('yearMin') ? parseInt(params.get('yearMin')!) : undefined,
      yearMax: params.get('yearMax') ? parseInt(params.get('yearMax')!) : undefined,
      sort: params.get('sort') || 'best_match',
    };
  });

  const [movies, setMovies] = useState<Movie[]>([]);
  const [matchingCount, setMatchingCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Watchlist LocalStorage State
  const [savedMovies, setSavedMovies] = useState<Movie[]>(() => {
    try {
      const stored = localStorage.getItem('cinevibe_watchlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Modal States
  const [surpriseMovie, setSurpriseMovie] = useState<Movie | null>(null);
  const [showSurpriseModal, setShowSurpriseModal] = useState<boolean>(false);
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);

  // Synchronize URL with active filters
  const syncUrlParams = useCallback((f: FilterState) => {
    const params = new URLSearchParams();
    if (f.vibes.length > 0) params.set('vibe', f.vibes.join(','));
    if (f.country && f.country !== 'All Countries') params.set('country', f.country);
    if (f.language && f.language !== 'All Languages') params.set('language', f.language);
    if (f.rating > 0) params.set('rating', f.rating.toString());
    if (f.yearMin) params.set('yearMin', f.yearMin.toString());
    if (f.yearMax) params.set('yearMax', f.yearMax.toString());
    if (f.sort && f.sort !== 'best_match') params.set('sort', f.sort);

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState(null, '', newUrl);
  }, []);

  // Fetch movies based on current filters
  const fetchMovies = useCallback(() => {
    setLoading(true);
    const queryParams = new URLSearchParams();
    if (filters.vibes.length > 0) queryParams.set('vibes', filters.vibes.join(','));
    if (filters.country && filters.country !== 'All Countries') queryParams.set('country', filters.country);
    if (filters.language && filters.language !== 'All Languages') queryParams.set('language', filters.language);
    if (filters.rating > 0) queryParams.set('rating', filters.rating.toString());
    if (filters.yearMin) queryParams.set('yearMin', filters.yearMin.toString());
    if (filters.yearMax) queryParams.set('yearMax', filters.yearMax.toString());
    if (filters.sort) queryParams.set('sort', filters.sort);

    fetch(`/api/movies/discover?${queryParams.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`API error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setMovies(data.movies || []);
        setMatchingCount(data.total || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('API fetch failed, performing client-side ranking fallback:', err);
        const fallbackMovies = rankMoviesByVibes(
          seedMoviesData as unknown as MovieRecord[],
          filters.vibes,
          filters.country,
          filters.rating,
          filters.yearMin,
          filters.yearMax,
          filters.language,
          filters.sort
        );
        setMovies(fallbackMovies.slice(0, 24) as unknown as Movie[]);
        setMatchingCount(fallbackMovies.length);
        setLoading(false);
      });
  }, [filters]);

  useEffect(() => {
    syncUrlParams(filters);
    fetchMovies();
  }, [filters, syncUrlParams, fetchMovies]);

  // Handle Watchlist toggle
  const handleToggleSaveMovie = (movie: Movie) => {
    const exists = savedMovies.some((m) => m.id === movie.id);
    let updated: Movie[];
    if (exists) {
      updated = savedMovies.filter((m) => m.id !== movie.id);
    } else {
      updated = [...savedMovies, movie];
    }
    setSavedMovies(updated);
    try {
      localStorage.setItem('cinevibe_watchlist', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save watchlist:', e);
    }
  };

  const handleClearWatchlist = () => {
    setSavedMovies([]);
    localStorage.removeItem('cinevibe_watchlist');
  };

  // Filter updates
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleToggleVibe = (vibeId: string) => {
    setFilters((prev) => {
      const isSelected = prev.vibes.includes(vibeId);
      const newVibes = isSelected
        ? prev.vibes.filter((v) => v !== vibeId)
        : [...prev.vibes, vibeId];
      return { ...prev, vibes: newVibes };
    });
  };

  const handleClearAllFilters = () => {
    setFilters({
      vibes: [],
      country: 'All Countries',
      language: 'All Languages',
      rating: 0,
      yearMin: undefined,
      yearMax: undefined,
      sort: 'best_match',
    });
  };

  // Natural Language Search handler
  const handleNaturalLanguageQuery = (query: string) => {
    fetch('/api/movies/nl-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('API NL error');
        return res.json();
      })
      .then((data) => {
        if (data.parsed) {
          setFilters((prev) => ({
            ...prev,
            vibes: data.parsed.vibes || [],
            country: data.parsed.country || 'All Countries',
            language: data.parsed.language || 'All Languages',
            rating: data.parsed.minRating || 0,
            yearMin: data.parsed.yearMin,
          }));
        }
        if (data.movies) {
          setMovies(data.movies);
          setMatchingCount(data.total || 0);
        }
      })
      .catch(() => {
        const parsed = parseNaturalLanguageQuery(query);
        setFilters((prev) => ({
          ...prev,
          vibes: parsed.vibes || [],
          country: parsed.country || 'All Countries',
          language: parsed.language || 'All Languages',
          rating: parsed.minRating || 0,
          yearMin: parsed.yearMin,
          yearMax: parsed.yearMax,
        }));
        const fallbackMovies = rankMoviesByVibes(
          seedMoviesData as unknown as MovieRecord[],
          parsed.vibes,
          parsed.country,
          parsed.minRating,
          parsed.yearMin,
          parsed.yearMax,
          parsed.language,
          'best_match'
        );
        setMovies(fallbackMovies.slice(0, 24) as unknown as Movie[]);
        setMatchingCount(fallbackMovies.length);
      });
  };

  // Surprise Me Random Pick handler
  const handleSurpriseMe = () => {
    const queryParams = new URLSearchParams();
    if (filters.vibes.length > 0) queryParams.set('vibes', filters.vibes.join(','));
    if (filters.country && filters.country !== 'All Countries') queryParams.set('country', filters.country);
    if (filters.language && filters.language !== 'All Languages') queryParams.set('language', filters.language);
    if (filters.rating > 0) queryParams.set('rating', filters.rating.toString());

    fetch(`/api/movies/surprise?${queryParams.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Surprise API error');
        return res.json();
      })
      .then((data) => {
        if (data.movie) {
          setSurpriseMovie(data.movie);
          setShowSurpriseModal(true);
        }
      })
      .catch(() => {
        const fallbackPool = rankMoviesByVibes(
          seedMoviesData as unknown as MovieRecord[],
          filters.vibes,
          filters.country,
          filters.rating,
          filters.yearMin,
          filters.yearMax,
          filters.language,
          'best_match'
        );
        const pool = fallbackPool.length > 0 ? fallbackPool : (seedMoviesData as unknown as MovieRecord[]);
        const randomMovie = pool[Math.floor(Math.random() * pool.length)];
        setSurpriseMovie(randomMovie as unknown as Movie);
        setShowSurpriseModal(true);
      });
  };

  return (
    <div className="min-h-screen bg-[#0D0E0F] text-[#F2F0EB] flex flex-col font-sans selection:bg-[#28231A] selection:text-[#D6A85F]">
      
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSurpriseMe={handleSurpriseMe}
        onOpenSearch={() => setShowSearchModal(true)}
        watchlistCount={savedMovies.length}
      />

      {/* Main Body Content based on Active Tab */}
      <main className="flex-grow">
        {activeTab === 'discover' && (
          <>
            <Hero
              selectedVibes={filters.vibes}
              onToggleVibe={handleToggleVibe}
              onNaturalLanguageQuery={handleNaturalLanguageQuery}
              onOpenPickForMe={() => setShowQuizModal(true)}
            />

            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAllFilters}
              onApply={fetchMovies}
              matchingCount={matchingCount}
            />

            {movies.length > 0 || loading ? (
              <MovieGrid
                movies={movies}
                filters={filters}
                loading={loading}
                onSortChange={(sort) => handleFilterChange({ sort })}
                savedMovieIds={savedMovies.map((m) => m.id)}
                onToggleSave={handleToggleSaveMovie}
              />
            ) : (
              <EmptyState
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetAll={handleClearAllFilters}
              />
            )}
          </>
        )}

        {activeTab === 'explore' && (
          <ExploreRails
            onSelectCollectionVibes={(vibes, country) => {
              setFilters((prev) => ({
                ...prev,
                vibes,
                country: country || 'All Countries',
              }));
              setActiveTab('discover');
            }}
            savedMovieIds={savedMovies.map((m) => m.id)}
            onToggleSave={handleToggleSaveMovie}
          />
        )}

        {activeTab === 'watchlist' && (
          <WatchlistPage
            savedMovies={savedMovies}
            onToggleSave={handleToggleSaveMovie}
            onClearWatchlist={handleClearWatchlist}
          />
        )}

        {activeTab === 'about' && <AboutPage />}
      </main>

      {/* Modals */}
      {showSurpriseModal && (
        <SurpriseMeModal
          movie={surpriseMovie}
          onClose={() => setShowSurpriseModal(false)}
          onSpinAgain={handleSurpriseMe}
          isSaved={surpriseMovie ? savedMovies.some((m) => m.id === surpriseMovie.id) : false}
          onToggleSave={handleToggleSaveMovie}
        />
      )}

      {showQuizModal && (
        <PickForMeQuiz
          onClose={() => setShowQuizModal(false)}
          onCompleteQuiz={(vibes) => {
            setFilters((prev) => ({ ...prev, vibes }));
            setShowQuizModal(false);
          }}
        />
      )}

      {showSearchModal && <SearchModal onClose={() => setShowSearchModal(false)} />}
    </div>
  );
};

export default App;
