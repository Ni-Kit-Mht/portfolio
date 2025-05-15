class MyFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        .footer {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          background-color: #1e293b;
          color: #f8fafc;
          padding: 2rem;
          font-family: sans-serif;
          gap: 2rem;
          border-top: 4px solid #0ea5e9;
        }
        .footer > div {
          flex: 1 1 200px;
        }
        .footer h3 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          color: #38bdf8;
        }
        .footer address, .footer ul {
          font-style: normal;
          line-height: 1.6;
          margin: 0;
          padding: 0;
        }
        .footer ul {
          list-style: none;
        }
        .footer a {
          color: #f1f5f9;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .footer a:hover {
          color: #0ea5e9;
        }
        .footer p {
          width: 100%;
          text-align: center;
          margin-top: 2rem;
          font-size: 0.9rem;
          color: #94a3b8;
        }
        @media (max-width: 768px) {
          .footer {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .footer > div {
            flex: 1 1 auto;
          }
        }
      </style>

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
