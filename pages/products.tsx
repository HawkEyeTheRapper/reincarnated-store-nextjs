import Link from 'next/link';
import { getProducts } from '../utils/products';

export async function getStaticProps() {
  const products = getProducts();
  return {
    props: {
      products,
    },
  };
}

export default function ProductsPage({ products }: { products: any[] }) {
  return (
    <div className="font-mono max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 tracking-wide">🔥 All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="bg-zinc-900 border border-gray-700 rounded-lg p-4 hover:bg-zinc-800 transition block"
          >
            <div className="w-full h-48 bg-gray-800 mb-4 rounded flex items-center justify-center text-gray-500 overflow-hidden">
               {product.image ? (
                 <img
                   src={product.image}
                   alt={product.name}
                   className="w-full h-full object-cover rounded"
                 />
               ) : (
                 <span>No Image</span>
               )}
            </div>
            <h2 className="text-xl font-semibold mt-4">{product.name}</h2>
            <p className="text-blue-400 mt-2">{product.price}</p>
            <p className="text-xs text-gray-500 mt-1">{product.category}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
