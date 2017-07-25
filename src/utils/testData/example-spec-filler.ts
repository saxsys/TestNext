import {SpecContainer} from "../../SpecStorage/specContainer/specContainer";
import {Assert} from "../../SpecDeclaration/assert/assert";
import {SpecWithSUT} from "../../SpecDeclaration/specTypes/spec-with-sut";
import {Injectable} from "@angular/core";

export class ExampleSpecFiller {

  static getStandardSpec():SpecContainer{
    class StandardSpec {
      private dirtybit = 0;
      //@Given('some Stuff is given',0)
      someGivenStuff() {
        this.dirtybit = 1;
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

      //@Cleanup()
      cleaning(){
        this.dirtybit = 0;
      }
    }

    let specClassConstructor = StandardSpec.prototype.constructor;

    let spec = new SpecContainer(specClassConstructor);

    spec.setDescription('a Spec of one Test');
    spec.addSubject('Standard Tests');

    spec.addGiven('someGivenStuff', 'some Stuff is given', 0);
    spec.addGiven('moreSetStuff', 'it is this Way around', 1);
    spec.addWhen('triggerStuff', 'something is triggered');
    spec.addThen('checkHappened', 'something should have happened', 0);
    spec.addThen('checkOtherHappened', 'influenced this', 1);
    spec.addCleanup('cleaning');

    return spec;
  }

  static getErrorThrowingExpectingSpec():SpecContainer{
    class ErrorThrowingExpectingSpec {
      public error = new Error('error');
      //@Given('some Stuff is given',0)
      someGivenStuff() {
      }

      //@Given('it is this Way around',1)
      moreSetStuff() {
      }

      //@When('something is triggered')
      triggerStuff() {
        throw this.error;
      }


      //@ThenThrow('throws')
      thenThrowIt() {
        throw this.error;
      }
    }

    let specClassConstructor = ErrorThrowingExpectingSpec.prototype.constructor;

    let spec = new SpecContainer(specClassConstructor);

    spec.setDescription('a Spec of one Test');
    spec.addSubject('Error Throwing Tests');

    spec.addGiven('someGivenStuff', 'some Stuff is given', 0);
    spec.addGiven('moreSetStuff', 'it is this Way around', 1);
    spec.addWhen('triggerStuff', 'something is triggered');
    spec.addThenThrow('thenThrowIt', 'throws');

    return spec;
  }

  static getInheritedSpec():SpecContainer{
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

    let parentClassConstructor = Inherit_ParentSpecClass.prototype.constructor;
    let childClassConstructor = Inherit_ChildClass.prototype.constructor;

    let parentSpec = new SpecContainer(parentClassConstructor);
    parentSpec.addGiven('given_SetInheritValue', 'valueToInherit gets set', 0);
    let childSpec = new SpecContainer(childClassConstructor,parentSpec);

    childSpec.addGiven('doNothing', 'doing nothing', 0);
    childSpec.addGiven('setValue', 'valueToInherit gets set');
    childSpec.addWhen('extendClass', 'I extend a Parent Class');
    childSpec.addThen('givenShouldBeExecuted', 'Given of parent should have been executed');

    return childSpec;
  }

  static getIgnoredSpec():SpecContainer{
    //@Ignore('because I need a Ignored test and it is not complete')
    //@Spec('Ignored Spec')
    class Ignoring_ignoredSpec {
    }

    let ignoredConstructor = Ignoring_ignoredSpec.prototype.constructor;

    let spec = new SpecContainer(ignoredConstructor);
    spec.setDescription('Ignored Spec');
    spec.setIgnored('because I need a Ignored test and it is not complete');

    return spec;
  }

  static getSpecWithSubjects():SpecContainer{
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

    let spec = new SpecContainer(specClassConstructor );
    spec.setDescription('Spec With Subjects');
    spec.addSubject('Subject1');
    spec.addSubject('Subject2');

    spec.addGiven('countIs0', 'a count is 0', 0);
    spec.addGiven('incrementIs3', 'increment is 3', 1);
    spec.addWhen('addIncrToCount', 'increment is added to cound');
    spec.addThen('worldBeSaved', 'world should be saved', 1);
    spec.addThen('countShouldBe3', 'count should be 3', 0);

    return spec;
  }

  static getNonExecutableSpec():SpecContainer{
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
    let spec = new SpecContainer(specClassConstructor);

    spec.addGiven('haveSth', 'I have something');
    spec.addWhen('nothingIs', 'i do nothing');
    spec.addThen('happensNothing', 'nothing should happen');

    return spec;
  }

  static getSpecWithoutGiven():SpecContainer{
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

    let spec = new SpecContainer(specClassConstructor);
    spec.setDescription('Spec with Missing Given');

    spec.addSubject('Doomed to be incorrect');

    spec.addWhen('thereIsNoGiven', 'no Given');
    spec.addThen('shouldError', 'there should be an error');

    return spec;
  }

  static getSpecWithoutWhen():SpecContainer{
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

    let spec = new SpecContainer(specClassConstructor);
    spec.setDescription('Spec with Missing When');

    spec.addSubject('Doomed to be incorrect');

    spec.addGiven('noWhen', 'there is no When');
    spec.addThen('shouldError', 'there should be an error');

    return spec;
  }

  static getSpecWithoutThen():SpecContainer{
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

    let spec = new SpecContainer(specClassConstructor);
    spec.setDescription('Spec with Missing Then');

    spec.addSubject('Doomed to be incorrect');

    spec.addGiven('noThen', 'there is no Then');
    spec.addWhen('itIsCalledNevertheless', 'it is called Nevertheless');

    return spec;
  }

  static getSpecWithoutCleanup():SpecContainer{
    class SpecWithoutCleanup {
      private dirtybit = 0;
      //@Given('some Stuff is given',0)
      someGivenStuff() {
        this.dirtybit = 1;
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

    let specClassConstructor = SpecWithoutCleanup.prototype.constructor;

    let spec = new SpecContainer(specClassConstructor);

    spec.setDescription('a Spec of one Test');
    spec.addSubject('Standard Tests');

    spec.addGiven('someGivenStuff', 'some Stuff is given', 0);
    spec.addGiven('moreSetStuff', 'it is this Way around', 1);
    spec.addWhen('triggerStuff', 'something is triggered');
    spec.addThen('checkHappened', 'something should have happened', 0);
    spec.addThen('checkOtherHappened', 'influenced this', 1);

    return spec;
  }

  static getSpecWithoutSubject():SpecContainer{
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

    let spec = new SpecContainer(specClassConstructor);
    spec.setDescription('Spec without Subject');

    spec.addGiven('countIs0', 'a count is 0', 0);
    spec.addGiven('incrementIs3', 'increment is 3', 1);
    spec.addWhen('addIncrToCount', 'increment is added to cound');
    spec.addThen('worldBeSaved', 'world should be saved', 1);
    spec.addThen('countShouldBe3', 'count should be 3', 0);

    return spec;
  }

  static getSpecNameDoubleToStandardSpec():SpecContainer{
    class StandardSpec {
      //@Given('some Stuff is given',0)
      someGiven() {
      }

      //@Given('it is this Way around',1)
      moreSet() {
      }

      //@When('something is triggered')
      trigger() {
      }

      //@Then('something should have happened', 0)
      checkHappen() {
      }

      //@Then('influenced this', 1)
      checkOtherHappen() {
        Assert.that(1, 'a number').equals(1, 'otherNumber');
      }
    }

    let specClassConstructor = StandardSpec.prototype.constructor;

    let spec = new SpecContainer(specClassConstructor);

    spec.setDescription('a Spec of one Test');
    spec.addSubject('Standard Tests');

    spec.addGiven('someGiven', 'some Stuff is given', 0);
    spec.addGiven('moreSet', 'it is this Way around', 1);
    spec.addWhen('trigger', 'something is triggered');
    spec.addThen('checkHappen', 'something should have happened', 0);
    spec.addThen('checkOtherHappen', 'influenced this', 1);

    return spec;
  }

  static getSpecWitFailingWhen(){
    class SpecWithFailingThen {
      private dirtybit = 0;
      //@Given('some Stuff is given',0)
      someGivenStuff() {
        this.dirtybit = 1;
      }

      //@Given('it is this Way around',1)
      moreSetStuff() {
      }

      //@When('something is triggered')
      triggerStuff() {
      }

      //@Then('it should fail', 0)
      failingThen() {
        throw new Error('something fails');
      }

      //@Then('influenced this', 1)
      checkOtherHappened() {
      }

      //@Cleanup()
      cleaning(){
        this.dirtybit = 0;
      }
    }

    let specClassConstructor = SpecWithFailingThen.prototype.constructor;

    let spec = new SpecContainer(specClassConstructor);

    spec.setDescription('a Spec with one then failing');
    spec.addSubject('Failing Tests');

    spec.addGiven('someGivenStuff', 'some Stuff is given', 0);
    spec.addGiven('moreSetStuff', 'it is this Way around', 1);
    spec.addWhen('triggerStuff', 'something is triggered');
    spec.addThen('failingThen', 'it should fail', 0);
    spec.addThen('checkOtherHappened', 'influenced this', 1);
    spec.addCleanup('cleaning');

    return spec;
  }

  static getSpecWithFailingWhen(){
    class SpecWithFailingWhen {
      private dirtybit = 0;
      public runned = [];
      //@Given('some Stuff is given')
      given1() {
        this.dirtybit = 1;
        this.runned.push('given1');
      }

      //@Given('it is this Way around')
      given2() {
        this.runned.push('given2');
      }

      //@When('something is triggered')
      when1() {
        this.runned.push('when1');
        throw new Error('this When should fail');
      }

      //@Then('influenced this')
      then1() {
        this.runned.push('then1');
      }

      //@Cleanup()
      cleanup1(){
        this.dirtybit = 0;
        this.runned.push('cleanup1')
      }
    }

    let specClassConstructor = SpecWithFailingWhen.prototype.constructor;

    let spec = new SpecContainer(specClassConstructor);

    spec.setDescription('a Spec with failing when');
    spec.addSubject('Failing Tests');

    spec.addGiven('given1', 'some Stuff is given');
    spec.addGiven('given2', 'it is this Way around');
    spec.addWhen('when1', 'the when fails');
    spec.addThen('then1', 'influenced this', 1);
    spec.addCleanup('cleanup1');

    return spec;
  }

  static getSpecWithSUT(){

    @Injectable()
    class Asut{
      private dirtybit = 0;
    }

    class ASpecWithSUT extends SpecWithSUT{

      public runned = [];
      //@Given('some Stuff is given')
      given1() {
        this.SUT.dirtrybit = 1;
        this.runned.push('given1');
      }

      //@Given('it is this Way around')
      given2() {
        this.runned.push('given2');
      }

      //@When('something is triggered')
      when1() {
        this.runned.push('when1');
      }

      //@Then('influenced this')
      then1() {
        this.runned.push('then1');
      }

      //@Cleanup()
      cleanup1(){
        this.runned.push('cleanup1')
      }
    }

    let specClassConstructor = ASpecWithSUT.prototype.constructor;

    let spec = new SpecContainer(specClassConstructor);

    spec.setDescription('a Spec with SUT');
    spec.addSubject('Specs With SUT');
    spec.setSUT(Asut);

    spec.addGiven('given1', 'some Stuff is given');
    spec.addGiven('given2', 'it is this Way around');
    spec.addWhen('when1', 'the when is alright');
    spec.addThen('then1', 'influenced this', 1);
    spec.addCleanup('cleanup1');

    return spec;
  }

  static getSpecWithFailingSUT(){
    @Injectable()
    class Asut{
      private dirtybit = 0;
      private dep;
      constructor(dep:DependencyOfSUT){
        this.dep = dep;
      }
    }

    @Injectable()
    class DependencyOfSUT{

    }

    class ASpecWithSUT extends SpecWithSUT{

      public runned = [];
      //@Given('some Stuff is given')
      given1() {
        this.SUT.dirtrybit = 1;
        this.runned.push('given1');
      }

      //@Given('it is this Way around')
      given2() {
        this.runned.push('given2');
      }

      //@When('something is triggered')
      when1() {
        this.runned.push('when1');
      }

      //@Then('influenced this')
      then1() {
        this.runned.push('then1');
      }

      //@Cleanup()
      cleanup1(){
        this.runned.push('cleanup1')
      }
    }

    let specClassConstructor = ASpecWithSUT.prototype.constructor;

    let spec = new SpecContainer(specClassConstructor);

    spec.setDescription('a Spec with failing SUT');
    spec.addSubject('Specs With SUT');
    spec.setSUT(Asut);

    spec.addGiven('given1', 'some Stuff is given');
    spec.addGiven('given2', 'it is this Way around');
    spec.addWhen('when1', 'the when is alright');
    spec.addThen('then1', 'influenced this', 1);
    spec.addCleanup('cleanup1');

    return spec;
  }
}
