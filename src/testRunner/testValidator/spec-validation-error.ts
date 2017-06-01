export class SpecValidationError extends Error{
  constructor(message:string){
    super(message);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SpecValidationError.prototype);
  }
}
