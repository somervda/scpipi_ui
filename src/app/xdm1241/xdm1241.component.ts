import { Component, OnDestroy } from '@angular/core';
import { LedpanelComponent } from '../ledpanel/ledpanel.component';
import { MatButtonModule } from '@angular/material/button';
import { Xdm1241Service } from '../services/xdm1241.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-xdm1241',
  standalone: true,
  imports: [LedpanelComponent, MatButtonModule],
  templateUrl: './xdm1241.component.html',
  styleUrl: './xdm1241.component.scss',
})
export class Xdm1241Component implements OnDestroy {
  xdm1241Config$$: Subscription | undefined;
  _type: string = '';

  constructor(private xdm1241Service: Xdm1241Service) {}

  configure(type: string): void {
    console.log('configure', type);
    this._type = type;
    this.xdm1241Config$$ = this.xdm1241Service
      .configure(type, 0, 0)
      .subscribe((result) => {
        console.log('Configure:', type, result);
        if (result) {
          this._type = type;
        } else {
          alert('Could not connect to XDM1241!');
          this._type = '';
        }
      });
  }

  ngOnDestroy(): void {
    if (this.xdm1241Config$$) {
      this.xdm1241Config$$.unsubscribe();
    }
  }
}
