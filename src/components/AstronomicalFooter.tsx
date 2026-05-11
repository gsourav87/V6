import { useEffect, useState } from "react";

export function AstronomicalFooter() {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random stars
    const generatedStars = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60,
      delay: Math.random() * 3,
    }));
    setStars(generatedStars);
  }, []);

  const zodiacSigns = [
    { name: "মেষ", symbol: "♈" },
    { name: "বৃষ", symbol: "♉" },
    { name: "মিথুন", symbol: "♊" },
    { name: "কর্ক", symbol: "♋" },
    { name: "সিংহ", symbol: "♌" },
    { name: "কন্যা", symbol: "♍" },
    { name: "তুলা", symbol: "♎" },
    { name: "বৃশ্চিক", symbol: "♏" },
    { name: "ধনু", symbol: "♐" },
    { name: "মকর", symbol: "♑" },
    { name: "কুম্ভ", symbol: "♒" },
    { name: "মীন", symbol: "♓" },
  ];

  return (
    <footer className="relative mt-20 bg-gradient-to-b from-slate-900 via-slate-800 to-black overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${3 + Math.random() * 2}s ease-in-out ${star.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
        {/* Zodiac wheel SVG */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full drop-shadow-lg"
              style={{ filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))" }}
            >
              {/* Outer circle */}
              <circle cx="100" cy="100" r="95" fill="none" stroke="#1e40af" strokeWidth="2" opacity="0.6" />

              {/* Inner circle */}
              <circle cx="100" cy="100" r="70" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.4" />

              {/* Center circle */}
              <circle cx="100" cy="100" r="15" fill="#3b82f6" opacity="0.8" />
              <circle cx="100" cy="100" r="8" fill="#60a5fa" />

              {/* Zodiac lines and divisions */}
              {zodiacSigns.map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const x1 = 100 + 95 * Math.cos(angle);
                const y1 = 100 + 95 * Math.sin(angle);
                const x2 = 100 + 70 * Math.cos(angle);
                const y2 = 100 + 70 * Math.sin(angle);
                return (
                  <line
                    key={`line-${i}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#93c5fd"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                );
              })}

              {/* Zodiac symbols */}
              {zodiacSigns.map((sign, i) => {
                const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
                const x = 100 + 82 * Math.cos(angle);
                const y = 100 + 82 * Math.sin(angle);
                return (
                  <g key={`zodiac-${i}`}>
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="14"
                      fill="#93c5fd"
                      fontWeight="bold"
                      className="hover:fill-yellow-300 transition-colors duration-300"
                      style={{ cursor: "pointer" }}
                    >
                      {sign.symbol}
                    </text>
                  </g>
                );
              })}

              {/* Rotating animation lines */}
              <g style={{ animation: "rotate 20s linear infinite" }}>
                <line x1="100" y1="100" x2="100" y2="20" stroke="#60a5fa" strokeWidth="1.5" opacity="0.6" />
                <circle cx="100" cy="20" r="3" fill="#fbbf24" opacity="0.8" />
              </g>

              <g style={{ animation: "rotate 30s linear infinite reverse" }}>
                <line x1="100" y1="100" x2="100" y2="25" stroke="#a78bfa" strokeWidth="1" opacity="0.4" />
              </g>
            </svg>
          </div>
        </div>

        {/* Bengali Quote */}
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-2xl sm:text-3xl font-bengali font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 mb-3">
            সময়ই অর্থ, সময়ই জীবন
          </p>
          <p className="text-xs sm:text-sm text-blue-200/70 font-bengali italic">
            "সময় হল জীবনের মূল্যবান সম্পদ"
          </p>
        </div>

        {/* Poetic verse */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12 text-center">
          <div className="bg-slate-700/30 backdrop-blur-sm border border-blue-400/30 rounded-lg p-6 sm:p-8 hover:border-blue-300/60 transition-all duration-300">
            <p className="text-sm sm:text-base text-blue-100/80 font-bengali leading-relaxed mb-3">
              "তারকা ভরা আকাশের মতো, প্রতিটি মুহূর্ত একটি উজ্জ্বল আলোকবিন্দু।"
            </p>
            <p className="text-xs sm:text-sm text-blue-200/60 font-bengali italic">
              — বাংলা জ্যোতিষ ঐতিহ্য
            </p>
          </div>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="text-center p-4 bg-slate-700/20 rounded-lg border border-blue-400/20 hover:border-blue-300/40 transition-all">
            <p className="text-xl sm:text-2xl font-bold text-blue-300">১২</p>
            <p className="text-xs sm:text-sm text-blue-200/70 font-bengali mt-1">রাশি</p>
          </div>

          <div className="text-center p-4 bg-slate-700/20 rounded-lg border border-blue-400/20 hover:border-blue-300/40 transition-all">
            <p className="text-xl sm:text-2xl font-bold text-cyan-300">২৪</p>
            <p className="text-xs sm:text-sm text-blue-200/70 font-bengali mt-1">ঘণ্টা</p>
          </div>

          <div className="text-center p-4 bg-slate-700/20 rounded-lg border border-blue-400/20 hover:border-blue-300/40 transition-all">
            <p className="text-xl sm:text-2xl font-bold text-amber-300">∞</p>
            <p className="text-xs sm:text-sm text-blue-200/70 font-bengali mt-1">সম্ভাবনা</p>
          </div>
        </div>

        {/* Footer divider */}
        <div className="flex items-center justify-center mb-6 sm:mb-8">
          <div className="h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent flex-1" />
          <span className="px-4 text-blue-400/60 text-xs">🌙 ✦ 🌟 ✦ 🌙</span>
          <div className="h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent flex-1" />
        </div>

        {/* Bottom text */}
        <div className="text-center">
          <p className="text-xs sm:text-sm text-blue-200/60 font-bengali">
            সঠিক বাংলা ক্যালেন্ডার — আপনার সময়ের সঙ্গী
          </p>
          <p className="text-xs text-blue-300/50 mt-2">
            ✨ Built with astronomy & Bengali tradition ✨
          </p>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
            transform-origin: 100px 100px;
          }
          to {
            transform: rotate(360deg);
            transform-origin: 100px 100px;
          }
        }
      `}</style>
    </footer>
  );
}
