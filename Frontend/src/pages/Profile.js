import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    address: user?.address || ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await authService.updateProfile(formData);
      setMessage('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-xl text-slate-500">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">My Profile</h1>

      {message && (
        <div className="bg-emerald-50 text-emerald-600 p-4 rounded-lg mb-8 border-l-4 border-emerald-500 font-medium">
          {message}
        </div>
      )}

      <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 mb-8">
        <div className="flex flex-col md:flex-row gap-6 mb-8 items-center md:items-start border-b border-dashed border-slate-200 pb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-lg flex-shrink-0">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{user.username}</h2>
            <span className="inline-block text-indigo-700 bg-indigo-50 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              {user.role === 'admin' ? 'Admin' : 'Customer'}
            </span>
          </div>
        </div>

        {!isEditing ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-2 md:gap-4 items-center">
              <span className="font-semibold text-slate-500">Username:</span>
              <span className="text-lg text-slate-900 break-words">{user.username}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-2 md:gap-4 items-center">
              <span className="font-semibold text-slate-500">Address:</span>
              <span className="text-lg text-slate-900 break-words">
                {user.address || 'Not provided'}
              </span>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all self-start"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-slate-700">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                rows="4"
                disabled={loading}
                className="p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-900 disabled:opacity-50 resize-y"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={loading}
                className="flex-1 bg-slate-100 text-slate-700 border border-slate-200 font-bold py-3.5 rounded-xl hover:bg-slate-200 hover:border-slate-300 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Shortcuts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/orders')}
            className="bg-slate-50 text-slate-700 border border-slate-200 p-4 rounded-xl font-semibold hover:border-indigo-500 hover:text-indigo-600 hover:-translate-y-1 transition-all"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate('/books')}
            className="bg-slate-50 text-slate-700 border border-slate-200 p-4 rounded-xl font-semibold hover:border-indigo-500 hover:text-indigo-600 hover:-translate-y-1 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
