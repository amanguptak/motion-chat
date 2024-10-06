"use client";

import React, { useState, FormEvent, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchAnimeSearch, fetchAnimeRecommendations } from "@/lib/animeApi";
import Recommendations from "@/components/recommendation";
import AnimeCard from "@/components/anime-card";
import Link from "next/link";
import { BsChatDotsFill, BsSearch, BsTrash } from "react-icons/bs"; // Icons

const HomePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("query");

  const [query, setQuery] = useState<string>(queryParam || "");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [errorSearch, setErrorSearch] = useState<string | null>(null);

  const [recommendedAnime, setRecommendedAnime] = useState<any[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState<boolean>(false);
  const [errorRecommendations, setErrorRecommendations] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("searchResults");

  const searchHandledRef = useRef(false);

  useEffect(() => {
    if (queryParam && !searchHandledRef.current) {
      searchHandledRef.current = true;
      handleSearchFromURL(queryParam);
    }
  }, [queryParam]);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingSearch(true);
    setErrorSearch(null);
    setSearchResults([]);
    setRecommendedAnime([]);
    setActiveTab("searchResults");

    try {
      const data = await fetchAnimeSearch(query.trim());
      setSearchResults(data);

      if (data.length > 0) {
        const animeId = data[0].mal_id;
        await fetchRecommendations(animeId);
      } else {
        setErrorRecommendations("Search your favorite anime for recommendations.");
      }

      const params = new URLSearchParams();
      params.set("query", query);
      router.push(`/anime-list?${params.toString()}`);
      searchHandledRef.current = true;
    } catch (err) {
      setErrorSearch("Something went wrong. Please try again.");
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSearchFromURL = async (query: string) => {
    setLoadingSearch(true);
    setErrorSearch(null);
    setSearchResults([]);
    setRecommendedAnime([]);
    setActiveTab("searchResults");

    try {
      const data = await fetchAnimeSearch(query.trim());
      setSearchResults(data);

      if (data.length > 0) {
        const animeId = data[0].mal_id;
        await fetchRecommendations(animeId);
      } else {
        setErrorRecommendations("Search your favorite anime for recommendations.");
      }
    } catch (err) {
      setErrorSearch("Something went wrong. Please try again.");
    } finally {
      setLoadingSearch(false);
    }
  };

  const fetchRecommendations = async (animeId: number) => {
    setLoadingRecommendations(true);
    setErrorRecommendations(null);

    try {
      const recommendations = await fetchAnimeRecommendations(animeId);
      setRecommendedAnime(recommendations);
    } catch (err) {
      setErrorRecommendations("Failed to load recommendations.");
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    setSearchResults([]);
    setRecommendedAnime([]);
    setErrorSearch(null);
    setErrorRecommendations(null);
    setActiveTab("searchResults");
    router.push("/anime-list");
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-[#4357b5] text-white">
      
      {/* Secondary Navbar */}
      <nav className="w-full py-4">
        <div className="flex justify-center space-x-8">
          <Link
            href="/top-anime"
            className="text-white hover:text-yellow-400 font-semibold hover:underline"
          >
            Top Anime
          </Link>
          <Link
            href="/schedule"
            className="text-white hover:text-yellow-400 font-semibold hover:underline"
          >
            Schedule Anime
          </Link>
        </div>
      </nav>

      <section className="w-full max-w-5xl mt-8">
        <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-md">
          Search Your Anime
        </h1>
        <form onSubmit={handleSearch} className="w-full max-w-lg mb-6 flex space-x-3">
          <input
            type="text"
            placeholder="Search for an anime (e.g., Attack on Titan)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(e)} // Trigger search on "Enter" key
            className="w-full p-3 rounded-lg shadow-lg bg-[#2b4c90] border-2 border-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200 ease-in-out"
          />
          <button
            type="submit"
            className="p-3 font-semibold rounded-full w-12 h-12 flex items-center justify-center transition duration-300 bg-[#facc15] text-[#4357b5] hover:bg-[#eab308] hover:scale-105"
          >
            {loadingSearch ? "..." : <BsSearch />}
          </button>
          {query && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="p-3 font-semibold rounded-full w-12 h-12 flex items-center justify-center transition duration-300 bg-red-500 text-white hover:bg-red-600 hover:scale-105"
            >
              <BsTrash />
            </button>
          )}
        </form>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("searchResults")}
            className={`font-semibold text-lg transition-colors duration-300 ${
              activeTab === "searchResults"
                ? "text-yellow-400 border-b-2 border-yellow-400"
                : "text-white"
            }`}
          >
            Search Results
          </button>
          <button
            onClick={() => setActiveTab("recommendations")}
            className={`font-semibold text-lg transition-colors duration-300 ${
              activeTab === "recommendations"
                ? "text-yellow-400 border-b-2 border-yellow-400"
                : "text-white"
            }`}
          >
            Recommendations
          </button>
        </div>

        {/* Smooth Transition Between Tabs */}
        <div className={`tab-content transition-opacity duration-500 ease-in-out ${activeTab === "searchResults" ? 'opacity-100' : 'opacity-0'}`}>
          {/* Search Results */}
          {activeTab === "searchResults" && (
            <section className="w-full">
              {loadingSearch && (
                <div className="flex items-center justify-center mt-6">
                  <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-yellow-400"></div>
                </div>
              )}

              {errorSearch && (
                <p className="bg-red-500 p-2 rounded-lg mt-4 text-center">
                  {errorSearch}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                {searchResults.map((anime) => (
                  <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
              </div>

              {!loadingSearch && searchResults.length === 0 && query && !errorSearch && (
                <p className="mt-8 text-center text-[#facc15]">
                  Search your favorite anime to get results!
                </p>
              )}
            </section>
          )}
        </div>

        <div className={`tab-content transition-opacity duration-500 ease-in-out ${activeTab === "recommendations" ? 'opacity-100' : 'opacity-0'}`}>
          {/* Recommendations */}
          {activeTab === "recommendations" && (
            <section className="w-full">
              {loadingRecommendations && (
                <div className="flex items-center justify-center mt-6">
                  <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-yellow-400"></div>
                </div>
              )}

              {errorRecommendations && (
                <p className="bg-red-500 p-2 rounded-lg mt-4 text-center">
                  {errorRecommendations}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                {recommendedAnime.length > 0 && (
                  <Recommendations recommendations={recommendedAnime} />
                )}
              </div>

              {!loadingRecommendations && recommendedAnime.length === 0 && !errorRecommendations && (
                <p className="mt-8 text-center text-[#facc15]">
                  Search your favorite anime for recommendations.
                </p>
              )}
            </section>
          )}
        </div>
      </section>

      {/* Floating Chat Icon */}
      <div className="fixed bottom-5 right-5">
        <Link href="/chat">
          <div className="bg-yellow-400 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out flex items-center justify-center hover:bg-yellow-500">
            <BsChatDotsFill className="text-[#4357b5] text-3xl" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
