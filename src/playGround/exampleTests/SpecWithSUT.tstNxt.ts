import {SpecWithSUT} from "../../SpecDeclaration/spec/spec";
import {Given, Providers, Spec, SUT, Then, When} from "../../SpecDeclaration/testDecorators/test-decorators";
import {Assert} from "../../SpecDeclaration/assert/assert";
import {Injectable} from "@angular/core";
import {Car, PassengerCar, Taxi} from "../injectionTestfied/car";
import {Engine} from "../injectionTestfied/engine";


@Spec('Car Drives with Enough Fuel')
@SUT(Car)
@Providers([Engine, Car, Taxi, PassengerCar])
class CarDrivesEnoughFuel extends SpecWithSUT{

  @Given('I habe 50l of fule',0) fuel50l() {
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

