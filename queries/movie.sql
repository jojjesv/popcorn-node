SELECT
  id,
  picture_uri AS pictureUri,
  possessor,
  age_rating AS ageRating,
  run_time AS runtime,
  plot,
  title,
  score,
  year
FROM movies WHERE id = ?