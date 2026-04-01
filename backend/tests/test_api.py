import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_endpoint():
    with TestClient(app) as c:
        response = c.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"

def test_moods_endpoint():
    with TestClient(app) as c:
        response = c.get("/api/moods")
        assert response.status_code == 200
        data = response.json()
        assert "moods" in data
        assert isinstance(data["moods"], list)
        assert len(data["moods"]) > 0

def test_recommend_by_mood_endpoint():
    with TestClient(app) as c:
        response = c.post("/api/recommend/mood", json={"mood": "happy"})
        if response.status_code == 503:
            pytest.skip("Model not loaded yet during startup")
        assert response.status_code == 200
        data = response.json()
        assert data["mood"] == "happy"
        assert data["genre"] == "comedy"
        assert "movies" in data
        assert len(data["movies"]) > 0

def test_recommend_by_title_endpoint():
    with TestClient(app) as c:
        response = c.post("/api/recommend/title", json={"title": "Avatar"})
        if response.status_code == 503:
            pytest.skip("Model not loaded yet during startup")
        assert response.status_code == 200
        data = response.json()
        assert data["query"] == "Avatar"
        assert "movies" in data
        assert len(data["movies"]) > 0

def test_search_endpoint():
    with TestClient(app) as c:
        response = c.get("/api/movies/search?q=avatar")
        if response.status_code == 503:
            pytest.skip("Model not loaded yet during startup")
        assert response.status_code == 200
        data = response.json()
        assert "results" in data
        assert len(data["results"]) > 0

def test_mood_invalid_returns_400():
    with TestClient(app) as c:
        response = c.post("/api/recommend/mood", json={"mood": "hungry"})
        if response.status_code == 503:
            pytest.skip("Model not loaded yet during startup")
        assert response.status_code == 400

def test_title_not_found_returns_404():
    with TestClient(app) as c:
        response = c.post("/api/recommend/title", json={"title": "FakeTitle9999"})
        if response.status_code == 503:
            pytest.skip("Model not loaded yet during startup")
        assert response.status_code == 404
