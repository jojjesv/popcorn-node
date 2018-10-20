import { Request, Response } from "express";
import { query } from "../db";

let updateableColumns = [
  "title",
  "plot",
  "possessor",
  "age_rating",
  "score",
  "run_time",
  "year",
];

/**
 * Updates a project from a set of "dirty" data.
 */
export default async (req: Request, res: Response) => {
  let { body } = req;

  let dirty: any = {};

  let movieId = body.movie_id;

  if (isNaN(movieId)) {
    //  Invalid ID
    return res.status(400).end(JSON.stringify({
      result: "error",
      error: "invalidMovieId"
    }));
  }

  for (let column of updateableColumns) {
    if (body[column]) {
      dirty[column] = body[column];
    }
  }

  let columnsToUpdate = Object.keys(dirty);

  if (Object.keys(columnsToUpdate).length == 0) {
    //  No change
    return res.status(400).end(JSON.stringify({
      result: "error",
      error: "noChange"
    }));
  }

  let sql = (
    `UPDATE movies SET ${columnsToUpdate.map(e => `${e}=?`).join(",")}
      WHERE id = ?`
  );

  let result = await query(
    sql, [...columnsToUpdate.map(e => dirty[e]), movieId]
  );

  return res.status(200).end(JSON.stringify({
    result: "ok"
  }));
}