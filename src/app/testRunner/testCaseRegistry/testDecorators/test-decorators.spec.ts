import {Given, Spec, Then, When} from "./test-decorators";
import {SpecRegistry} from "../specRegistry";
describe('TestDecorators.Spec', () => {


  it('should register a Class with Spec-Decorator', () => {
    let specName = 'to Test Spec';
    let specClassName = 'SpecClassProperSpecDecorator';
    @Spec(specName)
    class SpecClassProperSpecDecorator {

    }

    let specRegEntry = SpecRegistry.getSpecByClassName(specClassName);
    expect(specRegEntry.getClassName()).toEqual('SpecClassProperSpecDecorator');
    expect(specRegEntry.getSpecName()).toEqual(specName);
  });

  it('should refuse Spec with existing class-name', () => {
    @Spec('ClassDouble1')
    class SpecClassDoubleDecoratorSpec {
    }

    expect(() => {
      @Spec('ClassDouble2')
      class SpecClassDoubleDecoratorSpec {
      }

    }).toThrow(new Error('SpecClassDoubleDecoratorSpec is already registered for Spec:ClassDouble1, can only be registered once, cannot register for Spec:ClassDouble2'));
  });
  it('should refuse one SpecClassProperSpecDecorator with two Spec Decorators', () => {
    expect(() => {
      @Spec('SpecClassWith2SpecDecorator1')
      @Spec('SpecClassWith2SpecDecorator2')
      class SpecClassWith2SpecDecorator {
      }
    }).toThrow(new Error('SpecClassWith2SpecDecorator is already registered for Spec:SpecClassWith2SpecDecorator2, can only be registered once, cannot register for Spec:SpecClassWith2SpecDecorator1'))

  });

});

describe('TestDecorators.Given', () => {

  it('should register the Given-Method in the Spec-Entry', () => {
    let className = 'SpecClassDecoratorGivenCorrect';
    let methodName = 'aCorrectMethodIsGiven';
    let specName = 'specClassDecoratorGivenCorrect';
    let methodDescription = 'a correct Method is given';
    @Spec(specName)
    class SpecClassDecoratorGivenCorrect {
      public val = 3;
      @Given(methodDescription, 0) aCorrectMethodIsGiven() {}
    }
    let specRegEntry = SpecRegistry.getSpecByClassName(className);
    let methodRegEntry = specRegEntry.getGivenArray()[0];
    expect(methodRegEntry.getName()).toEqual(methodName);
    expect(methodRegEntry.getDescription()).toEqual(methodDescription);
  });

  it('should register the @Given without the Class being registered as @Spec', ()=>{
    let methodDescription = 'A Method, within a Class no registered as Spec';
    let className = 'TestDecoratorsGiven_ClassWithoutDecorator';
    let methodName = 'methodInClassWithoutDeco';
    class TestDecoratorsGiven_ClassWithoutDecorator{
      @Given(methodDescription) methodInClassWithoutDeco(){}
    }
    let givenClass = new TestDecoratorsGiven_ClassWithoutDecorator();
    let entry = SpecRegistry.getSpecByClassName(className);
    expect(entry.getSpecName()).toBeUndefined();
    expect(entry.getClass().constructor).toEqual(givenClass.constructor);
    let givenEntry = entry.getGivenArray()[0];
    expect(givenEntry.getDescription()).toEqual(methodDescription);
    expect(givenEntry.getName()).toEqual(methodName);
  });

});

describe('TestDecorators.When', () => {
  it('should register the When-Method in the Spec-Entry', () => {
    let specName = 'specClassDecoratorWhenCorrect';
    let className = 'SpecClassDecoratorWhenCorrect';
    let methodDescription = 'when it is a correct method';
    let methodName = 'whenItIsACorrectMethod';
    @Spec(specName)
    class SpecClassDecoratorWhenCorrect {
      public val = 3;
      @When(methodDescription) whenItIsACorrectMethod() {}
    }
    let specRegEntry = SpecRegistry.getSpecByClassName(className);
    let methodRegEntry = specRegEntry.getWhen();
    expect(methodRegEntry.getName()).toEqual(methodName);
    expect(methodRegEntry.getDescription()).toEqual(methodDescription);
  });

  it('should register the @When without the Class being registered as @Spec', ()=>{
    let methodDescription = 'A Method, within a Class no registered as Spec';
    let className = 'TestDecoratorsWhen_ClassWithoutDecorator';
    let methodName = 'methodInClassWithoutDeco';
    class TestDecoratorsWhen_ClassWithoutDecorator{
      @When(methodDescription) methodInClassWithoutDeco(){}
    }
    let specClass = new TestDecoratorsWhen_ClassWithoutDecorator();
    let entry = SpecRegistry.getSpecByClassName(className);
    expect(entry.getSpecName()).toBeUndefined();
    expect(entry.getClass().constructor).toEqual(specClass.constructor);
    let methodEntry = entry.getWhen();
    expect(methodEntry.getDescription()).toEqual(methodDescription);
    expect(methodEntry.getName()).toEqual(methodName);
  });
});

describe('TestDecorators.Then', () => {
  it('should register the Then-Method in the Spec-Entry', () => {
    let className = 'SpecClassDecoratorThenCorrect';
    let methodName = 'thenAMethodIsCorrect';
    let specName = 'specClassDecoratorThenCorrect';
    let methodDescription = 'then a Method is correct';
    @Spec(specName)
    class SpecClassDecoratorThenCorrect {
      public val = 3;
      @Then(methodDescription, 0) thenAMethodIsCorrect() {}
    }
    let specRegEntry = SpecRegistry.getSpecByClassName(className);
    let methodRegEntry = specRegEntry.getThenArray()[0];
    expect(methodRegEntry.getName()).toEqual(methodName);
    expect(methodRegEntry.getDescription()).toEqual(methodDescription);
  });

  it('should register the @Then without the Class being registered as @Spec', ()=>{
    let methodDescription = 'A Method, within a Class no registered as Spec';
    let className = 'TestDecoratorsThen_ClassWithoutDecorator';
    let methodName = 'methodInClassWithoutDeco';
    class TestDecoratorsThen_ClassWithoutDecorator{
      @Then(methodDescription) methodInClassWithoutDeco(){}
    }
    let specClass = new TestDecoratorsThen_ClassWithoutDecorator();
    let entry = SpecRegistry.getSpecByClassName(className);
    expect(entry.getSpecName()).toBeUndefined();
    expect(entry.getClass().constructor).toEqual(specClass.constructor);
    let methodEntry = entry.getThenArray()[0];
    expect(methodEntry.getDescription()).toEqual(methodDescription);
    expect(methodEntry.getName()).toEqual(methodName);
  });
});
