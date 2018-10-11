import { Response } from "express";

/**
 * Default error handler for requests.
 * @author Johan Svensson
 */
export default async (res: Response, blame: 'client'|'server', message?: string|Object, e?: any) => {
  if (e) {
    console.error(e);
  }

  res.status(blame == 'client' ? 400 : 500).end({
    message: message || (blame == 'client' ? "You sent a bad request" : "Internal server error")
  });
}