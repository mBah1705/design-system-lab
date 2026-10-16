import axe, { type Result, type RunOptions } from 'axe-core';
import { type ComponentFixture } from '@angular/core/testing';

function formatViolations(violations: Result[]): string {
  return violations
    .map((v) => {
      const nodes = v.nodes
        .map((n) => `    - ${n.html}\n      ${n.failureSummary}`)
        .join('\n');
      return `[${v.impact}] ${v.id}: ${v.help}\n${nodes}`;
    })
    .join('\n\n');
}

/**
 * Run axe-core on the given target and throw if any violations are found.
 *
 * @param target - A ComponentFixture (runs on fixture.nativeElement) or a raw HTMLElement.
 * @param options - Optional axe RunOptions (e.g. to disable specific rules).
 */
export async function expectNoA11yViolations(
  target: ComponentFixture<unknown> | HTMLElement,
  options?: RunOptions,
): Promise<void> {
  const element =
    target instanceof HTMLElement ? target : target.nativeElement;
  const results = await axe.run(element, options ?? {});

  if (results.violations.length > 0) {
    throw new Error(
      `Found ${results.violations.length} accessibility violation(s):\n\n${formatViolations(results.violations)}`,
    );
  }
}

// How to use this function in your Angular component tests:

// import { expectNoA11yViolations } from '../test-utils/a11y';

// // dans le describe, ajoutez :
// it('should be accessible', async () => {
//   await expectNoA11yViolations(fixture);
// });