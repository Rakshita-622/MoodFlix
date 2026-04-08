export interface MovieResult {
  id: number;
  title: string;
  genres: string;
  overview: string;
  similarity_score: number;
  poster_url: string;
  hit_flop_label?: string;
}

export interface MoodRecommendationResponse {
  mood: string;
  genre: string;
  movies: MovieResult[];
}

export interface TitleRecommendationResponse {
  query: string;
  movies: MovieResult[];
}

export interface SearchResult {
  title: string;
  id: number;
}

export interface MasonryItem {
  id: string | number;
  img: string;
  title: string;
  height: number;
  url?: string;
  genres?: string;
  overview?: string;
  similarity_score?: number;
  hit_flop_label?: string;
}
