import {SpecMethodType} from "../specRegistry/testMethodRegistryEntry/spec-method-type";
import {AssertProportion} from "./assert-proportion";
export class AssertionError extends Error{

  value:any;
  comparator:any;
  proportion:AssertProportion;
  valDescription:String;
  compDescription:String;

  constructor(value:any, comparator:any, proportion:AssertProportion, valDescription?:String, compDescription?:String, message?:String){
    if(message != null) {
      super(message.toString());
    } else {
      super(valDescription + ' (' + value.toString() + ')  should be ' +
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
