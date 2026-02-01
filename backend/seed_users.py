"""
Database seed script for KCD Platform
Creates test users with different roles and their workspaces
"""
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent
sys.path.insert(0, str(backend_path))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from sqlalchemy.exc import OperationalError
from passlib.context import CryptContext

# Import models
from app.models.user import Base, User, Workspace

# Database configuration - Use SQLite by default for local development
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./kcd.db")

# Create engine with appropriate configuration
if "sqlite" in DATABASE_URL:
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
else:
    # For PostgreSQL, try with default credentials first
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)

# User data to seed
USERS_DATA = [
    {
        "email": "admin@kcd-agency.com",
        "password": "admin123",
        "full_name": "Admin User",
        "role": "admin",
        "is_active": True,
        "is_verified": True,
    },
    {
        "email": "community.admin@kcd-agency.com",
        "password": "comm_admin123",
        "full_name": "Community Admin",
        "role": "community_admin",
        "is_active": True,
        "is_verified": True,
    },
    {
        "email": "moderator@kcd-agency.com",
        "password": "mod123",
        "full_name": "Moderator User",
        "role": "moderator",
        "is_active": True,
        "is_verified": True,
    },
    {
        "email": "brand@kcd-agency.com",
        "password": "brand123",
        "full_name": "Brand Account",
        "role": "brand",
        "is_active": True,
        "is_verified": True,
    },
    {
        "email": "premium@kcd-agency.com",
        "password": "premium123",
        "full_name": "Premium User",
        "role": "user",
        "is_active": True,
        "is_verified": True,
        "subscription_tier": "premium",
    },
    {
        "email": "free@kcd-agency.com",
        "password": "free123",
        "full_name": "Free Tier User",
        "role": "user",
        "is_active": True,
        "is_verified": True,
        "subscription_tier": "free",
    },
    {
        "email": "guest@kcd-agency.com",
        "password": "guest123",
        "full_name": "Guest User",
        "role": "guest",
        "is_active": True,
        "is_verified": False,
    },
]

WORKSPACE_TEMPLATES = {
    "admin": {
        "name": "Admin Dashboard",
        "description": "System administration and control",
        "widgets": [
            "system_health",
            "user_analytics",
            "content_moderation",
            "platform_metrics",
            "security_alerts",
            "user_management",
            "system_settings",
        ],
        "theme": "dark",
    },
    "community_admin": {
        "name": "Community Management",
        "description": "Manage community members and content",
        "widgets": [
            "member_overview",
            "content_moderation",
            "community_stats",
            "engagement_metrics",
            "moderation_queue",
            "community_settings",
        ],
        "theme": "dark",
    },
    "moderator": {
        "name": "Moderation Center",
        "description": "Review and moderate community content",
        "widgets": [
            "moderation_queue",
            "flagged_content",
            "user_reports",
            "moderation_stats",
            "action_history",
        ],
        "theme": "dark",
    },
    "brand": {
        "name": "Brand Workspace",
        "description": "Manage brand identity and verification",
        "widgets": [
            "brand_profile",
            "verification_status",
            "brand_analytics",
            "content_showcase",
            "audience_insights",
            "brand_settings",
        ],
        "theme": "brand",
    },
    "premium": {
        "name": "Premium Creator Studio",
        "description": "Advanced tools for premium members",
        "widgets": [
            "content_creator",
            "analytics_dashboard",
            "audience_management",
            "monetization",
            "collaboration_tools",
            "premium_features",
            "schedule_post",
        ],
        "theme": "netflix",
    },
    "free": {
        "name": "My Workspace",
        "description": "Personal workspace for content and community",
        "widgets": [
            "home_feed",
            "my_content",
            "basic_analytics",
            "community_feed",
            "notifications",
        ],
        "theme": "netflix",
    },
    "guest": {
        "name": "Guest Access",
        "description": "Limited access to platform features",
        "widgets": [
            "home_feed",
            "community_feed",
        ],
        "theme": "netflix",
    },
}

def seed_database():
    """Seed the database with test users and workspaces"""
    print("Starting database seeding...")
    print(f"Database URL: {DATABASE_URL}")
    
    try:
        # Create tables if they don't exist
        Base.metadata.create_all(bind=engine)
        print("✓ Database tables created/verified")
    except OperationalError as e:
        print(f"✗ Database connection error: {e}")
        print("  Falling back to SQLite...")
        # Fallback to SQLite
        global engine
        DATABASE_URL_FALLBACK = "sqlite:///./kcd.db"
        engine = create_engine(
            DATABASE_URL_FALLBACK,
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        Base.metadata.create_all(bind=engine)
        print("✓ Database tables created in SQLite")
    
    # Create session
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    created_count = 0
    skipped_count = 0
    
    try:
        # Seed users
        print("\nSeeding users...")
        for user_data in USERS_DATA:
            email = user_data["email"]
            
            # Check if user already exists
            existing_user = db.query(User).filter(User.email == email).first()
            if existing_user:
                print(f"⊘ User already exists: {email}")
                skipped_count += 1
                continue
            
            # Create user
            user = User(
                email=email,
                hashed_password=hash_password(user_data["password"]),
                full_name=user_data["full_name"],
                role=user_data["role"],
                is_active=user_data["is_active"],
                is_verified=user_data["is_verified"],
                subscription_tier=user_data.get("subscription_tier", "free"),
            )
            
            db.add(user)
            db.flush()  # Get the user ID
            
            # Create workspace for user
            role = user_data["role"]
            workspace_template = WORKSPACE_TEMPLATES.get(
                role,
                WORKSPACE_TEMPLATES.get("free"),  # Default to free tier
            )
            
            workspace = Workspace(
                user_id=user.id,
                user_email=email,
                role=role,
                workspace_name=workspace_template["name"],
                workspace_description=workspace_template["description"],
                widgets=workspace_template["widgets"],
                theme=workspace_template["theme"],
            )
            
            db.add(workspace)
            
            print(f"✓ Created user: {email} ({user.role})")
            print(f"  └─ Workspace: {workspace_template['name']} ({workspace_template['theme']} theme)")
            
            created_count += 1
        
        # Commit all changes
        db.commit()
        
        print("\n" + "="*70)
        print("SEED SUMMARY")
        print("="*70)
        print(f"✓ Users created: {created_count}")
        print(f"⊘ Users skipped (already exist): {skipped_count}")
        print(f"✓ Workspaces created: {created_count}")
        
        print("\n" + "="*70)
        print("TEST CREDENTIALS")
        print("="*70)
        for user_data in USERS_DATA:
            print(f"Email: {user_data['email']:<35} Password: {user_data['password']}")
        
        print("\n" + "="*70)
        print("✓ Database seeding completed successfully!")
        print("="*70)
        
    except Exception as e:
        db.rollback()
        print(f"\n✗ Error during seeding: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
