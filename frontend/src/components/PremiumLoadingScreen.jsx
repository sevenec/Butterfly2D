import React, { useState, useEffect } from 'react';

const PremiumLoadingScreen = ({ onLoadingComplete, duration = 3000 }) => {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  const loadingTips = [
    "Preparing cosmic butterflies...",
    "Loading 15 unique levels...",
    "Calibrating obstacle variety...",
    "Tuning epic soundtrack...",
    "Initializing premium graphics...",
    "Ready for nebula adventure!"
  ];

  useEffect(() => {
    const startTime = Date.now();
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % loadingTips.length);
    }, 500);

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(progressInterval);
        clearInterval(tipInterval);
        
        // Start fade out
        setTimeout(() => {
          setFadeOut(true);
          
          // Complete loading after fade
          setTimeout(() => {
            onLoadingComplete();
          }, 500);
        }, 300);
      }
    }, 50);

    return () => {
      clearInterval(progressInterval);
      clearInterval(tipInterval);
    };
  }, [duration, onLoadingComplete]);

  return (
    <div className={`premium-loading-overlay ${fadeOut ? 'fade-out' : ''}`}>
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Logo */}
      <div className="relative z-10 mb-8">
        <div className="premium-float">
          <div className="w-32 h-32 mx-auto relative">
            {/* Animated Butterfly */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Upper wings */}
                <div 
                  className="premium-butterfly-wing absolute -top-8 -left-10 w-8 h-12 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 rounded-full opacity-90" 
                  style={{
                    boxShadow: '0 0 20px rgba(255, 105, 180, 0.5)',
                    transformOrigin: 'bottom center'
                  }}
                />
                <div 
                  className="premium-butterfly-wing absolute -top-8 -right-10 w-8 h-12 bg-gradient-to-bl from-pink-400 via-purple-500 to-blue-500 rounded-full opacity-90"
                  style={{
                    boxShadow: '0 0 20px rgba(255, 105, 180, 0.5)',
                    transformOrigin: 'bottom center'
                  }}
                />
                {/* Lower wings */}
                <div 
                  className="premium-butterfly-wing absolute -bottom-3 -left-8 w-6 h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-full opacity-80"
                  style={{
                    boxShadow: '0 0 15px rgba(96, 165, 250, 0.5)',
                    transformOrigin: 'top center'
                  }}
                />
                <div 
                  className="premium-butterfly-wing absolute -bottom-3 -right-8 w-6 h-10 bg-gradient-to-bl from-cyan-400 via-blue-500 to-purple-600 rounded-full opacity-80"
                  style={{
                    boxShadow: '0 0 15px rgba(96, 165, 250, 0.5)',
                    transformOrigin: 'top center'
                  }}
                />
                {/* Body */}
                <div className="w-2 h-16 bg-gradient-to-b from-yellow-400 via-orange-500 to-red-500 rounded-full mx-auto" 
                     style={{boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)'}} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-2">
          Butterfly Nebula Brawl
        </h1>
        <p className="text-lg text-gray-300 opacity-80">Premium Cosmic Adventure</p>
      </div>

      {/* Loading Progress */}
      <div className="w-80 max-w-sm mb-6">
        <div className="bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-400 mt-2">
          <span>Loading...</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Loading Tips */}
      <div className="text-center">
        <p className="text-white text-lg font-medium animate-pulse">
          {loadingTips[currentTip]}
        </p>
      </div>

      {/* Enhanced CSS for premium animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        .premium-loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #1e1b4b 0%, #581c87 25%, #be185d 50%, #7c2d12 75%, #1e1b4b 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }
        
        .premium-loading-overlay.fade-out {
          opacity: 0;
          transform: scale(1.05);
        }
        
        .premium-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .premium-butterfly-wing {
          animation: flutter 1.5s ease-in-out infinite;
        }
        
        @keyframes flutter {
          0%, 100% { transform: rotateY(0deg) rotateX(0deg); }
          25% { transform: rotateY(-15deg) rotateX(5deg); }
          50% { transform: rotateY(0deg) rotateX(0deg); }
          75% { transform: rotateY(15deg) rotateX(-5deg); }
        }
      `}</style>
    </div>
  );
};

export default PremiumLoadingScreen;