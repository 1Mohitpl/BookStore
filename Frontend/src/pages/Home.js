import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated, isAdmin } = useAuth();

    return (
        <div>
            <section className="bg-gradient-to-br from-indigo-50 via-slate-50 to-pink-50 text-slate-900 py-24 px-6 text-center border-b border-slate-200 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 left-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                
                <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-slate-900 tracking-tight leading-tight">
                        Welcome to <span className="bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">BookStore</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-500 mb-10 max-w-2xl mx-auto">
                        Discover millions of books at unbeatable prices. Your next adventure awaits.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {isAuthenticated ? (
                            <Link to="/books" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-3.5 rounded-full font-semibold shadow-md hover:-translate-y-1 hover:shadow-lg transition-all text-lg">
                                Browse Books
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-3.5 rounded-full font-semibold shadow-md hover:-translate-y-1 hover:shadow-lg transition-all text-lg">
                                    Login to Browse
                                </Link>
                                <Link to="/signup" className="bg-white text-indigo-600 border border-indigo-200 px-8 py-3.5 rounded-full font-semibold shadow-sm hover:bg-slate-50 hover:-translate-y-1 transition-all text-lg">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-slate-900">Why Choose BookStore?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-slate-50 p-8 rounded-3xl text-center border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <span className="text-5xl mb-6 block drop-shadow-sm">📚</span>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Huge Selection</h3>
                            <p className="text-slate-500 leading-relaxed">Millions of titles across all genres to fuel your imagination.</p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-3xl text-center border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <span className="text-5xl mb-6 block drop-shadow-sm">💰</span>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Great Prices</h3>
                            <p className="text-slate-500 leading-relaxed">Competitive pricing and frequent discounts you'll love.</p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-3xl text-center border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <span className="text-5xl mb-6 block drop-shadow-sm">🚚</span>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Fast Shipping</h3>
                            <p className="text-slate-500 leading-relaxed">Quick and reliable delivery straight to your doorstep.</p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-3xl text-center border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <span className="text-5xl mb-6 block drop-shadow-sm">💳</span>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Payment</h3>
                            <p className="text-slate-500 leading-relaxed">Safe and encrypted transactions for your peace of mind.</p>
                        </div>
                    </div>
                </div>
            </section>

            {isAuthenticated && isAdmin && (
                <section className="py-20 bg-gradient-to-r from-indigo-50 to-pink-50 text-center border-y border-indigo-100">
                    <div className="max-w-3xl mx-auto px-6">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Admin Controls</h2>
                        <p className="text-slate-600 mb-8 text-lg">Manage inventory, handle orders, and view analytics from the admin dashboard.</p>
                        <Link to="/admin" className="inline-block bg-slate-900 text-white px-8 py-3.5 rounded-full font-semibold shadow-md hover:bg-slate-800 hover:-translate-y-1 transition-all">
                            Go to Admin Panel
                        </Link>
                    </div>
                </section>
            )}

            <section className="py-24 text-center bg-slate-50 relative overflow-hidden">
                <div className="max-w-3xl mx-auto px-6 relative z-10">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">Start Shopping Today!</h2>
                    <p className="text-slate-500 text-lg mb-10">Browse our extensive collection and find your next favorite book.</p>
                    {isAuthenticated ? (
                        <Link to="/books" className="inline-block bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-10 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-lg">
                            Browse All Books
                        </Link>
                    ) : (
                        <Link to="/signup" className="inline-block bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-10 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-lg">
                            Get Started
                        </Link>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
