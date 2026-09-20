import pandas as pd


def create_engineered_features(
    df: pd.DataFrame
) -> pd.DataFrame:
    """
    Create the engineered features used during model training.
    """

    df = df.copy()

    # 1. Total study hours
    df["total_study_hours"] = (
        df["study_hours_per_day"]
        + df["self_study_hours"]
    )

    # 2. Preparation intensity
    df["preparation_intensity"] = (
        df["exam_preparation_days"]
        * df["study_hours_per_day"]
    )

    # 3. Practice tests per preparation day
    df["practice_per_preparation_day"] = (
        df["practice_tests_completed"]
        / (df["exam_preparation_days"] + 1)
    )

    # 4. Study-screen ratio
    df["study_screen_ratio"] = (
        df["total_study_hours"]
        / (df["daily_screen_time"] + 1)
    )

    # 5. Academic consistency
    df["academic_consistency"] = (
        0.6 * df["previous_exam_score"]
        + 0.4 * (
            df["previous_gpa"] / 4 * 100
        )
    )

    return df