/**
 * Shade Micro-Credit Enterprise - Master JavaScript
 * Aesthetic: Clean White High-End Minimalist Fintech
 * Features:
 * - Dynamic Sticky Navbar on Hero & Inner Pages
 * - Responsive Mobile Drawer Navigation (Full screen slide from right)
 * - Scheme-Aware Loan Calculator with Fee Breakdown (Weekly 9.2% & Monthly 7.0%)
 * - Live Google Sheets Rate & Limits Sync
 * - Dual Lead Capture: Async FormSubmit to Gmail & Instant WhatsApp Fast-Track
 * - FAQ Accordion
 * - Privacy Cookie Consent Banner with LocalStorage Persistence
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

  // ================= 2. MOBILE NAVIGATION (FULL-SCREEN SLIDE FROM RIGHT) =================
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const menuCloseBtn = document.getElementById('menuCloseBtn');

  if (menuToggle && navLinks) {
    const openMobileMenu = () => {
      menuToggle.classList.add('active');
      navLinks.classList.remove('translate-x-full');
      navLinks.classList.add('translate-x-0');
      document.body.style.overflow = 'hidden';
    };

    const closeMobileMenu = () => {
      menuToggle.classList.remove('active');
      navLinks.classList.add('translate-x-full');
      navLinks.classList.remove('translate-x-0');
      document.body.style.overflow = '';
    };

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.contains('translate-x-0');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (menuCloseBtn) {
      menuCloseBtn.addEventListener('click', closeMobileMenu);
    }

    // Close when clicking any nav link or button inside drawer
    navLinks.querySelectorAll('a, button').forEach(item => {
      item.addEventListener('click', closeMobileMenu);
    });

    // Close when resizing window to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        closeMobileMenu();
      }
    });
  }

  // ================= 3. SCHEME-AWARE LOAN CALCULATOR & CHARGES =================
  const calcSchemeSelect = document.getElementById('calcSchemeSelect');
  const loanAmountInput = document.getElementById('loanAmount');
  const loanTenureInput = document.getElementById('loanTenure');
  const loanAmountDisplay = document.getElementById('loanAmountDisplay');
  const loanTenureDisplay = document.getElementById('loanTenureDisplay');
  
  // Results display IDs
  const monthlyRepayment = document.getElementById('monthlyRepayment') || document.getElementById('monthlyInstallment');
  const totalInterestEl = document.getElementById('totalInterest');
  const totalPayableEl = document.getElementById('totalPayable') || document.getElementById('summaryTotal');
  const summaryPrincipal = document.getElementById('summaryPrincipal');
  const installmentLabel = document.getElementById('installmentLabel');

  // Breakdown fee IDs
  const calcProcessingFee = document.getElementById('calcProcessingFee');
  const calcInsuranceFee = document.getElementById('calcInsuranceFee');
  const calcApplicationFee = document.getElementById('calcApplicationFee');

  // Dynamic tenure markers
  const tenureMinMarker = document.getElementById('tenureMinMarker');
  const tenureMidMarker = document.getElementById('tenureMidMarker');
  const tenureMaxMarker = document.getElementById('tenureMaxMarker');

  // Dynamic range markers
  const loanMinDisplay = document.getElementById('loanMinDisplay');
  const loanMidDisplay = document.getElementById('loanMidDisplay');
  const loanMaxDisplay = document.getElementById('loanMaxDisplay');

  // GOOGLE SHEET LIVE SYNC CONFIGURATION
  const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSo2DhGVMmlfMDjWyPfWvTI5irzC8MA50gqgl47I-g1hXtH64OQyD51Ktlo6HkMQDHb6o6Nod1RK-gE/pub?gid=0&single=true&output=csv';

  // Base scheme defaults
  let currentMonthlyRate = 0.070; // 7.0% default for monthly schemes
  let minLoanAmount = 500;
  let maxLoanAmount = 100000;
  let loanStep = 500;

  const formatGHS = (val) => {
    return 'GH₵ ' + Number(val).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const calculateLoan = () => {
    if (!loanAmountInput || !loanTenureInput) return;

    const principal = parseFloat(loanAmountInput.value) || 5000;
    const isWeekly = calcSchemeSelect && calcSchemeSelect.value === 'weekly';
    const tenureVal = parseInt(loanTenureInput.value, 10) || (isWeekly ? 13 : 4);

    let totalInterest = 0;
    let installment = 0;
    let appFee = isWeekly ? 20 : 50;

    if (isWeekly) {
      currentMonthlyRate = 0.092; // 9.2% / month for weekly SME
      const monthsEquiv = tenureVal / (52 / 12); // ~4.333 weeks per month
      totalInterest = principal * currentMonthlyRate * monthsEquiv;
      const totalRepayable = principal + totalInterest;
      installment = totalRepayable / tenureVal;

      if (loanTenureDisplay) loanTenureDisplay.textContent = `${tenureVal} ${tenureVal === 1 ? 'Week' : 'Weeks'}`;
      if (installmentLabel) installmentLabel.textContent = 'Estimated Weekly Installment:';
    } else {
      // Monthly scheme (PL / AM / BL) at 7.0% flat per month
      currentMonthlyRate = 0.070;
      totalInterest = principal * currentMonthlyRate * tenureVal;
      const totalRepayable = principal + totalInterest;
      installment = totalRepayable / tenureVal;

      if (loanTenureDisplay) loanTenureDisplay.textContent = `${tenureVal} ${tenureVal === 1 ? 'Month' : 'Months'}`;
      if (installmentLabel) installmentLabel.textContent = 'Estimated Monthly Installment:';
    }

    const totalRepayable = principal + totalInterest;
    const processingFee = principal * 0.05; // 5%
    const insuranceFee = principal * 0.01;  // 1%

    if (loanAmountDisplay) loanAmountDisplay.textContent = 'GH₵ ' + Number(principal).toLocaleString();

    // Update live rate badges and result card rate displays
    const calcRateBadges = document.querySelectorAll('#calcRateBadge, .calc-rate-badge');
    calcRateBadges.forEach(badge => {
      badge.textContent = `${(currentMonthlyRate * 100).toFixed(2)}% / Mo`;
    });

    const summaryRateDisplays = document.querySelectorAll('#summaryRateDisplay');
    summaryRateDisplays.forEach(el => {
      el.textContent = `${(currentMonthlyRate * 100).toFixed(2)}%`;
    });

    if (monthlyRepayment) monthlyRepayment.textContent = formatGHS(installment);
    if (totalInterestEl) totalInterestEl.textContent = formatGHS(totalInterest);
    if (totalPayableEl) totalPayableEl.textContent = formatGHS(totalRepayable);
    if (summaryPrincipal) summaryPrincipal.textContent = formatGHS(principal);

    if (calcProcessingFee) calcProcessingFee.textContent = formatGHS(processingFee);
    if (calcInsuranceFee) calcInsuranceFee.textContent = formatGHS(insuranceFee);
    if (calcApplicationFee) calcApplicationFee.textContent = formatGHS(appFee);
  };

  const onSchemeChange = () => {
    if (!calcSchemeSelect || !loanTenureInput) return;
    const isWeekly = calcSchemeSelect.value === 'weekly';

    if (isWeekly) {
      currentMonthlyRate = 0.092;
      loanTenureInput.min = 4;
      loanTenureInput.max = 26;
      loanTenureInput.step = 1;
      loanTenureInput.value = 13;
      if (tenureMinMarker) tenureMinMarker.textContent = '4 Weeks';
      if (tenureMidMarker) tenureMidMarker.textContent = '13 Weeks';
      if (tenureMaxMarker) tenureMaxMarker.textContent = '26 Weeks';
    } else {
      currentMonthlyRate = 0.070;
      loanTenureInput.min = 1;
      loanTenureInput.max = 12;
      loanTenureInput.step = 1;
      loanTenureInput.value = 4;
      if (tenureMinMarker) tenureMinMarker.textContent = '1 Month';
      if (tenureMidMarker) tenureMidMarker.textContent = '4 Months';
      if (tenureMaxMarker) tenureMaxMarker.textContent = '12 Months';
    }
    calculateLoan();
  };

  const updateLoanBounds = (min, max, step) => {
    if (!loanAmountInput) return;
    if (min) minLoanAmount = min;
    if (max) maxLoanAmount = max;
    if (step) loanStep = step;

    loanAmountInput.min = minLoanAmount;
    loanAmountInput.max = maxLoanAmount;
    loanAmountInput.step = loanStep;

    const mid = Math.round((minLoanAmount + maxLoanAmount) / 2);

    if (loanMinDisplay) loanMinDisplay.textContent = 'GH₵ ' + Number(minLoanAmount).toLocaleString();
    if (loanMidDisplay) loanMidDisplay.textContent = 'GH₵ ' + Number(mid).toLocaleString();
    if (loanMaxDisplay) loanMaxDisplay.textContent = 'GH₵ ' + Number(maxLoanAmount).toLocaleString();

    let currentVal = parseFloat(loanAmountInput.value) || minLoanAmount;
    if (currentVal < minLoanAmount) loanAmountInput.value = minLoanAmount;
    if (currentVal > maxLoanAmount) loanAmountInput.value = maxLoanAmount;
  };

  // Live Sync Function for Google Sheets
  const syncRateFromGoogleSheet = async () => {
    if (!GOOGLE_SHEET_CSV_URL || !GOOGLE_SHEET_CSV_URL.startsWith('http')) return;
    try {
      const res = await fetch(GOOGLE_SHEET_CSV_URL);
      if (!res.ok) return;
      const csv = await res.text();
      const lines = csv.split(/\r?\n/);

      let foundRate = false;
      let newMin = null;
      let newMax = null;
      let newStep = null;

      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;
        const cols = line.split(',');
        const label = (cols[0] || '').toLowerCase();
        const rawVal = cols[1] !== undefined ? cols[1] : cols[0];

        if (label.includes('min')) {
          const num = parseFloat(rawVal.replace(/[^0-9.]/g, ''));
          if (!isNaN(num) && num > 0) newMin = num;
        } else if (label.includes('max')) {
          const num = parseFloat(rawVal.replace(/[^0-9.]/g, ''));
          if (!isNaN(num) && num > 0) newMax = num;
        } else if (label.includes('step')) {
          const num = parseFloat(rawVal.replace(/[^0-9.]/g, ''));
          if (!isNaN(num) && num > 0) newStep = num;
        }
      }

      if (newMin || newMax || newStep) {
        updateLoanBounds(newMin, newMax, newStep);
      }

      calculateLoan();
    } catch (e) {
      console.warn('[Shade Micro-Credit] Using standard scheme rates:', e);
    }
  };

  if (loanAmountInput && loanTenureInput) {
    updateLoanBounds(minLoanAmount, maxLoanAmount, loanStep);
    loanAmountInput.addEventListener('input', calculateLoan);
    loanTenureInput.addEventListener('input', calculateLoan);
    if (calcSchemeSelect) {
      calcSchemeSelect.addEventListener('change', onSchemeChange);
    }
    calculateLoan();
    syncRateFromGoogleSheet();
  }

  // ================= 4. LOAN APPLICATION MODAL & DUAL LEAD CAPTURE =================
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
  const modalSummaryDetails = document.getElementById('modalSummaryDetails');
  const modalWhatsAppFastTrack = document.getElementById('modalWhatsAppFastTrack');

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
      if (typeof tenure === 'number' || !isNaN(Number(tenure))) {
        const num = Number(tenure);
        if (num > 6) {
          appTenureSelect.value = '13 Weeks';
        } else {
          appTenureSelect.value = `${num} Months`;
        }
      } else {
        appTenureSelect.value = tenure;
      }
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
      modalSuccess.classList.add('hidden');
      loanAppForm.classList.remove('hidden');
      loanAppForm.style.display = 'block';
    }
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = btn.getAttribute('data-product');
      if (btn.id === 'proceedWithCalcBtn' || btn.id === 'calcApplyBtn') {
        const amt = loanAmountInput ? loanAmountInput.value : null;
        let ten = null;
        if (calcSchemeSelect && calcSchemeSelect.value === 'weekly') {
          ten = '13 Weeks';
        } else if (loanTenureInput) {
          ten = `${loanTenureInput.value} Months`;
        }
        let selectedProduct = 'SME Loan Monthly (PL)';
        if (calcSchemeSelect) {
          const val = calcSchemeSelect.value;
          if (val === 'weekly') selectedProduct = 'SME Loan Weekly (SLW)';
          else if (val === 'monthly-auto') selectedProduct = 'Auto Maintenance (AM)';
          else if (val === 'monthly-business') selectedProduct = 'Business Loan (BL)';
          else selectedProduct = 'SME Loan Monthly (PL)';
        }
        openModal(selectedProduct, amt, ten);
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

  // Handle Application Form Submission (Dual Lead Capture)
  if (loanAppForm) {
    loanAppForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = loanAppForm.querySelector('button[type="submit"]');
      const origBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Submitting Application...';
      }

      const name = (document.getElementById('fullName') || {}).value || 'Applicant';
      const phone = (document.getElementById('phoneNumber') || {}).value || 'N/A';
      const ghanaCard = (document.getElementById('ghanaCard') || {}).value || 'N/A';
      const email = (document.getElementById('emailAddress') || {}).value || 'Not provided';
      const location = (document.getElementById('businessLocation') || {}).value || 'Accra';
      const scheme = appPackageSelect ? appPackageSelect.value : 'SME Loan Monthly (PL)';
      const amount = appAmountInput ? appAmountInput.value : '5000';
      const tenure = appTenureSelect ? appTenureSelect.value : '4 Months';
      const purpose = (document.getElementById('businessPurpose') || {}).value || 'Business capital';

      // 1. Asynchronous Email Dispatch to shademicrocredit@gmail.com
      const payload = {
        _subject: `New Credit Application: ${name} (GH₵ ${Number(amount).toLocaleString()} - ${scheme})`,
        fullName: name,
        phoneNumber: phone,
        ghanaCard: ghanaCard,
        email: email,
        businessLocation: location,
        scheme: scheme,
        requestedAmount: `GH₵ ${Number(amount).toLocaleString()}`,
        repaymentTenure: tenure,
        businessPurpose: purpose,
        timestamp: new Date().toLocaleString('en-GB', { timeZone: 'Africa/Accra' })
      };

      try {
        fetch('https://formsubmit.co/ajax/shademicrocredit@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        }).catch(err => console.log('FormSubmit background notification:', err));
      } catch (err) {
        console.warn('FormSubmit fetch failed, falling back:', err);
      }

      // 2. Pre-generate WhatsApp Fast-Track Link
      const waText = encodeURIComponent(
        `*New Loan Application - Shade Micro-Credit Enterprise*\n` +
        `• *Applicant:* ${name}\n` +
        `• *Phone:* ${phone}\n` +
        `• *Ghana Card:* ${ghanaCard}\n` +
        `• *Location:* ${location}\n` +
        `• *Scheme:* ${scheme}\n` +
        `• *Amount:* GH₵ ${Number(amount).toLocaleString()}\n` +
        `• *Tenure:* ${tenure}\n` +
        `• *Purpose:* ${purpose}\n\n` +
        `Please confirm receipt and let me know the inspection/appraisal schedule.`
      );
      const waUrl = `https://wa.me/233256099465?text=${waText}`;

      if (modalWhatsAppFastTrack) {
        modalWhatsAppFastTrack.href = waUrl;
      }

      // 3. Populate Summary Details
      if (modalSummaryDetails) {
        modalSummaryDetails.innerHTML = `
          <div class="flex justify-between border-b border-slate-200 pb-1.5">
            <span class="text-slate-500">Applicant:</span>
            <span class="font-bold text-slate-800">${name}</span>
          </div>
          <div class="flex justify-between border-b border-slate-200 pb-1.5">
            <span class="text-slate-500">Phone Number:</span>
            <span class="font-bold text-slate-800">${phone}</span>
          </div>
          <div class="flex justify-between border-b border-slate-200 pb-1.5">
            <span class="text-slate-500">Selected Scheme:</span>
            <span class="font-bold text-shade-teal">${scheme}</span>
          </div>
          <div class="flex justify-between border-b border-slate-200 pb-1.5">
            <span class="text-slate-500">Requested Capital:</span>
            <span class="font-bold text-slate-900">GH₵ ${Number(amount).toLocaleString()}</span>
          </div>
          <div class="flex justify-between border-b border-slate-200 pb-1.5">
            <span class="text-slate-500">Duration:</span>
            <span class="font-bold text-slate-800">${tenure}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Capture Method:</span>
            <span class="text-emerald-600 font-bold">Email to Branch Desk + WhatsApp</span>
          </div>
        `;
      }

      // 4. Reveal Success State
      loanAppForm.classList.add('hidden');
      loanAppForm.style.display = 'none';
      if (modalSuccess) {
        modalSuccess.classList.remove('hidden');
        modalSuccess.style.display = 'block';
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnText;
      }

      loanAppForm.reset();
    });
  }

  // ================= 5. CONTACT FORM SUBMISSION =================
  const contactForm = document.getElementById('contactForm');
  const contactAlert = document.getElementById('contactAlert') || document.getElementById('contactSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('contactName');
      const phoneInput = document.getElementById('contactPhone');
      const emailInput = document.getElementById('contactEmail');
      const subjectInput = document.getElementById('contactSubject');
      const messageInput = document.getElementById('contactMessage');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      const name = nameInput ? nameInput.value.trim() : 'Valued Client';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value : 'General Inquiry';
      const message = messageInput ? messageInput.value.trim() : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending Message...';
      }

      // Dispatch to FormSubmit
      try {
        fetch('https://formsubmit.co/ajax/shademicrocredit@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `New Inquiry from ${name} (${subject})`,
            fullName: name,
            phone: phone,
            email: email,
            inquiryTopic: subject,
            message: message,
            timestamp: new Date().toLocaleString('en-GB', { timeZone: 'Africa/Accra' })
          })
        }).catch(err => console.log('Contact form notification:', err));
      } catch (err) {
        console.warn('Contact dispatch note:', err);
      }

      if (contactAlert) {
        contactAlert.className = 'p-4 text-xs font-semibold bg-emerald-50 text-shade-teal border border-emerald-200 mt-4 block';
        contactAlert.innerHTML = `Thank you, <strong>${name}</strong>! Your inquiry regarding <em>${subject}</em> has been sent to our credit officers. We will call you at <strong>${phone}</strong> promptly.`;
        contactAlert.style.display = 'block';
      } else {
        alert(`Thank you, ${name}! Your inquiry has been sent to Shade Micro-Credit Enterprise.`);
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
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
