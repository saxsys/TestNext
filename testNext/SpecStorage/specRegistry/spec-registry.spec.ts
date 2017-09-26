import {SpecRegistry} from "./spec-registry";
import {SpecRegistryError} from "../spec-registry-error";
import {Injectable} from "@angular/core";


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
    expect(specRegistry.getSpecContainerByClassName(specNameDoubleClassName)).not.toBeUndefined();
  });

  it('should refuse adding multiple SpecName for one SpecContainer', () => {
    class SpecClassTestSpecRegAddedTwice {
    }
    let specClassTestSpecRegAddedTwice = SpecClassTestSpecRegAddedTwice.prototype.constructor;
    specRegistry.registerSpec(specClassTestSpecRegAddedTwice, 'specNameTestSpecRegAddedTwice1');
    expect(() => {
      specRegistry.registerSpec(specClassTestSpecRegAddedTwice, 'specNameTestSpecRegAddedTwice2');
    }).toThrowError(SpecRegistryError,
      'Spec "SpecClassTestSpecRegAddedTwice" already got has Description: "specNameTestSpecRegAddedTwice1", ' +
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
  it('should return correct SpecContainer for existing specClassName', () => {
    let thirdTCaseRegEntry = specRegistry.getSpecContainerByClassName(specClassName);
    expect(thirdTCaseRegEntry.getDescription()).toEqual(specName);
    expect(thirdTCaseRegEntry.getClassConstructor()).toEqual(specClassConstructor);
  });

  it('should return null for not existing specClassName', () => {
    expect(specRegistry.getSpecContainerByClassName(nonRegisteredSpecClassName)).toBeUndefined();
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
    let entry = specRegistry.getSpecContainerByClassName(notYetRegisteredClassName);
    expect(entry).not.toBeUndefined();
    expect(entry.getDescription()).toBeUndefined();
    expect(entry.getClassConstructor()).toEqual(notYetRegisteredClass);
    let givenEntry = entry.getGiven()[0];
    expect(givenEntry.getName()).toEqual(notYetRegisteredGivenName);
    expect(givenEntry.getDescription()).toEqual(givenDescription);


  });

  xit('should refuse the Given, if no property with the Name exists on the SpecContainer', () => {
    expect(() => {
      specRegistry.registerGivenForSpec(specClassConstructor, nonExistPropName, givenDescription);
    }).toThrow(
      new Error(specClassName + '.' + nonExistPropName + ' does not exist.')
    );
  });

  xit('should refuse the Given, if property with the Name exists on the SpecContainer, but is not a function', () => {
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
    let specRegEntry = specRegistry.getSpecContainerByClassName(specClassName);
    let givenRegEntry = specRegEntry.getGiven()[givenExecNumber];
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
    let specEntry = specRegistry.getSpecContainerByClassName(notYetRegisteredClassName);
    expect(specEntry).not.toBeUndefined();
    expect(specEntry.getDescription()).toBeUndefined();
    expect(specEntry.getClassConstructor()).toEqual(notYetRegisteredClass);
    let thenEntry = specEntry.getThen()[0];
    expect(thenEntry.getName()).toEqual(notYetRegisteredFunctionName);
    expect(thenEntry.getDescription()).toEqual(description);
  });

  xit('should refuse the Then, if no property with the Name exists on the SpecContainer', () => {
    expect(() => {
      specRegistry.registerThenForSpec(specClassConstructor, nonExistPropName, description);
    }).toThrowError(SpecRegistryError, specClassName + '.' + nonExistPropName + ' does not exist.');
  });

  xit('should refuse the Then, if property with the Name exists on the SpecContainer, but is not a function', () => {
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
    let specRegEntry = specRegistry.getSpecContainerByClassName(specClassName);
    let thenRegEntry = specRegEntry.getThen()[execNumber];
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
    let specEntry = specRegistry.getSpecContainerByClassName(notYetRegisteredClassName);
    expect(specEntry).not.toBeUndefined();
    expect(specEntry.getDescription()).toBeUndefined();
    expect(specEntry.getClassConstructor()).toEqual(notYetRegisteredClass);
    let whenEntry = specEntry.getWhen();
    expect(whenEntry.getName()).toEqual(notYetRegisteredFunctionName);
    expect(whenEntry.getDescription()).toEqual(description);
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
    let specRegEntry = specRegistry.getSpecContainerByClassName(specClassName);
    let thenRegEntry = specRegEntry.getWhen();
    expect(thenRegEntry.getName()).toEqual(functionName);
    expect(thenRegEntry.getDescription()).toEqual(description);
  });
});

describe('SpecRegistry.registerThenThrowForSpec', () => {
  class SpecRegistry_regThenThrow{
    public thenError(){}
  }
  let specClassConstructor = SpecRegistry_regThenThrow.prototype.constructor;
  let specClassName = 'SpecRegistry_regThenThrow';
  let specName = 'SpecRegistry regThenThrow';

  let functionName = 'thenThrow';
  let description = 'such an Error';



  it('should register ThenThrow, for existing Specs', () => {
    let specReg = new SpecRegistry();

    specReg.registerSpec(specClassConstructor, specName);
    specReg.registerThenThrowForSpec(specClassConstructor, functionName, description);

    let specEntry = specReg.getSpecContainerByClassName(specClassName);
    expect(specEntry).not.toBeNull();
    let methodEntry = specEntry.getThenThrow();
    expect(methodEntry).not.toBeNull();
    expect(methodEntry.getName()).toEqual(functionName);
    expect(methodEntry.getDescription()).toEqual(description);
  });

  it('should register ThenThrow, while Spec is not registered', () => {
    let specReg = new SpecRegistry();

    specReg.registerThenThrowForSpec(specClassConstructor, functionName, description);

    let specEntry = specReg.getSpecContainerByClassName(specClassName);
    expect(specEntry).not.toBeNull();
    let methodEntry = specEntry.getThenThrow();
    expect(methodEntry).not.toBeNull();
    expect(methodEntry.getName()).toEqual(functionName);
    expect(methodEntry.getDescription()).toEqual(description);
  });
});

describe('SpecRegistry.registerCleanupForSpec', ()=>{
  let specRegistry;

  class CleanupClass {
    private a;
    public aCleanupFunction() {
      this.a = 0;

    };

    public numericProperty = 0;
  }

  let specClassConstructor = CleanupClass.prototype.constructor;
  let specClassName = 'CleanupClass';
  let specDescription = 'Cleanup';

  let functionName = 'aCleanupFunction';
  let description = 'clean whatever';
  let execNumber = 0;

  beforeEach(() => {
    specRegistry = new SpecRegistry();
    specRegistry.registerSpec(specClassConstructor, specDescription);
  });

  it('should accept Cleanup registration for non existent specs', () => {
    let specRegistry = new SpecRegistry();

    specRegistry.registerCleanupForSpec(specClassConstructor, functionName, description, execNumber);
    let specEntry = specRegistry.getSpecContainerByClassName(specClassName);

    expect(specEntry).not.toBeUndefined();
    expect(specEntry.getClassConstructor()).toEqual(specClassConstructor);

    let cleanupEntry = specEntry.getCleanup()[0];
    expect(cleanupEntry.getName()).toEqual(functionName);
    expect(cleanupEntry.getDescription()).toEqual(description);
  });

  it('should refuse to add a Cleanup for a new class-name-duplicate', () => {
    class CleanupClass {
      private aFunction() {
      }
    }
    let classDouble2 = CleanupClass.prototype.constructor;

    expect(() => {
        specRegistry.registerCleanupForSpec(classDouble2, "aFunction", description);
      }
    ).toThrowError(SpecRegistryError, 'A different Class with the Name "CleanupClass" is already registered, class-name-duplicates are forbidden');
  });

  it('should register the Cleanup, while parameters are correct', () => {
    specRegistry.registerCleanupForSpec(specClassConstructor, functionName, description, execNumber);
    let specRegEntry = specRegistry.getSpecContainerByClassName(specClassName);
    let thenRegEntry = specRegEntry.getCleanup()[execNumber];
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
    specRegEntry = specRegistry.getSpecContainerByClassName(existSpecClassName);
  });
  it('should register subject for existing class and save into SpecContainer', () => {
    specRegistry.registerSpecForSubject(existSpecClass, subjectName1);

    let registeredSpecsForSubject = specRegistry.getSpecContainersForSubject(subjectName1);
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
    let specRegEntry = specRegistry.getSpecContainerByClassName(newSpecClassName);
    let registeredSpecsForSubject = specRegistry.getSpecContainersForSubject(subjectName2);

    expect(specRegEntry).not.toBeNull();
    expect(registeredSpecsForSubject).toContain(specRegEntry);
    expect(specRegEntry.getSubjects()).toContain(subjectName2);
  });

  it('should refuse to register the SpecContainer and Class, for a new class-name-duplicate', () => {
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

describe('SpecRegistry.getSpecContainersWithoutSubject', () => {
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

    let entryWithoutSubject = specRegistry.getSpecContainerByClassName(classWithoutSubjectName);
    let entryWithSubject = specRegistry.getSpecContainerByClassName(classWithSubjectName);
    let specsWithoutSubject = specRegistry.getSpecContainersWithoutSubject();
    expect(specsWithoutSubject).toContain(entryWithoutSubject);
    expect(specsWithoutSubject).not.toContain(entryWithSubject);


  });
});

describe('SpecRegistry.getAllSpecContainer', () => {
  let specReg = new SpecRegistry();
  class SpecRegistry_getAllSpec_SpecAddedWithDescription {}
  let spec_AddedWithDescription = SpecRegistry_getAllSpec_SpecAddedWithDescription.prototype.constructor;

  class SpecRegistry_getAllSpec_SpecAddedWithoutDescription {
    public aClassMethod(){}
  }
  let spec_AddedWithoutDescription = SpecRegistry_getAllSpec_SpecAddedWithoutDescription.prototype.constructor;

  let entryWithDescr;
  let entryWithoutDescr;
  let gotAllSpecs;

  beforeAll(() => {
    //Add SpecContainer with Description, will be accepted as Executable
    specReg.registerSpec(spec_AddedWithDescription, 'someDescription');
    //Add SpecContainer by RegisterGiven, without SpecDescription, will not be accepted as Executable
    specReg.registerGivenForSpec(spec_AddedWithoutDescription, 'aClassMethod', 'methodDescription');

    entryWithDescr = specReg.getSpecContainerByClassName('SpecRegistry_getAllSpec_SpecAddedWithDescription');
    entryWithoutDescr = specReg.getSpecContainerByClassName('SpecRegistry_getAllSpec_SpecAddedWithoutDescription');
    expect(entryWithDescr).not.toBeNull();
    expect(entryWithoutDescr).not.toBeNull();
    gotAllSpecs = specReg.getAllSpecContainer();
  });

  it('should return all Specs, also Specs with SpecDescription (= Executable)', () => {
    expect(gotAllSpecs).toContain(entryWithDescr);
  });
  it('should return all Specs, also Specs without SpecDescription (= notExecutable)', () => {
    expect(gotAllSpecs).toContain(entryWithoutDescr);
  });

});

describe('SpecRegistry.getExecutableSpecContainers', () => {
  let specReg = new SpecRegistry();
  class SpecRegistry_getExecutableSpec_SpecAddedWithDescription {}
  let spec_AddedWithDescription = SpecRegistry_getExecutableSpec_SpecAddedWithDescription.prototype.constructor;

  class SpecRegistry_getExecutableSpec_SpecAddedWithoutDescription {
    public aClassMethod(){}
  }
  let spec_AddedWithoutDescription = SpecRegistry_getExecutableSpec_SpecAddedWithoutDescription.prototype.constructor;

  let entryWithDescr;
  let entryWithoutDescr;
  let gotExecSpecs;

  beforeAll(() => {
    //Add SpecContainer with Description, will be accepted as Executable
    specReg.registerSpec(spec_AddedWithDescription, 'someDescription');
    //Add SpecContainer by RegisterGiven, without SpecDescription, will not be accepted as Executable
    specReg.registerGivenForSpec(spec_AddedWithoutDescription, 'aClassMethod', 'methodDescription');

    entryWithDescr = specReg.getSpecContainerByClassName('SpecRegistry_getExecutableSpec_SpecAddedWithDescription');
    entryWithoutDescr = specReg.getSpecContainerByClassName('SpecRegistry_getExecutableSpec_SpecAddedWithoutDescription');
    expect(entryWithDescr).not.toBeNull();
    expect(entryWithoutDescr).not.toBeNull();

    gotExecSpecs = specReg.getExecutableSpecContainers();
  });

  it('should return executable Specs Specs with SpecDescription (= Executable)', () => {
    expect(gotExecSpecs).toContain(entryWithDescr);
  });
  it('should return exectuable Specs only, not Specs without SpecDescription (= notExecutable)', () => {
    expect(gotExecSpecs).not.toContain(entryWithoutDescr);
  });


});

describe('SpecRegistry.registerSpecAsIgnored', ()=>{
  let specReg = new SpecRegistry();

  it('should not be ignored by default', () => {
    class SpecRegistry_registerIgnored_defaultNotIgnored{}
    let specClassName = 'SpecRegistry_registerIgnored_defaultNotIgnored';
    let specClassCoonstructor = SpecRegistry_registerIgnored_defaultNotIgnored.prototype.constructor;
    specReg.registerSpec(specClassCoonstructor, 'existing SpecContainer');

    let spec = specReg.getSpecContainerByClassName(specClassName);
    expect(spec).not.toBeNull();
    expect(spec.isIgnored()).toBeFalsy();
  });

  it('should set existing SpecContainer as Ignored', () => {
    class SpecRegistry_registerIgnored_existSpec{}
    let specClassName = 'SpecRegistry_registerIgnored_existSpec';
    let specClassConstructor = SpecRegistry_registerIgnored_existSpec.prototype.constructor;
    let ignoreReason = 'I Could not handle it anymore';
    specReg.registerSpec(specClassConstructor, 'existing SpecContainer');
    specReg.registerSpecAsIgnored(specClassConstructor, ignoreReason);

    let spec = specReg.getSpecContainerByClassName(specClassName);
    expect(spec).not.toBeNull();
    expect(spec.isIgnored()).toBeTruthy();
  });

  it('should register new SpecContainer and set as Ignored', () => {
    class SpecRegistry_registerIgnored_newSpec{}
    let specClassName = 'SpecRegistry_registerIgnored_newSpec';
    let specClassConstructor = SpecRegistry_registerIgnored_newSpec.prototype.constructor;
    let ignoreReason = 'I Could not handle it anymore';
    specReg.registerSpecAsIgnored(specClassConstructor, ignoreReason);

    let spec = specReg.getSpecContainerByClassName(specClassName);
    expect(spec).not.toBeNull();
    expect(spec.isIgnored()).toBeTruthy();
  });
});

describe('SpecRegistry.registerSutForSpec', () => {

  let specReg = new SpecRegistry();

  class SpecRegistry_SUT_existsSpec{}
  let specClassConstructor = SpecRegistry_SUT_existsSpec.prototype.constructor;
  let specClassName = 'SpecRegistry_SUT_existsSpec';
  let spec;

  class SomeSUT{}
  let SUT = SomeSUT;

  beforeAll(()=>{
    specReg.registerSpec(specClassConstructor, 'an existing Spec');
    spec = specReg.getSpecContainerByClassName(specClassName);
  });

  it('should set sut for existing SpecContainer', () => {
    specReg.registerSutForSpec(specClassConstructor, SUT);

    expect(spec.getSUT()).toEqual(SUT);
  });

  it('should register new SpecContainer and set SUT', ()=>{
    class SpecRegistry_SUT_newSpec{}
    let specClassConstructor = SpecRegistry_SUT_newSpec.prototype.constructor;
    let specClassName = 'SpecRegistry_SUT_newSpec';

    specReg.registerSutForSpec(specClassConstructor, SUT);

    let specContainer = specReg.getSpecContainerByClassName(specClassName);
    expect(specContainer).not.toBeNull();

    expect(specContainer.getSUT()).toEqual(SUT);
  });
});

describe('SpecRegistry.registerSutForSpec', () => {

  let specReg = new SpecRegistry();

  class SpecRegistry_SUT_existsSpec{}
  let specClassConstructor = SpecRegistry_SUT_existsSpec.prototype.constructor;
  let specClassName = 'SpecRegistry_SUT_existsSpec';
  let spec;

  class SomeSUT{}
  let SUT = SomeSUT;

  beforeAll(()=>{
    specReg.registerSpec(specClassConstructor, 'an existing Spec');
    spec = specReg.getSpecContainerByClassName(specClassName);
  });

  it('should set sut for existing SpecContainer', () => {
    specReg.registerSutForSpec(specClassConstructor, SUT);

    expect(spec.getSUT()).toEqual(SUT);
  });

  it('should register new SpecContainer and set SUT', ()=>{
    class SpecRegistry_SUT_newSpec{}
    let specClassConstructor = SpecRegistry_SUT_newSpec.prototype.constructor;
    let specClassName = 'SpecRegistry_SUT_newSpec';

    specReg.registerSutForSpec(specClassConstructor, SUT);

    let specContainer = specReg.getSpecContainerByClassName(specClassName);
    expect(specContainer).not.toBeNull();

    expect(specContainer.getSUT()).toEqual(SUT);
  });
});

describe('SpecRegistry.setProviders', () => {
  let specReg = new SpecRegistry();
  let specContainer;

  class SpecRegistry_setProviders_ExistSpec{}
  let specClassConstructor = SpecRegistry_setProviders_ExistSpec.prototype.constructor;
  let specClassName = 'SpecRegistry_setProviders_ExistSpec';

  class OneProvider{}
  class AnotherProvider{}
  class ThirdProvider{}
  let providers = [OneProvider, AnotherProvider];
  let otherProviders = [AnotherProvider, ThirdProvider];

  beforeAll(()=>{
    specReg.registerSpec(specClassConstructor, 'a Spec for adding providers later');
    specContainer = specReg.getSpecContainerByClassName(specClassName);
  });

  it('should register providers for existing SpecContainer, having none', () => {
    specReg.registerProvidersForSpec(specClassConstructor, providers);

    expect(specContainer.getProviders()).toEqual(providers);
  });

  it('should register providers for non existing Spec', () => {
    class SpecRegistry_setProviders_NewSpec{}
    let specClassConstructor = SpecRegistry_setProviders_NewSpec.prototype.constructor;
    let specClassName = 'SpecRegistry_setProviders_NewSpec';

    specReg.registerProvidersForSpec(specClassConstructor, providers);
    let specContainer = specReg.getSpecContainerByClassName(specClassName);
    expect(specContainer).not.toBeNull();
    expect(specContainer.getProviders()).toEqual(providers)

  });

});

describe('SpecRegistry.registerGenerate', ()=> {
  class SpecContainer_GenerateProperty{
    public prop;
    public otherProp;
  }
  let specConstr = SpecContainer_GenerateProperty.prototype.constructor;
  let genPropName = 'prop';
  let genType = AThingToGenerate;
  let genProviders = [{
    provide:ADependency,
    mock:{
      mockDep:true
    }
  }];

  @Injectable()
  class ADependency{

  }

  @Injectable()
  class AThingToGenerate{
    public dep;

    constructor(dep:ADependency){
      this.dep = dep;
    }
  }

  it('should register a Generate for existing Spec', () => {
    let specReg = new SpecRegistry();
    specReg.registerSpec(specConstr, 'ASpec');
    let specContainer = specReg.registerGenerate(specConstr, genPropName, genType, genProviders);

    let gens = specContainer.getGeneratorOnProperties();
    expect(gens.length).toBe(1);
    expect(gens[0].getPropertyName()).toEqual('prop');
  });

  it('should register a Generate for new Spec', () => {
    let specReg = new SpecRegistry();
    let specContainer = specReg.registerGenerate(specConstr, genPropName, genType, genProviders);

    let gens = specContainer.getGeneratorOnProperties();
    expect(gens.length).toBe(1);
    expect(gens[0].getPropertyName()).toEqual('prop');
  });

  it('should register multiple Generates on different Properties', ()=>{
    let specReg = new SpecRegistry();

    let specContainer = specReg.registerGenerate(specConstr, genPropName, genType, genProviders);
    specReg.registerGenerate(specConstr,'otherProp', genType, genProviders);
    let allProps = specContainer.getGeneratorOnProperties();

    expect(allProps.length).toBe(2);

    let generator = specContainer.getGeneratorOfProperty(genPropName);
    expect(generator.getTypeToGenerate()).toEqual(genType);
    expect(generator.getDependencies()).toEqual(genProviders);

    let otherGenerator = specContainer.getGeneratorOfProperty('otherProp');
    expect(otherGenerator.getTypeToGenerate()).toEqual(genType);
    expect(otherGenerator.getDependencies()).toEqual(genProviders);

  });

});
