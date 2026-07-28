/* =============================================================================
   AEGIS AI — чат-консультант для Premium Tech Store (standalone demo build)

   Підключення:  <script src="aegis-widget.js" defer></script>  перед </body>
   Залежностей немає. Бекенд не потрібен — дерево рішень працює на фронті.

   Інтеграція з магазином (опційна, все з graceful fallback):
     PRODUCTS          — читає актуальний каталог магазину
     currentLang       — підхоплює мову інтерфейсу (uk / en)
     addToCart(id)     — додає товар у кошик магазину
     openProductModal(id) — відкриває картку товару

   Дані лідів: localStorage['aegis_leads'] + console.log (імітація відправки менеджеру).
   ============================================================================= */
(function () {
    'use strict';

    if (window.__aegisWidgetLoaded) return;
    window.__aegisWidgetLoaded = true;

    /* ---------------------------------------------------------------------
       КОНФІГ
       --------------------------------------------------------------------- */
    const CONFIG = {
        botName: 'AEGIS AI',
        leadsKey: 'aegis_leads',
        typingDelay: 650,       // мс «бот друкує» перед кожним повідомленням
        maxRecommendations: 2
    };

    /* Каталог-заглушка: використовується, тільки якщо на сторінці немає PRODUCTS.
       Тоді віджет лишається робочим демо на будь-якому сайті. */
    const FALLBACK_PRODUCTS = [
        { id: 'iphone-15-pro-max-256', name: 'iPhone 15 Pro Max 256GB', brand: 'Apple', cat: 'smartphones', price: 44500, inStock: true, popularity: 98, descUk: 'Титановий корпус, чіп A17 Pro.', descEn: 'Titanium frame, A17 Pro chip.' },
        { id: 'macbook-pro-16-m3-max', name: 'MacBook Pro 16" M3 Max', brand: 'Apple', cat: 'laptops', price: 142000, inStock: true, popularity: 84, descUk: 'Потужність для важких задач.', descEn: 'Power for heavy workflows.' },
        { id: 'ipad-pro-13-m4', name: 'iPad Pro 13" M4', brand: 'Apple', cat: 'tablets', price: 64900, inStock: true, popularity: 76, descUk: 'Tandem OLED, чіп M4.', descEn: 'Tandem OLED, M4 chip.' },
        { id: 'logitech-superlight-2', name: 'Logitech G Pro X Superlight 2', brand: 'Logitech', cat: 'accessories', price: 6400, inStock: true, popularity: 92, descUk: 'Надлегка ігрова миша.', descEn: 'Ultra-light gaming mouse.' }
    ];

    /* ---------------------------------------------------------------------
       МОСТИ ДО МАГАЗИНУ
       --------------------------------------------------------------------- */
    function catalog() {
        const external = (typeof PRODUCTS !== 'undefined' && Array.isArray(PRODUCTS)) ? PRODUCTS : null;
        return (external && external.length) ? external : FALLBACK_PRODUCTS;
    }

    function lang() {
        return (typeof currentLang !== 'undefined' && currentLang === 'en') ? 'en' : 'uk';
    }

    function money(n) {
        return n.toLocaleString('uk-UA').replace(/ /g, ' ') + ' UAH';
    }

    /* Дані товарів потрапляють у innerHTML. Зараз каталог свій, але щойно
       PRODUCTS почне приходити з API — це стане вектором XSS. */
    function esc(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function productDesc(p) {
        return (lang() === 'en' ? p.descEn : p.descUk) || '';
    }

    function pushToCart(id) {
        if (typeof addToCart === 'function') { addToCart(id); return true; }
        // Standalone-режим: пишемо в той самий ключ, що й магазин
        try {
            const raw = JSON.parse(localStorage.getItem('ptc_cart') || '[]');
            const found = raw.find(i => i.id === id);
            if (found) found.qty += 1; else raw.push({ id, qty: 1 });
            localStorage.setItem('ptc_cart', JSON.stringify(raw));
            return true;
        } catch (e) { return false; }
    }

    function openProduct(id) {
        if (typeof openProductModal === 'function') { openProductModal(id); return true; }
        return false;
    }

    /* ---------------------------------------------------------------------
       ТЕКСТИ
       --------------------------------------------------------------------- */
    const T = {
        uk: {
            title: 'AEGIS AI',
            subtitle: 'AI-консультант · Online',
            fabLabel: 'Відкрити чат з AI-консультантом',
            closeLabel: 'Закрити чат',
            greetMorning: 'Доброго ранку!',
            greetDay: 'Доброго дня!',
            greetEvening: 'Доброго вечора!',
            greetBody: 'Допоможу обрати ідеальний гаджет. Що шукаєте?',
            catSmartphones: 'Смартфон',
            catLaptops: 'Ноутбук',
            catTablets: 'Планшет',
            catAccessories: 'Аксесуари',
            needHelp: 'Потрібна консультація',
            askBudget: 'Чудовий вибір. На який бюджет орієнтуємось?',
            budgetLow: 'Бюджетний',
            budgetMid: 'Оптимальний',
            budgetAny: 'Без обмежень',
            askBrand: 'Є бренд, якому надаєте перевагу?',
            brandAny: 'Не важливо',
            askPurpose: 'Останнє питання: для чого переважно?',
            purposeWork: 'Робота',
            purposeStudy: 'Навчання',
            purposeGaming: 'Ігри',
            purposeMedia: 'Фото та відео',
            purposeDaily: 'Щодня',
            thinking: 'Аналізую каталог…',
            recIntro: 'Ось що підійде найкраще:',
            recSingle: 'Знайшов ідеальний варіант:',
            whyWork: 'Впорається з робочими задачами без компромісів.',
            whyStudy: 'Автономність і вага — те, що треба для навчання.',
            whyGaming: 'Максимальний відгук та продуктивність в іграх.',
            whyMedia: 'Дисплей і камера/оптика рівня контент-мейкера.',
            whyDaily: 'Надійний вибір на кожен день.',
            outOfStock: 'На жаль, цієї моделі зараз немає в наявності.',
            altOffer: 'Ось найближча альтернатива, яка є на складі:',
            noAlt: 'Поки що немає альтернативи в цій категорії. Залиште номер — повідомлю, щойно надійде.',
            addToCart: 'Додати у кошик',
            details: 'Детальніше',
            addedToCart: 'Додав у кошик:',
            noMatch: 'За такими критеріями нічого не знайшов. Спробуємо ширший бюджет?',
            noMoreOptions: 'Це всі варіанти, які є в каталозі під ваш запит. Почнемо спочатку чи покликати менеджера?',
            showOther: 'Показати інші',
            restart: 'Почати спочатку',
            callMe: 'Хочу консультацію',
            leadIntro: 'Залиште ім\'я та телефон — менеджер зателефонує протягом робочого дня.',
            leadName: 'Ваше ім\'я',
            leadPhone: 'Телефон',
            leadSubmit: 'Передзвоніть мені',
            leadErrName: 'Вкажіть ім\'я (мінімум 2 символи)',
            leadErrPhone: 'Формат: +380XXXXXXXXX',
            leadDone: 'Дякую! Заявку прийнято, менеджер зателефонує найближчим часом.',
            inputPlaceholder: 'Напишіть повідомлення…',
            send: 'Надіслати',
            fallback: 'Не зовсім зрозумів. Оберіть категорію — і я підберу варіант:',
            inStockNote: 'В наявності',
            outStockNote: 'Немає в наявності'
        },
        en: {
            title: 'AEGIS AI',
            subtitle: 'AI consultant · Online',
            fabLabel: 'Open AI consultant chat',
            closeLabel: 'Close chat',
            greetMorning: 'Good morning!',
            greetDay: 'Good afternoon!',
            greetEvening: 'Good evening!',
            greetBody: 'I\'ll help you pick the perfect gadget. What are you looking for?',
            catSmartphones: 'Smartphone',
            catLaptops: 'Laptop',
            catTablets: 'Tablet',
            catAccessories: 'Accessories',
            needHelp: 'I need advice',
            askBudget: 'Great choice. What budget are we aiming at?',
            budgetLow: 'Budget',
            budgetMid: 'Balanced',
            budgetAny: 'No limit',
            askBrand: 'Any brand you prefer?',
            brandAny: 'No preference',
            askPurpose: 'Last question: what will you mostly use it for?',
            purposeWork: 'Work',
            purposeStudy: 'Study',
            purposeGaming: 'Gaming',
            purposeMedia: 'Photo & video',
            purposeDaily: 'Everyday',
            thinking: 'Scanning the catalog…',
            recIntro: 'Here is what fits best:',
            recSingle: 'Found the perfect match:',
            whyWork: 'Handles professional workloads without compromise.',
            whyStudy: 'Battery life and weight are exactly right for study.',
            whyGaming: 'Maximum responsiveness and gaming performance.',
            whyMedia: 'Display and optics at content-creator level.',
            whyDaily: 'A reliable everyday pick.',
            outOfStock: 'Unfortunately this model is out of stock right now.',
            altOffer: 'Here is the closest alternative we have in stock:',
            noAlt: 'No alternative in this category yet. Leave your number and I\'ll ping you on restock.',
            addToCart: 'Add to cart',
            details: 'Details',
            addedToCart: 'Added to cart:',
            noMatch: 'Nothing matches those criteria. Shall we widen the budget?',
            noMoreOptions: 'That is everything in the catalog for your request. Start over, or shall I call a manager?',
            showOther: 'Show others',
            restart: 'Start over',
            callMe: 'I need advice',
            leadIntro: 'Leave your name and phone — a manager will call you during business hours.',
            leadName: 'Your name',
            leadPhone: 'Phone',
            leadSubmit: 'Call me back',
            leadErrName: 'Enter your name (at least 2 characters)',
            leadErrPhone: 'Format: +380XXXXXXXXX',
            leadDone: 'Thank you! Request received, a manager will call you shortly.',
            inputPlaceholder: 'Type a message…',
            send: 'Send',
            fallback: 'I didn\'t quite get that. Pick a category and I\'ll suggest something:',
            inStockNote: 'In stock',
            outStockNote: 'Out of stock'
        }
    };

    function t(key) { return T[lang()][key]; }

    const CAT_LABELS = {
        smartphones: 'catSmartphones',
        laptops: 'catLaptops',
        tablets: 'catTablets',
        accessories: 'catAccessories'
    };

    /* ---------------------------------------------------------------------
       СТИЛІ (glassmorphism, палітра магазину з fallback-значеннями)
       --------------------------------------------------------------------- */
    const CSS = `
    /* Захист від стилів сторінки-хоста: скидаємо все, що може прилетіти
       з голих тегів або глобальних правил, і фіксуємо власну геометрію. */
    .aegis-fab, .aegis-panel, .aegis-panel * {
        box-sizing: border-box;
        margin: 0;
        font-family: inherit;
    }
    .aegis-panel > *, .aegis-panel .aegis-head, .aegis-panel .aegis-foot {
        position: relative;
        top: auto; left: auto; right: auto; bottom: auto;
        width: auto;
        border-radius: 0;
    }

    .aegis-fab {
        position: fixed; right: 26px; bottom: 26px;
        width: 60px; height: 60px; border-radius: 50%;
        border: 1px solid rgba(197,168,128,0.45);
        background: linear-gradient(140deg, #17181f 0%, #0d0e13 100%);
        color: var(--gold-premium, #c5a880);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; z-index: 4500;
        box-shadow: 0 14px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.02) inset;
        transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease;
    }
    .aegis-fab:hover { transform: translateY(-3px); box-shadow: 0 18px 46px rgba(197,168,128,0.28); }
    .aegis-fab svg { width: 26px; height: 26px; pointer-events: none; }
    .aegis-fab .aegis-ico-close { display: none; }
    .aegis-fab.is-open .aegis-ico-open { display: none; }
    .aegis-fab.is-open .aegis-ico-close { display: block; }

    .aegis-fab::before {
        content: ''; position: absolute; inset: -1px; border-radius: 50%;
        border: 1px solid var(--gold-premium, #c5a880);
        animation: aegisPulse 3.4s ease-out infinite; pointer-events: none;
    }
    @keyframes aegisPulse {
        0%   { transform: scale(1);    opacity: 0.55; }
        100% { transform: scale(1.55); opacity: 0; }
    }
    .aegis-fab.is-open::before { animation: none; opacity: 0; }

    .aegis-fab-badge {
        position: absolute; top: -2px; right: -2px;
        min-width: 18px; height: 18px; padding: 0 5px;
        border-radius: 9px; background: var(--accent-color, #e63946); color: #fff;
        font: 700 10px/18px 'Orbitron','Montserrat',sans-serif; text-align: center;
        transform: scale(0); transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
    }
    .aegis-fab-badge.show { transform: scale(1); }

    .aegis-panel {
        position: fixed; right: 26px; bottom: 100px;
        width: 384px; max-width: calc(100vw - 32px);
        height: min(600px, calc(100vh - 150px));
        display: flex; flex-direction: column;
        background: rgba(15, 16, 21, 0.82);
        backdrop-filter: blur(26px) saturate(140%);
        -webkit-backdrop-filter: blur(26px) saturate(140%);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 18px; overflow: hidden;
        box-shadow: 0 30px 80px rgba(0,0,0,0.6);
        z-index: 4501;
        opacity: 0; transform: translateY(18px) scale(0.97); pointer-events: none;
        transition: opacity 0.35s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1);
        font-family: 'Montserrat', system-ui, sans-serif;
    }
    .aegis-panel.is-open { opacity: 1; transform: none; pointer-events: auto; }

    .aegis-head {
        display: flex; align-items: center; gap: 12px;
        padding: 16px 18px;
        border-bottom: 1px solid rgba(255,255,255,0.07);
        /* непрозора підкладка: під шапкою прокручуються повідомлення */
        background: linear-gradient(180deg, rgba(197,168,128,0.12), rgba(197,168,128,0.02)), #14151b;
        flex-shrink: 0;
        z-index: 2;
    }
    .aegis-avatar {
        width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        background: linear-gradient(135deg, var(--accent-color, #e63946), var(--gold-premium, #c5a880));
        color: #fff;
    }
    .aegis-avatar svg { width: 19px; height: 19px; }
    .aegis-head-name { font: 700 13px/1.2 'Syncopate','Montserrat',sans-serif; letter-spacing: 1px; color: #f2f2f4; }
    .aegis-head-sub { font-size: 11px; color: #8a8a92; margin-top: 4px; display: flex; align-items: center; gap: 6px; }
    .aegis-dot { width: 6px; height: 6px; border-radius: 50%; background: #2ec4b6; box-shadow: 0 0 8px #2ec4b6; }
    .aegis-head-close {
        margin-left: auto; background: none; border: none; color: #8a8a92;
        font-size: 24px; line-height: 1; cursor: pointer; padding: 0 2px;
    }
    .aegis-head-close:hover { color: var(--accent-color, #e63946); }

    .aegis-body { flex: 1; overflow-y: auto; padding: 18px; display: flex; flex-direction: column; gap: 12px; }
    .aegis-body::-webkit-scrollbar { width: 6px; }
    .aegis-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 3px; }

    .aegis-msg {
        max-width: 86%; padding: 12px 15px; font-size: 13px; line-height: 1.65;
        border-radius: 14px; animation: aegisMsgIn 0.4s cubic-bezier(0.16,1,0.3,1) both;
        word-wrap: break-word;
    }
    @keyframes aegisMsgIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

    .aegis-msg.bot {
        align-self: flex-start; color: #e5e5e7;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.07);
        border-bottom-left-radius: 4px;
    }
    .aegis-msg.user {
        align-self: flex-end; color: #fff;
        background: linear-gradient(135deg, rgba(230,57,70,0.92), rgba(197,168,128,0.85));
        border-bottom-right-radius: 4px;
    }

    .aegis-typing { display: flex; gap: 4px; align-items: center; }
    .aegis-typing span {
        width: 6px; height: 6px; border-radius: 50%; background: var(--gold-premium, #c5a880);
        animation: aegisBounce 1.2s infinite;
    }
    .aegis-typing span:nth-child(2) { animation-delay: 0.15s; }
    .aegis-typing span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes aegisBounce { 0%,60%,100% { transform: translateY(0); opacity: 0.45; } 30% { transform: translateY(-4px); opacity: 1; } }

    .aegis-chips { display: flex; flex-wrap: wrap; gap: 8px; animation: aegisMsgIn 0.4s cubic-bezier(0.16,1,0.3,1) both; }
    .aegis-chip {
        background: rgba(197,168,128,0.08);
        border: 1px solid rgba(197,168,128,0.35);
        color: var(--gold-premium, #c5a880);
        border-radius: 20px; padding: 9px 15px;
        font: 600 12px 'Montserrat', sans-serif; cursor: pointer;
        transition: all 0.25s ease;
    }
    .aegis-chip:hover { background: var(--gold-premium, #c5a880); color: #0d0e13; }
    .aegis-chip.ghost { border-color: rgba(255,255,255,0.16); color: #8a8a92; background: transparent; }
    .aegis-chip.ghost:hover { border-color: #e5e5e7; color: #e5e5e7; background: transparent; }

    .aegis-card {
        border: 1px solid rgba(255,255,255,0.08);
        background: rgba(255,255,255,0.04);
        border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 10px;
        animation: aegisMsgIn 0.45s cubic-bezier(0.16,1,0.3,1) both;
    }
    .aegis-card-top { display: flex; gap: 12px; }
    .aegis-card-img {
        width: 62px; height: 62px; flex-shrink: 0; border-radius: 10px;
        background: rgba(255,255,255,0.04); overflow: hidden;
        display: flex; align-items: center; justify-content: center;
    }
    .aegis-card-img img { width: 100%; height: 100%; object-fit: contain; padding: 5px; }
    .aegis-card-name { font-size: 12.5px; font-weight: 600; color: #f2f2f4; line-height: 1.4; }
    .aegis-card-price { font: 700 14px 'Orbitron','Montserrat',sans-serif; color: var(--accent-color, #e63946); margin-top: 6px; }
    .aegis-card-why { font-size: 11.5px; color: #8a8a92; line-height: 1.6; }
    .aegis-card-stock { font-size: 10.5px; font-weight: 700; letter-spacing: 0.4px; margin-top: 5px; }
    .aegis-card-stock.ok { color: #2ec4b6; }
    .aegis-card-stock.no { color: #8a8a92; }
    .aegis-card-actions { display: flex; gap: 8px; }
    .aegis-btn {
        flex: 1; border-radius: 8px; padding: 10px 0; cursor: pointer;
        font: 700 11px 'Montserrat', sans-serif; letter-spacing: 0.6px; text-transform: uppercase;
        border: 1px solid var(--accent-color, #e63946);
        background: var(--accent-color, #e63946); color: #fff;
        transition: all 0.25s ease;
    }
    .aegis-btn:hover { background: transparent; color: var(--accent-color, #e63946); }
    .aegis-btn.secondary { background: transparent; border-color: rgba(255,255,255,0.18); color: #c9c9cf; }
    .aegis-btn.secondary:hover { border-color: var(--gold-premium, #c5a880); color: var(--gold-premium, #c5a880); }
    .aegis-btn:disabled { opacity: 0.45; cursor: default; }

    .aegis-lead { display: flex; flex-direction: column; gap: 10px; }
    .aegis-lead input {
        background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.1);
        color: #e5e5e7; border-radius: 9px; padding: 12px 14px;
        font: 400 13px 'Montserrat', sans-serif; outline: none;
        transition: border-color 0.25s ease;
    }
    .aegis-lead input:focus { border-color: var(--gold-premium, #c5a880); }
    .aegis-lead input.invalid { border-color: var(--accent-color, #e63946); }
    .aegis-lead-error { font-size: 11px; color: var(--accent-color, #e63946); display: none; }
    .aegis-lead-error.show { display: block; }

    .aegis-foot {
        display: flex; gap: 8px; padding: 12px 14px; flex-shrink: 0;
        border-top: 1px solid rgba(255,255,255,0.07);
        background: rgba(0,0,0,0.25);
    }
    .aegis-input {
        flex: 1; background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.09); border-radius: 22px;
        color: #e5e5e7; padding: 11px 16px; font: 400 13px 'Montserrat', sans-serif;
        outline: none; resize: none; max-height: 90px;
    }
    .aegis-input:focus { border-color: rgba(197,168,128,0.5); }
    .aegis-send {
        width: 42px; height: 42px; flex-shrink: 0; border-radius: 50%; border: none; cursor: pointer;
        background: var(--gold-premium, #c5a880); color: #0d0e13;
        display: flex; align-items: center; justify-content: center;
        transition: opacity 0.25s ease;
    }
    .aegis-send svg { width: 17px; height: 17px; }
    .aegis-send:disabled { opacity: 0.35; cursor: default; }

    /* Premium Store: поки чат відкрито, ховаємо кнопку зв'язку —
       вона стоїть у тому ж куті й опинялась би під панеллю */
    body.aegis-open .contact-fab { opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }

    @media (max-width: 600px) {
        .aegis-fab { right: 18px; bottom: 18px; width: 52px; height: 52px; }
        .aegis-fab svg { width: 22px; height: 22px; }
        .aegis-fab.is-open { opacity: 0; pointer-events: none; }
        .aegis-panel {
            right: 0; left: 0; bottom: 0;
            width: 100%; max-width: none;
            height: 88vh; border-radius: 20px 20px 0 0;
            transform: translateY(100%);
        }
        .aegis-panel.is-open { transform: translateY(0); }
        .aegis-msg { max-width: 92%; }
    }

    @media (prefers-reduced-motion: reduce) {
        .aegis-fab::before { animation: none; }
        .aegis-msg, .aegis-chips, .aegis-card { animation: none; }
    }
    `;

    /* ---------------------------------------------------------------------
       РОЗМІТКА
       --------------------------------------------------------------------- */
    const ICON_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    const ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    const ICON_SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';

    const style = document.createElement('style');
    style.id = 'aegis-widget-styles';
    style.textContent = CSS;
    document.head.appendChild(style);

    const fab = document.createElement('button');
    fab.className = 'aegis-fab';
    fab.setAttribute('aria-label', t('fabLabel'));
    fab.setAttribute('aria-expanded', 'false');
    fab.innerHTML = `
        <span class="aegis-ico-open">${ICON_CHAT}</span>
        <span class="aegis-ico-close">${ICON_CLOSE}</span>
        <span class="aegis-fab-badge" id="aegisFabBadge">1</span>
    `;

    const panel = document.createElement('aside');
    panel.className = 'aegis-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', CONFIG.botName);
    panel.setAttribute('aria-hidden', 'true');   // закрита панель не має читатись скрінрідером
    /* Свідомо жодних <header>/<footer>/<section> — сторінка-хост може мати
       стилі на голі теги (у Premium Store `header { position: fixed }`,
       що ламало розкладку панелі). Тільки div + класи з префіксом aegis-. */
    panel.innerHTML = `
        <div class="aegis-head">
            <div class="aegis-avatar">${ICON_CHAT}</div>
            <div>
                <div class="aegis-head-name" id="aegisTitle">${t('title')}</div>
                <div class="aegis-head-sub"><span class="aegis-dot"></span><span id="aegisSubtitle">${t('subtitle')}</span></div>
            </div>
            <button class="aegis-head-close" id="aegisClose" aria-label="${t('closeLabel')}">&times;</button>
        </div>
        <div class="aegis-body" id="aegisBody" aria-live="polite"></div>
        <form class="aegis-foot" id="aegisForm" autocomplete="off">
            <textarea class="aegis-input" id="aegisInput" rows="1" maxlength="300" placeholder="${t('inputPlaceholder')}"></textarea>
            <button type="submit" class="aegis-send" id="aegisSend" aria-label="${t('send')}" disabled>${ICON_SEND}</button>
        </form>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    const body = panel.querySelector('#aegisBody');
    const input = panel.querySelector('#aegisInput');
    const sendBtn = panel.querySelector('#aegisSend');
    const badge = fab.querySelector('#aegisFabBadge');

    /* ---------------------------------------------------------------------
       СТАН ДІАЛОГУ
       --------------------------------------------------------------------- */
    const state = { cat: null, budget: null, brand: null, purpose: null, lastPick: null, shown: [], started: false };

    function resetState() {
        state.cat = null; state.budget = null; state.brand = null;
        state.purpose = null; state.lastPick = null; state.shown = [];
    }

    /* ---------------------------------------------------------------------
       ВІДОБРАЖЕННЯ ПОВІДОМЛЕНЬ
       --------------------------------------------------------------------- */
    function scrollDown() { body.scrollTop = body.scrollHeight; }

    function addUser(text) {
        const el = document.createElement('div');
        el.className = 'aegis-msg user';
        el.textContent = text;
        body.appendChild(el);
        scrollDown();
    }

    function addBotNow(html) {
        const el = document.createElement('div');
        el.className = 'aegis-msg bot';
        el.innerHTML = html;
        body.appendChild(el);
        scrollDown();
        return el;
    }

    /* Бот «друкує», потім віддає повідомлення. Повертає Promise для послідовних реплік. */
    function addBot(html, delay) {
        return new Promise(resolve => {
            const typing = document.createElement('div');
            typing.className = 'aegis-msg bot';
            typing.innerHTML = '<div class="aegis-typing"><span></span><span></span><span></span></div>';
            body.appendChild(typing);
            scrollDown();
            setTimeout(() => {
                typing.remove();
                resolve(addBotNow(html));
            }, delay || CONFIG.typingDelay);
        });
    }

    function addChips(items) {
        // Активна тільки остання група швидких відповідей — інакше після
        // вільного тексту на екрані лишаються клікабельні кнопки старого кроку
        body.querySelectorAll('.aegis-chips').forEach(el => el.remove());

        const wrap = document.createElement('div');
        wrap.className = 'aegis-chips';
        items.forEach(item => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'aegis-chip' + (item.ghost ? ' ghost' : '');
            btn.textContent = item.label;
            btn.addEventListener('click', () => {
                wrap.remove();
                addUser(item.label);
                item.onPick();
            });
            wrap.appendChild(btn);
        });
        body.appendChild(wrap);
        scrollDown();
        return wrap;
    }

    function addNode(node) {
        body.appendChild(node);
        scrollDown();
        return node;
    }

    /* ---------------------------------------------------------------------
       ДЕРЕВО ДІАЛОГУ
       --------------------------------------------------------------------- */
    function greeting() {
        const h = new Date().getHours();
        if (h >= 5 && h < 12) return t('greetMorning');
        if (h >= 12 && h < 17) return t('greetDay');
        return t('greetEvening');
    }

    async function startDialog() {
        state.started = true;
        await addBot(`${greeting()} ${t('greetBody')}`);
        askCategory();
    }

    function availableCategories() {
        const cats = [...new Set(catalog().map(p => p.cat))];
        return cats.filter(c => CAT_LABELS[c]);
    }

    function askCategory() {
        const chips = availableCategories().map(cat => ({
            label: t(CAT_LABELS[cat]),
            onPick: () => { state.cat = cat; askBudget(); }
        }));
        chips.push({ label: t('needHelp'), ghost: true, onPick: () => showLeadForm() });
        addChips(chips);
    }

    /* Бюджетні «кошики» рахуються з реальних цін категорії, тому працюють
       і для аксесуарів за 6к, і для ноутбуків за 142к.
       Пороги-дублікати відкидаємо: у категорії з одним товаром інакше
       виходили дві однакові кнопки «до 142 000 UAH». */
    function budgetBuckets(items) {
        const prices = [...new Set(items.map(p => p.price))].sort((a, b) => a - b);
        if (prices.length < 2) return null;               // вибирати нема з чого

        const top = prices[prices.length - 1];
        const low = prices[Math.floor((prices.length - 1) / 3)];
        const mid = prices[Math.floor((prices.length - 1) * 2 / 3)];

        const buckets = [];
        [{ label: t('budgetLow'), max: low }, { label: t('budgetMid'), max: mid }].forEach(b => {
            if (b.max < top && !buckets.some(x => x.max === b.max)) {
                buckets.push({ label: `${b.label} · до ${money(b.max)}`, max: b.max });
            }
        });
        buckets.push({ label: t('budgetAny'), max: Infinity });
        return buckets;
    }

    async function askBudget() {
        const items = catalog().filter(p => p.cat === state.cat);
        const buckets = budgetBuckets(items);

        if (!buckets) { state.budget = Infinity; askBrand(); return; }

        await addBot(t('askBudget'));
        addChips(buckets.map(b => ({
            label: b.label,
            onPick: () => { state.budget = b.max; askBrand(); }
        })));
    }

    async function askBrand() {
        const items = catalog().filter(p => p.cat === state.cat && p.price <= state.budget);
        const brands = [...new Set(items.map(p => p.brand))];

        if (brands.length <= 1) { askPurpose(); return; }

        await addBot(t('askBrand'));
        const chips = brands.map(b => ({ label: b, onPick: () => { state.brand = b; askPurpose(); } }));
        chips.push({ label: t('brandAny'), ghost: true, onPick: () => { state.brand = null; askPurpose(); } });
        addChips(chips);
    }

    async function askPurpose() {
        await addBot(t('askPurpose'));
        const purposes = [
            { key: 'work', label: t('purposeWork') },
            { key: 'study', label: t('purposeStudy') },
            { key: 'gaming', label: t('purposeGaming') },
            { key: 'media', label: t('purposeMedia') },
            { key: 'daily', label: t('purposeDaily') }
        ];
        addChips(purposes.map(p => ({
            label: p.label,
            onPick: () => { state.purpose = p.key; recommend(); }
        })));
    }

    function whyLine() {
        const map = { work: 'whyWork', study: 'whyStudy', gaming: 'whyGaming', media: 'whyMedia', daily: 'whyDaily' };
        return t(map[state.purpose] || 'whyDaily');
    }

    /* Ранжування: спершу наявність, потім популярність (для ігор/щодня)
       або ціна вниз (робота/медіа — беремо старшу модель). */
    function rankProducts(items) {
        const preferTop = state.purpose === 'work' || state.purpose === 'media';
        return items.slice().sort((a, b) => {
            if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
            if (preferTop && b.price !== a.price) return b.price - a.price;
            return (b.popularity || 0) - (a.popularity || 0);
        });
    }

    function matchingProducts() {
        return catalog().filter(p =>
            p.cat === state.cat &&
            (state.budget == null || p.price <= state.budget) &&
            (!state.brand || p.brand === state.brand)
        );
    }

    async function recommend(opts) {
        const skipShown = !!(opts && opts.skipShown);
        await addBot(t('thinking'), 500);

        let items = matchingProducts();
        if (skipShown) items = items.filter(p => !state.shown.includes(p.id));

        // «Показати інші», коли інших уже не лишилось
        if (items.length === 0 && skipShown) {
            await addBot(t('noMoreOptions'));
            addChips([
                { label: t('restart'), onPick: () => restart() },
                { label: t('callMe'), ghost: true, onPick: () => showLeadForm() }
            ]);
            return;
        }

        if (items.length === 0) {
            await addBot(t('noMatch'));
            addChips([
                { label: t('budgetAny'), onPick: () => { state.budget = Infinity; state.brand = null; recommend(); } },
                { label: t('callMe'), ghost: true, onPick: () => showLeadForm() },
                { label: t('restart'), ghost: true, onPick: () => restart() }
            ]);
            return;
        }

        const ranked = rankProducts(items);
        const inStock = ranked.filter(p => p.inStock);

        // Всі підходящі товари розпродано — кажемо прямо і шукаємо альтернативу.
        // Уже показане не пропонуємо вдруге.
        if (inStock.length === 0) {
            await addBot(`${t('outOfStock')} <strong>${esc(ranked[0].name)}</strong>`);
            // Тільки в межах категорії: пропонувати смартфон замість мишки — гірше, ніж чесне «немає»
            const alt = rankProducts(catalog().filter(p =>
                p.cat === state.cat && p.inStock && !state.shown.includes(p.id)
            ))[0];

            if (!alt) {
                await addBot(state.shown.length ? t('noMoreOptions') : t('noAlt'));
                if (state.shown.length) {
                    addChips([
                        { label: t('restart'), onPick: () => restart() },
                        { label: t('callMe'), ghost: true, onPick: () => showLeadForm() }
                    ]);
                } else {
                    showLeadForm();
                }
                return;
            }

            await addBot(t('altOffer'));
            state.shown.push(alt.id);
            addNode(productCard(alt));
            afterRecommendation();
            return;
        }

        const picks = inStock.slice(0, CONFIG.maxRecommendations);
        state.lastPick = picks[0];
        await addBot(picks.length > 1 ? t('recIntro') : t('recSingle'));
        picks.forEach(p => {
            state.shown.push(p.id);
            addNode(productCard(p));
        });

        // Якщо топ-варіант за критеріями був розпроданий — чесно попереджаємо
        if (!ranked[0].inStock) {
            await addBot(`${t('outOfStock')} <strong>${esc(ranked[0].name)}</strong>`);
        }
        afterRecommendation();
    }

    function afterRecommendation() {
        addChips([
            { label: t('showOther'), onPick: () => { state.brand = null; state.budget = Infinity; recommend({ skipShown: true }); } },
            { label: t('callMe'), ghost: true, onPick: () => showLeadForm() },
            { label: t('restart'), ghost: true, onPick: () => restart() }
        ]);
    }

    function productCard(p) {
        const card = document.createElement('div');
        card.className = 'aegis-card';
        const img = p.img ? `<img src="${esc(p.img)}" alt="" loading="lazy">` : '';
        card.innerHTML = `
            <div class="aegis-card-top">
                <div class="aegis-card-img">${img}</div>
                <div>
                    <div class="aegis-card-name">${esc(p.name)}</div>
                    <div class="aegis-card-price">${money(p.price)}</div>
                    <div class="aegis-card-stock ${p.inStock ? 'ok' : 'no'}">${p.inStock ? t('inStockNote') : t('outStockNote')}</div>
                </div>
            </div>
            <div class="aegis-card-why">${whyLine()} ${esc(productDesc(p))}</div>
            <div class="aegis-card-actions">
                <button type="button" class="aegis-btn" ${p.inStock ? '' : 'disabled'}>${t('addToCart')}</button>
                <button type="button" class="aegis-btn secondary">${t('details')}</button>
            </div>
        `;
        const [addBtn, detailsBtn] = card.querySelectorAll('.aegis-card-actions button');
        addBtn.addEventListener('click', () => {
            if (!p.inStock) return;
            pushToCart(p.id);
            state.lastPick = p;
            addBot(`${t('addedToCart')} <strong>${esc(p.name)}</strong>`, 350);
        });
        detailsBtn.addEventListener('click', () => {
            if (!openProduct(p.id)) return;
            closePanel();
        });
        return card;
    }

    /* ---------------------------------------------------------------------
       ЛІД-ФОРМА (ім'я + телефон → localStorage + console)
       --------------------------------------------------------------------- */
    function isValidPhone(value) {
        return /^(\+?38)?0\d{9}$/.test(value.replace(/[\s()\-]/g, ''));
    }

    async function showLeadForm() {
        // одна форма за раз + прибрати чіпси попереднього кроку
        if (body.querySelector('.aegis-lead')) return;
        body.querySelectorAll('.aegis-chips').forEach(el => el.remove());

        await addBot(t('leadIntro'));

        const form = document.createElement('form');
        form.className = 'aegis-card aegis-lead';
        form.innerHTML = `
            <input type="text" name="name" placeholder="${t('leadName')}" autocomplete="name">
            <span class="aegis-lead-error" data-for="name">${t('leadErrName')}</span>
            <input type="tel" name="phone" placeholder="${t('leadPhone')} +380671234567" autocomplete="tel">
            <span class="aegis-lead-error" data-for="phone">${t('leadErrPhone')}</span>
            <button type="submit" class="aegis-btn">${t('leadSubmit')}</button>
        `;

        // form.elements — а не form.name/form.phone: у HTMLFormElement є власна
        // властивість name, і збіг імен полів дає непередбачуваний результат
        const nameInput = form.elements.namedItem('name');
        const phoneInput = form.elements.namedItem('phone');

        form.addEventListener('submit', e => {
            e.preventDefault();
            const name = nameInput.value.trim();
            const phone = phoneInput.value.trim();
            const nameOk = name.length >= 2;
            const phoneOk = isValidPhone(phone);

            form.querySelector('[data-for="name"]').classList.toggle('show', !nameOk);
            form.querySelector('[data-for="phone"]').classList.toggle('show', !phoneOk);
            nameInput.classList.toggle('invalid', !nameOk);
            phoneInput.classList.toggle('invalid', !phoneOk);
            if (!nameOk || !phoneOk) return;

            saveLead({ name, phone });
            form.remove();
            addUser(`${name}, ${phone}`);
            addBot(t('leadDone')).then(() => {
                addChips([{ label: t('restart'), ghost: true, onPick: () => restart() }]);
            });
        });

        addNode(form);
    }

    function saveLead(contact) {
        const lead = {
            name: contact.name,
            phone: contact.phone,
            category: state.cat,
            budget: state.budget === Infinity ? null : state.budget,
            brand: state.brand,
            purpose: state.purpose,
            product: state.lastPick ? { id: state.lastPick.id, name: state.lastPick.name, price: state.lastPick.price } : null,
            date: new Date().toISOString(),
            source: 'aegis-widget'
        };

        let list = [];
        try { list = JSON.parse(localStorage.getItem(CONFIG.leadsKey) || '[]'); } catch (e) { list = []; }
        list.push(lead);
        localStorage.setItem(CONFIG.leadsKey, JSON.stringify(list));

        // Імітація відправки менеджеру (тут був би POST на бекенд AEGIS)
        console.log('[AEGIS] Новий лід → менеджеру:', lead);
    }

    /* ---------------------------------------------------------------------
       ВІЛЬНИЙ ТЕКСТ: простий keyword-роутер у те саме дерево
       --------------------------------------------------------------------- */
    const KEYWORDS = {
        smartphones: ['iphone', 'айфон', 'смартфон', 'телефон', 'phone'],
        laptops: ['macbook', 'макбук', 'ноут', 'ноутбук', 'laptop'],
        tablets: ['ipad', 'айпад', 'планшет', 'tablet'],
        accessories: ['навушник', 'airpods', 'мишк', 'миш', 'клавіатур', 'аксесуар', 'headphone', 'mouse', 'keyboard', 'accessor']
    };

    function routeFreeText(raw) {
        const text = raw.toLowerCase();

        if (/консультац|менеджер|подзвон|передзвон|дзвін|call|advice|manager/.test(text)) {
            showLeadForm();
            return;
        }

        const brandHit = [...new Set(catalog().map(p => p.brand))]
            .find(b => text.includes(b.toLowerCase()));

        const catHit = Object.keys(KEYWORDS).find(cat => KEYWORDS[cat].some(k => text.includes(k)));

        // ≥ 1000, інакше «iPhone 15 Pro 256» дає «бюджет 256»
        const priceHit = text.match(/(\d[\d\s]{2,})/);
        const parsed = priceHit ? parseInt(priceHit[1].replace(/\s/g, ''), 10) : NaN;
        const budget = (!isNaN(parsed) && parsed >= 1000) ? parsed : null;

        if (catHit || brandHit || budget) {
            state.cat = catHit || state.cat;
            state.brand = brandHit || state.brand;
            state.budget = budget || state.budget;

            if (!state.cat) {
                // бренд/бюджет без категорії — питаємо категорію
                addBot(t('greetBody')).then(askCategory);
                return;
            }
            if (!state.purpose) { askPurpose(); return; }
            recommend();
            return;
        }

        addBot(t('fallback')).then(askCategory);
    }

    /* ---------------------------------------------------------------------
       ВІДКРИТТЯ / ЗАКРИТТЯ
       --------------------------------------------------------------------- */
    /* Статичні підписи перечитуються при кожному відкритті —
       магазин може перемкнути мову вже після завантаження віджета */
    function applyStaticText() {
        panel.querySelector('#aegisTitle').textContent = t('title');
        panel.querySelector('#aegisSubtitle').textContent = t('subtitle');
        panel.querySelector('#aegisClose').setAttribute('aria-label', t('closeLabel'));
        input.placeholder = t('inputPlaceholder');
        sendBtn.setAttribute('aria-label', t('send'));
        fab.setAttribute('aria-label', t('fabLabel'));
    }

    function openPanel() {
        applyStaticText();
        panel.classList.add('is-open');
        panel.setAttribute('aria-hidden', 'false');
        fab.classList.add('is-open');
        document.body.classList.add('aegis-open');
        fab.setAttribute('aria-expanded', 'true');
        badge.classList.remove('show');
        if (!state.started) startDialog();
        if (window.innerWidth > 600) setTimeout(() => input.focus(), 300);
    }

    function closePanel() {
        panel.classList.remove('is-open');
        panel.setAttribute('aria-hidden', 'true');
        fab.classList.remove('is-open');
        document.body.classList.remove('aegis-open');
        fab.setAttribute('aria-expanded', 'false');
    }

    /* Магазин вішає body.modal-open на свої модалки/шторки. Якщо така
       відкрилась — прибираємо чат, щоб панелі не накладались. */
    if (window.MutationObserver) {
        new MutationObserver(() => {
            if (document.body.classList.contains('modal-open') && panel.classList.contains('is-open')) {
                closePanel();
            }
        }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    function restart() {
        resetState();
        body.innerHTML = '';
        state.started = true;
        addBot(`${greeting()} ${t('greetBody')}`).then(askCategory);
    }

    fab.addEventListener('click', () => {
        panel.classList.contains('is-open') ? closePanel() : openPanel();
    });
    panel.querySelector('#aegisClose').addEventListener('click', closePanel);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && panel.classList.contains('is-open')) closePanel();
    });

    input.addEventListener('input', () => {
        sendBtn.disabled = input.value.trim().length === 0;
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 90) + 'px';
    });

    input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            panel.querySelector('#aegisForm').requestSubmit();
        }
    });

    panel.querySelector('#aegisForm').addEventListener('submit', e => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        addUser(text);
        input.value = '';
        input.style.height = 'auto';
        sendBtn.disabled = true;
        routeFreeText(text);
    });

    // Ненав'язливе нагадування: бейдж через 8 секунд, якщо чат ще не відкривали
    setTimeout(() => {
        if (!state.started) badge.classList.add('show');
    }, 8000);

    // Публічний міні-API (для кнопок на сторінці: onclick="AegisWidget.open()")
    window.AegisWidget = {
        open: openPanel,
        close: closePanel,
        restart,
        leads: () => { try { return JSON.parse(localStorage.getItem(CONFIG.leadsKey) || '[]'); } catch (e) { return []; } }
    };
})();
