import {
  Component,
  ElementRef,
  afterRenderEffect,
  inject,
  input,
  model,
} from '@angular/core';

@Component({
  selector: 'ds-dialog',
  template: `
    @if (open()) {
      <div role="dialog" aria-modal="true">
        <ng-content />
      </div>
    }
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

  private el = inject(ElementRef);

  constructor() {
    afterRenderEffect(() => {
      if (this.open()) {
        this.initDialog();
      }
    });
  }

  private initDialog(): void {
    const dialogDiv = this.el.nativeElement.querySelector('[role="dialog"]');
    if (!dialogDiv) return;

    const labelEl = dialogDiv.querySelector('[id]');
    if (labelEl) {
      dialogDiv.setAttribute('aria-labelledby', labelEl.id);
    }

    const focusable = this.getFocusableElements();
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  }

  private getFocusableElements(): HTMLElement[] {
    return Array.from(
      this.el.nativeElement.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
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
