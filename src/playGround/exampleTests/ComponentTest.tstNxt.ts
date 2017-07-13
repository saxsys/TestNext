import {SpecWithSUT} from "../../SpecDeclaration/specTypes/spec-with-sut";
import {Given, Spec, SUT, Then, When} from "../../SpecDeclaration/specDecorators/spec-decorators";
import {AppComponent} from '../../app/app.component';
import {Assert} from "../../SpecDeclaration/assert/assert";

@Spec('Testing to set up da Test for a Component')
@SUT(AppComponent)
class TestingAComponent extends SpecWithSUT{
  @Given('nothing')givenNothing(){}
  @When('nothing')whenNothing(){}
  @Then('SUT of Component should have inited')sutComponentInit(){
    Assert.that(this.SUT, 'SUT').not.isNull();
  }
  @Then('Titel should be set')titleSet(){
    Assert.that(this.SUT.title, 'App (SUT) title').equals('app works!##########', 'actually a wrong title');
  }
}
