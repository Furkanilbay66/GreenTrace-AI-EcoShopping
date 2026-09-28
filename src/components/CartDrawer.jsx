import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Leaf, Sparkles, PlusCircle } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  totalCo2 = 0.0,
  overallGrade = 'A'
}) {
  const handleClearAndClose = () => {
    onClearCart();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Backdrop Overlay - Closes drawer immediately when clicking background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 transition-opacity cursor-pointer"
          />

          {/* Slide-over Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md glass-drawer z-50 flex flex-col justify-between p-6 overflow-hidden"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-eco-600 to-eco-400 text-white shadow-md">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">Eko Sepetim</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {cartItems.length} Ürün Kalemi
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                  aria-label="Kapat"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Quick Grade Summary Banner */}
              <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-eco-50 to-beige-100 border border-eco-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-eco-600" />
                  <span className="text-xs font-bold text-slate-700">Toplam Sepet Salınımı:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm">
                    {totalCo2.toFixed(2)} kg CO₂
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-eco-500 text-white">
                    {overallGrade}
                  </span>
                </div>
              </div>
            </div>

            {/* Scrollable Item List */}
            <div className="flex-1 overflow-y-auto my-4 pr-1 space-y-3">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <ShoppingBag className="w-8 h-8 text-slate-300" />
                  </div>
                  <h4 className="font-bold text-slate-700 text-sm mb-1">Sepetiniz Boş</h4>
                  <p className="text-xs text-slate-500 max-w-xs mb-4">
                    Katalogdan ürün eklemek veya fotoğraf yüklemek için aşağıdaki butona basarak alışverişe devam edebilirsiniz.
                  </p>

                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-eco-500 hover:bg-eco-600 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" /> Ürün Ekle & Alışverişe Dön
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="p-4 rounded-2xl bg-white/70 border border-white/90 shadow-sm flex items-center justify-between gap-3 hover:bg-white/90 transition"
                  >
                    <div className="flex-1">
                      <h5 className="font-bold text-slate-900 text-sm line-clamp-1">
                        {item.name}
                      </h5>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded-md bg-eco-100 text-eco-800 text-[11px] font-semibold">
                          {(item.co2_kg * item.quantity).toFixed(2)} kg CO₂
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          ({item.co2_kg} kg/adet)
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-lg hover:bg-white text-slate-600 transition cursor-pointer"
                        aria-label="Azalt"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-bold text-slate-800 text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-lg hover:bg-white text-slate-600 transition cursor-pointer"
                        aria-label="Artır"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      title="Kaldır"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary & Clear Controls */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-col gap-3">
              {cartItems.length > 0 && (
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <button
                    onClick={handleClearAndClose}
                    className="hover:text-rose-600 flex items-center gap-1 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Sepeti Temizle
                  </button>
                  <span className="text-eco-700 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Anlık Hesaplandı
                  </span>
                </div>
              )}

              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold text-sm shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Alışverişe Devam Et</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
