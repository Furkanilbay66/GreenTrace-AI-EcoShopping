import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Sparkles } from 'lucide-react';

const MOCK_CATALOG = [
  { id: 'cat-1', name: 'Organik Yerel Elma', category: 'Meyve & Sebze', co2_kg: 0.3, grade: 'A+', origin: 'Yerel Çiftlik' },
  { id: 'cat-2', name: 'İthal Muz', category: 'Meyve & Sebze', co2_kg: 0.8, grade: 'B', origin: 'İthal Kargo' },
  { id: 'cat-3', name: 'Tek Kullanımlık Plastik Şişe Su', category: 'Ambalaj & İçecek', co2_kg: 3.2, grade: 'F', origin: 'Sentetik Plastik' },
  { id: 'cat-4', name: 'Organik Yulaf Sütü', category: 'Süt Ürünleri', co2_kg: 0.9, grade: 'A', origin: 'Bitkisel Üretim' },
  { id: 'cat-5', name: 'Taze Dana Bonfile Steak', category: 'Et Ürünleri', co2_kg: 14.5, grade: 'F', origin: 'Büyükbaş Hayvancılık' },
  { id: 'cat-6', name: 'Cam Şişe Maden Suyu', category: 'Ambalaj & İçecek', co2_kg: 1.1, grade: 'B', origin: 'Geri Dönüştürülebilir' },
];

export default function CatalogShowcase({ onAddItem }) {
  const [addedIds, setAddedIds] = useState({});

  const handleAddClick = (item) => {
    onAddItem({ ...item, id: `catalog-${Date.now()}-${item.id}`, quantity: 1 });
    
    // Animate temporary checkmark state
    setAddedIds(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  return (
    <div className="glass-card p-6 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Hızlı Ürün Kataloğu</h3>
          <p className="text-xs text-slate-500 font-medium">Tek Tıkla Sepete Ekle & Karbon Etkisini Gör</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-eco-100 text-eco-800 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-eco-600" /> Örnek Ürünler
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {MOCK_CATALOG.map((item) => {
          const isHighEmission = item.co2_kg > 3.0;
          const isAdded = addedIds[item.id];
          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-3.5 rounded-2xl bg-white/70 border border-white/90 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    {item.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    item.grade === 'A+' || item.grade === 'A'
                      ? 'bg-eco-500 text-white'
                      : item.grade === 'B' || item.grade === 'C'
                      ? 'bg-amber-500 text-white'
                      : 'bg-rose-500 text-white'
                  }`}>
                    {item.grade}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-xs line-clamp-1">
                  {item.name}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Kaynak: {item.origin}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className={`font-extrabold text-xs ${isHighEmission ? 'text-rose-600' : 'text-eco-700'}`}>
                  {item.co2_kg} kg CO₂
                </span>

                <motion.button
                  onClick={() => handleAddClick(item)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-xs cursor-pointer ${
                    isAdded
                      ? 'bg-eco-500 text-white shadow-glow-green'
                      : 'bg-slate-900 hover:bg-eco-600 text-white'
                  }`}
                >
                  {isAdded ? (
                    <AnimatePresence mode="wait">
                      <motion.span
                        key="added"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5 text-white animate-bounce" /> Eklendi!
                      </motion.span>
                    </AnimatePresence>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" /> Ekle
                    </span>
                  )}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
