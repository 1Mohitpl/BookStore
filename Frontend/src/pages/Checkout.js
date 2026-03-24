import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, appliedCoupon, discount, getTotalPrice, getSubtotal, clearCart } = useCart();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        shippingAddress: user?.address || '',
        paymentMethod: 'credit-card'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (cartItems.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Your checkout is empty</h2>
                    <button onClick={() => navigate('/books')} className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:-translate-y-1 transition-all">
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.shippingAddress.trim()) {
            setError('Please provide a shipping address');
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                items: cartItems.map(item => ({
                    bookId: item._id,
                    title: item.title,
                    quantity: item.quantity,
                    price: item.price
                })),
                shippingAddress: formData.shippingAddress,
                paymentMethod: formData.paymentMethod,
                appliedCoupon: appliedCoupon?.code || null,
                totalAmount: getTotalPrice(),
                subtotal: getSubtotal(),
                discount: discount
            };

            const response = await orderService.createOrder(orderData);
            
            alert('Order placed successfully! Order ID: ' + response.data._id);
            
            clearCart();
            navigate('/orders');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 h-max">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4">Order Summary</h2>

                    <div className="mb-6">
                        <h3 className="font-semibold text-slate-900 mb-4">Items</h3>
                        {cartItems.map(item => (
                            <div key={item._id} className="flex justify-between py-3 border-b border-dashed border-slate-200 text-slate-600">
                                <span>{item.title} × {item.quantity}</span>
                                <span className="font-medium text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t-2 border-dashed border-slate-200">
                        <div className="flex justify-between py-2 text-slate-600">
                            <span>Subtotal:</span>
                            <span className="font-medium text-slate-900">₹{getSubtotal().toFixed(2)}</span>
                        </div>

                        {appliedCoupon && (
                            <div className="flex justify-between py-2 text-green-500 font-semibold">
                                <span>Discount ({appliedCoupon.code}):</span>
                                <span>-₹{discount.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="flex justify-between py-4 mt-4 border-t border-slate-200 text-xl font-bold text-slate-900">
                            <span>Total:</span>
                            <span className="text-indigo-600">₹{getTotalPrice().toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4">Shipping & Payment</h2>

                    {error && <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 border-l-4 border-red-500">{error}</div>}

                    <form onSubmit={handlePlaceOrder}>
                        <div className="mb-6">
                            <label className="block font-semibold text-slate-700 mb-2">Shipping Address *</label>
                            <textarea
                                name="shippingAddress"
                                value={formData.shippingAddress}
                                onChange={handleChange}
                                placeholder="Enter your complete shipping address"
                                rows="4"
                                required
                                disabled={loading}
                                className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-900 disabled:opacity-50"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block font-semibold text-slate-700 mb-2">Payment Method *</label>
                            <select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-900 disabled:opacity-50"
                            >
                                <option value="credit-card">Credit Card</option>
                                <option value="debit-card">Debit Card</option>
                                <option value="net-banking">Net Banking</option>
                                <option value="upi">UPI</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-3 mb-8">
                            <input type="checkbox" id="terms" required disabled={loading} className="w-5 h-5 accent-indigo-600 cursor-pointer" />
                            <label htmlFor="terms" className="text-slate-600 font-medium">
                                I agree to the terms and conditions
                            </label>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-4 rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all mb-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:-translate-y-0">
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>

                        <button 
                            type="button" 
                            onClick={() => navigate('/cart')} 
                            disabled={loading}
                            className="w-full bg-slate-100 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                        >
                            Back to Cart
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
