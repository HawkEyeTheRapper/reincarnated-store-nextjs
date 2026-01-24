import Link from 'next/link';
import { Product } from '../utils/products';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="bg-zinc-900 border border-gray-700 rounded-lg p-4 hover:bg-zinc-800 transition block"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover mb-4 rounded"
      />
      <h2 className="text-xl font-semibold">{product.name}</h2>
      <p className="text-blue-400 mt-2">{product.price}</p>
    </Link>
  );
}
