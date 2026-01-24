import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function CheckoutPage() {
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Checkout failed');
      }

      const { url } = await response.json();
      
      // Redirect to the Stripe Checkout URL provided by the server
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
      
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert('Checkout failed: ' + error.message);
      setLoading(false);
    }
  };

  const total = cart.reduce((acc, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return acc + price * item.quantity;
  }, 0);

  return (
    <div className="font-mono max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">💳 Checkout</h1>
      
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="bg-zinc-900 p-6 rounded border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <ul className="space-y-2 mb-6">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>{item.price}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-700 pt-4 flex justify-between font-bold text-lg mb-6">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Pay with Stripe'}
          </button>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Secure payment processed by Stripe. You will be redirected to complete your purchase.
          </p>
        </div>
      )}
    </div>
  );
}
