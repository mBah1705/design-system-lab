import { Direction } from '@angular/cdk/bidi';
import { Injector, ViewContainerRef } from '@angular/core';

export interface DsDialogConfig<D = unknown> {
  /** Data to pass to the dialog component via DS_DIALOG_DATA. */
  data?: D;

  /** Unique id for the dialog. Auto-generated if omitted. */
  id?: string;

  /** ARIA role. Defaults to `'dialog'`. */
  role?: 'dialog' | 'alertdialog';

  /** Explicit aria-label for the dialog panel. */
  ariaLabel?: string;

  /** ID of the element that labels the dialog. */
  ariaLabelledBy?: string;

  /** ID of the element that describes the dialog. */
  ariaDescribedBy?: string;

  /** Where to move focus on open. Defaults to `'first-tabbable'`. */
  autoFocus?: 'first-tabbable' | 'first-heading' | string | boolean;

  /** Whether to restore focus to the previously-focused element on close. Defaults to `true`. */
  restoreFocus?: boolean;

  /** Whether the user can close the dialog by pressing Escape or clicking the backdrop. */
  disableClose?: boolean;

  /** Whether the dialog has a backdrop. Defaults to `true`. */
  hasBackdrop?: boolean;

  /** Width of the dialog panel. */
  width?: string;

  /** Height of the dialog panel. */
  height?: string;

  /** Max-width of the dialog panel. */
  maxWidth?: string;

  /** Max-height of the dialog panel. */
  maxHeight?: string;

  /** Min-width of the dialog panel. */
  minWidth?: string;

  /** Min-height of the dialog panel. */
  minHeight?: string;

  /** CSS class(es) to apply to the dialog panel. */
  panelClass?: string | string[];

  /** CSS class(es) to apply to the backdrop. */
  backdropClass?: string | string[];

  /** Layout direction (ltr or rtl). */
  direction?: Direction;

  /** ViewContainerRef to use for the dialog's content. */
  viewContainerRef?: ViewContainerRef;

  /** Injector to use for the dialog's content. */
  injector?: Injector;
}
