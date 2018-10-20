/* Only keep one in for now. */
DELETE FROM auth_tokens;
INSERT INTO auth_tokens (token, created) VALUES (?, NOW());