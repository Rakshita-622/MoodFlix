import { useState, useCallback } from 'react';
import type {
  MovieResult,
  MoodRecommendationResponse,
  TitleRecommendationResponse,
  SearchResult,
} from '../types/movie';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export function useRecommendations() {
  const [movies, setMovies] = useState<MovieResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ mood?: string; genre?: string; query?: string }>({});

  const recommendByMood = useCallback(async (mood: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/recommend/mood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || `Error ${res.status}`);
      }
      const data: MoodRecommendationResponse = await res.json();
      setMovies(data.movies);
      setMeta({ mood: data.mood, genre: data.genre });
    } catch (err: any) {
      setError(err.message ?? 'Network error');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const recommendByTitle = useCallback(async (title: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/recommend/title`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || `Error ${res.status}`);
      }
      const data: TitleRecommendationResponse = await res.json();
      setMovies(data.movies);
      setMeta({ query: data.query });
    } catch (err: any) {
      setError(err.message ?? 'Network error');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchMovies = useCallback(
    async (q: string, limit = 10): Promise<SearchResult[]> => {
      if (!q.trim()) return [];
      try {
        const res = await fetch(
          `${API_BASE}/api/movies/search?q=${encodeURIComponent(q)}&limit=${limit}`
        );
        if (!res.ok) return [];
        const data = await res.json();
        return data.results ?? [];
      } catch {
        return [];
      }
    },
    []
  );

  return { movies, loading, error, meta, recommendByMood, recommendByTitle, searchMovies };
}
