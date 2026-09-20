import pandas as pd


# ============================================================
# REQUIRED MODEL FEATURES
# ============================================================

REQUIRED_FEATURES = [

    "age",
    "gender",
    "education_level",
    "school_type",
    "family_income",
    "parent_education",
    "urban_rural",
    "previous_exam_score",
    "previous_gpa",
    "attendance_percentage",
    "assignment_completion_rate",
    "class_participation",
    "study_hours_per_day",
    "self_study_hours",
    "private_tuition",
    "online_learning_hours",
    "study_consistency",
    "study_environment",
    "study_method",
    "revision_frequency",
    "practice_tests_completed",
    "notes_quality",
    "sleep_hours",
    "sleep_quality",
    "daily_screen_time",
    "physical_activity_hours",
    "break_frequency",
    "stress_level",
    "motivation_level",
    "internet_access",
    "device_availability",
    "educational_app_usage",
    "online_course_hours",
    "exam_preparation_days",
    "time_management_score",
    "exam_anxiety_level"

]


# ============================================================
# NUMERICAL FEATURES
# ============================================================

NUMERICAL_FEATURES = [

    "age",
    "previous_exam_score",
    "previous_gpa",
    "attendance_percentage",
    "assignment_completion_rate",
    "study_hours_per_day",
    "self_study_hours",
    "private_tuition",
    "online_learning_hours",
    "practice_tests_completed",
    "sleep_hours",
    "daily_screen_time",
    "physical_activity_hours",
    "stress_level",
    "internet_access",
    "online_course_hours",
    "exam_preparation_days",
    "time_management_score",
    "exam_anxiety_level"

]


# ============================================================
# CATEGORICAL FEATURES
# ============================================================

CATEGORICAL_FEATURES = [

    "gender",
    "education_level",
    "school_type",
    "family_income",
    "parent_education",
    "urban_rural",
    "class_participation",
    "study_consistency",
    "study_environment",
    "study_method",
    "revision_frequency",
    "notes_quality",
    "sleep_quality",
    "break_frequency",
    "motivation_level",
    "device_availability",
    "educational_app_usage"

]


# ============================================================
# COLUMN VALIDATION
# ============================================================

def validate_columns(
    df: pd.DataFrame
):

    missing_columns = [
        column
        for column in REQUIRED_FEATURES
        if column not in df.columns
    ]

    extra_columns = [
        column
        for column in df.columns
        if column not in REQUIRED_FEATURES
    ]

    return {

        "valid":
            len(missing_columns) == 0,

        "missing_columns":
            missing_columns,

        "extra_columns":
            extra_columns,

        "total_required_features":
            len(REQUIRED_FEATURES),

        "available_required_features":
            len(
                [
                    column
                    for column in REQUIRED_FEATURES
                    if column in df.columns
                ]
            )

    }


# ============================================================
# MISSING VALUE VALIDATION
# ============================================================

def validate_missing_values(
    df: pd.DataFrame
):

    missing_by_feature = {}

    for column in REQUIRED_FEATURES:

        if column in df.columns:

            missing_count = int(
                df[column].isna().sum()
            )

            if missing_count > 0:

                missing_by_feature[
                    column
                ] = missing_count

    total_missing = sum(
        missing_by_feature.values()
    )

    return {

        "has_missing_values":
            total_missing > 0,

        "total_missing_values":
            int(total_missing),

        "missing_by_feature":
            missing_by_feature

    }


# ============================================================
# HANDLE MISSING VALUES
# ============================================================

def handle_missing_values(
    df: pd.DataFrame
):

    """
    Fill missing values using the same strategy
    used during model preparation:

    Numerical  -> median
    Categorical -> mode

    Returns:
        cleaned DataFrame
        imputation report
    """

    df = df.copy()

    imputation_report = {

        "numerical": {},

        "categorical": {}

    }

    # --------------------------------------------------------
    # NUMERICAL FEATURES
    # --------------------------------------------------------

    for column in NUMERICAL_FEATURES:

        if column not in df.columns:
            continue

        if not df[column].isna().any():
            continue

        median_value = df[column].median()

        df[column] = (
            df[column].fillna(
                median_value
            )
        )

        imputation_report[
            "numerical"
        ][column] = {

            "method":
                "median",

            "value":
                float(median_value)

        }

    # --------------------------------------------------------
    # CATEGORICAL FEATURES
    # --------------------------------------------------------

    for column in CATEGORICAL_FEATURES:

        if column not in df.columns:
            continue

        if not df[column].isna().any():
            continue

        mode_values = (
            df[column].mode(
                dropna=True
            )
        )

        # Safety check
        if len(mode_values) == 0:
            continue

        mode_value = mode_values.iloc[0]

        df[column] = (
            df[column].fillna(
                mode_value
            )
        )

        imputation_report[
            "categorical"
        ][column] = {

            "method":
                "mode",

            "value":
                str(mode_value)

        }

    return (
        df,
        imputation_report
    )


# ============================================================
# FULL DATASET VALIDATION
# ============================================================

def validate_dataset(
    df: pd.DataFrame
):

    column_validation = (
        validate_columns(df)
    )

    missing_value_validation = (
        validate_missing_values(df)
    )

    return {

        "valid":
            column_validation["valid"],

        "row_count":
            int(df.shape[0]),

        "column_count":
            int(df.shape[1]),

        "column_validation":
            column_validation,

        "missing_value_validation":
            missing_value_validation

    }