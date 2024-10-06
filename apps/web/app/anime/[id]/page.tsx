'use client'
import { fetchAnimeById } from '@/lib/animeApi';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

// Define the Anime interface here or import it from a types file if shared
interface Anime {
  mal_id: number;
  title: string;
  synopsis: string;
  score: number;
  episodes: number;
  url: string;
  images: {
    jpg: {
      large_image_url: string;
      small_image_url: string;
    };
  };
  genres: {
    mal_id: number;
    name: string;
  }[];
}

const AnimeDetailsPage = () => {
  const { id } = useParams(); // Get the anime ID from the URL
  const [anime, setAnime] = useState<Anime | null>(null); // Use the Anime type for state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data: Anime = await fetchAnimeById(Number(id)); // Ensure the returned data is typed as Anime
        setAnime(data);
      } catch (err) {
        setError('Failed to load anime details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-yellow-400"></div>
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
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#1f3b6e] to-[#1e2a4f] text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Anime Image Section with Blurred Background */}
        <div className="relative">
          {/* Blurred background effect */}
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-30"
            style={{
              backgroundImage: `url(${anime.images?.jpg?.large_image_url || '/default-placeholder.png'})`,
            }}
          ></div>

          {/* Anime Image */}
          <div className="relative z-10">
            <Image
              src={anime.images?.jpg?.large_image_url || '/default-placeholder.png'} // Fallback image
              alt={anime.title || 'Anime Image'} // Fallback for title
              width={600}
              height={900}
              className="rounded-lg shadow-lg object-cover w-full h-[500px] lg:h-[600px] transform hover:scale-105 transition duration-500"
              placeholder="blur"
              blurDataURL={anime.images?.jpg?.small_image_url || '/default-placeholder.png'}
            />
          </div>
        </div>

        {/* Anime Details Section */}
        <div className="relative z-10 flex flex-col justify-center space-y-6">
          {/* Anime Title */}
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 drop-shadow-lg">
            {anime.title || 'No Title Available'}
          </h1>

          {/* Synopsis */}
          <p className="text-gray-200 text-lg leading-relaxed max-w-2xl">
            {anime.synopsis || 'No synopsis available for this anime.'}
          </p>

          {/* Anime Score and Episodes */}
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

          {/* Genres */}
          {anime.genres && anime.genres.length > 0 ? (
            <div className="flex flex-wrap items-center gap-3">
              {anime.genres.map((genre) => (
                <span
                  key={genre.mal_id}
                  className="bg-[#2b4c90] text-white py-2 px-4 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          ) : (
            <p>No genres available.</p>
          )}

          {/* External Link */}
          <div className="mt-6">
            <a
              href={anime.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#facc15] text-[#4357b5] px-6 py-3 rounded-lg inline-block font-semibold hover:bg-[#eab308] transition duration-300 hover:scale-105 shadow-lg"
            >
              View on MyAnimeList
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetailsPage;
