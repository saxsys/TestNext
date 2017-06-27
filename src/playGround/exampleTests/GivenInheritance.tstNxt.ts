import {Given, Spec, Subject, Then, When} from "../../SpecDeclaration/specDecorators/spec-decorators";
import {Assert} from "../../SpecDeclaration/assert/assert";

class ParentSpecClass{
  protected valueToInherit = 0;
  @Given('valueToInherit gets set',0) setValue(){
    this.valueToInherit = 1;
  }

}

@Subject('Inheritance')
@Spec('Given-Inheritance')
class ChildSpecClass extends ParentSpecClass{
  @Given('doung nothing') doNothing(){}
  //@Given('valueToInherit gets set', 1) setValue(){}
  @When('I extend a Parent Class') extendClass(){

  }
  @Then('Given of parent should have been exectuted') givenShouldBeExecuted(){
    Assert.that(this.valueToInherit).equals(1);
  }
}

class otherParentSpecClass {}
