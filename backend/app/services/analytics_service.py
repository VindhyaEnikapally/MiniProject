import pandas as pd


# ============================================================
# RISK DISPLAY BANDS
# ============================================================
#
# IMPORTANT:
# These are dashboard display bands.
# They are NOT the XGBoost prediction threshold.
#
# Model threshold ≈ 0.3522
#
# Dashboard bands:
# High   >= 0.70
# Medium >= 0.40 and < 0.70
# Low    < 0.40
# ============================================================

def get_risk_level(
    risk_probability: float
) -> str:

    if risk_probability >= 0.70:
        return "High"

    if risk_probability >= 0.40:
        return "Medium"

    return "Low"


# ============================================================
# ADD RISK LEVEL
# ============================================================

def add_risk_levels(
    df: pd.DataFrame
) -> pd.DataFrame:

    result_df = df.copy()

    result_df["risk_level"] = (
        result_df[
            "risk_probability"
        ]
        .apply(get_risk_level)
    )

    return result_df


# ============================================================
# OVERVIEW
# ============================================================

def get_overview(
    df: pd.DataFrame
) -> dict:

    total_students = int(
        len(df)
    )

    at_risk_students = int(
        (
            df["prediction"]
            == "At Risk"
        ).sum()
    )

    not_at_risk_students = (
        total_students
        - at_risk_students
    )

    at_risk_percentage = (

        (
            at_risk_students
            / total_students
        )
        * 100

        if total_students > 0

        else 0

    )

    average_risk = float(
        df[
            "risk_probability"
        ].mean()
    ) if total_students > 0 else 0

    return {

        "total_students":
            total_students,

        "at_risk_students":
            at_risk_students,

        "not_at_risk_students":
            not_at_risk_students,

        "at_risk_percentage":
            round(
                at_risk_percentage,
                2
            ),

        "average_risk_probability":
            round(
                average_risk,
                4
            ),

        "average_risk_percentage":
            round(
                average_risk * 100,
                2
            ),

        "education_level": (
            str(df["education_level"].dropna().iloc[0])
            if "education_level" in df.columns and not df["education_level"].dropna().empty
            else None
        )

    }


# ============================================================
# RISK DISTRIBUTION
# ============================================================

def get_risk_distribution(
    df: pd.DataFrame
) -> dict:

    result_df = add_risk_levels(
        df
    )

    counts = (
        result_df[
            "risk_level"
        ]
        .value_counts()
    )

    high_count = int(
        counts.get(
            "High",
            0
        )
    )

    medium_count = int(
        counts.get(
            "Medium",
            0
        )
    )

    low_count = int(
        counts.get(
            "Low",
            0
        )
    )

    total = int(
        len(result_df)
    )

    return {

        "high": {

            "count":
                high_count,

            "percentage":
                round(
                    (
                        high_count
                        / total
                        * 100
                    )
                    if total > 0
                    else 0,
                    2
                )

        },

        "medium": {

            "count":
                medium_count,

            "percentage":
                round(
                    (
                        medium_count
                        / total
                        * 100
                    )
                    if total > 0
                    else 0,
                    2
                )

        },

        "low": {

            "count":
                low_count,

            "percentage":
                round(
                    (
                        low_count
                        / total
                        * 100
                    )
                    if total > 0
                    else 0,
                    2
                )

        }

    }


# ============================================================
# TOP RISK STUDENTS
# ============================================================

def get_top_risk_students(
    df: pd.DataFrame,
    limit: int = 10
) -> list:

    result_df = (
        df
        .sort_values(
            "risk_probability",
            ascending=False
        )
        .head(limit)
    )

    students = []

    for index, row in (
        result_df.iterrows()
    ):

        student_id = row.get(
            "student_id",
            index
        )

        risk_probability = float(
            row[
                "risk_probability"
            ]
        )

        students.append({

            "student_id":
                str(
                    student_id
                ),

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

            "risk_level":
                get_risk_level(
                    risk_probability
                ),

            "prediction":
                str(
                    row[
                        "prediction"
                    ]
                ),

            "education_level": (
                str(row["education_level"])
                if "education_level" in row and pd.notna(row["education_level"])
                else None
            )

        })

    return students


# ============================================================
# AVERAGE RISK
# ============================================================

def get_average_risk(
    df: pd.DataFrame
) -> float:

    if len(df) == 0:
        return 0.0

    return float(
        df[
            "risk_probability"
        ].mean()
    )


# ============================================================
# COMPLETE DASHBOARD ANALYTICS
# ============================================================

def get_dashboard_analytics(
    df: pd.DataFrame
) -> dict:

    return {

        "overview":
            get_overview(
                df
            ),

        "risk_distribution":
            get_risk_distribution(
                df
            ),

        "top_risk_students":
            get_top_risk_students(
                df,
                limit=10
            ),

        "average_risk":
            round(
                get_average_risk(
                    df
                ),
                4
            )

    }