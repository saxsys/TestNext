import {AssertionError} from "./assertion-Error";
import {AssertProportion} from "./assert-proportion";
import {type} from "os";
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
    if (this.value !== comparator) {
      let outDescComp = (descriptionComparator == null ? '':descriptionComparator);
      let outDescVal = (this.description == null ? '':this.description);
      throw new AssertionError(this.value, comparator, AssertProportion.EQUAL, outDescVal, outDescComp);
    }
  }

  equalsNot(comparator: any, descriptionComparator?: string) {
    if(this.value === comparator){
      let outDescComp = (descriptionComparator == null ? '':descriptionComparator);
      let outDescVal = (this.description == null ? '':this.description);
      throw new AssertionError(this.value, comparator, AssertProportion.NOT_EQUAL, outDescVal, outDescComp);
    }
  }

  isGreaterThan(comparator: any, descriptionComparator?: string) {
    let outDescComp = (descriptionComparator == null ? '':descriptionComparator);
    let outDescVal = (this.description == null ? '':this.description);

    if(typeof this.value != "number" || typeof comparator != "number") {
      let errorMsg = 'For a Greater-Than-Assertion both Values must be of type Number';
      throw new AssertionError(this.value, comparator, AssertProportion.GREATER, outDescVal, outDescComp, errorMsg);
    }
    if(this.value <= comparator)
      throw new AssertionError(this.value, comparator, AssertProportion.GREATER, outDescVal, outDescComp);
  }

  isLessThan(comparator: any, descriptionComparator?: string) {
    let outDescComp = (descriptionComparator == null ? '':descriptionComparator);
    let outDescVal = (this.description == null ? '':this.description);

    if(typeof this.value != "number" || typeof comparator != "number") {
      let errorMsg = 'For a Less-Than-Assertion both Values must be of type Number';
      throw new AssertionError(this.value, comparator, AssertProportion.LESS, outDescVal, outDescComp, errorMsg);
    }
    if(this.value >= comparator)
      throw new AssertionError(this.value, comparator, AssertProportion.LESS, outDescVal, outDescComp);
  }

  isGreaterOrEqual(comparator: any, descriptionComparator?: string) {
    let outDescComp = (descriptionComparator == null ? '':descriptionComparator);
    let outDescVal = (this.description == null ? '':this.description);

    if(typeof this.value != "number" || typeof comparator != "number") {
      let errorMsg = 'For a Greater-Or-Equal-Assertion both Values must be of type Number';
      throw new AssertionError(this.value, comparator, AssertProportion.GREATER_OR_EQUAL, outDescVal, outDescComp, errorMsg);
    }
    if(this.value < comparator)
      throw new AssertionError(this.value, comparator, AssertProportion.GREATER_OR_EQUAL, outDescVal, outDescComp);
  }

  isLessOrEqual(comparator: any, descriptionComparator?: string) {
    let outDescComp = (descriptionComparator == null ? '':descriptionComparator);
    let outDescVal = (this.description == null ? '':this.description);

    if(typeof this.value != "number" || typeof comparator != "number") {
      let errorMsg = 'For a Less-Or-Equal-Assertion both Values must be of type Number';
      throw new AssertionError(this.value, comparator, AssertProportion.LESS_OR_EQUAL, outDescVal, outDescComp, errorMsg);
    }
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
      errorMsg+= ' sould be null, not ' + this.value;
      throw new AssertionError(this.value, null, AssertProportion.NULL, outDescVal, outDescComp, errorMsg);
    }
  }
}

class AssertNot{
  public not:Assert;

  public getDescription():String {
    return this.not.getDescription();
  }

  public getValue():any {
    return this.not.getValue();
  }

  constructor(assert:Assert){
    this.not = assert;
  }

  equalsNot(comparator: any, descriptionComparator?: string) {
    if(this.not.getValue() !== comparator) {
      let outDescComp = (descriptionComparator == null ? '':descriptionComparator);
      let outDescVal = (this.not.getDescription() == null ? '':this.getDescription());
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.EQUAL, outDescVal, outDescComp);
    }
  }

  isGreaterThan(comparator: any, descriptionComparator?: string) {
    let outDescComp = (descriptionComparator == null ? '' : descriptionComparator);
    let outDescVal = (this.not.getDescription() == null ? '' : this.getDescription());

    if(typeof this.not.getValue() != "number" || typeof comparator != "number")
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.GREATER, outDescVal, outDescComp,
        'For a Greater-Than-Assertion both Values must be of type Number');

    if(this.not.getValue() > comparator)
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.NOT_GREATER, outDescVal, outDescComp);

  }

  isLessThan(comparator: any, descriptionComparator?: string) {
    let outDescComp = (descriptionComparator == null ? '' : descriptionComparator);
    let outDescVal = (this.not.getDescription() == null ? '' : this.getDescription());

    if(typeof this.not.getValue() != "number" || typeof comparator != "number")
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.GREATER, outDescVal, outDescComp,
        'For a Less-Than-Assertion both Values must be of type Number');

    if(this.not.getValue() < comparator)
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.NOT_GREATER, outDescVal, outDescComp);
  }

  isGreaterOrEqual(comparator: any, descriptionComparator?: string) {
    let outDescComp = (descriptionComparator == null ? '' : descriptionComparator);
    let outDescVal = (this.not.getDescription() == null ? '' : this.getDescription());

    if(typeof this.not.getValue() != "number" || typeof comparator != "number")
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.GREATER, outDescVal, outDescComp,
        'For a Greater-Than-Assertion both Values must be of type Number');

    if(this.not.getValue() >= comparator)
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.NOT_GREATER_OR_EQUAL, outDescVal, outDescComp);
  }

  isLessOrEqual(comparator: any, descriptionComparator?: string) {
    let outDescComp = (descriptionComparator == null ? '' : descriptionComparator);
    let outDescVal = (this.not.getDescription() == null ? '' : this.getDescription());

    if(typeof this.not.getValue() != "number" || typeof comparator != "number")
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.GREATER, outDescVal, outDescComp,
        'For a Greater-Than-Assertion both Values must be of type Number');

    if(this.not.getValue() <= comparator)
      throw new AssertionError(this.not.getValue(), comparator, AssertProportion.NOT_LESS_OR_EQUAL, outDescVal, outDescComp);
  }

  isNull(){
    if(this.not.getValue() == null) {
      let outDescComp = 'null';
      let outDescVal = (this.not.getDescription() == null)? '':this.not.getDescription();

      let errorMsg = '';
      errorMsg += (this.not.getDescription() != null)? this.getDescription():'value';
      errorMsg+= ' should not be null, is null';

      throw new AssertionError(this.not.getValue(), null, AssertProportion.NOT_NULL, outDescVal, outDescComp, errorMsg);
    }
  }

}
