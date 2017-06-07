import {Given, Spec, Then, When} from "../../testDecorators/test-decorators";
import {AssertionError} from "../../assert/assertion-Error";
import {AssertProportion} from "../../assert/assert-proportion";
import {Assert} from "../../assert/assert";

@Spec('a Spec of one Test') class OneTest{
  @Given('some Stuff is given',0) someGivenStuff(){}
  @Given('it is this Way around',1) moreSetStuff(){}
  @When('something is triggered') triggerStuff(){}
  @Then('something should have happened', 0) checkHappened(){}
  @Then('influenced this', 1) checkOtherHappened(){
    //throw new AssertionError(1, 2, AssertProportion.EQUAL, 'a Number', 'other Number');
    Assert.that(1, 'a number').equals(2, 'anotherNumber');
  }
}


@Spec('Second Test') class SecondTest{
  count:number;
  increment:number;

  @Given('a count is 0',0) countIs0(){
    this.count = 0;
  }
  @Given('increment is 3',1) incrementIs3(){
    this.increment = 3;
  }
  @When('increment is added to cound') addIncrToCount(){
    this.count += this.increment;
  }
  @Then('world should be saved', 1) worldBeSaved(){
    Assert.that('world').equals('saved');
  }
  @Then('count should be 3', 0) countShouldBe3(){
    Assert.that(this.count, 'count').equals(3);
  }
}

@Spec('Incorrect Test') class IncorrectTest{
  count:number;

  @When('no Given') thereisNoGiven(){
    this.count = 3;
  }
  @Then('there should be an errpr') shouldError(){

  }
}
