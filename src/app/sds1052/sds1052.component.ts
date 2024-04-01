import { Component } from '@angular/core';
import { LedpanelComponent } from '../ledpanel/ledpanel.component';
import { MatButtonModule } from '@angular/material/button';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-sds1052',
  standalone: true,
  imports: [LedpanelComponent, MatButtonModule],
  templateUrl: './sds1052.component.html',
  styleUrl: './sds1052.component.scss',
})
export class Sds1052Component {
  _type = '';
  _measure = {
    success: false,
    value: '',
    mainText: '',
    subText: '',
    type: '',
  };

  measure(type: string): void {
    console.log('measure:', type);
  }
}
