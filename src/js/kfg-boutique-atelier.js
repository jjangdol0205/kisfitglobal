/**
 * src/js/kfg-boutique-atelier.js
 * Division 2 (kisfitglobal.com) — Single-Breath Warm Boutique Pediatric Growth Atelier Engine
 *
 * Implements the Single-Breath Step-Up Charter (Phase 2-B):
 *   Screen 0: Above-the-Fold Instant Start CTA ("Start 1-Minute Free US CDC Growth Check ->")
 *             + Warm Founding Letter & Service Introduction
 *   Screen 1: One-Question-at-a-Time Step-Up Input (Step 1 of 5 -> Step 5 of 5)
 *             including Step 4 (#kfg-bone-age-interpreter) Optional Bone-Age & Exam-Date Time-Lag (Delta-t) Calibration
 *   Screen 2: Immediate Free Baseline US CDC 2000 Height Percentile & Growth-Clock Summary (Zero Email Wall)
 *             + 1-Tap D-30 Google Calendar Morning Height Check Reminder (08:00 AM local, +30 days)
 *             + Natural Passwordless Save Card (#kfg-parent-growth-club / #kfg-club-passwordless-box via DreamCompanyCRM)
 *             + 2-Tier Differentiated Polar.sh Paid Passes (#kfg-proactive-growth-edge, ?locale=en)
 *             + Returning VIP #kfg-vip-monthly-checkin Access
 *
 * Strictly 100% English (Zero-Hangul) and Zero Emojis.
 */
(function (global) {
  'use strict';

  var SAVED_PROFILE_KEY = 'kfg_saved_survey_profile_v1';
  var LEGACY_PROFILE_KEY = 'kidsfit_last_quiz_profile_v1';
  var PAID_UNLOCKED_KEY = 'kfg_paid_unlocked_v1';
  var LEGACY_UNLOCKED_KEY = 'kidsfit_global_report_unlocked_v1';
  var PAID_PLAN_KEY = 'kidsfit_global_paid_plan_v1';
  var EMAIL_UNLOCKED_KEY = 'kfg_baseline_email_opened_v1';

  var POLAR_SINGLE_URL = 'https://buy.polar.sh/polar_cl_v2pLSQbvj13RJxb57w8fqVjZ4h2C7YopmPUDr3vxfG6?locale=en';
  var POLAR_PASS_URL = 'https://buy.polar.sh/polar_cl_p8DAvlbz7wPj6SOPKhHjT5aaNyA2F3I528A3c15nBND?locale=en';

  var atelierState = {
    unitSystem: 'imperial',
    activeScreen: 0,
    currentStep: 1,
    maxStep: 5,
    emailGateOpened: false,
    profile: {
      gender: 'boy',
      birthYear: 2016,
      birthMonth: 10,
      birthDay: 15,
      ageMonths: 121,
      ageYears: 10,
      currentHeight: 138.4,
      currentWeight: 33.6,
      fatherHeight: 177.8,
      motherHeight: 163.8,
      bedtimeWindow: 'after_1030',
      sleepBreathing: 'quiet_nasal',
      nutritionHabit: 'selective_gap',
      hasBoneAge: false,
      baExamY: 10,
      baExamM: 0,
      baExamYears: null,
      baExamYear: 2026,
      baExamMonth: 5,
      baExamDateYm: '',
      baDeltaMonths: 0,
      baTempoFactor: 1.0,
      baProjectedTodayYears: null,
      baCalibrationText: '',
      baFollowUpRecommended: false,
      postureHabit: 'slouch_desk',
      movementFreq: 'moderate_2_3',
      tempoSign: 'steady',
      childName: '',
      parentEmail: ''
    }
  };

  function byId(id) {
    return typeof document !== 'undefined' ? document.getElementById(id) : null;
  }

  function esc(str) {
    return String(str === undefined || str === null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function hashAccessCode(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(16).padStart(8, '0');
  }

  function ensurePolarLocaleUrl(rawUrl, emailOverride) {
    if (typeof global.ensureKfgPolarLocaleUrl === 'function') {
      return global.ensureKfgPolarLocaleUrl(rawUrl, emailOverride);
    }
    var url = String(rawUrl || '').trim();
    if (!url) return '';
    var isPolar = /^https:\/\/buy\.polar\.sh\//i.test(url);
    var email = emailOverride !== undefined ? String(emailOverride || '').trim() : '';
    var hasValidEmail = Boolean(email && email.indexOf('@') !== -1);
    try {
      if (typeof URL === 'function' && /^https?:\/\//i.test(url)) {
        var u = new URL(url);
        if (isPolar) u.searchParams.set('locale', 'en');
        if (hasValidEmail) u.searchParams.set('customer_email', email);
        return u.toString();
      }
    } catch (_) {}
    if (isPolar && !/(?:[?&])locale=/i.test(url)) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + 'locale=en';
    }
    if (hasValidEmail && !/(?:[?&])customer_email=/i.test(url)) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + 'customer_email=' + encodeURIComponent(email);
    }
    return url;
  }

  function cmToFtInParts(cm) {
    var totalIn = (Number(cm) || 0) / 2.54;
    var ft = Math.floor(totalIn / 12);
    var remIn = Number((totalIn - ft * 12).toFixed(1));
    if (remIn >= 12) {
      ft += 1;
      remIn = 0.0;
    }
    return { ft: ft, inch: remIn };
  }

  function ftInToCm(ft, inch) {
    var f = parseFloat(ft) || 0;
    var i = parseFloat(inch) || 0;
    return Number(((f * 12 + i) * 2.54).toFixed(1));
  }

  function formatHeight(cm, unitOverride) {
    var u = unitOverride || atelierState.unitSystem;
    var safeCm = Number(cm) || 0;
    var parts = cmToFtInParts(safeCm);
    var ftInStr = parts.ft + ' ft ' + parts.inch.toFixed(1) + ' in';
    var cmStr = safeCm.toFixed(1) + ' cm';
    return u === 'imperial' ? (ftInStr + ' (' + cmStr + ')') : (cmStr + ' (' + ftInStr + ')');
  }

  function formatGain(cm, unitOverride) {
    var u = unitOverride || atelierState.unitSystem;
    var safeCm = Number(cm) || 0;
    var inStr = '+' + (safeCm / 2.54).toFixed(1) + ' in';
    var cmStr = '+' + safeCm.toFixed(1) + ' cm';
    return u === 'imperial' ? (inStr + ' (' + cmStr + ')') : (cmStr + ' (' + inStr + ')');
  }

  function formatYearsMonths(yearsFloat) {
    var totalMos = Math.max(0, Math.round((Number(yearsFloat) || 0) * 12));
    var y = Math.floor(totalMos / 12);
    var m = totalMos % 12;
    return y + 'y ' + m + 'm';
  }

  function ordinalSuffix(n) {
    var v = Math.abs(Math.round(n));
    if (v % 100 >= 11 && v % 100 <= 13) return v + 'th';
    if (v % 10 === 1) return v + 'st';
    if (v % 10 === 2) return v + 'nd';
    if (v % 10 === 3) return v + 'rd';
    return v + 'th';
  }

  function calculateChronologicalAge(birthYear, birthMonth, birthDay, refDate) {
    var now = (refDate instanceof Date && !isNaN(refDate.getTime())) ? refDate : new Date();
    var by = parseInt(birthYear, 10) || (now.getFullYear() - 10);
    var bm = parseInt(birthMonth, 10) || 10;
    var bd = parseInt(birthDay, 10) || 15;
    var totalMonths = (now.getFullYear() - by) * 12 + ((now.getMonth() + 1) - bm);
    if (now.getDate() < bd) totalMonths -= 1;
    var clamped = clamp(totalMonths, 24, 216);
    var yrs = Math.floor(clamped / 12);
    var mos = clamped % 12;
    return {
      ageMonths: clamped,
      ageYears: yrs,
      remMonths: mos,
      label: yrs + (yrs === 1 ? ' year, ' : ' years, ') + mos + (mos === 1 ? ' month' : ' months')
    };
  }

  function calibrateAtelierBoneAgeLag(opts) {
    var o = opts || {};
    var rawDate = o.todayDate || o.nowDate;
    var now = (rawDate instanceof Date && !isNaN(rawDate.getTime())) ? rawDate : new Date();
    var todayYear = typeof o.todayYear === 'number' ? o.todayYear : now.getFullYear();
    var todayMonth = typeof o.todayMonth === 'number' ? o.todayMonth : (now.getMonth() + 1);

    var examYear = parseInt(o.examYear, 10);
    var examMonth = parseInt(o.examMonth, 10);
    if (isNaN(examYear) || examYear < 2005 || examYear > todayYear + 1) examYear = todayYear;
    if (isNaN(examMonth) || examMonth < 1 || examMonth > 12) examMonth = todayMonth;

    var deltaMonths = Math.max(0, (todayYear - examYear) * 12 + (todayMonth - examMonth));
    var hasAccelSign = Boolean(o.hasEarlyPubertyOrRapidWeightSign || o.tempoSign === 'accelerated');
    var tempoFactor = hasAccelSign ? 1.08 : 1.0;

    var isGirl = String(o.sex || o.gender || '').toLowerCase() === 'girl' || String(o.sex || '').toUpperCase() === 'F';
    var maxBa = isGirl ? 17.5 : 18.5;
    var baY = clamp(parseFloat(o.baExamYears !== undefined ? o.baExamYears : 10) || 10, 3, 18);
    var baM = clamp(parseFloat(o.baExamMonths !== undefined ? o.baExamMonths : 0) || 0, 0, 11);
    var baExam = clamp(baY + (baM / 12), 3.0, maxBa);
    var baProjectedToday = clamp(baExam + (deltaMonths / 12) * tempoFactor, 3.0, maxBa);

    var examDateYm = String(examYear) + '-' + String(examMonth).padStart(2, '0');
    var baExamLabel = formatYearsMonths(baExam);
    var baProjectedTodayLabel = formatYearsMonths(baProjectedToday);
    var followUpRecommended = deltaMonths >= 12;

    var calloutText =
      'Examined ' + examDateYm + ' (' + deltaMonths + ' ' + (deltaMonths === 1 ? 'month' : 'months') +
      ' ago) at Bone Age ' + baExamLabel + ' -> Adjusted for ' + deltaMonths + ' elapsed ' + (deltaMonths === 1 ? 'month' : 'months') +
      (hasAccelSign && deltaMonths > 0 ? ' (with faster pubertal pace)' : '') +
      ' to Today\'s Estimated Bone Age ' + baProjectedTodayLabel + '.';

    var followUpNote = followUpRecommended
      ? 'Because more than 12 months have passed since that radiograph, requesting an updated wrist X-ray at your next routine pediatric visit is advisable.'
      : '';

    return {
      examYear: examYear,
      examMonth: examMonth,
      examDateYm: examDateYm,
      deltaMonths: deltaMonths,
      tempoFactor: tempoFactor,
      baExamYears: Number(baExam.toFixed(2)),
      baProjectedTodayYears: Number(baProjectedToday.toFixed(2)),
      baExamLabel: baExamLabel,
      baProjectedTodayLabel: baProjectedTodayLabel,
      followUpRecommended: followUpRecommended,
      calloutText: calloutText,
      followUpNote: followUpNote
    };
  }

  // Approximate standard normal CDF for pure-JS CDC LMS percentile fallback
  function normalCdfPct(z) {
    var t = 1 / (1 + 0.2316419 * Math.abs(z));
    var d = 0.3989423 * Math.exp(-z * z / 2);
    var prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    var p = z > 0 ? 1 - prob : prob;
    return clamp(Number((p * 100).toFixed(1)), 0.5, 99.5);
  }

  function computeAtelierAuxology(profile) {
    var p = profile || atelierState.profile;
    var GE = global.KidsFitGrowthEngine;
    var isBoy = p.gender !== 'girl';
    var sexKey = isBoy ? 'boy' : 'girl';
    var ageMos = clamp(Number(p.ageMonths) || 121, 24, 216);
    var ageYrsFloat = ageMos / 12;
    var hCm = clamp(Number(p.currentHeight) || 138.4, 75, 205);
    var wKg = clamp(Number(p.currentWeight) || 33.6, 10, 115);
    var fCm = clamp(Number(p.fatherHeight) || 177.8, 140, 215);
    var mCm = clamp(Number(p.motherHeight) || 163.8, 135, 200);

    var lms = (GE && typeof GE.getLmsForMonth === 'function')
      ? GE.getLmsForMonth(sexKey, ageMos)
      : { L: 1, M: isBoy ? (86 + ageYrsFloat * 5.25) : (85 + ageYrsFloat * 5.1), S: 0.045 };

    var zScore = Number(((hCm - lms.M) / (lms.M * (lms.S || 0.045))).toFixed(2));
    var percentile = normalCdfPct(zScore);
    if (GE && typeof GE.calculateKdcaPercentile === 'function') {
      try {
        var r = GE.calculateKdcaPercentile(hCm, lms.L, lms.M, lms.S);
        if (r && typeof r.percentile === 'number' && !isNaN(r.percentile)) {
          percentile = clamp(Number(r.percentile.toFixed(1)), 0.5, 99.5);
          if (r.zScore !== undefined) zScore = Number(Number(r.zScore).toFixed(2));
        }
      } catch (_) {}
    }

    var mphCm = Number(((fCm + mCm + (isBoy ? 13.0 : -13.0)) / 2).toFixed(1));

    var habitLossCm = 0.8;
    var bottlenecks = [];
    if (p.bedtimeWindow === 'after_1030') {
      habitLossCm += 1.6;
      bottlenecks.push('late lights-out window delaying first-cycle slow-wave sleep');
    } else if (p.bedtimeWindow === '930_1030') {
      habitLossCm += 0.7;
      bottlenecks.push('bedtime timing drifting past the 9:30 PM slow-wave window');
    }
    if (p.sleepBreathing === 'mouth_stuffy') {
      habitLossCm += 0.9;
      bottlenecks.push('nocturnal nasal congestion or mouth-breathing sleep fragmentation');
    }
    if (p.nutritionHabit === 'selective_gap') {
      habitLossCm += 1.0;
      bottlenecks.push('uneven evening protein, bioavailable calcium, and Vitamin D3 intake');
    }
    if (p.postureHabit === 'slouch_desk') {
      habitLossCm += 1.1;
      bottlenecks.push('seated spinal compression from desk and screen slouching');
    }
    if (p.movementFreq === 'indoor_low') {
      habitLossCm += 0.8;
      bottlenecks.push('low weekly vertical osteogenic loading');
    }

    var baOffsetCm = 0;
    if (p.hasBoneAge && Number(p.baProjectedTodayYears) > 0) {
      baOffsetCm = clamp((ageYrsFloat - Number(p.baProjectedTodayYears)) * 2.05, -6.0, 6.0);
    }

    var zAnchorOffset = clamp(zScore * 2.4, -6.5, 6.5);
    var baselineAdult = mphCm * 0.58 + (mphCm + zAnchorOffset) * 0.42 + baOffsetCm;

    var unmanagedCm = Number(Math.max(hCm + 2.0, baselineAdult - habitLossCm).toFixed(1));
    var optimizedGainCm = Number(clamp(habitLossCm + 2.4, 3.4, 6.8).toFixed(1));
    var optimizedCm = Number((unmanagedCm + optimizedGainCm).toFixed(1));
    var remainingRunwayCm = Number(Math.max(1.8, optimizedCm - hCm).toFixed(1));

    var effectiveAgeForRunway = (p.hasBoneAge && Number(p.baProjectedTodayYears) > 0)
      ? Number(p.baProjectedTodayYears)
      : ageYrsFloat;
    var remainingYears = Number(Math.max(0.5, (isBoy ? 17.0 : 15.0) - effectiveAgeForRunway).toFixed(1));

    var ciBoundCm = isBoy ? 4.2 : 3.6;
    var krMinCm = Number((baselineAdult - ciBoundCm).toFixed(1));
    var krMaxCm = Number((baselineAdult + ciBoundCm).toFixed(1));

    var gentlePeerObservation = percentile < 35
      ? 'Your child currently stands in the lower-third peer band for their exact age in months, making consistent evening deep sleep and daily bone-mineral habits especially valuable over the next twelve months.'
      : (percentile > 70
        ? 'Your child currently stands above the upper-middle US CDC peer band for their exact age in months; protecting steady childhood bone-age tempo matters just as much as current height.'
        : 'Your child currently tracks near the middle of US CDC peers of the exact same age in months, with meaningful evening rhythm and postural room to support steady annual growth.');

    var primaryBottleneckLine = bottlenecks.length > 0
      ? ('Priority modifiable bottlenecks identified: ' + bottlenecks.slice(0, 2).join(' and ') + '.')
      : 'Priority focus: preserving a calm 9:30 PM slow-wave sleep rhythm and daily spinal decompression.';

    var calciumMg = clamp(Math.round(wKg * 27), 700, 1300);
    var vitDIu = ageMos >= 108 ? 2000 : 1200;
    var proteinG = Math.round(wKg * 1.35);

    return {
      isBoy: isBoy,
      sexLabel: isBoy ? 'Boy' : 'Girl',
      ageLabel: calculateChronologicalAge(p.birthYear, p.birthMonth, p.birthDay).label,
      ageMonths: ageMos,
      heightCm: hCm,
      weightKg: wKg,
      mphCm: mphCm,
      percentile: percentile,
      ordinalPercentile: ordinalSuffix(Math.round(percentile)),
      zScore: zScore,
      unmanagedCm: unmanagedCm,
      optimizedCm: optimizedCm,
      optimizedGainCm: optimizedGainCm,
      remainingRunwayCm: remainingRunwayCm,
      remainingYears: remainingYears,
      krMinCm: krMinCm,
      krMaxCm: krMaxCm,
      gentlePeerObservation: gentlePeerObservation,
      primaryBottleneckLine: primaryBottleneckLine,
      bottlenecks: bottlenecks,
      calciumMg: calciumMg,
      vitDIu: vitDIu,
      proteinG: proteinG
    };
  }

  function isPaidUnlocked() {
    try {
      if (typeof global.location !== 'undefined' && global.location) {
        var s = String(global.location.search || '').toLowerCase();
        if (/(?:^\?|&)lock=1(?:&|$)/.test(s)) {
          if (global.localStorage) {
            global.localStorage.removeItem(PAID_UNLOCKED_KEY);
            global.localStorage.removeItem(LEGACY_UNLOCKED_KEY);
          }
          return false;
        }
      }
      if (global.localStorage) {
        return (
          global.localStorage.getItem(PAID_UNLOCKED_KEY) === 'true' ||
          global.localStorage.getItem(LEGACY_UNLOCKED_KEY) === 'true'
        );
      }
    } catch (_) {}
    return false;
  }

  function saveProfileToStorage() {
    try {
      if (!global.localStorage) return;
      var payload = JSON.stringify(atelierState.profile);
      global.localStorage.setItem(SAVED_PROFILE_KEY, payload);
      global.localStorage.setItem(LEGACY_PROFILE_KEY, payload);
      if (global.KidsFitApp && global.KidsFitApp.state) {
        global.KidsFitApp.state.profile = Object.assign({}, global.KidsFitApp.state.profile || {}, atelierState.profile);
      }
    } catch (_) {}
  }

  function loadProfileFromStorage() {
    try {
      if (!global.localStorage) return;
      var raw = global.localStorage.getItem(SAVED_PROFILE_KEY) || global.localStorage.getItem(LEGACY_PROFILE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          atelierState.profile = Object.assign({}, atelierState.profile, parsed);
        }
      }
      var savedEmail = global.localStorage.getItem('kfg_parent_member_email') || '';
      if (savedEmail && !atelierState.profile.parentEmail) {
        atelierState.profile.parentEmail = savedEmail;
      }
      if (global.localStorage.getItem(EMAIL_UNLOCKED_KEY) === 'true') {
        atelierState.emailGateOpened = true;
      }
    } catch (_) {}
  }

  function collectFormIntoProfile() {
    var p = atelierState.profile;
    if (typeof document === 'undefined') return p;

    var gGirl = byId('kfg-sex-girl');
    if (gGirl) p.gender = gGirl.checked ? 'girl' : 'boy';

    var bm = byId('kfg-dob-month');
    var bd = byId('kfg-dob-day');
    var by = byId('kfg-dob-year');
    if (bm && bd && by) {
      p.birthMonth = parseInt(bm.value, 10) || 10;
      p.birthDay = parseInt(bd.value, 10) || 15;
      p.birthYear = parseInt(by.value, 10) || 2016;
      var chrono = calculateChronologicalAge(p.birthYear, p.birthMonth, p.birthDay);
      p.ageMonths = chrono.ageMonths;
      p.ageYears = chrono.ageYears;
    }

    if (atelierState.unitSystem === 'imperial') {
      var hFt = byId('kfg-height-ft');
      var hIn = byId('kfg-height-in');
      var wLbs = byId('kfg-weight-lbs');
      if (hFt && hIn) p.currentHeight = clamp(ftInToCm(hFt.value, hIn.value), 75, 205);
      if (wLbs) p.currentWeight = clamp(Number(((parseFloat(wLbs.value) || 74) / 2.20462262).toFixed(1)), 10, 115);

      var fFt = byId('kfg-father-ft');
      var fIn = byId('kfg-father-in');
      var mFt = byId('kfg-mother-ft');
      var mIn = byId('kfg-mother-in');
      if (fFt && fIn) p.fatherHeight = clamp(ftInToCm(fFt.value, fIn.value), 140, 215);
      if (mFt && mIn) p.motherHeight = clamp(ftInToCm(mFt.value, mIn.value), 135, 200);
    } else {
      var hCmEl = byId('kfg-height-cm');
      var wKgEl = byId('kfg-weight-kg');
      var fCmEl = byId('kfg-father-cm');
      var mCmEl = byId('kfg-mother-cm');
      if (hCmEl) p.currentHeight = clamp(parseFloat(hCmEl.value) || 138.4, 75, 205);
      if (wKgEl) p.currentWeight = clamp(parseFloat(wKgEl.value) || 33.6, 10, 115);
      if (fCmEl) p.fatherHeight = clamp(parseFloat(fCmEl.value) || 177.8, 140, 215);
      if (mCmEl) p.motherHeight = clamp(parseFloat(mCmEl.value) || 163.8, 135, 200);
    }

    var readRadio = function (name, fallback) {
      if (typeof document.querySelector !== 'function') return fallback;
      var checked = document.querySelector('input[name="' + name + '"]:checked');
      return checked ? checked.value : fallback;
    };

    p.bedtimeWindow = readRadio('kfg-bedtime', p.bedtimeWindow);
    p.sleepBreathing = readRadio('kfg-breathing', p.sleepBreathing);
    p.nutritionHabit = readRadio('kfg-nutrition', p.nutritionHabit);
    p.postureHabit = readRadio('kfg-posture', p.postureHabit);
    p.movementFreq = readRadio('kfg-movement', p.movementFreq);
    p.tempoSign = readRadio('kfg-tempo', p.tempoSign);

    var baYes = byId('kfg-ba-choice-yes');
    p.hasBoneAge = Boolean(baYes && baYes.checked);
    if (p.hasBoneAge) {
      var baYEl = byId('kfg-ba-years');
      var baMEl = byId('kfg-ba-months');
      var exYEl = byId('kfg-ba-exam-year');
      var exMEl = byId('kfg-ba-exam-month');
      p.baExamY = baYEl ? (parseInt(baYEl.value, 10) || 10) : 10;
      p.baExamM = baMEl ? (parseInt(baMEl.value, 10) || 0) : 0;
      p.baExamYear = exYEl ? (parseInt(exYEl.value, 10) || new Date().getFullYear()) : new Date().getFullYear();
      p.baExamMonth = exMEl ? (parseInt(exMEl.value, 10) || (new Date().getMonth() + 1)) : (new Date().getMonth() + 1);
      var cal = calibrateAtelierBoneAgeLag({
        sex: p.gender,
        baExamYears: p.baExamY,
        baExamMonths: p.baExamM,
        examYear: p.baExamYear,
        examMonth: p.baExamMonth,
        tempoSign: p.tempoSign
      });
      p.baExamYears = cal.baExamYears;
      p.baExamDateYm = cal.examDateYm;
      p.baDeltaMonths = cal.deltaMonths;
      p.baTempoFactor = cal.tempoFactor;
      p.baProjectedTodayYears = cal.baProjectedTodayYears;
      p.baCalibrationText = cal.calloutText;
      p.baFollowUpRecommended = cal.followUpRecommended;
    } else {
      p.baExamYears = null;
      p.baExamDateYm = '';
      p.baDeltaMonths = 0;
      p.baTempoFactor = 1.0;
      p.baProjectedTodayYears = null;
      p.baCalibrationText = '';
      p.baFollowUpRecommended = false;
    }

    var emailInp = byId('kfg-club-passwordless-email');
    if (emailInp && emailInp.value) p.parentEmail = String(emailInp.value).trim();
    var nameInp = byId('kfg-club-child-name');
    if (nameInp && nameInp.value) p.childName = String(nameInp.value).trim();

    saveProfileToStorage();
    return p;
  }

  function populateFormFromProfile() {
    var p = atelierState.profile;
    var gBoy = byId('kfg-sex-boy');
    var gGirl = byId('kfg-sex-girl');
    if (gBoy && gGirl) {
      gBoy.checked = p.gender !== 'girl';
      gGirl.checked = p.gender === 'girl';
    }
    var bm = byId('kfg-dob-month');
    var bd = byId('kfg-dob-day');
    var by = byId('kfg-dob-year');
    if (bm) bm.value = String(p.birthMonth || 10);
    if (bd) bd.value = String(p.birthDay || 15);
    if (by) by.value = String(p.birthYear || 2016);

    var chParts = cmToFtInParts(p.currentHeight || 138.4);
    if (byId('kfg-height-ft')) byId('kfg-height-ft').value = String(chParts.ft);
    if (byId('kfg-height-in')) byId('kfg-height-in').value = chParts.inch.toFixed(1);
    if (byId('kfg-height-cm')) byId('kfg-height-cm').value = Number(p.currentHeight || 138.4).toFixed(1);

    if (byId('kfg-weight-lbs')) byId('kfg-weight-lbs').value = ((Number(p.currentWeight || 33.6)) * 2.20462262).toFixed(1);
    if (byId('kfg-weight-kg')) byId('kfg-weight-kg').value = Number(p.currentWeight || 33.6).toFixed(1);

    var fParts = cmToFtInParts(p.fatherHeight || 177.8);
    if (byId('kfg-father-ft')) byId('kfg-father-ft').value = String(fParts.ft);
    if (byId('kfg-father-in')) byId('kfg-father-in').value = fParts.inch.toFixed(1);
    if (byId('kfg-father-cm')) byId('kfg-father-cm').value = Number(p.fatherHeight || 177.8).toFixed(1);

    var mParts = cmToFtInParts(p.motherHeight || 163.8);
    if (byId('kfg-mother-ft')) byId('kfg-mother-ft').value = String(mParts.ft);
    if (byId('kfg-mother-in')) byId('kfg-mother-in').value = mParts.inch.toFixed(1);
    if (byId('kfg-mother-cm')) byId('kfg-mother-cm').value = Number(p.motherHeight || 163.8).toFixed(1);

    if (byId('kfg-club-passwordless-email') && p.parentEmail) {
      byId('kfg-club-passwordless-email').value = p.parentEmail;
    }
    if (byId('kfg-club-child-name') && p.childName) {
      byId('kfg-club-child-name').value = p.childName;
    }
    refreshLiveStepPreviews();
  }

  function syncRadioCardHighlights() {
    if (typeof document === 'undefined' || typeof document.querySelectorAll !== 'function') return;
    document.querySelectorAll('.kfg-radio-card').forEach(function (card) {
      var radio = card.querySelector('input[type="radio"]');
      if (radio) {
        if (radio.checked) card.classList.add('is-selected');
        else card.classList.remove('is-selected');
      }
    });
  }

  function refreshLiveStepPreviews() {
    var p = collectFormIntoProfile();
    var chrono = calculateChronologicalAge(p.birthYear, p.birthMonth, p.birthDay);
    var ageEl = byId('kfg-live-age-note');
    if (ageEl) ageEl.textContent = 'Exact age today: ' + chrono.label;

    var isBoy = p.gender !== 'girl';
    var mphCm = ((Number(p.fatherHeight) || 177.8) + (Number(p.motherHeight) || 163.8) + (isBoy ? 13.0 : -13.0)) / 2;
    var mphEl = byId('kfg-live-mph-note');
    if (mphEl) {
      mphEl.innerHTML = '<strong>Family Height Midpoint:</strong> ' + esc(formatHeight(mphCm)) +
        ' (natural inherited family center before evening sleep, meals, and bone-age pace are weighed).';
    }

    var baDrawer = byId('kfg-ba-detail-drawer');
    var baNoNote = byId('kfg-ba-no-xray-note');
    if (baDrawer) baDrawer.style.display = p.hasBoneAge ? 'block' : 'none';
    if (baNoNote) baNoNote.style.display = p.hasBoneAge ? 'none' : 'block';

    if (p.hasBoneAge) {
      var cal = calibrateAtelierBoneAgeLag({
        sex: p.gender,
        baExamYears: p.baExamY,
        baExamMonths: p.baExamM,
        examYear: p.baExamYear,
        examMonth: p.baExamMonth,
        tempoSign: p.tempoSign
      });
      var calBox = byId('kfg-atelier-ba-live-note');
      if (calBox) {
        calBox.innerHTML = '<strong>Elapsed Time Adjustment:</strong> ' + esc(cal.calloutText) +
          (cal.followUpNote ? (' <br><span style="color:#6B635B;">' + esc(cal.followUpNote) + '</span>') : '');
      }
    }
    syncRadioCardHighlights();
  }

  function setAtelierUnitSystem(unit) {
    collectFormIntoProfile();
    atelierState.unitSystem = unit === 'metric' ? 'metric' : 'imperial';
    var isImp = atelierState.unitSystem === 'imperial';

    var btnImp = byId('btn-kfg-unit-imp');
    var btnMet = byId('btn-kfg-unit-met');
    if (btnImp) btnImp.classList.toggle('is-active', isImp);
    if (btnMet) btnMet.classList.toggle('is-active', !isImp);

    if (typeof document !== 'undefined' && typeof document.querySelectorAll === 'function') {
      document.querySelectorAll('.kfg-imp-only').forEach(function (el) {
        el.style.display = isImp ? '' : 'none';
      });
      document.querySelectorAll('.kfg-met-only').forEach(function (el) {
        el.style.display = isImp ? 'none' : '';
      });
    }

    populateFormFromProfile();
    if (atelierState.activeScreen === 2) renderScreen2And3();
    if (atelierState.activeScreen === 3) renderUnlockedDossier();
    if (typeof global.setKfgVipHeightUnit === 'function') {
      try { global.setKfgVipHeightUnit(atelierState.unitSystem); } catch (_) {}
    }
  }

  function showScreen(screenIdx) {
    atelierState.activeScreen = screenIdx;
    var shellEl = byId('kfg-shell-container');
    var mainEl = byId('kfg-single-breath-atelier');
    if (shellEl) {
      shellEl.classList.toggle('is-opening-view', screenIdx === 0);
      shellEl.classList.toggle('is-wide-view', screenIdx === 2 || screenIdx === 3);
    }
    if (mainEl) {
      mainEl.classList.toggle('kfg-atelier-card', screenIdx !== 0);
    }
    var screens = [
      byId('kfg-screen-0-letter'),
      byId('kfg-screen-1-steps'),
      byId('kfg-screen-2-email-gate'),
      byId('kfg-screen-3-unlocked-dossier')
    ];
    for (var i = 0; i < screens.length; i++) {
      if (screens[i]) screens[i].style.display = i === screenIdx ? 'block' : 'none';
    }
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (_) {}
    }
  }

  function beginAtelier() {
    populateFormFromProfile();
    showScreen(1);
    goToAtelierStep(1);
  }

  function goToAtelierStep(stepNum) {
    if (stepNum < 1) {
      showScreen(0);
      return;
    }
    var target = clamp(parseInt(stepNum, 10) || 1, 1, 5);
    atelierState.currentStep = target;
    for (var s = 1; s <= 5; s++) {
      var panel = byId('kfg-atelier-step-' + s);
      if (panel) panel.style.display = s === target ? 'block' : 'none';
    }
    var counterEl = byId('kfg-step-indicator');
    if (counterEl) counterEl.textContent = 'Question ' + target + ' of 5';
    var fillEl = byId('kfg-step-progress-fill');
    if (fillEl) fillEl.style.width = (target * 20) + '%';
    var backEl = byId('btn-kfg-step-back');
    if (backEl) {
      backEl.textContent = target === 1 ? '\u2190 Back to Our Story' : ('\u2190 Previous Question');
    }
    refreshLiveStepPreviews();
  }

  function nextAtelierStep() {
    collectFormIntoProfile();
    if (atelierState.currentStep < 5) {
      goToAtelierStep(atelierState.currentStep + 1);
    } else {
      completeStepsAndEnterGate();
    }
  }

  function prevAtelierStep() {
    collectFormIntoProfile();
    if (atelierState.currentStep <= 1) {
      showScreen(0);
    } else {
      goToAtelierStep(atelierState.currentStep - 1);
    }
  }

  function applyParentUsAverage(which) {
    if (which === 'father') {
      atelierState.profile.fatherHeight = 175.3; // 5 ft 9.0 in
    } else {
      atelierState.profile.motherHeight = 162.6; // 5 ft 4.0 in
    }
    populateFormFromProfile();
  }

  function selectBoneAgeLagMonths(monthsAgo, chipBtn) {
    var now = new Date();
    var totalMos = now.getFullYear() * 12 + now.getMonth() - (parseInt(monthsAgo, 10) || 0);
    var y = Math.floor(totalMos / 12);
    var m = (totalMos % 12) + 1;
    if (byId('kfg-ba-exam-year')) byId('kfg-ba-exam-year').value = String(y);
    if (byId('kfg-ba-exam-month')) byId('kfg-ba-exam-month').value = String(m);
    if (typeof document !== 'undefined' && typeof document.querySelectorAll === 'function') {
      document.querySelectorAll('[data-kfg-lag-chip]').forEach(function (b) {
        b.classList.toggle('is-active', b === chipBtn);
      });
    }
    refreshLiveStepPreviews();
  }

  function selectBoneAgeStageChip(yearsVal, monthsVal, chipBtn) {
    if (byId('kfg-ba-years')) byId('kfg-ba-years').value = String(yearsVal);
    if (byId('kfg-ba-months')) byId('kfg-ba-months').value = String(monthsVal);
    if (typeof document !== 'undefined' && typeof document.querySelectorAll === 'function') {
      document.querySelectorAll('[data-kfg-stage-chip]').forEach(function (b) {
        b.classList.toggle('is-active', b === chipBtn);
      });
    }
    refreshLiveStepPreviews();
  }

  var SIBLINGS_KEY = 'kfg_sibling_profiles_v1';
  var ACTIVE_SIBLING_KEY = 'kfg_active_sibling_idx_v1';

  function loadSiblingProfiles() {
    try {
      var raw = global.localStorage && global.localStorage.getItem(SIBLINGS_KEY);
      var arr = raw ? JSON.parse(raw) : null;
      if (Array.isArray(arr) && arr.length > 0) return arr.slice(0, 4);
    } catch (_) {}
    return [Object.assign({ slotName: 'Child 1' }, atelierState.profile)];
  }

  function saveSiblingProfiles(arr) {
    try {
      if (global.localStorage) global.localStorage.setItem(SIBLINGS_KEY, JSON.stringify((arr || []).slice(0, 4)));
    } catch (_) {}
  }

  function getActiveSiblingIdx() {
    try {
      return clamp(parseInt((global.localStorage && global.localStorage.getItem(ACTIVE_SIBLING_KEY)) || '0', 10) || 0, 0, 3);
    } catch (_) { return 0; }
  }

  function renderSiblingSwitcherBar(mountId) {
    var el = byId(mountId || 'kfg-sibling-switcher-bar');
    if (!el) return;
    var paidPlan = (global.localStorage && global.localStorage.getItem(PAID_PLAN_KEY)) || 'single';
    var isTier2 = isPaidUnlocked() && (paidPlan === 'pass' || paidPlan === 'sixMonth');
    var list = loadSiblingProfiles();
    var activeIdx = Math.min(getActiveSiblingIdx(), list.length - 1);
    var html = '';
    for (var i = 0; i < list.length; i++) {
      var lbl = (list[i].childName || list[i].slotName || ('Child ' + (i + 1)));
      html += '<button type="button" class="kfg-chip-btn ' + (i === activeIdx ? 'is-active' : '') + '" onclick="window.switchKfgSibling(' + i + ')">' + esc(lbl) + '</button>';
    }
    if (isTier2 && list.length < 4) {
      html += '<button type="button" class="kfg-chip-btn" style="border-style:dashed;" onclick="window.addKfgSiblingProfile()">+ Add Sibling (' + list.length + '/4)</button>';
    } else if (!isTier2) {
      html += '<span style="font-size:0.78rem;color:#6B635B;align-self:center;margin-left:4px;">Up to 4 siblings unlock with 6-Month Pass ($19.99)</span>';
    }
    el.innerHTML = html;
  }

  function switchKfgSibling(idx) {
    var list = loadSiblingProfiles();
    var curIdx = Math.min(getActiveSiblingIdx(), list.length - 1);
    list[curIdx] = Object.assign({}, list[curIdx], atelierState.profile);
    var nextIdx = clamp(parseInt(idx, 10) || 0, 0, list.length - 1);
    saveSiblingProfiles(list);
    try { if (global.localStorage) global.localStorage.setItem(ACTIVE_SIBLING_KEY, String(nextIdx)); } catch (_) {}
    atelierState.profile = Object.assign({}, atelierState.profile, list[nextIdx]);
    saveProfileToStorage();
    populateFormFromProfile();
    if (byId('kfg-vip-child-name')) byId('kfg-vip-child-name').value = atelierState.profile.childName || ('Child ' + (nextIdx + 1));
    if (byId('kfg-vip-child-age')) byId('kfg-vip-child-age').value = String(atelierState.profile.ageYears || 10);
    if (byId('kfg-vip-child-sex')) byId('kfg-vip-child-sex').value = atelierState.profile.gender === 'girl' ? 'F' : 'M';
    renderSiblingSwitcherBar('kfg-sibling-switcher-bar');
    renderSiblingSwitcherBar('kfg-dossier-sibling-bar');
    if (atelierState.activeScreen === 3) renderUnlockedDossier();
  }

  function addKfgSiblingProfile() {
    var list = loadSiblingProfiles();
    if (list.length >= 4) return;
    var n = list.length + 1;
    list.push(Object.assign({}, atelierState.profile, { childName: 'Child ' + n, slotName: 'Child ' + n, birthYear: (new Date()).getFullYear() - 8 }));
    saveSiblingProfiles(list);
    switchKfgSibling(list.length - 1);
  }

  function downloadAtelierD30Ics() {
    var p = atelierState.profile;
    var aux = computeAtelierAuxology(p);
    var now = new Date();
    var d30 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30, 8, 0, 0);
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var stamp = d30.getFullYear() + pad(d30.getMonth() + 1) + pad(d30.getDate()) + 'T080000';
    var endStamp = d30.getFullYear() + pad(d30.getMonth() + 1) + pad(d30.getDate()) + 'T081500';
    var summary = (p.childName ? (p.childName + ' - ') : '') + 'Morning Standing Height Check (KISFIT Studio)';
    var ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//KISFIT Studio//Growth Reminder//EN',
      'BEGIN:VEVENT',
      'DTSTART:' + stamp,
      'DTEND:' + endStamp,
      'SUMMARY:' + summary,
      'DESCRIPTION:Baseline ' + formatHeight(aux.heightCm) + ' (US CDC ' + aux.ordinalPercentile + ' Pct). Measure barefoot morning height against a flat wall and log at https://kisfitglobal.com',
      'URL:https://kisfitglobal.com',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'KISFIT_D30_Height_Check.ics';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { if (a.parentNode) a.parentNode.removeChild(a); URL.revokeObjectURL(url); }, 2500);
  }

  function completeStepsAndEnterGate() {
    if (global.DreamCompanyCRM && typeof global.DreamCompanyCRM.trackFunnelEvent === 'function') {
      global.DreamCompanyCRM.trackFunnelEvent('KFG', 'quiz_complete');
    }
    collectFormIntoProfile();
    if (isPaidUnlocked()) {
      showScreen(3);
      renderUnlockedDossier();
      return;
    }
    showScreen(2);
    renderScreen2And3();
  }

  function buildD30GoogleCalendarUrl(aux, profile, refDate) {
    var now = (refDate instanceof Date && !isNaN(refDate.getTime())) ? new Date(refDate.getTime()) : new Date();
    var d30 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30, 8, 0, 0);
    var yyyy = String(d30.getFullYear());
    var mm = String(d30.getMonth() + 1).padStart(2, '0');
    var dd = String(d30.getDate()).padStart(2, '0');
    var datesParam = yyyy + mm + dd + 'T080000/' + yyyy + mm + dd + 'T081500';
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var readableDate = monthNames[d30.getMonth()] + ' ' + d30.getDate() + ', ' + yyyy + ' \u00B7 8:00 AM Local';

    var p = profile || atelierState.profile;
    var a = aux || computeAtelierAuxology(p);
    var childPrefix = (p && p.childName) ? (String(p.childName).trim() + ' - ') : '';
    var eventTitle = childPrefix + 'Morning Standing Height Check (KISFIT US CDC Growth Log)';
    var detailsLines = [
      'Baseline logged: ' + formatHeight(a.heightCm) + ' (US CDC ' + a.ordinalPercentile + ' Percentile).',
      '1) Measure barefoot morning standing height against a flat wall within 30 minutes of waking.',
      '2) Return to https://kisfitglobal.com to check 30-day US CDC growth pace and evening habits.'
    ];
    var url =
      'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent(eventTitle) +
      '&dates=' + encodeURIComponent(datesParam) +
      '&details=' + encodeURIComponent(detailsLines.join('\n')) +
      '&location=' + encodeURIComponent('https://kisfitglobal.com');

    return {
      url: url,
      datesParam: datesParam,
      readableDate: readableDate
    };
  }

  function reopenAtelierEmailSaveForm() {
    atelierState.emailGateOpened = false;
    renderScreen2And3();
    var emailEl = byId('kfg-club-passwordless-email');
    if (emailEl && typeof emailEl.focus === 'function') emailEl.focus();
  }

  function renderScreen2And3() {
    var p = collectFormIntoProfile();
    var aux = computeAtelierAuxology(p);
    var shellEl = byId('kfg-shell-container');
    if (shellEl) {
      shellEl.classList.add('is-wide-view');
    }
    var formWrap = byId('kfg-email-gate-form-panel');
    var savedConfirm = byId('kfg-email-saved-confirmation');
    var partialWrap = byId('kfg-partial-baseline-summary');
    var paidWrap = byId('kfg-proactive-growth-edge');

    if (partialWrap) {
      partialWrap.style.display = 'block';
      var childHeader = (p.childName ? (esc(p.childName) + ' \u00B7 ') : '') +
        esc(aux.ageLabel) + ' \u00B7 ' + esc(aux.sexLabel);
      var clampedPin = clamp(aux.percentile, 3, 97);
      var growthClockLine = (p.hasBoneAge && p.baCalibrationText)
        ? ('<strong>Growth-Clock Reading (Time-Adjusted Bone Age):</strong> ' + esc(p.baCalibrationText) + ' ' + esc(aux.primaryBottleneckLine))
        : ('<strong>Growth-Clock Reading (US CDC 2000 Exact-Age Curve):</strong> Modeled at exact age ' + esc(aux.ageLabel) + ' alongside both parents\' heights. ' + esc(aux.primaryBottleneckLine));

      partialWrap.innerHTML =
        '<span class="kfg-note-tag" style="margin-bottom:0.45rem;">US CDC 2000 Baseline &amp; Growth-Clock Summary \u00B7 Free</span>' +
        '<h3 class="kfg-serif-h2" style="margin-bottom:0.35rem;">' + childHeader + '</h3>' +
        '<div class="kfg-baseline-metrics">' +
          '<div class="kfg-metric-tile">' +
            '<div class="kfg-metric-kicker">Current Standing Height</div>' +
            '<div class="kfg-metric-value">' + esc(formatHeight(aux.heightCm)) + '</div>' +
            '<div class="kfg-metric-sub">Day-exact age baseline</div>' +
          '</div>' +
          '<div class="kfg-metric-tile">' +
            '<div class="kfg-metric-kicker">US CDC 2000 Peer Percentile</div>' +
            '<div class="kfg-metric-value" style="color:#2F5241;">' + esc(aux.ordinalPercentile) + ' Percentile</div>' +
            '<div class="kfg-metric-sub">Taller than ~' + Math.round(aux.percentile) + ' of 100 peers</div>' +
          '</div>' +
          '<div class="kfg-metric-tile">' +
            '<div class="kfg-metric-kicker">Family Height Midpoint</div>' +
            '<div class="kfg-metric-value">' + esc(formatHeight(aux.mphCm)) + '</div>' +
            '<div class="kfg-metric-sub">Inherited family center</div>' +
          '</div>' +
        '</div>' +
        '<div class="kfg-percentile-bar-box" aria-label="US CDC Peer Percentile Scale">' +
          '<div class="kfg-percentile-labels">' +
            '<span>3rd</span><span>25th</span><span>50th (Median)</span><span>75th</span><span>97th</span>' +
          '</div>' +
          '<div class="kfg-percentile-track">' +
            '<div class="kfg-percentile-fill" style="width:' + clampedPin + '%;"></div>' +
            '<div class="kfg-percentile-pin" style="left:' + clampedPin + '%;"></div>' +
          '</div>' +
        '</div>' +
        '<p style="margin:0 0 0.85rem;font-size:0.95rem;line-height:1.74;color:#3A3430;">' +
          esc(aux.gentlePeerObservation) +
        '</p>' +
        '<div class="kfg-warm-note" style="margin-top:0;">' +
          growthClockLine +
        '</div>';
    }

    var gcalInfo = buildD30GoogleCalendarUrl(aux, p);
    var gcalBtn = byId('btn-kfg-d30-gcal-reminder');
    if (gcalBtn && typeof gcalBtn.setAttribute === 'function') {
      gcalBtn.setAttribute('href', gcalInfo.url);
    }
    var gcalDateEl = byId('kfg-d30-target-date-label');
    if (gcalDateEl) {
      gcalDateEl.textContent = gcalInfo.readableDate;
    }

    var isEmailSaved = Boolean(atelierState.emailGateOpened && p.parentEmail);
    if (formWrap) {
      formWrap.style.display = isEmailSaved ? 'none' : 'block';
    }
    if (savedConfirm) {
      savedConfirm.style.display = isEmailSaved ? 'block' : 'none';
      if (isEmailSaved) {
        savedConfirm.innerHTML =
          '<strong>Summary saved for ' + esc(p.parentEmail) + '.</strong> ' +
          'Your child\'s baseline US CDC reading is bookmarked on this browser and monthly growth notes are active. ' +
          '<button type="button" class="kfg-helper-action" style="margin-left:0.35rem;" onclick="window.reopenAtelierEmailSaveForm()">Update email</button>';
      }
    }

    var lockedLine = byId('kfg-locked-ba-line');
    if (lockedLine) {
      lockedLine.textContent = p.hasBoneAge
        ? ('Your wrist bone-age reading (adjusted for ' + p.baDeltaMonths + ' elapsed months) and final adult height forecast are ready below.')
        : 'Your child\'s full adult height forecast, priority evening habit plan, and monthly velocity tracker are ready below.';
    }

    if (paidWrap) {
      paidWrap.style.display = 'block';
    }
  }

  function submitAtelierEmailGate(ev) {
    if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();
    var emailEl = byId('kfg-club-passwordless-email');
    var nameEl = byId('kfg-club-child-name');
    var errEl = byId('kfg-email-gate-error');
    var email = String((emailEl && emailEl.value) || '').trim().toLowerCase();
    var nickname = String((nameEl && nameEl.value) || '').trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      if (errEl) {
        errEl.style.display = 'block';
        errEl.textContent = 'Please enter a valid parent email address to save your child\'s custom growth summary.';
      }
      if (emailEl && typeof emailEl.focus === 'function') emailEl.focus();
      return false;
    }
    if (errEl) errEl.style.display = 'none';

    atelierState.profile.parentEmail = email;
    if (nickname) atelierState.profile.childName = nickname;
    atelierState.emailGateOpened = true;
    saveProfileToStorage();

    try {
      if (global.localStorage) {
        global.localStorage.setItem('kfg_parent_member_email', email);
        global.localStorage.setItem(EMAIL_UNLOCKED_KEY, 'true');
      }
    } catch (_) {}

    var ageY = atelierState.profile.ageYears || 10;
    var seg = ageY <= 7 ? 'ages_3_7_foundation' : (ageY >= 12 ? 'ages_12_16_peak_velocity' : 'ages_8_11_golden_window');

    if (global.DreamCompanyCRM && typeof global.DreamCompanyCRM.registerMember === 'function') {
      try {
        global.DreamCompanyCRM.registerMember({
          div: 'KFG',
          email: email,
          nickname: nickname,
          segment: seg,
          lang: 'en-US',
          notes: 'site=kisfitglobal.com | source=boutique_atelier_stepup'
        });
      } catch (_) {}
    }

    if (typeof global.recordKfgSignupBeacons === 'function') {
      global.recordKfgSignupBeacons({});
    } else if (typeof global.fetch === 'function') {
      try {
        global.fetch('https://abacus.jasoncameron.dev/hit/kfg_kisfitglobal/signup', { mode: 'cors', keepalive: true }).catch(function () {});
        global.fetch('https://abacus.jasoncameron.dev/hit/kfg_kisfitglobal/signup_total', { mode: 'cors', keepalive: true }).catch(function () {});
      } catch (_) {}
    }

    renderScreen2And3();
    return false;
  }

  function startAtelierPolarCheckout(tier) {
    collectFormIntoProfile();
    var isPass = tier === 'pass' || tier === 'sixMonth' || tier === 'pass_1999';
    var normalizedPlan = isPass ? 'pass' : 'single';

    try {
      if (global.localStorage) {
        global.localStorage.setItem('kfg_pending_tier_v1', normalizedPlan);
        if (atelierState.profile.parentEmail) {
          global.localStorage.setItem('kidsfit_pending_polar_checkout_email_v1', atelierState.profile.parentEmail);
        }
      }
    } catch (_) {}

    if (typeof global.recordKfgPaidClickOnce === 'function') {
      global.recordKfgPaidClickOnce(normalizedPlan);
    }

    var payCfg = global.PAYMENT_CONFIG || { STORE_LIVE_READY: true };
    var rawTargetUrl = isPass
      ? ((payCfg.POLAR_CHECKOUT_URLS && payCfg.POLAR_CHECKOUT_URLS.pass_1999) || payCfg.POLAR_KFG_PASS_URL || POLAR_PASS_URL)
      : ((payCfg.POLAR_CHECKOUT_URLS && payCfg.POLAR_CHECKOUT_URLS.single_899) || payCfg.POLAR_KFG_SINGLE_URL || POLAR_SINGLE_URL);

    if (payCfg.STORE_LIVE_READY === false) {
      if (typeof global.openKfgVipWaitlistModal === 'function') {
        global.openKfgVipWaitlistModal(isPass ? 'sixMonth' : 'single');
      }
      return { ok: true, mode: 'vip_waitlist', plan: normalizedPlan };
    }

    var checkoutUrl = ensurePolarLocaleUrl(rawTargetUrl, atelierState.profile.parentEmail || '');
    if (typeof global.navigateToKfgPolarCheckout === 'function') {
      global.navigateToKfgPolarCheckout(checkoutUrl, isPass ? 'sixMonth' : 'single');
      return { ok: true, mode: 'polar_sh', checkoutUrl: checkoutUrl, plan: normalizedPlan };
    }

    if (global.location) {
      global.location.href = checkoutUrl;
    }
    return { ok: true, mode: 'polar_redirect', checkoutUrl: checkoutUrl, plan: normalizedPlan };
  }

  function activatePaidUnlock(planType, emailOpt, orderIdOpt) {
    var resolvedPlan = planType === 'pass' || planType === 'sixMonth' ? 'pass' : 'single';
    try {
      if (global.localStorage) {
        global.localStorage.setItem(PAID_UNLOCKED_KEY, 'true');
        global.localStorage.setItem(LEGACY_UNLOCKED_KEY, 'true');
        global.localStorage.setItem(PAID_PLAN_KEY, resolvedPlan);
        if (emailOpt) global.localStorage.setItem('kidsfit_global_buyer_email', emailOpt);
        if (orderIdOpt) global.localStorage.setItem('kidsfit_global_order_id_v1', String(orderIdOpt));
      }
      if (global.DreamCompanyCRM && typeof global.DreamCompanyCRM.deliverPaidMagicPack === 'function') {
        global.DreamCompanyCRM.deliverPaidMagicPack({
          div: 'KFG',
          email: emailOpt || atelierState.profile.parentEmail || '',
          plan_tier: resolvedPlan === 'pass' ? '6-Month Growth Velocity Pass ($19.99)' : 'Single Growth & Bone-Age Report ($8.99)',
          order_ref: String(orderIdOpt || 'POLAR-KFG'),
          base_url: 'https://kisfitglobal.com/',
          hash_anchor: 'kfg-screen-3-dossier',
          profile_state: atelierState.profile
        });
      }
    } catch (_) {}
    closeKfgMemberModal();
    showScreen(3);
    renderUnlockedDossier();
  }

  function renderUnlockedDossier() {
    var container = byId('kfg-unlocked-dossier-content');
    if (!container) return;
    var p = atelierState.profile;
    var aux = computeAtelierAuxology(p);
    var paidPlan = 'single';
    try {
      if (global.localStorage) {
        paidPlan = global.localStorage.getItem(PAID_PLAN_KEY) || global.localStorage.getItem('kfg_pending_tier_v1') || 'single';
      }
    } catch (_) {}
    var isPass = paidPlan === 'pass' || paidPlan === 'sixMonth';

    var childTitle = (p.childName ? (esc(p.childName) + ' \u00B7 ') : '') +
      esc(aux.ageLabel) + ' (' + esc(aux.sexLabel) + ')';

    var baSectionHtml = p.hasBoneAge && Number(p.baProjectedTodayYears) > 0
      ? ('<div class="kfg-warm-note">' +
          '<strong>Elapsed Bone-Age Adjustment Applied:</strong> ' + esc(p.baCalibrationText || ('Today\'s Estimated Bone Age: ' + formatYearsMonths(p.baProjectedTodayYears))) +
          ' Estimated remaining open growth runway: <strong>' + esc(formatGain(aux.remainingRunwayCm)) + '</strong> across approximately <strong>' + aux.remainingYears + ' growing years</strong>.' +
          (p.baFollowUpRecommended ? ' Consider an updated wrist X-ray at your next routine checkup since over 12 months have passed.' : '') +
        '</div>')
      : ('<div class="kfg-warm-note">' +
          '<strong>Growth Runway (Without Wrist X-Ray):</strong> Modeled from US CDC reference curves, both parents\' heights, and current somatic pace. Estimated remaining height runway: <strong>' +
          esc(formatGain(aux.remainingRunwayCm)) + '</strong> over approximately <strong>' + aux.remainingYears + ' years</strong>.' +
        '</div>');

    var tier2Block = isPass
      ? ('<div class="kfg-dossier-section kfg-no-print">' +
          '<span class="kfg-tier-tag">6-Month Growth Velocity Pass Active</span>' +
          '<h3 class="kfg-serif-h2">Monthly (30-Day Cycle) US CDC Growth Velocity Log</h3>' +
          '<p style="margin:0 0 1rem;font-size:0.94rem;color:#6B635B;">Record your child\'s morning standing height once every 30 days to check annualized growth pace (in/yr &amp; cm/yr) against US CDC norms.</p>' +
          '<button type="button" class="kfg-btn-primary" style="max-width:340px;" onclick="window.openKfgMemberModal(\'checkin\')">Open 30-Day Height Velocity Check-In -&gt;</button>' +
        '</div>')
      : ('<div class="kfg-dossier-section kfg-no-print">' +
          '<div class="kfg-warm-note kfg-warm-note-amber">' +
            '<strong>Want 6-Month Monthly Velocity Tracking?</strong> You have lifetime access to this Single Growth &amp; Bone-Age Report. Whenever you wish to log monthly 30-day height velocity (in/yr &amp; cm/yr) across six consecutive months, you can step up to the <a href="' + POLAR_PASS_URL + '" data-kfg-paid-plan="pass" onclick="event.preventDefault();window.startAtelierPolarCheckout(\'pass\');" style="color:#2F5241;font-weight:700;">6-Month Growth Velocity Pass ($19.99) -&gt;</a>.' +
          '</div>' +
        '</div>');

    container.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.85rem;margin-bottom:1.2rem;">' +
        '<div>' +
          '<span class="kfg-note-tag" style="margin-bottom:0.35rem;">Complete Growth &amp; Bone-Age Report</span>' +
          '<h2 class="kfg-serif-title" style="margin-bottom:0.25rem;">' + childTitle + '</h2>' +
          '<div style="font-size:0.88rem;color:#6B635B;">Current Height: ' + esc(formatHeight(aux.heightCm)) + ' \u00B7 US CDC ' + esc(aux.ordinalPercentile) + ' Percentile</div>' +
        '</div>' +
        '<div class="kfg-no-print" style="display:flex;gap:0.55rem;flex-wrap:wrap;">' +
          '<button type="button" id="btn-download-kfg-custom-pdf" class="kfg-btn-primary" style="width:auto;padding:0.55rem 1.05rem;min-height:42px;font-size:0.88rem;" onclick="window.downloadCustomAtelierPdf()">Download 4-Page Custom Child Report PDF -&gt;</button>' +
          '<button type="button" id="btn-download-kfg-guide-8p" class="kfg-btn-outline" style="display:inline-flex;align-items:center;padding:0.5rem 0.95rem;min-height:42px;font-size:0.86rem;border-color:#2F5241;color:#2F5241;font-weight:700;" onclick="window.downloadProtectedKfgGuidePdf()">Download 8-Page US CDC Growth Guide PDF &rarr;</button>' +
          '<button type="button" class="kfg-btn-outline" onclick="window.print()">Print View</button>' +
          '<button type="button" class="kfg-btn-outline" onclick="window.beginAtelier()">Edit Inputs</button>' +
        '</div>' +
      '</div>' +

      '<div id="kfg-dossier-sibling-bar" class="kfg-no-print" style="display:flex;flex-wrap:wrap;gap:0.45rem;margin-bottom:0.9rem;"></div>' +
      '<div class="kfg-dossier-section">' +
        '<span class="kfg-note-tag" style="margin-bottom:0.4rem;">Part 1 \u00B7 Adult Height Forecast Across Three Paths</span>' +
        '<div class="kfg-dossier-grid-3">' +
          '<div class="kfg-metric-tile">' +
            '<div class="kfg-metric-kicker">Current Routine Path</div>' +
            '<div class="kfg-metric-value">' + esc(formatHeight(aux.unmanagedCm)) + '</div>' +
            '<div class="kfg-metric-sub">If current bedtime &amp; posture continue</div>' +
          '</div>' +
          '<div class="kfg-metric-tile">' +
            '<div class="kfg-metric-kicker">Family Height Midpoint</div>' +
            '<div class="kfg-metric-value">' + esc(formatHeight(aux.mphCm)) + '</div>' +
            '<div class="kfg-metric-sub">Expected band: ' + esc(formatHeight(aux.krMinCm)) + ' to ' + esc(formatHeight(aux.krMaxCm)) + '</div>' +
          '</div>' +
          '<div class="kfg-metric-tile" style="border-color:#2F5241;background:#EEF3F0;">' +
            '<div class="kfg-metric-kicker" style="color:#2F5241;">Tended Evening Routine</div>' +
            '<div class="kfg-metric-value" style="color:#2F5241;">' + esc(formatHeight(aux.optimizedCm)) + '</div>' +
            '<div class="kfg-metric-sub" style="color:#2F5241;">Recoverable room: ' + esc(formatGain(aux.optimizedGainCm)) + '</div>' +
          '</div>' +
        '</div>' +
        baSectionHtml +
      '</div>' +

      '<div class="kfg-dossier-section">' +
        '<span class="kfg-note-tag" style="margin-bottom:0.4rem;">Part 2 \u00B7 Priority Evening Habits for the Next 90 Days</span>' +
        '<p style="margin:0 0 0.9rem;font-size:0.96rem;color:#231F1D;font-weight:500;">' + esc(aux.primaryBottleneckLine) + '</p>' +
        '<ul class="kfg-tier-list" style="margin-bottom:0;">' +
          '<li><strong>Deep Early-Night Sleep:</strong> Dim hallway and bedroom lights 40 minutes before a 9:30 PM lights-out target, keeping the last two hours before sleep free of sweet drinks or late snacks so deep nighttime growth pulses stay strong.</li>' +
          '<li><strong>Daily Bone-Building Meals:</strong> Aim for roughly <strong>' + aux.proteinG + ' g/day</strong> of whole-food protein alongside <strong>' + aux.calciumMg + ' mg/day</strong> of calcium and <strong>' + aux.vitDIu + ' IU/day</strong> of Vitamin D3 paired with regular family meals.</li>' +
          '<li><strong>Posture Unloading &amp; Active Play:</strong> Pair 15 minutes of afternoon jumping or court play with gentle doorway chest-openers after homework so seated spinal compression does not hide earned height.</li>' +
        '</ul>' +
      '</div>' +
      tier2Block +
      '<div class="kfg-dossier-section">' +
        '<span class="kfg-note-tag" style="margin-bottom:0.4rem;">Part 3 \u00B7 Pediatric Clinic Visit 1-Page Summary &amp; 3 Doctor Questions (Included on PDF Page 4)</span>' +
        '<ul class="kfg-tier-list" style="margin-bottom:0;">' +
          '<li><strong>Q1 (Annualized Velocity Channel):</strong> "Given our child\'s US CDC ' + esc(aux.ordinalPercentile) + ' percentile and mid-parental target (' + esc(formatHeight(aux.mphCm)) + '), is their 6-to-12 month annualized height velocity tracking steadily?"</li>' +
          '<li><strong>Q2 (Maturation &amp; Bone-Age Timing):</strong> "Does physical pubertal staging align with chronological age, or would a left-wrist bone-age X-ray help clarify remaining growth runway?"</li>' +
          '<li><strong>Q3 (Nutritional &amp; Sleep Screening):</strong> "Would checking serum 25-OH Vitamin D, ferritin, or zinc during routine labs help support linear bone mineralization?"</li>' +
        '</ul>' +
      '</div>' +
      '<div class="kfg-dossier-section kfg-no-print" style="background:#FAF7F2;border:1px solid #D8CFC2;border-radius:10px;padding:1rem;">' +
        '<div style="font-size:0.88rem;color:#4A433E;margin-bottom:0.5rem;"><strong>Permanent Cross-Device Restore &amp; Standard Digital Refund Policy:</strong> Your 4-page PDF (including the 30-Day Parent-Child Refrigerator Sticker Calendar) can be reopened anytime across devices. Need assistance or a eligible refund? <a href="mailto:care@kisfitglobal.com?subject=KFG%2014-Day%20Refund%20or%20Support" style="color:#2F5241;font-weight:700;text-decoration:underline;">1-Click Priority Support (care@kisfitglobal.com)</a>.</div>' +
        '<div id="kfg-dossier-satisfaction-mount"></div>' +
      '</div>';

    if (global.DreamCompanyCRM && typeof global.DreamCompanyCRM.mountSatisfactionBar === 'function') {
      var satEl = byId('kfg-dossier-satisfaction-mount');
      if (satEl) global.DreamCompanyCRM.mountSatisfactionBar(satEl, { div: 'KFG', context: 'unlocked_dossier', email: p.parentEmail });
    renderSiblingSwitcherBar('kfg-dossier-sibling-bar');
    }
  }

  function downloadProtectedKfgGuidePdf() {
    if (global.DreamCompanyCRM && typeof global.DreamCompanyCRM.openProtectedPdfDownload === 'function') {
      return global.DreamCompanyCRM.openProtectedPdfDownload('KFG', 'kfg_cdc_guide_8p', function () {
        openKfgMemberModal('restore');
      });
    }
    openKfgMemberModal('restore');
    return Promise.resolve({ ok: false });
  }

  function restoreAtelierInlineAccess(inputId, msgId) {
    var inp = byId(inputId || 'kfg-inline-restore-input');
    var msg = byId(msgId || 'kfg-inline-restore-msg');
    var val = String((inp && inp.value) || '').trim();
    var setMsg = function (txt, isErr) {
      if (!msg) return;
      msg.style.display = 'block';
      msg.style.color = isErr ? '#9A3412' : '#2F5241';
      msg.textContent = txt;
    };
    if (!val) {
      setMsg('Enter "email code" (e.g. parent@email.com KFG-T1-XXXX) or your checkout email to request a 6-digit verification code.', true);
      return Promise.resolve({ ok: false });
    }

    // Format 1: "email@domain.com CODE_OR_6DIGIT_OTP"
    var parts = val.split(/[\s,|]+/).filter(Boolean);
    var emailPart = parts.find(function (p) { return p.indexOf('@') !== -1; }) || '';
    var credPart = parts.find(function (p) { return p !== emailPart; }) || '';
    if (!emailPart && atelierState.profile && atelierState.profile.parentEmail) {
      emailPart = String(atelierState.profile.parentEmail).trim().toLowerCase();
      credPart = val;
    }

    // If only an email was entered, trigger 6-digit OTP email via server (NEVER unlock by email alone!)
    if (emailPart && !credPart) {
      if (global.DreamCompanyCRM && typeof global.DreamCompanyCRM.requestAuthOtp === 'function') {
        setMsg('Sending a 6-digit verification code to your checkout email...', false);
        return global.DreamCompanyCRM.requestAuthOtp({ div: 'KFG', email: emailPart }).then(function () {
          atelierState.profile.parentEmail = emailPart.toLowerCase();
          setMsg('If a paid Polar.sh order matches ' + emailPart + ', a 6-digit code was emailed (valid 10 min). Enter that 6-digit code now.', false);
          return { ok: true, mode: 'otp_sent' };
        });
      }
      setMsg('Please paste your Polar.sh receipt License Key (UUID) or access code from your receipt email.', true);
      return Promise.resolve({ ok: false });
    }

    // Server-side verification with email + (6-digit OTP or Access Code)
    if (emailPart && credPart && global.DreamCompanyCRM && typeof global.DreamCompanyCRM.verifyEntitlement === 'function') {
      var isOtp = /^\d{6}$/.test(credPart);
      var reqOpts = isOtp
        ? { div: 'KFG', email: emailPart, otp: credPart }
        : { div: 'KFG', email: emailPart, access_code: credPart };
      setMsg('Verifying Polar.sh entitlement with server...', false);
      return global.DreamCompanyCRM.verifyEntitlement(reqOpts).then(function (vres) {
        if (vres && vres.authorized) {
          activatePaidUnlock(vres.tier === 'tier2' ? 'pass' : 'single', emailPart, isOtp ? 'OTP-VERIFIED' : credPart);
          return { ok: true, mode: 'server_verified' };
        }
        setMsg('Verification failed. Double-check your email and code, or enter only your email to receive a fresh 6-digit OTP.', true);
        return { ok: false };
      });
    }

    // Fallback: Official Polar.sh License Key UUID live validation
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val) && typeof global.fetch === 'function') {
      setMsg('Verifying license key with Polar.sh...', false);
      return global.fetch('https://api.polar.sh/v1/customer-portal/license-keys/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: val })
      })
        .then(function (r) { return r && r.ok ? r.json() : null; })
        .then(function (data) {
          if (data && data.status === 'granted') {
            activatePaidUnlock('pass', '', val);
            return { ok: true, mode: 'polar_license' };
          }
          setMsg('We could not verify that license key. Please double-check your Polar.sh receipt email.', true);
          return { ok: false };
        })
        .catch(function () {
          setMsg('Unable to reach verification service right now. Please try again or contact care@kisfitglobal.com.', true);
          return { ok: false };
        });
    }
    setMsg('Enter your checkout email to get a 6-digit verification code, or paste "email access-code".', true);
    return Promise.resolve({ ok: false });
  }

  function openKfgMemberModal(tab) {
    var modal = byId('kfg-member-modal');
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    renderSiblingSwitcherBar('kfg-sibling-switcher-bar');
    var checkinBlock = byId('kfg-vip-monthly-checkin');
    if (tab === 'checkin' && checkinBlock && typeof checkinBlock.scrollIntoView === 'function') {
      setTimeout(function () { checkinBlock.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
    }
  }

  function closeKfgMemberModal() {
    var modal = byId('kfg-member-modal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function initBoutiqueAtelier() {
    loadProfileFromStorage();
    if (typeof document === 'undefined') return;

    // Bind live change listeners across Step 1..5 inputs
    var formEl = byId('kfg-atelier-step-form');
    if (formEl && !formEl._atelierBound) {
      formEl._atelierBound = true;
      formEl.addEventListener('change', refreshLiveStepPreviews);
      formEl.addEventListener('input', refreshLiveStepPreviews);
    }

    populateFormFromProfile();

    // Check Cross-Device Magic Restore (?magic_restore=...) or Polar.sh return — STRICT SERVER VERIFICATION REQUIRED!
    try {
      if (global.DreamCompanyCRM && typeof global.DreamCompanyCRM.decodeMagicRestoreParam === 'function' && global.location && global.location.search) {
        var magicObj = global.DreamCompanyCRM.decodeMagicRestoreParam(global.location.search);
        if (magicObj && typeof magicObj === 'object' && magicObj.email && magicObj.access_code && typeof global.DreamCompanyCRM.verifyEntitlement === 'function') {
          var mk;
          for (mk in magicObj) {
            if (Object.prototype.hasOwnProperty.call(atelierState.profile, mk) && magicObj[mk] !== undefined) {
              atelierState.profile[mk] = magicObj[mk];
            }
          }
          populateFormFromProfile();
          global.DreamCompanyCRM.verifyEntitlement({
            div: 'KFG',
            email: magicObj.email,
            access_code: magicObj.access_code,
            magic_restore: true
          }).then(function (vres) {
            if (vres && vres.authorized) {
              activatePaidUnlock(vres.tier === 'tier2' ? 'pass' : 'single', magicObj.email, magicObj.access_code);
            } else {
              openKfgMemberModal('restore');
            }
          });
        }
      }
      if (global.location && global.location.search) {
        var rawSearch = String(global.location.search || '');
        var low = rawSearch.toLowerCase();
        var isReturnSuccess =
          low.indexOf('checkout_success=1') !== -1 ||
          low.indexOf('payment=success') !== -1 ||
          low.indexOf('polar_success=1') !== -1 ||
          low.indexOf('checkout_id=') !== -1;

        if (isReturnSuccess) {
          var params = new URLSearchParams(rawSearch);
          var emailParam = params.get('customer_email') || params.get('email') || atelierState.profile.parentEmail || '';
          var orderParam = params.get('checkout_id') || params.get('order_id') || '';
          if (emailParam && orderParam && global.DreamCompanyCRM && typeof global.DreamCompanyCRM.verifyEntitlement === 'function') {
            global.DreamCompanyCRM.verifyEntitlement({ div: 'KFG', email: emailParam, access_code: orderParam }).then(function (vres) {
              if (vres && vres.authorized) {
                activatePaidUnlock(vres.tier === 'tier2' ? 'pass' : 'single', emailParam, orderParam);
              } else {
                openKfgMemberModal('restore');
              }
            });
          } else {
            openKfgMemberModal('restore');
          }
        }
      }
    } catch (_) {}

    if (isPaidUnlocked()) {
      showScreen(3);
      renderUnlockedDossier();
    } else {
      var wantsAutoStart = false;
      var wantsBoneAgeStep = false;
      try {
        var qs = (global.location && global.location.search) ? new URLSearchParams(global.location.search) : null;
        var hashVal = String((global.location && global.location.hash) || '').toLowerCase();
        if (qs) {
          var qSex = String(qs.get('gender') || qs.get('sex') || '').toLowerCase();
          if (qSex === 'boy' || qSex === 'girl') {
            atelierState.profile.gender = qSex;
          }
          var qAge = parseInt(qs.get('age'), 10);
          if (!isNaN(qAge) && qAge >= 3 && qAge <= 18) {
            atelierState.profile.birthYear = (new Date()).getFullYear() - qAge;
          }
          if (qs.get('autostart') === '1') wantsAutoStart = true;
        }
        if (hashVal === '#quiz-section' || hashVal === '#kfg-screen-1-steps') wantsAutoStart = true;
        if (hashVal === '#kfg-bone-age-interpreter') wantsBoneAgeStep = true;
      } catch (_) {}

      if (wantsBoneAgeStep) {
        populateFormFromProfile();
        showScreen(1);
        goToAtelierStep(4);
      } else if (wantsAutoStart) {
        beginAtelier();
      } else {
        showScreen(0);
      }
    }
  }

  function downloadCustomAtelierPdf() {
    var p = atelierState.profile;
    var aux = computeAtelierAuxology(p);
    var paidPlan = 'single';
    try {
      if (global.localStorage) {
        paidPlan = global.localStorage.getItem(PAID_PLAN_KEY) || global.localStorage.getItem('kfg_pending_tier_v1') || 'single';
      }
    } catch (_) {}
    var isPass = paidPlan === 'pass' || paidPlan === 'sixMonth';
    if (global.KfgPersonalizedPdf && typeof global.KfgPersonalizedPdf.downloadPersonalizedAtelierPdf === 'function') {
      return global.KfgPersonalizedPdf.downloadPersonalizedAtelierPdf(aux, p, isPass);
    }
    if (typeof global.print === 'function') global.print();
    return false;
  }

  var BoutiqueAtelier = {
    state: atelierState,
    ensurePolarLocaleUrl: ensurePolarLocaleUrl,
    calculateChronologicalAge: calculateChronologicalAge,
    calibrateAtelierBoneAgeLag: calibrateAtelierBoneAgeLag,
    computeAtelierAuxology: computeAtelierAuxology,
    setAtelierUnitSystem: setAtelierUnitSystem,
    beginAtelier: beginAtelier,
    goToAtelierStep: goToAtelierStep,
    nextAtelierStep: nextAtelierStep,
    prevAtelierStep: prevAtelierStep,
    applyParentUsAverage: applyParentUsAverage,
    selectBoneAgeLagMonths: selectBoneAgeLagMonths,
    selectBoneAgeStageChip: selectBoneAgeStageChip,
    completeStepsAndEnterGate: completeStepsAndEnterGate,
    buildD30GoogleCalendarUrl: buildD30GoogleCalendarUrl,
    reopenAtelierEmailSaveForm: reopenAtelierEmailSaveForm,
    submitAtelierEmailGate: submitAtelierEmailGate,
    startAtelierPolarCheckout: startAtelierPolarCheckout,
    activatePaidUnlock: activatePaidUnlock,
    restoreAtelierInlineAccess: restoreAtelierInlineAccess,
    openKfgMemberModal: openKfgMemberModal,
    closeKfgMemberModal: closeKfgMemberModal,
    isPaidUnlocked: isPaidUnlocked,
    downloadCustomAtelierPdf: downloadCustomAtelierPdf,
    initBoutiqueAtelier: initBoutiqueAtelier
  };

  global.KfgBoutiqueAtelier = BoutiqueAtelier;
  global.downloadCustomAtelierPdf = downloadCustomAtelierPdf;
  global.downloadProtectedKfgGuidePdf = downloadProtectedKfgGuidePdf;
  global.setAtelierUnitSystem = setAtelierUnitSystem;
  global.beginAtelier = beginAtelier;
  global.goToAtelierStep = goToAtelierStep;
  global.nextAtelierStep = nextAtelierStep;
  global.prevAtelierStep = prevAtelierStep;
  global.applyParentUsAverage = applyParentUsAverage;
  global.selectBoneAgeLagMonths = selectBoneAgeLagMonths;
  global.selectBoneAgeStageChip = selectBoneAgeStageChip;
  global.submitAtelierEmailGate = submitAtelierEmailGate;
  global.reopenAtelierEmailSaveForm = reopenAtelierEmailSaveForm;
  global.buildD30GoogleCalendarUrl = buildD30GoogleCalendarUrl;
  global.startAtelierPolarCheckout = startAtelierPolarCheckout;
  global.restoreAtelierInlineAccess = restoreAtelierInlineAccess;
  global.openKfgMemberModal = openKfgMemberModal;
  global.closeKfgMemberModal = closeKfgMemberModal;
  global.persistKfgSurveyProfileForCheckout = collectFormIntoProfile;
  global.switchKfgSibling = switchKfgSibling;
  global.addKfgSiblingProfile = addKfgSiblingProfile;
  global.downloadAtelierD30Ics = downloadAtelierD30Ics;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = BoutiqueAtelier;
  } else if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', initBoutiqueAtelier);
    } else {
      initBoutiqueAtelier();
    }
  }
})(typeof window !== 'undefined' ? window : global);
