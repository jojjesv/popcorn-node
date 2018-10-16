/* Replace the "$" character with joined array of "(?, ?)" */
INSERT INTO actors (
  name, picture_uri
) VALUES (?, ?);