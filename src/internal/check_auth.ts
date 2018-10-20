import { Request, Response } from "express";
import { query } from "../db";
import utils from "../utils";

/**
 * Checks authentication credentials as it's required, end the request
 * with an error code and message if credentials are not provided.
 * @author Johan Svensson
 */
export default async (req: Request, res: Response): Promise<boolean> => {
  let token = req.headers.authorization;

  let match = await query(
    utils.getQuery("match_token"),
    [ token ],
    {
      skipObjectIfSingleResult: false,
      forceArray: false
    }
  ) as any;

  if (!match.ok) {
    res.status(403).end(JSON.stringify({
      result: "error",
      error: "forbidden"
    }))
    return false;
  }

  return true;
}