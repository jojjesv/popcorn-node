import { Response, Request } from "express";
import { db, query } from "../db";

import handleError from '../error_handler';
import Movie from "../Movie";

/**
 * Outputs all movie previews.
 * @author Johan Svensson
 */
export default async (req: Request, res: Response) => {
  try {
    let movies = await query(
      require('../../queries/movies.sql')
    ) as Movie[];

    movies.forEach(m => {
      m.id = Number(m.id);
    })

    res.status(200).end(JSON.stringify(movies));
  } catch (e) {
    handleError(res, "server", null, e);
  }
}