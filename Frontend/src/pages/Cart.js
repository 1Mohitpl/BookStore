import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateCartItem,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    discount,
    getTotalPrice,
    getSubtotal,
    loading
  } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      updateCartItem(id, newQuantity);
    }
  };

  const handleRemove = async id => {
    try {
      await removeFromCart(id);
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  const handleApplyCoupon = async e => {
    e.preventDefault();
    setCouponError('');

    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    try {
      await applyCoupon(couponCode);
      setCouponCode('');
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Cart is Empty</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Looks like you haven't added any books to your cart yet. Explore our collection and find
            your next great read!
          </p>
          <button
            onClick={() => navigate('/books')}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-3.5 rounded-full font-bold shadow-md hover:-translate-y-1 transition-all"
          >
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2 border-b border-slate-200 pb-3">
            Cart Items ({cartItems.length})
          </h2>

          {loading && <p className="text-indigo-600 font-medium animate-pulse">Updating cart...</p>}

          {cartItems.map(item => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative"
            >
              <div className="w-full sm:w-32 h-40 flex-shrink-0 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-100">
                {item.url ? (
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-slate-400 font-medium">No Image</div>
                )}
              </div>

              <div className="flex-1 flex flex-col pt-1">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-slate-500 mb-3">{item.author}</p>
                <p className="text-indigo-600 font-bold text-lg mb-4 sm:mb-auto">₹{item.price}</p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3">
                    <label className="text-slate-600 font-medium text-sm">Qty:</label>
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold transition-colors border-r border-slate-200 active:bg-slate-200"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-semibold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold transition-colors border-l border-slate-200 active:bg-slate-200"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <p className="text-lg font-bold text-slate-800 mb-1 hidden sm:block">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="text-red-500 text-sm font-semibold hover:text-red-700 hover:underline transition-all"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-max sticky top-24">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4">
            Order Summary
          </h2>

          <div className="flex justify-between py-3 text-slate-600">
            <span className="font-medium">Subtotal:</span>
            <span className="font-bold text-slate-900">₹{getSubtotal().toFixed(2)}</span>
          </div>

          {appliedCoupon && (
            <div className="flex justify-between py-3 text-emerald-600 font-medium bg-emerald-50 px-4 rounded-xl mt-2 border border-emerald-100 relative group">
              <span className="flex items-center">Discount ({appliedCoupon.code})</span>
              <span className="flex items-center gap-3">
                -₹{discount.toFixed(2)}
                <button
                  onClick={removeCoupon}
                  className="text-emerald-700 hover:text-red-500 hover:bg-red-50 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                  title="Remove coupon"
                >
                  ✕
                </button>
              </span>
            </div>
          )}

          <div className="mt-6 mb-6">
            <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
              Apply Coupon
            </h3>
            <form onSubmit={handleApplyCoupon} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  placeholder="Enter code"
                  disabled={appliedCoupon !== null}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 uppercase font-medium placeholder:normal-case disabled:opacity-50 disabled:bg-slate-50 text-slate-800"
                />
                <button
                  type="submit"
                  disabled={appliedCoupon !== null || !couponCode.trim()}
                  className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <p className="text-red-500 text-sm font-medium ml-1">{couponError}</p>
              )}
            </form>
          </div>

          <div className="flex justify-between py-5 border-t border-dashed border-slate-300 mb-6 items-center">
            <span className="text-lg font-bold text-slate-900">Total Amount:</span>
            <span className="text-2xl font-black text-indigo-600">
              ₹{getTotalPrice().toFixed(2)}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate('/books')}
              className="w-full bg-slate-50 text-slate-700 border border-slate-200 py-4 rounded-xl font-bold hover:bg-slate-100 hover:border-slate-300 transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
