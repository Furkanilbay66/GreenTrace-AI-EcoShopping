import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, Heart, Award, RefreshCw, X, Hand } from 'lucide-react';
import confetti from 'canvas-confetti';

const ECO_TIPS = [
  "💡 Biliyor muşunuz? Tek bir çelik termos kullanmak yılda 1000+ plastik şişe atığını engeller!",
  "🌱 Yerel üreticilerden meyve almak kargo nakliye salınımını %70 azaltır.",
  "🥩 Haftada 1 gün etsiz beslenmek aylık karbon bütçenize 15 kg CO₂ tasarruf sağlar!",
  "🚲 Market alışverişine bez çanta ile gitmek iklim dostu yeşil rozet kazandırır.",
  "⚡ Cam ambalajlar sonsuz kez %100 oranında geri dönüştürülebilir!"
];

export default function EcoMascot() {
  const [tipIndex, setTipIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(true);
  const [heartsCount, setHeartsCount] = useState(0);

  const handleMascotClick = () => {
    // Fire mini confetti burst
    try {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { x: 0.15, y: 0.85 },
        colors: ['#22c55e', '#84cc16', '#a3e635']
      });
    } catch (e) {}

    // Next tip
    setTipIndex((prev) => (prev + 1) % ECO_TIPS.length);
    setHeartsCount((prev) => prev + 1);
    setShowBubble(true);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 400, top: -400, bottom: 0 }}
      dragElastic={0.2}
      whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
      className="fixed bottom-6 left-6 z-50 flex items-end gap-3 cursor-grab select-none group"
    >
      {/* Speech Bubble Tooltip */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="glass-card p-3.5 max-w-xs shadow-2xl border border-white/90 bg-white/90 text-slate-800 text-xs font-semibold relative mb-2"
          >
            <button
              onClick={(e) => { e.stopPropagation(); setShowBubble(false); }}
              className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 text-[10px]"
            >
              <X className="w-3 h-3" />
            </button>

            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-eco-600 flex-shrink-0 mt-0.5 animate-spin" />
              <p className="leading-tight">{ECO_TIPS[tipIndex]}</p>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1 text-eco-700 font-bold">
                <Hand className="w-3 h-3" /> Sürükleyip Taşıyabilirsin!
              </span>
              <span className="flex items-center gap-0.5 text-rose-500 font-extrabold">
                <Heart className="w-3 h-3 fill-rose-500" /> {heartsCount}
              </span>
            </div>

            {/* Bubble Tail Arrow */}
            <div className="absolute -bottom-2 left-6 w-3 h-3 bg-white/90 border-r border-b border-slate-200/80 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Mascot Character Avatar */}
      <motion.div
        onClick={handleMascotClick}
        whileHover={{ scale: 1.15, rotate: [0, -8, 8, 0] }}
        whileTap={{ scale: 0.9 }}
        className="relative w-14 h-14 rounded-3xl bg-gradient-to-tr from-eco-600 via-eco-500 to-lime-400 text-white flex items-center justify-center shadow-glow-green border-2 border-white cursor-pointer"
        title="Bana tıkla veya sürükle!"
      >
        <div className="text-2xl animate-bounce">🌱</div>
        
        {/* Pulsing Aura Badge */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-eco-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-eco-500 border border-white"></span>
        </span>
      </motion.div>
    </motion.div>
  );
}
