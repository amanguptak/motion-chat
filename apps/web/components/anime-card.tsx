// components/anime-card.tsx
"use client"
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
    <Link href={`/anime/${anime.mal_id}`}>
      <div className="bg-[#2b4c90] rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300 hover:shadow-xl cursor-pointer overflow-hidden">
        <img
          src={anime.images.jpg.image_url}
          alt={anime.title}
          className="w-full h-56 object-cover rounded-t-lg"
        />
        <div className="p-4">
          <h2 className="text-2xl font-bold text-[#facc15] mb-2 truncate">{anime.title}</h2>
          <p className="text-gray-200 line-clamp-2">{anime.synopsis?.substring(0, 120)}...</p>
          <p className="text-[#facc15] mt-3">Score: {anime.score}</p>
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;
