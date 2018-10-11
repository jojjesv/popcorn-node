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
app.post('/add_movie')