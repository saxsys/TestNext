import {TestValidator} from './test-validator';

describe('TestValidator', () => {
  const classToTest = TestValidator;
  let objectToTest;

  beforeEach(() => {
    objectToTest = new classToTest();
  });

  it('should be created', () => {
    expect(objectToTest).toBeTruthy();
  });
});

describe('TestValidator.validateTest', () => {

  let testExampleCorrect;

  beforeEach(() => {


    testExampleCorrect = {
      name: '',
      something: 'very interesting stuff which should be a String',
      afunction: () => {
        return;
      },
      when:  [
        'something is given',
        () => {
          console.log(testExampleCorrect.something);
        }
    ],
  }
    ;
  });

  it('the static function should exist', () => {
    TestValidator.validateTest(testExampleCorrect);
  });

  it('should refuse Objects, with missing Property "name":string', () => {
    const testExampleWrong = testExampleCorrect;
    testExampleWrong.name = null;
    expect(TestValidator.validateTest(testExampleWrong)).toEqual(false);
    testExampleWrong.name = undefined;
    expect(TestValidator.validateTest(testExampleWrong)).toEqual(false);
  });

  it('should refuse Objects, with multiple ', () => {

  });
});
