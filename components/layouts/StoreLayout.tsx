import React from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';

type StoreLayoutProps = {
  children: React.ReactNode;
};

export default function StoreLayout({ children }: StoreLayoutProps) {
  const { cart } = useCart();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header>
        <div className="logo-title">
          <img src="/assets/images/Omniversal_Symbol.png" alt="Omniversal Logo" className="symbol" />
          <Link href="/" className="site-title">
            REINCARNATED.STORE
          </Link>
        </div>
        
        <input type="checkbox" id="menu-toggle" />
        <label htmlFor="menu-toggle" className="menu-icon md:hidden">☰</label>
        
        <nav>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/products">Products</Link></li>
            <li>
              <Link href="/cart" className="relative">
                Cart
                {cartItemCount > 0 && (
                  <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer>
        <div className="footer">
          <div className="footer-text">
            <p className="line-1">Omniversal Media</p>
            <p className="line-2">Reincarnated Store</p>
            <p className="line-3">
              &copy; {new Date().getFullYear()} · <a href="https://omniversalmedia.org" target="_blank" rel="noopener noreferrer">OmniversalMedia.org</a>
            </p>
          </div>
          <img src="/assets/images/Omniversal_Symbol.png" alt="Omniversal Logo" className="symbol-footer" />
        </div>
      </footer>
    </div>
  );
}
