"""
MoodFlix — Inference Module
Provides recommend() and recommend_by_mood() using pre-trained
TF-IDF cosine-similarity model.
"""

import pickle
import os
import numpy as np
import pandas as pd

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

# ---------------------------------------------------------------------------
# Mood → Genre mapping
# ---------------------------------------------------------------------------
MOOD_GENRE_MAP: dict[str, str] = {
    "sad":       "drama",
    "happy":     "comedy",
    "bored":     "adventure",
    "excited":   "action",
    "romantic":  "romance",
    "scared":    "horror",
    "curious":   "science fiction",
    "anxious":   "thriller",
    "nostalgic": "animation",
}


class MovieRecommender:
    """Wraps the pickled model artifacts for inference."""

    def __init__(self) -> None:
        self.movies: pd.DataFrame | None = None
        self.similarity: np.ndarray | None = None

    # ------------------------------------------------------------------
    def load(self, data_dir: str = DATA_DIR) -> None:
        movies_path = os.path.join(data_dir, "movies.pkl")
        sim_path = os.path.join(data_dir, "similarity.pkl")

        with open(movies_path, "rb") as f:
            self.movies = pickle.load(f)

        with open(sim_path, "rb") as f:
            self.similarity = pickle.load(f)

    # ------------------------------------------------------------------
    @property
    def is_loaded(self) -> bool:
        return self.movies is not None and self.similarity is not None

    @property
    def movie_count(self) -> int:
        return len(self.movies) if self.movies is not None else 0

    # ------------------------------------------------------------------
    def recommend(self, movie_name: str, top_n: int = 30) -> list[dict]:
        """Return top-N similar movies for a given title."""
        if not self.is_loaded:
            raise RuntimeError("Model not loaded")

        # Case-insensitive title lookup
        matches = self.movies[
            self.movies["title"].str.lower() == movie_name.strip().lower()
        ]
        if matches.empty:
            raise ValueError(f"Movie not found in dataset: {movie_name}")

        idx = matches.index[0]
        sim_scores = list(enumerate(self.similarity[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

        # Skip the first entry (the movie itself)
        results: list[dict] = []
        max_score = float(sim_scores[1][1]) if len(sim_scores) > 1 and sim_scores[1][1] > 0 else 1.0
        
        for rank_idx, score in sim_scores[1: top_n + 1]:
            row = self.movies.iloc[rank_idx]
            # Normalize score relative to the best match, maxing at 96% for visual realism
            norm_score = (float(score) / max_score) * 0.96
            results.append({
                "id": int(row.get("id", rank_idx)),
                "title": row["title"],
                "genres": row.get("genres_parsed", ""),
                "overview": str(row.get("overview", "")),
                "similarity_score": round(norm_score, 4),
            })
        return results

    # ------------------------------------------------------------------
    def recommend_by_mood(self, mood: str, top_n: int = 30) -> tuple[str, list[dict]]:
        """Map mood → genre, filter, rank by aggregate similarity."""
        if not self.is_loaded:
            raise RuntimeError("Model not loaded")

        mood_lower = mood.strip().lower()
        if mood_lower not in MOOD_GENRE_MAP:
            raise ValueError(
                f"Unknown mood '{mood}'. Valid moods: {list(MOOD_GENRE_MAP.keys())}"
            )

        genre = MOOD_GENRE_MAP[mood_lower]

        # Filter movies containing the mapped genre in their content
        mask = self.movies["content"].str.lower().str.contains(genre, na=False)
        genre_indices = self.movies[mask].index.tolist()

        if not genre_indices:
            return genre, []

        # For each movie in the filtered set, compute sum of similarity
        # scores to ALL other movies in the filtered set → gives a measure
        # of how "central" it is within the genre cluster.
        scores: list[tuple[int, float]] = []
        for idx in genre_indices:
            total = float(np.sum(self.similarity[idx][genre_indices]))
            scores.append((idx, total))

        scores.sort(key=lambda x: x[1], reverse=True)

        results: list[dict] = []
        for rank_idx, score in scores[:top_n]:
            row = self.movies.iloc[rank_idx]
            # Normalise score to 0-1 range (divide by max)
            max_score = scores[0][1] if scores[0][1] > 0 else 1.0
            results.append({
                "id": int(row.get("id", rank_idx)),
                "title": row["title"],
                "genres": row.get("genres_parsed", ""),
                "overview": str(row.get("overview", "")),
                "similarity_score": round(float(score / max_score), 4),
            })
        return genre, results

    # ------------------------------------------------------------------
    def search(self, query: str, limit: int = 10) -> list[dict]:
        """Fuzzy title search for autocomplete."""
        if not self.is_loaded:
            raise RuntimeError("Model not loaded")

        q = query.strip().lower()
        mask = self.movies["title"].str.lower().str.contains(q, na=False)
        matches = self.movies[mask].head(limit)
        return [
            {"title": row["title"], "id": int(row.get("id", i))}
            for i, row in matches.iterrows()
        ]
