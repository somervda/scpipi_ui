import { Component } from '@angular/core';
import {
  AutomationService,
  Meter,
  Automation,
} from '../services/automation.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-automation',
  standalone: true,
  imports: [],
  templateUrl: './automation.component.html',
  styleUrl: './automation.component.scss',
})
export class AutomationComponent {
  json = '';

  constructor(
    private automationService: AutomationService,
    private _snackBar: MatSnackBar
  ) {
    this.json = automationService.getJson();
  }
}
