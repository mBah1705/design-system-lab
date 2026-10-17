import {
  ApplicationRef,
  Component,
  inject,
  provideZonelessChangeDetection,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { expectNoA11yViolations } from '../../test-utils/a11y';
import { DsDialog } from './ds-dialog.service';
import { DsDialogRef } from './ds-dialog-ref';
import { DS_DIALOG_DATA } from './ds-dialog-tokens';
import {
  DsDialogTitle,
  DsDialogContent,
  DsDialogActions,
  DsDialogClose,
} from './ds-dialog-content-directives';

@Component({
  imports: [DsDialogTitle, DsDialogContent, DsDialogActions, DsDialogClose],
  template: `
    <h2 dsDialogTitle>Dialog Title</h2>
    <div dsDialogContent>
      <p>{{ data.message }}</p>
    </div>
    <div dsDialogActions>
      <button dsDialogClose class="cancel-btn">Cancel</button>
      <button [dsDialogClose]="true" class="ok-btn">OK</button>
    </div>
  `,
})
class TestDialogComponent {
  data = inject(DS_DIALOG_DATA) as { message: string };
}

@Component({
  imports: [DsDialogTitle, DsDialogContent, DsDialogActions, DsDialogClose],
  template: `
    <ng-template #tplDialog>
      <h2 dsDialogTitle>Template Title</h2>
      <div dsDialogContent><p>Template content</p></div>
      <div dsDialogActions>
        <button [dsDialogClose]="'tpl-result'" class="tpl-ok-btn">OK</button>
      </div>
    </ng-template>
  `,
})
class TemplateDialogHost {
  @ViewChild('tplDialog') tplDialog!: TemplateRef<unknown>;
  vcr = inject(ViewContainerRef);
}

describe('DsDialog', () => {
  let dialog: DsDialog;
  let appRef: ApplicationRef;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    dialog = TestBed.inject(DsDialog);
    appRef = TestBed.inject(ApplicationRef);
  });

  afterEach(() => {
    dialog.closeAll();
  });

  function openAndTick(data: { message: string }) {
    const ref = dialog.open(TestDialogComponent, { data });
    // First tick renders the component content (including DsDialogTitle's ngOnInit
    // which calls _addAriaLabelledBy). Second tick propagates the updated host binding.
    appRef.tick();
    appRef.tick();
    return ref;
  }

  it('should open a dialog and return a DsDialogRef', () => {
    const ref = openAndTick({ message: 'hello' });

    expect(ref).toBeInstanceOf(DsDialogRef);
    expect(ref.id).toBeTruthy();
  });

  it('should pass data via DS_DIALOG_DATA', () => {
    const ref = openAndTick({ message: 'test data' });

    expect(ref.componentInstance?.data).toEqual({ message: 'test data' });
  });

  it('should close and emit result via closed', async () => {
    const ref = openAndTick({ message: 'hello' });

    const resultPromise = firstValueFrom(ref.closed);
    ref.close('my-result');

    const result = await resultPromise;
    expect(result).toBe('my-result');
  });

  it('should close all dialogs with closeAll()', () => {
    dialog.open(TestDialogComponent, { data: { message: '1' } });
    dialog.open(TestDialogComponent, { data: { message: '2' } });

    expect(dialog.openDialogs.length).toBe(2);

    dialog.closeAll();

    expect(dialog.openDialogs.length).toBe(0);
  });

  it('DsDialogTitle should set aria-labelledby on the container', () => {
    openAndTick({ message: 'hello' });

    const container = document.querySelector('ds-dialog-container');
    expect(container).not.toBeNull();

    // Verify the h2 element has the generated ID
    const titleEl = document.querySelector('[dsdialogtitle]');
    expect(titleEl).not.toBeNull();
    expect(titleEl?.id).toMatch(/^ds-dialog-title-\d+$/);

    // The container should reference the title via aria-labelledby
    const labelledBy = container?.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    expect(labelledBy).toBe(titleEl?.id);
  });

  it('DsDialogClose should close the dialog on click', async () => {
    const ref = openAndTick({ message: 'hello' });

    const closedPromise = firstValueFrom(ref.closed);

    const cancelBtn = document.querySelector(
      '.cancel-btn',
    ) as HTMLButtonElement;
    cancelBtn?.click();

    await closedPromise;
    expect(dialog.openDialogs.length).toBe(0);
  });

  it('DsDialogClose should pass result value when closing', async () => {
    const ref = openAndTick({ message: 'hello' });

    const closedPromise = firstValueFrom(ref.closed);

    const okBtn = document.querySelector('.ok-btn') as HTMLButtonElement;
    okBtn?.click();

    const result = await closedPromise;
    expect(result).toBe(true);
  });

  it('should apply DS defaults (hasBackdrop)', () => {
    openAndTick({ message: 'hello' });

    const backdrop = document.querySelector('.cdk-overlay-backdrop');
    expect(backdrop).not.toBeNull();
  });

  it('should respect disableClose option', () => {
    const ref = dialog.open(TestDialogComponent, {
      data: { message: 'hello' },
      disableClose: true,
    });

    const backdrop = document.querySelector(
      '.cdk-overlay-backdrop',
    ) as HTMLElement;
    backdrop?.click();

    expect(dialog.openDialogs.length).toBe(1);
    ref.close();
  });

  it('should have no axe accessibility violations', async () => {
    openAndTick({ message: 'accessible dialog' });

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

  describe('TemplateRef-based dialog', () => {
    function createTemplateHost() {
      const fixture = TestBed.createComponent(TemplateDialogHost);
      fixture.detectChanges();
      return fixture.componentInstance;
    }

    it('should open a dialog with a TemplateRef', () => {
      const host = createTemplateHost();
      const ref = dialog.open(host.tplDialog, {
        viewContainerRef: host.vcr,
      });
      appRef.tick();
      appRef.tick();

      expect(ref).toBeInstanceOf(DsDialogRef);
      const content = document.querySelector('ds-dialog-container');
      expect(content?.textContent).toContain('Template content');
    });

    it('should return DsDialogRef with null componentInstance for TemplateRef', () => {
      const host = createTemplateHost();
      const ref = dialog.open(host.tplDialog, {
        viewContainerRef: host.vcr,
      });
      appRef.tick();

      expect(ref.componentInstance).toBeNull();
    });

    it('content directives should work inside TemplateRef-based dialog', async () => {
      const host = createTemplateHost();
      const ref = dialog.open(host.tplDialog, {
        viewContainerRef: host.vcr,
      });
      appRef.tick();
      appRef.tick();

      const closedPromise = firstValueFrom(ref.closed);

      const okBtn = document.querySelector('.tpl-ok-btn') as HTMLButtonElement;
      expect(okBtn).not.toBeNull();
      okBtn.click();

      const result = await closedPromise;
      expect(result).toBe('tpl-result');
    });
  });
});
