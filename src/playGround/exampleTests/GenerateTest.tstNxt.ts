import {
  Generate, Given, Spec, Subject, Then, ThenThrow,
  When
} from "../../../testNext/SpecDeclaration/specDecorators/spec-decorators";
import {Engine} from "../injectionTestfied/engine";
import {Car} from "../injectionTestfied/car";
import {Assert} from "../../../testNext/SpecDeclaration/assert/assert";


let engineMock = {
  ps: 2,
  getPs: () => {
    return 1;
  }
};

@Subject('Car Drives')
@Subject('Test Generate')
class CarSetup_ViaGenerate {
  @Generate(Car, [
    {
      provide: Engine,
      mock: engineMock
    }
  ])
  public SUT;

  @Given('the Car has space for 30l of fuel', 1)
  fuelSpace30l() {
    this.SUT.setFuelSpace(30);
  }

  @Given('the Car uses 5l per 100km', 2)
  fuelUsage5l() {
    this.SUT.setFuelUsage(5);
  }
}


@Spec('A Car Drives with Enough Fuel')
@Subject('Car Drives')
@Subject('Test Generate')
class CarDrives_EnoughFuel_ViaGenerate extends CarSetup_ViaGenerate {

  @Given('there are 20l of fuel')
  fuel20l() {
    this.SUT.setFuelSpace(20)
  }

  @When('I drive 100km')
  drive100km() {
    this.SUT.drive(100);
  }

  @Then('the car should have 15l fuel')
  shouldHave15lLeft() {
    Assert.that(this.SUT.fuel).equals(15);
  }
}


@Spec('Car Drives with not Enough Fuel')
@Subject('Car Drives')
@Subject('Test Generate')
class CarDrives_ExpectedError_ViaGenerate extends CarSetup_ViaGenerate {

  @Given('there are 5l of fuel')
  fuel5l() {
    this.SUT.setFuelSpace(5)
  }

  @When('I drive 200km')
  drive200km() {
    this.SUT.drive(200);
  }

  @ThenThrow('Not Enough fuel')
  notEnoughFuel() {
    throw new Error(
      'you cannot drive that far, it would take 10Liter, you have only 5Liter remaining');
  }
}

@Spec('Car drives Engine Values compared')
@Subject('Car Drives')
@Subject('Test Generate')
class CarDrives_UseDependency_ViaGenerate extends CarSetup_ViaGenerate {
  private engineValueGetter;
  private engineValueProp;

  @When('A Value from the Engine is taken')
  valEngineTaken() {
    this.engineValueGetter = this.SUT.engine.getPs();
    this.engineValueProp = this.SUT.engine.ps;
  }

  @Then('They should be the same, if not mocked')
  cmpVals(){
    Assert.that(this.engineValueProp, 'the Value from Property').equals(this.engineValueGetter, 'the Value got via Getter');
  }
}
