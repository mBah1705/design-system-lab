import axe, { type Result } from 'axe-core';
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

export async function expectNoA11yViolations(
  fixture: ComponentFixture<unknown>,
): Promise<void> {
  const results = await axe.run(fixture.nativeElement);

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