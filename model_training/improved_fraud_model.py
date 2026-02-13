import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix
from imblearn.over_sampling import SMOTE
import joblib
import warnings
warnings.filterwarnings('ignore')

print("🚀 Starting improved fraud detection model training...")

# Load the dataset
print("📂 Loading dataset...")
df = pd.read_csv("../data/creditcard.csv")

# Basic data exploration
print(f"Dataset shape: {df.shape}")
print(f"Fraud cases: {df['Class'].sum()} ({df['Class'].mean()*100:.2f}%)")
print(f"Legitimate cases: {len(df) - df['Class'].sum()}")

# Prepare features - scale amount and time properly
print("🔧 Preparing features...")
scaler_amount = StandardScaler()
scaler_time = StandardScaler()

df['scaled_amount'] = scaler_amount.fit_transform(df[['Amount']])
df['scaled_time'] = scaler_time.fit_transform(df[['Time']])

# Separate features and target
X = df.drop(['Class', 'Amount', 'Time'], axis=1)
y = df['Class']

# Add scaled features
X['scaled_amount'] = df['scaled_amount']
X['scaled_time'] = df['scaled_time']

print(f"Features shape: {X.shape}")

# Split the data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Training set size: {len(X_train)}")
print(f"Test set size: {len(X_test)}")
print(f"Training fraud rate: {y_train.mean()*100:.2f}%")

# Handle class imbalance with SMOTE
print("⚖️ Balancing classes with SMOTE...")
smote = SMOTE(random_state=42, sampling_strategy=0.1)  # More balanced ratio
X_train_balanced, y_train_balanced = smote.fit_resample(X_train, y_train)

print(f"Balanced training set size: {len(X_train_balanced)}")
print(f"Balanced fraud rate: {y_train_balanced.mean()*100:.2f}%")

# Train multiple models
print("\n🤖 Training models...")

# 1. Improved Random Forest
print("1. Training Random Forest...")
rf_model = RandomForestClassifier(
    n_estimators=300,
    max_depth=15,
    min_samples_split=10,
    min_samples_leaf=5,
    max_features='sqrt',
    class_weight='balanced',
    random_state=42,
    n_jobs=-1
)
rf_model.fit(X_train_balanced, y_train_balanced)

# 2. Gradient Boosting
print("2. Training Gradient Boosting...")
gb_model = GradientBoostingClassifier(
    n_estimators=200,
    learning_rate=0.05,
    max_depth=8,
    min_samples_split=10,
    min_samples_leaf=5,
    subsample=0.8,
    random_state=42
)
gb_model.fit(X_train_balanced, y_train_balanced)

# 3. Logistic Regression with regularization
print("3. Training Logistic Regression...")
lr_model = LogisticRegression(
    C=0.1,
    penalty='l2',
    solver='liblinear',
    class_weight='balanced',
    random_state=42,
    max_iter=1000
)
lr_model.fit(X_train_balanced, y_train_balanced)

# Evaluate models
print("\n📊 Model Evaluation Results:")
print("=" * 50)

models = {
    'Random Forest': rf_model,
    'Gradient Boosting': gb_model,
    'Logistic Regression': lr_model
}

best_model = None
best_score = 0
best_name = ""

for name, model in models.items():
    # Predictions
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    # Metrics
    auc_score = roc_auc_score(y_test, y_pred_proba)
    conf_matrix = confusion_matrix(y_test, y_pred)
    
    print(f"\n{name}:")
    print(f"  ROC-AUC Score: {auc_score:.4f}")
    print(f"  Confusion Matrix:")
    print(f"    TN: {conf_matrix[0,0]}, FP: {conf_matrix[0,1]}")
    print(f"    FN: {conf_matrix[1,0]}, TP: {conf_matrix[1,1]}")
    
    # Detailed classification report
    print("  Classification Report:")
    print(classification_report(y_test, y_pred, digits=4))
    
    if auc_score > best_score:
        best_score = auc_score
        best_model = model
        best_name = name

print(f"\n🏆 Best Model: {best_name} with ROC-AUC: {best_score:.4f}")

# Save the best model and preprocessors
print("\n💾 Saving model and preprocessors...")
joblib.dump(best_model, "model.pkl")
joblib.dump(scaler_amount, "scaler_amount.pkl")
joblib.dump(scaler_time, "scaler_time.pkl")

# Save feature names for consistency
feature_names = list(X.columns)
joblib.dump(feature_names, "feature_names.pkl")

print("✅ Model training completed successfully!")
print(f"Saved {best_name} as the final model")
print("Files saved:")
print("  - model.pkl (trained model)")
print("  - scaler_amount.pkl (amount scaler)")
print("  - scaler_time.pkl (time scaler)")
print("  - feature_names.pkl (feature order)")

# Test the saved model
print("\n🧪 Testing saved model...")
loaded_model = joblib.load("model.pkl")
test_prediction = loaded_model.predict(X_test.iloc[:5])
test_probabilities = loaded_model.predict_proba(X_test.iloc[:5])

print("Sample predictions:")
for i in range(5):
    actual = y_test.iloc[i]
    predicted = test_prediction[i]
    prob_fraud = test_probabilities[i][1]
    print(f"  Sample {i+1}: Actual={actual}, Predicted={predicted}, Fraud Probability={prob_fraud:.3f}")