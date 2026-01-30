import streamlit as st
import pandas as pd
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Set page config
st.set_page_config(
    page_title="Fraud Detection Model Analytics",
    page_icon="💳",
    layout="wide"
)

# Custom CSS for styling
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        font-weight: 700;
        background: linear-gradient(45deg, #818cf8, #a78bfa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-align: center;
        margin-bottom: 2rem;
    }
    .metric-card {
        background: linear-gradient(135deg, #0f172a, #1e293b);
        padding: 1.5rem;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    .section-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #e2e8f0;
        margin-top: 2rem;
        margin-bottom: 1rem;
    }
</style>
""", unsafe_allow_html=True)

# Header
st.markdown('<h1 class="main-header">💳 Fraud Detection Model Analytics</h1>', unsafe_allow_html=True)

# Load data and model
@st.cache_data
def load_data():
    df = pd.read_csv("../data/creditcard.csv")
    return df

@st.cache_resource
def load_model():
    model = joblib.load("../model_training/model.pkl")
    scaler = joblib.load("../model_training/scaler.pkl")
    return model, scaler

try:
    df = load_data()
    model, scaler = load_model()
    st.success("✅ Data and model loaded successfully!")
except Exception as e:
    st.error(f"❌ Error loading data/model: {str(e)}")
    st.stop()

# Sidebar
st.sidebar.header("📊 Dashboard Controls")
analysis_type = st.sidebar.selectbox(
    "Select Analysis Type",
    ["Dataset Overview", "Fraud vs Normal", "Feature Analysis", "Model Performance"]
)

# Dataset Overview
if analysis_type == "Dataset Overview":
    st.markdown('<h2 class="section-title">Dataset Overview</h2>', unsafe_allow_html=True)
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown('<div class="metric-card">', unsafe_allow_html=True)
        st.metric(label="Total Transactions", value=f"{len(df):,}")
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col2:
        st.markdown('<div class="metric-card">', unsafe_allow_html=True)
        total_fraud = df['Class'].sum()
        st.metric(label="Fraud Cases", value=f"{total_fraud:,}")
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col3:
        st.markdown('<div class="metric-card">', unsafe_allow_html=True)
        fraud_rate = (df['Class'].mean() * 100)
        st.metric(label="Fraud Rate", value=f"{fraud_rate:.2f}%")
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col4:
        st.markdown('<div class="metric-card">', unsafe_allow_html=True)
        total_features = len([col for col in df.columns if col.startswith('V')])
        st.metric(label="Features", value=total_features)
        st.markdown('</div>', unsafe_allow_html=True)
    
    st.markdown("### Dataset Sample")
    st.dataframe(df.head())

# Fraud vs Normal Analysis
elif analysis_type == "Fraud vs Normal":
    st.markdown('<h2 class="section-title">Fraud vs Normal Transactions</h2>', unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### Class Distribution")
        fig = go.Figure(data=[go.Pie(
            labels=['Normal', 'Fraud'],
            values=[len(df[df['Class'] == 0]), len(df[df['Class'] == 1])],
            hole=.3,
            marker_colors=['#10b981', '#ef4444']
        )])
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.markdown("### Transaction Amount Distribution")
        fraud_amounts = df[df['Class'] == 1]['Amount']
        normal_amounts = df[df['Class'] == 0]['Amount']
        
        fig = go.Figure()
        fig.add_trace(go.Histogram(x=normal_amounts, name='Normal', opacity=0.7, marker_color='#10b981'))
        fig.add_trace(go.Histogram(x=fraud_amounts, name='Fraud', opacity=0.7, marker_color='#ef4444'))
        fig.update_layout(barmode='overlay', height=400)
        st.plotly_chart(fig, use_container_width=True)
    
    # Time distribution
    st.markdown("### Transaction Time Distribution")
    fig = px.histogram(df, x='Time', color='Class', nbins=50, 
                       color_discrete_map={'0': '#10b981', '1': '#ef4444'})
    fig.update_layout(height=400)
    st.plotly_chart(fig, use_container_width=True)

# Feature Analysis
elif analysis_type == "Feature Analysis":
    st.markdown('<h2 class="section-title">Feature Analysis</h2>', unsafe_allow_html=True)
    
    # Get feature importance from the model
    feature_names = [f'V{i}' for i in range(1, 29)] + ['Amount', 'Time']
    
    # If model is a Random Forest, get feature importances
    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
        feature_importance_df = pd.DataFrame({
            'Feature': feature_names,
            'Importance': importances
        }).sort_values('Importance', ascending=False).head(15)
        
        st.markdown("### Top 15 Important Features")
        fig = px.bar(feature_importance_df, x='Importance', y='Feature', orientation='h',
                     color='Importance', color_continuous_scale='viridis')
        fig.update_layout(height=600)
        st.plotly_chart(fig, use_container_width=True)
    
    # Correlation heatmap for a subset of features
    st.markdown("### Feature Correlation Heatmap (Subset)")
    corr_columns = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'Amount', 'Class']
    corr_matrix = df[corr_columns].corr()
    
    fig = px.imshow(corr_matrix, 
                    text_auto=True, 
                    aspect="auto",
                    color_continuous_scale='RdBu_r',
                    title="Feature Correlation Matrix")
    fig.update_layout(height=600)
    st.plotly_chart(fig, use_container_width=True)

# Model Performance
else:
    st.markdown('<h2 class="section-title">Model Performance</h2>', unsafe_allow_html=True)
    
    # Show model type
    st.markdown(f"### Model Type: {type(model).__name__}")
    
    # Sample predictions to demonstrate model
    st.markdown("### Model Prediction Demo")
    
    # Take a sample of the data to make predictions on
    sample_size = min(1000, len(df))
    sample_data = df.sample(n=sample_size, random_state=42)
    
    # Prepare features (excluding 'Class' column)
    X_sample = sample_data.drop('Class', axis=1)
    
    # Make predictions
    predictions = model.predict(X_sample)
    actuals = sample_data['Class']
    
    # Calculate metrics
    from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
    
    accuracy = accuracy_score(actuals, predictions)
    precision = precision_score(actuals, predictions, zero_division=0)
    recall = recall_score(actuals, predictions, zero_division=0)
    f1 = f1_score(actuals, predictions, zero_division=0)
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown('<div class="metric-card">', unsafe_allow_html=True)
        st.metric(label="Accuracy", value=f"{accuracy:.3f}")
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col2:
        st.markdown('<div class="metric-card">', unsafe_allow_html=True)
        st.metric(label="Precision", value=f"{precision:.3f}")
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col3:
        st.markdown('<div class="metric-card">', unsafe_allow_html=True)
        st.metric(label="Recall", value=f"{recall:.3f}")
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col4:
        st.markdown('<div class="metric-card">', unsafe_allow_html=True)
        st.metric(label="F1-Score", value=f"{f1:.3f}")
        st.markdown('</div>', unsafe_allow_html=True)
    
    # Confusion matrix visualization
    st.markdown("### Prediction vs Actual Comparison")
    comparison_df = pd.DataFrame({
        'Actual': actuals,
        'Predicted': predictions
    })
    
    confusion_data = pd.crosstab(comparison_df['Actual'], comparison_df['Predicted'], 
                                rownames=['Actual'], colnames=['Predicted'])
    
    fig = px.imshow(confusion_data.values,
                    labels=dict(x="Predicted", y="Actual"),
                    x=['Predicted Normal', 'Predicted Fraud'],
                    y=['Actual Normal', 'Actual Fraud'],
                    color_continuous_scale='Blues',
                    text_auto=True)
    fig.update_layout(height=400)
    st.plotly_chart(fig, use_container_width=True)

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #94a3b8;">
    <p>Fraud Detection Model Analytics Dashboard • Powered by Machine Learning</p>
    <p>Dataset: Credit Card Transactions • Model: Random Forest Classifier</p>
</div>
""", unsafe_allow_html=True)