"use client"

import React, { useState, FormEvent } from 'react';

interface Anime {
  mal_id: number;
  title: string;
  synopsis: string;
  score: number;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

const AnimeSearch: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to handle the search
  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);

    const formattedQuery = query.trim().replace(/\s+/g, '-').toLowerCase();

    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${formattedQuery}`);
      const data = await response.json();

      if (response.ok) {
        setResults(data.data as Anime[]); // Cast response to Anime[] type
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#4357b5] flex flex-col items-center p-6 text-white">
      <h1 className="text-4xl font-bold mb-6">Anime Search</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="w-full max-w-lg">
        <input
          type="text"
          placeholder="Search for an anime (e.g., Attack on Titan)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg shadow-md bg-[#2b4c90] border-2 border-transparent text-white placeholder-gray-300 focus:outline-none focus:border-[#facc15]"
        />
        <button
          type="submit"
          className="w-full p-3 font-semibold rounded-lg transition duration-300 bg-[#facc15] text-[#4357b5] hover:bg-[#eab308] hover:scale-105"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Loader */}
      {loading && (
        <div className="flex items-center justify-center mt-6">
          <svg
            className="animate-spin h-10 w-10"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            style={{ color: '#facc15' }}
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
        </div>
      )}

      {/* Error Handling */}
      {error && (
        <p className="bg-red-500 p-2 rounded-lg mt-4 text-center">
          {error}
        </p>
      )}

      {/* Results */}
      <div className="w-full max-w-4xl mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((anime) => (
          <div
            key={anime.mal_id}
            className="rounded-lg p-4 bg-[#2b4c90] hover:scale-105 transform transition duration-300 shadow-lg"
          >
            <img
              src={anime.images.jpg.image_url}
              alt={anime.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-bold text-[#facc15]">{anime.title}</h2>
            <p className="text-gray-200 mt-2">{anime.synopsis?.substring(0, 100)}...</p>
            <p className="text-[#facc15] mt-2">Score: {anime.score}</p>
          </div>
        ))}
      </div>

      {/* No Results */}
      {!loading && results.length === 0 && query && !error && (
        <p className="mt-8 text-center text-[#facc15]">No results found for "{query}".</p>
      )}
    </div>
  );
};

export default AnimeSearch;
