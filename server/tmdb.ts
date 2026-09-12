import dotenv from 'dotenv';
dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchFromTMDB(endpoint: string, params: Record<string, string> = {}) {
  if (!TMDB_API_KEY) {
    return null;
  }
  try {
    const queryParams = new URLSearchParams({
      api_key: TMDB_API_KEY,
      ...params,
    });
    const url = `${TMDB_BASE_URL}${endpoint}?${queryParams.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`TMDB API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch from TMDB:', error);
    return null;
  }
}

export async function searchTMDBMovie(title: string, year?: number) {
  const params: Record<string, string> = { query: title };
  if (year) {
    params.year = year.toString();
  }
  const data = await fetchFromTMDB('/search/movie', params);
  if (data && data.results && data.results.length > 0) {
    return data.results[0];
  }
  return null;
}
