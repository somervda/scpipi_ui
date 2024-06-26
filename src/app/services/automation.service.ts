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
  jds6600Volts: number;
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
    jds6600Volts: 1,
    meters: [],
  };

  constructor() {}

  findMeter(meter: Meter) {
    return this._automation.meters.find(
      (element) =>
        element.deviceName == meter.deviceName && element.type == meter.type
    );
  }

  resetAutomation() {
    this._automation = {
      name: 'auto',
      maxSeconds: 0,
      stepSeconds: 0,
      useJds6600: false,
      jds6600StartHz: 0,
      jds6600StepFactor: 0,
      jds6600Operator: '+',
      jds6600StopHz: 0,
      jds6600Volts: 1,
      meters: [],
    };
  }

  hasXDM1241() {
    // Check to see if an xdm1241 is already defined as a meter
    // Only one can be set at a time
    if (
      this._automation.meters.find((element) => element.deviceName == 'xdm1241')
    ) {
      return true;
    } else {
      return false;
    }
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

  setAutomation(newAutomation: Automation): Automation {
    this._automation = newAutomation;
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

    let xdm1241Index = this._automation.meters.findIndex(
      (element) => element.deviceName == 'xdm1241'
    );
    let xdm1241 = xdm1241Index != -1;
    let xdm1241Type = '';
    if (xdm1241) {
      xdm1241Type = this._automation.meters[xdm1241Index].type;
    }

    let CRLF = '\r\n';
    let as = '#!/usr/bin/python3' + CRLF + CRLF;
    // Assume running from scpipi folder
    as += 'import sys' + CRLF;
    as += 'sys.path.append("lib")' + CRLF + CRLF;
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
    as +=
      'helper = Helper("' +
      this._automation.name.trim() +
      '",quiet=True)' +
      CRLF;
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
      as +=
        'jds6600.configure(freq,' +
        this._automation.jds6600Volts.toString() +
        ',0)' +
        CRLF;
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
      if (this._automation.useJds6600) {
        as += 'dho804.volts(' + this._automation.jds6600Volts / 5 + ')';
      }
    }

    // If using multimeter xdm1241
    if (xdm1241) {
      as += 'xdm1241 = Xdm1241(quiet=True)' + CRLF;
      as += 'if not xdm1241.connect():' + CRLF;
      as +=
        '    print("Error: Owon xdm1241 multimeter did not connect, ending....")' +
        CRLF;
      as += '    exit(0)' + CRLF;
      as += 'xdm1241.configure("' + xdm1241Type + '",0,0)' + CRLF;
      as += 'time.sleep(5)' + CRLF;
    }

    // **** while loop *****
    as += CRLF + CRLF + '#  Main automation loop' + CRLF;
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
      as += '    helper.writeStatus("running",step,"",freq)' + CRLF;
      // Set the timebase for the dho804 if varying frequency
      if (dho804) {
        as += '    dho804.timebase(1/(freq*8))' + CRLF;
        as += '    time.sleep(.5)' + CRLF;
      }
    } else {
      as += '    helper.writeStatus("running",step,"")' + CRLF;
    }

    // Add device measurements
    as += CRLF + '    #  Collect Measurements' + CRLF;
    this._automation.meters.forEach((element: Meter) => {
      switch (element.deviceName) {
        case 'sds1052': {
          as += '    measure=sds1052.measure("' + element.type + '")' + CRLF;
          as +=
            '    rowJson=helper.addRowMeasurement(rowJson,"' +
            element.deviceName +
            '","' +
            element.type +
            '",str(measure["measure"]))' +
            CRLF;
          break;
        }
        case 'dho804': {
          as += '    measure=dho804.measure("' + element.type + '")' + CRLF;
          as +=
            '    rowJson=helper.addRowMeasurement(rowJson,"' +
            element.deviceName +
            '","' +
            element.type +
            '",str(measure["measure"]))' +
            CRLF;
          break;
        }
        case 'xdm1241': {
          as += '    measure=xdm1241.measure()' + CRLF;
          as +=
            '    rowJson=helper.addRowMeasurement(rowJson,"' +
            element.deviceName +
            '","' +
            element.type +
            '",str(measure["measure"]))' +
            CRLF;
          break;
        }
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
      as +=
        '    jds6600.configure(freq,' +
        this._automation.jds6600Volts.toString() +
        ',0)' +
        CRLF;
    }
    // sleep until next step cycle
    as +=
      '    time.sleep(' + this._automation.stepSeconds.toString() + ')' + CRLF;
    as += '    step+=1' + CRLF;

    as += CRLF + '#  Write the results' + CRLF;
    as += 'helper.writeJsonTable(tableJson)' + CRLF;
    as += 'helper.removeStatus()' + CRLF;
    return as;
  }
}
