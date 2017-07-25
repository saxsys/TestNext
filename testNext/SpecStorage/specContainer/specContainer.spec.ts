/**
 * Created by paul.brandes on 24.05.2017.
 */
import {SpecContainer} from "./specContainer";
import {SpecRegistryError} from "../spec-registry-error";
import {Injectable} from "@angular/core";
import {SpecMethodContainer} from "./specMethodContainer/spec-method-container";
import {debugOutputAstAsTypeScript} from "@angular/compiler";

class SpecContainer_ExampleSpecClass {

}

class SpecContainer_ExampleParentsSpec {

}


const specClassConstructor = SpecContainer_ExampleSpecClass.prototype.constructor;
const specClassName = 'SpecContainer_ExampleSpecClass';
const specDescription = 'A Spec';

const parentSpecClassConstructor = SpecContainer_ExampleParentsSpec.prototype.constructor;
const parentSpecClassName = 'SpecContainer_ExampleParentsSpec';
const parentSpecDescription = 'A Parent Spec';

describe('SpecContainer', () => {

  let specContainer;
  beforeEach(() => {
    specContainer = new SpecContainer(specClassConstructor);
    specContainer.setDescription(specDescription);
  });

  it('should be constructed with proper parameters', () => {
    expect(specContainer).toBeDefined();
    expect(specContainer.getDescription()).toEqual(specDescription);
    expect(specContainer.getClassConstructor()).toEqual(specClassConstructor);
  });
});

describe('SpecContainer.setSUT', () => {
  class SpecContainer_setSUT {
  }
  let specClassConstructor = SpecContainer_setSUT.prototype.constructor;
  class SomeSUT {
  }
  let SUT = SomeSUT;
  let specContainer = new SpecContainer(specClassConstructor);

  it('should be possible to set the SUT', () => {
    specContainer.setSUT(SUT);

    let retSut = specContainer.getSUT();

    expect(retSut).toEqual(SUT);
  });

  it('should have added SUT to Providers', () => {
    expect(specContainer.getProviders()).toContain(SUT);
  });


  it('should refuse adding multiple SUT', () => {
    class OtherSUT {
    }
    let otherSUT = OtherSUT;

    let specContainer = new SpecContainer(specClassConstructor);
    specContainer.setSUT(SUT);


    expect(() => {
      specContainer.setSUT(otherSUT);
    }).toThrowError(
      SpecRegistryError,
      'Multiple @SUT on SpecWithSUT "SpecContainer_setSUT", only one is possible'
    );
  })
});

describe('SpecContainer.setProviders', () => {
  class SpecContainer_setProviders {
  }
  let specClassConstructor = SpecContainer_setProviders.prototype.constructor;
  class OneProvider {
  }
  class AnotherProvider {
  }
  let providers = [OneProvider, AnotherProvider];

  it('should be possible to set the Provider', () => {
    let specContainer = new SpecContainer(specClassConstructor);
    specContainer.addProviders(providers);

    let retProviders = specContainer.getProviders();

    expect(retProviders).toEqual(providers);
  });

  it('should add providers with union', () => {
    class ThirdProvider {
    }
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

describe('SpecContainer.getNewSpecObject', () => {

  class SpecContainer_SpecObject {
  }
  let specClassConstructor = SpecContainer_SpecObject.prototype.constructor;

  class SutDependency {
    public str = 'abc'
  }

  @Injectable()
  class SomeSUT {
    dep: SutDependency;

    constructor(dep: SutDependency) {
      this.dep = dep;
    }
  }

  let SUT = SomeSUT;
  let provider = SutDependency;

  it('it should return a valid Object of the Class', () => {
    let specContainer = new SpecContainer(specClassConstructor);
    specContainer.setDescription('SpecContainer a new Spec wit SUT');
    specContainer.setSUT(SUT);
    specContainer.addProviders([provider]);

    let specObject;
    expect(() => {
      specObject = specContainer.getNewSpecObject();
    }).not.toThrowError();

    expect(specObject.SUT).not.toBeUndefined();
    expect(specObject.SUT instanceof SUT).toBeTruthy();


  });

  it('should throw Error, if SpecClass has constructor-arguments', () => {
    class SpecContainer_NewObject_ClassWitArguments {
      constructor(num: number) {
      }
    }
    let specClassConstructor = SpecContainer_NewObject_ClassWitArguments.prototype.constructor;

    let specContainer = new SpecContainer(specClassConstructor);

    expect(() => {
      specContainer.getNewSpecObject();
    }).toThrowError(
      SpecRegistryError,
      'Class of "SpecContainer_NewObject_ClassWitArguments" has constructor-arguments, this is forbidden'
    );
  });

  it('should throw Error, if not possible to build SUT, due to missing right Providers', () => {
    let specContainer = new SpecContainer(specClassConstructor);
    specContainer.setDescription('SpecContainer a new Spec wit SUT');
    specContainer.setSUT(SUT);

    expect(() => {
      specContainer.getNewSpecObject();
    }).toThrowError(
      SpecRegistryError
    );
  });

  it('should have an accessible SUT', () => {
    let specContainer = new SpecContainer(specClassConstructor);
    specContainer.setDescription('SpecContainer a new Spec wit SUT');
    specContainer.setSUT(SUT);
    specContainer.addProviders([SutDependency]);

    let specObj = specContainer.getNewSpecObject();

    expect(specObj).not.toBeNull();
    expect(specObj.SUT).not.toBeUndefined();
    expect(specObj.SUT.dep).not.toBeUndefined();
    expect(specObj.SUT.dep.str).toEqual('abc');

  });

  it('should use the SUT of the Parent, if no own is set', () => {
    let parentContainer = new SpecContainer(parentSpecClassConstructor);
    parentContainer.setSUT(SUT);
    parentContainer.addProviders([SutDependency]);
    let childSpecContainer = new SpecContainer(specClassConstructor, parentContainer);

    let childSpecObj = childSpecContainer.getNewSpecObject();
    expect(childSpecObj).not.toBeNull();
    expect(childSpecObj.SUT).not.toBeUndefined();
    expect(childSpecObj.SUT.dep).not.toBeUndefined();
    expect(childSpecObj.SUT.dep.str).toEqual('abc');

  });
});


describe('SpecContainer.addGiven', () => {


  let specContainer;
  const givenName0 = 'valueSetter';
  const givenDescription0 = 'a Value is getting set';
  const givenName1 = 'otherValueSetter';
  const givenDescription1 = 'an other Value is getting set';

  beforeEach(() => {
    specContainer = new SpecContainer(specClassConstructor);
    specContainer.setDescription(specDescription);
  });

  it('should accept one added "given" without execNumber', () => {

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
        'In ' + specClassName + ' are multiple @Given, with the Same ExecNumber (0), this is forbidden'
      );

  });

  it('should accept multiple Given without ExecNumber', () => {
    specContainer.addGiven(givenName0, givenDescription0);
    specContainer.addGiven(givenName1, givenDescription1);
    let givenArray = specContainer.getOwnGiven();
    expect(givenArray.length).toEqual(2);
  });

  it('should refuse Given mixed with and without execNumber (without Number first)', () => {
    specContainer.addGiven(givenName0, givenDescription0);
    expect(() => {
      specContainer.addGiven(givenName1, givenDescription1, 1);
    }).toThrowError(SpecRegistryError, '@Given ' + specClassName + '.' + givenName1 + ' is invalid, you either have to give execNumbers for all, or for none');
  });

  it('should refuse Given mixed with and without execNumber (with execNumber first)', () => {
    specContainer.addGiven(givenName0, givenDescription0, 0);
    expect(() => {
      specContainer.addGiven(givenName1, givenDescription1);
    }).toThrowError(SpecRegistryError, '@Given ' + specClassName + '.' + givenName1 + ' is invalid, you either have to give execNumbers for all, or for none');
  });

  it('should refuse same method-Name multiple times in Given', () => {
    specContainer.addGiven(givenName0, givenDescription0);
    expect(() => {
      specContainer.addGiven(givenName0, givenDescription1);
    }).toThrowError(SpecRegistryError, 'Multiple Methods with same Name on ' + specClassName + '.' + givenName0);
  });

  it('should refuse same method-Name multiple times in one in Given, one in other Method', () => {
    specContainer.addThen(givenName0, givenDescription0);
    expect(() => {
      specContainer.addGiven(givenName0, givenDescription1);
    }).toThrowError(SpecRegistryError, 'Multiple Methods with same Name on ' + specClassName + '.' + givenName0);
  });

});

describe('SpecContainer.addThen', () => {

  let specContainer;
  const thenName0 = 'ValueChanged';
  const thenDescription0 = 'a Value is was changed';
  const thenName1 = 'otherValueChanged';
  const thenDescription1 = 'an other Value was changed';

  beforeEach(() => {
    specContainer = new SpecContainer(specClassConstructor);
    specContainer.setDescription(specDescription);
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
        'In ' + specClassName + ' are multiple @Then, with the Same ExecNumber (0), this is forbidden'
      );
  });

  it('should accept multiple Then without ExecNumber', () => {
    specContainer.addThen(thenName0, thenDescription0);
    specContainer.addThen(thenName1, thenDescription0);
    let thenArray = specContainer.getOwnThen();
    expect(thenArray.length).toEqual(2);
  });

  it('should refuse Then mixed with and without execNumber (without Number first)', () => {
    specContainer.addThen(thenName0, thenDescription0);
    expect(() => {
      specContainer.addThen(thenName1, thenDescription0, 1);
    }).toThrowError(SpecRegistryError, '@Then ' + specClassName + '.' + thenName1 + ' is invalid, you either have to give execNumbers for all, or for none');
  });

  it('should refuse Then mixed with and without execNumber (with execNumber first)', () => {
    specContainer.addThen(thenName0, thenDescription0, 0);
    expect(() => {
      specContainer.addThen(thenName1, thenDescription1);
    }).toThrowError(SpecRegistryError, '@Then ' + specClassName + '.' + thenName1 + ' is invalid, you either have to give execNumbers for all, or for none');
  });

});

describe('SpecContainer.addWhen', () => {

  let specContainer;
  const whenName = 'ValueChanged';
  const whenDescription = 'a Value changed';
  const whenName1 = 'Situation';
  const whenDescription1 = 'da special Situation happened';

  beforeEach(() => {
    specContainer = new SpecContainer(specClassConstructor);
    specContainer.setDescription(specDescription);
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
        ' cannot add ' + whenName1 + ', ' + whenName + ' is already @When'
      );

  });


});

describe('SpecContainer.addThenThrow', () => {
  let specContainer;
  const thenErrorName = 'aWildErrorAppears';
  const errorDescription = 'very wild error';

  it('should add ThenError', () => {
    specContainer = new SpecContainer(specClassConstructor);
    specContainer.setDescription(specDescription);

    specContainer.addThenThrow(thenErrorName, errorDescription);
    let thenErrorEntry = specContainer.getThenThrow();
    expect(thenErrorEntry).not.toBeUndefined();
    expect(thenErrorEntry.getName()).toEqual(thenErrorName);
    expect(thenErrorEntry.getDescription()).toEqual(errorDescription);
  });

  it('should refuse multiple added "when" with same execNumber', () => {
    specContainer = new SpecContainer(specClassConstructor);
    specContainer.setDescription(specDescription);

    let thenErrorName2 = 'anotherRandomError';
    let thenErrorDescription2 = 'useless Description';
    specContainer.addThenThrow(thenErrorName, errorDescription);
    expect(() => {
      specContainer.addThenThrow(thenErrorName2, thenErrorDescription2);
    }).toThrowError(SpecRegistryError,
      'Only one @ThenThrow allowed on ' + specClassName +
      ' cannot add ' + thenErrorName2 + ', ' + thenErrorName + ' is already @ThenThrow'
    );

  });

});

describe('SpecContainer.addCleanup', () => {
  let specContainer;
  let cleanupName1 = 'cleanup1';
  let cleanupDescrption1 = 'cleanup1';
  let cleanupName2 = 'cleanup2';
  let cleanupDescrption2 = 'cleanup2';

  beforeEach(() => {
    specContainer = new SpecContainer(specClassConstructor);
  });

  it('should add a "cleanup" without additional Arguments', () => {
    specContainer.addCleanup(cleanupName1);
    let cleanupArray = specContainer.getOwnCleanup();

    expect(cleanupArray.length).toBe(1);

    let cleanupValue = cleanupArray[0];
    expect(cleanupValue instanceof SpecMethodContainer).toBeTruthy();
    expect(cleanupValue.getName()).toEqual(cleanupName1);
    expect(cleanupValue.getDescription()).toEqual('');
  });

  it('should accept multiple methods without additional Arguments', () => {
    specContainer.addCleanup(cleanupName1);
    specContainer.addCleanup(cleanupName2);
    let cleanupArray = specContainer.getOwnCleanup();

    expect(cleanupArray.length).toBe(2);

    let cleanupValue1 = cleanupArray[0];
    let cleanupValue2 = cleanupArray[1];
    expect(cleanupValue1.getName).not.toEqual(cleanupValue2.getName());

    expect([cleanupName1, cleanupName2]).toContain(cleanupValue1.getName())
    expect([cleanupName1, cleanupName2]).toContain(cleanupValue2.getName())
  });

  it('should accept one added "cleanup" with description and execNumber', () => {
    specContainer.addCleanup(cleanupName1, cleanupDescrption1, 0);
    let methodArray = specContainer.getOwnCleanup();
    expect(methodArray.length).toEqual(1);

    let method = methodArray[0];
    expect(method.getName()).toEqual(cleanupName1);
    expect(method.getDescription()).toEqual(cleanupDescrption1);
  });

  it('should accept multiple added "cleanup" with different execNumber', () => {
    specContainer.addCleanup(cleanupName1, cleanupDescrption1, 0);
    specContainer.addCleanup(cleanupName2, cleanupDescrption2, 1);

    let cleanupArray = specContainer.getOwnCleanup();
    expect(cleanupArray.length).toBe(2);
  });

  it('should refuse multiple added "cleanup" with same execNumber', () => {
    specContainer.addCleanup(cleanupName1, cleanupDescrption1, 0);
    expect(() => {
      specContainer.addCleanup(cleanupName2, cleanupDescrption2, 0)
    })
      .toThrowError(SpecRegistryError,
        'In ' + specClassName + ' are multiple @Cleanup, with the Same ExecNumber (0), this is forbidden'
      );

  });

  it('should refuse mixed "Cleanup" with and without execNumber (without Number first)', () => {
    specContainer.addCleanup(cleanupName1, cleanupDescrption1);
    expect(() => {
      specContainer.addCleanup(cleanupName2, cleanupDescrption2, 1);
    }).toThrowError(SpecRegistryError,
      '@Cleanup ' + specClassName + '.' + cleanupName2 + ' is invalid, you either have to give execNumbers for all, or for none'
    );
  });

  it('should refuse Given mixed with and without execNumber (with execNumber first)', () => {
    specContainer.addCleanup(cleanupName1, cleanupDescrption1, 1);
    expect(() => {
      specContainer.addCleanup(cleanupName2, cleanupDescrption2);
    }).toThrowError(SpecRegistryError,
      '@Cleanup ' + specClassName + '.' + cleanupName2 + ' is invalid, you either have to give execNumbers for all, or for none'
    );
  });


});


describe('SpecContainer.getOwnGiven', () => {
  let className = 'SpecContainer_GivenArray';
  class SpecContainer_GivenArray {
    method0() {
    };

    method1() {
    };

    method2() {
    };
  }
  let specClassConstructor = SpecContainer_GivenArray.prototype.constructor;

  let specContainer = new SpecContainer(specClassConstructor);

  it('should return method-entries in order of execNumber, independent of adding order ', () => {
    specContainer.addGiven('method2', 'specMethod2', 3);
    specContainer.addGiven('method0', 'specMethod0', 0);
    specContainer.addGiven('method1', 'specMethod1', 1);

    let givenArray = specContainer.getGiven();
    let namesInOrder = [];
    givenArray.forEach((given) => {
      namesInOrder.push(given.getName());
    });

    expect(namesInOrder).toEqual(['method0', 'method1', 'method2']);
  });
});

describe('SpecContainer.getOwnThen', () => {
  let className = 'SpecContainer_ThenArray';
  class SpecContainer_ThenArray {
    method0() {
    };

    method1() {
    };

    method2() {
    };
  }
  let specClassConstructor = SpecContainer_ThenArray.prototype.constructor;

  let specContainer = new SpecContainer(specClassConstructor);

  it('should return method-entries in order of execNumber, independent of adding order ', () => {

    specContainer.addThen('method2', 'specMethod2', 3);
    specContainer.addThen('method0', 'specMethod0', 0);
    specContainer.addThen('method1', 'specMethod1', 1);

    let thenArray = specContainer.getThen();
    let namesInOrder = [];
    thenArray.forEach((then) => {
      namesInOrder.push(then.getName());
    });

    expect(namesInOrder).toEqual(['method0', 'method1', 'method2']);
  });
});


describe('SpecContainer.getGiven', () => {

  let parentContainer;
  let childContainer;

  let parentMethodName1 = 'givenParent1';
  let parentMethodDescription1 = 'givenParent1';
  let parentMethodName2 = 'givenParent2';
  let parentMethodDescription2 = 'givenParent2';

  let childMethodName1 = 'givenChild1';
  let childMethodDescription1 = 'givenChild1';
  let childMethodName2 = 'givenChild2';
  let childMethodDescription2 = 'givenChild2';

  let methodArray;
  let methodNames;
  beforeAll(() => {
    parentContainer = new SpecContainer(parentSpecClassConstructor);
    parentContainer.addGiven(parentMethodName1, parentMethodDescription1, 1);
    parentContainer.addGiven(parentMethodName2, parentMethodDescription2, 2);

    childContainer = new SpecContainer(specClassConstructor, parentContainer);
    childContainer.addGiven(childMethodName1, childMethodDescription1, 1);
    childContainer.addGiven(childMethodName2, childMethodDescription2, 2);

    methodArray = childContainer.getGiven();
    methodNames = methodArray.map(method => {
      return method.getName()
    });
  });

  it('should return methods and inherited Mehtods', () => {
    expect(methodNames).toContain(parentMethodName1);
    expect(methodNames).toContain(parentMethodName2);
    expect(methodNames).toContain(childMethodName1);
    expect(methodNames).toContain(childMethodName2);
  });

  it('should return inherited Methods first, ordered as given with the ExecNumber in the Parent', () => {
    expect(methodArray[0].getName()).toEqual(parentMethodName1);
    expect(methodArray[1].getName()).toEqual(parentMethodName2);
  });

  it('should return own Methods second, ordered as given with the ExecNumber', () => {
    expect(methodArray[2].getName()).toEqual(childMethodName1);
    expect(methodArray[3].getName()).toEqual(childMethodName2);
  });
});

describe('SpecContainer.getWhen', () => {
  let parentContainer;
  let childContainer;

  let parentMethodName1 = 'whenParent1';
  let parentMethodDescription1 = 'whenParent1';

  let childMethodName1 = 'whenChild1';
  let childMethodDescription1 = 'whenChild1';

  beforeEach(() => {
    parentContainer = new SpecContainer(parentSpecClassConstructor);
    childContainer = new SpecContainer(specClassConstructor, parentContainer);
  });

  it('should return When if set', () => {
    childContainer.addWhen(childMethodName1, childMethodDescription1, 1);
    let methodContainer = childContainer.getWhen();
    expect(methodContainer.getName()).toEqual(childMethodName1);
  });

  it('should not return parents "when", if childs When is set', () =>{
    parentContainer.addWhen(parentMethodName1, parentMethodDescription1, 1);
    childContainer.addWhen(childMethodName1, childMethodDescription1, 1);

    let methodContainer = childContainer.getWhen();
    expect(methodContainer.getName()).not.toEqual(parentMethodName1);
  });

  it('should return parents When, if no own is set', () =>{
    parentContainer.addWhen(parentMethodName1, parentMethodDescription1, 1);

    let methodContainer = childContainer.getWhen();
    expect(methodContainer.getName()).toEqual(parentMethodName1);
  });
});

describe('SpecContainer.getThen', () => {

  let parentContainer;
  let childContainer;

  let parentMethodName1 = 'thenParent1';
  let parentMethodDescription1 = 'thenParent1';
  let parentMethodName2 = 'thenParent2';
  let parentMethodDescription2 = 'thenParent2';

  let childMethodName1 = 'thenChild1';
  let childMethodDescription1 = 'thenChild1';
  let childMethodName2 = 'thenChild2';
  let childMethodDescription2 = 'thenChild2';

  let methodArray;
  let methodNames;

  beforeAll(() => {
    parentContainer = new SpecContainer(parentSpecClassConstructor);
    parentContainer.addThen(parentMethodName1, parentMethodDescription1, 1);
    parentContainer.addThen(parentMethodName2, parentMethodDescription2, 2);

    childContainer = new SpecContainer(specClassConstructor, parentContainer);
    childContainer.addThen(childMethodName1, childMethodDescription1, 1);
    childContainer.addThen(childMethodName2, childMethodDescription2, 2);

    methodArray = childContainer.getThen();
    methodNames = methodArray.map(method => {
      return method.getName()
    });
  });

  it('should return methods and inherited Mehtods', () => {
    expect(methodNames).toContain(parentMethodName1);
    expect(methodNames).toContain(parentMethodName2);
    expect(methodNames).toContain(childMethodName1);
    expect(methodNames).toContain(childMethodName2);
  });

  it('should return inherited Methods first, ordered as given with the ExecNumber in the Parent', () => {
    expect(methodArray[0].getName()).toEqual(parentMethodName1);
    expect(methodArray[1].getName()).toEqual(parentMethodName2);
  });

  it('should return own Methods second, ordered as given with the ExecNumber', () => {
    expect(methodArray[2].getName()).toEqual(childMethodName1);
    expect(methodArray[3].getName()).toEqual(childMethodName2);
  });
});

describe('SpecContainer.getThenThrow', () => {
  let parentContainer;
  let childContainer;

  let parentMethodName1 = 'thenThrowParent1';
  let parentMethodDescription1 = 'thenThrowParent1';

  let childMethodName1 = 'thenThrowChild1';
  let childMethodDescription1 = 'thenThrowChild1';

  beforeEach(() => {
    parentContainer = new SpecContainer(parentSpecClassConstructor);
    childContainer = new SpecContainer(specClassConstructor, parentContainer);
  });

  it('should return When if set', () => {
    childContainer.addThenThrow(childMethodName1, childMethodDescription1, 1);
    let methodContainer = childContainer.getThenThrow();
    expect(methodContainer.getName()).toEqual(childMethodName1);
  });

  it('should not return parents "when", if childs When is set', () =>{
    parentContainer.addThenThrow(parentMethodName1, parentMethodDescription1, 1);
    childContainer.addThenThrow(childMethodName1, childMethodDescription1, 1);

    let methodContainer = childContainer.getThenThrow();
    expect(methodContainer.getName()).not.toEqual(parentMethodName1);
  });

  it('should return parents When, if no own is set', () =>{
    parentContainer.addThenThrow(parentMethodName1, parentMethodDescription1, 1);

    let methodContainer = childContainer.getThenThrow();
    expect(methodContainer.getName()).toEqual(parentMethodName1);
  });


});

describe('SpecContainer.getCleanup', () => {

  let parentContainer;
  let childContainer;

  let parentMethodName1 = 'cleanupParent1';
  let parentMethodDescription1 = 'cleanupParent1';
  let parentMethodName2 = 'cleanupParent2';
  let parentMethodDescription2 = 'cleanupParent2';

  let childMethodName1 = 'cleanupChild1';
  let childMethodDescription1 = 'cleanupChild1';
  let childMethodName2 = 'cleanupChild2';
  let childMethodDescription2 = 'cleanupChild2';

  let methodArray;
  let methodNames;
  beforeAll(() => {
    parentContainer = new SpecContainer(parentSpecClassConstructor);
    parentContainer.addCleanup(parentMethodName1, parentMethodDescription1, 1);
    parentContainer.addCleanup(parentMethodName2, parentMethodDescription2, 2);

    childContainer = new SpecContainer(specClassConstructor, parentContainer);
    childContainer.addCleanup(childMethodName1, childMethodDescription1, 1);
    childContainer.addCleanup(childMethodName2, childMethodDescription2, 2);

    methodArray = childContainer.getCleanup();
    methodNames = methodArray.map(method => {
      return method.getName()
    });
  });

  it('should return methods and inherited Mehtods', () => {
    expect(methodNames).toContain(parentMethodName1);
    expect(methodNames).toContain(parentMethodName2);
    expect(methodNames).toContain(childMethodName1);
    expect(methodNames).toContain(childMethodName2);
  });

  it('should return inherited Methods first, ordered as given with the ExecNumber in the Parent', () => {
    expect(methodArray[0].getName()).toEqual(parentMethodName1);
    expect(methodArray[1].getName()).toEqual(parentMethodName2);
  });

  it('should return own Methods second, ordered as given with the ExecNumber', () => {
    expect(methodArray[2].getName()).toEqual(childMethodName1);
    expect(methodArray[3].getName()).toEqual(childMethodName2);
  });
});

