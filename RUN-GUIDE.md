# AUIS Lost & Found - Run Guide

Both the frontend and backend have been fully verified. The backend passes `manage.py check` with 0 issues, and the frontend builds perfectly with zero errors.

Here is exactly how to run the application for development or testing:

## 1. Run the Backend (Django)

Open a new terminal and run these commands:

```bash
cd backend
# Make sure your virtual environment is active if you use one
C:\Python311\python.exe manage.py runserver
```

*The backend will start at **http://127.0.0.1:8000***

## 2. Run the Frontend (React / Vite)

Open a **second, separate terminal** and run:

```bash
cd frontend
npm run dev
```

*The frontend will start at **http://localhost:5173** (or 5174 if port is busy).*

---

## 🔑 Accessing the System

### Standard Users
1. Go to your frontend URL (e.g., `http://localhost:5173`)
2. Click **Sign In** and use an `@auis.edu.krd` Google account (or any Google account if you are in Dev Mode).

### Admin Dashboard Access
There are two Admin interfaces you can use:

**A. Core Django Admin Dashboard** (Direct Backend Access)
1. Stop the backend server temporarily (`Ctrl + C`)
2. Run `C:\Python311\python.exe manage.py createsuperuser` and follow the prompts.
3. Start the backend server again (`runserver`).
4. Go to **http://127.0.0.1:8000/admin/** and log in with the credentials you just created.

**B. Custom UI Admin Dashboard** (Frontend)
1. First, log into the frontend app via Google at least once so your `UserProfile` is created.
2. Go to the 
**Django Admin** (method A above) and click on **User Profiles**.
3. Find your user and check the **Is admin** box, then Save.
4. Refresh your frontend app — you will now see an **Admin** button in the top navigation bar.

---

## ✅ Code Health

- **Backend:** Checked using `manage.py check` — **0 issues found**.
- **Frontend:** Checked using `npm run build` — **Built successfully in 17 seconds with 0 errors**.
- **CORS:** Configured to allow custom headers (`X-User-Email`) and standard Vite ports (`5173`, `5174`).
