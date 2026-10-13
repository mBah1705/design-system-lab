import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DsDialog } from './ds-dialog';
import { expectNoA11yViolations } from '../../test-utils/a11y';

@Component({
  imports: [DsDialog],
  template: `
    <button (click)="open.set(true)" #trigger>Open</button>
    <ds-dialog [(open)]="open" [triggerRef]="trigger">
      <h2 id="dialog-title">Title</h2>
      <p id="dialog-desc">Description</p>
      <input type="text" aria-label="Name" />
      <button class="action-btn">OK</button>
      <button class="close-btn" (click)="open.set(false)">Cancel</button>
    </ds-dialog>
  `,
})
class TestHost {
  open = signal(false);
}

describe('DsDialog', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let triggerBtn: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    await fixture.whenStable();

    triggerBtn = fixture.nativeElement.querySelector('button');
  });

  async function openDialog(): Promise<void> {
    host.open.set(true);
    await fixture.whenStable();
  }

  it('should move focus inside dialog on open', async () => {
    await openDialog();

    const dialogEl = fixture.nativeElement.querySelector('ds-dialog');
    expect(dialogEl.contains(document.activeElement)).toBe(true);
  });

  it('should trap Tab cycle inside dialog', async () => {
    await openDialog();

    const focusableEls: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll(
        'ds-dialog input, ds-dialog button',
      ),
    );
    expect(focusableEls.length).toBeGreaterThan(0);

    // Focus the last focusable element
    const lastEl = focusableEls[focusableEls.length - 1];
    lastEl.focus();
    expect(document.activeElement).toBe(lastEl);

    // Press Tab — focus should cycle back to the first focusable element
    lastEl.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }),
    );
    await fixture.whenStable();

    expect(document.activeElement).toBe(focusableEls[0]);
  });

  it('should close on Escape and restore focus to trigger', async () => {
    await openDialog();

    document.activeElement?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    await fixture.whenStable();

    expect(host.open()).toBe(false);
    expect(document.activeElement).toBe(triggerBtn);
  });

  it('should have aria-labelledby pointing to an existing element', async () => {
    await openDialog();

    const dialogEl = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialogEl).not.toBeNull();

    const labelledBy = dialogEl?.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();

    const labelEl = fixture.nativeElement.querySelector(`#${labelledBy}`);
    expect(labelEl).not.toBeNull();
  });

  it('should have no axe accessibility violations', async () => {
    await openDialog();
    await expectNoA11yViolations(fixture);
  });
});
