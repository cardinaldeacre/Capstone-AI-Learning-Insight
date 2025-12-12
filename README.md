# 🎓 Advanced System for Teaching & Assessment — ASTA Learning Platform

A comprehensive full-stack Learning Management System built with the PERN stack (PostgreSQL, Express, React, Node.js). This platform allows instructors to manage courses, modules, quizzes, and assignments, while students can enroll, track progress, and submit work.

## 🚀 Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM/Query Builder:** Knex.js (Migrations & Seeding)
- **Authentication:** JWT (Access & Refresh Tokens), Cookie-Parser
- **File Handling:** Multer (Uploads), Archiver (ZIP Downloads)
- **Documentation:** Swagger UI (`swagger-jsdoc`, `swagger-ui-express`)

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI (Radix Primitives)
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **State Management:** React Hooks (useState, useEffect, Context API)
- **Carousel:** Embla Carousel (with Autoplay plugin)
- **Routing:** React Router DOM

---

## ✨ Key Features

### 👨‍🏫 Teacher
- **Teacher Dashboard:** Real-time statistics (Total Classes, Total Students, Pending Submissions).
- **Course Management:** Create, update, and manage courses and modules.
- **Content Creation:** Add quizzes with timers and assignments with minimum passing scores.
- **Grading System:**
  - View list of submissions.
  - Grade assignments with feedback.
  - Reject submissions (forcing students to re-upload).

### 👨‍🎓 Student
- **Enrollment System:** Browse and join courses.
- **Learning Path:**
  - Interactive Module Sidebar.
  - **Prerequisite Logic:** Cannot proceed to the next module until the current Quiz/Assignment is passed.
- **Quiz System:**
  - Timed quizzes.
  - Auto-submit on timeout.
  - Immediate result calculation & history tracking.
- **Assignment System:**
  - Upload assignments (`.zip`/`.rar`).
  - View grades and feedback.
  - **Re-upload/Revision:** Ability to fix rejected submissions.
- **Progress Tracking:** Visual indicators for completed modules and course progress.

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- PostgreSQL Database
- NPM or Yarn

### 1. Database Setup
Create a PostgreSQL database (e.g., `lms_db`).

### 2. Backend Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd backend

# Install dependencies
npm install

# Environment Variables
# Create a .env file and add:
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=lms_db
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Run Migrations & Seeds
npx knex migrate:latest
npx knex seed:run

# Start Server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Environment Variables
# Create a .env file and add:
VITE_API_BASE_URL=http://localhost:3000/api

# Start Application
npm run dev
```

### API Documentation
This project includes a complete Swagger documentation. After starting the backend server, visit:
```bash
http://localhost:3000/api-docs
```

### 🔐 Security Features
- **Role-Based Access Control (RBAC):** Middleware ensures Students cannot access Teacher routes.
- **Secure File Handling:** Validates file types (.zip, .rar) before upload.
- **Data Integrity:** Transactional logic for submissions and enrollment.
- **Validation:** Logic to prevent deleting submissions belonging to other users.
