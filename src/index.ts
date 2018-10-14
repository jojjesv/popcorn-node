/**
 * Popcorn API backend main.
 * @author Johan Svensson
 */

import express from 'express';

const app = express();

const port = 3001;
app.listen(3001, () => {
  console.log("Popcorn API listening on port " + port);
});
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.get('/movies', require('./get/movies').default);
app.get('/movie/:id', require('./get/movie').default);
app.get('/actor/:actorId/movies', require('./get/movies_by_actor').default);
app.post('/add_movie', require('./post/add_movie').default);