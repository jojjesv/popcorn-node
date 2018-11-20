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
  let query = req.query || {};

  try {
    let movies = await queryWithSearch(query.q, query.scope) || [];

    movies.forEach(m => {
      m.id = Number(m.id);
    })

    res.status(200).end(JSON.stringify(movies));
  } catch (e) {
    handleError(res, "server", null, e);
  }
}

async function queryWithSearch(searchQuery: string, scope?: 'movies' | 'category' | 'cast'): Promise<Movie[]> {
  let queryName: string = 'movies';
  let queryArgs = [searchQuery];

  if (searchQuery) {
    switch (scope) {
      case 'category':
        queryName = 'movies_search_category'
        break;

      case 'cast':
        queryName = 'movies_search_cast'
        break;

      case 'movies':
        queryName = 'movies_search_name';
        break;
    }
  }

  let sql = utils.getQuery(queryName);

  if (/order by\s?instr\((.+),(\s)?\?\)/ig.test(sql)) {
    //  Orders by the search query index of
    queryArgs.push(searchQuery);
  }

  console.log("searchQuery:", searchQuery, "scope:", scope)
  console.log("sql:", sql, "args:", queryArgs)

  return await query(
    sql,
    queryArgs,
    {
      forceArray: true,
      skipObjectIfSingleResult: false
    }
  ) as Movie[]
}