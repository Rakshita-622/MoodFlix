# ⚡ MoodFlix — Mood-Based Movie Recommendation System

> A full-stack, ML-powered movie recommendation web app that matches your mood to movies using TF-IDF vectorization and cosine similarity, trained on the TMDB 5000 dataset.

![Neo-Brutalist Design](https://via.placeholder.com/800x400/ffe17c/000000?text=MoodFlix)

---

## 🎯 Project Description

**MoodFlix** uses Natural Language Processing (NLP) techniques to recommend movies based on either:

1. **Your mood** — maps mood → genre → ranks by aggregate similarity
2. **A movie title** — finds the 5 most similar movies using cosine similarity

### ML Method

- **TF-IDF Vectorizer** (scikit-learn) — converts movie overviews + genres into numerical feature vectors
- **Cosine Similarity** — computes pairwise similarity across all 5,000 movies
- **Mood-Genre Mapping** — 9 moods mapped to genres, ranked by centrality within genre clusters

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                  Browser (React)                │
│  ┌──────────┐  ┌───────────┐  ┌──────────────┐ │
│  │MoodSelect│  │ SearchBar │  │MasonryGallery│ │
│  └────┬─────┘  └─────┬─────┘  └──────────────┘ │
│       │               │                         │
│       └───────┬───────┘                         │
│               │ HTTP (fetch)                    │
├───────────────┼─────────────────────────────────┤
│               ▼                                 │
│         FastAPI (Python)                        │
│  ┌─────────────────────────┐                    │
│  │ /api/recommend/mood     │                    │
│  │ /api/recommend/title    │                    │
│  │ /api/movies/search      │                    │
│  └──────────┬──────────────┘                    │
│             │                                   │
│  ┌──────────▼──────────────┐                    │
│  │ Predictor               │                    │
│  │ ├─ movies.pkl (DataFrame)│                   │
│  │ └─ similarity.pkl (matrix)│                  │
│  └─────────────────────────┘                    │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Setup

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **Docker** + **Docker Compose** (optional, for containerized deployment)

### Dataset

1. Download `tmdb_5000_movies.csv` from [Kaggle TMDB Dataset](https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata)
2. Place it in `backend/data/tmdb_5000_movies.csv`

### Local Development (without Docker)

```bash
# 1. Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python model/train.py          # Train the model
uvicorn main:app --reload      # Start API at localhost:8000

# 2. Frontend (new terminal)
cd frontend
npm install
npm run dev                    # Start at localhost:5173
```

### Docker Compose (recommended)

```bash
# Place tmdb_5000_movies.csv in backend/data/ first
docker-compose up --build
# Backend: http://localhost:8000
# Frontend: http://localhost:5173
```

---

## 📡 API Endpoints

| Method | Endpoint               | Body / Params                      | Response                                    |
|--------|------------------------|------------------------------------|---------------------------------------------|
| GET    | `/health`              | —                                  | `{ status, movies_loaded }`                 |
| GET    | `/api/moods`           | —                                  | `{ moods: string[] }`                       |
| POST   | `/api/recommend/mood`  | `{ "mood": "happy" }`             | `{ mood, genre, movies: MovieResult[] }`    |
| POST   | `/api/recommend/title` | `{ "title": "Avatar" }`           | `{ query, movies: MovieResult[] }`          |
| GET    | `/api/movies/search`   | `?q=avatar&limit=10`              | `{ results: [{ title, id }] }`             |

### MovieResult Schema

```json
{
  "id": 19995,
  "title": "Avatar",
  "genres": "Action Adventure Fantasy",
  "overview": "In the 22nd century...",
  "similarity_score": 0.8234,
  "poster_url": "https://via.placeholder.com/..."
}
```

---

## 📚 ML Context

This project extends the coursework from **CSE3231 — Machine Learning Lab** at **Manipal University Jaipur**:

- **CO4 (Regression/Similarity Models)** — Uses cosine similarity as a distance metric to rank movie relevance
- **CO5 (NLP)** — Applies TF-IDF vectorization to transform text (overviews + genres) into numerical representations
- The core recommendation logic is adapted from the `movie_rec_system.py` lab notebook

---

## 🔮 Extending the Model

Ideas for future improvement:

1. **BERT Embeddings** — Replace TF-IDF with sentence-transformers for semantic understanding
2. **Collaborative Filtering** — Add user-user or item-item collaborative filtering using rating data
3. **TMDB API Integration** — Fetch real poster images and metadata via the TMDB API
4. **Hybrid Model** — Combine content-based (TF-IDF) with collaborative filtering
5. **User Feedback Loop** — Let users rate recommendations to fine-tune results

---

## 🛠️ Tech Stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| Frontend   | React 18 + TypeScript + Vite + Tailwind CSS + GSAP |
| Backend    | Python 3.11 + FastAPI + Uvicorn                     |
| ML         | scikit-learn (TfidfVectorizer, cosine_similarity)   |
| Data       | pandas + pickle                                     |
| Deployment | Docker + Docker Compose                             |

---

## 📄 License

MIT — Built for educational purposes as part of CSE3231 ML Lab.
