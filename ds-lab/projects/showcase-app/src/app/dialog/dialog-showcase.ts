import { Component, inject, signal } from '@angular/core';
import {
  DsDialog,
  DsDialogActions,
  DsDialogClose,
  DsDialogComponent,
  DsDialogContent,
  DsDialogTitle,
} from 'ds-core';
import { ConfirmDialog } from './confirm-dialog';

@Component({
  selector: 'app-dialog-showcase',
  imports: [
    DsDialogComponent,
    DsDialogTitle,
    DsDialogContent,
    DsDialogActions,
    DsDialogClose,
  ],
  templateUrl: './dialog-showcase.html',
  styleUrl: './dialog-showcase.scss',
})
export class DialogShowcase {
  private _dialog = inject(DsDialog);

  // Component-based (declarative) demos
  protected basicOpen = signal(false);
  protected basicResult = signal<string>('');

  protected customOpen = signal(false);
  protected customResult = signal<string>('');

  // Service-based (programmatic) demo
  protected serviceResult = signal<string>('');

  protected openBasicDialog(): void {
    this.basicResult.set('');
    this.basicOpen.set(true);
  }

  protected openCustomDialog(): void {
    this.customResult.set('');
    this.customOpen.set(true);
  }

  protected onBasicClosed(): void {
    if (!this.basicOpen()) {
      this.basicResult.set('Dialog closed');
    }
  }

  protected onCustomClosed(): void {
    if (!this.customOpen()) {
      this.customResult.set('Dialog closed');
    }
  }

  protected openConfirmDialog(): void {
    this.serviceResult.set('');
    const ref = this._dialog.open(ConfirmDialog, {
      data: {
        title: 'Confirm Action',
        message: 'Are you sure you want to proceed with this action?',
      },
      width: '400px',
    });

    ref.closed.subscribe((result) => {
      this.serviceResult.set(result ? 'Confirmed' : 'Cancelled');
    });
  }
}
