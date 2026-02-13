import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix
from imblearn.over_sampling import SMOTE
import joblib
import warnings
warnings.filterwarnings('ignore')

print("🚀 Starting quick fraud detection model training...")

# Load the dataset
print("📂 Loading dataset...")
df = pd.read_csv("data/creditcard.csv")

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

# Handle class imbalance with SMOTE
print("⚖️ Balancing classes with SMOTE...")
smote = SMOTE(random_state=42, sampling_strategy=0.1)
X_train_balanced, y_train_balanced = smote.fit_resample(X_train, y_train)

print(f"Balanced training set size: {len(X_train_balanced)}")
print(f"Balanced fraud rate: {y_train_balanced.mean()*100:.2f}%")

# Train a simpler but effective Random Forest
print("🤖 Training Random Forest...")
model = RandomForestClassifier(
    n_estimators=100,  # Reduced for speed
    max_depth=10,
    min_samples_split=5,
    min_samples_leaf=2,
    max_features='sqrt',
    class_weight='balanced',
    random_state=42,
    n_jobs=-1
)
model.fit(X_train_balanced, y_train_balanced)

# Evaluate model
print("\n📊 Model Evaluation:")
y_pred = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)[:, 1]

auc_score = roc_auc_score(y_test, y_pred_proba)
conf_matrix = confusion_matrix(y_test, y_pred)

print(f"ROC-AUC Score: {auc_score:.4f}")
print(f"Confusion Matrix:")
print(f"  TN: {conf_matrix[0,0]}, FP: {conf_matrix[0,1]}")
print(f"  FN: {conf_matrix[1,0]}, TP: {conf_matrix[1,1]}")

print("\nClassification Report:")
print(classification_report(y_test, y_pred, digits=4))

# Save the model and preprocessors
print("\n💾 Saving model and preprocessors...")
joblib.dump(model, "quick_model.pkl")
joblib.dump(scaler_amount, "scaler_amount.pkl")
joblib.dump(scaler_time, "scaler_time.pkl")

# Save feature names
feature_names = list(X.columns)
joblib.dump(feature_names, "feature_names.pkl")

print("✅ Quick model training completed!")
print("Files saved:")
print("  - quick_model.pkl (trained model)")
print("  - scaler_amount.pkl (amount scaler)")
print("  - scaler_time.pkl (time scaler)")
print("  - feature_names.pkl (feature order)")

# Test the saved model
print("\n🧪 Testing saved model...")
loaded_model = joblib.load("quick_model.pkl")
test_prediction = loaded_model.predict(X_test.iloc[:3])
test_probabilities = loaded_model.predict_proba(X_test.iloc[:3])

print("Sample predictions:")
for i in range(3):
    actual = y_test.iloc[i]
    predicted = test_prediction[i]
    prob_fraud = test_probabilities[i][1]
    print(f"  Sample {i+1}: Actual={actual}, Predicted={predicted}, Fraud Probability={prob_fraud:.3f}")