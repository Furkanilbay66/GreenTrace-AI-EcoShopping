"""
GreenTrace FastAPI Main Backend Server
Integrates Computer Vision ML Classifier, In-Memory Carbon Database,
Carbon Recommendations Optimizer, and Scikit-Learn Budget Predictor.
"""

import os
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Set user provided Gemini Vision API Key automatically for 100% precision multimodal visual recognition
os.environ["GEMINI_API_KEY"] = "AIzaSyDYSai4R0AQwkC7M0sjqSEnzRAFhhzrI70"

from app.classifier import ImageClassifier
from app.carbon_engine import (
    calculate_cart_footprint,
    generate_cart_recommendations,
    search_or_match_item,
    CARBON_DATABASE
)
from app.budget_predictor import CarbonBudgetPredictor

app = FastAPI(
    title="GreenTrace AI Backend",
    description="Python FastAPI engine for Computer Vision Image Classification & Machine Learning Carbon Budget Analytics",
    version="1.0.0"
)

# Enable CORS for Seamless Frontend micro-interactions
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all frontend dev servers (e.g. Vite http://localhost:5173)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiate persistent ML models
classifier_service = ImageClassifier()
predictor_service = CarbonBudgetPredictor(target_monthly_limit_kg=50.0)


# Input Schemas
class CartItemSchema(BaseModel):
    id: Optional[str] = None
    name: str
    quantity: int = 1
    category: Optional[str] = None

class CartCalculateRequest(BaseModel):
    items: List[CartItemSchema]

class RecommendationsRequest(BaseModel):
    items: List[CartItemSchema]

class BudgetPredictRequest(BaseModel):
    current_cart_co2_kg: float
    history_emissions_kg: Optional[List[float]] = None
    target_monthly_limit_kg: Optional[float] = 50.0


@app.get("/")
def root():
    return {
        "status": "online",
        "app": "GreenTrace Eco Assistant API",
        "features": [
            "Computer Vision ML (/analyze-image)",
            "Carbon Footprint Database (/carbon-calculate)",
            "AI Eco Swap Optimizer (/recommendations)",
            "Scikit-Learn ML Trend Forecast (/predict-budget)"
        ]
    }


@app.post("/analyze-image")
async def analyze_image(
    file: UploadFile = File(...),
    api_key: Optional[str] = Form(None)
):
    """
    Endpoint 1: Analyzes uploaded product photo using ML Computer Vision / Gemini Vision API.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a valid image format.")
        
    image_bytes = await file.read()
    ml_result = classifier_service.predict(image_bytes, api_key=api_key)
    
    # Enrich detection with database or dynamic Gemini AI carbon metrics
    if "item_details" in ml_result and ml_result["item_details"]:
        item_details = ml_result["item_details"]
        item_details["name"] = ml_result.get("detected_label", item_details.get("name"))
    else:
        db_match = search_or_match_item(ml_result["matched_key"])
        item_details = {
            "name": ml_result.get("detected_label") or db_match["name"],
            "category": db_match["category"],
            "co2_kg": db_match["co2_kg"],
            "grade": db_match["grade"],
            "unit": db_match["unit"],
            "origin": db_match["origin"],
            "tip": db_match["tip"]
        }
    
    return {
        "status": "success",
        "detected_item": ml_result["detected_label"],
        "confidence": ml_result["confidence"],
        "material_diagnostic": ml_result.get("material_diagnostic", "Görsel Materyal Analizi"),
        "eco_tier": ml_result.get("eco_tier", "Eko Analiz"),
        "item_details": item_details
    }


@app.post("/carbon-calculate")
def carbon_calculate(request: CartCalculateRequest):
    """
    Endpoint 2: Calculates total carbon emission score & eco grade for current cart items.
    """
    items_list = [item.dict() for item in request.items]
    analysis = calculate_cart_footprint(items_list)
    return analysis


@app.post("/recommendations")
def recommendations(request: RecommendationsRequest):
    """
    Endpoint 3: Recommends lower carbon alternative products for items in cart.
    """
    items_list = [item.dict() for item in request.items]
    recs = generate_cart_recommendations(items_list)
    return {
        "total_recommendations": len(recs),
        "recommendations": recs
    }


@app.post("/predict-budget")
def predict_budget(request: BudgetPredictRequest):
    """
    Endpoint 4: ML Linear Regression model predicting end-of-month footprint vs 50kg budget.
    """
    predictor = CarbonBudgetPredictor(target_monthly_limit_kg=request.target_monthly_limit_kg or 50.0)
    prediction = predictor.predict_month_end(
        history_emissions_kg=request.history_emissions_kg or [],
        current_cart_co2_kg=request.current_cart_co2_kg
    )
    return prediction
