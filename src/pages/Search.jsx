import { useSearchParams } from "react-router-dom";
import { useTitle } from "../hooks/useTitle";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import axios from "axios";

const Search = () => {
  const [searchParams] = useSearchParams();
  const queryTerm = searchParams.get("q");
  const [movies, setMovies] = useState([])
  const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_APP_API_KEY}&query=${queryTerm}`

  useEffect(() => {
    const searchMovie = async () => {
        try {
            const response = await axios.get(searchUrl) 
                const moviesList = response.data.results
                setMovies(moviesList)
            }
        catch (error) {
            console.error('Could not find the movie', error)
        }
}
    searchMovie()
  }, [searchUrl])

  useTitle(`Search result for ${queryTerm}`);

  return (
    <main>
      <section className="py-7">
        <p className="text-3xl text-gray-700 dark:text-white">{ movies.length === 0 ? `No result found for '${queryTerm}'` : `Result for '${queryTerm}'` }</p>
      </section>
      <section className="max-w-7xl mx-auto py-7">
        <div className="flex justify-start flex-wrap">       
          { movies.map((movie) => (
            <Card key={movie.id} movie={movie} />
          )) }          
        </div>
      </section>
    </main>
  )
}
export default Search
