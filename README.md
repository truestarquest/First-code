# 🛍️ Premium Tech Store — E-commerce Platform

> **A modern e-commerce front-end demonstrating UI/UX, JavaScript, accessibility and performance work — no framework, no build step.**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-demo-success)

---

## 🔗 Live Demo

🌍 **[premium-concept-ten.vercel.app](https://premium-concept-ten.vercel.app)**

---

## ✨ Key Features

### 🛒 Core E-commerce
- ✅ **Dynamic catalog** — products live in a single flat `PRODUCTS` array; categories: Smartphones, Laptops, Tablets, Accessories
- ✅ **Filters** — price (min/max + slider), brand (checkboxes), availability
- ✅ **Global search** — matches name, brand and category
- ✅ **Sorting** — default, newest, popularity, price (↑↓)

### 🛍️ Shopping Experience
- ✅ **Working cart** — add, remove, change quantity, auto-saved to localStorage
- ✅ **Shipping** — 150 UAH, free from 5000 UAH (`SHIPPING` constant)
- ✅ **Checkout** — form (name, phone, city, Nova Poshta branch), payment choice: cash on delivery or card (demo stub)
- ✅ **Order history** — numbers start at #1001, stored in localStorage
- ✅ **Wishlist** — saved favourite products
- ✅ **Toast notifications** — inline feedback on cart actions
- ✅ **Related products** — suggestions inside the product modal

### 🤖 AEGIS AI — chat consultant
- ✅ **Floating button** (bottom right) with pulse animation + reminder badge after 8 s
- ✅ **Chat panel** — popup on desktop, slide-up bottom sheet on mobile, glassmorphism
- ✅ **Dialog tree** — category → budget → brand → purpose → 1–2 recommendations
- ✅ **Catalog-aware** — reads the same `PRODUCTS` array; budget buckets are computed from real prices
- ✅ **Out-of-stock handling** — the bot says so directly and offers an in-stock alternative
- ✅ **"Add to cart"** straight from chat + **"Details"** (opens the product modal)
- ✅ **Lead capture** — name + phone from chat → `localStorage['aegis_leads']` + `console.log`
- ✅ **Free text** — a keyword router ("apple laptop under 150000") funnels into the same tree

### 📞 Contact & Legal
- ✅ **Sticky contact button** — Telegram, Viber, phone, callback request (bottom right)
- ✅ **Callback form** — name + phone → localStorage (`ptc_callbacks`)
- ✅ **Legal pages** — About, Public Offer, Delivery & Payment, Returns, Warranty (modals, linked from the footer)

### 🎨 User Interface
- ✅ **Light/dark mode** — live theme switching
- ✅ **Bilingual (UA/EN)** — full interface localisation
- ✅ **Breadcrumbs** — navigation trail inside the product modal
- ✅ **Micro-animations** — smooth transitions, skeleton loading, counter bump animation

### 📱 Accessibility & Performance
- ✅ **Lazy loading** — images load as they enter the viewport
- ✅ **Semantic HTML** — `main` landmark, ARIA labels on forms and icon buttons
- ✅ **Responsive design** — mobile, tablet and desktop
- ✅ **No external dependencies** — plain vanilla JS, no React/Vue/jQuery

### 📊 Additional Sections
- ✅ **FAQ** — 5 questions on delivery, warranty and returns
- ✅ **Newsletter** — subscription form
- ✅ **Reviews** — customer feedback section
- ✅ **Benefits** — "Why us" (500+ customers, 100% genuine goods)

---

## 🔌 AEGIS Widget Integration

One tag before `</body>` and you are done:

```html
<script src="aegis-widget.js" defer></script>
```

In this project it already sits in `index.html` **before** the main inline `<script>`
(`defer` guarantees the widget starts after the store catalog is ready).

**No dependencies.** If the store globals exist on the page the widget picks them up;
if they do not, it runs on its own built-in fallback catalog:

| Store global | What it gives the widget | If missing |
|--------------|--------------------------|------------|
| `PRODUCTS` | live products, prices, stock, brands | built-in `FALLBACK_PRODUCTS` |
| `currentLang` | interface language (uk / en) | Ukrainian |
| `addToCart(id)` | "Add to cart" button + store toast and badge | writes straight to `localStorage['ptc_cart']` |
| `openProductModal(id)` | "Details" button | button does nothing |

**Configuration** — the `CONFIG` constant at the top of `aegis-widget.js`
(bot name, localStorage key, "bot is typing" delay, number of recommendations).

**Mini API** for your own on-page buttons:

```javascript
AegisWidget.open();      // open the chat
AegisWidget.close();
AegisWidget.restart();   // reset the dialog
AegisWidget.leads();     // array of collected leads
```

> ⚠️ This is a **standalone demo**: the dialog runs entirely on the front end, with no AEGIS backend.
> To wire up a real AI, replace `routeFreeText()` with a `fetch()` to `/api/chat`,
> and `saveLead()` with a POST to your CRM.

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **Styling** | CSS Grid, Flexbox, CSS Variables |
| **Images** | Cloudinary CDN (lazy loading, responsive) |
| **Storage** | LocalStorage (`ptc_cart`, `ptc_wishlist`, `ptc_orders`, `ptc_callbacks`, `aegis_leads`) |
| **SEO** | Semantic HTML, meta tags |
| **Hosting** | Vercel |

---

## 🚀 Running Locally

No build step and no dependencies — any static file server works.

### Option 1: Python HTTP server (simplest)
```bash
python3 -m http.server 8000
```

### Option 2: Node.js HTTP server
```bash
npx http-server -p 8000 -c-1
```

### Option 3: Vercel CLI (same as production)
```bash
npx vercel dev
```

Then open <http://localhost:8000>.

---

## 📂 Project Structure

```
premium-tech-store/
├── index.html          # The whole store — markup, styles and logic in one file
├── aegis-widget.js     # AEGIS AI chat consultant (standalone, drop-in)
└── README.md           # This file
```

---

## 🎯 Key Implementation Details

### 1. Product catalog (flat array)
```javascript
const PRODUCTS = [
    {
        id: 'iphone-15-pro-max-256',
        name: 'iPhone 15 Pro Max 256GB Space Black',
        brand: 'Apple',
        cat: 'smartphones',        // smartphones | laptops | tablets | accessories
        price: 44500,              // number, not a string
        inStock: true,
        popularity: 98,            // drives "sort by popularity"
        added: '2026-05-20',       // drives "newest first"
        img: 'https://res.cloudinary.com/...',
        descUk: '...', descEn: '...'
    }
];
```
To add a product, push one object into the array. Categories, brand filters, counters and the marquee are all derived from the data automatically.

### 2. One filter state → one render
```javascript
const filters = { cat: 'all', search: '', sort: 'default', brands: [], inStockOnly: false, priceMin: 0, priceMax: 0 };

function getFilteredProducts() {
    // search / category / brands / availability / price range, then applySort()
}
```

### 3. Cart and shipping
```javascript
const SHIPPING = { cost: 150, freeFrom: 5000 };

function cartTotals() {
    const subtotal = /* sum of line items */;
    const shipping = (subtotal === 0 || subtotal >= SHIPPING.freeFrom) ? 0 : SHIPPING.cost;
    return { subtotal, shipping, total: subtotal + shipping };
}
```

### 4. Cart persistence
```javascript
// survives a page reload
localStorage.setItem('ptc_cart', JSON.stringify(cart));
let cart = JSON.parse(localStorage.getItem('ptc_cart') || '[]');
```
Stale entries are pruned on load, so removing a product from `PRODUCTS` cannot break an existing cart.

### 5. Lazy image loading
```html
<img
    src="..."
    loading="lazy"
    decoding="async"
    class="lazy-img"
    onload="this.classList.add('loaded')"
/>
```

---

## 🎨 Design Decisions

### Color Palette
- **Primary:** `#c9a961` (premium gold)
- **Background dark:** `#0a0a0c` (deep black)
- **Background light:** `#fafafa`
- **Accent red:** `#e63946` (CTA buttons)

### Typography
- **Headings:** Orbitron (futuristic)
- **Body:** Montserrat (clean, modern)
- **Accent:** Syncopate

### UX Principles
1. **Performance first** — lazy loading, CSS variables, minimal repaints
2. **Accessibility by default** — semantic landmarks, ARIA labels, keyboard-reachable controls
3. **Mobile-first** — built for mobile, scaled up to desktop
4. **No bloat** — no React, Vue or jQuery; plain vanilla JS

> Note: the store is a client-rendered SPA — the catalog, cart and navigation all require JavaScript.

---

## 📱 Browser Support

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome  | ✅ 90+  | ✅ 90+ |
| Firefox | ✅ 88+  | ✅ 88+ |
| Safari  | ✅ 14+  | ✅ 14+ |
| Edge    | ✅ 90+  | ✅ 90+ |

---

## 📚 Backend Integration

The current version is **front-end only**, but it is structured for a backend swap:

```javascript
async function fetchProducts() {
    const response = await fetch('https://api.yourserver.com/products');
    return response.json();   // replaces the PRODUCTS array
}
```

> ⚠️ Product fields are currently interpolated into `innerHTML` without escaping.
> That is safe for a hard-coded catalog, but **escape every field** (see the `esc()`
> helper in `aegis-widget.js`) before feeding this from an API or user-generated content.

---

## 🛣️ Roadmap

- [ ] Backend integration (Node.js/Python API)
- [ ] Database (PostgreSQL/MongoDB)
- [ ] User authentication (sign-up, login, profiles)
- [ ] Payment gateway (Stripe, LiqPay)
- [ ] Order tracking
- [ ] Admin dashboard
- [ ] Product reviews/ratings system
- [ ] Analytics

---

## 🤝 Contributing

This is a portfolio project, but ideas are welcome:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT.

---

## 👤 Author

**[@truestarquest](https://github.com/truestarquest)**

---

## 📞 Support

Found a bug or have a question? Open an issue on GitHub with a clear description and a screenshot if you have one.

---

<div align="center">

**Made with ❤️ in Ukraine**

</div>
