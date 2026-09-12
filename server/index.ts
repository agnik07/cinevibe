import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MovieRecord, rankMoviesByVibes, parseNaturalLanguageQuery } from './vibeEngine';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Load database seed movies
const seedPath = path.join(__dirname, 'seedMovies.json');
let moviesDatabase: MovieRecord[] = [];

if (fs.existsSync(seedPath)) {
  const raw = fs.readFileSync(seedPath, 'utf-8');
  moviesDatabase = JSON.parse(raw);
  console.log(`Loaded ${moviesDatabase.length} movies into memory DB.`);
} else {
  console.warn('seedMovies.json not found! Initializing empty memory DB.');
}

// 1. DISCOVER MOVIES ENDPOINT
app.get('/api/movies/discover', (req: Request, res: Response) => {
  const vibesParam = (req.query.vibes as string) || '';
  const vibes = vibesParam ? vibesParam.split(',').map((v) => v.trim()).filter(Boolean) : [];
  const country = (req.query.country as string) || undefined;
  const language = (req.query.language as string) || undefined;
  const rating = parseFloat((req.query.rating as string) || '0');
  const yearMin = req.query.yearMin ? parseInt(req.query.yearMin as string) : undefined;
  const yearMax = req.query.yearMax ? parseInt(req.query.yearMax as string) : undefined;
  const sort = (req.query.sort as string) || 'best_match';
  const page = parseInt((req.query.page as string) || '1');
  const limit = parseInt((req.query.limit as string) || '24');

  const ranked = rankMoviesByVibes(
    moviesDatabase,
    vibes,
    country,
    rating,
    yearMin,
    yearMax,
    language,
    sort
  );

  const total = ranked.length;
  const startIndex = (page - 1) * limit;
  const paginated = ranked.slice(startIndex, startIndex + limit);

  res.json({
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    movies: paginated,
  });
});

// 2. SEARCH ENDPOINT
app.get('/api/movies/search', (req: Request, res: Response) => {
  const q = ((req.query.q as string) || '').toLowerCase().trim();
  if (!q) {
    return res.json({ total: 0, movies: [] });
  }

  const matches = moviesDatabase.filter((m) => {
    return (
      m.title.toLowerCase().includes(q) ||
      (m.director && m.director.toLowerCase().includes(q)) ||
      (m.cast && m.cast.some((c) => c.toLowerCase().includes(q))) ||
      (m.country && m.country.toLowerCase().includes(q)) ||
      (m.language && m.language.toLowerCase().includes(q)) ||
      (m.genres && m.genres.some((g) => g.toLowerCase().includes(q)))
    );
  });

  res.json({
    total: matches.length,
    movies: matches.slice(0, 20),
  });
});

// 3. SURPRISE ME ENDPOINT
app.get('/api/movies/surprise', (req: Request, res: Response) => {
  const vibesParam = (req.query.vibes as string) || '';
  const vibes = vibesParam ? vibesParam.split(',').map((v) => v.trim()).filter(Boolean) : [];
  const country = (req.query.country as string) || undefined;
  const language = (req.query.language as string) || undefined;
  const rating = parseFloat((req.query.rating as string) || '0');
  const yearMin = req.query.yearMin ? parseInt(req.query.yearMin as string) : undefined;
  const yearMax = req.query.yearMax ? parseInt(req.query.yearMax as string) : undefined;

  const ranked = rankMoviesByVibes(
    moviesDatabase,
    vibes,
    country,
    rating,
    yearMin,
    yearMax,
    language,
    'best_match'
  );

  const pool = ranked.length > 0 ? ranked : moviesDatabase;
  const randomMovie = pool[Math.floor(Math.random() * pool.length)];

  res.json({ movie: randomMovie });
});

// 4. NATURAL LANGUAGE QUERY ENDPOINT
app.post('/api/movies/nl-search', (req: Request, res: Response) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query string required' });
  }

  const parsed = parseNaturalLanguageQuery(query);
  const ranked = rankMoviesByVibes(
    moviesDatabase,
    parsed.vibes,
    parsed.country,
    parsed.minRating,
    parsed.yearMin,
    parsed.yearMax,
    parsed.language,
    'best_match'
  );

  res.json({
    parsed,
    total: ranked.length,
    movies: ranked.slice(0, 24),
  });
});

// 5. CURATED EDITORIAL COLLECTIONS ENDPOINT
app.get('/api/collections', (_req: Request, res: Response) => {
  const collections = [
    {
      id: 'build_something',
      title: 'Movies That Make You Want to Build Something',
      subtitle: 'Stories about founders, visionaries, and relentless builders.',
      vibes: ['business', 'entrepreneurship', 'ambition', 'motivation'],
      movies: rankMoviesByVibes(moviesDatabase, ['business', 'entrepreneurship'], undefined, 7.5).slice(0, 10),
    },
    {
      id: 'refused_to_quit',
      title: 'Movies About People Who Refused to Quit',
      subtitle: 'Iron fortitude when everyone else surrendered.',
      vibes: ['resilience', 'failure_comeback', 'courage', 'motivation'],
      movies: rankMoviesByVibes(moviesDatabase, ['resilience', 'failure_comeback'], undefined, 7.5).slice(0, 10),
    },
    {
      id: 'best_indian_cinema',
      title: 'Best of Indian Cinema',
      subtitle: 'Iconic stories across languages that redefined Indian cinema.',
      vibes: ['emotions', 'truth_reality', 'life_lessons'],
      movies: rankMoviesByVibes(moviesDatabase, ['life_lessons', 'emotions'], 'India', 8.0).slice(0, 10),
    },
    {
      id: 'mind_games',
      title: 'Movies That Make You Think & Second Guess',
      subtitle: 'Mind-bending twists, secrets, and high-tension psychological puzzles.',
      vibes: ['mystery_mindgames', 'dark_intense', 'philosophical'],
      movies: rankMoviesByVibes(moviesDatabase, ['mystery_mindgames', 'dark_intense'], undefined, 7.5).slice(0, 10),
    },
    {
      id: 'feel_good_warmth',
      title: 'Movies That Feel Like a Cozy Hug',
      subtitle: 'Wholesome warmth, comfort, and joyful optimism.',
      vibes: ['feel_good', 'fun', 'friendship', 'family'],
      movies: rankMoviesByVibes(moviesDatabase, ['feel_good', 'fun'], undefined, 7.5).slice(0, 10),
    },
  ];

  res.json({ collections });
});

// HEALTH CHECK
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', moviesCount: moviesDatabase.length });
});

app.listen(PORT, () => {
  console.log(`CINEVIBE Backend running on http://localhost:${PORT}`);
});
