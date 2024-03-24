import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ledpanel',
  standalone: true,
  imports: [],
  templateUrl: './ledpanel.component.html',
  styleUrl: './ledpanel.component.scss',
})
export class LedpanelComponent {
  _mainText: string = '';
  _subText: string = '';

  @Input('mainText')
  set mainText(val: string) {
    this._mainText = val;
  }

  @Input('subText')
  set subText(val: string) {
    this._subText = val;
  }
}
