import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        address: ''
    });
    const [error, setError] = useState('');
    const { signup, loading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!formData.username || !formData.password || !formData.email) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            await signup(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-pink-50">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 relative overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">Create Account</h2>
                    
                    {error && <div className="bg-red-50/80 text-red-500 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">{error}</div>}
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="username" className="text-sm font-bold text-slate-600 uppercase tracking-wider ml-1">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
                                disabled={loading}
                                required
                                className="w-full p-4 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 bg-white/50 transition-all font-medium text-slate-800 disabled:opacity-50"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="email" className="text-sm font-bold text-slate-600 uppercase tracking-wider ml-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                disabled={loading}
                                required
                                className="w-full p-4 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 bg-white/50 transition-all font-medium text-slate-800 disabled:opacity-50"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="password" className="text-sm font-bold text-slate-600 uppercase tracking-wider ml-1">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                disabled={loading}
                                required
                                className="w-full p-4 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 bg-white/50 transition-all font-medium text-slate-800 disabled:opacity-50"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="address" className="text-sm font-bold text-slate-600 uppercase tracking-wider ml-1">Address (Optional)</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your address"
                                disabled={loading}
                                className="w-full p-4 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 bg-white/50 transition-all font-medium text-slate-800 disabled:opacity-50"
                            />
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-1 hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 mt-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:-translate-y-0 disabled:shadow-none">
                            {loading ? 'Signing up...' : 'Sign Up'}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-sm font-medium text-slate-500">
                        Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-800 hover:underline">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
