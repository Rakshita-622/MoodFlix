import React, { useState, useRef, useEffect, useCallback } from 'react';
import MovieCarousel from './MovieCarousel';
import MovieCard, { getPosterUrl } from './MovieCard';
import LoadingScreen from './LoadingScreen';
import { useRecommendations } from '../hooks/useRecommendations';
import type { SearchResult } from '../types/movie';
import { Search } from 'lucide-react';

const SearchBar: React.FC = () => {
  const { movies, loading, error, meta, recommendByTitle, searchMovies } =
    useRecommendations();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounced autocomplete
  const handleInputChange = useCallback(
    (value: string) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!value.trim()) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }
      debounceRef.current = setTimeout(async () => {
        const results = await searchMovies(value, 8);
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      }, 300);
    },
    [searchMovies]
  );

  const handleSelect = (title: string) => {
    setQuery(title);
    setShowDropdown(false);
    setSuggestions([]);
    recommendByTitle(title);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      recommendByTitle(query.trim());
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Pre-process movies generic data if needed (fallbacks)
  const carouselMovies = movies.map((m) => ({
    ...m,
    poster_url: m.poster_url || getPosterUrl(m.title, m.genres),
  }));

  return (
    <section id="search-section" className="relative py-20 px-6 md:px-12 bg-yellow">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.08,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-black mb-3">
            Search by Title
          </h2>
          <p className="font-body text-lg text-black/60 max-w-md mx-auto">
            Know a movie you love? We'll find up to 30 similar films using cosine similarity.
          </p>
        </div>

        {/* Search input */}
        <div ref={wrapperRef} className="relative max-w-xl mx-auto mb-12">
          <form onSubmit={handleSubmit} className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
              <input
                id="search-input"
                type="text"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Search a movie you loved..."
                className="w-full pl-12 pr-4 py-4 font-body text-base bg-white text-black placeholder:text-black/40 outline-none"
                style={{
                  border: '2px solid #000',
                  borderRadius: 0,
                }}
                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-4 font-display font-bold text-white bg-black border-2 border-black cursor-pointer hover:bg-charcoal transition-colors"
            >
              Find
            </button>
          </form>

          {/* Dropdown */}
          {showDropdown && (
            <div
              className="absolute z-20 w-full bg-white border-2 border-t-0 border-black max-h-64 overflow-y-auto"
              style={{ boxShadow: '4px 4px 0px 0px #000' }}
            >
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelect(s.title)}
                  className="w-full text-left px-4 py-3 font-body text-sm hover:bg-yellow/30 border-b border-black/10 transition-colors cursor-pointer"
                >
                  {s.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <LoadingScreen visible={loading} />

        {error && (
          <div
            className="max-w-md mx-auto p-6 text-center font-body"
            style={{
              border: '2px solid #000',
              borderRadius: '12px',
              backgroundColor: '#b7c6c2',
            }}
          >
            <p className="font-bold text-black mb-1">Movie not found</p>
            <p className="text-black/70 text-sm">Try a different title</p>
          </div>
        )}

        {!loading && !error && movies.length > 0 && (
          <div className="mt-8">
            <p className="font-body text-sm text-black/50 mb-6 text-center">
              Movies similar to <strong>"{meta.query}"</strong>
            </p>
            <MovieCarousel movies={carouselMovies} />
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchBar;
