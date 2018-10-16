import { Request, Response } from "express";

/**
 * Permanently deletes a movie.
 * @author Johan Svensson
 */
export default async (req: Request, res: Response) => {
  let { body } = req;

  let movieId = body.movieId;
  if (isNaN(movieId)) {
    return res.status(400).end(JSON.stringify({
      result: "error",
      error: "invalidMovieId"
    }));
  }

  
}