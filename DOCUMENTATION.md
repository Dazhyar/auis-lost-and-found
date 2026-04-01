# AUIS Lost & Found System - Comprehensive Documentation (A to Z)

## 1. Project Overview & Objectives
The **AUIS Lost & Found** system is a centralized web application built for the American University of Iraq, Sulaimani. It digitizes the process of recovering lost items on campus. 
The system features a public dashboard for browsing found items, a submission portal for both lost and found items, and an admin dashboard for moderation and inventory management.

---

## 2. Current Features & Requirements

### User Features (Students/Staff)
1. **Google OAuth Login**: Users authenticate securely using their Google accounts. (Designed to be restricted to `@auis.edu.krd` domains in production).
2. **Public Dashboard ("Browse")**: 
   - View all items currently logged as "Found" and available for claim.
   - View all active "Lost & Looking" reports submitted by students.
   - Search by item name, description, category, or location.
3. **Report a Found Item**: 
   - Users can report an item they found on campus.
   - Requires providing item details, category, location found, and an optional image.
   - Goes into a "Pending Moderation" queue for admins to review.
4. **Report a Lost Item**: 
   - A 3-step wizard to log a missing item.
   - The system automatically runs an AI-based text matching algorithm to suggest currently "Found" items that match their description.
5. **Schedule a Pickup**: 
   - If a user spots their item, they can book a 15-minute time slot (Monday-Friday, 9 AM - 5 PM) to pick it up from the AUIS Registration/Security desk.

### Admin Features (Moderators)
1. **Admin Control Center**: A dedicated dashboard only accessible to users with `is_admin=True`.
2. **Moderation Queue**: Approve or Reject community-submitted "Found Item" reports. Approving automatically publishes the item to the public dashboard.
3. **Inventory Management**: Full CRUD (Create, Read, Update, Delete) access to all Found Items. Admins can manually add items dropped off at the desk.
4. **Analytics**: Real-time charts showing recovery rates, most common lost categories, and total inventory statistics.

---

## 3. Technology Stack & Requirements

### Frontend Requirements
- **Framework**: React 18 + Vite
- **Routing**: `react-router-dom` v6
- **Styling**: Tailwind CSS (with custom Glassmorphism utility classes in `index.css`)
- **State Management**: React Context API (`AuthContext`, `ItemContext`)
- **HTTP Client**: Axios (with custom interceptors for auth headers)
- **Icons & Animations**: `lucide-react`, `framer-motion`, `recharts` for admin charts.

### Backend Requirements
- **Framework**: Django 5.x + Django REST Framework (DRF)
- **Database**: SQLite (built-in, can be migrated to PostgreSQL)
- **Authentication**: Custom Header-based authentication (`X-User-Email`) parsing Google OAuth data.
- **Environment**: Python 3.11+
- **Security**: `django-cors-headers`

---

## 4. Database Models (The Data Layer)
All models are defined in `backend/lost_and_found/models.py`.

1. **`UserProfile`**
   - Tracks users logging in via Google.
   - Fields: `google_id`, `email`, `full_name`, `photo_url`, `is_admin`, `created_at`.
   - Notes: `is_admin` strictly controls access to the Admin Dashboard and moderation APIs.

2. **`FoundItem`**
   - Represents physical items held by the AUIS Lost & Found office.
   - Fields: `name`, `category`, `description`, `location_found`, `date_found`, `photo_url`, `reported_by_email`, `status` (found, claimed, expired).

3. **`LostReport`**
   - Represents an active search by a student who lost something.
   - Fields: `student_name`, `student_email`, `item_name`, `category`, `description`, `location_lost`, `date_lost`, `is_resolved`.

4. **`ItemReport` (Community Submissions)**
   - A staging area for items found by regular students that need admin approval.
   - Fields: `reporter_name`, `reporter_email`, `item_name`, `category`, `description`, `location_found`, `photo_url`, `status` (pending, approved, rejected).

5. **`PickupSchedule`**
   - Appointments made by students to claim items.
   - Fields: `student_name`, `student_email`, `student_id`, `item`, `pickup_time`, `status`.

---

## 5. Backend API Routes (views.py & urls.py)

### Authentication
- `POST /api/auth/google/`: Receives the Google token from React, verifies it with Google servers, creates/updates the `UserProfile`, and returns user data + admin status.

### Public Endpoints (Read-Only for Users)
- `GET /api/found-items/`: Lists all found items.
- `GET /api/lost-reports/`: Lists all unresolved lost reports.
- `POST /api/item-reports/`: Endpoint for users to submit a found item (creates a Pending report).
- `POST /api/lost-reports/`: Endpoint for users to submit a lost item.
- `POST /api/schedules/`: Endpoint to book a pickup slot.

### Admin-Only Endpoints
Protected by the `IsAdminProfile` DRF permission class. Requires `X-User-Email` header of an admin user.
- `GET /api/admin/stats/`: Returns counts for analytics (total found, total claimed, pending reports).
- `POST /api/admin/approve/<id>/`: Converts a Pending `ItemReport` into a public `FoundItem`.
- `POST /api/admin/reject/<id>/`: Marks an `ItemReport` as rejected.
- `POST, PATCH, DELETE /api/found-items/`: Admins have full write access to the main inventory.

---

## 6. Frontend Architecture (A to Z)

### Context Providers (`src/context/`)
1. **`AuthContext.jsx`**: 
   - Manages Google login/logout. 
   - Persists the user session in `sessionStorage` so users don't have to log in on every refresh.
2. **`ItemContext.jsx`**: 
   - Global state manager for the main data.
   - Fetches `FoundItem` and `LostReport` lists on initial load, making them instantly available to the `Dashboard` and removing the need for prop-drilling or redundant API calls.

### UI Components (`src/components/`)
1. **`Navbar.jsx`**: Responsive top navigation. Adapts links based on whether the user is logged in and whether they are an Admin.
2. **`ItemCard.jsx`**: A reusable card component. It uses conditional rendering (`isLostReport` prop) to stylistically differentiate between available "Found" items (Blue UI) and active "Lost" reports (Amber UI).
3. **`ProtectedRoute.jsx`**: A React Router wrapper that forces unauthenticated users to `/login`. It also has an `adminOnly` prop to bounce regular users away from the `/admin` routes.
4. **`CommandKSearch.jsx`**: A global, keyboard-accessible quick search modal spanning the entire viewport.

### Main Pages (`src/pages/`)
1. **`Dashboard.jsx`**: 
   - The homepage. Displays a toggleable grid of "Found Items" and "Lost & Looking".
   - Includes real-time client-side search and category filtering.
2. **`Login.jsx`**: 
   - Utilizes `@react-oauth/google` to render the official "Sign in with Google" button and handle the callback.
3. **`ReportLost.jsx`**: 
   - A multi-step form. Step 1: Contact info. Step 2: Item details. Step 3: Automated background API check against `FoundItems` to immediately notify the user if their item is already in the office.
4. **`ReportFound.jsx`**: 
   - A simple form pushing data to the `ItemReport` moderation queue.
5. **`SchedulePickup.jsx`**: 
   - Reads the `item_id` attached in the URL constraints, allows the user to pick a valid date/time, and submits the `PickupSchedule` to the backend.
6. **`AdminDashboard.jsx`**: 
   - Protected route. Contains 3 tabs: 
     - **Analytics**: Uses `recharts` to render recovery rates.
     - **Actions**: Displays pending `ItemReport` cards with Approve/Reject buttons.
     - **Inventory**: A table view of all `FoundItems` allowing manual additions, edits, and deletions.

---

## 7. Development & Execution Guide

### Starting the Backend
1. Open a terminal in `/backend`.
2. Activate your virtual environment if you have one.
3. Run migrations just in case: `python manage.py migrate`
4. Start the server: `python manage.py runserver`
*(The backend runs on `http://127.0.0.1:8000`)*

### Starting the Frontend
1. Open a terminal in `/frontend`.
2. Install dependencies: `npm install`
3. Start Vite: `npm run dev`
*(The frontend runs on `http://localhost:5173`)*

### Defining an Admin User
Because security prevents random users from becoming admins, you must manually promote your first user via the Django shell:
```bash
python manage.py shell
>>> from lost_and_found.models import UserProfile
>>> user = UserProfile.objects.get(email="your.email@auis.edu.krd")
>>> user.is_admin = True
>>> user.save()
```

## Summary of Code Quality & Design
- **Separation of Concerns**: The API handles raw data logic, React handles UI states and routing.
- **Fail-Safes**: All admin actions on the backend explicitly verify `is_admin` through DRF permissions, meaning frontend tampering cannot bypass security.
- **UX**: The app exclusively uses soft animations, glassmorphism layouts, and instant client-side filtering to feel like a premium, native application.
