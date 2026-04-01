# Online Book Library - MERN Stack Application

A comprehensive, production-ready online book library built with the MERN stack (MongoDB, Express, React, Node.js). Features user authentication, book catalog management, reading list functionality, borrowing system, and an admin dashboard for library management.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Directory Layout](#directory-layout)
- [Installation Guide](#installation-guide)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Git Workflow](#git-workflow)
- [Development Guide](#development-guide)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

Online Book Library is a full-stack application designed for managing a comprehensive digital book library. The platform enables users to:

- Register and authenticate securely with JWT tokens
- Browse and search books by category, author, and genre
- Create reading lists and manage book collections
- Borrow books and track borrowing history
- Access user profiles and reading preferences
- Receive personalized book recommendations

Administrators can:

- Add, edit, and delete books from the library catalog
- Manage library inventory and availability
- Monitor user borrowing patterns
- Manage book categories and metadata
- View system analytics and usage statistics

## Features

### 🔐 Authentication & Authorization

- Secure user registration and login with password hashing
- JWT-based authentication with token refresh mechanism
- Role-based access control (User vs Admin/Librarian)
- Protected routes and API endpoints
- localStorage-based session persistence

### 📚 Book Catalog & Discovery

- Browse comprehensive book catalog with pagination
- Advanced search and filtering by category, author, genre, publication year
- Detailed book pages with descriptions, reviews, and ratings
- Admin capabilities to manage library catalog
- Book cover images and metadata

### 📖 Reading Lists & Collections

- Create personal reading lists and wish lists
- Save favorite books for later
- Organize books into custom collections
- Bookmark reading progress
- Track reading status (To Read, Reading, Completed)

### 📕 Borrowing System

- Borrow books from the library catalog
- Track borrowing history and due dates
- Return book functionality with confirmation
- Availability status and waiting lists
- Borrowing recommendations based on reading history

### 💬 User Features

- User profile management and preferences
- Reading history and statistics
- User reviews and ratings for books
- Follow authors and receive updates
- Email notifications for reservations and recommendations

### 👨‍💼 Admin/Librarian Dashboard

- Book catalog management (Add, Edit, Delete)
- Inventory management and availability tracking
- User activity monitoring and statistics
- Borrowing analytics and reports
- Category and metadata management

### 🎨 User Experience

- Responsive design for mobile/tablet/desktop
- Intuitive navigation and user interface
- Fast page load times with optimization
- Accessible components (WCAG compliant)
- Dark mode support

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│         Frontend (React SPA - Library UI)               │
│  - Book Discovery & Search Interface                    │
│  - Reading Lists & Collections                          │
│  - State Management (Context API)                       │
│  - Client-side Routing (React Router v6)               │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
     ┌───────────────┴───────────────┐
     │                               │
     ▼                               ▼
┌──────────────────────┐    ┌──────────────────────┐
│  Authentication      │    │   API Gateway        │
│  JWT Validation      │    │   Request Handler    │
└──────────────────────┘    └──────────────────────┘
     │                               │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
    ┌──────────────────────────────────┐
    │ Backend (Node.js/Express)        │
    │ - Library Management APIs        │
    │ - Borrowing System Logic         │
    │ - Authentication & Authorization │
    └──────────────────────┬───────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
   ┌──────────────┐               ┌──────────────────┐
   │  MongoDB     │               │  File System     │
   │  Library DB  │               │  Book Covers &   │
   │              │               │  Assets          │
   └──────────────┘               └──────────────────┘
```

## Technology Stack

### Frontend

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React | 18.x |
| Routing | React Router | 6.x |
| HTTP Client | Axios | 1.x |
| State Management | Context API | Built-in |
| Styling | CSS Modules + Tailwind | Latest |
| Build Tool | Create React App | 5.x |
| Testing | Jest + React Testing Library | Latest |
| Code Quality | ESLint + Prettier | Latest |

### Backend

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | 14+ |
| Framework | Express.js | 4.x |
| Database | MongoDB | 5.x |
| Auth | JWT | - |
| Validation | Express Validator | Latest |
| Code Quality | ESLint + Prettier | Latest |
| Testing | Jest | Latest |

### DevOps & Tools

| Tool | Purpose |
|------|---------|
| Git | Version Control |
| Husky | Git Hooks Manager |
| lint-staged | Pre-commit Linting |
| npm | Package Manager |
| MongoDB Atlas | Cloud Database |

## Prerequisites

### System Requirements

- **Operating System**: Windows, macOS, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: At least 2GB free

### Required Software

- **Node.js**: v14.0.0 or higher ([Download](https://nodejs.org))
- **npm**: v6.0.0 or higher (comes with Node.js)
- **Git**: For version control ([Download](https://git-scm.com))
- **MongoDB**: v5.0 or higher (or MongoDB Atlas account)
- **Code Editor**: VS Code or similar

### Verify Installation

```bash
node --version      # Should be v14+
npm --version       # Should be v6+
git --version       # Should show git version
```

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-username/bookstore.git
cd BookStore
```

### 2. Backend Setup

```bash
cd Backend
npm install
cp .env.example .env
# Update .env with MongoDB URI and JWT secret
npm start
```

Backend runs at: `http://localhost:8000`

### 3. Frontend Setup

```bash
cd Frontend
npm install
cp .env.example .env
# Verify REACT_APP_API_URL=http://localhost:8000
npm start
```

Frontend runs at: `http://localhost:3000`

### 4. Verify Connection

- Open browser to `http://localhost:3000`
- You should see the Online Book Library landing page
- Backend should be responding to API requests
- Try browsing the book catalog or creating a new user account

## Project Structure

```
BookStore/
│
├── Backend/
│   ├── Connect/             # Database & Server Configuration
│   │   ├── connect.js       # MongoDB Atlas connection
│   │   ├── index.js         # Connection manager
│   │   └── server-config.js # Server configuration
│   │
│   ├── Controller/          # Business Logic
│   │   ├── index.js         # Controller exports
│   │   ├── login.js         # Login controller
│   │   └── sign-up.js       # Sign-up controller
│   │
│   ├── Middleware/          # Request Middleware
│   │   └── userauth.js      # JWT authentication middleware
│   │
│   ├── Models/              # Database Schemas
│   │   ├── User.js          # User schema (email, password, role)
│   │   ├── Book.js          # Book schema with library metadata
│   │   ├── Borrowing.js     # Borrowing transaction schema
│   │   ├── ReadingList.js   # User reading lists schema
│   │   └── Favorite.js      # Favorite books schema
│   │
│   ├── Routes/              # API Routes
│   │   ├── index.js         # Route aggregator
│   │   ├── login.js         # Auth routes
│   │   ├── Sign-up.js       # Registration routes
│   │   ├── book.js          # Book catalog routes
│   │   ├── borrow.js        # Book borrowing routes
│   │   ├── list.js          # Reading list routes
│   │   ├── user.js          # User profile routes
│   │   └── getUser.js       # User data retrieval
│   │
│   ├── .eslintrc            # Code quality rules
│   ├── .prettierrc           # Code formatting rules
│   ├── .lintstagedrc        # Pre-commit checks
│   ├── .gitignore           # Git ignore rules
│   ├── app.js               # Express app setup
│   ├── package.json        # Backend dependencies
│   ├── README.md            # Backend documentation
│   └── node_modules/        # Dependencies
│
├── Frontend/
│   ├── public/
│   │   └── index.html       # HTML template
│   │
│   ├── src/
│   │   ├── components/      # Reusable UI Components
│   │   │   ├── Header.js    # Navigation header
│   │   │   ├── Footer.js    # Footer component
│   │   │   └── BookCard.js  # Book card component
│   │   │
│   │   ├── context/         # React Context API
│   │   │   ├── AuthContext.js         # Auth state
│   │   │   ├── AuthContext.test.js    # Auth tests
│   │   │   ├── CartContext.js         # Cart state
│   │   │   └── CartContext.test.js    # Cart tests
│   │   │
│   │   ├── pages/           # Page Components
│   │   │   ├── Home.js      # Landing page
│   │   │   ├── Login.js     # Login page
│   │   │   ├── Signup.js    # Registration page
│   │   │   ├── Books.js     # Book catalog
│   │   │   ├── Cart.js      # Shopping cart
│   │   │   ├── Checkout.js  # Order checkout
│   │   │   ├── Orders.js    # Order history
│   │   │   ├── Profile.js   # User profile
│   │   │   └── Admin.js     # Admin dashboard
│   │   │
│   │   ├── services/        # API Integration
│   │   │   └── api.js       # Axios HTTP client
│   │   │
│   │   ├── App.js           # Main app component
│   │   ├── index.js         # React DOM entry point
│   │   ├── index.css        # Global styles
│   │   └── setupTests.js    # Jest configuration
│   │
│   ├── .eslintrc            # Code quality rules
│   ├── .prettierrc           # Code formatting rules
│   ├── .lintstagedrc        # Pre-commit checks
│   ├── .gitignore           # Git ignore rules
│   ├── package.json        # Frontend dependencies
│   ├── tailwind.config.js   # Tailwind CSS config
│   ├── postcss.config.js    # PostCSS config
│   ├── TEST_GUIDE.md        # Testing documentation
│   ├── README.md            # Frontend documentation
│   └── node_modules/        # Dependencies
│
├── .husky/                  # Git Hooks Configuration
│   ├── pre-commit           # ESLint + Prettier check
│   ├── pre-push             # Run tests before push
│   └── commit-msg           # Validate commit messages
│
├── .gitignore               # Root git ignore
├── HUSKY_SETUP.md           # Husky configuration guide
├── HOOKS_QUICK_START.md     # Git hooks quick reference
├── README.md                # This file
└── package.json             # Root package.json (optional)
```

## Directory Layout

- **Backend**: Node.js/Express server with MongoDB integration
- **Frontend**: React SPA with Context API state management
- **.husky**: Git hooks for code quality and testing
- **Documentation**: Setup guides, quick starts, and API docs

## Installation Guide

### Backend Installation

```bash
cd Backend
npm install
```

**Install Dependencies**:
- express: Web framework
- mongoose: MongoDB ODM
- jsonwebtoken: JWT authentication
- bcrypt: Password hashing
- dotenv: Environment variables
- cors: Cross-origin requests
- express-validator: Input validation

**Configure Environment**:

Create `.env` file:

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/bookstore
JWT_SECRET=your-secret-key-here
PORT=8000
NODE_ENV=development
```

### Frontend Installation

```bash
cd Frontend
npm install
```

**Install Dependencies**:
- react: UI library
- react-router-dom: Routing
- axios: HTTP client
- tailwindcss: CSS framework
- react-testing-library: Testing utilities

**Configure Environment**:

Create `.env` file:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
```

## Running the Application

### Development Mode

**Terminal 1 - Start Backend**:

```bash
cd Backend
npm start
```

Expected output:
```
✅ Library Server running on port 8000
✅ Connected to MongoDB
```

**Terminal 2 - Start Frontend**:

```bash
cd Frontend
npm start
```

Expected output:
```
Compiled successfully!
You can now view online book library in the browser.
http://localhost:3000
```

**Terminal 3 - Run Tests (Optional)**:

```bash
cd Frontend
npm test
```

### Production Build

```bash
# Build frontend
cd Frontend
npm run build

# Create optimized production build
npm run build

# Build size output
npm run build -- --verbose
```

## API Documentation

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/profile` | Update profile |

### Book Catalog Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books with pagination |
| GET | `/api/books/:id` | Get book details |
| GET | `/api/books/search` | Search books by title, author |
| GET | `/api/books/category/:category` | Get books by category |
| POST | `/api/books` | Add book (Admin/Librarian) |
| PUT | `/api/books/:id` | Update book (Admin/Librarian) |
| DELETE | `/api/books/:id` | Delete book (Admin/Librarian) |

### Borrowing Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/borrow` | Borrow a book |
| GET | `/api/borrow/history` | Get borrowing history |
| PUT | `/api/borrow/:id/return` | Return a book |
| GET | `/api/borrow/active` | Get currently borrowed books |

### Reading List Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lists` | Get user's reading lists |
| POST | `/api/lists` | Create new reading list |
| POST | `/api/lists/:id/books` | Add book to list |
| DELETE | `/api/lists/:id/books/:bookId` | Remove book from list |
| DELETE | `/api/lists/:id` | Delete reading list |

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id` | Get user profile |
| PUT | `/api/users/:id` | Update user profile |
| GET | `/api/users/:id/stats` | Get reading statistics |
| POST | `/api/users/:id/favorites` | Add to favorites |
| GET | `/api/users/:id/favorites` | Get favorite books |

For detailed API documentation, see individual frontend/backend README files.

## Database Schema

### User Schema

```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: String (user|admin|librarian),
  createdAt: Date,
  updatedAt: Date
}
```

### Book Schema

```javascript
{
  _id: ObjectId,
  title: String,
  author: String,
  category: String,
  genre: String,
  description: String,
  isbn: String (unique),
  coverImage: String,
  publicationYear: Number,
  pages: Number,
  language: String,
  rating: Number,
  totalCopies: Number,
  availableCopies: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Borrowing Schema

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  bookId: ObjectId,
  borrowDate: Date,
  dueDate: Date,
  returnDate: Date (null if not returned),
  status: String (active|returned|overdue),
  renewalCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Reading List Schema

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  description: String,
  books: [ObjectId],
  isPublic: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### User Favorite Schema

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  bookId: ObjectId,
  addedAt: Date
}
```

## Git Workflow

### Conventional Commits Format

All commits must follow the Conventional Commits standard:

```
type(scope): description

[optional body]
[optional footer]
```

#### Commit Types

- `feat`: New feature (e.g., `feat(auth): add two-factor authentication`)
- `fix`: Bug fix (e.g., `fix(cart): resolve total calculation error`)
- `docs`: Documentation (e.g., `docs(readme): add API endpoints`)
- `style`: Code formatting (e.g., `style: fix indentation`)
- `refactor`: Code refactoring (e.g., `refactor(api): simplify error handling`)
- `test`: Test additions (e.g., `test(checkout): add payment tests`)
- `chore`: Dependencies/config (e.g., `chore: update npm packages`)

#### Examples

```bash
# Feature
git commit -m "feat(borrow): add book borrowing system with due dates"

# Bug fix
git commit -m "fix(auth): resolve JWT expiration issue"

# Documentation
git commit -m "docs(api): add borrowing endpoints documentation"

# With detailed message
git commit -m "feat(notifications): implement email notifications for book availability

- Add email notification service
- Send alerts when reserved books become available
- Send reminders for upcoming due dates
- Add notification preferences to user profile"
```

### Git Workflow Steps

```bash
# 1. Make changes to your files
# ... edit files ...

# 2. Stage changes
git add .

# 3. Commit (Husky pre-commit hook runs linting)
git commit -m "feat(scope): description"

# 4. Push (Husky pre-push hook runs tests)
git push origin main

# 5. Create Pull Request on GitHub
```

### Husky Git Hooks

The project uses Husky to enforce code quality:

- **pre-commit**: Runs ESLint and Prettier on staged files
- **pre-push**: Runs tests before pushing to remote
- **commit-msg**: Validates commit message format

See [HOOKS_QUICK_START.md](./HOOKS_QUICK_START.md) for detailed setup.

## Development Guide

### Code Style

- **ESLint**: Enforces JavaScript best practices
- **Prettier**: Consistent code formatting (2-space indent, single quotes, 100 char width)
- **Tailwind CSS**: Utility-first CSS framework

### Running Quality Checks

#### Backend

```bash
cd Backend
npm run lint              # Check for issues
npm run lint:fix          # Auto-fix issues
npm run format            # Format code
npm test                  # Run tests
```

#### Frontend

```bash
cd Frontend
npm run lint              # Check for issues
npm run lint:fix          # Auto-fix issues
npm run format            # Format code
npm test                  # Run tests
npm run build             # Production build
```

### Testing

#### Frontend Tests

```bash
cd Frontend
npm test                  # Run all tests
npm test -- --watch      # Watch mode
npm test -- --coverage   # Coverage report
```

Tests are located in `src/__tests__/` and use Jest + React Testing Library.

#### Backend Tests

```bash
cd Backend
npm test                  # Run all tests
npm test -- --watch      # Watch mode
```

### Debugging

**Frontend**:
- Browser DevTools (F12)
- React Developer Tools extension
- Redux DevTools extension

**Backend**:
- Node.js debugger
- VS Code debugger
- Console logging

## Deployment

### Vercel (Frontend)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy with `vercel deploy`

### Heroku (Backend)

1. Create Heroku account
2. Create new app: `heroku create app-name`
3. Add MongoDB URI: `heroku config:set MONGODB_URI=...`
4. Deploy: `git push heroku main`

### Docker (Both)

```bash
# Build image
docker build -t bookstore-app .

# Run container
docker run -p 8000:8000 bookstore-app
```

## Troubleshooting

### Port Already in Use

```bash
# Windows - Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8000
kill -9 <PID>
```

### MongoDB Connection Error

- Verify MongoDB is running
- Check connection string in `.env`
- Ensure IP whitelist includes your machine (MongoDB Atlas)
- Verify credentials are correct

### CORS Errors

- Ensure backend is running
- Check `REACT_APP_API_URL` matches backend URL
- Verify backend CORS configuration

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Tests Failing

```bash
# Check specific test
npm test -- --verbose

# Run with debugging
node --inspect-brk node_modules/.bin/jest
```

### Git Hooks Not Running

```bash
# Reinstall Husky
npx husky install

# Verify hooks
ls -la .husky/
```

## Contributing

### How to Contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make changes and commit with Conventional Commits
4. Push to branch: `git push origin feature/new-feature`
5. Open Pull Request

### Guidelines

- Follow code style (ESLint + Prettier)
- Write tests for new features
- Update documentation
- Use Conventional Commits format
- Ensure all tests pass

### Pull Request Steps

1. Describe changes clearly
2. Link related issues
3. Include screenshots for UI changes
4. Ensure CI/CD passes
5. Request review from maintainers

## Support & Resources

- **Frontend Docs**: See [Frontend/README.md](./Frontend/README.md)
- **Backend Docs**: See [Backend/README.md](./Backend/README.md)
- **Git Hooks**: See [HOOKS_QUICK_START.md](./HOOKS_QUICK_START.md)
- **Testing Guide**: See [Frontend/TEST_GUIDE.md](./Frontend/TEST_GUIDE.md)

## License

This project is licensed under the MIT License - see LICENSE.md file for details.

## Author & Contact

**Online Book Library Development Team**

- 📧 Email: support@booklibrary.dev
- 💬 Discord: [Join our server](https://discord.gg/booklibrary)
- 🐦 Twitter: [@booklibrary](https://twitter.com/booklibrary)

---

**Happy Reading!** 📚

Last Updated: April 1, 2026
