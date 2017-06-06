import {TestMethodRegistryEntry} from "../testMethodRegistryEntry/testMethod-registry-entry";
import {ISpecExecutable, ISpecMethod} from './ISpec';
import {SpecMethodType} from "../testMethodRegistryEntry/spec-method-type";
import {SpecRegistryError} from "../errors/errors";
import {log} from "util";


export class SpecRegistryEntry implements ISpecExecutable{
  private specClass: any;
  private description: string;

  private given = new Map<number, TestMethodRegistryEntry>(); // exec-Number, MethodName
  private when: TestMethodRegistryEntry;
  private then = new Map<number, TestMethodRegistryEntry>(); // exec-Number, MethodName

  constructor(specClass: any) {
    this.specClass = specClass;
  }

  setDescription(specName: string) {
    this.description = specName
  }

  addGiven(functionName: string, description: string, execNumber?: number) {
    if(this.getMethod(functionName) != null)
      throw new SpecRegistryError('Multiple Methods with same Name on ' + this.getClassName() + '.' + functionName, this.getClassName(), functionName);
    if (execNumber == null) execNumber = 0;
    if (this.given == null) this.given = new Map<number, TestMethodRegistryEntry>();
    if (this.given.get(execNumber) != null)
      throw new SpecRegistryError('Multiple @given, without ExecNumber, or it (' + execNumber + ') already exists on ' + this.getClassName() + '.' + functionName, this.getClassName(), functionName);
    this.given.set(execNumber, new TestMethodRegistryEntry(functionName, description, SpecMethodType.GIVEN, execNumber));
  }

  addThen(functionName: string, description: string, execNumber: number) {
    if(this.getMethod(functionName) != null)
      throw new SpecRegistryError('Multiple Methods with same Name on ' + this.getClassName() + '.' + functionName, this.getClassName(), functionName);
    if (execNumber == null) execNumber = 0;
    if (this.then == null) this.then = new Map<number, TestMethodRegistryEntry>();
    if (this.then.get(execNumber) != null)
      throw new SpecRegistryError('Multiple @then, without ExecNumber, or it (' + execNumber + ') already exists on ' + this.getClassName() + '.' + functionName, this.getClassName(), functionName);
    this.then.set(execNumber, new TestMethodRegistryEntry(functionName, description, SpecMethodType.THEN, execNumber));
  }

  addWhen(functionName: string, description: string) {
    if (this.when != null)
      throw new SpecRegistryError('Only one @When allowed on ' + this.getClassName() + 'cannot add ' + functionName + ', ' + this.when.getName() + ' is already @When', this.getClassName(), functionName);
    if(this.getMethod(functionName) != null)
      throw new SpecRegistryError('Multiple Methods with same Name on ' + this.getClassName() + '.' + functionName, this.getClassName(), functionName);
    this.when = new TestMethodRegistryEntry(functionName, description, SpecMethodType.WHEN);
  }

  getDescription():string{
    if(this.description == null)
      return '';
    return this.description;
  }

  getSpecName():string {
    return this.description;
  }

  getClassName():string {

    return this.specClass.constructor.name;
  }

  getClass():any {
    return this.specClass;
  }

  getGivenArray(): Array<ISpecMethod> {
    let keys = Array.from(this.given.keys()).sort();

    let returnArray = new Array<TestMethodRegistryEntry>();
    keys.forEach((key) => {
      returnArray.push(this.given.get(key));
    });
    return returnArray;
  }

  getGiven(methodName:string): ISpecMethod{
    let returnMethod = null;
    this.given.forEach((method) => {
      if(method.getName() == methodName) {
        returnMethod = method;
        return;
      }
      });
      return returnMethod;
  }

  getThenArray(): Array<ISpecMethod> {
    let keys = Array.from(this.then.keys()).sort();

    let returnArray = new Array<TestMethodRegistryEntry>();
    keys.forEach((key) => {
      returnArray.push(this.then.get(key));
    });
    return returnArray;
  }

  getThen(methodName:string): ISpecMethod{
    let returnMethod = null;
    this.then.forEach((method) => {
      if(method.getName() == methodName) {
        returnMethod = method;
        return;
      }
    });

    return returnMethod;
  }

  getWhen(): ISpecMethod {
    return this.when;
  }

  getMethod(methodName: string):ISpecMethod{
    let method;

    if(this.when != null && this.when.getName() == methodName)
      return this.when;

    method = this.getGiven(methodName);
    if(method != null )
      return method;


    method = this.getThen(methodName);
    return method;
  }
}



