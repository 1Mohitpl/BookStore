# BookStore Frontend

A modern, responsive React-based Single Page Application (SPA) for an online bookstore with comprehensive e-commerce capabilities including user authentication, book management, shopping cart functionality, and order processing.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [Development](#development)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Troubleshooting](#troubleshooting)

## Overview

BookStore Frontend is a full-featured e-commerce application built with React 18 and Context API for state management. It provides a seamless shopping experience with features such as user authentication, product browsing, cart management, coupon application, and order history tracking. The application also includes administrative capabilities for managing the book inventory.

## Features

### User Features
- **User Authentication**: Secure sign-up, login, and profile management with JWT tokens
- **Book Browser**: Browse, search, filter, and discover books by category
- **Shopping Cart**: Add/remove items, manage quantities with persistent state
- **Coupon System**: Apply discount codes at checkout for reduced prices
- **Order Management**: Place orders and view comprehensive order history
- **Profile Management**: Update user information and manage preferences
- **Responsive Design**: Mobile-friendly UI optimized for all screen sizes

### Admin Features
- **Book Management**: Add, edit, and delete books from the inventory
- **Inventory Control**: Manage book details including title, author, price, and stock

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 18.x |
| Routing | React Router | 6.x |
| HTTP Client | Axios | 1.x |
| State Management | Context API | Built-in |
| Styling | CSS Modules + Tailwind CSS | Latest |
| Testing | Jest + React Testing Library | Latest |
| Code Quality | ESLint + Prettier | Latest |

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher (or Yarn v1.22.0+)
- **Git**: For version control
- **Backend Server**: BookStore Backend must be running on `http://localhost:8000`

Verify installation:

```bash
node --version
npm --version
```

## Installation & Setup

### 1. Clone or Navigate to the Frontend Directory

```bash
cd Frontend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

### 3. Environment Configuration

Create a `.env` file in the Frontend root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your backend server URL:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
```

### 4. Verify Backend Connection

Ensure your backend server is running and accessible at the URL specified in `.env`.

## Running the Application

### Development Mode

Start the development server with hot-reload enabled:

```bash
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

**Development Features**:
- Hot Module Reloading (HMR) for instant updates
- Source maps for debugging
- Redux DevTools integration (if installed)

### Build for Production

Create an optimized production build:

```bash
npm run build
```

This generates a minified, production-ready build in the `build/` directory.

### Preview Production Build

```bash
npm run build
npm install -g serve
serve -s build
```

## Project Structure

```
Frontend/
├── public/
│   └── index.html                # HTML template
│
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── BookCard.js          # Book card component
│   │   ├── Footer.js            # Footer component
│   │   ├── Header.js            # Navigation header
│   │   └── *.module.css         # Component styles
│   │
│   ├── context/                  # React Context API
│   │   ├── AuthContext.js       # Authentication state
│   │   ├── AuthContext.test.js  # Auth context tests
│   │   ├── CartContext.js       # Cart state management
│   │   └── CartContext.test.js  # Cart context tests
│   │
│   ├── pages/                    # Page/Route components
│   │   ├── Home.js              # Landing page
│   │   ├── Login.js             # User login
│   │   ├── Signup.js            # User registration
│   │   ├── Books.js             # Book listing
│   │   ├── Cart.js              # Shopping cart
│   │   ├── Checkout.js          # Order checkout
│   │   ├── Orders.js            # Order history
│   │   ├── Profile.js           # User profile
│   │   ├── Admin.js             # Admin panel
│   │   └── *.module.css         # Page styles
│   │
│   ├── services/                 # API integration
│   │   └── api.js               # Axios API client
│   │
│   ├── setupTests.js            # Jest configuration
│   ├── App.js                   # Main app component
│   ├── App.css                  # Global styles
│   ├── index.js                 # React DOM entry point
│   └── index.css                # Global styles
│
├── .eslintrc                     # ESLint configuration
├── .prettier.rc                  # Prettier configuration
├── .lintstagedrc                # Lint-staged configuration
├── .gitignore                   # Git ignore rules
├── package.json                 # Project dependencies
├── package-lock.json            # Dependency lock file
├── TEST_GUIDE.md                # Testing documentation
├── TEST_SUMMARY.md              # Test results summary
└── README.md                    # This file
```

## API Integration

The frontend communicates with the backend through `src/services/api.js` using Axios.

### API Endpoints

| Module | Operations |
|--------|------------|
| **Authentication** | Sign up, Login, Profile management, Token refresh |
| **Books** | Fetch all books, Get book details, Search, Filter, Add book (Admin), Update book (Admin), Delete book (Admin) |
| **Cart** | Get cart items, Add to cart, Remove from cart, Update quantity |
| **Orders** | Create order, Retrieve order history, Get order details |
| **Coupons** | Validate coupon, Apply discount, Retrieve available coupons |

### API Request Example

```javascript
import { api } from '../services/api';

// Fetch all books
const response = await api.get('/api/books');

// Create an order
const order = await api.post('/api/orders', {
  cartItems: [...],
  totalPrice: 1299.99,
  couponCode: 'SAVE20'
});
```

## Authentication

### JWT Token Management

- **Storage**: JWT tokens are stored securely in browser localStorage
- **Transmission**: Tokens are automatically included in all API request headers
- **Expiration**: Tokens refresh automatically on API calls
- **Logout**: Tokens are cleared from storage on user logout

### Protected Routes

Routes requiring authentication:
- `/books` - Book listing and details
- `/cart` - Shopping cart
- `/checkout` - Order checkout
- `/orders` - Order history
- `/profile` - User profile
- `/admin` - Admin panel (admin role required)

### User Roles

- **User**: Standard customer role with access to shopping features
- **Admin**: Administrative role with additional book management capabilities

## Development

### Available Scripts

```bash
# Development server
npm start

# Production build
npm run build

# Run tests
npm test

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Husky Git Hooks

This project uses Husky for automated Git hooks:

- **pre-commit**: Runs ESLint and Prettier on staged files
- **pre-push**: Runs tests before pushing to remote
- **commit-msg**: Validates commit message format (Conventional Commits)

### Code Style Guidelines

- **ESLint**: Enforces code quality rules (React best practices, var warnings, etc.)
- **Prettier**: Enforces consistent code formatting (2-space indent, single quotes, 100 char line width)
- **Conventional Commits**: Follow the format `type(scope): description` for all commits

Example:
```bash
git commit -m "feat(cart): add item quantity increment button"
git commit -m "fix(auth): resolve JWT token refresh issue"
git commit -m "docs(readme): update installation instructions"
```

## Testing

The project includes comprehensive Jest and React Testing Library tests.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run a specific test
npm test AuthContext.test.js
```

### Test Coverage

- **AuthContext**: Initialization, localStorage restoration, error handling, loading states
- **CartContext**: Cart state management, discount tracking, async operations
- **setupTests.js**: Jest configuration with mocks for Axios and API services

### Test Files Location

```
src/
├── context/
│   ├── AuthContext.test.js
│   └── CartContext.test.js
└── setupTests.js
```

For detailed testing documentation, see [TEST_GUIDE.md](./TEST_GUIDE.md) and [TEST_SUMMARY.md](./TEST_SUMMARY.md).

## Code Quality

### ESLint Configuration

The project enforces React and JavaScript best practices:

```javascript
// ✅ Good
const BookCard = ({ title, author }) => (
  <article className={styles.card}>{title}</article>
);

// ❌ Bad
var BookCard = function(props) {
  return <article>{props.title}</article>;
};
```

### Prettier Formatting

All code is formatted with consistent style:
- 2-space indentation
- Single quotes for strings
- 100 character line width
- No trailing commas

### Running Code Quality Tools

```bash
# Check for issues
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code
npm run format
```

## Troubleshooting

### CORS Errors

**Problem**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
- Ensure backend server is running on `http://localhost:8000`
- Verify `REACT_APP_API_URL` in `.env` matches backend server URL
- Check backend CORS configuration

```env
REACT_APP_API_URL=http://localhost:8000
```

### Books Not Loading

**Problem**: Empty book list on `/books` page

**Solution**:
- Verify backend is running: `npm start` in Backend directory
- Check database connection in backend
- Verify API endpoint: `GET /api/books`
- Check browser console for API errors

### Authentication Issues

**Problem**: Cannot login or session expires immediately

**Solution**:
- Ensure backend auth endpoints are operational
- Check JWT token in localStorage: Open DevTools → Application → Local Storage
- Verify backend is configured for JWT signing
- Clear localStorage and try again: `localStorage.clear()`

### Build Errors

**Problem**: `npm run build` fails with module not found

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use

**Problem**: `Port 3000 is already in use`

**Solution**:
```bash
# Use different port
PORT=3001 npm start

# Or kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

## Performance Optimization

- **Code Splitting**: Routes are lazy-loaded for better performance
- **CSS Modules**: Scoped styling prevents CSS conflicts
- **Memoization**: Components avoid unnecessary re-renders
- **Tailwind CSS**: Utility-first CSS framework for smaller bundle size

## Support & Documentation

For additional support:
- Backend Documentation: See `../Backend/README.md`
- API Documentation: Check backend API endpoints
- Testing Guide: See `TEST_GUIDE.md`
- Husky Setup: See `../HOOKS_QUICK_START.md`

## License

This project is part of the BookStore MERN Stack application suite.

## Contributing

When contributing to this project:
1. Follow the code style guidelines (ESLint + Prettier)
2. Write tests for new features
3. Use Conventional Commits format
4. Ensure all tests pass before pushing
