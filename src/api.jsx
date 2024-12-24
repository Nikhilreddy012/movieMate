// src/api.js
import axios from 'axios';

const getMovies = async () => {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
      params: {
        api_key: import.meta.env.VITE_APP_API_KEY,
        language: 'en-US',
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
};

const getMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: {
        api_key: import.meta.env.VITE_APP_API_KEY,
        language: 'en-US',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
  }
};

export { getMovies, getMovieDetails };
