# AUIS Lost & Found - Documentation

## Overview
The **AUIS Lost & Found** system is a centralized web application designed specifically for the American University of Iraq, Sulaimani (AUIS). It digitizes the campus lost and found process, allowing students to securely log in, report lost or found items, use AI to match lost items with found inventory, and schedule in-person pickups at the campus office.

---

## 🌟 Core Features

### 1. Secure Authentication
- **Google OAuth Integration:** Users log in using their Google accounts.
- **Domain Restriction:** The system restricts access strictly to users with `@auis.edu.krd` email addresses, ensuring only AUIS students, faculty, and staff can access the platform.

### 2. AI-Powered Item Matching
- **Smart Suggestions:** When a user reports a lost item, the backend AI algorithm compares the description, category, and name against all currently reported "found" items.
- **Live Preview:** The frontend displays top AI matches live during the reporting process, giving the user an immediate chance to identify their property.

### 3. Community Reporting Workflows
- **Report Lost:** A guided, 3-step wizard allowing users to provide their contact info, item details, location, and instantly check AI matches.
- **Report Found:** A community submission form where anyone can report an item they found on campus. To prevent spam, these submissions go into a "Pending" queue requiring Admin approval before becoming public.

### 4. Interactive Dashboard
- **Real-Time Stats:** Displays the total number of items logged, available to claim, and successfully claimed.
- **Search & Filter:** Users can search the public board of found items by keyword or filter by category (e.g., Electronics, Keys, IDs).

### 5. Office Pickup Scheduling
- **Automated Calendly-style booking:** Once a user identifies their item, they can schedule a pickup.
- **Business Logic:** The system automatically offers a 14-day rolling window of business days (Monday-Friday) with specific 1-hour time slots (9:00 AM - 5:00 PM).

### 6. Comprehensive Admin Backend
- **Dual Dashboards:** Includes both the deep-access Django Admin panel and a custom, user-friendly React Admin Dashboard.
- **Moderation:** Admins can review pending community found reports, approve them, or reject them.
- **Status Management:** Admins can update the lifecycle status of an item (`Found` → `Claimed` → `Expired`).
- **Schedules:** Comprehensive view of all upcoming appointments for item retrieval.

---

## 🏗️ Technical Architecture & Stack

The application uses a modern decoupled architecture, communicating entirely via REST APIs.

### Frontend (React + Vite)
- **Framework:** React 18 powered by Vite for lightning-fast HMR and building.
- **Routing:** `react-router-dom` for client-side navigation.
- **State/Auth:** React Context API for managing the user session. `@react-oauth/google` for handling the OAuth flow.
- **Styling:** Custom CSS implementing a premium glassmorphism design system, AUIS brand colors (Blue and Gold), and `lucide-react` for scalable iconography.
- **HTTP Client:** `axios` configured with an interceptor to attach user identity (`X-User-Email`) to every request.

### Backend (Django + Django REST Framework)
- **Framework:** Django 5 with Python 3.11.
- **API Engine:** Django REST Framework (DRF) serving JSON.
- **Database:** SQLite (scalable to PostgreSQL).
- **Security:** `django-cors-headers` to manage cross-origin access between the Vite dev server and the Django API. Pillow for image handling.

---

## 📂 Project Structure

```text
auis_new_project/
├── backend/                  # Django Python Backend
│   ├── auis_backend/         # Core Django settings (settings.py, urls.py)
│   ├── lost_and_found/       # Main Django app
│   │   ├── models.py         # Database schemas (FoundItem, LostReport, etc.)
│   │   ├── views.py          # API logic, AI Match engine, OAuth verification
│   │   ├── serializers.py    # JSON translation layer
│   │   └── urls.py           # API Route definitions
│   └── manage.py             # Django execution script
│
├── frontend/                 # React JavaScript Frontend
│   ├── src/
│   │   ├── api.js            # Axios configuration & API call definitions
│   │   ├── App.jsx           # Master route controller
│   │   ├── index.css         # Global UI design system
│   │   ├── components/       # Reusable UI (Navbar, ProtectedRoutes)
│   │   ├── context/          # AuthContext (Google Session state)
│   │   └── pages/            # Main Views
│   │       ├── AdminDashboard.jsx  # Admin moderation hub
│   │       ├── Dashboard.jsx       # Public items board
│   │       ├── Login.jsx           # Google OAuth landing page
│   │       ├── ReportFound.jsx     # Community submission
│   │       ├── ReportLost.jsx      # 3-Step wizard
│   │       └── SchedulePickup.jsx  # Calendar & time slot booking
│   ├── package.json          # Node dependencies
│   ├── vite.config.js        # Bundler settings
│   └── .env                  # Environment Variables (Google Client ID)
│
└── RUN-GUIDE.md              # Quick-start execution commands
```
