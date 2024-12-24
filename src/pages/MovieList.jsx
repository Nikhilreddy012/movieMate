import Card from "../components/Card";
import { useState, useEffect, useCallback } from "react";
import Filters from "../components/Filters";


const MovieList = () => {

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    date: { startDate: '', endDate: '' },
    genres: '',
    certification: '',
    scoreRange: [0, 10],
  });


  // Function to fetch movies


  // Scroll handler to load more movies when user reaches the bottom
  const handleScroll = useCallback(() => {
    const bottom = window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight;
    if (bottom && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchMovies = async (page) => {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_APP_API_KEY}&include_adult=false&include_video=false
      &language=en-US&page=${page}&with_genres=${filters.genres}&certification=${filters.certification}&certification_country=US
      &vote_average.gte=${filters.scoreRange[0]}&vote_average.lte=10&release_date.gte=${filters.date.startDate}&release_date.lte=${filters.date.endDate}`
      setLoading(true);
      try {
        const response = await fetch(url, {signal});
        const data = await response.json();
        if (data.results.length > 0) {
          setMovies((prevMovies) => [...prevMovies, ...data.results]);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies(page);
    return () => controller.abort()
  }, [page, filters.genres, filters.certification, filters.scoreRange, filters.date]);


  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <main>
      <section className="max-w-7xl mx-auto py-7">
        <div className="grid grid-cols-[25%_75%] gap-4">
          <Filters setFilters={setFilters} setBackPage={setPage} setBackMovies={setMovies}/>
          <div className="flex justify-start flex-wrap other:justify-evenly">       
          { movies.map((movie) => (
            <Card key={movie.id} movie={movie} />
          )) }          
        </div>
        </div>

      </section>
      {/* {loading && <p>Loading...</p>}
      {!hasMore && <p>No more items to load.</p>} */}
    </main>
  )
}

export default MovieList
