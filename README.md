# Injury Prediction and Prevention

![Injury Prediction and Prevention](https://via.placeholder.com/1200x300.png?text=Injury+Prediction+and+Prevention)

**Injury Prediction and Prevention** is a sophisticated web application designed to help athletes and coaches reduce sports injury risks through advanced machine learning and tailored recommendations. Powered by an ensemble of RandomForest and XGBoost models, it predicts injury risk levels (Low, Medium, High) with ~92% accuracy, analyzing factors like training intensity, fatigue, and injury history. The app features a Cohere-powered chatbot for injury-related queries and a sleek web interface for seamless interaction, making it an essential tool for sports professionals.

## 🌟 Key Features
- **Accurate Injury Risk Prediction**: Combines RandomForest and XGBoost with probability calibration for reliable risk assessment.
- **Personalized Prevention Plans**: Delivers evidence-based, athlete-specific injury prevention strategies.
- **AI-Powered Chatbot**: Leverages Cohere's API to answer sports injury questions interactively.
- **Intuitive Web Interface**: Streamlined frontend for easy data input and result visualization.
- **Robust ML Pipeline**: Includes Jupyter notebooks for model training, tuning, and calibration.

## 🛠️ Technical Highlights
- **Machine Learning**: Ensemble model achieving ~0.915 F1-macro score on a 10,000-record dataset.
- **Data Preprocessing**: Handles categorical encoding, feature engineering (e.g., `Intensity_Ratio`), and SMOTE for class imbalance.
- **Probability Calibration**: Logistic regression calibrator ensures accurate injury likelihood estimates.
- **Web Framework**: Built with Flask and Flask-CORS for robust API and frontend integration.
- **Frontend**: Responsive HTML/CSS/JavaScript interface.
- **External API**: Integrates Cohere's NLP for chatbot functionality.

## 📂 Project Structure
Injury-Prediction-and-Prevention/
├── api/
│   ├── preprocessing.py       # Data preprocessing and feature engineering
│   ├── app.py                # Flask server for API and frontend
│   ├── recommendation.py      # Personalized prevention recommendations
│   ├── predict.py            # Injury risk prediction logic
├── model/
│   ├── rf_injury_model.pkl   # Trained RandomForest model
│   ├── xgboost_injury_model.pkl # Trained XGBoost model
│   ├── likelihood_calibrator.pkl # Probability calibration model
│   ├── rf_target_encoder.pkl  # RandomForest label encoder
│   ├── xgb_target_encoder.pkl # XGBoost label encoder
├── notebooks/
│   ├── RandomForest.ipynb    # RandomForest model training
│   ├── XGBOOST.ipynb         # XGBoost model training
│   ├── CalibrateLikelihood.ipynb # Probability calibration
├── UI/                      # Frontend HTML, CSS, JS files
├── README.md                 # Project documentation
└── requirements.txt          # Python dependencies

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Git
- Cohere API token ([sign up](https://cohere.ai/))
- Pre-trained model files (in `model/` or generated via notebooks)

### Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/injury-prediction-prevention-ml.git
   cd Injury-Prediction-and-Prevention
