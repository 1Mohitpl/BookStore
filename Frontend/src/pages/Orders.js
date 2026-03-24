import React, { useState, useEffect } from 'react';
import { orderService } from '../services/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderService.getOrders();
            setOrders(response.data.data || response.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch orders');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="max-w-4xl mx-auto px-6 py-20 text-center"><p className="text-xl text-slate-500 font-medium animate-pulse">Loading your orders...</p></div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">My Orders</h1>

            {error && <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-8 border-l-4 border-red-500">{error}</div>}

            {orders.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
                    <p className="text-lg text-slate-500">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 mb-4 gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Order #{order._id.substring(order._id.length - 8)}</h3>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wider inline-block ${
                                        order.status && order.status.toLowerCase() === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                                        order.status && order.status.toLowerCase() === 'processing' ? 'bg-amber-100 text-amber-700' :
                                        order.status && order.status.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                        {order.status || 'Pending'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-3 border-b border-slate-100 pb-2">Items ({order.items?.length || 0})</h4>
                                    <ul className="flex flex-col gap-2">
                                        {order.items?.map(item => (
                                            <li key={item._id} className="text-slate-600 flex justify-between">
                                                <span>{item.title}</span> 
                                                <span className="font-medium">× {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <h4 className="font-semibold text-slate-900 mb-3 border-b border-slate-200 pb-2">Billing Details</h4>
                                    <p className="text-slate-600 mb-2 whitespace-pre-wrap"><strong className="text-slate-800">Shipping Address:</strong><br />{order.shippingAddress || 'Not provided'}</p>
                                    <p className="text-slate-600 text-lg mt-4 border-t border-slate-200 pt-3"><strong className="text-slate-800">Total Amount:</strong> <span className="font-bold text-indigo-600">₹{order.totalAmount?.toFixed(2)}</span></p>
                                    {order.appliedCoupon && (
                                        <p className="text-emerald-600 mt-2 font-medium">Coupon Applied: {order.appliedCoupon}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
