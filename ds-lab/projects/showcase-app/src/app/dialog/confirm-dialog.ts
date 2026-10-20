import { Component, inject } from '@angular/core';
import {
  DS_DIALOG_DATA,
  DsDialogActions,
  DsDialogClose,
  DsDialogContent,
  DsDialogTitle,
} from 'ds-core';

export interface ConfirmDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [DsDialogTitle, DsDialogContent, DsDialogActions, DsDialogClose],
  template: `
    <h2 dsDialogTitle>{{ data.title }}</h2>
    <div dsDialogContent>
      <p>{{ data.message }}</p>
    </div>
    <div dsDialogActions>
      <button class="btn btn-outline" dsDialogClose>Cancel</button>
      <button class="btn btn-primary" [dsDialogClose]="true">Confirm</button>
    </div>
  `,
})
export class ConfirmDialog {
  protected readonly data = inject<ConfirmDialogData>(DS_DIALOG_DATA);
}
