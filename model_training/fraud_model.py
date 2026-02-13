import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, GridSearchCV
from imblearn.over_sampling import SMOTE
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import classification_report, roc_auc_score, precision_recall_fscore_support

df = pd.read_csv("../data/creditcard.csv")  # load dataset

# Scale the amount and time features properly
scaler_amount = StandardScaler()
scaler_time = StandardScaler()
df['scaled_amount'] = scaler_amount.fit_transform(df[['Amount']])
df['scaled_time'] = scaler_time.fit_transform(df[['Time']])
# Keep original features for proper feature alignment
df_renamed = df.rename(columns={'scaled_amount': 'Amount', 'scaled_time': 'Time'})

X = df_renamed.drop(['Class', 'Amount', 'Time'], axis=1)
y = df_renamed['Class']
# Add scaled features back
X['Amount'] = df['scaled_amount']
X['Time'] = df['scaled_time']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

smote = SMOTE(random_state=42)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

print("Data prepared\n")

# Try multiple models with hyperparameter tuning

# Logistic Regression with Grid Search
lr_params = {
    'C': [0.1, 1, 10],
    'penalty': ['l1', 'l2'],
    'solver': ['liblinear']
}
lr_grid = GridSearchCV(LogisticRegression(max_iter=1000, random_state=42), 
                       lr_params, cv=3, scoring='roc_auc')
lr_grid.fit(X_train_resampled, y_train_resampled)
lr_best = lr_grid.best_estimator_

y_pred_lr = lr_best.predict(X_test)
print("Logistic Regression Results (Best)")
print(classification_report(y_test, y_pred_lr))
print("ROC-AUC:", roc_auc_score(y_test, lr_best.predict_proba(X_test)[:, 1]))

print("\n-----------------------------------\n")

# Random Forest with better parameters
rf = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    class_weight='balanced'
)
rf.fit(X_train_resampled, y_train_resampled)
y_pred_rf = rf.predict(X_test)

print("Random Forest Results (Improved)")
print(classification_report(y_test, y_pred_rf))
print("ROC-AUC:", roc_auc_score(y_test, rf.predict_proba(X_test)[:, 1]))

print("\n-----------------------------------\n")

# Gradient Boosting for better performance
gb = GradientBoostingClassifier(
    n_estimators=100,
    learning_rate=0.1,
    max_depth=6,
    random_state=42
)
gb.fit(X_train_resampled, y_train_resampled)
y_pred_gb = gb.predict(X_test)

print("Gradient Boosting Results")
print(classification_report(y_test, y_pred_gb))
print("ROC-AUC:", roc_auc_score(y_test, gb.predict_proba(X_test)[:, 1]))

import joblib  # for saving model

# Save the best performing model (comparing ROC-AUC scores)
models_scores = {
    'Logistic Regression': roc_auc_score(y_test, lr_best.predict_proba(X_test)[:, 1]),
    'Random Forest': roc_auc_score(y_test, rf.predict_proba(X_test)[:, 1]),
    'Gradient Boosting': roc_auc_score(y_test, gb.predict_proba(X_test)[:, 1])
}

best_model_name = max(models_scores, key=models_scores.get)
print(f"\nBest model: {best_model_name} with ROC-AUC: {models_scores[best_model_name]:.4f}")

# Save the best model
if best_model_name == 'Logistic Regression':
    joblib.dump(lr_best, "model.pkl")
    # Save both scalers
    joblib.dump(scaler_amount, "scaler_amount.pkl")
    joblib.dump(scaler_time, "scaler_time.pkl")
elif best_model_name == 'Random Forest':
    joblib.dump(rf, "model.pkl")
    joblib.dump(scaler_amount, "scaler_amount.pkl")
    joblib.dump(scaler_time, "scaler_time.pkl")
else:  # Gradient Boosting
    joblib.dump(gb, "model.pkl")
    joblib.dump(scaler_amount, "scaler_amount.pkl")
    joblib.dump(scaler_time, "scaler_time.pkl")

# Save feature names for proper prediction
feature_names = list(X.columns)
joblib.dump(feature_names, "feature_names.pkl")

print("✅ Model and scaler saved correctly")

