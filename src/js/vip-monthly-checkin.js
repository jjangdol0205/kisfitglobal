/**
 * KISFIT Bio Labs (Division 2 Global — kisfitglobal.com)
 * src/js/vip-monthly-checkin.js
 *
 * 100% English-Only (Zero-Hangul) · Zero Password Fields:
 *  1) Top Reels/Shorts Visitor Card: Age-Specific Growth Cheat Sheet (`Ages 3-7` / `Ages 8-11` / `Ages 12-16` + 1-Sec Email)
 *  2) Unified Passwordless 3-Sec Parent Growth Club (`#kfg-parent-growth-club` -> `DreamCompanyCRM.registerMember` + Abacus `signup` / `signup_total`)
 *  3) Paid VIP Monthly Check-in Portal (`#kfg-vip-monthly-checkin`):
 *     - US Standard `ft + in` default height inputs with 1-click `cm` toggle (`1 ft = 12 in`, `1 in = 2.54 cm`)
 *     - Strict Paywall Gate: Unpaid visitors see ONLY numeric annualized height velocity teaser (`X.X in/yr · Y.Y cm/yr vs. US CDC median`) + locked 4-pillar preview card
 *     - Verified VIP / License holders get 100% instant automated web calculation commentary + Abacus `vip_checkin` beacon
 */
(function (global) {
  'use strict';

  var STAGE_MAP = {
    ages_3_7_foundation: 'Ages 3-7 (Early Foundation)',
    ages_8_11_golden_window: 'Ages 8-11 (Pre-Puberty Golden Window)',
    ages_12_16_peak_velocity: 'Ages 12-16 (Puberty & Growth Spurt)'
  };

  var REELS_CHEAT_BANDS = {
    ages_3_7_foundation: {
      badge: 'Ages 3-7 Cheat Sheet',
      cdcGain: '2.2 - 2.8 in/yr (5.6 - 7.1 cm/yr)',
      lightsOut: '8:00 - 8:45 PM (Peak Stage-3 N3 GH Window)',
      nutrition: '20-30g Protein + 800-1,000mg Ca + 600 IU Vit D3',
      habitTip: '15 min playful hopping + nasal-breathing bedtime check'
    },
    ages_8_11_golden_window: {
      badge: 'Ages 8-11 Cheat Sheet',
      cdcGain: '2.0 - 2.9 in/yr (5.1 - 7.4 cm/yr)',
      lightsOut: '8:45 - 9:30 PM (Pre-Spurt Pituitary GH Pulse)',
      nutrition: '34-46g Protein + 1,000-1,300mg Ca + 800 IU D3 + Zinc',
      habitTip: '200 daily jump-rope hops + zero sugar 2 hrs before sleep'
    },
    ages_12_16_peak_velocity: {
      badge: 'Ages 12-16 Cheat Sheet',
      cdcGain: '1.4 - 3.6 in/yr (3.6 - 9.1 cm/yr PHV Window)',
      lightsOut: 'Before 10:00 PM (Protects Open Epiphyseal Runway)',
      nutrition: '52-72g Protein + 1,300mg Ca + 1,000 IU D3/K2 + Mg',
      habitTip: '3x30s doorway bar decompression (+0.6 in posture stature)'
    }
  };

  var selectedFreeSegment = 'ages_8_11_golden_window';
  var selectedReelsBand = 'ages_8_11_golden_window';
  var vipUnitMode = 'imperial'; // US Standard ft + in default

  function escHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function ftInToCmExact(ft, inch) {
    var totalIn = (Number(ft) || 0) * 12 + (Number(inch) || 0);
    return Math.round(totalIn * 2.54 * 100) / 100;
  }

  function cmToFtInParts(cm) {
    var val = Number(cm);
    if (!isFinite(val) || val <= 0) return { ft: 4, inch: 4.5 };
    var totalIn = val / 2.54;
    var ft = Math.floor(totalIn / 12);
    var inch = Math.round((totalIn - ft * 12) * 10) / 10;
    if (inch >= 12) {
      ft += 1;
      inch = 0;
    }
    return { ft: ft, inch: inch };
  }

  function cmToImperialLabel(cm) {
    var val = Number(cm);
    if (!isFinite(val) || val <= 0) return '';
    var p = cmToFtInParts(val);
    return p.ft + ' ft ' + p.inch.toFixed(1) + ' in';
  }

  function fireSignupAbacus() {
    if (typeof global.recordKfgSignupBeacons === 'function') {
      global.recordKfgSignupBeacons({});
      return;
    }
    try {
      if (typeof global.fetch === 'function') {
        global.fetch('https://abacus.jasoncameron.dev/hit/kfg_kisfitglobal/signup', { mode: 'cors', keepalive: true }).catch(function () {});
        global.fetch('https://abacus.jasoncameron.dev/hit/kfg_kisfitglobal/signup_total', { mode: 'cors', keepalive: true }).catch(function () {});
      }
    } catch (_) {}
  }

  function fireVipCheckinAbacus() {
    try {
      if (typeof global.fetch === 'function') {
        global.fetch('https://abacus.jasoncameron.dev/hit/kfg_kisfitglobal/vip_checkin', { mode: 'cors', keepalive: true }).catch(function () {});
      }
    } catch (_) {}
  }

  // ---------------------------------------------------------------------------
  // 1. Top Reels / Shorts Visitor Card: Age-Specific Growth Cheat Sheet
  // ---------------------------------------------------------------------------
  function selectKfgReelsCheatSheetBand(segKey, skipClubSync) {
    if (!REELS_CHEAT_BANDS[segKey]) return;
    selectedReelsBand = segKey;
    var info = REELS_CHEAT_BANDS[segKey];

    if (typeof document !== 'undefined') {
      var btns = document.querySelectorAll('[data-kfg-reels-band]');
      for (var i = 0; i < btns.length; i++) {
        var b = btns[i];
        var isAct = b.getAttribute('data-kfg-reels-band') === segKey;
        b.classList.toggle('active', isAct);
        b.setAttribute('aria-pressed', isAct ? 'true' : 'false');
        b.style.border = isAct ? '2px solid #1D4ED8' : '1.5px solid #CBD5E1';
        b.style.background = isAct ? '#EFF6FF' : '#FFFFFF';
        b.style.color = isAct ? '#1D4ED8' : '#334155';
      }

      var gainEl = document.getElementById('kfg-reels-cs-gain');
      var sleepEl = document.getElementById('kfg-reels-cs-sleep');
      var nutEl = document.getElementById('kfg-reels-cs-nutrition');
      var tipEl = document.getElementById('kfg-reels-cs-tip');
      if (gainEl) gainEl.textContent = info.cdcGain;
      if (sleepEl) sleepEl.textContent = info.lightsOut;
      if (nutEl) nutEl.textContent = info.nutrition;
      if (tipEl) tipEl.textContent = info.habitTip;
    }

    if (!skipClubSync && STAGE_MAP[segKey]) {
      selectKfgFreeClubSegment(segKey, true);
    }
  }

  function submitKfgReelsCheatSheetForm(ev) {
    if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();
    if (typeof document === 'undefined') return false;

    var emailEl = document.getElementById('kfg-reels-cheatsheet-email');
    var statusEl = document.getElementById('kfg-reels-cheatsheet-feedback');
    var btnEl = document.getElementById('btn-kfg-reels-cheatsheet-submit');
    var email = emailEl ? String(emailEl.value || '').trim().toLowerCase() : '';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.style.color = '#DC2626';
        statusEl.textContent = 'Please enter a valid parent email address (e.g., mom@gmail.com).';
      }
      if (emailEl) emailEl.focus();
      return false;
    }

    var bandInfo = REELS_CHEAT_BANDS[selectedReelsBand] || REELS_CHEAT_BANDS.ages_8_11_golden_window;
    if (btnEl) {
      btnEl.disabled = true;
      btnEl.textContent = 'Saving & Sending Cheat Sheet...';
    }

    try {
      localStorage.setItem('kfg_parent_member_email', email);
      localStorage.setItem('kfg_parent_member_segment', selectedReelsBand);
      localStorage.setItem('kfg_parent_member_stage', STAGE_MAP[selectedReelsBand] || bandInfo.badge);
    } catch (_) {}

    fireSignupAbacus();

    var done = function () {
      if (btnEl) {
        btnEl.disabled = false;
        btnEl.textContent = 'Save & Email Cheat Sheet (1-Sec) ->';
      }
      if (typeof global.syncKfgParentDashboardUI === 'function') {
        try { global.syncKfgParentDashboardUI(email, STAGE_MAP[selectedReelsBand]); } catch (_) {}
      }
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.style.color = '#065F46';
        statusEl.innerHTML =
          '<strong>Saved &amp; Queued for ' + escHtml(email) + '!</strong> Your <strong>' + escHtml(bandInfo.badge) + '</strong> (US CDC velocity, bedtime GH clock &amp; Ca/D3 targets) is active.';
      }
    };

    if (global.DreamCompanyCRM && typeof global.DreamCompanyCRM.registerMember === 'function') {
      global.DreamCompanyCRM.registerMember({
        div: 'KFG',
        email: email,
        segment: selectedReelsBand,
        lang: 'en-US',
        notes: 'site=kisfitglobal.com | source=top_reels_cheatsheet | band=' + bandInfo.badge
      }).then(done).catch(done);
    } else {
      done();
    }
    return false;
  }

  // ---------------------------------------------------------------------------
  // 2. Unified Passwordless 3-Sec Parent Growth Club Signup
  // ---------------------------------------------------------------------------
  function selectKfgFreeClubSegment(segKey, skipReelsSync) {
    if (!STAGE_MAP[segKey]) return;
    selectedFreeSegment = segKey;
    global.__kfgSelectedClubSegment = segKey;
    global.__kfgSelectedStageLabel = STAGE_MAP[segKey];
    try {
      localStorage.setItem('kfg_parent_member_segment', segKey);
      localStorage.setItem('kfg_parent_member_stage', STAGE_MAP[segKey]);
    } catch (_) {}

    if (typeof document !== 'undefined') {
      var pills = document.querySelectorAll('[data-kfg-club-seg]');
      for (var i = 0; i < pills.length; i++) {
        var p = pills[i];
        var isAct = p.getAttribute('data-kfg-club-seg') === segKey;
        p.classList.toggle('active', isAct);
        p.setAttribute('aria-pressed', isAct ? 'true' : 'false');
      }
    }

    if (!skipReelsSync && REELS_CHEAT_BANDS[segKey]) {
      selectKfgReelsCheatSheetBand(segKey, true);
    }
  }

  function submitKfgPasswordlessClubSignup(ev) {
    if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();
    var emailEl = document.getElementById('kfg-club-passwordless-email');
    var nickEl = document.getElementById('kfg-club-passwordless-nick');
    var hpEl = document.getElementById('kfg-club-passwordless-hp');
    var statusEl = document.getElementById('kfg-club-passwordless-feedback');
    var checklistBox = document.getElementById('kfg-club-checklist-unlocked');
    var btnEl = document.getElementById('btn-kfg-club-passwordless-submit');

    var email = emailEl ? String(emailEl.value || '').trim().toLowerCase() : '';
    var nickname = nickEl ? String(nickEl.value || '').trim() : '';
    var websiteHp = hpEl ? String(hpEl.value || '').trim() : '';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.className = 'kfg-crm-feedback error';
        statusEl.textContent = 'Please enter a valid parent email address (e.g., parent@gmail.com).';
      }
      if (emailEl) emailEl.focus();
      return false;
    }

    var stageLabel = STAGE_MAP[selectedFreeSegment] || STAGE_MAP.ages_8_11_golden_window;
    if (btnEl) {
      btnEl.disabled = true;
      btnEl.textContent = 'Activating 3-Sec Club Access...';
    }

    fireSignupAbacus();

    var finishUi = function () {
      if (btnEl) {
        btnEl.disabled = false;
        btnEl.textContent = 'Join Free Growth Club & Unlock Checklist (3-Sec) ->';
      }
      try {
        localStorage.setItem('kfg_parent_member_email', email);
        localStorage.setItem('kfg_parent_member_stage', stageLabel);
      } catch (_) {}
      if (typeof global.syncKfgParentDashboardUI === 'function') {
        try { global.syncKfgParentDashboardUI(email, stageLabel); } catch (_) {}
      }
      if (checklistBox) {
        checklistBox.style.display = 'grid';
      }
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.className = 'kfg-crm-feedback success';
        statusEl.innerHTML =
          '<strong>Passwordless Growth Club Active (' + escHtml(email) + ')</strong> &middot; Stage: <strong>' + escHtml(stageLabel) + '</strong>.<br>' +
          'Your 12-Month Sleep + Nutrition Checklist &amp; quarterly US CDC velocity reminders are unlocked below. ' +
          '<a href="#kfg-bone-age-interpreter" style="color:#047857;font-weight:900;text-decoration:underline;">Open Free Bone-Age X-Ray Interpreter &rarr;</a>';
      }
    };

    if (global.DreamCompanyCRM && typeof global.DreamCompanyCRM.registerMember === 'function') {
      global.DreamCompanyCRM.registerMember({
        div: 'KFG',
        email: email,
        nickname: nickname,
        segment: selectedFreeSegment,
        lang: 'en-US',
        website_hp: websiteHp,
        notes: 'site=kisfitglobal.com | source=unified_parent_growth_club'
      }).then(finishUi).catch(finishUi);
    } else {
      try {
        localStorage.setItem('dc_member_KFG', JSON.stringify({
          div: 'KFG',
          email: email,
          nickname: nickname,
          segment: selectedFreeSegment,
          joined_at: new Date().toISOString()
        }));
      } catch (_) {}
      finishUi();
    }
    return false;
  }

  // ---------------------------------------------------------------------------
  // 3. Monthly Check-In: US `ft + in` Default + 1-Click `cm` Toggle + Paywall Gate
  // ---------------------------------------------------------------------------
  function syncVipImperialToMetric() {
    if (typeof document === 'undefined') return;
    var prevFt = document.getElementById('kfg-vip-prev-ft');
    var prevIn = document.getElementById('kfg-vip-prev-in');
    var currFt = document.getElementById('kfg-vip-curr-ft');
    var currIn = document.getElementById('kfg-vip-curr-in');
    var prevCmEl = document.getElementById('kfg-vip-prev-cm');
    var currCmEl = document.getElementById('kfg-vip-curr-cm');

    if (prevFt && prevIn && prevCmEl) {
      var pCm = ftInToCmExact(prevFt.value, prevIn.value);
      if (pCm > 0) prevCmEl.value = pCm.toFixed(1);
    }
    if (currFt && currIn && currCmEl) {
      var cCm = ftInToCmExact(currFt.value, currIn.value);
      if (cCm > 0) currCmEl.value = cCm.toFixed(1);
    }
    syncVipHeightHelperLabels();
  }

  function syncVipMetricToImperial() {
    if (typeof document === 'undefined') return;
    var prevCmEl = document.getElementById('kfg-vip-prev-cm');
    var currCmEl = document.getElementById('kfg-vip-curr-cm');
    var prevFt = document.getElementById('kfg-vip-prev-ft');
    var prevIn = document.getElementById('kfg-vip-prev-in');
    var currFt = document.getElementById('kfg-vip-curr-ft');
    var currIn = document.getElementById('kfg-vip-curr-in');

    if (prevCmEl && prevFt && prevIn) {
      var pp = cmToFtInParts(prevCmEl.value);
      prevFt.value = String(pp.ft);
      prevIn.value = pp.inch.toFixed(1);
    }
    if (currCmEl && currFt && currIn) {
      var cp = cmToFtInParts(currCmEl.value);
      currFt.value = String(cp.ft);
      currIn.value = cp.inch.toFixed(1);
    }
    syncVipHeightHelperLabels();
  }

  function syncVipHeightHelperLabels() {
    if (typeof document === 'undefined') return;
    var prevCmEl = document.getElementById('kfg-vip-prev-cm');
    var currCmEl = document.getElementById('kfg-vip-curr-cm');
    var prevImpHint = document.getElementById('kfg-vip-prev-imperial-hint');
    var currImpHint = document.getElementById('kfg-vip-curr-imperial-hint');
    var prevMetHint = document.getElementById('kfg-vip-prev-metric-hint');
    var currMetHint = document.getElementById('kfg-vip-curr-metric-hint');

    var pVal = prevCmEl ? Number(prevCmEl.value) : 0;
    var cVal = currCmEl ? Number(currCmEl.value) : 0;

    if (prevImpHint) {
      var pLbl = cmToImperialLabel(pVal);
      prevImpHint.textContent = pLbl ? ('= ' + pLbl + ' (1 in = 2.54 cm)') : 'Enter cm (1 in = 2.54 cm)';
    }
    if (currImpHint) {
      var cLbl = cmToImperialLabel(cVal);
      currImpHint.textContent = cLbl ? ('= ' + cLbl + ' (1 in = 2.54 cm)') : 'Enter cm (1 in = 2.54 cm)';
    }
    if (prevMetHint) {
      prevMetHint.textContent = pVal > 0 ? ('= ' + pVal.toFixed(1) + ' cm (1 ft = 12 in, 1 in = 2.54 cm)') : 'US Standard ft + in';
    }
    if (currMetHint) {
      currMetHint.textContent = cVal > 0 ? ('= ' + cVal.toFixed(1) + ' cm (1 ft = 12 in, 1 in = 2.54 cm)') : 'US Standard ft + in';
    }
  }

  function setVipCheckinUnit(mode) {
    vipUnitMode = mode === 'metric' ? 'metric' : 'imperial';
    if (typeof document === 'undefined') return;

    var impWrap = document.getElementById('kfg-vip-imperial-inputs');
    var metWrap = document.getElementById('kfg-vip-metric-inputs');
    var btnImp = document.getElementById('btn-kfg-vip-unit-imperial');
    var btnMet = document.getElementById('btn-kfg-vip-unit-metric');

    if (vipUnitMode === 'imperial') {
      syncVipMetricToImperial();
      if (impWrap) impWrap.style.display = 'grid';
      if (metWrap) metWrap.style.display = 'none';
    } else {
      syncVipImperialToMetric();
      if (impWrap) impWrap.style.display = 'none';
      if (metWrap) metWrap.style.display = 'grid';
    }

    if (btnImp) {
      var isImp = vipUnitMode === 'imperial';
      btnImp.classList.toggle('active', isImp);
      btnImp.setAttribute('aria-pressed', isImp ? 'true' : 'false');
      btnImp.style.background = isImp ? '#2563EB' : 'rgba(255,255,255,0.08)';
      btnImp.style.color = '#FFFFFF';
      btnImp.style.borderColor = isImp ? '#60A5FA' : 'rgba(148,163,184,0.4)';
    }
    if (btnMet) {
      var isMet = vipUnitMode === 'metric';
      btnMet.classList.toggle('active', isMet);
      btnMet.setAttribute('aria-pressed', isMet ? 'true' : 'false');
      btnMet.style.background = isMet ? '#2563EB' : 'rgba(255,255,255,0.08)';
      btnMet.style.color = '#FFFFFF';
      btnMet.style.borderColor = isMet ? '#60A5FA' : 'rgba(148,163,184,0.4)';
    }
  }

  function toggleVipCheckinUnit() {
    setVipCheckinUnit(vipUnitMode === 'imperial' ? 'metric' : 'imperial');
  }

  function selectVipHabitScore(axis, scoreVal) {
    var score = Math.max(1, Math.min(5, Number(scoreVal) || 3));
    var hiddenEl = document.getElementById('kfg-vip-' + axis + '-score');
    if (hiddenEl) hiddenEl.value = String(score);
    var btns = document.querySelectorAll('[data-kfg-habit-axis="' + axis + '"]');
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      var bScore = Number(b.getAttribute('data-kfg-habit-score'));
      var active = bScore === score;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', active ? 'true' : 'false');
    }
  }

  function isVipCheckinPaidVerified() {
    try {
      var params = new URLSearchParams((global.location && global.location.search) || '');
      var vipToken = String(params.get('vip_token') || (global.localStorage && global.localStorage.getItem('kfg_vip_token')) || '').trim();
      var orderRef = String((global.localStorage && global.localStorage.getItem('kidsfit_global_order_id_v1')) || '').trim();
      var unlocked = Boolean(global.localStorage && global.localStorage.getItem('kidsfit_global_report_unlocked_v1') === 'true');
      var paidVipObj = Boolean(global.localStorage && global.localStorage.getItem('dc_kfg_paid_vip'));
      return Boolean(unlocked || paidVipObj || (vipToken && vipToken.length >= 6) || (orderRef && orderRef.length >= 4));
    } catch (_) {
      return false;
    }
  }

  function hashVipAccessCode(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(16).padStart(8, '0');
  }

  var VIP_CODE_HASHES = ['326d5752', 'c61a52f4', '437e3ac3', '3f2e65ee'];

  function unlockVipCheckinWithCode() {
    if (typeof document === 'undefined') return;
    var inp = document.getElementById('kfg-vip-inline-license-code');
    var errEl = document.getElementById('kfg-vip-inline-license-msg');
    var code = inp ? String(inp.value || '').trim() : '';
    if (!code) {
      if (errEl) {
        errEl.style.display = 'block';
        errEl.textContent = 'Please enter your VIP License Key or Founding Access Code.';
      }
      return;
    }
    var upper = code.toUpperCase();
    var isHashMatch = VIP_CODE_HASHES.indexOf(hashVipAccessCode(upper)) !== -1;
    var isUuidKey = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(code);

    if (isHashMatch || isUuidKey) {
      try {
        localStorage.setItem('kidsfit_global_report_unlocked_v1', 'true');
        localStorage.setItem('kidsfit_global_order_id_v1', code);
      } catch (_) {}
      var badgeEl = document.getElementById('kfg-vip-status-pill');
      if (badgeEl) {
        badgeEl.textContent = 'VERIFIED VIP PASS ACTIVE - INSTANT VELOCITY COMMENTARY UNLOCKED';
        badgeEl.style.background = '#059669';
        badgeEl.style.color = '#FFFFFF';
      }
      submitKfgVipMonthlyCheckinForm(null);
      return;
    }
    if (errEl) {
      errEl.style.display = 'block';
      errEl.textContent = 'Unrecognized code. Reserve your VIP Pass or check your receipt License Key.';
    }
  }

  function renderLockedVelocityTeaserCard(result, payload) {
    var outEl = document.getElementById('kfg-vip-commentary-output');
    if (!outEl || !result) return;

    var annCm = Number(result.annualized_cm_yr || 0);
    var annIn = Math.round((annCm / 2.54) * 10) / 10;
    var targetCm = Number(result.cdc_target_cm_yr || 5.8);
    var targetIn = Math.round((targetCm / 2.54) * 10) / 10;
    var childLabel = escHtml(payload.child_name || 'Your Child');
    var ageStr = Number(payload.child_age_years || 9).toFixed(1).replace(/\.0$/, '');

    outEl.style.display = 'block';
    outEl.innerHTML =
      '<div class="kfg-vip-report-card kfg-vip-teaser-locked" style="border:2px solid #3B82F6;background:#FFFFFF;color:#0F172A;border-radius:16px;padding:1.2rem;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.45rem;margin-bottom:0.65rem;">' +
          '<span style="background:#EFF6FF;color:#1D4ED8;border:1px solid #93C5FD;font-size:0.74rem;font-weight:900;padding:0.2rem 0.65rem;border-radius:9999px;">FREE NUMERIC VELOCITY SNAPSHOT</span>' +
          '<span style="font-size:0.75rem;font-weight:800;color:#B45309;background:#FEF3C7;padding:0.18rem 0.6rem;border-radius:9999px;">4-Pillar Automated Habit Tracker (VIP Software Pass)</span>' +
        '</div>' +
        '<h3 style="margin:0 0 0.5rem;font-size:1.06rem;font-weight:900;color:#0F172A;">' +
          'Annualized Height Velocity for ' + childLabel + ': ' +
          '<span style="color:#1D4ED8;">' + annIn.toFixed(1) + ' in/yr &middot; ' + annCm.toFixed(1) + ' cm/yr vs. US CDC median (' + targetIn.toFixed(1) + ' in/yr &middot; ' + targetCm.toFixed(1) + ' cm/yr)</span>' +
        '</h3>' +
        '<p style="margin:0 0 0.85rem;font-size:0.84rem;color:#475569;line-height:1.5;">' +
          'Age ' + ageStr + ' US CDC 50th-percentile reference pace calculated from your 30-day height inputs. Detailed 4-pillar habit bottleneck analysis (Pre-10 PM Sleep GH, Ca/D3/Zinc Mineralization, Vertical Jump Loading &amp; Spinal Posture) is reserved for verified <strong>$8.99 Single Report / $19.99 6-Month Growth Pass</strong> holders.' +
        '</p>' +

        '<div style="position:relative;border:1.5px dashed #93C5FD;border-radius:14px;padding:1rem;background:linear-gradient(180deg,#F8FAFC 0%,#EFF6FF 100%);margin-bottom:0.85rem;">' +
          '<div style="filter:blur(5px);user-select:none;pointer-events:none;opacity:0.55;font-size:0.82rem;color:#334155;line-height:1.55;" aria-hidden="true">' +
            '<div><strong>Priority #1 Growth Bottleneck:</strong> Protected VIP Habit Axis Score &amp; 30-Day Adjustment Protocol</div>' +
            '<div><strong>Strongest Monthly Pillar:</strong> Verified Anchor Habit &amp; Evening Pituitary Timing</div>' +
            '<div><strong>Next 30-Day Target Gain:</strong> Calibrated Stature Runway &amp; Mineral Density Schedule</div>' +
          '</div>' +
          '<div style="margin-top:0.65rem;text-align:center;">' +
            '<button type="button" id="btn-unlock-vip-velocity-commentary" data-kfg-paid-plan="sixMonth" onclick="if(window.triggerKfgVelocityEdgeCheckout){window.triggerKfgVelocityEdgeCheckout(\'pass\');}else if(window.openKfgVipWaitlistModal){window.openKfgVipWaitlistModal(\'sixMonth\');}" style="width:100%;min-height:52px;padding:0.8rem 1.1rem;border-radius:12px;border:none;background:linear-gradient(90deg,#1D4ED8 0%,#059669 100%);color:#FFFFFF;font-size:0.95rem;font-weight:900;cursor:pointer;box-shadow:0 8px 20px rgba(29,78,216,0.24);">' +
              'Unlock Full Pediatric Velocity &amp; Habit Commentary ($8.99 / $19.99) &rarr;' +
            '</button>' +
          '</div>' +
        '</div>' +

        '<div style="display:flex;align-items:center;gap:0.45rem;flex-wrap:wrap;font-size:0.76rem;color:#475569;">' +
          '<span style="font-weight:800;color:#1E3A8A;">Already a VIP Pass / License Holder?</span>' +
          '<input type="text" id="kfg-vip-inline-license-code" placeholder="Enter License Key or VIP Code" style="flex:1 1 170px;min-height:38px;padding:0.35rem 0.65rem;border:1px solid #CBD5E1;border-radius:8px;font-size:14px;color:#0F172A;">' +
          '<button type="button" onclick="window.unlockVipCheckinWithCode()" style="min-height:38px;padding:0.35rem 0.8rem;border-radius:8px;border:1.5px solid #1D4ED8;background:#EFF6FF;color:#1D4ED8;font-weight:800;cursor:pointer;">Verify &amp; Unlock</button>' +
        '</div>' +
        '<div id="kfg-vip-inline-license-msg" style="display:none;margin-top:0.35rem;font-size:0.75rem;font-weight:700;color:#DC2626;"></div>' +
      '</div>';
  }

  function renderVerifiedVipCommentaryCard(result, payload) {
    var outEl = document.getElementById('kfg-vip-commentary-output');
    if (!outEl || !result) return;

    var deltaCm = Number(result.delta_cm || 0);
    var deltaIn = Math.round((deltaCm / 2.54) * 100) / 100;
    var annCm = Number(result.annualized_cm_yr || 0);
    var annIn = Math.round((annCm / 2.54) * 10) / 10;
    var targetCm = Number(result.cdc_target_cm_yr || 5.8);
    var targetIn = Math.round((targetCm / 2.54) * 10) / 10;

    var paceBadgeColor = annCm >= targetCm * 0.92 ? '#059669' : (annCm > 0 ? '#D97706' : '#2563EB');
    var paceBadgeText = annCm >= targetCm * 0.92
      ? 'ON-TRACK / ABOVE US CDC MEDIAN PACE'
      : (annCm > 0 ? 'MODERATE PACE - PRIORITIZE SLEEP & MINERAL DENSITY' : 'STEADY CYCLE - SALTATORY GROWTH PHASE');

    var strongest = result.strongest_habit || { key: 'Spinal Posture & Nasal Breathing', score: 4 };
    var bottleneck = result.priority_bottleneck || {
      key: 'Deep Sleep Window (Pre-10 PM GH Pulse)',
      score: 3,
      tip: 'Shift lights-out 30 minutes earlier and turn off screens 45 minutes before bed to protect peak Growth Hormone release.'
    };

    var deltaSign = deltaCm > 0 ? '+' : '';
    var childLabel = escHtml(payload.child_name || 'Your Child');
    var emailLabel = escHtml(payload.email || '');
    var prevImp = cmToImperialLabel(result.prev_height_cm || payload.prev_height_cm);
    var currImp = cmToImperialLabel(result.current_height_cm || payload.current_height_cm);

    outEl.style.display = 'block';
    outEl.innerHTML =
      '<div class="kfg-vip-report-card">' +
        '<div class="kfg-vip-report-head">' +
          '<span class="kfg-vip-report-pill" style="background:' + paceBadgeColor + ';">' + paceBadgeText + '</span>' +
          '<span class="kfg-vip-report-date">Instant Automated VIP Velocity Calculation &middot; ' + new Date().toISOString().slice(0, 10) + '</span>' +
        '</div>' +
        '<h3 class="kfg-vip-report-title">Instant VIP Velocity &amp; 4-Pillar Habit Commentary for ' + childLabel + '</h3>' +
        '<div class="kfg-vip-kpi-row">' +
          '<div class="kfg-vip-kpi-box">' +
            '<span class="kfg-vip-kpi-lbl">30-Day Stature Gain</span>' +
            '<strong class="kfg-vip-kpi-val">' + deltaSign + deltaIn.toFixed(2) + ' in <small>(' + deltaSign + deltaCm.toFixed(2) + ' cm)</small></strong>' +
            '<span class="kfg-vip-kpi-sub">' + escHtml(prevImp) + ' &rarr; ' + escHtml(currImp) + '</span>' +
          '</div>' +
          '<div class="kfg-vip-kpi-box">' +
            '<span class="kfg-vip-kpi-lbl">Annualized Growth Velocity</span>' +
            '<strong class="kfg-vip-kpi-val">' + annIn.toFixed(1) + ' in/yr <small>(' + annCm.toFixed(1) + ' cm/yr)</small></strong>' +
            '<span class="kfg-vip-kpi-sub">vs. US CDC median: ' + targetIn.toFixed(1) + ' in/yr (' + targetCm.toFixed(1) + ' cm/yr)</span>' +
          '</div>' +
          '<div class="kfg-vip-kpi-box">' +
            '<span class="kfg-vip-kpi-lbl">Strongest Monthly Pillar</span>' +
            '<strong class="kfg-vip-kpi-val" style="font-size:0.95rem;color:#047857;">' + escHtml(strongest.key) + ' (' + Number(strongest.score || 4) + '/5)</strong>' +
            '<span class="kfg-vip-kpi-sub">Keep anchoring this routine over the next 30 days</span>' +
          '</div>' +
        '</div>' +
        '<div class="kfg-vip-verdict-box">' +
          '<strong>Automated US CDC Velocity Summary:</strong> ' + escHtml(result.velocity_verdict || '') +
        '</div>' +
        '<div class="kfg-vip-bottleneck-box">' +
          '<div class="kfg-vip-bottleneck-title">Priority #1 Habit Bottleneck Next 30 Days: ' + escHtml(bottleneck.key) + ' (Score ' + Number(bottleneck.score || 3) + '/5)</div>' +
          '<div class="kfg-vip-bottleneck-tip">' + escHtml(bottleneck.tip || '') + '</div>' +
        '</div>' +
        '<div class="kfg-vip-email-confirm">' +
          'Calculated instantly on-screen for verified VIP member <strong>' + emailLabel + '</strong> &middot; Logged to your 30-day growth tracker.' +
        '</div>' +
      '</div>';
  }

  function computeLocalCheckinResult(payload) {
    if (global.DreamCompanyCRM && typeof global.DreamCompanyCRM.computeLocalKfgCommentary === 'function') {
      return global.DreamCompanyCRM.computeLocalKfgCommentary(payload);
    }
    var prevH = Number(payload.prev_height_cm) || 133.5;
    var curH = Number(payload.current_height_cm) || 134.1;
    var age = Number(payload.child_age_years) || 9;
    var isF = String(payload.child_sex || 'M').toUpperCase().charAt(0) === 'F';
    var targetVel = age < 6 ? 6.6 : (age < 9 ? 5.7 : (age < 11.5 ? (isF ? 7.4 : 5.5) : (age < 14 ? (isF ? 5.6 : 8.2) : 3.6)));
    var delta = Math.round((curH - prevH) * 100) / 100;
    var annVel = Math.round(((delta / 30) * 365) * 10) / 10;
    var habits = [
      { key: 'Deep Sleep Window (Pre-10 PM GH Pulse)', score: Number(payload.sleep_score) || 3, tip: 'Shift lights-out 30 minutes earlier and turn off screens 45 minutes before bed to protect peak Growth Hormone release.' },
      { key: 'Protein + Calcium / Vit D3 / Zinc Intake', score: Number(payload.nutrition_score) || 3, tip: 'Pair dinner lean protein with bioavailable Calcium, Vitamin D3, and Zinc for healthy bone-plate mineralization.' },
      { key: 'Daily 20-Min Vertical Impact & Stretch', score: Number(payload.exercise_score) || 3, tip: 'Add 15-20 minutes of jump-rope, hops, or evening spinal decompression stretches daily.' },
      { key: 'Spinal Posture & Nasal Breathing', score: Number(payload.posture_score) || 3, tip: 'Correct forward-head desk posture and check nighttime nasal breathing to protect 1.0-1.8 cm of standing stature.' }
    ].sort(function (a, b) { return a.score - b.score; });
    return {
      ok: true,
      prev_height_cm: prevH,
      current_height_cm: curH,
      delta_cm: delta,
      annualized_cm_yr: annVel,
      cdc_target_cm_yr: targetVel,
      velocity_verdict: '30-day delta of ' + (delta >= 0 ? '+' : '') + delta.toFixed(2) + ' cm (' + annVel.toFixed(1) + ' cm/yr annualized vs. US CDC median ' + targetVel.toFixed(1) + ' cm/yr).',
      strongest_habit: habits[habits.length - 1],
      priority_bottleneck: habits[0]
    };
  }

  function submitKfgVipMonthlyCheckinForm(ev) {
    if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();
    if (typeof document === 'undefined') return false;

    if (vipUnitMode === 'imperial') {
      syncVipImperialToMetric();
    } else {
      syncVipMetricToImperial();
    }

    var emailEl = document.getElementById('kfg-vip-email');
    var nameEl = document.getElementById('kfg-vip-child-name');
    var sexEl = document.getElementById('kfg-vip-child-sex');
    var ageEl = document.getElementById('kfg-vip-child-age');
    var prevEl = document.getElementById('kfg-vip-prev-cm');
    var currEl = document.getElementById('kfg-vip-curr-cm');
    var sleepEl = document.getElementById('kfg-vip-sleep-score');
    var nutEl = document.getElementById('kfg-vip-nutrition-score');
    var exEl = document.getElementById('kfg-vip-exercise-score');
    var posEl = document.getElementById('kfg-vip-posture-score');
    var errEl = document.getElementById('kfg-vip-form-error');

    var email = emailEl ? String(emailEl.value || '').trim().toLowerCase() : '';
    var paidVerified = isVipCheckinPaidVerified();

    if (paidVerified && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      email = 'vip.parent@kisfitglobal.com';
    } else if (!paidVerified && email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      if (errEl) {
        errEl.style.display = 'block';
        errEl.textContent = 'Please enter a valid parent email address (or leave valid format to preview numeric velocity).';
      }
      if (emailEl) emailEl.focus();
      return false;
    }

    var currCm = Number(currEl ? currEl.value : 0);
    var prevCm = Number(prevEl ? prevEl.value : 0);
    if (!isFinite(currCm) || currCm < 65 || currCm > 215) {
      if (errEl) {
        errEl.style.display = 'block';
        errEl.textContent = 'Please enter a valid current standing height between 2 ft 2 in (65 cm) and 7 ft 0 in (215 cm).';
      }
      return false;
    }
    if (!isFinite(prevCm) || prevCm < 60 || prevCm > 215) {
      prevCm = Math.round((currCm - 0.5) * 10) / 10;
      if (prevEl) prevEl.value = prevCm.toFixed(1);
      syncVipMetricToImperial();
    }
    if (errEl) errEl.style.display = 'none';

    var vipToken = '';
    var orderRef = '';
    try {
      var params = new URLSearchParams((global.location && global.location.search) || '');
      vipToken = String(params.get('vip_token') || localStorage.getItem('kfg_vip_token') || '').trim();
      orderRef = String(localStorage.getItem('kidsfit_global_order_id_v1') || '').trim();
    } catch (_) {}

    var payload = {
      email: email || 'preview@kisfitglobal.com',
      vip_token: vipToken,
      paid_verified: paidVerified,
      order_ref: orderRef,
      child_name: (nameEl && String(nameEl.value || '').trim()) || 'Your Child',
      child_sex: (sexEl && sexEl.value) || 'M',
      child_age_years: Number(ageEl ? ageEl.value : 9) || 9,
      prev_height_cm: prevCm,
      current_height_cm: currCm,
      sleep_score: Number(sleepEl ? sleepEl.value : 4) || 4,
      nutrition_score: Number(nutEl ? nutEl.value : 4) || 4,
      exercise_score: Number(exEl ? exEl.value : 3) || 3,
      posture_score: Number(posEl ? posEl.value : 3) || 3
    };

    var instantResult = computeLocalCheckinResult(payload);

    if (!paidVerified) {
      renderLockedVelocityTeaserCard(instantResult, payload);
      return false;
    }

    // Verified VIP / License Holder: 100% Instant Automated Calculation + Abacus vip_checkin
    fireVipCheckinAbacus();
    renderVerifiedVipCommentaryCard(instantResult, payload);

    try {
      var histRaw = localStorage.getItem('kfg_vip_checkin_history_v1') || '[]';
      var hist = JSON.parse(histRaw);
      if (!Array.isArray(hist)) hist = [];
      hist.unshift({
        date: new Date().toISOString().slice(0, 10),
        email: payload.email,
        prev_height_cm: payload.prev_height_cm,
        current_height_cm: payload.current_height_cm,
        delta_cm: instantResult.delta_cm
      });
      localStorage.setItem('kfg_vip_checkin_history_v1', JSON.stringify(hist.slice(0, 12)));
      localStorage.setItem('kfg_vip_last_height_cm', String(payload.current_height_cm));
    } catch (_) {}

    if (typeof global.stampKfgGrowthClubToday === 'function') {
      try { global.stampKfgGrowthClubToday(); } catch (_) {}
    }

    if (global.DreamCompanyCRM && typeof global.DreamCompanyCRM.submitKfgVipCheckin === 'function') {
      global.DreamCompanyCRM.submitKfgVipCheckin(payload).catch(function () {});
    }
    return false;
  }

  function hydrateKfgCrmAndVipPortal() {
    try {
      var savedSeg = localStorage.getItem('kfg_parent_member_segment');
      if (savedSeg && STAGE_MAP[savedSeg]) {
        selectKfgFreeClubSegment(savedSeg);
        selectKfgReelsCheatSheetBand(savedSeg);
      } else {
        selectKfgFreeClubSegment('ages_8_11_golden_window');
        selectKfgReelsCheatSheetBand('ages_8_11_golden_window');
      }

      var savedMember = (global.DreamCompanyCRM && global.DreamCompanyCRM.getLocalMember('KFG')) || null;
      var fallbackEmail = (savedMember && savedMember.email) || localStorage.getItem('kfg_parent_member_email') || '';
      if (fallbackEmail) {
        ['kfg-club-passwordless-email', 'kfg-reels-cheatsheet-email'].forEach(function (id) {
          var el = document.getElementById(id);
          if (el && !el.value) el.value = fallbackEmail;
        });
      }
      if (savedMember && savedMember.email) {
        if (savedMember.segment && STAGE_MAP[savedMember.segment]) {
          selectKfgFreeClubSegment(savedMember.segment);
        }
        var fbEl = document.getElementById('kfg-club-passwordless-feedback');
        if (fbEl) {
          fbEl.style.display = 'block';
          fbEl.className = 'kfg-crm-feedback success';
          fbEl.innerHTML = '<strong>Active Growth Club Member:</strong> ' + escHtml(savedMember.email) + ' &middot; Focus: ' + escHtml(STAGE_MAP[savedMember.segment] || STAGE_MAP.ages_8_11_golden_window);
        }
        var chkBox = document.getElementById('kfg-club-checklist-unlocked');
        if (chkBox) chkBox.style.display = 'grid';
      }

      var params = new URLSearchParams((global.location && global.location.search) || '');
      var urlVipEmail = String(params.get('vip_email') || '').trim();
      var urlVipToken = String(params.get('vip_token') || '').trim();
      var wantsCheckinScroll = params.get('vip_checkin') === '1' || Boolean(urlVipToken) || (global.location && global.location.hash === '#kfg-vip-monthly-checkin');

      if (urlVipToken) {
        localStorage.setItem('kfg_vip_token', urlVipToken);
      }

      var storedVip = null;
      try {
        var rawVip = localStorage.getItem('dc_kfg_paid_vip');
        if (rawVip) storedVip = JSON.parse(rawVip);
      } catch (_) {}

      var vipEmail = urlVipEmail ||
        (storedVip && storedVip.email) ||
        localStorage.getItem('kidsfit_global_buyer_email') ||
        fallbackEmail ||
        '';

      var vipEmailEl = document.getElementById('kfg-vip-email');
      if (vipEmailEl && vipEmail && !vipEmailEl.value) {
        vipEmailEl.value = vipEmail;
      }

      if (storedVip) {
        var nameEl = document.getElementById('kfg-vip-child-name');
        var sexEl = document.getElementById('kfg-vip-child-sex');
        var ageEl = document.getElementById('kfg-vip-child-age');
        var prevEl = document.getElementById('kfg-vip-prev-cm');
        var currEl = document.getElementById('kfg-vip-curr-cm');
        if (nameEl && storedVip.child_name && !nameEl.value) nameEl.value = storedVip.child_name;
        if (sexEl && storedVip.child_sex) sexEl.value = String(storedVip.child_sex).charAt(0).toUpperCase() === 'F' ? 'F' : 'M';
        if (ageEl && storedVip.child_age_years) ageEl.value = String(storedVip.child_age_years);
        if (prevEl && storedVip.baseline_height_cm) {
          var lastH = Number(localStorage.getItem('kfg_vip_last_height_cm')) || Number(storedVip.baseline_height_cm);
          prevEl.value = lastH.toFixed(1);
          if (currEl) currEl.value = (lastH + 0.5).toFixed(1);
        }
      }

      // Default to US Standard ft + in on load
      setVipCheckinUnit('imperial');

      var badgeEl = document.getElementById('kfg-vip-status-pill');
      if (badgeEl && isVipCheckinPaidVerified()) {
        badgeEl.textContent = 'VERIFIED VIP PASS ACTIVE - INSTANT VELOCITY COMMENTARY UNLOCKED';
        badgeEl.style.background = '#059669';
        badgeEl.style.color = '#FFFFFF';
      }

      if (wantsCheckinScroll) {
        setTimeout(function () {
          var sec = document.getElementById('kfg-vip-monthly-checkin');
          if (sec && typeof sec.scrollIntoView === 'function') {
            sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 350);
      }
    } catch (_) {}
  }

  global.selectKfgReelsCheatSheetBand = selectKfgReelsCheatSheetBand;
  global.submitKfgReelsCheatSheetForm = submitKfgReelsCheatSheetForm;
  global.selectKfgFreeClubSegment = selectKfgFreeClubSegment;
  global.submitKfgPasswordlessClubSignup = submitKfgPasswordlessClubSignup;
  global.syncVipImperialToMetric = syncVipImperialToMetric;
  global.syncVipMetricToImperial = syncVipMetricToImperial;
  global.syncVipHeightHelperLabels = syncVipHeightHelperLabels;
  global.setVipCheckinUnit = setVipCheckinUnit;
  global.toggleVipCheckinUnit = toggleVipCheckinUnit;
  global.selectVipHabitScore = selectVipHabitScore;
  global.isVipCheckinPaidVerified = isVipCheckinPaidVerified;
  global.unlockVipCheckinWithCode = unlockVipCheckinWithCode;
  global.submitKfgVipMonthlyCheckinForm = submitKfgVipMonthlyCheckinForm;

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', hydrateKfgCrmAndVipPortal);
    } else {
      hydrateKfgCrmAndVipPortal();
    }
  }
})(typeof window !== 'undefined' ? window : this);
