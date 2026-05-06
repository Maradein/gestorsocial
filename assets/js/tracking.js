(function () {
  var TOOL_MAP = {
    'f.mtr.cool': 'metricool',
    'metricool.com': 'metricool',
    'buffer.com': 'buffer',
    'later.com': 'later',
    'publer.io': 'publer',
    'hootsuite.com': 'hootsuite',
  };

  function toolFromUrl(href) {
    try {
      var host = new URL(href).hostname.replace('www.', '');
      for (var key in TOOL_MAP) {
        if (host === key || host.endsWith('.' + key)) return TOOL_MAP[key];
      }
    } catch (e) {}
    return 'unknown';
  }

  function isAffiliate(el) {
    var rel = (el.getAttribute('rel') || '').split(/\s+/);
    return rel.indexOf('sponsored') !== -1;
  }

  function isExternal(href) {
    try {
      return new URL(href).origin !== window.location.origin;
    } catch (e) {
      return false;
    }
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('a[href]');
    if (!el) return;
    var href = el.getAttribute('href');
    if (!isExternal(href)) return;

    var tool = toolFromUrl(href);
    var eventName = isAffiliate(el) ? 'affiliate_click' : 'outbound_click';

    if (typeof gtag === 'function') {
      gtag('event', eventName, {
        tool_name: tool,
        destination_url: href,
        link_text: (el.textContent || '').trim().slice(0, 100),
        page_location: window.location.pathname,
      });
    }
  });
})();
