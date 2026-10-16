import { ComponentType } from '@angular/cdk/portal';
import { CdkDialogContainer, Dialog, DialogRef } from '@angular/cdk/dialog';
import { inject, Injectable, type StaticProvider } from '@angular/core';
import { DsDialogConfig } from './ds-dialog-config';
import { DsDialogContainer } from './ds-dialog-container';
import { DsDialogRef } from './ds-dialog-ref';

@Injectable({ providedIn: 'root' })
export class DsDialog {
  private _cdkDialog = inject(Dialog);

  /** Stream that emits when all dialogs are closed. */
  get afterAllClosed() {
    return this._cdkDialog.afterAllClosed;
  }

  /** List of currently open dialog refs. */
  get openDialogs(): readonly DsDialogRef[] {
    return this._dsDialogRefs;
  }

  private _dsDialogRefs: DsDialogRef<any, any>[] = [];

  open<R = unknown, D = unknown, C = unknown>(
    component: ComponentType<C>,
    config?: DsDialogConfig<D>,
  ): DsDialogRef<R, C> {
    const userConfig = config ?? {};

    let dsRef!: DsDialogRef<R, C>;

    const cdkConfig: any = {
      autoFocus: 'first-tabbable',
      restoreFocus: true,
      hasBackdrop: true,
      role: 'dialog',
      ariaModal: true,
      ...userConfig,
      container: DsDialogContainer,
      providers: (
        cdkDialogRef: DialogRef<R, C>,
        _config: unknown,
        container: CdkDialogContainer,
      ): StaticProvider[] => {
        dsRef = new DsDialogRef<R, C>(cdkDialogRef);
        return [
          { provide: DsDialogRef, useValue: dsRef },
          { provide: DsDialogContainer, useValue: container },
        ];
      },
    };

    this._cdkDialog.open(component, cdkConfig);

    this._dsDialogRefs.push(dsRef);
    dsRef.closed.subscribe(() => {
      const index = this._dsDialogRefs.indexOf(dsRef);
      if (index > -1) {
        this._dsDialogRefs.splice(index, 1);
      }
    });

    return dsRef;
  }

  /** Closes all currently open dialogs. */
  closeAll(): void {
    this._cdkDialog.closeAll();
  }
}
