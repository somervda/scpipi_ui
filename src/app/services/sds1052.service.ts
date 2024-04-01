import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../app.config';

export interface Measure {
  success: false;
  value?: number;
}

@Injectable({
  providedIn: 'root',
})
export class Sds1052Service {
  constructor(private http: HttpClient) {}

  connect() {
    let result = this.http.get<string>(
      'http://' + Globals.HOSTANDPORT + '/sds1052/connect'
    );
    return result;
  }

  measure(type: string) {
    let result = this.http.get<Measure>(
      'http://' +
        Globals.HOSTANDPORT +
        '/sds1052/measure/' +
        type
    );
    return result;
  }
}
