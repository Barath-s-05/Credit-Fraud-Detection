from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import json
import os
import random
import shap

app = FastAPI(title="Credit Card Fraud Detection API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for models and data
model = None
scaler_amount = None
scaler_time = None
reference_data = None
metrics_data = None
explainer = None

class PredictionRequest(BaseModel):
    amount: float
    time: float | None = None

@app.on_event("startup")
def load_assets():
    global model, scaler_amount, scaler_time, reference_data, metrics_data, explainer
    
    base_dir = os.path.dirname(__file__)
    
    try:
        model_path = os.path.join(base_dir, 'xgboost_model.joblib')
        model = joblib.load(model_path)
        
        scaler_amount = joblib.load(os.path.join(base_dir, 'scaler_amount.joblib'))
        scaler_time = joblib.load(os.path.join(base_dir, 'scaler_time.joblib'))
        
        reference_data_path = os.path.join(base_dir, 'data', 'reference_data.csv')
        reference_data = pd.read_csv(reference_data_path)
        
        metrics_path = os.path.join(base_dir, 'metrics.json')
        with open(metrics_path, 'r') as f:
            metrics_data = json.load(f)
            
        # Initialize SHAP explainer
        explainer = shap.TreeExplainer(model)
        print("Backend assets loaded successfully.")
    except Exception as e:
        print(f"Error loading assets: {e}. Models might not have been trained yet.")

@app.post("/predict")
def predict(request: PredictionRequest):
    if reference_data is None or model is None:
        raise HTTPException(status_code=503, detail="Models or data not loaded yet")
        
    sample = reference_data.sample(1).iloc[0].drop('Class')
    
    # Replace Amount
    amount_val = np.array([[request.amount]])
    amount_scaled = scaler_amount.transform(amount_val)[0][0]
    
    # Replace Time if provided, else use the sampled one
    if request.time is not None:
        time_val = np.array([[request.time]])
    else:
        time_val = np.array([[sample['Time']]])
    time_scaled = scaler_time.transform(time_val)[0][0]
    
    # V1..V28 (in order)
    feature_names = [col for col in sample.index if col not in ['Time', 'Amount', 'Class']]
    row_data = {f: [sample[f]] for f in feature_names}
    row_data['Amount_Scaled'] = [amount_scaled]
    row_data['Time_Scaled'] = [time_scaled]
    
    df_features = pd.DataFrame(row_data)
    
    # Predict
    proba = model.predict_proba(df_features)[0][1]
    
    # Risk Level logic
    threshold = metrics_data.get('threshold', 0.5)
    
    if proba > 0.8:
        risk_level = "High"
    elif proba > threshold:
        risk_level = "Medium"
    else:
        risk_level = "Low"
        
    is_fraud = bool(proba >= threshold)
    
    # SHAP Values
    shap_values = explainer.shap_values(df_features)
    feature_impacts = []
    
    # shap_values could be a list for multi-class or single array
    # for XGBClassifier binary, shap_values is typically a 2D array (samples, features)
    sv = shap_values[0] if isinstance(shap_values, list) else shap_values[0]
        
    for i, col in enumerate(df_features.columns):
        feature_impacts.append({
            "feature": col,
            "impact": float(sv[i]),
            "value": float(df_features.iloc[0, i])
        })
        
    feature_impacts.sort(key=lambda x: abs(x["impact"]), reverse=True)
    top_features = feature_impacts[:5]
    
    return {
        "is_fraud": is_fraud,
        "probability": float(proba),
        "risk_level": risk_level,
        "threshold_used": float(threshold),
        "shap_explanation": top_features
    }

@app.get("/metrics")
def get_metrics():
    if metrics_data is None:
        raise HTTPException(status_code=503, detail="Metrics not loaded")
    return metrics_data

@app.get("/data")
def get_data(limit: int = 100):
    if reference_data is None:
        raise HTTPException(status_code=503, detail="Data not loaded")
    return reference_data.sample(min(limit, len(reference_data))).to_dict(orient="records")

@app.post("/simulate")
def simulate(fraud_probability: float = 0.1):
    force_fraud = random.random() < fraud_probability
    
    amount_base = random.expovariate(1/100)
    if force_fraud:
        amount = amount_base * random.uniform(5, 20)
    else:
        amount = amount_base
        
    time_val = random.uniform(0, 172792)
    
    req = PredictionRequest(amount=amount, time=time_val)
    result = predict(req)
    result["amount"] = req.amount
    result["time"] = req.time
    result["id"] = random.randint(100000, 999999)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
