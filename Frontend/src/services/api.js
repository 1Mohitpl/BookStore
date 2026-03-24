import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with base URL
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if available
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth Service
export const authService = {
    signup: (data) => apiClient.post('/sign-up', data),
    login: (credentials) => apiClient.post('/sign-in', credentials),
    getProfile: () => apiClient.get('/user-profile'),
    updateProfile: (data) => apiClient.put('/user-update', data)
};

// Book Service
export const bookService = {
    getAllBooks: () => apiClient.get('/get-all-books'),
    getBookById: (id) => apiClient.get(`/books/${id}`),
    addBook: (data) => apiClient.post('/books', data),
    updateBook: (id, data) => apiClient.put(`/books/${id}`, data),
    deleteBook: (id) => apiClient.delete(`/books/${id}`),
    searchBooks: (query) => apiClient.get(`/search-books?q=${query}`)
};

// Cart Service
export const cartService = {
    addToCart: (bookId, quantity) => apiClient.post('/cart/add', { bookId, quantity }),
    getCart: () => apiClient.get('/cart'),
    removeFromCart: (cartItemId) => apiClient.delete(`/cart/remove/${cartItemId}`),
    updateCartItem: (cartItemId, quantity) => apiClient.put(`/cart/update/${cartItemId}`, { quantity })
};

// Order Service
export const orderService = {
    createOrder: (data) => apiClient.post('/orders', data),
    getOrders: () => apiClient.get('/orders'),
    getOrderById: (id) => apiClient.get(`/orders/${id}`)
};

// Coupon Service
export const couponService = {
    validateCoupon: (code) => apiClient.post('/coupon/validate', { code }),
    applyCoupon: (code) => apiClient.post('/coupon/apply', { code })
};

export default apiClient;
