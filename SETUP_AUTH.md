# Quick Setup Guide for Authentication

## 🚀 Quick Start

### Step 1: Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

New packages installed:
- `python-jose[cryptography]` - JWT tokens
- `passlib[bcrypt]` - Password hashing
- `pydantic[email]` - Email validation

### Step 2: Install Frontend Dependencies

```bash
cd frontend
npm install
```

New package: `prop-types` for React component validation

### Step 3: Create Demo Users

```bash
cd backend
python seed_users.py
```

This creates 3 test accounts:

| Username | Password   | Role   | Can Generate News? |
|----------|------------|--------|-------------------|
| admin    | admin123   | Admin  | ✅ Yes            |
| author   | author123  | Author | ✅ Yes            |
| viewer   | viewer123  | Viewer | ❌ No             |

### Step 4: Start Application

Terminal 1 - Backend:
```bash
cd backend
uvicorn main:app --reload
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Step 5: Test Authentication

1. **Visit** `http://localhost:5173`
2. **Try to generate news** - You'll see "Login to generate" message
3. **Click "Đăng nhập"** (Login)
4. **Login as viewer** (viewer/viewer123)
   - Result: Can view news but cannot generate
5. **Logout and login as author** (author/author123)
   - Result: Can generate news! ✨
6. **Logout and login as admin** (admin/admin123)
   - Result: Full access to everything

## 📋 What Changed?

### Backend Changes
- ✅ Added `User` model with roles (admin/author/viewer)
- ✅ Added `auth.py` with JWT authentication
- ✅ Protected `/api/news/generate` endpoint
- ✅ Added login/register/user endpoints
- ✅ Created `seed_users.py` for demo data

### Frontend Changes
- ✅ Added `AuthContext` for global auth state
- ✅ Created `LoginPage` and `RegisterPage`
- ✅ Updated `Header` with login/logout UI
- ✅ Protected news generation buttons on `HomePage`
- ✅ Added role-based UI rendering

## 🔐 Security Features

- **JWT Tokens**: 7-day validity
- **Password Hashing**: bcrypt algorithm
- **Role-Based Access**: Admin > Author > Viewer
- **Token Auto-Injection**: axios interceptors
- **Secure Storage**: localStorage with validation

## 🧪 Testing Scenarios

### Scenario 1: Anonymous User
- ✅ Can view all news
- ❌ Cannot generate news
- See "Login to generate" button

### Scenario 2: Viewer User
- ✅ Can view all news
- ❌ Cannot generate news
- See "You can only view news (Role: viewer)"

### Scenario 3: Author User
- ✅ Can view all news
- ✅ Can generate news
- See both generate buttons

### Scenario 4: Admin User
- ✅ Can view all news
- ✅ Can generate news
- ✅ Can access admin endpoints
- See "Admin" badge in header

## 🐛 Troubleshooting

### "Module not found: jose"
```bash
pip install python-jose[cryptography]
```

### "Module not found: passlib"
```bash
pip install passlib[bcrypt]
```

### "prop-types is not defined"
```bash
cd frontend
npm install
```

### Cannot login
1. Check backend is running on port 8000
2. Run `seed_users.py` to create demo users
3. Check console for errors

### Token invalid
1. Clear localStorage in browser devtools
2. Logout and login again

## 📝 Next Steps

1. **Change Secret Key**: Edit `backend/auth.py` SECRET_KEY
2. **Configure CORS**: Update allowed origins in `main.py`
3. **Add Email Verification**: Implement email verification flow
4. **Add Password Reset**: Implement forgot password feature

## 📚 Documentation

Full documentation: [AUTHENTICATION.md](./AUTHENTICATION.md)

API docs: http://localhost:8000/docs
