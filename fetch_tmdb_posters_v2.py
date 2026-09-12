import json
import urllib.request
import urllib.parse
import time
import os
import re

API_KEY = "f15f8ac8e622b8e09130d25d4014271c"
BASE_URL = "https://api.themoviedb.org/3/search/movie"
IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"
BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280"

SEED_PATH = "/Users/agnikdutta/CODING_new/moviepicker/server/seedMovies.json"
SRC_SEED_PATH = "/Users/agnikdutta/CODING_new/moviepicker/src/data/seedMovies.json"

def fetch_from_url(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'})
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        return None

def search_tmdb_single(query_str, year=None):
    if not query_str:
        return None
    params = {"api_key": API_KEY, "query": query_str}
    if year:
        params["year"] = str(year)
    
    url = f"{BASE_URL}?{urllib.parse.urlencode(params)}"
    data = fetch_from_url(url)
    if data and data.get("results"):
        for r in data["results"]:
            if r.get("poster_path"):
                return r
        return data["results"][0]
    return None

def find_best_poster(movie):
    title = movie.get("title", "")
    orig_title = movie.get("originalTitle", "")
    year = movie.get("year")
    
    # Clean titles
    clean_title = re.sub(r'\(.*?\)', '', title).strip()
    clean_orig = re.sub(r'\(.*?\)', '', orig_title).strip()
    
    # Variations to try
    queries = [title, clean_title]
    if orig_title and orig_title not in queries:
        queries.append(orig_title)
    if clean_orig and clean_orig not in queries:
        queries.append(clean_orig)
        
    # Alternative spelling fixes for known Indian transliterations
    alt_title = clean_title.replace("Shankar", "Sankar").replace("shankar", "sankar").replace("#", "")
    if alt_title not in queries:
        queries.append(alt_title)
        
    # Try with year first
    for q in queries:
        res = search_tmdb_single(q, year)
        if res and res.get("poster_path"):
            return res
            
    # Try without year
    for q in queries:
        res = search_tmdb_single(q, None)
        if res and res.get("poster_path"):
            return res
            
    return None

def main():
    with open(SEED_PATH, "r", encoding="utf-8") as f:
        movies = json.load(f)

    total = len(movies)
    print(f"Starting robust TMDB poster fetch for {total} movies...")
    
    updated = 0
    failed = []
    
    for idx, m in enumerate(movies):
        title = m.get("title")
        year = m.get("year")
        current_poster = m.get("posterPath")
        
        # If current poster is missing or unsplash or null or amazon placeholder
        if not current_poster or "unsplash.com" in current_poster or "m.media-amazon" in current_poster:
            res = find_best_poster(m)
            if res and res.get("poster_path"):
                poster_url = f"{IMAGE_BASE_URL}{res.get('poster_path')}"
                m["posterPath"] = poster_url
                m["tmdbId"] = res.get("id")
                if res.get("backdrop_path"):
                    m["backdropPath"] = f"{BACKDROP_BASE_URL}{res.get('backdrop_path')}"
                updated += 1
                print(f"[{idx+1}/{total}] ✓ '{title}' ({year}) -> {poster_url}")
            else:
                failed.append((title, year))
                print(f"[{idx+1}/{total}] ✗ No poster found for '{title}' ({year})")
            time.sleep(0.05)
        else:
            print(f"[{idx+1}/{total}] Skipping '{title}' (already valid)")

    print(f"\nDone! Successfully updated {updated} posters. {len(failed)} failed.")
    
    # Write updated files
    with open(SEED_PATH, "w", encoding="utf-8") as f:
        json.dump(movies, f, indent=2, ensure_ascii=False)
        
    with open(SRC_SEED_PATH, "w", encoding="utf-8") as f:
        json.dump(movies, f, indent=2, ensure_ascii=False)

    print("Updated server/seedMovies.json and src/data/seedMovies.json!")

if __name__ == "__main__":
    main()
