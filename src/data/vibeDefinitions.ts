export interface VibeDefinition {
  id: string;
  label: string;
  description: string;
  category: 'career' | 'emotion' | 'mindset' | 'atmosphere' | 'narrative';
  popular?: boolean;
}

export const VIBE_DEFINITIONS: VibeDefinition[] = [
  { id: 'business', label: 'Business', description: 'Corporate strategy, trade, deals & marketplace tactics', category: 'career', popular: true },
  { id: 'entrepreneurship', label: 'Entrepreneurship', description: 'Building ground-breaking startups from zero', category: 'career', popular: true },
  { id: 'motivation', label: 'Motivation', description: 'Relentless drive to overcome overwhelming odds', category: 'mindset', popular: true },
  { id: 'ambition', label: 'Ambition', description: 'High stakes, hunger for power & supreme achievement', category: 'mindset', popular: true },
  { id: 'success', label: 'Success', description: 'Reaching the absolute pinnacle & triumph', category: 'career' },
  { id: 'failure_comeback', label: 'Failure & Comeback', description: 'Rising stronger from defeat and rock bottom', category: 'mindset', popular: true },
  { id: 'leadership', label: 'Leadership', description: 'Visionary command, guiding others & responsibility', category: 'career' },
  { id: 'emotions', label: 'True Emotions', description: 'Heart-stirring, raw, and deeply resonant stories', category: 'emotion', popular: true },
  { id: 'romance', label: 'Romance', description: 'Love, passion, heartbreak & tender chemistry', category: 'emotion', popular: true },
  { id: 'friendship', label: 'Friendship', description: 'Unshakeable bonds, comradeship & loyalty', category: 'emotion', popular: true },
  { id: 'family', label: 'Family', description: 'Generational ties, devotion, and domestic warmth', category: 'emotion' },
  { id: 'self_discovery', label: 'Self Discovery', description: 'Inner transformation & finding true identity', category: 'narrative', popular: true },
  { id: 'life_lessons', label: 'Life Lessons', description: 'Wisdom, moral clarity, and profound reflection', category: 'narrative', popular: true },
  { id: 'human_nature', label: 'Human Nature', description: 'Psychological complexity, morality & society', category: 'narrative' },
  { id: 'truth_reality', label: 'Truth & Reality', description: 'Unfiltered realism and authentic human struggle', category: 'narrative' },
  { id: 'philosophical', label: 'Philosophical', description: 'Existential queries, meaning & high concepts', category: 'narrative' },
  { id: 'inspirational', label: 'Inspirational', description: 'Uplifting the human spirit against all despair', category: 'mindset', popular: true },
  { id: 'courage', label: 'Courage', description: 'Fearless bravery and standing up against power', category: 'mindset' },
  { id: 'resilience', label: 'Resilience', description: 'Iron fortitude, grit, and refusal to surrender', category: 'mindset' },
  { id: 'fun', label: 'Fun', description: 'Witty, high-energy, lighthearted entertainment', category: 'atmosphere', popular: true },
  { id: 'feel_good', label: 'Feel Good', description: 'Cozy comfort, warmth, and joyful optimism', category: 'atmosphere', popular: true },
  { id: 'dark_intense', label: 'Dark & Intense', description: 'High tension, psychological depth & thrill', category: 'atmosphere', popular: true },
  { id: 'mystery_mindgames', label: 'Mystery & Mind Games', description: 'Twists, puzzles, detective work & secrets', category: 'atmosphere', popular: true },
  { id: 'coming_of_age', label: 'Coming of Age', description: 'Youth, growing up & life transitions', category: 'narrative' },
  { id: 'social_issues', label: 'Social Issues', description: 'Systemic reform, justice, activism & society', category: 'narrative' },
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
