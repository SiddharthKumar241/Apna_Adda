# 🏡 Apna Adda — Your Place, Your People

A full-stack house rent/buy listing platform built with **Node.js**, **Express**, and **MongoDB**, empowering users, tenants, and admins to manage listings, documents, and accounts—designed with Indian-inspired warmth.

---

## 🚀 Features Summary

### 👤 User Authentication & Profile
- Register, login, logout with session support
- Profile updates & password change (optional)
- Secure session, input sanitization, password hashing

### 🏠 Tenant Registration
- Upload user photo (image)
- Form validations and Aadhaar storage

### 🏛 Admin Authentication
- Register & login with Aadhaar verification and ownership paper upload

### 📄 Property Listings & Categories
- Manage listing data via MongoDB & JSON files
- Pre-load categories: authority plots, freehold, industrial, apartments
- Add listing to category JSON

---

## 📦 Tech Stack

- **Node.js + Express** for server
- **MongoDB** with Mongoose
- **express-session** + **connect-mongo** for sessions
- **Multer** for file uploads
- **dotenv**, **cors**, **bcrypt**

---

## ⚙️ Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   Create a `.env` file:
   ```
   PORT=3000
   MONGO_URI=your_mongo_uri
   SESSION_SECRET=your_secret_key
   ```

3. **Run project**
   ```bash
   node server.js
   ```

---

## 🛣 Routes Overview

| Method | Route                        | Description                                                    |
|--------|------------------------------|----------------------------------------------------------------|
| POST   | `/register`                  | Register a normal user                                         |
| POST   | `/login`                     | User login                                                     |
| GET    | `/session-info`             | Get user session info                                          |
| GET    | `/logout`                   | Logout user                                                    |
| POST   | `/admin/register`           | Admin signup with Aadhaar and ownership paper upload           |
| POST   | `/admin/login-admin`        | Admin login                                                    |
| GET    | `/admin/logout-admin`       | Admin logout                                                   |
| GET    | `/admin/session-info-admin` | Get admin session info                                         |
| POST   | `/submit-details`           | Tenant registration with photo upload                          |
| GET    | `/api/listings`             | Fetch all listings (MongoDB)                                   |
| GET    | `/load-data`                | Load `data.json` to MongoDB if empty                           |
| POST   | `/add-listing`              | Add a listing to JSON category file                            |
| GET    | `/load-authority-plots`     | Load authority plots into DB                                   |
| GET    | `/load-freehold-property`   | Load freehold property listings into DB                        |
| GET    | `/load-industrial-plots`    | Load industrial plots into DB                                  |
| GET    | `/load-flats-apartments`    | Load flats/apartments into DB                                  |
| GET    | `/authority-plots`          | Fetch DB authority plots                                       |
| GET    | `/freehold-property`        | Fetch DB freehold listings                                     |
| GET    | `/industrial-plots`         | Fetch DB industrial plots                                      |
| GET    | `/flats-apartments`         | Fetch DB flats & apartments                                    |

---

## 🗄 Database Schemas (Mongoose Models)

### 1. User
```js
const UserSchema = new mongoose.Schema({
  Username: String,
  Email: String,
  Password: String,
}, { timestamps: true });
```

### 2. Tenant
```js
const TenantSchema = new mongoose.Schema({
  tenantName: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  numPeople: { type: Number, required: true },
  propertySelected: { type: String, required: true },
  listedAmount: { type: Number, required: true },
  readyToPay: { type: Number, required: true },
  leaseTime: { type: String, required: true },
  aadhaar: { type: String, required: true },
  photo: { type: String, required: true },
}, { timestamps: true });
```

### 3. Listing & Category Schema
```js
const ListingSchema = new mongoose.Schema({
  city: String,
  title: String,
  type: String,
  rent: Number,
  dateAdded: String,
  area: String,
  image: String,
});
```

### 4. Admin
```js
const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  aadhaar: { type: String, required: true, unique: true },
  ownershipPaperFileName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
```

---

## 🎨 UI / Frontend Structure

```
/public
  /css
    style.css          # Desi inspired styling
  /js
    main.js            # jQuery + AJAX logic
  /images              # Static assets
  Homepage.html
  login.html
  register.html
  admin.html
  sucess.html
```

---

🖼️ Screenshots Gallery
A glimpse into Apna Adda’s user experience — from login to listings!

![image](https://github.com/user-attachments/assets/c34fa41b-ae45-43b9-9f09-ffd56905eb50)

![image](https://github.com/user-attachments/assets/5c303b92-6d1d-4720-ac99-854304828539)

![image](https://github.com/user-attachments/assets/63c12c65-6173-475d-a412-4c6af496086c)

![image](https://github.com/user-attachments/assets/a2beae77-4bc7-4eee-b1e8-bfb29ff91cc6)

![image](https://github.com/user-attachments/assets/5c3378e1-6453-4e94-a1c1-a43d74c286d0)

![image](https://github.com/user-attachments/assets/94745f3e-3751-4f3e-a8bd-3a44f75bd710)

![image](https://github.com/user-attachments/assets/ad7edc76-7174-4155-b0c8-5c200cb79e7b)

![image](https://github.com/user-attachments/assets/8209eec6-99b6-41d0-9705-5150812d8d66)

## 🔐 Security & Uploads

- Passwords securely hashed with **bcrypt**
- Sessions managed by `express-session` + `connect-mongo`
- File uploads:
  - `/uploads/tenant/` → tenant photo
  - `/uploads/ownership_papers/` → admin Aadhaar ownership paper
- Inputs sanitized
- Auth middleware for protecting routes

---

## 🛠 Development Roadmap

| Phase | Features |
|-------|----------|
| **1 (MVP)** | User/admin/tenant auth with upload, property listing add/view |
| **2** | Edit/delete listings, filters & search, image upload to cloud |
| **3** | Messaging system, wishlist, map integration |
| **4** | Reviews, booking calendar, analytics, mobile app support |

---

## 🎁 Bonus Ideas

- Email verification
- Social login (Google, Facebook)
- PWA support
- SEO friendly listing URLs
- Dark mode toggle

---

## 👤 Author

**Siddharth Goutam Kumar**  
Connect via Email / GitHub / LinkedIn  

---
