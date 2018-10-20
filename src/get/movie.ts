import { Response, Request } from "express";
import { db, query } from "../db";

import handleError from '../error_handler';
import Movie from "../Movie";
import utils from "../utils";
import MoviePreview from "../MoviePreview";

/**
 * Outputs info about a specific movie.
 * @author Johan Svensson
 */
export default async (req: Request, res: Response) => {
  let { id } = req.params;

  console.log("movie", req.params);

  try {
    let movie = await query(
      utils.getQuery("movie"),
      [ id ],
      {
        forceArray: false
      }
    ) as Movie;

    if (!movie) {
      return res.status(401).end(JSON.stringify({
        result: 'noMatch'
      }));
    }

    let cast = await query(
      utils.getQuery("movie_cast"),
      [ id ],
      {
        forceArray: true,
      }
    ) as [];

    let categories = await query(
      utils.getQuery("movie_categories"),
      [ id ],
      {
        forceArray: true,
        skipObjectIfSingleResult: true
      }
    ) as string[];

    //  cast won't appear unless reobject
    movie.cast = cast;
    movie.categories = categories;

    res.status(200).end(JSON.stringify(movie));
  } catch (e) {
    handleError(res, "server", null, e);
  }
}