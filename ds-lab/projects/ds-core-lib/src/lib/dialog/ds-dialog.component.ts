import {
  Component,
  DestroyRef,
  effect,
  forwardRef,
  inject,
  input,
  model,
  TemplateRef,
  ViewContainerRef,
  viewChild,
} from '@angular/core';
import { DsDialog } from './ds-dialog.service';
import { DsDialogConfig } from './ds-dialog-config';
import { DsDialogRef } from './ds-dialog-ref';

@Component({
  selector: 'ds-dialog',
  template: `<ng-template #dialogTpl><ng-content /></ng-template>`,
  providers: [
    { provide: DsDialogRef, useExisting: forwardRef(() => DsDialogComponent) },
  ],
})
export class DsDialogComponent {
  readonly open = model(false);
  readonly config = input<DsDialogConfig>({});

  private _dialog = inject(DsDialog);
  private _vcr = inject(ViewContainerRef);
  private _destroyRef = inject(DestroyRef);
  private _dialogTpl = viewChild.required<TemplateRef<unknown>>('dialogTpl');
  private _dialogRef: DsDialogRef | null = null;

  constructor() {
    effect(() => {
      const shouldOpen = this.open();
      if (shouldOpen && !this._dialogRef) this._openDialog();
      else if (!shouldOpen && this._dialogRef) this._closeDialog();
    });

    this._destroyRef.onDestroy(() => this._dialogRef?.close());
  }

  /** Delegates to the real DsDialogRef for projected directives (e.g. DsDialogClose). */
  close(result?: unknown): void {
    this._dialogRef?.close(result);
  }

  private _openDialog(): void {
    this._dialogRef = this._dialog.open(this._dialogTpl(), {
      ...this.config(),
      viewContainerRef: this._vcr,
    });
    this._dialogRef.closed.subscribe(() => {
      this._dialogRef = null;
      this.open.set(false);
    });

    // Wire up aria-labelledby for projected DsDialogTitle directives.
    // DsDialogTitle.ngOnInit can't resolve the container for projected
    // content, so we set the attribute after the dialog is fully rendered.
    const container = this._dialogRef.containerInstance;
    const titleEl = container.nativeElement.querySelector('[dsdialogtitle]');
    if (titleEl) {
      container._addAriaLabelledBy(titleEl.id);
      container.nativeElement.setAttribute('aria-labelledby', titleEl.id);
    }
  }

  private _closeDialog(): void {
    this._dialogRef?.close();
    this._dialogRef = null;
  }
}
