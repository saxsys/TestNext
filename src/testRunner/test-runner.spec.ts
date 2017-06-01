import {Given, Spec, Then, When} from "../testDecorators/test-decorators";
import {SpecRegistry} from "../specRegistry/spec-registry";
import {TestRunner} from "./test-runner";
import {SuccessLogger} from "./success-Logger/success-logger";
import {SpecValidationError} from "./testValidator/spec-validation-error";
import {AssertionError} from "../assert/assertion-Error";
import {AssertProportion} from "../assert/assert-proportion";
import {isSuccess} from "@angular/http/src/http_utils";

describe('testRunner.constructor', () => {
  it('should refuse invalid Tests', () => {
    let specClassName = 'TestRunner_constructor_InvalidTest';
    //The test has no Then Method
    @Spec('an invalid Test')
    class TestRunner_constructor_InvalidTest {
      private someValue;
      private otherValue;

      @Given('something given')sthGiven() {
        this.someValue = 0;
      }

      @When('something happens') sthHappened() {
        this.otherValue = this.someValue++;
      }
    }

    let specEntry = SpecRegistry.getSpecByClassName(specClassName);

    let succLogger = new SuccessLogger();

    expect(() => {
      let testRunner = new TestRunner(specEntry, succLogger);
    }).toThrowError(SpecValidationError, 'There must be at lease one @Then in ' + specClassName);
  });

  it('should init with proper parameters', () => {
    let specClassName = 'TestRunner_constructor_correct';
    //The test has no Then Method
    @Spec('an invalid Test')
    class TestRunner_constructor_correct {
      private someValue;
      private otherValue;

      @Given('something given')sthGiven() {
        this.someValue = 0;
      }

      @When('something happens') sthIsGiven() {
        this.otherValue = this.someValue++;
      }

      @Then('something should have changed') sthShouldHaveChanged() {

      }
    }

    let specEntry = SpecRegistry.getSpecByClassName(specClassName);

    let succLogger = new SuccessLogger();

    let testRunner = new TestRunner(specEntry, succLogger);
    expect(testRunner).not.toBeUndefined();
  });
});

describe('testRunner.runSpec', () => {

  let specEntry;
  let succLogger;
  let testRunner;

  let specClassName = 'TestRunner_runSpec';
  let methodNamesInOrder = ['given0', 'given1', 'theWhen', 'then0', 'then1'];
  let methodsWithoutError = ['given0', 'given2', 'theWhen', 'then0'];
  let methodsWithAssertError = ['then1'];
  let methodsWithOtherError = [];
  let randomError = new Error('Random Error');
  let anyAssertionError = new AssertionError(1, 2, AssertProportion.EQUAL, 'Number','otherNumber');

  @Spec('an invalid Test')
  class TestRunner_runSpec {
    public runOrder = [];

    @Then('then 0', 0) then0() {
      this.runOrder.push('then0');
    }

    @Given('given 1', 1)given1() {
      this.runOrder.push('given1');
    }

    @Given('given 0', 0)given0() {
      this.runOrder.push('given0');
    }

    @When('the When') theWhen() {
      this.runOrder.push('theWhen');
    }

    @Then('then1', 1) then1() {
      this.runOrder.push('then1');
      throw anyAssertionError;
    }
  }

  beforeAll(() => {
    specEntry = SpecRegistry.getSpecByClassName(specClassName);
    succLogger = new SuccessLogger();
    testRunner = new TestRunner(specEntry, succLogger);
    testRunner.runSpec();
  });

  it('should run all methods in Order', () => {
    expect(specEntry.getClass().runOrder).toEqual(methodNamesInOrder);
  });

  it('should have logged for all', () => {
    let logs = testRunner.getSuccessLogger().getLogs();
    expect(logs.length).toEqual(5);

    let loggedFunctions = [];
    //get FunctionNames
    logs.forEach((log)=>{loggedFunctions.push(log.getMethodName());});

    methodNamesInOrder.forEach((methodName) => {
      expect(loggedFunctions).toContain(methodName);
    });
  });

  it('should log methods without Error as successful', () => {
    succLogger.getLogs().forEach((log)=>{
      if(methodsWithoutError.indexOf(log.getMethodName()) >-1) {
        expect(log.isSuccess()).toBeTruthy();
        expect(log.getClassName()).toEqual(specClassName);
        expect(log.getError()).toBeUndefined();
      }
    });
  });

  it('should log methods with AssertionError as not successful and log the error', () => {
    succLogger.getLogs().forEach((log)=>{
      if(methodsWithAssertError.indexOf(log.getMethodName()) >-1) {
        expect(log.isSuccess()).toBeFalsy();
        expect(log.getClassName()).toEqual(specClassName);
        expect(log.getError()).not.toBeUndefined();
        expect(log.getError()).toEqual(anyAssertionError);
      }
    });
  });

  it('should stop executing the test, if an error is thrown (which is not an AssertionError', () => {

    @Spec('a test with Error')
    class TestRunner_runSpec_WithRandomError {
      @Given('given')given() {
        throw randomError;
      }
      @When('when') when() {}
      @Then('then') then() {}
    }
    let specClassName = 'TestRunner_runSpec_WithRandomError';
    let specEntry = SpecRegistry.getSpecByClassName(specClassName);
    let succLogger = new SuccessLogger();
    let testRunner = new TestRunner(specEntry, succLogger);

    expect(() => {testRunner.runSpec()}).toThrow(randomError);

  });



});
