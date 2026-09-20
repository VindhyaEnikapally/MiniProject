import pandas as pd

from app.core.config import UPLOAD_DIR


# ============================================================
# GET PREDICTION FILE
# ============================================================

def get_prediction_file(
    dataset_id: str
):

    file_path = (
        UPLOAD_DIR
        / f"dataset_{dataset_id}_predictions.csv"
    )

    if not file_path.exists():

        return None

    return file_path


# ============================================================
# LOAD PREDICTION DATASET
# ============================================================

def load_prediction_dataset(
    dataset_id: str
):

    file_path = get_prediction_file(
        dataset_id
    )

    if file_path is None:

        return None

    try:

        return pd.read_csv(
            file_path
        )

    except Exception:

        return None


# ============================================================
# SEARCH STUDENTS
# ============================================================

def search_students(
    dataset_id: str,
    search: str = "",
    limit: int = 20
):

    df = load_prediction_dataset(
        dataset_id
    )

    if df is None:
        return None

    result_df = df.copy()

    # --------------------------------------------------------
    # SEARCH BY STUDENT ID
    # --------------------------------------------------------

    if search:

        search_text = str(
            search
        ).strip().lower()

        if "student_id" in result_df.columns:

            result_df = result_df[
                result_df[
                    "student_id"
                ]
                .astype(str)
                .str.lower()
                .str.contains(
                    search_text,
                    na=False
                )
            ]

    # --------------------------------------------------------
    # LIMIT RESULTS
    # --------------------------------------------------------

    result_df = (
        result_df
        .head(limit)
    )

    students = []

    for index, row in (
        result_df.iterrows()
    ):

        student_id = row.get(
            "student_id",
            index
        )

        risk_probability = float(
            row[
                "risk_probability"
            ]
        )

        students.append({

            "student_id":
                str(
                    student_id
                ),

            "risk_probability":
                round(
                    risk_probability,
                    4
                ),

            "risk_percentage":
                round(
                    risk_probability * 100,
                    2
                ),

            "prediction":
                str(
                    row[
                        "prediction"
                    ]
                )

        })

    return students


# ============================================================
# GET INDIVIDUAL STUDENT
# ============================================================

def get_student(
    dataset_id: str,
    student_id: str
):

    df = load_prediction_dataset(
        dataset_id
    )

    if df is None:
        return None

    # --------------------------------------------------------
    # CHECK STUDENT ID COLUMN
    # --------------------------------------------------------

    if "student_id" not in df.columns:
        return None

    # --------------------------------------------------------
    # FIND STUDENT
    # --------------------------------------------------------

    matches = df[
        df["student_id"]
        .astype(str)
        == str(student_id)
    ]

    if matches.empty:

        return None

    row = matches.iloc[0]

    # --------------------------------------------------------
    # CONVERT ROW TO DICTIONARY
    # --------------------------------------------------------

    student_data = {}

    for column in df.columns:

        value = row[column]

        # Convert NumPy/Pandas values
        # into normal Python values.

        if pd.isna(value):

            student_data[
                column
            ] = None

        elif hasattr(
            value,
            "item"
        ):

            student_data[
                column
            ] = value.item()

        else:

            student_data[
                column
            ] = value

    return student_data