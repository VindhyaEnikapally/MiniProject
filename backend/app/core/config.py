from pathlib import Path
from dotenv import load_dotenv
import os


# --------------------------------------------------
# BASE DIRECTORIES
# --------------------------------------------------

APP_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = APP_DIR.parent
PROJECT_DIR = BACKEND_DIR.parent

ML_DIR = PROJECT_DIR / "ml"
UPLOAD_DIR = BACKEND_DIR / "uploads"


# --------------------------------------------------
# ENVIRONMENT VARIABLES
# --------------------------------------------------

ENV_FILE = BACKEND_DIR / ".env"

load_dotenv(ENV_FILE)


# --------------------------------------------------
# APPLICATION SETTINGS
# --------------------------------------------------

APP_NAME = "Student Success AI"
APP_VERSION = "1.0.0"

HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8000"))


# --------------------------------------------------
# DATABASE
# --------------------------------------------------

MONGODB_URL = os.getenv(
    "MONGODB_URL",
    ""
)

DATABASE_NAME = os.getenv(
    "DATABASE_NAME",
    "student_success_ai"
)


# --------------------------------------------------
# LLM
# --------------------------------------------------

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
LLM_MODEL = os.getenv(
    "LLM_MODEL",
    "openai/gpt-oss-20b"
)

# --------------------------------------------------
# ML MODEL FILES
# --------------------------------------------------

MODEL_PATH = ML_DIR / "student_risk_model.pkl"

THRESHOLD_PATH = ML_DIR / "student_risk_threshold.pkl"

FEATURE_CONFIG_PATH = ML_DIR / "student_feature_config.pkl"


# --------------------------------------------------
# UPLOAD DIRECTORY
# --------------------------------------------------

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True
)