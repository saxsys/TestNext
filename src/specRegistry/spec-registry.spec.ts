import {SpecRegistry} from "./spec-registry";
import {SpecRegistryError} from "./errors/errors";

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
  let specClassName2 = 'Spec2';
  let specName2 = 'spec2';


  beforeAll(() => {
    SpecRegistry.registerSpec(specClass2, specName2);
  });

  it('should have registered a SpecRegistry', () => {
    let includedSpecs = SpecRegistry.getSpecClassNames().indexOf(specClassName2);
    expect(includedSpecs).toBeGreaterThanOrEqual(0);
  });

  it('should accept twice Specs, with the same SpecName', () => {

    let existingSpecName = specName2;
    class SpecRegisterSpecNameDoulbleClass {
      private member: boolean;
    }
    let specRegisterSpecNameDoulbleClass = new SpecRegisterSpecNameDoulbleClass();
    let SpecNameDubleClassName = 'SpecRegisterSpecNameDoulbleClass';
    SpecRegistry.registerSpec(specRegisterSpecNameDoulbleClass, existingSpecName);

    expect(SpecRegistry.getSpecByClassName(SpecNameDubleClassName)).not.toBeUndefined();
  });

  it('should refuse Added same SpecClassProperSpecDecorator twice', () => {
    class SpecClassTestSpecRegAddedTwice {
    }
    let specClassTestSpecRegAddedTwice = new SpecClassTestSpecRegAddedTwice();
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
  let specClassName = 'Spec3'
  let specName = 'thirdSpec';
  let nonRegisteredSpecClassName = 'NonRegisteredSpecClass';

  beforeAll(() => {
    SpecRegistry.registerSpec(specClass, specName)
  });
  it('should return correct SpecRegistryEntry for existing specClassName', () => {
    let thirdTCaseRegEntry = SpecRegistry.getSpecByClassName(specClassName);
    expect(thirdTCaseRegEntry.getSpecName()).toEqual(specName);
    expect(thirdTCaseRegEntry.getClass()).toEqual(specClass);
  });

  it('should return null for not existing specClassName', () => {
    expect(SpecRegistry.getSpecByClassName(nonRegisteredSpecClassName)).toBeUndefined();
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


  let nonExistPropName = 'nonExist';
  let numericPropertyName = 'numericProperty';

  let givenFunctionName = 'aGivenFunction';
  let givenDescription = 'given Description 4';
  let givenExecNumber = 0;

  beforeAll(() => {
    SpecRegistry.registerSpec(specClass, specName);
  });
  it('should accept Given registration for non existent specs', () => {
    class SpecRegistryGiven_NotYetRegisteredClass {
      private givenFunction() {
      }
    }
    let notYetRegisteredClass = new SpecRegistryGiven_NotYetRegisteredClass();
    let notYetRegisteredClassName = 'SpecRegistryGiven_NotYetRegisteredClass';
    let notYetRegisteredGivenName = 'givenFunction';

    SpecRegistry.registerGivenForSpec(notYetRegisteredClass, notYetRegisteredGivenName, givenDescription, givenExecNumber);
    let entry = SpecRegistry.getSpecByClassName(notYetRegisteredClassName);
    expect(entry).not.toBeUndefined();
    expect(entry.getSpecName()).toBeUndefined();
    expect(entry.getClass()).toEqual(notYetRegisteredClass);
    let givenEntry = entry.getGivenArray()[0];
    expect(givenEntry.getName()).toEqual(notYetRegisteredGivenName);
    expect(givenEntry.getDescription()).toEqual(givenDescription);


  });

  it('should refuse the Given, if no property with the Name exists on the SpecClass', () => {
    expect(() => {
      SpecRegistry.registerGivenForSpec(specClass, nonExistPropName, givenDescription);
    }).toThrow(
      new Error(specClassName + '.' + nonExistPropName + ' does not exist.')
    );
  });

  it('should refuse the Given, if property with the Name exists on the SpecClass, but is not a function', () => {
    expect(() => {
      SpecRegistry.registerGivenForSpec(specClass, numericPropertyName, givenDescription);
    }).toThrow(
      new Error(specClassName + '.' + numericPropertyName + ' is not a function.')
    );
  });

  it('should refuse to add a Given for a new Class with existing name', () => {
    class SpecRegistryGiven_ClassNameDouble {
      private givenFunction() {
      }
    }
    let specRegistryThen_ClassNameDouble = new SpecRegistryGiven_ClassNameDouble();
    let classNameDoubleName = 'SpecRegistryGiven_ClassNameDouble';
    let doubleDescription = 'a Class occurring twice with the same Name';
    let functionName = 'givenFunction';
    let functionDescription = 'does something';

    SpecRegistry.registerSpec(specRegistryThen_ClassNameDouble, doubleDescription);
    expect(() => {
        class SpecRegistryGiven_ClassNameDouble {
          private givenFunction() {
          }
        }
        let specRegistryGiven_ClassNameDouble = new SpecRegistryGiven_ClassNameDouble();

        SpecRegistry.registerGivenForSpec(specRegistryGiven_ClassNameDouble, functionName, functionDescription);
      }
    ).toThrowError(SpecRegistryError,
      'SpecClass "' + classNameDoubleName + '" appears at least twice with the same Name, but different Implementations, this is forbidden',
    );
  });

  it('should register the Given, while parameters are correct', () => {
    SpecRegistry.registerGivenForSpec(specClass, givenFunctionName, givenDescription, givenExecNumber);
    let specRegEntry = SpecRegistry.getSpecByClassName(specClassName);
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
  let specClassName = 'Spec5';
  let specName = 'spec5';

  let nonExistPropName = 'nonExist';
  let numericPropertyName = 'numericProperty';

  let functionName = 'aThenFunction';
  let description = 'Then Description 4';
  let execNumber = 0;

  beforeAll(() => {
    SpecRegistry.registerSpec(specClass, specName);
  });

  it('should accept Then registration for non existent specs', () => {
    class SpecRegistryThen_NotYetRegisteredClass {
      private thenFunction() {
      }
    }
    let notYetRegisteredClass = new SpecRegistryThen_NotYetRegisteredClass();
    let notYetRegisteredClassName = 'SpecRegistryThen_NotYetRegisteredClass';
    let notYetRegisteredFunctionName = 'thenFunction';

    SpecRegistry.registerThenForSpec(notYetRegisteredClass, notYetRegisteredFunctionName, description, execNumber);
    let specEntry = SpecRegistry.getSpecByClassName(notYetRegisteredClassName);
    expect(specEntry).not.toBeUndefined();
    expect(specEntry.getSpecName()).toBeUndefined();
    expect(specEntry.getClass()).toEqual(notYetRegisteredClass);
    let thenEntry = specEntry.getThenArray()[0];
    expect(thenEntry.getName()).toEqual(notYetRegisteredFunctionName);
    expect(thenEntry.getDescription()).toEqual(description);
  });

  it('should refuse the Then, if no property with the Name exists on the SpecClass', () => {
    expect(() => {
      SpecRegistry.registerThenForSpec(specClass, nonExistPropName, description);
    }).toThrowError(SpecRegistryError, specClassName + '.' + nonExistPropName + ' does not exist.');
  });

  it('should refuse the Then, if property with the Name exists on the SpecClass, but is not a function', () => {
    expect(() => {
      SpecRegistry.registerThenForSpec(specClass, numericPropertyName, description);
    }).toThrowError(SpecRegistryError, specClassName + '.' + numericPropertyName + ' is not a function.');
  });

  it('should refuse to add a Then for a new Class with existing name', () => {
    class SpecRegistryThen_ClassNameDouble {
      private thenFunction() {
      }
    }
    let specRegistryThen_ClassNameDouble = new SpecRegistryThen_ClassNameDouble();
    let classNameDoubleName = 'SpecRegistryThen_ClassNameDouble';
    let doubleDescription = 'a Class occurring twice with the same Name';
    let functionName = 'givenFunction';
    let functionDescription = 'does something';

    SpecRegistry.registerSpec(specRegistryThen_ClassNameDouble, doubleDescription);
    expect(() => {
        class SpecRegistryThen_ClassNameDouble {
          private thenFunction() {
          }
        }
        let specRegistryThen_ClassNameDouble = new SpecRegistryThen_ClassNameDouble();

        SpecRegistry.registerThenForSpec(specRegistryThen_ClassNameDouble, functionName, functionDescription);
      }
    ).toThrowError(SpecRegistryError, 'SpecClass "' + classNameDoubleName + '" appears at least twice with the same Name, but different Implementations, this is forbidden');
  });

  it('should register the Then, while parameters are correct', () => {
    SpecRegistry.registerThenForSpec(specClass, functionName, description, execNumber);
    let specRegEntry = SpecRegistry.getSpecByClassName(specClassName);
    let thenRegEntry = specRegEntry.getThenArray()[execNumber];
    expect(thenRegEntry.getName()).toEqual(functionName);
    expect(thenRegEntry.getDescription()).toEqual(description);
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

  let functionName = 'aWhenFunction';
  let description = 'When Description 4';

  beforeAll(() => {
    SpecRegistry.registerSpec(specClass, specName);
  });

  it('should accept When registration for non existent specs', () => {
    class SpecRegistryWhen_NotYetRegisteredClass {
      private givenFunction() {
      }
    }
    let notYetRegisteredClass = new SpecRegistryWhen_NotYetRegisteredClass();
    let notYetRegisteredClassName = 'SpecRegistryWhen_NotYetRegisteredClass';
    let notYetRegisteredFunctionName = 'givenFunction';

    SpecRegistry.registerWhenForSpec(notYetRegisteredClass, notYetRegisteredFunctionName, description);
    let specEntry = SpecRegistry.getSpecByClassName(notYetRegisteredClassName);
    expect(specEntry).not.toBeUndefined();
    expect(specEntry.getSpecName()).toBeUndefined();
    expect(specEntry.getClass()).toEqual(notYetRegisteredClass);
    let whenEntry = specEntry.getWhen();
    expect(whenEntry.getName()).toEqual(notYetRegisteredFunctionName);
    expect(whenEntry.getDescription()).toEqual(description);
  });

  it('should refuse the When, if no property with the Name exists on the SpecClass', () => {
    expect(() => {
      SpecRegistry.registerWhenForSpec(specClass, nonExistPropName, description);
    }).toThrowError(SpecRegistryError, specClassName + '.' + nonExistPropName + ' does not exist.');
  });

  it('should refuse the When, if property with the Name exists on the SpecClass, but is not a function', () => {
    expect(() => {
      SpecRegistry.registerWhenForSpec(specClass, numericPropertyName, description);
    }).toThrowError(SpecRegistryError, specClassName + '.' + numericPropertyName + ' is not a function.');
  });

  it('should refuse to add a When for a new Class with existing name', () => {
    class SpecRegistryWhen_ClassNameDouble {
      private thenFunction() {
      }
    }
    let specRegistryWhen_ClassNameDouble = new SpecRegistryWhen_ClassNameDouble();
    let classNameDoubleName = 'SpecRegistryWhen_ClassNameDouble';
    let doubleDescription = 'a Class occurring twice with the same Name';
    let functionName = 'givenFunction';
    let functionDescription = 'does something';

    SpecRegistry.registerSpec(specRegistryWhen_ClassNameDouble, doubleDescription);
    expect(() => {
        class SpecRegistryWhen_ClassNameDouble {
          private thenFunction() {
          }
        }
        let specRegistryWhen_ClassNameDouble = new SpecRegistryWhen_ClassNameDouble();

        SpecRegistry.registerWhenForSpec(specRegistryWhen_ClassNameDouble, functionName, functionDescription);
      }
    ).toThrowError(SpecRegistryError, 'SpecClass "' + classNameDoubleName + '" appears at least twice with the same Name, but different Implementations, this is forbidden');
  });

  it('should register the When, while parameters are correct', () => {
    SpecRegistry.registerWhenForSpec(specClass, functionName, description);
    let specRegEntry = SpecRegistry.getSpecByClassName(specClassName);
    let thenRegEntry = specRegEntry.getWhen();
    expect(thenRegEntry.getName()).toEqual(functionName);
    expect(thenRegEntry.getDescription()).toEqual(description);
  });
});

describe('SpecRegistry.registerSpecForSubject', () => {
  class SpecRegistrySubject_ExistingClass{}
  let existSpecClass = new SpecRegistrySubject_ExistingClass();
  let existSpecClassName = 'SpecRegistrySubject_ExistingClass';
  let existSpecClassDescription = 'SpecRegistrySubject_ExistingClass';
  let subjectName1 = 'subjectTest';
  let specRegEntry;

  beforeAll(()=>{
    SpecRegistry.registerSpec(existSpecClass, existSpecClassDescription);
    specRegEntry = SpecRegistry.getSpecByClassName(existSpecClassName);
  });
  it('should register subject for existing class and save into SpecRegistryEntry', () => {
    SpecRegistry.registerSpecForSubject(existSpecClass, subjectName1);

    let registeredSpecsForSubject = SpecRegistry.getSpecsForSubject(subjectName1);
    expect(registeredSpecsForSubject).toContain(specRegEntry);
    expect(specRegEntry.getSubjects()).toContain(subjectName1);
  });

  it('should register not existing class and its subject', () => {
    class SpecRegistrySubject_NewClass{}
    let newSpecClass = new SpecRegistrySubject_NewClass();
    let newSpecClassName = 'SpecRegistrySubject_NewClass';
    let newSpecClassDescription = 'SpecRegistrySubject_NewClass';
    let subjectName2 = 'subjectTest2';

    SpecRegistry.registerSpecForSubject(newSpecClass, subjectName2);
    let specRegEntry = SpecRegistry.getSpecByClassName(newSpecClassName);
    let registeredSpecsForSubject = SpecRegistry.getSpecsForSubject(subjectName2);

    expect(specRegEntry).not.toBeNull();
    expect(registeredSpecsForSubject).toContain(specRegEntry);
    expect(specRegEntry.getSubjects()).toContain(subjectName2);
  });

  it('should refuse to register the Spec and Class, for a new Class with existing name', () => {
    class SpecRegistrySubject_ExistingClass{}
    let nameDuplicateClass = new SpecRegistrySubject_ExistingClass();
    let subjectName2 = 'name Duplicate';

    expect(() => {
      SpecRegistry.registerSpecForSubject(nameDuplicateClass, subjectName2);
    }).toThrowError(SpecRegistryError,
      'SpecClass "' + existSpecClassName + '" appears at least twice with the same Name, but different Implementations, this is forbidden');
  });

});

