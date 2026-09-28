import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Image as ImageIcon, Scan, CheckCircle, AlertCircle, Plus, Sparkles, RefreshCw, Check, Info, ShieldCheck, Zap, Layers, Key } from 'lucide-react';

// Sample visual test presets with SVG data URIs
const SAMPLE_PRESETS = [
  {
    id: 'silverware',
    label: '🍴 Gümüş/Çelik Takım',
    name: 'Paslanmaz Çelik & Gümüş Çatal Bıçak Seti',
    matched_key: 'metal cutlery',
    co2_kg: 0.10,
    grade: 'A+',
    category: 'Eko-Mutfak & Gereçler',
    confidence: 0.97,
    material_diagnostic: 'Metalik Parlaklık & Yüksek Yansımalı Gümüş Doku (A+ Reusable)',
    eco_tier: 'Zararsız & Çok Kullanımlık',
    tip: 'Ömürlük çelik ve gümüş takımlar tek kullanımlık plastik kaşık/çatal kirliliğini %96+ engeller.',
    preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%23f8fafc"/><path d="M110 50 L110 140 M140 40 L140 140 M170 50 L170 140 M110 40 L170 40" stroke="%2394a3b8" stroke-width="4" stroke-linecap="round"/><ellipse cx="140" cy="65" rx="15" ry="25" fill="%23cbd5e1" stroke="%2364748b" stroke-width="2"/><text x="150" y="180" font-size="15" font-weight="bold" text-anchor="middle" fill="%23334155">Gümüş Çatal Bıçak Seti (Sample)</text></svg>'
  },
  {
    id: 'apple',
    label: '🍎 Organik Elma',
    name: 'Organik Yerel Yeşil Elma',
    matched_key: 'apple',
    co2_kg: 0.30,
    grade: 'A+',
    category: 'Meyve & Sebze',
    confidence: 0.98,
    material_diagnostic: 'Taze Doğal Klorofil Organik Hücre Yapısı',
    eco_tier: 'Tamamen Doğal & Çevre Dostu',
    tip: 'Yerel üreticiden taze organik elma minimal kargo salınımına sahiptir.',
    preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%23f0fdf4"/><circle cx="150" cy="110" r="55" fill="%2322c55e"/><path d="M150 55 Q160 40 155 30" stroke="%2315803d" stroke-width="4" fill="none"/><text x="150" y="180" font-size="16" font-weight="bold" text-anchor="middle" fill="%23166534">Organik Elma (Sample)</text></svg>'
  },
  {
    id: 'banana',
    label: '🍌 İthal Muz',
    name: 'İthal Sarı Muz',
    matched_key: 'banana',
    co2_kg: 0.80,
    grade: 'B',
    category: 'Meyve & Sebze',
    confidence: 0.95,
    material_diagnostic: 'Karotenoid Organik Meyve Kabuğu',
    eco_tier: 'Düşük/Orta Kargo Salınımlı',
    tip: 'İthal muzlar soğutmalı kargo taşımacılığı sebebiyle orta düzey salınıma sahiptir.',
    preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%23fefce8"/><path d="M80 140 Q150 160 220 70 Q160 130 80 140" fill="%23eab308" stroke="%23ca8a04" stroke-width="3"/><text x="150" y="180" font-size="16" font-weight="bold" text-anchor="middle" fill="%23854d0e">İthal Muz (Sample)</text></svg>'
  },
  {
    id: 'bottle',
    label: '🍾 Plastik Şişe Su',
    name: 'Tek Kullanımlık Plastik Şişe Su',
    matched_key: 'plastic bottle',
    co2_kg: 3.20,
    grade: 'F',
    category: 'Ambalaj & İçecek',
    confidence: 0.96,
    material_diagnostic: 'Sentetik PET (Polyethylene Terephthalate) Ambalaj',
    eco_tier: 'Yüksek Plastik Atık Riski',
    tip: 'Petrokimyasal pet ambalajlar yüksek karbon ve mikroplastik atığı üretir.',
    preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%23fef2f2"/><rect x="125" y="50" width="50" height="100" rx="10" fill="%2338bdf8" opacity="0.8"/><rect x="140" y="30" width="20" height="20" rx="4" fill="%230284c7"/><text x="150" y="180" font-size="16" font-weight="bold" text-anchor="middle" fill="%23991b1b">Plastik Şişe (Sample)</text></svg>'
  },
  {
    id: 'beef',
    label: '🥩 Dana Bonfile',
    name: 'Taze Dana Bonfile Steak',
    matched_key: 'beef',
    co2_kg: 14.50,
    grade: 'F',
    category: 'Et Ürünleri',
    confidence: 0.97,
    material_diagnostic: 'Miyoglobin Kırmızı Hayvansal Kas Dokusu',
    eco_tier: 'En Yüksek Metan Salınımlı Et',
    tip: 'Büyükbaş hayvancılık metan salınımı nedeniyle en yüksek karbon yüküne sahiptir.',
    preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%23fff1f2"/><ellipse cx="150" cy="105" rx="70" ry="45" fill="%23e11d48"/><path d="M100 95 Q140 115 200 95" stroke="%23ffffff" stroke-width="4" fill="none"/><text x="150" y="180" font-size="16" font-weight="bold" text-anchor="middle" fill="%23881337">Dana Bonfile (Sample)</text></svg>'
  }
];

export default function ImageUploader({ onAddItem, apiBaseUrl = "http://localhost:8000" }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [geminiApiKey, setGeminiApiKey] = useState('AIzaSyDYSai4R0AQwkC7M0sjqSEnzRAFhhzrI70');
  const [showKeyInput, setShowKeyInput] = useState(false);

  const fileInputRef = useRef(null);

  // Drag and drop event handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Lütfen geçerli bir görsel formatı yükleyin (PNG, JPG, WEBP).');
      return;
    }
    setErrorMsg(null);
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setScanResult(null);
    setShowToast(false);
    
    analyzeImageWithAI(file);
  };

  const handleSelectPreset = (preset) => {
    setErrorMsg(null);
    setSelectedFile(null);
    setPreviewUrl(preset.preview);
    setScanResult(null);
    setShowToast(false);
    setIsScanning(true);

    setTimeout(() => {
      const resultData = {
        status: "success",
        detected_item: preset.name,
        confidence: preset.confidence,
        material_diagnostic: preset.material_diagnostic,
        eco_tier: preset.eco_tier,
        item_details: {
          name: preset.name,
          category: preset.category,
          co2_kg: preset.co2_kg,
          grade: preset.grade,
          unit: "1 Birim",
          origin: "Örnek Test Verisi",
          tip: preset.tip
        }
      };
      setScanResult(resultData);
      setIsScanning(false);
      setShowToast(true);
    }, 1200);
  };

  const analyzeImageWithAI = async (file) => {
    setIsScanning(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', file);
    if (geminiApiKey.trim()) {
      formData.append('api_key', geminiApiKey.trim());
    }

    try {
      const response = await fetch(`${apiBaseUrl}/analyze-image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Görüntü analiz servisine erişilemedi.');
      }

      const data = await response.json();
      setScanResult(data);
      setShowToast(true);
    } catch (err) {
      console.error('Backend image analysis error:', err);
      setErrorMsg('Görüntü analiz servisine erişilemedi. Lütfen backend sunucusunun (Port 8000) açık olduğunu ve görsel formatını kontrol edin.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddToCart = () => {
    if (scanResult && scanResult.item_details) {
      onAddItem({
        id: `item-${Date.now()}`,
        name: scanResult.item_details.name,
        co2_kg: scanResult.item_details.co2_kg,
        grade: scanResult.item_details.grade,
        category: scanResult.item_details.category,
        quantity: 1
      });
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setScanResult(null);
    setShowToast(false);
    setErrorMsg(null);
  };

  return (
    <div className="glass-card p-6 flex flex-col justify-between h-full relative overflow-hidden">
      {/* Toast Popup Notification */}
      <AnimatePresence>
        {showToast && scanResult && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-3 left-3 right-3 z-30 p-3.5 rounded-2xl bg-slate-900 text-white shadow-2xl border border-eco-500/50 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-eco-500 text-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-eco-400 font-bold block uppercase tracking-wider">
                  Ultra Vision AI Algılama Başarılı
                </span>
                <p className="text-xs font-bold">
                  {scanResult.detected_item} (%{(scanResult.confidence * 100).toFixed(0)} Doğruluk)
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 cursor-pointer"
            >
              Tamam
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Header */}
      <div className="flex flex-col gap-2 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-eco-100 text-eco-700">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Ultra Vision AI Ürün Tara & Ekle</h3>
              <p className="text-xs text-slate-500 font-medium">Sınırsız Gerçek Zamanlı Obje & Materyal Tanıma</p>
            </div>
          </div>

          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full transition cursor-pointer ${
              geminiApiKey.trim() ? 'bg-eco-600 text-white shadow-md' : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
            title="Google Gemini AI Vision API Anahtarı Ekleyin"
          >
            <Key className="w-3 h-3 text-amber-300" />
            {geminiApiKey.trim() ? 'Gemini 2.5 Flash Aktif' : 'API Key Ekle'}
          </button>
        </div>

        {/* Optional Gemini API Key Input Bar */}
        <AnimatePresence>
          {showKeyInput && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-2.5 rounded-xl bg-slate-900 text-white text-xs flex items-center gap-2 border border-slate-700 shadow-lg">
                <Key className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <input
                  type="password"
                  placeholder="Google Gemini API Key Yapıştırın (AI Studio)"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-eco-500"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* What can be uploaded info badge */}
      <div className="mb-3 p-2.5 rounded-xl bg-eco-50/70 border border-eco-200/60 text-[11px] text-slate-600 flex items-center gap-2">
        <Info className="w-4 h-4 text-eco-600 flex-shrink-0" />
        <span>
          <strong className="text-slate-800">Sınırsız Algılama:</strong> Kutu içecekler, renkli pipetler, cam kupa & pipetler, İskender döner, gümüş çatal, pil ve tüm ürünler.
        </span>
      </div>

      {/* Main Drag & Drop Zone */}
      {!previewUrl ? (
        <div className="flex-1 flex flex-col justify-between gap-3">
          <motion.div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`min-h-[160px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-5 text-center cursor-pointer transition-all duration-300 relative ${
              dragActive
                ? 'border-eco-500 bg-eco-50/70 shadow-glow-green scale-[1.01]'
                : 'border-slate-300/80 hover:border-eco-400 bg-white/40 hover:bg-white/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />

            <motion.div
              animate={{ y: dragActive ? [-4, 4, -4] : 0 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-eco-500 to-eco-300 text-white flex items-center justify-center shadow-md shadow-eco-200 mb-2"
            >
              <UploadCloud className="w-6 h-6" />
            </motion.div>

            <h4 className="font-bold text-slate-800 text-xs mb-0.5">
              Ürün Fotoğrafını Sürükleyip Bırakın
            </h4>
            <p className="text-[11px] text-slate-500 mb-2">
              veya cihazınızdan bir görsel seçmek için tıklayın
            </p>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/80 border border-slate-200 text-[10px] font-semibold text-slate-600 shadow-xs">
              <ImageIcon className="w-3 h-3 text-eco-600" /> Sınırsız Görsel Sınıflandırma
            </span>
          </motion.div>

          {/* Quick Interactive Sample Presets */}
          <div className="pt-2 border-t border-slate-200/60">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Hızlı Örnek Fotoğraflarla Dene:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className="px-2 py-1.5 rounded-xl bg-white/80 hover:bg-eco-100/80 border border-slate-200/80 text-[11px] font-bold text-slate-700 hover:text-eco-900 transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Thumbnail Preview & Vertical Laser Scanner Effect View */
        <div className="flex-1 flex flex-col justify-between">
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center group mb-4 shadow-inner">
            {/* Image Thumbnail */}
            <img
              src={previewUrl}
              alt="Yüklenen Görsel Önizleme"
              className="w-full h-full object-contain opacity-90"
            />

            {/* Vertical Green Laser Scanning Line Effect */}
            {isScanning && (
              <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-xs flex flex-col items-center justify-center">
                <motion.div
                  initial={{ top: '0%' }}
                  animate={{ top: ['0%', '95%', '0%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-eco-400 to-transparent shadow-glow-green"
                />
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 text-white text-xs font-bold shadow-2xl border border-eco-500/50 z-10">
                  <RefreshCw className="w-4 h-4 text-eco-400 animate-spin" />
                  Ultra Vision AI Taraması Yapılıyor...
                </div>
              </div>
            )}

            {/* Reset / New File Button */}
            {!isScanning && (
              <button
                onClick={resetForm}
                className="absolute top-2 right-2 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white text-xs backdrop-blur-md transition cursor-pointer"
                title="Yeni Görsel Tara"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* AI Result Card */}
          <AnimatePresence>
            {scanResult && scanResult.item_details && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-white/80 border border-white/90 shadow-sm flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-eco-700 font-semibold mb-0.5">
                      <CheckCircle className="w-4 h-4 text-eco-600" />
                      <span>{scanResult.detected_item}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-900 text-white">
                        %{(scanResult.confidence * 100).toFixed(0)} Doğruluk
                      </span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-base">
                      {scanResult.item_details.name}
                    </h4>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-eco-500 text-white shadow-xs">
                    {scanResult.item_details.co2_kg} kg CO₂
                  </span>
                </div>

                {/* AI Material Diagnostic Badge */}
                {scanResult.material_diagnostic && (
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-100 p-2 rounded-xl border border-slate-200/80">
                    <Layers className="w-3.5 h-3.5 text-eco-600 flex-shrink-0" />
                    <span><strong className="text-slate-900">Materyal Analizi:</strong> {scanResult.material_diagnostic}</span>
                  </div>
                )}

                <div className="text-xs text-slate-600 bg-eco-50/60 p-2.5 rounded-xl border border-eco-100/80">
                  💡 <span className="font-semibold text-slate-700">Analiz Notu:</span> {scanResult.item_details.tip}
                </div>

                <motion.button
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-eco-600 to-eco-500 text-white font-bold text-sm shadow-md hover:shadow-glow-green flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Sepete Ekle
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Error notification */}
      {errorMsg && (
        <div className="mt-3 p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-2 border border-rose-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
