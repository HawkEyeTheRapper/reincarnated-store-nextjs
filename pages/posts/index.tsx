import Link from 'next/link';

const mockPosts = [
  { title: 'Welcome to the Resistance', slug: 'welcome' },
  { title: 'Max Spiers & The Hidden War', slug: 'max-spiers' },
];

export default function PostsPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-10 font-mono max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📖 Lore & Drops</h1>
      <ul className="space-y-4">
        {mockPosts.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/${post.slug}`} className="text-blue-400 hover:underline text-xl">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
