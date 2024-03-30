import { Component, OnDestroy } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Jds6600Service } from '../services/jds6600.service';

@Component({
  selector: 'app-jds6600',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './jds6600.component.html',
  styleUrl: './jds6600.component.scss',
})
export class Jds6600Component implements OnDestroy {
  frequency = '1000';
  level = '1.0';
  waveform = '2';

  constructor(
    private jds6600Service: Jds6600Service,
    private _snackBar: MatSnackBar
  ) {}

  apply() {
    let errorMsg = '';
    let freq = 0;
    if (!this.isNumber(this.frequency)) {
      errorMsg += 'Frequency is not numeric. ';
    } else {
      freq = parseFloat(this.frequency);
      if (freq > 30000000 || freq < 0) {
        errorMsg += 'Frequency must be between 0Hz and 30MHz. ';
      }
    }
    let level = 0;
    if (!this.isNumber(this.level)) {
      errorMsg += 'Level is not numeric. ';
    } else {
      level = parseFloat(this.level);
      if (level > 20 || level < 0) {
        errorMsg += 'Level must be between 0 and 20 volts. ';
      }
    }
    let wave = parseInt(this.waveform);
    if (errorMsg == '') {
      this.jds6600Service.configure(freq, level, wave).subscribe((result) => {
        console.log('result:', result);
        if (result == false) {
          this._snackBar.open(
            'Could not apply, check the jds6600 is connected.',
            'OK',
            {
              duration: 5000,
            }
          );
        }
      });
    } else {
      this._snackBar.open(errorMsg, 'OK', {
        duration: 5000,
      });
    }
  }

  isNumber(value: string) {
    // Use a regular expression to check string is a valid float
    return /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)?$/.test(value);
  }

  ngOnDestroy(): void {}
}
