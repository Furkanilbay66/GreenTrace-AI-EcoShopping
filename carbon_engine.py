"""
GreenTrace Carbon Engine
In-memory mock database & calculation engine for carbon footprint intensity values,
eco-grades, and AI recommendation alternatives across 3 impact tiers.
"""

# Dynamic carbon database index (values in kg CO2e per item/unit)
CARBON_DATABASE = {
    # ----------------------------------------------------
    # TIER 1: ECO-FRIENDLY & REUSABLE (Grade A+ & A / Low Impact: < 0.5 kg CO2)
    # ----------------------------------------------------
    "metal cutlery": {
        "name": "Paslanmaz Çelik & Gümüş Çatal Bıçak Seti",
        "category": "Eko-Mutfak & Gereçler",
        "co2_kg": 0.10,
        "grade": "A+",
        "unit": "1 Takım (Çok Kullanımlık)",
        "origin": "Paslanmaz Çelik / Ömürlük Kullanım",
        "alternative": None,
        "tip": "Ömürlük çelik ve gümüş takımlar binlerce plastik atığı tamamen engeller."
    },
    "glass straw": {
        "name": "Yeniden Kullanılabilir Cam Pipet & Cam Kupa Seti",
        "category": "Eko-Mutfak & Gereçler",
        "co2_kg": 0.15,
        "grade": "A+",
        "unit": "1 Set (Cam Pipet & Kupa)",
        "origin": "Borosilikat Isıya Dayanıklı Cam",
        "alternative": None,
        "tip": "Cam pipetler yıkanıp tekrar tekrar kullanılarak plastik pipet atıklarını %100 önler."
    },
    "glass mug": {
        "name": "Geri Dönüştürülebilir Kulplu Cam Kupa Bardağı",
        "category": "Eko-Mutfak & Bardaklar",
        "co2_kg": 0.20,
        "grade": "A",
        "unit": "1 Adet",
        "origin": "%100 Dönüştürülebilir Silis Cam",
        "alternative": None,
        "tip": "Kulplu cam kupalar plastik ve kağıt bardak tüketimini tamamen ortadan kaldırır."
    },
    "cloth bag": {
        "name": "Organik Pamuk Bez Çanta & File",
        "category": "Eko-Alışveriş Ekipmanı",
        "co2_kg": 0.05,
        "grade": "A+",
        "unit": "1 Adet",
        "origin": "Sürdürülebilir Organik Tekstil",
        "alternative": None,
        "tip": "Bez çantayı 50+ kez kullanmak çevreye ve karbon bütçenize pozitif katkı sağlar!"
    },
    "apple": {
        "name": "Organik Yerel Yeşil Elma",
        "category": "Meyve & Sebze",
        "co2_kg": 0.30,
        "grade": "A+",
        "unit": "1 kg",
        "origin": "Yerel Çiftlik Bahçesi",
        "alternative": None,
        "tip": "Yerel olarak yetiştirilen elma ve taze sebzelerin kargo ayak izi yok denecek kadar azdır."
    },
    "thermos bottle": {
        "name": "Paslanmaz Çelik Termos Matara",
        "category": "Eko-Ambalaj & Matara",
        "co2_kg": 0.10,
        "grade": "A+",
        "unit": "1 Adet (Termos)",
        "origin": "Paslanmaz Çelik",
        "alternative": None,
        "tip": "Termos matara yılda ortalama 1,000 tek kullanımlık pet şişenin doğaya karışmasını önler."
    },
    "bamboo cup": {
        "name": "Bambu & Seramik Seyahat Kupası",
        "category": "Eko-Ambalaj & Kupa",
        "co2_kg": 0.15,
        "grade": "A+",
        "unit": "1 Adet",
        "origin": "Organik Bambu Elyafı",
        "alternative": None,
        "tip": "Kendi seyahat kupanızı taşımak kağıt kahve bardaklarının atığını engeller."
    },
    "oat milk": {
        "name": "Organik Yulaf Sütü",
        "category": "Bitkisel Süt Ürünleri",
        "co2_kg": 0.90,
        "grade": "A",
        "unit": "1 Liter",
        "origin": "Bitkisel Organik Tarım",
        "alternative": None,
        "tip": "Bitkisel yulaf sütü inek sütüne kıyasla %70 daha az arazi ve su kullanır."
    },
    "plant burger": {
        "name": "Bitkisel Protein Köftesi (Eko-Vegan)",
        "category": "Bitkisel Protein",
        "co2_kg": 1.20,
        "grade": "A",
        "unit": "500g",
        "origin": "Bezelye & Soya Proteini",
        "alternative": None,
        "tip": "Bitkisel protein köftesi hayvancılık kaynaklı metan gazı salınımını ortadan kaldırır."
    },

    # ----------------------------------------------------
    # TIER 2: MODERATE IMPACT (Grade B & C / 0.5 - 4.0 kg CO2)
    # ----------------------------------------------------
    "banana": {
        "name": "İthal Sarı Muz",
        "category": "Meyve & Sebze",
        "co2_kg": 0.80,
        "grade": "B",
        "unit": "1 kg",
        "origin": "Uluslararası Soğutmalı Kargo",
        "alternative": {
            "name": "Yerel Mevsim Armudu / Elması",
            "co2_kg": 0.25,
            "reduction_pct": 68.7,
            "reason": "Yerel meyve seçimi soğuk kargo taşımacılığı salınımını önler."
        },
        "tip": "İthal meyveler uzak mesafe nakliye sebebiyle orta düzey salınıma sahiptir."
    },
    "glass bottle": {
        "name": "Geri Dönüştürülebilir Cam Şişe Su",
        "category": "Ambalaj & İçecek",
        "co2_kg": 1.10,
        "grade": "B",
        "unit": "1 Liter",
        "origin": "Geri Dönüştürülmüş Cam",
        "alternative": {
            "name": "Paslanmaz Çelik Termos Matara",
            "co2_kg": 0.10,
            "reduction_pct": 90.9,
            "reason": "Termos matara cam üretim eritme enerjisini de tasarruf etmenizi sağlar."
        },
        "tip": "Cam ambalajlar %100 sonsuz kez dönüştürülebilir."
    },
    "aluminium can": {
        "name": "Kırmızı Alüminyum İçecek Kutusu (Kola/Maden Suyu)",
        "category": "Ambalaj & İçecek",
        "co2_kg": 1.40,
        "grade": "C",
        "unit": "330 ml",
        "origin": "Alüminyum Boksit Ergitme",
        "alternative": {
            "name": "Depozitolu Cam Şişe İçecek",
            "co2_kg": 0.45,
            "reduction_pct": 67.8,
            "reason": "Boksit madenciliği yüksek elektrik tüketir; depozitolu cam daha çevrecidir."
        },
        "tip": "Boş kutuları metal geri dönüşüm kutusuna attığınızdan emin olun."
    },
    "coffee cup": {
        "name": "Tek Kullanımlık Kahve Bardağı",
        "category": "Ambalaj & İçecek",
        "co2_kg": 1.80,
        "grade": "D",
        "unit": "1 Bardak",
        "origin": "Polietilen Kaplı Kağıt",
        "alternative": {
            "name": "Bambu & Seramik Seyahat Kupası",
            "co2_kg": 0.15,
            "reduction_pct": 91.6,
            "reason": "Tek kullanımlık bardaklar plastik iç astarı sebebiyle kolay dönüştürülemez."
        },
        "tip": "Kendi seyahat bardağınızı getirerek mağaza indirimlerinden yararlanın."
    },

    # ----------------------------------------------------
    # TIER 3: HIGH ENVIRONMENTAL IMPACT & HAZARDS (Grade E & F / > 2.0 kg CO2)
    # ----------------------------------------------------
    "plastic straw": {
        "name": "Tek Kullanımlık Renkli Plastik Pipet Seti",
        "category": "Zararlı Plastik Atık",
        "co2_kg": 2.50,
        "grade": "F",
        "unit": "1 Paket (Plastik Pipetler)",
        "origin": "Sentetik Polipropilen Plastik",
        "alternative": {
            "name": "Yeniden Kullanılabilir Cam Pipet & Cam Kupa Seti",
            "co2_kg": 0.15,
            "reduction_pct": 94.0,
            "reason": "Cam ve bambu pipetler tek kullanımlık plastik deniz atığını tamamen engeller."
        },
        "tip": "Plastik pipetler deniz canlıları ve okyanus ekosistemleri için ciddi tehdittir."
    },
    "plastic cutlery": {
        "name": "Tek Kullanımlık Plastik Kaşık & Çatal Seti",
        "category": "Zararlı Ambalaj & Gereçler",
        "co2_kg": 2.80,
        "grade": "F",
        "unit": "1 Paket (Plastik)",
        "origin": "Sentetik Polistiren Plastik",
        "alternative": {
            "name": "Paslanmaz Çelik & Gümüş Çatal Bıçak Seti",
            "co2_kg": 0.10,
            "reduction_pct": 96.4,
            "reason": "Çelik ve gümüş takımlar tek kullanımlık plastik mikrokirliliğini %96+ engeller."
        },
        "tip": "Tek kullanımlık plastik kaşıklar doğada 450 yıldan uzun sürede parçalanır."
    },
    "plastic cup": {
        "name": "Tek Kullanımlık Plastik Bardak",
        "category": "Zararlı Ambalaj & İçecek",
        "co2_kg": 2.20,
        "grade": "E",
        "unit": "1 Paket",
        "origin": "Polipropilen Sentetik Plastik",
        "alternative": {
            "name": "Geri Dönüştürülebilir Kulplu Cam Kupa Bardağı",
            "co2_kg": 0.20,
            "reduction_pct": 90.9,
            "reason": "Kulplu cam kupa kullanmak tek kullanımlık plastik bardak atıklarını sıfırlar."
        },
        "tip": "Şeffaf plastik parti bardakları petrokimya rafineri salınımı üretir."
    },
    "plastic bottle": {
        "name": "Tek Kullanımlık Plastik Şişe Su",
        "category": "Zararlı Ambalaj & İçecek",
        "co2_kg": 3.20,
        "grade": "F",
        "unit": "6'lı Paket (500ml)",
        "origin": "Petrokimyasal PET Sentetik",
        "alternative": {
            "name": "Paslanmaz Çelik Termos Matara",
            "co2_kg": 0.10,
            "reduction_pct": 96.8,
            "reason": "Bir çelik termos matara yılda 1,000'den fazla pet su şişesi tüketimini engeller."
        },
        "tip": "PET plastikler okyanuslarda mikroplastik kirliliği oluşturur."
    },
    "milk": {
        "name": "Tam Yağlı İnek Sütü",
        "category": "Hayvansal Süt Ürünleri",
        "co2_kg": 3.10,
        "grade": "D",
        "unit": "1 Liter",
        "origin": "Geleneksel Hayvancılık",
        "alternative": {
            "name": "Organik Yulaf Sütü",
            "co2_kg": 0.90,
            "reduction_pct": 70.9,
            "reason": "Bitkisel yulaf tarımı %70 daha az karbon üretir ve %80 az arazi gerektirir."
        },
        "tip": "Bitkisel sütler metan emisyonunu büyük oranda azaltır."
    },
    "beef": {
        "name": "İskender Döner / Kırmızı Et Yemeği",
        "category": "Yüksek Salınımlı Et",
        "co2_kg": 14.50,
        "grade": "F",
        "unit": "Porsiyon (Kırmızı Et)",
        "origin": "Büyükbaş Hayvancılık Besiciliği",
        "alternative": {
            "name": "Bitkisel Protein Köftesi (Eko-Vegan)",
            "co2_kg": 1.20,
            "reduction_pct": 91.7,
            "reason": "Bitkisel köfte büyükbaş hayvancılık kaynaklı metan salınımını yok eder."
        },
        "tip": "Kırmızı et gıda kategorileri arasında en yüksek karbon yüküne sahiptir."
    },
    "battery": {
        "name": "Tek Kullanımlık Alkali Pil & E-Atık",
        "category": "Tehlikeli & Kimyasal Atık",
        "co2_kg": 4.50,
        "grade": "F",
        "unit": "4'lü Paket",
        "origin": "Ağır Metal Madenciliği (Çinko/Manganez)",
        "alternative": {
            "name": "USB Şarj Edilebilir Lityum Pil",
            "co2_kg": 0.20,
            "reduction_pct": 95.5,
            "reason": "Şarj edilebilir piller 1,000+ kez doldurularak ağır metal kirliliğini önler."
        },
        "tip": "Atık pilleri mutlaka kimyasal pil toplama kutularına atın!"
    },
    "default": {
        "name": "Standart Ürün",
        "category": "Genel Ürünler",
        "co2_kg": 1.20,
        "grade": "B",
        "unit": "1 Adet",
        "origin": "Standart Perakende",
        "alternative": {
            "name": "Sertifikalı Yeşil Marka Eko Alternatif",
            "co2_kg": 0.35,
            "reduction_pct": 70.8,
            "reason": "Eko etiketli yeşil alternatifler sıfır atık tedarik zinciri kullanır."
        },
        "tip": "EnergyStar ve FSC orman sertifikalarını kontrol edin."
    }
}


def search_or_match_item(item_name: str):
    """Fuzzy matching item key against database."""
    query = item_name.strip().lower()
    for key, data in CARBON_DATABASE.items():
        if key in query or query in key:
            return data
    return CARBON_DATABASE["default"]


def calculate_cart_footprint(items: list):
    """
    Calculates total CO2, average eco grade, and detailed breakdown.
    Preserves item custom names and explicit co2_kg values passed during eco swaps.
    """
    total_co2 = 0.0
    detailed_items = []
    
    for item in items:
        raw_name = item.get("name", "Bilinmeyen Ürün")
        quantity = item.get("quantity", 1)
        
        if "co2_kg" in item and item["co2_kg"] is not None:
            co2_per_unit = float(item["co2_kg"])
            name = raw_name
            category = item.get("category", "Eko Ürün")
            item_grade = item.get("grade") or ("A+" if co2_per_unit < 0.5 else "A" if co2_per_unit < 1.0 else "B" if co2_per_unit < 2.0 else "D" if co2_per_unit < 4.0 else "F")
        else:
            db_match = search_or_match_item(raw_name)
            name = db_match["name"]
            co2_per_unit = db_match["co2_kg"]
            category = db_match["category"]
            item_grade = db_match["grade"]
            
        co2 = round(co2_per_unit * quantity, 2)
        total_co2 += co2
        
        detailed_items.append({
            "id": item.get("id"),
            "name": name,
            "category": category,
            "co2_kg": co2,
            "co2_unit": co2_per_unit,
            "grade": item_grade,
            "quantity": quantity
        })
        
    total_co2 = round(total_co2, 2)
    
    if total_co2 < 4.0:
        overall_grade = "A+"
    elif total_co2 < 8.0:
        overall_grade = "A"
    elif total_co2 < 14.0:
        overall_grade = "B"
    elif total_co2 < 22.0:
        overall_grade = "C"
    elif total_co2 < 35.0:
        overall_grade = "D"
    else:
        overall_grade = "F"
        
    return {
        "total_co2_kg": total_co2,
        "overall_grade": overall_grade,
        "items": detailed_items
    }


def generate_cart_recommendations(items: list):
    """
    Identifies high emission items in cart and returns specific lower carbon swap recommendations.
    """
    recommendations = []
    for item in items:
        name = item.get("name", "")
        db_match = search_or_match_item(name)
        if db_match.get("alternative"):
            alt = db_match["alternative"]
            recommendations.append({
                "original_item_id": item.get("id"),
                "original_item_name": db_match["name"],
                "original_co2_kg": db_match["co2_kg"],
                "suggested_item_name": alt["name"],
                "suggested_co2_kg": alt["co2_kg"],
                "reduction_percentage": alt["reduction_pct"],
                "reason": alt["reason"]
            })
    return recommendations
