# Aadivaa -- Marketplace for tribles 🌍

**Aadivaa Earth** is an e-commerce platform built to empower **tribal artists** by helping them sell their handmade products online. It delivers a complete shopping and selling experience, supporting both buyers and artists with modern tools.

🔗 **Live Site**: [https://www.aadivaa.shop](https://www.aadivaa.shop)

---

## 💡 Key Features

### 👥 Dual User Roles
- **Buyers** can:
  - Browse & purchase products
  - Add items to cart and wishlist
  - Track orders
  - Leave reviews for products
  - Download invoices
  - Manage their profiles

- **Artists** can:
  - Set up and manage their seller profile
  - Add and update product listings
  - Access a dashboard with orders, stats, and reviews
  - Verify and moderate buyer reviews

### 🔐 Authentication
- Email-based login and verification
- 🔗 **Google OAuth** support for one-click sign-in

### 📬 Notifications & Invoicing
- Automatic email notifications on successful order
- Invoice download for each order

### ⚙️ System Enhancements
- **Redis** integration for API caching and improved performance
- **Cloudinary** for optimized image uploads and delivery
- State management using **RTK Query**

---

## 🛠️ Tech Stack

### Frontend
- **Next.js** + **Tailwind CSS**
- **RTK Query**
- Deployed on **Vercel**

### Backend
- **Node.js**, **Express.js**
- **Prisma ORM** + **PostgreSQL** (via NeonDB)
- **Redis** (Upstash) for caching
- **BullMQ (coming soon)** for background jobs
- **Multer** + **Cloudinary** for media handling
- Deployed on **Render**

---

## 🔍 Upcoming Features
- ⛓️ my current approache is monolithic architecture and for better optimization convert it into microservices.
- 🛠️ BullMQ background workers for emails & task queues
- 🔔 Real-time notifications for artists
- 📊 Analytics for product performance

---

## 🤝 Mission

Aadivaa Earth supports **tribal empowerment through e-commerce**, providing artisans with a reliable digital marketplace to sell their handmade goods globally.

---

## 🧠 Author

Made with ❤️ by [Namra Vamja](https://github.com/Namra-vamja)

---

## 📢 License
