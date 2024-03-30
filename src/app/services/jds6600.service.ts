import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class Jds6600Service {
  constructor(private http: HttpClient) {}

  connect() {
    let result = this.http.get<string>(
      'http://' + Globals.HOSTANDPORT + '/jds6600/connect'
    );
    return result;
  }

  configure(frequency: number, level: number, wave: number) {
    let result = this.http.get<boolean>(
      'http://' +
        Globals.HOSTANDPORT +
        '/jds6600/config/' +
        frequency.toString() +
        '/' +
        level.toString() +
        '/' +
        wave.toString()
    );
    return result;
  }
}
