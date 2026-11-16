/**
 * src/js/parent-growth-club.js
 * KISFIT Parent Growth Club — Monthly Milestone Stamp & D-30 Reminder
 *
 * Includes Social In-App WebView (`Instagram|FBAN|FBAV|KAKAOTALK`) branching:
 * NEVER triggers `.ics` file download inside Instagram/FB/Kakao WebViews;
 * instead opens an instant in-page schedule modal + 1-click email reminder signup.
 * 100% English (Zero-Hangul).
 */
(function () {
  'use strict';

  var CLUB_KEY = 'kfg_growth_club_v1';
  var MILESTONE_KEY = 'kfg_growth_milestones_v1';

  var DAILY_PARTNER_NOTES = [
    'Welcome back, Growth Partner — steady 9 PM deep sleep and daily D3 + Calcium build healthy inches quietly month by month.',
    'Good to see you, Growth Partner — children grow most during calm, screen-free nights; tonight\'s bedtime routine is a gift to their future height.',
    'Hello, Growth Partner — skip daily scale stress; steady 30-day and 90-day US CDC velocity is what truly counts.',
    'You\'re doing great, Growth Partner — 10 minutes of joyful backyard jumping plus protein at dinner gently wakes up growing bone plates.',
    'Welcome home, Growth Partner — tall posture and unhurried morning stretches help every millimeter of natural growth shine through.',
    'Steady wins, Growth Partner — pairing morning sunlight, balanced protein, and a 9 PM lights-out protects peak nighttime growth hormone.',
    'Cheering you on, Growth Partner — measuring barefoot once a month against a flat wall turns guesswork into calm, confident parenting.'
  ];

  function isSocialInAppWebView() {
    if (typeof window !== 'undefined' && window.__KFG_FORCE_INAPP_WEBVIEW === true) return true;
    var ua = (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent : '';
    return /Instagram|FBAN|FBAV|KAKAOTALK/i.test(ua);
  }

  function getLocalIsoDate(dateObj) {
    var d = dateObj || new Date();
    var yr = d.getFullYear();
    var mo = String(d.getMonth() + 1).padStart(2, '0');
    var da = String(d.getDate()).padStart(2, '0');
    return yr + '-' + mo + '-' + da;
  }

  function addDays(isoStr, days) {
    var parts = String(isoStr || '').split('-');
    var base = parts.length === 3
      ? new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 12, 0, 0)
      : new Date();
    base.setDate(base.getDate() + Number(days || 0));
    return getLocalIsoDate(base);
  }

  function diffDays(fromIso, toIso) {
    var a = String(fromIso || '').split('-');
    var b = String(toIso || '').split('-');
    if (a.length !== 3 || b.length !== 3) return 0;
    var d1 = Date.UTC(Number(a[0]), Number(a[1]) - 1, Number(a[2]));
    var d2 = Date.UTC(Number(b[0]), Number(b[1]) - 1, Number(b[2]));
    return Math.round((d2 - d1) / 86400000);
  }

  function formatReadableDate(isoStr) {
    var p = String(isoStr || '').split('-');
    if (p.length !== 3) return isoStr || '';
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var mIdx = Math.max(0, Math.min(11, Number(p[1]) - 1));
    return months[mIdx] + ' ' + Number(p[2]) + ', ' + p[0];
  }

  function pickDailyNote(isoStr) {
    var seed = 0;
    var s = String(isoStr || '');
    for (var i = 0; i < s.length; i++) {
      seed = ((seed * 31) + s.charCodeAt(i)) >>> 0;
    }
    return DAILY_PARTNER_NOTES[seed % DAILY_PARTNER_NOTES.length];
  }

  function readJson(key, fallback) {
    try {
      var raw = window.localStorage ? window.localStorage.getItem(key) : null;
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : fallback;
    } catch (_e) {
      return fallback;
    }
  }

  function writeJson(key, val) {
    try {
      if (window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(val));
      }
    } catch (_e) {}
  }

  function captureChildSnapshot() {
    var ageStr = '';
    var heightStr = '';
    try {
      var ageEl = document.getElementById('kfg-qs-age') || document.getElementById('child-age-years');
      if (ageEl && ageEl.value) {
        ageStr = 'Age ' + String(ageEl.value).trim() + ' yrs';
      }
      var isMetric = false;
      var metWrap = document.getElementById('kfg-qs-metric-wrap');
      if (metWrap && metWrap.style && metWrap.style.display !== 'none') {
        isMetric = true;
      }
      var cmEl = document.getElementById('kfg-qs-cm');
      var ftEl = document.getElementById('kfg-qs-ft');
      var inEl = document.getElementById('kfg-qs-in');
      if (!isMetric && ftEl && inEl && ftEl.value !== '') {
        var ft = Number(ftEl.value) || 4;
        var inch = Number(inEl.value) || 0;
        var approxCm = Math.round(((ft * 12) + inch) * 2.54);
        heightStr = ft + ' ft ' + inch + ' in (' + approxCm + ' cm)';
      } else if (cmEl && cmEl.value) {
        var cm = Number(cmEl.value) || 133;
        var totIn = Math.round(cm / 2.54);
        heightStr = Math.floor(totIn / 12) + ' ft ' + (totIn % 12) + ' in (' + cm + ' cm)';
      }
      if (!ageStr) {
        var saved = readJson('kfg_saved_profiles', []);
        if (Array.isArray(saved) && saved[0] && saved[0].age) {
          ageStr = 'Age ' + saved[0].age + ' yrs';
        }
      }
    } catch (_e) {}
    if (ageStr && heightStr) return ageStr + ' · ' + heightStr;
    return ageStr || heightStr || 'US CDC Baseline Tracked';
  }

  function getInitialClubState() {
    return readJson(CLUB_KEY, {
      streakDays: 0,
      lastCheckInDate: '',
      totalCheckIns: 0,
      partnerSince: ''
    });
  }

  function getInitialMilestoneState() {
    return readJson(MILESTONE_KEY, {
      stamps: { s1: '', s2: '', s3: '', s4: '' },
      baselineDate: '',
      lastCheckInDate: '',
      nextRecheckDate: '',
      latestSnapshot: '',
      history: []
    });
  }

  function renderParentGrowthClub() {
    var root = document.getElementById('kfg-parent-growth-club');
    if (!root) return;

    var todayIso = getLocalIsoDate();
    var noteEl = document.getElementById('kfg-club-daily-greeting');
    if (noteEl) {
      noteEl.textContent = '💚 "' + pickDailyNote(todayIso) + '"';
    }

    var club = getInitialClubState();
    var ms = getInitialMilestoneState();
    var stamps = (ms && ms.stamps) ? ms.stamps : { s1: '', s2: '', s3: '', s4: '' };

    var displayDay = club.streakDays > 0 ? club.streakDays : 1;
    var badgeEl = document.getElementById('kfg-club-streak-badge');
    if (badgeEl) {
      badgeEl.textContent = '🏅 Growth Club Partner · Day ' + displayDay + ' Check-in';
    }

    var stampedCount = 0;
    var stampConfigs = [
      { key: 's1', cardId: 'kfg-ms-card-1', sealId: 'kfg-ms-seal-1', metaId: 'kfg-ms-meta-1', idleText: 'Tap check-in below to log Day 1' },
      { key: 's2', cardId: 'kfg-ms-card-2', sealId: 'kfg-ms-seal-2', metaId: 'kfg-ms-meta-2', idleText: 'Bedtime + daily D3 & Ca check' },
      { key: 's3', cardId: 'kfg-ms-card-3', sealId: 'kfg-ms-seal-3', metaId: 'kfg-ms-meta-3', idleText: 'Unlocks at 30-day height check' },
      { key: 's4', cardId: 'kfg-ms-card-4', sealId: 'kfg-ms-seal-4', metaId: 'kfg-ms-meta-4', idleText: 'Quarterly US CDC velocity' }
    ];

    for (var i = 0; i < stampConfigs.length; i++) {
      var cfg = stampConfigs[i];
      var stampedDate = stamps[cfg.key] || '';
      var card = document.getElementById(cfg.cardId);
      var seal = document.getElementById(cfg.sealId);
      var meta = document.getElementById(cfg.metaId);
      if (stampedDate) {
        stampedCount++;
        if (card) card.classList.add('is-stamped');
        if (seal) seal.textContent = '✓ Stamped';
        if (meta) meta.textContent = 'Logged ' + formatReadableDate(stampedDate);
      } else {
        if (card) card.classList.remove('is-stamped');
        if (seal) seal.textContent = 'Pending';
        if (meta) meta.textContent = cfg.idleText;
      }
    }

    var progEl = document.getElementById('kfg-club-progress-pill');
    if (progEl) {
      progEl.textContent = stampedCount + '/4 Milestones Stamped';
    }

    var btnStamp = document.getElementById('btn-kfg-stamp-checkin');
    var checkedToday = (club.lastCheckInDate === todayIso);
    if (btnStamp) {
      if (checkedToday) {
        btnStamp.classList.add('is-checked-today');
        btnStamp.textContent = '✅ Today\'s Growth & Habit Stamped (Day ' + displayDay + ')';
      } else {
        btnStamp.classList.remove('is-checked-today');
        btnStamp.textContent = '🌱 Stamp Today\'s Growth & Habit Check-in';
      }
    }

    var btnIcs = document.getElementById('btn-kfg-ics-download');
    if (btnIcs && isSocialInAppWebView()) {
      btnIcs.textContent = '📧 Email Me My Growth Reminder Schedule Now';
    }

    var targetDate = ms.nextRecheckDate || addDays(todayIso, 30);
    var remainDays = Math.max(0, diffDays(todayIso, targetDate));
    if (!ms.nextRecheckDate) remainDays = 30;

    var recheckEl = document.getElementById('kfg-club-next-recheck');
    if (recheckEl) {
      recheckEl.textContent = '⏰ Next Growth Re-check: D-' + remainDays + ' (' + formatReadableDate(targetDate) + ')';
    }

    var histEl = document.getElementById('kfg-club-history-summary');
    if (histEl) {
      if (ms.lastCheckInDate) {
        var snapInfo = ms.latestSnapshot ? ' · ' + ms.latestSnapshot : '';
        histEl.textContent = 'Last Check-in: ' + formatReadableDate(ms.lastCheckInDate) + snapInfo;
      } else {
        histEl.textContent = 'Last Check-in: Ready to log your child\'s baseline today';
      }
    }
  }

  window.stampKfgGrowthClubToday = function () {
    var todayIso = getLocalIsoDate();
    var club = getInitialClubState();
    var ms = getInitialMilestoneState();
    if (!ms.stamps) ms.stamps = { s1: '', s2: '', s3: '', s4: '' };
    if (!Array.isArray(ms.history)) ms.history = [];

    if (club.lastCheckInDate !== todayIso) {
      club.streakDays = Math.max(1, (Number(club.streakDays) || 0) + 1);
      club.totalCheckIns = (Number(club.totalCheckIns) || 0) + 1;
      club.lastCheckInDate = todayIso;
      if (!club.partnerSince) club.partnerSince = todayIso;
    } else if (!club.streakDays) {
      club.streakDays = 1;
    }

    if (!ms.baselineDate) {
      ms.baselineDate = todayIso;
    }
    if (!ms.stamps.s1) ms.stamps.s1 = todayIso;
    if (!ms.stamps.s2) ms.stamps.s2 = todayIso;

    var daysSinceBaseline = diffDays(ms.baselineDate, todayIso);
    if (daysSinceBaseline >= 25 || club.totalCheckIns >= 2) {
      if (!ms.stamps.s3) ms.stamps.s3 = todayIso;
    }
    if (daysSinceBaseline >= 80 || club.totalCheckIns >= 4) {
      if (!ms.stamps.s4) ms.stamps.s4 = todayIso;
    }

    var snapshot = captureChildSnapshot();
    ms.lastCheckInDate = todayIso;
    ms.nextRecheckDate = addDays(todayIso, 30);
    ms.latestSnapshot = snapshot;

    if (!ms.history.length || ms.history[0].date !== todayIso) {
      ms.history.unshift({
        date: todayIso,
        snapshot: snapshot
      });
      ms.history = ms.history.slice(0, 24);
    } else {
      ms.history[0].snapshot = snapshot;
    }

    writeJson(CLUB_KEY, club);
    writeJson(MILESTONE_KEY, ms);
    renderParentGrowthClub();

    try {
      if (typeof window.fetch === 'function') {
        window.fetch('https://abacus.jasoncameron.dev/hit/kfg_kisfitglobal/milestone_stamp_' + todayIso, {
          mode: 'cors',
          keepalive: true
        })
          .then(function (r) { return r && r.ok ? r.json() : null; })
          .then(function (data) {
            if (data && typeof data.value === 'number') {
              var liveEl = document.getElementById('kfg-club-live-counter');
              if (liveEl) {
                liveEl.style.display = 'inline';
                liveEl.textContent = ' · ' + Math.max(1, data.value).toLocaleString('en-US') + ' US parent check-ins today';
              }
            }
          })
          .catch(function () {});
      }
    } catch (_e) {}
  };

  function closeKfgInAppScheduleModal() {
    var m = document.getElementById('kfg-inapp-schedule-modal');
    if (m) m.remove();
  }

  function submitKfgInAppScheduleEmail(ev, targetDateStr) {
    if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();
    var inp = document.getElementById('kfg-inapp-schedule-email');
    var st = document.getElementById('kfg-inapp-schedule-status');
    var btn = document.getElementById('btn-kfg-inapp-schedule-submit');
    var email = inp ? String(inp.value || '').trim().toLowerCase() : '';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      if (st) {
        st.style.display = 'block';
        st.style.color = '#DC2626';
        st.textContent = 'Please enter a valid parent email address.';
      }
      if (inp) inp.focus();
      return false;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending Growth Reminder Schedule...';
    }

    if (typeof window.recordKfgSignupBeacons === 'function') {
      window.recordKfgSignupBeacons({});
    } else if (typeof window.fetch === 'function') {
      window.fetch('https://abacus.jasoncameron.dev/hit/kfg_kisfitglobal/signup', { mode: 'cors', keepalive: true }).catch(function () {});
      window.fetch('https://abacus.jasoncameron.dev/hit/kfg_kisfitglobal/signup_total', { mode: 'cors', keepalive: true }).catch(function () {});
    }

    var done = function () {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Schedule Sent! Club Access Active';
      }
      try { localStorage.setItem('kfg_parent_member_email', email); } catch (_) {}
      if (st) {
        st.style.display = 'block';
        st.style.color = '#065F46';
        st.innerHTML = '<strong>Sent!</strong> Your Day-30 Growth Reminder Schedule (' + String(targetDateStr || '').replace(/[<>&"]/g, '') + ') &amp; Instant Club Access are active for <strong>' + email.replace(/[<>&"]/g, '') + '</strong>.';
      }
    };

    if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.registerMember === 'function') {
      window.DreamCompanyCRM.registerMember({
        div: 'KFG',
        email: email,
        segment: window.__kfgSelectedClubSegment || 'ages_8_11_golden_window',
        lang: 'en-US',
        notes: 'site=kisfitglobal.com | source=inapp_webview_d30_schedule | next=' + (targetDateStr || '')
      }).then(done).catch(done);
    } else {
      done();
    }
    return false;
  }

  function openKfgInAppScheduleModal(targetIso, snapshotStr) {
    if (typeof document === 'undefined' || !document.body) return;
    closeKfgInAppScheduleModal();
    var readableDate = formatReadableDate(targetIso);
    var savedEmail = '';
    try {
      savedEmail = String(localStorage.getItem('kfg_parent_member_email') || '').trim();
    } catch (_) {}

    var modal = document.createElement('div');
    modal.id = 'kfg-inapp-schedule-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.style.cssText = 'position:fixed;inset:0;z-index:100025;background:rgba(15,23,42,0.75);display:flex;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(4px);';
    modal.onclick = function (e) { if (e.target === modal) closeKfgInAppScheduleModal(); };

    modal.innerHTML =
      '<div style="background:#FFFFFF;border:2px solid #059669;border-radius:20px;max-width:460px;width:100%;padding:1.35rem 1.25rem;box-shadow:0 24px 55px rgba(15,23,42,0.35);color:#0F172A;text-align:left;font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:0.65rem;margin-bottom:0.75rem;">' +
          '<div>' +
            '<span style="display:inline-block;background:#ECFDF5;color:#047857;border:1px solid #A7F3D0;font-size:0.72rem;font-weight:900;padding:0.18rem 0.6rem;border-radius:9999px;margin-bottom:0.3rem;">30-DAY GROWTH REMINDER SCHEDULE</span>' +
            '<h3 style="margin:0;font-size:1.06rem;font-weight:900;color:#0F172A;line-height:1.3;">Email Me My Growth Reminder Schedule Now (Instant Club Access)</h3>' +
          '</div>' +
          '<button type="button" onclick="window.closeKfgInAppScheduleModal()" aria-label="Close" style="background:#F1F5F9;border:1px solid #CBD5E1;border-radius:9999px;width:32px;height:32px;font-weight:900;cursor:pointer;">&#10005;</button>' +
        '</div>' +
        '<div style="background:#F8FAFC;border:1px solid #CBD5E1;border-radius:12px;padding:0.75rem 0.9rem;margin-bottom:0.85rem;font-size:0.83rem;color:#334155;line-height:1.55;">' +
          '<div><strong>Next 30-Day Wall Measurement Date:</strong> <span style="color:#047857;font-weight:900;">' + readableDate + ' (9:00 AM)</span></div>' +
          (snapshotStr ? '<div><strong>Current Logged Baseline:</strong> ' + snapshotStr.replace(/[<>&"]/g, '') + '</div>' : '') +
          '<div style="margin-top:0.35rem;">1) Measure barefoot against a flat wall within 30 mins of waking.<br>2) Protect pre-10 PM screen-free sleep &amp; daily Ca/D3/Protein.<br>3) Log next month\'s height to track annualized US CDC velocity.</div>' +
        '</div>' +
        '<form onsubmit="return window.submitKfgInAppScheduleEmail(event, \'' + readableDate.replace(/'/g, '') + '\');" style="display:flex;flex-direction:column;gap:0.55rem;">' +
          '<input type="email" id="kfg-inapp-schedule-email" required value="' + savedEmail.replace(/"/g, '&quot;') + '" placeholder="Enter parent email (e.g., mom@gmail.com)" style="width:100%;box-sizing:border-box;min-height:50px;padding:0.7rem 0.9rem;border:1.5px solid #6EE7B7;border-radius:12px;font-size:16px;color:#0F172A;">' +
          '<button type="submit" id="btn-kfg-inapp-schedule-submit" style="width:100%;min-height:52px;padding:0.8rem 1rem;border-radius:12px;border:none;background:linear-gradient(90deg,#059669 0%,#047857 100%);color:#FFFFFF;font-size:0.94rem;font-weight:900;cursor:pointer;">' +
            'Email Me My Growth Reminder Schedule Now (Instant Club Access) -&gt;' +
          '</button>' +
        '</form>' +
        '<div id="kfg-inapp-schedule-status" role="status" aria-live="polite" style="display:none;margin-top:0.65rem;font-size:0.82rem;font-weight:700;line-height:1.45;"></div>' +
      '</div>';

    document.body.appendChild(modal);
  }

  window.closeKfgInAppScheduleModal = closeKfgInAppScheduleModal;
  window.submitKfgInAppScheduleEmail = submitKfgInAppScheduleEmail;
  window.openKfgInAppScheduleModal = openKfgInAppScheduleModal;
  window.isKfgSocialInAppWebView = isSocialInAppWebView;

  window.downloadKfgD30CalendarIcs = function () {
    var todayIso = getLocalIsoDate();
    var ms = getInitialMilestoneState();
    var targetIso = (ms && ms.nextRecheckDate) ? ms.nextRecheckDate : addDays(todayIso, 30);

    // Social In-App WebView Guard: NEVER trigger .ics file download inside Instagram / Facebook / KakaoTalk
    if (isSocialInAppWebView()) {
      openKfgInAppScheduleModal(targetIso, (ms && ms.latestSnapshot) || '');
      var inAppFeedback = document.getElementById('kfg-club-ics-feedback');
      if (inAppFeedback) {
        inAppFeedback.style.display = 'block';
        inAppFeedback.textContent = '📧 In-app browser detected: Enter your email in the schedule window to receive your ' + formatReadableDate(targetIso) + ' growth reminder directly in your inbox.';
      }
      return false;
    }

    var p = targetIso.split('-');
    var y = p[0];
    var m = p[1];
    var d = p[2];

    var dtStamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    var dtStart = y + m + d + 'T090000';
    var dtEnd = y + m + d + 'T091500';
    var snapshotNote = (ms && ms.latestSnapshot) ? ('Last logged baseline: ' + ms.latestSnapshot + '\\n') : '';

    var icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//KISFIT Bio Labs//Parent Growth Club//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:kfg-d30-' + y + m + d + '@kisfitglobal.com',
      'DTSTAMP:' + dtStamp,
      'DTSTART:' + dtStart,
      'DTEND:' + dtEnd,
      'SUMMARY:KISFIT Monthly Child Height & Sleep Check-in — https://kisfitglobal.com',
      'DESCRIPTION:' + snapshotNote + '1) Measure barefoot morning height against a flat wall.\\n2) Review 9 PM deep-sleep & daily D3 + Calcium routine.\\n3) Stamp your Day-30 US CDC milestone at https://kisfitglobal.com',
      'URL:https://kisfitglobal.com',
      'LOCATION:https://kisfitglobal.com',
      'BEGIN:VALARM',
      'TRIGGER:-PT30M',
      'ACTION:DISPLAY',
      'DESCRIPTION:KISFIT Monthly Child Height & Sleep Check-in Reminder',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ];

    var blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'kisfit-d30-growth-check-' + targetIso + '.ics';
    document.body.appendChild(link);
    link.click();
    setTimeout(function () {
      try {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (_e) {}
    }, 250);

    var feedbackEl = document.getElementById('kfg-club-ics-feedback');
    if (feedbackEl) {
      feedbackEl.style.display = 'block';
      feedbackEl.textContent = '📅 Calendar event saved for ' + formatReadableDate(targetIso) + ' (9:00 AM local time). Open the .ics file to add to Apple, Google, or Outlook Calendar.';
    }
    return true;
  };

  window.triggerKfgVelocityEdgeCheckout = function (plan) {
    var mode = (plan === 'pass' || plan === 'sixMonth') ? 'pass' : 'single';
    if (typeof window.recordKfgPaidClickOnce === 'function') {
      window.recordKfgPaidClickOnce(mode);
    }
    if (typeof window.resolveKfgLiveCheckoutState === 'function') {
      var st = window.resolveKfgLiveCheckoutState(mode);
      if (!st.isLive) {
        if (typeof window.openKfgVipWaitlistModal === 'function') {
          window.openKfgVipWaitlistModal(mode);
        }
        return;
      }
      if (st.isLive && st.url) {
        if (typeof window.navigateToKfgPolarCheckout === 'function') {
          window.navigateToKfgPolarCheckout(st.url, mode);
        } else if (window.location) {
          window.location.href = st.url;
        }
        return;
      }
    }
    if (typeof window.launchPolarCheckout === 'function') {
      window.launchPolarCheckout(mode);
      return;
    }
    if (typeof window.openKfgVipWaitlistModal === 'function') {
      window.openKfgVipWaitlistModal(mode);
      return;
    }
    if (typeof window.openKidsFitGlobalCheckoutModal === 'function') {
      window.openKidsFitGlobalCheckoutModal(mode);
    }
  };

  function syncResultsVelocityEdgeBridge() {
    var ctxEl = document.getElementById('kfg-results-edge-child-context');
    if (!ctxEl) return;
    var snap = captureChildSnapshot();
    if (snap) {
      ctxEl.textContent = 'Current Baseline: ' + snap + ' · US CDC LMS & Khamis-Roche Velocity Window Active';
    }
  }

  function initClubAndVelocityEdge() {
    renderParentGrowthClub();
    syncResultsVelocityEdgeBridge();
    var resDash = document.getElementById('results-dashboard');
    if (resDash && typeof MutationObserver === 'function') {
      var obs = new MutationObserver(function () {
        if (!resDash.classList.contains('hidden') && resDash.style.display !== 'none') {
          syncResultsVelocityEdgeBridge();
        }
      });
      obs.observe(resDash, { attributes: true, attributeFilter: ['class', 'style'] });
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initClubAndVelocityEdge);
    } else {
      initClubAndVelocityEdge();
    }
  }
})();
