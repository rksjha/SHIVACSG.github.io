/* ============================================================
   SCG Form Data Collector
   Captures all form submissions locally (localStorage) and
   optionally syncs to Google Sheets via Apps Script webhook.
   Works on static GitHub Pages — no backend server needed.
   ============================================================

   SETUP (one-time, 5 minutes):
   1. Open Google Sheets → create a new sheet called "SCG Form Submissions"
   2. Extensions → Apps Script → paste the server-side script from
      https://github.com/rksjha/SHIVACSG/blob/main/scripts/google-sheets-collector.gs
   3. Deploy as Web App (Execute as: Me, Who can access: Anyone)
   4. Copy the Deployment URL and set SCG_SHEETS_URL below.
   ============================================================ */

(function () {
  'use strict';

  // ── CONFIG ──────────────────────────────────────────────────
  var STORAGE_KEY  = 'scg_form_submissions';
  var SCG_SHEETS_URL = ''; // Paste your Google Apps Script deployment URL here
  var SOURCE_SITE  = window.location.hostname + window.location.pathname;
  // ─────────────────────────────────────────────────────────────

  /* ── Save a submission to localStorage ── */
  function saveLocally(data) {
    try {
      var all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      data._id        = Date.now() + '-' + Math.random().toString(36).slice(2, 7);
      data._source    = SOURCE_SITE;
      data._timestamp = new Date().toISOString();
      all.push(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      return data._id;
    } catch (e) { return null; }
  }

  /* ── Send to Google Sheets (if URL configured) ── */
  function syncToSheets(data) {
    if (!SCG_SHEETS_URL) return;
    try {
      fetch(SCG_SHEETS_URL, {
        method: 'POST',
        mode:   'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data)
      });
    } catch (e) { /* silent fail — data is still in localStorage */ }
  }

  /* ── Public API ── */
  window.SCGCollector = {

    /** Call this on every form submission with a plain object of field values */
    submit: function (formName, fields) {
      var data = Object.assign({ _form: formName }, fields);
      var id   = saveLocally(data);
      syncToSheets(data);
      return id;
    },

    /** Get all saved submissions (returns array) */
    getAll: function () {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
      catch (e) { return []; }
    },

    /** Export all submissions to a downloadable CSV file */
    exportCSV: function () {
      var rows = this.getAll();
      if (!rows.length) { alert('No form submissions saved yet.'); return; }

      // Collect all keys across all rows
      var keys = [];
      rows.forEach(function (r) {
        Object.keys(r).forEach(function (k) {
          if (!keys.includes(k)) keys.push(k);
        });
      });

      var csv  = keys.map(function (k) { return '"' + k + '"'; }).join(',') + '\n';
      rows.forEach(function (r) {
        csv += keys.map(function (k) {
          var v = r[k] != null ? String(r[k]) : '';
          return '"' + v.replace(/"/g, '""') + '"';
        }).join(',') + '\n';
      });

      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      var url  = URL.createObjectURL(blob);
      var a    = document.createElement('a');
      a.href   = url;
      a.download = 'SCG_Form_Submissions_' + new Date().toISOString().slice(0, 10) + '.csv';
      a.click();
      URL.revokeObjectURL(url);
    },

    /** Clear all saved submissions (use carefully) */
    clearAll: function () {
      if (confirm('Delete ALL saved form submissions from this browser? This cannot be undone.')) {
        localStorage.removeItem(STORAGE_KEY);
        console.log('[SCGCollector] All submissions cleared.');
      }
    }
  };

  /* ── Auto-intercept forms tagged with data-scg-collect ── */
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('form[data-scg-collect]').forEach(function (form) {
      form.addEventListener('submit', function () {
        var fields = {};
        new FormData(form).forEach(function (v, k) { fields[k] = v; });
        window.SCGCollector.submit(
          form.dataset.scgCollect || form.id || 'unknown-form',
          fields
        );
      });
    });
  });

})();
