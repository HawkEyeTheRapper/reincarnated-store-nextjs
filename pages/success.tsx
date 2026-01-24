import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function SuccessPage() {
  const { query } = useRouter();
  const { cart, removeFromCart } = useCart(); // You might want a clearCart function in your context

  // Ideally, you would verify the session_id with your backend here
  // and then clear the cart. For now, we'll just show a success message.

  return (
    <div className="font-mono max-w-4xl mx-auto text-center py-20">
      <h1 className="text-4xl font-bold mb-6 text-green-500">Payment Successful!</h1>
      <p className="text-xl mb-8">Thank you for your order.</p>
      <p className="mb-8 text-gray-400">
        We have received your order and will begin processing it shortly.
        <br />
        Session ID: {query.session_id}
      </p>
      <Link
        href="/products"
        className="bg-blue-600 hover:bg-blue-800 px-6 py-3 rounded font-semibold transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
