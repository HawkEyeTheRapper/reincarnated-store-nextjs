import { useRouter } from 'next/router';
import { useCart } from '../../context/CartContext';
import { getProducts, Product } from '../../utils/products';

export async function getStaticPaths() {
  const products = getProducts();
  const paths = products.map((product) => ({
    params: { slug: product.slug }, // slug is now the SKU
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const products = getProducts();
  // Find product by SKU (which is now mapped to slug)
  const product = products.find((p) => p.slug === params.slug);

  return {
    props: {
      product,
    },
  };
}

export default function ProductDetailPage({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();

  if (router.isFallback) {
    return (
      <div className="text-center text-white py-20 font-mono">
        <p>Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center text-white py-20 font-mono">
        <p>Product not found.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
    alert('Added to cart!');
  };

  return (
    <div className="font-mono max-w-4xl mx-auto">
      <div className="w-full h-96 bg-gray-800 mb-6 rounded flex items-center justify-center text-gray-500 overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-contain rounded" />
          ) : (
            <span>No Image Available</span>
          )}
      </div>
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="text-blue-400 text-xl mb-4">{product.price}</p>
      <p className="mb-6">{product.description}</p>
      
      {product.audio && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Audio Preview</h3>
          <audio controls src={product.audio} className="w-full" />
        </div>
      )}

      {product.lyrics && (
        <div className="mb-6 p-4 bg-zinc-900 rounded border border-gray-700">
          <h3 className="text-lg font-semibold mb-2">Lyrics</h3>
          <pre className="whitespace-pre-wrap font-sans text-sm text-gray-300">{product.lyrics}</pre>
        </div>
      )}

      <button
        onClick={handleAddToCart}
        className="bg-blue-600 hover:bg-blue-800 px-6 py-3 rounded font-semibold transition"
      >
        🛒 Add to Cart
      </button>
    </div>
  );
}
