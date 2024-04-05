import { Component, OnDestroy, OnInit } from '@angular/core';
import { LedpanelComponent } from '../ledpanel/ledpanel.component';
import { MatButtonModule } from '@angular/material/button';
import { Subscription, interval } from 'rxjs';
import { Measure, Sds1052Service } from '../services/sds1052.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  AutomationService,
  Meter,
  Automation,
} from '../services/automation.service';

@Component({
  selector: 'app-sds1052',
  standalone: true,
  imports: [LedpanelComponent, MatButtonModule, MatTooltipModule],
  templateUrl: './sds1052.component.html',
  styleUrl: './sds1052.component.scss',
})
export class Sds1052Component implements OnInit, OnDestroy {
  measureRefresh$$: Subscription | undefined;
  _type = '';
  _addShow = false;
  _measure: Measure = {
    success: false,
    value: 0,
    type: '',
    mainText: '',
    subText: '',
  };
  _connected = false;

  constructor(
    private sds1052Service: Sds1052Service,
    private automationService: AutomationService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.measureRefresh$$ = interval(3000).subscribe((val) => {
      if (this._connected) {
        if (this._measure.type) {
          this.measure(this._measure.type);
        }
      }
    });
  }

  measure(type: string): void {
    this.sds1052Service.measure(type).subscribe((measure) => {
      console.log('measure:', measure);
      this._measure = measure;
      if (this._measure.success) {
        this._addShow = true;
        this._type = type;
        this._connected = true;
        let meter: Meter = { deviceName: 'sds1052', type: this._type };
        if (this.automationService.findMeter(meter)) {
          this._addShow = false;
        }
      } else {
        this._connected = false;
        this._addShow = false;
        this._snackBar.open('Not a successful measurement.', 'OK', {
          duration: 5000,
        });
      }
    });
  }

  addAutomation(): void {
    console.log('addAutomation', this._type);
    let meter: Meter = { deviceName: 'sds1052', type: this._type };
    console.log(meter, this.automationService.addMeter(meter));
    this._addShow = false;
  }

  ngOnDestroy(): void {
    if (this.measureRefresh$$) {
      this.measureRefresh$$.unsubscribe();
    }
  }
}
