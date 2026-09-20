from app.services.shap_service import readable_feature_name


# ============================================================
# INTERVENTION RULES
# ============================================================

INTERVENTION_RULES = {

    "practice_tests_completed": {
        "shap_feature": "num__practice_tests_completed",
        "condition": lambda x: x < 4,
        "action": "Encourage regular practice-test completion"
    },

    "exam_preparation_days": {
        "shap_feature": "num__exam_preparation_days",
        "condition": lambda x: x < 7,
        "action": "Create an early exam-preparation plan"
    },

    "stress_level": {
        "shap_feature": "num__stress_level",
        "condition": lambda x: x >= 7,
        "action": "Faculty mentoring and stress-management support"
    },

    "exam_anxiety_level": {
        "shap_feature": "num__exam_anxiety_level",
        "condition": lambda x: x >= 7,
        "action": "Provide exam-anxiety management and mentoring support"
    },

    "attendance_percentage": {
        "shap_feature": "num__attendance_percentage",
        "condition": lambda x: x < 85,
        "action": "Monitor attendance and encourage regular class participation"
    },

    "study_hours_per_day": {
        "shap_feature": "num__study_hours_per_day",
        "condition": lambda x: x < 4,
        "action": "Encourage a consistent daily study schedule"
    },

    "sleep_hours": {
        "shap_feature": "num__sleep_hours",
        "condition": lambda x: x < 6,
        "action": "Encourage healthier sleep habits"
    },

    "time_management_score": {
        "shap_feature": "num__time_management_score",
        "condition": lambda x: x < 60,
        "action": "Provide time-management guidance"
    },

    "self_study_hours": {
        "shap_feature": "num__self_study_hours",
        "condition": lambda x: x < 2,
        "action": "Encourage additional self-study time"
    },

    "assignment_completion_rate": {
        "shap_feature": "num__assignment_completion_rate",
        "condition": lambda x: x < 70,
        "action": "Monitor assignment completion and provide academic support"
    }
}


# ============================================================
# PRIORITY ORDER
# ============================================================

PRIORITY_ORDER = {
    "High": 0,
    "Medium": 1,
    "Low": 2
}


# ============================================================
# PRIORITY CALCULATION
# ============================================================

def get_priority(shap_value: float) -> str:

    if shap_value >= 0.30:
        return "High"

    if shap_value >= 0.10:
        return "Medium"

    return "Low"


# ============================================================
# GENERATE INTERVENTIONS
# ============================================================

def generate_interventions(
    student: dict,
    shap_values,
    feature_names
):
    """
    Generate faculty intervention recommendations
    using raw feature conditions + SHAP contribution.
    """

    shap_lookup = dict(
        zip(
            feature_names,
            shap_values
        )
    )

    interventions = []

    for raw_feature, rule in INTERVENTION_RULES.items():

        # Make sure the feature exists
        if raw_feature not in student:
            continue

        actual_value = student[
            raw_feature
        ]

        shap_value = shap_lookup.get(
            rule["shap_feature"],
            0
        )

        # Apply intervention only when:
        # 1. Raw value meets the intervention condition
        # 2. SHAP indicates the factor increases risk
        if (
            rule["condition"](actual_value)
            and shap_value > 0
        ):

            priority = get_priority(
                float(shap_value)
            )

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

    # Sort High → Medium → Low
    interventions.sort(
        key=lambda x:
        PRIORITY_ORDER[
            x["priority"]
        ]
    )

    return interventions