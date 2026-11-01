# Local Development Setup Guide — Sort My Scene

This document details the exact repository architecture, setup requirements, environment configuration, and execution instructions for running **Sort My Scene** locally on Windows.

---

## 1. Actual Project Architecture

The original repository was maintained with frontend and backend on distinct Git branches (`upstrea/frontend` and `upstrea/backend`). The workspace has been extracted and unified into a full-stack monorepo layout:

```text
wp_prjct/
└── sort_my_scene/
    ├── backend/                    # Express.js REST API & Mongoose models
    │   ├── config/
    │   │   └── db.js               # Mongoose database connection
    │   ├── controllers/
    │   │   ├── auth.controllers.js    # Register, login, me
    │   │   ├── booking.controllers.js # Transactional booking & user history
    │   │   ├── event.controllers.js   # Event CRUD & seating grid generation
    │   │   └── reserve.controllers.js # 5-min TTL seat reservation
    │   ├── middleware/
    │   │   ├── auth.middleware.js     # Bearer JWT protection
    │   │   └── upload.middleware.js   # Multer file upload handling
    │   ├── models/
    │   │   ├── booking.models.js      # Booking schema
    │   │   ├── event.models.js        # Event schema
    │   │   ├── reservation.models.js  # Reservation schema (TTL index)
    │   │   ├── seat.models.js         # Seat schema (per-event coordinate)
    │   │   └── user.models.js         # User schema with bcrypt hashing
    │   ├── routes/
    │   │   ├── auth.routes.js         # /api/auth/*
    │   │   ├── booking.routes.js      # /api/bookings/*
    │   │   ├── event.routes.js        # /api/events/* & /api/users/:id/events
    │   │   └── reserve.routes.js      # /api/reserve
    │   ├── uploads/                   # Uploaded event posters (.gitkeep)
    │   ├── utils/
    │   │   ├── generateToken.js       # JWT generation utility
    │   │   └── seed.js                # Database seeder (50 dummy events)
    │   ├── app.js                     # Express app setup & route mounting
    │   ├── server.js                  # HTTP server entry point (Port 5000)
    │   ├── package.json               # Backend dependencies & scripts
    │   ├── .env.example               # Backend environment template
    │   └── .gitignore
    │
    ├── frontend/                   # Vite + React 18 SPA with Tailwind CSS
    │   ├── public/
    │   │   └── events/                # Static event poster samples (event1-8.jpg)
    │   ├── src/
    │   │   ├── api/
    │   │   │   └── axiosConfig.js     # Axios client with JWT interceptor
    │   │   ├── components/
    │   │   │   ├── CountdownTimer.jsx # 5-minute reservation timer
    │   │   │   ├── EventCard.jsx      # Event preview card component
    │   │   │   ├── Navbar.jsx         # Global top navigation bar
    │   │   │   ├── Seat.jsx           # Individual interactive seat button
    │   │   │   └── SeatGrid.jsx       # Alphabetic seat layout with stage indicator
    │   │   ├── context/
    │   │   │   └── AuthContext.jsx    # React Context for user authentication
    │   │   ├── pages/
    │   │   │   ├── Home.jsx           # Event discovery & live search
    │   │   │   ├── EventDetails.jsx   # Seat selection, hold timer, mock payment
    │   │   │   ├── CreateEvent.jsx    # Organizer event creation & layout builder
    │   │   │   ├── Login.jsx          # User login
    │   │   │   ├── Signup.jsx         # User registration
    │   │   │   ├── MyBookings.jsx     # Booking history with offline cache
    │   │   │   └── MyEvents.jsx       # Organizer event management & deletion
    │   │   ├── styles/
    │   │   │   └── global.css         # Tailwind & glassmorphism theme styles
    │   │   ├── utils/
    │   │   │   └── helpers.js         # Date, time, and INR currency formatters
    │   │   ├── App.jsx                # Route registry
    │   │   └── main.jsx               # React DOM entry point
    │   ├── index.html                 # HTML shell
    │   ├── package.json               # Frontend dependencies & scripts
    │   ├── vite.config.js             # Vite build configuration
    │   ├── tailwind.config.js         # Tailwind CSS variables configuration
    │   ├── postcss.config.js          # PostCSS configuration
    │   ├── .env.example               # Frontend environment template
    │   └── .gitignore
    │
    └── README.md                      # Original project documentation
```

---

## 2. Prerequisites

- **Node.js**: `v18.0.0` or higher (tested with `v26.13.0` LTS)
- **npm**: `v9.0.0` or higher (tested with `v11.20.0`)
- **Git for Windows**: Available at `C:\Program Files\Git\cmd\git.exe`
- **MongoDB**: Either:
  - **MongoDB Atlas** (Cloud Free Tier Cluster — **Recommended** because MongoDB transactions require a replica set, which Atlas provides by default)
  - **Local MongoDB Community Server** configured with a replica set (`--replSet rs0`)

---

## 3. Environment Variables Configuration

### Backend (`sort_my_scene/backend/.env`)

Create `backend/.env` with the following variables:

```env
# Server Port
PORT=5000

# MongoDB Connection String (Atlas or Replica Set)
# Note: A replica set is strictly required for Mongoose transactions in reservation and booking controllers!
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/sort_my_scene?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_strong_random_secret_here_replace_me
JWT_EXPIRES_IN=7d
```

### Frontend (`sort_my_scene/frontend/.env`)

Create `frontend/.env` with the following variable:

```env
# Target Backend API URL
VITE_API_URL=http://localhost:5000/api
```

---

## 4. Dependency Installation

Both directories must be installed independently using `npm ci`:

```powershell
# In backend directory
cd "sort_my_scene\backend"
npm ci

# In frontend directory
cd "..\frontend"
npm ci
```

---

## 5. Database Setup & Seeding

1. Obtain a MongoDB Atlas connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Whitelist your local IP address in the Network Access settings.
3. Place the connection URI into `backend/.env`.
4. Run the seed script to populate 50 events across 6 categories with seating layouts:

```powershell
cd "sort_my_scene\backend"
npm run seed
```

*(Note: Add `"seed": "node utils/seed.js"` to `backend/package.json` if running via npm script).*

---

## 6. Starting the Application

Run frontend and backend in separate terminal windows:

### Terminal 1: Backend Server
```powershell
cd "sort_my_scene\backend"
npm start
# Server starts on: http://localhost:5000
# Health check: http://localhost:5000/
```

### Terminal 2: Frontend Client
```powershell
cd "sort_my_scene\frontend"
npm run dev
# Frontend runs on: http://localhost:5173
```

---

## 7. Verified URLs & API Endpoints

- **Frontend Client**: `http://localhost:5173/`
- **Backend API Root**: `http://localhost:5000/` (returns `{"success": true, "message": "Sort My Scene API is running"}`)
- **Events Endpoint**: `http://localhost:5000/api/events`
- **Auth Endpoint**: `http://localhost:5000/api/auth/login`
- **Uploaded Images**: `http://localhost:5000/uploads/<filename>`

---

## 8. Common Errors & Troubleshooting

1. **`Database Connection Failed: The 'uri' parameter must be a string`**
   - **Root Cause**: `MONGO_URI` is missing from `backend/.env`.
   - **Solution**: Ensure `backend/.env` exists and contains a valid connection URI.

2. **`MongoServerError: Transaction numbers are only allowed on a replica set member or mongos`**
   - **Root Cause**: The reservation (`/api/reserve`) and booking (`/api/bookings`) endpoints initiate Mongoose transactions (`session.startTransaction()`). Standalone local MongoDB instances do not support transactions.
   - **Solution**: Use MongoDB Atlas (which runs replica sets on all tiers) or start local MongoDB with `--replSet rs0` and run `rs.initiate()`.

3. **`SyntaxError: Unexpected token '﻿'` during frontend build**
   - **Root Cause**: PowerShell 5.1 default UTF-8 encoding added a UTF-8 BOM (`0xEF, 0xBB, 0xBF`) to JSON/JS files.
   - **Solution**: Cleaned and permanently stripped in all project files.

4. **PowerShell script execution disabled**
   - **Root Cause**: Windows ExecutionPolicy blocks running `npm.ps1`.
   - **Solution**: Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force`.

---

## 9. Current Application Limitations

- **Simulated Payment**: The checkout form performs client-side card validation (16 digits, expiry, CVC) but does not charge a card or talk to a real gateway (e.g., Stripe/Razorpay).
- **Seat Expiry Cleanup**: If a 5-minute reservation expires, the `Reservation` document is deleted via MongoDB TTL index, but seat status in the `Seat` collection does not automatically revert from `reserved` to `available` until an expiry hook or background cleanup task runs.
- **Dead Stylesheet Files**: `src/App.css` and `src/index.css` are unused remnants of the Vite initial template; active styles are exclusively loaded from `src/styles/global.css`.

