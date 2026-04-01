import React from 'react';

interface LoadingScreenProps {
  visible: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="relative w-full py-16 flex flex-col items-center justify-center">
      <div className="relative z-10 flex flex-col items-center gap-8">
        <h2 className="font-display font-bold text-4xl text-black tracking-tight">
          Finding your vibe...
        </h2>

        <div className="flex gap-3">
          <div className="loader-sq w-5 h-5 bg-black" style={{ animationDelay: '0s' }} />
          <div className="loader-sq w-5 h-5 bg-black" style={{ animationDelay: '0.15s' }} />
          <div className="loader-sq w-5 h-5 bg-black" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
