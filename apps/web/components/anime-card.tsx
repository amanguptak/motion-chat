"use client";

import Image from 'next/image';
import Link from 'next/link';

interface AnimeCardProps {
  anime: {
    mal_id: number;
    title: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
    synopsis: string;
    score: number;
  };
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  return (
    <Link href={`/anime/${anime.mal_id}`} className="block w-full h-full">
      <div className="relative bg-[#4b62c1] rounded-xl shadow-lg transition-transform duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden">
        {/* Anime Image */}
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={anime.images.jpg.image_url}
            alt={anime.title}
            width={350}
            height={500}
            className="w-full h-72 object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>

        {/* Anime Info */}
        <div className="p-4">
          <h2 className="text-xl font-semibold text-yellow-400 mb-2 truncate">{anime.title}</h2>
          <p className="text-gray-300 line-clamp-2 mb-3">{anime.synopsis?.substring(0, 100)}...</p>
          <div className="flex justify-between items-center">
            <p className="text-yellow-400 font-semibold">Score: {anime.score || 'N/A'}</p>
            <span className="text-sm text-yellow-300 font-semibold hover:text-yellow-400 transition-all">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;
