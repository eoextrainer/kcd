"""
Database seed script for KCD Platform
Creates test users with different roles and their workspaces
"""
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
from dotenv import load_dotenv

# Add backend to path
backend_path = Path(__file__).parent
sys.path.insert(0, str(backend_path))

# Load environment variables from repo root
ROOT_DIR = Path(__file__).resolve().parents[1]
load_dotenv(dotenv_path=ROOT_DIR / ".env", override=True)

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from sqlalchemy.exc import OperationalError
from passlib.context import CryptContext

# Import models
from app.models.user import Base, User, Workspace

# Database configuration - Use SQLite by default for local development
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./kcd.db")
if DATABASE_URL.startswith("sqlite:///./"):
    relative_path = DATABASE_URL.replace("sqlite:///./", "")
    DATABASE_URL = f"sqlite:///{(ROOT_DIR / relative_path).as_posix()}"

# Create engine with appropriate configuration
if "sqlite" in DATABASE_URL:
    connect_args = {"check_same_thread": False}
    if DATABASE_URL.endswith(":memory:"):
        engine = create_engine(
            DATABASE_URL,
            connect_args=connect_args,
            poolclass=StaticPool,
        )
    else:
        engine = create_engine(
            DATABASE_URL,
            connect_args=connect_args,
        )
else:
    # For PostgreSQL, try with default credentials first
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# Password hashing with argon2
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash a password using argon2"""
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
        "is_verified": True,
        "subscription_tier": "free",
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
}

def seed_database():
    """Seed the database with test users and workspaces"""
    print("Starting database seeding...")
    print(f"Database URL: {DATABASE_URL}")
    
    global engine
    
    try:
        # Create tables if they don't exist
        Base.metadata.create_all(bind=engine)
        print("✓ Database tables created/verified")
    except OperationalError as e:
        print(f"✗ Database connection error: {e}")
        print("  Falling back to SQLite...")
        # Fallback to SQLite
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
                existing_user.hashed_password = hash_password(user_data["password"])
                existing_user.full_name = user_data["full_name"]
                existing_user.role = user_data["role"]
                existing_user.is_active = user_data["is_active"]
                existing_user.is_verified = user_data["is_verified"]
                existing_user.subscription_tier = user_data.get("subscription_tier", "free")
                user = existing_user
                print(f"↻ Updated user: {email}")
                skipped_count += 1
            else:
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
            
            # Create or update workspace for user
            role = user_data["role"]
            workspace_template = WORKSPACE_TEMPLATES.get(
                role,
                WORKSPACE_TEMPLATES.get("free"),  # Default to free tier
            )

            workspace = db.query(Workspace).filter(Workspace.user_id == user.id).first()
            if workspace:
                workspace.user_email = email
                workspace.role = role
                workspace.workspace_name = workspace_template["name"]
                workspace.workspace_description = workspace_template["description"]
                workspace.widgets = workspace_template["widgets"]
                workspace.theme = workspace_template["theme"]
                print(f"↻ Updated workspace: {workspace_template['name']} ({workspace_template['theme']} theme)")
            else:
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
