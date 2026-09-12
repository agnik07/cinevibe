import json, random, re

# Known curated metadata for popular Indian movies to ensure peak accuracy
CURATED = {
    "mayabazar": {
        "vibes": ["fun", "feel_good", "family", "nostalgic", "romance"],
        "synopsis": "A mythological fantasy masterpiece revolving around Krishna, Balarama, and Ghatotkacha using magical illusions during the Pandavas exile.",
        "director": "K. V. Reddy",
        "cast": ["N. T. Rama Rao", "S. V. Ranga Rao", "Savitri"],
        "genres": ["Fantasy", "Comedy", "Family"],
        "poster": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80"
    },
    "sandesham": {
        "vibes": ["business", "social_issues", "human_nature", "fun", "truth_reality"],
        "synopsis": "A biting political satire depicting two brothers blindly following opposing political parties, disrupting their family life.",
        "director": "Sathyan Anthikad",
        "cast": ["Sreenivasan", "Jayaram", "Thilakan"],
        "genres": ["Comedy", "Satire", "Drama"]
    },
    "sankarabharanam": {
        "vibes": ["life_lessons", "emotions", "philosophical", "human_nature", "inspirational"],
        "synopsis": "A classical music guru maintains the purity of Carnatic music against modern shifts, creating a deep bond with a devoted disciple.",
        "director": "K. Viswanath",
        "cast": ["J. V. Somayajulu", "Manju Bhargavi", "Chandra Mohan"],
        "genres": ["Drama", "Music"]
    },
    "3 idiots": {
        "vibes": ["motivation", "friendship", "self_discovery", "coming_of_age", "life_lessons", "ambition", "fun"],
        "synopsis": "Two friends search for their long-lost college companion while reflecting on their journey through a pressure-cooker engineering academy.",
        "director": "Rajkumar Hirani",
        "cast": ["Aamir Khan", "Madhavan", "Sharman Joshi", "Kareena Kapoor"],
        "genres": ["Comedy", "Drama"],
        "poster": "https://m.media-amazon.com/images/M/MVB0BNjNlNGUtYjE1My00MGFlLTliOWQtNmU4Nzc2YjNmYmFmXkEyXkFqcGc@._V1_SX300.jpg"
    },
    "12th fail": {
        "vibes": ["motivation", "ambition", "failure_comeback", "resilience", "courage", "truth_reality", "success"],
        "synopsis": "Based on the real-life struggle of IPS Officer Manoj Kumar Sharma, who restarted his academic journey from scratch after failing 12th grade.",
        "director": "Vidhu Vinod Chopra",
        "cast": ["Vikrant Massey", "Medha Shankar", "Anant V Joshi"],
        "genres": ["Biography", "Drama"]
    },
    "dangal": {
        "vibes": ["motivation", "ambition", "courage", "family", "leadership", "success", "resilience"],
        "synopsis": "Former wrestler Mahavir Singh Phogat trains his daughters Geeta and Babita to become world-class female wrestlers.",
        "director": "Nitesh Tiwari",
        "cast": ["Aamir Khan", "Fatima Sana Shaikh", "Sanya Malhotra"],
        "genres": ["Action", "Biography", "Drama"]
    },
    "swades": {
        "vibes": ["self_discovery", "social_issues", "human_nature", "inspirational", "truth_reality", "life_lessons"],
        "synopsis": "A successful NASA scientist returns to his native Indian village and finds his true calling in empowering the local community.",
        "director": "Ashutosh Gowariker",
        "cast": ["Shah Rukh Khan", "Gayatri Joshi", "Kishori Ballal"],
        "genres": ["Drama"]
    },
    "gangs of wasseypur": {
        "vibes": ["dark_intense", "human_nature", "truth_reality", "ambition", "social_issues"],
        "synopsis": "A clash between a coal mafia kingpin and a vengeful family spans three generations in the ruthless town of Wasseypur.",
        "director": "Anurag Kashyap",
        "cast": ["Manoj Bajpayee", "Nawazuddin Siddiqui", "Richa Chadha"],
        "genres": ["Action", "Crime", "Drama"]
    },
    "tumbbad": {
        "vibes": ["dark_intense", "mystery_mindgames", "human_nature", "truth_reality", "philosophical"],
        "synopsis": "A mythological horror epic exploring human greed through a family that builds a shrine for Hastar, a demonic god.",
        "director": "Rahi Anil Barve",
        "cast": ["Sohum Shah", "Jyoti Malshe", "Anita Date"],
        "genres": ["Fantasy", "Horror", "Mystery"]
    },
    "rocket singh: salesman of the year": {
        "vibes": ["business", "entrepreneurship", "ambition", "motivation", "success", "life_lessons"],
        "synopsis": "A fresh graduate with low marks takes a corporate sales job and secretly starts his own customer-first computer service business.",
        "director": "Shimit Amin",
        "cast": ["Ranbir Kapoor", "Prem Chopra", "Gauahar Khan"],
        "genres": ["Comedy", "Drama"]
    },
    "guru": {
        "vibes": ["business", "entrepreneurship", "ambition", "leadership", "success", "courage"],
        "synopsis": "A villager from Gujarat arrives in Bombay with big dreams and builds India's largest industrial empire through relentless ambition.",
        "director": "Mani Ratnam",
        "cast": ["Abhishek Bachchan", "Aishwarya Rai Bachchan", "Mithun Chakraborty"],
        "genres": ["Biography", "Drama"]
    },
    "drishyam": {
        "vibes": ["mystery_mindgames", "family", "courage", "dark_intense", "human_nature"],
        "synopsis": "A cable TV provider concocts a masterfully detailed alibi to protect his family after an uninvited incident threatens their lives.",
        "director": "Jeethu Joseph",
        "cast": ["Mohanlal", "Meena", "Asha Sharath"],
        "genres": ["Crime", "Drama", "Thriller"]
    },
    "kumbalangi nights": {
        "vibes": ["family", "friendship", "human_nature", "feel_good", "self_discovery", "emotions"],
        "synopsis": "Four dysfunctional brothers living in a island village must overcome personal friction and band together.",
        "director": "Madhu C. Narayanan",
        "cast": ["Shane Nigam", "Soubin Shahir", "Fahadh Faasil"],
        "genres": ["Comedy", "Drama", "Romance"]
    },
    "c/o kancharapalem": {
        "vibes": ["romance", "human_nature", "life_lessons", "truth_reality", "feel_good", "emotions"],
        "synopsis": "Four unconventional love stories spanning different age groups unfold in a tight-knit neighborhood in Kancharapalem.",
        "director": "Maha Venkatesh",
        "cast": ["Subba Rao Vepada", "Radha Bessy", "Kesava Karri"],
        "genres": ["Drama", "Romance"]
    },
    "ratsasan": {
        "vibes": ["dark_intense", "mystery_mindgames", "courage", "truth_reality"],
        "synopsis": "An aspiring film director turned police sub-inspector tracks down a psychotic serial killer targeting schoolgirls.",
        "director": "Ram Kumar",
        "cast": ["Vishnu Vishal", "Amala Paul", "Saravanan"],
        "genres": ["Crime", "Drama", "Mystery"]
    },
    "manjummel boys": {
        "vibes": ["friendship", "courage", "resilience", "dark_intense", "inspirational"],
        "synopsis": "A group of lifelong friends from Kochi embark on a trip to Kodaikanal where one of them falls into the deadly Guna Caves.",
        "director": "Chidambaram",
        "cast": ["Soubin Shahir", "Sreenath Bhasi", "Balu Varghese"],
        "genres": ["Adventure", "Drama", "Thriller"]
    },
    "sitaramam": {
        "vibes": ["romance", "emotions", "truth_reality", "courage", "life_lessons"],
        "synopsis": "An orphaned army officer receives anonymous love letters from a girl named Sita, setting off a poignant cross-border love story.",
        "director": "Hanu Raghavapudi",
        "cast": ["Dulquer Salmaan", "Mrunal Thakur", "Rashmika Mandanna"],
        "genres": ["Action", "Drama", "Mystery"]
    },
    "kantara": {
        "vibes": ["dark_intense", "truth_reality", "courage", "social_issues", "human_nature"],
        "synopsis": "When human greed ignites friction between villagers and forest officials, a divine spirit manifests through a local champion.",
        "director": "Rishab Shetty",
        "cast": ["Rishab Shetty", "Kishore Kumar G.", "Achyuth Kumar"],
        "genres": ["Action", "Adventure", "Drama"]
    }
}

INTERNATIONAL = [
    {
        "title": "The Social Network",
        "year": 2010,
        "country": "United States",
        "language": "English",
        "rating": 7.8,
        "director": "David Fincher",
        "cast": ["Jesse Eisenberg", "Andrew Garfield", "Justin Timberlake"],
        "genres": ["Biography", "Drama"],
        "synopsis": "As Harvard student Mark Zuckerberg creates the social networking site that would become Facebook, he is sued by the twins who claimed he stole their idea.",
        "vibes": ["business", "entrepreneurship", "ambition", "leadership", "success", "dark_intense", "human_nature"],
        "posterUrl": "https://m.media-amazon.com/images/M/MVB0BOGUyZDUtNWU3Mi00NDVkLTg5NWUtNWY3MGVkN2M0ZjEwXkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
        "title": "The Pursuit of Happyness",
        "year": 2006,
        "country": "United States",
        "language": "English",
        "rating": 8.0,
        "director": "Gabriele Muccino",
        "cast": ["Will Smith", "Jaden Smith", "Thandiwe Newton"],
        "genres": ["Biography", "Drama"],
        "synopsis": "A struggling salesman takes custody of his son as he's poised to begin a life-changing professional endeavor as an unpaid stockbroker intern.",
        "vibes": ["motivation", "resilience", "family", "success", "failure_comeback", "life_lessons", "emotions"],
        "posterUrl": "https://m.media-amazon.com/images/M/MVB0BMTQ5NjQyNDI5Ml5BMl5BanBnXkFtZTcwNDg2OTcxMQ@@._V1_SX300.jpg"
    },
    {
        "title": "Whiplash",
        "year": 2014,
        "country": "United States",
        "language": "English",
        "rating": 8.5,
        "director": "Damien Chazelle",
        "cast": ["Miles Teller", "J.K. Simmons", "Melissa Benoist"],
        "genres": ["Drama", "Music"],
        "synopsis": "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing.",
        "vibes": ["ambition", "dark_intense", "motivation", "resilience", "success", "philosophical"],
        "posterUrl": "https://m.media-amazon.com/images/M/MVB0BMTU0NTc4NWMtM2ViMi00MGYyLWIxOWItNWVkOTU0OWZlMDg1XkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
        "title": "Parasite",
        "year": 2019,
        "country": "South Korea",
        "language": "Korean",
        "rating": 8.5,
        "director": "Bong Joon Ho",
        "cast": ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
        "genres": ["Drama", "Thriller"],
        "synopsis": "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
        "vibes": ["social_issues", "human_nature", "dark_intense", "mystery_mindgames", "truth_reality"],
        "posterUrl": "https://m.media-amazon.com/images/M/MVB0BYWZjMjg3MDItN2NmOS00NWVmLTg5ODAtM2FiMDUzMjUzMjdhXkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
        "title": "Spirited Away",
        "year": 2001,
        "country": "Japan",
        "language": "Japanese",
        "rating": 8.6,
        "director": "Hayao Miyazaki",
        "cast": ["Rumi Hiiragi", "Miyu Irino", "Mari Natsuki"],
        "genres": ["Animation", "Adventure", "Family"],
        "synopsis": "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.",
        "vibes": ["self_discovery", "coming_of_age", "feel_good", "courage", "philosophical", "fun"],
        "posterUrl": "https://m.media-amazon.com/images/M/MVB0BMjJhNWU4M2UtMDYxNi00NmU2LTlhM2YtMDBlNWJmMWFmNzA5XkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
        "title": "Amélie",
        "year": 2001,
        "country": "France",
        "language": "French",
        "rating": 8.3,
        "director": "Jean-Pierre Jeunet",
        "cast": ["Audrey Tautou", "Mathieu Kassovitz", "Rufus"],
        "genres": ["Comedy", "Romance"],
        "synopsis": "Amélie is an innocent and naive girl in Paris with her own sense of justice. She decides to help those around her and, along the way, discovers love.",
        "vibes": ["feel_good", "romance", "fun", "human_nature", "self_discovery", "emotions"],
        "posterUrl": "https://m.media-amazon.com/images/M/MVB0BNDYwNmY4MGUtOTNiNC00MTVjLWEzMDAtNWNmM2U0MGE2YjNlXkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
        "title": "La Vita è Bella (Life Is Beautiful)",
        "year": 1997,
        "country": "Italy",
        "language": "Italian",
        "rating": 8.6,
        "director": "Roberto Benigni",
        "cast": ["Roberto Benigni", "Nicoletta Braschi", "Giorgio Cantarini"],
        "genres": ["Comedy", "Drama", "Romance"],
        "synopsis": "When an open-minded Jewish waiter and his son become victims of the Holocaust, he uses a perfect mixture of will, humor, and imagination to protect his son.",
        "vibes": ["family", "feel_good", "emotions", "courage", "resilience", "life_lessons"],
        "posterUrl": "https://m.media-amazon.com/images/M/MVB0BYmU4MDkwNjItN2U2Yy00NWY2LTg0MDItYTFjNDMyNzg3YTM5XkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
        "title": "Oppenheimer",
        "year": 2023,
        "country": "United States",
        "language": "English",
        "rating": 8.9,
        "director": "Christopher Nolan",
        "cast": ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
        "genres": ["Biography", "Drama", "History"],
        "synopsis": "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
        "vibes": ["ambition", "leadership", "philosophical", "truth_reality", "dark_intense", "human_nature"],
        "posterUrl": "https://m.media-amazon.com/images/M/MVB0BMDBmYTZjNjUtN2Y5OS00N2Y5LWE3NTUtMDliN2U5NGFiZTIxXkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
        "title": "Drive My Car",
        "year": 2021,
        "country": "Japan",
        "language": "Japanese",
        "rating": 7.6,
        "director": "Ryusuke Hamaguchi",
        "cast": ["Hidetoshi Nishijima", "Toko Miura", "Reika Kirishima"],
        "genres": ["Drama"],
        "synopsis": "An aging theater director forms an unexpected bond with his quiet young chauffeur during a residency in Hiroshima.",
        "vibes": ["philosophical", "emotions", "self_discovery", "human_nature", "life_lessons"],
        "posterUrl": "https://m.media-amazon.com/images/M/MVB0BNzVlY2NhYTYtYTUwOC00Y2JkLTg4NDItYTc5NjVjZTFhNTlhXkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
        "title": "Past Lives",
        "year": 2023,
        "country": "United States",
        "language": "English",
        "rating": 7.9,
        "director": "Celine Song",
        "cast": ["Greta Lee", "Teo Yoo", "John Magaro"],
        "genres": ["Drama", "Romance"],
        "synopsis": "Nora and Hae Sung, two deeply connected childhood friends, are wrested apart after Nora's family emigrates from South Korea. Two decades later, they reunite.",
        "vibes": ["romance", "emotions", "philosophical", "human_nature", "life_lessons", "self_discovery"],
        "posterUrl": "https://m.media-amazon.com/images/M/MVB0BOTdhODU0NTUtYWVjYS00ZDMzLWI0OTItZTZlNDgwNzA1NzA5XkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
        "title": "Oldboy",
        "year": 2003,
        "country": "South Korea",
        "language": "Korean",
        "rating": 8.4,
        "director": "Park Chan-wook",
        "cast": ["Choi Min-sik", "Yoo Ji-tae", "Kang Hye-jung"],
        "genres": ["Action", "Drama", "Mystery"],
        "synopsis": "After being mysteriously kidnapped and imprisoned for 15 years, Oh Dae-su is released, only to find he must find his captor in 5 days.",
        "vibes": ["dark_intense", "mystery_mindgames", "human_nature", "truth_reality"],
        "posterUrl": "https://m.media-amazon.com/images/M/MVB0BMTI5MjM5MDU1Ml5BMl5BanBnXkFtZTcwNjg0OTEyMQ@@._V1_SX300.jpg"
    },
    {
        "title": "City of God",
        "year": 2002,
        "country": "Brazil",
        "language": "Portuguese",
        "rating": 8.6,
        "director": "Fernando Meirelles",
        "cast": ["Alexandre Rodrigues", "Leandro Firmino", "Matheus Nachtergaele"],
        "genres": ["Crime", "Drama"],
        "synopsis": "In the slums of Rio, two kids' paths diverge: one struggles to become a photographer, while the other becomes a ruthless drug lord.",
        "vibes": ["truth_reality", "social_issues", "dark_intense", "courage", "coming_of_age", "human_nature"],
        "posterUrl": "https://m.media-amazon.com/images/M/MVB0BMGUyM2ZiZmUtMWY0MC00NmQxLWI0NWItMDAyMTM5NDkyOTEwXkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
        "title": "A Separation",
        "year": 2011,
        "country": "Iran",
        "language": "Persian",
        "rating": 8.3,
        "director": "Asghar Farhadi",
        "cast": ["Payman Maadi", "Leila Hatami", "Sareh Bayat"],
        "genres": ["Drama", "Mystery"],
        "synopsis": "A married couple faced with a difficult decision to improve the life of their child by moving to another country or stay in Iran to look after a parent with Alzheimer's.",
        "vibes": ["truth_reality", "human_nature", "social_issues", "family", "emotions", "life_lessons"],
        "posterUrl": "https://m.media-amazon.com/images/M/MVB0BMTQxNzI0OTEyMV5BMl5BanBnXkFtZTcwODQwMDcxNw@@._V1_SX300.jpg"
    },
    {
        "title": "The Intouchables",
        "year": 2011,
        "country": "France",
        "language": "French",
        "rating": 8.5,
        "director": "Olivier Nakache, Éric Toledano",
        "cast": ["François Cluzet", "Omar Sy", "Anne Le Ny"],
        "genres": ["Biography", "Comedy", "Drama"],
        "synopsis": "After he becomes a quadriplegic from a paragliding accident, an aristocrat hires a young man from the projects to be his caregiver.",
        "vibes": ["feel_good", "friendship", "fun", "human_nature", "life_lessons", "inspirational"],
        "posterUrl": "https://m.media-amazon.com/images/M/MVB0BMTYwOTEwNjQyMV5BMl5BanBnXkFtZTcwODkxMjgwNw@@._V1_SX300.jpg"
    },
    {
        "title": "Pan's Labyrinth",
        "year": 2006,
        "country": "Spain",
        "language": "Spanish",
        "rating": 8.2,
        "director": "Guillermo del Toro",
        "cast": ["Ivana Baquero", "Sergi López", "Maribel Verdú"],
        "genres": ["Drama", "Fantasy", "War"],
        "synopsis": "In the Falangist Spain of 1944, the bookish young stepdaughter of a sadistic army officer escapes into an eerie but captivating fantasy world.",
        "vibes": ["dark_intense", "coming_of_age", "courage", "philosophical", "mystery_mindgames"],
        "posterUrl": "https://m.media-amazon.com/images/M/MVB0BMTU3MDM1NjAwOV5BMl5BanBnXkFtZTcwMzg5NTIzMQ@@._V1_SX300.jpg"
    }
]

VIBE_KEYS = [
    "business", "entrepreneurship", "motivation", "ambition", "success",
    "failure_comeback", "leadership", "emotions", "romance", "friendship",
    "family", "self_discovery", "life_lessons", "human_nature", "truth_reality",
    "philosophical", "inspirational", "courage", "resilience", "fun",
    "feel_good", "dark_intense", "mystery_mindgames", "coming_of_age", "social_issues"
]

def auto_assign_vibes(title, lang, rating, year):
    t = title.lower()
    scores = {}
    
    # Defaults
    for vk in VIBE_KEYS:
        scores[vk] = 0.0
        
    # Keyword & genre heuristics
    if any(k in t for k in ["salesman", "guru", "corporate", "business", "company", "bank", "stock", "trade", "office"]):
        scores["business"] = round(random.uniform(0.85, 0.98), 2)
        scores["entrepreneurship"] = round(random.uniform(0.75, 0.95), 2)
        scores["ambition"] = round(random.uniform(0.80, 0.96), 2)
    
    if any(k in t for k in ["fail", "comeback", "retry", "loss", "victory"]):
        scores["failure_comeback"] = round(random.uniform(0.88, 0.98), 2)
        scores["resilience"] = round(random.uniform(0.85, 0.95), 2)
        scores["motivation"] = round(random.uniform(0.85, 0.98), 2)
        
    if any(k in t for k in ["love", "prema", "pyaar", "ishq", "kadhai", "romance", "wedding", "marriage", "heart"]):
        scores["romance"] = round(random.uniform(0.88, 0.99), 2)
        scores["emotions"] = round(random.uniform(0.75, 0.90), 2)
        
    if any(k in t for k in ["friend", "dost", "dosti", "boys", "gang", "buddies", "squad"]):
        scores["friendship"] = round(random.uniform(0.90, 0.99), 2)
        scores["fun"] = round(random.uniform(0.70, 0.90), 2)
        
    if any(k in t for k in ["family", "kudumbam", "mother", "father", "son", "daughter", "house"]):
        scores["family"] = round(random.uniform(0.85, 0.98), 2)
        scores["emotions"] = round(random.uniform(0.70, 0.90), 2)

    if any(k in t for k in ["police", "murder", "crime", "mafia", "gangster", "thriller", "dark", "hunt", "killer"]):
        scores["dark_intense"] = round(random.uniform(0.85, 0.98), 2)
        scores["mystery_mindgames"] = round(random.uniform(0.80, 0.95), 2)

    # General baseline vibe scores based on high rating
    if rating >= 8.5:
        scores["life_lessons"] = max(scores["life_lessons"], round(random.uniform(0.75, 0.92), 2))
        scores["human_nature"] = max(scores["human_nature"], round(random.uniform(0.70, 0.90), 2))
        scores["inspirational"] = max(scores["inspirational"], round(random.uniform(0.70, 0.88), 2))

    if rating >= 8.0:
        scores["truth_reality"] = max(scores["truth_reality"], round(random.uniform(0.65, 0.85), 2))

    # Ensure at least 3-5 vibes have substantial scores (>0.60)
    high_vibes = [vk for vk, sc in scores.items() if sc >= 0.60]
    if len(high_vibes) < 3:
        # Pick relevant random vibes based on hash of title
        seed_num = sum(ord(c) for c in title)
        random.seed(seed_num)
        selected_keys = random.sample(VIBE_KEYS, 4)
        for sk in selected_keys:
            if scores[sk] < 0.60:
                scores[sk] = round(random.uniform(0.68, 0.92), 2)

    return scores

# Process raw Indian movies
with open('raw_indian_movies.json') as f:
    raw_indian = json.load(f)

final_movies = []
id_counter = 101

for item in raw_indian:
    title = item['title']
    title_key = title.lower().strip()
    year = item['year']
    lang = item['language']
    rating = item['rating']
    
    movie_obj = {
        "id": f"movie-{id_counter}",
        "tmdbId": None,
        "imdbId": None,
        "title": title,
        "originalTitle": title,
        "overview": f"A critically acclaimed {lang} film ({year}) with an IMDb rating of {rating}. A powerful narrative exploring deep human themes and experiences.",
        "releaseDate": f"{year}-01-01",
        "year": year,
        "runtime": 135,
        "posterPath": None,
        "backdropPath": None,
        "genres": ["Drama"],
        "country": "India",
        "language": lang,
        "director": "Acclaimed Director",
        "cast": ["Lead Actor", "Co-Star"],
        "tmdbRating": rating,
        "imdbRating": rating,
        "voteCount": random.randint(1200, 45000),
        "popularity": round(random.uniform(10.0, 95.0), 1),
        "vibes": {}
    }
    
    # Check if curated
    if title_key in CURATED:
        cur = CURATED[title_key]
        movie_obj["overview"] = cur.get("synopsis", movie_obj["overview"])
        movie_obj["director"] = cur.get("director", movie_obj["director"])
        movie_obj["cast"] = cur.get("cast", movie_obj["cast"])
        movie_obj["genres"] = cur.get("genres", movie_obj["genres"])
        if "poster" in cur:
            movie_obj["posterPath"] = cur["poster"]
            
        vibe_scores = auto_assign_vibes(title, lang, rating, year)
        for vk in cur.get("vibes", []):
            vibe_scores[vk] = round(random.uniform(0.88, 0.98), 2)
        movie_obj["vibes"] = vibe_scores
    else:
        movie_obj["vibes"] = auto_assign_vibes(title, lang, rating, year)
        
    final_movies.append(movie_obj)
    id_counter += 1

# Add International Movies
for intl in INTERNATIONAL:
    rating = intl["rating"]
    movie_obj = {
        "id": f"movie-{id_counter}",
        "tmdbId": None,
        "imdbId": None,
        "title": intl["title"],
        "originalTitle": intl["title"],
        "overview": intl["synopsis"],
        "releaseDate": f"{intl['year']}-01-01",
        "year": intl["year"],
        "runtime": 125,
        "posterPath": intl.get("posterUrl"),
        "backdropPath": None,
        "genres": intl["genres"],
        "country": intl["country"],
        "language": intl["language"],
        "director": intl["director"],
        "cast": intl["cast"],
        "tmdbRating": rating,
        "imdbRating": rating,
        "voteCount": random.randint(15000, 120000),
        "popularity": round(random.uniform(30.0, 99.0), 1),
        "vibes": {}
    }
    vibe_scores = auto_assign_vibes(intl["title"], intl["language"], rating, intl["year"])
    for vk in intl.get("vibes", []):
        vibe_scores[vk] = round(random.uniform(0.88, 0.99), 2)
    movie_obj["vibes"] = vibe_scores
    final_movies.append(movie_obj)
    id_counter += 1

print(f"Total processed dataset size: {len(final_movies)} movies.")

with open('src/data/seedMovies.json', 'w') as f:
    json.dump(final_movies, f, indent=2)

with open('server/seedMovies.json', 'w') as f:
    json.dump(final_movies, f, indent=2)
