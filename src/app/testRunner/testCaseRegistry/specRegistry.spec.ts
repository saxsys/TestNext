import {SpecRegistry} from "./specRegistry";

class Spec1 {
  private num = 9;
}
let specName1 = 'exampleSpec1';
let specClass1 = new Spec1();
SpecRegistry.registerSpec(specClass1, specName1);


describe('SpecRegistry.registerSpec()', () => {

  class Spec2 {
    private stuff: string;
  }
  let specClass2 = new Spec2();
  let specName2 = 'Spec2';

  class OtherSpec {
    private member: boolean;
  }
  let specClass3 = new OtherSpec();
  let otherSpecClassName = 'OtherSpec';
  let specClassName3 = 'Spec3';

  beforeAll(() => {
    SpecRegistry.registerSpec(specClass2, specName2);
  });

  it('should have registered a SpecRegistry', () => {
    let includedSpecs = SpecRegistry.getSpecNames().indexOf(specName2);
    expect(includedSpecs).toBeGreaterThanOrEqual(0)
  });

  it('should refuse SpecRegistry added twice, with the same SpecName', () => {

    let existingSpecName = specName2;
    expect(() => {
      SpecRegistry.registerSpec(specClass3, existingSpecName);
    }).toThrow(
      new Error('SpecRegistry with same name already exists ' + existingSpecName + ' (Class: ' + otherSpecClassName + ')'));
  });

  it('should refuse Added same SpecClass twice', () => {
    class SpecClassTestSpecRegAddedTwice{};
    let specClassTestSpecRegAddedTwice =new SpecClassTestSpecRegAddedTwice()
    SpecRegistry.registerSpec(specClassTestSpecRegAddedTwice, 'specNameTestSpecRegAddedTwice1');
    expect(() => {
      SpecRegistry.registerSpec(specClassTestSpecRegAddedTwice, 'specNameTestSpecRegAddedTwice2');
    }).toThrow(
    new Error('SpecClassTestSpecRegAddedTwice is already registered for Spec:specNameTestSpecRegAddedTwice1, can only be registered once, cannot register for Spec:specNameTestSpecRegAddedTwice2')
    );
  });
});

describe('SpecRegistry.getSpecByName', () => {

  class Spec3 {
    private member: boolean;
  }
  let specClass = new Spec3();
  let specName = 'thirdSpec';
  let nonRegisteredSpecClassName = 'NonRegisteredSpecClass';

  beforeAll(() => {
    SpecRegistry.registerSpec(specClass, specName)
  });
  it('should return correct SpecRegistryEntry for existing specName', () => {
    let thirdTCaseRegEntry = SpecRegistry.getSpecByName(specName);
    expect(thirdTCaseRegEntry.getSpecName()).toEqual(specName);
    expect(thirdTCaseRegEntry.getClass()).toEqual(specClass);
  });

  it('should return null for not existing specName', () => {
    expect(SpecRegistry.getSpecByName(nonRegisteredSpecClassName)).toBeUndefined();
  });
});

describe('SpecRegistry.registerGivenForSpec', () => {

  class Spec4 {
    public aGivenFunction() {
      let a = 1;

    };

    public numericProperty = 0;
  }

  let specClass = new Spec4();
  let specClassName = 'Spec4';
  let specName = 'spec4';

  let nonRegisteredSpecClassName = 'NonRegisteredSpecClass';
  let nonExistentTestGivenName = 'nonExistentSpecClassFunction';
  let nonExistPropName = 'nonExist';
  let numericPropertyName = 'numericProperty';

  let givenFunctionName = 'aGivenFunction';
  let givenDescription = 'given Description 4';
  let givenExecNumber = 0;

  beforeAll(() => {
    SpecRegistry.registerSpec(specClass, specName);
  });
  it('should refuse Given registration for non existent specs', () => {
    expect(() => {
      SpecRegistry.registerGivenForSpec(nonRegisteredSpecClassName, nonExistentTestGivenName, givenDescription, givenExecNumber);
    }).toThrow(new Error('Class ' + nonRegisteredSpecClassName + ' is not registered as SpecRegistry'));
  });

  it('should refuse the Given, if no property with the Name exists on the SpecClass', () => {
    expect(() => {
      SpecRegistry.registerGivenForSpec(specClassName, nonExistPropName, givenDescription);
    }).toThrow(
      new Error(specClassName + '.' + nonExistPropName + ' does not exist.')
    );
  });

  it('should refuse the Given, if property with the Name exists on the SpecClass, but is not a function', () => {
    expect(() => {
      SpecRegistry.registerGivenForSpec(specClassName, numericPropertyName, givenDescription);
    }).toThrow(
      new Error(specClassName + '.' + numericPropertyName + ' is not a function.')
    );
  });

  it('should register the Given, while parameters are correct', () => {
    SpecRegistry.registerGivenForSpec(specClassName, givenFunctionName, givenDescription, givenExecNumber);
    let specRegEntry = SpecRegistry.getSpecByName(specName);
    let givenRegEntry = specRegEntry.getGivenArray()[givenExecNumber];
    expect(givenRegEntry.getName()).toEqual(givenFunctionName);
    expect(givenRegEntry.getDescription()).toEqual(givenDescription);
  });
});


describe('SpecRegistry.registerThenForSpec', () => {

  class Spec5 {
    public aThenFunction() {
      let a = 1;

    };

    public numericProperty = 0;
  }

  let specClass = new Spec5();
  let testCLassName = 'Spec5';
  let specName = 'spec5';

  let nonRegisteredSpecClassName = 'NonRegisteredSpecClass';
  let nonExistentTestThenName = 'nonExistentSpecClassFunction';
  let nonExistPropName = 'nonExist';
  let numericPropertyName = 'numericProperty';

  let thenFunctionName = 'aThenFunction';
  let thenDescription = 'Then Description 4';
  let thenExecNumber = 0;

  beforeAll(() => {
    SpecRegistry.registerSpec(specClass, specName);
  });
  it('should refuse Then registration for non existent specs', () => {
    expect(() => {
      SpecRegistry.registerThenForSpec(nonRegisteredSpecClassName, nonExistentTestThenName, thenDescription, thenExecNumber);
    }).toThrow(new Error('Class ' + nonRegisteredSpecClassName + ' is not registered as SpecRegistry'));
  });

  it('should refuse the Then, if no property with the Name exists on the SpecClass', () => {
    expect(() => {
      SpecRegistry.registerThenForSpec(testCLassName, nonExistPropName, thenDescription);
    }).toThrow(
      new Error(testCLassName + '.' + nonExistPropName + ' does not exist.')
    );
  });

  it('should refuse the Then, if property with the Name exists on the SpecClass, but is not a function', () => {
    expect(() => {
      SpecRegistry.registerThenForSpec(testCLassName, numericPropertyName, thenDescription);
    }).toThrow(
      new Error(testCLassName + '.' + numericPropertyName + ' is not a function.')
    );
  });

  it('should register the Then, while parameters are correct', () => {
    SpecRegistry.registerThenForSpec(testCLassName, thenFunctionName, thenDescription, thenExecNumber);
    let specRegEntry = SpecRegistry.getSpecByName(specName);
    let thenRegEntry = specRegEntry.getThenArray()[thenExecNumber];
    expect(thenRegEntry.getName()).toEqual(thenFunctionName);
    expect(thenRegEntry.getDescription()).toEqual(thenDescription);
  });
});

describe('SpecRegistry.registerWhenForSpec', () => {

  class Spec6 {
    public aWhenFunction() {
      let a = 1;

    };

    public numericProperty = 0;
  }

  let specClass = new Spec6();
  let specClassName = 'Spec6';
  let specName = 'spec6';

  let nonRegisteredSpecClassName = 'NonRegisteredSpecClass';
  let nonExistentTestThenName = 'nonExistentSpecClassFunction';
  let nonExistPropName = 'nonExist';
  let numericPropertyName = 'numericProperty';

  let whenFunctionName = 'aWhenFunction';
  let whenDescription = 'When Description 4';

  beforeAll(() => {
    SpecRegistry.registerSpec(specClass, specName);
  });
  it('should refuse When registration for non existent specs', () => {
    expect(() => {
      SpecRegistry.registerWhenForSpec(nonRegisteredSpecClassName, nonExistentTestThenName, whenDescription);
    }).toThrow(new Error('Class ' + nonRegisteredSpecClassName + ' is not registered as SpecRegistry'));
  });

  it('should refuse the When, if no property with the Name exists on the SpecClass', () => {
    expect(() => {
      SpecRegistry.registerWhenForSpec(specClassName, nonExistPropName, whenDescription);
    }).toThrow(
      new Error(specClassName + '.' + nonExistPropName + ' does not exist.')
    );
  });

  it('should refuse the When, if property with the Name exists on the SpecClass, but is not a function', () => {
    expect(() => {
      SpecRegistry.registerWhenForSpec(specClassName, numericPropertyName, whenDescription);
    }).toThrow(
      new Error(specClassName + '.' + numericPropertyName + ' is not a function.')
    );
  });

  it('should register the When, while parameters are correct', () => {
    SpecRegistry.registerWhenForSpec(specClassName, whenFunctionName, whenDescription);
    let specRegEntry = SpecRegistry.getSpecByName(specName);
    let thenRegEntry = specRegEntry.getWhen();
    expect(thenRegEntry.getName()).toEqual(whenFunctionName);
    expect(thenRegEntry.getDescription()).toEqual(whenDescription);
  });
});


