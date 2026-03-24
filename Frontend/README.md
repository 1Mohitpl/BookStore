# BookStore Frontend

React-based Single Page Application for a BookStore with comprehensive e-commerce features.

## 📋 Features

- **User Authentication**: Sign up, login, and profile management
- **Book Management**: Browse, search, and filter books by category
- **Shopping Cart**: Add/remove items, manage quantities, persistent cart state
- **Coupon System**: Apply discount codes at checkout
- **Order Management**: Place orders and view order history
- **Admin Panel**: Add, edit, and delete books (admin only)
- **Responsive Design**: Mobile-friendly UI

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the API URL in `.env` if your backend is running on a different port:
```env
REACT_APP_API_URL=http://localhost:8000
```

### Running the Application

Start the development server:
```bash
npm start
```

The app will open in your browser at `http://localhost:3000`

### Building for Production

Create an optimized production build:
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Header.js
│   ├── Header.module.css
│   ├── Footer.js
│   ├── Footer.module.css
│   ├── BookCard.js
│   └── BookCard.module.css
├── context/           # State management (React Context)
│   ├── AuthContext.js
│   └── CartContext.js
├── pages/             # Page components
│   ├── Home.js
│   ├── Login.js
│   ├── Signup.js
│   ├── Books.js
│   ├── Cart.js
│   ├── Checkout.js
│   ├── Orders.js
│   ├── Profile.js
│   ├── Admin.js
│   └── *.module.css
├── services/          # API integration
│   └── api.js
├── App.js             # Main app component with routing
└── index.js           # React DOM render entry point

public/
└── index.html         # HTML template
```

## 🔑 Key Pages

| Page | Route | Auth Required | Description |
|------|-------|---------------|-------------|
| Home | `/` | No | Landing page with features |
| Login | `/login` | No | User login |
| Signup | `/signup` | No | User registration |
| Books | `/books` | Yes | Browse and search books |
| Cart | `/cart` | Yes | View shopping cart |
| Checkout | `/checkout` | Yes | Place order |
| Orders | `/orders` | Yes | View order history |
| Profile | `/profile` | Yes | User profile and settings |
| Admin | `/admin` | Yes (Admin) | Manage books |

## 🛠️ Technology Stack

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **CSS Modules** - Component styling
- **Context API** - State management

## 📝 API Integration

The frontend integrates with the backend through `src/services/api.js`:

- **Auth**: Sign up, login, profile management
- **Books**: Browse, search, add, edit, delete books
- **Cart**: Add/remove items, update quantities
- **Orders**: Create and retrieve orders
- **Coupons**: Validate and apply coupon codes

## 🔐 Authentication

- JWT tokens are stored in localStorage
- Protected routes require authentication
- Admin routes require admin role
- Token is automatically sent with all API requests

## 📦 Dependencies

See `package.json` for complete list of dependencies:
- `react` - UI framework
- `react-router-dom` - Routing
- `axios` - HTTP client
- `react-scripts` - CRA scripts

## 🎯 Usage Examples

### Adding a Book to Cart
```javascript
const { addToCart } = useCart();
await addToCart(bookId, quantity);
```

### Applying a Coupon
```javascript
const { applyCoupon } = useCart();
await applyCoupon(couponCode);
```

### Fetching Books
```javascript
const { getAllBooks } = bookService;
const response = await getAllBooks();
```

## 🐛 Troubleshooting

**CORS Errors**: Ensure backend is running on port 8000 or update `REACT_APP_API_URL`

**Not Loading Books**: Verify backend is running and database is connected

**Login Issues**: Check that backend auth endpoints are working

## 📄 License

This project is part of the BookStore application suite.

## 👨‍💻 Development

For development setup and additional information, see the main BookStore README.
