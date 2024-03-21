import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class Xdm1241Service {
  constructor(private http: HttpClient) {}

  connect() {
    let result = this.http.get<string>(
      'http://' + Globals.HOSTANDPORT + '/xpm1241/connect'
    );
    return result;
  }

  configure(type: string, range: number, rate: number) {
    let result = this.http.get<string>(
      'http://' +
        Globals.HOSTANDPORT +
        '/xpm1241/config/' +
        type +
        '/' +
        range.toString() +
        '/' +
        rate.toString()
    );
    return result;
  }

  measure() {
    let result = this.http.get<string>(
      'http://' + Globals.HOSTANDPORT + '/xpm1241/measure'
    );
    return result;
  }
}
