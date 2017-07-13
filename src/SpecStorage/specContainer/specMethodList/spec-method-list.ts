import {ISpecMethodContainer} from "../specMethodContainer/iSpec-method-Container";
import {SpecMethodUnnumberedList} from "./spec-method-unnumbered-list";
import {ISpecMethodList} from "./iSpec-method-list";
import {SpecMethodType} from "../specMethodContainer/spec-method-type";
import {SpecMethodNumberedList} from "./spec-method-numbered-list";

export class SpecMethodList implements ISpecMethodList{

  private methodList:ISpecMethodList = null;

  private className:string;
  private methodType:SpecMethodType;

  constructor(className:string, methodType:SpecMethodType){
    this.className = className;
    this.methodType = methodType;
  }

  addMethod(functionName: string, description: string, execNumber?: number){
    if(this.methodList == null) {
      if (execNumber == null) {
        this.methodList = new SpecMethodUnnumberedList(this.className, this.methodType);
      } else{
        this.methodList = new SpecMethodNumberedList(this.className, this.methodType);
      }
    }
    this.methodList.addMethod(functionName, description, execNumber);
  };

  getMethods():Array<ISpecMethodContainer>{
    if(this.methodList == null) return[];
    return this.methodList.getMethods();
  };

  getMethod(methodName:string):ISpecMethodContainer{
    if(this.methodList == null) return null;
    return this.methodList.getMethod(methodName);
  };
}
