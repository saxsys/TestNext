import {Given, Spec, Subject, Then, When} from "../../testDecorators/test-decorators";
import {Assert} from "../../assert/assert";

@Spec('Second Test')
@Subject('TestingTest')
@Subject('other TestingTest')
class SecondTest{
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
