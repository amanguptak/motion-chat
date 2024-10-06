// lib/animeApi.ts

// Fetch anime search results
export const fetchAnimeSearch = async (query: string) => {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);
    const data = await response.json();
    return data.data;
  };
  
  // Fetch anime recommendations based on anime ID
  export const fetchAnimeRecommendations = async (id: number) => {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/recommendations`);
    const data = await response.json();
    return data.data;
  };
  
  
  // Fetch anime details by ID
  export const fetchAnimeById = async (id: number) => {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
    const data = await response.json();
    return data.data;
  };
  