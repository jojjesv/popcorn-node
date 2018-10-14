import { Response, Request } from "express";
import { db, query } from "../db";

import handleError from '../error_handler';
import Movie from "../Movie";
import utils from "../utils";
import MoviePreview from "../MoviePreview";

import {
  fetchMovie
} from '../internal/imdb_com';

/**
 * Fetches a movie from IMdB and outputs it.
 * @author Johan Svensson
 */
export default async (req: Request, res: Response) => {
  let { imdbId } = req.params;

  console.log("movie", req.params);

  try {
    return await fetchMovie(imdbId);
  } catch (e) {
    handleError(res, "server", null, e);
  }
}