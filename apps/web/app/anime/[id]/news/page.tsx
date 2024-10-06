// app/anime/[id]/news/page.tsx
"use client"
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchAnimeNews } from '@/lib/animeApi';
import Image from 'next/image';
import Link from 'next/link';

const NewsPage = () => {
  const { id } = useParams(); // Get anime ID from the URL
  const [news, setNews] = useState<any[]>([]); // Store news articles
  const [pagination, setPagination] = useState({ has_next_page: false, last_visible_page: 1 });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch news articles for the anime
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAnimeNews(Number(id), currentPage);
        setNews(data.data);
        setPagination(data.pagination);
      } catch (err) {
        setError('Failed to load news.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentPage]);

  // Handle page change for pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.last_visible_page) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-yellow-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <p className="bg-red-500 p-4 rounded-lg text-center">{error}</p>;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#1f3b6e] to-[#1e2a4f] text-white">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 drop-shadow-md">
        Related News
      </h1>

      {/* News Articles List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article) => (
          <div key={article.mal_id} className="bg-[#2b4c90] rounded-lg p-4 shadow-lg overflow-hidden">
            <Image
              src={article.images?.jpg?.image_url || '/no-image-available.png'}
              alt={article.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-bold text-yellow-400 mb-2">{article.title}</h3>
            <p className="text-gray-300 mb-2">{article.excerpt}</p>
            <p className="text-sm text-gray-400 mb-2">By: {article.author_username} on {new Date(article.date).toLocaleDateString()}</p>
            <Link href={article.url} className="text-blue-300 hover:underline" target='_blank'>
              Read more
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8">
        <button
          className={`px-4 py-2 bg-[#facc15] text-[#4357b5] rounded-lg mr-2 font-semibold ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <button
          className={`px-4 py-2 bg-[#facc15] text-[#4357b5] rounded-lg font-semibold ${!pagination.has_next_page ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!pagination.has_next_page}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NewsPage;
