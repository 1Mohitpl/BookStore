import React, { useState, useEffect } from 'react';
import { bookService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';

const Admin = () => {
  const { isAdmin } = useAuth();
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    desc: '',
    url: '',
    language: '',
    category: ''
  });

  useEffect(() => {
    if (!isAdmin) return;
    fetchBooks();
  }, [isAdmin]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getAllBooks();
      setBooks(response.data.data || response.data || []);
    } catch (err) {
      setMessage('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');

    try {
      if (!formData.title || !formData.author || !formData.price) {
        setMessage('Please fill in required fields');
        return;
      }

      if (editingId) {
        await bookService.updateBook(editingId, formData);
        setMessage('Book updated successfully');
      } else {
        await bookService.addBook(formData);
        setMessage('Book added successfully');
      }

      fetchBooks();
      resetForm();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = book => {
    setFormData(book);
    setEditingId(book._id);
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await bookService.deleteBook(id);
      setMessage('Book deleted successfully');
      fetchBooks();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to delete book');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      price: '',
      desc: '',
      url: '',
      language: '',
      category: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center text-xl text-slate-500">
        <p>Access denied. Admin only.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Admin Panel</h1>

      {message && (
        <div className="bg-emerald-50 text-emerald-600 p-4 rounded-lg mb-8 border-l-4 border-emerald-500 font-medium">
          {message}
        </div>
      )}

      <div className="mb-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:-translate-y-0.5 transition-all"
        >
          {showForm ? 'Cancel' : 'Add New Book'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-10 max-w-3xl"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4">
            {editingId ? 'Edit Book' : 'Add New Book'}
          </h2>

          <div className="mb-5">
            <label className="block font-semibold text-slate-700 mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            />
          </div>

          <div className="mb-5">
            <label className="block font-semibold text-slate-700 mb-2">Author *</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            />
          </div>

          <div className="mb-5">
            <label className="block font-semibold text-slate-700 mb-2">Price *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              required
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block font-semibold text-slate-700 mb-2">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-2">Language</label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block font-semibold text-slate-700 mb-2">Image URL</label>
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            />
          </div>

          <div className="mb-8">
            <label className="block font-semibold text-slate-700 mb-2">Description</label>
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 resize-y"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3.5 rounded-xl shadow-md hover:-translate-y-0.5 transition-all"
            >
              {editingId ? 'Update Book' : 'Add Book'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-slate-100 text-slate-700 border border-slate-200 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-200 pb-4">
          Inventory ({books.length})
        </h2>
        {loading ? (
          <p className="text-center py-10 text-slate-500 font-medium animate-pulse">
            Loading books...
          </p>
        ) : books.length === 0 ? (
          <p className="text-center py-10 text-slate-500">No books available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {books.map(book => (
              <div key={book._id} className="relative">
                <BookCard
                  book={book}
                  showActions={true}
                  onEdit={() => handleEdit(book)}
                  onDelete={() => handleDelete(book._id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
