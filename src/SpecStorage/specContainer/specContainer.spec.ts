/**
 * Created by paul.brandes on 24.05.2017.
 */
import {SpecContainer} from "./specContainer";
import {SpecRegistryError} from "../spec-registry-error";
import * as _ from "underscore";

class ExampleSpecClass {

}

describe('SpecContainer', () => {

  let specContainer;
  const specClassConstructor = ExampleSpecClass.prototype.constructor;
  const specName = 'A Class without Decorators';
  beforeEach(() => {
    specContainer = new SpecContainer(specClassConstructor);
    specContainer.setDescription(specName);
  });

  it('should be constructed with proper parameters', () => {
    expect(specContainer).toBeDefined();
    expect(specContainer.getSpecName()).toEqual(specName);
    expect(specContainer.getClassConstructor()).toEqual(specClassConstructor);
  });
});

describe('SpecContainer.addGiven', () => {


  let specContainer;
  const specClass = ExampleSpecClass.prototype.constructor;
  const specClassName = 'ExampleSpecClass';
  const specName = 'A Class without Decorators';
  const givenName0 = 'valueSetter';
  const givenDescription0 = 'a Value is getting set';
  const givenName1 = 'otherValueSetter';
  const givenDescription1 = 'an other Value is getting set';

  beforeEach(() => {
    specContainer = new SpecContainer(specClass);
    specContainer.setDescription(specName);
  });

  it('should accept one added "given" without execNumber as 0', () => {

    specContainer.addGiven(givenName0, givenDescription0);
    let givenArray = specContainer.getOwnGiven();
    expect(givenArray.length).toEqual(1);

    let givenValue = givenArray[0];
    expect(givenValue.getName()).toEqual(givenName0);
    expect(givenValue.getDescription()).toEqual(givenDescription0);
  });

  it('should accept one added "given" with execNumber', () => {
    specContainer.addGiven(givenName0, givenDescription0, 0);
    let givenArray = specContainer.getOwnGiven();
    expect(givenArray.length).toEqual(1);

    let givenValue = givenArray[0];
    expect(givenValue.getName()).toEqual(givenName0);
    expect(givenValue.getDescription()).toEqual(givenDescription0);
  });

  it('should accept multiple added "given" with different execNumber', () => {
    specContainer.addGiven(givenName0, givenDescription0, 0);
    specContainer.addGiven(givenName1, givenDescription1, 1);
    let givenArray = specContainer.getOwnGiven();
    expect(givenArray.length).toEqual(2);
  });

  it('should refuse multiple added "given" with same execNumber', () => {
    specContainer.addGiven(givenName0, givenDescription0, 0);
    expect(() => {
      specContainer.addGiven(givenName1, givenDescription1, 0)
    })
      .toThrowError(SpecRegistryError,
        'Multiple @given, without ExecNumber, or it (0) already exists on ' + specClassName + '.' + givenName1
      );

  });
});

describe('SpecContainer.addThen', () => {

  let specContainer;
  const specClassConstructor = ExampleSpecClass.prototype.constructor;
  const specClassName = 'ExampleSpecClass';
  const specName = 'A Class without Decorators';
  const thenName0 = 'ValueChanged';
  const thenDescription0 = 'a Value is was changed';
  const thenName1 = 'otherValueChanged';
  const thenDescription1 = 'an other Value was changed';

  beforeEach(() => {
    specContainer = new SpecContainer(specClassConstructor);
    specContainer.setDescription(specName);
  });

  it('should accept one added "then" without execNumber as 0', () => {

    specContainer.addThen(thenName0, thenDescription0);
    let thenArray = specContainer.getOwnThen();
    expect(thenArray.length).toEqual(1);

    let thenValue = thenArray[0];
    expect(thenValue.getName()).toEqual(thenName0);
    expect(thenValue.getDescription()).toEqual(thenDescription0);
  });

  it('should accept one added "then" with execNumber', () => {
    specContainer.addThen(thenName0, thenDescription0, 0);
    let thenArray = specContainer.getOwnThen();
    expect(thenArray.length).toEqual(1);

    let thenValue = thenArray[0];
    expect(thenValue.getName()).toEqual(thenName0);
    expect(thenValue.getDescription()).toEqual(thenDescription0);
  });

  it('should accept multiple added "then" with different execNumber', () => {
    specContainer.addThen(thenName0, thenDescription0, 0);
    specContainer.addThen(thenName1, thenDescription1, 1);
    let thenArray = specContainer.getOwnThen();
    expect(thenArray.length).toEqual(2);
  });

  it('should refuse multiple added "then" with same execNumber', () => {
    specContainer.addThen(thenName0, thenDescription0, 0);
    expect(() => {
      specContainer.addThen(thenName1, thenDescription1, 0)
    })
      .toThrowError(SpecRegistryError,
        'Multiple @then, without ExecNumber, or it (0) already exists on ' + specClassName + '.' + thenName1
      );
  });
});

describe('SpecContainer.addWhen', () => {

  let specContainer;
  const specClassConstructor = ExampleSpecClass.prototype.constructor;
  const specClassName = 'ExampleSpecClass';
  const specName = 'A Class without Decorators';
  const whenName = 'ValueChanged';
  const whenDescription = 'a Value changed';
  const whenName1 = 'Situation';
  const whenDescription1 = 'da special Situation happened';

  beforeEach(() => {
    specContainer = new SpecContainer(specClassConstructor);
    specContainer.setDescription(specName);
  });

  it('should accept single "when"', () => {

    specContainer.addWhen(whenName, whenDescription);
    let whenEntry = specContainer.getOwnWhen();


    expect(whenEntry.getName()).toEqual(whenName);
    expect(whenEntry.getDescription()).toEqual(whenDescription);
  });

  it('should refuse multiple added "when" with same execNumber', () => {
    specContainer.addWhen(whenName, whenDescription);
    expect(() => {
      specContainer.addWhen(whenName1, whenDescription1, 0)
    })
      .toThrowError(SpecRegistryError,
        'Only one @When allowed on ' + specClassName +
        'cannot add ' + whenName1 + ', ' + whenName + ' is already @When'
      );

  });


});

describe('SpecContainer.getOwnGiven', () => {
  let className = 'SpecContainer_GivenArray';
  class SpecContainer_GivenArray{
    method0(){};
    method1(){};
    method2(){};
  }
  let specClassConstructor = SpecContainer_GivenArray.prototype.constructor;

  let specContainer = new SpecContainer(specClassConstructor);

  it('should return method-entries in order of execNumber, independent of adding order ', () => {
    specContainer.addGiven( 'method2', 'specMethod2', 3);
    specContainer.addGiven('method0', 'specMethod0', 0);
    specContainer.addGiven('method1', 'specMethod1', 1);

    let givenArray = specContainer.getOwnGiven();
    let namesInOrder = [];
    givenArray.forEach((given) => {
      namesInOrder.push(given.getName());
    });

    expect(namesInOrder).toEqual(['method0','method1', 'method2']);
  });
});

describe('SpecContainer.getOwnThen', () => {
  let className = 'SpecContainer_ThenArray';
  class SpecContainer_ThenArray{
    method0(){};
    method1(){};
    method2(){};
  }
  let specClassConstructor = SpecContainer_ThenArray.prototype.constructor;

  let specContainer = new SpecContainer(specClassConstructor);

  it('should return method-entries in order of execNumber, independent of adding order ', () => {

    specContainer.addThen( 'method2', 'specMethod2', 3);
    specContainer.addThen( 'method0', 'specMethod0', 0);
    specContainer.addThen( 'method1', 'specMethod1', 1);

    let thenArray = specContainer.getOwnThen();
    let namesInOrder = [];
    thenArray.forEach((then) => {
      namesInOrder.push(then.getName());
    });

    expect(namesInOrder).toEqual(['method0','method1', 'method2']);
  });
});

describe('SpecContainer.setSUT', () => {
  class SpecContainer_setSUT{}
  let specClassConstructor = SpecContainer_setSUT.prototype.constructor;
  class SomeSUT{}
  let SUT = SomeSUT;

  it('should be possible to set the SUT', () => {
    let specContainer = new SpecContainer(specClassConstructor);
    specContainer.setSUT(SUT);

    let retSut = specContainer.getSUT();

    expect(retSut).toEqual(SUT);
  });

  it('should refuse adding multiple SUT', () => {
    class OtherSUT{}
    let otherSUT = OtherSUT;

    let specContainer = new SpecContainer(specClassConstructor);
    specContainer.setSUT(SUT);


    expect(() => {
      specContainer.setSUT(otherSUT);
    }).toThrowError(
      SpecRegistryError,
      'Multiple @SUT on SpecClass "SpecContainer_setSUT", only one is possible'
    );
  })
});

describe('SpecContainer.setProviders', () => {
  class SpecContainer_setProviders{}
  let specClassConstructor = SpecContainer_setProviders.prototype.constructor;
  class OneProvider{}
  class AnotherProvider{}
  let providers = [OneProvider, AnotherProvider];

  it('should be possible to set the Provider', () => {
    let specContainer = new SpecContainer(specClassConstructor);
    specContainer.addProviders(providers);

    let retProviders = specContainer.getProviders();

    expect(retProviders).toEqual(providers);
  });

  it('should add providers with union', () => {
    class ThirdProvider{}
    let otherProviders = [AnotherProvider, ThirdProvider];
    let specContainer = new SpecContainer(specClassConstructor);

    specContainer.addProviders(providers);
    specContainer.addProviders(otherProviders);

    let retProviders = specContainer.getProviders();

    expect(retProviders.length).toBe(3);
    expect(retProviders).toContain(OneProvider);
    expect(retProviders).toContain(AnotherProvider);
    expect(retProviders).toContain(ThirdProvider);


  })
});
