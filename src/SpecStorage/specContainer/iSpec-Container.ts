import {ISpecMethodContainer} from "./specMethodContainer/iSpec-method-Container";
import {Provider} from "@angular/core";

export interface ISpecContainer{
  getDescription():string
  getClassName():string;
  getIgnoreReason():string;

  getParentSpec(): ISpecContainer;
  getClassConstructor():Function;
  getNewSpecObject(): any;

  getSUT():Provider;
  getProviders():Array<Provider>;

  getGiven():Array<ISpecMethodContainer>;
  getThen(): Array<ISpecMethodContainer>;
  getWhen(): ISpecMethodContainer;
  getThenThrow(): ISpecMethodContainer;

  getOwnThenByName(methodName:string):ISpecMethodContainer;
  getOwnGivenByName(methodName:string):ISpecMethodContainer;
  getOwnGiven(): Array<ISpecMethodContainer>;
  getOwnWhen(): ISpecMethodContainer;
  getOwnThen(): Array<ISpecMethodContainer>;
  getOwnThenThrow(): ISpecMethodContainer;

  getOwnMethods():Array<ISpecMethodContainer>;
  getOwnMethod(methodName:string):ISpecMethodContainer;

  isExecutableSpec():boolean;
  isIgnored():boolean;
  expectingErrors():boolean;
}
