import {ObjectMocker} from './objectMocker/object-mocker';
export class AutoMocker {

  private static newMockPrototype(): any {
    return {};
  }

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
