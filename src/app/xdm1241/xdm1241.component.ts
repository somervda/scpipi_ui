import { Component, OnDestroy, OnInit } from '@angular/core';
import { LedpanelComponent } from '../ledpanel/ledpanel.component';
import { MatButtonModule } from '@angular/material/button';
import { MeasureShow, Xdm1241Service } from '../services/xdm1241.service';
import { Subscription, interval } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  AutomationService,
  Meter,
  Automation,
} from '../services/automation.service';

@Component({
  selector: 'app-xdm1241',
  standalone: true,
  imports: [LedpanelComponent, MatButtonModule, MatTooltipModule],
  templateUrl: './xdm1241.component.html',
  styleUrl: './xdm1241.component.scss',
})
export class Xdm1241Component implements OnDestroy, OnInit {
  xdm1241Config$$: Subscription | undefined;
  measureRefresh$$: Subscription | undefined;
  _connected = false;
  _type: string = '';
  _addShow = false;
  _measure: MeasureShow = {
    success: false,
    value: '',
    mainText: '',
    subText: '',
    type: '',
    range: 0,
    rate: 0,
  };

  constructor(
    private xdm1241Service: Xdm1241Service,
    private automationService: AutomationService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.measureRefresh$$ = interval(3000).subscribe((val) => {
      if (this._connected) {
        this.measure();
      }
    });
  }

  configure(type: string): void {
    console.log('configure', type);
    // this._type = type;

    this.xdm1241Config$$ = this.xdm1241Service
      .configure(type, 0, 0)
      .subscribe((result) => {
        console.log('Configure:', type, result);
        if (result) {
          this._connected = true;
          this._type = type;
          this._addShow = true;
          let meter: Meter = { deviceName: 'xdm1241', type: this._type };
          if (this.automationService.hasXDM1241()) {
            this._addShow = false;
          }
        } else {
          this._connected = false;

          this._addShow = false;
          this._snackBar.open(
            'Could not connect to XDM1241! Check it is plugged in and turned on.',
            'OK',
            {
              duration: 5000,
            }
          );
          this._type = '';
        }
      });
  }

  addAutomation(): void {
    console.log('addAutomation', this._type);
    let meter: Meter = { deviceName: 'xdm1241', type: this._type };
    console.log(meter, this.automationService.addMeter(meter));
    this._addShow = false;
  }

  measure(): void {
    this.xdm1241Service.measureShow().subscribe((measure) => {
      this._measure = measure;
      if (this._measure.success) {
        this._connected = true;
        if (this._measure.type) {
          this._type = this._measure.type;
          console.log('set measure type', this._type);
        }
      } else {
        this._connected = false;
        this._snackBar.open('Not a successful measurement.', 'OK', {
          duration: 5000,
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.xdm1241Config$$) {
      this.xdm1241Config$$.unsubscribe();
    }
    if (this.measureRefresh$$) {
      this.measureRefresh$$.unsubscribe();
    }
  }
}
