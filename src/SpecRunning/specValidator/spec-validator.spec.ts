import {Given, Spec, Then, ThenThrow, When} from "SpecDeclaration/specDecorators/spec-decorators";
import {SpecValidator} from "./spec-validator";
import {specRegistry} from "../../SpecStorage/specRegistry/spec-registry-storage";
import {SpecValidationError} from "./spec-validation-error";

describe('SpecValidator.vaidate', () => {
  it('should accept proper Specs', () => {

    let specClassName = 'SpecValidator_validate_correct';
    @Spec('a valid Test')
    class SpecValidator_validate_correct {
      public runOrder = [];

      @Given('given 0', 0)given0() {
        this.runOrder.push('given0');
      }

      @Given('given 1', 1)given1() {
        this.runOrder.push('given1');
      }

      @When('the When') theWhen() {
        this.runOrder.push('theWhen');
      }

      @Then('then 0', 0) then0() {
        this.runOrder.push('then0');
      }

      @Then('then1', 1) then1() {
        this.runOrder.push('then1');
      }
    }
    let spec = specRegistry.getSpecByClassName(specClassName);

    expect(() => {
      SpecValidator.validate(spec)
    }).not.toThrow();
  });

  it('should refuse specs without @Given', () => {
    let specClassName = 'SpecValidator_validate_noGiven';
    @Spec('a invalid Test')
    class SpecValidator_validate_noGiven {
      public runOrder = [];

      @When('the When') theWhen() {
        this.runOrder.push('theWhen');
      }

      @Then('then 0', 0) then0() {
        this.runOrder.push('then0');
      }
    }
    let spec = specRegistry.getSpecByClassName(specClassName);

    expect(() => {
      SpecValidator.validate(spec)
    }).toThrowError(SpecValidationError, 'There must be at lease one @Given in ' + specClassName);
  });

  it('should accept Specs with only inherited @Given', () => {
    let specClassName_parent = 'SpecValidator_validate_inheritGiven_parent';
    let specClassName_child = 'SpecValidator_validate_inheritGiven_child';


    class SpecValidator_validate_inheritGiven_parent {
      private thing = 0;

      @Given('given 0') given0() {
        this.thing = 1;
      }
    }

    @Spec('a invalid Test')
    class SpecValidator_validate_inheritGiven_child extends SpecValidator_validate_inheritGiven_parent {
      public runOrder = [];

      @When('the When') theWhen() {
        this.runOrder.push('theWhen');
      }

      @Then('then 0') then0() {
        this.runOrder.push('then0');
      }

    }

    //let specParent = specRegistry.getSpecByClassName(specClassName_parent);
    let specChild = specRegistry.getSpecByClassName(specClassName_child);

    expect(() => {SpecValidator.validate(specChild);}).not.toThrow();
  });

  it('should refuse Specs, when the @Given function does not exist on the Object', () => {
    let specClassName = 'SpecValidator_validate_givenNotOnObject';

    @Spec('a invalid Test')
    class SpecValidator_validate_givenNotOnObject {
      public runOrder = [];
      @Given('aGiven', 0) aGiven(){}
      @When('the When') theWhen() {
        this.runOrder.push('theWhen');
      }
      @Then('then1') then() {
        this.runOrder.push('then1');
      }
    }
    let spec = specRegistry.getSpecByClassName(specClassName);
    spec.addGiven('nonExistGiven', 'does not exist', 1);

    expect(() => {
      SpecValidator.validate(spec);
    }).toThrowError(
      SpecValidationError,
      'On "' + specClassName + '" @Given function "nonExistGiven" does not exist');
  });


  it('should refuse specs without @When', () => {
    let specClassName = 'SpecValidator_validate_noWhen';
    @Spec('a invalid Test')
    class SpecValidator_validate_noWhen {
      public runOrder = [];

      @Given('given 0', 0)given0() {
        this.runOrder.push('given0');
      }

      @Given('given 1', 1)given1() {
        this.runOrder.push('given1');
      }

      @Then('then 0', 0) then0() {
        this.runOrder.push('then0');
      }

      @Then('then1', 1) then1() {
        this.runOrder.push('then1');
      }
    }
    let spec = specRegistry.getSpecByClassName(specClassName);

    expect(() => {
      SpecValidator.validate(spec);
    }).toThrowError(
      SpecValidationError,
      '@When of "' + specClassName + '" is not set'
    );
  });

  it('should accept Specs with only inherited @When', () => {
    let specClassName_parent = 'SpecValidator_validate_inheritWhen_parent';
    let specClassName_child = 'SpecValidator_validate_inheritWhen_child';


    class SpecValidator_validate_inheritWhen_parent {
      private sth = 0;
      @When('the When') theWhen() {
        this.sth = 1;
      }
    }

    @Spec('a invalid Test')
    class SpecValidator_validate_inheritWhen_child extends SpecValidator_validate_inheritWhen_parent {
      public runOrder = [];

      @Given('given 0') given0() {
        this.runOrder.push('given0');
      }

      @Then('then 0') then0() {
        this.runOrder.push('then0');
      }

    }

    //let specParent = specRegistry.getSpecByClassName(specClassName_parent);
    let specChild = specRegistry.getSpecByClassName(specClassName_child);

    expect(() => {SpecValidator.validate(specChild);}).not.toThrow();
  });

  xit('should refuse Specs with own and inherited @When (multiple)', () => {
    let specClassName_parent = 'SpecValidator_validate_doubleWhen_parent';
    let specClassName_child = 'SpecValidator_validate_doubleWhen_child';


    class SpecValidator_validate_doubleWhen_parent {
      private sth = 0;
      @When('the parent When') theParentWhen() {
        this.sth = 1;
      }
    }

    @Spec('a invalid Test')
    class SpecValidator_validate_doubleWhen_child extends SpecValidator_validate_doubleWhen_parent {
      public runOrder = [];

      @Given('given 0') given0() {
        this.runOrder.push('given0');
      }

      @When('the Child When') theChildWhen() {
        this.runOrder.push('theChildWhen');
      }

      @Then('then 0') then0() {
        this.runOrder.push('then0');
      }

    }
    let spec = specRegistry.getSpecByClassName(specClassName_child);

    expect(() => {
      SpecValidator.validate(spec);
    }).toThrowError(
      SpecValidationError,
      'Spec "' + specClassName_child + '" has multiple @When functions, acquired by inheritance, this is forbidden'
    );
  });

  it('should refuse Specs, when the @When function does not exist on the Object', () => {
    let specClassName = 'SpecValidator_validate_whenNotOnObject';

    @Spec('a invalid Test')
    class SpecValidator_validate_whenNotOnObject {
      public runOrder = [];
      @Given('aGiven',) aGiven(){}
      @Then('then1') then() {
        this.runOrder.push('then1');
      }
    }
    let spec = specRegistry.getSpecByClassName(specClassName);
    spec.addWhen('nonExistWhen', 'does not exist');

    expect(() => {
      SpecValidator.validate(spec);
    }).toThrowError(
      SpecValidationError,
      'On "' + specClassName + '" @When function "nonExistWhen" does not exist'
    );
  });


  it('should refuse specs without @Then or @ThenThrow', () => {
    let specClassName = 'SpecValidator_validate_noThen';
    @Spec('a invalid Test')
    class SpecValidator_validate_noThen {
      public runOrder = [];

      @Given('given 0', 0) given0() {
        this.runOrder.push('given0');
      }
      @When('the When') theWhen() {
        this.runOrder.push('theWhen');
      }
    }
    let spec = specRegistry.getSpecByClassName(specClassName);

    expect(() => {
      SpecValidator.validate(spec)
    }).toThrowError(SpecValidationError, 'There must be at lease one @Then or a @ThenThrow in ' + specClassName);
  });


  it('should accept Specs with only inherited @Then', () => {
    let specClassName_parent = 'SpecValidator_validate_inheritThen_parent';
    let specClassName_child = 'SpecValidator_validate_inheritThen_child';


    class SpecValidator_validate_inheritThen_parent {
      private thing = 0;

      @Then('then 0') then0() {
        this.thing = 1;
      }
    }

    @Spec('a inherited Then')
    class SpecValidator_validate_inheritThen_child extends SpecValidator_validate_inheritThen_parent {
      public runOrder = [];

      @Given('given 0') given0() {
        this.runOrder.push('given0');
      }

      @When('the When') theWhen() {
        this.runOrder.push('theWhen');
      }

    }

    //let specParent = specRegistry.getSpecByClassName(specClassName_parent);
    let specChild = specRegistry.getSpecByClassName(specClassName_child);

    expect(() => {SpecValidator.validate(specChild);}).not.toThrow();
  });

  it('should refuse Specs, when the @Then function does not exist on the Object', () => {
    let specClassName = 'SpecValidator_validate_thenNotOnObject';

    @Spec('a then missing on Obj')
    class SpecValidator_validate_thenNotOnObject {
      public runOrder = [];
      @Given('aGiven') aGiven(){}
      @When('the When') theWhen() {
        this.runOrder.push('theWhen');
      }
      @Then('then1',0) then() {
        this.runOrder.push('then1');
      }
    }
    let spec = specRegistry.getSpecByClassName(specClassName);
    spec.addThen('nonExistThen', 'does not exist', 1);

    expect(() => {
      SpecValidator.validate(spec);
    }).toThrowError(
      SpecValidationError,
      'On "' + specClassName + '" @Then function "nonExistThen" does not exist');
  });

  it('should accept Specs with @ThenThrow', () => {
    let specClassName = 'SpecValidator_validate_validThenThrow';
    @Spec('a invalid Test')
    class SpecValidator_validate_validThenThrow {
      public runOrder = [];

      @Given('given 0', 0) given0() {
        this.runOrder.push('given0');
      }
      @When('the When') theWhen() {
        this.runOrder.push('theWhen');
      }
      @ThenThrow('a Error') aError(){
        throw new Error('aError')
      }
    }
    let spec = specRegistry.getSpecByClassName(specClassName);
    expect(()=>{
      SpecValidator.validate(spec);
    }).not.toThrow();
  });

});
