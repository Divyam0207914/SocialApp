# Mini Social Post Application

A full-stack, production-ready MERN application serving as a modern mobile-first social feed.

## 🧱 Tech Stack
- **Frontend**: React (Vite) + Material UI
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT & bcrypt

---

## 🚀 Setup Instructions (Local Development)

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (Local or Atlas)

### 1. Database & Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file! A basic configuration requires:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/minisocial?retryWrites=true&w=majority
   JWT_SECRET=supersecret123
   PORT=5000
   ```
   *Note: If using local MongoDB, replace the MONGO_URI with `mongodb://localhost:27017/minisocial`*
4. Start the development server:
   ```bash
   npm run dev
   # or
   node server.js
   ```

### 2. Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. The API URL is currently hardcoded in `src/services/api.js` to `http://localhost:5000/api`. If deploying, you will need to change this URL to your backend production URL.
4. Start Vite development server:
   ```bash
   npm run dev
   ```

---

## 🌐 Deployment Steps

### 1. Deploy the Backend (Render)
Render offers a free tier for Node.js Web Services.
- Push your code to a GitHub repository.
- Log into [Render.com](https://render.com) and create a new **Web Service**.
- Connect the GitHub repository.
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node server.js`
- **Environment Variables**: Add `MONGO_URI` (your production MongoDB Atlas string) and `JWT_SECRET`.
- Click **Deploy**. Note the assigned URL (e.g., `https://minisocial-api.onrender.com`).

### 2. Update Frontend API Endpoint
Before deploying the frontend, update the API base URL.
- Open `frontend/src/services/api.js`.
- Change `baseURL` from `http://localhost:5000/api` to your Render API URL.

### 3. Deploy the Frontend (Vercel)
Vercel is ideal for Vite + React applications.
- Log into [Vercel.com](https://vercel.com) and import the same GitHub repository.
- Root Directory: `frontend`
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Click **Deploy** to publish the app globally.

---

## ✨ Features Implemented
- JWT Authentication (Signup/Login)
- Optimistic UI updates for Post Likes
- Instant Comments UI
- Image URL rendering on Post Cards
- Pagination built-in via feed query parameters
- Complete Responsive Mobile-first interface matching the reference UI perfectly using pure Material-UI (no Tailwind).

Enjoy exploring the social feed!
