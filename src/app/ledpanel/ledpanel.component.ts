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
  set mainText(val: string | undefined) {
    if (val) this._mainText = val;
    else this._mainText = '';
  }

  @Input('subText')
  set subText(val: string | undefined) {
    if (val) this._subText = val;
    else this._subText = '';
  }
}
