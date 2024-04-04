import { Component, ViewChild } from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import {
  AutomationService,
  Meter,
  Automation,
} from '../services/automation.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-automation',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './automation.component.html',
  styleUrl: './automation.component.scss',
})
export class AutomationComponent {
  displayedColumns: string[] = ['deviceName', 'type', 'delete'];
  dataSource;

  stepSeconds = 5;
  maxSeconds = 2000;
  jds6600StartHz = 1000;
  jds6600StepFactor = 1.0595;
  JDS6600Operator = '+';
  jds6600StopHz = 20000;
  jds6600: boolean = false;

  @ViewChild(MatTable) table: MatTable<Meter> | undefined;

  constructor(
    private automationService: AutomationService,
    private _snackBar: MatSnackBar
  ) {
    this.dataSource = this.automationService.getMetersArray();
  }

  removeMeter(deviceName: string, type: string) {
    console.log('removeMeter:', deviceName, type);
    let meter: Meter = { deviceName: deviceName, type: type };
    this.automationService.removeMeter(meter);
    this.refreshTable();
  }

  refreshTable() {
    this.dataSource = this.automationService.getMetersArray();
    if (this.table) {
      this.table.renderRows();
    }
  }
}
