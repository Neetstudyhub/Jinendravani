window.addEventListener("load", () => {
  const splash = document.getElementById('splash-screen');
  const app = document.getElementById('app');
  
  // Check if splash was already shown
  const splashShown = localStorage.getItem('splashShown');
  
  if (!splashShown) {
    // Show splash screen for 2 seconds
    setTimeout(() => {
      splash.style.opacity = '0';
      setTimeout(() => {
        splash.classList.add('hidden');
        app.classList.remove('hidden');
        localStorage.setItem('splashShown', 'true'); // Mark as shown
      }, 00);
    }, 1000);
  } else {
    // Skip splash screen
    splash.classList.add('hidden');
    app.classList.remove('hidden');
  }
});