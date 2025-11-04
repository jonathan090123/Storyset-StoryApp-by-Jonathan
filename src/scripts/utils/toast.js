// Simple toast utility
export function showToast(message, type = 'success', duration = 3500) {

  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '10002';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '12px';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;

  container.appendChild(toast);


  requestAnimationFrame(() => toast.classList.add('show'));

  const tidy = () => {
    toast.classList.remove('show');
    // remove after transition
    setTimeout(() => {
      if (toast && toast.parentNode) toast.parentNode.removeChild(toast);
      // remove empty container
      if (container && container.childElementCount === 0 && container.parentNode) container.parentNode.removeChild(container);
    }, 350);
  };

  const timeoutId = setTimeout(tidy, duration);

  toast.addEventListener('click', () => {
    clearTimeout(timeoutId);
    tidy();
  });

  return {
    dismiss: tidy,
  };
}

export function showSuccess(message, duration) {
  return showToast(message, 'success', duration);
}

export function showError(message, duration) {
  return showToast(message, 'error', duration);
}
