# 🍽️ MessRate — Hostel Mess Review Platform

A full-stack **MERN** application for hostel students to rate and review mess food across different hostels and meal timings. Built with **JWT authentication**, **MongoDB**, and **Tailwind CSS**.

---

## 📁 Project Structure

```
mess-review/
├── backend/          # Express + MongoDB API
│   ├── config/       # DB connection
│   ├── middleware/   # JWT auth middleware
│   ├── models/       # User & Review Mongoose models
│   ├── routes/       # Auth & Review routes
│   ├── server.js     # Entry point
│   └── .env.example  # Environment variables template
└── frontend/         # React + Vite + Tailwind
    └── src/
        ├── components/   # Navbar, StarRating, ReviewCard
        ├── context/      # Auth Context (JWT)
        ├── pages/        # Home, Login, Signup, Dashboard, etc.
        └── utils/        # Axios API instance
```

---

## ⚡ Quick Setup

### Prerequisites
- Node.js v18+
- MongoDB (local) or a MongoDB Atlas URI

---

### 1. Clone & Navigate

```bash
cd mess-review
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/mess-review
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

Start the backend:
```bash
npm run dev       # development (nodemon)
# or
npm start         # production
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔐 Auth Flow

| Feature | Details |
|---|---|
| Sign Up | Full Name + UID + Password + Hostel |
| Login | UID + Password → JWT Token |
| Protected Routes | Dashboard, Submit Review, My Reviews |
| Token Storage | localStorage (auto-attached via Axios interceptor) |
| Token Expiry | 7 days |

---

## 🛠️ API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register new student |
| POST | `/api/auth/login` | Login with UID + password |
| GET | `/api/auth/me` | Get current user (protected) |

### Reviews
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/reviews` | Submit a review (protected) |
| GET | `/api/reviews` | Get all reviews (with filters) |
| GET | `/api/reviews/my` | Get logged-in user's reviews (protected) |
| GET | `/api/reviews/stats` | Aggregated stats per hostel/meal |
| DELETE | `/api/reviews/:id` | Delete own review (protected) |

### Query Filters (GET /api/reviews)
- `?hostel=Hostel A`
- `?mealTiming=Lunch`
- `?date=2024-01-15`
- `?page=1&limit=9`

---

## ⭐ Features

- **Student Authentication** — Sign up and login using University ID (UID)
- **JWT-protected routes** — Secure API with token-based auth
- **Rate by Category** — Taste, Hygiene, Quantity, Variety (1–5 stars each)
- **4 Meal Timings** — Breakfast, Lunch, Snacks, Dinner
- **5 Hostels** — A through E
- **Duplicate Prevention** — One review per student per hostel/meal/date
- **Live Stats** — Aggregated ratings with hostel leaderboard
- **My Reviews** — View and delete your own submissions
- **Pagination** — Browse all reviews with page controls
- **Responsive** — Mobile-friendly Tailwind UI

---

## 🎨 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Tailwind CSS v3, DM Sans + Syne fonts |
| State | React Context API |
| HTTP Client | Axios with interceptors |
| Backend | Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Notifications | react-hot-toast |

---

## 📝 Notes

- Change `JWT_SECRET` to a long random string in production
- Update CORS origin in `server.js` if deploying to a different domain
- MongoDB Atlas URI can be used instead of local MongoDB
