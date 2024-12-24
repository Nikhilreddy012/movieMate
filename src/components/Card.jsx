import { Link } from "react-router-dom";
import Backup from "../assets/react.svg"

const Card = ({movie}) => {
  const {id, original_title, release_date, poster_path} = movie;
  const image = poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : Backup ;

  return (
    <div className="min-w-screen-sm min-h-96 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 m-3">
      {/* <div> */}
        <Link to={`/movie/${id}`}>
            <img className="rounded-t-lg max-h-72" src={image} alt="" />
        </Link>
        <div className="p-1">
            <Link to={`/movie/${id}`}>
                <h5 className="mb-2 max-w-44 font-bold tracking-tight text-gray-900 dark:text-white text-wrap">{original_title}</h5>
            </Link>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{release_date}</p>
        </div>
    </div>
  )
}

export default Card
