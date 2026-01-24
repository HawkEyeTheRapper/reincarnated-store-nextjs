import { Product } from '../utils/products';

export default function ProductDetail({ product }: { product: Product }) {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-10 font-mono max-w-4xl mx-auto">
      <img src={product.image} alt={product.name} className="w-full h-auto rounded mb-6" />
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="text-blue-400 text-xl mb-4">{product.price}</p>
      <p className="mb-6">{product.description}</p>
      <button className="bg-blue-600 hover:bg-blue-800 px-6 py-3 rounded font-semibold">
        🛒 Add to Cart
      </button>
    </div>
  );
}
