import {Cleanup,  Given, Ignore, Spec, Then, ThenThrow, When} from "../../SpecDeclaration/specDecorators/spec-decorators";
import {specRegistry} from "../../SpecStorage/specRegistry/spec-registry-storage";
import {SpecRunner} from "./spec-runner";
import {SpecValidationError} from "../specValidator/spec-validation-error";
import {AssertionError} from "../../SpecDeclaration/assert/assertion-Error";
import {AssertProportion} from "../../SpecDeclaration/assert/assert-proportion";
import {Injectable} from "@angular/core";
import {SpecReporter} from "../specReporting/specReporter/spec-reporter";
import {ExampleSpecFiller} from "../../utils/testData/example-spec-filler";
import {SpecContainer} from "../../SpecStorage/specContainer/specContainer";

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

    let specEntry = specRegistry.getSpecContainerByClassName(specClassName);
    let specReporter = new SpecReporter();
    let specRunner = SpecRunner.runSpec(specEntry, specReporter);
    expect(specRunner).not.toBeUndefined();
  });
});

describe('specRunner.runSpec', () => {

  let specEntry;
  let specRunner;
  let specReport;
  let specReporter;

  let specClassName = 'SpecRunner_runSpec';
  let methodNamesInOrder = ['given0', 'given1', 'theWhen', 'then0', 'then1', 'cleanup'];
  let methodsWithoutError = ['given0', 'given2', 'theWhen', 'then0', 'cleanup'];
  let methodsWithAssertError = ['then1'];
  let randomError = new Error('Random Error');
  let anyAssertionError = new AssertionError(1, 2, AssertProportion.EQUAL, 'Number', 'otherNumber');

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

    @Cleanup('cleanup') cleanup(){
      this.runOrder.push('cleanup');

    }
  }

  beforeAll(() => {
    specEntry = specRegistry.getSpecContainerByClassName(specClassName);
    specReporter = new SpecReporter();
    specRunner = SpecRunner.runSpec(specEntry, specReporter);
    specReport = specRunner.report;
  });

  it('should run all methods in Order', () => {
    expect(specRunner.usedObject.runOrder).toEqual(methodNamesInOrder);
  });

  it('should have logged for all', () => {
    let methodLogs = specReport.getMethodReports();
    expect(methodLogs.length).toEqual(6);

    let loggedFunctions = [];
    //get FunctionNames
    methodLogs.forEach((mLog) => {
      loggedFunctions.push(mLog.getMethodName());
    });

    methodNamesInOrder.forEach((methodName) => {
      expect(loggedFunctions).toContain(methodName);
    });
  });

  it('should reportRun methods without Error as successful', () => {
    specReport.getMethodReports().forEach((log) => {
      if (methodsWithoutError.indexOf(log.getMethodName()) > -1) {
        expect(log.isSuccess()).toBeTruthy();
        expect(log.getError()).toBeUndefined();
      }
    });
  });

  it('should reportRun methods with AssertionError as not successful and reportRun the error', () => {
    specReport.getMethodReports().forEach((log) => {
      if (methodsWithAssertError.indexOf(log.getMethodName()) > -1) {
        expect(log.isSuccess()).toBeFalsy();
        expect(log.getError()).not.toBeUndefined();
        expect(log.getError()).toEqual(anyAssertionError);
      }
    });
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


    let specEntry = specRegistry.getSpecContainerByClassName(specClassName);
    let specRunner = SpecRunner.runSpec(specEntry, specReporter);
    let report = specRunner.report;

    expect(report.getValidationErrors()).toContain(
      new SpecValidationError('There must be at lease one @Then or a @ThenThrow in ' + specClassName)
    );
    expect(report.getMethodReports().length).toBe(0);
    expect(specRunner.usedObject).toBeNull();
  });


  it('should be allowed to run a test multiple times, with different reporters', () => {
    let newSpecReporter = new SpecReporter();
    let specRunner = SpecRunner.runSpec(specEntry, newSpecReporter);
    expect(specRunner.report.getMethodReports()).toEqual(specReport.getMethodReports());
  });

  it('should execute also the Inherited Methods', () => {
    class SpecRunner_execInherited_parent {
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

      @Cleanup() cleanup(){
        this.runOrder.push('cleanup');
      }
    }

    @Spec('a inherited Then')
    class SpecRunner_execInheritated_child extends SpecRunner_execInherited_parent {
    }

    //let specParent = specRegistry.getSpecContainerByClassName(specClassName_parent);
    let specRunner = SpecRunner.runSpec(specEntry, specReporter);

    expect(specRunner.usedObject.runOrder).toContain('given0');
    expect(specRunner.usedObject.runOrder).toContain('theWhen');
    expect(specRunner.usedObject.runOrder).toContain('then0');
    expect(specRunner.usedObject.runOrder).toContain('cleanup');
  });

  it('should not run a Spec marked as @Ignore, return before validation', () => {
    @Ignore('not complete')
    @Spec('Ignored')
    class SpecRunner_runSpec_Ignored {
    }
    let specClassName = 'SpecRunner_runSpec_Ignored';

    let spec = specRegistry.getSpecContainerByClassName(specClassName);
    expect(spec.isIgnored()).toBeTruthy('Spec should have been marked as ignored');
    expect(spec.isExecutableSpec()).toBeTruthy('Spec was skipped because it is marked as not executable');

    let specRunner = SpecRunner.runSpec(spec, specReporter);
    expect(specRunner.report.getValidationErrors().length).toBe(0, 'tried to build ignored Spec');

  });

  it('should report a validation Error, if no Error is thrown in @ThenThrow', () => {
    let specClassName = 'SpecRunner_runSpec_ExpectError_NoErrorInThenThrow';

    @Spec('a Throw without Throwing')
    class SpecRunner_runSpec_ExpectError_NoErrorInThenThrow {

      @Given('given 0')given0() {
      }

      @When('the When') theWhen() {
        throw new Error('some Error');
      }

      @ThenThrow('thenThrow') thenThrow() {
      }
    }

    let specEntry = specRegistry.getSpecContainerByClassName(specClassName);
    let specRunner = SpecRunner.runSpec(specEntry, specReporter);
    let validationErrors = specRunner.report.getValidationErrors();
    expect(validationErrors.length).toBe(1);
    expect(validationErrors[0].message).toEqual('@ThenThrow() of '+ specEntry.getClassName() + '.thenThrow does not throw an error')

  });

  it('should compare Errors thrown in @When to Error given in @ThenThrow and accept (and log) if Error was expected', () => {
    let specClassName = 'SpecRunner_runSpec_ExpectError_valid';

    @Spec('a valid Test')
    class SpecRunner_runSpec_ExpectError_valid {

      @Given('given 0')given0() {
      }

      @When('the When') theWhen() {
        throw new Error('some Error');
      }

      @ThenThrow('thenThrow') thenThrow() {
        throw new Error('some Error');
      }
    }

    let specEntry = specRegistry.getSpecContainerByClassName(specClassName);
    let specRunner = SpecRunner.runSpec(specEntry, specReporter);
    let report = specRunner.report;
    expect(report.getValidationErrors().length).toBe(0, 'existing Validation Errors');
    expect(report.getMethodReports().length).toBe(3);
    expect(report.isRunFailed()).toBeFalsy();

  });

  it('should report when other Error is thrown than expected', ()=>{
    let specClassName = 'SpecRunner_runSpec_ExpectError_WrongError';
    let firstError = new Error('some Error');
    let otherError = new Error('different');

    @Spec('a valid Test')
    class SpecRunner_runSpec_ExpectError_WrongError {

      @Given('given 0')given0() {
      }

      @When('the When') theWhen() {
        throw firstError;
      }

      @ThenThrow('thenThrow') thenThrow() {
        throw otherError;
      }
    }

    let specEntry = specRegistry.getSpecContainerByClassName(specClassName);
    let specRunner = SpecRunner.runSpec(specEntry, specReporter);
    let report = specRunner.report;
    let failedReports = report.getFailReports();
    let failedWhen = failedReports[0];
    let failedThenThrow = failedReports[1];
    expect(failedWhen.getError()).toEqual(firstError);
    expect(failedThenThrow.getError().message).toEqual(
      'thrown Error(Error: some Error) should be equal to expected Error(Error: different)'
    );

  });

  it('should report, when Error expected, but none is thrown', () => {
    let specClassName = 'SpecRunner_runSpec_ExpectError_NoError';
    let firstError = new Error('some Error');
    let otherError = new Error('different');

    @Spec('a valid Test')
    class SpecRunner_runSpec_ExpectError_NoError {

      @Given('given 0')given0() {
      }

      @When('the When') theWhen() {

      }

      @ThenThrow('thenThrow') thenThrow() {
        throw otherError;
      }
    }

    let specEntry = specRegistry.getSpecContainerByClassName(specClassName);
    let specRunner = SpecRunner.runSpec(specEntry, specReporter);
    let report = specRunner.report;
    let failedReports = report.getFailReports();

    expect(failedReports.length).toBe(1);
    let noErrorReport = failedReports[0];
    expect(noErrorReport.getError().message).toEqual('No Error was thrown, expected "different"');

  });

  it('should not run then, if Error in "When", report all then as failed, execute cleanup', () => {
    let specContainer = ExampleSpecFiller.getSpecWithFailingWhen();
    let reporter = new SpecReporter();

    let specRunner = SpecRunner.runSpec(specContainer, specReporter);
    let runOrderNames = specRunner.usedObject.runned;

    expect(runOrderNames).toEqual(['given1', 'given2', 'when1', 'cleanup1']);
    expect(runOrderNames).not.toContain('then1');

    let methodReport = specRunner.report.getMethodReports();
    let reportedMethods = methodReport.map((repo) => {return repo.getMethodName()});
    expect(reportedMethods).toEqual(['given1', 'given2', 'when1', 'then1', 'cleanup1']);

  });

  it('should execute all then, even if one fails', () => {

  });


});

describe('SpecRunner.runSpec with Generate',()=>{
  class Spec {
    public generatedProp;

    public aGiven(){}
    public aWhen(){}
    public aThen(){}
  }
  let specClassConstructor = Spec.prototype.constructor;

  @Injectable()
  class SomeSUT {
    dep: ADependency;

    constructor(dep: ADependency) {
      this.dep = dep;
    }
  }

  @Injectable()
  class ADependency{
    isMock:false;
  }

  @Injectable()
  class AThingToGenerate{
    public dep;

    constructor(dep:ADependency){
      this.dep = dep;
    }
  }

  let genProviders = [{
    provide:ADependency,
    mockObject:{
      isMock:true
    }
  }];

  let specContainer;
  let reporter;
  beforeEach(()=>{
    specContainer = new SpecContainer(specClassConstructor);
    specContainer.setDescription('SpecContainer a with Generate');
    specContainer.addGiven('aGiven', 'A Given');
    specContainer.addWhen('aWhen', 'A When');
    specContainer.addThen('aThen', 'A Then');
    specContainer.addGeneratorOnProperty('generatedProp', AThingToGenerate, genProviders);
  });

  it('should use generated Properties, not mocked by default', ()=>{
    reporter = new SpecReporter();
    let runner = SpecRunner.runSpec(specContainer, reporter);

    expect(runner.report.getValidationErrors().length).toBe(0, 'errors existed: ' + runner.report.getValidationErrors().toString());
    expect(runner.report.getMethodReports().length).toBe(3, 'wrong amount of Reports');
    expect(runner.usedObject.generatedProp.dep.isMock).toBeFalsy('used Mock Object');
  });

  it('should use generated Properties, use Mocks, when given as Argument',()=>{
    reporter = new SpecReporter();
    let runner = SpecRunner.runSpec(specContainer, reporter, true);

    expect(runner.report.getValidationErrors().length).toBe(0, 'errors existed: ' + runner.report.getValidationErrors().toString());
    expect(runner.report.getMethodReports().length).toBe(3, 'wrong amount of Reports');
    expect(runner.usedObject.generatedProp.dep.isMock).toBeTruthy('not used Mock Object');
  });
});
