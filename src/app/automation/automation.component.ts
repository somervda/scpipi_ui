import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import {
  AutomationService,
  Meter,
  Automation,
} from '../services/automation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HelperService } from '../services/helper.service';
import { Subscription } from 'rxjs';
import { SimpledialogComponent } from '../simpledialog/simpledialog.component';

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
    MatDialogModule,
    SimpledialogComponent,
  ],
  templateUrl: './automation.component.html',
  styleUrl: './automation.component.scss',
})
export class AutomationComponent implements OnDestroy {
  getSchemas$$: Subscription | undefined;
  getSchema$$: Subscription | undefined;
  deleteSchema$$: Subscription | undefined;
  deleteScript$$: Subscription | undefined;
  displayedColumns: string[] = ['deviceName', 'type', 'delete'];
  automation: Automation;
  script = '';
  scriptHTML = '';
  schemaName = '';
  schemaNames: string[] = [];
  // Used to determine if we are loading a schema or working with existing one
  // This flips the controls being shown
  isLoading = false;

  @ViewChild(MatTable) table: MatTable<Meter> | undefined;

  constructor(
    private automationService: AutomationService,
    private _snackBar: MatSnackBar,
    private helperService: HelperService,
    private dialog: MatDialog
  ) {
    this.automation = this.automationService.getAutomation();
    this.getSchemas();
  }

  getSchemas() {
    this.schemaNames = [];
    this.getSchemas$$ = this.helperService.getSchemas().subscribe((schemas) => {
      schemas.forEach((schema) => {
        let schemaName = schema.replace('schemas/', '').replace('.json', '');
        this.schemaNames.push(schemaName);
      });
    });
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

  openDialog() {}

  loadSchema() {
    this.getSchema$$ = this.helperService
      .getSchema(this.schemaName)
      .subscribe((schema) => {
        this.automation = schema;
        this.automationService.setAutomation(this.automation);
      });
    this.isLoading = false;
    this.scriptHTML = '';
  }

  generate() {
    this.script = '';
    this.scriptHTML = '';
    this.script = this.automationService.generate();
    let CRLF = '\r\n';
    this.scriptHTML = this.script
      .split(CRLF)
      .join('<br>')
      .split(' ')
      .join('&nbsp;');
  }

  deleteScript() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      heading: 'Confirm Delete',
      text:
        'You are requesting that the ' +
        this.automation.name +
        '.py script and ' +
        this.automation.name +
        '.json files be deleted, confirm(Ok) or cancel',
    };

    let dialogRef = this.dialog.open(SimpledialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        console.log('deleteScript:', this.automation.name);
        this.deleteSchema$$ = this.helperService
          .deleteSchema(this.automation.name)
          .subscribe((result) => console.log('deleteSchema:', result));
        this.deleteScript$$ = this.helperService
          .deleteScript(this.automation.name)
          .subscribe((result) => console.log('deleteScript:', result));
        this.getSchemas();
        this.automationService.resetAutomation();
        this.automation = this.automationService.getAutomation();
        this.scriptHTML = '';
      }
    });
  }

  save() {
    // Save both the python script and the definition (schema)
    this.helperService
      .writeScript(this.automation.name, this.script)
      .subscribe((results) => console.log('saveScript:', results));
    this.helperService
      .writeSchema(this.automation.name, this.automation)
      .subscribe((results) => console.log('saveSchema:', results));
    this.getSchemas();
  }

  ngOnDestroy(): void {
    this.automationService.setAutomation(this.automation);
    if (this.getSchemas$$) {
      this.getSchemas$$.unsubscribe();
    }
    if (this.getSchema$$) {
      this.getSchema$$.unsubscribe();
    }
    if (this.deleteSchema$$) {
      this.deleteSchema$$.unsubscribe();
    }
    if (this.deleteScript$$) {
      this.deleteScript$$.unsubscribe();
    }
  }
}
