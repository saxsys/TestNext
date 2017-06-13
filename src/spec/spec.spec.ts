/**
 * Created by paul.brandes on 24.05.2017.
 */
import {Spec} from "spec/spec";
import {SpecRegistryError} from "../specRegistry/errors/errors";
import {SpecRegistry} from "../specRegistry/spec-registry";

class ExampleSpecClass {

}

describe('Spec', () => {

  let spec;
  const specClassConstructor = ExampleSpecClass.prototype.constructor;
  const specName = 'A Class without Decorators';
  beforeEach(() => {
    spec = new Spec(specClassConstructor);
    spec.setDescription(specName);
  });

  it('should be constructed with proper parameters', () => {
    expect(spec).toBeDefined();
    expect(spec.getSpecName()).toEqual(specName);
    expect(spec.getClassConstructor()).toEqual(specClassConstructor);
  });
});

describe('Spec.addGiven', () => {


  let spec;
  const specClass = ExampleSpecClass.prototype.constructor;
  const specClassName = 'ExampleSpecClass';
  const specName = 'A Class without Decorators';
  const givenName0 = 'valueSetter';
  const givenDescription0 = 'a Value is getting set';
  const givenName1 = 'otherValueSetter';
  const givenDescription1 = 'an other Value is getting set';

  beforeEach(() => {
    spec = new Spec(specClass);
    spec.setDescription(specName);
  });

  it('should accept one added "given" without execNumber as 0', () => {

    spec.addGiven(givenName0, givenDescription0);
    let givenArray = spec.getOwnGiven();
    expect(givenArray.length).toEqual(1);

    let givenValue = givenArray[0];
    expect(givenValue.getName()).toEqual(givenName0);
    expect(givenValue.getDescription()).toEqual(givenDescription0);
  });

  it('should accept one added "given" with execNumber', () => {
    spec.addGiven(givenName0, givenDescription0, 0);
    let givenArray = spec.getOwnGiven();
    expect(givenArray.length).toEqual(1);

    let givenValue = givenArray[0];
    expect(givenValue.getName()).toEqual(givenName0);
    expect(givenValue.getDescription()).toEqual(givenDescription0);
  });

  it('should accept multiple added "given" with different execNumber', () => {
    spec.addGiven(givenName0, givenDescription0, 0);
    spec.addGiven(givenName1, givenDescription1, 1);
    let givenArray = spec.getOwnGiven();
    expect(givenArray.length).toEqual(2);
  });

  it('should refuse multiple added "given" with same execNumber', () => {
    spec.addGiven(givenName0, givenDescription0, 0);
    expect(() => {
      spec.addGiven(givenName1, givenDescription1, 0)
    })
      .toThrowError(SpecRegistryError,
        'Multiple @given, without ExecNumber, or it (0) already exists on ' + specClassName + '.' + givenName1
      );

  });


});

describe('Spec.addThen', () => {

  let spec;
  const specClassConstructor = ExampleSpecClass.prototype.constructor;
  const specClassName = 'ExampleSpecClass';
  const specName = 'A Class without Decorators';
  const thenName0 = 'ValueChanged';
  const thenDescription0 = 'a Value is was changed';
  const thenName1 = 'otherValueChanged';
  const thenDescription1 = 'an other Value was changed';

  beforeEach(() => {
    spec = new Spec(specClassConstructor);
    spec.setDescription(specName);
  });

  it('should accept one added "then" without execNumber as 0', () => {

    spec.addThen(thenName0, thenDescription0);
    let thenArray = spec.getOwnThen();
    expect(thenArray.length).toEqual(1);

    let thenValue = thenArray[0];
    expect(thenValue.getName()).toEqual(thenName0);
    expect(thenValue.getDescription()).toEqual(thenDescription0);
  });

  it('should accept one added "then" with execNumber', () => {
    spec.addThen(thenName0, thenDescription0, 0);
    let thenArray = spec.getOwnThen();
    expect(thenArray.length).toEqual(1);

    let thenValue = thenArray[0];
    expect(thenValue.getName()).toEqual(thenName0);
    expect(thenValue.getDescription()).toEqual(thenDescription0);
  });

  it('should accept multiple added "then" with different execNumber', () => {
    spec.addThen(thenName0, thenDescription0, 0);
    spec.addThen(thenName1, thenDescription1, 1);
    let thenArray = spec.getOwnThen();
    expect(thenArray.length).toEqual(2);
  });

  it('should refuse multiple added "then" with same execNumber', () => {
    spec.addThen(thenName0, thenDescription0, 0);
    expect(() => {
      spec.addThen(thenName1, thenDescription1, 0)
    })
      .toThrowError(SpecRegistryError,
        'Multiple @then, without ExecNumber, or it (0) already exists on ' + specClassName + '.' + thenName1
      );
  });
});

describe('Spec.addWhen', () => {

  let spec;
  const specClassConstructor = ExampleSpecClass.prototype.constructor;
  const specClassName = 'ExampleSpecClass';
  const specName = 'A Class without Decorators';
  const whenName = 'ValueChanged';
  const whenDescription = 'a Value changed';
  const whenName1 = 'Situation';
  const whenDescription1 = 'da special Situation happened';

  beforeEach(() => {
    spec = new Spec(specClassConstructor);
    spec.setDescription(specName);
  });

  it('should accept single "when"', () => {

    spec.addWhen(whenName, whenDescription);
    let whenEntry = spec.getOwnWhen();


    expect(whenEntry.getName()).toEqual(whenName);
    expect(whenEntry.getDescription()).toEqual(whenDescription);
  });

  it('should refuse multiple added "when" with same execNumber', () => {
    spec.addWhen(whenName, whenDescription);
    expect(() => {
      spec.addWhen(whenName1, whenDescription1, 0)
    })
      .toThrowError(SpecRegistryError,
        'Only one @When allowed on ' + specClassName +
        'cannot add ' + whenName1 + ', ' + whenName + ' is already @When'
      );

  });


});

describe('Spec.getOwnGiven', () => {
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

    let givenArray = specRegistry.getSpecByClassName(className).getOwnGiven();
    let namesInOrder = [];
    givenArray.forEach((given) => {
      namesInOrder.push(given.getName());
    });

    expect(namesInOrder).toEqual(['method0','method1', 'method2']);
  });
});

describe('Spec.getOwnThen', () => {
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

    let thenArray = specRegistry.getSpecByClassName(className).getOwnThen();
    let namesInOrder = [];
    thenArray.forEach((then) => {
      namesInOrder.push(then.getName());
    });

    expect(namesInOrder).toEqual(['method0','method1', 'method2']);
  });
});
