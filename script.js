/**
 * Shade Micro-Credit Enterprise - Master JavaScript
 * Aesthetic: Clean White High-End Minimalist Fintech
 * Features:
 * - Dynamic Sticky Navbar on Hero & Inner Pages
 * - Responsive Mobile Drawer Navigation
 * - Interactive Loan Calculator with Amortization Schedule Table
 * - Reusable Loan Application Modal with Auto-Prefill
 * - FAQ Accordion
 * - Privacy Cookie Consent Banner with LocalStorage Persistence
 * - Contact Form Validation & Feedback
 * - Intersection Observer Scroll Animations
 */

document.addEventListener('DOMContentLoaded', () => {

  // ================= 1. STICKY NAVBAR SCROLL =================
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ================= 2. MOBILE NAVIGATION =================
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('hidden');
      navLinks.classList.toggle('mobile-open');
    });

    // Close when clicking any nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.add('hidden');
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // ================= 3. INTERACTIVE LOAN CALCULATOR & GOOGLE SHEETS LIVE SYNC =================
  const loanAmountInput = document.getElementById('loanAmount');
  const loanTenureInput = document.getElementById('loanTenure');
  const loanAmountDisplay = document.getElementById('loanAmountDisplay');
  const loanTenureDisplay = document.getElementById('loanTenureDisplay');
  const calcRateBadge = document.getElementById('calcRateBadge');
  
  // Results display IDs
  const monthlyRepayment = document.getElementById('monthlyRepayment') || document.getElementById('monthlyInstallment');
  const totalInterestEl = document.getElementById('totalInterest');
  const totalPayableEl = document.getElementById('totalPayable') || document.getElementById('summaryTotal');
  const summaryPrincipal = document.getElementById('summaryPrincipal');

  const toggleScheduleBtn = document.getElementById('toggleScheduleBtn');
  const amortizationWrap = document.getElementById('amortizationWrap') || document.getElementById('amortizationSchedule');
  const amortizationBody = document.getElementById('amortizationBody') || document.getElementById('scheduleBody');

  // GOOGLE SHEET LIVE SYNC CONFIGURATION
  // Connected to client's live Google Sheet:
  const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSo2DhGVMmlfMDjWyPfWvTI5irzC8MA50gqgl47I-g1hXtH64OQyD51Ktlo6HkMQDHb6o6Nod1RK-gE/pub?gid=0&single=true&output=csv';

  // Default fallback rate (3.5% flat per month) if sheet is offline or not configured yet
  let currentMonthlyRate = 0.035;

  const formatGHS = (val) => {
    return 'GH₵ ' + Number(val).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const calculateLoan = () => {
    if (!loanAmountInput || !loanTenureInput) return;

    const principal = parseFloat(loanAmountInput.value) || 5000;
    const months = parseInt(loanTenureInput.value, 10) || 6;

    const monthlyRate = currentMonthlyRate;
    const monthlyInterest = principal * monthlyRate;
    const totalInterest = monthlyInterest * months;
    const totalRepayable = principal + totalInterest;
    const monthlyPrincipalPayment = principal / months;
    const monthlyPayment = totalRepayable / months;

    if (loanAmountDisplay) loanAmountDisplay.textContent = 'GH₵ ' + Number(principal).toLocaleString();
    if (loanTenureDisplay) loanTenureDisplay.textContent = `${months} ${months === 1 ? 'Month' : 'Months'}`;

    const calcRateBadges = document.querySelectorAll('#calcRateBadge, .calc-rate-badge');
    calcRateBadges.forEach(badge => {
      badge.textContent = `${(monthlyRate * 100).toFixed(2)}% / Mo`;
    });

    if (monthlyRepayment) monthlyRepayment.textContent = formatGHS(monthlyPayment);
    if (totalInterestEl) totalInterestEl.textContent = formatGHS(totalInterest);
    if (totalPayableEl) totalPayableEl.textContent = formatGHS(totalRepayable);
    if (summaryPrincipal) summaryPrincipal.textContent = formatGHS(principal);

    // Generate month-by-month amortization schedule
    if (amortizationBody) {
      let rowsHTML = '';
      let remainingBalance = principal;

      for (let m = 1; m <= months; m++) {
        remainingBalance -= monthlyPrincipalPayment;
        const displayBalance = Math.max(0, remainingBalance);

        rowsHTML += `
          <tr>
            <td class="p-3"><strong>Month ${m}</strong></td>
            <td class="p-3">${formatGHS(monthlyPrincipalPayment)}</td>
            <td class="p-3">${formatGHS(monthlyInterest)}</td>
            <td class="p-3"><strong>${formatGHS(monthlyPayment)}</strong></td>
            <td class="p-3">${formatGHS(displayBalance)}</td>
          </tr>
        `;
      }
      amortizationBody.innerHTML = rowsHTML;
    }
  };

  // Live Sync Function for Google Sheets
  const syncRateFromGoogleSheet = async () => {
    if (!GOOGLE_SHEET_CSV_URL || !GOOGLE_SHEET_CSV_URL.startsWith('http')) return;
    try {
      const res = await fetch(GOOGLE_SHEET_CSV_URL);
      if (!res.ok) return;
      const csv = await res.text();
      const lines = csv.split(/\r?\n/);
      for (const line of lines) {
        const cols = line.split(',');
        for (const col of cols) {
          const clean = col.replace(/["'%]/g, '').trim();
          const val = parseFloat(clean);
          // Look for realistic rate between 0.5% and 30% per month
          if (!isNaN(val) && val > 0 && val < 50) {
            currentMonthlyRate = val > 1 ? (val / 100) : val;
            calculateLoan();
            console.log(`[Shade Micro-Credit] Synced rate from Google Sheet: ${(currentMonthlyRate * 100).toFixed(2)}%`);
            return;
          }
        }
      }
    } catch (e) {
      // Silently fall back to default rate if offline
    }
  };

  if (loanAmountInput && loanTenureInput) {
    loanAmountInput.addEventListener('input', calculateLoan);
    loanTenureInput.addEventListener('input', calculateLoan);
    calculateLoan();
    syncRateFromGoogleSheet();
  }

  // Toggle Amortization Schedule Table
  if (toggleScheduleBtn && amortizationWrap) {
    toggleScheduleBtn.addEventListener('click', () => {
      const isHidden = amortizationWrap.style.display === 'none' || getComputedStyle(amortizationWrap).display === 'none';
      if (isHidden) {
        amortizationWrap.style.display = 'block';
        toggleScheduleBtn.textContent = 'Hide Month-by-Month Amortization Schedule';
        toggleScheduleBtn.setAttribute('aria-expanded', 'true');
      } else {
        amortizationWrap.style.display = 'none';
        toggleScheduleBtn.textContent = 'View Month-by-Month Amortization Schedule';
        toggleScheduleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ================= 4. LOAN APPLICATION MODAL & AUTO-PREFILL =================
  const modal = document.getElementById('loanModal') || document.getElementById('applicationModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const successCloseBtn = document.getElementById('successCloseBtn');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  
  const appAmountInput = document.getElementById('requestedAmount') || document.getElementById('appAmount');
  const appPackageSelect = document.getElementById('preferredProduct') || document.getElementById('appPackage');
  const appTenureSelect = document.getElementById('repaymentTenure');
  
  const loanAppForm = document.getElementById('loanAppForm');
  const modalSuccess = document.getElementById('modalSuccess');
  const modalAlert = document.getElementById('modalAlert');

  const openModal = (productName, amount, tenure) => {
    if (!modal) return;
    if (productName && appPackageSelect) {
      for (let i = 0; i < appPackageSelect.options.length; i++) {
        if (appPackageSelect.options[i].value === productName || appPackageSelect.options[i].text.includes(productName)) {
          appPackageSelect.selectedIndex = i;
          break;
        }
      }
    }
    if (amount && appAmountInput) {
      appAmountInput.value = amount;
    }
    if (tenure && appTenureSelect) {
      appTenureSelect.value = tenure;
    }
    modal.classList.add('active');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('active');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (modalAlert) {
      modalAlert.className = 'form-alert';
      modalAlert.textContent = '';
    }
    if (modalSuccess && loanAppForm) {
      modalSuccess.style.display = 'none';
      loanAppForm.style.display = 'block';
    }
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = btn.getAttribute('data-product');
      if (btn.id === 'proceedWithCalcBtn' || btn.id === 'calcApplyBtn') {
        const amt = loanAmountInput ? loanAmountInput.value : null;
        const ten = loanTenureInput ? loanTenureInput.value : null;
        openModal(product, amt, ten);
      } else {
        openModal(product, null, null);
      }
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (successCloseBtn) successCloseBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Handle Application Form Submission
  if (loanAppForm) {
    loanAppForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('fullName') || document.getElementById('appName');
      const phoneInput = document.getElementById('phoneNumber') || document.getElementById('appPhone');
      const amountInput = appAmountInput;
      const pkgSelect = appPackageSelect;

      const name = nameInput ? nameInput.value.trim() : 'Applicant';
      const phone = phoneInput ? phoneInput.value.trim() : 'Phone';
      const amount = amountInput ? amountInput.value : '5000';
      const pkg = pkgSelect ? pkgSelect.value : 'Micro-Credit';

      if (!name || !phone) {
        alert('Please complete all required fields.');
        return;
      }

      if (modalSuccess) {
        loanAppForm.style.display = 'none';
        modalSuccess.style.display = 'block';
      } else if (modalAlert) {
        modalAlert.className = 'form-alert success';
        modalAlert.textContent = `Thank you, ${name}! Your application for GH₵ ${Number(amount).toLocaleString()} (${pkg}) has been received. Our credit officer will call you at ${phone} within 24 to 48 hours.`;
      }

      loanAppForm.reset();
    });
  }

  // ================= 5. CONTACT FORM SUBMISSION =================
  const contactForm = document.getElementById('contactForm');
  const contactAlert = document.getElementById('contactAlert') || document.getElementById('contactSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('contactName');
      const phoneInput = document.getElementById('contactPhone');
      const name = nameInput ? nameInput.value.trim() : 'Valued Client';
      const phone = phoneInput ? phoneInput.value.trim() : '';

      if (contactAlert) {
        contactAlert.className = 'form-alert success';
        contactAlert.textContent = `Thank you, ${name}! Your message has been received by Shade Micro-Credit Enterprise. We will contact you at ${phone} promptly.`;
        contactAlert.style.display = 'block';
      } else {
        alert(`Thank you, ${name}! Your message has been sent to Shade Micro-Credit Enterprise.`);
      }

      contactForm.reset();
    });
  }

  // ================= 6. FAQ ACCORDION =================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger') || item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content') || item.querySelector('.faq-body');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            other.classList.remove('border-shade-teal');
            const otherTrigger = other.querySelector('.faq-trigger') || other.querySelector('.faq-header');
            const otherContent = other.querySelector('.faq-content') || other.querySelector('.faq-body');
            const otherIndicator = other.querySelector('.faq-indicator');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            if (otherContent) otherContent.classList.add('hidden');
            if (otherIndicator) otherIndicator.textContent = '+';
          }
        });

        // Toggle current item
        const indicator = item.querySelector('.faq-indicator');
        if (isActive) {
          item.classList.remove('active');
          item.classList.remove('border-shade-teal');
          trigger.setAttribute('aria-expanded', 'false');
          content.classList.add('hidden');
          if (indicator) indicator.textContent = '+';
        } else {
          item.classList.add('active');
          item.classList.add('border-shade-teal');
          trigger.setAttribute('aria-expanded', 'true');
          content.classList.remove('hidden');
          if (indicator) indicator.textContent = '−';
        }
      });
    }
  });

  // Open first item by default if present
  if (faqItems.length > 0) {
    const firstTrigger = faqItems[0].querySelector('.faq-trigger') || faqItems[0].querySelector('.faq-header');
    const firstContent = faqItems[0].querySelector('.faq-content') || faqItems[0].querySelector('.faq-body');
    const firstIndicator = faqItems[0].querySelector('.faq-indicator');
    if (firstTrigger && firstContent) {
      faqItems[0].classList.add('active');
      faqItems[0].classList.add('border-shade-teal');
      firstTrigger.setAttribute('aria-expanded', 'true');
      firstContent.classList.remove('hidden');
      if (firstIndicator) firstIndicator.textContent = '−';
    }
  }

  // ================= 7. PRIVACY COOKIE CONSENT BANNER =================
  const cookieBanner = document.getElementById('cookieBanner');
  const acceptCookiesBtn = document.getElementById('acceptCookiesBtn') || document.getElementById('acceptCookies');
  const declineCookiesBtn = document.getElementById('declineCookiesBtn') || document.getElementById('declineCookies');
  const openCookieSettingsBtn = document.getElementById('openCookieSettings');

  const COOKIE_STORAGE_KEY = 'shade_microcredit_cookies_accepted';

  const showCookieBanner = () => {
    if (cookieBanner) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
        cookieBanner.classList.remove('translate-y-full');
        cookieBanner.classList.add('translate-y-0');
      }, 700);
    }
  };

  const hideCookieBanner = () => {
    if (cookieBanner) {
      cookieBanner.classList.remove('show');
      cookieBanner.classList.add('translate-y-full');
      cookieBanner.classList.remove('translate-y-0');
    }
  };

  const savedCookieChoice = localStorage.getItem(COOKIE_STORAGE_KEY);
  if (!savedCookieChoice) {
    showCookieBanner();
  }

  if (acceptCookiesBtn) {
    acceptCookiesBtn.addEventListener('click', () => {
      localStorage.setItem(COOKIE_STORAGE_KEY, 'all');
      hideCookieBanner();
    });
  }

  if (declineCookiesBtn) {
    declineCookiesBtn.addEventListener('click', () => {
      localStorage.setItem(COOKIE_STORAGE_KEY, 'essential');
      hideCookieBanner();
    });
  }

  if (openCookieSettingsBtn) {
    openCookieSettingsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showCookieBanner();
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    });
  }

  // ================= 8. SCROLL REVEAL ANIMATIONS =================
  const revealElements = document.querySelectorAll(
    '.statement-card, .value-card, .product-card, .step-card, .calc-wrapper, .faq-item, .cta-banner-card, .contact-card, .testimonial-card, .feature-product-box, .step-pillar-card, .sounds-good-card'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
});
