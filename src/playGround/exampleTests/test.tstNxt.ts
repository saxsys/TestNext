import {Given, Spec, Subject, Then, When} from "../../../testNext/SpecDeclaration/specDecorators/spec-decorators";
import {Assert} from "../../../testNext/SpecDeclaration/assert/assert";

@Spec('Procondition failing')
@Subject('Testtest')
class PreconditionFailing_Test{

  public a;
  public b;
  public c;
  @Given('a precond') precond1(){
    this.a=1;
    this.b=2;
  }
  @Given('an Error') precondWithError(){
    throw new Error('just an Error');
  }

  @When('done')done(){
    this.c = this.a + this.b;
  }
  @Then('lets see')letsSee(){
    Assert.that(this.c, 'vala').equals(3);
  }
}
