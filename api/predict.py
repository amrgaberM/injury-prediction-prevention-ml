import pandas as pd
import numpy as np
import joblib
import os
from recommendation import generate_recommendations

# Define mappings for categorical variables (consistent with CalibrateLikelihood.ipynb)
gender_mapping = {"Male": 0, "Female": 1}
experience_mapping = {"Beginner": 0, "Intermediate": 1, "Advanced": 2, "Professional": 3}
injury_type_mapping = {"None": 0, "Sprain": 1, "Ligament Tear": 2, "Tendonitis": 3, "Strain": 4, "Fracture": 5}
sport_type_mapping = {"Football": 0, "Basketball": 1, "Swimming": 2, "Tennis": 3, "Running": 4}
risk_level_mapping = {0: "High", 1: "Low", 2: "Medium"}

# Define model directory using relative path
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "model")

# Load models, encoders, and calibration threshold
try:
    rf_model = joblib.load(os.path.join(MODEL_DIR, "rf_injury_model.pkl"))
    xgb_model = joblib.load(os.path.join(MODEL_DIR, "xgboost_injury_model.pkl"))
    calibrator = joblib.load(os.path.join(MODEL_DIR, "likelihood_calibrator.pkl"))
    rf_encoder = joblib.load(os.path.join(MODEL_DIR, "rf_target_encoder.pkl"))
    xgb_encoder = joblib.load(os.path.join(MODEL_DIR, "xgb_target_encoder.pkl"))
    low_threshold = joblib.load(os.path.join(MODEL_DIR, "calibration_threshold.pkl"))
except FileNotFoundError as e:
    raise FileNotFoundError(f"Model file not found: {str(e)}. Ensure all model files are in {MODEL_DIR}.")

# Verify encoder consistency
if not (rf_encoder.classes_ == xgb_encoder.classes_).all():
    raise ValueError("RandomForest and XGBoost encoders have inconsistent class mappings.")

def preprocess_data(data_dict):
    """
    Preprocess the input data consistently with CalibrateLikelihood.ipynb.
    
    Args:
        data_dict (dict): Input dictionary containing athlete data.
    
    Returns:
        pd.DataFrame: Preprocessed features ready for prediction.
    """
    try:
        df = pd.DataFrame([data_dict])

        df["Gender"] = df["Gender"].map(gender_mapping).fillna(0).astype(int)
        df["Sport_Type"] = df["Sport_Type"].map(sport_type_mapping).fillna(0).astype(int)
        df["Experience_Level"] = df["Experience_Level"].map(experience_mapping).fillna(0).astype(int)
        df["Previous_Injury_Type"] = df["Previous_Injury_Type"].fillna("None")
        df["Previous_Injury_Type"] = df["Previous_Injury_Type"].map(injury_type_mapping).fillna(0).astype(int)

        df["Total_Weekly_Training_Hours"] = df["Total_Weekly_Training_Hours"].replace(0, 0.1)

        df["Intensity_Ratio"] = df["High_Intensity_Training_Hours"] / df["Total_Weekly_Training_Hours"]
        df["Recovery_Per_Training"] = df["Recovery_Time_Between_Sessions"] / df["Total_Weekly_Training_Hours"]

        features = [
            "Age", "Gender", "Sport_Type", "Experience_Level", "Flexibility_Score",
            "Total_Weekly_Training_Hours", "High_Intensity_Training_Hours", "Strength_Training_Frequency",
            "Recovery_Time_Between_Sessions", "Training_Load_Score", "Sprint_Speed", "Endurance_Score",
            "Agility_Score", "Fatigue_Level", "Previous_Injury_Count", "Previous_Injury_Type",
            "Intensity_Ratio", "Recovery_Per_Training"
        ]

        missing_features = [f for f in features if f not in df.columns]
        if missing_features:
            raise ValueError(f"Missing required features: {missing_features}")

        X = df[features]
        return X
    except Exception as e:
        raise Exception(f"Error in preprocessing data: {str(e)}")

def predict_injury_risk(user_input: dict) -> dict:
    """
    Predict injury risk using the ensemble of RandomForest and XGBoost models with calibrated probabilities.
    Uses a data-driven threshold from calibration to classify Low vs. Medium risks.
    
    Args:
        user_input (dict): Input dictionary containing athlete data.
    
    Returns:
        dict: Prediction results including risk level, likelihood, and recommendations.
    """
    print("User Input Received:\n", user_input)

    # Preprocess input
    features = preprocess_data(user_input)
    print("FINAL Features After Preprocessing:", list(features.columns))
    print("Preprocessed Input:\n", features)

    # Predict probabilities from both models
    rf_probs = rf_model.predict_proba(features)
    xgb_probs = xgb_model.predict_proba(features)
    print("RandomForest Probabilities (High, Low, Medium):", rf_probs)
    print("XGBoost Probabilities (High, Low, Medium):", xgb_probs)

    # Ensemble average
    avg_probs = (rf_probs + xgb_probs) / 2
    predicted_class = np.argmax(avg_probs, axis=1)[0]
    confidence = np.max(avg_probs, axis=1)[0]
    predicted_label = rf_encoder.inverse_transform([predicted_class])[0]
    print("Ensemble Probabilities (High, Low, Medium):", avg_probs)
    print("Predicted Class:", predicted_class, "Label:", predicted_label, "Confidence:", confidence)

    # Calibrate the probability using the likelihood calibrator
    calib_data = pd.DataFrame({
        "prob_high": [avg_probs[0][0]],
        "prob_low": [avg_probs[0][1]],
        "prob_medium": [avg_probs[0][2]]
    })
    injury_likelihood = calibrator.predict_proba(calib_data)[:, 1][0] * 100
    print("Calibrated Injury Likelihood (%):", injury_likelihood)

    # Adjust prediction using dynamic threshold based on raw prob_low
    if avg_probs[0][1] > low_threshold and predicted_label != "Low":
        print(f"⚠️ Calibration adjustment: Low probability ({avg_probs[0][1]:.2f}) above threshold ({low_threshold:.2f}) — classifying as Low.")
        predicted_label = "Low"

    # Generate recommendations
    recommendations = generate_recommendations(user_input)

    return {
        "predicted_risk_level": predicted_label,
        "injury_likelihood_percent": round(injury_likelihood, 2),
        "model_class_probability": round(confidence * 100, 2),
        "recommendations": recommendations
    }