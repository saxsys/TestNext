import {SpecValidator} from "./spec-validator";
import {SpecValidationError} from "./spec-validation-error";
import {ExampleSpecFiller} from "../../utils/testData/example-spec-filler";
import {SpecContainer} from "../../SpecStorage/specContainer/specContainer";

describe('SpecValidator.validate', () => {
  it('should accept proper Specs', () => {

    let spec = ExampleSpecFiller.getStandardSpec();

    expect(() => {
      SpecValidator.validate(spec)
    }).not.toThrow();
  });

  it('should refuse specs without @Given', () => {

    let spec = ExampleSpecFiller.getSpecWithoutGiven()

    expect(() => {
      SpecValidator.validate(spec)
    }).toThrowError(SpecValidationError, 'There must be at lease one @Given in ' + spec.getClassName());
  });

  it('should accept Specs with only inherited @Given', () => {

    class SpecValidator_validate_inheritGiven_parent {
      private thing = 0;
      given0() {
        this.thing = 1;
      }
    }

    class SpecValidator_validate_inheritGiven_child extends SpecValidator_validate_inheritGiven_parent {
      public runOrder = [];
      theWhen() {
        this.runOrder.push('theWhen');
      }
      then0() {
        this.runOrder.push('then0');
      }
    }

    let parentConstructor = SpecValidator_validate_inheritGiven_parent.prototype.constructor;
    let specParent = new SpecContainer(parentConstructor);
    specParent.addGiven('given0', 'given0');

    let childConstructor = SpecValidator_validate_inheritGiven_child.prototype.constructor;
    let specChild = new SpecContainer(childConstructor, specParent);
    specChild.setDescription('a valid Test');
    specChild.addWhen('theWhen', 'the When');
    specChild.addThen('then0', 'then 0');

    expect(() => {SpecValidator.validate(specChild);}).not.toThrow();
  });

  it('should refuse Specs, when the @Given function does not exist on the Object', () => {

    let spec = ExampleSpecFiller.getSpecWithoutGiven();
    spec.addGiven('nonExistGiven', 'does not exist', 1);

    expect(() => {
      SpecValidator.validate(spec);
    }).toThrowError(
      SpecValidationError,
      'On "' + spec.getClassName() + '" @Given function "nonExistGiven" does not exist');
  });


  it('should refuse specs without @When', () => {

    let spec = ExampleSpecFiller.getSpecWithoutWhen();

    expect(() => {
      SpecValidator.validate(spec);
    }).toThrowError(
      SpecValidationError,
      '@When of "' + spec.getClassName() + '" is not set'
    );
  });

  it('should accept Specs with only inherited @When', () => {
    class SpecValidator_validate_inheritGiven_parent {
      public runOrder = [];
      public thing = 0;
      theWhen() {
        this.runOrder.push('theWhen');
      }
    }

    class SpecValidator_validate_inheritGiven_child extends SpecValidator_validate_inheritGiven_parent {
      given0() {
        this.thing = 1;
      }
      then0() {
        this.runOrder.push('then0');
      }
    }

    let parentConstructor = SpecValidator_validate_inheritGiven_parent.prototype.constructor;
    let specParent = new SpecContainer(parentConstructor);
    specParent.addWhen('theWhen', 'the When');

    let childConstructor = SpecValidator_validate_inheritGiven_child.prototype.constructor;
    let specChild = new SpecContainer(childConstructor, specParent);
    specChild.setDescription('a valid Test');
    specChild.addGiven('given0', 'given0');
    specChild.addThen('then0', 'then 0');

    expect(() => {SpecValidator.validate(specChild);}).not.toThrow();
  });


  it('should refuse Specs, when the @When function does not exist on the Object', () => {
    let spec = ExampleSpecFiller.getSpecWithoutWhen();
    spec.addWhen('nonExistWhen', 'does not exist');

    expect(() => {
      SpecValidator.validate(spec);
    }).toThrowError(
      SpecValidationError,
      'On "' + spec.getClassName() + '" @When function "nonExistWhen" does not exist'
    );
  });


  it('should refuse specs without @Then or @ThenThrow', () => {
    let spec = ExampleSpecFiller.getSpecWithoutThen();

    expect(() => {
      SpecValidator.validate(spec)
    }).toThrowError(SpecValidationError, 'There must be at lease one @Then or a @ThenThrow in ' + spec.getClassName());
  });


  it('should accept Specs with only inherited @Then', () => {
    class SpecValidator_validate_inheritGiven_parent {
      public runOrder = [];
      public thing = 0;
      then0() {
        this.runOrder.push('then0');
      }
    }

    class SpecValidator_validate_inheritGiven_child extends SpecValidator_validate_inheritGiven_parent {
      given0() {
        this.thing = 1;
      }
      theWhen() {
        this.runOrder.push('theWhen');
      }
    }

    let parentConstructor = SpecValidator_validate_inheritGiven_parent.prototype.constructor;
    let specParent = new SpecContainer(parentConstructor);
    specParent.addThen('then0', 'then 0');

    let childConstructor = SpecValidator_validate_inheritGiven_child.prototype.constructor;
    let specChild = new SpecContainer(childConstructor, specParent);
    specChild.setDescription('a valid Test');
    specChild.addGiven('given0', 'given 0');
    specChild.addWhen('theWhen', 'the When');

    expect(() => {SpecValidator.validate(specChild);}).not.toThrow();
  });

  it('should refuse Specs, when the @Then function does not exist on the Object', () => {
    let spec = ExampleSpecFiller.getSpecWithoutThen()
    spec.addThen('nonExistThen', 'does not exist', 1);

    expect(() => {
      SpecValidator.validate(spec);
    }).toThrowError(
      SpecValidationError,
      'On "' + spec.getClassName() + '" @Then function "nonExistThen" does not exist');
  });

  it('should accept Specs with @ThenThrow', () => {

    let spec = ExampleSpecFiller.getErrorThrowingExpectingSpec();
    expect(()=>{
      SpecValidator.validate(spec);
    }).not.toThrow();
  });

  it('should refuse Spec, when @Cleanup function does not exist on the Object', ()=> {


    let spec = ExampleSpecFiller.getSpecWithoutCleanup();
    spec.addCleanup('nonExistCleanup', 'does not exist');

    expect(() => {
      SpecValidator.validate(spec);
    }).toThrowError(
      SpecValidationError,
      'On "' + spec.getClassName() + '" @Cleanup function "nonExistCleanup" does not exist'
    );
  });
});
