import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center px-4 text-center font-mono h-full">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-widest">
        🌌 REINCARNATED.STORE
      </h1>
      <p className="text-lg md:text-xl mb-6">
        The Resistance has a Merch Table Now.
      </p>
      <Link
        href="/products"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-800 rounded-md text-white font-semibold transition"
      >
        🔥 View All Products
      </Link>
    </div>
  );
}
