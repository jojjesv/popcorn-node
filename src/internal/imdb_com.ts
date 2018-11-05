import fetch from 'node-fetch';
import Movie from '../Movie';
import ImdbMovie from '../ImdbMovie';
import Actor from '../Actor';

const apiKey = '931ea17';
const baseUrl = `http://www.omdbapi.com/?apikey=${apiKey}`;

/**
 * Communication with the IMdB API.
 * @author Johan Svensson
 */
export const fetchMovie = async (id: string): Promise<{ result: ImdbMovie | string }> => {
  let url = `${baseUrl}&i=${encodeURIComponent(id)}`;
  console.log("Requesting", url);

  let result: any = await fetch(`${baseUrl}&i=${encodeURIComponent(id)}`);
  result = await result.json();

  if (result.Response == "False") {
    return {
      result: 'noMatch'
    };
  }

  filterMovie(result);

  let cast = getCast(result);
  let categories = (result.Genre || "").split(",").map(c => c.trim());

  return {
    result: {
      cast,
      categories,
      imdbId: id,
      ageRating: result.Rated,
      title: result.Title,
      year: parseInt(result.Year),
      pictureUri: result.Poster,
      plot: result.Plot,
      runtime: parseInt(result.Runtime),
      score: parseFloat(result.imdbRating)
    }
  }
};

/**
 * Filters bad items from the movie.
 */
const filterMovie = (movie) => {
  ["Rated", "Poster", "imdbRating"].forEach(k => {
    if (movie[k] == "N/A") {
      movie[k] = null;
    }
  });

  ["Runtime", "Year"].forEach(k => {
    let num = parseInt(movie[k]);
    if (isNaN(num)) {
      movie[k] = null;
    } else {
      movie[k] = num;
    }
  })
}

function getCast(imdbMovieResult: any): Actor[] {
  function fromString(str: string): Actor[] {
    if (!str || /N\/A/i.test(str)) {
      return [];
    }
    return str.split(",").map(name => new Actor(name.replace(/\(.+\)/g, '').trim(), null));
  }

  let actors = fromString(imdbMovieResult.Actors);
  actors.forEach(actor => actor.role = 'cast');

  let writers = fromString(imdbMovieResult.Writer);
  actors.forEach(actor => actor.role = 'writer');

  let director = fromString(imdbMovieResult.Director);
  actors.forEach(actor => actor.role = 'director');

  return [
    ...actors,
    ...writers,
    ...director
  ]
}