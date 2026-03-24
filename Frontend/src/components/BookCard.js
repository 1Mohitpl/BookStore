import React from 'react';

const BookCard = ({ book, onAddToCart, onEdit, onDelete, showActions = false }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-indigo-300 border border-slate-200 flex flex-col h-full group">
            <div className="w-full h-60 bg-slate-100 overflow-hidden relative">
                {book.url ? (
                    <img src={book.url} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-500 text-white font-bold text-xl tracking-wide">
                        No Image
                    </div>
                )}
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-2 text-slate-900 break-words leading-snug">{book.title}</h3>
                <p className="text-slate-500 text-sm mb-1 flex items-center gap-2">by {book.author}</p>
                <p className="inline-block text-pink-600 bg-pink-50 px-3 py-1 rounded-full text-xs my-2 font-semibold uppercase tracking-wide w-max">{book.category}</p>
                <p className="text-slate-500 text-sm my-3 flex-1 overflow-hidden line-clamp-3 leading-relaxed">{book.desc}</p>
                
                <div className="flex justify-between items-center my-4 pt-4 border-t border-slate-200">
                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-md text-sm font-medium">{book.language}</span>
                    <span className="text-2xl font-bold text-indigo-600 drop-shadow-sm">₹{book.price}</span>
                </div>

                <div className="flex gap-3 mt-auto">
                    {!showActions ? (
                        <button 
                            className="flex-1 py-3 rounded-lg font-semibold text-sm transition-all flex justify-center items-center gap-2 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg"
                            onClick={onAddToCart}
                        >
                            Add to Cart
                        </button>
                    ) : (
                        <>
                            <button 
                                className="flex-1 py-3 rounded-lg font-semibold text-sm transition-all flex justify-center items-center gap-2 bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 hover:border-amber-300"
                                onClick={onEdit}
                            >
                                Edit
                            </button>
                            <button 
                                className="flex-1 py-3 rounded-lg font-semibold text-sm transition-all flex justify-center items-center gap-2 bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 hover:border-red-300"
                                onClick={onDelete}
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookCard;
