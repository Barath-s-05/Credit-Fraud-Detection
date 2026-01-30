# AI Credit Card Fraud Detection System

A modern full-stack application for detecting credit card fraud using machine learning. Features a React frontend with real-time analytics, a FastAPI backend with ML model integration, and a Streamlit dashboard for data visualization.

## 🏗️ Project Structure

```
Credit/
├── backend/              # FastAPI server
│   ├── main.py           # API endpoints
│   └── requirements.txt  # Dependencies
├── frontend/             # React application
│   ├── public/
│   ├── src/
│   │   ├── App.js        # Main application
│   │   └── index.js
│   └── package.json
├── dashboard/            # Streamlit analytics
│   └── dashboard.py
├── model_training/       # Pre-trained model
│   ├── fraud_model.py
│   ├── model.pkl
│   └── scaler.pkl
└── data/                 # Dataset
    └── creditcard.csv
```

## 🚀 Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Start the backend server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
Backend will run on `http://127.0.0.1:8000` or `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```
Frontend will run on `http://localhost:3000`

### Streamlit Dashboard

1. Navigate to dashboard directory:
```bash
cd dashboard
```

2. Install Streamlit:
```bash
pip install streamlit plotly pandas scikit-learn matplotlib seaborn numpy
```

3. Run the dashboard:
```bash
streamlit run dashboard.py
```

## 🔧 Backend Details

The backend is built with FastAPI and includes:
- Real-time fraud prediction API
- Cross-origin resource sharing (CORS) enabled
- Pydantic data validation
- Confidence scoring for predictions
- ML model loading and inference

## 📋 API Endpoints

### GET /
- Status check endpoint
- Returns: `{"status": "Fraud Detection API Running"}`

### POST /predict
- Fraud prediction endpoint
- Request body:
```json
{
  "amount": 100.50,
  "time": 3600,
  "V1": 0.0,
  "V2": 0.0,
  // ... V3-V28 (optional, defaults to 0)
}
```
- Response:
```json
{
  "prediction": "Legitimate" | "Fraud",
  "confidence": 95.2
}
```

## 🎨 Features

### Frontend
- Modern glassmorphism UI with dark theme
- Real-time fraud prediction interface
- Interactive analytics dashboard
- Feature importance visualization
- Responsive design for all devices
- Framer Motion animations
- Material UI components

### Backend
- FastAPI REST API framework
- Pydantic data validation
- Cross-origin resource sharing (CORS)
- ML model integration with joblib
- Real-time prediction with confidence scoring
- Uvicorn ASGI server

### Dashboard
- Streamlit data visualization
- Model performance metrics
- Feature analysis and correlation
- Fraud distribution charts
- Interactive plots with Plotly

## 🤖 Model Information

- **Algorithm**: Random Forest Classifier
- **Features**: 30 features (Amount, Time, V1-V28 PCA components)
- **Training Data**: Credit card transactions dataset
- **Output**: Binary classification (Fraud/Normal)
- **Model Format**: Pickle (.pkl) files
- **Preprocessing**: StandardScaler normalization

## 🔧 Technologies Used

### Backend Stack
- **Framework**: FastAPI
- **Server**: Uvicorn (ASGI)
- **ML Integration**: Joblib, Scikit-learn
- **Data Processing**: Pandas, NumPy

### Frontend Stack
- **Framework**: React
- **UI Library**: Material UI
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Styling**: CSS3 with glassmorphism effects

### Dashboard Stack
- **Framework**: Streamlit
- **Visualization**: Plotly, Matplotlib, Seaborn

### Deployment
- **Containerization**: Docker ready
- **Environment**: Cross-platform compatible

## 📊 Analytics Dashboard

The Streamlit dashboard provides:
- Dataset overview and statistics
- Fraud vs normal transaction analysis
- Feature importance visualization
- Model performance metrics
- Correlation heatmaps

## 🚀 Production Deployment

For production deployment:
1. Use a WSGI server like Gunicorn for backend
2. Build the React app with `npm run build`
3. Set up reverse proxy with Nginx
4. Configure environment variables for security

## 📄 License

This project is open-source and available under the MIT License.