  document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.nav-links a.aTags');

    links.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('activeSite');
      }
    });
  });
