import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Leaf, Sparkles, ShieldCheck, LayoutDashboard, ShoppingCart, RefreshCw } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, cartCount, totalCo2, overallGrade, onOpenCart, onCloseCart }) {
  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+': return 'bg-emerald-500 text-white shadow-emerald-200';
      case 'A': return 'bg-eco-500 text-white shadow-eco-200';
      case 'B': return 'bg-lime-500 text-white shadow-lime-200';
      case 'C': return 'bg-yellow-500 text-white shadow-yellow-200';
      case 'D': return 'bg-orange-500 text-white shadow-orange-200';
      default: return 'bg-rose-500 text-white shadow-rose-200';
    }
  };

  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'market', label: 'Akıllı Market & Sepet', icon: ShoppingCart },
    { id: 'ecoswap', label: 'Eko-Değişim & Öneriler', icon: RefreshCw },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onCloseCart) {
      onCloseCart();
    }
  };

  return (
    <header className="sticky top-4 z-[60] px-4 md:px-8 max-w-7xl mx-auto mb-6">
      <nav className="glass-card px-4 md:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-glass border border-white/80">
        
        {/* Brand Logo */}
        <motion.div 
          onClick={() => handleTabClick('dashboard')}
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-eco-600 to-eco-400 text-white shadow-glow-green">
            <Leaf className="w-5 h-5 animate-pulse" />
            <motion.div 
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-eco-accent border-2 border-white"
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-eco-900 to-eco-700 bg-clip-text text-transparent">
                GreenTrace
              </h1>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-eco-100 text-eco-800 border border-eco-200">
                <Sparkles className="w-2.5 h-2.5 text-eco-600" /> AI Vision
              </span>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation Switcher Bar */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100/80 border border-slate-200/60 shadow-inner w-full md:w-auto overflow-x-auto">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer z-10 ${
                  isActive
                    ? 'text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="absolute inset-0 bg-white rounded-xl shadow-xs -z-10"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
                <span className="flex items-center gap-1.5 pointer-events-none">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-eco-600' : 'text-slate-400'}`} />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Action Badges & Cart Button */}
        <div className="flex items-center gap-2.5">
          {/* Quick Grade Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-white/80 text-xs font-semibold text-slate-700 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-eco-600" />
            <span className={`px-2 py-0.5 rounded-full font-bold text-xs shadow-sm ${getGradeColor(overallGrade)}`}>
              {overallGrade}
            </span>
          </div>

          {/* Quick CO2 Summary Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-slate-200/60 text-xs font-semibold text-slate-700 shadow-sm">
            <span className="text-slate-400">Sepet:</span>
            <span className="font-bold text-slate-900 text-xs">{totalCo2} <span className="text-[10px] text-slate-500 font-normal">kg CO₂</span></span>
          </div>

          {/* Cart Drawer Trigger Button */}
          <motion.button
            onClick={onOpenCart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
            aria-label="Sepeti Aç"
          >
            <ShoppingBag className="w-4 h-4 text-eco-300" />
            <span className="font-semibold text-xs hidden sm:inline">Sepetim</span>

            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={cartCount}
                className="flex items-center justify-center min-w-[20px] h-[20px] px-1 rounded-full bg-eco-500 text-white text-[11px] font-bold shadow-glow-green"
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </nav>
    </header>
  );
}
