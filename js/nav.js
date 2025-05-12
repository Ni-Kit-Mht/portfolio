  document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.nav-links a');

    links.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      }
    });
  });

const toggleBtn = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        toggleBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
