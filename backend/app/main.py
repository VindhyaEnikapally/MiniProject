from contextlib import asynccontextmanager
from app.routes.what_if_routes import router as what_if_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.ai_routes import router as ai_router

from app.core.config import (
    APP_NAME,
    APP_VERSION
)

from app.core.database import (
    connect_database,
    close_database
)

from app.routes.student_routes import (
    router as student_router
)

from app.routes.prediction_routes import (
    router as prediction_router
)

from app.routes.analytics_routes import (
    router as analytics_router
)


# ============================================================
# APPLICATION LIFESPAN
# ============================================================

@asynccontextmanager
async def lifespan(
    app: FastAPI
):

    print("----------------------------------------")

    print(
        f"Starting {APP_NAME}"
    )

    print(
        f"Version: {APP_VERSION}"
    )

    print("----------------------------------------")

    connect_database()

    yield

    close_database()

    print("----------------------------------------")

    print(
        "Application stopped"
    )

    print("----------------------------------------")


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(

    title=APP_NAME,

    description=(
        "AI-powered teacher decision-support "
        "platform for early student risk detection "
        "and personalized academic intervention."
    ),

    version=APP_VERSION,

    lifespan=lifespan

)


# ============================================================
# CORS
# ============================================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=[

        "http://localhost:5173",

        "http://127.0.0.1:5173"

    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]

)


# ============================================================
# ROUTERS
# ============================================================

app.include_router(
    student_router
)

app.include_router(
    prediction_router
)

app.include_router(
    analytics_router
)

app.include_router(what_if_router)


app.include_router(ai_router)
# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {

        "application":
            APP_NAME,

        "version":
            APP_VERSION,

        "status":
            "active",

        "message":
            "Student Success AI backend is running"

    }


# ============================================================
# HEALTH
# ============================================================

@app.get("/health")
def health_check():

    return {

        "status":
            "healthy"

    }