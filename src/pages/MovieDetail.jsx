import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MdPlayCircleOutline } from "react-icons/md";
import axios from "axios";
import YouTubeModal from "../components/YoutubeModal";

const MovieDetail = () => {
  const params = useParams();
  const [movie, setMovie] = useState({});
  const [color, setColor] = useState('');
  const [bgUrl, setBgUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoId, setVideoId] = useState('')
  const [loadingMovie, setLoadingMovie] = useState(true)
  const [loadingColor, setLoadingColor] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const BACKGROUND_BASE_URL = 'https://image.tmdb.org/t/p/original/'
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500/'

  const duration = movie ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime%60} m` : ''

  useEffect(() => {
    async function fetchMovie(){
      try {
        const movieDetailsPromise = axios.get(`https://api.themoviedb.org/3/movie/${params.id}?api_key=${import.meta.env.VITE_APP_API_KEY}`)
        const videosPromise = axios.get(`https://api.themoviedb.org/3/movie/${params.id}/videos?api_key=${import.meta.env.VITE_APP_API_KEY}`)

        const [movieDetails, videos] = await Promise.all([movieDetailsPromise, videosPromise])

        const video = videos.data.results.find(video => video.type === 'Trailer')
        const id = video ? video.key : ''
        const movieBgUrl = `${BACKGROUND_BASE_URL}${movieDetails.data.backdrop_path}`
        const imageUrl = `${IMAGE_BASE_URL}${movieDetails.data.poster_path}`


        setMovie(movieDetails.data)
        setVideoId(id)
        setBgUrl(movieBgUrl)
        setImageUrl(imageUrl)
        setLoadingMovie(false)
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setLoadingMovie(false)
      }
    }
    fetchMovie();
  }, [params.id]);

  useEffect(() => {
    const extractColor = async () => {
      try {
        const response = await axios.get(
          `https://nikhil-moviemate.netlify.app/.netlify/functions/getDominantColor?imageUrl=${encodeURIComponent(
            bgUrl
          )}`
        );

        console.log('response', response)

        const dominantColor = response.data.hexColor

        console.log('dominant', dominantColor)

        if (dominantColor) {
          setColor(dominantColor); // Set the dominant color
          setLoadingColor(false)
        }
      } catch (error) {
        console.error('Error extracting color:', error);
        setLoadingColor(false)
      }
    };

    if (bgUrl) {
      extractColor(); // Trigger extraction when imageUrl changes
    }
  }, [bgUrl]);

  if(loadingColor || loadingMovie) return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse">
      {/* Animated Gradient Loader */}
      <div className="flex items-center space-x-2">
        <div className="w-12 h-12 border-8 border-white border-t-transparent rounded-full animate-spin"></div>
        <span className="text-lg text-white">Loading...</span>
      </div>
    </div>
  )

  return (
    <main>
    {color && <div className="relative w-full min-h-96"  style={{backgroundColor: color ? color : '#fefefe'}}>
      <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center object-fill bg-no-repeat opacity-20 z-0" style={{backgroundImage: `url(${bgUrl})`}}></div>
      <div className="relative z-10 p-8 flex text-white gap-10">
      <div className="max-w-sm">
        <img className="rounded border border-stone-700" src={imageUrl} alt={movie.title} style={{opacity: 1}}/>
      </div>
      <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold">{movie.title}</h1>
      <div className="flex flex-row gap-2">
      <p>{movie.release_date}</p>
      <p>({movie.origin_country ? movie.origin_country[0] : ''})</p>
      <p>{duration}</p>
      </div>
      { movie.genres ? (
      <p className="flex flex-wrap gap-2">
      { movie.genres.map((genre) => (
        <span className="mr-2 border border-gray-200 rounded dark:border-gray-600 p-2" key={genre.id}>{genre.name}</span>
      )) }
    </p>
    ) : "" }
    <div className="flex flex-col gap-2">
      <p className="text-xl font-bold">Overview</p>
      <p>{movie.overview}</p>
    </div>
    <button className="border border-gray-200 rounded max-w-36 p-2 flex flex-row gap-2" onClick={() => setIsModalOpen(true)}>
      <MdPlayCircleOutline size={25}/> Play Trailer
      </button>
      {isModalOpen && videoId && (
        <YouTubeModal trailerKey={videoId} onClose={() => setIsModalOpen(false)} />
      )}
      </div>
      </div>
    </div>}
    </main>
  )
}

export default MovieDetail
