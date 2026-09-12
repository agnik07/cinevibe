export interface MovieRecord {
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

export function rankMoviesByVibes(
  movies: MovieRecord[],
  selectedVibes: string[],
  country?: string,
  minRating: number = 0,
  yearMin?: number,
  yearMax?: number,
  language?: string,
  sort: string = 'best_match'
): MovieRecord[] {
  let filtered = movies.filter((movie) => {
    // Country filter
    if (country && country !== 'All Countries') {
      const cLower = country.toLowerCase();
      const mCountry = (movie.country || '').toLowerCase();
      if (!mCountry.includes(cLower) && !cLower.includes(mCountry)) {
        return false;
      }
    }

    // Language filter
    if (language && language !== 'All Languages') {
      const lLower = language.toLowerCase();
      const mLang = (movie.language || '').toLowerCase();
      if (!mLang.includes(lLower) && !lLower.includes(mLang)) {
        return false;
      }
    }

    // Rating filter (checking imdbRating / tmdbRating)
    const effectiveRating = movie.imdbRating || movie.tmdbRating || 0;
    if (effectiveRating < minRating) {
      return false;
    }

    // Year filter
    if (yearMin && movie.year < yearMin) return false;
    if (yearMax && movie.year > yearMax) return false;

    return true;
  });

  // Calculate relevance score if vibes selected
  filtered = filtered.map((movie) => {
    let vibeScoreSum = 0;
    let maxPossible = selectedVibes.length;

    if (selectedVibes.length > 0) {
      for (const vibe of selectedVibes) {
        const score = movie.vibes[vibe] || 0;
        vibeScoreSum += score;
      }
    } else {
      vibeScoreSum = 1;
      maxPossible = 1;
    }

    const vibeRelevance = vibeScoreSum / Math.max(1, maxPossible);
    const ratingFactor = (movie.imdbRating || 7.5) / 10.0;
    const popFactor = Math.log10((movie.voteCount || 1000) + 1) / 5.0;

    // Weighted combined score
    const relevanceScore = vibeRelevance * 0.7 + ratingFactor * 0.2 + popFactor * 0.1;

    return {
      ...movie,
      relevanceScore: Math.round(relevanceScore * 1000) / 1000,
    };
  });

  // Sorting logic
  filtered.sort((a, b) => {
    if (sort === 'rating') {
      return (b.imdbRating || b.tmdbRating) - (a.imdbRating || a.tmdbRating);
    }
    if (sort === 'popular') {
      return b.voteCount - a.voteCount;
    }
    if (sort === 'newest') {
      return b.year - a.year;
    }
    if (sort === 'oldest') {
      return a.year - b.year;
    }
    if (sort === 'hidden_gems') {
      const gemScoreA = (a.imdbRating || 8) * (1 / Math.log10(a.voteCount || 100));
      const gemScoreB = (b.imdbRating || 8) * (1 / Math.log10(b.voteCount || 100));
      return gemScoreB - gemScoreA;
    }
    // Default: Best match
    return (b.relevanceScore || 0) - (a.relevanceScore || 0);
  });

  return filtered;
}

export function parseNaturalLanguageQuery(query: string): {
  vibes: string[];
  country?: string;
  language?: string;
  minRating: number;
  yearMin?: number;
  yearMax?: number;
} {
  const q = query.toLowerCase();
  const vibes: string[] = [];

  // Vibe keyword detection
  if (q.includes('business') || q.includes('corporate') || q.includes('money') || q.includes('sales')) vibes.push('business');
  if (q.includes('start') || q.includes('entrepreneur') || q.includes('founder')) vibes.push('entrepreneurship');
  if (q.includes('motivat') || q.includes('inspir') || q.includes('hustle')) vibes.push('motivation');
  if (q.includes('ambit') || q.includes('power') || q.includes('goal')) vibes.push('ambition');
  if (q.includes('fail') || q.includes('comeback') || q.includes('retry')) vibes.push('failure_comeback');
  if (q.includes('love') || q.includes('roman')) vibes.push('romance');
  if (q.includes('emotion') || q.includes('cry') || q.includes('tear') || q.includes('sad')) vibes.push('emotions');
  if (q.includes('friend') || q.includes('dost') || q.includes('buddy')) vibes.push('friendship');
  if (q.includes('family') || q.includes('parent') || q.includes('home')) vibes.push('family');
  if (q.includes('dark') || q.includes('intense') || q.includes('thrill') || q.includes('scary')) vibes.push('dark_intense');
  if (q.includes('myster') || q.includes('twist') || q.includes('mind') || q.includes('secret')) vibes.push('mystery_mindgames');
  if (q.includes('fun') || q.includes('comdy') || q.includes('laugh') || q.includes('funny')) vibes.push('fun');
  if (q.includes('feel good') || q.includes('wholesome') || q.includes('happy')) vibes.push('feel_good');

  // Country detection
  let country: string | undefined = undefined;
  if (q.includes('india') || q.includes('bollywood') || q.includes('indian')) country = 'India';
  else if (q.includes('korea') || q.includes('korean')) country = 'South Korea';
  else if (q.includes('japan') || q.includes('japanese') || q.includes('anime')) country = 'Japan';
  else if (q.includes('french') || q.includes('france')) country = 'France';
  else if (q.includes('us') || q.includes('american') || q.includes('hollywood') || q.includes('united states')) country = 'United States';
  else if (q.includes('uk') || q.includes('british')) country = 'United Kingdom';

  // Language detection
  let language: string | undefined = undefined;
  if (q.includes('hindi')) language = 'Hindi';
  else if (q.includes('telugu')) language = 'Telugu';
  else if (q.includes('malayalam')) language = 'Malayalam';
  else if (q.includes('tamil')) language = 'Tamil';
  else if (q.includes('kannada')) language = 'Kannada';
  else if (q.includes('marathi')) language = 'Marathi';
  else if (q.includes('bengali')) language = 'Bengali';
  else if (q.includes('english')) language = 'English';

  // Rating detection
  let minRating = 0;
  if (q.includes('8+') || q.includes('8.0') || q.includes('imdb 8')) minRating = 8.0;
  else if (q.includes('8.5')) minRating = 8.5;
  else if (q.includes('7.5')) minRating = 7.5;
  else if (q.includes('7+')) minRating = 7.0;

  // Year detection
  let yearMin: number | undefined = undefined;
  if (q.includes('after 2010') || q.includes('2010s')) yearMin = 2010;
  else if (q.includes('after 2000') || q.includes('2000s')) yearMin = 2000;
  else if (q.includes('after 1990') || q.includes('90s')) yearMin = 1990;
  else if (q.includes('after 1980') || q.includes('80s')) yearMin = 1980;

  return { vibes, country, language, minRating, yearMin };
}
