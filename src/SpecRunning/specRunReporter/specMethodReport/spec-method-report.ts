import {ISpecMethodContainer} from "../../../SpecStorage/specContainer/specMethodContainer/iSpec-method-Container";
import {SpecMethodType} from "../../../SpecStorage/specContainer/specMethodContainer/spec-method-type";
import {ISpecMethodRunReport} from "./iSpec-method-report";

export class SpecMethodReport implements ISpecMethodRunReport {
  private specMethod: ISpecMethodContainer;
  private success: boolean;
  private error: Error;

  constructor(specMethod: ISpecMethodContainer, success: boolean, error?: Error) {
    this.specMethod = specMethod;
    this.success = success;
    this.error = error;
  }

  getSpecMethod(): ISpecMethodContainer {
    return this.specMethod;
  }

  getMethodName(): string {
    return this.specMethod.getName();
  }

  getMethodType(): SpecMethodType {
    return this.specMethod.getMethodType();
  }

  getDescription(): string {
    return this.specMethod.getDescription();
  }

  isSuccess(): boolean {
    return this.success;
  }

  getError(): Error {
    return this.error;
  }
}
