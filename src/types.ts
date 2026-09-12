export interface Movie {
  id: string;
  tmdbId?: number | null;
  imdbId?: string | null;
  title: string;
  originalTitle: string;
  overview: string;
  releaseDate: string;
  year: number;
  runtime: number;
  posterPath?: string | null;
  backdropPath?: string | null;
  genres: string[];
  country: string;
  language: string;
  director: string;
  cast: string[];
  tmdbRating: number;
  imdbRating: number;
  voteCount: number;
  popularity: number;
  vibes: Record<string, number>;
  relevanceScore?: number;
}

export interface FilterState {
  vibes: string[];
  country: string;
  rating: number;
  yearMin?: number;
  yearMax?: number;
  language?: string;
  sort: string;
}

export interface CuratedCollection {
  id: string;
  title: string;
  subtitle: string;
  vibes: string[];
  movies: Movie[];
}
