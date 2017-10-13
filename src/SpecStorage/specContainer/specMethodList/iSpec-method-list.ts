import {ISpecMethodContainer} from "../specMethodContainer/iSpec-method-Container";

/**
 * @interface for Classes containing data about one Type of SpecMethods  of one Spec(e.g. all Given of a Spec)
 */
export interface ISpecMethodList{
  /**
   * add a Method to the List
   * @param {string} functionName
   * @param {string} description
   * @param {Number} execNumber
   */
  addMethod(functionName: string, description: string, execNumber: Number);

  /**
   * get all the data about all here set SpecMethods
   * @return {Array<ISpecMethodContainer>}
   */
  getMethods():Array<ISpecMethodContainer>;

  /**
   * get all data about one SpecMethod
   * @param {string} methodName
   * @return {ISpecMethodContainer}
   */
  getMethod(methodName:string):ISpecMethodContainer;
}
