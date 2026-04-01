import React from 'react';

interface MovieCardProps {
  title: string;
  genres: string;
  overview: string;
  similarity_score: number;
  poster_url: string;
  height: number;
}

const genreToColor = (genres: string): string => {
  if (genres.includes('Action')) return '1a1a2e';
  if (genres.includes('Comedy')) return '2d6a4f';
  if (genres.includes('Drama')) return '4a1942';
  if (genres.includes('Horror')) return '6b2d0f';
  if (genres.includes('Romance')) return '8b2252';
  if (genres.includes('Science')) return '0a3463';
  if (genres.includes('Adventure')) return '1b4332';
  if (genres.includes('Animation')) return '3d348b';
  if (genres.includes('Thriller')) return '2b2d42';
  return '171e19';
};

export const getPosterUrl = (title: string, genres: string): string => {
  const color = genreToColor(genres);
  const label = title.slice(0, 18).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450"><rect width="300" height="450" fill="#${color}"/><text x="150" y="210" text-anchor="middle" fill="#ffe17c" font-family="sans-serif" font-size="20" font-weight="bold">${label}</text><text x="150" y="240" text-anchor="middle" fill="#ffe17c" font-family="sans-serif" font-size="11" opacity="0.6">🎬 MoodFlix</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export const getItemHeight = (title: string): number => {
  const heights = [320, 380, 440, 280, 400];
  return heights[title.charCodeAt(0) % 5];
};

const MovieCard: React.FC<MovieCardProps> = ({
  title,
  genres,
  overview,
  similarity_score,
  poster_url,
  height,
}) => {
  const matchPercent = (similarity_score * 100).toFixed(0);
  const genreList = genres
    .split(' ')
    .filter(Boolean)
    .reduce<string[]>((acc, word) => {
      // Recombine genre names like "Science Fiction"
      if (acc.length > 0 && /^[a-z]/.test(word)) {
        acc[acc.length - 1] += ' ' + word;
      } else {
        acc.push(word);
      }
      return acc;
    }, []);

  return (
    <div
      className="relative w-full overflow-hidden border-2 border-black"
      style={{ height, borderRadius: '12px' }}
    >
      <img
        src={poster_url}
        alt={title}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {/* Always-visible bottom overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
        }}
      >
        <p className="text-white font-display font-bold text-sm leading-tight truncate">
          {title}
        </p>
        <span
          className="inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded"
          style={{ backgroundColor: '#ffe17c', color: '#000' }}
        >
          {matchPercent}% match
        </span>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/85 opacity-0 hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
        <div className="overflow-y-auto scrollbar-hide mb-3 max-h-[220px]">
          <p className="text-white text-[13px] leading-relaxed">
            {overview || "No description available."}
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {genreList.slice(0, 4).map((g) => (
            <span
              key={g}
              className="text-[10px] px-2 py-0.5 rounded"
              style={{ backgroundColor: '#b7c6c2', color: '#000' }}
            >
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
