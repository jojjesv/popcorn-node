import { Response, Request } from "express";
import { db, query } from "../db";

import handleError from '../error_handler';
import Movie from "../Movie";
import utils from '../utils';

/**
 * Outputs all movie previews.
 * @author Johan Svensson
 */
export default async (req: Request, res: Response) => {
  try {
    let movies = await query(
      utils.getQuery("movies"),
      null,
      {
        forceArray: true,
        skipObjectIfSingleResult: false
      }
    ) as Movie[];

    movies = movies || [];

    movies.forEach(m => {
      m.id = Number(m.id);
    })

    res.status(200).end(JSON.stringify(movies));
  } catch (e) {
    handleError(res, "server", null, e);
  }
}