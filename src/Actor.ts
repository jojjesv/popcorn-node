/**
 * Represents a single actor.
 */
export default class {
  id: number;
  pictureUri: string;

  constructor(public name: string, public role: 'director'|'cast'|'writer') {

  }
}