import React from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Flame, Activity, TrendingDown, Award } from 'lucide-react';

export default function CarbonGauge({ totalCo2 = 0.0, maxLimit = 35.0 }) {
  // Clamp value between 0 and maxLimit
  const clampedVal = Math.min(Math.max(totalCo2, 0), maxLimit);
  const percentage = Math.min(Math.round((clampedVal / maxLimit) * 100), 100);

  // Framer Motion spring physics for dynamic fluid needle rotation
  // Angle spans from -90 degrees (green) to +90 degrees (red)
  const springAngle = useSpring(0, { stiffness: 60, damping: 15 });

  React.useEffect(() => {
    const targetAngle = -90 + (percentage / 100) * 180;
    springAngle.set(targetAngle);
  }, [percentage, springAngle]);

  // Color dynamic interpolation based on total CO2
  const getMeterColor = (val) => {
    if (val < 5.0) return { hex: '#22c55e', text: 'text-eco-600', bg: 'bg-eco-500', label: 'Mükemmel Eko Düzey' };
    if (val < 12.0) return { hex: '#84cc16', text: 'text-lime-600', bg: 'bg-lime-500', label: 'Düşük Karbon Salınımı' };
    if (val < 22.0) return { hex: '#eab308', text: 'text-yellow-600', bg: 'bg-yellow-500', label: 'Orta Seviye Salınım' };
    return { hex: '#ef4444', text: 'text-rose-600', bg: 'bg-rose-500', label: 'Yüksek Karbon Salınımı!' };
  };

  const status = getMeterColor(totalCo2);

  return (
    <div className="glass-card p-6 flex flex-col items-center justify-between relative overflow-hidden h-full">
      {/* Background Ambient Glow */}
      <div 
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-20 transition-all duration-700"
        style={{ backgroundColor: status.hex }}
      />

      {/* Header */}
      <div className="w-full flex items-center justify-between mb-2 z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-eco-100 text-eco-700">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">Karbon Ayak İzi Metresi</h3>
            <p className="text-xs text-slate-500 font-medium">Anlık Sepet Salınım Sayacı</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.bg} text-white shadow-sm transition-colors duration-500`}>
          {status.label}
        </span>
      </div>

      {/* Semi-Circular SVG Gauge Arc */}
      <div className="relative w-64 h-36 flex items-center justify-center mt-2 mb-1 z-10">
        <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="40%" stopColor="#84cc16" />
              <stop offset="70%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Arc Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Active Gradient Arc Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (percentage / 100) * 251.2}
            filter="url(#glow)"
            className="transition-all duration-700 ease-out"
          />

          {/* Tick Markers */}
          <circle cx="20" cy="100" r="3" fill="#22c55e" />
          <circle cx="100" cy="20" r="3" fill="#eab308" />
          <circle cx="180" cy="100" r="3" fill="#ef4444" />

          {/* Needle Rotation Center Group */}
          <g transform="translate(100, 100)">
            <motion.g style={{ rotate: springAngle }}>
              {/* Pointer Needle */}
              <polygon points="-4,0 0,-72 4,0" fill="#0f172a" />
              <circle cx="0" cy="-72" r="3" fill={status.hex} />
            </motion.g>
            {/* Needle Pivot Cap */}
            <circle cx="0" cy="0" r="9" fill="#0f172a" stroke="#ffffff" strokeWidth="3" />
          </g>
        </svg>

        {/* Dynamic Numerical CO2 Value */}
        <div className="absolute bottom-0 text-center transform translate-y-1">
          <motion.div 
            key={totalCo2}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-baseline justify-center gap-1"
          >
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">
              {totalCo2.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">kg CO₂e</span>
          </motion.div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="w-full grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/60 z-10 text-xs">
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/60">
          <Award className="w-4 h-4 text-eco-600 flex-shrink-0" />
          <div>
            <span className="text-slate-400 block text-[10px]">Hedef Sınır:</span>
            <span className="font-semibold text-slate-700">{maxLimit} kg CO₂</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/60">
          <Flame className={`w-4 h-4 ${status.text} flex-shrink-0`} />
          <div>
            <span className="text-slate-400 block text-[10px]">Kapasite Kullanımı:</span>
            <span className={`font-bold ${status.text}`}>%{percentage}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
