from typing import Any

from pydantic import BaseModel


class WhatIfRequest(BaseModel):

    student: dict[str, Any]

    changes: dict[str, Any]


class WhatIfResponse(BaseModel):

    current_risk_probability: float

    current_risk_percentage: float

    current_prediction: str

    what_if_risk_probability: float

    what_if_risk_percentage: float

    what_if_prediction: str

    risk_change_probability: float

    risk_change_percentage: float

    changed_factors: dict