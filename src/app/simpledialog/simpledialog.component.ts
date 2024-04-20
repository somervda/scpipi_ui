import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogClose,
} from '@angular/material/dialog';

@Component({
  selector: 'app-simpledialog',
  standalone: true,
  imports: [MatButton, MatDialogActions, MatDialogContent, MatDialogClose],
  templateUrl: './simpledialog.component.html',
  styleUrl: './simpledialog.component.scss',
})
export class SimpledialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { heading: string; text: string },
    private dialogRef: MatDialogRef<SimpledialogComponent>
  ) {}

  onNoClick() {
    this.dialogRef.close();
  }
}
