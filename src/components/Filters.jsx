import { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FilterBox = ({ setFilters, setBackPage, setBackMovies }) => {
  const [genres, setGenres] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedCertification, setSelectedCertification] = useState([]);
  const [scoreRange, setScoreRange] = useState([0, 10]);

  const endDate = Date.now()

  // Fetch genres, certifications, and languages
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
          params: { api_key: import.meta.env.VITE_APP_API_KEY },
        });
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    const fetchCertifications = async () => {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/certification/movie/list', {
          params: { api_key: import.meta.env.VITE_APP_API_KEY },
        });
        const certs = response.data.certifications.US.map(cert => cert.certification)
        setCertifications(certs);  // Assuming US certifications
      } catch (error) {
        console.error('Error fetching certifications:', error);
      }
    };

    fetchGenres();
    fetchCertifications();
  }, []);

  const handleStartDateChange = (startDate) => {
    const date = new Date(startDate)
    const newDate = `${date.getFullYear()}-${date.getMonth}-${date.getDate()}`
    // const month = date.getMonth() + 1
    // const day = date.getDate()
    // const d = day <= 9 ? `0${day}` : day
    setStartDate(newDate)
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenres((prevSelectedGenres) => {
      const newSelectedGenres = [...prevSelectedGenres];
      const index = newSelectedGenres.indexOf(genreId);
      if (index === -1) {
        newSelectedGenres.push(genreId);
      } else {
        newSelectedGenres.splice(index, 1);
      }
      return newSelectedGenres;
    });
  };

  const handleCertificationChange = (cert) => {
    setSelectedCertification(prev => {
      const newCerts = [...prev]
      const index = newCerts.indexOf(cert)
      if(index === -1) {
        newCerts.push(cert)
      } else {
        newCerts.splice(index, 1)
      }
      return newCerts
    });
  };

  const handleScoreChange = (e) => {
    const newScoreRange = e.target.value.split(',').map(Number);
    setScoreRange(newScoreRange);
  };

  const handleFilters = () => {
    setFilters({
      date: {startDate, endDate},
      scoreRange,
      genres: selectedGenres.join(','),
      certification: selectedCertification.join('|')
    })
    setBackPage(1)
    setBackMovies([])
  }

  return (
    <div className="bg-white dark:bg-black text-slate-950 mt-3 dark:border-gray-400 dark:shadow-slate-400 dark:shadow-xl rounded-lg shadow-2xl h-fit divide-y-2">
      {/* Date Range Section */}
      <div className='px-6 py-4'>
        <h3 className="mb-3 text-gray-800 font-light dark:text-white">Release Dates</h3>
        <div className="space-y-2">
          <div className='flex flex-row justify-between'>
            <p className='content-center dark:text-white'>From</p>
            <DatePicker
            selected={startDate}
            
            onChange={handleStartDateChange}
            placeholderText="Start Date"
            className="w-full p-2 bg-white text-gray-800 dark:bg-black dark:text-white dark:border-slate-700 border-slate-400 border-[1px] rounded-md"
            dateFormat="yyyy-MM-dd"
          />
          </div>
          <div className='flex flex-row justify-between'>
            <p className='content-center dark:text-white'>To</p>
            <DatePicker
            selected={endDate}
            placeholderText="End Date"
            readOnly
            className="w-full p-2 bg-white text-gray-800 dark:bg-black dark:text-white dark:border-slate-700 rounded-md border-slate-400 border-[1px]"
            dateFormat="yyyy-MM-dd"
            value={endDate}
          />
          </div>
        </div>
      </div>

      {/* Genres Section */}
      <div className='px-6 py-4'>
        <h3 className="mb-3 text-gray-800 font-light dark:text-white">Genres</h3>
        <div className="">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreChange(genre.id)}
              className={`py-1 px-3 text-center w-fit text-sm mr-2 mb-2 rounded-3xl ${
                selectedGenres.includes(genre.id) ? 'bg-[#01b3e4] text-white border-slate-400 dark:border-gray-700 border-[1px]' : 'bg-white text-gray-800 dark:bg-black dark:text-white dark:border-gray-700 border-slate-400 border-[1px]'
              } hover:bg-[#01b3e4] hover:text-white transition`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {/* Certification Section */}
      <div className='px-6 py-4'>
        <h3 className="mb-3 text-gray-800 font-light dark:text-white">Certification</h3>
        {certifications.map((certification) => (
            <button
              key={certification}
              onClick={() => handleCertificationChange(certification)}
              className={`py-1 px-3 text-center w-fit text-sm mr-2 mb-2 rounded-3xl ${
                selectedCertification.includes(certification) ? 'bg-[#01b3e4] text-white border-slate-400 dark:border-gray-700 border-[1px]' : 'bg-white text-gray-800 dark:bg-black dark:text-white dark:border-gray-700 border-slate-400 border-[1px]'
              } hover:bg-[#01b3e4] hover:text-white transition`}
            >
              {certification}
            </button>
          ))}
      </div>

      {/* User Score Section */}
      <div className='px-6 py-4'>
        <h3 className="text-gray-800 font-light mb-3 dark:text-white">User Score</h3>
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={scoreRange[0]}
          onChange={handleScoreChange}
          className="w-full rounded-full cursor-pointer"
        />
        <div className="flex justify-between text-sm">
          <span className='dark:text-white'>Min: {scoreRange[0]}</span>
          <span className='dark:text-white'>Max: {scoreRange[1]}</span>
        </div>
      </div>
      <button className='bg-[#01b3e4] w-full py-3 rounded-md text-lg text-white' onClick={handleFilters}>Search</button>
    </div>
  );
};

export default FilterBox;
