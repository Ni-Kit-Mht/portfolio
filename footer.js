class MyFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer">
        <div>
          <h3>Contact Us</h3>
          <address>
            Lalitpur, Nepal<br>
            Email: anstationery1@gmail.com<br>
            Phone: +977-9841362176
          </address>
        </div>
        <div>
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <h3>Socials</h3>
          <ul>
            <li><a href="https://www.youtube.com/@anstationery6759">Youtube</a></li>
            <li><a href="https://www.instagram.com/anstationery1/">Instagram</a></li>
            <li><a href="https://www.facebook.com/a.n.stationery.2078">Facebook</a></li>
            <li><a href="https://x.com/Dharmanara24035">X</a></li>
          </ul>
        </div>
        <p>&copy; 2025 A.N. Stationery. All rights reserved.</p>
      </footer>
    `;
  }
}
customElements.define('my-footer', MyFooter);
