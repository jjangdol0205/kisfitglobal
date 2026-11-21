(function(){
    if (typeof window === 'undefined') return;
    window.HQ_MAILING_CONFIG_PATH = window.HQ_MAILING_CONFIG_PATH || '/hq-mailing-endpoint.json';
    window.__kfgCopyArticleLink = function(btnEl) {
      var shareUrl = (window.location && window.location.href) ? window.location.href : 'https://kisfitglobal.com/qna/';
      if (navigator.share) {
        navigator.share({ title: document.title || 'KISFIT Parent Growth Essay', url: shareUrl }).catch(function(){});
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(function() {
          if (btnEl) {
            var orig = btnEl.textContent;
            btnEl.textContent = 'Link Copied';
            setTimeout(function() { btnEl.textContent = orig; }, 2000);
          }
        }).catch(function(){});
      }
    };
    window.__kfgSubmitParentSignup = function(ev, formEl, stageLabel) {
      if (ev && ev.preventDefault) ev.preventDefault();
      var input = formEl ? formEl.querySelector('input[type="email"]') : null;
      var email = input ? String(input.value || '').trim().toLowerCase() : '';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        if (input) input.focus();
        return false;
      }
      var kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
      var ns = 'kfg_kisfitglobal';
      var sl = String(stageLabel || 'substack_essay_reader');
      var seg = 'substack_essay_reader';
      try {
        localStorage.setItem('kfg_parent_member_email', email);
        localStorage.setItem('kfg_parent_member_stage', sl);
        localStorage.setItem('kfg_parent_member_since', kst);
      } catch (_e) {}
      if (window.DreamCompanyCRM && typeof window.DreamCompanyCRM.registerMember === 'function') {
        try {
          window.DreamCompanyCRM.registerMember({
            div: 'KFG',
            email: email,
            segment: seg,
            lang: 'en-US',
            notes: 'site=kisfitglobal.com | source=substack_essay_reader | stage=' + sl
          });
        } catch (_crmErr) {}
      }
      if (typeof window.recordKfgSignupBeacons === 'function') {
        window.recordKfgSignupBeacons({});
      } else if (typeof window.fetch === 'function') {
        (function(){return Promise.resolve();})('https://abacus.disabled/hit/' + ns + '/signup', { mode: 'cors', keepalive: true }).catch(function(){});
        (function(){return Promise.resolve();})('https://abacus.disabled/hit/' + ns + '/signup_total', { mode: 'cors', keepalive: true }).catch(function(){});
      }
      document.querySelectorAll('.kfg-parent-signup-status').forEach(function(el) {
        el.style.display = 'block';
        el.innerHTML = 'Subscribed. Your next parent growth note and free US CDC bedtime &amp; bone-mineral checklist will arrive at <strong>' + email.replace(/[<>&"]/g, '') + '</strong> (no password required).';
      });
      document.querySelectorAll('.kfg-parent-signup-form input[type="email"]').forEach(function(inp) { inp.value = email; });
      return false;
    };
    document.addEventListener('DOMContentLoaded', function() {
      try {
        var saved = localStorage.getItem('kfg_parent_member_email');
        if (saved) {
          document.querySelectorAll('.kfg-parent-signup-form input[type="email"]').forEach(function(inp) { inp.value = saved; });
        }
      } catch (_e2) {}
    });
  })();
