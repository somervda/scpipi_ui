import { Injectable } from '@angular/core';

export interface AutomationItem {
  deviceName: string;
  isPrimary: boolean;
  type?: string;
  option1?: string;
  option2?: string;
  option3?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AutomationService {
  // Use a Map for Automation data
  _map = new Map<number, AutomationItem>();
  _start = 0;
  _step = 0;
  _stepOperator = '+';
  _limit = 0;

  constructor() {}

  nextId() {
    let nextId = 0;
    for (let id of this._map.keys()) {
      if (nextId < id) {
        nextId = id;
      }
    }
    return nextId + 1;
  }

  add(item: AutomationItem) {
    this._map.set(this.nextId(), item);
  }

  remove(id: number) {
    this._map.delete(id);
  }

  get(id: number): AutomationItem | undefined {
    return this._map.get(id);
  }

  getScript() {
    let CRLF = "\r\n"
    let as = "#!/usr/bin/python3" + CRLF + CRLF;
    as += "from xdm1241 import Xdm1241" + CRLF;
    as += "from jds6600 import Jds6600" + CRLF;
    as += "from sds1052 import Sds1052" + CRLF;
    as += "from dho804 import dho804" + CRLF;
    as += "import time" + CRLF;
    as += "" + CRLF;
    as += "#  Setup environment" + CRLF;
    as += "" + CRLF;
    as += "" + CRLF;
    as += "" + CRLF;



    
    
    
  }
}
