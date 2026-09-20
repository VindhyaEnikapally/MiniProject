from typing import Any

from pydantic import BaseModel


class AIExplanationRequest(BaseModel):

    student: dict[str, Any]

    prediction: dict[str, Any]

    shap_explanation: dict[str, Any]

    interventions: list[dict[str, Any]] = []


class AIStudyPlanRequest(BaseModel):

    student: dict[str, Any]

    prediction: dict[str, Any]

    interventions: list[dict[str, Any]] = []

    duration_days: int = 7


class AIInterventionPlanRequest(BaseModel):

    student: dict[str, Any]

    prediction: dict[str, Any]

    interventions: list[dict[str, Any]]


class AIFacultySummaryRequest(BaseModel):

    students: list[dict[str, Any]]