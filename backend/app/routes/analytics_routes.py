from pathlib import Path

import pandas as pd

from fastapi import (
    APIRouter,
    HTTPException
)

from app.core.config import (
    UPLOAD_DIR
)

from app.services.analytics_service import (
    get_dashboard_analytics,
    get_top_risk_students
)


router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"]
)


# ============================================================
# DASHBOARD ANALYTICS
# ============================================================

@router.get(
    "/dashboard/{dataset_id}"
)
def get_dashboard(
    dataset_id: str
):

    # --------------------------------------------------------
    # BUILD PREDICTION FILE PATH
    # --------------------------------------------------------

    prediction_file = (
        UPLOAD_DIR
        / f"dataset_{dataset_id}_predictions.csv"
    )

    # --------------------------------------------------------
    # CHECK FILE
    # --------------------------------------------------------

    if not prediction_file.exists():

        raise HTTPException(
            status_code=404,
            detail=(
                "Prediction dataset not found. "
                "Please run bulk prediction first."
            )
        )

    # --------------------------------------------------------
    # READ PREDICTION DATA
    # --------------------------------------------------------

    try:

        df = pd.read_csv(
            prediction_file
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Prediction dataset could not "
                f"be read: {str(e)}"
            )
        )

    # --------------------------------------------------------
    # CHECK REQUIRED COLUMNS
    # --------------------------------------------------------

    required_columns = [
        "risk_probability",
        "risk_percentage",
        "prediction"
    ]

    missing_columns = [

        column

        for column in required_columns

        if column not in df.columns

    ]

    if missing_columns:

        raise HTTPException(
            status_code=500,
            detail={
                "message":
                    "Prediction dataset is missing required columns.",
                "missing_columns":
                    missing_columns
            }
        )

    # --------------------------------------------------------
    # GENERATE ANALYTICS
    # --------------------------------------------------------

    try:

        analytics = (
            get_dashboard_analytics(
                df
            )
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Analytics generation failed: "
                f"{str(e)}"
            )
        )

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {

        "success":
            True,

        "dataset_id":
            dataset_id,

        "analytics":
            analytics

    }


# ============================================================
# TOP RISK STUDENTS
# ============================================================

@router.get(
    "/top-risk/{dataset_id}"
)
def get_top_risk(
    dataset_id: str,
    limit: int = 10
):

    # --------------------------------------------------------
    # VALIDATE LIMIT
    # --------------------------------------------------------

    if limit < 1:

        raise HTTPException(
            status_code=400,
            detail=(
                "Limit must be at least 1."
            )
        )

    if limit > 100:

        raise HTTPException(
            status_code=400,
            detail=(
                "Limit cannot exceed 100."
            )
        )

    # --------------------------------------------------------
    # FILE
    # --------------------------------------------------------

    prediction_file = (
        UPLOAD_DIR
        / f"dataset_{dataset_id}_predictions.csv"
    )

    if not prediction_file.exists():

        raise HTTPException(
            status_code=404,
            detail=(
                "Prediction dataset not found."
            )
        )

    # --------------------------------------------------------
    # READ
    # --------------------------------------------------------

    try:

        df = pd.read_csv(
            prediction_file
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Prediction dataset could not "
                f"be read: {str(e)}"
            )
        )

    # --------------------------------------------------------
    # TOP RISK
    # --------------------------------------------------------

    try:

        students = (
            get_top_risk_students(
                df,
                limit=limit
            )
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Top-risk analysis failed: "
                f"{str(e)}"
            )
        )

    return {

        "success":
            True,

        "dataset_id":
            dataset_id,

        "count":
            len(students),

        "students":
            students

    }