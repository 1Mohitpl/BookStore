import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartService, couponService } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch cart on mount
    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await cartService.getCart();
            setCartItems(response.data.items || []);
        } catch (err) {
            console.error('Failed to fetch cart:', err);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (bookId, quantity = 1) => {
        setError(null);
        try {
            setLoading(true);
            const response = await cartService.addToCart(bookId, quantity);
            setCartItems(response.data.items || []);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to add to cart';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (cartItemId) => {
        setError(null);
        try {
            setLoading(true);
            const response = await cartService.removeFromCart(cartItemId);
            setCartItems(response.data.items || []);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to remove from cart';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateCartItem = async (cartItemId, quantity) => {
        setError(null);
        try {
            setLoading(true);
            const response = await cartService.updateCartItem(cartItemId, quantity);
            setCartItems(response.data.items || []);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update cart';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const applyCoupon = async (code) => {
        setError(null);
        try {
            setLoading(true);
            const response = await couponService.applyCoupon(code);
            setAppliedCoupon(response.data.coupon);
            setDiscount(response.data.discount || 0);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Invalid coupon';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setDiscount(0);
    };

    const getTotalPrice = () => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return subtotal - discount;
    };

    const getSubtotal = () => {
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const clearCart = () => {
        setCartItems([]);
        setAppliedCoupon(null);
        setDiscount(0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            appliedCoupon,
            discount,
            loading,
            error,
            addToCart,
            removeFromCart,
            updateCartItem,
            applyCoupon,
            removeCoupon,
            getTotalPrice,
            getSubtotal,
            clearCart,
            fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};
