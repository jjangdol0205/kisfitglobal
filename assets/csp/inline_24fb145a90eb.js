window.HQ_MAILING_CONFIG_PATH = '/hq-mailing-endpoint.json';
  window.PAYMENT_CONFIG = Object.assign({
    PROVIDER: 'polar_sh',
    DIVISION: 'KFG',
    STORE_SLOT: 'PEDIATRIC_STORE_SLOT',
    STORE_LIVE_READY: true,
    POLAR_CHECKOUT_URLS: {
      single_899: 'https://buy.polar.sh/polar_cl_v2pLSQbvj13RJxb57w8fqVjZ4h2C7YopmPUDr3vxfG6?locale=en',
      pass_1999: 'https://buy.polar.sh/polar_cl_p8DAvlbz7wPj6SOPKhHjT5aaNyA2F3I528A3c15nBND?locale=en'
    },
    POLAR_KFG_SINGLE_URL: 'https://buy.polar.sh/polar_cl_v2pLSQbvj13RJxb57w8fqVjZ4h2C7YopmPUDr3vxfG6?locale=en',
    POLAR_KFG_PASS_URL: 'https://buy.polar.sh/polar_cl_p8DAvlbz7wPj6SOPKhHjT5aaNyA2F3I528A3c15nBND?locale=en',
    SUPPORT_EMAIL: 'care@kisfitglobal.com'
  }, window.PAYMENT_CONFIG || {});
  /* === HQ Edge Real-Human Visitor & Affiliate Beacon (kfg_kisfitglobal) === */
  (function(){
    try {
      if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
      if (window.__HQ_BEACON_SENT_kfg_kisfitglobal__) return;
      window.__HQ_BEACON_SENT_kfg_kisfitglobal__ = true;
      window.__HQ_KPI_KFG__ = true;
      var ua = navigator.userAgent || '';
      if (navigator.webdriver || /bot|crawl|spider|slurp|headless|lighthouse|gtmetrix|pingdom|uptimerobot|python|curl|node|axios/i.test(ua)) return;
      var host = (location && location.hostname) || '';
      if (!host || host === 'localhost' || host === '127.0.0.1') return;
      var kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
      var ns = 'kfg_kisfitglobal';
      (function(){return Promise.resolve();})('https://abacus.disabled/hit/' + ns + '/pv_' + kst, { mode: 'cors', keepalive: true }).catch(function(){});
      (function(){return Promise.resolve();})('https://abacus.disabled/hit/' + ns + '/pv_total', { mode: 'cors', keepalive: true }).catch(function(){});
      if (localStorage.getItem('hq_uv_' + ns + '_' + kst) !== '1') {
        localStorage.setItem('hq_uv_' + ns + '_' + kst, '1');
        (function(){return Promise.resolve();})('https://abacus.disabled/hit/' + ns + '/uv_' + kst, { mode: 'cors', keepalive: true }).catch(function(){});
      }
      if (localStorage.getItem('hq_uv_ever_' + ns) !== '1') {
        localStorage.setItem('hq_uv_ever_' + ns, '1');
        (function(){return Promise.resolve();})('https://abacus.disabled/hit/' + ns + '/uv_total', { mode: 'cors', keepalive: true }).catch(function(){});
      }
      document.addEventListener('click', function(e) {
        var el = e.target && e.target.closest ? e.target.closest('a') : null;
        if (!el) return;
        var href = (el.getAttribute('href') || '').toLowerCase();
        if (false) {
          (function(){return Promise.resolve();})('https://abacus.disabled/hit/' + ns + '/ref_click_' + kst, { mode: 'cors', keepalive: true }).catch(function(){});
          (function(){return Promise.resolve();})('https://abacus.disabled/hit/' + ns + '/ref_click_total', { mode: 'cors', keepalive: true }).catch(function(){});
        }
      }, true);
    } catch (e) {}
  })();
