import {
  Component,
  afterRenderEffect,
  input,
  model,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'ds-dialog',
  template: `
    <dialog #dialogEl>
      <ng-content />
    </dialog>
  `,
  host: {
    '(keydown)': 'onKeydown($event)',
  },
})
export class DsDialog {
  /** Whether the dialog is open. Two-way bindable. */
  open = model(false);

  /** Reference to the element that triggered the dialog. */
  triggerRef = input.required<HTMLElement>();

  private dialogEl =
    viewChild.required<{ nativeElement: HTMLDialogElement }>('dialogEl');

  constructor() {
    afterRenderEffect(() => {
      const dialog = this.dialogEl().nativeElement;

      if (this.open()) {
        dialog.showModal();

        const labelEl = dialog.querySelector('[id]');
        if (labelEl) {
          dialog.setAttribute('aria-labelledby', labelEl.id);
        }

        const focusable = this.getFocusableElements();
        if (focusable.length > 0) {
          focusable[0].focus();
        }
      } else {
        if (dialog.hasAttribute('open')) {
          dialog.close();
        }
      }
    });
  }

  private getFocusableElements(): HTMLElement[] {
    return Array.from(
      this.dialogEl().nativeElement.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.open.set(false);
      this.triggerRef().focus();
      return;
    }

    if (event.key === 'Tab') {
      const focusable = this.getFocusableElements();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }
}
