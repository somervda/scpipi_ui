import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { Xdm1241Component } from './xdm1241/xdm1241.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Xdm1241Component, MatTabsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'SCPIPI';
}
