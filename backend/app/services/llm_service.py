import json

from groq import Groq

from app.core.config import GROQ_API_KEY, LLM_MODEL


# =========================================================
# Groq Client
# =========================================================

client = None

if GROQ_API_KEY:
    client = Groq(api_key=GROQ_API_KEY)


# =========================================================
# Structured Output Schema
# =========================================================

AI_INSIGHT_SCHEMA = {
    "type": "object",

    "properties": {

        "summary": {
            "type": "string"
        },

        "key_factors": {
            "type": "array",
            "items": {
                "type": "object",

                "properties": {

                    "factor": {
                        "type": "string"
                    },

                    "contribution": {
                        "type": "number"
                    },

                    "interpretation": {
                        "type": "string"
                    }
                },

                "required": [
                    "factor",
                    "contribution",
                    "interpretation"
                ],

                "additionalProperties": False
            }
        },

        "faculty_actions": {
            "type": "array",
            "items": {
                "type": "object",

                "properties": {

                    "priority": {
                        "type": "string"
                    },

                    "action": {
                        "type": "string"
                    }
                },

                "required": [
                    "priority",
                    "action"
                ],

                "additionalProperties": False
            }
        },

        "student_support": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },

        "what_to_monitor": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },

        "disclaimer": {
            "type": "string"
        }
    },

    "required": [
        "summary",
        "key_factors",
        "faculty_actions",
        "student_support",
        "what_to_monitor",
        "disclaimer"
    ],

    "additionalProperties": False
}


# =========================================================
# Generate AI Insight
# =========================================================

def generate_ai_insight(
    student: dict,
    prediction: dict,
    shap_explanation: dict,
    interventions: list
) -> dict:

    # -----------------------------------------------------
    # Check Groq configuration
    # -----------------------------------------------------

    if client is None:

        raise RuntimeError(
            "GROQ_API_KEY is not configured."
        )


    # -----------------------------------------------------
    # Education level
    # -----------------------------------------------------

    education_level = student.get(
        "education_level",
        "Unknown"
    )


    # -----------------------------------------------------
    # Prediction
    # -----------------------------------------------------

    risk_percentage = float(
        prediction["risk_percentage"]
    )

    prediction_label = prediction[
        "prediction"
    ]


    # -----------------------------------------------------
    # SHAP factors
    # -----------------------------------------------------

    risk_factors = (
        shap_explanation.get(
            "risk_increasing_factors",
            []
        )
    )

    protective_factors = (
        shap_explanation.get(
            "risk_reducing_factors",
            []
        )
    )


    # -----------------------------------------------------
    # Intervention information
    # -----------------------------------------------------

    intervention_data = []

    for intervention in interventions:

        intervention_data.append({

            "priority": intervention.get(
                "priority"
            ),

            "factor": intervention.get(
                "factor"
            ),

            "current_value": intervention.get(
                "current_value"
            ),

            "recommended_action": intervention.get(
                "recommended_action"
            )
        })


    # -----------------------------------------------------
    # Evidence
    # -----------------------------------------------------

    evidence = {

        "education_level": education_level,

        "prediction": {

            "risk_percentage":
                risk_percentage,

            "status":
                prediction_label
        },

        "risk_increasing_factors":
            risk_factors,

        "risk_reducing_factors":
            protective_factors,

        "interventions":
            intervention_data
    }


    # -----------------------------------------------------
    # Education-specific instructions
    # -----------------------------------------------------

    education_guidance = {

        "School": """
Focus on school-level academic support.

Consider:
- attendance
- classroom participation
- homework and assignments
- study habits
- learning consistency
- teacher support
- parent/guardian involvement when appropriate

Do not give university-level recommendations.
""",

        "Intermediate": """
Focus on Intermediate-level academic and examination
preparation.

Consider:
- revision
- mock/practice tests
- exam preparation
- attendance
- study schedule
- time management
- examination stress

Do not assume specific board or competitive examination
information unless it is provided.
""",

        "Undergraduate": """
Focus on undergraduate/university academic support.

Consider:
- semester performance
- attendance
- assignments
- previous academic performance
- study consistency
- projects
- academic mentoring

Do not invent information about backlogs, internships,
placements, or projects if those details are not provided.
""",

        "Unknown": """
Use general academic support recommendations based only
on the supplied evidence.
"""
    }


    education_context = education_guidance.get(
        education_level,
        education_guidance["Unknown"]
    )


    # =====================================================
    # System Prompt
    # =====================================================

    system_prompt = f"""
You are an AI academic decision-support assistant
for faculty members.

You analyze evidence produced by a machine-learning
student-risk prediction system.

The machine-learning prediction is authoritative.

IMPORTANT RULES:

1. NEVER change the supplied risk probability.

2. NEVER change the supplied prediction label.

3. SHAP values represent model contribution.
   They do NOT prove causation.

4. Do not say that a SHAP factor directly causes
   academic failure.

5. Do not invent student information.

6. Base recommendations only on supplied evidence.

7. Do not make medical or psychological diagnoses.

8. Recommendations must be appropriate for faculty.

9. Education level affects the recommendations and
   interpretation only.

10. Education level MUST NOT change the supplied
    machine-learning prediction.

EDUCATION LEVEL:

{education_level}

EDUCATION-SPECIFIC GUIDANCE:

{education_context}

SHAP LANGUAGE:

Prefer wording such as:

"For this student, this factor has a positive SHAP
contribution, meaning it pushed the model prediction
toward higher risk."

Do not use causal language such as:

"This factor causes failure."

The final response must be useful to a teacher or faculty
member.

Return the response using the supplied JSON schema.
"""


    # =====================================================
    # User Prompt
    # =====================================================

    user_prompt = f"""
Generate a faculty-facing AI insight using the following
machine-learning evidence.

IMPORTANT:

The prediction below is already calculated by XGBoost.
Do not calculate a new prediction.

Education level:
{education_level}

Machine-learning evidence:

{json.dumps(evidence, indent=2)}

Current prediction:

Risk probability:
{risk_percentage}%

Prediction:
{prediction_label}

Generate:

1. A concise summary.

2. The most important SHAP factors.

3. Practical faculty actions.

4. Student-support suggestions.

5. Factors that should be monitored.

6. A short disclaimer explaining that SHAP represents
   model contribution rather than causation.

Make the recommendations appropriate for the student's
education level.

Do not invent information.

Do not modify the supplied risk probability.

Do not modify the supplied prediction.
"""


    # =====================================================
    # Groq API Call
    # =====================================================

    response = client.chat.completions.create(

        model=LLM_MODEL,

        messages=[

            {
                "role": "system",
                "content": system_prompt
            },

            {
                "role": "user",
                "content": user_prompt
            }
        ],

        temperature=0.2,

        max_tokens=1500,

        reasoning_effort="low",

        response_format={

            "type": "json_schema",

            "json_schema": {

                "name": "student_ai_insight",

                "strict": True,

                "schema": AI_INSIGHT_SCHEMA
            }
        }
    )


    # =====================================================
    # Inspect Response
    # =====================================================

    if not response.choices:

        raise RuntimeError(
            "Groq returned no choices."
        )


    message = response.choices[0].message


    # -----------------------------------------------------
    # Check for refusal
    # -----------------------------------------------------

    if getattr(message, "refusal", None):

        raise RuntimeError(
            "Groq refused the request: "
            + str(message.refusal)
        )


    # -----------------------------------------------------
    # Get content
    # -----------------------------------------------------

    content = message.content


    if not content:

        raise RuntimeError(
            "Groq returned an empty response. "
            f"Model: {LLM_MODEL}. "
            f"Finish reason: "
            f"{response.choices[0].finish_reason}"
        )


    # =====================================================
    # Parse Structured JSON
    # =====================================================

    try:

        result = json.loads(content)

    except json.JSONDecodeError as e:

        raise RuntimeError(
            "Groq returned invalid structured JSON: "
            + str(e)
        )


    # =====================================================
    # Validate Required Fields
    # =====================================================

    required_fields = [

        "summary",
        "key_factors",
        "faculty_actions",
        "student_support",
        "what_to_monitor",
        "disclaimer"
    ]


    missing_fields = [

        field
        for field in required_fields
        if field not in result
    ]


    if missing_fields:

        raise RuntimeError(
            "Groq response is missing required fields: "
            + ", ".join(missing_fields)
        )


    # =====================================================
    # Return
    # =====================================================

    return result