SELECT role, movie AS title, movie_id AS id, year, picture_uri AS pictureUri
  FROM star_movies
    WHERE actor_id = ?