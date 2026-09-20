from pymongo import MongoClient

from app.core.config import (
    MONGODB_URL,
    DATABASE_NAME
)


client = None
db = None


def connect_database():
    global client
    global db

    if not MONGODB_URL:
        print("MongoDB URL not configured. Running without database.")
        return

    try:
        client = MongoClient(
            MONGODB_URL,
            serverSelectionTimeoutMS=5000
        )

        # Verify connection
        client.admin.command("ping")

        db = client[DATABASE_NAME]

        print("MongoDB connected successfully.")

    except Exception as e:
        client = None
        db = None

        print(
            f"MongoDB connection failed: {e}"
        )


def close_database():
    global client

    if client:
        client.close()
        print("MongoDB connection closed.")


def get_database():
    return db