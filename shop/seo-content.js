class SEOContent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        .seo-content {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 0 1rem;
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        
        .seo-content h2 {
          color: #2c3e50;
          font-size: 1.8rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        .seo-content h3 {
          color: #34495e;
          font-size: 1.4rem;
          margin-top: 1.5rem;
          margin-bottom: 0.8rem;
        }
        
        .seo-content p {
          margin-bottom: 1rem;
          text-align: justify;
        }
        
        .seo-content ul {
          margin-bottom: 1rem;
          padding-left: 2rem;
        }
        
        .seo-content li {
          margin-bottom: 0.5rem;
        }
        
        .seo-content strong {
          color: #2c3e50;
        }
        
        .product-categories {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin: 1.5rem 0;
        }
        
        .category-box {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #3498db;
        }
        
        .location-info {
          background: #e8f4f8;
          padding: 1.5rem;
          border-radius: 8px;
          margin: 1.5rem 0;
        }
        
        @media (max-width: 768px) {
          .seo-content h2 {
            font-size: 1.5rem;
          }
          
          .seo-content h3 {
            font-size: 1.2rem;
          }
        }
      </style>
      
      <div class="seo-content">
        <h2>A.N. Stationery - Your Premium Stationery Shop in Nepal</h2>
        <p>
          Welcome to <strong>A.N. Stationery</strong>, Nepal's trusted destination for high-quality stationery products. 
          Whether you're a student, professional, artist, or business owner, we offer an extensive collection of 
          office supplies, school materials, writing instruments, and creative tools to meet all your needs.
        </p>
        
        <h3>Wide Range of Stationery Products</h3>
        <div class="product-categories">
          <div class="category-box">
            <strong>Writing Instruments</strong>
            <p>Pens (ink, bullet, gel, ball, pilot, roller), pencils, markers, highlighters, brush pen, sign pen</p>
          </div>
          <div class="category-box">
            <strong>Student and Teacher Accessories</strong>
            <p>Stick file, Refill, Ink pot, Bullet ink packets, Ribbons, Hair clips, School tops (Black, White), Key ring, Stickers, Duster, Protactor, Scale (Ruler), Compass, Study table, White Board, Engineering Drawing Pencils, ID card holders</p>
          </div>
          <div class="category-box">
            <strong>Paper Products</strong>
            <p>Notebooks (english, nepali, maths, drawing, science), copy papers, loose sheets, journals, sketchbooks, color papers, glitter paper, a4 papers, drawing papers, chart papers, practical sheets, chemistry notebook</p>
          </div>
          <div class="category-box">
            <strong>Office Supplies</strong>
            <p>Files (Record, 2 ring, display), folders, tray, staplers and pins, clips (paper, plastic), pins (thumb, push), carbon paper, papers (a4, a3), bill pads (single, double), ledger, day book, attendance book, cash book, stock book, registers</p>
          </div>
          <div class="category-box">
            <strong>Art Supplies</strong>
            <p>Colors (poster, water, febric), brushes, canvas, palets, craft items, cardboards, crayons, colorful markers, colorful sign pens, pencil colors, chalk, Scissors, Paper cutters</p>
          </div>
        
          <div class="category-box">
            <strong>School Accessories</strong>
            <p>Shoes (Black, White), School bags, School Socks, Geometry box, Pencil (box, purse (plastic, cloth)), White board</p>
          </div>
          <div class="category-box">
            <strong>Household Accessories</strong>
            <p>Sticky Hanger pins, fevikwik, super glue, soap, shampoo, perfume, lotion, room freshner, comb, tooth brush, shoe brush, water bottles, battery, ear buds, umbrella, fiber bags</p>
          </div>
        
          <div class="category-box">
            <strong>Extra Accessories</strong>
            <p>Khada (Ceremonial Scarf), Hankerchief, Hankey, Black Tape, Cartoon Tape, Binding Tape, Cello Tape (Water Tape), Paper Tape (Masking Tape), tape like Price Tags, Nano Tape, Double Tape, Wrapping Paper, Bouquet paper, Earphones, Paper cutter blades</p>
          </div>
          <div class="category-box">
            <strong>Games</strong>
            <p>Board and pieces (carrom, ludo, chess), Badminton, Cricket, Table tennis (bat and ball), Skipping, Hula hoop, Footballs (Soccer), Basketballs, Volleyballs, Rubik's cube, UNO cards, pokemon cards, playing cards (poker), Babelet, Figid Spinner</p>
          </div>
          <div class="category-box">
            <strong>Kids items and toys</strong>
            <p>Slime, Clay, Bubbles, Remote control cars, balloons, small toys (cars, trucks, bikes, dozer), battery toys (Dancing monkey, cars), dolls, helicopter, stacking rings, legos, pretend-play game (bhadakuti)</p>
          </div>
          <div class="category-box">
            <strong>Gift and Party items</strong>
            <p>Clocks, Watches, Studying Gift Sets, Diary, Glassed gifts, Party popper, Balloons, Candles</p>
          </div>
          <div class="category-box">
            <strong>Project materials</strong>
            <p>9V battery, fan, motor, LEDs, batter and motor connection wire, glue gun (small, bigger), glue sticks (thin, thick)</p>
          </div>
          <div class="category-box">
            <strong>Music and Instruments, Fitness</strong>
            <p>Guitar strings, Capo, Pick, Handgrip, Exercise balls, Sponge balls</p>
          </div>
          <div class="category-box">
            <strong>Printing and online services</strong>
            <p>Frames for (a4 sized Photos, a4 sized Certificates), Scanning, Glossy Photo Printing, Plain paper printing (Color, Black and White), Photocopy (Color, Black and White), NID form, Free Wi-Fi for time being</p>
          </div>
          <div class="category-box">
            <strong>Other services in Detail</strong>
            <p>Normal Tape Binding upto 120 pages (70gsm paper), Lamination upto a4 size paper, Framing, Color (Printing, Photocopy) upto a4 size papers, Color Scanning upto a3 paper size, Black and White (Printing, Photocopy) upto a3 size papers, Glossy photo printing upto a4 size paper, Gift wrapping</p>
          </div>

        </div>
        <h3>Why Choose A.N. Stationery?</h3>
        <ul>
          <li><strong>Quality Products:</strong> We source premium stationery items from trusted brands to ensure durability and performance</li>
          <li><strong>Competitive Prices:</strong> Get the best value for your money with our affordable pricing and regular discounts</li>
          <li><strong>Wide Selection:</strong> From basic school supplies to specialized office equipment, we have everything under one roof</li>
          <li><strong>Easy Shopping:</strong> Browse our online catalog, check availability, and find exactly what you need with our search feature</li>
          <li><strong>Updated Inventory:</strong> Our stock information is regularly updated to show current availability and new arrivals</li>
        </ul>
        
        <div class="location-info">
          <h3>Serving Nepal with Quality Stationery</h3>
          <p>
            Based in <strong>Imadol, Lalitpur, Nepal</strong>, A.N. Stationery has been serving customers across the nation 
            with reliable stationery solutions. We understand the needs of Nepali students, professionals, and businesses, 
            offering products that combine international quality with local accessibility.
          </p>
        </div>
        
        <h3>Shop by Category</h3>
        <p>
          Our comprehensive online catalog makes it easy to find exactly what you need. Use our search function to 
          quickly locate specific items, or browse through our organized product listings. Each product page includes 
          detailed descriptions, pricing information, stock availability, and customer ratings to help you make 
          informed decisions.
        </p>
        
        <h3>Student Supplies</h3>
        <p>
          Students will find everything needed for academic success - from basic notebooks and pens to specialized 
          geometry sets, calculators, and art supplies for creative projects. We stock products suitable for all 
          education levels, from primary school to university.
        </p>
        
        <h3>Professional Office Solutions</h3>
        <p>
          Businesses and professionals can rely on A.N. Stationery for their office supply needs. We offer corporate 
          stationery, filing systems, presentation materials, and organizational tools that help maintain productive 
          workspaces.
        </p>
        
        <h3>Keywords: Stationery Nepal, Office Supplies Kathmandu</h3>
        <p>
          <em>
            Looking for stationery in Nepal? A.N. Stationery offers notebooks, pens, office supplies, school materials, 
            art supplies, and more. Shop quality stationery products online in Lalitpur, Nepal. Best prices on 
            writing instruments, paper products, and office equipment.
          </em>
        </p>
      </div>
    `;
  }
}

customElements.define('seo-content', SEOContent);
