# StayHaven 🏠 — Full-Stack Property Booking Platform

A production-level Airbnb-inspired property booking platform built with the MERN stack.

---

## 📁 Folder Structure

```
stayhaven/
├── backend/
│   ├── config/
│   │   └── cloudinary.js          # Cloudinary SDK config
│   ├── controllers/
│   │   ├── admin.controller.js
│   │   ├── auth.controller.js
│   │   ├── booking.controller.js
│   │   ├── property.controller.js
│   │   ├── review.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js     # JWT protect / authorize / optionalAuth
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Property.js
│   │   ├── Review.js
│   │   └── User.js
│   ├── routes/
│   │   ├── admin.routes.js
│   │   ├── auth.routes.js
│   │   ├── booking.routes.js
│   │   ├── property.routes.js
│   │   ├── review.routes.js
│   │   ├── upload.routes.js
│   │   ├── user.routes.js
│   │   └── wishlist.routes.js
│   ├── seed/
│   │   └── seed.js                # Sample data seeder
│   ├── uploads/                   # Auto-created – local image storage
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   │   └── axios.js           # Axios instance with interceptors
    │   ├── components/
    │   │   ├── booking/
    │   │   │   └── BookingBox.jsx
    │   │   ├── common/
    │   │   │   ├── Footer.jsx
    │   │   │   ├── Navbar.jsx
    │   │   │   └── SearchBar.jsx
    │   │   └── property/
    │   │       ├── FilterSidebar.jsx
    │   │       ├── PropertyCard.jsx
    │   │       └── ReviewCard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx    # Auth state (login / register / logout)
    │   ├── pages/
    │   │   ├── AdminDashboardPage.jsx
    │   │   ├── AddPropertyPage.jsx
    │   │   ├── BookingConfirmationPage.jsx
    │   │   ├── EditPropertyPage.jsx
    │   │   ├── HomePage.jsx
    │   │   ├── HostDashboardPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── MyBookingsPage.jsx
    │   │   ├── NotFoundPage.jsx
    │   │   ├── PropertyDetailPage.jsx
    │   │   ├── PropertyListingPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── UserDashboardPage.jsx
    │   │   └── WishlistPage.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

---

## ⚡ Quick Setup

### Prerequisites
- Node.js 18+
- MongoDB (local) **or** MongoDB Atlas URI
- npm or yarn

---

### 1 — Clone & enter project

```bash
git clone <your-repo-url> stayhaven
cd stayhaven
```

---

### 2 — Backend setup

```bash
cd backend

# Install dependencies
npm install

# Copy env file and fill in your values
cp .env.example .env

# Edit .env — at minimum set MONGODB_URI and JWT_SECRET
```

**Minimum required `.env` values:**
```
MONGODB_URI=mongodb://localhost:27017/stayhaven
JWT_SECRET=change_this_to_a_long_random_string
PORT=5000
CLIENT_URL=http://localhost:5173
API_URL=http://localhost:5000
```

```bash
# Seed the database with sample data
npm run seed

# Start the dev server
npm run dev
# → API running at http://localhost:5000
```

---

### 3 — Frontend setup

```bash
# From project root
cd frontend

# Install dependencies
npm install

# Copy env file (default works with Vite proxy — no changes needed)
cp .env.example .env

# Start dev server
npm run dev
# → App running at http://localhost:5173
```

---

### 4 — Open the app

```
http://localhost:5173
```

---

## 🔑 Demo Accounts (after seeding)

| Role  | Email                    | Password   |
|-------|--------------------------|------------|
| Admin | admin@stayhaven.com      | admin123   |
| Host  | sarah@stayhaven.com      | host123    |
| Host  | marco@stayhaven.com      | host123    |
| Guest | james@example.com        | guest123   |
| Guest | emma@example.com         | guest123   |

---

## 🛣️ API Routes

### Auth — `/api/auth`

| Method | Route              | Access  | Description              |
|--------|--------------------|---------|--------------------------|
| POST   | `/register`        | Public  | Register new user        |
| POST   | `/login`           | Public  | Login & get JWT token    |
| GET    | `/me`              | Private | Get current user profile |
| PUT    | `/become-host`     | Private | Upgrade role to host     |

---

### Properties — `/api/properties`

| Method | Route                     | Access       | Description                      |
|--------|---------------------------|--------------|----------------------------------|
| GET    | `/`                       | Public       | List all properties (with filters & pagination) |
| GET    | `/:id`                    | Public       | Get single property              |
| POST   | `/`                       | Host / Admin | Create new property              |
| PUT    | `/:id`                    | Host / Admin | Update property                  |
| DELETE | `/:id`                    | Host / Admin | Soft-delete property             |
| GET    | `/featured`               | Public       | Get featured properties          |
| GET    | `/host/my-properties`     | Host / Admin | Get current host's properties    |
| GET    | `/host/stats`             | Host / Admin | Earnings & booking stats         |
| GET    | `/host/bookings`          | Host / Admin | All bookings for host's listings |

**Query params for `GET /api/properties`:**
```
search      — text search (city, country, title)
category    — beach | mountain | city | cabin | villa | treehouse | ...
minPrice    — minimum price per night
maxPrice    — maximum price per night
guests      — minimum guest capacity
bedrooms    — minimum bedrooms
bathrooms   — minimum bathrooms
amenities   — comma-separated list e.g. WiFi,Pool,Kitchen
sortBy      — createdAt | price | rating  (default: createdAt)
order       — asc | desc                  (default: desc)
page        — page number                 (default: 1)
limit       — results per page            (default: 12)
```

---

### Bookings — `/api/bookings`

| Method | Route                    | Access  | Description                    |
|--------|--------------------------|---------|--------------------------------|
| POST   | `/`                      | Private | Create booking                 |
| GET    | `/my-bookings`           | Private | Get current user's bookings    |
| GET    | `/:id`                   | Private | Get single booking             |
| PUT    | `/:id/cancel`            | Private | Cancel booking                 |
| GET    | `/check-availability`    | Public  | Check property availability    |

**Check availability params:**
```
propertyId  — property _id
checkIn     — ISO date string
checkOut    — ISO date string
```

---

### Reviews — `/api/reviews`

| Method | Route                      | Access  | Description                   |
|--------|----------------------------|---------|-------------------------------|
| POST   | `/`                        | Private | Submit review for a booking   |
| GET    | `/property/:propertyId`    | Public  | Get all reviews for a property|
| DELETE | `/:id`                     | Private | Delete own review             |

---

### Users — `/api/users`

| Method | Route                      | Access  | Description              |
|--------|----------------------------|---------|--------------------------|
| PUT    | `/profile`                 | Private | Update profile info      |
| PUT    | `/change-password`         | Private | Change password          |
| GET    | `/wishlist`                | Private | Get wishlist             |
| POST   | `/wishlist/:propertyId`    | Private | Toggle wishlist item     |

---

### Wishlist — `/api/wishlist`

| Method | Route          | Access  | Description          |
|--------|----------------|---------|----------------------|
| GET    | `/`            | Private | Get user's wishlist  |
| POST   | `/:propertyId` | Private | Toggle property      |

---

### Upload — `/api/upload`

| Method | Route      | Access  | Description                        |
|--------|------------|---------|------------------------------------|
| POST   | `/images`  | Private | Upload up to 10 property images    |
| POST   | `/avatar`  | Private | Upload user avatar                 |

---

### Admin — `/api/admin` *(admin role required)*

| Method | Route                    | Description                      |
|--------|--------------------------|----------------------------------|
| GET    | `/stats`                 | Platform overview stats          |
| GET    | `/users`                 | List all users                   |
| PUT    | `/users/:id/toggle`      | Activate / deactivate user       |
| GET    | `/properties`            | List all properties              |
| DELETE | `/properties/:id`        | Remove a listing                 |
| GET    | `/bookings`              | List all bookings                |

---

### Health check

```
GET /api/health   → { status: 'OK', message: 'StayHaven API is running' }
```

---

## 🧪 Testing Instructions

### Manual API testing with curl

**Register a new user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123","role":"guest"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"james@example.com","password":"guest123"}'
# → save the returned token
```

**Get properties:**
```bash
curl http://localhost:5000/api/properties
curl "http://localhost:5000/api/properties?category=beach&minPrice=100&maxPrice=500"
curl "http://localhost:5000/api/properties?search=Malibu&sortBy=price&order=asc"
```

**Create a booking (replace TOKEN and IDs):**
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "propertyId": "PROPERTY_ID",
    "checkIn": "2025-08-01",
    "checkOut": "2025-08-05",
    "guests": {"adults": 2, "children": 0}
  }'
```

**Get my bookings:**
```bash
curl http://localhost:5000/api/bookings/my-bookings \
  -H "Authorization: Bearer TOKEN"
```

**Submit a review:**
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "bookingId": "BOOKING_ID",
    "ratings": {"overall": 5, "cleanliness": 5, "value": 4},
    "comment": "Absolutely fantastic stay, would highly recommend!"
  }'
```

**Admin stats:**
```bash
# Login as admin first to get token
curl http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

### Frontend testing walkthrough

**Guest flow:**
1. Go to `http://localhost:5173`
2. Click **Sign in** → use `james@example.com / guest123`
3. Browse listings → click any property card
4. Select dates + guests → click **Reserve Now**
5. View booking confirmation page
6. Go to **My Bookings** → see your booking
7. Click ❤️ heart on any listing to save to wishlist
8. Go to **Wishlist** to see saved properties

**Host flow:**
1. Sign in as `sarah@stayhaven.com / host123`
2. Go to **Host Dashboard** → see stats + listings + bookings
3. Click **Add listing** → fill in the 6-step wizard
4. Upload images, set price, publish
5. Edit or delete a listing from the dashboard

**Admin flow:**
1. Sign in as `admin@stayhaven.com / admin123`
2. Go to **Admin Panel** (in user menu)
3. View overview stats
4. Switch tabs: Users / Properties / Bookings
5. Toggle a user active/inactive
6. Remove a property listing

---

## 🏗️ Build for Production

**Backend:**
```bash
cd backend
NODE_ENV=production node server.js
# or with pm2:
npm install -g pm2
pm2 start server.js --name stayhaven-api
```

**Frontend:**
```bash
cd frontend
npm run build
# → dist/ folder ready for static hosting (Vercel, Netlify, S3, etc.)
npm run preview  # preview production build locally
```

**Environment variables for production:**
- Set `NODE_ENV=production` on the server
- Use a strong random `JWT_SECRET` (32+ chars)
- Point `MONGODB_URI` to your Atlas cluster
- Set `CLIENT_URL` to your deployed frontend URL
- Set `VITE_API_URL` in the frontend to your backend URL

---

## 🔧 Common Issues & Fixes

**MongoDB connection refused:**
```bash
# Make sure MongoDB is running locally
brew services start mongodb-community   # macOS
sudo systemctl start mongod             # Linux
```

**CORS errors in browser:**
- Confirm `CLIENT_URL` in backend `.env` matches your frontend URL exactly (including port)

**Images not loading:**
- Check `API_URL` in backend `.env` points to your backend host
- The `uploads/` folder is auto-created on first upload

**Port already in use:**
```bash
lsof -ti:5000 | xargs kill   # kill whatever is on port 5000
lsof -ti:5173 | xargs kill   # kill whatever is on port 5173
```

**Re-seed the database:**
```bash
cd backend
npm run seed   # drops existing data and re-seeds fresh
```
# stayhaven
