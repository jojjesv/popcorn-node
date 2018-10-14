import { Response, Request } from "express";
import { db, query } from "../db";

import handleError from '../error_handler';
import Movie from "../Movie";
import utils from "../utils";
import MoviePreview from "../MoviePreview";

/**
 * Outputs all movies where a certain actor stars.
 * @author Johan Svensson
 */
export default async (req: Request, res: Response) => {
  let { actorId } = req.params;
  
  try {
    let movies = await query(
      `SELECT * FROM star_movies WHERE actor_id = ?`,
      [ actorId ]
    ) as MoviePreview[];

    movies.forEach(m => {
      m.movieId = Number(m.movieId);
      m.year = Number(m.year);
    });

    res.status(200).end(movies);
  } catch (e) {
    handleError(res, "server", null, e);
  }
}