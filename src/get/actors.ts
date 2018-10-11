import { Response, Request } from "express";
import { db, query } from "../db";

import handleError from '../error_handler';
import Movie from "../Movie";
import utils from "../utils";
import Actor from "../Actor";

/**
 * Outputs all actors for a specific movie.
 * @author Johan Svensson
 */
export default async (req: Request, res: Response) => {
  let get = req.query;

  try {
    utils.assertParams(
      ['movie_id'],
      get
    );
  } catch (e) {
    handleError(res, 'client', e);
  }

  try {
    let actors = await query(
      `SELECT actor_id AS id, role, name FROM movie_stars WHERE movie_id = ?`,
      [get.movie_id],
      {
        forceArray: true
      }
    ) as Actor[];

    actors.forEach(a => {
      a.id = Number(a.id);
    });

    res.status(200).end(actors);
  } catch (e) {
    handleError(res, "server", null, e);
  }
}