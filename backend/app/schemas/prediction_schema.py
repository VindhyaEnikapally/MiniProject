from pydantic import BaseModel, Field


class SHAPFactor(BaseModel):

    factor: str

    shap_contribution: float


class InterventionResponse(BaseModel):

    priority: str

    factor: str

    shap_contribution: float

    current_value: object

    recommended_action: str


class PredictionResponse(BaseModel):

    risk_probability: float

    risk_percentage: float

    threshold: float

    prediction: str

    shap_explanation: dict

    interventions: list[InterventionResponse]