import { Component, model, input } from '@angular/core';

@Component({
  selector: 'ds-dialog',
  template: `
    @if (open()) {
      <div>
        <ng-content />
      </div>
    }
  `,
})
export class DsDialog {
  /** Whether the dialog is open. Two-way bindable. */
  open = model(false);

  /** Reference to the element that triggered the dialog. */
  triggerRef = input.required<HTMLElement>();
}
