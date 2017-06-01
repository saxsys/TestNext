import {AssertionError} from "./assertion-Error";
import {AssertProportion} from "./assert-proportion";
export class Assert {
  private value: any;
  private description: String;
  constructor(value: any, description?:String) {
    this.value = value;
    this.description = description;
  }

  equals(comparator: any, descriptionComparator?: string) {
    if (this.value !== comparator) {
      let outDescComp = (descriptionComparator == null ? '':descriptionComparator);
      let outDescVal = (this.description == null ? '':descriptionComparator);
      throw new AssertionError(this.value, comparator, AssertProportion.EQUAL, outDescVal, outDescComp);
    }
  }

  public static that(value, description?:string) {
    return new Assert(value, description);
  }


}
