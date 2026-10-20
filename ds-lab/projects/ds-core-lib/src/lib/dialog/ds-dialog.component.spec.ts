import {
  ApplicationRef,
  Component,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { expectNoA11yViolations } from '../../test-utils/a11y';
import { DsDialogComponent } from './ds-dialog.component';
import { DsDialog } from './ds-dialog.service';
import { DsDialogConfig } from './ds-dialog-config';
import {
  DsDialogTitle,
  DsDialogContent,
  DsDialogActions,
  DsDialogClose,
} from './ds-dialog-content-directives';

@Component({
  imports: [
    DsDialogComponent,
    DsDialogTitle,
    DsDialogContent,
    DsDialogActions,
    DsDialogClose,
  ],
  template: `
    <ds-dialog [(open)]="show" [config]="dialogConfig">
      <h2 dsDialogTitle>Test Title</h2>
      <div dsDialogContent><p>Content</p></div>
      <div dsDialogActions>
        <button dsDialogClose class="cancel-btn">Cancel</button>
        <button [dsDialogClose]="'confirmed'" class="ok-btn">OK</button>
      </div>
    </ds-dialog>
  `,
})
class TestHost {
  show = signal(false);
  dialogConfig: DsDialogConfig = {};
}

describe('DsDialogComponent', () => {
  let appRef: ApplicationRef;
  let dialog: DsDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    appRef = TestBed.inject(ApplicationRef);
    dialog = TestBed.inject(DsDialog);
  });

  afterEach(() => {
    dialog.closeAll();
  });

  function createHost() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    return fixture;
  }

  function tick() {
    appRef.tick();
    appRef.tick();
  }

  it('should not render dialog when open is false', () => {
    createHost();
    tick();

    const container = document.querySelector('ds-dialog-container');
    expect(container).toBeNull();
  });

  it('should open dialog when open becomes true', () => {
    const fixture = createHost();
    fixture.componentInstance.show.set(true);
    tick();

    const container = document.querySelector('ds-dialog-container');
    expect(container).not.toBeNull();
    expect(container?.textContent).toContain('Content');
  });

  it('should close dialog when open becomes false', () => {
    const fixture = createHost();
    fixture.componentInstance.show.set(true);
    tick();

    expect(document.querySelector('ds-dialog-container')).not.toBeNull();

    fixture.componentInstance.show.set(false);
    tick();

    expect(document.querySelector('ds-dialog-container')).toBeNull();
  });

  it('should set open to false when closed via backdrop', () => {
    const fixture = createHost();
    fixture.componentInstance.show.set(true);
    tick();

    const backdrop = document.querySelector(
      '.cdk-overlay-backdrop',
    ) as HTMLElement;
    backdrop?.click();
    tick();

    expect(fixture.componentInstance.show()).toBe(false);
    expect(document.querySelector('ds-dialog-container')).toBeNull();
  });

  it('should set open to false when closed via dsDialogClose', () => {
    const fixture = createHost();
    fixture.componentInstance.show.set(true);
    tick();

    const cancelBtn = document.querySelector(
      '.cancel-btn',
    ) as HTMLButtonElement;
    cancelBtn?.click();
    tick();

    expect(fixture.componentInstance.show()).toBe(false);
  });

  it('DsDialogTitle should set aria-labelledby on the container', () => {
    const fixture = createHost();
    fixture.componentInstance.show.set(true);
    tick();

    const container = document.querySelector('ds-dialog-container');
    const titleEl = document.querySelector('[dsdialogtitle]');

    expect(titleEl).not.toBeNull();
    expect(titleEl?.id).toMatch(/^ds-dialog-title-\d+$/);

    const labelledBy = container?.getAttribute('aria-labelledby');
    expect(labelledBy).toBe(titleEl?.id);
  });

  it('should respect disableClose config', () => {
    const fixture = createHost();
    fixture.componentInstance.dialogConfig = { disableClose: true };
    fixture.componentInstance.show.set(true);
    tick();

    const backdrop = document.querySelector(
      '.cdk-overlay-backdrop',
    ) as HTMLElement;
    backdrop?.click();
    tick();

    expect(fixture.componentInstance.show()).toBe(true);
    expect(document.querySelector('ds-dialog-container')).not.toBeNull();
  });

  it('should close dialog when host component is destroyed', () => {
    const fixture = createHost();
    fixture.componentInstance.show.set(true);
    tick();

    expect(document.querySelector('ds-dialog-container')).not.toBeNull();

    fixture.destroy();
    tick();

    expect(document.querySelector('ds-dialog-container')).toBeNull();
  });

  it('should support re-opening after close', () => {
    const fixture = createHost();

    // Open
    fixture.componentInstance.show.set(true);
    tick();
    expect(document.querySelector('ds-dialog-container')).not.toBeNull();

    // Close
    fixture.componentInstance.show.set(false);
    tick();
    expect(document.querySelector('ds-dialog-container')).toBeNull();

    // Re-open
    fixture.componentInstance.show.set(true);
    tick();
    expect(document.querySelector('ds-dialog-container')).not.toBeNull();
    expect(
      document.querySelector('ds-dialog-container')?.textContent,
    ).toContain('Content');
  });

  it('should have no axe accessibility violations', async () => {
    const fixture = createHost();
    fixture.componentInstance.show.set(true);
    tick();

    const container = document.querySelector(
      'ds-dialog-container',
    ) as HTMLElement;
    expect(container).not.toBeNull();

    await expectNoA11yViolations(container, {
      rules: {
        // CDK overlay lives outside landmark regions by design
        region: { enabled: false },
      },
    });
  });
});
