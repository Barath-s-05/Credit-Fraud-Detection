from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import pandas as pd
from pydantic import BaseModel
from typing import Optional
import os
from collections import Counter

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model and scalers
model_path = os.path.join("..", "model_training", "model.pkl")
scaler_amount_path = os.path.join("..", "model_training", "scaler_amount.pkl")
scaler_time_path = os.path.join("..", "model_training", "scaler_time.pkl")
feature_names_path = os.path.join("..", "model_training", "feature_names.pkl")

try:
    model = joblib.load(model_path)
    scaler_amount = joblib.load(scaler_amount_path)
    scaler_time = joblib.load(scaler_time_path)
    feature_names = joblib.load(feature_names_path)
    print("Model and scalers loaded successfully")
    print(f"Feature names: {feature_names[:5]}...")  # Show first 5 features
except FileNotFoundError as e:
    print(f"Error loading model: {e}")
    raise

class PredictionRequest(BaseModel):
    amount: float
    time: float
    V1: Optional[float] = 0.0
    V2: Optional[float] = 0.0
    V3: Optional[float] = 0.0
    V4: Optional[float] = 0.0
    V5: Optional[float] = 0.0
    V6: Optional[float] = 0.0
    V7: Optional[float] = 0.0
    V8: Optional[float] = 0.0
    V9: Optional[float] = 0.0
    V10: Optional[float] = 0.0
    V11: Optional[float] = 0.0
    V12: Optional[float] = 0.0
    V13: Optional[float] = 0.0
    V14: Optional[float] = 0.0
    V15: Optional[float] = 0.0
    V16: Optional[float] = 0.0
    V17: Optional[float] = 0.0
    V18: Optional[float] = 0.0
    V19: Optional[float] = 0.0
    V20: Optional[float] = 0.0
    V21: Optional[float] = 0.0
    V22: Optional[float] = 0.0
    V23: Optional[float] = 0.0
    V24: Optional[float] = 0.0
    V25: Optional[float] = 0.0
    V26: Optional[float] = 0.0
    V27: Optional[float] = 0.0
    V28: Optional[float] = 0.0

@app.get("/")
def home():
    return {"status": "Fraud Detection API Running"}

@app.get("/data-insights")
def get_data_insights():
    try:
        # Load the credit card data
        data_path = os.path.join("..", "data", "creditcard.csv")
        df = pd.read_csv(data_path)
        
        # Basic statistics
        total_transactions = len(df)
        fraud_count = df["Class"].sum()
        legitimate_count = total_transactions - fraud_count
        fraud_rate = (fraud_count / total_transactions) * 100
        
        # Amount statistics
        avg_amount = df["Amount"].mean()
        max_amount = df["Amount"].max()
        min_amount = df["Amount"].min()
        
        # Time statistics
        avg_time = df["Time"].mean()
        
        # Fraud vs Legitimate amount comparison
        fraud_amounts = df[df["Class"] == 1]["Amount"]
        legit_amounts = df[df["Class"] == 0]["Amount"]
        
        avg_fraud_amount = fraud_amounts.mean()
        avg_legit_amount = legit_amounts.mean()
        
        # Time-based patterns
        df["Hour"] = (df["Time"] / 3600).astype(int) % 24
        fraud_by_hour = df[df["Class"] == 1]["Hour"].value_counts().sort_index()
        legit_by_hour = df[df["Class"] == 0]["Hour"].value_counts().sort_index()
        
        # Top 5 hours with most fraud
        top_fraud_hours = fraud_by_hour.nlargest(5).to_dict()
        
        # Amount distribution insights
        low_amount_fraud = len(fraud_amounts[fraud_amounts <= 10])
        medium_amount_fraud = len(fraud_amounts[(fraud_amounts > 10) & (fraud_amounts <= 100)])
        high_amount_fraud = len(fraud_amounts[fraud_amounts > 100])
        
        # Return comprehensive insights
        return {
            "overview": {
                "total_transactions": int(total_transactions),
                "fraud_count": int(fraud_count),
                "legitimate_count": int(legitimate_count),
                "fraud_rate": round(float(fraud_rate), 2)
            },
            "amount_stats": {
                "average_transaction": round(float(avg_amount), 2),
                "max_transaction": round(float(max_amount), 2),
                "min_transaction": round(float(min_amount), 2),
                "avg_fraud_amount": round(float(avg_fraud_amount), 2),
                "avg_legit_amount": round(float(avg_legit_amount), 2)
            },
            "time_patterns": {
                "average_time": round(float(avg_time), 2),
                "top_fraud_hours": top_fraud_hours,
                "fraud_by_hour": fraud_by_hour.to_dict(),
                "legit_by_hour": legit_by_hour.to_dict()
            },
            "fraud_distribution": {
                "low_amount": int(low_amount_fraud),
                "medium_amount": int(medium_amount_fraud),
                "high_amount": int(high_amount_fraud)
            }
        }
    except Exception as e:
        print(f"Error getting data insights: {e}")
        raise HTTPException(status_code=500, detail=f"Data insights error: {str(e)}")

@app.post("/predict")
def predict(request: PredictionRequest):
    try:
        # Extract values from the request
        amount = request.amount
        time = request.time
        
        # Scale amount and time separately using their respective scalers
        scaled_amount = scaler_amount.transform([[amount]])[0][0]
        scaled_time = scaler_time.transform([[time]])[0][0]
        
        # Create the feature vector in the correct order: [V1-V28, scaled_amount, scaled_time]
        # Initialize with default values (0) for V1-V28 if not provided
        feature_dict = {'scaled_amount': scaled_amount, 'scaled_time': scaled_time}
        
        # Add V1-V28 features (default to 0 if not provided)
        for i in range(1, 29):
            feature_name = f'V{i}'
            feature_value = getattr(request, feature_name, 0.0)
            feature_dict[feature_name] = feature_value
        
        # Create feature vector in the correct order as used during training
        feature_vector = [feature_dict[name] for name in feature_names]
        
        # Convert to numpy array
        features_array = np.array(feature_vector).reshape(1, -1)
        scaled_features = features_array
        
        # Make prediction
        prediction = model.predict(scaled_features)[0]
        prediction_proba = model.predict_proba(scaled_features)[0]
        
        # Get the confidence score (probability of the predicted class)
        confidence = max(prediction_proba) * 100
        
        # Get individual class probabilities
        fraud_prob = prediction_proba[1] * 100  # Probability of fraud
        legit_prob = prediction_proba[0] * 100  # Probability of legitimate
        
        # Enhanced fraud detection logic
        # Flag as fraud if:
        # 1. Model predicts fraud OR
        # 2. Fraud probability > 20% OR 
        # 3. Amount > $50,000 OR
        # 4. Suspicious time patterns
        
        is_fraud = (prediction == 1 or 
                   fraud_prob > 20 or 
                   amount > 50000 or 
                   (amount > 10000 and time < 300) or  # High amount + very fast
                   (amount > 10000 and time > 72000))  # High amount + very slow
        
        result = "Fraud" if is_fraud else "Legitimate"
        
        return {
            "prediction": result,
            "confidence": round(float(confidence), 2),
            "fraud_probability": round(float(fraud_prob), 2),
            "legitimate_probability": round(float(legit_prob), 2)
        }
        
    except Exception as e:
        print(f"Error in prediction: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)