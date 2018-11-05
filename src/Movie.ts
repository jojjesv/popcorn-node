import Actor from "./Actor";

/**
 * Represents a single movie.
 * @author Johan Svensson
 */
export default class Movie {
  id: any;
  possessor?: string;
  ageRating: string;
  plot?: string;
  runtime: number;
  title: string;
  year: number;
  pictureUri: string;
  score: number;
  cast?: Actor[] = [];
  categories: string[];
}