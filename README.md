# 🛍️ Premium Tech Store — E-commerce Platform

> **Сучасний e-commerce проєкт демонструючи full-stack front-end навички: UI/UX, JavaScript, доступність та performance**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-production%20ready-success)

---

## 📸 Скріншоти

### Responsive Design (Desktop / Tablet / Mobile)
![Responsive Showcase](portfolio_collage.png)

### Lighthouse Performance Audit
- **Performance:** 100/100 ⚡
- **Accessibility:** 96/100 ♿
- **Best Practices:** 96/100 ✅
- **SEO:** 100/100 🔍

[View Full Lighthouse Report](lighthouse-report.html)

---

## ✨ Ключові фічі

### 🛒 Core E-commerce
- ✅ **Динамічний каталог** — 7 товарів у 3 категоріях (Apple, Gaming, Audio)
- ✅ **Підкатегорії** — точна фільтрація товарів (iPhone, MacBook, Миші, тощо)
- ✅ **Глобальний пошук** — миттєвий пошук по всіх категоріях
- ✅ **Сортування** — за замовчуванням, новизною, ціною (↑↓)

### 🛍️ Shopping Experience
- ✅ **Функціональний кошик** — додавання, видалення, зміна кількості, auto-save у localStorage
- ✅ **Wishlist (Обране)** — зберігання улюблених товарів
- ✅ **Toast-сповіщення** — гарні UI-оповіщення про дії (добавили в кошик, тощо)
- ✅ **Related Products** — пропозиція схожих товарів у модалці

### 🎨 User Interface
- ✅ **Light/Dark mode** — перемикання тем в реальному часі
- ✅ **Bilingual (UA/EN)** — повна локалізація інтерфейсу
- ✅ **Breadcrumbs** — навігаційний ланцюжок у модалці товару
- ✅ **Micro-animations** — плавні переходи, skeleton loading, bump-анімація лічильників
- ✅ **Floating Chat Button** — швидкий доступ до контакту (Instagram)

### 📱 Accessibility & Performance
- ✅ **Lazy Loading** — зображення завантажуються по мірі появи
- ✅ **WCAG 2.1 Compliant** — доступність для користувачів із обмеженнями
- ✅ **Responsive Design** — ідеально працює на мобільних, планшетах, десктопі
- ✅ **Semantic HTML** — main landmark, aria-labels для форм
- ✅ **No external dependencies** — чистий Vanilla JS, без React/Vue

### 📊 Additional Sections
- ✅ **FAQ** — 5 питань про доставку, гарантію, повернення
- ✅ **Newsletter** — форма підписки на новинки
- ✅ **Product Reviews** — секція з відгуками клієнтів
- ✅ **Benefits Section** — Чому саме ми (500+ клієнтів, 100% оригіналу)

---

## 🛠️ Tech Stack

| Категорія | Технологія |
|-----------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **Styling** | CSS Grid, Flexbox, CSS Variables |
| **Images** | Cloudinary CDN (lazy loading, responsive) |
| **Storage** | LocalStorage (cart, wishlist, theme) |
| **SEO** | Semantic HTML, Meta tags, sitemap.xml, robots.txt |
| **Performance** | Code splitting, image optimization, minimal DOM |
| **Hosting** | Vercel (serverless) |

---

## 📊 Lighthouse Metrics

```
✅ Performance:      100/100
✅ Accessibility:     96/100
✅ Best Practices:    96/100
✅ SEO:              100/100

⏱️  First Contentful Paint:    0.5s
⏱️  Largest Contentful Paint:  1.2s
⏱️  Cumulative Layout Shift:   0.0
```

---

## 🚀 Як запустити локально

### Prerequisites
- Node.js 14+ або Python 3+

### Option 1: Python HTTP Server (найпростіше)
```bash
# Розпакуй файли проєкту
cd premium-tech-store

# Запусти локальний сервер
python3 -m http.server 8000

# Відкрий у браузері
open http://localhost:8000
```

### Option 2: Node.js HTTP Server
```bash
npx http-server -p 8000 -c-1
open http://localhost:8000
```

### Option 3: Vercel CLI (как на прод-хосте)
```bash
npm install -g vercel
vercel dev
```

---

## 📂 Структура Проєкту

```
premium-tech-store/
├── index_new.html          # Main application
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Search engines crawl rules
├── README.md               # This file
├── portfolio_collage.png    # Responsive design showcase
└── screenshot_*.png        # Full-page screenshots (desktop/tablet/mobile)
```

---

## 🎯 Key Implementation Details

### 1. **Dynamic Product Database**
```javascript
const productsDatabase = {
    apple: [
        {
            name: "iPhone 15 Pro Max...",
            price: "44 500 UAH",
            subcat: "iphone",      // Для фільтрації підкатегорій
            img: "https://res.cloudinary.com/...",
            descUk: "...",
            descEn: "..."
        }
    ]
}
```

### 2. **Smart Search Across All Categories**
```javascript
function handleSearch(query) {
    // Пошук по всім категоріям одночасно
    const results = Object.keys(productsDatabase).flatMap(cat => {
        return productsDatabase[cat].filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase())
        );
    });
}
```

### 3. **Subcategory Filtering**
```javascript
function filterSubcategory(catKey, subcatKey) {
    // Фільтрує товари по конкретній підкатегорії
    const filtered = productsDatabase[catKey].filter(
        p => p.subcat === subcatKey
    );
}
```

### 4. **Cart with LocalStorage Persistence**
```javascript
// Зберігається навіть після перезавантаження сторінки
localStorage.setItem('ptc_cart', JSON.stringify(cart));
let cart = JSON.parse(localStorage.getItem('ptc_cart') || '[]');
```

### 5. **Lazy Image Loading**
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
- **Primary:** `#c9a961` (Gold Premium)
- **Background Dark:** `#0a0a0c` (Deep Black)
- **Background Light:** `#fafafa`
- **Accent Red:** `#e63946` (CTA buttons)

### Typography
- **Headers:** Orbitron (Futuristic, monospace)
- **Body:** Montserrat (Clean, modern)
- **Monospace:** Syncopate (Elegant accent)

### UX Principles
1. **Progressive Enhancement** — працює без JS (семантичний HTML)
2. **Performance First** — lazy loading, CSS variables, minimal repaints
3. **Accessibility by Default** — WCAG 2.1, semantic landmarks, ARIA labels
4. **Mobile-First** — розроблено для мобілю, потім для десктопу
5. **No Bloat** — нема React, Vue, jQuery — чистий vanilla JS (~50KB бандл)

---

## 📱 Browser Support

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome  | ✅ 90+  | ✅ 90+ |
| Firefox | ✅ 88+  | ✅ 88+ |
| Safari  | ✅ 14+  | ✅ 14+ |
| Edge    | ✅ 90+  | ✅ 90+ |

---

## 🔗 Live Demo

🌍 **[premium-concept-ten.vercel.app](https://premium-concept-ten.vercel.app)**

---

## 📚 API Integration (Готове для backend)

Поточна версія — **повністю фронтенд**, але готова до інтеграції з backend:

```javascript
// Готово до заміни на реальний API
async function fetchProducts() {
    const response = await fetch('https://api.yourserver.com/products');
    const data = await response.json();
    // Replace productsDatabase with API response
}
```

---

## 🛣️ Roadmap (Future Enhancements)

- [ ] Backend integration (Node.js/Python API)
- [ ] Database (PostgreSQL/MongoDB)
- [ ] User authentication (Sign up, Login, Profiles)
- [ ] Payment gateway (Stripe, LiqPay)
- [ ] Order tracking
- [ ] Admin dashboard
- [ ] Product reviews/ratings system
- [ ] Analytics (Google Analytics, Hotjar)

---

## 📈 Performance Optimizations Implemented

✅ **Image Optimization**
- Cloudinary CDN для оптимізації форматів
- Lazy loading з fade-in ефектом
- Responsive image sizes

✅ **CSS Optimization**
- CSS variables для швидкого theme switching
- Minimal CSS (~25KB)
- No unused styles

✅ **JavaScript Optimization**
- Event delegation (один listener замість багатьох)
- requestAnimationFrame для плавних анімацій
- Efficient DOM queries

✅ **Network Optimization**
- Single HTML file (no extra requests)
- Cloudinary CDN for global image delivery
- Browser caching headers (through Vercel)

---

## 🤝 Contributing

Це портфоліо-проєкт, але якщо маєш ідеї для покращень:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the LICENSE file for details.

---

## 👤 Author

**Ukrainian Web Developer**

- 🔗 [GitHub](https://github.com/yourusername)
- 💼 [LinkedIn](https://linkedin.com/in/yourusername)
- 📧 [Email](mailto:your.email@example.com)
- 🌐 [Portfolio](https://yourportfolio.com)

---

## 🙏 Acknowledgments

- Design inspiration: Premium e-commerce platforms
- Cloudinary for image hosting & optimization
- Vercel for seamless deployment
- Lighthouse for performance auditing

---

## 📞 Support

Если ести питання або баги:

1. Відкрий Issue на GitHub
2. Напиши детально про проблему
3. Додай скріншоти/відео
4. Я відповім якнайшвидше

---

<div align="center">

**Made with ❤️ in Ukraine**

*Thank you for checking out this project!*

</div>
