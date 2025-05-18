import pandas as pd

def preprocess_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Preprocess input data for injury risk prediction.
    
    Args:
        df (pd.DataFrame): Input DataFrame with raw features.
    
    Returns:
        pd.DataFrame: Processed DataFrame with engineered features.
    """
    # Input validation
    required_columns = [
        "Age", "Gender", "Sport_Type", "Experience_Level", "Flexibility_Score",
        "Total_Weekly_Training_Hours", "High_Intensity_Training_Hours", "Strength_Training_Frequency",
        "Recovery_Time_Between_Sessions", "Training_Load_Score", "Sprint_Speed", "Endurance_Score",
        "Agility_Score", "Fatigue_Level", "Previous_Injury_Count", "Previous_Injury_Type"
    ]
    
    # Check for missing columns
    missing_cols = [col for col in required_columns if col not in df.columns]
    if missing_cols:
        raise ValueError(f"Missing required columns: {missing_cols}")
    
    # Create a copy to avoid modifying the original DataFrame
    df_processed = df.copy()
    
    # Handle missing values (fill with median)
    df_processed.fillna(df_processed.median(), inplace=True)
    
    # Replace 0 with 0.1 in Total_Weekly_Training_Hours to avoid division by zero
    df_processed["Total_Weekly_Training_Hours"] = df_processed["Total_Weekly_Training_Hours"].replace(0, 0.1)
    
    # Create derived features
    df_processed["Intensity_Ratio"] = df_processed["High_Intensity_Training_Hours"] / df_processed["Total_Weekly_Training_Hours"]
    df_processed["Recovery_Per_Training"] = df_processed["Recovery_Time_Between_Sessions"] / df_processed["Total_Weekly_Training_Hours"]
    
    # Define final feature set (excluding Predicted_Injury_Type)
    model_features = [
        "Age", "Gender", "Sport_Type", "Experience_Level", "Flexibility_Score",
        "Total_Weekly_Training_Hours", "High_Intensity_Training_Hours", "Strength_Training_Frequency",
        "Recovery_Time_Between_Sessions", "Training_Load_Score", "Sprint_Speed", "Endurance_Score",
        "Agility_Score", "Fatigue_Level", "Previous_Injury_Count", "Previous_Injury_Type",
        "Intensity_Ratio", "Recovery_Per_Training"
    ]
    
    return df_processed[model_features]