import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor(private http: HttpClient) {}

  getResult(name: string) {
    let result = this.http.get<any>(
      'http://' + Globals.HOSTANDPORT + '/result/' + name
    );
    return result;
  }
}
