import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../app.config';

export interface MeasureShow {
  success: false;
  value?: string;
  mainText?: string;
  subText?: string;
  type?: string;
  range?: number;
  rate?: number;
}

export interface Measure {
  success: false;
  value?: number;
}

@Injectable({
  providedIn: 'root',
})
export class Xdm1241Service {
  constructor(private http: HttpClient) {}

  connect() {
    let result = this.http.get<string>(
      'http://' + Globals.HOSTANDPORT + '/xdm1241/connect'
    );
    return result;
  }

  configure(type: string, range: number, rate: number) {
    let result = this.http.get<string>(
      'http://' +
        Globals.HOSTANDPORT +
        '/xdm1241/config/' +
        type +
        '/' +
        range.toString() +
        '/' +
        rate.toString()
    );
    return result;
  }

  measureShow() {
    let result = this.http.get<MeasureShow>(
      'http://' + Globals.HOSTANDPORT + '/xdm1241/measureShow'
    );
    return result;
  }

  measure() {
    let result = this.http.get<Measure>(
      'http://' + Globals.HOSTANDPORT + '/xdm1241/measure'
    );
    return result;
  }
}
