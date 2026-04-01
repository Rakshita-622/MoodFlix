import pytest
import os
from model.predictor import MovieRecommender

# Fixture to load model once for all predictor tests
@pytest.fixture(scope="module")
def recommender():
    rec = MovieRecommender()
    rec.load()
    return rec

def test_load_model(recommender):
    assert recommender.is_loaded
    assert recommender.movie_count > 0

def test_recommend_by_title_returns_results(recommender):
    movies = recommender.recommend("Avatar")
    assert len(movies) == 5
    for m in movies:
        assert "id" in m
        assert "title" in m
        assert "similarity_score" in m

def test_recommend_by_mood_valid(recommender):
    genre, movies = recommender.recommend_by_mood("happy")
    assert genre == "comedy"
    assert len(movies) > 0
    assert len(movies) <= 5

def test_recommend_invalid_movie(recommender):
    with pytest.raises(ValueError, match="Movie not found"):
        recommender.recommend("NonExistentMovieThatNobodyWatched999")

def test_recommend_invalid_mood(recommender):
    with pytest.raises(ValueError, match="Unknown mood"):
        recommender.recommend_by_mood("hungry")

def test_search(recommender):
    results = recommender.search("avata", limit=5)
    assert len(results) > 0
    assert any("avatar" in r["title"].lower() for r in results)
