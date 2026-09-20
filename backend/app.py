from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict

import joblib
import pandas as pd
import shap


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Student Success Predictor API",
    description="ML-based early academic risk prediction system",
    version="1.0.0"
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

# Project structure:
#
# Student-Success-Predictor/
# ├── backend/
# │   └── app.py
# ├── ml/
# │   ├── student_risk_model.pkl
# │   ├── student_risk_threshold.pkl
# │   └── student_feature_config.pkl
#

ML_DIR = BASE_DIR.parent / "ml"

MODEL_PATH = ML_DIR / "student_risk_model.pkl"
THRESHOLD_PATH = ML_DIR / "student_risk_threshold.pkl"
FEATURE_CONFIG_PATH = ML_DIR / "student_feature_config.pkl"


# ============================================================
# LOAD MODEL AND CONFIGURATION
# ============================================================

model = joblib.load(MODEL_PATH)

threshold = joblib.load(THRESHOLD_PATH)

feature_config = joblib.load(FEATURE_CONFIG_PATH)


# ============================================================
# SHAP EXPLAINER
# ============================================================

# Your saved model is a Pipeline:
#
# preprocessor
#      ↓
# XGBoost model
#

xgb_model = model.named_steps["model"]

preprocessor = model.named_steps["preprocessor"]

explainer = shap.TreeExplainer(xgb_model)


# ============================================================
# STUDENT INPUT SCHEMA
# ============================================================

class StudentData(BaseModel):

    model_config = ConfigDict(extra="forbid")

    # --------------------------------------------------------
    # STUDENT INFORMATION
    # --------------------------------------------------------

    age: int

    gender: str

    education_level: str

    school_type: str

    family_income: str

    parent_education: str

    urban_rural: str


    # --------------------------------------------------------
    # ACADEMIC INFORMATION
    # --------------------------------------------------------

    previous_exam_score: float

    previous_gpa: float

    attendance_percentage: float

    assignment_completion_rate: float

    class_participation: str


    # --------------------------------------------------------
    # STUDY & BEHAVIOUR
    # --------------------------------------------------------

    study_hours_per_day: float

    self_study_hours: float

    private_tuition: int

    online_learning_hours: float

    study_consistency: str

    study_environment: str

    study_method: str

    revision_frequency: str

    practice_tests_completed: int

    notes_quality: str


    # --------------------------------------------------------
    # WELLBEING
    # --------------------------------------------------------

    sleep_hours: float

    sleep_quality: str

    daily_screen_time: float

    physical_activity_hours: float

    break_frequency: str

    stress_level: float

    motivation_level: str

    internet_access: int

    device_availability: str

    educational_app_usage: str

    online_course_hours: float


    # --------------------------------------------------------
    # EXAM PREPARATION
    # --------------------------------------------------------

    exam_preparation_days: int

    time_management_score: float

    exam_anxiety_level: float


# ============================================================
# FEATURE ENGINEERING
# ============================================================

def create_engineered_features(
    df: pd.DataFrame
) -> pd.DataFrame:

    df = df.copy()


    # --------------------------------------------------------
    # 1. TOTAL STUDY HOURS
    # --------------------------------------------------------

    df["total_study_hours"] = (
        df["study_hours_per_day"]
        + df["self_study_hours"]
    )


    # --------------------------------------------------------
    # 2. PREPARATION INTENSITY
    # --------------------------------------------------------

    df["preparation_intensity"] = (
        df["exam_preparation_days"]
        * df["study_hours_per_day"]
    )


    # --------------------------------------------------------
    # 3. PRACTICE TESTS PER PREPARATION DAY
    # --------------------------------------------------------

    df["practice_per_preparation_day"] = (
        df["practice_tests_completed"]
        / (df["exam_preparation_days"] + 1)
    )


    # --------------------------------------------------------
    # 4. STUDY-TO-SCREEN RATIO
    # --------------------------------------------------------

    df["study_screen_ratio"] = (
        df["total_study_hours"]
        / (df["daily_screen_time"] + 1)
    )


    # --------------------------------------------------------
    # 5. ACADEMIC CONSISTENCY
    # --------------------------------------------------------

    df["academic_consistency"] = (
        0.6 * df["previous_exam_score"]
        + 0.4 * (df["previous_gpa"] / 4 * 100)
    )


    return df


# ============================================================
# SHAP FEATURE NAME MAPPING
# ============================================================

def get_raw_feature_name(
    feature_name,
    original_columns
):

    # --------------------------------------------------------
    # NUMERICAL FEATURE
    # --------------------------------------------------------

    if feature_name.startswith("num__"):

        return feature_name.replace(
            "num__",
            ""
        )


    # --------------------------------------------------------
    # CATEGORICAL FEATURE
    # --------------------------------------------------------

    if feature_name.startswith("cat__"):

        categorical_part = feature_name.replace(
            "cat__",
            ""
        )

        for column in original_columns:

            if categorical_part.startswith(
                column + "_"
            ):

                return column


    return feature_name


# ============================================================
# READABLE FEATURE NAMES
# ============================================================

def readable_feature_name(feature_name):

    mapping = {

        # Student Information

        "age":
            "Age",

        "gender":
            "Gender",

        "education_level":
            "Education Level",

        "school_type":
            "School Type",

        "family_income":
            "Family Income",

        "parent_education":
            "Parent Education",

        "urban_rural":
            "Urban/Rural",


        # Academic

        "previous_exam_score":
            "Previous Exam Score",

        "previous_gpa":
            "Previous GPA",

        "attendance_percentage":
            "Attendance",

        "assignment_completion_rate":
            "Assignment Completion",

        "class_participation":
            "Class Participation",


        # Study

        "study_hours_per_day":
            "Study Hours per Day",

        "self_study_hours":
            "Self Study Hours",

        "private_tuition":
            "Private Tuition",

        "online_learning_hours":
            "Online Learning Hours",

        "study_consistency":
            "Study Consistency",

        "study_environment":
            "Study Environment",

        "study_method":
            "Study Method",

        "revision_frequency":
            "Revision Frequency",

        "practice_tests_completed":
            "Practice Tests Completed",

        "notes_quality":
            "Notes Quality",


        # Wellbeing

        "sleep_hours":
            "Sleep Hours",

        "sleep_quality":
            "Sleep Quality",

        "daily_screen_time":
            "Daily Screen Time",

        "physical_activity_hours":
            "Physical Activity Hours",

        "break_frequency":
            "Break Frequency",

        "stress_level":
            "Stress Level",

        "motivation_level":
            "Motivation Level",

        "internet_access":
            "Internet Access",

        "device_availability":
            "Device Availability",

        "educational_app_usage":
            "Educational App Usage",

        "online_course_hours":
            "Online Course Hours",


        # Exam

        "exam_preparation_days":
            "Exam Preparation Days",

        "time_management_score":
            "Time Management Score",

        "exam_anxiety_level":
            "Exam Anxiety Level",


        # Engineered Features

        "total_study_hours":
            "Total Study Hours",

        "preparation_intensity":
            "Preparation Intensity",

        "practice_per_preparation_day":
            "Practice per Preparation Day",

        "study_screen_ratio":
            "Study-Screen Ratio",

        "academic_consistency":
            "Academic Consistency"
    }


    return mapping.get(
        feature_name,
        feature_name.replace(
            "_",
            " "
        ).title()
    )


# ============================================================
# SHAP EXPLANATION
# ============================================================

def get_shap_explanation(
    df: pd.DataFrame
):

    # --------------------------------------------------------
    # APPLY SAME PREPROCESSING USED DURING TRAINING
    # --------------------------------------------------------

    processed_data = preprocessor.transform(df)


    # --------------------------------------------------------
    # CALCULATE SHAP VALUES
    # --------------------------------------------------------

    shap_result = explainer.shap_values(
        processed_data
    )


    # --------------------------------------------------------
    # HANDLE DIFFERENT SHAP OUTPUT FORMATS
    # --------------------------------------------------------

    if isinstance(shap_result, list):

        # Binary classification compatibility
        #
        # Depending on SHAP/XGBoost version,
        # shap_values may be returned as a list.

        if len(shap_result) > 1:
            shap_values = shap_result[1]
        else:
            shap_values = shap_result[0]

    else:

        shap_values = shap_result


    # --------------------------------------------------------
    # ONE STUDENT
    # --------------------------------------------------------

    shap_values_student = shap_values[0]


    # --------------------------------------------------------
    # GET TRANSFORMED FEATURE NAMES
    # --------------------------------------------------------

    feature_names = (
        preprocessor
        .get_feature_names_out()
    )


    # --------------------------------------------------------
    # CREATE SHAP DATAFRAME
    # --------------------------------------------------------

    shap_df = pd.DataFrame({

        "feature":
            feature_names,

        "shap_value":
            shap_values_student
    })


    # --------------------------------------------------------
    # MAP TRANSFORMED FEATURES TO RAW FEATURES
    # --------------------------------------------------------

    shap_df["raw_feature"] = (
        shap_df["feature"].apply(
            lambda x:
            get_raw_feature_name(
                x,
                df.columns
            )
        )
    )


    # --------------------------------------------------------
    # AGGREGATE ONE-HOT CATEGORICAL FEATURES
    # --------------------------------------------------------

    aggregated = (
        shap_df
        .groupby(
            "raw_feature",
            as_index=False
        )["shap_value"]
        .sum()
    )


    # --------------------------------------------------------
    # READABLE NAMES
    # --------------------------------------------------------

    aggregated["factor"] = (
        aggregated["raw_feature"].apply(
            readable_feature_name
        )
    )


    # --------------------------------------------------------
    # RISK-INCREASING FACTORS
    # --------------------------------------------------------

    increasing = (
        aggregated[
            aggregated["shap_value"] > 0
        ]
        .sort_values(
            "shap_value",
            ascending=False
        )
        .head(5)
    )


    # --------------------------------------------------------
    # RISK-REDUCING FACTORS
    # --------------------------------------------------------

    reducing = (
        aggregated[
            aggregated["shap_value"] < 0
        ]
        .sort_values(
            "shap_value",
            ascending=True
        )
        .head(5)
    )


    # --------------------------------------------------------
    # FORMAT RISK-INCREASING FACTORS
    # --------------------------------------------------------

    risk_increasing = []

    for _, row in increasing.iterrows():

        risk_increasing.append({

            "factor":
                row["factor"],

            "shap_contribution":
                round(
                    float(
                        row["shap_value"]
                    ),
                    3
                )
        })


    # --------------------------------------------------------
    # FORMAT RISK-REDUCING FACTORS
    # --------------------------------------------------------

    risk_reducing = []

    for _, row in reducing.iterrows():

        risk_reducing.append({

            "factor":
                row["factor"],

            "shap_contribution":
                round(
                    float(
                        row["shap_value"]
                    ),
                    3
                )
        })


    return (
        risk_increasing,
        risk_reducing,
        shap_values_student,
        feature_names
    )


# ============================================================
# AI INTERVENTION POLICY ENGINE
# ============================================================

def generate_interventions(
    student,
    shap_values,
    feature_names
):

    # --------------------------------------------------------
    # INTERVENTION RULES
    # --------------------------------------------------------

    intervention_map = {

        "practice_tests_completed": {

            "shap_feature":
                "num__practice_tests_completed",

            "condition":
                lambda x: x < 4,

            "action":
                "Encourage regular practice-test completion"
        },


        "exam_preparation_days": {

            "shap_feature":
                "num__exam_preparation_days",

            "condition":
                lambda x: x < 7,

            "action":
                "Create an early exam-preparation plan"
        },


        "stress_level": {

            "shap_feature":
                "num__stress_level",

            "condition":
                lambda x: x >= 7,

            "action":
                "Faculty mentoring and stress-management support"
        },


        "exam_anxiety_level": {

            "shap_feature":
                "num__exam_anxiety_level",

            "condition":
                lambda x: x >= 7,

            "action":
                "Provide exam-anxiety management and mentoring support"
        },


        "attendance_percentage": {

            "shap_feature":
                "num__attendance_percentage",

            "condition":
                lambda x: x < 85,

            "action":
                "Monitor attendance and encourage regular class participation"
        },


        "study_hours_per_day": {

            "shap_feature":
                "num__study_hours_per_day",

            "condition":
                lambda x: x < 4,

            "action":
                "Encourage a consistent daily study schedule"
        },


        "sleep_hours": {

            "shap_feature":
                "num__sleep_hours",

            "condition":
                lambda x: x < 6,

            "action":
                "Encourage healthier sleep habits"
        },


        "time_management_score": {

            "shap_feature":
                "num__time_management_score",

            "condition":
                lambda x: x < 60,

            "action":
                "Provide time-management guidance"
        },


        "self_study_hours": {

            "shap_feature":
                "num__self_study_hours",

            "condition":
                lambda x: x < 2,

            "action":
                "Encourage additional self-study time"
        },


        "assignment_completion_rate": {

            "shap_feature":
                "num__assignment_completion_rate",

            "condition":
                lambda x: x < 70,

            "action":
                "Monitor assignment completion and provide academic support"
        }
    }


    # --------------------------------------------------------
    # SHAP LOOKUP
    # --------------------------------------------------------

    shap_lookup = dict(
        zip(
            feature_names,
            shap_values
        )
    )


    interventions = []


    # --------------------------------------------------------
    # CHECK INTERVENTION RULES
    # --------------------------------------------------------

    for raw_feature, rule in intervention_map.items():

        actual_value = student[
            raw_feature
        ]


        shap_value = shap_lookup.get(
            rule["shap_feature"],
            0
        )


        # ----------------------------------------------------
        # INTERVENTION GENERATED ONLY IF:
        #
        # 1. Student crosses the defined threshold
        # 2. SHAP contribution increases risk
        # ----------------------------------------------------

        if (
            rule["condition"](actual_value)
            and shap_value > 0
        ):

            # ------------------------------------------------
            # PRIORITY
            # ------------------------------------------------

            if shap_value >= 0.30:

                priority = "High"

            elif shap_value >= 0.10:

                priority = "Medium"

            else:

                priority = "Low"


            # ------------------------------------------------
            # ADD INTERVENTION
            # ------------------------------------------------

            interventions.append({

                "priority":
                    priority,

                "factor":
                    readable_feature_name(
                        raw_feature
                    ),

                "shap_contribution":
                    round(
                        float(shap_value),
                        3
                    ),

                "current_value":
                    actual_value,

                "recommended_action":
                    rule["action"]
            })


    # --------------------------------------------------------
    # SORT HIGH → MEDIUM → LOW
    # --------------------------------------------------------

    priority_order = {

        "High": 0,

        "Medium": 1,

        "Low": 2
    }


    interventions.sort(
        key=lambda x:
        priority_order[
            x["priority"]
        ]
    )


    return interventions


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():

    return {

        "message":
            "Student Success Predictor API is running",

        "status":
            "active"
    }


# ============================================================
# PREDICTION ENDPOINT
# ============================================================

@app.post("/predict")
def predict_student(
    student: StudentData
):

    # --------------------------------------------------------
    # 1. CONVERT INPUT TO DICTIONARY
    # --------------------------------------------------------

    student_dict = (
        student.model_dump()
    )


    # --------------------------------------------------------
    # 2. CONVERT TO DATAFRAME
    # --------------------------------------------------------

    df = pd.DataFrame(
        [student_dict]
    )


    # --------------------------------------------------------
    # 3. CREATE ENGINEERED FEATURES
    # --------------------------------------------------------

    df = create_engineered_features(
        df
    )


    # --------------------------------------------------------
    # 4. MODEL PREDICTION
    # --------------------------------------------------------

    risk_probability = float(
        model.predict_proba(df)[0, 1]
    )


    # --------------------------------------------------------
    # 5. APPLY FINAL THRESHOLD
    # --------------------------------------------------------

    prediction = (
        risk_probability >= threshold
    )


    # --------------------------------------------------------
    # 6. SHAP EXPLANATION
    # --------------------------------------------------------

    (
        risk_increasing,
        risk_reducing,
        shap_values_student,
        feature_names
    ) = get_shap_explanation(df)


    # --------------------------------------------------------
    # 7. INTERVENTION POLICY ENGINE
    # --------------------------------------------------------

    interventions = generate_interventions(
        student_dict,
        shap_values_student,
        feature_names
    )


    # --------------------------------------------------------
    # 8. FINAL RESPONSE
    # --------------------------------------------------------

    return {

        "risk_probability":
            round(
                risk_probability,
                4
            ),

        "risk_percentage":
            round(
                risk_probability * 100,
                2
            ),

        "threshold":
            round(
                float(threshold),
                4
            ),

        "prediction":
            (
                "At Risk"
                if prediction
                else "Not At Risk"
            ),

        "shap_explanation": {

            "risk_increasing_factors":
                risk_increasing,

            "risk_reducing_factors":
                risk_reducing
        },

        "interventions":
            interventions
    }


# ============================================================
# WHAT-IF ANALYSIS
# ============================================================

@app.post("/what-if")
def what_if_analysis(
    student: StudentData,
    changes: dict
):

    # --------------------------------------------------------
    # 1. ORIGINAL STUDENT DATA
    # --------------------------------------------------------

    original_student = (
        student.model_dump()
    )


    # --------------------------------------------------------
    # 2. CREATE COPY FOR WHAT-IF SCENARIO
    # --------------------------------------------------------

    modified_student = (
        original_student.copy()
    )


    # --------------------------------------------------------
    # 3. APPLY REQUESTED CHANGES
    # --------------------------------------------------------

    for feature, new_value in changes.items():

        if feature in modified_student:

            modified_student[
                feature
            ] = new_value


    # --------------------------------------------------------
    # 4. CURRENT STUDENT DATAFRAME
    # --------------------------------------------------------

    current_df = pd.DataFrame(
        [original_student]
    )


    current_df = (
        create_engineered_features(
            current_df
        )
    )


    # --------------------------------------------------------
    # 5. WHAT-IF STUDENT DATAFRAME
    # --------------------------------------------------------

    modified_df = pd.DataFrame(
        [modified_student]
    )


    modified_df = (
        create_engineered_features(
            modified_df
        )
    )


    # --------------------------------------------------------
    # 6. CURRENT RISK PROBABILITY
    # --------------------------------------------------------

    current_probability = float(
        model.predict_proba(
            current_df
        )[0, 1]
    )


    # --------------------------------------------------------
    # 7. WHAT-IF RISK PROBABILITY
    # --------------------------------------------------------

    modified_probability = float(
        model.predict_proba(
            modified_df
        )[0, 1]
    )


    # --------------------------------------------------------
    # 8. CALCULATE CHANGE
    # --------------------------------------------------------

    risk_change = (
        modified_probability
        - current_probability
    )


    # --------------------------------------------------------
    # 9. FIND CHANGED FACTORS
    # --------------------------------------------------------

    changed_factors = {}


    for feature in changes:

        if feature in original_student:

            old_value = (
                original_student[
                    feature
                ]
            )

            new_value = (
                modified_student[
                    feature
                ]
            )


            if old_value != new_value:

                changed_factors[
                    feature
                ] = {

                    "from":
                        old_value,

                    "to":
                        new_value
                }


    # --------------------------------------------------------
    # 10. WHAT-IF PREDICTION CLASS
    # --------------------------------------------------------

    current_prediction = (
        current_probability >= threshold
    )

    modified_prediction = (
        modified_probability >= threshold
    )


    # --------------------------------------------------------
    # 11. RETURN RESULT
    # --------------------------------------------------------

    return {

        "current_risk_probability":
            round(
                current_probability,
                4
            ),

        "current_risk_percentage":
            round(
                current_probability * 100,
                2
            ),

        "current_prediction":
            (
                "At Risk"
                if current_prediction
                else "Not At Risk"
            ),


        "what_if_risk_probability":
            round(
                modified_probability,
                4
            ),

        "what_if_risk_percentage":
            round(
                modified_probability * 100,
                2
            ),

        "what_if_prediction":
            (
                "At Risk"
                if modified_prediction
                else "Not At Risk"
            ),


        "risk_change_probability":
            round(
                risk_change,
                4
            ),

        "risk_change_percentage":
            round(
                risk_change * 100,
                2
            ),

        "changed_factors":
            changed_factors
    }