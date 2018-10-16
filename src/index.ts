/**
 * Popcorn API backend main.
 * @author Johan Svensson
 */

import express from 'express';
import cors from 'cors';

const app = express();

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
app.post(`${baseUrl}/add_movie`, require('./post/add_movie').default);