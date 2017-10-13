import {ISpecMethodList} from "./iSpec-method-list";
import {SpecRegistryError} from "../../spec-registry-error";
import {SpecMethodContainer} from "../specMethodContainer/spec-method-container";
import {SpecMethodType} from "../specMethodContainer/spec-method-type";

/**
 * @class for Classes containing data about one Type of SpecMethods of one Spec(e.g. all Given of a Spec)
 * the SpecMethods must be numbered
 */
export class SpecMethodNumberedList implements ISpecMethodList{
  private methodByExecNumber = new Map<number, SpecMethodContainer>();
  private className:string;
  private methodType:SpecMethodType;

  constructor(className:string, methodType:SpecMethodType){
    this.className = className;
    this.methodType = methodType

  }

  /**
   * add a Method to the List
   * @param {string} functionName must not be registered before
   * @param {string} description
   * @param {Number} execNumber must be given and not be used before
   */
  addMethod(functionName: string, description: string, execNumber: Number) {
    if(execNumber == null)
      throw new SpecRegistryError('@'+ this.methodType + ' ' + this.className + '.' + functionName + ' is invalid, you either have to give execNumbers for all, or for none', this.className, functionName);
    if(this.getMethod(functionName) != null)
      throw new SpecRegistryError('Multiple Methods with same Name on ' + this.className + '.' + functionName, this.className, functionName);
    if(this.methodByExecNumber.get(execNumber.valueOf()) != null)
      throw new SpecRegistryError('In ' + this.className + ' are multiple @' + this.methodType + ', with the Same ExecNumber (' + execNumber + '), this is forbidden', this.className, functionName);

    this.methodByExecNumber.set(execNumber.valueOf(),
      new SpecMethodContainer(functionName, description, this.methodType, execNumber.valueOf())
    );
  }

  /**
   * get all the data about all here set SpecMethods
   * @return {Array<ISpecMethodContainer>}
   */
  getMethods(): SpecMethodContainer[] {
    let keys = Array.from(this.methodByExecNumber.keys()).sort();

    let returnArray = new Array<SpecMethodContainer>();
    keys.forEach((key) => {
      returnArray.push(this.methodByExecNumber.get(key));
    });
    return returnArray;
  }

  /**
   * get all data about one SpecMethod
   * @param {string} methodName
   * @return {ISpecMethodContainer}
   */
  getMethod(methodName: string): SpecMethodContainer {
    let returnMethod = null;
    this.methodByExecNumber.forEach((method) => {
      if(method.getName() == methodName) {
        returnMethod = method;
        return;
      }
    });
    return returnMethod;
  }



}
