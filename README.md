# Injury Prediction and Prevention

## Overview

Injury Prediction and Prevention is a sophisticated web application designed to help athletes and coaches reduce sports injury risks through advanced machine learning and tailored recommendations. Powered by an ensemble of RandomForest and XGBoost models, it predicts injury risk levels (Low, Medium, High) with ~92% accuracy, analyzing factors like training intensity, fatigue, and injury history. The app features a Cohere-powered chatbot for injury-related queries and a sleek web interface for seamless interaction, making it an essential tool for sports professionals.

## Key Features

- **Accurate Injury Risk Prediction**: Combines RandomForest and XGBoost with probability calibration for reliable risk assessment
- **Personalized Prevention Plans**: Delivers evidence-based, athlete-specific injury prevention strategies
- **AI-Powered Chatbot**: Leverages Cohere's API to answer sports injury questions interactively
- **Intuitive Web Interface**: Streamlined frontend for easy data input and result visualization
- **Robust ML Pipeline**: Includes Jupyter notebooks for model training, tuning, and calibration

## Technical Specifications

### Machine Learning Architecture
- **Model Performance**: Ensemble model achieving ~0.915 F1-macro score on a 10,000-record dataset
- **Data Preprocessing**: Handles categorical encoding, feature engineering (e.g., `Intensity_Ratio`), and SMOTE for class imbalance
- **Probability Calibration**: Logistic regression calibrator ensures accurate injury likelihood estimates
- **Web Framework**: Built with Flask and Flask-CORS for robust API and frontend integration
- **Frontend**: Responsive HTML/CSS/JavaScript interface
- **External API**: Integrates Cohere's NLP for chatbot functionality

## Project Structure

```
Injury-Prediction-and-Prevention/
├── api/
│   ├── app.py                    # Flask server for API and frontend
│   ├── preprocessing.py          # Data preprocessing and feature engineering
│   ├── predict.py               # Injury risk prediction logic
│   └── recommendation.py        # Personalized prevention recommendations
├── model/
│   ├── likelihood_calibrator.pkl    # Probability calibration model
│   ├── rf_injury_model.pkl         # Trained RandomForest model
│   ├── rf_target_encoder.pkl       # RandomForest label encoder
│   ├── xgboost_injury_model.pkl    # Trained XGBoost model
│   └── xgb_target_encoder.pkl      # XGBoost label encoder
├── notebooks/
│   ├── CalibrateLikelihood.ipynb   # Probability calibration
│   ├── RandomForest.ipynb          # RandomForest model training
│   └── XGBOOST.ipynb              # XGBoost model training
├── UI/                            # Frontend HTML, CSS, JS files
├── README.md                      # Project documentation
└── requirements.txt               # Python dependencies
```

## Installation and Setup

### Prerequisites
- Python 3.8+
- Git
- Cohere API token (sign up at https://cohere.ai/)
- Pre-trained model files (in model/ or generated via notebooks)

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/Injury-Prediction-and-Prevention.git
   cd Injury-Prediction-and-Prevention
   ```

2. **Set Up Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

### Required Dependencies

The following packages are specified in `requirements.txt`:

- `flask==2.3.3`: Web framework for the application
- `flask-cors==4.0.1`: Handles cross-origin requests
- `pandas==2.2.2`: Data manipulation and analysis
- `numpy==1.26.4`: Numerical computations
- `scikit-learn==1.5.1`: Machine learning utilities
- `xgboost==2.1.1`: Gradient boosting for predictions
- `joblib==1.4.2`: Model serialization
- `requests==2.32.3`: HTTP requests for API calls
- `imbalanced-learn==0.12.3`: Handles imbalanced datasets

### Configuration

1. **Configure Cohere API**
   
   Add your Cohere API token to `api/app.py`:
   ```python
   COHERE_API_TOKEN = "your-cohere-api-token"
   ```

2. **Prepare Models**
   
   Use pre-trained `.pkl` files in `model/` or generate them by running:
   - `notebooks/RandomForest.ipynb`
   - `notebooks/XGBOOST.ipynb`
   - `notebooks/CalibrateLikelihood.ipynb`
   
   **Note**: Ensure `.pkl` files are in `model/` directory.

3. **Verify Frontend**
   
   Confirm `UI/` contains `index.html`, `calculator.html`, `about.html`, and `chatbot.html`.

## Usage

### Running the Application

1. **Launch the Flask Server**
   ```bash
   cd api
   python app.py
   ```
   
   Access the application at `http://127.0.0.1:8000`

2. **Navigate the Interface**
   - **Home**: `http://127.0.0.1:8000` (overview)
   - **Calculator**: `/calculator.html` (input athlete data)
   - **Chatbot**: `/chatbot.html` (injury queries)
   - **About**: `/about.html` (project details)

### API Endpoints

- `GET /`: Serves `index.html`
- `GET /calculator.html`: Prediction form
- `GET /about.html`: About page
- `GET /chatbot.html`: Chatbot interface
- `POST /predict`: Predicts injury risk

## Model Training

To retrain models from scratch:

1. **Install Additional Dependencies**
   ```bash
   pip install jupyter matplotlib seaborn
   ```

2. **Run Training Notebooks**
   
   Execute the following notebooks in `notebooks/` with `Refined_Sports_Injury_Dataset.csv`:
   - `RandomForest.ipynb`: Trains RandomForest with hyperparameter tuning
   - `XGBOOST.ipynb`: Trains XGBoost with GridSearchCV
   - `CalibrateLikelihood.ipynb`: Calibrates ensemble probabilities

3. **Deploy Models**
   
   Move generated `.pkl` files to `model/` directory.

## Hugging Face Integration

### Model Repository
The trained models and datasets are available on Hugging Face Hub for easy access and deployment:

- **Repository**: https://huggingface.co/spaces/AmrGaberr/Injury_Prediction_System
- **Model Cards**: Detailed documentation of model performance, training data, and usage instructions
- **Datasets**: Access to the refined sports injury dataset used for training




