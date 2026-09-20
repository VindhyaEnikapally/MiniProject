import pandas as pd

from app.services.ml_service import (
    model,
    threshold,
    create_engineered_features
)


# ============================================================
# WHAT-IF ANALYSIS
# ============================================================

def run_what_if_analysis(
    student: dict,
    changes: dict
) -> dict:
    """
    Compare the student's current risk with a
    simulated scenario where selected features
    are changed.
    """

    # --------------------------------------------------------
    # ORIGINAL STUDENT
    # --------------------------------------------------------

    original_student = student.copy()

    # --------------------------------------------------------
    # CREATE MODIFIED STUDENT
    # --------------------------------------------------------

    modified_student = original_student.copy()

    for feature, new_value in changes.items():

        if feature in modified_student:

            modified_student[feature] = new_value

    # --------------------------------------------------------
    # CREATE DATAFRAMES
    # --------------------------------------------------------

    current_df = pd.DataFrame(
        [original_student]
    )

    modified_df = pd.DataFrame(
        [modified_student]
    )

    # --------------------------------------------------------
    # FEATURE ENGINEERING
    # --------------------------------------------------------

    current_df = create_engineered_features(
        current_df
    )

    modified_df = create_engineered_features(
        modified_df
    )

    # --------------------------------------------------------
    # CURRENT PREDICTION
    # --------------------------------------------------------

    current_probability = float(
        model.predict_proba(
            current_df
        )[0, 1]
    )

    # --------------------------------------------------------
    # WHAT-IF PREDICTION
    # --------------------------------------------------------

    modified_probability = float(
        model.predict_proba(
            modified_df
        )[0, 1]
    )

    # --------------------------------------------------------
    # RISK CHANGE
    # --------------------------------------------------------

    risk_change = (
        modified_probability
        - current_probability
    )

    # --------------------------------------------------------
    # IDENTIFY ACTUALLY CHANGED FEATURES
    # --------------------------------------------------------

    changed_factors = {}

    for feature in changes:

        if feature not in original_student:
            continue

        old_value = original_student[
            feature
        ]

        new_value = modified_student[
            feature
        ]

        if old_value != new_value:

            changed_factors[feature] = {

                "from": old_value,

                "to": new_value

            }

    # --------------------------------------------------------
    # CURRENT CLASSIFICATION
    # --------------------------------------------------------

    current_prediction = (
        current_probability >= threshold
    )

    # --------------------------------------------------------
    # WHAT-IF CLASSIFICATION
    # --------------------------------------------------------

    modified_prediction = (
        modified_probability >= threshold
    )

    # --------------------------------------------------------
    # RESPONSE
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