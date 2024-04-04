import { Injectable } from '@angular/core';

export interface Meter {
  deviceName: string;
  type: string;
}
export interface Automation {
  name: string;
  description: string;
  start: number;
  step: number;
  stepOperator: string;
  limit: number;
  maxSeconds: number;
  stepSeconds: number;
  meters: Meter[];
}

@Injectable({
  providedIn: 'root',
})
export class AutomationService {
  // Use a Map for Automation data
  _automation: Automation = {
    name: '',
    description: '',
    start: 0,
    step: 0,
    stepOperator: '+',
    limit: 0,
    maxSeconds: 0,
    stepSeconds: 0,
    meters: [],
  };

  constructor() {}

  findMeter(meter: Meter) {
    return this._automation.meters.find(
      (element) =>
        element.deviceName == meter.deviceName && element.type == meter.type
    );
  }

  addMeter(meter: Meter) {
    if (this.findMeter(meter)) {
      // meter already in array
      return false;
    } else {
      this._automation.meters.push(meter);
      return true;
    }
  }

  removeMeter(meter: Meter) {
    console.log('removeMeter:', meter);
    var index = this._automation.meters.findIndex(
      (element) =>
        element.deviceName == meter.deviceName && element.type == meter.type
    );
    console.log('index:', index);
    if (index > -1) {
      this._automation.meters.splice(index, 1);
      return true;
    }
    return false;
  }

  getMetersArray() {
    return this._automation.meters;
  }

  getJson() {
    // Return stringified version of automation parameters (For saving)
    return JSON.stringify(this._automation);
  }

  makeScript() {
    let CRLF = '\r\n';
    let as = '#!/usr/bin/python3' + CRLF + CRLF;
    as += 'from xdm1241 import Xdm1241' + CRLF;
    as += 'from jds6600 import Jds6600' + CRLF;
    as += 'from sds1052 import Sds1052' + CRLF;
    as += 'from dho804 import dho804' + CRLF;
    as += 'import time' + CRLF;
    as += '' + CRLF;
    as += '#  Setup environment' + CRLF;
    as += '' + CRLF;
    as += '' + CRLF;
    as += '' + CRLF;
  }
}
