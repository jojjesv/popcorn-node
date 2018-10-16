import { Request, Response } from "express";
import handleError from '../error_handler';
import utils from "../utils";
import { fetchMovie } from "../internal/imdb_com";
import Movie from "../Movie";
import ImdbMovie from "../ImdbMovie";
import { query } from "../db";

/**
 * Adds a movie, optionally by an IMdB ID.
 * @author Johan Svensson
 */
export default async (req: Request, res: Response) => {
  let { params, body } = req;

  let addByImdbId = 'imdb_id' in body;

  let result: Movie = new Movie();
  result.title = body.title;
  result.plot = body.plot;
  result.runtime = parseInt(body.runtime);
  result.score = Number(body.score);
  result.year = parseInt(body.year);
  result.ageRating = body.age_rating;

  try {
    if (addByImdbId) {
      let imdbMovie = await fetchMovie(body.imdb_id) as ImdbMovie;

      //  Populate unset fields
      for (let field in Movie.prototype) {
        if (result[field] == null) {
          result[field] = imdbMovie[field];
        }
      }
    }
  } catch (e) {
    if (e.result == 'noMatch') {
      return handleError(res, 'client', e);
    } else {
      return handleError(res, 'server', null, e);
    }
  }

  let insert = await query(
    utils.getQuery("add_movie")
  );

  console.log("Insert result: ", insert);
}