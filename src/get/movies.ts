import { Response, Request } from "express";
import { db, query } from "../db";

import handleError from '../error_handler';
import Movie from "../Movie";

/**
 * Outputs all movies, without actors.
 * @author Johan Svensson
 */
export default async (req: Request, res: Response) => {
  try {
    let movies = await query(
      `SELECT * FROM movies`
    ) as Movie[];

    movies.forEach(m => {
      m.id = Number(m.id);
      m.runTime = Number(m.runTime);
      m.year = Number(m.year);
      m.score = Number(m.score);
    })

    res.status(200).end(movies);
  } catch (e) {
    handleError(res, "server", null, e);
  }
}