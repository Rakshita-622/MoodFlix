"""
MoodFlix — FastAPI Application
Serves the TF-IDF + cosine similarity movie recommendation model
through a REST API.
"""

import os
import subprocess
import asyncio
from contextlib import asynccontextmanager
from urllib.parse import quote as url_quote

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from model.predictor import MovieRecommender, MOOD_GENRE_MAP

load_dotenv(override=True)
TMDB_API_KEY = os.environ.get("TMDB_API_KEY")
print(f"[ENV_DEBUG] Loaded TMDB API Key: {TMDB_API_KEY[:4]}... (truncated for security)" if TMDB_API_KEY else "[ENV_DEBUG] TMDB_API_KEY is not set.")

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
recommender = MovieRecommender()
poster_cache = {}


# ---------------------------------------------------------------------------
# Lifespan — load (or train + load) model on startup
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    movies_pkl = os.path.join(DATA_DIR, "movies.pkl")
    similarity_pkl = os.path.join(DATA_DIR, "similarity.pkl")

    if not os.path.exists(movies_pkl) or not os.path.exists(similarity_pkl):
        csv_path = os.environ.get(
            "DATA_PATH", os.path.join(DATA_DIR, "tmdb_5000_movies.csv")
        )
        if not os.path.exists(csv_path):
            print(
                "WARNING: Dataset not found. Place tmdb_5000_movies.csv in backend/data/ "
                "and restart the server."
            )
            yield
            return

        print("INFO: Pickle files not found - training model first...")
        result = subprocess.run(
            ["python", os.path.join(os.path.dirname(__file__), "model", "train.py")],
            capture_output=True,
            text=True,
        )
        print(result.stdout)
        if result.returncode != 0:
            print("ERROR: Training failed:", result.stderr)
            yield
            return

    try:
        recommender.load(DATA_DIR)
        print(f"SUCCESS: Model loaded - {recommender.movie_count} movies ready.")
    except Exception as e:
        print(f"ERROR: Failed to load model: {e}")

    yield


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="MoodFlix API",
    description="Mood-based movie recommendations via TF-IDF + Cosine Similarity",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------
class MoodRequest(BaseModel):
    mood: str


class TitleRequest(BaseModel):
    title: str


class MovieResult(BaseModel):
    id: int
    title: str
    genres: str
    overview: str
    similarity_score: float
    poster_url: str
    hit_flop_label: str = "Unknown"


def _genre_color(genres: str) -> str:
    g = genres.lower()
    if "action" in g: return "#1a1a2e"
    if "comedy" in g: return "#2d6a4f"
    if "drama" in g: return "#4a1942"
    if "horror" in g: return "#6b2d0f"
    if "romance" in g: return "#8b2252"
    if "science" in g: return "#0a3463"
    if "adventure" in g: return "#1b4332"
    if "animation" in g: return "#3d348b"
    if "thriller" in g: return "#2b2d42"
    return "#171e19"


async def _add_poster(movie: dict) -> dict:
    title = movie["title"]
    bg = _genre_color(movie.get("genres", ""))
    # Build an inline SVG data URI — works offline, no external service
    label = title[:18].replace("&", "&amp;").replace("<", "&lt;").replace('"', "&quot;")
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450">'
        f'<rect width="300" height="450" fill="{bg}"/>'
        f'<text x="150" y="210" text-anchor="middle" fill="#ffe17c" '
        f'font-family="sans-serif" font-size="20" font-weight="bold">'
        f'{label}</text>'
        f'<text x="150" y="240" text-anchor="middle" fill="#ffe17c" '
        f'font-family="sans-serif" font-size="11" opacity="0.6">MoodFlix</text>'
        f'</svg>'
    )
    fallback = "data:image/svg+xml," + url_quote(svg)
    poster_url = fallback

    if TMDB_API_KEY and TMDB_API_KEY != "your_key_here":
        movie_id = movie.get("id")
        if movie_id in poster_cache:
            if poster_cache[movie_id]:
                poster_url = f"https://image.tmdb.org/t/p/w500{poster_cache[movie_id]}"
        else:
            try:
                async with httpx.AsyncClient(timeout=3.0) as client:
                    resp = await client.get(
                        f"https://api.themoviedb.org/3/movie/{movie_id}",
                        params={"api_key": TMDB_API_KEY}
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        poster_path = data.get("poster_path")
                        if poster_path:
                            poster_cache[movie_id] = poster_path
                            poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}"
                        else:
                            print(f"[TMDB] No poster_path returned for {title}.")
                            poster_cache[movie_id] = None
                    else:
                        print(f"[TMDB Error] Failed to fetch {title}. Status: {resp.status_code}")
                        poster_cache[movie_id] = None
            except Exception as e:
                print(f"[TMDB Exception] Failed to fetch {title}. Error: {e}")
                pass

    return {**movie, "poster_url": poster_url}


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/health")
def health():
    return {"status": "ok", "movies_loaded": recommender.movie_count}


@app.get("/api/moods")
def get_moods():
    return {"moods": list(MOOD_GENRE_MAP.keys())}


@app.post("/api/recommend/mood")
async def recommend_by_mood(body: MoodRequest):
    if not recommender.is_loaded:
        raise HTTPException(
            status_code=503,
            detail="Dataset not loaded. Place tmdb_5000_movies.csv in /data",
        )
    try:
        genre, movies = recommender.recommend_by_mood(body.mood)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    movies_with_posters = await asyncio.gather(*[_add_poster(m) for m in movies])

    return {
        "mood": body.mood,
        "genre": genre,
        "movies": [MovieResult(**m) for m in movies_with_posters],
    }


@app.post("/api/recommend/title")
async def recommend_by_title(body: TitleRequest):
    if not recommender.is_loaded:
        raise HTTPException(
            status_code=503,
            detail="Dataset not loaded. Place tmdb_5000_movies.csv in /data",
        )
    try:
        movies = recommender.recommend(body.title)
    except ValueError:
        raise HTTPException(status_code=404, detail="Movie not found in dataset")

    movies_with_posters = await asyncio.gather(*[_add_poster(m) for m in movies])

    return {
        "query": body.title,
        "movies": [MovieResult(**m) for m in movies_with_posters],
    }


@app.get("/api/movies/search")
def search_movies(q: str = "", limit: int = 10):
    if not recommender.is_loaded:
        raise HTTPException(
            status_code=503,
            detail="Dataset not loaded. Place tmdb_5000_movies.csv in /data",
        )
    results = recommender.search(q, limit=limit)
    return {"results": results}
