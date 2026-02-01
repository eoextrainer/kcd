"""
Authentication routes for user login and token management
"""
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.user_schema import UserLogin, TokenResponse, UserResponse
from app.services.user_service import UserService

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: UserLogin,
    db: Session = Depends(get_db)
) -> TokenResponse:
    """
    Login endpoint
    
    Returns access token and user info
    """
    user = UserService.authenticate_user(db, login_data.email, login_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is inactive",
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = UserService.create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    
    # Update last login
    user.last_login = user.created_at  # Will be updated to current time in models
    db.commit()
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            subscription_tier=user.subscription_tier,
        )
    )
