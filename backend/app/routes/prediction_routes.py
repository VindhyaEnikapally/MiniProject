from fastapi import APIRouter, HTTPException

from app.schemas.student_schema import StudentData
from app.services.ml_service import predict_student
from app.services.shap_service import get_shap_explanation
from app.services.intervention_service import generate_interventions
from app.services.student_service import get_student
from app.utils.data_validator import REQUIRED_FEATURES


router = APIRouter(
    prefix="/api/predictions",
    tags=["Predictions"]
)


# ---------------------------------------------------------
# 1. Predict risk for manually supplied student data
# ---------------------------------------------------------

@router.post("/predict")
def predict_student_risk(student: StudentData):

    try:
        student_data = student.model_dump()

        prediction_result = predict_student(student_data)

        shap_result = get_shap_explanation(student_data)

        interventions = generate_interventions(
            student_data,
            shap_result["shap_values"],
            shap_result["feature_names"]
        )

        return {
            "success": True,

            "student": student_data,

            "prediction": {
                "risk_probability": prediction_result["risk_probability"],
                "risk_percentage": prediction_result["risk_percentage"],
                "threshold": prediction_result["threshold"],
                "prediction": prediction_result["prediction"]
            },

            "shap_explanation": {
                "risk_increasing_factors":
                    shap_result["risk_increasing_factors"],

                "risk_reducing_factors":
                    shap_result["risk_reducing_factors"]
            },

            "interventions": interventions
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


# ---------------------------------------------------------
# 2. Analyze an existing student from uploaded dataset
# ---------------------------------------------------------

@router.get("/{dataset_id}/{student_id}/analysis")
def analyze_saved_student(
    dataset_id: str,
    student_id: str
):

    try:

        # ---------------------------------------------
        # Step 1: Get student from saved prediction CSV
        # ---------------------------------------------

        student = get_student(
            dataset_id,
            student_id
        )

        if student is None:

            raise HTTPException(
                status_code=404,
                detail="Student not found."
            )


        # ---------------------------------------------
        # Step 2: Select ONLY model input features
        # ---------------------------------------------
        #
        # Important:
        # The uploaded dataset also contains:
        # exam_score
        # performance_grade
        # pass_status
        # performance_level
        #
        # These are NOT used for prediction.
        #
        # Therefore we explicitly select the 36
        # approved early-risk prediction features.
        # ---------------------------------------------

        model_student = {
            feature: student[feature]
            for feature in REQUIRED_FEATURES
        }


        # ---------------------------------------------
        # Step 3: Risk prediction
        # ---------------------------------------------

        prediction_result = predict_student(
            model_student
        )


        # ---------------------------------------------
        # Step 4: SHAP explanation
        # ---------------------------------------------

        shap_result = get_shap_explanation(
            model_student
        )


        # ---------------------------------------------
        # Step 5: Intervention Policy Engine
        # ---------------------------------------------

        interventions = generate_interventions(
            model_student,
            shap_result["shap_values"],
            shap_result["feature_names"]
        )


        # ---------------------------------------------
        # Step 6: Return complete analysis
        # ---------------------------------------------

        return {

            "success": True,

            "dataset_id": dataset_id,

            "student_id": student_id,

            "student": student,

            "prediction": {
                "risk_probability":
                    prediction_result["risk_probability"],

                "risk_percentage":
                    prediction_result["risk_percentage"],

                "threshold":
                    prediction_result["threshold"],

                "prediction":
                    prediction_result["prediction"]
            },

            "shap_explanation": {

                "risk_increasing_factors":
                    shap_result["risk_increasing_factors"],

                "risk_reducing_factors":
                    shap_result["risk_reducing_factors"]
            },

            "interventions": interventions
        }


    except HTTPException:
        raise


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Student analysis failed: {str(e)}"
        )