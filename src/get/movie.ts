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
      utils.getQuery("movie")
      [ id ]
    ) as Movie;

    let cast = await query(
      utils.getQuery("movie_cast"),
      [ id ],
      {
        forceArray: true,
      }
    ) as [];
    movie.cast = cast;

    res.status(200).end(JSON.stringify(movie));
  } catch (e) {
    handleError(res, "server", null, e);
  }
}