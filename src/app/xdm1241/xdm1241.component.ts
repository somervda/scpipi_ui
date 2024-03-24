import { Component } from '@angular/core';
import { LedpanelComponent } from '../ledpanel/ledpanel.component';
import {MatButtonModule} from '@angular/material/button';



@Component({
  selector: 'app-xdm1241',
  standalone: true,
  imports: [LedpanelComponent,MatButtonModule],
  templateUrl: './xdm1241.component.html',
  styleUrl: './xdm1241.component.scss',
})
export class Xdm1241Component {}
