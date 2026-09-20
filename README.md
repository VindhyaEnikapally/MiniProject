# 🎓 Student Success Predictor

### AI-Driven Early Risk Detection & Personalized Learning Support

An explainable machine learning platform that helps faculty identify academically at-risk students, understand the factors influencing their risk, and provide personalized, data-driven intervention support.

## 🚀 Key Features

* Faculty Authentication
* Faculty Dashboard
* Cohort & Student Data Management
* 36 Student Input Features
* Data Validation & Missing-Value Imputation
* Feature Engineering with 5 Composite Indices
* Calibrated XGBoost Risk Prediction
* Risk Probability & Risk Classification
* TreeSHAP Local Explainability
* Top 5 Risk-Increasing Factors
* Top 5 Protective Factors
* Rule-Based Intervention Policy Engine
* High / Medium / Low Intervention Priority
* Interactive What-If Counterfactual Simulator
* Cohort-Level Analytics
* Student-Level Risk Analysis
* Groq LLM-Based AI Mentoring Guidance

## 🏗️ 7-Stage System Workflow
```
flowchart TD
    A["1. Faculty Authentication"]
    B["2. Cohort Ingestion & Data Validation"]
    C["3. Feature Engineering & XGBoost Inference"]
    D["4. TreeSHAP Explainability"]
    E["5. Intervention Policy Engine"]
    F["6. What-If Counterfactual Simulator"]
    G["7. AI Mentoring Guidance"]

    A --> B --> C --> D --> E --> F --> G

    D --> H["Top Risk & Protective Factors"]
    E --> I["High / Medium / Low Urgency"]
    F --> J["Dynamic Risk Recalculation"]
```

### Stage 1 — Faculty Authentication

Register → Login → Dashboard → Logout

### Stage 2 — Cohort Ingestion & Data Validation

* 36 input features
* Data validation
* Median/mode imputation

### Stage 3 — Feature Engineering & Prediction

* 5 composite indices
* Calibrated XGBoost
* Decision threshold: `0.3522`

### Stage 4 — Explainability

* TreeSHAP local explanations
* Top 5 risk-increasing factors
* Top 5 protective factors

### Stage 5 — Intervention Policy Engine

* Rule-based recommendations
* High, Medium and Low urgency

### Stage 6 — What-If Simulation

Interactive counterfactual analysis to evaluate how changes in student factors affect predicted risk.

### Stage 7 — AI Mentoring

Groq LLM-based qualitative mentoring and personalized guidance.

## 🛠️ Tech Stack

| Layer            | Technology     |
| ---------------- | -------------- |
| Frontend         | React 19, Vite |
| Backend          | FastAPI        |
| Machine Learning | XGBoost        |
| Explainability   | TreeSHAP       |
| AI               | Groq LLM       |
| Data Processing  | Pandas, NumPy  |
| API              | REST           |
| Version Control  | Git & GitHub   |

## 📁 Repository Structure

```text
student-success-predictor/
│
├── frontend/
├── backend/
├── ml/
├── data/
├── notebooks/
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── ML_PIPELINE.md
│   └── FEATURES.md
│
├── screenshots/
├── .env.example
├── .gitignore
└── README.md
```
## 📊 36 Input Feature Dimensions

The 36 input features are organized into:

* Demographics
* Academic History
* Study Habits
* Wellbeing
* Exam Readiness

## 🧠 Machine Learning Pipeline

```text
Student Data
     ↓
Data Validation
     ↓
Missing Value Imputation
     ↓
Feature Engineering
     ↓
5 Composite Indices
     ↓
Calibrated XGBoost
     ↓
Risk Probability
     ↓
Risk Classification
     ↓
TreeSHAP Explainability
     ↓
Intervention Recommendation
     ↓
What-If Analysis
     ↓
AI Mentoring Guidance
```

## 👥 Team

**Industry Oriented Mini Project — Department of CSE**
**Anurag University**

* Enikapally Sai Vindhya
* Sai Chetan Reddy Challa
* Kerchipally Pranati
* Dudekula Riyaz

**Under the Guidance of:**
Mr. G. Kiran Kumar
Assistant Professor, Department of CSE
