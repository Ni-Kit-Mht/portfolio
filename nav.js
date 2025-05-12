class MyNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav>
        <div class="nav-container">
          <div class="logo">A.N. Stationery</div>
          <button class="menu-toggle" aria-label="Toggle menu">&#9776;</button>
          <ul class="nav-links">
            <li><a class="aTags" href="/">Home</a></li>
            <li><a class="aTags" href="/shop/">Shop</a></li>
            <li><a class="aTags" href="/services/">Services</a></li>
            <li><a class="aTags" href="/categories/">Categories</a></li>
            <li><a class="aTags" href="/contact/">Contact</a></li>
          </ul>
        </div>
      </nav>
    `;

    // Delay execution to ensure DOM is rendered
    requestAnimationFrame(() => {
      // Normalize path
      const currentPath = window.location.pathname.replace(/\/index\.html$/, '');
console.log('Current path:', currentPath);

      // Highlight active link
      this.querySelectorAll('.nav-links a').forEach(link => {
        console.log('Link:', link.getAttribute('href'));

        if (link.getAttribute('href') === currentPath) {
          link.classList.add('activeSite');
        }
      });

      // Toggle menu
      const toggleButton = this.querySelector(".menu-toggle");
      const navLinks = this.querySelector(".nav-links");
      toggleButton.addEventListener("click", () => {
        navLinks.classList.toggle("active");
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  customElements.define('my-navbar', MyNavbar);
});
