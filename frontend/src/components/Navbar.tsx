import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 h-20 bg-yellow"
      style={{ borderBottom: '2px solid #000' }}
    >
      {/* Logo */}
      <a href="#" className="flex items-center gap-2 font-display font-bold text-xl text-black">
        <span className="text-2xl">⚡</span>
        MoodFlix
      </a>

      {/* Nav Links — hidden on mobile */}
      <div className="hidden md:flex items-center gap-8">
        <a href="#mood-section" className="font-body font-medium text-sm text-black hover:underline underline-offset-4">
          Moods
        </a>
        <a href="#how-it-works" className="font-body font-medium text-sm text-black hover:underline underline-offset-4">
          How It Works
        </a>
        <a href="#search-section" className="font-body font-medium text-sm text-black hover:underline underline-offset-4">
          Search
        </a>
      </div>

      {/* CTA */}
      <a
        href="#mood-section"
        className="hidden sm:inline-block px-5 py-2.5 font-display font-bold text-sm text-white bg-black border-2 border-black cursor-pointer"
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
        Try Now →
      </a>
    </nav>
  );
};

export default Navbar;
