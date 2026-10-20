import {
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DsDialogContainer } from './ds-dialog-container';
import { DsDialogRef } from './ds-dialog-ref';

let nextTitleId = 0;

@Directive({
  selector: '[dsDialogTitle]',
  host: {
    class: 'ds-dialog-title',
    '[id]': 'id',
  },
})
export class DsDialogTitle implements OnInit, OnDestroy {
  id = `ds-dialog-title-${nextTitleId++}`;

  private _container = inject(DsDialogContainer, { optional: true });
  private _elementRef = inject(ElementRef);

  ngOnInit(): void {
    if (this._container) {
      this._container._addAriaLabelledBy(this.id);
      // Manually set the attribute since the host binding may not refresh
      // in subclassed containers with separate change detection.
      const el = this._elementRef.nativeElement as HTMLElement;
      el.closest('ds-dialog-container, cdk-dialog-container')?.setAttribute(
        'aria-labelledby',
        this.id,
      );
    }
  }

  ngOnDestroy(): void {
    this._container?._removeAriaLabelledBy?.(this.id);
  }
}

@Directive({
  selector: '[dsDialogContent]',
  host: {
    class: 'ds-dialog-content',
  },
})
export class DsDialogContent {}

@Directive({
  selector: '[dsDialogActions]',
  host: {
    class: 'ds-dialog-actions',
  },
})
export class DsDialogActions {}

@Directive({
  selector: '[dsDialogClose]',
  host: {
    type: 'button',
    '(click)': '_onClose()',
  },
})
export class DsDialogClose {
  dsDialogClose = input<unknown>();

  private _dialogRef = inject(DsDialogRef);

  _onClose(): void {
    this._dialogRef.close(this.dsDialogClose());
  }
}
