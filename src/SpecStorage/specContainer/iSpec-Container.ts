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

  getOwnGiven(): Array<ISpecMethodContainer>;
  getOwnGivenByName(methodName:string):ISpecMethodContainer;
  getGiven():Array<ISpecMethodContainer>;
  getOwnThen(): Array<ISpecMethodContainer>;
  getOwnThenByName(methodName:string):ISpecMethodContainer;
  getThen(): Array<ISpecMethodContainer>;
  getOwnWhen(): ISpecMethodContainer;
  getWhen(): ISpecMethodContainer;
  getOwnMethods():Array<ISpecMethodContainer>;
  getOwnMethod(methodName:string):ISpecMethodContainer;

  isExecutableSpec():boolean;
  isIgnored():boolean;
}
