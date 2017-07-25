import {Given, Spec, Subject, Then, When} from "../../../testNext/SpecDeclaration/specDecorators/spec-decorators";

@Spec('a Spec of one Test')
@Subject('TestingTest')
class OneTest{
  @Given('some Stuff is given') someGivenStuff(){}
  @Given('it is this Way around') moreSetStuff(){}
  @When('something is triggered') triggerStuff(){}
  @Then('something should have happened', 0) checkHappened(){}
  @Then('influenced this', 1) checkOtherHappened(){
    //throw new AssertionError(1, 2, AssertProportion.EQUAL, 'a Number', 'other Number');
  }
}


@Spec('Incorrect Test')
@Subject('Doomed to be incorrect')
class IncorrectTest{
  count:number;

  @When('no Given') thereisNoGiven(){
    this.count = 3;
  }
  @Then('there should be an err0r') shouldError(){

  }
}
