"use client"
import { useState, useEffect, useCallback } from 'react';
import { fetchTopAnime } from '@/lib/animeApi';
import AnimeCard from '@/components/anime-card';

const TopAnime = () => {
  const [topAnime, setTopAnime] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ has_next_page: false, last_visible_page: 1 });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchTopAnime(currentPage);
        setTopAnime(data.data);
        setPagination(data.pagination);
      } catch (err) {
        setError('Failed to load top anime.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= pagination.last_visible_page) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pagination.last_visible_page]);

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
    <div className="min-h-screen  flex flex-col items-center p-6 text-white">
  <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 drop-shadow-md">
         Top Anime For You
        </h1>
      {/* Top Anime Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {topAnime.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-12 space-x-4">
        <button
          className={`px-5 py-2 bg-[#facc15] text-[#4357b5] rounded-full font-semibold transition-all duration-300 hover:bg-yellow-500 hover:scale-105 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <button
          className={`px-5 py-2 bg-[#facc15] text-[#4357b5] rounded-full font-semibold transition-all duration-300 hover:bg-yellow-500 hover:scale-105 ${!pagination.has_next_page ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!pagination.has_next_page}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TopAnime;
