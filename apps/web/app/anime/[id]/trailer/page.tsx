// app/anime/[id]/trailer/page.tsx
"use client"

import { useParams } from 'next/navigation';

const TrailerPage = () => {
  const { id } = useParams(); // Get the anime ID from the URL

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#4357b5] to-[#2b4c90] text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 drop-shadow-lg">
        Watch Trailer
      </h1>
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        width="800"
        height="450"
        className="rounded-lg shadow-lg"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default TrailerPage;
