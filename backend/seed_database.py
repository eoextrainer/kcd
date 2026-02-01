#!/usr/bin/env python
"""
Database seeding script for KCD Platform

This script creates test users and their workspaces in the database.
Run with: python seed_database.py
"""

import sys
import os
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy.orm import Session
from app.db.database import engine, SessionLocal, init_db
from app.models.user import Base, User, Workspace
from app.services.user_service import UserService

# Test users configuration
TEST_USERS = [
    {
        "email": "admin@kcd-agency.com",
        "password": "admin123",
        "full_name": "Admin User",
        "role": "admin",
        "subscription_tier": "brand",
    },
    {
        "email": "community.admin@kcd-agency.com",
        "password": "comm_admin123",
        "full_name": "Community Admin",
        "role": "community_admin",
        "subscription_tier": "premium",
    },
    {
        "email": "moderator@kcd-agency.com",
        "password": "mod123",
        "full_name": "Content Moderator",
        "role": "moderator",
        "subscription_tier": "premium",
    },
    {
        "email": "brand@kcd-agency.com",
        "password": "brand123",
        "full_name": "Brand Account",
        "role": "brand",
        "subscription_tier": "brand",
    },
    {
        "email": "premium@kcd-agency.com",
        "password": "premium123",
        "full_name": "Premium Creator",
        "role": "user",
        "subscription_tier": "premium",
    },
    {
        "email": "free@kcd-agency.com",
        "password": "free123",
        "full_name": "Free Tier User",
        "role": "user",
        "subscription_tier": "free",
    },
    {
        "email": "guest@kcd-agency.com",
        "password": "guest123",
        "full_name": "Guest User",
        "role": "guest",
        "subscription_tier": "free",
    },
]

# Workspace templates by role
WORKSPACE_TEMPLATES = {
    "admin": {
        "workspace_name": "Admin Dashboard",
        "workspace_description": "System administration and monitoring",
        "theme": "dark",
        "widgets": [
            "system_health",
            "user_analytics",
            "content_moderation_queue",
            "security_alerts",
            "recent_reports",
            "db_status",
        ]
    },
    "community_admin": {
        "workspace_name": "Community Management",
        "workspace_description": "Manage community and moderate content",
        "theme": "dark",
        "widgets": [
            "user_management",
            "moderation_queue",
            "community_stats",
            "reports",
            "banned_users",
            "community_feedback",
        ]
    },
    "moderator": {
        "workspace_name": "Moderation Center",
        "workspace_description": "Review and moderate content",
        "theme": "dark",
        "widgets": [
            "pending_reviews",
            "reported_content",
            "user_warnings",
            "content_analytics",
            "moderation_stats",
        ]
    },
    "brand": {
        "workspace_name": "Brand Portal",
        "workspace_description": "Brand verification and management",
        "theme": "brand",
        "widgets": [
            "brand_verification",
            "brand_analytics",
            "content_tools",
            "revenue_tracking",
            "brand_settings",
        ]
    },
    "user": {
        "workspace_name": "Creator Studio",
        "workspace_description": "Create and manage your content",
        "theme": "netflix",
        "widgets": [
            "content_feed",
            "analytics",
            "my_content",
            "messages",
            "notifications",
        ]
    },
    "guest": {
        "workspace_name": "Explore",
        "workspace_description": "Discover content",
        "theme": "netflix",
        "widgets": [
            "discover_feed",
            "trending",
            "recommendations",
        ]
    }
}

def clear_existing_data(db: Session):
    """Clear existing users and workspaces"""
    print("Clearing existing data...")
    try:
        db.query(Workspace).delete()
        db.query(User).delete()
        db.commit()
        print("✓ Existing data cleared")
    except Exception as e:
        print(f"⚠ Error clearing data: {e}")
        db.rollback()

def create_seed_users(db: Session):
    """Create seed users and their workspaces"""
    print("\n" + "="*60)
    print("SEEDING DATABASE WITH TEST USERS")
    print("="*60 + "\n")
    
    # Initialize database tables
    print("Creating database tables...")
    init_db()
    print("✓ Database tables created\n")
    
    # Clear existing data
    clear_existing_data(db)
    
    # Create test users
    created_users = []
    print("Creating test users...\n")
    
    for user_data in TEST_USERS:
        try:
            # Check if user already exists
            existing_user = UserService.get_user_by_email(db, user_data["email"])
            if existing_user:
                print(f"⚠ User {user_data['email']} already exists, skipping")
                continue
            
            # Hash password and create user
            hashed_password = UserService.hash_password(user_data["password"])
            
            user = User(
                email=user_data["email"],
                hashed_password=hashed_password,
                full_name=user_data["full_name"],
                role=user_data["role"],
                subscription_tier=user_data["subscription_tier"],
                is_active=True,
                is_verified=(user_data["role"] == "admin"),  # Admin verified by default
            )
            
            db.add(user)
            db.flush()  # Flush to get the ID
            
            # Get workspace template
            role_key = user_data["role"]
            if role_key == "user" and user_data["subscription_tier"] == "premium":
                workspace_config = WORKSPACE_TEMPLATES["user"].copy()
            elif role_key not in WORKSPACE_TEMPLATES:
                workspace_config = WORKSPACE_TEMPLATES["user"].copy()
            else:
                workspace_config = WORKSPACE_TEMPLATES[role_key].copy()
            
            # Create workspace for user
            workspace = Workspace(
                user_id=user.id,
                user_email=user.email,
                role=user_data["role"],
                **workspace_config
            )
            
            db.add(workspace)
            db.commit()
            
            created_users.append(user)
            print(f"✓ Created user: {user_data['email']}")
            print(f"  - Role: {user_data['role']}")
            print(f"  - Tier: {user_data['subscription_tier']}")
            print(f"  - Workspace: {workspace_config['workspace_name']}")
            print(f"  - Theme: {workspace_config['theme']}\n")
            
        except Exception as e:
            print(f"✗ Error creating user {user_data['email']}: {e}\n")
            db.rollback()
    
    return created_users

def display_test_credentials():
    """Display test user credentials"""
    print("\n" + "="*60)
    print("TEST USER CREDENTIALS")
    print("="*60 + "\n")
    
    for user_data in TEST_USERS:
        print(f"Email:    {user_data['email']}")
        print(f"Password: {user_data['password']}")
        print(f"Role:     {user_data['role']}")
        print(f"Tier:     {user_data['subscription_tier']}")
        print()

def main():
    """Main seeding function"""
    try:
        db = SessionLocal()
        
        # Create users
        users = create_seed_users(db)
        
        # Display summary
        print("\n" + "="*60)
        print("SEEDING COMPLETE")
        print("="*60)
        print(f"\nTotal users created: {len(users)}")
        
        # Display credentials
        display_test_credentials()
        
        print("\n" + "="*60)
        print("NEXT STEPS:")
        print("="*60)
        print("\n1. Start the backend server:")
        print("   cd backend && python -m uvicorn app.main:app --reload\n")
        print("2. Test the login endpoint:")
        print("   POST http://localhost:8000/api/v1/auth/login")
        print("   Body: {\"email\": \"admin@kcd-agency.com\", \"password\": \"admin123\"}\n")
        print("3. Use the returned token in Authorization header:")
        print("   Authorization: Bearer <token>\n")
        
        db.close()
        
    except Exception as e:
        print(f"\n✗ Fatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
