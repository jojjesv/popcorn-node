/**
 * Represents a single movie.
 * @author Johan Svensson
 */
export default class Movie {
  id: number;
  possessor?: string;
  ageRating: string;
  plot?: string;
  runTime: number;
  title: string;
  year: number;
  pictureUri: string;
  score: number;
  cast: [];
}