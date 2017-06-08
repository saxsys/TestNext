import {Given, Spec, Subject, Then, When} from "./test-decorators";
import {SpecRegistry} from "../specRegistry/spec-registry";
import {SpecRegistryError} from "../specRegistry/errors/errors";
describe('TestDecorators.Spec', () => {

  it('should register a class with Spec-decorator', () => {

    let specName = 'to Test Spec';
    let specClassName = 'TestDecorators_Spec_Correct';
    @Spec(specName)
    class TestDecorators_Spec_Correct {

    }

    let specRegEntry = SpecRegistry.getSpecByClassName(specClassName);
    expect(specRegEntry.getClassName()).toEqual('TestDecorators_Spec_Correct');
    expect(specRegEntry.getSpecName()).toEqual(specName);
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

  it('should refuse one SpecClass with two Spec Decorators', () => {
    expect(() => {
      @Spec('Spec_ClassWith2SpecDecorator1')
      @Spec('Spec_ClassWith2SpecDecorator2')
      class TestDecorators_Spec_ClassWith2SpecDecorator {
      }
    }).toThrowError(SpecRegistryError,
      'SpecClass "TestDecorators_Spec_ClassWith2SpecDecorator" already got has Description: ' +
      '"Spec_ClassWith2SpecDecorator2", only one is possible, cannot add: "Spec_ClassWith2SpecDecorator1"'
    );

  });

  it('should refuse classes with constructor-arguments', () => {
    expect(() => {
      @Spec('SpecClass with ConstructorArguments')
      class TestDecorators_Spec_ConstructorArguments {
        constructor(anArgument:any){}
      }
    }).toThrowError(SpecRegistryError,
      'SpecClass "TestDecorators_Spec_ConstructorArguments" has constructor-arguments, this is forbidden in Spec-classes'
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

      @Given(methodDescription, 0) aCorrectMethodIsGiven() {
      }
    }
    let specRegEntry = SpecRegistry.getSpecByClassName(className);
    let methodRegEntry = specRegEntry.getGivenArray()[0];
    expect(methodRegEntry.getName()).toEqual(methodName);
    expect(methodRegEntry.getDescription()).toEqual(methodDescription);
  });

  it('should register the @Given without the Class being registered as @Spec', () => {

    let methodDescription = 'A Method, within a Class no registered as Spec';
    let className = 'TestDecorators_Given_ClassWithoutDecorator';
    let methodName = 'methodInClassWithoutDeco';
    class TestDecorators_Given_ClassWithoutDecorator {
      @Given(methodDescription) methodInClassWithoutDeco() {
      }
    }
    let givenClass = new TestDecorators_Given_ClassWithoutDecorator();
    let entry = SpecRegistry.getSpecByClassName(className);
    expect(entry.getSpecName()).toBeUndefined();
    expect(entry.getClass().constructor).toEqual(givenClass.constructor);
    let givenEntry = entry.getGivenArray()[0];
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
      @Given(methodDescription1, 0)method1() {
      }

      @Given(methodDescription2, 1)method2() {
      }
    }

    let regEntry = SpecRegistry.getSpecByClassName(className);
    let methodEntries = regEntry.getGivenArray();
    expect(methodEntries.length).toBe(2);

    let methodEntry1 = methodEntries[0];
    expect(methodEntry1.getName()).toEqual(methodName1);
    expect(methodEntry1.getDescription()).toEqual(methodDescription1);

    let methodEntry2 = methodEntries[1];
    expect(methodEntry2.getName()).toEqual(methodName2);
    expect(methodEntry2.getDescription()).toEqual(methodDescription2);
  });

  it('should refuse methods with arguments', () => {
    expect(() => {
      class TestDecorators_Given_MethodArguments{
        @Given('A Method with Arguments') aMethodWithArguments(sth:any){}
      }
    }).toThrowError(SpecRegistryError,
    '@Given-method "TestDecorators_Given_MethodArguments.aMethodWithArguments" has arguments, this is forbidden for @Given-methods'
    );
  });

  it('should refuse classes with constructor-arguments', () => {
    expect(() => {
      class TestDecorators_Given_ConstructorArguments {
        constructor(anArgument:any){}
        @Given('Given of Class with Constructor-Arguments') justAMethod(){}
      }
    }).toThrowError(SpecRegistryError,
      'SpecClass "TestDecorators_Given_ConstructorArguments" has constructor-arguments, this is forbidden in Spec-classes'
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

      @When(methodDescription) whenItIsACorrectMethod() {
      }
    }
    let specRegEntry = SpecRegistry.getSpecByClassName(className);
    let methodRegEntry = specRegEntry.getWhen();
    expect(methodRegEntry.getName()).toEqual(methodName);
    expect(methodRegEntry.getDescription()).toEqual(methodDescription);
  });

  it('should register the @When without the Class being registered as @Spec', () => {

    let methodDescription = 'A Method, within a Class no registered as Spec';
    let className = 'TestDecorators_When_ClassWithoutDecorator';
    let methodName = 'methodInClassWithoutDeco';
    class TestDecorators_When_ClassWithoutDecorator {
      @When(methodDescription) methodInClassWithoutDeco() {
      }
    }
    let specClass = new TestDecorators_When_ClassWithoutDecorator();
    let entry = SpecRegistry.getSpecByClassName(className);
    expect(entry.getSpecName()).toBeUndefined();
    expect(entry.getClass().constructor).toEqual(specClass.constructor);
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
        @When(methodDescription1)somethingHappens() {
        }

        @When(methodDescription2)somethingElseHappens() {
        }
      }
    }).toThrowError(SpecRegistryError,
      'Only one @When allowed on ' + className + 'cannot add ' + methodName2 + ', ' + methodName1 + ' is already @When'
    );

  });

  it('should refuse methods with arguments', () => {
    expect(() => {
      class TestDecorators_When_MethodArguments{
        @When('A Method with Arguments') aMethodWithArguments(sth:any){}
      }
    }).toThrowError(SpecRegistryError,
      '@When-method "TestDecorators_When_MethodArguments.aMethodWithArguments" has arguments, this is forbidden for @When-methods'
    );
  });

  it('should refuse classes with constructor-arguments', () => {
    expect(() => {
      class TestDecorators_When_ConstructorArguments {
        constructor(anArgument:any){}
        @When('When of Class with Constructor-Arguments') aWhenFunction(){}
      }
    }).toThrowError(SpecRegistryError,
      'SpecClass "TestDecorators_When_ConstructorArguments" has constructor-arguments, this is forbidden in Spec-classes'
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

      @Then(methodDescription, 0) thenAMethodIsCorrect() {
      }
    }

    let specRegEntry = SpecRegistry.getSpecByClassName(className);
    let methodRegEntry = specRegEntry.getThenArray()[0];
    expect(methodRegEntry.getName()).toEqual(methodName);
    expect(methodRegEntry.getDescription()).toEqual(methodDescription);
  });

  it('should register the @Then without the Class being registered as @Spec', () => {

    let methodDescription = 'A Method, within a Class no registered as Spec';
    let className = 'TestDecorators_Then_ClassWithoutDecorator';
    let methodName = 'methodInClassWithoutDeco';

    class TestDecorators_Then_ClassWithoutDecorator {
      @Then(methodDescription) methodInClassWithoutDeco() {
      }
    }
    let specClass = new TestDecorators_Then_ClassWithoutDecorator();
    let entry = SpecRegistry.getSpecByClassName(className);
    expect(entry.getSpecName()).toBeUndefined();
    expect(entry.getClass().constructor).toEqual(specClass.constructor);
    let methodEntry = entry.getThenArray()[0];
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
      @Then(methodDescription1, 0)method1() {
      }

      @Then(methodDescription2, 1)method2() {
      }
    }

    let regEntry = SpecRegistry.getSpecByClassName(className);
    let methodEntries = regEntry.getThenArray();
    expect(methodEntries.length).toBe(2);

    let methodEntry1 = methodEntries[0];
    expect(methodEntry1.getName()).toEqual(methodName1);
    expect(methodEntry1.getDescription()).toEqual(methodDescription1);

    let methodEntry2 = methodEntries[1];
    expect(methodEntry2.getName()).toEqual(methodName2);
    expect(methodEntry2.getDescription()).toEqual(methodDescription2);
  });

  it('should refuse methods with arguments', () => {
    expect(() => {
      class TestDecorators_Then_MethodArguments{
        @Then('A Method with Arguments') aMethodWithArguments(sth:any){}
      }
    }).toThrowError(SpecRegistryError,
      '@Then-method "TestDecorators_Then_MethodArguments.aMethodWithArguments" has arguments, this is forbidden for @Then-methods'
    );
  });

  it('should refuse classes with constructor-arguments', () => {
    expect(() => {
      class TestDecorators_Then_ConstructorArguments {
        constructor(anArgument:any){}
        @Then('When of Class with Constructor-Arguments') aThenFunction(){}
      }
    }).toThrowError(SpecRegistryError,
      'SpecClass "TestDecorators_Then_ConstructorArguments" has constructor-arguments, this is forbidden in Spec-classes'
    );
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

    let specEntry = SpecRegistry.getSpecByClassName(specClassName);
    expect(specEntry.getSubjects()).toContain(subjectName);
    expect(SpecRegistry.getSpecsForSubject(subjectName)).toContain(specEntry);
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

    let specEntry = SpecRegistry.getSpecByClassName(specClassName);
    expect(specEntry.getSubjects()).toContain(subjectName1, subjectName2);
    expect(SpecRegistry.getSpecsForSubject(subjectName1)).toContain(specEntry);
    expect(SpecRegistry.getSpecsForSubject(subjectName2)).toContain(specEntry);
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

    let specEntry = SpecRegistry.getSpecByClassName(specClassName);
    expect(specEntry.getSubjects().length).toBe(1);
    expect(specEntry.getSubjects()).toContain(subjectName1);
    expect(SpecRegistry.getSpecsForSubject(subjectName1).length).toBe(1);
    expect(SpecRegistry.getSpecsForSubject(subjectName1)).toContain(specEntry);
  });

  it('should register Subject for classes with all Methods', () => {
    let specClassName = 'SpecDecorators_Subject_CompleteSpecClass';
    let subjectName = 'TestDecorators.Subject.CompleteSpecClass';

    @Spec('CompleteSpecClass')
    @Subject(subjectName)
    class SpecDecorators_Subject_CompleteSpecClass{
      @Given('a given') aGiven(){}
      @When('the when') theWhen(){}
      @Then('a then') aThen(){}
    }

    let specEntry = SpecRegistry.getSpecByClassName(specClassName);
    expect(specEntry).not.toBeNull();
    expect(specEntry.getSubjects()).toContain(subjectName);
    expect(SpecRegistry.getSpecsForSubject(subjectName)).toContain(specEntry);

  });

  it('should register a SpecClass, when not done yet an register then Subject', () => {
    let specClassName = 'SpecDecorators_Subject_ForClassNotDeclSpec';
    let subjectName = 'TestDecorators.Subject.ForClassNotDeclSpec';

    @Subject(subjectName)
    class SpecDecorators_Subject_ForClassNotDeclSpec {
      public val = 3;
    }

    let specEntry = SpecRegistry.getSpecByClassName(specClassName);
    expect(specEntry).not.toBeNull();
    expect(specEntry.getSubjects()).toContain(subjectName);
    expect(SpecRegistry.getSpecsForSubject(subjectName)).toContain(specEntry);
  });

  it('should throw SpecRegostryError, when unregistered SpecClass has construtor-arguments', () => {
    let specClassName = 'SpecDecorators_Subject_ConstructorArguments';
    let subjectName = 'TestDecorators.Subject.ConstructorArguments';

    expect(()=> {
      @Subject(subjectName)
      class SpecDecorators_Subject_ConstructorArguments {
        constructor(argument: number) {
        }
      }
    }).toThrowError(SpecRegistryError, 'SpecClass "' + specClassName +'" has constructor-arguments, this is forbidden in Spec-classes');
  });







});
