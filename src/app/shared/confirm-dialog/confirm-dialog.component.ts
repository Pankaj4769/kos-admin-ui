import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  /** 'warn' makes the confirm button red — use for destructive actions. */
  variant?: 'primary' | 'warn';
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>
      @if (data.variant === 'warn') { <mat-icon class="warn">warning</mat-icon> }
      {{ data.title }}
    </h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="ref.close(false)">{{ data.cancelText ?? 'Cancel' }}</button>
      <button mat-flat-button
              [color]="data.variant === 'warn' ? 'warn' : 'primary'"
              (click)="ref.close(true)">
        {{ data.confirmText ?? 'Confirm' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 { display: flex; align-items: center; gap: 8px; }
    .warn { color: #b91c1c; }
  `]
})
export class ConfirmDialogComponent {
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  readonly ref = inject(MatDialogRef<ConfirmDialogComponent, boolean>);
}

/** Helper: opens a confirm dialog, returns Observable<true|undefined>. */
export function confirmAction(
  dialog: MatDialog,
  data: ConfirmDialogData
): Observable<boolean | undefined> {
  return dialog.open(ConfirmDialogComponent, { width: '420px', data }).afterClosed();
}
