import React, { useRef } from 'react';
import MovieCard from './MovieCard';

interface MovieCarouselProps {
  movies: any[];
  title?: string;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ movies, title }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -800, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 800, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative w-full py-6 group">
      {/* Title */}
      {title && (
        <h3 className="text-2xl font-display font-bold text-black mb-6 px-2">{title}</h3>
      )}

      {/* Constraints and padding for the scrollable area */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-full w-14 bg-gradient-to-r from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center focus:outline-none focus:opacity-100 cursor-pointer"
        >
          <span className="text-white text-5xl leading-none shadow-sm drop-shadow-lg relative -left-1">‹</span>
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 scrollbar-hide px-2 pb-8 pt-4 items-stretch"
          style={{ scrollBehavior: 'smooth', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="flex-none w-[200px] md:w-[240px] transition-transform duration-300 hover:scale-105 hover:-translate-y-2 origin-bottom z-0 hover:z-10"
            >
              <div className="w-full">
                <MovieCard 
                  title={movie.title}
                  genres={movie.genres}
                  overview={movie.overview}
                  similarity_score={movie.similarity_score}
                  poster_url={movie.poster_url || ""}
                  height={360}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-full w-14 bg-gradient-to-l from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center focus:outline-none focus:opacity-100 cursor-pointer"
        >
          <span className="text-white text-5xl leading-none shadow-sm drop-shadow-lg relative -right-1">›</span>
        </button>
      </div>

      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
};

export default MovieCarousel;
