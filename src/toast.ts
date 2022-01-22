export enum ToastType {
  Success = 'success',
  Info = 'info',
  Error = 'error',
}

export default class Toaster {
  private isInitialized = false;
  private container: HTMLElement | null = null;

  initialize(): HTMLElement {
    if (this.isInitialized) return this.container;

    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    this.container.className = 'toaster';
    this.container.setAttribute('aria-atomic', 'false');
    this.container.setAttribute('aria-live', 'assertive');

    this.isInitialized = true;
    return this.container;
  }

  destroy() {
    this.container.remove();
  }

  toast(message: string, type = ToastType.Info, duration = 5000) {
    const container = this.initialize();
    const toast = document.createElement('div');
    container.appendChild(toast);
    toast.className = `toast toast--${type} toast--enter`;
    toast.textContent = message;
    setTimeout(() => {
      requestAnimationFrame(() => {
        toast.classList.remove('toast--enter');
      });
    }, 0);
    setTimeout(() => {
      requestAnimationFrame(() => {
        toast.classList.add('toast--exit');
        // If the transition starts playing within 10ms, wait for it to
        // end before removing the element from the DOM
        const timeout = setTimeout(() => {
          // toast.remove();
        }, 10);
        toast.addEventListener(
          'transitionstart',
          () => {
            clearTimeout(timeout);
            toast.addEventListener(
              'transitionend',
              () => {
                toast.remove();
              },
              { once: true },
            );
          },
          { once: true },
        );
      });
    }, duration);
  }
}
