"use client";
// app/anime/[id]/page.tsx

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchAnimeById, fetchAnimeCharacters, fetchAnimeMoreInfo, fetchAnimeVideos } from '@/lib/animeApi';
import Image from 'next/image';
import Link from 'next/link';

const AnimeDetailsPage = () => {
  const { id } = useParams(); // Get the anime ID from the URL
  const [anime, setAnime] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [characters, setCharacters] = useState<any[]>([]);
  const [loadingCharacters, setLoadingCharacters] = useState<boolean>(false);
  const [errorCharacters, setErrorCharacters] = useState<string | null>(null);

  const [moreInfo, setMoreInfo] = useState<string | null>(null);
  const [loadingMoreInfo, setLoadingMoreInfo] = useState<boolean>(false);
  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false);

  const [trailer, setTrailer] = useState<string | null>(null); // For trailer URL
  const [loadingTrailer, setLoadingTrailer] = useState<boolean>(false);

  const fallbackImage = '/no-image-available.png'; // Fallback image

  // Fetch anime details, characters, and videos when the page loads
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const animeData = await fetchAnimeById(Number(id));
        setAnime(animeData);

        const { characters: characterData } = await fetchAnimeCharacters(Number(id));
        if (characterData) setCharacters(characterData);

        const moreInfoData = await fetchAnimeMoreInfo(Number(id));
        setMoreInfo(moreInfoData.moreinfo);

        // Fetch trailer data
        const videosData = await fetchAnimeVideos(Number(id));
        const trailerData = videosData.promo[0]?.trailer?.embed_url;
        setTrailer(trailerData);
      } catch (err) {
        setError('Failed to load anime details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleMoreInfoClick = () => {
    setShowMoreInfo((prev) => !prev);
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

  if (!anime) {
    return null;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#4357b5] to-[#2b4c90] text-white">
      {/* Anime Details */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="relative">
          <Image
            src={anime.images?.jpg?.large_image_url || fallbackImage}
            alt={anime.title || 'Anime Image'}
            width={600}
            height={900}
            className="rounded-lg shadow-lg object-cover w-full h-[500px] lg:h-[600px] transform hover:scale-105 transition duration-500"
            placeholder="blur"
            blurDataURL={anime.images?.jpg?.small_image_url || fallbackImage}
          />
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 drop-shadow-lg">
            {anime.title || 'No Title Available'}
          </h1>
          <p className="text-gray-200 text-lg leading-relaxed max-w-2xl">
            {anime.synopsis || 'No synopsis available for this anime.'}
          </p>
          <div className="flex space-x-10 items-center">
            <div className="text-2xl">
              <span className="text-[#facc15] font-bold">Score: </span>
              {anime.score || 'N/A'}
            </div>
            <div className="text-2xl">
              <span className="text-[#facc15] font-bold">Episodes: </span>
              {anime.episodes || 'N/A'}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {anime.genres?.map((genre: any) => (
              <span key={genre.mal_id} className="bg-[#2b4c90] text-white py-2 px-4 rounded-full shadow-md">
                {genre.name}
              </span>
            ))}
          </div>

          {/* Watch Trailer Button */}
          {/* {trailer && (
            <Link
              href={`/anime/${id}/trailer`}
              className="inline-block mt-4 px-6 py-3 bg-yellow-400 text-[#4357b5] rounded-lg font-semibold hover:bg-[#eab308] transition-transform transform hover:scale-105"
            >
              Watch Trailer
            </Link>
          )} */}

          {/* More Info Button */}
          <button
            onClick={handleMoreInfoClick}
            className="inline-block text-yellow-400 rounded-lg font-semibold  transition-transform transform hover:scale-105 mt-4"
          >
            {showMoreInfo ? 'Hide Info' : 'Show More Info'}
          </button>

          {/* More Info Section */}
          <div
            className={`${
              showMoreInfo ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
            } transition-all duration-700 overflow-hidden ease-in-out mt-6 p-4 text-gray-200 `}
          >
            {loadingMoreInfo ? (
              <p>Loading more info...</p>
            ) : moreInfo ? (
              <p>{moreInfo}</p>
            ) : (
              <p>No additional information available for this anime.</p>
            )}
          </div>
        </div>
      </div>

      {/* View Related News */}
      <div className="mt-8">
        <Link href={`/anime/${id}/news`} className="inline-block px-6 py-3 bg-[#facc15] text-[#4357b5] rounded-lg font-semibold hover:bg-[#eab308] transition-transform transform hover:scale-105">
          View Related News
        </Link>
      </div>

      {/* Characters Section */}
      <div className="max-w-7xl mx-auto mt-12">
        <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
          Characters & Voice Actors
        </h2>

        {loadingCharacters ? (
          <div className="flex justify-center items-center">
            <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-yellow-400 rounded-full animate-spin"></div>
          </div>
        ) : errorCharacters ? (
          <p className="bg-red-500 p-2 rounded-lg text-center">{errorCharacters}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {characters.map((character: any) => (
              <div
                key={character.character.mal_id}
                className="group relative bg-[#4b62c1] p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
              >
                {/* Character Image */}
                <div className="relative overflow-hidden rounded-lg w-full h-[250px]">
                  <Image
                    src={character.character.images?.jpg?.image_url || fallbackImage}
                    alt={character.character.name}
                    layout="fill"
                    className="w-full h-full object-cover transition-transform transform group-hover:scale-110"
                  />
                </div>

                {/* Character Info */}
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-yellow-400 group-hover:underline">{character.character.name}</h3>
                  <p className="text-gray-300 mt-1">Role: {character.role}</p>
                </div>

                {/* Voice Actors */}
                {character.voice_actors.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-gray-200">Voice Actors</h4>
                    {character.voice_actors.map((actor: any) => (
                      <div key={actor.person.mal_id} className="flex items-center mt-2 space-x-2">
                        <Image
                          src={actor.person.images?.jpg?.image_url || fallbackImage}
                          alt={actor.person.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <p className="text-white">{actor.person.name}</p>
                          <p className="text-gray-400 text-xs">Language: {actor.language}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeDetailsPage;
