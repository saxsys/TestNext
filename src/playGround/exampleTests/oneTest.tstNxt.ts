import {Given, Spec, Then, When} from "../../testRunner/testCaseRegistry/testDecorators/test-decorators";

@Spec('a Spec of one Test') class OneTest{
  @Given('some Stuff is given') someGivenStuff(){}
  @When('When something is triggered') triggerStudd(){}
  @Then('Something should have happened') checkHappened(){}
}
