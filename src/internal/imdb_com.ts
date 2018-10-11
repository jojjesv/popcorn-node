import fetch from 'node-fetch';
import Movie from '../Movie';

const apiKey = '931ea17';
const baseUrl = `http://www.omdbapi.com/?apikey=${apiKey}`;

/**
 * Communication with the IMdB API.
 * @author Johan Svensson
 */
export const fetchMovie = async (id: string): Promise<Movie> => {
  let result: any = await fetch(`${baseUrl}&i=${encodeURIComponent(id)}`);
  result = await result.json();

  if (result.Response == "False") {
    throw {
      code: 'invalidImdbId'
    };
  }

  return {
    title: result.title,
    director: result.director,
    year: parseInt(result.year),
    pictureUri: result.poster
  }
};