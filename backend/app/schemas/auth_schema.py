from pydantic import BaseModel, EmailStr


class SignupRequest(BaseModel):

    name: str

    email: EmailStr


class LoginRequest(BaseModel):

    email: EmailStr


class AuthResponse(BaseModel):

    success: bool

    message: str

    user: dict