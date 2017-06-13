import {Given, Spec, Then, When} from "../testDecorators/test-decorators";
import {specRegistry} from "../specRegistry/spec-registry-storage";
import {SpecRunner} from "./spec-runner";
import {SpecReporter} from "../spec-run-reporter/spec-reporter";
import {SpecValidationError} from "./specValidator/spec-validation-error";
import {AssertionError} from "../assert/assertion-Error";
import {AssertProportion} from "../assert/assert-proportion";

describe('specRunner.constructor', () => {
  it('should init', () => {
    let specClassName = 'SpecRunner_constructor_correct';
    //The test has no Then Method
    @Spec('an invalid Test')
    class SpecRunner_constructor_correct {
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

    let specEntry = specRegistry.getSpecByClassName(specClassName);

    let specLogger = new SpecReporter();

    let specRunner = new SpecRunner(specEntry, specLogger);
    expect(specRunner).not.toBeUndefined();
  });
});

describe('specRunner.runSpec', () => {

  let specEntry;
  let specReporter;
  let specRunner;
  let specReport;

  let specClassName = 'SpecRunner_runSpec';
  let methodNamesInOrder = ['given0', 'given1', 'theWhen', 'then0', 'then1'];
  let methodsWithoutError = ['given0', 'given2', 'theWhen', 'then0'];
  let methodsWithAssertError = ['then1'];
  let randomError = new Error('Random Error');
  let anyAssertionError = new AssertionError(1, 2, AssertProportion.EQUAL, 'Number','otherNumber');

  @Spec('a valid Test')
  class SpecRunner_runSpec {
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
    specEntry = specRegistry.getSpecByClassName(specClassName);
    specReporter = new SpecReporter();
    specRunner = new SpecRunner(specEntry, specReporter);
    specReport = specRunner.runSpec();

    expect(specReport).not.toBeNull();

  });

  it('should report validationError for invalid Tests and not try run the tests', () => {
    let specClassName = 'SpecRunner_runSpec_InvalidTest';
    //The test has no Then Method
    @Spec('an invalid Test')
    class SpecRunner_runSpec_InvalidTest {
      private someValue;
      private otherValue;

      @Given('something given')sthGiven() {
        this.someValue = 0;
      }

      @When('something happens') sthHappened() {
        this.otherValue = this.someValue++;
      }
    }

    let specEntry = specRegistry.getSpecByClassName(specClassName);
    let specLogger = new SpecReporter();
    let specRunner = new SpecRunner(specEntry, specLogger);
    let report = specRunner.runSpec();
    expect(report.getValidationErrors()).toContain(
      new SpecValidationError('There must be at lease one @Then in ' +  specClassName)
    );
    expect(specRunner.getUsedSpecObject()).toBeNull();
    expect(report.getReports().length).toBe(0);
  });

  it('should run all methods in Order', () => {

    expect(specRunner.getUsedSpecObject().runOrder).toEqual(methodNamesInOrder);
  });

  it('should have logged for all', () => {
    let methodLogs = specReport.getReports();
    expect(methodLogs.length).toEqual(5);

    let loggedFunctions = [];
    //get FunctionNames
    methodLogs.forEach((mLog)=>{loggedFunctions.push(mLog.getMethodName());});

    methodNamesInOrder.forEach((methodName) => {
      expect(loggedFunctions).toContain(methodName);
    });
  });

  it('should reportRun methods without Error as successful', () => {
    specReport.getReports().forEach((log)=>{
      if(methodsWithoutError.indexOf(log.getMethodName()) >-1) {
        expect(log.isSuccess()).toBeTruthy();
        expect(log.getError()).toBeUndefined();
      }
    });
  });

  it('should reportRun methods with AssertionError as not successful and reportRun the error', () => {
    specReport.getReports().forEach((log)=>{
      if(methodsWithAssertError.indexOf(log.getMethodName()) >-1) {
        expect(log.isSuccess()).toBeFalsy();
        expect(log.getError()).not.toBeUndefined();
        expect(log.getError()).toEqual(anyAssertionError);
      }
    });
  });

  it('should stop executing the test, if an error is thrown (which is not an AssertionError', () => {

    @Spec('a test with Error')
    class SpecRunner_runSpec_WithRandomError {
      @Given('given')given() {
        throw randomError;
      }
      @When('when') when() {}
      @Then('then') then() {}
    }
    let specClassName = 'SpecRunner_runSpec_WithRandomError';
    let specEntry = specRegistry.getSpecByClassName(specClassName);
    let specLogger = new SpecReporter();
    let specRunner = new SpecRunner(specEntry, specLogger);

    expect(() => {specRunner.runSpec()}).toThrow(randomError);

  });

  it('should be allowed to run a test multiple times, with different reporters', () => {
    let newReporter = new SpecReporter();
    let newReport = specRunner.runSpec(newReporter);
    expect(newReport.getReports()).toEqual(specReport.getReports());
  });

  it('should execute also the Inherited Methods', ()=> {
    let specClassName_parent = 'SpecRunner_execInheritated_parent';
    let specClassName_child = 'SpecRunner_execInheritated_child';


    class SpecRunner_execInheritated_parent {
      public runOrder = [];
      @Given('given 0') given0() {
        this.runOrder.push('given0');
      }
      @When('the When') theWhen() {
        this.runOrder.push('theWhen');
      }
      @Then('then 0') then0() {
        this.runOrder.push('then0');
      }
    }

    @Spec('a inherited Then')
    class SpecRunner_execInheritated_child extends SpecRunner_execInheritated_parent {
    }

    //let specParent = specRegistry.getSpecByClassName(specClassName_parent);
    let specChild = specRegistry.getSpecByClassName(specClassName_child);
    let newReporter = new SpecReporter();
    let specRunner = new SpecRunner(specEntry, specReporter);
    let newReport = specRunner.runSpec(newReporter);

    expect(specRunner.getUsedSpecObject().runOrder).toContain('given0');
    expect(specRunner.getUsedSpecObject().runOrder).toContain('theWhen');
    expect(specRunner.getUsedSpecObject().runOrder).toContain('then0');
  })
});
