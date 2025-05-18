from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from predict import predict_injury_risk
from recommendation import generate_recommendations
import os
import requests
import json
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Define paths using relative paths
# Frontend folder is at final 3/UI2, so go up two levels from api to final 3, then into UI2
FRONTEND_FOLDER = os.path.join(os.path.dirname(__file__), "..", "..", "UI2")

app = Flask(__name__, static_folder=FRONTEND_FOLDER, static_url_path="")
CORS(app)

# Cohere API setup
COHERE_API_TOKEN = ""  # Replace with your Cohere API token
COHERE_API_URL = "https://api.cohere.ai/v1/generate"

# System prompt for context
SYSTEM_PROMPT = (
    "You are AthleteGuard AI, an assistant for a sports injury prediction system. "
    "Answer questions about sports injuries, prevention, and the system concisely (under 100 words). "
    "Context: Sports injuries result from overuse, improper technique, or insufficient recovery. "
    "Shin splints are caused by repetitive stress, often from running or improper footwear. "
    "Prevent injuries with balanced training, proper gear, and fatigue monitoring. "
    "The system uses RandomForest and XGBoost to predict injury risk with 92% accuracy. "
    "For personal injury risk queries, prompt the user to provide data via the calculator form."
)

# Serve index.html
@app.route("/", methods=["GET"])
def serve_index():
    return send_from_directory(FRONTEND_FOLDER, "index.html")

# Serve calculator.html
@app.route("/calculator.html", methods=["GET"])
def serve_calculator():
    return send_from_directory(FRONTEND_FOLDER, "calculator.html")

# Serve about.html
@app.route("/about.html", methods=["GET"])
def serve_about():
    return send_from_directory(FRONTEND_FOLDER, "about.html")

# Serve chatbot.html
@app.route("/chatbot.html", methods=["GET"])
def serve_chatbot():
    return send_from_directory(FRONTEND_FOLDER, "chatbot.html")

# Serve static files (JS, CSS)
@app.route("/<path:filename>")
def serve_static_files(filename):
    return send_from_directory(FRONTEND_FOLDER, filename)

# API: Injury prediction
@app.route("/predict", methods=["POST"])
def predict():
    try:
        input_data = request.get_json()
        result = predict_injury_risk(input_data)  # Pass only input_data
        return jsonify(result)
    except Exception as e:
        logger.error(f"Predict endpoint error: {str(e)}")
        return jsonify({"error": str(e)}), 400

# API: Chatbot
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        logger.debug(f"Received chat request: {data}")
        user_input = data.get("message", "").lower()
        user_data = data.get("user_data", None)

        # Check if the query is about prediction
        if "risk" in user_input or "predict" in user_input or "my" in user_input:
            if user_data:
                result = predict_injury_risk(user_data)  # Pass only user_data
                response = (
                    f"Your injury risk is {result['predicted_risk_level']} "
                    f"({result['injury_likelihood_percent']}%). "
                    f"Recommendations: {', '.join(result['recommendations'])}"
                )
            else:
                response = "Please provide details like age, training hours, and fatigue level using the calculator form."
            return jsonify({"response": response, "requires_data": not user_data})

        # Cohere API call for general injury questions
        headers = {
            "Authorization": f"Bearer {COHERE_API_TOKEN}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "command",
            "prompt": f"{SYSTEM_PROMPT}\nUser: {user_input}\nAssistant:",
            "max_tokens": 100,
            "temperature": 0.7
        }
        logger.debug(f"Sending Cohere API request: {payload}")
        response = requests.post(COHERE_API_URL, headers=headers, json=payload)
        logger.debug(f"Cohere API response status: {response.status_code}, content: {response.text}")

        if response.status_code != 200:
            logger.error(f"Cohere API error: {response.status_code} - {response.text}")
            return jsonify({"error": f"Cohere API error: {response.status_code} - {response.text}"}), 500

        try:
            answer = response.json()["generations"][0]["text"].strip()
        except (KeyError, IndexError, TypeError) as e:
            logger.error(f"Unexpected API response format: {str(response.json())}")
            return jsonify({"error": f"Unexpected API response format: {str(response.json())}"}), 500

        # Enhance prevention queries with dynamic recommendations
        if "prevent" in user_input or "avoid" in user_input:
            sample_input = {
                "Fatigue_Level": 5,
                "Recovery_Time_Between_Sessions": 12,
                "Total_Weekly_Training_Hours": 10,
                "High_Intensity_Training_Hours": 3,
                "Previous_Injury_Count": 0,
                "Flexibility_Score": 5,
                "Agility_Score": 5,
                "Strength_Training_Frequency": 2,
                "Experience_Level": 1,
                "Sport_Type": 0
            }
            recs = generate_recommendations(sample_input)
            answer += " Specific tips: " + ", ".join(recs)

        logger.debug(f"Chat response: {answer}")
        return jsonify({"response": answer, "requires_data": False})
    except Exception as e:
        logger.error(f"Chat endpoint error: {str(e)}")
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    try:
        print("Starting Flask server...")
        app.run(debug=True, host="127.0.0.1", port=8000)
    except Exception as e:
        print(f"Error starting Flask server: {str(e)}")
        raise