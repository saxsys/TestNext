
import {Injectable} from "@angular/core";

@Injectable()
export class Engine implements IEngine{
  public ps = 9;

  getPs():number{
    return this.ps;
  }
}

export interface IEngine{
  getPs():number;
}

