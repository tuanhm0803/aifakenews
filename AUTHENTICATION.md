# Authentication & Authorization Setup

## Overview

This application now implements role-based access control (RBAC) with three user roles:

- **Admin**: Full access, can generate news and manage users
- **Author**: Can generate news articles
- **Viewer**: Can only view news (read-only)

## User Roles & Permissions

| Role   | View News | Generate News | Manage Users |
|--------|-----------|---------------|--------------|
| Admin  | ✅        | ✅            | ✅           |
| Author | ✅        | ✅            | ❌           |
| Viewer | ✅        | ❌            | ❌           |
| Guest  | ✅        | ❌            | ❌           |

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

The new dependencies include:
- `python-jose[cryptography]` - JWT token handling
- `passlib[bcrypt]` - Password hashing
- `pydantic[email]` - Email validation

### 2. Create Demo Users

Run the seed script to create demo users:

```bash
cd backend
python seed_users.py
```

This creates three demo accounts:
- **Admin**: username: `admin`, password: `admin123`
- **Author**: username: `author`, password: `author123`
- **Viewer**: username: `viewer`, password: `viewer123`

### 3. Start the Application

```bash
# Backend
cd backend
uvicorn main:app --reload

# Frontend
cd frontend
npm run dev
```

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with username/password (form data)
- `POST /api/auth/login/json` - Login with JSON body
- `GET /api/auth/me` - Get current user info
- `GET /api/users` - List all users (Admin only)

### Protected Endpoints

- `POST /api/news/generate` - Generate news (Admin/Author only)

## Frontend Features

### Authentication UI

1. **Login Page** (`/login`)
   - Username/password login
   - Error handling
   - Redirects to home after successful login

2. **Register Page** (`/register`)
   - New user registration
   - Email validation
   - Password confirmation
   - Auto-login after registration

3. **Header Component**
   - Shows login/register buttons for guests
   - Shows user info and logout for authenticated users
   - Displays user role badge (Admin/Author)

4. **HomePage**
   - Conditional news generation buttons
   - Shows "Login to generate" for guests
   - Shows "Viewer role" message for viewers
   - Full access for Admin/Author

## Security Features

- **JWT Tokens**: Secure token-based authentication (7-day expiry)
- **Password Hashing**: bcrypt for secure password storage
- **Role-based Access Control**: Endpoint protection based on user roles
- **Token Storage**: localStorage with automatic header injection
- **Auto-logout**: Invalid tokens cleared automatically

## Configuration

### Backend Security

Edit `backend/auth.py` to customize:

```python
SECRET_KEY = "your-secret-key-change-this-in-production"  # Change in production!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days
```

⚠️ **Important**: Change the `SECRET_KEY` in production to a secure random string!

### Frontend API Configuration

The frontend automatically includes JWT tokens in requests via axios interceptors (see `AuthContext.jsx`).

## Testing

### Test User Roles

1. **Login as Viewer**
   - Navigate to homepage
   - See news but no "Generate" buttons
   - Only "Login to generate" prompt shown

2. **Login as Author**
   - Can see and click "Generate" buttons
   - Can create news articles

3. **Login as Admin**
   - Full access to all features
   - Can manage users (via API)

### API Testing

Use the interactive docs at `http://localhost:8000/docs`:

1. Click "Authorize" button
2. Login with demo credentials
3. Test protected endpoints

## Production Considerations

1. **Environment Variables**: Move sensitive config to `.env`
2. **HTTPS**: Always use HTTPS in production
3. **Secret Key**: Generate a strong random secret key
4. **Token Expiry**: Adjust based on security requirements
5. **CORS**: Restrict allowed origins
6. **Rate Limiting**: Add rate limiting for auth endpoints
7. **Email Verification**: Consider adding email verification
8. **Password Reset**: Implement password reset flow

## Troubleshooting

### "Could not validate credentials" Error
- Token may be expired
- Clear localStorage and login again
- Check if backend is running

### "Access denied" Error
- User doesn't have required role
- Login with Admin or Author account

### Users Not Created
- Run `seed_users.py` script
- Check database connection
- Check for errors in console

## Database Schema

### User Table

```python
class User(Base):
    id: int
    username: str (unique)
    email: str (unique)
    hashed_password: str
    full_name: str (optional)
    role: UserRole (admin/author/viewer)
    is_active: bool
    created_at: datetime
```

## Future Enhancements

- [ ] Password reset via email
- [ ] Email verification
- [ ] User profile editing
- [ ] Admin dashboard for user management
- [ ] OAuth integration (Google, Facebook)
- [ ] Two-factor authentication (2FA)
- [ ] Activity logging and audit trail
