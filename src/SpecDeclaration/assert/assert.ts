import {AssertionError} from "./assertion-Error";
import {AssertProportion} from "./assert-proportion";
import * as _ from 'underscore';

export class Assert {
  private value: any;
  private description: String;
  public not: AssertNot;

  public getDescription():String {
    return this.description;
  }
  public getValue():any {
    return this.value;
  }

  private constructor(value: any, description?:String) {
    this.value = value;
    this.description = description;
    this.not = new AssertNot(this);
  }

  public static that(value, description?:string) {
    return new Assert(value, description);
  }

  equals(comparator: any, descriptionComparator?: string) {
    let areEqual = _.isEqual(this.value, comparator);
    if (!areEqual) {
      let outDescComp = (descriptionComparator == null ? '':descriptionComparator);
      let outDescVal = (this.description == null ? '':this.description);
      throw new AssertionError(this.value, comparator, AssertProportion.EQUAL, outDescVal, outDescComp);
    }
  }

  equalsNot(comparator: any, descriptionComparator?: string) {
    let areEqual = _.isEqual(this.value, comparator);
    if(areEqual){
      let outDescComp = (descriptionComparator == null ? '':descriptionComparator);
      let outDescVal = (this.description == null ? '':this.description);
      throw new AssertionError(this.value, comparator, AssertProportion.NOT_EQUAL, outDescVal, outDescComp);
    }
  }

  isGreaterThan(comparator: number, descriptionComparator?: string) {
    let outDescComp = (descriptionComparator == null ? '':descriptionComparator);
    let outDescVal = (this.description == null ? '':this.description);

    if(this.value == null || typeof this.value != "number"|| isNaN(this.value)  || comparator == null || isNaN(comparator) )
      throw new AssertionError(this.value, comparator, AssertProportion.GREATER, outDescVal, outDescComp,
        'For a Comparing-Assertion both Values must be of type "number" and not null');

    if(this.value <= comparator)
      throw new AssertionError(this.value, comparator, AssertProportion.GREATER, outDescVal, outDescComp);
  }

  isLessThan(comparator: number, descriptionComparator?: string) {
    let outDescComp = (descriptionComparator == null ? '':descriptionComparator);
    let outDescVal = (this.description == null ? '':this.description);

    if(this.value == null || typeof this.value != "number"|| isNaN(this.value)  || comparator == null || isNaN(comparator) )
      throw new AssertionError(this.value, comparator, AssertProportion.LESS, outDescVal, outDescComp,
        'For a Comparing-Assertion both Values must be of type "number" and not null');

    if(this.value >= comparator)
      throw new AssertionError(this.value, comparator, AssertProportion.LESS, outDescVal, outDescComp);
  }

  isGreaterOrEquals(comparator: number, descriptionComparator?: string) {
    let outDescComp = (descriptionComparator == null ? '':descriptionComparator);
    let outDescVal = (this.description == null ? '':this.description);

    if(this.value == null || typeof this.value != "number"|| isNaN(this.value)  || comparator == null || isNaN(comparator) )
      throw new AssertionError(this.value, comparator, AssertProportion.GREATER_OR_EQUAL, outDescVal, outDescComp,
        'For a Comparing-Assertion both Values must be of type "number" and not null');

    if(this.value < comparator)
      throw new AssertionError(this.value, comparator, AssertProportion.GREATER_OR_EQUAL, outDescVal, outDescComp);
  }

  isLessOrEquals(comparator: number, descriptionComparator?: string) {
    let outDescComp = (descriptionComparator == null ? '':descriptionComparator);
    let outDescVal = (this.description == null ? '':this.description);

    if(this.value == null || typeof this.value != "number"|| isNaN(this.value)  || comparator == null || isNaN(comparator) )
      throw new AssertionError(this.value, comparator, AssertProportion.LESS_OR_EQUAL, outDescVal, outDescComp,
        'For a Comparing-Assertion both Values must be of type "number" and not null');

    if(this.value > comparator)
      throw new AssertionError(this.value, comparator, AssertProportion.LESS_OR_EQUAL, outDescVal, outDescComp);
  }

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

export class AssertNot{
  private not:Assert;

  constructor(assert:Assert){
    this.not = assert;
  }

  public getDescription():String {
    return this.not.getDescription();
  }

  public getValue():any {
    return this.not.getValue();
  }

  equals(comparator: any, descriptionComparator?: string) {
    let areEqual = _.isEqual(this.not.getValue(), comparator);
    if(areEqual) {
      let outDescComp = (descriptionComparator == null ? '':descriptionComparator);
      let outDescVal = (this.not.getDescription() == null ? '':this.not.getDescription());
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.NOT_EQUAL, outDescVal, outDescComp);
    }
  }

  isGreaterThan(comparator: number, descriptionComparator?: string) {
    let outDescComp = (descriptionComparator == null ? '' : descriptionComparator);
    let outDescVal = (this.not.getDescription() == null ? '' : this.not.getDescription());

    if(this.not.getValue() == null || typeof this.not.getValue() != "number"|| isNaN(this.not.getValue())  || comparator == null || isNaN(comparator) )
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.NOT_GREATER, outDescVal, outDescComp,
        'For a Comparing-Assertion both Values must be of type "number" and not null');

    if(this.not.getValue() > comparator)
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.NOT_GREATER, outDescVal, outDescComp);

  }

  isLessThan(comparator: number, descriptionComparator?: string) {
    let outDescComp = (descriptionComparator == null ? '' : descriptionComparator);
    let outDescVal = (this.not.getDescription() == null ? '' : this.not.getDescription());

    if(this.not.getValue() == null || typeof this.not.getValue() != "number"|| isNaN(this.not.getValue())  || comparator == null || isNaN(comparator) )
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.NOT_LESS, outDescVal, outDescComp,
        'For a Comparing-Assertion both Values must be of type "number" and not null');

    if(this.not.getValue() < comparator)
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.NOT_LESS, outDescVal, outDescComp);
  }

  isGreaterOrEquals(comparator: number, descriptionComparator?: string) {
    let outDescComp = (descriptionComparator == null ? '' : descriptionComparator);
    let outDescVal = (this.not.getDescription() == null ? '' : this.not.getDescription());

    if(this.not.getValue() == null || typeof this.not.getValue() != "number"|| isNaN(this.not.getValue())  || comparator == null || isNaN(comparator) )
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.NOT_GREATER_OR_EQUAL, outDescVal, outDescComp,
        'For a Comparing-Assertion both Values must be of type "number" and not null');

    if(this.not.getValue() >= comparator)
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.NOT_GREATER_OR_EQUAL, outDescVal, outDescComp);
  }

  isLessOrEquals(comparator: number, descriptionComparator?: string) {
    let outDescComp = (descriptionComparator == null ? '' : descriptionComparator);
    let outDescVal = (this.not.getDescription() == null ? '' : this.not.getDescription());

    if(this.not.getValue() == null || typeof this.not.getValue() != "number"|| isNaN(this.not.getValue())  || comparator == null || isNaN(comparator) )
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.NOT_LESS_OR_EQUAL, outDescVal, outDescComp,
        'For a Comparing-Assertion both Values must be of type "number" and not null');

    if(this.not.getValue() <= comparator)
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.NOT_LESS_OR_EQUAL, outDescVal, outDescComp);
  }

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
