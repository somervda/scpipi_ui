import { Injectable } from '@angular/core';

export interface Meter {
  deviceName: string;
  type: string;
}
export interface Automation {
  name: string;
  maxSeconds: number;
  stepSeconds: number;
  useJds6600: boolean;
  jds6600StartHz: number;
  jds6600StepFactor: number;
  jds6600Operator: string;
  jds6600StopHz: number;
  meters: Meter[];
}

@Injectable({
  providedIn: 'root',
})
export class AutomationService {
  // Use a Map for Automation data
  _automation: Automation = {
    name: 'auto',
    maxSeconds: 0,
    stepSeconds: 0,
    useJds6600: false,
    jds6600StartHz: 0,
    jds6600StepFactor: 0,
    jds6600Operator: '+',
    jds6600StopHz: 0,
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

  getAutomation(): Automation {
    return this._automation;
  }

  getJson() {
    // Return stringified version of automation parameters (For saving)
    return JSON.stringify(this._automation);
  }

  generate() {
    let CRLF = '\r\n';
    let as = '#!/usr/bin/python3' + CRLF + CRLF;
    as += 'from xdm1241 import Xdm1241' + CRLF;
    as += 'from jds6600 import Jds6600' + CRLF;
    as += 'from sds1052 import Sds1052' + CRLF;
    as += 'from dho804 import Dho804' + CRLF;
    as += 'import time' + CRLF;
    as += '' + CRLF;
    // Setup environment
    as += '#  Setup environment' + CRLF;
    as += 'start=time.time()' + CRLF;
    // If using signal generator jds6600
    if (this._automation.useJds6600) {
      as += 'jds6600 = Jds6600(quiet=True)' + CRLF;
      as += 'freq=' + this._automation.jds6600StartHz.toString() + CRLF;
    }
    as +=
      'while (start + ' +
      this._automation.maxSeconds.toString() +
      ') > time.time():' +
      CRLF;
    // Add in signal generator jds6600
    if (this._automation.useJds6600) {
      if (
        this._automation.jds6600Operator == '+' ||
        this._automation.jds6600Operator == '*'
      ) {
        as += '    if freq>' + this._automation.jds6600StopHz + ':' + CRLF;
        as += '        break;' + CRLF;
      } else {
        as += '    if freq<' + this._automation.jds6600StopHz + ':' + CRLF;
        as += '        break' + CRLF;
      }
      // Set jds6600 to frequency at 1 volt and sine wave
      as += '    jds6600.configure(freq,1,0)' + CRLF;
      // Set freq to next value
      as +=
        '    freq' +
        this._automation.jds6600Operator +
        '= ' +
        this._automation.jds6600StepFactor.toString() +
        CRLF;
    }
    // sleep until next step cycle
    as +=
      '    time.sleep(' + this._automation.stepSeconds.toString() + ')' + CRLF;
    return as;
  }
}
