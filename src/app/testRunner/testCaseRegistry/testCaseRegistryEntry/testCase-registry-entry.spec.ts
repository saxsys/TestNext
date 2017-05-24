/**
 * Created by paul.brandes on 24.05.2017.
 */
import {TestCaseRegistryEntry} from "app/testRunner/testCaseRegistry/testCaseRegistryEntry/testCase-registry-entry";

class ExampleTestClass {

}

describe('TestCaseRegistryEntry', () => {

  let testCaseEntry;
  const testClass = ExampleTestClass;
  const testDescription = 'A Class without Decorators';
  beforeEach(() => {
    testCaseEntry = new TestCaseRegistryEntry(testClass, testDescription);
  });

  it('should be constructed with proper parameters', () => {
    expect(testCaseEntry).toBeDefined();
    expect(testCaseEntry.getDescription()).toEqual(testDescription);
    expect(testCaseEntry.getClass()).toEqual(testClass);
  });
});

describe('TestCaseRegistryEntry.given', () => {

  let testCaseEntry;
  const testClass = ExampleTestClass;
  const testClassName = 'ExampleTestClass';
  const testDescription = 'A Class without Decorators';
  const givenName0 = 'valueSetter';
  const givenDescription0 = 'a Value is getting set';
  const givenName1 = 'otherValueSetter';
  const givenDescription1 = 'an other Value is getting set';

  beforeEach(() => {
    testCaseEntry = new TestCaseRegistryEntry(testClass, testDescription);
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
    expect(() => {testCaseEntry.addGiven(givenName1, givenDescription1, 0)})
      .toThrow(new Error('Multiple @given, without ExecNumber, or it (0) already exists on ' +
        testClassName + '.' + givenName1));

  });


});

describe('TestCaseRegistryEntry.then', () => {

  let testCaseEntry;
  const testClass = ExampleTestClass;
  const testClassName = 'ExampleTestClass';
  const testDescription = 'A Class without Decorators';
  const thenName0 = 'ValueChanged';
  const thenDescription0 = 'a Value is was changed';
  const thenName1 = 'otherValueChanged';
  const thenDescription1 = 'an other Value was changed';

  beforeEach(() => {
    testCaseEntry = new TestCaseRegistryEntry(testClass, testDescription);
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
      .toThrow(new Error('Multiple @then, without ExecNumber, or it (0) already exists on ' +
        testClassName + '.' + thenName1));

  });
});

describe('TestCaseRegistryEntry.when', () => {

  let testCaseEntry;
  const testClass = ExampleTestClass;
  const testClassName = 'ExampleTestClass';
  const testDescription = 'A Class without Decorators';
  const whenName = 'ValueChanged';
  const whenDescription = 'a Value changed';
  const whenName1 = 'Situation';
  const whenDescription1 = 'da special Situation happened';

  beforeEach(() => {
    testCaseEntry = new TestCaseRegistryEntry(testClass, testDescription);
  });

  it('should accept single "when"', () => {

    testCaseEntry.addWhen(whenName, whenDescription);
    let whenEntry = testCaseEntry.getWhen();


    expect(whenEntry.getName()).toEqual(whenName);
    expect(whenEntry.getDescription()).toEqual(whenDescription);
  });

  it('should refuse multiple added "when" with same execNumber', () => {
    testCaseEntry.addWhen(whenName, whenDescription);
    expect(() => {testCaseEntry.addWhen(whenName1, whenDescription1, 0)})
      .toThrow(new Error('@When (' + whenName1 + ') already exists on ' + testClassName));

  });




});
