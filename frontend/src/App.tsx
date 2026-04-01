import React from 'react';
import Navbar from './components/Navbar';
import MoodSelector from './components/MoodSelector';
import SearchBar from './components/SearchBar';

/* ─── Hero Section ─── */
const HeroSection: React.FC = () => (
  <section className="relative bg-yellow pt-32 pb-20 px-6 md:px-12 overflow-hidden">
    {/* Dot pattern */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        opacity: 0.08,
      }}
    />

    <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      {/* Left — Copy */}
      <div>
        <span
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-display font-bold bg-white text-black"
          style={{ border: '2px solid #000', borderRadius: '999px' }}
        >
          🎬 ML-Powered · TMDB Dataset
        </span>

        <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl text-black leading-[0.95] mb-6">
          Movies that
          <br />
          match your
          <br />
          <span
            style={{
              WebkitTextStroke: '2px black',
              color: 'transparent',
            }}
          >
            mood.
          </span>
        </h1>

        <p className="font-body text-lg md:text-xl text-black/70 max-w-md mb-8 leading-relaxed">
          A cosine similarity engine trained on 5,000 films. Tell us how you feel.
          Get your next watch.
        </p>

        <div className="flex flex-wrap gap-4">
          <a
            href="#mood-section"
            className="inline-block px-8 py-4 font-display font-bold text-white bg-black border-2 border-black cursor-pointer"
            style={{
              borderRadius: '12px',
              boxShadow: '8px 8px 0px 0px #000',
              transition: 'all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(4px, 4px)';
              e.currentTarget.style.boxShadow = '4px 4px 0px 0px #000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = '8px 8px 0px 0px #000';
            }}
          >
            Pick a Mood →
          </a>
          <a
            href="#search-section"
            className="inline-block px-8 py-4 font-display font-bold text-black bg-white border-2 border-black cursor-pointer"
            style={{
              borderRadius: '12px',
              boxShadow: '4px 4px 0px 0px #000',
              transition: 'all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(2px, 2px)';
              e.currentTarget.style.boxShadow = '2px 2px 0px 0px #000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = '4px 4px 0px 0px #000';
            }}
          >
            Search by Title
          </a>
        </div>
      </div>

      {/* Right — Browser Mockup */}
      <div className="hidden md:block">
        <div
          className="bg-white overflow-hidden"
          style={{
            border: '2px solid #000',
            borderRadius: '12px',
            boxShadow: '12px 12px 0px 0px #000',
          }}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-black">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff5f57' }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#febc2e' }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#28c840' }} />
            <span className="ml-3 text-xs text-white/40 font-body">moodflix.app</span>
          </div>
          {/* Content */}
          <div className="p-4 grid grid-cols-2 gap-3">
            {[
              { label: 'Comedy', bg: '#b7c6c2' },
              { label: 'Action', bg: '#171e19' },
              { label: 'Drama', bg: '#171e19' },
              { label: 'Sci-Fi', bg: '#b7c6c2' },
            ].map((card) => (
              <div
                key={card.label}
                className="p-3 rounded-lg"
                style={{ backgroundColor: card.bg }}
              >
                <p
                  className="text-xs font-display font-bold mb-2"
                  style={{ color: card.bg === '#171e19' ? '#b7c6c2' : '#000' }}
                >
                  {card.label}
                </p>
                <svg viewBox="0 0 100 60" className="w-full">
                  {[30, 60, 45, 80, 55, 70].map((h, i) => (
                    <rect
                      key={i}
                      x={i * 16 + 4}
                      y={60 - h}
                      width={12}
                      height={h}
                      fill="#ffe17c"
                      rx={2}
                    />
                  ))}
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Marquee Banner ─── */
const MarqueeBanner: React.FC = () => {
  const text =
    'ACTION ◆ DRAMA ◆ COMEDY ◆ SCI-FI ◆ ROMANCE ◆ HORROR ◆ ADVENTURE ◆ THRILLER ◆ ANIMATION ◆ DOCUMENTARY ◆ ';

  return (
    <div
      className="bg-charcoal py-4 overflow-hidden"
      style={{ borderTop: '2px solid #000', borderBottom: '2px solid #000' }}
    >
      <div className="marquee-track whitespace-nowrap">
        <span className="font-display font-bold text-xl tracking-widest text-sage/60 inline-block">
          {text}
          {text}
        </span>
      </div>
    </div>
  );
};

/* ─── How It Works ─── */
const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Tell us your mood',
      desc: 'Choose from 9 moods — happy, sad, excited, romantic, and more.',
      borderColor: '#b7c6c2',
    },
    {
      num: '02',
      title: 'ML engine scores 5,000 films',
      desc: 'TF-IDF vectorization + cosine similarity ranks every movie by relevance.',
      borderColor: '#ffe17c',
    },
    {
      num: '03',
      title: 'Watch your perfect match',
      desc: 'Get your top 5 recommendations with match scores and overviews.',
      borderColor: '#ffffff',
    },
  ];

  return (
    <section id="how-it-works" className="bg-charcoal py-20 px-6 md:px-12 border-y-2 border-black">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display font-bold text-4xl md:text-5xl text-white text-center mb-16">
          How It Works
        </h2>

        <div className="relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-[48px] left-12 right-12 h-0.5 bg-gray-700 z-0" />
          
          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-charcoal relative z-10"
                  style={{ border: `4px solid ${step.borderColor}` }}
                >
                  <span
                    className="font-display font-bold text-2xl"
                    style={{ color: step.borderColor }}
                  >
                    {step.num}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2">{step.title}</h3>
                <p className="font-body text-sm text-gray-400 leading-relaxed max-w-xs">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── Footer ─── */
const Footer: React.FC = () => (
  <footer className="bg-charcoal py-12 px-6 md:px-12" style={{ borderTop: '2px solid #000' }}>
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-2 font-display font-bold text-lg text-white">
        <span className="text-xl">⚡</span> MoodFlix
      </div>
      <p className="font-body text-sm text-sage/60 text-center">
        Built with TF-IDF + Cosine Similarity · TMDB 5000 Dataset · CSE3231 ML Lab
      </p>
      <div className="flex items-center gap-6">
        <a
          href="https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata"
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-sm text-sage hover:text-yellow transition-colors"
        >
          Dataset ↗
        </a>
        <a
          href="#"
          className="font-body text-sm text-sage hover:text-yellow transition-colors"
        >
          GitHub ↗
        </a>
      </div>
    </div>
  </footer>
);

/* ─── App ─── */
const App: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <HeroSection />
    <MarqueeBanner />
    <MoodSelector />
    <HowItWorks />
    <SearchBar />
    <Footer />
  </div>
);

export default App;
