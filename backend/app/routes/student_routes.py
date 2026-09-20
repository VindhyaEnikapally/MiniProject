import uuid

import pandas as pd

from typing import Optional

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException,
    Query
)

from app.core.config import UPLOAD_DIR

from app.utils.data_validator import (
    validate_dataset,
    handle_missing_values
)

from app.services.ml_service import (
    predict_dataframe
)

from app.services.student_service import (
    search_students,
    get_student
)


router = APIRouter(
    prefix="/api/students",
    tags=["Students"]
)


# ============================================================
# UPLOAD + VALIDATE + CLEAN CSV
# ============================================================

@router.post("/upload")
async def upload_student_dataset(
    file: UploadFile = File(...),
    education_level: Optional[str] = Form(None)
):

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No file was selected."
        )

    if not file.filename.lower().endswith(
        ".csv"
    ):

        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported."
        )

    try:

        df = pd.read_csv(
            file.file
        )

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=(
                "CSV could not be read: "
                f"{str(e)}"
            )
        )

    # --------------------------------------------------------
    # NORMALIZE COLUMN NAMES
    # --------------------------------------------------------

    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(
            " ",
            "_"
        )
        .str.replace(
            "-",
            "_"
        )
    )

    # --------------------------------------------------------
    # APPLY EDUCATION LEVEL (IF PROVIDED)
    # --------------------------------------------------------

    if education_level:
        df["education_level"] = education_level

    # --------------------------------------------------------
    # VALIDATE
    # --------------------------------------------------------

    try:

        validation = (
            validate_dataset(
                df
            )
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Dataset validation failed: "
                f"{str(e)}"
            )
        )

    if not validation["valid"]:

        return {

            "success":
                False,

            "message":
                "Dataset validation failed.",

            "validation":
                validation

        }

    # --------------------------------------------------------
    # IMPUTATION
    # --------------------------------------------------------

    try:

        cleaned_df, imputation_report = (
            handle_missing_values(
                df
            )
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Missing-value processing failed: "
                f"{str(e)}"
            )
        )

    remaining_missing = int(
        cleaned_df.isna()
        .sum()
        .sum()
    )

    return {

        "success":
            True,

        "message":
            "Dataset validated and missing values handled successfully.",

        "education_level":
            education_level,

        "rows":
            int(
                cleaned_df.shape[0]
            ),

        "columns":
            int(
                cleaned_df.shape[1]
            ),

        "original_missing_values":
            validation[
                "missing_value_validation"
            ],

        "imputation_report":
            imputation_report,

        "remaining_missing_values":
            remaining_missing

    }


# ============================================================
# BULK STUDENT PREDICTION
# ============================================================

@router.post("/bulk-predict")
async def bulk_predict_students(
    file: UploadFile = File(...),
    education_level: Optional[str] = Form(None)
):

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No file was selected."
        )

    if not file.filename.lower().endswith(
        ".csv"
    ):

        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported."
        )

    # --------------------------------------------------------
    # READ CSV
    # --------------------------------------------------------

    try:

        df = pd.read_csv(
            file.file
        )

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=(
                "CSV could not be read: "
                f"{str(e)}"
            )
        )

    # --------------------------------------------------------
    # NORMALIZE
    # --------------------------------------------------------

    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(
            " ",
            "_"
        )
        .str.replace(
            "-",
            "_"
        )
    )

    # --------------------------------------------------------
    # APPLY EDUCATION LEVEL (IF PROVIDED)
    # --------------------------------------------------------

    if education_level:
        df["education_level"] = education_level

    # --------------------------------------------------------
    # VALIDATE
    # --------------------------------------------------------

    try:

        validation = (
            validate_dataset(
                df
            )
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Dataset validation failed: "
                f"{str(e)}"
            )
        )

    if not validation["valid"]:

        return {

            "success":
                False,

            "message":
                "Dataset validation failed.",

            "validation":
                validation

        }

    # --------------------------------------------------------
    # IMPUTATION
    # --------------------------------------------------------

    try:

        cleaned_df, imputation_report = (
            handle_missing_values(
                df
            )
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Missing-value processing failed: "
                f"{str(e)}"
            )
        )

    remaining_missing = int(
        cleaned_df.isna()
        .sum()
        .sum()
    )

    if remaining_missing > 0:

        raise HTTPException(
            status_code=400,
            detail=(
                "Missing values remain after "
                "imputation."
            )
        )

    # --------------------------------------------------------
    # MODEL PREDICTION
    # --------------------------------------------------------

    try:

        result_df = predict_dataframe(
            cleaned_df
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Bulk prediction failed: "
                f"{str(e)}"
            )
        )

    # --------------------------------------------------------
    # DATASET ID
    # --------------------------------------------------------

    dataset_id = (
        uuid.uuid4()
        .hex[:12]
    )

    # --------------------------------------------------------
    # SAVE CLEANED DATA
    # --------------------------------------------------------

    cleaned_file = (
        UPLOAD_DIR
        / f"dataset_{dataset_id}_cleaned.csv"
    )

    cleaned_df.to_csv(
        cleaned_file,
        index=False
    )

    # --------------------------------------------------------
    # SAVE PREDICTIONS
    # --------------------------------------------------------

    prediction_file = (
        UPLOAD_DIR
        / f"dataset_{dataset_id}_predictions.csv"
    )

    result_df.to_csv(
        prediction_file,
        index=False
    )

    # --------------------------------------------------------
    # ANALYTICS
    # --------------------------------------------------------

    total_students = int(
        len(
            result_df
        )
    )

    at_risk_count = int(
        (
            result_df[
                "prediction"
            ]
            == "At Risk"
        ).sum()
    )

    not_at_risk_count = (
        total_students
        - at_risk_count
    )

    at_risk_percentage = (

        (
            at_risk_count
            / total_students
        )
        * 100

        if total_students > 0

        else 0

    )

    average_risk = float(
        result_df[
            "risk_probability"
        ].mean()
    )

    # --------------------------------------------------------
    # TOP RISK STUDENTS
    # --------------------------------------------------------

    top_risk_df = (
        result_df
        .sort_values(
            "risk_probability",
            ascending=False
        )
        .head(10)
    )

    top_risk_students = []

    for index, row in (
        top_risk_df.iterrows()
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

        top_risk_students.append({

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

            "prediction":
                str(
                    row[
                        "prediction"
                    ]
                )

        })

    # --------------------------------------------------------
    # PREVIEW
    # --------------------------------------------------------

    preview_df = (
        result_df
        .head(10)
    )

    prediction_preview = []

    for index, row in (
        preview_df.iterrows()
    ):

        student_id = row.get(
            "student_id",
            index
        )

        prediction_preview.append({

            "student_id":
                str(
                    student_id
                ),

            "risk_probability":
                round(
                    float(
                        row[
                            "risk_probability"
                        ]
                    ),
                    4
                ),

            "risk_percentage":
                round(
                    float(
                        row[
                            "risk_percentage"
                        ]
                    ),
                    2
                ),

            "prediction":
                str(
                    row[
                        "prediction"
                    ]
                )

        })

    return {

        "success":
            True,

        "message":
            "Bulk prediction completed successfully.",

        "dataset_id":
            dataset_id,

        "education_level":
            education_level,

        "analytics": {

            "total_students":
                total_students,

            "at_risk_students":
                at_risk_count,

            "not_at_risk_students":
                not_at_risk_count,

            "at_risk_percentage":
                round(
                    at_risk_percentage,
                    2
                ),

            "average_risk":
                round(
                    average_risk,
                    4
                ),

            "education_level":
                education_level

        },

        "top_risk_students":
            top_risk_students,

        "prediction_preview":
            prediction_preview,

        "imputation_report":
            imputation_report,

        "remaining_missing_values":
            remaining_missing

    }


# ============================================================
# SEARCH STUDENTS
# ============================================================

@router.get("/search/{dataset_id}")
def search_student_records(
    dataset_id: str,
    search: str = Query(
        default="",
        description="Student ID search text"
    ),
    limit: int = Query(
        default=20,
        ge=1,
        le=100
    )
):

    students = search_students(
        dataset_id=dataset_id,
        search=search,
        limit=limit
    )

    if students is None:

        raise HTTPException(
            status_code=404,
            detail=(
                "Dataset not found."
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



@router.get("/requirements")
def get_student_data_requirements():

    from app.utils.data_validator import (
        REQUIRED_FEATURES
    )

    return {

        "required_format":
            "CSV",

        "required_features":
            REQUIRED_FEATURES,

        "extra_columns_allowed":
            True

    }


# ============================================================
# GET INDIVIDUAL STUDENT
# ============================================================

@router.get(
    "/{dataset_id}/{student_id}"
)
def get_student_details(
    dataset_id: str,
    student_id: str
):

    student = get_student(
        dataset_id=dataset_id,
        student_id=student_id
    )

    if student is None:

        raise HTTPException(
            status_code=404,
            detail=(
                "Student not found."
            )
        )

    return {

        "success":
            True,

        "dataset_id":
            dataset_id,

        "student":
            student

    }


# ============================================================
# DATASET REQUIREMENTS
# ============================================================

