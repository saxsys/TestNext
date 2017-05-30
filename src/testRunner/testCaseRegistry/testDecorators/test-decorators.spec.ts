import {Given, Spec, Then, When} from "./test-decorators";
import {SpecRegistry} from "../specRegistry";
describe('TestDecorators.Spec', () => {


  it('should register a Class with Spec-Decorator', () => {

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

    }).toThrow(new Error('TestDecorators_Spec_ClassDouble is already registered for Spec:ClassDouble1, can only be registered once, cannot register for Spec:ClassDouble2'));
  });

  it('should refuse one SpecClass with two Spec Decorators', () => {
    expect(() => {
      @Spec('Spec_ClassWith2SpecDecorator1')
      @Spec('Spec_ClassWith2SpecDecorator2')
      class Spec_ClassWith2SpecDecorator {
      }
    }).toThrow(new Error('Spec_ClassWith2SpecDecorator is already registered for Spec:Spec_ClassWith2SpecDecorator2, can only be registered once, cannot register for Spec:Spec_ClassWith2SpecDecorator1'))

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
    }).toThrow(
      new Error('Only one @When allowed on ' + className +
        'cannot add ' + methodName2 + ', ' + methodName1 + ' is already @When')
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

});
