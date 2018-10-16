import { Request, Response, json } from "express";
import handleError from '../error_handler';
import utils from "../utils";
import { fetchMovie } from "../internal/imdb_com";
import Movie from "../Movie";
import ImdbMovie from "../ImdbMovie";
import { query } from "../db";

/**
 * Validates a movie.
 * @param movie Movie to validate
 * @returns An error message or true if validation passed.
 */
const validate = (movie: Movie): string | true => {
  if (!(movie.runtime >= 5)) {
    return "Invalid runtime.";
  }
  if (!(movie.score >= 0 || movie.score <= 10)) {
    return "Invalid score.";
  }
  if ((movie.title || "").length < 2) {
    return "Invalid title.";
  }
  if (!(movie.year >= 1878 || movie.year <= new Date().getFullYear() + 10)) {
    return "Invalid year.";
  }
  if (!movie.ageRating) {
    return "Invalid age rating.";
  }
  return true;
}

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

  console.log("REUSLT", result);

  let validationError;
  if ((validationError = validate(result)) !== true) {
    return res.status(400).end(JSON.stringify({
      validationError
    }))
  }

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

  try {
    let { insertId } = await query(
      utils.getQuery("add_movie"),
      [null, result.ageRating, result.runtime,
        result.plot, result.title, result.score, result.year]
    ) as any;

    return res.status(200).end(JSON.stringify({
      "ok": true,
      "movie_id": insertId
    }))
  } catch (e) {
    handleError(res, 'server', null, e);
  }

}