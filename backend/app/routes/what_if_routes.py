from fastapi import APIRouter, HTTPException

from app.schemas.what_if_schema import WhatIfRequest
from app.services.student_service import get_student
from app.services.what_if_service import run_what_if_analysis
from app.utils.data_validator import REQUIRED_FEATURES


router = APIRouter(
    prefix="/api/what-if",
    tags=["What-If Analysis"]
)


@router.post("/{dataset_id}/{student_id}")
def analyze_what_if(
    dataset_id: str,
    student_id: str,
    request: WhatIfRequest
):
    try:

        # Get the stored student
        student = get_student(
            dataset_id,
            student_id
        )

        if student is None:
            raise HTTPException(
                status_code=404,
                detail="Student not found."
            )

        # Use only the 36 approved model features
        model_student = {
            feature: student[feature]
            for feature in REQUIRED_FEATURES
        }

        # Run what-if analysis
        result = run_what_if_analysis(
            model_student,
            request.changes
        )

        return {
            "success": True,
            "dataset_id": dataset_id,
            "student_id": student_id,
            **result
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"What-if analysis failed: {str(e)}"
        )