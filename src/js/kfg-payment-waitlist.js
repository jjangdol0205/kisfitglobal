/**
 * KISFIT Bio Labs (Division 2 Global — kisfitglobal.com)
 * src/js/kfg-payment-waitlist.js
 *
 * Standardized Polar.sh Native Payment Configuration (`window.PAYMENT_CONFIG`),
 * Single-Fire Paid Click & VIP Waitlist Abacus Beacons (`kfg_kisfitglobal`),
 * Smart Polar.sh Checkout Router (In-App WebView Safe Redirect + Email Prefill),
 * and Zero-Drop VIP Founding Member 20% Early-Bird Waitlist Modal.
 *
 * 100% English (Zero-Hangul) · Polar.sh (Merchant of Record · Global Card / Apple Pay / Google Pay)
 */
(function (global) {
  'use strict';

  var NS = 'kfg_kisfitglobal';
  var ABACUS_BASE = 'https://abacus.jasoncameron.dev/hit/' + NS + '/';
  var IN_APP_WEBVIEW_RE = /Instagram|FBAN|FBAV|KAKAOTALK|Line/i;

  var LIVE_KFG_SINGLE_URL = 'https://buy.polar.sh/polar_cl_v2pLSQbvj13RJxb57w8fqVjZ4h2C7YopmPUDr3vxfG6?locale=en';
  var LIVE_KFG_PASS_URL = 'https://buy.polar.sh/polar_cl_p8DAvlbz7wPj6SOPKhHjT5aaNyA2F3I528A3c15nBND?locale=en';
  var LIVE_KFG_PREMIUM_URL = 'https://buy.polar.sh/polar_cl_iCvFT7ApBXaG7fRlOqjqbrRwXx0caCgnuITrW3TKk0e?locale=en';

  function ensurePolarLocaleOnly(rawUrl) {
    var url = String(rawUrl || '').trim();
    if (!url) return '';
    if (!/^https:\/\/buy\.polar\.sh\//i.test(url)) return url;
    try {
      if (typeof URL === 'function') {
        var u = new URL(url);
        u.searchParams.set('locale', 'en');
        return u.toString();
      }
    } catch (_) {}
    if (!/(?:[?&])locale=/i.test(url)) {
      return url + (url.indexOf('?') === -1 ? '?' : '&') + 'locale=en';
    }
    return url.replace(/([?&])locale=[^&#]*/i, '$1locale=en');
  }

  var DEFAULT_PAYMENT_CONFIG = {
    PROVIDER: 'polar_sh',
    DIVISION: 'KFG',
    STORE_SLOT: 'PEDIATRIC_STORE_SLOT',
    STORE_LIVE_READY: true,
    POLAR_CHECKOUT_URLS: {
      single_899: LIVE_KFG_SINGLE_URL,
      pass_1999: LIVE_KFG_PASS_URL,
      premium_4900: LIVE_KFG_PREMIUM_URL
    },
    POLAR_KFG_SINGLE_URL: LIVE_KFG_SINGLE_URL,
    POLAR_KFG_PASS_URL: LIVE_KFG_PASS_URL,
    POLAR_KFG_PREMIUM_URL: LIVE_KFG_PREMIUM_URL,
    SUPPORT_EMAIL: 'care@kisfitglobal.com'
  };

  function mergePaymentConfig(existing) {
    var base = {
      PROVIDER: 'polar_sh',
      DIVISION: 'KFG',
      STORE_SLOT: 'PEDIATRIC_STORE_SLOT',
      STORE_LIVE_READY: true,
      POLAR_CHECKOUT_URLS: {
        single_899: LIVE_KFG_SINGLE_URL,
        pass_1999: LIVE_KFG_PASS_URL,
        premium_4900: LIVE_KFG_PREMIUM_URL
      },
      POLAR_KFG_SINGLE_URL: LIVE_KFG_SINGLE_URL,
      POLAR_KFG_PASS_URL: LIVE_KFG_PASS_URL,
      POLAR_KFG_PREMIUM_URL: LIVE_KFG_PREMIUM_URL,
      SUPPORT_EMAIL: 'care@kisfitglobal.com'
    };
    if (existing && typeof existing === 'object') {
      if (typeof existing.STORE_LIVE_READY === 'boolean') {
        base.STORE_LIVE_READY = existing.STORE_LIVE_READY;
      }
      if (existing.POLAR_CHECKOUT_URLS && typeof existing.POLAR_CHECKOUT_URLS === 'object') {
        if (typeof existing.POLAR_CHECKOUT_URLS.single_899 === 'string' && existing.POLAR_CHECKOUT_URLS.single_899.trim()) {
          base.POLAR_CHECKOUT_URLS.single_899 = ensurePolarLocaleOnly(existing.POLAR_CHECKOUT_URLS.single_899.trim());
        }
        if (typeof existing.POLAR_CHECKOUT_URLS.pass_1999 === 'string' && existing.POLAR_CHECKOUT_URLS.pass_1999.trim()) {
          base.POLAR_CHECKOUT_URLS.pass_1999 = ensurePolarLocaleOnly(existing.POLAR_CHECKOUT_URLS.pass_1999.trim());
        }
        if (typeof existing.POLAR_CHECKOUT_URLS.premium_4900 === 'string' && existing.POLAR_CHECKOUT_URLS.premium_4900.trim()) {
          base.POLAR_CHECKOUT_URLS.premium_4900 = ensurePolarLocaleOnly(existing.POLAR_CHECKOUT_URLS.premium_4900.trim());
        }
      }
      if (typeof existing.POLAR_KFG_SINGLE_URL === 'string' && existing.POLAR_KFG_SINGLE_URL.trim()) {
        base.POLAR_KFG_SINGLE_URL = ensurePolarLocaleOnly(existing.POLAR_KFG_SINGLE_URL.trim());
      }
      if (typeof existing.POLAR_KFG_PASS_URL === 'string' && existing.POLAR_KFG_PASS_URL.trim()) {
        base.POLAR_KFG_PASS_URL = ensurePolarLocaleOnly(existing.POLAR_KFG_PASS_URL.trim());
      }
      if (typeof existing.POLAR_KFG_PREMIUM_URL === 'string' && existing.POLAR_KFG_PREMIUM_URL.trim()) {
        base.POLAR_KFG_PREMIUM_URL = ensurePolarLocaleOnly(existing.POLAR_KFG_PREMIUM_URL.trim());
      }
      if (typeof existing.SUPPORT_EMAIL === 'string' && existing.SUPPORT_EMAIL.trim()) {
        base.SUPPORT_EMAIL = existing.SUPPORT_EMAIL.trim();
      }
    }
    return base;
  }

  global.PAYMENT_CONFIG = mergePaymentConfig(global.PAYMENT_CONFIG);

  function getKstDateString() {
    return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
  }

  function normalizePlanKey(rawPlan) {
    var s = String(rawPlan || '').toLowerCase();
    if (s === 'premium' || s === 'premium_4900' || s === 'tier3' || s === 'annual' || s.indexOf('49') !== -1 || s.indexOf('12-month') !== -1 || s.indexOf('suite') !== -1) {
      return 'premium';
    }
    if (
      s === 'pass' ||
      s === 'pass_1999' ||
      s === 'sixmonth' ||
      s === 'six_month' ||
      s.indexOf('19.99') !== -1 ||
      s.indexOf('6-month') !== -1
    ) {
      return 'sixMonth';
    }
    return 'single';
  }

  function getSavedParentEmail() {
    try {
      var checkoutInput = typeof document !== 'undefined' ? document.getElementById('checkout-parent-email') : null;
      if (checkoutInput && checkoutInput.value && String(checkoutInput.value).indexOf('@') !== -1) {
        return String(checkoutInput.value).trim();
      }
      if (global.DreamCompanyCRM && typeof global.DreamCompanyCRM.getLocalMember === 'function') {
        var m = global.DreamCompanyCRM.getLocalMember('KFG');
        if (m && m.email) return String(m.email).trim();
      }
      if (global.localStorage) {
        return String(
          global.localStorage.getItem('kfg_parent_member_email') ||
          global.localStorage.getItem('kidsfit_pending_polar_checkout_email_v1') ||
          global.localStorage.getItem('kidsfit_global_buyer_email') ||
          ''
        ).trim();
      }
    } catch (_) {}
    return '';
  }

  function resolvePolarPlanUrl(rawPlan, cfgOverride) {
    var cfg = cfgOverride || global.PAYMENT_CONFIG || DEFAULT_PAYMENT_CONFIG;
    var urls = cfg.POLAR_CHECKOUT_URLS || {};
    var slotKey = normalizePlanKey(rawPlan);
    if (slotKey === 'premium') {
      return ensurePolarLocaleOnly(String(urls.premium_4900 || cfg.POLAR_KFG_PREMIUM_URL || LIVE_KFG_PREMIUM_URL).trim());
    }
    if (slotKey === 'sixMonth') {
      return ensurePolarLocaleOnly(String(urls.pass_1999 || cfg.POLAR_KFG_PASS_URL || '').trim());
    }
    return ensurePolarLocaleOnly(String(urls.single_899 || cfg.POLAR_KFG_SINGLE_URL || '').trim());
  }

  function ensureKfgPolarLocaleUrl(rawUrl, emailOverride) {
    var url = String(rawUrl || '').trim();
    if (!url) return '';
    var isPolar = /^https:\/\/buy\.polar\.sh\//i.test(url);
    var email = String(emailOverride !== undefined ? emailOverride : getSavedParentEmail()).trim();
    var hasValidEmail = Boolean(email && email.indexOf('@') !== -1);
    try {
      if (typeof URL === 'function' && /^https?:\/\//i.test(url)) {
        var u = new URL(url);
        if (isPolar) {
          u.searchParams.set('locale', 'en');
        }
        if (hasValidEmail) {
          u.searchParams.set('customer_email', email);
        }
        return u.toString();
      }
    } catch (_) {}
    if (isPolar && !/(?:[?&])locale=/i.test(url)) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + 'locale=en';
    } else if (isPolar) {
      url = url.replace(/([?&])locale=[^&#]*/i, '$1locale=en');
    }
    if (hasValidEmail && !/(?:[?&])customer_email=/i.test(url)) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + 'customer_email=' + encodeURIComponent(email);
    } else if (hasValidEmail) {
      url = url.replace(/([?&])customer_email=[^&#]*/i, '$1customer_email=' + encodeURIComponent(email));
    }
    return url;
  }

  function appendCustomerEmailToPolarUrl(rawUrl, emailOverride) {
    return ensureKfgPolarLocaleUrl(rawUrl, emailOverride);
  }

  function resolveKfgLiveCheckoutState(rawPlan) {
    var cfg = global.PAYMENT_CONFIG || DEFAULT_PAYMENT_CONFIG;
    var slotKey = normalizePlanKey(rawPlan);
    var resolvedPolarUrl = resolvePolarPlanUrl(slotKey, cfg);
    var isValidPolarLive = cfg.STORE_LIVE_READY === true && /^https:\/\/buy\.polar\.sh\/.+/i.test(resolvedPolarUrl);

    if (isValidPolarLive) {
      return {
        isLive: true,
        mode: 'polar_sh',
        slotKey: slotKey,
        url: ensureKfgPolarLocaleUrl(resolvedPolarUrl)
      };
    }

    return {
      isLive: false,
      mode: 'waitlist',
      slotKey: slotKey,
      url: ''
    };
  }

  function persistSurveyProfileBeforeCheckout() {
    try {
      if (typeof global.persistKfgSurveyProfileForCheckout === 'function') {
        global.persistKfgSurveyProfileForCheckout();
        return;
      }
      if (!global.localStorage) return;
      var wiz = global.TallerOnboardingWizard || global.KidsFitOnboardingWizard;
      var wizProf = {};
      if (wiz && typeof wiz.readProfileFromForm === 'function' && typeof document !== 'undefined' && document.getElementById('diagnosis-form')) {
        try { wizProf = wiz.readProfileFromForm() || {}; } catch (_) {}
      } else if (wiz && typeof wiz.getState === 'function' && wiz.getState()) {
        wizProf = wiz.getState().profile || {};
      }
      var appProf = (global.KidsFitApp && global.KidsFitApp.state && global.KidsFitApp.state.profile) || {};
      var prevRaw = global.localStorage.getItem('kfg_saved_survey_profile_v1') || global.localStorage.getItem('kidsfit_last_quiz_profile_v1') || '';
      var prevProf = {};
      if (prevRaw) {
        try { prevProf = JSON.parse(prevRaw) || {}; } catch (_) {}
      }
      var merged = Object.assign({}, prevProf, appProf, wizProf);
      if (merged && (merged.currentHeight || merged.ageMonths || merged.gender)) {
        var json = JSON.stringify(merged);
        global.localStorage.setItem('kfg_saved_survey_profile_v1', json);
        global.localStorage.setItem('kidsfit_last_quiz_profile_v1', json);
      }
    } catch (_) {}
  }

  function navigateToKfgPolarCheckout(rawUrl, rawPlan) {
    persistSurveyProfileBeforeCheckout();
    var memberEmail = getSavedParentEmail();
    var checkoutUrl = ensureKfgPolarLocaleUrl(rawUrl, memberEmail);
    if (!checkoutUrl) {
      openKfgVipWaitlistModal(rawPlan);
      return false;
    }
    try {
      if (memberEmail && memberEmail.indexOf('@') !== -1 && global.localStorage) {
        global.localStorage.setItem('kidsfit_pending_polar_checkout_email_v1', memberEmail);
      }
    } catch (_) {}

    var ua = (typeof navigator !== 'undefined' && navigator.userAgent) ? String(navigator.userAgent) : '';
    if (IN_APP_WEBVIEW_RE.test(ua)) {
      if (global.location) {
        global.location.href = checkoutUrl;
      }
      return true;
    }

    if (global.PolarEmbedCheckout && typeof global.PolarEmbedCheckout.create === 'function') {
      try {
        global.PolarEmbedCheckout.create(checkoutUrl, 'light');
        return true;
      } catch (_) {}
    }

    if (global.location) {
      global.location.href = checkoutUrl;
      return true;
    }
    if (typeof global.open === 'function') {
      global.open(checkoutUrl, '_blank', 'noopener');
      return true;
    }
    return false;
  }

  function fireAbacusKey(key) {
    try {
      if (typeof global.fetch === 'function') {
        global.fetch(ABACUS_BASE + key, { mode: 'cors', keepalive: true }).catch(function () {});
      }
    } catch (_) {}
  }

  function recordKfgPaidClickOnce(rawPlan) {
    var now = Date.now();
    if (global.__kfgLastPaidClickAt && (now - global.__kfgLastPaidClickAt) < 400) {
      return false;
    }
    global.__kfgLastPaidClickAt = now;
    var kst = getKstDateString();
    fireAbacusKey('paid_click_' + kst);
    fireAbacusKey('paid_click_total');
    fireAbacusKey('paid_click');
    return true;
  }

  function recordKfgSignupBeacons(opts) {
    var kst = getKstDateString();
    if (opts && opts.isVipWaitlist) {
      fireAbacusKey('vip_waitlist_' + kst);
      fireAbacusKey('vip_waitlist_total');
      fireAbacusKey('vip_waitlist');
    }
    fireAbacusKey('signup_' + kst);
    fireAbacusKey('signup');
    fireAbacusKey('signup_total');
  }

  function escHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  var activeWaitlistPlan = 'single';

  function selectKfgWaitlistPlan(planKey) {
    activeWaitlistPlan = normalizePlanKey(planKey);
    if (typeof document === 'undefined') return;
    var btnSingle = document.getElementById('kfg-wl-plan-single');
    var btnSix = document.getElementById('kfg-wl-plan-sixMonth');
    var summaryEl = document.getElementById('kfg-wl-selected-summary');
    var isSix = activeWaitlistPlan === 'sixMonth';

    if (btnSingle) {
      btnSingle.style.border = !isSix ? '2px solid #1D4ED8' : '1.5px solid #CBD5E1';
      btnSingle.style.background = !isSix ? '#EFF6FF' : '#F8FAFC';
    }
    if (btnSix) {
      btnSix.style.border = isSix ? '2px solid #059669' : '1.5px solid #CBD5E1';
      btnSix.style.background = isSix ? '#ECFDF5' : '#F8FAFC';
    }
    if (summaryEl) {
      summaryEl.innerHTML = isSix
        ? 'Selected: <strong>6-Month Growth &amp; Velocity Pass ($19.99 &rarr; $15.99 w/ 20% Founding Voucher)</strong> &middot; Includes Printable US CDC Percentile &amp; Bone-Age PDF Guide + 30-Day Growth Velocity Tracker (6 Monthly Checklists &amp; Commentary).'
        : 'Selected: <strong>Single Growth &amp; Bone-Age PDF Guide ($8.99 &rarr; $7.19 w/ 20% Founding Voucher)</strong> &middot; Includes Printable US CDC Percentile &amp; Bone-Age PDF Guide + 30-Day Growth Velocity Tracker (+1x 30-Day Check-in).';
    }
  }

  function closeKfgVipWaitlistModal() {
    if (typeof document === 'undefined') return;
    var m = document.getElementById('kfg-vip-waitlist-modal');
    if (m) m.remove();
  }

  function submitKfgVipWaitlistForm(ev) {
    if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();
    if (typeof document === 'undefined') return false;

    var emailEl = document.getElementById('kfg-waitlist-email');
    var statusEl = document.getElementById('kfg-waitlist-status');
    var btnEl = document.getElementById('btn-kfg-waitlist-submit');
    var email = emailEl ? String(emailEl.value || '').trim().toLowerCase() : '';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.style.background = '#FEF2F2';
        statusEl.style.border = '1px solid #FCA5A5';
        statusEl.style.color = '#B91C1C';
        statusEl.textContent = 'Please enter a valid parent email address (e.g., parent@gmail.com).';
      }
      if (emailEl) emailEl.focus();
      return false;
    }

    var selectedPlanLabel = activeWaitlistPlan === 'sixMonth'
      ? '6-Month Growth & Velocity Pass ($19.99)'
      : 'Single Growth & Bone-Age PDF Guide ($8.99)';
    if (btnEl) {
      btnEl.disabled = true;
      btnEl.textContent = 'Reserving Your 20% Founding Voucher...';
    }

    try {
      if (global.localStorage) {
        global.localStorage.setItem('kfg_parent_member_email', email);
        global.localStorage.setItem('kidsfit_pending_polar_checkout_email_v1', email);
        global.localStorage.setItem('kfg_vip_waitlist_reserved_v1', JSON.stringify({
          email: email,
          plan: activeWaitlistPlan,
          provider: 'polar_sh',
          reservedAt: new Date().toISOString()
        }));
      }
    } catch (_) {}

    recordKfgSignupBeacons({ isVipWaitlist: true });

    var finish = function () {
      if (btnEl) {
        btnEl.disabled = false;
        btnEl.textContent = 'Reserved! 20% Early-Bird Voucher Locked In';
      }
      if (typeof global.syncKfgParentDashboardUI === 'function') {
        try { global.syncKfgParentDashboardUI(email, 'VIP Founding Member Waitlist'); } catch (_) {}
      }
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.style.background = '#ECFDF5';
        statusEl.style.border = '1.5px solid #10B981';
        statusEl.style.color = '#065F46';
        statusEl.innerHTML =
          '<strong>20% Early-Bird Voucher Reserved for ' + escHtml(email) + '!</strong><br>' +
          'Plan reserved: <strong>' + escHtml(selectedPlanLabel) + '</strong> (Code <code>KFG-FOUNDER-20</code>). ' +
          'We will send your priority checkout link via Polar.sh the moment express billing opens—and your free US CDC Growth &amp; Sleep Checklist is active right now.';
      }
    };

    if (global.DreamCompanyCRM && typeof global.DreamCompanyCRM.registerMember === 'function') {
      global.DreamCompanyCRM.registerMember({
        div: 'KFG',
        email: email,
        segment: 'vip_waitlist',
        lang: 'en-US',
        notes: 'site=kisfitglobal.com | provider=polar_sh | plan=' + selectedPlanLabel
      }).then(finish).catch(finish);
    } else {
      finish();
    }
    return false;
  }

  function verifyExistingVipLicenseInModal() {
    if (typeof document === 'undefined') return;
    var codeEl = document.getElementById('kfg-wl-license-input');
    var msgEl = document.getElementById('kfg-wl-license-msg');
    var code = codeEl ? String(codeEl.value || '').trim() : '';
    if (!code) {
      if (msgEl) {
        msgEl.style.display = 'block';
        msgEl.style.color = '#B91C1C';
        msgEl.textContent = 'Please enter your VIP Access Code or License Key.';
      }
      return;
    }
    var checkoutCodeInput = document.getElementById('checkout-order-code');
    if (!checkoutCodeInput) {
      var temp = document.createElement('input');
      temp.type = 'hidden';
      temp.id = 'checkout-order-code';
      temp.value = code;
      document.body.appendChild(temp);
    } else {
      checkoutCodeInput.value = code;
    }
    var vipCodeInput = document.getElementById('input-global-vip-code');
    if (vipCodeInput) vipCodeInput.value = code;

    if (typeof global.applyKidsFitGlobalVipCode === 'function') {
      var prevUnlocked = false;
      try { prevUnlocked = global.localStorage && global.localStorage.getItem('kidsfit_global_report_unlocked_v1') === 'true'; } catch (_) {}
      global.applyKidsFitGlobalVipCode();
      var nowUnlocked = false;
      try { nowUnlocked = global.localStorage && global.localStorage.getItem('kidsfit_global_report_unlocked_v1') === 'true'; } catch (_) {}
      if (!prevUnlocked && nowUnlocked) {
        closeKfgVipWaitlistModal();
        return;
      }
    }
    if (typeof global.completeKidsFitGlobalCheckout === 'function') {
      global.completeKidsFitGlobalCheckout();
      setTimeout(function () {
        try {
          if (global.localStorage && global.localStorage.getItem('kidsfit_global_report_unlocked_v1') === 'true') {
            closeKfgVipWaitlistModal();
          }
        } catch (_) {}
      }, 400);
    }
  }

  function openKfgVipWaitlistModal(rawPlan) {
    if (typeof document === 'undefined' || !document.body) return;
    activeWaitlistPlan = normalizePlanKey(rawPlan);
    closeKfgVipWaitlistModal();

    var prefillEmail = escHtml(getSavedParentEmail());
    var isSix = activeWaitlistPlan === 'sixMonth';

    var modal = document.createElement('div');
    modal.id = 'kfg-vip-waitlist-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'kfg-vip-waitlist-title');
    modal.style.cssText = 'position:fixed;inset:0;z-index:100020;background:rgba(15,23,42,0.76);display:flex;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(4px);';
    modal.onclick = function (e) {
      if (e.target === modal) closeKfgVipWaitlistModal();
    };

    modal.innerHTML =
      '<div style="background:#FFFFFF;border:2px solid #1D4ED8;border-radius:22px;max-width:500px;width:100%;padding:1.45rem 1.35rem;box-shadow:0 25px 60px rgba(15,23,42,0.38);color:#0F172A;text-align:left;max-height:92vh;overflow-y:auto;font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:0.75rem;margin-bottom:0.8rem;padding-bottom:0.65rem;border-bottom:1px solid #E2E8F0;">' +
          '<div>' +
            '<span style="display:inline-block;font-size:0.72rem;font-weight:900;color:#1D4ED8;background:#EFF6FF;border:1px solid #BFDBFE;padding:0.2rem 0.6rem;border-radius:9999px;margin-bottom:0.35rem;">VIP FOUNDING MEMBER PRIORITY ACCESS &middot; POLAR.SH</span>' +
            '<h3 id="kfg-vip-waitlist-title" style="margin:0;font-size:1.08rem;font-weight:900;color:#0F172A;line-height:1.32;">VIP Founding Member 20% Early-Bird Waitlist (1-Second Email Reserve)</h3>' +
          '</div>' +
          '<button type="button" data-csp-act="kfg-wl-close" aria-label="Close modal" style="background:#F1F5F9;border:1px solid #CBD5E1;border-radius:9999px;width:34px;height:34px;font-weight:900;color:#0F172A;cursor:pointer;flex-shrink:0;">&#10005;</button>' +
        '</div>' +

        '<p style="margin:0 0 0.85rem;font-size:0.86rem;color:#334155;line-height:1.55;">' +
          'Our global USD checkout via <strong>Polar.sh (Merchant of Record · Global Card / Apple Pay / Google Pay)</strong> is completing final live store activation. Reserve in 1 second below to lock in your <strong>20% Early-Bird Founding Voucher</strong> and receive instant free US CDC growth &amp; sleep checklist access today.' +
        '</p>' +

        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.55rem;margin-bottom:0.75rem;">' +
          '<button type="button" id="kfg-wl-plan-single" data-csp-act="kfg-wl-select" data-csp-arg="single" style="min-height:68px;cursor:pointer;padding:0.65rem 0.7rem;border-radius:12px;background:' + (!isSix ? '#EFF6FF' : '#F8FAFC') + ';border:' + (!isSix ? '2px solid #1D4ED8' : '1.5px solid #CBD5E1') + ';text-align:left;display:flex;flex-direction:column;gap:0.15rem;">' +
            '<span style="font-size:0.68rem;font-weight:800;color:#1D4ED8;">SINGLE PDF GUIDE</span>' +
            '<strong style="font-size:0.86rem;color:#0F172A;">Single Growth Report</strong>' +
            '<span style="font-size:0.95rem;font-weight:900;color:#1D4ED8;"><s style="color:#94A3B8;font-size:0.78rem;">$8.99</s> $7.19 <small style="font-size:0.68rem;color:#059669;">(-20%)</small></span>' +
          '</button>' +
          '<button type="button" id="kfg-wl-plan-sixMonth" data-csp-act="kfg-wl-select" data-csp-arg="sixMonth" style="min-height:68px;cursor:pointer;padding:0.65rem 0.7rem;border-radius:12px;background:' + (isSix ? '#ECFDF5' : '#F8FAFC') + ';border:' + (isSix ? '2px solid #059669' : '1.5px solid #CBD5E1') + ';text-align:left;display:flex;flex-direction:column;gap:0.15rem;position:relative;">' +
            '<span style="position:absolute;top:-8px;right:8px;background:#059669;color:#FFFFFF;font-size:0.6rem;font-weight:900;padding:0.12rem 0.45rem;border-radius:9999px;">MOST POPULAR</span>' +
            '<span style="font-size:0.68rem;font-weight:800;color:#047857;">6-MONTH PASS</span>' +
            '<strong style="font-size:0.86rem;color:#0F172A;">6-Month Growth Pass</strong>' +
            '<span style="font-size:0.95rem;font-weight:900;color:#047857;"><s style="color:#94A3B8;font-size:0.78rem;">$19.99</s> $15.99 <small style="font-size:0.68rem;color:#059669;">(-20%)</small></span>' +
          '</button>' +
        '</div>' +

        '<div id="kfg-wl-selected-summary" style="background:#F8FAFC;border:1px solid #DBEAFE;border-radius:11px;padding:0.65rem 0.8rem;font-size:0.79rem;color:#1E293B;line-height:1.45;margin-bottom:0.85rem;"></div>' +

        '<form id="kfg-vip-waitlist-form" data-csp-submit-act="kfg-wl-submit" style="display:flex;flex-direction:column;gap:0.6rem;">' +
          '<label for="kfg-waitlist-email" style="font-size:0.78rem;font-weight:800;color:#334155;">Parent Email for Launch Alert &amp; 20% Early-Bird Voucher Code</label>' +
          '<input type="email" id="kfg-waitlist-email" required autocomplete="email" value="' + prefillEmail + '" placeholder="Enter parent email (e.g., mom@gmail.com)" style="width:100%;box-sizing:border-box;min-height:50px;padding:0.75rem 0.9rem;border-radius:12px;border:1.5px solid #93C5FD;font-size:16px;font-weight:600;color:#0F172A;background:#FFFFFF;">' +
          '<button type="submit" id="btn-kfg-waitlist-submit" style="width:100%;min-height:54px;padding:0.85rem 1rem;border-radius:13px;border:none;background:linear-gradient(90deg,#1D4ED8 0%,#059669 100%);color:#FFFFFF;font-size:0.98rem;font-weight:900;cursor:pointer;box-shadow:0 10px 24px rgba(29,78,216,0.25);">' +
            'Reserve My 20% Early-Bird Voucher (1-Sec) -&gt;' +
          '</button>' +
        '</form>' +

        '<div id="kfg-waitlist-status" role="status" aria-live="polite" style="display:none;margin-top:0.7rem;padding:0.7rem 0.85rem;border-radius:11px;font-size:0.83rem;line-height:1.5;"></div>' +

        '<details style="margin-top:0.8rem;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:11px;padding:0.55rem 0.8rem;">' +
          '<summary style="cursor:pointer;font-size:0.76rem;font-weight:800;color:#1D4ED8;">Already have a Founding VIP Access Code or License Key? Restore Access &#9662;</summary>' +
          '<div style="margin-top:0.55rem;display:flex;gap:0.45rem;flex-wrap:wrap;">' +
            '<input type="text" id="kfg-wl-license-input" placeholder="Enter VIP Access Code or License Key" style="flex:1 1 180px;min-height:42px;padding:0.45rem 0.7rem;border:1px solid #CBD5E1;border-radius:9px;font-size:14px;color:#0F172A;">' +
            '<button type="button" data-csp-act="kfg-wl-verify" style="min-height:42px;padding:0.45rem 0.85rem;border-radius:9px;border:1.5px solid #1D4ED8;background:#EFF6FF;color:#1D4ED8;font-size:0.8rem;font-weight:800;cursor:pointer;">Unlock</button>' +
          '</div>' +
          '<div id="kfg-wl-license-msg" style="display:none;margin-top:0.4rem;font-size:0.76rem;font-weight:700;"></div>' +
        '</details>' +

        '<div style="margin-top:0.8rem;padding-top:0.65rem;border-top:1px solid #E2E8F0;font-size:0.73rem;color:#64748B;line-height:1.5;">' +
          '<div style="font-weight:700;color:#334155;margin-bottom:0.25rem;">Checkout &amp; Billing: Polar.sh (Merchant of Record · Global Card / Apple Pay / Google Pay)</div>' +
          '<div>For educational and informational tracking based on public US CDC growth charts only; not a substitute for professional pediatric medical diagnosis or treatment.</div>' +
          '<div style="margin-top:0.35rem;font-weight:700;">' +
            '<a href="/terms.html" style="color:#1D4ED8;text-decoration:none;">Terms of Service</a> &middot; ' +
            '<a href="/privacy.html" style="color:#1D4ED8;text-decoration:none;">Privacy Policy</a> &middot; ' +
            '<a href="/refund.html" style="color:#1D4ED8;text-decoration:none;">14-Day Refund Policy</a> &middot; ' +
            '<a href="mailto:care@kisfitglobal.com" style="color:#1D4ED8;text-decoration:none;">care@kisfitglobal.com</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    selectKfgWaitlistPlan(activeWaitlistPlan);
  }

  function detectPaidClickElement(target) {
    if (!target || typeof target.closest !== 'function') return null;
    if (target.closest('#kfg-vip-waitlist-modal')) return null;
    var el = target.closest(
      'a[href*="buy.polar.sh"], a[href="#vip-waitlist"], a[href*="#vip-waitlist"], [data-polar-checkout], .polar-checkout-button, ' +
      '#btn-global-paywall-checkout, #btn-one-tap-single-report, #btn-one-tap-six-month-pass, #btn-one-tap-premium-suite, ' +
      '#btn-edge-single-report, #btn-edge-six-month-pass, #btn-polar-official-checkout, ' +
      '.kfg-ba-btn-single, .kfg-ba-btn-pass, .kfg-edge-btn-pass, [data-kfg-paid-plan]'
    );
    return el || null;
  }

  function inferPlanFromElement(el) {
    if (!el) return 'single';
    var attrPlan = String(el.getAttribute('data-kfg-paid-plan') || el.getAttribute('data-csp-arg') || '').toLowerCase();
    var href = el.getAttribute('href') || '';
    var id = el.id || '';
    var cls = el.className || '';
    var txt = el.textContent || '';
    if (
      attrPlan === 'premium' ||
      attrPlan === 'premium_4900' ||
      attrPlan === 'tier3' ||
      id.indexOf('premium') !== -1 ||
      txt.indexOf('$49') !== -1 ||
      txt.indexOf('12-Month') !== -1 ||
      href.indexOf('polar_cl_iCvFT7ApBXaG7fRlOqjqbrRwXx0caCgnuITrW3TKk0e') !== -1
    ) {
      return 'premium';
    }
    if (
      attrPlan === 'pass' ||
      attrPlan === 'pass_1999' ||
      attrPlan === 'sixMonth' ||
      id.indexOf('pass') !== -1 ||
      String(cls).indexOf('btn-pass') !== -1 ||
      txt.indexOf('19.99') !== -1 ||
      txt.indexOf('6-Month') !== -1 ||
      href.indexOf('pass') !== -1 ||
      href.indexOf('polar_cl_p8DAvlbz7wPj6SOPKhHjT5aaNyA2F3I528A3c15nBND') !== -1
    ) {
      return 'sixMonth';
    }
    return 'single';
  }

  if (typeof document !== 'undefined' && typeof document.addEventListener === 'function' && !global.__KFG_PAYMENT_GATE_BOUND__) {
    global.__KFG_PAYMENT_GATE_BOUND__ = true;
    document.addEventListener('click', function (e) {
      var paidEl = detectPaidClickElement(e.target);
      if (!paidEl) return;

      var planKey = inferPlanFromElement(paidEl);
      recordKfgPaidClickOnce(planKey);

      var state = resolveKfgLiveCheckoutState(planKey);
      if (!state.isLive) {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        openKfgVipWaitlistModal(planKey);
        return false;
      }

      if (state.mode === 'polar_sh' && state.url) {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        navigateToKfgPolarCheckout(state.url, planKey);
        return false;
      }
    }, true);
  }

  global.resolvePolarPlanUrl = resolvePolarPlanUrl;
  global.ensureKfgPolarLocaleUrl = ensureKfgPolarLocaleUrl;
  global.appendCustomerEmailToPolarUrl = appendCustomerEmailToPolarUrl;
  global.navigateToKfgPolarCheckout = navigateToKfgPolarCheckout;
  global.resolveKfgLiveCheckoutState = resolveKfgLiveCheckoutState;
  global.recordKfgPaidClickOnce = recordKfgPaidClickOnce;
  global.recordKfgSignupBeacons = recordKfgSignupBeacons;
  global.openKfgVipWaitlistModal = openKfgVipWaitlistModal;
  global.openKfgWaitlistModal = openKfgVipWaitlistModal;
  global.closeKfgVipWaitlistModal = closeKfgVipWaitlistModal;
  global.selectKfgWaitlistPlan = selectKfgWaitlistPlan;
  global.submitKfgVipWaitlistForm = submitKfgVipWaitlistForm;
  global.verifyExistingVipLicenseInModal = verifyExistingVipLicenseInModal;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      PAYMENT_CONFIG: global.PAYMENT_CONFIG,
      resolvePolarPlanUrl: resolvePolarPlanUrl,
      ensureKfgPolarLocaleUrl: ensureKfgPolarLocaleUrl,
      appendCustomerEmailToPolarUrl: appendCustomerEmailToPolarUrl,
      navigateToKfgPolarCheckout: navigateToKfgPolarCheckout,
      resolveKfgLiveCheckoutState: resolveKfgLiveCheckoutState,
      recordKfgPaidClickOnce: recordKfgPaidClickOnce,
      recordKfgSignupBeacons: recordKfgSignupBeacons,
      openKfgVipWaitlistModal: openKfgVipWaitlistModal,
      openKfgWaitlistModal: openKfgVipWaitlistModal
    };
  }
})(typeof window !== 'undefined' ? window : global);
