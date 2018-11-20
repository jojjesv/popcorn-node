/**
 * Popcorn API backend main.
 * @author Johan Svensson
 */

import express from 'express';
import cors from 'cors';
import { db, setupDb } from './db';

const app = express();

setupDb().then(db => {
  const port = 8003;
  app.listen(port, () => {
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
  app.post(`${baseUrl}/movie`, require('./post/movie').default);
  app.put(`${baseUrl}/movie/:movieId`, require('./put/movie').default);
  app.delete(`${baseUrl}/movie/:movieId`, require('./delete/movie').default);
});

//  Prevent nodemon from leaving child process running
process.on('SIGINT', () => { console.log("Bye bye!"); process.exit(); });