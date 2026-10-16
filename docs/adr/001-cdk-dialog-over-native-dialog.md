# ADR-001: Use Angular CDK Dialog instead of the native `<dialog>` element

**Date:** 2026-10-16
**Status:** Accepted

## Context

The design system needs a modal dialog component that is fully accessible (WCAG 2.1 AA), works in Angular's zoneless mode, and can be reused across consumer applications.

The initial implementation wrapped the native HTML `<dialog>` element in an Angular component (`<ds-dialog>`). This required manually implementing:

- Focus trapping (cycling Tab / Shift+Tab within the dialog)
- Focus restoration to the trigger element on close
- Keyboard handling (Escape to close)
- `aria-labelledby` wiring between the title and the dialog
- Scroll blocking on the body while the dialog is open
- Backdrop rendering and click-to-dismiss
- A JSDOM polyfill for `HTMLDialogElement.showModal()` / `close()` since JSDOM does not implement the `<dialog>` API, making tests fragile

Two alternatives were evaluated:

1. **Keep the native `<dialog>` wrapper** and maintain all the accessibility plumbing in-house.
2. **Delegate to Angular CDK's `Dialog` service** (`@angular/cdk/dialog`), which provides overlay-based positioning, focus trapping (`cdkTrapFocus`), focus restoration, scroll blocking, backdrop management, `aria-modal`, and stacked dialog support out of the box.

## Decision

Use Angular CDK's `Dialog` service as the foundation for the design system's dialog component.

The implementation follows this architecture:

- **`DsDialogContainer`** extends `CdkDialogContainer` to provide a DS-specific host element (`<ds-dialog-container>`) for styling.
- **`DsDialog`** service wraps CDK's `Dialog`, applies DS defaults (`autoFocus: 'first-tabbable'`, `restoreFocus: true`, `hasBackdrop: true`, `role: 'dialog'`, `ariaModal: true`), and returns a `DsDialogRef` instead of CDK's `DialogRef`.
- **`DsDialogRef`** is a thin wrapper around `DialogRef` that exposes only `close()`, `closed`, `componentInstance`, and `id` — keeping the public API surface minimal.
- **Content directives** (`dsDialogTitle`, `dsDialogContent`, `dsDialogActions`, `dsDialogClose`) provide semantic structure and accessibility wiring without coupling consumers to CDK types.
- **`DS_DIALOG_DATA`** re-exports CDK's `DIALOG_DATA` token so consumers never import from `@angular/cdk` directly.
- The API is **service-based** (consumers call `dialog.open(MyComponent, { data })`) rather than component-based (`<ds-dialog [(open)]="...">`), aligning with Angular CDK and Angular Material patterns.

## Consequences

### Benefits

- **~80 lines of accessibility plumbing removed.** Focus trapping, focus restoration, scroll blocking, Escape handling, and `aria-modal` are all handled by CDK with better edge-case coverage (stacked dialogs, shadow DOM, etc.).
- **No JSDOM polyfill needed.** CDK uses overlays (DOM-based) instead of `HTMLDialogElement.showModal()`, so tests run in standard JSDOM without a custom polyfill (`dialog-polyfill.ts` deleted).
- **Stacked dialog support for free.** CDK manages a dialog stack with correct focus order, which the native implementation did not handle.
- **Consistent with the ecosystem.** Angular Material uses the same CDK primitives. Developers familiar with `MatDialog` will recognize the API patterns.
- **Smaller testing surface.** Tests focus on DS-specific behavior (data injection, directive wiring, DS defaults) rather than re-testing focus trapping and keyboard handling that CDK already covers.

### Trade-offs

- **Peer dependency on `@angular/cdk`.** Consumers must install `@angular/cdk` alongside the design system library. This is acceptable since the project already targets Angular CDK as a foundation (see README).
- **Service-based API is a breaking change.** Consumers using the previous `<ds-dialog>` component-based API must migrate to the service pattern. Since the library is pre-1.0 and the only consumer is the showcase app, this is low risk.

## Alternatives Considered

### Keep native `<dialog>` with manual a11y plumbing

Rejected because maintaining focus trapping, scroll blocking, and stacked dialog management in-house is error-prone and duplicates what CDK already provides. The JSDOM polyfill requirement also added fragility to the test suite.

### Use Angular Material's `MatDialog` directly

Rejected because the goal of this project is to build components without depending on a UI framework. Material brings its own theming, typography, and component styles. CDK provides only the behavioral primitives, which is the right abstraction level for a custom design system.
