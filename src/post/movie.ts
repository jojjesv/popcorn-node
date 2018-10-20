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
  if (!Array.isArray(movie.categories) || !movie.categories.length) {
    return "Invalid categories.";
  }
  return true;
}

/**
 * Inserts categories and relations.
 */
const insertCategories = async (movie: Movie) => {
  let categories = movie.categories.map(c => c.trim().toString());

  for (let cat of categories) {
    let categoryId = await query(
      utils.getQuery("match_category"),
      [cat],
      {
        forceArray: false,
        skipObjectIfSingleResult: true
      }
    ) as any;

    if (!categoryId) {
      //  doesn't exist...
      categoryId = (await query(
        utils.getQuery("insert_category"),
        [cat]
      ) as any).insertId;
    }

    await query(
      utils.getQuery("insert_movie_has_category"),
      [movie.id, categoryId]
    );
  }

  movie.categories = categories;
}

const insertMovie = async (movie: Movie) => {
  let { insertId } = await query(
    utils.getQuery("insert_movie"),
    [null, movie.ageRating, movie.runtime,
      movie.plot, movie.title, movie.score, movie.year]
  ) as any;
  let movieId = insertId;
  movie.id = movieId;
}

const insertCast = async (movie: Movie) => {
  //  Insert cast
  for (let cast of movie.cast) {
    let insert = await query((
      utils.getQuery(
        "insert_actor"
      )
    ), [
        cast.name, null
      ]) as any;

    //  Insert relation
    await query((
      utils.getQuery(
        "insert_starring"
      )
    ), [
        insert.id, movie.id, cast.role
      ]);
  }
}

/**
 * Posts a a movie, optionally by an IMdB ID.
 * @author Johan Svensson
 */
export default async (req: Request, res: Response) => {
  let { params, body } = req;

  let addByImdbId = 'imdb_id' in body;

  let result: Movie = new Movie();
  result.title = body.title;
  result.plot = body.plot;
  result.cast = [];
  result.runtime = parseInt(body.runtime);
  result.score = Number(body.score);
  result.year = parseInt(body.year);
  result.ageRating = body.age_rating;
  result.categories = (body.categories || "").split(",");

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
    await insertMovie(result);
    let movieId = result.id;

    await insertCast(result);
    await insertCategories(result);

    return res.status(200).end(JSON.stringify({
      "ok": true,
      "movie_id": movieId
    }))
  } catch (e) {
    handleError(res, 'server', null, e);
  }

}