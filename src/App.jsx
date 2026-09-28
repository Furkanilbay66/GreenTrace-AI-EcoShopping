import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import CarbonGauge from './components/CarbonGauge';
import ImageUploader from './components/ImageUploader';
import CartDrawer from './components/CartDrawer';
import RecommendationsWidget from './components/RecommendationsWidget';
import BudgetPredictorCard from './components/BudgetPredictorCard';
import CatalogShowcase from './components/CatalogShowcase';
import EcoMascot from './components/EcoMascot';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Sparkles, ShieldCheck, Leaf } from 'lucide-react';

const API_BASE_URL = "http://localhost:8000";

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'market', 'ecoswap'

  // Clean initial empty cart state (No hardcoded unwanted initial items)
  const [cartItems, setCartItems] = useState([]);
  const [totalCo2, setTotalCo2] = useState(0.0);
  const [overallGrade, setOverallGrade] = useState('A+');
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Recalculate carbon metrics on cart updates
  useEffect(() => {
    const fetchCartCalculation = async () => {
      if (cartItems.length === 0) {
        setTotalCo2(0.0);
        setOverallGrade('A+');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/carbon-calculate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: cartItems })
        });
        if (response.ok) {
          const data = await response.json();
          setTotalCo2(data.total_co2_kg);
          setOverallGrade(data.overall_grade);
        }
      } catch (err) {
        // Fallback calculations client-side
        const sum = cartItems.reduce((acc, curr) => acc + (curr.co2_kg * curr.quantity), 0);
        const roundedSum = Math.round(sum * 100) / 100;
        setTotalCo2(roundedSum);
        if (roundedSum < 3.0) setOverallGrade('A+');
        else if (roundedSum < 7.0) setOverallGrade('A');
        else if (roundedSum < 12.0) setOverallGrade('B');
        else if (roundedSum < 22.0) setOverallGrade('C');
        else setOverallGrade('F');
      }
    };

    fetchCartCalculation();
  }, [cartItems]);

  // Cart item handlers
  const handleAddItem = (newItem) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.name === newItem.name);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [...prev, newItem];
    });
  };

  const handleUpdateQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleSwapItem = (originalItemId, suggestedItem) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === originalItemId) {
        return {
          ...item,
          name: suggestedItem.name,
          co2_kg: suggestedItem.co2_kg,
          grade: suggestedItem.grade,
          category: suggestedItem.category || item.category
        };
      }
      return item;
    }));
  };

  return (
    <div className="min-h-screen pb-16 bg-radial-gradient">
      {/* Navbar Header with Multi-Tab Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        totalCo2={totalCo2}
        overallGrade={overallGrade}
        onOpenCart={() => setIsCartOpen(true)}
        onCloseCart={() => setIsCartOpen(false)}
      />

      {/* Tab Content Display */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: DASHBOARD (Ana Panel) */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="tab-dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Welcoming Clean Hero Card */}
              <section className="glass-card p-8 relative overflow-hidden bg-gradient-to-r from-white/80 via-eco-50/50 to-beige-100/70 border border-white">
                <div className="max-w-2xl relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-eco-100 text-eco-800 border border-eco-200 shadow-xs mb-3">
                    🌱 Sürdürülebilir Karbon Asistanı
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                    Hoş Geldiniz, <br />
                    <span className="bg-gradient-to-r from-eco-600 via-eco-500 to-lime-600 bg-clip-text text-transparent">
                      Genel Karbon Durum Paneli
                    </span>
                  </h2>
                  <p className="text-sm text-slate-600 mt-2 font-medium leading-relaxed">
                    Aşağıdaki göstergelerden anlık sepetinizin karbon salınım ibresini ve Scikit-Learn regresyon modeli ile ay sonu tahmini bütçe durumunuzu takip edebilirsiniz.
                  </p>
                </div>
              </section>

              {/* Grid: Carbon Gauge Meter + Smart Budget Predictor */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                <CarbonGauge totalCo2={totalCo2} maxLimit={35.0} />
                <BudgetPredictorCard totalCo2={totalCo2} apiBaseUrl={API_BASE_URL} />
              </section>
            </motion.div>
          )}

          {/* TAB 2: AKILLI MARKET & SEPET */}
          {activeTab === 'market' && (
            <motion.div
              key="tab-market"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Section 1: AI Scanner & Catalog Showcase */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ImageUploader onAddItem={handleAddItem} apiBaseUrl={API_BASE_URL} />
                <CatalogShowcase onAddItem={handleAddItem} />
              </div>

              {/* Section 2: Active Cart View */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-eco-600 to-eco-400 text-white shadow-md">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg">Mevcut Sepet İçeriği</h3>
                      <p className="text-xs text-slate-500 font-medium">Anlık Karbon Etkisi İle Listeleniyor</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="px-3.5 py-1.5 rounded-full bg-eco-100 text-eco-900 font-extrabold text-xs">
                      Toplam: {totalCo2.toFixed(2)} kg CO₂ ({overallGrade})
                    </div>
                    {cartItems.length > 0 && (
                      <button
                        onClick={handleClearCart}
                        className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Temizle
                      </button>
                    )}
                  </div>
                </div>

                {cartItems.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-700 text-sm">Sepetiniz Boş</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Yukarıdaki AI tarayıcıyı kullanarak fotoğraf yükleyebilir veya katalogdan ürün ekleyebilirsiniz.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-white/80 border border-white/90 shadow-xs flex items-center justify-between gap-3 hover:shadow-md transition"
                      >
                        <div>
                          <h5 className="font-bold text-slate-900 text-sm line-clamp-1">{item.name}</h5>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded-md bg-eco-100 text-eco-800 text-[11px] font-semibold">
                              {(item.co2_kg * item.quantity).toFixed(2)} kg CO₂
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">({item.co2_kg} kg/adet)</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded-lg hover:bg-white text-slate-600 transition cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-5 text-center font-bold text-xs">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-lg hover:bg-white text-slate-600 transition cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 3: EKO-DEĞİŞİM & ÖNERİLER */}
          {activeTab === 'ecoswap' && (
            <motion.div
              key="tab-ecoswap"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Dedicated Eco Swap Panel */}
              <div className="max-w-4xl mx-auto">
                <RecommendationsWidget
                  cartItems={cartItems}
                  onSwapItem={handleSwapItem}
                  apiBaseUrl={API_BASE_URL}
                />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Cart Drawer Slide-Over */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        totalCo2={totalCo2}
        overallGrade={overallGrade}
      />

      {/* Floating Interactive Eco Mascot */}
      <EcoMascot />

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-slate-500 font-medium">
        <p>GreenTrace © 2026 - Modern Glassmorphism UI & ML Carbon Engine</p>
      </footer>
    </div>
  );
}
