SELECT id, title, picture_uri AS pictureUri
  FROM movies
    JOIN movie_categories ON
      movie_categories.movie_id = movies.id AND
      category LIKE CONCAT('%', ?, '%')
  ORDER BY INSTR(category, ?)