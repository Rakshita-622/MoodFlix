import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import MovieCarousel from './MovieCarousel';
import MovieCard, { getPosterUrl } from './MovieCard';
import LoadingScreen from './LoadingScreen';
import { useRecommendations } from '../hooks/useRecommendations';

const MOOD_MAP: Record<string, string> = {
  happy: '😄',
  sad: '😢',
  excited: '🚀',
  bored: '😐',
  romantic: '💕',
  scared: '😱',
  curious: '🧠',
  anxious: '😰',
  nostalgic: '🌅',
};

const MOODS = Object.keys(MOOD_MAP);

const MoodSelector: React.FC = () => {
  const { movies, loading, error, meta, recommendByMood } = useRecommendations();
  const [selectedMood, setSelectedMood] = React.useState<string | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleSelect = (mood: string, idx: number) => {
    setSelectedMood(mood);
    // GSAP button animation
    const btn = buttonRefs.current[idx];
    if (btn) {
      gsap.fromTo(btn, { scale: 0.9 }, { scale: 1, duration: 0.3, ease: 'back.out(1.7)' });
    }
    recommendByMood(mood);
  };

  // Pre-process movies generic data if needed (fallbacks)
  const carouselMovies = movies.map((m) => ({
    ...m,
    poster_url: m.poster_url || getPosterUrl(m.title, m.genres),
  }));

  return (
    <section id="mood-section" className="relative py-20 px-6 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <span
            className="inline-block px-4 py-1.5 mb-4 text-sm font-display font-bold border-2 border-black bg-yellow"
            style={{ borderRadius: '999px' }}
          >
            🎭 Mood Engine
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-black mb-3">
            How are you feeling?
          </h2>
          <p className="font-body text-lg text-black/60 max-w-md mx-auto">
            Pick a mood and our ML model will find your perfect movie match.
          </p>
        </div>

        {/* Mood grid */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-12">
          {MOODS.map((mood, idx) => {
            const isSelected = selectedMood === mood;
            return (
              <button
                key={mood}
                ref={(el) => {
                  buttonRefs.current[idx] = el;
                }}
                id={`mood-btn-${mood}`}
                onClick={() => handleSelect(mood, idx)}
                className="flex flex-col items-center gap-1 py-4 px-2 font-display font-bold text-sm transition-all duration-150 cursor-pointer"
                style={{
                  border: isSelected ? '2px solid #000' : '2px dashed #000',
                  borderRadius: '12px',
                  backgroundColor: isSelected ? '#ffe17c' : '#fff',
                  boxShadow: isSelected ? '8px 8px 0px 0px #000' : 'none',
                  transform: isSelected ? 'translate(-2px, -2px)' : 'none',
                }}
              >
                <span className="text-2xl">{MOOD_MAP[mood]}</span>
                <span className="capitalize">{mood}</span>
              </button>
            );
          })}
        </div>

        {/* Results area */}
        <LoadingScreen visible={loading} />

        {error && (
          <div
            className="max-w-md mx-auto p-6 text-center font-body"
            style={{
              border: '2px dashed #000',
              borderRadius: '12px',
              backgroundColor: '#ffe17c',
            }}
          >
            <p className="font-bold text-black mb-2">⚠️ Oops!</p>
            <p className="text-black/70 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && movies.length > 0 && (
          <div className="mt-8">
            <p className="font-body text-sm text-black/50 mb-6 text-center">
              Showing <strong>{meta.genre}</strong> movies for your{' '}
              <strong>{meta.mood}</strong> mood
            </p>
            <MovieCarousel movies={carouselMovies} />
          </div>
        )}
      </div>
    </section>
  );
};

export default MoodSelector;
