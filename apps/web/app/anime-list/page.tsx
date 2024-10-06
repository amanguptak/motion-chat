"use client";

// app/page.tsx

import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchAnimeSearch, fetchAnimeRecommendations } from '@/lib/animeApi';
import Recommendations from '@/components/recommendation';
import AnimeCard from '@/components/anime-card';

const HomePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const queryParam = searchParams.get('query'); // Retrieve query from the URL search params
  
  const [query, setQuery] = useState<string>(queryParam || '');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [errorSearch, setErrorSearch] = useState<string | null>(null);

  const [recommendedAnime, setRecommendedAnime] = useState<any[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState<boolean>(false);
  const [errorRecommendations, setErrorRecommendations] = useState<string | null>(null);

  // Ref to track if the form search is being handled to prevent double search on initial load
  const searchHandledRef = useRef(false);

  // Populate search results if query is in the URL
  useEffect(() => {
    if (queryParam && !searchHandledRef.current) {
      // Only search if the query is in the URL and hasn't been handled yet by the form
      searchHandledRef.current = true;
      handleSearchFromURL(queryParam);
    }
  }, [queryParam]);

  // Fetch anime search results
  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingSearch(true);
    setErrorSearch(null);
    setSearchResults([]);
    setRecommendedAnime([]);

    try {
      const data = await fetchAnimeSearch(query.trim());
      setSearchResults(data);

      // If results found, fetch recommendations
      if (data.length > 0) {
        const animeId = data[0].mal_id;
        await fetchRecommendations(animeId);
      } else {
        setErrorRecommendations('No recommendations available.');
      }

      // Push the search term to the URL query parameters
      const params = new URLSearchParams();
      params.set('query', query);
      router.push(`/anime-list?${params.toString()}`);

      // Mark search as handled to prevent double search
      searchHandledRef.current = true;
    } catch (err) {
      setErrorSearch('Something went wrong. Please try again.');
    } finally {
      setLoadingSearch(false);
    }
  };

  // Search based on URL query param
  const handleSearchFromURL = async (query: string) => {
    setLoadingSearch(true);
    setErrorSearch(null);
    setSearchResults([]);
    setRecommendedAnime([]);

    try {
      const data = await fetchAnimeSearch(query.trim());
      setSearchResults(data);

      if (data.length > 0) {
        const animeId = data[0].mal_id;
        await fetchRecommendations(animeId);
      } else {
        setErrorRecommendations('No recommendations available.');
      }
    } catch (err) {
      setErrorSearch('Something went wrong. Please try again.');
    } finally {
      setLoadingSearch(false);
    }
  };

  // Fetch recommendations
  const fetchRecommendations = async (animeId: number) => {
    setLoadingRecommendations(true);
    setErrorRecommendations(null);

    try {
      const recommendations = await fetchAnimeRecommendations(animeId);
      setRecommendedAnime(recommendations);
    } catch (err) {
      setErrorRecommendations('Failed to load recommendations.');
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // Clear search functionality
  const handleClearSearch = () => {
    setQuery(''); // Clear the input field
    setSearchResults([]); // Clear the search results
    setRecommendedAnime([]); // Clear recommendations
    setErrorSearch(null);
    setErrorRecommendations(null);

    // Remove query parameter from the URL
    router.push('/anime-list');
  };

  return (
    <div className="min-h-screen bg-[#4357b5] flex flex-col items-center p-6 text-white">
      {/* Search Section */}
      <section className="w-full max-w-4xl mt-10">
        <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 drop-shadow-md">
          Search Your Anime
        </h1>
        <form onSubmit={handleSearch} className="w-full max-w-lg mb-6 flex space-x-3">
          <input
            type="text"
            placeholder="Search for an anime (e.g., Attack on Titan)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 rounded-lg shadow-lg bg-[#2b4c90] border-2 border-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200 ease-in-out"
          />
          <button
            type="submit"
            className="p-3 font-semibold rounded-lg transition duration-300 bg-[#facc15] text-[#4357b5] hover:bg-[#eab308] hover:scale-105"
          >
            {loadingSearch ? 'Searching...' : 'Search'}
          </button>
          {query && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="p-3 font-semibold rounded-lg transition duration-300 bg-red-500 text-white hover:bg-red-600 hover:scale-105"
            >
              Clear
            </button>
          )}
        </form>

        {loadingSearch && (
          <div className="flex items-center justify-center mt-6">
            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-yellow-400"></div>
          </div>
        )}

        {errorSearch && (
          <p className="bg-red-500 p-2 rounded-lg mt-4 text-center">{errorSearch}</p>
        )}

        {/* Search Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {searchResults.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>

        {!loadingSearch && searchResults.length === 0 && query && !errorSearch && (
          <p className="mt-8 text-center text-[#facc15]">No results found for "{query}".</p>
        )}
      </section>

      {/* Recommendations Section */}
      <section className="w-full max-w-4xl mt-10">
        <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 drop-shadow-md">
          Recommended Anime Based on Your Search
        </h1>

        {loadingRecommendations && (
          <div className="flex items-center justify-center mt-6">
            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-yellow-400"></div>
          </div>
        )}

        {errorRecommendations && (
          <p className="bg-red-500 p-2 rounded-lg mt-4 text-center">{errorRecommendations}</p>
        )}

        {!loadingRecommendations && recommendedAnime.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
            <Recommendations recommendations={recommendedAnime} />
          </div>
        )}

        {!loadingRecommendations && recommendedAnime.length === 0 && !errorRecommendations && (
          <p className="mt-8 text-center text-[#facc15]">No recommendations available.</p>
        )}
      </section>
    </div>
  );
};

export default HomePage;
