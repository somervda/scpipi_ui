import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { Xdm1241Component } from '../xdm1241/xdm1241.component';
import { Jds6600Component } from '../jds6600/jds6600.component';
import { Sds1052Component } from '../sds1052/sds1052.component';
import { Dho804Component } from '../dho804/dho804.component';

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
    Sds1052Component,
    Dho804Component,
  ],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss',
})
export class DevicesComponent {}
