import { Request, Response } from "express";
import { query } from "../db";
import utils from "../utils";

/**
 * Permanently deletes a movie.
 * @author Johan Svensson
 */
export default async (req: Request, res: Response) => {
  let { params } = req;

  let movieId = params.movieId;
  if (isNaN(movieId)) {
    return res.status(400).end(JSON.stringify({
      result: "error",
      error: "invalidMovieId"
    }));
  }

  let result = await query(
    utils.getQuery("delete_movie"),
    [ movieId ]
  );

  res.status(200).end(JSON.stringify({
    status: 'ok'
  }));
}