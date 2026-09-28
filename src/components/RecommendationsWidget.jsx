import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, TrendingDown, Check, Sparkles, ArrowRight, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RecommendationsWidget({ cartItems = [], onSwapItem, apiBaseUrl = "http://localhost:8000" }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      setRecommendations([]);
      return;
    }

    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiBaseUrl}/recommendations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: cartItems })
        });
        if (response.ok) {
          const data = await response.json();
          setRecommendations(data.recommendations || []);
        }
      } catch (err) {
        console.warn("Backend error fallback recommendations:", err);
      } finally {
        setLoading(false);
      }
    };

    // Client-side dynamic match for instant response & offline readiness
    const generateSmartRecs = () => {
      const recs = cartItems
        .filter(item => item.co2_kg > 0.5)
        .map(item => {
          const lowerName = item.name.toLowerCase();
          let altName = "Sertifikalı Yeşil Eko Alternatif";
          let altCo2 = 0.15;
          let pct = 85.0;
          let reason = "Sürdürülebilir malzeme kullanımı atıkları ve karbon salınımını önler.";

          if (lowerName.includes('kaşık') || lowerName.includes('cutlery') || lowerName.includes('çatal') || lowerName.includes('utensil')) {
            altName = "Yeniden Kullanılabilir Ahşap & Bambu Çatal Kaşık Seti";
            altCo2 = 0.10;
            pct = 96.4;
            reason = "Tek kullanımlık plastik kaşıklar doğada 450 yılda çözünür. Bambu seti %96+ karbon ve mikroplastik tasarrufu sağlar.";
          } else if (lowerName.includes('bardak') || lowerName.includes('cup')) {
            altName = "Paslanmaz Çelik Termos / Cam Kupa";
            altCo2 = 0.15;
            pct = 93.1;
            reason = "Yeniden kullanılabilir termos bardak yılda yüzlerce plastik/kağıt parti bardağının çöp olmasını engeller.";
          } else if (lowerName.includes('beef') || lowerName.includes('steak') || lowerName.includes('bonfile') || lowerName.includes('et')) {
            altName = "Bitkisel Protein Köftesi / Organik Yulaf Sütü";
            altCo2 = 1.20;
            pct = 91.7;
            reason = "Büyükbaş hayvancılık metan salınımında liderdir. Bitkisel köfte tercihi salınımı %91.7 oranında düşürür.";
          } else if (lowerName.includes('bottle') || lowerName.includes('plastik') || lowerName.includes('şişe')) {
            altName = "Çelik Termos Matara";
            altCo2 = 0.10;
            pct = 96.8;
            reason = "Tek bir çelik matara yılda 1,000'den fazla pet su şişesi tüketimini ve rafine salınımını ortadan kaldırır.";
          } else if (lowerName.includes('banana') || lowerName.includes('muz')) {
            altName = "Yerel Bahçe Armudu";
            altCo2 = 0.25;
            pct = 68.7;
            reason = "Yerel mevsim meyveleri uluslararası deniz kargo taşımacılığı salınımını önler.";
          }

          return {
            original_item_id: item.id,
            original_item_name: item.name,
            original_co2_kg: item.co2_kg,
            suggested_item_name: altName,
            suggested_co2_kg: altCo2,
            reduction_percentage: pct,
            reason: reason
          };
        });
      setRecommendations(recs);
    };

    fetchRecommendations();
    generateSmartRecs();
  }, [cartItems, apiBaseUrl]);

  const handlePerformSwap = (rec) => {
    // 1. Particle spray celebration confetti
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#84cc16', '#10b981', '#fbbf24']
      });
    } catch (e) {}

    // 2. Perform cart item swap logic with exact eco product name & score
    onSwapItem(rec.original_item_id, {
      name: rec.suggested_item_name,
      co2_kg: rec.suggested_co2_kg,
      grade: 'A+',
      category: 'Eko Alternatif'
    });
  };

  return (
    <div className="glass-card p-6 flex flex-col justify-between h-full relative overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">Akıllı Eko-Değişim Önerileri</h3>
            <p className="text-xs text-slate-500 font-medium">Sepetteki Yüksek Salınımlı Ürün Alternatifleri</p>
          </div>
        </div>

        {loading && <RefreshCw className="w-4 h-4 text-eco-600 animate-spin" />}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[360px]">
        {cartItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <TrendingDown className="w-9 h-9 text-eco-300 mb-2" />
            <p className="text-xs font-semibold text-slate-600">Sepetinizde Henüz Ürün Yok</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
              Sepetinize ürün ekledikçe karbon ayak izinizi düşürecek dinamik öneriler burada belirecektir.
            </p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-eco-50/60 border border-eco-200/80">
            <Award className="w-10 h-10 text-eco-600 mb-2 animate-bounce" />
            <h4 className="font-extrabold text-slate-800 text-base">Şahane Eko Standart!</h4>
            <p className="text-xs text-slate-600 mt-1 max-w-xs">
              Sepetinizdeki tüm ürünler düşük karbon salınımlı eko kriterlere uygun.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.original_item_id || index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-4 rounded-2xl bg-white/80 border border-white/90 shadow-sm flex flex-col gap-3 hover:shadow-md transition"
              >
                {/* Product Comparison Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 flex-wrap">
                    <span className="text-rose-600 line-through bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100">
                      {rec.original_item_name} ({rec.original_co2_kg} kg)
                    </span>
                    <ArrowRight className="w-4 h-4 text-eco-600 flex-shrink-0" />
                    <span className="text-eco-800 font-extrabold bg-eco-100 px-2 py-0.5 rounded-lg border border-eco-200">
                      {rec.suggested_item_name} ({rec.suggested_co2_kg} kg)
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-eco-500 to-lime-500 text-white font-extrabold text-xs shadow-xs self-start sm:self-auto">
                    <TrendingDown className="w-3.5 h-3.5" /> -%{rec.reduction_percentage.toFixed(0)} Düşüş
                  </span>
                </div>

                {/* Reason Details */}
                <p className="text-xs text-slate-600 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60 leading-relaxed">
                  🌱 <span className="font-semibold text-amber-950">İklim Gerekçesi:</span> {rec.reason}
                </p>

                {/* 1-Click Swap Action Button with Celebration Confetti */}
                <motion.button
                  onClick={() => handlePerformSwap(rec)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-eco-600 via-eco-500 to-lime-600 hover:from-eco-700 hover:to-eco-600 text-white text-xs font-extrabold shadow-md hover:shadow-glow-green flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  Alternatif ile Değiştir (Yeşil Dereceye Yükselt)
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
