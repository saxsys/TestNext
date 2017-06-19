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

  isExecutableSpec():boolean;
  isIgnored():boolean;
  isExpectingErrors():boolean;
}
