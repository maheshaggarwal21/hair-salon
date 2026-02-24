# The Experts - Hair Salon Management System

A full-stack, production-ready salon management system built with modern web technologies. This application streamlines salon operations including visit tracking, service management, artist scheduling, team administration, and comprehensive analytics.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security](#security)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)

---

## 🎯 Overview

**The Experts** is an enterprise-grade salon management system designed to digitize and optimize daily salon operations. The system provides role-based access control, real-time analytics, payment integration, and comprehensive data management capabilities.

### Key Highlights

- **Role-Based Architecture**: Owner, Manager, and Receptionist roles with granular permissions
- **Real-Time Analytics**: Revenue tracking, service popularity, artist performance metrics
- **Payment Integration**: Razorpay payment gateway with QR code generation
- **Responsive Design**: Mobile-first UI with desktop optimization
- **Data Export**: Excel export functionality for reports and analytics
- **Audit Trail**: Complete visit history with timestamp tracking

---

## ✨ Features

### 1. **Visit Management**
- **Digital Visit Entry**: Replace paper registers with digital records
- **Multi-Service Support**: Record multiple services per visit
- **Payment Modes**: Cash, UPI, Card tracking with Razorpay integration
- **Customer History**: Track all visits with customer name, phone, and service details
- **Real-Time Updates**: Instant reflection across all dashboards

### 2. **Service Catalogue Management** (Owner Only)
- **CRUD Operations**: Create, Read, Update, Delete services
- **Category Organization**: Group services by categories (Haircut, Coloring, Spa, etc.)
- **Dynamic Pricing**: Update prices without affecting historical data
- **Active/Inactive Status**: Soft-delete with reactivation capability
- **Permanent Delete**: Hard delete option with confirmation dialog

### 3. **Artist Directory Management** (Manager + Owner)
- **Artist Profiles**: Name and phone number tracking
- **Assignment Tracking**: Link artists to visits for performance metrics
- **Status Management**: Activate/deactivate artists based on availability
- **Duplicate Prevention**: Phone number uniqueness validation
- **Performance Analytics**: Track revenue generated per artist

### 4. **Team Management** (Owner Only)
- **User Account Creation**: Add Receptionist and Manager accounts
- **Credential Management**: Secure password hashing with bcrypt
- **Role Assignment**: Granular permission control
- **Account Lifecycle**: Deactivate/reactivate team members
- **Audit Logs**: Track who created which account and when

### 5. **Analytics & Reporting**
- **Revenue Dashboard**: Daily, weekly, monthly, yearly revenue tracking
- **Service Popularity**: Top-performing services by count and revenue
- **Artist Performance**: Individual artist revenue and visit count
- **Payment Mode Distribution**: Cash vs Digital payment analysis
- **Trend Analysis**: Date range filtering with visual charts
- **Excel Export**: Download complete visit history in `.xlsx` format

### 6. **Payment Integration**
- **Razorpay Gateway**: Secure online payment processing
- **QR Code Generation**: Dynamic UPI QR codes for each transaction
- **Payment Verification**: Server-side signature validation
- **Status Tracking**: Success/failure page with payment details
- **Transaction History**: Complete audit trail in the database

### 7. **Security Features**
- **Session-Based Authentication**: Express-session with MongoDB store
- **Password Hashing**: bcrypt with 12 salt rounds
- **CORS Protection**: Configurable allowed origins
- **Rate Limiting**: 200 requests per 15 minutes per IP
- **Helmet.js Integration**: Security headers (XSS, CSP, etc.)
- **Input Validation**: express-validator for all API endpoints
- **MongoDB ObjectId Validation**: Prevent invalid ID injection
- **Role-Based Access Control**: Middleware-level authorization

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library with latest features
- **TypeScript 5.9** - Type-safe development
- **Vite 7** - Lightning-fast build tool
- **TailwindCSS 4** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **React Router 7** - Client-side routing
- **Lucide React** - Icon library
- **xlsx** - Excel export functionality

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express 4** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 9** - ODM for MongoDB
- **express-session** - Session management
- **connect-mongo** - MongoDB session store
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security headers
- **express-rate-limit** - API rate limiting
- **cors** - Cross-origin resource sharing
- **Razorpay** - Payment gateway SDK
- **xlsx** - Server-side Excel generation

### Deployment
- **Vercel** - Frontend hosting (serverless)
- **Vercel** - Backend hosting (serverless functions)
- **MongoDB Atlas** - Cloud database (M0 free tier)

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Vercel)                    │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────────┐    │
│  │   Public   │  │   Visit    │  │    Dashboard        │    │
│  │   Pages    │  │   Entry    │  │    (Protected)      │    │
│  │  (Home,    │  │  (Simple   │  │  - Owner            │    │
│  │   About,   │  │   Form)    │  │  - Manager          │    │
│  │  Contact)  │  │            │  │  - Receptionist     │    │
│  └────────────┘  └────────────┘  └─────────────────────┘    │
│         │                │                    │             │
│         └────────────────┴────────────────────┘             │
│                          │                                  │
│                    API Requests                             │
│                  (credentials: include)                     │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Vercel)                         │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Middleware Stack                        │   │
│  │  CORS → JSON Parser → Lazy DB Connect → Helmet →     │   │
│  │  Rate Limiter → Session Manager → Owner Seeding      │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  Route Handlers                      │   │
│  │                                                      │   │
│  │  /api/auth         → authenticate                    │   │
│  │  /api/admin        → authenticate + authorize(owner) │   │
│  │  /api/artists      → authenticate                    │   │
│  │  /api/services     → authenticate                    │   │
│  │  /api/visits       → authenticate                    │   │
│  │  /api/analytics    → authenticate + authorize(mgr+)  │   │
│  │  /api/razorpay     → authenticate                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Business Logic Layer                    │   │
│  │  • Input Validation (express-validator)              │   │
│  │  • MongoDB ObjectId Validation                       │   │
│  │  • Duplicate Prevention (unique constraints)         │   │
│  │  • Error Handling & Logging                          │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 MongoDB Atlas (Cloud)                       │
│                                                             │
│  Collections:                                               │
│  • users         → Team accounts & authentication           │
│  • visits        → Visit records with services              │
│  • artists       → Artist directory                         │
│  • services      → Service catalogue                        │
│  • sessions      → Express session store                    │
│                                                             │
│  Indexes:                                                   │
│  • users.email (unique)                                     │
│  • artists.phone (unique)                                   │
│  • visits.date (sorted)                                     │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Visit Entry Flow**:
   ```
   User fills form → Validate input → Check artist/service existence →
   Create visit record → Update Analytics → Redirect to success page
   ```

2. **Authentication Flow**:
   ```
   Login → Validate credentials → bcrypt compare → Create session →
   Set session cookie → Redirect to dashboard
   ```

3. **Payment Flow**:
   ```
   Create Razorpay order → Generate QR code → User pays →
   Razorpay webhook → Verify signature → Update payment status →
   Redirect to status page
   ```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local instance or Atlas account
- **Git**: For cloning the repository

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kritgun1907/hair-salon.git
   cd hair-salon
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create `.env` file:
   ```env
   PORT=4000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hair-salon
   SESSION_SECRET=your-super-secret-session-key-min-32-chars
   NODE_ENV=development
   
   # Owner account (created automatically on first run)
   OWNER_NAME=Salon Owner
   OWNER_EMAIL=owner@theexperts.in
   OWNER_PASSWORD=SecurePass123!
   
   # Razorpay credentials (optional, for payment features)
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
   
   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:5173
   
   # Vercel deployment (for production)
   VERCEL_PROJECT_NAME=hair-salon
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend/form_razorpay
   npm install
   ```

   Create `.env` file:
   ```env
   VITE_BACKEND_URL=http://localhost:4000
   VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   ```

4. **Database Setup**
   
   Option A - Local MongoDB:
   ```bash
   mongod --dbpath /path/to/data
   ```

   Option B - MongoDB Atlas:
   - Create free M0 cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Whitelist your IP: `0.0.0.0/0` (for development)
   - Copy connection string to `MONGODB_URI` in `.env`

5. **Start Development Servers**

   Terminal 1 (Backend):
   ```bash
   cd backend
   node index.js
   ```

   Terminal 2 (Frontend):
   ```bash
   cd frontend/form_razorpay
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000
   - Default owner login: `owner@theexperts.in` / password from `.env`

---

## 📡 API Documentation

### Base URL
- Development: `http://localhost:4000`
- Production: `https://hair-salon-backend-two.vercel.app`

### Authentication

All protected endpoints require session-based authentication. Include `credentials: "include"` in fetch requests.

#### POST `/api/auth/signin`
**Description**: Authenticate user and create session  
**Access**: Public  
**Request Body**:
```json
{
  "email": "owner@theexperts.in",
  "password": "SecurePass123!"
}
```
**Response** (200):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Salon Owner",
  "email": "owner@theexperts.in",
  "role": "owner",
  "isActive": true
}
```
**Errors**:
- `400`: Missing credentials
- `401`: Invalid credentials
- `403`: Account deactivated

#### POST `/api/auth/signout`
**Description**: Destroy session and logout  
**Access**: Authenticated  
**Response** (200):
```json
{
  "ok": true,
  "message": "Signed out successfully"
}
```

#### GET `/api/auth/me`
**Description**: Get current user session  
**Access**: Authenticated  
**Response** (200):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Salon Owner",
  "email": "owner@theexperts.in",
  "role": "owner"
}
```
**Errors**:
- `401`: Not authenticated

---

### Visits

#### GET `/api/visits`
**Description**: List all visits (paginated, sorted by date DESC)  
**Access**: Authenticated  
**Query Params**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 50)

**Response** (200):
```json
{
  "visits": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "customerName": "Rajesh Kumar",
      "phone": "9876543210",
      "date": "2026-02-24T10:30:00.000Z",
      "services": [
        {
          "service": "Premium Haircut",
          "price": 500,
          "artist": "Amit Sharma"
        }
      ],
      "total": 500,
      "paymentMode": "cash",
      "createdBy": "507f1f77bcf86cd799439012",
      "createdAt": "2026-02-24T10:30:00.000Z"
    }
  ],
  "totalPages": 10,
  "currentPage": 1
}
```

#### GET `/api/visits/export-excel`
**Description**: Export all visits to Excel file  
**Access**: Manager + Owner  
**Response**: Binary Excel file download (`.xlsx`)

#### POST `/api/visits`
**Description**: Create a new visit  
**Access**: Authenticated  
**Request Body**:
```json
{
  "customerName": "Priya Desai",
  "phone": "9123456789",
  "date": "2026-02-24T14:00:00.000Z",
  "services": [
    { "service": "Hair Coloring", "price": 1200, "artist": "Neha Patel" },
    { "service": "Hair Spa", "price": 800, "artist": "Neha Patel" }
  ],
  "total": 2000,
  "paymentMode": "upi"
}
```
**Validation**:
- `customerName`: Required, 2-100 chars
- `phone`: Required, 10-digit Indian mobile (starts with 6-9)
- `date`: Required, valid ISO date
- `services`: Array, at least one service
- `services[].service`: Required string
- `services[].price`: Required, >= 0
- `services[].artist`: Required string
- `total`: Required, >= 0
- `paymentMode`: Required, one of: `cash`, `upi`, `card`

**Response** (201):
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "customerName": "Priya Desai",
  "phone": "9123456789",
  "date": "2026-02-24T14:00:00.000Z",
  "services": [...],
  "total": 2000,
  "paymentMode": "upi",
  "createdBy": "507f1f77bcf86cd799439012",
  "createdAt": "2026-02-24T14:00:00.000Z"
}
```

**Errors**:
- `400`: Validation errors
- `401`: Not authenticated

---

### Services

#### GET `/api/services`
**Description**: List all active services  
**Access**: Authenticated  
**Response** (200):
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "name": "Premium Haircut",
    "price": 500,
    "category": "Haircut",
    "isActive": true,
    "createdAt": "2026-01-15T10:00:00.000Z"
  }
]
```

#### GET `/api/services/all`
**Description**: List all services (including inactive)  
**Access**: Owner  
**Response**: Same as above, includes `isActive: false` services

#### GET `/api/services/categories`
**Description**: Get distinct active categories  
**Access**: Authenticated  
**Response** (200):
```json
["Haircut", "Coloring", "Spa", "Styling"]
```

#### POST `/api/services`
**Description**: Create a new service  
**Access**: Owner  
**Request Body**:
```json
{
  "name": "Keratin Treatment",
  "price": 3500,
  "category": "Hair Treatment"
}
```
**Validation**:
- `name`: Required, unique (case-insensitive)
- `price`: Required, >= 0
- `category`: Optional string

**Response** (201):
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "name": "Keratin Treatment",
  "price": 3500,
  "category": "Hair Treatment",
  "isActive": true,
  "createdAt": "2026-02-24T15:00:00.000Z"
}
```

**Errors**:
- `400`: Validation errors
- `401`: Not authenticated
- `403`: Not owner
- `409`: Duplicate service name

#### PATCH `/api/services/:id`
**Description**: Update a service  
**Access**: Owner  
**Path Params**: `id` - MongoDB ObjectId  
**Request Body** (all optional):
```json
{
  "name": "Premium Keratin Treatment",
  "price": 4000,
  "category": "Hair Treatment",
  "isActive": true
}
```
**Response** (200): Updated service object

**Errors**:
- `400`: Invalid ObjectId or validation errors
- `404`: Service not found
- `409`: Duplicate name with another service

#### DELETE `/api/services/:id`
**Description**: Soft-delete (deactivate) a service  
**Access**: Owner  
**Response** (200):
```json
{
  "ok": true,
  "message": "Service deactivated successfully"
}
```

#### DELETE `/api/services/:id/permanent`
**Description**: Hard-delete (remove from DB) a service  
**Access**: Owner  
**Response** (200):
```json
{
  "ok": true,
  "message": "Service permanently deleted"
}
```

---

### Artists

#### GET `/api/artists`
**Description**: List all active artists  
**Access**: Authenticated  
**Response** (200):
```json
[
  {
    "_id": "507f1f77bcf86cd799439016",
    "name": "Amit Sharma",
    "phone": "9876543210",
    "isActive": true,
    "createdAt": "2026-01-10T09:00:00.000Z"
  }
]
```

#### GET `/api/artists/all`
**Description**: List all artists (including inactive)  
**Access**: Manager + Owner  
**Response**: Same as above, includes inactive artists

#### POST `/api/artists`
**Description**: Create a new artist  
**Access**: Manager + Owner  
**Request Body**:
```json
{
  "name": "Neha Patel",
  "phone": "9123456789"
}
```
**Validation**:
- `name`: Required string
- `phone`: Required, unique, 10-digit starting with 6-9

**Response** (201):
```json
{
  "_id": "507f1f77bcf86cd799439017",
  "name": "Neha Patel",
  "phone": "9123456789",
  "isActive": true,
  "createdAt": "2026-02-24T16:00:00.000Z"
}
```

**Errors**:
- `409`: Phone number already exists

#### PATCH `/api/artists/:id`
**Description**: Update an artist  
**Access**: Manager + Owner  
**Request Body** (all optional):
```json
{
  "name": "Neha Patel (Senior Stylist)",
  "phone": "9123456789",
  "isActive": true
}
```
**Response** (200): Updated artist object

#### DELETE `/api/artists/:id`
**Description**: Soft-delete (deactivate) an artist  
**Access**: Manager + Owner  
**Response** (200):
```json
{
  "ok": true,
  "message": "Artist deactivated successfully"
}
```

#### DELETE `/api/artists/:id/permanent`
**Description**: Hard-delete (remove from DB) an artist  
**Access**: Owner  
**Response** (200):
```json
{
  "ok": true,
  "message": "Artist permanently deleted"
}
```

---

### Team Management (Admin)

#### GET `/api/admin/users`
**Description**: List all team members (including owner)  
**Access**: Owner  
**Response** (200):
```json
[
  {
    "_id": "507f1f77bcf86cd799439018",
    "name": "Salon Manager",
    "email": "manager@theexperts.in",
    "role": "manager",
    "isActive": true,
    "createdBy": "507f1f77bcf86cd799439011",
    "createdAt": "2026-02-01T10:00:00.000Z"
  }
]
```

#### POST `/api/admin/users`
**Description**: Create a new team member  
**Access**: Owner  
**Request Body**:
```json
{
  "name": "Reception Desk",
  "email": "reception@theexperts.in",
  "password": "TempPass123!",
  "role": "receptionist"
}
```
**Validation**:
- `name`: Required string
- `email`: Required, valid email, unique
- `password`: Required, min 8 characters
- `role`: Required, one of: `receptionist`, `manager`

**Response** (201):
```json
{
  "_id": "507f1f77bcf86cd799439019",
  "name": "Reception Desk",
  "email": "reception@theexperts.in",
  "role": "receptionist",
  "isActive": true,
  "createdBy": "507f1f77bcf86cd799439011",
  "createdAt": "2026-02-24T17:00:00.000Z"
}
```

**Errors**:
- `409`: Email already exists

#### PATCH `/api/admin/users/:id`
**Description**: Update a team member  
**Access**: Owner  
**Request Body** (all optional):
```json
{
  "name": "Senior Manager",
  "email": "manager@theexperts.in",
  "role": "manager",
  "password": "NewPass123!",
  "isActive": true
}
```
**Validation**:
- Cannot change your own role
- Password must be >= 8 chars if provided

**Response** (200): Updated user object (without password)

#### DELETE `/api/admin/users/:id`
**Description**: Soft-delete (deactivate) a team member  
**Access**: Owner  
**Response** (200):
```json
{
  "ok": true,
  "message": "User deactivated successfully"
}
```
**Errors**:
- `400`: Cannot deactivate your own account

#### DELETE `/api/admin/users/:id/permanent`
**Description**: Hard-delete (remove from DB) a team member  
**Access**: Owner  
**Response** (200):
```json
{
  "ok": true,
  "message": "User permanently deleted"
}
```
**Errors**:
- `400`: Cannot delete your own account or owner account

---

### Analytics

#### GET `/api/analytics/overview`
**Description**: Get summary statistics  
**Access**: Manager + Owner  
**Response** (200):
```json
{
  "totalRevenue": 125000,
  "totalVisits": 450,
  "averageTicket": 278,
  "activeArtists": 5,
  "activeServices": 15
}
```

#### GET `/api/analytics/revenue-by-date`
**Description**: Get revenue grouped by date  
**Access**: Manager + Owner  
**Query Params**:
- `startDate` (optional): ISO date string (default: 30 days ago)
- `endDate` (optional): ISO date string (default: today)

**Response** (200):
```json
[
  { "_id": "2026-02-24", "totalRevenue": 4500, "visitCount": 12 },
  { "_id": "2026-02-23", "totalRevenue": 3200, "visitCount": 8 }
]
```

#### GET `/api/analytics/top-services`
**Description**: Get most popular services  
**Access**: Manager + Owner  
**Query Params**:
- `limit` (optional): Max results (default: 10)

**Response** (200):
```json
[
  {
    "service": "Premium Haircut",
    "count": 85,
    "totalRevenue": 42500
  }
]
```

#### GET `/api/analytics/artist-performance`
**Description**: Get artist-wise performance  
**Access**: Manager + Owner  
**Response** (200):
```json
[
  {
    "artist": "Amit Sharma",
    "visitCount": 120,
    "totalRevenue": 58000
  }
]
```

#### GET `/api/analytics/payment-modes`
**Description**: Get payment mode distribution  
**Access**: Manager + Owner  
**Response** (200):
```json
[
  { "paymentMode": "cash", "count": 200, "totalRevenue": 75000 },
  { "paymentMode": "upi", "count": 180, "totalRevenue": 45000 },
  { "paymentMode": "card", "count": 70, "totalRevenue": 5000 }
]
```

---

### Razorpay Integration

#### POST `/api/razorpay/create-order`
**Description**: Create Razorpay order and generate QR code  
**Access**: Authenticated  
**Request Body**:
```json
{
  "amount": 2500,
  "customerName": "Priya Desai",
  "customerPhone": "9123456789"
}
```
**Response** (200):
```json
{
  "orderId": "order_NbcxYZAbcdef12",
  "amount": 2500,
  "currency": "INR",
  "qrCodeData": "upi://pay?pa=merchant@upi&pn=TheSExperts&am=2500&cu=INR&tn=Payment..."
}
```

#### POST `/api/razorpay/verify-payment`
**Description**: Verify payment signature and update order status  
**Access**: Authenticated  
**Request Body**:
```json
{
  "razorpay_order_id": "order_NbcxYZAbcdef12",
  "razorpay_payment_id": "pay_NbcxYZAbcdef34",
  "razorpay_signature": "abc123def456..."
}
```
**Response** (200):
```json
{
  "success": true,
  "orderId": "order_NbcxYZAbcdef12",
  "paymentId": "pay_NbcxYZAbcdef34"
}
```

---

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,              // Full name
  email: String,             // Unique, lowercase
  passwordHash: String,      // bcrypt hashed
  role: String,              // Enum: "owner", "manager", "receptionist"
  isActive: Boolean,         // Default: true
  createdBy: ObjectId,       // Reference to creator (null for owner)
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes**: `email` (unique)

### Visits Collection
```javascript
{
  _id: ObjectId,
  customerName: String,      // 2-100 chars
  phone: String,             // 10-digit Indian mobile
  date: Date,                // Visit date
  services: [
    {
      service: String,       // Service name
      price: Number,         // Service price at time of visit
      artist: String         // Artist name
    }
  ],
  total: Number,             // Total bill amount
  paymentMode: String,       // Enum: "cash", "upi", "card"
  createdBy: ObjectId,       // Reference to user who created
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes**: `date` (descending), `phone`, `createdAt`

### Artists Collection
```javascript
{
  _id: ObjectId,
  name: String,              // Artist full name
  phone: String,             // Unique, 10-digit
  isActive: Boolean,         // Default: true
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes**: `phone` (unique), `name`

### Services Collection
```javascript
{
  _id: ObjectId,
  name: String,              // Unique service name
  price: Number,             // Current price (>= 0)
  category: String,          // Optional grouping
  isActive: Boolean,         // Default: true
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes**: `name` (unique, case-insensitive), `category`

### Sessions Collection
```javascript
{
  _id: String,               // Session ID
  expires: Date,             // Expiration timestamp
  session: String            // Serialized session data
}
```
**Indexes**: `expires` (TTL index for auto-cleanup)

---

## 🔒 Security

### Authentication & Authorization
1. **Session-Based Auth**: 
   - HTTP-only cookies prevent XSS attacks
   - 8-hour session expiration
   - MongoDB-backed persistent sessions
   - Secure cookie transmission in production

2. **Password Security**:
   - bcrypt hashing with 12 salt rounds
   - Minimum 8-character password requirement
   - No plaintext password storage

3. **Role-Based Access Control**:
   ```
   Owner:         Full access to all features
   Manager:       Read/Write visits, artists, analytics (no team mgmt)
   Receptionist:  Create visits only
   ```

### Input Validation
- **express-validator**: All endpoints validate input
- **MongoDB ObjectId validation**: Prevent invalid ID injection
- **Phone number regex**: `^[6-9]\d{9}$` (Indian mobile)
- **Email validation**: RFC 5322 compliant
- **Sanitization**: Trim whitespace, normalize email case

### Infrastructure Security
- **Helmet.js**: Sets security headers
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - X-XSS-Protection: 1; mode=block
  
- **CORS**: Configured allowed origins
- **Rate Limiting**: 200 requests/15 min per IP
- **Environment Variables**: Sensitive data not in code

### Data Protection
- **Soft Deletes**: Initial delete deactivates, not removes
- **Hard Deletes**: Owner-only with confirmation
- **Audit Trail**: `createdBy` tracking on all records

---

## 🚀 Deployment

### Vercel Deployment (Recommended)

#### Backend Deployment

1. **Create Vercel Project**
   ```bash
   cd backend
   vercel
   ```

2. **Configure Environment Variables** (Vercel Dashboard):
   ```
   MONGODB_URI=mongodb+srv://...
   SESSION_SECRET=production-secret-min-32-chars
   NODE_ENV=production
   OWNER_NAME=Salon Owner
   OWNER_EMAIL=owner@theexperts.in
   OWNER_PASSWORD=SecureProductionPassword
   RAZORPAY_KEY_ID=rzp_live_xxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxx
   FRONTEND_URL=https://your-frontend.vercel.app
   VERCEL_PROJECT_NAME=hair-salon
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Note Backend URL**: `https://hair-salon-backend-two.vercel.app`

#### Frontend Deployment

1. **Update API URL** in `.env.production`:
   ```env
   VITE_BACKEND_URL=
   VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
   ```
   (Empty string uses same-origin proxy via vercel.json)

2. **Deploy**
   ```bash
   cd frontend/form_razorpay
   vercel --prod
   ```

3. **Update Backend CORS**: Add frontend URL to `FRONTEND_URL` env var

#### MongoDB Atlas Setup

1. **Whitelist IPs**: Add `0.0.0.0/0` in Network Access
2. **Database User**: Create user with read/write permissions
3. **Connection String**: Use in `MONGODB_URI` env var

---

## 🌍 Environment Variables

### Backend (.env)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | No | Server port | `4000` |
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb+srv://...` |
| `SESSION_SECRET` | Yes | Session encryption key (min 32 chars) | `super-secret-key-change-in-prod` |
| `NODE_ENV` | No | Environment mode | `development` / `production` |
| `OWNER_NAME` | Yes | Auto-created owner account name | `Salon Owner` |
| `OWNER_EMAIL` | Yes | Owner login email | `owner@theexperts.in` |
| `OWNER_PASSWORD` | Yes | Owner login password | `SecurePass123!` |
| `RAZORPAY_KEY_ID` | No | Razorpay API key | `rzp_test_xxxxx` |
| `RAZORPAY_KEY_SECRET` | No | Razorpay API secret | `xxxxxxxx` |
| `FRONTEND_URL` | No | Frontend origin for CORS | `http://localhost:5173` |
| `VERCEL_PROJECT_NAME` | No | Vercel project name for dynamic CORS | `hair-salon` |

### Frontend (.env)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_BACKEND_URL` | Yes (dev) | Backend API base URL | `http://localhost:4000` (dev), `""` (prod) |
| `VITE_RAZORPAY_KEY_ID` | No | Razorpay publishable key | `rzp_test_xxxxx` |

---

## 📁 Project Structure

```
hair-salon/
├── backend/
│   ├── index.js                 # Express app & server
│   ├── db.js                    # MongoDB connection singleton
│   ├── package.json
│   ├── vercel.json              # Vercel serverless config
│   ├── .env.example             # Environment template
│   ├── middleware/
│   │   ├── authMiddleware.js    # authenticate & authorize
│   │   └── validateId.js        # MongoDB ObjectId validator
│   ├── models/
│   │   ├── User.js              # User schema & model
│   │   ├── Visit.js             # Visit schema & model
│   │   ├── Artist.js            # Artist schema & model
│   │   └── Service.js           # Service schema & model
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── admin.js             # Team management (owner only)
│   │   ├── visits.js            # Visit CRUD + export
│   │   ├── artists.js           # Artist CRUD
│   │   ├── services.js          # Service CRUD
│   │   ├── analytics.js         # Reporting & analytics
│   │   └── razorpay.js          # Payment integration
│   └── scripts/
│       └── seedArtists.js       # Populate sample artists
│
├── frontend/form_razorpay/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts           # Vite build config
│   ├── tsconfig.json            # TypeScript config
│   ├── tailwind.config.js       # TailwindCSS config
│   ├── vercel.json              # SPA routing + API proxy
│   ├── public/
│   │   └── logo.png             # App logo
│   ├── src/
│   │   ├── main.tsx             # React entry point
│   │   ├── App.tsx              # Root router setup
│   │   ├── index.css            # Global styles
│   │   ├── context/
│   │   │   └── AuthContext.tsx  # Global auth state
│   │   ├── services/
│   │   │   └── api.ts           # API client wrapper
│   │   ├── layouts/
│   │   │   ├── AppLayout.tsx    # Public + visit entry layout
│   │   │   └── DashboardLayout.tsx  # Protected dashboard shell
│   │   ├── pages/
│   │   │   ├── Home.tsx         # Landing page
│   │   │   ├── About.tsx        # About us page
│   │   │   ├── Contact.tsx      # Contact page
│   │   │   ├── VisitEntry.tsx   # Visit form page
│   │   │   ├── SignIn.tsx       # Login page
│   │   │   ├── PaymentStatus.tsx # Payment result page
│   │   │   ├── Analytics.tsx    # Analytics dashboard
│   │   │   └── dashboard/
│   │   │       ├── OwnerDashboard.tsx       # Owner main view
│   │   │       ├── ManagerDashboard.tsx     # Manager main view
│   │   │       ├── ReceptionistDashboard.tsx # Receptionist main view
│   │   │       ├── ArtistManagement.tsx     # Artist CRUD UI
│   │   │       ├── ServiceManagement.tsx    # Service CRUD UI
│   │   │       ├── TeamManagement.tsx       # User CRUD UI
│   │   │       └── shared/
│   │   │           ├── DashboardOverview.tsx   # Summary widgets
│   │   │           ├── DashboardAnalyticsView.tsx # Charts & graphs
│   │   │           └── ServicesView.tsx        # Read-only service list
│   │   ├── components/ui/
│   │   │   ├── background-beams.tsx     # Animated background
│   │   │   ├── input.tsx                # Styled input component
│   │   │   ├── label.tsx                # Form label component
│   │   │   └── sparkles.tsx             # Sparkle animation
│   │   └── lib/
│   │       └── utils.ts                 # Utility functions
│   └── README.md
│
└── README.md (this file)
```

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication**
- [ ] Owner can login with credentials from `.env`
- [ ] Invalid credentials show error
- [ ] Session persists across page refresh
- [ ] Logout clears session
- [ ] Unauthorized routes redirect to login

**Visit Entry**
- [ ] Form validates all required fields
- [ ] Phone number accepts only 10-digit numbers starting with 6-9
- [ ] Can add multiple services
- [ ] Artist dropdown shows active artists only
- [ ] Service dropdown shows active services with prices
- [ ] Total calculates correctly
- [ ] Success message after submission
- [ ] Visit appears in dashboard immediately

**Service Management (Owner)**
- [ ] Can create new service with name, price, category
- [ ] Duplicate name shows error
- [ ] Can edit service details
- [ ] Can deactivate service (soft delete)
- [ ] Can reactivate service
- [ ] Can permanently delete service (with confirmation)
- [ ] Inactive services don't appear in visit entry form

**Artist Management (Manager/Owner)**
- [ ] Can create new artist with name and phone
- [ ] Duplicate phone shows error
- [ ] Can edit artist details
- [ ] Can deactivate/reactivate artist
- [ ] Can permanently delete artist (owner only)

**Team Management (Owner)**
- [ ] Can create receptionist/manager accounts
- [ ] Password must be >= 8 characters
- [ ] Duplicate email shows error
- [ ] Can edit team member details
- [ ] Can change password
- [ ] Cannot change own role
- [ ] Cannot delete own account
- [ ] Cannot delete owner account

**Analytics**
- [ ] Revenue chart shows correct data
- [ ] Date filters work properly
- [ ] Top services list accurate
- [ ] Artist performance metrics correct
- [ ] Excel export downloads complete data

**Payment Integration**
- [ ] Razorpay order creates successfully
- [ ] QR code displays correctly
- [ ] Payment verification works
- [ ] Success page shows payment details
- [ ] Failed payments show error message

---

## 🤝 Contributing

This is a portfolio project, but suggestions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer

**Your Name**
- GitHub: [@Kritgun1907](https://github.com/Kritgun1907)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- **Razorpay** for payment gateway integration
- **Vercel** for free hosting platform
- **MongoDB Atlas** for free database tier
- **TailwindCSS** for utility-first styling
- **Lucide React** for beautiful icons

---

## 📞 Support

For questions or issues, please open an issue on GitHub or contact the developer.

---

**Built with ❤️ for modern salon management**
