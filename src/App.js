import React, { useState, useCallback, useEffect } from 'react';
import AddMovie from './components/AddMovie';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async() => {
    setIsLoading(true);
    setError(null);
    console.log('fetchMoviesHandler');

    try {
      const response = await fetch('https://react-movies-41534-default-rtdb.firebaseio.com/movies.json')

      if (!response.ok) {
        throw new Error('Somthing went wrong');
      }
      const data = await response.json();

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].oepningText,
          releaseData: data[key].releaseData
        });
      }

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    console.log('useEffect');
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);


  async function addMovieHandler(movie) {
    const response = await fetch('https://react-movies-41534-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();

    console.log(data);
  }

  let content = <p>Found no movies</p>;

  if(error) {
    content  = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
      {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
      {!isLoading && movies.length == 0 && !error && content}
      {!isLoading && error && content}
      {isLoading && content}
      </section>
    </React.Fragment>
  );
}

export default App;
