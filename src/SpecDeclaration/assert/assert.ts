import {AssertionError} from "./assertion-Error";
import {AssertProportion} from "./assert-proportion";
import * as _ from 'underscore';
import {AssertNot} from "./assert-not";

/**
 * Class to compare a Value with an expected Value
 */
export class Assert {
  private value: any;
  private description: String;
  /**
   * Assert the opposite
   */
  public not: AssertNot;

  /**
   *
   * @return {String} Descriptiong of the value
   */
  public getDescription():String {
    return this.description;
  }

  /**
   * Value to compare with an expected value
   * @return {any}
   */
  public getValue():any {
    return this.value;
  }

  /**
   * private Constuctor, use Assert.that()
   * @param value
   * @param {String} description
   */
  private constructor(value: any, description?:String) {
    this.value = value;
    this.description = description;
    this.not = new AssertNot(this);
  }

  /**
   * Create an Assertion with a Value, nothing to compare yet
   * @param value to compare
   * @param {string} description of the value
   * @return {Assert} Basic Assertion with the value, without beeing compared yet
   */
  public static that(value, description?:string) {
    return new Assert(value, description);
  }

  /**
   * Compare if the Assert-value equals the comparator, a deep-compare is used. Throws AssertionError if false.
   * @param comparator expected value
   * @param {string} descriptionComparator description of the expected value
   */
  equals(comparator: any, descriptionComparator?: string) {
    let areEqual = _.isEqual(this.value, comparator);
    if (!areEqual) {
      let outDescComp = (descriptionComparator == null ? '':descriptionComparator);
      let outDescVal = (this.description == null ? '':this.description);
      throw new AssertionError(this.value, comparator, AssertProportion.EQUAL, outDescVal, outDescComp);
    }
  }

  /**
   * Compare if the Assert-value differs from the comparator, a deep-compare is used. Throws AssertionError if false.
   * @param comparator
   * @param {string} descriptionComparator
   */
  equalsNot(comparator: any, descriptionComparator?: string) {
    let areEqual = _.isEqual(this.value, comparator);
    if(areEqual){
      let outDescComp = (descriptionComparator == null ? '':descriptionComparator);
      let outDescVal = (this.description == null ? '':this.description);
      throw new AssertionError(this.value, comparator, AssertProportion.NOT_EQUAL, outDescVal, outDescComp);
    }
  }

  /**
   * Compare if the Assert-value is greater than the comparator. Both values must be numeric. Throws AssertionError if false.
   * @param comparator expected value
   * @param {string} descriptionComparator description of the expected value
   */
  isGreaterThan(comparator: number, descriptionComparator?: string) {
    let outDescComp = (descriptionComparator == null ? '':descriptionComparator);
    let outDescVal = (this.description == null ? '':this.description);

    if(this.value == null || typeof this.value != "number"|| isNaN(this.value)  || comparator == null || isNaN(comparator) )
      throw new AssertionError(this.value, comparator, AssertProportion.GREATER, outDescVal, outDescComp,
        'For a Comparing-Assertion both Values must be of type "number" and not null');

    if(this.value <= comparator)
      throw new AssertionError(this.value, comparator, AssertProportion.GREATER, outDescVal, outDescComp);
  }

  /**
   * Compare if the Assert-value is less than the comparator. Both values must be numeric. Throws AssertionError if false.
   * @param comparator expected value
   * @param {string} descriptionComparator description of the expected value
   */
  isLessThan(comparator: number, descriptionComparator?: string) {
    let outDescComp = (descriptionComparator == null ? '':descriptionComparator);
    let outDescVal = (this.description == null ? '':this.description);

    if(this.value == null || typeof this.value != "number"|| isNaN(this.value)  || comparator == null || isNaN(comparator) )
      throw new AssertionError(this.value, comparator, AssertProportion.LESS, outDescVal, outDescComp,
        'For a Comparing-Assertion both Values must be of type "number" and not null');

    if(this.value >= comparator)
      throw new AssertionError(this.value, comparator, AssertProportion.LESS, outDescVal, outDescComp);
  }

  /**
   * Compare if the Assert-value is greater or equals the comparator. Both values must be numeric. Throws AssertionError if false.
   * @param comparator expected value
   * @param {string} descriptionComparator description of the expected value
   */
  isGreaterOrEquals(comparator: number, descriptionComparator?: string) {
    let outDescComp = (descriptionComparator == null ? '':descriptionComparator);
    let outDescVal = (this.description == null ? '':this.description);

    if(this.value == null || typeof this.value != "number"|| isNaN(this.value)  || comparator == null || isNaN(comparator) )
      throw new AssertionError(this.value, comparator, AssertProportion.GREATER_OR_EQUAL, outDescVal, outDescComp,
        'For a Comparing-Assertion both Values must be of type "number" and not null');

    if(this.value < comparator)
      throw new AssertionError(this.value, comparator, AssertProportion.GREATER_OR_EQUAL, outDescVal, outDescComp);
  }

  /**
   * Compare if the Assert-value is less or equals the comparator. Both values must be numeric. Throws AssertionError if false.
   * @param comparator expected value
   * @param {string} descriptionComparator description of the expected value
   */
  isLessOrEquals(comparator: number, descriptionComparator?: string) {
    let outDescComp = (descriptionComparator == null ? '':descriptionComparator);
    let outDescVal = (this.description == null ? '':this.description);

    if(this.value == null || typeof this.value != "number"|| isNaN(this.value)  || comparator == null || isNaN(comparator) )
      throw new AssertionError(this.value, comparator, AssertProportion.LESS_OR_EQUAL, outDescVal, outDescComp,
        'For a Comparing-Assertion both Values must be of type "number" and not null');

    if(this.value > comparator)
      throw new AssertionError(this.value, comparator, AssertProportion.LESS_OR_EQUAL, outDescVal, outDescComp);
  }

  /**
   * Check weather the Assert Value is null or undefined
   */
  isNull(){
    let outDescComp = 'null';
    let outDescVal = (this.description == null ? '':this.description);
    if(this.value != null) {
      let errorMsg = '';
      if(this.description != null)
        errorMsg += this.description;
      else
        errorMsg += 'value';
      errorMsg+= ' should be null, not ' + this.value;
      throw new AssertionError(this.value, null, AssertProportion.NULL, outDescVal, outDescComp, errorMsg);
    }
  }
}
