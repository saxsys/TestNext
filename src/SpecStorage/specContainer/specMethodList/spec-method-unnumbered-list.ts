import {ISpecMethodList} from "./iSpec-method-list";
import {SpecMethodType} from "../specMethodContainer/spec-method-type";
import {SpecMethodContainer} from "../specMethodContainer/spec-method-container";
import {SpecRegistryError} from "../../spec-registry-error";

export class SpecMethodUnnumberedList implements ISpecMethodList{

  private methods = new Array<SpecMethodContainer>();

  private className:string;
  private methodType:SpecMethodType;

  constructor(className:string, methodType:SpecMethodType){
    this.className = className;
    this.methodType = methodType;
  }

  addMethod(functionName: string, description: string, execNumber: Number) {
    if(execNumber != null)
      throw new SpecRegistryError('@' + this.methodType + ' ' + this.className + '.' + functionName + ' is invalid, you either have to give execNumbers for all, or for none', this.className, functionName);
    if(this.getMethod(functionName) != null)
      throw new SpecRegistryError('Multiple Methods with same Name on ' + this.className + '.' + functionName, this.className, functionName);
    this.methods.push(
      new SpecMethodContainer(functionName, description, this.methodType)
    );
  }

  getMethods(): SpecMethodContainer[] {
    return this.methods;
  }

  getMethod(methodName: string): SpecMethodContainer {
    let returnMethod = null;
    this.methods.forEach((method) => {
      if(method.getName() == methodName) {
        returnMethod = method;
        return;
      }
    });
    return returnMethod;
  }


}
