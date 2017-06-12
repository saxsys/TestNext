import {SpecRegistry} from "./spec-registry";
import {SpecRegistryError} from "./errors/errors";


describe('SpecRegistry.registerSpec()', () => {

  class Spec2 {
  }
  let specClass2 = Spec2.prototype.constructor;
  let specClassName2 = 'Spec2';
  let specName2 = 'spec2';
  let specRegistry = new SpecRegistry();

  beforeAll(() => {
    specRegistry.registerSpec(specClass2, specName2);
  });

  it('should have registered a SpecRegistry', () => {
    let includedSpecs = specRegistry.getSpecClassNames().indexOf(specClassName2);
    expect(includedSpecs).toBeGreaterThanOrEqual(0);
  });

  it('should accept two Specs, with the same SpecName', () => {

    let existingSpecName = specName2;
    class SpecRegisterSpecNameDoubleClass {
    }
    let specRegisterSpecNameDoubleClass = SpecRegisterSpecNameDoubleClass.prototype.constructor;
    let specNameDoubleClassName = 'SpecRegisterSpecNameDoubleClass';
    specRegistry.registerSpec(specRegisterSpecNameDoubleClass, existingSpecName);
    expect(specRegistry.getSpecByClassName(specNameDoubleClassName)).not.toBeUndefined();
  });

  it('should refuse adding multiple SpecName for one SpecClass', () => {
    class SpecClassTestSpecRegAddedTwice {
    }
    let specClassTestSpecRegAddedTwice = SpecClassTestSpecRegAddedTwice.prototype.constructor;
    specRegistry.registerSpec(specClassTestSpecRegAddedTwice, 'specNameTestSpecRegAddedTwice1');
    expect(() => {
      specRegistry.registerSpec(specClassTestSpecRegAddedTwice, 'specNameTestSpecRegAddedTwice2');
    }).toThrowError(SpecRegistryError,
      'SpecClass "SpecClassTestSpecRegAddedTwice" already got has Description: "specNameTestSpecRegAddedTwice1", ' +
      'only one is possible, cannot add: "specNameTestSpecRegAddedTwice2"'
    );
  });

  it('should refuse adding new class-name-duplicate', () => {
    class SpecRegistrySpec_ClassNameDouble {
      val: number;
    }
    let specRegistrySpec_ClassNameDouble = SpecRegistrySpec_ClassNameDouble.prototype.constructor;
    let classNameDoubleName = 'SpecRegistrySpec_ClassNameDouble';
    let doubleDescription = 'a Class occurring twice with the same Name';
    let functionName = 'givenFunction';
    let functionDescription = 'does something';

    specRegistry.registerSpec(specRegistrySpec_ClassNameDouble, doubleDescription);
    expect(() => {
        class SpecRegistrySpec_ClassNameDouble {
          val: number;
        }
        let specRegistrySpec_ClassNameDouble = SpecRegistrySpec_ClassNameDouble.prototype.constructor;

        specRegistry.registerThenForSpec(specRegistrySpec_ClassNameDouble, functionName, functionDescription);
      }
    ).toThrowError(SpecRegistryError, 'A different Class with the Name "' + classNameDoubleName + '" is already registered, class-name-duplicates are forbidden');
  });


});


describe('SpecRegistry.getSpecByName', () => {

  class Spec3 {}
  let specClassConstructor = Spec3.prototype.constructor;
  let specClassName = 'Spec3';
  let specName = 'thirdSpec';
  let nonRegisteredSpecClassName = 'NonRegisteredSpecClass';
  let specRegistry = new SpecRegistry();

  beforeAll(() => {
    specRegistry.registerSpec(specClassConstructor, specName)
  });
  it('should return correct SpecRegistryEntry for existing specClassName', () => {
    let thirdTCaseRegEntry = specRegistry.getSpecByClassName(specClassName);
    expect(thirdTCaseRegEntry.getSpecName()).toEqual(specName);
    expect(thirdTCaseRegEntry.getClassConstructor()).toEqual(specClassConstructor);
  });

  it('should return null for not existing specClassName', () => {
    expect(specRegistry.getSpecByClassName(nonRegisteredSpecClassName)).toBeUndefined();
  });
});

describe('SpecRegistry.registerGivenForSpec', () => {

  let specRegistry = new SpecRegistry();

  class Spec4 {
    private a;
    public aGivenFunction() {
      this.a = 1;

    };

    public numericProperty = 0;
  }

  let specClassConstructor = Spec4.prototype.constructor;
  let specClassName = 'Spec4';
  let specName = 'spec4';


  let nonExistPropName = 'nonExist';
  let numericPropertyName = 'numericProperty';

  let givenFunctionName = 'aGivenFunction';
  let givenDescription = 'given Description 4';
  let givenExecNumber = 0;

  beforeAll(() => {
    specRegistry.registerSpec(specClassConstructor, specName);
  });
  it('should accept Given registration for non existent specs', () => {
    class SpecRegistryGiven_NotYetRegisteredClass {
      private givenFunction() {
      }
    }
    let notYetRegisteredClass = SpecRegistryGiven_NotYetRegisteredClass.prototype.constructor;
    let notYetRegisteredClassName = 'SpecRegistryGiven_NotYetRegisteredClass';
    let notYetRegisteredGivenName = 'givenFunction';

    specRegistry.registerGivenForSpec(notYetRegisteredClass, notYetRegisteredGivenName, givenDescription, givenExecNumber);
    let entry = specRegistry.getSpecByClassName(notYetRegisteredClassName);
    expect(entry).not.toBeUndefined();
    expect(entry.getSpecName()).toBeUndefined();
    expect(entry.getClassConstructor()).toEqual(notYetRegisteredClass);
    let givenEntry = entry.getGivenArray()[0];
    expect(givenEntry.getName()).toEqual(notYetRegisteredGivenName);
    expect(givenEntry.getDescription()).toEqual(givenDescription);


  });

  xit('should refuse the Given, if no property with the Name exists on the SpecClass', () => {
    expect(() => {
      specRegistry.registerGivenForSpec(specClassConstructor, nonExistPropName, givenDescription);
    }).toThrow(
      new Error(specClassName + '.' + nonExistPropName + ' does not exist.')
    );
  });

  xit('should refuse the Given, if property with the Name exists on the SpecClass, but is not a function', () => {
    expect(() => {
      specRegistry.registerGivenForSpec(specClassConstructor, numericPropertyName, givenDescription);
    }).toThrow(
      new Error(specClassName + '.' + numericPropertyName + ' is not a function.')
    );
  });

  it('should refuse to add a Given for a new Class with existing name', () => {
    class SpecRegistryGiven_ClassNameDouble {
      private givenFunction() {
      }
    }
    let specRegistryThen_ClassNameDouble = SpecRegistryGiven_ClassNameDouble.prototype.constructor;
    let classNameDoubleName = 'SpecRegistryGiven_ClassNameDouble';
    let doubleDescription = 'a Class occurring twice with the same Name';
    let functionName = 'givenFunction';
    let functionDescription = 'does something';

    specRegistry.registerSpec(specRegistryThen_ClassNameDouble, doubleDescription);
    expect(() => {
        class SpecRegistryGiven_ClassNameDouble {
          private givenFunction() {
          }
        }
        let specRegistryGiven_ClassNameDouble = SpecRegistryGiven_ClassNameDouble.prototype.constructor;

        specRegistry.registerGivenForSpec(specRegistryGiven_ClassNameDouble, functionName, functionDescription);
      }
    ).toThrowError(SpecRegistryError,
      'A different Class with the Name "' + classNameDoubleName + '" is already registered, class-name-duplicates are forbidden',
    );
  });

  it('should register the Given, while parameters are correct', () => {
    specRegistry.registerGivenForSpec(specClassConstructor, givenFunctionName, givenDescription, givenExecNumber);
    let specRegEntry = specRegistry.getSpecByClassName(specClassName);
    let givenRegEntry = specRegEntry.getGivenArray()[givenExecNumber];
    expect(givenRegEntry.getName()).toEqual(givenFunctionName);
    expect(givenRegEntry.getDescription()).toEqual(givenDescription);
  });
});


describe('SpecRegistry.registerThenForSpec', () => {
  let specRegistry = new SpecRegistry();

  class Spec5 {
    private a;
    public aThenFunction() {
      this.a = 1;

    };

    public numericProperty = 0;
  }

  let specClassConstructor = Spec5.prototype.constructor;
  let specClassName = 'Spec5';
  let specName = 'spec5';

  let nonExistPropName = 'nonExist';
  let numericPropertyName = 'numericProperty';

  let functionName = 'aThenFunction';
  let description = 'Then Description 4';
  let execNumber = 0;

  beforeAll(() => {
    specRegistry.registerSpec(specClassConstructor, specName);
  });

  it('should accept Then registration for non existent specs', () => {
    class SpecRegistryThen_NotYetRegisteredClass {
      private thenFunction() {
      }
    }
    let notYetRegisteredClass = SpecRegistryThen_NotYetRegisteredClass.prototype.constructor;
    let notYetRegisteredClassName = 'SpecRegistryThen_NotYetRegisteredClass';
    let notYetRegisteredFunctionName = 'thenFunction';

    specRegistry.registerThenForSpec(notYetRegisteredClass, notYetRegisteredFunctionName, description, execNumber);
    let specEntry = specRegistry.getSpecByClassName(notYetRegisteredClassName);
    expect(specEntry).not.toBeUndefined();
    expect(specEntry.getSpecName()).toBeUndefined();
    expect(specEntry.getClassConstructor()).toEqual(notYetRegisteredClass);
    let thenEntry = specEntry.getThenArray()[0];
    expect(thenEntry.getName()).toEqual(notYetRegisteredFunctionName);
    expect(thenEntry.getDescription()).toEqual(description);
  });

  xit('should refuse the Then, if no property with the Name exists on the SpecClass', () => {
    expect(() => {
      specRegistry.registerThenForSpec(specClassConstructor, nonExistPropName, description);
    }).toThrowError(SpecRegistryError, specClassName + '.' + nonExistPropName + ' does not exist.');
  });

  xit('should refuse the Then, if property with the Name exists on the SpecClass, but is not a function', () => {
    expect(() => {
      specRegistry.registerThenForSpec(specClassConstructor, numericPropertyName, description);
    }).toThrowError(SpecRegistryError, specClassName + '.' + numericPropertyName + ' is not a function.');
  });

  it('should refuse to add a Then for a new class-name-duplicate', () => {
    class SpecRegistryThen_ClassNameDouble {
      private thenFunction() {
      }
    }
    let specRegistryThen_ClassNameDouble = SpecRegistryThen_ClassNameDouble.prototype.constructor;
    let classNameDoubleName = 'SpecRegistryThen_ClassNameDouble';
    let doubleDescription = 'a Class occurring twice with the same Name';
    let functionName = 'givenFunction';
    let functionDescription = 'does something';

    specRegistry.registerSpec(specRegistryThen_ClassNameDouble, doubleDescription);
    expect(() => {
        class SpecRegistryThen_ClassNameDouble {
          private thenFunction() {
          }
        }
        let specRegistryThen_ClassNameDouble = SpecRegistryThen_ClassNameDouble.prototype.constructor;

        specRegistry.registerThenForSpec(specRegistryThen_ClassNameDouble, functionName, functionDescription);
      }
    ).toThrowError(SpecRegistryError, 'A different Class with the Name "' + classNameDoubleName + '" is already registered, class-name-duplicates are forbidden');
  });

  it('should register the Then, while parameters are correct', () => {
    specRegistry.registerThenForSpec(specClassConstructor, functionName, description, execNumber);
    let specRegEntry = specRegistry.getSpecByClassName(specClassName);
    let thenRegEntry = specRegEntry.getThenArray()[execNumber];
    expect(thenRegEntry.getName()).toEqual(functionName);
    expect(thenRegEntry.getDescription()).toEqual(description);
  });
});

describe('SpecRegistry.registerWhenForSpec', () => {
  let specRegistry = new SpecRegistry();
  class Spec6 {
    private a;
    public aWhenFunction() {
      this.a = 1;

    };

    public numericProperty = 0;
  }

  let specClassConstructor = Spec6.prototype.constructor;
  let specClassName = 'Spec6';
  let specName = 'spec6';

  let nonExistPropName = 'nonExist';
  let numericPropertyName = 'numericProperty';

  let functionName = 'aWhenFunction';
  let description = 'When Description 4';

  beforeAll(() => {
    specRegistry.registerSpec(specClassConstructor, specName);
  });

  it('should accept When registration for non existent specs', () => {
    class SpecRegistryWhen_NotYetRegisteredClass {
      private givenFunction() {
      }
    }
    let notYetRegisteredClass = SpecRegistryWhen_NotYetRegisteredClass.prototype.constructor;
    let notYetRegisteredClassName = 'SpecRegistryWhen_NotYetRegisteredClass';
    let notYetRegisteredFunctionName = 'givenFunction';

    specRegistry.registerWhenForSpec(notYetRegisteredClass, notYetRegisteredFunctionName, description);
    let specEntry = specRegistry.getSpecByClassName(notYetRegisteredClassName);
    expect(specEntry).not.toBeUndefined();
    expect(specEntry.getSpecName()).toBeUndefined();
    expect(specEntry.getClassConstructor()).toEqual(notYetRegisteredClass);
    let whenEntry = specEntry.getWhen();
    expect(whenEntry.getName()).toEqual(notYetRegisteredFunctionName);
    expect(whenEntry.getDescription()).toEqual(description);
  });

  xit('should refuse the When, if no property with the Name exists on the SpecClass', () => {
    expect(() => {
      specRegistry.registerWhenForSpec(specClassConstructor, nonExistPropName, description);
    }).toThrowError(SpecRegistryError, specClassName + '.' + nonExistPropName + ' does not exist.');
  });

  xit('should refuse the When, if property with the Name exists on the SpecClass, but is not a function', () => {
    expect(() => {
      specRegistry.registerWhenForSpec(specClassConstructor, numericPropertyName, description);
    }).toThrowError(SpecRegistryError, specClassName + '.' + numericPropertyName + ' is not a function.');
  });

  it('should refuse to add a When for a new class-name-duplicate', () => {
    class SpecRegistryWhen_ClassNameDouble {
      private thenFunction() {
      }
    }
    let specRegistryWhen_ClassNameDouble = SpecRegistryWhen_ClassNameDouble.prototype.constructor;
    let classNameDoubleName = 'SpecRegistryWhen_ClassNameDouble';
    let doubleDescription = 'a Class occurring twice with the same Name';
    let functionName = 'givenFunction';
    let functionDescription = 'does something';

    specRegistry.registerSpec(specRegistryWhen_ClassNameDouble, doubleDescription);
    expect(() => {
        class SpecRegistryWhen_ClassNameDouble {
          private thenFunction() {
          }
        }
        let specRegistryWhen_ClassNameDouble = SpecRegistryWhen_ClassNameDouble.prototype.constructor;

        specRegistry.registerWhenForSpec(specRegistryWhen_ClassNameDouble, functionName, functionDescription);
      }
    ).toThrowError(SpecRegistryError, 'A different Class with the Name "' + classNameDoubleName + '" is already registered, class-name-duplicates are forbidden');
  });

  it('should register the When, while parameters are correct', () => {
    specRegistry.registerWhenForSpec(specClassConstructor, functionName, description);
    let specRegEntry = specRegistry.getSpecByClassName(specClassName);
    let thenRegEntry = specRegEntry.getWhen();
    expect(thenRegEntry.getName()).toEqual(functionName);
    expect(thenRegEntry.getDescription()).toEqual(description);
  });
});

describe('SpecRegistry.registerSpecForSubject', () => {
  let specRegistry = new SpecRegistry();
  class SpecRegistrySubject_ExistingClass {
  }
  let existSpecClass = SpecRegistrySubject_ExistingClass.prototype.constructor;
  let existSpecClassName = 'SpecRegistrySubject_ExistingClass';
  let existSpecClassDescription = 'SpecRegistrySubject_ExistingClass';
  let subjectName1 = 'subjectTest';
  let specRegEntry;

  beforeAll(() => {
    specRegistry.registerSpec(existSpecClass, existSpecClassDescription);
    specRegEntry = specRegistry.getSpecByClassName(existSpecClassName);
  });
  it('should register subject for existing class and save into SpecRegistryEntry', () => {
    specRegistry.registerSpecForSubject(existSpecClass, subjectName1);

    let registeredSpecsForSubject = specRegistry.getSpecsForSubject(subjectName1);
    expect(registeredSpecsForSubject).toContain(specRegEntry);
    expect(specRegEntry.getSubjects()).toContain(subjectName1);
  });

  it('should register not existing class and its subject', () => {
    class SpecRegistrySubject_NewClass {
    }
    let newSpecClass = SpecRegistrySubject_NewClass.prototype.constructor;
    let newSpecClassName = 'SpecRegistrySubject_NewClass';
    let subjectName2 = 'subjectTest2';

    specRegistry.registerSpecForSubject(newSpecClass, subjectName2);
    let specRegEntry = specRegistry.getSpecByClassName(newSpecClassName);
    let registeredSpecsForSubject = specRegistry.getSpecsForSubject(subjectName2);

    expect(specRegEntry).not.toBeNull();
    expect(registeredSpecsForSubject).toContain(specRegEntry);
    expect(specRegEntry.getSubjects()).toContain(subjectName2);
  });

  it('should refuse to register the Spec and Class, for a new class-name-duplicate', () => {
    class SpecRegistrySubject_ExistingClass {
    }
    let nameDuplicateClass = SpecRegistrySubject_ExistingClass.prototype.constructor;
    let subjectName2 = 'name Duplicate';

    expect(() => {
      specRegistry.registerSpecForSubject(nameDuplicateClass, subjectName2);
    }).toThrowError(SpecRegistryError,
      'A different Class with the Name "' + existSpecClassName + '" is already registered, class-name-duplicates are forbidden');
  });
});

describe('SpecRegistry.getSpecsWithoutSubject', () => {
  let specRegistry = new SpecRegistry();
  it('should return Specs, which do not have a Subject', () => {
    class SpecRegistry_getSpecWithoutSubject_ClassWithoutSubject {
    }
    let classWithoutSubject = SpecRegistry_getSpecWithoutSubject_ClassWithoutSubject.prototype.constructor;
    let classWithoutSubjectName = 'SpecRegistry_getSpecWithoutSubject_ClassWithoutSubject';
    class SpecRegistry_getSpecWithoutSubject_ClassWithSubject {
    }
    let classWithSubject = SpecRegistry_getSpecWithoutSubject_ClassWithSubject.prototype.constructor;
    let classWithSubjectName = 'SpecRegistry_getSpecWithoutSubject_ClassWithSubject';
    specRegistry.registerSpec(classWithoutSubject, classWithoutSubjectName);
    specRegistry.registerSpecForSubject(classWithSubject, classWithSubjectName);
    specRegistry.registerSpecForSubject(classWithSubject, 'Subject opposite to NoSubject');

    let entryWithoutSubject = specRegistry.getSpecByClassName(classWithoutSubjectName);
    let entryWithSubject = specRegistry.getSpecByClassName(classWithSubjectName);
    let specsWithoutSubject = specRegistry.getSpecsWithoutSubject();
    expect(specsWithoutSubject).toContain(entryWithoutSubject);
    expect(specsWithoutSubject).not.toContain(entryWithSubject);


  });
});
