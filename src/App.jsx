import Navbar from './components/Navbar'
import MovieList from './pages/MovieList'
import MovieDetail from './pages/MovieDetail'
import Search from './pages/Search'
import PageNotFound from './pages/PageNotFound'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className='bg-white dark:bg-black'>
      <Navbar />
      <Routes>
      <Route path="/" element={<MovieList title="Home" />} />
      {/* <Route path="movies/popular" element={<MovieList apiPath="movie/popular" title="Popular" />} />
      <Route path="movies/top" element={<MovieList apiPath="movie/top_rated" title="Top Rated" />} />
      <Route path="movies/upcoming" element={<MovieList apiPath="movie/upcoming" title="Upcoming" />} /> */}
      <Route path="movie/:id" element={<MovieDetail />} />
      <Route path="search" element={<Search apiPath="search/movie" />} />
      <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  )
}

export default App
