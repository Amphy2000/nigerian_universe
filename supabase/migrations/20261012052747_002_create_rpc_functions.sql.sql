/*
# RPC Helper Functions

Atomic increment/decrement functions for votes, comment likes, and argument counts.
These prevent race conditions when multiple users interact simultaneously.

## Functions Created
1. increment_vote — atomically increment votes_for or votes_against on a case
2. increment_argument_count — atomically increment arguments_count on a case
3. adjust_comment_likes — atomically adjust likes on a comment by +/- 1
4. adjust_comment_agrees — atomically adjust agrees on a comment by +/- 1
*/

CREATE OR REPLACE FUNCTION increment_vote(p_case_id text, p_column text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF p_column = 'votes_for' THEN
    UPDATE cases SET votes_for = votes_for + 1 WHERE id = p_case_id;
  ELSIF p_column = 'votes_against' THEN
    UPDATE cases SET votes_against = votes_against + 1 WHERE id = p_case_id;
  ELSE
    RAISE EXCEPTION 'Invalid column name';
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION increment_vote FROM anon;
GRANT EXECUTE ON FUNCTION increment_vote TO anon, authenticated;

CREATE OR REPLACE FUNCTION increment_argument_count(p_case_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE cases SET arguments_count = arguments_count + 1 WHERE id = p_case_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION increment_argument_count FROM anon;
GRANT EXECUTE ON FUNCTION increment_argument_count TO anon, authenticated;

CREATE OR REPLACE FUNCTION adjust_comment_likes(p_comment_id text, p_delta int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE comments SET likes = GREATEST(0, likes + p_delta) WHERE id = p_comment_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION adjust_comment_likes FROM anon;
GRANT EXECUTE ON FUNCTION adjust_comment_likes TO anon, authenticated;

CREATE OR REPLACE FUNCTION adjust_comment_agrees(p_comment_id text, p_delta int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE comments SET agrees = GREATEST(0, agrees + p_delta) WHERE id = p_comment_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION adjust_comment_agrees FROM anon;
GRANT EXECUTE ON FUNCTION adjust_comment_agrees TO anon, authenticated;
