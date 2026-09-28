"""
GreenTrace Machine Learning Module
CarbonBudgetPredictor: Uses Scikit-Learn Linear Regression to analyze recent shopping emission trends
and forecast month-end total carbon footprint against a user target limit (e.g. 50 kg CO2).
"""

import numpy as np
from sklearn.linear_model import LinearRegression


class CarbonBudgetPredictor:
    def __init__(self, target_monthly_limit_kg: float = 50.0):
        self.target_monthly_limit_kg = target_monthly_limit_kg
        self.model = LinearRegression()

    def predict_month_end(self, history_emissions_kg: list, current_cart_co2_kg: float) -> dict:
        """
        Fits past N shopping trips + current pending cart to project month-end footprint.
        """
        # If no history provided, supply reasonable baseline trend data
        if not history_emissions_kg:
            history_emissions_kg = [4.2, 7.8, 12.1, 18.4, 25.0]
            
        cumulative = np.cumsum(history_emissions_kg + [current_cart_co2_kg])
        trip_numbers = np.arange(1, len(cumulative) + 1).reshape(-1, 1)
        
        # Train linear model on shopping trip history
        self.model.fit(trip_numbers, cumulative)
        
        # Assume 10 shopping trips per month average
        projected_trips = 10
        projected_total_co2 = float(self.model.predict(np.array([[projected_trips]]))[0])
        projected_total_co2 = round(max(current_cart_co2_kg, projected_total_co2), 2)
        
        exceeds_budget = projected_total_co2 > self.target_monthly_limit_kg
        budget_delta_kg = round(projected_total_co2 - self.target_monthly_limit_kg, 2)
        percentage_used = round((projected_total_co2 / self.target_monthly_limit_kg) * 100, 1)
        
        # Personalized intelligent alerts
        if exceeds_budget:
            status_level = "CRITICAL_WARNING"
            message = (
                f"⚠️ Carbon Budget Alert: At your current consumption trajectory, your projected end-of-month footprint "
                f"will reach {projected_total_co2} kg CO₂, exceeding your {self.target_monthly_limit_kg} kg target limit by "
                f"{budget_delta_kg} kg! We recommend adopting 2 high-impact eco-swaps in your cart."
            )
            recommendation_tip = "Try replacing single-use plastics and red meat items in your active cart."
        elif percentage_used > 80.0:
            status_level = "MODERATE_WARNING"
            message = (
                f"⚡ Near Budget Ceiling: You are projected to reach {projected_total_co2} kg CO₂ "
                f"({percentage_used}% of your monthly limit). Keeping an eye on packaging can keep you green!"
            )
            recommendation_tip = "Swapping 1 item to an eco alternative will ensure you stay below budget."
        else:
            status_level = "EXCELLENT"
            message = (
                f"🌱 Climate Champions League! Your current spending trajectory forecasts {projected_total_co2} kg CO₂, "
                f"well within your {self.target_monthly_limit_kg} kg monthly green quota ({percentage_used}% target)."
            )
            recommendation_tip = "Keep up the great work! You are saving significant emissions this month."

        # Model slope (velocity of CO2 increase per trip)
        growth_rate_per_trip = round(float(self.model.coef_[0]), 2)

        return {
            "current_cart_co2_kg": current_cart_co2_kg,
            "target_monthly_limit_kg": self.target_monthly_limit_kg,
            "projected_month_end_co2_kg": projected_total_co2,
            "exceeds_budget": exceeds_budget,
            "budget_delta_kg": budget_delta_kg,
            "percentage_used": percentage_used,
            "growth_rate_per_trip": growth_rate_per_trip,
            "status_level": status_level,
            "message": message,
            "recommendation_tip": recommendation_tip,
            "historical_trend": [round(val, 2) for val in cumulative.tolist()],
            "projected_trendline": [
                round(float(self.model.predict(np.array([[i]]))[0]), 2)
                for i in range(1, projected_trips + 1)
            ]
        }
