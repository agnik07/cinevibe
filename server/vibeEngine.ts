export interface MovieRecord {
  id: string;
  tmdbId?: number | null;
  imdbId?: string | null;
  title: string;
  originalTitle?: string;
  overview?: string;
  releaseDate?: string;
  year: number;
  runtime?: number;
  posterPath?: string | null;
  backdropPath?: string | null;
  genres: string[];
  country: string;
  language: string;
  director?: string;
  cast?: string[];
  tmdbRating?: number;
  imdbRating: number;
  voteCount?: number;
  popularity?: number;
  vibeScores?: Record<string, number>;
  vibes?: Record<string, number>;
  relevanceScore?: number;
}

const VIBE_ALIASES: Record<string, string[]> = {
  feelGood: ['feel_good', 'feelgood', 'wholesome', 'happy', 'cozy'],
  darkGritty: ['dark_intense', 'dark', 'gritty', 'crime', 'murder', 'intense'],
  mindBending: ['mystery_mindgames', 'mindbending', 'mind-bending', 'twist', 'psychological', 'puzzle'],
  emotional: ['emotions', 'emotional', 'tearjerker', 'sad', 'heartbreaking'],
  actionPacked: ['action', 'actionpacked', 'fight', 'war'],
  thoughtProvoking: ['social_issues', 'truth_reality', 'thoughtprovoking', 'justice', 'society'],
  cozyComfort: ['cozy', 'comfort', 'warmth', 'family'],
  edgeOfSeat: ['thriller', 'suspense', 'edgeofseat', 'survival', 'hunt'],
  romantic: ['romance', 'romantic', 'love', 'couple'],
  inspiringMotivational: ['motivation', 'inspirational', 'inspiring', 'courage', 'resilience', 'triumph'],
  funnyHumorous: ['fun', 'comedy', 'funny', 'humor', 'satire', 'hilarious'],
  intellectualSmart: ['intellectual', 'smart', 'courtroom', 'law', 'strategy', 'detective'],
  intenseDramatic: ['intense', 'dramatic', 'drama', 'crisis'],
  lightheartedFun: ['lighthearted', 'fun', 'playful'],
  epicGrand: ['epic', 'grand', 'history', 'saga', 'legend'],
  mysteriousEnigmatic: ['mystery', 'mysterious', 'secret'],
  melancholicPoetic: ['melancholic', 'poetic', 'grief', 'loss'],
  suspensefulTense: ['suspense', 'suspenseful', 'tense'],
  philosophicalDeep: ['philosophical', 'existential', 'meaning'],
  adventurousExciting: ['adventure', 'adventurous', 'quest'],
  nostalgic: ['nostalgic', 'retro', 'memories'],
  quirkyOffbeat: ['quirky', 'offbeat', 'eccentric'],
  slowBurn: ['slowburn', 'slow-burn'],
  fastPaced: ['fastpaced', 'fast-paced', 'chase'],
  visuallyStunning: ['visual', 'visuallystunning', 'spectacle']
};

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
    if (minRating > 0 && effectiveRating < (minRating - 0.05)) {
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

    const movieVibes = movie.vibeScores || movie.vibes || {};

    if (selectedVibes.length > 0) {
      for (const vibe of selectedVibes) {
        // Direct check
        let score = movieVibes[vibe] || 0;
        
        // Alias fallback check
        if (!score) {
          for (const [targetKey, aliases] of Object.entries(VIBE_ALIASES)) {
            if (vibe === targetKey || aliases.includes(vibe.toLowerCase())) {
              score = movieVibes[targetKey] || 0;
              break;
            }
          }
        }
        vibeScoreSum += score;
      }
    } else {
      vibeScoreSum = 1;
      maxPossible = 1;
    }

    const vibeRelevance = (vibeScoreSum / Math.max(1, maxPossible)) / 100.0;
    const ratingFactor = (movie.imdbRating || movie.tmdbRating || 7.5) / 10.0;

    // Weighted combined score
    const relevanceScore = selectedVibes.length > 0
      ? vibeRelevance * 0.7 + ratingFactor * 0.3
      : ratingFactor;

    return {
      ...movie,
      relevanceScore: Math.round(relevanceScore * 1000) / 1000,
    };
  });

  // Sorting logic
  filtered.sort((a, b) => {
    if (sort === 'rating') {
      return (b.imdbRating || b.tmdbRating || 0) - (a.imdbRating || a.tmdbRating || 0);
    }
    if (sort === 'popular') {
      return (b.voteCount || 0) - (a.voteCount || 0);
    }
    if (sort === 'newest') {
      return b.year - a.year;
    }
    if (sort === 'oldest') {
      return a.year - b.year;
    }
    if (sort === 'hidden_gems') {
      const gemScoreA = (a.imdbRating || 8) * (1 / Math.log10((a.voteCount || 100) + 1));
      const gemScoreB = (b.imdbRating || 8) * (1 / Math.log10((b.voteCount || 100) + 1));
      return gemScoreB - gemScoreA;
    }
    // Default: Best match or high rating
    if (selectedVibes.length > 0) {
      return (b.relevanceScore || 0) - (a.relevanceScore || 0);
    }
    return (b.imdbRating || b.tmdbRating || 0) - (a.imdbRating || a.tmdbRating || 0);
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

  // Vibe detection mapping
  if (q.includes('feel good') || q.includes('wholesome') || q.includes('cozy') || q.includes('warmth')) vibes.push('feelGood');
  if (q.includes('dark') || q.includes('gritty') || q.includes('crime') || q.includes('murder')) vibes.push('darkGritty');
  if (q.includes('mind') || q.includes('twist') || q.includes('psychological') || q.includes('puzzle')) vibes.push('mindBending');
  if (q.includes('emotion') || q.includes('tear') || q.includes('sad') || q.includes('crying')) vibes.push('emotional');
  if (q.includes('action') || q.includes('fight') || q.includes('chase') || q.includes('war')) vibes.push('actionPacked');
  if (q.includes('thought') || q.includes('social') || q.includes('justice') || q.includes('truth')) vibes.push('thoughtProvoking');
  if (q.includes('thriller') || q.includes('suspense') || q.includes('edge')) vibes.push('edgeOfSeat');
  if (q.includes('love') || q.includes('roman') || q.includes('couple')) vibes.push('romantic');
  if (q.includes('motivat') || q.includes('inspir') || q.includes('ambit') || q.includes('hustle')) vibes.push('inspiringMotivational');
  if (q.includes('fun') || q.includes('comdy') || q.includes('laugh') || q.includes('funny') || q.includes('hilarious')) vibes.push('funnyHumorous');
  if (q.includes('smart') || q.includes('law') || q.includes('court') || q.includes('strategy')) vibes.push('intellectualSmart');
  if (q.includes('intense') || q.includes('dramat') || q.includes('conflict')) vibes.push('intenseDramatic');
  if (q.includes('epic') || q.includes('grand') || q.includes('saga') || q.includes('legend')) vibes.push('epicGrand');
  if (q.includes('myster') || q.includes('secret') || q.includes('riddle')) vibes.push('mysteriousEnigmatic');
  if (q.includes('adventur') || q.includes('quest') || q.includes('journey')) vibes.push('adventurousExciting');

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
  if (q.includes('assamese')) language = 'Assamese';
  else if (q.includes('hindi')) language = 'Hindi';
  else if (q.includes('telugu')) language = 'Telugu';
  else if (q.includes('malayalam')) language = 'Malayalam';
  else if (q.includes('tamil')) language = 'Tamil';
  else if (q.includes('kannada')) language = 'Kannada';
  else if (q.includes('marathi')) language = 'Marathi';
  else if (q.includes('bengali')) language = 'Bengali';
  else if (q.includes('english')) language = 'English';
  else if (q.includes('korean')) language = 'Korean';
  else if (q.includes('japanese')) language = 'Japanese';

  // Rating detection (e.g. 8+, 8.0+, 8.5+, 9+, 7+, imdb 8, rating 8, imdb > 8)
  let minRating = 0;
  const ratingMatch = q.match(/(?:imdb|rating|score|stars?)?\s*([789](\.\d)?)\s*(?:\+|plus)?/);

  if (q.includes('9+') || q.includes('9.0') || q.includes('imdb 9')) minRating = 9.0;
  else if (q.includes('8.5+') || q.includes('8.5')) minRating = 8.5;
  else if (q.includes('8+') || q.includes('8.0') || q.includes('imdb 8') || q.includes('rating 8') || q.includes('8 plus') || q.includes('8.0+')) minRating = 8.0;
  else if (q.includes('7.5+') || q.includes('7.5')) minRating = 7.5;
  else if (q.includes('7+') || q.includes('7.0') || q.includes('imdb 7')) minRating = 7.0;
  else if (q.includes('imdb') || q.includes('top rated') || q.includes('best')) minRating = 7.5;
  else if (ratingMatch && ratingMatch[1]) {
    minRating = parseFloat(ratingMatch[1]);
  }

  // Year detection
  let yearMin: number | undefined = undefined;
  let yearMax: number | undefined = undefined;
  if (q.includes('after 2020') || q.includes('2020s')) yearMin = 2020;
  else if (q.includes('after 2010') || q.includes('2010s')) yearMin = 2010;
  else if (q.includes('after 2000') || q.includes('2000s')) yearMin = 2000;
  else if (q.includes('after 1990') || q.includes('90s')) yearMin = 1990;
  else if (q.includes('after 1980') || q.includes('80s')) yearMin = 1980;

  return { vibes, country, language, minRating, yearMin, yearMax };
}

