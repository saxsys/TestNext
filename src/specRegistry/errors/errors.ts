export class SpecRegistryError extends Error{

  private className;
  private functionName;

  constructor(message:string, className: string, functionName?:string){
    super(message);
    this.className = className;
    this.functionName = functionName;
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SpecRegistryError.prototype);
  }
}
