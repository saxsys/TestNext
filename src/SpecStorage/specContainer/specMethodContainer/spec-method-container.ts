import {SpecMethodType} from "./spec-method-type";
import {ISpecMethodContainer} from "./iSpec-method-Container";

/**
 * Container for information of one SpecMethod
 */
export class SpecMethodContainer implements ISpecMethodContainer{
  private name: string;
  private description: string;
  private execNumber: number;
  private methodType: SpecMethodType;

  constructor(name: string, description: string, methodType:SpecMethodType, execNumber?: number) {
    this.name = name;
    this.description = description;
    this.execNumber = execNumber;
    this.methodType = methodType;
  }

  /**
   * @return Name of the Method
   */
  getName(): string {
    return this.name;
  }

  /**
   * @return {string}
   */
  getDescription(): string {
    return this.description;
  }

  /**
   * @return {SpecMethodType} type of the method (Given, When, Then,...)
   */
  getMethodType(): SpecMethodType{
    return this.methodType;
  }

  /**
   * @return {number} in execution order of all Methods with the same method Type on the Spec
   */
  getExecNumber():Number{
    return this.execNumber
  }

}
