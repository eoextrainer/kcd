"""
Database seed script for KCD Platform
Creates test users with different roles and their workspaces
"""
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./kcd.db")

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
    
    # For now, this is a template. The actual implementation depends on
    # your database models. Here's what the script would do:
    
    created_users = []
    
    for user_data in USERS_DATA:
        user_info = {
            **user_data,
            "hashed_password": hash_password(user_data.pop("password")),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        created_users.append(user_info)
        print(f"✓ Prepared user: {user_data['email']} ({user_data['role']})")
    
    # Create workspaces for each user
    workspaces = []
    for user_data in USERS_DATA:
        role = user_data["role"]
        workspace_template = WORKSPACE_TEMPLATES.get(
            role,
            WORKSPACE_TEMPLATES.get("free"),  # Default to free tier
        )
        
        workspace = {
            "user_email": user_data["email"],
            "role": role,
            "workspace_name": workspace_template["name"],
            "workspace_description": workspace_template["description"],
            "widgets": workspace_template["widgets"],
            "theme": workspace_template["theme"],
            "created_at": datetime.utcnow(),
        }
        workspaces.append(workspace)
        print(
            f"✓ Prepared workspace: {workspace_template['name']} "
            f"(Theme: {workspace_template['theme']})"
        )
    
    print("\n" + "="*60)
    print("SEED DATA SUMMARY")
    print("="*60)
    print(f"Total users to create: {len(created_users)}")
    print(f"Total workspaces to create: {len(workspaces)}")
    
    print("\nUSERS:")
    for user in created_users:
        print(f"  • {user['email']} ({user['role']})")
    
    print("\nWORKSPACES:")
    for ws in workspaces:
        print(f"  • {ws['workspace_name']} ({ws['theme']} theme)")
    
    print("\n" + "="*60)
    print("INSTRUCTIONS:")
    print("="*60)
    print("""
To actually seed the database, you need to:

1. Create SQLAlchemy models for User and Workspace in:
   backend/app/models/user.py
   backend/app/models/workspace.py

2. Create database session and add users:
   from backend.app.db.database import SessionLocal
   from backend.app.models.user import User
   from backend.app.models.workspace import Workspace
   
   db = SessionLocal()
   
   # Add users to database
   for user_data in created_users:
       db_user = User(**user_data)
       db.add(db_user)
   
   db.commit()
   
   # Add workspaces
   for ws_data in workspaces:
       db_workspace = Workspace(**ws_data)
       db.add(db_workspace)
   
   db.commit()

3. Or use the FastAPI endpoint to create users via API

Test credentials:
""")
    
    for user_data in USERS_DATA:
        print(f"  • Email: {user_data['email']:<35} Password: {user_data['password']}")

if __name__ == "__main__":
    seed_database()
