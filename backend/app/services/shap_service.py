import pandas as pd
import shap

from app.services.ml_service import (
    model,
    create_engineered_features
)


# ============================================================
# LOAD MODEL COMPONENTS
# ============================================================

xgb_model = model.named_steps["model"]

preprocessor = model.named_steps["preprocessor"]

explainer = shap.TreeExplainer(
    xgb_model
)


# ============================================================
# FEATURE NAME HELPERS
# ============================================================

def get_raw_feature_name(
    feature_name,
    original_columns
):
    """
    Convert processed feature names such as:

        num__stress_level
        cat__gender_Female

    back to their original feature names.
    """

    # Numerical feature
    if feature_name.startswith("num__"):

        return feature_name.replace(
            "num__",
            ""
        )

    # Categorical feature
    if feature_name.startswith("cat__"):

        categorical_part = (
            feature_name.replace(
                "cat__",
                ""
            )
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

def readable_feature_name(
    feature_name
):
    """
    Convert raw feature names into
    human-readable names for the frontend.
    """

    mapping = {

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

        "exam_preparation_days":
            "Exam Preparation Days",

        "time_management_score":
            "Time Management Score",

        "exam_anxiety_level":
            "Exam Anxiety Level",

        # Engineered features
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
    data
):
    """
    Generate SHAP explanations for one student.

    Accepts either:

        1. Dictionary
        2. Pandas DataFrame

    Returns:

        - Risk-increasing factors
        - Risk-reducing factors
        - Raw SHAP values
        - Processed feature names
    """

    # ========================================================
    # 1. CONVERT INPUT TO DATAFRAME
    # ========================================================

    if isinstance(
        data,
        dict
    ):

        df = pd.DataFrame(
            [data]
        )

    elif isinstance(
        data,
        pd.DataFrame
    ):

        df = data.copy()

    else:

        raise TypeError(
            "SHAP input must be a dictionary "
            "or pandas DataFrame."
        )


    # ========================================================
    # 2. APPLY FEATURE ENGINEERING
    # ========================================================

    df = create_engineered_features(
        df
    )


    # ========================================================
    # 3. APPLY TRAINED PREPROCESSOR
    # ========================================================

    processed_data = (
        preprocessor.transform(
            df
        )
    )


    # ========================================================
    # 4. CALCULATE SHAP VALUES
    # ========================================================

    shap_result = (
        explainer.shap_values(
            processed_data
        )
    )


    # ========================================================
    # 5. HANDLE SHAP OUTPUT FORMAT
    # ========================================================

    if isinstance(
        shap_result,
        list
    ):

        if len(shap_result) > 1:

            shap_values = (
                shap_result[1]
            )

        else:

            shap_values = (
                shap_result[0]
            )

    else:

        shap_values = shap_result


    # ========================================================
    # 6. GET SHAP VALUES FOR THIS STUDENT
    # ========================================================

    shap_values_student = (
        shap_values[0]
    )


    # ========================================================
    # 7. GET PROCESSED FEATURE NAMES
    # ========================================================

    feature_names = (
        preprocessor
        .get_feature_names_out()
    )


    # ========================================================
    # 8. CREATE SHAP DATAFRAME
    # ========================================================

    shap_df = pd.DataFrame({

        "feature":
            feature_names,

        "shap_value":
            shap_values_student

    })


    # ========================================================
    # 9. MAP PROCESSED FEATURES TO RAW FEATURES
    # ========================================================

    shap_df["raw_feature"] = (
        shap_df[
            "feature"
        ].apply(
            lambda feature:
            get_raw_feature_name(
                feature,
                df.columns
            )
        )
    )


    # ========================================================
    # 10. AGGREGATE ONE-HOT FEATURES
    # ========================================================

    aggregated = (
        shap_df
        .groupby(
            "raw_feature",
            as_index=False
        )[
            "shap_value"
        ]
        .sum()
    )


    # ========================================================
    # 11. ADD HUMAN-READABLE NAMES
    # ========================================================

    aggregated["factor"] = (
        aggregated[
            "raw_feature"
        ].apply(
            readable_feature_name
        )
    )


    # ========================================================
    # 12. RISK-INCREASING FACTORS
    # ========================================================

    increasing = (
        aggregated[
            aggregated[
                "shap_value"
            ] > 0
        ]
        .sort_values(
            "shap_value",
            ascending=False
        )
        .head(5)
    )


    # ========================================================
    # 13. RISK-REDUCING FACTORS
    # ========================================================

    reducing = (
        aggregated[
            aggregated[
                "shap_value"
            ] < 0
        ]
        .sort_values(
            "shap_value",
            ascending=True
        )
        .head(5)
    )


    # ========================================================
    # 14. FORMAT RISK-INCREASING FACTORS
    # ========================================================

    risk_increasing = []

    for _, row in increasing.iterrows():

        risk_increasing.append({

            "factor":
                row["factor"],

            "shap_contribution":
                round(
                    float(
                        row[
                            "shap_value"
                        ]
                    ),
                    3
                )

        })


    # ========================================================
    # 15. FORMAT RISK-REDUCING FACTORS
    # ========================================================

    risk_reducing = []

    for _, row in reducing.iterrows():

        risk_reducing.append({

            "factor":
                row["factor"],

            "shap_contribution":
                round(
                    float(
                        row[
                            "shap_value"
                        ]
                    ),
                    3
                )

        })


    # ========================================================
    # 16. RETURN RESULT
    # ========================================================

    return {

        "risk_increasing_factors":
            risk_increasing,

        "risk_reducing_factors":
            risk_reducing,

        "shap_values":
            shap_values_student.tolist(),

        "feature_names":
            feature_names.tolist()

    }