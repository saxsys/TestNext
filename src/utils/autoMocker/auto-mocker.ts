import {ObjectMocker} from './objectMocker/object-mocker';

/**
 * Tool to mock Objects automated
 */
export class AutoMocker {


  private static newMockPrototype(): any {
    return {};
  }

  /**
   * create mock for obj or from argument-less constructor
   * using empty placeholders for properties, except objects which get mocked themselces
   * @param obj object or constructor-function for object to mock
   * @return {any} mocked object
   */
  public static mockDeepFrom(obj: any): any {

    let objToMock;

    // Create Class Pattern to mock from
    if (typeof obj === 'function') {
      try {
        objToMock = new obj;
      } catch (error) {
        throw Error('Cannot mock with this constructor, try with a object of the class to mock.');
      }
    } else {
      objToMock = obj;
    }
    return new ObjectMocker(obj).mockDeep();
  }

  /**
   * create mock for obj or from argument-less constructor
   * using empty placeholders on first level. Inner objects get replaced by empty object.
   * @param obj object or constructor-function for object to mock
   * @return {any} mocket object
   */
  public static mockFrom(obj: any): any {

    let objToMock;

    // Create Class Pattern to mock from
    if (typeof obj === 'function') {
      try {
        objToMock = new obj;
      } catch (error) {
        throw Error('Cannot mock with this constructor, try with a object of the class to mock.');
      }
    } else {
      objToMock = obj;
    }
    return new ObjectMocker(obj).mock();
  }
}
