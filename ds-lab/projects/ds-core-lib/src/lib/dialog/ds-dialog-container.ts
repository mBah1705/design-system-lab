import { CdkDialogContainer } from '@angular/cdk/dialog';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ds-dialog-container',
  imports: [CdkPortalOutlet],
  template: `<ng-template cdkPortalOutlet />`,
  styleUrl: './ds-dialog-container.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ds-dialog-container',
  },
})
export class DsDialogContainer extends CdkDialogContainer {
  get nativeElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}
