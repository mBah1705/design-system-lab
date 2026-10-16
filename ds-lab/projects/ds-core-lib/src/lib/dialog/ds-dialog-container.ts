import { CdkDialogContainer } from '@angular/cdk/dialog';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import { Component } from '@angular/core';

@Component({
  selector: 'ds-dialog-container',
  imports: [CdkPortalOutlet],
  template: `<ng-template cdkPortalOutlet />`,
  host: {
    class: 'ds-dialog-container',
  },
})
export class DsDialogContainer extends CdkDialogContainer {}
