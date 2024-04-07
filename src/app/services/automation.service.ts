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
    let sds1052 =
      this._automation.meters.findIndex(
        (element) => element.deviceName == 'sds1052'
      ) != -1;
    let dho804 =
      this._automation.meters.findIndex(
        (element) => element.deviceName == 'dho804'
      ) != -1;
    let xdm1241 =
      this._automation.meters.findIndex(
        (element) => element.deviceName == 'xdm1241'
      ) != -1;

    let CRLF = '\r\n';
    let as = '#!/usr/bin/python3' + CRLF + CRLF;
    as = 'import sys' + CRLF;
    as = 'sys.path.append("../lib")' + CRLF;
    as += 'from xdm1241 import Xdm1241' + CRLF;
    as += 'from jds6600 import Jds6600' + CRLF;
    as += 'from sds1052 import Sds1052' + CRLF;
    as += 'from dho804 import Dho804' + CRLF;
    as += 'import time' + CRLF;
    as += 'import json' + CRLF;
    as += 'from helper import Helper' + CRLF;
    as += '' + CRLF;

    // Setup environment
    as += '#  Setup environment' + CRLF;
    as += 'helper = Helper(quiet=True)' + CRLF;
    as += 'result=[]' + CRLF;
    as += 'start=time.time()' + CRLF;
    as += 'step=1' + CRLF;
    as += 'tableJson=""' + CRLF;

    // If using signal generator jds6600
    if (this._automation.useJds6600) {
      as += 'jds6600 = Jds6600(quiet=True)' + CRLF;
      as += 'if not jds6600.connect():' + CRLF;
      as +=
        '    print("Error: jds6600 signal generator did not connect, ending....")' +
        CRLF;
      as += '    exit(0)' + CRLF;
      as += 'freq=' + this._automation.jds6600StartHz.toString() + CRLF;
      as += 'jds6600.configure(freq,1,0)' + CRLF;
      as += 'time.sleep(1)' + CRLF;
    }

    // If using oscilloscope sds1052
    if (sds1052) {
      as += 'sds1052 = Sds1052(quiet=True)' + CRLF;
      as += 'if not sds1052.connect():' + CRLF;
      as +=
        '    print("Error: Siglent sds1052 oscilloscope did not connect, ending....")' +
        CRLF;
      as += '    exit(0)' + CRLF;
    }

    // If using oscilloscope dho804
    if (dho804) {
      as += 'dho804 = Dho804(quiet=True)' + CRLF;
      as += 'if not dho804.connect():' + CRLF;
      as +=
        '    print("Error: Rigol dho804 oscilloscope did not connect, ending....")' +
        CRLF;
      as += '    exit(0)' + CRLF;
    }

    // If using multimeter xdm1241
    if (xdm1241) {
      as += 'xdm1241 = Xdm1241(quiet=True)' + CRLF;
      as += 'if not xdm1241.connect():' + CRLF;
      as +=
        '    print("Error: Owon xdm1241 multimeter did not connect, ending....")' +
        CRLF;
      as += '    exit(0)' + CRLF;
    }

    // **** while loop *****
    as += CRLF + '#  Main automation loop' + CRLF;
    as +=
      'while (start + ' +
      this._automation.maxSeconds.toString() +
      ') > time.time():' +
      CRLF;
    as += '    rowJson=helper.startRow(step)' + CRLF;
    if (this._automation.useJds6600) {
      as +=
        '    rowJson=helper.addRowMeasurement(rowJson,"frequency","",freq)' +
        CRLF;
    }

    // Add device measurements
    as += CRLF + '    #  Collect Measurements' + CRLF;
    this._automation.meters.forEach((element: Meter) => {
      switch (element.deviceName) {
        case 'sds1052':
          as += '    measure=sds1052.measure("' + element.type + '")' + CRLF;
          as +=
            '    rowJson=helper.addRowMeasurement(rowJson,"' +
            element.deviceName +
            '","' +
            element.type +
            '",str(measure["measure"]))' +
            CRLF;
      }
    });
    as += '    print("rowJson:",rowJson)' + CRLF;
    as += '    tableJson=helper.addTableRow(tableJson,rowJson)' + CRLF;

    // Update signal generator jds6600 frequency
    if (this._automation.useJds6600) {
      as += CRLF + '    #  Update JDS6600 frequency' + CRLF;
      // Set freq to next value
      as +=
        '    freq ' +
        this._automation.jds6600Operator +
        '= ' +
        this._automation.jds6600StepFactor.toString() +
        CRLF;
      if (
        this._automation.jds6600Operator == '+' ||
        this._automation.jds6600Operator == '*'
      ) {
        as += '    if freq>' + this._automation.jds6600StopHz + ':' + CRLF;
        as += '        break' + CRLF;
      } else {
        as += '    if freq<' + this._automation.jds6600StopHz + ':' + CRLF;
        as += '        break' + CRLF;
      }
      as += '    freq = round(freq, 1)' + CRLF;
      // Set the signal generator jds6600 frequency
      as += '    jds6600.configure(freq,1,0)' + CRLF;
    }
    // sleep until next step cycle
    as +=
      '    time.sleep(' + this._automation.stepSeconds.toString() + ')' + CRLF;
    as += '    step+=1' + CRLF;

    as += CRLF + '#  Write the results' + CRLF;
    as +=
      'helper.writeJsonTable("' +
      this._automation.name.trim() +
      '",tableJson)' +
      CRLF;
    return as;
  }
}
