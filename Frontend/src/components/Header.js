import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
    const { user, isAuthenticated, logout, isAdmin } = useAuth();
    const { cartItems } = useCart();

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 shadow-sm">
            <div className="container mx-auto px-6 max-w-7xl flex flex-wrap justify-between items-center gap-4">
                <Link to="/" className="text-2xl font-bold whitespace-nowrap bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent transform transition-transform hover:scale-105 order-1">
                    📚 BookStore
                </Link>
                
                <nav className="flex gap-6 md:gap-10 flex-1 justify-center order-3 md:order-2 w-full md:w-auto">
                    <Link to="/" className="text-slate-500 font-medium hover:text-indigo-600 transition-colors relative group">
                        Home
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
                    </Link>
                    <Link to="/books" className="text-slate-500 font-medium hover:text-indigo-600 transition-colors relative group">
                        Books
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
                    </Link>
                    {isAdmin && (
                        <Link to="/admin" className="text-slate-500 font-medium hover:text-indigo-600 transition-colors relative group">
                            Admin
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
                        </Link>
                    )}
                </nav>

                <div className="flex gap-4 md:gap-6 items-center flex-wrap justify-end order-2 md:order-3">
                    {isAuthenticated ? (
                        <>
                            <Link to="/cart" className="text-slate-500 font-medium hover:text-indigo-600 transition-colors whitespace-nowrap">
                                🛒 Cart ({cartItems.length})
                            </Link>
                            <Link to="/profile" className="text-slate-500 font-medium hover:text-indigo-600 transition-colors whitespace-nowrap">
                                👤 {user?.username}
                            </Link>
                            <button onClick={handleLogout} className="bg-gradient-to-br from-red-500 to-red-700 text-white px-5 py-2 rounded-full font-semibold text-sm shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-slate-500 font-medium hover:text-indigo-600 transition-colors whitespace-nowrap">Login</Link>
                            <Link to="/signup" className="text-slate-500 font-medium hover:text-indigo-600 transition-colors whitespace-nowrap">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
