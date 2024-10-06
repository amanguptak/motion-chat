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
  
  // lib/animeApi.ts
// lib/animeApi.ts

export const fetchAnimeCharacters = async (animeId: number, eTag: string | null = null) => {
  const headers: HeadersInit = eTag ? { 'If-None-Match': eTag } : {};

  const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/characters`, {
    headers,
  });

  if (response.status === 304) {
    return { characters: null, eTag: eTag }; // No new data, use cached data
  }

  const data = await response.json();
  const newETag = response.headers.get('ETag'); // Extract the ETag from the response headers

  return { characters: data.data, eTag: newETag };
};


// lib/animeApi.ts

// lib/animeApi.ts

export const fetchAnimeNews = async (animeId: number, page: number = 1) => {
  const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/news?page=${page}`);
  const data = await response.json();
  return data;
};
// lib/animeApi.ts

// lib/animeApi.ts

export const fetchTopAnime = async (page: number = 1) => {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}`);
    if (!response.ok) {
      console.error('Error in API response:', response.status, response.statusText);
      throw new Error('Failed to fetch top anime');
    }
    const data = await response.json();
    console.log('Top anime data:', data); // Log the data for debugging
    return data;
  } catch (error) {
    console.error('Error fetching top anime:', error); // Log the error
    throw error;
  }
};


export const fetchAnimeMoreInfo = async (id: number) => {
  const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/moreinfo`);
  const data = await response.json();
  return data.data; // Returns { moreinfo: string }
};

// lib/animeApi.ts

// Fetch anime videos (trailers, episodes, and music videos)
export const fetchAnimeVideos = async (id: number) => {
  const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/videos`);
  const data = await response.json();
  return data.data;
};

// lib/animeApi.ts

export const fetchSchedules = async (
  filter: string = "monday",
  kids: string = "false",
  sfw: string = "true",
  page: number = 1,
  limit: number = 25
) => {
  const response = await fetch(
    `https://api.jikan.moe/v4/schedules?filter=${filter}&kids=${kids}&sfw=${sfw}&page=${page}&limit=${limit}`
  );
  const data = await response.json();
  return data.data;
};
