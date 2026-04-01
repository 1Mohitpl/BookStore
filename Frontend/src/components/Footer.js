import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 text-slate-900 pt-16 pb-6 mt-16 border-t border-slate-200 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -bottom-[50%] left-1/2 -translate-x-1/2 w-[60%] h-full bg-[radial-gradient(ellipse_at_bottom,rgba(99,102,241,0.15)_0%,transparent_70%)] z-0"></div>

      <div className="container mx-auto px-6 max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12 relative z-10">
        <div>
          <h4 className="text-xl font-bold mb-6 text-slate-900">About Us</h4>
          <p className="text-slate-500 text-sm leading-relaxed">
            BookStore is your trusted online destination for books. Discover millions of titles at
            great prices.
          </p>
        </div>

        <div>
          <h4 className="text-xl font-bold mb-6 text-slate-900">Quick Links</h4>
          <ul className="flex flex-col gap-3">
            <li>
              <a
                href="/"
                className="text-slate-500 text-sm hover:text-indigo-600 hover:pl-2 transition-all"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/books"
                className="text-slate-500 text-sm hover:text-indigo-600 hover:pl-2 transition-all"
              >
                Books
              </a>
            </li>
            <li>
              <a
                href="/cart"
                className="text-slate-500 text-sm hover:text-indigo-600 hover:pl-2 transition-all"
              >
                Cart
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="text-slate-500 text-sm hover:text-indigo-600 hover:pl-2 transition-all"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-bold mb-6 text-slate-900">Customer Service</h4>
          <ul className="flex flex-col gap-3">
            <li>
              <a
                href="/faq"
                className="text-slate-500 text-sm hover:text-indigo-600 hover:pl-2 transition-all"
              >
                FAQ
              </a>
            </li>
            <li>
              <a
                href="/shipping"
                className="text-slate-500 text-sm hover:text-indigo-600 hover:pl-2 transition-all"
              >
                Shipping Info
              </a>
            </li>
            <li>
              <a
                href="/returns"
                className="text-slate-500 text-sm hover:text-indigo-600 hover:pl-2 transition-all"
              >
                Returns
              </a>
            </li>
            <li>
              <a
                href="/privacy"
                className="text-slate-500 text-sm hover:text-indigo-600 hover:pl-2 transition-all"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-bold mb-6 text-slate-900">Contact</h4>
          <div className="flex flex-col gap-3 text-sm text-slate-500">
            <p>
              Email:{' '}
              <a
                href="mailto:support@bookstore.com"
                className="hover:text-indigo-600 transition-colors"
              >
                support@bookstore.com
              </a>
            </p>
            <p>Phone: +1-800-BOOKS-01</p>
            <p>Address: 123 Book Street, Reading City, RC 12345</p>
          </div>
        </div>
      </div>

      <div className="text-center pt-8 border-t border-dashed border-slate-200 text-slate-500 text-sm relative z-10">
        <p>&copy; {currentYear} BookStore. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
