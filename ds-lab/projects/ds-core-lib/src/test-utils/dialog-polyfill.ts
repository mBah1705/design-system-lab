/**
 * JSDOM polyfill for HTMLDialogElement.
 *
 * JSDOM exposes HTMLDialogElement but does not implement showModal() or close().
 * Call `installDialogPolyfill()` in test setup to patch the prototype.
 */
export function installDialogPolyfill(): void {
  if (
    typeof HTMLDialogElement !== 'undefined' &&
    typeof HTMLDialogElement.prototype.showModal !== 'function'
  ) {
    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
      if (this.hasAttribute('open')) {
        throw new DOMException(
          "Failed to execute 'showModal' on 'HTMLDialogElement': The element already has an 'open' attribute, and therefore cannot be opened modally.",
          'InvalidStateError',
        );
      }
      this.setAttribute('open', '');
    };

    HTMLDialogElement.prototype.close = function (
      this: HTMLDialogElement,
      returnValue?: string,
    ) {
      this.removeAttribute('open');
      if (returnValue !== undefined) {
        this.returnValue = returnValue;
      }
      this.dispatchEvent(new Event('close'));
    };
  }
}
