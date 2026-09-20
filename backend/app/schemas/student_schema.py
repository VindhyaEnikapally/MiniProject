from pydantic import BaseModel, ConfigDict


class StudentData(BaseModel):

    model_config = ConfigDict(
        extra="forbid"
    )

    age: int
    gender: str
    education_level: str
    school_type: str
    family_income: str
    parent_education: str
    urban_rural: str

    previous_exam_score: float
    previous_gpa: float
    attendance_percentage: float
    assignment_completion_rate: float

    class_participation: str

    study_hours_per_day: float
    self_study_hours: float
    private_tuition: int
    online_learning_hours: float

    study_consistency: str
    study_environment: str
    study_method: str
    revision_frequency: str

    practice_tests_completed: int

    notes_quality: str

    sleep_hours: float
    sleep_quality: str
    daily_screen_time: float
    physical_activity_hours: float
    break_frequency: str

    stress_level: float
    motivation_level: str

    internet_access: int
    device_availability: str
    educational_app_usage: str
    online_course_hours: float

    exam_preparation_days: int
    time_management_score: float
    exam_anxiety_level: float