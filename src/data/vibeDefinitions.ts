export interface VibeDefinition {
  id: string;
  label: string;
  description: string;
  category: 'career' | 'emotion' | 'mindset' | 'atmosphere' | 'narrative';
  popular?: boolean;
}

export const VIBE_DEFINITIONS: VibeDefinition[] = [
  { id: 'feelGood', label: 'Feel Good', description: 'Cozy comfort, warmth, and joyful optimism', category: 'atmosphere', popular: true },
  { id: 'darkGritty', label: 'Dark & Gritty', description: 'Raw intensity, crime, revenge & moral grey', category: 'atmosphere', popular: true },
  { id: 'mindBending', label: 'Mind Bending', description: 'Psychological puzzles, twists & reality shifts', category: 'narrative', popular: true },
  { id: 'emotional', label: 'Emotional', description: 'Heart-stirring, tears, devotion & deep feeling', category: 'emotion', popular: true },
  { id: 'actionPacked', label: 'Action Packed', description: 'High-octane fights, chases & relentless thrills', category: 'atmosphere', popular: true },
  { id: 'thoughtProvoking', label: 'Thought Provoking', description: 'Social commentary, justice & truth', category: 'narrative', popular: true },
  { id: 'cozyComfort', label: 'Cozy & Comforting', description: 'Gentle warmth, home, village & wholesome laughter', category: 'atmosphere', popular: true },
  { id: 'edgeOfSeat', label: 'Edge of Seat', description: 'High tension, suspense, survival & hunt', category: 'atmosphere', popular: true },
  { id: 'romantic', label: 'Romantic', description: 'Love, passion, chemistry & tender romance', category: 'emotion', popular: true },
  { id: 'inspiringMotivational', label: 'Inspiring & Motivational', description: 'Triumph over adversity, grit & big dreams', category: 'mindset', popular: true },
  { id: 'funnyHumorous', label: 'Funny & Humorous', description: 'Witty, hilarious comedy & satire', category: 'atmosphere', popular: true },
  { id: 'intellectualSmart', label: 'Intellectual & Smart', description: 'Courtroom drama, strategy, chess & investigation', category: 'career', popular: true },
  { id: 'intenseDramatic', label: 'Intense & Dramatic', description: 'Gripping personal conflict, crisis & stakes', category: 'emotion', popular: true },
  { id: 'lightheartedFun', label: 'Lighthearted Fun', description: 'Playful, upbeat & easygoing entertainment', category: 'atmosphere', popular: true },
  { id: 'epicGrand', label: 'Epic & Grand', description: 'Spectacle, historical sagas, war & legends', category: 'narrative', popular: true },
  { id: 'mysteriousEnigmatic', label: 'Mysterious', description: 'Unsolved secrets, puzzles & dark riddles', category: 'narrative' },
  { id: 'melancholicPoetic', label: 'Melancholic & Poetic', description: 'Bittersweet beauty, loss, nostalgia & solitude', category: 'emotion' },
  { id: 'suspensefulTense', label: 'Suspenseful', description: 'Clock ticking, danger & nerve-wracking tension', category: 'atmosphere' },
  { id: 'philosophicalDeep', label: 'Philosophical', description: 'Existential queries, meaning of life & fate', category: 'narrative' },
  { id: 'adventurousExciting', label: 'Adventurous', description: 'Wild journeys, quests & exploration', category: 'narrative' },
  { id: 'nostalgic', label: 'Nostalgic', description: 'Retro vibes, childhood, past eras & memories', category: 'narrative' },
  { id: 'quirkyOffbeat', label: 'Quirky & Offbeat', description: 'Eccentric, dark humor & unusual storytelling', category: 'narrative' },
  { id: 'slowBurn', label: 'Slow Burn', description: 'Deep character studies & gradual payoff', category: 'narrative' },
  { id: 'fastPaced', label: 'Fast Paced', description: 'Non-stop energy, swift beats & quick momentum', category: 'atmosphere' },
  { id: 'visuallyStunning', label: 'Visually Stunning', description: 'Breathtaking imagery, art & scope', category: 'atmosphere' },
];

export const COUNTRY_OPTIONS = [
  'All Countries',
  'India',
  'United States',
  'United Kingdom',
  'Japan',
  'South Korea',
  'France',
  'Germany',
  'Italy',
  'Spain',
  'China',
  'Hong Kong',
  'Taiwan',
  'Iran',
  'Turkey',
  'Russia',
  'Sweden',
  'Denmark',
  'Norway',
  'Mexico',
  'Brazil',
  'Argentina',
  'Australia',
  'Canada',
  'New Zealand',
];

export const LANGUAGE_OPTIONS = [
  'All Languages',
  'Hindi',
  'Malayalam',
  'Telugu',
  'Tamil',
  'Kannada',
  'Marathi',
  'Bengali',
  'Assamese',
  'English',
  'Korean',
  'Japanese',
  'French',
  'Italian',
  'Spanish',
  'Portuguese',
  'Persian',
];

export const ERA_OPTIONS = [
  { label: 'Any Year', min: undefined, max: undefined },
  { label: 'Before 1960', min: undefined, max: 1959 },
  { label: '1960+', min: 1960, max: undefined },
  { label: '1970+', min: 1970, max: undefined },
  { label: '1980+', min: 1980, max: undefined },
  { label: '1990+', min: 1990, max: undefined },
  { label: '2000+', min: 2000, max: undefined },
  { label: '2010+', min: 2010, max: undefined },
  { label: '2020+', min: 2020, max: undefined },
];

export const RATING_OPTIONS = [
  { label: 'Any Rating', value: 0 },
  { label: '★ 7.0+', value: 7.0 },
  { label: '★ 7.5+', value: 7.5 },
  { label: '★ 8.0+', value: 8.0 },
  { label: '★ 8.5+', value: 8.5 },
  { label: '★ 9.0+', value: 9.0 },
];
