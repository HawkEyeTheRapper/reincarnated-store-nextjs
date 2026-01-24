import { useCart } from '../context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  return (
    <div className="font-mono max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🛒 Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center py-10">
          <p className="mb-4">Your cart is empty.</p>
          <Link href="/products" className="text-blue-400 hover:underline">
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-4 mb-8">
            {cart.map((item) => (
              <li key={item.id} className="border-b border-gray-700 pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-blue-400">{item.price}</p>
                  <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-400 transition"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="text-right">
             <Link
               href="/checkout"
               className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-semibold transition inline-block"
             >
               Proceed to Checkout
             </Link>
          </div>
        </>
      )}
    </div>
  );
}
