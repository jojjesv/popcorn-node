SELECT id, title, picture_uri AS pictureUri FROM movies WHERE id IN (
  SELECT movie_id FROM movie_stars WHERE name LIKE CONCAT('%', ?, '%')
) ORDER BY INSTR(movies.title, ?)