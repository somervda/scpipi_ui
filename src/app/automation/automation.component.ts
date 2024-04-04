import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  AutomationService,
  Meter,
  Automation,
} from '../services/automation.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-automation',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './automation.component.html',
  styleUrl: './automation.component.scss',
})
export class AutomationComponent {
  displayedColumns: string[] = ['deviceName', 'type', 'delete'];
  dataSource;

  constructor(
    private automationService: AutomationService,
    private _snackBar: MatSnackBar
  ) {
    console.log(automationService.getMetersArray());
    this.dataSource = automationService.getMetersArray();
  }

  removeMeter(deviceName: string, type: string) {
    console.log('removeMeter:', deviceName, type);
    let meter: Meter = { deviceName: deviceName, type: type };
    this.automationService.removeMeter(meter);
    this.dataSource = this.automationService.getMetersArray();
  }
}
