import {SpecRegistry} from "../../SpecStorage/specRegistry/spec-registry";
import {SpecContainer} from "../../SpecStorage/specContainer/specContainer";
import {Assert} from "../../SpecDeclaration/assert/assert";
import {Injectable} from "@angular/core";

/**
 * Generator of test data on SpecRegistry
 */
export class ExampleRegistryFiller {
  static  addStandardSpecTo(specRegistry: SpecRegistry): SpecContainer {
    //@Spec('a Spec of one Test')
    //@Subject('Standard Tests')
    class StandardSpec {
      //@Given('some Stuff is given',0)
      someGivenStuff() {
      }

      //@Given('it is this Way around',1)
      moreSetStuff() {
      }

      //@When('something is triggered')
      triggerStuff() {
      }

      //@Then('something should have happened', 0)
      checkHappened() {
      }

      //@Then('influenced this', 1)
      checkOtherHappened() {
        Assert.that(1, 'a number').equals(1, 'otherNumber');
      }
    }

    let specClassConstructor = StandardSpec.prototype.constructor;

    specRegistry.registerSpec(specClassConstructor, 'a Spec of one Test');
    specRegistry.registerSpecForSubject(specClassConstructor, 'Standard Tests');

    specRegistry.registerGivenForSpec(specClassConstructor, 'someGivenStuff', 'some Stuff is given', 0);
    specRegistry.registerGivenForSpec(specClassConstructor, 'moreSetStuff', 'it is this Way around', 1);
    specRegistry.registerWhenForSpec(specClassConstructor, 'triggerStuff', 'something is triggered');
    specRegistry.registerThenForSpec(specClassConstructor, 'checkHappened', 'something should have happened', 0);
    specRegistry.registerThenForSpec(specClassConstructor, 'checkOtherHappened', 'influenced this', 1);

    return specRegistry.getSpecContainerByClassName('StandardSpec');

  }

  static  addInheritedSpecTo(specRegistry: SpecRegistry): SpecContainer {
    class Inherit_ParentSpecClass {
      protected valueToInherit = 0;
      //@Given('valueToInherit gets set',0)
      given_SetInheritValue() {
        this.valueToInherit = 1;
      }

    }

    //@Spec('Given-Inheritance')
    class Inherit_ChildClass extends Inherit_ParentSpecClass {
      //@Given('doing nothing')
      doNothing() {
      }

      //@Given('valueToInherit gets set', 1)
      setValue() {
      }

      //@When('I extend a Parent Class')
      extendClass() {
      }

      //@Then('Given of parent should have been executed')
      givenShouldBeExecuted() {
        Assert.that(this.valueToInherit).equals(1);
      }
    }

    //register Parent
    let parentClassConstructor = Inherit_ParentSpecClass.prototype.constructor;
    //register only Given, it should have a @Spec, because it is not executable
    specRegistry.registerGivenForSpec(parentClassConstructor, 'given_SetInheritValue', 'valueToInherit gets set', 0);

    //register Child
    let childClassConstructor = Inherit_ChildClass.prototype.constructor;
    specRegistry.registerSpec(childClassConstructor, 'Given-Inheritance');
    specRegistry.registerGivenForSpec(childClassConstructor, 'doNothing', 'doing nothing', 0);
    specRegistry.registerGivenForSpec(childClassConstructor, 'setValue', 'valueToInherit gets set', 1);
    specRegistry.registerWhenForSpec(childClassConstructor, 'extendClass', 'I extend a Parent Class');
    specRegistry.registerThenForSpec(childClassConstructor, 'givenShouldBeExecuted', 'Given of parent should have been executed');


    return specRegistry.getSpecContainerByClassName('Inherit_ChildClass');
  }

  static  addIgnoredSpecTo(specRegistry: SpecRegistry): SpecContainer {
    //@Ignore('because I need a Ignored test and it is not complete')
    //@Spec('Ignored Spec')
    class Ignoring_ignoredSpec {
    }

    let ignoredConstructor = Ignoring_ignoredSpec.prototype.constructor;

    specRegistry.registerSpec(ignoredConstructor, 'Ignored Spec');
    specRegistry.registerSpecAsIgnored(ignoredConstructor, 'because I need a Ignored test and it is not complete');

    return specRegistry.getSpecContainerByClassName('Ignoring_ignoredSpec');
  }

  static  addSpecWithSubjectsTo(specRegistry: SpecRegistry): SpecContainer {
    //@Spec('Spec With Subjects')
    //@Subject('Subject1')
    //@Subject('Subject2')
    class SpecWithSubjects {
      count: number;
      increment: number;

      //@Given('a count is 0', 0)
      countIs0() {
        this.count = 0;
      }

      //@Given('increment is 3',1)
      incrementIs3() {
        this.increment = 3;
      }

      //@When('increment is added to cound')
      addIncrToCount() {
        this.count += this.increment;
      }

      //@Then('world should be saved', 1)
      worldBeSaved() {
        Assert.that('world').equals('saved');
      }

      //@Then('count should be 3', 0)
      countShouldBe3() {
        Assert.that(this.count, 'count').equals(3);
      }

    }

    let specClassConstructor = SpecWithSubjects.prototype.constructor;

    specRegistry.registerSpec(specClassConstructor, 'Spec With Subjects');
    specRegistry.registerSpecForSubject(specClassConstructor, 'Subject1');
    specRegistry.registerSpecForSubject(specClassConstructor, 'Subject2');

    specRegistry.registerGivenForSpec(specClassConstructor, 'countIs0', 'a count is 0', 0);
    specRegistry.registerGivenForSpec(specClassConstructor, 'incrementIs3', 'increment is 3', 1);
    specRegistry.registerWhenForSpec(specClassConstructor, 'addIncrToCount', 'increment is added to cound');
    specRegistry.registerThenForSpec(specClassConstructor, 'worldBeSaved', 'world should be saved', 1);
    specRegistry.registerThenForSpec(specClassConstructor, 'countShouldBe3', 'count should be 3', 0);

    return specRegistry.getSpecContainerByClassName('SpecWithSubjects');
  }

  static  addNonExecutableSpecTo(specRegistry: SpecRegistry): SpecContainer {
    class SpecWithoutSpec {
      //@Given('I have something')
      haveSth() {
      }

      //@When('i do nothing')
      nothingIs() {
      }

      //@Then('nothing should happen')
      happensNothing() {
      }
    }
    let specClassConstructor = SpecWithoutSpec.prototype.constructor;

    specRegistry.registerGivenForSpec(specClassConstructor, 'haveSth', 'I have something');
    specRegistry.registerWhenForSpec(specClassConstructor, 'nothingIs', 'i do nothing');
    specRegistry.registerThenForSpec(specClassConstructor, 'happensNothing', 'nothing should happen');

    return specRegistry.getSpecContainerByClassName('SpecWithoutSpec');
  }

  static  addSpecWithoutGivenTo(specRegistry: SpecRegistry): SpecContainer {
    //@Spec('Spec with Missing Given')
    //@Subject('Doomed to be incorrect')
    class SpecMissingGiven {
      count: number;

      //@When('no Given')
      thereIsNoGiven() {
        this.count = 3;
      }

      //@Then('there should be an error')
      shouldError() {

      }
    }

    let specClassConstructor = SpecMissingGiven.prototype.constructor;

    specRegistry.registerSpec(specClassConstructor, 'Spec with Missing Given');
    specRegistry.registerSpecForSubject(specClassConstructor, 'Doomed to be incorrect');

    specRegistry.registerWhenForSpec(specClassConstructor, 'thereIsNoGiven', 'no Given');
    specRegistry.registerThenForSpec(specClassConstructor, 'shouldError', 'there should be an error');

    return specRegistry.getSpecContainerByClassName('SpecMissingGiven');
  }

  static  addSpecWithoutWhenTo(specRegistry: SpecRegistry): SpecContainer {
    //@Spec('Spec with Missing When')
    //@Subject('Doomed to be incorrect')
    class SpecMissingWhen {
      count: number;

      //@Given('there is no When')
      noWhen() {
        this.count = 3;
      }

      //@Then('there should be an error')
      shouldError() {

      }
    }

    let specClassConstructor = SpecMissingWhen.prototype.constructor;

    specRegistry.registerSpec(specClassConstructor, 'Spec with Missing When');
    specRegistry.registerSpecForSubject(specClassConstructor, 'Doomed to be incorrect');

    specRegistry.registerGivenForSpec(specClassConstructor, 'noWhen', 'there is no When');
    specRegistry.registerThenForSpec(specClassConstructor, 'shouldError', 'there should be an error');

    return specRegistry.getSpecContainerByClassName('SpecMissingWhen');
  }

  static  addSpecWithoutThenTo(specRegistry: SpecRegistry): SpecContainer {
    //@Spec('Spec with Missing Then')
    //@Subject('Doomed to be incorrect')
    class SpecMissingThen {
      count: number;

      //@Given('there is no Then')
      noThen() {
        this.count = 3;
      }

      //@When('it is called Nevertheless')
      itIsCalledNevertheless() {

      }
    }

    let specClassConstructor = SpecMissingThen.prototype.constructor;

    specRegistry.registerSpec(specClassConstructor, 'Spec with Missing Then');
    specRegistry.registerSpecForSubject(specClassConstructor, 'Doomed to be incorrect');

    specRegistry.registerGivenForSpec(specClassConstructor, 'noThen', 'there is no Then');
    specRegistry.registerWhenForSpec(specClassConstructor, 'itIsCalledNevertheless', 'it is called Nevertheless');

    return specRegistry.getSpecContainerByClassName('SpecMissingThen');
  }

  static  addSpecWithoutSubjectTo(specRegistry: SpecRegistry): SpecContainer {
    //@Spec('Spec without Subject')
    class SpecWithoutSubjects {
      count: number;
      increment: number;

      //@Given('a count is 0', 0)
      countIs0() {
        this.count = 0;
      }

      //@Given('increment is 3',1)
      incrementIs3() {
        this.increment = 3;
      }

      //@When('increment is added to cound')
      addIncrToCount() {
        this.count += this.increment;
      }

      //@Then('world should be saved', 1)
      worldBeSaved() {
        Assert.that('world').equals('saved');
      }

      //@Then('count should be 3', 0)
      countShouldBe3() {
        Assert.that(this.count, 'count').equals(3);
      }

    }

    let specClassConstructor = SpecWithoutSubjects.prototype.constructor;

    specRegistry.registerSpec(specClassConstructor, 'Spec without Subject');

    specRegistry.registerGivenForSpec(specClassConstructor, 'countIs0', 'a count is 0', 0);
    specRegistry.registerGivenForSpec(specClassConstructor, 'incrementIs3', 'increment is 3', 1);
    specRegistry.registerWhenForSpec(specClassConstructor, 'addIncrToCount', 'increment is added to cound');
    specRegistry.registerThenForSpec(specClassConstructor, 'worldBeSaved', 'world should be saved', 1);
    specRegistry.registerThenForSpec(specClassConstructor, 'countShouldBe3', 'count should be 3', 0);

    return specRegistry.getSpecContainerByClassName('SpecWithoutSubjects');
  }

  static addSpecWithGenerateTo(specRegistry: SpecRegistry):SpecContainer{
    @Injectable()
    class Dependency {
      public mock = false;
      public doneSth = false;
    }

    @Injectable()
    class AClass {
      public something = 'sth';
      public dep;

      constructor(dep: Dependency) {
        this.dep = dep;
      }

      public doSomethingOnDependency(){
        this.dep.doneSth = true;
      }
    }

    let mockDependency = {
      mock:true,
      doneSth:false
    };


    class SpecWithGenerate {

      public property: AClass;

      public executed = [];

      aGiven(){
        this.executed.push('aGiven')}
      aWhen(){
        this.executed.push('aWhen');
        this.property.doSomethingOnDependency();
      }
      aThen(){
        this.executed.push('aThen');
        Assert.that(this.property.dep.doneSth).equals(true);
      }
      thenUsedMock(){
        Assert.that(this.property.dep.mock).equals(true);
      }
      thenUsedReal(){
        Assert.that(this.property.dep.mock).equals(false);
      }

    }

    let specConstructor = SpecWithGenerate.prototype.constructor;
    let depProviders = [
      {provide:Dependency, mockObject:mockDependency}
    ];

    let container = specRegistry.registerSpec(specConstructor, 'A Spec with a Generate');
    specRegistry.registerGenerate(specConstructor, 'property', AClass, depProviders);
    specRegistry.registerGivenForSpec(specConstructor, 'aGiven', 'A Given');
    specRegistry.registerWhenForSpec(specConstructor, 'aWhen', 'Something is done on a Generated Value');
    specRegistry.registerThenForSpec(specConstructor, 'aThen', 'it really should have been set');
    specRegistry.registerThenForSpec(specConstructor, 'thenUsedMock', 'did not use Mock');
    specRegistry.registerThenForSpec(specConstructor, 'thenUsedReal', 'did use Mock instead of Real');

    return container;
  }

}
