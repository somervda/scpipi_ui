import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  getResults() {
    let results = this.http.get<string[]>(
      'http://' + Globals.HOSTANDPORT + '/results'
    );
    return results;
  }

  getScripts() {
    let result = this.http.get<any>(
      'http://' + Globals.HOSTANDPORT + '/scripts'
    );
    return result;
  }

  saveScript(name: string, script: string) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'text/plain');
    headers.append('Accept', 'text/plain');

    console.log('saveScript', name, script);
    let result = this.http.post<any>(
      'http://' + Globals.HOSTANDPORT + '/savescript/' + name,
      script,
      { headers: headers }
    );
    return result;
  }
}
