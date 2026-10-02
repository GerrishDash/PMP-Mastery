/* ============================================
   PMP EXAM MASTERY — Display preferences
   Theme (calm dark / paper light) and text size.
   Loaded in <head> so the theme applies before first paint.
   ============================================ */
(function () {
  'use strict';
  const KEY = 'pmp_ui_prefs_v1';
  const SCALES = { sm: 0.92, md: 1, lg: 1.1, xl: 1.2 };
  const root = document.documentElement;
  const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { /* storage blocked */ } }

  const prefs = load();
  const theme = () => prefs.theme || (media && media.matches ? 'light' : 'dark');

  function apply() {
    root.setAttribute('data-theme', theme());
    root.style.setProperty('--text-scale', SCALES[prefs.size] || 1);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme() === 'light' ? '#f6f4ef' : '#10151d');
    document.querySelectorAll('[data-theme-set]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.themeSet === theme())));
    document.querySelectorAll('[data-size-set]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.sizeSet === (prefs.size || 'md'))));
  }

  apply();
  if (media && media.addEventListener) media.addEventListener('change', () => { if (!prefs.theme) apply(); });

  document.addEventListener('DOMContentLoaded', () => {
    apply();
    document.addEventListener('click', e => {
      const t = e.target.closest('[data-theme-set],[data-size-set]');
      if (!t) return;
      if (t.dataset.themeSet) prefs.theme = t.dataset.themeSet;
      if (t.dataset.sizeSet) prefs.size = t.dataset.sizeSet;
      save(prefs); apply();
    });
  });
})();
