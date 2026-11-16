/**
 * KISFIT Bio Labs (Division 2 Global — kisfitglobal.com)
 * src/js/kfg-payment-waitlist.js
 *
 * Unified Payment Slot Configuration (`window.PAYMENT_CONFIG`),
 * Single-Fire Paid Click & Signup Abacus Beacons (`kfg_kisfitglobal`),
 * and VIP Founding Family Launch Alert & 20% Early-Bird Voucher Reservation Modal.
 *
 * 100% English (Zero-Hangul) · Store #296100 Live UUIDs Preserved.
 */
(function (global) {
  'use strict';

  var NS = 'kfg_kisfitglobal';
  var ABACUS_BASE = 'https://abacus.jasoncameron.dev/hit/' + NS + '/';

  var DEFAULT_PAYMENT_CONFIG = {
    STORE_ID: '296100',
    STORE_DOMAIN: 'truthofmarket.lemonsqueezy.com',
    STORE_LIVE_READY: false,
    FINANCE_STORE_SLOT: {
      storeId: '296100',
      monthlyProductId: '1491888',
      monthlyPriceUsd: '29.00',
      monthlyUuid: 'd5e7e761-8b1b-4ca8-b1fe-771acd1450f8',
      monthlyUrl: 'https://truthofmarket.lemonsqueezy.com/checkout/buy/d5e7e761-8b1b-4ca8-b1fe-771acd1450f8?embed=1&locale=en',
      lifetimeProductId: '1491891',
      lifetimePriceUsd: '199.00',
      lifetimeUuid: '667aa482-f17c-47d1-b7f3-a2427c36516b',
      lifetimeUrl: 'https://truthofmarket.lemonsqueezy.com/checkout/buy/667aa482-f17c-47d1-b7f3-a2427c36516b?embed=1&locale=en'
    },
    PEDIATRIC_STORE_SLOT: {
      storeId: '296100',
      singleProductId: '1468224',
      singlePriceUsd: '8.99',
      singleUuid: 'c1cd7f12-3479-49e8-ab71-59c98135d599',
      singleUrl: 'https://truthofmarket.lemonsqueezy.com/checkout/buy/c1cd7f12-3479-49e8-ab71-59c98135d599?embed=1&locale=en',
      sixMonthProductId: '1468243',
      sixMonthPriceUsd: '19.99',
      sixMonthUuid: 'c562946d-ef68-4c2f-a802-df9da0179895',
      sixMonthUrl: 'https://truthofmarket.lemonsqueezy.com/checkout/buy/c562946d-ef68-4c2f-a802-df9da0179895?embed=1&locale=en',
      BACKUP_LIVE_CHECKOUT_URL: {
        single: '',
        sixMonth: ''
      }
    },
    BACKUP_LIVE_CHECKOUT_URL: {
      single: '',
      sixMonth: ''
    }
  };

  function mergePaymentConfig(existing) {
    var base = JSON.parse(JSON.stringify(DEFAULT_PAYMENT_CONFIG));
    if (existing && typeof existing === 'object') {
      if (typeof existing.STORE_LIVE_READY === 'boolean') base.STORE_LIVE_READY = existing.STORE_LIVE_READY;
      if (existing.FINANCE_STORE_SLOT && typeof existing.FINANCE_STORE_SLOT === 'object') {
        Object.assign(base.FINANCE_STORE_SLOT, existing.FINANCE_STORE_SLOT);
      }
      if (existing.PEDIATRIC_STORE_SLOT && typeof existing.PEDIATRIC_STORE_SLOT === 'object') {
        var existingBackup = existing.PEDIATRIC_STORE_SLOT.BACKUP_LIVE_CHECKOUT_URL;
        Object.assign(base.PEDIATRIC_STORE_SLOT, existing.PEDIATRIC_STORE_SLOT);
        if (existingBackup && typeof existingBackup === 'object') {
          base.PEDIATRIC_STORE_SLOT.BACKUP_LIVE_CHECKOUT_URL = Object.assign(
            { single: '', sixMonth: '' },
            existingBackup
          );
        }
      }
      if (existing.BACKUP_LIVE_CHECKOUT_URL && typeof existing.BACKUP_LIVE_CHECKOUT_URL === 'object') {
        base.BACKUP_LIVE_CHECKOUT_URL = Object.assign(
          { single: '', sixMonth: '' },
          existing.BACKUP_LIVE_CHECKOUT_URL
        );
      }
    }
    return base;
  }

  global.PAYMENT_CONFIG = mergePaymentConfig(global.PAYMENT_CONFIG);

  function normalizePlanKey(rawPlan) {
    var s = String(rawPlan || '').toLowerCase();
    if (s === 'pass' || s === 'sixmonth' || s === 'six_month' || s.indexOf('19.99') !== -1 || s.indexOf('6-month') !== -1 || s.indexOf('c562946d') !== -1) {
      return 'sixMonth';
    }
    return 'single';
  }

  function resolveKfgLiveCheckoutState(rawPlan) {
    var cfg = global.PAYMENT_CONFIG || DEFAULT_PAYMENT_CONFIG;
    var slotKey = normalizePlanKey(rawPlan);
    var ped = cfg.PEDIATRIC_STORE_SLOT || DEFAULT_PAYMENT_CONFIG.PEDIATRIC_STORE_SLOT;
    var backupPed = (ped.BACKUP_LIVE_CHECKOUT_URL && ped.BACKUP_LIVE_CHECKOUT_URL[slotKey]) ? String(ped.BACKUP_LIVE_CHECKOUT_URL[slotKey]).trim() : '';
    var backupTop = (cfg.BACKUP_LIVE_CHECKOUT_URL && cfg.BACKUP_LIVE_CHECKOUT_URL[slotKey]) ? String(cfg.BACKUP_LIVE_CHECKOUT_URL[slotKey]).trim() : '';
    var backupUrl = backupPed || backupTop;

    if (backupUrl && /^https?:\/\//i.test(backupUrl)) {
      return {
        isLive: true,
        mode: 'backup',
        slotKey: slotKey,
        url: backupUrl
      };
    }

    var lsUrl = slotKey === 'sixMonth' ? ped.sixMonthUrl : ped.singleUrl;
    if (cfg.STORE_LIVE_READY === true) {
      return {
        isLive: true,
        mode: 'lemonsqueezy',
        slotKey: slotKey,
        url: lsUrl
      };
    }

    return {
      isLive: false,
      mode: 'waitlist',
      slotKey: slotKey,
      url: lsUrl
    };
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
    fireAbacusKey('paid_click');
    fireAbacusKey('paid_click_total');
    return true;
  }

  function recordKfgSignupBeacons(opts) {
    if (opts && opts.isVipWaitlist) {
      fireAbacusKey('vip_waitlist');
    }
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

  function getSavedParentEmail() {
    try {
      if (global.DreamCompanyCRM && typeof global.DreamCompanyCRM.getLocalMember === 'function') {
        var m = global.DreamCompanyCRM.getLocalMember('KFG');
        if (m && m.email) return String(m.email).trim();
      }
      if (global.localStorage) {
        return String(
          global.localStorage.getItem('kfg_parent_member_email') ||
          global.localStorage.getItem('kidsfit_pending_ls_checkout_email_v1') ||
          ''
        ).trim();
      }
    } catch (_) {}
    return '';
  }

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
        ? 'Selected: <strong>6-Month Growth Pass ($19.99 &rarr; $15.99 w/ 20% Founding Voucher)</strong> &middot; Includes Printable US CDC Percentile & Bone-Age PDF Guide + 30-Day Growth Velocity Tracker (6 Monthly Checklists &amp; Commentary).'
        : 'Selected: <strong>Single Growth Report ($8.99 &rarr; $7.19 w/ 20% Founding Voucher)</strong> &middot; Includes Printable US CDC Percentile & Bone-Age PDF Guide + 30-Day Growth Velocity Tracker (+1x 30-Day Check-in).';
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

    var selectedPlanLabel = activeWaitlistPlan === 'sixMonth' ? '6-Month Growth Pass ($19.99)' : 'Single Growth Report ($8.99)';
    if (btnEl) {
      btnEl.disabled = true;
      btnEl.textContent = 'Reserving Your 20% Founding Voucher...';
    }

    try {
      if (global.localStorage) {
        global.localStorage.setItem('kfg_parent_member_email', email);
        global.localStorage.setItem('kidsfit_pending_ls_checkout_email_v1', email);
        global.localStorage.setItem('kfg_vip_waitlist_reserved_v1', JSON.stringify({
          email: email,
          plan: activeWaitlistPlan,
          reservedAt: new Date().toISOString()
        }));
      }
    } catch (_) {}

    recordKfgSignupBeacons({ isVipWaitlist: true });

    var finish = function () {
      if (btnEl) {
        btnEl.disabled = false;
        btnEl.textContent = 'Reserved! 20% Voucher Locked In';
      }
      if (typeof global.syncKfgParentDashboardUI === 'function') {
        try { global.syncKfgParentDashboardUI(email, 'VIP Founding Family Waitlist'); } catch (_) {}
      }
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.style.background = '#ECFDF5';
        statusEl.style.border = '1.5px solid #10B981';
        statusEl.style.color = '#065F46';
        statusEl.innerHTML =
          '<strong>20% Early-Bird Voucher Reserved for ' + escHtml(email) + '!</strong><br>' +
          'Plan reserved: <strong>' + escHtml(selectedPlanLabel) + '</strong> (Code <code>KFG-FOUNDER-20</code>). ' +
          'We will notify you the moment Store #296100 express checkout opens—and your free US CDC Growth &amp; Sleep Checklist is active right now.';
      }
    };

    if (global.DreamCompanyCRM && typeof global.DreamCompanyCRM.registerMember === 'function') {
      global.DreamCompanyCRM.registerMember({
        div: 'KFG',
        email: email,
        segment: 'vip_waitlist',
        lang: 'en-US',
        notes: 'site=kisfitglobal.com | plan=' + selectedPlanLabel
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
        msgEl.textContent = 'Please enter your VIP Access Code or 36-character License Key.';
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
            '<span style="display:inline-block;font-size:0.72rem;font-weight:900;color:#1D4ED8;background:#EFF6FF;border:1px solid #BFDBFE;padding:0.2rem 0.6rem;border-radius:9999px;margin-bottom:0.35rem;">FOUNDING FAMILY PRIORITY ACCESS &middot; STORE #296100</span>' +
            '<h3 id="kfg-vip-waitlist-title" style="margin:0;font-size:1.08rem;font-weight:900;color:#0F172A;line-height:1.32;">VIP Founding Family Launch Alert &amp; 20% Early-Bird Voucher Reservation (1-Second Email Reserve)</h3>' +
          '</div>' +
          '<button type="button" onclick="window.closeKfgVipWaitlistModal()" aria-label="Close modal" style="background:#F1F5F9;border:1px solid #CBD5E1;border-radius:9999px;width:34px;height:34px;font-weight:900;color:#0F172A;cursor:pointer;flex-shrink:0;">&#10005;</button>' +
        '</div>' +

        '<p style="margin:0 0 0.85rem;font-size:0.86rem;color:#334155;line-height:1.55;">' +
          'Our global USD billing checkout for the <strong>Comprehensive Growth &amp; Habit Percentile PDF Guide</strong> is completing final Merchant-of-Record activation. Reserve in 1 second below to lock in a <strong>20% Founding Family Early-Bird Voucher</strong> and receive instant free US CDC growth &amp; sleep checklist access today.' +
        '</p>' +

        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.55rem;margin-bottom:0.75rem;">' +
          '<button type="button" id="kfg-wl-plan-single" onclick="window.selectKfgWaitlistPlan(\'single\')" style="min-height:68px;cursor:pointer;padding:0.65rem 0.7rem;border-radius:12px;background:' + (!isSix ? '#EFF6FF' : '#F8FAFC') + ';border:' + (!isSix ? '2px solid #1D4ED8' : '1.5px solid #CBD5E1') + ';text-align:left;display:flex;flex-direction:column;gap:0.15rem;">' +
            '<span style="font-size:0.68rem;font-weight:800;color:#1D4ED8;">SINGLE PDF GUIDE</span>' +
            '<strong style="font-size:0.86rem;color:#0F172A;">Single Growth Report</strong>' +
            '<span style="font-size:0.95rem;font-weight:900;color:#1D4ED8;"><s style="color:#94A3B8;font-size:0.78rem;">$8.99</s> $7.19 <small style="font-size:0.68rem;color:#059669;">(-20%)</small></span>' +
          '</button>' +
          '<button type="button" id="kfg-wl-plan-sixMonth" onclick="window.selectKfgWaitlistPlan(\'sixMonth\')" style="min-height:68px;cursor:pointer;padding:0.65rem 0.7rem;border-radius:12px;background:' + (isSix ? '#ECFDF5' : '#F8FAFC') + ';border:' + (isSix ? '2px solid #059669' : '1.5px solid #CBD5E1') + ';text-align:left;display:flex;flex-direction:column;gap:0.15rem;position:relative;">' +
            '<span style="position:absolute;top:-8px;right:8px;background:#059669;color:#FFFFFF;font-size:0.6rem;font-weight:900;padding:0.12rem 0.45rem;border-radius:9999px;">MOST POPULAR</span>' +
            '<span style="font-size:0.68rem;font-weight:800;color:#047857;">6-MONTH PASS</span>' +
            '<strong style="font-size:0.86rem;color:#0F172A;">6-Month Growth Pass</strong>' +
            '<span style="font-size:0.95rem;font-weight:900;color:#047857;"><s style="color:#94A3B8;font-size:0.78rem;">$19.99</s> $15.99 <small style="font-size:0.68rem;color:#059669;">(-20%)</small></span>' +
          '</button>' +
        '</div>' +

        '<div id="kfg-wl-selected-summary" style="background:#F8FAFC;border:1px solid #DBEAFE;border-radius:11px;padding:0.65rem 0.8rem;font-size:0.79rem;color:#1E293B;line-height:1.45;margin-bottom:0.85rem;"></div>' +

        '<form id="kfg-vip-waitlist-form" onsubmit="return window.submitKfgVipWaitlistForm(event);" style="display:flex;flex-direction:column;gap:0.6rem;">' +
          '<label for="kfg-waitlist-email" style="font-size:0.78rem;font-weight:800;color:#334155;">Parent Email for Launch Alert &amp; 20% Voucher Code</label>' +
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
            '<button type="button" onclick="window.verifyExistingVipLicenseInModal()" style="min-height:42px;padding:0.45rem 0.85rem;border-radius:9px;border:1.5px solid #1D4ED8;background:#EFF6FF;color:#1D4ED8;font-size:0.8rem;font-weight:800;cursor:pointer;">Unlock</button>' +
          '</div>' +
          '<div id="kfg-wl-license-msg" style="display:none;margin-top:0.4rem;font-size:0.76rem;font-weight:700;"></div>' +
        '</details>' +

        '<div style="margin-top:0.8rem;padding-top:0.65rem;border-top:1px solid #E2E8F0;font-size:0.73rem;color:#64748B;line-height:1.5;">' +
          '<div>For educational and informational tracking based on public US CDC growth charts only; not a substitute for professional pediatric medical diagnosis or treatment.</div>' +
          '<div style="margin-top:0.35rem;font-weight:700;">' +
            '<a href="/terms.html" style="color:#1D4ED8;text-decoration:none;">Terms of Service</a> &middot; ' +
            '<a href="/privacy.html" style="color:#1D4ED8;text-decoration:none;">Privacy Policy</a> &middot; ' +
            '<a href="/refund.html" style="color:#1D4ED8;text-decoration:none;">14-Day Refund Policy</a> &middot; ' +
            '<a href="mailto:beable9489@gmail.com" style="color:#1D4ED8;text-decoration:none;">beable9489@gmail.com</a>' +
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
      'a[href*="lemonsqueezy.com/checkout/buy/"], [data-ls-product-uuid], .lemonsqueezy-button, ' +
      '#btn-global-paywall-checkout, #btn-one-tap-single-report, #btn-one-tap-six-month-pass, ' +
      '#btn-edge-single-report, #btn-edge-six-month-pass, .kfg-ba-btn-single, .kfg-ba-btn-pass, ' +
      '.kfg-edge-btn-pass, [data-kfg-paid-plan]'
    );
    return el || null;
  }

  function inferPlanFromElement(el) {
    if (!el) return 'single';
    var attrPlan = el.getAttribute('data-kfg-paid-plan') || '';
    var uuid = el.getAttribute('data-ls-product-uuid') || '';
    var href = el.getAttribute('href') || '';
    var id = el.id || '';
    var cls = el.className || '';
    var txt = el.textContent || '';
    if (
      attrPlan === 'pass' ||
      attrPlan === 'sixMonth' ||
      uuid.indexOf('c562946d') !== -1 ||
      href.indexOf('c562946d') !== -1 ||
      id.indexOf('pass') !== -1 ||
      String(cls).indexOf('btn-pass') !== -1 ||
      txt.indexOf('19.99') !== -1 ||
      txt.indexOf('6-Month') !== -1
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

      if (state.mode === 'backup' && state.url) {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        if (typeof global.open === 'function') {
          global.open(state.url, '_blank', 'noopener');
        } else if (global.location) {
          global.location.href = state.url;
        }
        return false;
      }
    }, true);
  }

  global.resolveKfgLiveCheckoutState = resolveKfgLiveCheckoutState;
  global.recordKfgPaidClickOnce = recordKfgPaidClickOnce;
  global.recordKfgSignupBeacons = recordKfgSignupBeacons;
  global.openKfgVipWaitlistModal = openKfgVipWaitlistModal;
  global.closeKfgVipWaitlistModal = closeKfgVipWaitlistModal;
  global.selectKfgWaitlistPlan = selectKfgWaitlistPlan;
  global.submitKfgVipWaitlistForm = submitKfgVipWaitlistForm;
  global.verifyExistingVipLicenseInModal = verifyExistingVipLicenseInModal;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      PAYMENT_CONFIG: global.PAYMENT_CONFIG,
      resolveKfgLiveCheckoutState: resolveKfgLiveCheckoutState,
      recordKfgPaidClickOnce: recordKfgPaidClickOnce,
      recordKfgSignupBeacons: recordKfgSignupBeacons,
      openKfgVipWaitlistModal: openKfgVipWaitlistModal
    };
  }
})(typeof window !== 'undefined' ? window : global);
