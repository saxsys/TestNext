///<reference path="../../SpecDeclaration/testDecorators/test-decorators.ts"/>
import {
  Given, Providers, SUT, Then, Spec, When, ThenThrow,
  Subject
} from '../../SpecDeclaration/testDecorators/test-decorators';
import {Assert} from "../../SpecDeclaration/assert/assert";
import {SpecWithSUT} from "../../SpecDeclaration/spec/spec";

import {Engine} from "../injectionTestfied/engine";
import {Car} from "../injectionTestfied/car";

@Subject('Car Drives')
@SUT(Car)
@Providers([Engine, Car])
class CarDrives extends SpecWithSUT{
  fuel = 10;
  usage = 10;

  @Given('I have ' + this.fuel+ 'l of fuel',0) fuel10l() {
    this.SUT.setFuel(this.fuel);
  }

  @Given('I use '+ this.usage +'l per 100km',1) fuelUsage10l() {
    this.SUT.setFuelUsage(this.usage);
  }

  fuelUsageFor(km:number):number{
    return (this.usage/100)*km;
  }
}

@Subject('Car Drives')
@Spec('Car Drives with enough Fuel')
class CarDrives_Valid extends CarDrives{
  @When('I drive 10km') drive10km() {
    this.SUT.drive(10);
  }

  @Then('remaining fuel is 9') remainingFuelIs9(){
    Assert.that(this.SUT.fuel, 'fuel shown by car').equals(9, 'calculated remaining fuel');
  }
}

@Subject('Car Drives')
@Spec('Car Drives with enough Fuel, my miscalc')
class CarDrives_Valid_wrongAssertion extends CarDrives{
  @When('I drive 10km') drive10km() {
    this.SUT.drive(10);
  }

  @Then('remaining fuel is 9') remainingFuelIs9(){
    Assert.that(this.SUT.fuel, 'fuel shown by car').equals(3, 'calculated remaining fuel');
  }
}


@Subject('Car Drives')
@Spec('Car Drives with not Enough Fuel')
class CarDrives_ExpectedError extends CarDrives{
  @When('I drive 200km') drive200km() {
    this.SUT.drive(200);
  }

  @ThenThrow('Not Enough fuel') notEnoughFuel(){
    throw new Error(
      'you cannot drive that far, it would take ' + this.fuelUsageFor(200) + 'Liter, you have only ' + this.SUT.fuel + 'Liter remaining');
  }
}

@Subject('Car Drives')
@Spec('Car Drives without License')
class CarDrives_ExpectOtherError extends CarDrives{
  @When('I drive 200km') drive200km() {
    this.SUT.drive(200);
  }

  @ThenThrow('No License') noLicense(){
    throw new Error('you do not have a License');
  }
}

@Subject('Car Drives')
@Spec('Car Drives with invalid Spec')
class CarDrives_InvalidSpec extends CarDrives{
  @When('I drive 200km') drive200km() {
    this.SUT.drive(200);
  }


  @ThenThrow('Not Enough fuel') notEnoughFuel(){
    throw new Error(
      'you cannot drive that far, it would take ' + this.fuelUsageFor(200) + 'Liter, you have only ' + this.SUT.fuel + 'Liter remaining');
  }

  @Then('this must be invalid') thisIsInvalid(){}
}

