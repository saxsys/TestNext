import {SpecMethod} from "../specRegistry/specMethod/spec-method";
import {ISpec, ISpecMethod} from './ISpec';
import {SpecMethodType} from "../specRegistry/specMethod/spec-method-type";
import {SpecRegistryError} from "../specRegistry/errors/errors";
import {specRegistry} from "../specRegistry/spec-registry-storage";


export class Spec implements ISpec{
  private specClassConstructor: any;
  private specDescription: string;
  private subjects = new Array<string>();
  //private ignored:boolean;

  private parentName: ISpec;

  private given = new Map<number, SpecMethod>(); // exec-Number, MethodName
  private when: SpecMethod;
  private then = new Map<number, SpecMethod>(); // exec-Number, MethodName


  constructor(specClassConstructor: Function, parentSpec?:ISpec) {
    this.specClassConstructor = specClassConstructor;
    this.parentName = parentSpec;
  }

  setDescription(specName: string) {
    this.specDescription = specName
  }

  addSubject(subject:string){
    if(!this.subjects.includes(subject))
      this.subjects.push(subject);
  }

  addGiven(functionName: string, description: string, execNumber?: number) {
    if(this.getOwnMethod(functionName) != null)
      throw new SpecRegistryError('Multiple Methods with same Name on ' + this.getClassName() + '.' + functionName, this.getClassName(), functionName);
    if (execNumber == null) execNumber = 0;
    if (this.given == null) this.given = new Map<number, SpecMethod>();
    if (this.given.get(execNumber) != null)
      throw new SpecRegistryError('Multiple @given, without ExecNumber, or it (' + execNumber + ') already exists on ' + this.getClassName() + '.' + functionName, this.getClassName(), functionName);
    this.given.set(execNumber, new SpecMethod(functionName, description, SpecMethodType.GIVEN, execNumber));
  }

  addThen(functionName: string, description: string, execNumber: number) {
    if(this.getOwnMethod(functionName) != null)
      throw new SpecRegistryError('Multiple Methods with same Name on ' + this.getClassName() + '.' + functionName, this.getClassName(), functionName);
    if (execNumber == null) execNumber = 0;
    if (this.then == null) this.then = new Map<number, SpecMethod>();
    if (this.then.get(execNumber) != null)
      throw new SpecRegistryError('Multiple @then, without ExecNumber, or it (' + execNumber + ') already exists on ' + this.getClassName() + '.' + functionName, this.getClassName(), functionName);
    this.then.set(execNumber, new SpecMethod(functionName, description, SpecMethodType.THEN, execNumber));
  }

  addWhen(functionName: string, description: string) {
    if (this.when != null)
      throw new SpecRegistryError('Only one @When allowed on ' + this.getClassName() + 'cannot add ' + functionName + ', ' + this.when.getName() + ' is already @When', this.getClassName(), functionName);
    if(this.getOwnMethod(functionName) != null)
      throw new SpecRegistryError('Multiple Methods with same Name on ' + this.getClassName() + '.' + functionName, this.getClassName(), functionName);
    this.when = new SpecMethod(functionName, description, SpecMethodType.WHEN);
  }

  getDescription():string{
    if(this.specDescription == null)
      return '';
    return this.specDescription;
  }

  getSubjects():Array<string>{
    return this.subjects;
  }

  getSpecName():string {
    return this.specDescription;
  }

  getClassName():string {

    return this.specClassConstructor.name;
  }

  getClassConstructor():Function {
    return this.specClassConstructor;
  }

  getParentSpec(): ISpec{
    return this.parentName;
  }

  getNewSpecObject(): any{
    if(this.specClassConstructor == null)
      throw new SpecRegistryError('Class of ' + this.getClassName() + 'is not set', this.getClassName());
    if(this.specClassConstructor.length > 0)
      throw new SpecRegistryError('Class of "' + this.getClassName() + '" has constructor-arguments, this is forbidden', this.getClassName());

    return new this.specClassConstructor;
  };

  getOwnGiven(): Array<ISpecMethod> {
    let keys = Array.from(this.given.keys()).sort();

    let returnArray = new Array<SpecMethod>();
    keys.forEach((key) => {
      returnArray.push(this.given.get(key));
    });
    return returnArray;
  }

  getOwnGivenByName(methodName:string): ISpecMethod{
    let returnMethod = null;
    this.given.forEach((method) => {
      if(method.getName() == methodName) {
        returnMethod = method;
        return;
      }
      });
      return returnMethod;
  }

  getGiven():Array<ISpecMethod>{
    let returnMethods = new Array<ISpecMethod>();

    if(this.parentName != null) {
      returnMethods = returnMethods.concat(this.parentName.getGiven());
    }
    returnMethods = returnMethods.concat(this.getOwnGiven());
    return returnMethods;
  }

  getOwnThen(): Array<ISpecMethod> {
    let keys = Array.from(this.then.keys()).sort();

    let returnArray = new Array<SpecMethod>();
    keys.forEach((key) => {
      returnArray.push(this.then.get(key));
    });
    return returnArray;
  }

  getOwnThenByName(methodName:string): ISpecMethod{
    let returnMethod = null;
    this.then.forEach((method) => {
      if(method.getName() == methodName) {
        returnMethod = method;
        return;
      }
    });

    return returnMethod;
  }

  getThen():Array<ISpecMethod>{
    let returnMethods = new Array<ISpecMethod>();
    if(this.parentName != null)
      returnMethods = returnMethods.concat(this.parentName.getThen());
    returnMethods = returnMethods.concat(this.getOwnThen());

    return returnMethods;
  }

  getOwnWhen(): ISpecMethod {
    return this.when;
  }

  getWhen():ISpecMethod{
    if(this.when != null)
      return this.when;
    if(this.parentName != null)
      return this.parentName.getWhen();
  }


  getOwnMethods():Array<ISpecMethod>{
    let methods = new Array<ISpecMethod>();
    methods = methods.concat(this.getOwnGiven());
    methods.push(this.getOwnWhen());
    methods = methods.concat(this.getOwnThen());
    return methods;
  }

  getOwnMethod(methodName: string):ISpecMethod{
    let method;

    if(this.when != null && this.when.getName() == methodName)
      return this.when;

    method = this.getOwnGivenByName(methodName);
    if(method != null )
      return method;


    method = this.getOwnThenByName(methodName);
    return method;
  }

  isExecutableSpec():boolean{
    if(this.specDescription == null)
      return false;
    return true;
  }


}



