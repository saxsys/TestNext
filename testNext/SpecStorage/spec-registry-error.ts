export class SpecRegistryError extends Error{

  public className;
  public propertyName;

  constructor(message:string, className: string, propertyName?:string){
    super(message);
    this.className = className;
    this.propertyName = propertyName;
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SpecRegistryError.prototype);
  }
}
