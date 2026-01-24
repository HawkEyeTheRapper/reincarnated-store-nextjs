import { useRouter } from 'next/router';

export default function PostDetail() {
  const { query } = useRouter();

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10 font-mono max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📘 Post: {query.slug}</h1>
      <p>This is a placeholder for blog/lore post content.</p>
    </div>
  );
}
