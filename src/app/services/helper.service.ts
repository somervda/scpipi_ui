import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Globals } from '../app.config';
import { Automation } from './automation.service';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor(private http: HttpClient) {}

  getStatus() {
    let result = this.http.get<any>(
      'http://' + Globals.HOSTANDPORT + '/status'
    );
    return result;
  }

  getSchema(name: string) {
    let result = this.http.get<any>(
      'http://' + Globals.HOSTANDPORT + '/schema/' + name
    );
    return result;
  }

  getSchemas() {
    let results = this.http.get<string[]>(
      'http://' + Globals.HOSTANDPORT + '/schema'
    );
    return results;
  }

  deleteSchema(name: string) {
    let result = this.http.delete<any>(
      'http://' + Globals.HOSTANDPORT + '/schema/' + name
    );
    return result;
  }

  saveSchema(name: string, schema: Automation) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    // console.log('saveScript', name, script);
    let result = this.http.post<any>(
      'http://' + Globals.HOSTANDPORT + '/script/' + name,
      schema,
      { headers: headers }
    );
    return result;
  }

  getResult(name: string) {
    let result = this.http.get<any>(
      'http://' + Globals.HOSTANDPORT + '/result/' + name
    );
    return result;
  }

  getResults() {
    let results = this.http.get<string[]>(
      'http://' + Globals.HOSTANDPORT + '/result'
    );
    return results;
  }

  deleteResult(name: string) {
    let result = this.http.delete<any>(
      'http://' + Globals.HOSTANDPORT + '/result/' + name
    );
    return result;
  }

  getScripts() {
    let result = this.http.get<any>(
      'http://' + Globals.HOSTANDPORT + '/script'
    );
    return result;
  }

  deleteScript(name: string) {
    let result = this.http.delete<any>(
      'http://' + Globals.HOSTANDPORT + '/script/' + name
    );
    return result;
  }

  saveScript(name: string, script: string) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'text/plain');
    headers.append('Accept', 'text/plain');

    console.log('saveScript', name, script);
    let result = this.http.post<any>(
      'http://' + Globals.HOSTANDPORT + '/script/' + name,
      script,
      { headers: headers }
    );
    return result;
  }
}
