import { Response, Request } from "express";
import { db, query } from "../db";

import handleError from '../error_handler';
import Movie from "../Movie";
import utils from "../utils";
import MoviePreview from "../MoviePreview";

/**
 * Outputs actor info.
 * @author Johan Svensson
 */
export default async (req: Request, res: Response) => {
  let { actorId } = req.params;
  
  try {
    let movies = await query(
      utils.getQuery('actor'),
      [ actorId ],
      {
        forceArray: true,
        skipObjectIfSingleResult: false
      }
    ) as MoviePreview[];

    movies.forEach(m => {
      m.movieId = Number(m.movieId);
      m.year = Number(m.year);
    });

    res.status(200).end(JSON.stringify({
      movies
    }));
  } catch (e) {
    handleError(res, "server", null, e);
  }
}