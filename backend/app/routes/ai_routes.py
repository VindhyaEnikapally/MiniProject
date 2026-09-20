from fastapi import APIRouter, HTTPException

from app.services.student_service import get_student
from app.services.ml_service import predict_student
from app.services.shap_service import get_shap_explanation
from app.services.intervention_service import generate_interventions
from app.services.llm_service import generate_ai_insight
from app.utils.data_validator import REQUIRED_FEATURES


router = APIRouter(
    prefix="/api/ai",
    tags=["AI Insights"]
)


# =========================================================
# AI Insight Endpoint
# =========================================================

@router.get("/{dataset_id}/{student_id}/insight")
def get_student_ai_insight(
    dataset_id: str,
    student_id: str
):

    try:

        # =================================================
        # 1. Get Student From Saved Dataset
        # =================================================

        student = get_student(
            dataset_id,
            student_id
        )

        if student is None:

            raise HTTPException(
                status_code=404,
                detail="Student not found."
            )


        # =================================================
        # 2. Select ONLY ML Features
        # =================================================
        #
        # These are the features used by XGBoost.
        #
        # education_level is intentionally NOT included
        # here because the current XGBoost model was not
        # trained with education_level as an input feature.
        #
        # Therefore education_level will be used only as
        # context for the AI/LLM layer.
        # =================================================

        model_student = {

            feature: student[feature]

            for feature in REQUIRED_FEATURES
        }


        # =================================================
        # 3. Generate XGBoost Prediction
        # =================================================

        prediction = predict_student(
            model_student
        )


        # =================================================
        # 4. Generate SHAP Explanation
        # =================================================

        shap_result = get_shap_explanation(
            model_student
        )


        # =================================================
        # 5. Generate Intervention Policy
        # =================================================

        interventions = generate_interventions(

            model_student,

            shap_result["shap_values"],

            shap_result["feature_names"]
        )


        # =================================================
        # 6. Create AI Context
        # =================================================
        #
        # We now create a separate dictionary for Groq.
        #
        # It contains:
        # - all ML features
        # - education_level
        #
        # education_level is NOT sent to XGBoost.
        # =================================================

        ai_student = {

            **model_student,

            "education_level":
                student.get(
                    "education_level",
                    "Unknown"
                )
        }


        # =================================================
        # 7. Generate Groq AI Insight
        # =================================================

        ai_result = generate_ai_insight(

            student=ai_student,

            prediction=prediction,

            shap_explanation={

                "risk_increasing_factors":
                    shap_result[
                        "risk_increasing_factors"
                    ],

                "risk_reducing_factors":
                    shap_result[
                        "risk_reducing_factors"
                    ]
            },

            interventions=interventions
        )


        # =================================================
        # 8. Return Complete Response
        # =================================================

        return {

            "success": True,

            "dataset_id":
                dataset_id,

            "student_id":
                student_id,

            "education_level":
                student.get(
                    "education_level",
                    "Unknown"
                ),

            "prediction": {

                "risk_probability":
                    prediction[
                        "risk_probability"
                    ],

                "risk_percentage":
                    prediction[
                        "risk_percentage"
                    ],

                "threshold":
                    prediction[
                        "threshold"
                    ],

                "prediction":
                    prediction[
                        "prediction"
                    ]
            },

            "ai_insight":
                ai_result
        }


    # =====================================================
    # Re-raise known HTTP errors
    # =====================================================

    except HTTPException:

        raise


    # =====================================================
    # Handle unexpected errors
    # =====================================================

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=(
                "AI insight generation failed: "
                f"{str(e)}"
            )
        )