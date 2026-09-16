# 🚀 Profilo

> A modern portfolio management platform with public APIs to showcase your professional profile using just your username.

[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen)](https://www.mongodb.com/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Theme System](#theme-system)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## 🎯 Overview

**Profilo** is a portfolio management platform that helps professionals build and maintain a public online presence. It provides:

- **Portfolio Management**: Create, edit, order, publish, and remove portfolio content
- **Public APIs**: Share your portfolio with others using public endpoints (username-based access)
- **Account Isolation**: Each authenticated user can access and manage only their own resources
- **Professional Design**: Modern UI with light/dark mode support
- **Secure Authentication**: Email/password and Google OAuth integration

Whether you're a developer, designer, or any professional, Profilo makes it easy to showcase your work and manage your online presence.

---

## ✨ Features

### 🔐 Authentication
- **Email/Password Authentication**: Traditional sign-up and login
- **Google OAuth**: Seamless Google account integration
- **JWT Sessions**: Short-lived access tokens and rotating refresh tokens stored in cookies
- **Multi-Device Support**: Track up to five device sessions, with remembered-session limits
- **Session Management**: Review browser, operating system, device, and sign-in preference details; remove individual sessions
- **Protected Routing**: Separate public authentication routes and authenticated dashboard routes
- **Password Reset**: Secure OTP-based password recovery via email
- **Password Updates**: Change passwords for existing accounts or initialize a password for OAuth users
- **Account Deletion**: Delete the account and associated Cloudinary media

### 📇 Portfolio Management
Users can manage comprehensive portfolio sections:
- **Profile**: Name, headline, about, location, contact information
- **Social Platforms**: Links to GitHub, LinkedIn, Twitter, LeetCode, Instagram, and other platforms
- **Skills**: Organize skills by categories and proficiency level
- **Projects**: Showcase completed projects with descriptions, links, related organizations, technology stacks, featured status, and multiple images
- **Experiences**: Document organizations, employment types, locations, technology stacks, highlights, multiple positions, and current roles
- **Education**: List educational background
- **Certificates**: Display professional certifications
- **Achievements**: Highlight awards and recognitions
- **Visibility Controls**: Mark supported portfolio content as public or private
- **Ordering and Filtering**: Set display order, featured status where supported, and use paginated dashboard tables
- **Media**: Upload and replace profile pictures, resumes/CVs, organization images, institute images, certificate images, project galleries, and achievement galleries through Cloudinary
- **Image Management**: Select cover images and remove individual gallery images

### 🧭 Dashboard Experience
- **Responsive Dashboard**: Mobile-friendly sidebar, header, tables, forms, pagination, and upload controls
- **Light and Dark Themes**: Theme-aware pages, inputs, tables, modals, and upload controls
- **Reusable Form Controls**: Selects, multi-selects, radio buttons, checkboxes, date pickers, validation messages, skeleton loading states, and confirmation modals
- **Partial Updates**: Edit forms submit only changed fields where supported
- **Notifications**: Success and error feedback for authentication, CRUD, uploads, and account actions

### 🌐 Public API
Anyone can fetch public portfolio data using just the username:
- Completely open and accessible (no authentication required)
- Perfect for portfolio websites, portfolios, or third-party integrations
- Read-only access to public portfolio data
- Includes a profile summary endpoint with content counts
- Supports pagination for projects, experiences, education, certificates, and achievements
- Supports featured filtering for projects, certificates, and achievements where implemented
- Returns only public content for portfolio collections; profile summary includes education counts

### 🩺 Health Check
- `GET /api/health` returns an `OK` response for service availability checks.

### 🎨 Theme System
- **Light Mode**: Clean, professional light theme
- **Dark Mode**: Eye-friendly dark theme with warm neutrals
- **Theme Persistence**: Preference saved to localStorage
- **System Preference**: Respects OS-level theme preference on first load
- **Consistent Design**: Unified color tokens across all components

### 📱 Responsive Design
- Mobile-first approach
- Works seamlessly on all screen sizes
- Touch-friendly interface

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.2 with Vite (rolldown-vite)
- **Routing**: React Router DOM v7
- **Styling**: TailwindCSS v4.2 with custom theme system
- **UI Components**: Ant Design v6
- **Forms**: React Hook Form v7
- **HTTP Client**: Axios v1.13 with interceptors
- **Authentication**: Google OAuth (@react-oauth/google)
- **Icons**: Lucide React
- **Utilities**: DayJS, UUID, Downshift (autocomplete), Floating UI
- **Build Tool**: Vite with SWC (Fast Refresh)

### Backend
- **Framework**: Express.js v5.2
- **Database**: MongoDB with Mongoose v9
- **Authentication**: JWT + Google Auth Library
- **Password Security**: Bcrypt v6
- **File Uploads**: Multer v2 + Cloudinary
- **Email Service**: Nodemailer v8 + Resend v6
- **Middleware**: CORS, Cookie Parser
- **Environment**: Node.js with ES Modules

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local or Atlas cloud)
- **Cloudinary Account** (for file uploads)
- **Google OAuth Credentials** (for Google Sign-In)
- **Email Service** (for password reset notifications)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/AryanKadam1134/portfolio-saas.git
cd portfolio-saas
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

## ⚙️ Configuration

### Backend Setup

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio-saas

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret_key_here
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key_here
REFRESH_TOKEN_EXPIRY=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Cloudinary (File Uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET_KEY=your_cloudinary_api_secret
CLOUDINARY_URL=your_cloudinary_url

# Email Service
SHOOTER_EMAIL=your_email@gmail.com
SHOOTER_PASS=your_email_password_or_app_password
RESEND_API_KEY=your_resend_api_key_here
```

### Frontend Setup

Create a `.env` file in the `client` directory:

```env
# API Configuration
VITE_BASE_URL=http://localhost:5000/api/admin

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

---

## 🎮 Usage

### Start the Backend Server

```bash
cd server
npm start
```

The server will run on `http://localhost:5000`

### Start the Frontend Development Server

```bash
cd client
npm run dev
```

The frontend will run on `http://localhost:5173`

### Build for Production

**Backend**: No build step needed (Node.js runs directly)

**Frontend**:
```bash
cd client
npm run build
npm run preview
```

---

## 📚 API Documentation

### Public API Endpoints (No Authentication Required)

All endpoints use the base URL: `http://localhost:5000/api/portfolio/:username`

#### Public API Integration Prompt (Copy/Paste)

If you want to integrate these public APIs in your own portfolio project using an AI assistant, copy **PUBLIC_API_GUIDE.md** into your project and use the following prompt:

```
You are integrating with Profilo's public portfolio API. Use the attached PUBLIC_API_GUIDE.md as the source of truth.

Goal:
- Build a data layer that fetches public portfolio data by username.
- Base URL: https://server-ze3s.onrender.com/api/portfolio/:username

Implement:
- Fetchers for details, social platforms, skills, categories, projects, experiences, educations, certificates, achievements.
- Pagination for projects, experiences, educations, certificates, and achievements (page & limit).
- Featured filter for projects/certificates/achievements where supported.

Requirements:
- Follow the JSON structures exactly as documented.
- Provide types/interfaces for the response shapes.
- Show example usage in a React component (or the framework used in this project).
```

#### Service Health
```
GET /api/health
```
Returns an `OK` response when the API is available.

#### Get Profile Summary
```
GET /api/portfolio/:username/summary
```
Returns counts for the user's public portfolio sections.

#### Get User Details
```
GET /api/portfolio/:username/details
```
Returns basic user information (name, headline, about, location, etc.)

#### Get Social Platforms
```
GET /api/portfolio/:username/social-platforms
```
Returns all linked social platforms

#### Get Skills
```
GET /api/portfolio/:username/skills
```
Returns skills with category information

#### Get Skills by Category
```
GET /api/portfolio/:username/categories
```
Returns skills organized by categories

#### Get Projects
```
GET /api/portfolio/:username/projects
```
Returns paginated public projects. Optional query parameters include `page`, `limit`, and `featured=true|false|all`.

#### Get Experiences
```
GET /api/portfolio/:username/experiences
```
Returns paginated public experiences. Optional query parameters include `page` and `limit`.

#### Get Education
```
GET /api/portfolio/:username/educations
```
Returns paginated public education records. Optional query parameters include `page` and `limit`.

#### Get Certificates
```
GET /api/portfolio/:username/certificates
```
Returns paginated public certificates. Optional query parameters include `page`, `limit`, and `featured=true|false|all`.

#### Get Achievements
```
GET /api/portfolio/:username/achievements
```
Returns paginated public achievements. Optional query parameters include `page`, `limit`, and `featured=true|false|all`.

### Admin API Endpoints (Authentication Required)

Admin endpoints require a valid JWT. The server accepts the access token from the `accessToken` cookie or a `Bearer` token in the `Authorization` header. Requests that create or restore sessions also use the `x-device-id` header.

#### Authentication Routes
```
POST   /api/admin/auth/register
POST   /api/admin/auth/login
POST   /api/admin/auth/google
POST   /api/admin/auth/logout
POST   /api/admin/auth/remove-session
POST   /api/admin/auth/restoreSession
PATCH  /api/admin/auth/password
POST   /api/admin/auth/forgot-password
POST   /api/admin/auth/verify-otp
PATCH  /api/admin/auth/reset-password
```

#### User Management
```
GET    /api/admin/users/
PATCH  /api/admin/users/
DELETE /api/admin/users/
GET    /api/admin/users/check-password
GET    /api/admin/users/user-sessions
PATCH  /api/admin/users/image
DELETE /api/admin/users/image
PATCH  /api/admin/users/resume
DELETE /api/admin/users/resume
```

#### Filter and Lookup Data
```
GET /api/admin/filters/social-platforms
GET /api/admin/filters/skill-categories
GET /api/admin/filters/organizations
GET /api/admin/filters/project-categories
GET /api/admin/filters/skills
GET /api/admin/filters/certificates
GET /api/admin/filters/skill-levels
GET /api/admin/filters/genders
GET /api/admin/filters/employment-types
GET /api/admin/filters/location-types
GET /api/admin/filters/visibility
```
Several lookup endpoints are public within the admin API; resource-dependent lookups require authentication.

#### Resource Management (CRUD Operations)
```
/api/admin/socialPlatforms
/api/admin/skillCategories
/api/admin/skills
/api/admin/projects
/api/admin/experiences
/api/admin/educations
/api/admin/certificates
/api/admin/achievements
```

Each resource supports: `GET`, `POST`, `PATCH`, `DELETE`

List endpoints support pagination through `page` and `limit` query parameters. Project, experience, education, certificate, and achievement resources also expose dedicated media endpoints where applicable.

---

## 📂 Project Structure

```
portfolio-saas/
├── client/                          # Frontend application
│   ├── src/
│   │   ├── pages/                  # Route pages
│   │   │   ├── authentication/     # Auth pages
│   │   │   └── private/            # Protected pages
│   │   │       ├── Dashboard.jsx
│   │   │       ├── UserSessions.jsx
│   │   │       ├── ChangePassword.jsx
│   │   │       ├── Settings.jsx
│   │   │       ├── social-platforms/
│   │   │       ├── skill-categories/
│   │   │       ├── skills/
│   │   │       ├── projects/
│   │   │       ├── experiences/
│   │   │       ├── educations/
│   │   │       ├── certificates/
│   │   │       └── achievements/
│   │   ├── components/             # Reusable components
│   │   ├── context/                # React contexts
│   │   │   ├── auth/
│   │   │   ├── theme/
│   │   │   ├── modal/
│   │   │   └── notification/
│   │   ├── layouts/                # Layout components
│   │   ├── hooks/                  # Custom hooks
│   │   ├── utils/                  # Utility functions
│   │   ├── services/               # API endpoint clients
│   │   ├── api.js                  # Axios client setup
│   │   ├── App.jsx                 # Main router
│   │   └── main.jsx                # Entry point
│   ├── public/                     # Static assets
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── eslint.config.js
│
├── server/                          # Backend application
│   ├── src/
│   │   ├── routes/
│   │   │   ├── public/             # Public routes
│   │   │   │   └── portfolio.routes.js
│   │   │   └── private/            # Admin routes
│   │   │       ├── auth.routes.js
│   │   │       ├── user.routes.js
│   │   │       ├── socialPlatform.routes.js
│   │   │       ├── skill.routes.js
│   │   │       ├── skillCategory.routes.js
│   │   │       ├── project.routes.js
│   │   │       ├── experience.routes.js
│   │   │       ├── education.routes.js
│   │   │       ├── certificate.routes.js
│   │   │       ├── achievement.routes.js
│   │   │       └── filter.routes.js
│   │   ├── controllers/            # Business logic
│   │   │   ├── public/
│   │   │   └── private/
│   │   ├── models/                 # MongoDB schemas
│   │   │   ├── user.model.js
│   │   │   ├── socialPlatform.model.js
│   │   │   ├── skill.model.js
│   │   │   ├── skillCategory.model.js
│   │   │   ├── project.model.js
│   │   │   ├── experience.model.js
│   │   │   ├── education.model.js
│   │   │   ├── certificate.model.js
│   │   │   └── achievement.model.js
│   │   ├── middlewares/            # Express middlewares
│   │   │   ├── auth.middleware.js
│   │   │   ├── user.middleware.js
│   │   │   └── multer.middleware.js
│   │   ├── db/                     # Database connection
│   │   ├── app.js                  # Express app setup
│   │   └── index.js                # Server entry point
│   ├── package.json
│   └── .env.example
│
├── THEME_SYSTEM.md                 # Theme documentation
├── UI_ENHANCEMENTS.md              # UI improvements documentation
├── README.md                        # This file
└── .gitignore
```

---

## 🎨 Theme System

The project includes a comprehensive theme system with professional light and dark modes.

### Color Palette

**Light Mode**:
- Primary Background: `#ffffff`
- Secondary Background: `#f8f9fa`
- Text Primary: `#1a1a1a`

**Dark Mode**:
- Primary Background: `#0f0f0f`
- Secondary Background: `#1a1a1a`
- Text Primary: `#f5f5f5`

### Using Theme Colors

```jsx
// Text color
<p className="text-light-text-primary dark:text-dark-text-primary">
  Content
</p>

// Background
<div className="bg-light-bg-primary dark:bg-dark-bg-primary">
  Content
</div>

// Borders
<div className="border border-light-border-primary dark:border-dark-border-primary">
  Content
</div>
```

### Theme Management

The theme is managed by `ThemeProvider` and `useTheme`:
- Persists to localStorage
- Respects system preference on first load
- Toggle available in the header

For more details, see [THEME_SYSTEM.md](./THEME_SYSTEM.md)

---

## 🔐 Security Features

- ✅ JWT-based authentication with short-lived access tokens
- ✅ Refresh token rotation with httpOnly cookies
- ✅ Bcrypt password hashing
- ✅ CORS protection
- ✅ Request validation and ownership checks for private resources
- ✅ Multi-device session management
- ✅ OTP-based password reset
- ✅ Secure file uploads via Cloudinary
- ✅ Public/private visibility controls for portfolio resources

---

## 📋 Environment Variables Reference

### Server (`.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `MONGODB_URL` | MongoDB connection string | See Prerequisites |
| `ACCESS_TOKEN_SECRET` | JWT access token secret | Random string |
| `ACCESS_TOKEN_EXPIRY` | Access token expiry | `15m` |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret | Random string |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiry | `7d` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | From Google Cloud |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | From Google Cloud |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | From Cloudinary |
| `CLOUDINARY_API_KEY` | Cloudinary API key | From Cloudinary |
| `CLOUDINARY_API_SECRET_KEY` | Cloudinary API secret | From Cloudinary |
| `CLOUDINARY_URL` | Optional Cloudinary connection URL | From Cloudinary |
| `SHOOTER_EMAIL` | Sender email address | Your email provider |
| `SHOOTER_PASS` | Sender email password or app password | Your email provider |
| `RESEND_API_KEY` | Resend email API key | From Resend |

### Client (`.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_BASE_URL` | Admin API base URL | `http://localhost:5000/api/admin` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | From Google Cloud |

---

## 🧪 Testing

### Backend
```bash
cd server
npm test
```
The current backend `test` script starts the server; no automated test suite is configured yet.

### Frontend
```bash
cd client
npm run lint
npm run build
```

---

## 📦 Build & Deployment

### Frontend Build
```bash
cd client
npm run build
```
Output: `dist/` folder ready for deployment to Vercel, Netlify, or any static host

### Backend Deployment
Deploy to platforms like:
- Heroku
- Railway
- Render
- AWS
- DigitalOcean

### Example: Deploying to Vercel (Frontend)
```bash
npm install -g vercel
cd client
vercel
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Guidelines
- Use clear, descriptive commit messages
- Start with a verb (Add, Fix, Update, Remove, etc.)
- Reference issues when applicable

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Aryan Kadam**
- GitHub: [@AryanKadam1134](https://github.com/AryanKadam1134)
- Email: aryan@example.com

---

## 🤝 Support

If you have any questions or need help, feel free to:
- Open an [Issue](https://github.com/AryanKadam1134/portfolio-saas/issues)
- Contact the author directly
- Check existing documentation in [THEME_SYSTEM.md](./THEME_SYSTEM.md) and [UI_ENHANCEMENTS.md](./UI_ENHANCEMENTS.md)

---

## 🗺️ Roadmap

- [ ] Portfolio preview/demo page
- [ ] Portfolio export as PDF
- [ ] Analytics dashboard
- [ ] Portfolio templates
- [ ] Collaboration features
- [ ] Portfolio versioning
- [ ] Mobile app
- [ ] AI-powered portfolio suggestions

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI framework
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Ant Design](https://ant.design/) - UI Components
- [Cloudinary](https://cloudinary.com/) - File storage

---

<div align="center">

**Made with ❤️ by Aryan Kadam**

⭐ If you found this project helpful, please consider giving it a star!

</div>
