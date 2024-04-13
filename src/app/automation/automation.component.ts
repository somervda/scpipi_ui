import { Component, ViewChild } from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import {
  AutomationService,
  Meter,
  Automation,
} from '../services/automation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HelperService } from '../services/helper.service';
import { DomSanitizer } from '@angular/platform-browser';

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
    MatTooltipModule,
  ],
  templateUrl: './automation.component.html',
  styleUrl: './automation.component.scss',
})
export class AutomationComponent {
  displayedColumns: string[] = ['deviceName', 'type', 'delete'];
  automation: Automation;
  script = "";
  scriptHTML = "";


  @ViewChild(MatTable) table: MatTable<Meter> | undefined;

  constructor(
    private automationService: AutomationService,
    private _snackBar: MatSnackBar,
    private helperService: HelperService,
    private sanitizer: DomSanitizer
  ) {
    this.automation = this.automationService.getAutomation();
    // this.dataSource = this.automationService.getMetersArray();
  }

  removeMeter(deviceName: string, type: string) {
    console.log('removeMeter:', deviceName, type);
    let meter: Meter = { deviceName: deviceName, type: type };
    this.automationService.removeMeter(meter);
    this.refreshTable();
  }

  refreshTable() {
    this.automation = this.automationService.getAutomation();
    if (this.table) {
      this.table.renderRows();
    }
  }

  generate() {
    this.script="";
    this.scriptHTML="";
    this.script = this.automationService.generate();
    let CRLF = '\r\n';
    this.scriptHTML=this.script.split(CRLF).join('<br>').split(" ").join('&nbsp;');

  }

  save() {
    this.helperService
      .saveScript(this.automation.name, this.script)
      .subscribe((results) => console.log(results));
  }


}
