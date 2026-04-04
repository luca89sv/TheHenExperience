/* ═══════════════════════════════════════════
   THE HEN EXPERIENCE — Section Behaviors
   Nav, reveals, accordion, i18n, mobile menu
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ═══════════════════════════════════════════
  // HERO CTA BUTTONS — show after loader, hide on scroll
  // ═══════════════════════════════════════════
  const heroCta = document.getElementById('hero-cta');
  const fabContainer = document.getElementById('fab-container');

  // Show hero CTA shortly after page load
  if (heroCta) {
    setTimeout(() => heroCta.classList.add('visible'), 400);
  }

  // ═══════════════════════════════════════════
  // SCROLL REVEAL — IntersectionObserver (fallback, GSAP takes over below)
  // ═══════════════════════════════════════════
  const revealEls = document.querySelectorAll('.reveal');
  if (!window.gsap) {
    // Fallback if GSAP didn't load
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      revealEls.forEach((el) => revealObserver.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add('visible'));
    }
  }

  // ═══════════════════════════════════════════
  // NAVBAR — scroll state
  // ═══════════════════════════════════════════
  const navbar = document.getElementById('navbar');
  const heroSection = document.getElementById('hero');

  function updateNavbar() {
    const scrollY = window.scrollY;
    const heroBottom = (heroSection && heroSection.offsetHeight) || window.innerHeight;
    navbar.classList.toggle('scrolled', scrollY > heroBottom * 0.15);

    // Hero CTA: hide when scrolled past ~5% of hero
    if (heroCta) {
      heroCta.classList.toggle('hidden-scroll', scrollY > window.innerHeight * 0.15);
    }

    // FABs: always visible (no scroll dependency)
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = navbar.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });

        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        const hamburger = document.getElementById('nav-hamburger');
        if (mobileMenu) mobileMenu.classList.remove('open');
        if (hamburger) hamburger.classList.remove('active');
      }
    });
  });

  // ═══════════════════════════════════════════
  // MOBILE MENU
  // ═══════════════════════════════════════════
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });
  }

  // ═══════════════════════════════════════════
  // FAQ ACCORDION
  // ═══════════════════════════════════════════
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item.active').forEach((openItem) => {
        openItem.classList.remove('active');
        openItem.querySelector('.faq-answer').style.maxHeight = '0';
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ═══════════════════════════════════════════
  // LANGUAGE TOGGLE (PL / EN)
  // ═══════════════════════════════════════════
  const translations = {
    en: {
      'topbar.tagline': 'Unforgettable hen parties in Warsaw',
      'hero.cta.packages': 'Our Packages',
      'hero.cta.contact': 'Write to Us',
      'nav.services': 'Services',
      'nav.howItWorks': 'How It Works',
      'nav.testimonials': 'Reviews',
      'nav.pricing': 'Pricing',
      'nav.faq': 'FAQ',
      'nav.cta': 'Book Now',
      'hero.scroll': 'Scroll down',
      'hero.p1.label': 'FULL ORGANIZATION',
      'hero.p1.title': 'An Unforgettable Night A to Z',
      'hero.p1.desc': 'Accommodation, decorations, transport, surprises \u2014 professional service for every detail.',
      'hero.p2.label': 'YOUR NIGHT',
      'hero.p2.title': 'Give Her That Night',
      'hero.p2.desc': 'A hen party they\u2019ll talk about for years. Every moment designed to delight.',
      'hero.p3.label': 'LUXURY TRANSPORT',
      'hero.p3.title': 'Exclusive Limousine Transport',
      'hero.p3.desc': 'Luxury limousines with a professional chauffeur and chilled champagne on board.',
      'hero.p4.label': 'NIGHTLIFE',
      'hero.p4.title': 'Warsaw\u2019s Best Clubs',
      'hero.p4.desc': 'Free VIP entry to top clubs. Table reservations and premium service.',
      'mobile.hero.title': 'Unforgettable<br><em>hen party</em>',
      'mobile.hero.desc': 'Exclusive bachelorette parties in Warsaw',
      'services.tag': 'WHAT WE OFFER',
      'services.title': 'A night she\u2019ll <em>never forget</em>',
      'services.subtitle': 'Every element refined to perfection, so you can enjoy every moment.',
      'services.s1.title': 'Limousine Ride',
      'services.s1.desc': 'Luxury limousines with chauffeur, champagne and sound system. Cruise Warsaw in style.',
      'services.s2.title': 'Club Passes',
      'services.s2.desc': 'Free VIP entry to Warsaw\u2019s hottest clubs. No queues, no stress.',
      'services.s3.title': 'Champagne & Drinks',
      'services.s3.desc': 'Chilled champagne, prosecco and cocktails. Everything ready on board.',
      'services.s4.title': 'Decorations & Extras',
      'services.s4.desc': 'Balloons, ribbons, accessories for the bride and bridesmaids. All in your chosen color and style.',
      'services.s5.title': 'Professional Chauffeur',
      'services.s5.desc': 'Experienced, discreet driver. Safety and comfort at the highest level.',
      'services.s6.title': 'Personalized Plan',
      'services.s6.desc': 'We\u2019ll tailor every element to your wishes. A bespoke hen party.',
      'hiw.tag': 'HOW IT WORKS',
      'hiw.title': 'Three simple <em>steps</em>',
      'hiw.s1.title': 'Choose a package',
      'hiw.s1.desc': 'Browse our packages and pick the one that best fits your group.',
      'hiw.s2.title': 'Customize details',
      'hiw.s2.desc': 'Tell us your preferences \u2014 date, group size, extra attractions.',
      'hiw.s3.title': 'Party!',
      'hiw.s3.desc': 'We\u2019ll handle the rest. You just need to have fun.',
      'test.tag': 'REVIEWS',
      'test.title': 'What our <em>clients say</em>',
      'test.t1.text': 'Absolutely the best hen party we could have dreamed of! The limo was stunning and the service top-notch. The girls still talk about it!',
      'test.t1.role': 'Bridesmaid',
      'test.t2.text': 'I organized a night for my sister and was amazed by the professionalism. Everything planned to the minute, every surprise perfectly timed.',
      'test.t2.role': 'Bride\u2019s sister',
      'test.t3.text': 'I was looking for something unique and The Hen Experience delivered. Clubs, limo, decorations \u2014 all top quality. Highly recommend!',
      'test.t3.role': 'Organizer',
      'pricing.tag': 'PRICING',
      'pricing.title': 'Choose your <em>package</em>',
      'pricing.subtitle': 'Price per person. Minimum group size: 6.',
      'pricing.popular': 'Most Popular',
      'pricing.cta': 'Book Now',
      'pricing.t1.name': 'Basic',
      'pricing.t1.f1': '1h limousine ride',
      'pricing.t1.f2': 'Champagne on board',
      'pricing.t1.f3': 'Basic decorations',
      'pricing.t1.f4': 'Professional chauffeur',
      'pricing.t2.name': 'Premium',
      'pricing.t2.f1': '2h limousine ride',
      'pricing.t2.f2': 'Champagne & cocktails',
      'pricing.t2.f3': 'Full decorations + accessories',
      'pricing.t2.f4': 'VIP entry to 1 club',
      'pricing.t2.f5': 'Professional chauffeur',
      'pricing.t2.f6': 'Dedicated coordinator',
      'pricing.t3.name': 'VIP',
      'pricing.t3.f1': '3h limousine ride',
      'pricing.t3.f2': 'Premium open bar',
      'pricing.t3.f3': 'Luxury decorations',
      'pricing.t3.f4': 'VIP entry to 2 clubs',
      'pricing.t3.f5': 'Photographer / videographer',
      'pricing.t3.f6': 'Personalized evening plan',
      'pricing.t3.f7': 'Dedicated VIP coordinator',
      'faq.tag': 'QUESTIONS',
      'faq.title': 'Frequently asked <em>questions</em>',
      'faq.q1': 'How many people can participate?',
      'faq.a1': 'Our limousines hold 8 to 20 people, depending on the vehicle. For larger groups, we can arrange multiple vehicles.',
      'faq.q2': 'How far in advance should I book?',
      'faq.a2': 'We recommend booking at least 2 weeks in advance. During peak season (May\u2013September), booking a month ahead is advisable.',
      'faq.q3': 'Can I change the plan during the evening?',
      'faq.a3': 'Of course! Our coordinator is flexible and will adjust the plan to your wishes on the fly.',
      'faq.q4': 'What is the cancellation policy?',
      'faq.a4': 'Free cancellation up to 7 days before the event. Late cancellations incur a 50% deposit charge.',
      'faq.q5': 'Do you provide alcoholic beverages?',
      'faq.a5': 'Yes! Every package includes champagne. Premium and VIP packages offer an extended drink selection. You can also order extras.',
      'cta.tag': 'READY?',
      'cta.title': 'Plan an unforgettable <em>night</em>',
      'cta.desc': 'Contact us \u2014 we\u2019ll prepare a custom offer tailored to your dreams.',
      'cta.phone': 'Call Us',
      'cta.email': 'Email Us',
      'footer.desc': 'Exclusive bachelorette parties in Warsaw. Limousines, clubs, unforgettable moments.',
      'footer.links': 'Navigation',
      'footer.contact': 'Contact',
      'footer.social': 'Follow Us',
      'footer.rights': 'All rights reserved.',
    },
    pl: {
      'topbar.tagline': 'Niezapomniane wieczory panienskie w Warszawie',
      'hero.cta.packages': 'Nasze pakiety',
      'hero.cta.contact': 'Napisz do nas',
      'nav.services': 'Us\u0142ugi',
      'nav.howItWorks': 'Jak to dzia\u0142a',
      'nav.testimonials': 'Opinie',
      'nav.pricing': 'Cennik',
      'nav.faq': 'FAQ',
      'nav.cta': 'Zarezerwuj',
      'hero.scroll': 'Przewi\u0144 w d\u00f3\u0142',
      'hero.p1.label': 'KOMPLEKSOWA ORGANIZACJA',
      'hero.p1.title': 'Niezapomniany wiecz\u00f3r od A do Z',
      'hero.p1.desc': 'Zakwaterowanie, dekoracje, transport, niespodzianki \u2014 profesjonalna obs\u0142uga ka\u017cdego szczeg\u00f3\u0142u.',
      'hero.p2.label': 'TW\u00d3J WIECZ\u00d3R',
      'hero.p2.title': 'Spraw jej t\u0119 noc',
      'hero.p2.desc': 'Wiecz\u00f3r panie\u0144ski, o kt\u00f3rym b\u0119d\u0105 m\u00f3wi\u0107 latami. Ka\u017cda chwila zaprojektowana, by zachwycac.',
      'hero.p3.label': 'LUKSUSOWY TRANSPORT',
      'hero.p3.title': 'Ekskluzywny transport limuzyn\u0105',
      'hero.p3.desc': 'Luksusowe limuzyny z profesjonalnym szoferem i sch\u0142odzonym szampanem na pok\u0142adzie.',
      'hero.p4.label': 'NOCNE \u017bYCIE',
      'hero.p4.title': 'Najlepsze kluby w Warszawie',
      'hero.p4.desc': 'Darmowe wej\u015bcia VIP do topowych klub\u00f3w. Rezerwacje stolik\u00f3w i obs\u0142uga na najwy\u017cszym poziomie.',
      'mobile.hero.title': 'Niezapomniany<br><em>wiecz\u00f3r panie\u0144ski</em>',
      'mobile.hero.desc': 'Ekskluzywne wieczory panie\u0144skie w Warszawie',
      'services.tag': 'CO OFERUJEMY',
      'services.title': 'Noc, kt\u00f3rej <em>nigdy nie zapomni</em>',
      'services.subtitle': 'Ka\u017cdy element dopracowany do perfekcji, by\u015b mog\u0142a cieszy\u0107 si\u0119 ka\u017cd\u0105 chwil\u0105.',
      'services.s1.title': 'Przejazd limuzyn\u0105',
      'services.s1.desc': 'Luksusowe limuzyny z szoferem, szampanem i nag\u0142o\u015bnieniem. Przejazd po Warszawie w wielkim stylu.',
      'services.s2.title': 'Wej\u015bcia do klub\u00f3w',
      'services.s2.desc': 'Darmowe wej\u015bcia VIP do najgor\u0119tszych klub\u00f3w w Warszawie. Bez kolejek, bez stresu.',
      'services.s3.title': 'Szampan i napoje',
      'services.s3.desc': 'Sch\u0142odzony szampan, prosecco i koktajle. Wszystko gotowe na pok\u0142adzie limuzyny.',
      'services.s4.title': 'Dekoracje i dodatki',
      'services.s4.desc': 'Balony, wst\u0105\u017cki, gad\u017cety dla panny m\u0142odej i druhen. Wszystko w wybranym kolorze i stylu.',
      'services.s5.title': 'Profesjonalny szofer',
      'services.s5.desc': 'Do\u015bwiadczony, dyskretny kierowca. Bezpiecze\u0144stwo i komfort na najwy\u017cszym poziomie.',
      'services.s6.title': 'Spersonalizowany plan',
      'services.s6.desc': 'Dopasujemy ka\u017cdy element do Twoich \u017cycze\u0144. Wiecz\u00f3r panie\u0144ski szyty na miar\u0119.',
      'hiw.tag': 'JAK TO DZIA\u0141A',
      'hiw.title': 'Trzy proste <em>kroki</em>',
      'hiw.s1.title': 'Wybierz pakiet',
      'hiw.s1.desc': 'Przejrzyj nasze pakiety i wybierz ten, kt\u00f3ry najlepiej pasuje do Waszej grupy.',
      'hiw.s2.title': 'Dostosuj szczeg\u00f3\u0142y',
      'hiw.s2.desc': 'Powiedz nam o swoich preferencjach \u2014 termin, liczba os\u00f3b, dodatkowe atrakcje.',
      'hiw.s3.title': 'Baw si\u0119!',
      'hiw.s3.desc': 'My zajmiemy si\u0119 reszt\u0105. Ty musisz tylko dobrze si\u0119 bawi\u0107.',
      'test.tag': 'OPINIE',
      'test.title': 'Co m\u00f3wi\u0105 <em>nasze klientki</em>',
      'test.t1.text': 'Absolutnie najlepszy wiecz\u00f3r panie\u0144ski, jaki mog\u0142y\u015bmy sobie wymarzy\u0107! Limuzyna by\u0142a przepi\u0119kna, a obs\u0142uga na najwy\u017cszym poziomie.',
      'test.t1.role': 'Druhna',
      'test.t2.text': 'Organizowa\u0142am wiecz\u00f3r dla mojej siostry i by\u0142am pod wra\u017ceniem profesjonalizmu. Wszystko zaplanowane co do minuty.',
      'test.t2.role': 'Siostra panny m\u0142odej',
      'test.t3.text': 'Szuka\u0142am czego\u015b wyj\u0105tkowego i The Hen Experience to dostarczy\u0142o. Kluby, limuzyna, dekoracje \u2014 wszystko top!',
      'test.t3.role': 'Organizatorka',
      'pricing.tag': 'CENNIK',
      'pricing.title': 'Wybierz sw\u00f3j <em>pakiet</em>',
      'pricing.subtitle': 'Ceny za osob\u0119. Minimalna liczba os\u00f3b: 6.',
      'pricing.popular': 'Najpopularniejszy',
      'pricing.cta': 'Zarezerwuj',
      'pricing.t1.name': 'Bazowy',
      'pricing.t1.f1': 'Przejazd limuzyn\u0105 1h',
      'pricing.t1.f2': 'Szampan na pok\u0142adzie',
      'pricing.t1.f3': 'Dekoracje podstawowe',
      'pricing.t1.f4': 'Profesjonalny szofer',
      'pricing.t2.name': 'Premium',
      'pricing.t2.f1': 'Przejazd limuzyn\u0105 2h',
      'pricing.t2.f2': 'Szampan i koktajle',
      'pricing.t2.f3': 'Pe\u0142ne dekoracje + gad\u017cety',
      'pricing.t2.f4': 'VIP wej\u015bcie do 1 klubu',
      'pricing.t2.f5': 'Profesjonalny szofer',
      'pricing.t2.f6': 'Dedykowany koordynator',
      'pricing.t3.name': 'VIP',
      'pricing.t3.f1': 'Przejazd limuzyn\u0105 3h',
      'pricing.t3.f2': 'Premium open bar',
      'pricing.t3.f3': 'Luksusowe dekoracje',
      'pricing.t3.f4': 'VIP wej\u015bcia do 2 klub\u00f3w',
      'pricing.t3.f5': 'Fotograf / kamerzysta',
      'pricing.t3.f6': 'Spersonalizowany plan wieczoru',
      'pricing.t3.f7': 'Dedykowany koordynator VIP',
      'faq.tag': 'PYTANIA',
      'faq.title': 'Cz\u0119sto zadawane <em>pytania</em>',
      'faq.q1': 'Ile os\u00f3b mo\u017ce wzi\u0105\u0107 udzia\u0142?',
      'faq.a1': 'Nasze limuzyny mieszcz\u0105 od 8 do 20 os\u00f3b. Dla wi\u0119kszych grup mo\u017cemy przygotowa\u0107 kilka pojazd\u00f3w.',
      'faq.q2': 'Jak wcze\u015bnie trzeba rezerwowa\u0107?',
      'faq.a2': 'Zalecamy rezerwacj\u0119 z minimum 2-tygodniowym wyprzedzeniem. W sezonie warto rezerwowa\u0107 nawet miesi\u0105c wcze\u015bniej.',
      'faq.q3': 'Czy mog\u0119 zmieni\u0107 plan w trakcie wieczoru?',
      'faq.a3': 'Oczywi\u015bcie! Nasz koordynator jest elastyczny i dostosuje plan do Waszych \u017cycze\u0144 na bie\u017c\u0105co.',
      'faq.q4': 'Jaka jest polityka anulowania?',
      'faq.a4': 'Bezp\u0142atne anulowanie do 7 dni przed wydarzeniem. W przypadku p\u00f3\u017aniejszego anulowania pobieramy 50% zaliczki.',
      'faq.q5': 'Czy zapewniacie napoje alkoholowe?',
      'faq.a5': 'Tak! W ka\u017cdym pakiecie jest szampan. Pakiety Premium i VIP zawieraj\u0105 rozszerzony wyb\u00f3r napoj\u00f3w.',
      'cta.tag': 'GOTOWA?',
      'cta.title': 'Zaplanuj niezapomniany <em>wiecz\u00f3r</em>',
      'cta.desc': 'Napisz do nas lub zadzwo\u0144 \u2014 przygotujemy ofert\u0119 dopasowan\u0105 do Twoich marze\u0144.',
      'cta.phone': 'Zadzwo\u0144',
      'cta.email': 'Napisz do nas',
      'footer.desc': 'Ekskluzywne wieczory panie\u0144skie w Warszawie. Limuzyny, kluby, niezapomniane chwile.',
      'footer.links': 'Nawigacja',
      'footer.contact': 'Kontakt',
      'footer.social': '\u015aled\u017a nas',
      'footer.rights': 'Wszelkie prawa zastrze\u017cone.',
    },
  };

  let currentLang = 'pl';

  function applyTranslations(lang) {
    const dict = translations[lang];
    if (!dict) return;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        if (dict[key].includes('<')) {
          el.innerHTML = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });

    document.documentElement.lang = lang === 'pl' ? 'pl' : 'en';
  }

  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    // Set initial state — PL is default
    langToggle.querySelectorAll('.lang-option').forEach((opt) => {
      opt.classList.toggle('active', opt.dataset.lang === 'pl');
    });

    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'pl' ? 'en' : 'pl';
      langToggle.querySelectorAll('.lang-option').forEach((opt) => {
        opt.classList.toggle('active', opt.dataset.lang === currentLang);
      });
      applyTranslations(currentLang);
    });
  }

  // Apply PL on load (it's the default in HTML already, but this ensures consistency)
  applyTranslations('pl');

  // ═══════════════════════════════════════════
  // GSAP SCROLL-TRIGGERED ANIMATIONS
  // ═══════════════════════════════════════════
  function initGSAP() {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    // Remove CSS transition from .reveal so GSAP handles it
    // Also add 'visible' so GSAP captures opacity:1 as the TO value
    revealEls.forEach((el) => {
      el.style.transition = 'none';
      el.classList.add('visible');
    });

    // Section headers — fade up
    gsap.utils.toArray('.section-header.reveal').forEach((header) => {
      gsap.from(header, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          once: true,
          onEnter: () => header.classList.add('visible'),
        },
      });
    });

    // Service cards — staggered
    const serviceCards = gsap.utils.toArray('.service-card.reveal');
    if (serviceCards.length) {
      gsap.from(serviceCards, {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.services-grid',
          start: 'top 80%',
          once: true,
          onEnter: () => serviceCards.forEach((c) => c.classList.add('visible')),
        },
      });
    }

    // Steps — slide in from alternating sides
    gsap.utils.toArray('.step.reveal').forEach((step, i) => {
      gsap.from(step, {
        x: i % 2 === 0 ? -40 : 40,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: step,
          start: 'top 85%',
          once: true,
          onEnter: () => step.classList.add('visible'),
        },
      });
    });

    // Testimonial cards — staggered scale up
    const testimonialCards = gsap.utils.toArray('.testimonial-card.reveal');
    if (testimonialCards.length) {
      gsap.from(testimonialCards, {
        scale: 0.92,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.testimonials-grid',
          start: 'top 80%',
          once: true,
          onEnter: () => testimonialCards.forEach((c) => c.classList.add('visible')),
        },
      });
    }

    // Pricing cards — staggered with Y offset
    const pricingCards = gsap.utils.toArray('.pricing-card.reveal');
    if (pricingCards.length) {
      gsap.from(pricingCards, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.pricing-grid',
          start: 'top 80%',
          once: true,
          onEnter: () => pricingCards.forEach((c) => c.classList.add('visible')),
        },
      });
    }

    // FAQ items — staggered
    const faqItems = gsap.utils.toArray('.faq-item.reveal');
    if (faqItems.length) {
      gsap.from(faqItems, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.faq-list',
          start: 'top 80%',
          once: true,
          onEnter: () => faqItems.forEach((c) => c.classList.add('visible')),
        },
      });
    }

    // CTA section — dramatic entrance
    const ctaContent = document.querySelector('.cta-content.reveal');
    if (ctaContent) {
      gsap.from(ctaContent, {
        y: 50,
        opacity: 0,
        scale: 0.96,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ctaContent,
          start: 'top 85%',
          once: true,
          onEnter: () => ctaContent.classList.add('visible'),
        },
      });
    }

    // Glow orbs — subtle parallax
    gsap.utils.toArray('.glow-orb').forEach((orb) => {
      gsap.to(orb, {
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: orb.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });
  }

  // Wait for GSAP to load (deferred script)
  if (window.gsap) {
    initGSAP();
  } else {
    // GSAP loads via defer, so wait a tick
    window.addEventListener('load', () => {
      setTimeout(initGSAP, 100);
    });
  }
})();
