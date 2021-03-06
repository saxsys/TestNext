import {
  Cleanup, Generate, Given, Ignore, Spec, Subject, Then, ThenThrow,
  When
} from "./spec-decorators";
import {specRegistry} from "../../SpecStorage/specRegistry/spec-registry-storage";
import {SpecRegistryError} from "../../SpecStorage/spec-registry-error";
import {Assert} from "../assert/assert";
import {Injectable} from "@angular/core";


describe('TestDecorators.Spec', () => {

  it('should register a class with Spec-decorator', () => {

    let specName = 'to Test Spec';
    let specClassName = 'TestDecorators_Spec_Correct';

    @Spec(specName)
    class TestDecorators_Spec_Correct {

    }

    let specRegEntry = specRegistry.getSpecContainerByClassName(specClassName);
    expect(specRegEntry.getClassName()).toEqual('TestDecorators_Spec_Correct');
    expect(specRegEntry.getDescription()).toEqual(specName);
  });

  it('should refuse Spec with existing class-name', () => {
    @Spec('ClassDouble1')
    class TestDecorators_Spec_ClassDouble {
    }

    expect(() => {
      @Spec('ClassDouble2')
      class TestDecorators_Spec_ClassDouble {
      }

    }).toThrowError(SpecRegistryError,
      'A different Class with the Name "TestDecorators_Spec_ClassDouble" is already registered, ' +
      'class-name-duplicates are forbidden'
    );
  });

  it('should refuse one Spec with two Spec Decorators', () => {
    expect(() => {
      @Spec('Spec_ClassWith2SpecDecorator1')
      @Spec('Spec_ClassWith2SpecDecorator2')
      class TestDecorators_Spec_ClassWith2SpecDecorator {
      }
    }).toThrowError(SpecRegistryError,
      'Spec "TestDecorators_Spec_ClassWith2SpecDecorator" already got has Description: ' +
      '"Spec_ClassWith2SpecDecorator2", only one is possible, cannot add: "Spec_ClassWith2SpecDecorator1"'
    );

  });

  xit('should refuse classes with constructor-arguments', () => {
    expect(() => {
      @Spec('Spec with ConstructorArguments')
      class TestDecorators_Spec_ConstructorArguments {
        constructor(anArgument: any) {
        }
      }
    }).toThrowError(SpecRegistryError,
      'Spec "TestDecorators_Spec_ConstructorArguments" has constructor-arguments, this is forbidden in Spec-classes'
    );

  });

});

describe('TestDecorators.Given', () => {

  it('should register the Given-Method in the for the Spec', () => {

    let className = 'TestDecorators_Given_Correct';
    let methodName = 'aCorrectMethodIsGiven';
    let specName = 'specClassDecoratorGivenCorrect';
    let methodDescription = 'a correct Method is given';

    @Spec(specName)
    class TestDecorators_Given_Correct {
      public val = 3;

      @Given(methodDescription, 0)
      aCorrectMethodIsGiven() {
      }
    }

    let specRegEntry = specRegistry.getSpecContainerByClassName(className);
    let methodRegEntry = specRegEntry.getGiven()[0];
    expect(methodRegEntry.getName()).toEqual(methodName);
    expect(methodRegEntry.getDescription()).toEqual(methodDescription);
  });

  it('should register the @Given without the Class being registered as @Spec', () => {

    let methodDescription = 'A Method, within a Class no registered as Spec';
    let className = 'TestDecorators_Given_ClassWithoutDecorator';
    let methodName = 'methodInClassWithoutDeco';

    class TestDecorators_Given_ClassWithoutDecorator {
      @Given(methodDescription)
      methodInClassWithoutDeco() {
      }
    }

    let givenClassConstructor = TestDecorators_Given_ClassWithoutDecorator.prototype.constructor;
    let entry = specRegistry.getSpecContainerByClassName(className);
    expect(entry.getDescription()).toBeUndefined();
    expect(entry.getClassConstructor()).toEqual(givenClassConstructor);
    let givenEntry = entry.getGiven()[0];
    expect(givenEntry.getDescription()).toEqual(methodDescription);
    expect(givenEntry.getName()).toEqual(methodName);
  });

  it('should register multiple @Given for one Spec', () => {

    let className = 'TestDecorators_Given_MultipleGiven';
    let methodName1 = 'method1';
    let methodName2 = 'method2';
    let methodDescription1 = 'a Method Description 1';
    let methodDescription2 = 'a Method Description 2';

    @Spec('Testing MultipleGiven')
    class TestDecorators_Given_MultipleGiven {
      @Given(methodDescription1, 0)
      method1() {
      }

      @Given(methodDescription2, 1)
      method2() {
      }
    }

    let regEntry = specRegistry.getSpecContainerByClassName(className);
    let methodEntries = regEntry.getGiven();
    expect(methodEntries.length).toBe(2);

    let methodEntry1 = methodEntries[0];
    expect(methodEntry1.getName()).toEqual(methodName1);
    expect(methodEntry1.getDescription()).toEqual(methodDescription1);

    let methodEntry2 = methodEntries[1];
    expect(methodEntry2.getName()).toEqual(methodName2);
    expect(methodEntry2.getDescription()).toEqual(methodDescription2);
  });

  xit('should refuse methods with arguments', () => {
    expect(() => {
      class TestDecorators_Given_MethodArguments {
        @Given('A Method with Arguments')
        aMethodWithArguments(sth: any) {
        }
      }
    }).toThrowError(SpecRegistryError,
      '@Given-method "TestDecorators_Given_MethodArguments.aMethodWithArguments" has arguments, this is forbidden for @Given-methods'
    );
  });

  xit('should refuse classes with constructor-arguments', () => {
    expect(() => {
      class TestDecorators_Given_ConstructorArguments {
        constructor(anArgument: any) {
        }

        @Given('Given of Class with Constructor-Arguments')
        justAMethod() {
        }
      }
    }).toThrowError(SpecRegistryError,
      'Spec "TestDecorators_Given_ConstructorArguments" has constructor-arguments, this is forbidden in Spec-classes'
    );
  });

});

describe('TestDecorators.When', () => {
  it('should register the When-Method for the Spec', () => {

    let specName = 'specClassDecoratorWhen_Correct';
    let className = 'SpecDecorators_When_Correct';
    let methodDescription = 'when it is a correct method';
    let methodName = 'whenItIsACorrectMethod';

    @Spec(specName)
    class SpecDecorators_When_Correct {
      public val = 3;

      @When(methodDescription)
      whenItIsACorrectMethod() {
      }
    }

    let specRegEntry = specRegistry.getSpecContainerByClassName(className);
    let methodRegEntry = specRegEntry.getWhen();
    expect(methodRegEntry.getName()).toEqual(methodName);
    expect(methodRegEntry.getDescription()).toEqual(methodDescription);
  });

  it('should register the @When without the Class being registered as @Spec', () => {

    let methodDescription = 'A Method, within a Class no registered as Spec';
    let className = 'TestDecorators_When_ClassWithoutDecorator';
    let methodName = 'methodInClassWithoutDeco';

    class TestDecorators_When_ClassWithoutDecorator {
      @When(methodDescription)
      methodInClassWithoutDeco() {
      }
    }

    let specClassConstructor = TestDecorators_When_ClassWithoutDecorator.prototype.constructor;
    let entry = specRegistry.getSpecContainerByClassName(className);
    expect(entry.getDescription()).toBeUndefined();

    expect(entry.getClassConstructor()).toEqual(specClassConstructor);
    let methodEntry = entry.getWhen();
    expect(methodEntry.getDescription()).toEqual(methodDescription);
    expect(methodEntry.getName()).toEqual(methodName);
  });

  it('should refuse multiple @When functions', () => {

    let className = 'TestDecorator_When_multipleWhen';
    let specDescription = 'Spec with multiple @When';
    let methodName1 = 'somethingHappens';
    let methodName2 = 'somethingElseHappens';

    let methodDescription1 = 'something happens';
    let methodDescription2 = 'something else happens';
    expect(() => {
      @Spec(specDescription)
      class TestDecorator_When_multipleWhen {
        @When(methodDescription1)
        somethingHappens() {
        }

        @When(methodDescription2)
        somethingElseHappens() {
        }
      }
    }).toThrowError(SpecRegistryError,
      'Only one @When allowed on ' + className + ' cannot add ' + methodName2 + ', ' + methodName1 + ' is already @When'
    );

  });


});

describe('TestDecorators.Then', () => {
  it('should register the Then-Method for the Spec', () => {

    let className = 'TestDecorators_Then_Correct';
    let methodName = 'thenAMethodIsCorrect';
    let specName = 'specClassDecoratorThenCorrect';
    let methodDescription = 'then a Method is correct';

    @Spec(specName)
    class TestDecorators_Then_Correct {
      public val = 3;

      @Then(methodDescription, 0)
      thenAMethodIsCorrect() {
      }
    }

    let specRegEntry = specRegistry.getSpecContainerByClassName(className);
    let methodRegEntry = specRegEntry.getThen()[0];
    expect(methodRegEntry.getName()).toEqual(methodName);
    expect(methodRegEntry.getDescription()).toEqual(methodDescription);
  });

  it('should register the @Then without the Class being registered as @Spec', () => {

    let methodDescription = 'A Method, within a Class no registered as Spec';
    let className = 'TestDecorators_Then_ClassWithoutDecorator';
    let methodName = 'methodInClassWithoutDeco';

    class TestDecorators_Then_ClassWithoutDecorator {
      @Then(methodDescription)
      methodInClassWithoutDeco() {
      }
    }

    let specClassConstructor = TestDecorators_Then_ClassWithoutDecorator.prototype.constructor;
    let entry = specRegistry.getSpecContainerByClassName(className);
    expect(entry.getDescription()).toBeUndefined();
    expect(entry.getClassConstructor()).toEqual(specClassConstructor);
    let methodEntry = entry.getThen()[0];
    expect(methodEntry.getDescription()).toEqual(methodDescription);
    expect(methodEntry.getName()).toEqual(methodName);
  });

  it('should register multiple @Then for one Spec', () => {

    let className = 'TestDecorators_Then_MultipleThen';
    let methodName1 = 'method1';
    let methodName2 = 'method2';
    let methodDescription1 = 'a Method Description 1';
    let methodDescription2 = 'a Method Description 2';

    @Spec('Testing MultipleThen')
    class TestDecorators_Then_MultipleThen {
      @Then(methodDescription1, 0)
      method1() {
      }

      @Then(methodDescription2, 1)
      method2() {
      }
    }

    let regEntry = specRegistry.getSpecContainerByClassName(className);
    let methodEntries = regEntry.getThen();
    expect(methodEntries.length).toBe(2);

    let methodEntry1 = methodEntries[0];
    expect(methodEntry1.getName()).toEqual(methodName1);
    expect(methodEntry1.getDescription()).toEqual(methodDescription1);

    let methodEntry2 = methodEntries[1];
    expect(methodEntry2.getName()).toEqual(methodName2);
    expect(methodEntry2.getDescription()).toEqual(methodDescription2);
  });

  xit('should refuse methods with arguments', () => {
    expect(() => {
      class TestDecorators_Then_MethodArguments {
        @Then('A Method with Arguments')
        aMethodWithArguments(sth: any) {
        }
      }
    }).toThrowError(SpecRegistryError,
      '@Then-method "TestDecorators_Then_MethodArguments.aMethodWithArguments" has arguments, this is forbidden for @Then-methods'
    );
  });

  xit('should refuse classes with constructor-arguments', () => {
    expect(() => {
      class TestDecorators_Then_ConstructorArguments {
        constructor(anArgument: any) {
        }

        @Then('When of Class with Constructor-Arguments')
        aThenFunction() {
        }
      }
    }).toThrowError(SpecRegistryError,
      'Spec "TestDecorators_Then_ConstructorArguments" has constructor-arguments, this is forbidden in Spec-classes'
    );
  });
});

describe('TestDecorators.ThenThrow', () => {
  it('should register the ThenThrow-Method for the Spec', () => {

    let specName = 'specClassDecorator ThenThrow Correct';
    let className = 'SpecDecorators_ThenThrow_Correct';
    let methodDescription = 'a random Error';
    let methodName = 'randomError';

    @Spec(specName)
    class SpecDecorators_ThenThrow_Correct {
      public val = 3;

      @ThenThrow(methodDescription)
      randomError() {
        throw new Error('Random Error');
      }
    }

    let specRegEntry = specRegistry.getSpecContainerByClassName(className);
    let methodRegEntry = specRegEntry.getThenThrow();
    expect(methodRegEntry.getName()).toEqual(methodName);
    expect(methodRegEntry.getDescription()).toEqual(methodDescription);
  });

  it('should register the @ThenThrow without the Class being registered as @Spec', () => {

    let methodDescription = 'A Method, within a Class no registered as Spec';
    let className = 'SpecDecorators_ThenError_notRegistered';
    let methodName = 'randomError';

    class SpecDecorators_ThenError_notRegistered {
      public val = 3;

      @ThenThrow(methodDescription)
      randomError() {
        throw new Error('Random Error');
      }
    }

    let specClassConstructor = SpecDecorators_ThenError_notRegistered.prototype.constructor;
    let entry = specRegistry.getSpecContainerByClassName(className);
    expect(entry.getDescription()).toBeUndefined();

    expect(entry.getClassConstructor()).toEqual(specClassConstructor);
    let methodEntry = entry.getThenThrow();
    expect(methodEntry.getDescription()).toEqual(methodDescription);
    expect(methodEntry.getName()).toEqual(methodName);
  });

  it('should refuse multiple @ThenTrow functions', () => {

    let className = 'TestDecorator_ThenThrow_multipleWhen';
    let specDescription = 'Spec with multiple @ThenThrow';
    let methodName1 = 'oneError';
    let methodName2 = 'errorAfterwards';

    let methodDescription1 = 'one Error';
    let methodDescription2 = 'error Afterwards';
    expect(() => {
      @Spec(specDescription)
      class TestDecorator_ThenThrow_multipleWhen {
        @ThenThrow(methodDescription1)
        oneError() {
          throw new Error('one Error');
        }

        @ThenThrow(methodDescription2)
        errorAfterwards() {
          throw new Error('error Afterwards')
        }
      }
    }).toThrowError(SpecRegistryError,
      'Only one @ThenThrow allowed on ' + className + ' cannot add ' + methodName2 + ', ' + methodName1 + ' is already @ThenThrow'
    );

  });
});

describe('TestDecorators.Cleanup', () => {
  it('should register the Cleanup-Method for the Spec without Parameters', () => {

    let className = 'TestDecorators_Cleanup_Correct_withoutParam';
    let methodName = 'tidyIt';
    let specName = 'specClassDecoratorThenCorrect without parameters';

    @Spec(specName)
    class TestDecorators_Cleanup_Correct_withoutParam {
      public val = 3;

      @Cleanup()
      tidyIt() {
      }
    }

    let specRegEntry = specRegistry.getSpecContainerByClassName(className);
    let methodRegEntry = specRegEntry.getCleanup()[0];
    expect(methodRegEntry.getName()).toEqual(methodName);
  });

  it('should register the Cleanup-Method for the Spec with Parameters', () => {

    let className = 'TestDecorators_Cleanup_Correct_withParam';
    let methodName = 'tidyIt';
    let specName = 'specClassDecorator Cleanup Correct with Parameters';
    let methodDescription = 'then a Method is correct';

    @Spec(specName)
    class TestDecorators_Cleanup_Correct_withParam {
      public val = 3;

      @Cleanup(methodDescription, 1)
      tidyIt() {
      }
    }

    let specRegEntry = specRegistry.getSpecContainerByClassName(className);
    let methodRegEntry = specRegEntry.getCleanup()[0];
    expect(methodRegEntry.getName()).toEqual(methodName);
    expect(methodRegEntry.getDescription()).toEqual(methodDescription);
  });

  it('should register the @Cleanup without the Class being registered as @Spec', () => {

    let methodDescription = 'A Method, within a Class no registered as Spec';
    let className = 'TestDecorators_Cleanup_ClassWithoutDecorator';
    let methodName = 'methodInClassWithoutDeco';

    class TestDecorators_Cleanup_ClassWithoutDecorator {
      @Cleanup(methodDescription)
      methodInClassWithoutDeco() {
      }
    }

    let specClassConstructor = TestDecorators_Cleanup_ClassWithoutDecorator.prototype.constructor;

    let entry = specRegistry.getSpecContainerByClassName(className);
    expect(entry.getDescription()).toBeUndefined();
    expect(entry.getClassConstructor()).toEqual(specClassConstructor);

    let methodEntry = entry.getCleanup()[0];
    expect(methodEntry.getDescription()).toEqual(methodDescription);
    expect(methodEntry.getName()).toEqual(methodName);
  });

  it('should register multiple @Cleanup for one Spec', () => {

    let className = 'TestDecorators_Cleanup_MultipleThen';
    let methodName1 = 'method1';
    let methodName2 = 'method2';
    let methodDescription1 = 'a Method Description 1';
    let methodDescription2 = 'a Method Description 2';

    @Spec('Testing MultipleThen')
    class TestDecorators_Cleanup_MultipleThen {
      @Cleanup(methodDescription1, 0)
      method1() {
      }

      @Cleanup(methodDescription2, 1)
      method2() {
      }
    }

    let regEntry = specRegistry.getSpecContainerByClassName(className);
    let methodEntries = regEntry.getCleanup();
    expect(methodEntries.length).toBe(2);

    let methodEntry1 = methodEntries[0];
    expect(methodEntry1.getName()).toEqual(methodName1);
    expect(methodEntry1.getDescription()).toEqual(methodDescription1);

    let methodEntry2 = methodEntries[1];
    expect(methodEntry2.getName()).toEqual(methodName2);
    expect(methodEntry2.getDescription()).toEqual(methodDescription2);
  });
});

describe('TestDecorators.Subject', () => {

  it('should register one Subject for Spec', () => {
    let specClassName = 'SpecDecorators_Subject_OneSubPerSpec';
    let subjectName = 'TestDecorators.Subject.OneSubPerSpec';

    @Spec('SpecDecorators_Subject_OneSubPerSpec')
    @Subject(subjectName)
    class SpecDecorators_Subject_OneSubPerSpec {
      public val = 3;
    }

    let specEntry = specRegistry.getSpecContainerByClassName(specClassName);
    expect(specEntry.getSubjects()).toContain(subjectName);
    expect(specRegistry.getSpecContainersForSubject(subjectName)).toContain(specEntry);
  });

  it('should register multiple Subject for Spec', () => {
    let specClassName = 'SpecDecorators_Subject_MultiSubPerSpec';
    let subjectName1 = 'TestDecorators.Subject.MultiSubPerSpec.1';
    let subjectName2 = 'TestDecorators.Subject.MultiSubPerSpec.2';

    @Spec('SpecDecorators_Subject_MultiSubPerSpec')
    @Subject(subjectName1)
    @Subject(subjectName2)
    class SpecDecorators_Subject_MultiSubPerSpec {
      public val = 3;
    }

    let specEntry = specRegistry.getSpecContainerByClassName(specClassName);
    expect(specEntry.getSubjects()).toContain(subjectName1, subjectName2);
    expect(specRegistry.getSpecContainersForSubject(subjectName1)).toContain(specEntry);
    expect(specRegistry.getSpecContainersForSubject(subjectName2)).toContain(specEntry);
  });

  it('should register one Subject once for Spec, even if called multiple times', () => {
    let specClassName = 'SpecDecorators_Subject_SubDuplOnOneSpec';
    let subjectName1 = 'TestDecorators.Subject.SubDuplOnOneSpec';

    @Spec('SpecDecorators_Subject_SubDuplOnOneSpec')
    @Subject(subjectName1)
    @Subject(subjectName1)
    class SpecDecorators_Subject_SubDuplOnOneSpec {
      public val = 3;
    }

    let specEntry = specRegistry.getSpecContainerByClassName(specClassName);
    expect(specEntry.getSubjects().length).toBe(1);
    expect(specEntry.getSubjects()).toContain(subjectName1);
    expect(specRegistry.getSpecContainersForSubject(subjectName1).length).toBe(1);
    expect(specRegistry.getSpecContainersForSubject(subjectName1)).toContain(specEntry);
  });

  it('should register Subject for classes with all Methods', () => {
    let specClassName = 'SpecDecorators_Subject_CompleteSpecClass';
    let subjectName = 'TestDecorators.Subject.CompleteSpecClass';

    @Spec('CompleteSpecClass')
    @Subject(subjectName)
    class SpecDecorators_Subject_CompleteSpecClass {
      @Given('a given')
      aGiven() {
      }

      @When('the when')
      theWhen() {
      }

      @Then('a then')
      aThen() {
      }
    }

    let specEntry = specRegistry.getSpecContainerByClassName(specClassName);
    expect(specEntry).not.toBeNull();
    expect(specEntry.getSubjects()).toContain(subjectName);
    expect(specRegistry.getSpecContainersForSubject(subjectName)).toContain(specEntry);

  });

  it('should register a Spec, when not done yet an register then Subject', () => {
    let specClassName = 'SpecDecorators_Subject_ForClassNotDeclSpec';
    let subjectName = 'TestDecorators.Subject.ForClassNotDeclSpec';

    @Subject(subjectName)
    class SpecDecorators_Subject_ForClassNotDeclSpec {
      public val = 3;
    }

    let specEntry = specRegistry.getSpecContainerByClassName(specClassName);
    expect(specEntry).not.toBeNull();
    expect(specEntry.getSubjects()).toContain(subjectName);
    expect(specRegistry.getSpecContainersForSubject(subjectName)).toContain(specEntry);
  });

  xit('should throw SpecRegostryError, when unregistered Spec has construtor-arguments', () => {
    let specClassName = 'SpecDecorators_Subject_ConstructorArguments';
    let subjectName = 'TestDecorators.Subject.ConstructorArguments';

    expect(() => {
      @Subject(subjectName)
      class SpecDecorators_Subject_ConstructorArguments {
        constructor(argument: number) {
        }
      }
    }).toThrowError(SpecRegistryError, 'Spec "' + specClassName + '" has constructor-arguments, this is forbidden in Spec-classes');
  });

});

describe('TestDecorators.Ignore', () => {

  it('should not be ignored by default', () => {

    let className = 'TestDecorators_Ignored_NotIgnored';
    let specName = 'specClassDecoratorIgnoredNotIgnored';

    @Spec(specName)
    class TestDecorators_Ignored_NotIgnored {
    }

    let specRegEntry = specRegistry.getSpecContainerByClassName(className);

    expect(specRegEntry.isIgnored()).toBeFalsy();
    expect(specRegEntry.getIgnoreReason()).toEqual('');
  });

  it('should set Ignored for the Spec', () => {

    let className = 'TestDecorators_Ignored_Correct';
    let specName = 'specClassDecoratorIgnoredCorrect';
    let ignoreReason = 'simply not possible';

    @Ignore(ignoreReason)
    @Spec(specName)
    class TestDecorators_Ignored_Correct {
    }

    let specRegEntry = specRegistry.getSpecContainerByClassName(className);

    expect(specRegEntry.isIgnored()).toBeTruthy();
    expect(specRegEntry.getIgnoreReason()).toEqual(ignoreReason);
  });

  xit('should register the Ignored without the Class being registered as @Spec', () => {

    let className = 'TestDecorators_Ignored_NoSpec';
    let specName = 'specClassDecoratorIgnoredNoSpec';
    let ignoreReason = 'simply not possible';

    @Ignore(ignoreReason)
    class TestDecorators_Ignored_NoSpec {
    }

    let specRegEntry = specRegistry.getSpecContainerByClassName(className);

    expect(specRegEntry.getIgnoreReason()).toEqual(ignoreReason);
  });

  xit('should be able to handle multiple Ignored, use one', () => {
    let className = 'TestDecorators_Ignored_MultiIgnore';
    let specName = 'specClassDecoratorIgnoredCorrect';
    let ignoreReason1 = 'simply not possible';
    let ignoreReason2 = 'so many Reasons';

    @Ignore(ignoreReason1)
    @Ignore(ignoreReason2)
    @Spec(specName)
    class TestDecorators_Ignored_MultiIgnore {
    }

    let specRegEntry = specRegistry.getSpecContainerByClassName(className);

    expect(specRegEntry.isIgnored()).toBeTruthy();
    expect([ignoreReason1, ignoreReason2]).toContain(specRegEntry.getIgnoreReason());
  });

});


describe('TestDecorators.parentSpec', () => {
  class TestDecorators_ParentSpec_ParentSpecClass {
    protected valueToInherit = 0;

    @Given('valueToInherit gets set', 0)
    setValueToInherit() {
      this.valueToInherit = 1;
    }

  }

  @Spec('Given-Inheritance')
  class TestDecorators_parentSpec_ChildSpecClass extends TestDecorators_ParentSpec_ParentSpecClass {
    @When('I extend a Parent Class')
    extendClass() {

    }

    @Then('Given of parent should have been exectuted')
    givenShouldBeExecuted() {
      Assert.that(this.valueToInherit).equals(1);
    }
  }

  let regEntryParent;
  let regEntryChild;


  beforeAll(() => {
    regEntryParent = specRegistry.getSpecContainerByClassName('TestDecorators_ParentSpec_ParentSpecClass');
    regEntryChild = specRegistry.getSpecContainerByClassName('TestDecorators_parentSpec_ChildSpecClass');
  });

  it('should be possible to get the Parent', () => {
    expect(regEntryParent).not.toBeNull();
    expect(regEntryChild).not.toBeNull();
    expect(regEntryChild.getParentSpec()).toEqual(regEntryParent);
  });

  it('should be possible to get all Given, from Parent and Child', () => {
    let allGivenFromChild = regEntryChild.getGiven();
    let ownGivenFromParent = regEntryParent.getGiven();
    expect(allGivenFromChild.length).toEqual(1);
    expect(ownGivenFromParent.length).toEqual(1);
    expect(allGivenFromChild[0]).toEqual(ownGivenFromParent[0]);
  });

});

describe('TestDecorators.Generate', () => {

  it('should allow a Generate Decorator without Dependencies', () => {

    class AClass {
      public something = 'sth'
    }

    class ClassWithGenerate {
      @Generate(AClass)
      public property: any;
    }

    let specContainer = specRegistry.getSpecContainerByClassName('ClassWithGenerate');

    expect(specContainer).not.toBeNull('SpecContainer not returned by Registry');
    expect(specContainer).not.toBeUndefined('SpecContainer not returned by Registry');

    let specObject = specContainer.getNewSpecObject();

    expect(specObject.property).not.toBeUndefined();
    expect(specObject.property).not.toBeNull();
    expect(specObject.property instanceof AClass).toBeTruthy('not right Type');
    expect(specObject.property.something).toEqual('sth', 'Property of Generated not set');
  });

  it('should allow a Generate Decorator with Dependencies', () => {
    @Injectable()
    class Dependency {
      public mock = false;
    }

    @Injectable()
    class AClass {
      public something = 'sth';
      public dep;

      constructor(dep: Dependency) {
        this.dep = dep;
      }
    }

    class ClassWithGenerateAndDep {
      @Generate(AClass, [
          {provide:Dependency, mockObject:{mock:true}}
      ])
      public property: any;
    }

    let specContainer = specRegistry.getSpecContainerByClassName('ClassWithGenerateAndDep');

    expect(specContainer).not.toBeNull('SpecContainer not returned by Registry');
    expect(specContainer).not.toBeUndefined('SpecContainer not returned by Registry');

    let specObject = specContainer.getNewSpecObject();

    expect(specObject.property).not.toBeUndefined();
    expect(specObject.property).not.toBeNull();
    expect(specObject.property instanceof AClass).toBeTruthy('not right Type');
    expect(specObject.property.something).toEqual('sth', 'Property of Generated not set');

    expect(specObject.property.dep).not.toBeUndefined('dep undefined');
    expect(specObject.property.dep.mock).toBeFalsy('used Mock');
  });


  it('should allow a Generate Decorator with mocking Dependencies', () => {
    @Injectable()
    class Dependency {
      public mock = false;
    }

    @Injectable()
    class AClass {
      public something = 'sth';
      public dep;

      constructor(dep: Dependency) {
        this.dep = dep;
      }
    }

    class ClassWithGenerateAndDepMock {
      @Generate(AClass, [
        {provide:Dependency, mockObject:{mock:true}}
      ])
      public property: any;
    }

    let specContainer = specRegistry.getSpecContainerByClassName('ClassWithGenerateAndDepMock');

    expect(specContainer).not.toBeNull('SpecContainer not returned by Registry');
    expect(specContainer).not.toBeUndefined('SpecContainer not returned by Registry');

    let specObject = specContainer.getNewSpecObject(true);

    expect(specObject.property).not.toBeUndefined();
    expect(specObject.property).not.toBeNull();
    expect(specObject.property instanceof AClass).toBeTruthy('not right Type');
    expect(specObject.property.something).toEqual('sth', 'Property of Generated not set');

    expect(specObject.property.dep).not.toBeUndefined('dep undefined');
    expect(specObject.property.dep.mock).toBeTruthy('not used Mock');
  });

  it('should accept useClass in Provider',()=>{
    @Injectable()
    class Dependency {
      public mock = false;
    }

    @Injectable()
    class AClass {
      public something = 'sth';
      public dep;

      constructor(dep: Dependency) {
        this.dep = dep;
      }
    }

    class DependencyAlternative{
      public mock = false;
      public alternative = true;
    }

    class ClassWithGenerateAndUseClass {
      @Generate(AClass, [
        {provide:Dependency, useClass:DependencyAlternative}
      ])
      public property: any;
    }

    let specContainer = specRegistry.getSpecContainerByClassName('ClassWithGenerateAndUseClass');

    expect(specContainer).not.toBeNull('SpecContainer not returned by Registry');
    expect(specContainer).not.toBeUndefined('SpecContainer not returned by Registry');

    let specObject = specContainer.getNewSpecObject();

    expect(specObject.property).not.toBeUndefined();
    expect(specObject.property).not.toBeNull();
    expect(specObject.property instanceof AClass).toBeTruthy('not right Type');
    expect(specObject.property.something).toEqual('sth', 'Property of Generated not set');

    expect(specObject.property.dep).not.toBeUndefined('dep undefined');
    expect(specObject.property.dep.mock).toBeFalsy('used Mock');
    expect(specObject.property.dep.alternative).toBeTruthy('did not use UseClass');
  });

  it('should accept useObject in Provider', ()=>{
    @Injectable()
    class Dependency {
      public mock = false;
    }

    @Injectable()
    class AClass {
      public something = 'sth';
      public dep;

      constructor(dep: Dependency) {
        this.dep = dep;
      }
    }

    let  dependencyObj = new Dependency();
    dependencyObj['alternative'] = true;

    class ClassWithGenerateAndUseObject {
      @Generate(AClass, [
        {provide:Dependency, useObject:dependencyObj}
      ])
      public property: any;
    }

    let specContainer = specRegistry.getSpecContainerByClassName('ClassWithGenerateAndUseObject');

    expect(specContainer).not.toBeNull('SpecContainer not returned by Registry');
    expect(specContainer).not.toBeUndefined('SpecContainer not returned by Registry');

    let specObject = specContainer.getNewSpecObject();

    expect(specObject.property).not.toBeUndefined();
    expect(specObject.property).not.toBeNull();

    expect(specObject.property.something).toEqual('sth', 'Property of Generated not set');

    expect(specObject.property.dep).not.toBeUndefined('dep undefined');
    expect(specObject.property.dep.mock).toBeFalsy('used Mock');
    expect(specObject.property.dep.alternative).toBeTruthy('did not use UseObject');
  });

  it('should accept mockClass in Provider',()=>{
    @Injectable()
    class Dependency {
      public mock = false;
    }

    @Injectable()
    class AClass {
      public something = 'sth';
      public dep;

      constructor(dep: Dependency) {
        this.dep = dep;
      }
    }

    class DependencyMockClass{
      public mock = true;
    }

    class ClassWithGenerateAndMockClass {
      @Generate(AClass, [
        {provide:Dependency, mockClass:DependencyMockClass}
      ])
      public property: any;
    }

    let specContainer = specRegistry.getSpecContainerByClassName('ClassWithGenerateAndMockClass');

    expect(specContainer).not.toBeNull('SpecContainer not returned by Registry');
    expect(specContainer).not.toBeUndefined('SpecContainer not returned by Registry');

    let specObject = specContainer.getNewSpecObject(true);

    expect(specObject.property).not.toBeUndefined();
    expect(specObject.property).not.toBeNull();
    expect(specObject.property instanceof AClass).toBeTruthy('not right Type');
    expect(specObject.property.something).toEqual('sth', 'Property of Generated not set');

    expect(specObject.property.dep).not.toBeUndefined('dep undefined');
    expect(specObject.property.dep.mock).toBeTruthy('not used Mock');
  });

  it('should Accept mock in Provider', ()=>{
    @Injectable()
    class Dependency {
      public mock = false;
    }

    @Injectable()
    class AClass {
      public something = 'sth';
      public dep;

      constructor(dep: Dependency) {
        this.dep = dep;
      }
    }

    class ClassWithGenerateAndMock {
      @Generate(AClass, [
        {provide:Dependency, mockObject:{mock:true}}
      ])
      public property: any;
    }

    let specContainer = specRegistry.getSpecContainerByClassName('ClassWithGenerateAndMock');

    expect(specContainer).not.toBeNull('SpecContainer not returned by Registry');
    expect(specContainer).not.toBeUndefined('SpecContainer not returned by Registry');

    let specObject = specContainer.getNewSpecObject(true);

    expect(specObject.property).not.toBeUndefined();
    expect(specObject.property).not.toBeNull();
    expect(specObject.property instanceof AClass).toBeTruthy('not right Type');
    expect(specObject.property.something).toEqual('sth', 'Property of Generated not set');

    expect(specObject.property.dep).not.toBeUndefined('dep undefined');
    expect(specObject.property.dep.mock).toBeTruthy('not used Mock');
  })



});
