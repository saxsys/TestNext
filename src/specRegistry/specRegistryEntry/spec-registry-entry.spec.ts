/**
 * Created by paul.brandes on 24.05.2017.
 */
import {SpecRegistryEntry} from "specRegistry/specRegistryEntry/spec-registry-entry";
import {SpecRegistryError} from "../errors/errors";
import {SpecRegistry} from "../spec-registry";

class ExampleSpecClass {

}

describe('SpecRegistryEntry', () => {

  let testCaseEntry;
  const specClassConstructor = ExampleSpecClass.prototype.constructor;
  const specName = 'A Class without Decorators';
  beforeEach(() => {
    testCaseEntry = new SpecRegistryEntry(specClassConstructor);
    testCaseEntry.setDescription(specName);
  });

  it('should be constructed with proper parameters', () => {
    expect(testCaseEntry).toBeDefined();
    expect(testCaseEntry.getSpecName()).toEqual(specName);
    expect(testCaseEntry.getClassConstructor()).toEqual(specClassConstructor);
  });
});

describe('SpecRegistryEntry.addGiven', () => {


  let testCaseEntry;
  const specClass = ExampleSpecClass.prototype.constructor;
  const specClassName = 'ExampleSpecClass';
  const specName = 'A Class without Decorators';
  const givenName0 = 'valueSetter';
  const givenDescription0 = 'a Value is getting set';
  const givenName1 = 'otherValueSetter';
  const givenDescription1 = 'an other Value is getting set';

  beforeEach(() => {
    testCaseEntry = new SpecRegistryEntry(specClass);
    testCaseEntry.setDescription(specName);
  });

  it('should accept one added "given" without execNumber as 0', () => {

    testCaseEntry.addGiven(givenName0, givenDescription0);
    let givenArray = testCaseEntry.getGivenArray();
    expect(givenArray.length).toEqual(1);

    let givenValue = givenArray[0];
    expect(givenValue.getName()).toEqual(givenName0);
    expect(givenValue.getDescription()).toEqual(givenDescription0);
  });

  it('should accept one added "given" with execNumber', () => {
    testCaseEntry.addGiven(givenName0, givenDescription0, 0);
    let givenArray = testCaseEntry.getGivenArray();
    expect(givenArray.length).toEqual(1);

    let givenValue = givenArray[0];
    expect(givenValue.getName()).toEqual(givenName0);
    expect(givenValue.getDescription()).toEqual(givenDescription0);
  });

  it('should accept multiple added "given" with different execNumber', () => {
    testCaseEntry.addGiven(givenName0, givenDescription0, 0);
    testCaseEntry.addGiven(givenName1, givenDescription1, 1);
    let givenArray = testCaseEntry.getGivenArray();
    expect(givenArray.length).toEqual(2);
  });

  it('should refuse multiple added "given" with same execNumber', () => {
    testCaseEntry.addGiven(givenName0, givenDescription0, 0);
    expect(() => {
      testCaseEntry.addGiven(givenName1, givenDescription1, 0)
    })
      .toThrowError(SpecRegistryError,
        'Multiple @given, without ExecNumber, or it (0) already exists on ' + specClassName + '.' + givenName1
      );

  });


});

describe('SpecRegistryEntry.addThen', () => {

  let testCaseEntry;
  const specClassConstructor = ExampleSpecClass.prototype.constructor;
  const specClassName = 'ExampleSpecClass';
  const specName = 'A Class without Decorators';
  const thenName0 = 'ValueChanged';
  const thenDescription0 = 'a Value is was changed';
  const thenName1 = 'otherValueChanged';
  const thenDescription1 = 'an other Value was changed';

  beforeEach(() => {
    testCaseEntry = new SpecRegistryEntry(specClassConstructor);
    testCaseEntry.setDescription(specName);
  });

  it('should accept one added "then" without execNumber as 0', () => {

    testCaseEntry.addThen(thenName0, thenDescription0);
    let thenArray = testCaseEntry.getThenArray();
    expect(thenArray.length).toEqual(1);

    let thenValue = thenArray[0];
    expect(thenValue.getName()).toEqual(thenName0);
    expect(thenValue.getDescription()).toEqual(thenDescription0);
  });

  it('should accept one added "then" with execNumber', () => {
    testCaseEntry.addThen(thenName0, thenDescription0, 0);
    let thenArray = testCaseEntry.getThenArray();
    expect(thenArray.length).toEqual(1);

    let thenValue = thenArray[0];
    expect(thenValue.getName()).toEqual(thenName0);
    expect(thenValue.getDescription()).toEqual(thenDescription0);
  });

  it('should accept multiple added "then" with different execNumber', () => {
    testCaseEntry.addThen(thenName0, thenDescription0, 0);
    testCaseEntry.addThen(thenName1, thenDescription1, 1);
    let thenArray = testCaseEntry.getThenArray();
    expect(thenArray.length).toEqual(2);
  });

  it('should refuse multiple added "then" with same execNumber', () => {
    testCaseEntry.addThen(thenName0, thenDescription0, 0);
    expect(() => {
      testCaseEntry.addThen(thenName1, thenDescription1, 0)
    })
      .toThrowError(SpecRegistryError,
        'Multiple @then, without ExecNumber, or it (0) already exists on ' + specClassName + '.' + thenName1
      );
  });
});

describe('SpecRegistryEntry.addWhen', () => {

  let testCaseEntry;
  const specClassConstructor = ExampleSpecClass.prototype.constructor;
  const specClassName = 'ExampleSpecClass';
  const specName = 'A Class without Decorators';
  const whenName = 'ValueChanged';
  const whenDescription = 'a Value changed';
  const whenName1 = 'Situation';
  const whenDescription1 = 'da special Situation happened';

  beforeEach(() => {
    testCaseEntry = new SpecRegistryEntry(specClassConstructor);
    testCaseEntry.setDescription(specName);
  });

  it('should accept single "when"', () => {

    testCaseEntry.addWhen(whenName, whenDescription);
    let whenEntry = testCaseEntry.getWhen();


    expect(whenEntry.getName()).toEqual(whenName);
    expect(whenEntry.getDescription()).toEqual(whenDescription);
  });

  it('should refuse multiple added "when" with same execNumber', () => {
    testCaseEntry.addWhen(whenName, whenDescription);
    expect(() => {
      testCaseEntry.addWhen(whenName1, whenDescription1, 0)
    })
      .toThrowError(SpecRegistryError,
        'Only one @When allowed on ' + specClassName +
        'cannot add ' + whenName1 + ', ' + whenName + ' is already @When'
      );

  });


});

describe('SpecRegistryEntry.getGivenArray', () => {
  let specRegistry = new SpecRegistry();
  let className = 'SpecRegistryEntry_GivenArray';
  class SpecRegistryEntry_GivenArray{
    method0(){};
    method1(){};
    method2(){};
  }
  let specClassConstructor;

  specClassConstructor = SpecRegistryEntry_GivenArray.prototype.constructor;

  it('should return method-entries in order of execNumber, independent of adding order ', () => {
    specRegistry.registerGivenForSpec(specClassConstructor, 'method2', 'specMethod2', 3);
    specRegistry.registerGivenForSpec(specClassConstructor, 'method0', 'specMethod0', 0);
    specRegistry.registerGivenForSpec(specClassConstructor, 'method1', 'specMethod1', 1);

    let givenArray = specRegistry.getSpecByClassName(className).getGivenArray();
    let namesInOrder = [];
    givenArray.forEach((given) => {
      namesInOrder.push(given.getName());
    });

    expect(namesInOrder).toEqual(['method0','method1', 'method2']);
  });
});

describe('SpecRegistryEntry.getThenArray', () => {
  let specRegistry = new SpecRegistry();
  let className = 'SpecRegistryEntry_ThenArray';
  class SpecRegistryEntry_ThenArray{
    method0(){};
    method1(){};
    method2(){};
  }
  let specClassConstructor = SpecRegistryEntry_ThenArray.prototype.constructor;

  it('should return method-entries in order of execNumber, independent of adding order ', () => {
    specRegistry.registerThenForSpec(specClassConstructor, 'method2', 'specMethod2', 3);
    specRegistry.registerThenForSpec(specClassConstructor, 'method0', 'specMethod0', 0);
    specRegistry.registerThenForSpec(specClassConstructor, 'method1', 'specMethod1', 1);

    let thenArray = specRegistry.getSpecByClassName(className).getThenArray();
    let namesInOrder = [];
    thenArray.forEach((then) => {
      namesInOrder.push(then.getName());
    });

    expect(namesInOrder).toEqual(['method0','method1', 'method2']);
  });
});
