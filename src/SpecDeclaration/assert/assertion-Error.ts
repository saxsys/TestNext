import {AssertProportion} from "./assert-proportion";

/**
 * Error-class for Errors of the Assert Class
 */
export class AssertionError extends Error{

  /**
   * Assert value
   */
  value:any;
  /**
   * Expected value
   */
  comparator:any;
  /**
   * Comparison operator
   */
  proportion:AssertProportion;
  /**
   * Description of the Assert value
   */
  valDescription:String;
  /**
   * Description of the expected value
   */
  compDescription:String;

  /**
   * create a Assertion Error, including generated Error-message
   * @param value
   * @param comparator
   * @param {AssertProportion} proportion
   * @param {String} valDescription
   * @param {String} compDescription
   * @param {String} message
   */
  constructor(value:any, comparator:any, proportion:AssertProportion, valDescription?:String, compDescription?:String, message?:String){
    if(message != null) {
      super(message.toString());
    } else {
      super(valDescription + '(' + value.toString() + ') should be ' +
        proportion.toString() + ' ' + compDescription + '(' + comparator.toString() +')'
      );
    }

    this.value = value;
    this.comparator = comparator;
    this.proportion = proportion;
    this.valDescription = valDescription;
    this.compDescription = compDescription;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AssertionError.prototype);
  }
}
