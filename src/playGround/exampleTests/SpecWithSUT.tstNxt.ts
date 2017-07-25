import {SpecWithSUT} from "../../../testNext/SpecDeclaration/specTypes/spec-with-sut";
import {Given, Providers, Spec, SUT, Then, When} from "../../../testNext/SpecDeclaration/specDecorators/spec-decorators";
import {Assert} from "../../../testNext/SpecDeclaration/assert/assert";
import {Car, PassengerCar, Taxi} from "../injectionTestfied/car";
import {Engine} from "../injectionTestfied/engine";


@Spec('Car Drives with Enough Fuel')
@SUT(Car)
@Providers([Engine, Car, Taxi, PassengerCar])
class CarDrivesEnoughFuel extends SpecWithSUT{

  @Given('I have 50l of fuel',0) fuel50l() {
    this.SUT.setFuel(50)
  }

  @Given('I use 8l per 100km',1) fuelUsage8l() {
    this.SUT.setFuelUsage(8);
  }

  @When('I drive 50km') drive50km() {
    this.SUT.drive(50);
  }

  @Then('the car should have 46fuel') shouldHave46lLeft() {
    Assert.that(this.SUT.fuel).equals(46);
  }
}
