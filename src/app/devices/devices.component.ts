import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { Xdm1241Component } from '../xdm1241/xdm1241.component';
import { Jds6600Component } from '../jds6600/jds6600.component';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    Xdm1241Component,
    Jds6600Component,
  ],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss',
})
export class DevicesComponent {}
