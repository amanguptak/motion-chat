// components/recommendation.tsx

import AnimeCard from '@/components/anime-card';

interface RecommendationProps {
  recommendations: {
    entry: {
      mal_id: number;
      url: string;
      images: {
        jpg: {
          image_url: string;
        };
      };
      title: string;
    };
  }[];
}

const Recommendations: React.FC<RecommendationProps> = ({ recommendations }) => {
  return (
    <>
      {recommendations.map((rec) => (
        <AnimeCard
          key={rec.entry.mal_id}
          anime={{
            mal_id: rec.entry.mal_id,
            title: rec.entry.title,
            images: { jpg: { image_url: rec.entry.images.jpg.image_url } },
            synopsis: '',
            score: 0, // No score in recommendations, can leave it blank
          }}
        />
      ))}
    </>
  );
};

export default Recommendations;
