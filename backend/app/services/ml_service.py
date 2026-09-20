from pathlib import Path

import joblib
import pandas as pd

from app.utils.data_validator import REQUIRED_FEATURES


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[3]

ML_DIR = BASE_DIR / "ml"

MODEL_PATH = ML_DIR / "student_risk_model.pkl"

THRESHOLD_PATH = ML_DIR / "student_risk_threshold.pkl"

FEATURE_CONFIG_PATH = ML_DIR / "student_feature_config.pkl"


# ============================================================
# LOAD MODEL
# ============================================================

model = joblib.load(
    MODEL_PATH
)

threshold = joblib.load(
    THRESHOLD_PATH
)

feature_config = joblib.load(
    FEATURE_CONFIG_PATH
)


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
        / (
            df["exam_preparation_days"]
            + 1
        )
    )

    # --------------------------------------------------------
    # 4. STUDY-SCREEN RATIO
    # --------------------------------------------------------

    df["study_screen_ratio"] = (
        df["total_study_hours"]
        / (
            df["daily_screen_time"]
            + 1
        )
    )

    # --------------------------------------------------------
    # 5. ACADEMIC CONSISTENCY
    # --------------------------------------------------------

    df["academic_consistency"] = (
        0.6
        * df["previous_exam_score"]
        +
        0.4
        * (
            df["previous_gpa"]
            / 4
            * 100
        )
    )

    return df


# ============================================================
# SINGLE STUDENT PREDICTION
# ============================================================

def predict_student(
    student_data: dict
):

    # --------------------------------------------------------
    # CONVERT DICTIONARY TO ONE-ROW DATAFRAME
    # --------------------------------------------------------

    df = pd.DataFrame(
        [student_data]
    )

    # --------------------------------------------------------
    # KEEP ONLY MODEL FEATURES
    # --------------------------------------------------------

    df = df[
        REQUIRED_FEATURES
    ].copy()

    # --------------------------------------------------------
    # FEATURE ENGINEERING
    # --------------------------------------------------------

    df_engineered = (
        create_engineered_features(
            df
        )
    )

    # --------------------------------------------------------
    # PREDICT PROBABILITY
    # --------------------------------------------------------

    probability = (
        model
        .predict_proba(
            df_engineered
        )[0][1]
    )

    # --------------------------------------------------------
    # APPLY MODEL THRESHOLD
    # --------------------------------------------------------

    prediction = (

        "At Risk"

        if probability >= threshold

        else "Not At Risk"

    )

    # --------------------------------------------------------
    # RETURN
    # --------------------------------------------------------

    return {

        "risk_probability":
            float(
                probability
            ),

        "risk_percentage":
            round(
                float(
                    probability
                )
                * 100,
                2
            ),

        "threshold":
            float(
                threshold
            ),

        "prediction":
            prediction

    }


# ============================================================
# BULK DATAFRAME PREDICTION
# ============================================================

def predict_dataframe(
    df: pd.DataFrame
) -> pd.DataFrame:

    # --------------------------------------------------------
    # COPY ORIGINAL DATA
    # --------------------------------------------------------

    result_df = df.copy()

    # --------------------------------------------------------
    # SELECT ONLY MODEL FEATURES
    # --------------------------------------------------------

    model_df = result_df[
        REQUIRED_FEATURES
    ].copy()

    # --------------------------------------------------------
    # FEATURE ENGINEERING
    # --------------------------------------------------------

    model_df = (
        create_engineered_features(
            model_df
        )
    )

    # --------------------------------------------------------
    # PREDICT PROBABILITY
    # --------------------------------------------------------

    probabilities = (
        model
        .predict_proba(
            model_df
        )[:, 1]
    )

    # --------------------------------------------------------
    # APPLY MODEL THRESHOLD
    # --------------------------------------------------------

    predictions = (
        probabilities >= threshold
    )

    # --------------------------------------------------------
    # ADD RESULTS TO ORIGINAL DATA
    # --------------------------------------------------------

    result_df[
        "risk_probability"
    ] = probabilities

    result_df[
        "risk_percentage"
    ] = (
        probabilities
        * 100
    )

    result_df[
        "prediction"
    ] = [

        "At Risk"
        if value
        else "Not At Risk"

        for value in predictions

    ]

    return result_df


# ============================================================
# MODEL INFORMATION
# ============================================================

def get_model_info() -> dict:

    return {

        "model_type":
            type(
                model
                .named_steps[
                    "model"
                ]
            ).__name__,

        "threshold":
            float(
                threshold
            ),

        "feature_config_loaded":
            feature_config
            is not None

    }