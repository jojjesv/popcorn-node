import fetch from 'node-fetch';
import Movie from '../Movie';
import ImdbMovie from '../ImdbMovie';

const apiKey = '931ea17';
const baseUrl = `http://www.omdbapi.com/?apikey=${apiKey}`;

/**
 * Communication with the IMdB API.
 * @author Johan Svensson
 */
export const fetchMovie = async (id: string): Promise<ImdbMovie> => {
  let result: any = await fetch(`${baseUrl}&i=${encodeURIComponent(id)}`);
  result = await result.json();

  if (result.Response == "False") {
    throw {
      result: 'noMatch'
    };
  }

  return {
    id,
    ageRating: result.Rated,
    title: result.Title,
    year: parseInt(result.Year),
    pictureUri: result.Poster,
    plot: result.Plot,
    runtime: parseInt(result.Runtime),
    score: parseFloat(result.imdbRating)
  }
};