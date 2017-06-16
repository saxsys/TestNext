import {Component, ReflectiveInjector} from '@angular/core';

import {Engine} from './engine';
import {Car, PassengerCar, Taxi} from "./car";

@Component({
  selector: 'car-show',
  template:
  '<button (click)="logSomething()">show Car</button>'+
  '<button (click)="TaxiCarCompare()">Car <-> Taxi</button>'
})
export class CarShow {
  private carPartsAll = [Car,Engine, Taxi, PassengerCar];
  private injector = ReflectiveInjector.resolveAndCreate(this.carPartsAll);

  public logSomething(){
    try {
      let injector = ReflectiveInjector.resolveAndCreate(this.carPartsAll);
      let car = injector.get(Car);
      console.log(car);
    } catch (error){
      console.log('cannot create Car, missing Parts');
    }
  }

  public TaxiCarCompare(){
    try {
      let car = this.injector.get(Car);
      let taxi = this.injector.get(Taxi);
      console.log(car);
      console.log(taxi);
    } catch (error){
      console.log('could not create Car or Taxi');
    }

  }

}


