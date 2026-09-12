import React, { useEffect, useState } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { CuratedCollection, Movie } from '../types';
import { MovieCard } from './MovieCard';
import seedMoviesData from '../data/seedMovies.json';
import { rankMoviesByVibes, MovieRecord } from '../../server/vibeEngine';

interface ExploreRailsProps {
  onSelectCollectionVibes: (vibes: string[], country?: string) => void;
  savedMovieIds: string[];
  onToggleSave: (movie: Movie) => void;
}

export const ExploreRails: React.FC<ExploreRailsProps> = ({
  onSelectCollectionVibes,
  savedMovieIds,
  onToggleSave,
}) => {
  const [collections, setCollections] = useState<CuratedCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localDatabase = seedMoviesData as unknown as MovieRecord[];
    const fallbackCollections: CuratedCollection[] = [
      {
        id: 'build_something',
        title: 'Movies That Make You Want to Build Something',
        subtitle: 'Stories about founders, visionaries, and relentless builders.',
        vibes: ['business', 'entrepreneurship', 'ambition', 'motivation'],
        movies: rankMoviesByVibes(localDatabase, ['business', 'entrepreneurship'], undefined, 7.5).slice(0, 10) as unknown as Movie[],
      },
      {
        id: 'refused_to_quit',
        title: 'Movies About People Who Refused to Quit',
        subtitle: 'Iron fortitude when everyone else surrendered.',
        vibes: ['resilience', 'failure_comeback', 'courage', 'motivation'],
        movies: rankMoviesByVibes(localDatabase, ['resilience', 'failure_comeback'], undefined, 7.5).slice(0, 10) as unknown as Movie[],
      },
      {
        id: 'best_indian_cinema',
        title: 'Best of Indian Cinema',
        subtitle: 'Iconic stories across languages that redefined Indian cinema.',
        vibes: ['emotions', 'truth_reality', 'life_lessons'],
        movies: rankMoviesByVibes(localDatabase, ['life_lessons', 'emotions'], 'India', 8.0).slice(0, 10) as unknown as Movie[],
      },
      {
        id: 'mind_games',
        title: 'Movies That Make You Think & Second Guess',
        subtitle: 'Mind-bending twists, secrets, and high-tension psychological puzzles.',
        vibes: ['mystery_mindgames', 'dark_intense', 'philosophical'],
        movies: rankMoviesByVibes(localDatabase, ['mystery_mindgames', 'dark_intense'], undefined, 7.5).slice(0, 10) as unknown as Movie[],
      },
      {
        id: 'feel_good_warmth',
        title: 'Movies That Feel Like a Cozy Hug',
        subtitle: 'Wholesome warmth, comfort, and joyful optimism.',
        vibes: ['feel_good', 'fun', 'friendship', 'family'],
        movies: rankMoviesByVibes(localDatabase, ['feel_good', 'fun'], undefined, 7.5).slice(0, 10) as unknown as Movie[],
      },
    ];

    fetch('/api/collections')
      .then((res) => {
        if (!res.ok) throw new Error('Collections API non-200');
        return res.json();
      })
      .then((data) => {
        setCollections(data.collections || fallbackCollections);
        setLoading(false);
      })
      .catch(() => {
        setCollections(fallbackCollections);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="w-56 h-7 skeleton-shimmer rounded-lg" />
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="w-44 aspect-[2/3] shrink-0 skeleton-shimmer rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Editorial Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#1B1C1E] border border-[#383A3D] text-xs text-[#D6A85F] font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#D6A85F]" />
          <span>Curated Collections</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#F2F0EB] font-normal tracking-tight uppercase">
          Explore Cinema by Atmosphere
        </h1>
        <p className="text-xs sm:text-sm text-[#A8A7A3] leading-relaxed font-normal">
          Hand-picked collections grouping Indian and global masterpieces around profound thematic experiences.
        </p>
      </div>

      {/* Collections Rails */}
      {collections.map((col) => (
        <section key={col.id} className="space-y-3 border-t border-[#383A3D]/70 pt-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-serif text-2xl text-[#F2F0EB] font-normal tracking-tight flex items-center gap-2">
                {col.title}
              </h2>
              <p className="text-xs text-[#73736F] font-sans mt-0.5">{col.subtitle}</p>
            </div>

            <button
              onClick={() =>
                onSelectCollectionVibes(
                  col.vibes,
                  col.id === 'best_indian_cinema' ? 'India' : undefined
                )
              }
              className="text-xs text-[#D6A85F] hover:underline font-semibold uppercase tracking-wider flex items-center gap-1 shrink-0"
            >
              <span>See All</span>
              <ChevronRight className="w-4 h-4 text-[#D6A85F]" />
            </button>
          </div>

          {/* Horizontal Rail */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {col.movies.map((movie) => (
              <div key={movie.id} className="w-44 sm:w-52 shrink-0">
                <MovieCard
                  movie={movie}
                  isSaved={savedMovieIds.includes(movie.id)}
                  onToggleSave={onToggleSave}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
