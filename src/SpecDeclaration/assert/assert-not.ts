import {Assert} from "./assert";
import {AssertionError} from "./assertion-Error";
import {AssertProportion} from "./assert-proportion";
import * as _ from "underscore";

/**
 * Class to compare a Value with an expected Value inverted
 */
export class AssertNot{
  /**
   * Assert to be inverted
   */
  private not:Assert;

  /**
   * Constructor, only to be used with Assert Class
   * @param {Assert} assert
   */
  constructor(assert:Assert){
    this.not = assert;
  }

  /**
   * get Description of the Value to compare
   * @return {String}
   */
  public getDescription():String {
    return this.not.getDescription();
  }

  /**
   * get the Value which should be compared
   * @return {any}
   */
  public getValue():any {
    return this.not.getValue();
  }

  /**
   * Compare if the Assert-value NOT equals the comparator, a deep-compare is used.
   * Throws AssertionError if they are equal.
   * @param comparator expected value
   * @param {string} descriptionComparator description of the expected value
   */
  equals(comparator: any, descriptionComparator?: string) {
    let areEqual = _.isEqual(this.not.getValue(), comparator);
    if(areEqual) {
      let outDescComp = (descriptionComparator == null ? '':descriptionComparator);
      let outDescVal = (this.not.getDescription() == null ? '':this.not.getDescription());
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.NOT_EQUAL, outDescVal, outDescComp);
    }
  }

  /**
   * Compare if the Assert-value is NOT greater than the comparator. Both values must be numeric.
   * Throws AssertionError if the Assert-value is greater than the comparator.
   * @param comparator expected value
   * @param {string} descriptionComparator description of the expected value
   */  isGreaterThan(comparator: number, descriptionComparator?: string) {
    let outDescComp = (descriptionComparator == null ? '' : descriptionComparator);
    let outDescVal = (this.not.getDescription() == null ? '' : this.not.getDescription());

    if(this.not.getValue() == null || typeof this.not.getValue() != "number"|| isNaN(this.not.getValue())  || comparator == null || isNaN(comparator) )
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.NOT_GREATER, outDescVal, outDescComp,
        'For a Comparing-Assertion both Values must be of type "number" and not null');

    if(this.not.getValue() > comparator)
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.NOT_GREATER, outDescVal, outDescComp);

  }

  /**
   * Compare if the Assert-value is NOT less than the comparator. Both values must be numeric.
   * Throws AssertionError if Assert-value is less than comparator.
   * @param comparator expected value
   * @param {string} descriptionComparator description of the expected value
   */
  isLessThan(comparator: number, descriptionComparator?: string) {
    let outDescComp = (descriptionComparator == null ? '' : descriptionComparator);
    let outDescVal = (this.not.getDescription() == null ? '' : this.not.getDescription());

    if(this.not.getValue() == null || typeof this.not.getValue() != "number"|| isNaN(this.not.getValue())  || comparator == null || isNaN(comparator) )
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.NOT_LESS, outDescVal, outDescComp,
        'For a Comparing-Assertion both Values must be of type "number" and not null');

    if(this.not.getValue() < comparator)
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.NOT_LESS, outDescVal, outDescComp);
  }

  /**
   * Compare if the Assert-value is NOT greater or equals the comparator. Both values must be numeric.
   * Throws AssertionError if the Assert-Value is greater or equals the comparator.
   * @param comparator expected value
   * @param {string} descriptionComparator description of the expected value
   */
  isGreaterOrEquals(comparator: number, descriptionComparator?: string) {
    let outDescComp = (descriptionComparator == null ? '' : descriptionComparator);
    let outDescVal = (this.not.getDescription() == null ? '' : this.not.getDescription());

    if(this.not.getValue() == null || typeof this.not.getValue() != "number"|| isNaN(this.not.getValue())  || comparator == null || isNaN(comparator) )
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.NOT_GREATER_OR_EQUAL, outDescVal, outDescComp,
        'For a Comparing-Assertion both Values must be of type "number" and not null');

    if(this.not.getValue() >= comparator)
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.NOT_GREATER_OR_EQUAL, outDescVal, outDescComp);
  }

  /**
   * Compare if the Assert-value is NOT less or equals the comparator. Both values must be numeric.
   * Throws AssertionError if Assert-value is less or equals the comparator.
   * @param comparator expected value
   * @param {string} descriptionComparator description of the expected value
   */
  isLessOrEquals(comparator: number, descriptionComparator?: string) {
    let outDescComp = (descriptionComparator == null ? '' : descriptionComparator);
    let outDescVal = (this.not.getDescription() == null ? '' : this.not.getDescription());

    if(this.not.getValue() == null || typeof this.not.getValue() != "number"|| isNaN(this.not.getValue())  || comparator == null || isNaN(comparator) )
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.NOT_LESS_OR_EQUAL, outDescVal, outDescComp,
        'For a Comparing-Assertion both Values must be of type "number" and not null');

    if(this.not.getValue() <= comparator)
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.NOT_LESS_OR_EQUAL, outDescVal, outDescComp);
  }

  /**
   * Check weather the Assert Value is NOT null and NOT undefined
   */
  isNull(){
    if(this.not.getValue() == null) {
      let outDescComp = 'null';
      let outDescVal = (this.not.getDescription() == null)? '':this.not.getDescription();

      let errorMsg = '';
      errorMsg += (this.not.getDescription() == null)? 'value':this.not.getDescription();
      errorMsg+= ' should not be null, is null';

      throw new AssertionError(this.not.getValue(), null, AssertProportion.NOT_NULL, outDescVal, outDescComp, errorMsg);
    }
  }

}
