import { Request, Response } from "express";
import handleError from '../error_handler';
import utils from "../utils";
import { fetchMovie } from "../internal/imdb_com";
import Movie from "../Movie";

/**
 * Adds a movie, optionally by an IMdB ID.
 * @author Johan Svensson
 */
export default async (req: Request, res: Response) => {
  let { query } = req;
  let { body } = req;

  let addByImdbId = 'imgdb_id' in query;

  try {
    utils.assertParams(
      addByImdbId ? [
        //  Required POST params if adding by imdb id
      ] : [
          //  Required POST params if adding by manual input
          'title',
          'director',
          '',
        ],
      body
    )
  } catch (e) {
    handleError(res, 'client', e);
  }

  let result: Movie;
  
  try {
    result = await fetchMovie(query.imgdb_id);
  } catch (e) {
    if (e.code == 'invalidImdbId') {
      handleError(res, 'client', e);
    } else {
      handleError(res, 'server', null, e);
    }
  }


}