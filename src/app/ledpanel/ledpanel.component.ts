import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ledpanel',
  standalone: true,
  imports: [],
  templateUrl: './ledpanel.component.html',
  styleUrl: './ledpanel.component.scss',
})
export class LedpanelComponent {
  _number: number = 0;

  @Input() set number(v: number) {
    this._number = v;
  }
}
