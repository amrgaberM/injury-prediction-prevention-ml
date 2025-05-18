# Injury Prediction and Prevention

Injury Prediction and Prevention is a sophisticated web application designed to help athletes and coaches reduce sports injury risks through advanced machine learning and tailored recommendations. Powered by an ensemble of RandomForest and XGBoost models, it predicts injury risk levels (Low, Medium, High) with ~92% accuracy, analyzing factors like training intensity, fatigue, and injury history. The app features a Cohere-powered chatbot for injury-related queries and a sleek web interface for seamless interaction, making it an essential tool for sports professionals.

## Key Features
- Accurate Injury Risk Prediction: Combines RandomForest and XGBoost with probability calibration for reliable risk assessment.
- Personalized Prevention Plans: Delivers evidence-based, athlete-specific injury prevention strategies.
- AI-Powered Chatbot: Leverages Cohere's API to answer sports injury questions interactively.
- Intuitive Web Interface: Streamlined frontend for easy data input and result visualization.
- Robust ML Pipeline: Includes Jupyter notebooks for model training, tuning, and calibration.

## Technical Highlights
- Machine Learning: Ensemble model achieving ~0.915 F1-macro score on a 10,000-record dataset.
- Data Preprocessing: Handles categorical encoding, feature engineering (e.g., `Intensity_Ratio`), and SMOTE for class imbalance.
- Probability Calibration: Logistic regression calibrator ensures accurate injury likelihood estimates.
- Web Framework: Built with Flask and Flask-CORS for robust API and frontend integration.
- Frontend: Responsive HTML/CSS/JavaScript interface.
- External API: Integrates Cohere's NLP for chatbot functionality.

## Project Structure
Injury-Prediction-and-Prevention/
api/
app.py                    # Flask server for API and frontend
preprocessing.py          # Data preprocessing and feature engineering
predict.py                # Injury risk prediction logic
recommendation.py         # Personalized prevention recommendations
model/
likelihood_calibrator.pkl # Probability calibration model
rf_injury_model.pkl       # Trained RandomForest model
rf_target_encoder.pkl     # RandomForest label encoder
xgboost_injury_model.pkl  # Trained XGBoost model
xgb_target_encoder.pkl    # XGBoost label encoder
notebooks/
CalibrateLikelihood.ipynb # Probability calibration
RandomForest.ipynb        # RandomForest model training
XGBOOST.ipynb             # XGBoost model training
UI2/                        # Frontend HTML, CSS, JS files
README.md                   # Project documentation
requirements.txt            # Python dependencies

## Getting Started

### Prerequisites
- Python 3.8+
- Git
- Cohere API token (sign up at https://cohere.ai/)
- Pre-trained model files (in model/ or generated via notebooks)

### Installation
1. Clone the Repository:
   git clone https://github.com/yourusername/Injury-Prediction-and-Prevention.git
   cd Injury-Prediction-and-Prevention

2. Set Up Virtual Environment:
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate

3. Install Dependencies:
   pip install -r requirements.txt
   Example requirements.txt:
   flask==2.3.3
   flask-cors==4.0.1
   pandas==2.2.2
   numpy==1.26.4
   scikit-learn==1.5.1
   xgboost==2.1.1
   joblib==1.4.2
   requests==2.32.3
   imbalanced-learn==0.12.3

4. Configure Cohere API:
   Add your Cohere API token to api/app.py:
   COHERE_API_TOKEN = "your-cohere-api-token"

5. Prepare Models:
   Use pre-trained .pkl files in model/ or generate them by running:
   - notebooks/RandomForest.ipynb
   - notebooks/XGBOOST.ipynb
   - notebooks/CalibrateLikelihood.ipynb
   Ensure .pkl files are in model/.

6. Verify Frontend:
   Confirm UI2/ contains index.html, calculator.html, about.html, and chatbot.html.

### Running the Application
1. Launch the Flask Server:
   cd api
   python app.py
   Access at http://127.0.0.1:8000.

2. Explore the Interface:
   - Home: http://127.0.0.1:8000 (overview)
   - Calculator: /calculator.html (input athlete data)
   - Chatbot: /chatbot.html (injury queries)
   - About: /about.html (project details)

## API Endpoints
- GET /: Serves index.html.
- GET /calculator.html: Prediction form.
- GET /about.html: About page.
- GET /chatbot.html: Chatbot interface.
- POST /predict: Predicts injury risk.

## Model Training
To retrain models:
1. Install Jupyter:
   pip install jupyter matplotlib seaborn
2. Run notebooks in notebooks/ with Refined_Sports_Injury_Dataset.csv:
   - RandomForest.ipynb: Trains RandomForest with hyperparameter tuning.
   - XGBOOST.ipynb: Trains XGBoost with GridSearchCV.
   - CalibrateLikelihood.ipynb: Calibrates ensemble probabilities.
3. Move .pkl files to model/.

