/**
 * Some utilities.
 * @author Johan Svensson
 */
export default {
  /**
   * Checks if the object contains all properties defined in an array,
   * Throws an error if missing one or more properties.
   * @param props Required properties
   * @param obj Object to check
   * @param allowEmptyString Whether to allow an empty input
   */
  assertParams: (props: string[], obj: any, allowEmptyString = false) => {
    let missingProps = [];

    for (let i of props) {
      if (!obj.hasOwnProperty(i) || (allowEmptyString ? false : obj[i] == '')) {
        missingProps.push(i);
      }
    }

    if (missingProps.length > 0) {
      throw new Error("Missing parameters: " + missingProps.join(","));
    }
  },

}