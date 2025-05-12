class MyNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav>
        <div class="nav-container">
          <div class="logo">A.N. Stationery</div>
          <button class="menu-toggle" aria-label="Toggle menu">&#9776;</button>
          <ul class="nav-links">
            <li><a class="aTags" href="/">Home</a></li>
            <li><a class="aTags" href="/shop">Shop</a></li>
            <li><a class="aTags" href="/services">Services</a></li>
            <li><a class="aTags" href="/categories">Categories</a></li>
            <li><a class="aTags" href="/contact">Contact</a></li>
          </ul>
        </div>
      </nav>
    `;

    // ✅ Highlight current page (scoped inside the component)
    const currentPath = window.location.pathname;
    this.querySelectorAll('.nav-links a').forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('activeSite');
      }
    });

    // ✅ Toggle menu for mobile
    const toggleButton = this.querySelector(".menu-toggle");
    const navLinks = this.querySelector(".nav-links");
    toggleButton.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }
}
customElements.define('my-navbar', MyNavbar);
