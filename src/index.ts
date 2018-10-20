/**
 * Popcorn API backend main.
 * @author Johan Svensson
 */

import express from 'express';
import cors from 'cors';
import { db, setupDb } from './db';

const app = express();

setupDb().then(db => {
  const port = 3001;
  app.listen(3001, () => {
    console.log("Popcorn API listening on port " + port);
  });
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json());
  app.use(cors());

  const baseUrl = '/api';
  app.get(`${baseUrl}/movies`, require('./get/movies').default);
  app.get(`${baseUrl}/movie/imdb/:imdbId`, require('./get/imdb_movie').default);
  app.get(`${baseUrl}/movie/:id`, require('./get/movie').default);
  app.get(`${baseUrl}/actor/:actorId`, require('./get/actor').default);
  app.post(`${baseUrl}/movies/add`, require('./post/add_movie').default);
  app.post(`${baseUrl}/movies/update`, require('./post/update_movie').default);
  app.post(`${baseUrl}/movies/delete`, require('./post/delete_movie').default);
});