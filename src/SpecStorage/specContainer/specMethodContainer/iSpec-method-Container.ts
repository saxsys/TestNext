import {SpecMethodType} from "./spec-method-type";

/**
 * Container for information of one SpecMethod
 */
export interface ISpecMethodContainer{
  /**
   * @return Name of the method
   */
  getName():string;
  /**
   * @return description of the method
   */
  getDescription():string;
  /**
   * @return type of the method (Given, When, Then,...)
   */
  getMethodType(): SpecMethodType;
}
