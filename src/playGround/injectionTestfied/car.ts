import {Engine} from './engine';
import {Injectable} from "@angular/core";

@Injectable()
export class Car{
  private engine:Engine;
  public seats = 5;
  public wheels = 4;
  public fuel = 100;
  public usagePer100km = 8;

  constructor(engine:Engine){
    this.engine = engine;
  }

  drive(dist:number){
    let fuelUsage = (this.usagePer100km/100)*dist;
    if(fuelUsage > this.fuel)
      throw new Error('you cannot drive that far, it would take ' + fuelUsage + 'Liter, you have only ' + this.fuel + 'Liter remaining');
    this.fuel -= fuelUsage;
  }

  setFuelSpace(fuel:number){
    this.fuel = fuel;
  }

  setFuelUsage(usage:number){
    this.usagePer100km = usage;
  }
}

@Injectable()
export class Taxi extends Car{
  constructor(engine:Engine){
    super(engine);
    this.seats = 6;
  }
}

@Injectable()
export class PassengerCar extends Car{

}
