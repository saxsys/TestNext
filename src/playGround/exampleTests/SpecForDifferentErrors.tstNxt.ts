import {Cleanup, Given, Spec, Subject, Then, When} from "../../SpecDeclaration/specDecorators/spec-decorators";


@Subject('Specs with Different Errors')
@Spec('Spec with Error thrown in When')
class SpecWithErrorThrowingWhen{

  private execOrder = [];

  @Given('given is executed')
  given1(){
    this.execOrder.push('given1');
  }

  @When('an unexpected Error is thrown in the When')
  unexpErrorIsThrown() {
    this.execOrder.push('unexpErrorThrown');
      throw new Error('just to throw an unexpected Error');
  }

  @Then('this "then" is not executed')
  then1(){
    this.execOrder.push('then1');
  }

  @Then('so is this')
  then2(){
    this.execOrder.push('then2');
  }

  @Cleanup('this mess')
  cleanup1(){
    this.execOrder.push('cleanup1');
  }
}

@Subject('Specs with Different Errors')
@Spec('Spec with Error thrown in first Then')
class SpecWithErrorThrownInFirstThen{

  private execOrder = [];

  @Given('"given" is executed')
  given1(){
    this.execOrder.push('given1');
  }

  @When('"when" is executed')
  when() {
    this.execOrder.push('when');
  }

  @Then('this "then" throws an error',1)
  then1(){
    this.execOrder.push('then1');
    throw new Error('error that should be thrown in first Then')
  }

  @Then('this "then" should still be executed',2)
  then2(){
    this.execOrder.push('then2');
  }

  @Cleanup('this mess')
  cleanup1(){
    this.execOrder.push('cleanup1');
  }
}
