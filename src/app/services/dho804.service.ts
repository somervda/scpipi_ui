import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../app.config';

export interface Measure {
  success: false;
  value?: number;
  type?: string;
  mainText?: string;
  subText?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Dho804Service {
  constructor(private http: HttpClient) {}

  connect() {
    let result = this.http.get<string>(
      'http://' + Globals.HOSTANDPORT + '/dho804/connect'
    );
    return result;
  }

  measure(type: string) {
    let result = this.http.get<Measure>(
      'http://' + Globals.HOSTANDPORT + '/dho804/measure/' + type
    );
    return result;
  }
}
