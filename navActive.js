document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  console.log(currentPath)
  const links = document.querySelectorAll('.nav-links a');
  console.log(links)
  links.forEach(link => {
    console.log(link)
    console.log(link.getAttribute('href'))
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('activeSite');
    }
  });
});
