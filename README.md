# 🎓 MediQueue – Tutor Booking System (Server)

## 🌐 Live API

🔗 **[https://medi-queue-tutor-booking-system-ser.vercel.app](https://medi-queue-tutor-booking-system-ser.vercel.app)**

---

## 📖 About The Project

This is the **RESTful API backend** for MediQueue – a tutor booking platform. Built with Node.js, Express.js, and MongoDB, it handles all authentication, tutor management, and booking operations with JWT-secured protected routes.

---

## ✨ Key Features

- 🔐 **JWT Authentication** – Stateless token-based auth for all protected routes
- 🧑‍🏫 **Tutor Management** – Full CRUD for tutor listings (Create, Read, Update, Delete)
- 📅 **Booking System** – Create and cancel bookings with automatic slot management
- 🔒 **Protected Routes** – Middleware to verify JWT on every sensitive endpoint
- 🌐 **CORS Configured** – Secure cross-origin request handling for frontend domains
- 🍃 **MongoDB + Mongoose** – Schema-based data modeling with Atlas cloud database

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| **Node.js** | Runtime Environment |
| **Express.js** | Web Framework |
| **MongoDB Atlas** | Cloud Database |
| **Mongoose** | ODM / Schema Modeling |
| **JSON Web Token (JWT)** | Authentication |
| **bcryptjs** | Password Hashing |
| **CORS** | Cross-Origin Security |
| **dotenv** | Environment Variables |
| **cookie-parser** | Cookie Handling |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/jwt` | Generate JWT token |
| `POST` | `/api/logout` | Clear auth token |

### Tutors
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/tutors` | Public | Get all tutors (with filters) |
| `GET` | `/api/tutors/featured` | Public | Get 6 featured tutors |
| `GET` | `/api/tutors/:id` | Public | Get single tutor by ID |
| `GET` | `/api/my-tutors` | 🔒 Private | Get logged-in user's tutors |
| `POST` | `/api/tutors` | 🔒 Private | Create a new tutor |
| `PUT` | `/api/tutors/:id` | 🔒 Private | Update a tutor |
| `DELETE` | `/api/tutors/:id` | 🔒 Private | Delete a tutor |

### Bookings
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/my-bookings` | 🔒 Private | Get user's bookings |
| `POST` | `/api/bookings` | 🔒 Private | Create a new booking |
| `PATCH` | `/api/bookings/:id/cancel` | 🔒 Private | Cancel a booking |

---

## 🔗 Related Repository

- 💻 **Frontend (Client):** [MediQueue Client](https://github.com/SHUVASHIS01/-MediQueue-Tutor-Booking-System_client)
- 🌐 **Live Frontend:** [https://medi-queue-tutor-booking-system-cli.vercel.app](https://medi-queue-tutor-booking-system-cli.vercel.app)

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SHUVASHIS01/-MediQueue-Tutor-Booking-System_server.git
   cd -MediQueue-Tutor-Booking-System_server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. The API will be running at [http://localhost:5000](http://localhost:5000)

---

## 📁 Project Structure

```
server/
├── index.js          # Main Express app, routes & DB models
├── seed.js           # Database seeding script
├── vercel.json       # Vercel serverless deployment config
├── .env              # Environment variables (not committed)
└── package.json
```

---

## 🚀 Deployment

This project is deployed on **Vercel** as a serverless Node.js function. Automatic deployments trigger on every push to the `main` branch.

---

## 👨‍💻 Author

**Shuvashis Basak**
- GitHub: [@SHUVASHIS01](https://github.com/SHUVASHIS01)
