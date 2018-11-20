SELECT id, title, picture_uri AS pictureUri FROM movies WHERE title LIKE CONCAT('%', ?, '%')
  ORDER BY INSTR(title, ?)