"""
Seed database with demo users for testing authentication
"""
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from auth import get_password_hash

# Create tables
models.Base.metadata.create_all(bind=engine)

def create_demo_users():
    """Create demo users with different roles"""
    db = SessionLocal()
    
    try:
        # Check if users already exist
        existing = db.query(models.User).filter(models.User.username == "admin").first()
        if existing:
            print("Demo users already exist!")
            return
        
        # Create admin user
        admin = models.User(
            username="admin",
            email="admin@example.com",
            full_name="Admin User",
            hashed_password=get_password_hash("admin123"),
            role=models.UserRole.ADMIN,
            is_active=True
        )
        db.add(admin)
        
        # Create author user
        author = models.User(
            username="author",
            email="author@example.com",
            full_name="Author User",
            hashed_password=get_password_hash("author123"),
            role=models.UserRole.AUTHOR,
            is_active=True
        )
        db.add(author)
        
        # Create viewer user
        viewer = models.User(
            username="viewer",
            email="viewer@example.com",
            full_name="Viewer User",
            hashed_password=get_password_hash("viewer123"),
            role=models.UserRole.VIEWER,
            is_active=True
        )
        db.add(viewer)
        
        db.commit()
        print("✅ Demo users created successfully!")
        print("\nDemo accounts:")
        print("1. Admin - username: admin, password: admin123")
        print("2. Author - username: author, password: author123")
        print("3. Viewer - username: viewer, password: viewer123")
        
    except Exception as e:
        print(f"❌ Error creating demo users: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_demo_users()
