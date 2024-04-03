import { Component, OnDestroy, OnInit } from '@angular/core';
import { LedpanelComponent } from '../ledpanel/ledpanel.component';
import { MatButtonModule } from '@angular/material/button';
import { Subscription, interval } from 'rxjs';
import { Measure, Dho804Service } from '../services/dho804.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dho804',
  standalone: true,
  imports: [LedpanelComponent, MatButtonModule],
  templateUrl: './dho804.component.html',
  styleUrl: './dho804.component.scss',
})
export class Dho804Component implements OnInit, OnDestroy {
  measureRefresh$$: Subscription | undefined;
  _type = '';
  _measure: Measure = {
    success: false,
    value: 0,
    type: '',
    mainText: '',
    subText: '',
  };
  _connected = false;

  constructor(
    private dho804Service: Dho804Service,
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
    this.dho804Service.measure(type).subscribe((measure) => {
      console.log('measure:', measure);
      this._measure = measure;
      if (this._measure.success) {
        this._connected = true;
      } else {
        this._connected = false;
        this._snackBar.open('Not a successful measurement.', 'OK', {
          duration: 5000,
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.measureRefresh$$) {
      this.measureRefresh$$.unsubscribe();
    }
  }
}
