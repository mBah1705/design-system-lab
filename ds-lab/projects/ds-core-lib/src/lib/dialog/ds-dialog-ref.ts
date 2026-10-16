import { DialogRef } from '@angular/cdk/dialog';
import { Observable } from 'rxjs';

export class DsDialogRef<R = unknown, C = unknown> {
  /** @internal */
  private _cdkRef: DialogRef<any, any>;

  constructor(cdkRef: DialogRef<R, C>) {
    this._cdkRef = cdkRef;
  }

  /** Unique ID of the dialog. */
  get id(): string {
    return this._cdkRef.id;
  }

  /** The component instance inside the dialog. */
  get componentInstance(): C | null {
    return this._cdkRef.componentInstance;
  }

  /** Emits the result when the dialog is closed. */
  get closed(): Observable<R | undefined> {
    return this._cdkRef.closed;
  }

  /** Closes the dialog with an optional result. */
  close(result?: R): void {
    this._cdkRef.close(result);
  }
}
