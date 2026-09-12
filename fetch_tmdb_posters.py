import json
import urllib.request
import urllib.parse
import time
import os

API_KEY = "f15f8ac8e622b8e09130d25d4014271c"
BASE_URL = "https://api.themoviedb.org/3/search/movie"
IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"
BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280"

SEED_PATH = "/Users/agnikdutta/CODING_new/moviepicker/server/seedMovies.json"
SRC_SEED_PATH = "/Users/agnikdutta/CODING_new/moviepicker/src/data/seedMovies.json"

def search_tmdb(title, year=None, language=None):
    query_params = {
        "api_key": API_KEY,
        "query": title,
    }
    if year:
        query_params["year"] = str(year)
        
    url = f"{BASE_URL}?{urllib.parse.urlencode(query_params)}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            results = data.get("results", [])
            if results:
                # Return first result with a poster
                for res in results:
                    if res.get("poster_path"):
                        return res
                return results[0]
            
            # If search with year returned nothing, try without year
            if year:
                del query_params["year"]
                url_no_year = f"{BASE_URL}?{urllib.parse.urlencode(query_params)}"
                req_no_year = urllib.request.Request(url_no_year, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req_no_year) as resp2:
                    data2 = json.loads(resp2.read().decode('utf-8'))
                    results2 = data2.get("results", [])
                    if results2:
                        for res in results2:
                            if res.get("poster_path"):
                                return res
                        return results2[0]
    except Exception as e:
        print(f"Error fetching TMDB for '{title}': {e}")
    return None

def main():
    if not os.path.exists(SEED_PATH):
        print(f"File not found: {SEED_PATH}")
        return

    with open(SEED_PATH, "r", encoding="utf-8") as f:
        movies = json.load(f)

    total = len(movies)
    print(f"Starting TMDB poster fetch for {total} movies...")
    
    updated_count = 0
    for idx, m in enumerate(movies):
        title = m.get("title")
        year = m.get("year")
        current_poster = m.get("posterPath")
        
        # If current poster is missing or unsplash placeholder or null, fetch from TMDB
        if not current_poster or "unsplash.com" in current_poster or "m.media-amazon" in current_poster:
            res = search_tmdb(title, year)
            if res and res.get("poster_path"):
                poster_url = f"{IMAGE_BASE_URL}{res.get('poster_path')}"
                m["posterPath"] = poster_url
                m["tmdbId"] = res.get("id")
                if res.get("backdrop_path"):
                    m["backdropPath"] = f"{BACKDROP_BASE_URL}{res.get('backdrop_path')}"
                updated_count += 1
                print(f"[{idx+1}/{total}] Updated '{title}' ({year}): {poster_url}")
            else:
                print(f"[{idx+1}/{total}] No poster found on TMDB for '{title}' ({year})")
            time.sleep(0.08)  # slight delay to stay well within TMDB rate limits
        else:
            print(f"[{idx+1}/{total}] Skipping '{title}' (already has valid poster)")

    print(f"\nCompleted! Updated {updated_count}/{total} movies with TMDB posters.")

    # Save to server/seedMovies.json
    with open(SEED_PATH, "w", encoding="utf-8") as f:
        json.dump(movies, f, indent=2, ensure_ascii=False)

    # Save to src/data/seedMovies.json
    with open(SRC_SEED_PATH, "w", encoding="utf-8") as f:
        json.dump(movies, f, indent=2, ensure_ascii=False)

    print("Saved updated movie datasets to server/seedMovies.json and src/data/seedMovies.json")

if __name__ == "__main__":
    main()
