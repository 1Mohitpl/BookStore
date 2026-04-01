import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getAllBooks();
      const booksData = response.data.data || response.data || [];
      setBooks(booksData);
      setFilteredBooks(booksData);

      // Extract unique categories
      const uniqueCategories = [...new Set(booksData.map(book => book.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = e => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    applyFilters(term, selectedCategory);
  };

  const handleCategoryChange = e => {
    const category = e.target.value;
    setSelectedCategory(category);
    applyFilters(searchTerm, category);
  };

  const applyFilters = (search, category) => {
    let filtered = books;

    if (search) {
      filtered = filtered.filter(
        book =>
          book.title.toLowerCase().includes(search) ||
          book.author.toLowerCase().includes(search) ||
          book.desc.toLowerCase().includes(search)
      );
    }

    if (category !== 'all') {
      filtered = filtered.filter(book => book.category === category);
    }

    setFilteredBooks(filtered);
  };

  const handleAddToCart = async bookId => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await addToCart(bookId, 1);
      alert('Book added to cart!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500 text-xl font-medium animate-pulse">
        Loading books...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">Browse Our Books</h1>
        <p className="text-slate-500 text-lg">Discover thousands of titles</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-8 border-l-4 border-red-500">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex-1 w-full relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by title, author, or description..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-slate-50 text-slate-900 transition-all"
          />
        </div>

        <div className="w-full md:w-64">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-slate-50 text-slate-900 transition-all font-medium appearance-none cursor-pointer"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
              backgroundPosition: 'right 1rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.25em 1.25em'
            }}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6 text-slate-600 font-medium">
        <p>
          Found {filteredBooks.length} book{filteredBooks.length === 1 ? '' : 's'}
        </p>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
          <p className="text-xl text-slate-500 font-medium">
            No books found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredBooks.map(book => (
            <BookCard key={book._id} book={book} onAddToCart={() => handleAddToCart(book._id)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;
