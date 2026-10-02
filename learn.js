/* ============================================
   PMP EXAM MASTERY — Learning Lab
   Guided lessons with diagrams, interactive tools and knowledge checks.
   Self-contained: renders into #learnRoot inside #section-learn.
   ============================================ */

(function () {
  'use strict';

  // ── Progress storage (per-device convenience) ──
  const LS_KEY = 'pmp_learning_lab_v1';
  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveProgress() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(progress)); } catch (e) { /* storage blocked */ }
  }
  const progress = loadProgress();
  progress.modules = progress.modules || {};

  // ── HTML helpers ──
  const block = (id, title, html) => `<div class="ll-block" id="ll-${id}" data-toc="${title.replace(/"/g, '&quot;')}"><h3>${title}</h3>${html}</div>`;
  const callout = (type, label, html) => `<div class="ll-callout ${type}"><b>${label}</b>${html}</div>`;
  const exam = html => callout('exam', '🎯 Exam lens', html);
  const trap = html => callout('trap', '⚠️ Common trap', html);
  const memory = html => callout('memory', '🧠 Memory hook', html);
  const mini = (color, title, html) => `<div class="ll-mini c-${color}"><h5>${title}</h5>${html}</div>`;
  const figure = (svg, caption) => `<figure class="ll-figure">${svg}<figcaption>${caption}</figcaption></figure>`;
  const table = (heads, rows) => `<div class="ll-table-wrap"><table class="ll-table"><thead><tr>${heads.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const arrowDef = (id, color) => `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${color}"/></marker></defs>`;
  const range = (id, label, min, max, val, lo, hi, step) => `
    <div class="ll-range">
      <label for="${id}"><span>${label}</span><span id="${id}-v">${val}</span></label>
      <input type="range" id="${id}" min="${min}" max="${max}" value="${val}" step="${step || 1}">
      <small><span>${lo}</span><span>${hi}</span></small>
    </div>`;
  const num = (id, label, val, step) => `<label class="ll-num" for="${id}">${label}<input type="number" id="${id}" value="${val}" step="${step || 1}" min="0"></label>`;
  const $ = (root, sel) => root.querySelector(sel);
  const money = v => (v < 0 ? '−$' : '$') + Math.abs(Math.round(v)).toLocaleString('en-US');

  // ══════════════════════════════════════════════
  //  DIAGRAMS (static SVG)
  // ══════════════════════════════════════════════

  function svgLifecycleLanes() {
    const rows = [
      { name: 'Predictive', color: '#118ab2', note: 'One pass · single delivery', boxes: ['Requirements', 'Design', 'Build', 'Test', 'Deploy'], deliver: [4], loop: false },
      { name: 'Iterative', color: '#ff9f1c', note: 'Repeat to get it right · single delivery', boxes: ['Prototype 1', 'Feedback', 'Prototype 2', 'Feedback', 'Final'], deliver: [4], loop: true },
      { name: 'Incremental', color: '#7b61ff', note: 'Build in pieces · deliver each piece', boxes: ['Increment 1', 'Increment 2', 'Increment 3', 'Increment 4', 'Increment 5'], deliver: [0, 1, 2, 3, 4], loop: false },
      { name: 'Agile', color: '#06d6a0', note: 'Iterative + incremental · frequent value', boxes: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5'], deliver: [0, 1, 2, 3, 4], loop: true }
    ];
    let out = `<svg class="ll-svg" viewBox="0 0 720 405" role="img" aria-label="Comparison of predictive, iterative, incremental and agile life cycles">${arrowDef('llArrLane', '#5a6a8a')}`;
    rows.forEach((r, i) => {
      const y = 20 + i * 90;
      out += `<text x="10" y="${y + 24}" class="t-strong" style="fill:${r.color}">${r.name}</text>`;
      out += `<text x="10" y="${y + 42}" class="t-small">${r.note.split(' · ')[0]}</text>`;
      out += `<text x="10" y="${y + 56}" class="t-small">${r.note.split(' · ')[1]}</text>`;
      r.boxes.forEach((b, j) => {
        const x = 150 + j * 112;
        const stairY = r.name === 'Predictive' ? y + j * 6 : y + 8;
        out += `<rect x="${x}" y="${stairY}" width="96" height="30" rx="6" fill="${r.color}" fill-opacity="0.18" stroke="${r.color}"/>`;
        out += `<text x="${x + 48}" y="${stairY + 19}" text-anchor="middle" class="t-small" style="fill:var(--text-primary)">${b}</text>`;
        if (j < r.boxes.length - 1) out += `<line x1="${x + 97}" y1="${stairY + 15}" x2="${x + 110}" y2="${stairY + 15 + (r.name === 'Predictive' ? 6 : 0)}" stroke="#5a6a8a" stroke-width="1.5" marker-end="url(#llArrLane)"/>`;
        if (r.loop && j < r.boxes.length - 1) out += `<path d="M${x + 70},${stairY + 32} q 0,14 -22,14 q -22,0 -22,-14" fill="none" stroke="${r.color}" stroke-width="1.2" stroke-dasharray="3 2" marker-end="url(#llArrLane)"/>`;
        if (r.deliver.includes(j)) out += `<path d="M${x + 48},${stairY + 52} l8,8 l-8,8 l-8,-8 z" fill="${r.color}"/>`;
      });
    });
    out += `<path d="M150,384 l7,7 l-7,7 l-7,-7z" fill="#8896b3"/><text x="164" y="395" class="t-small">= delivery of usable value to the customer · dashed loop = feedback / rework cycle</text></svg>`;
    return out;
  }

  function svgLifecycleCurves() {
    return `<svg class="ll-svg" viewBox="0 0 660 300" role="img" aria-label="Typical cost and staffing, risk, stakeholder influence and cost of change across the project life cycle">
      <line class="axis" x1="50" y1="240" x2="630" y2="240"/><line class="axis" x1="50" y1="20" x2="50" y2="240"/>
      ${[195, 340, 485].map(x => `<line class="grid" x1="${x}" y1="20" x2="${x}" y2="240" stroke-dasharray="4 4"/>`).join('')}
      <path d="M50,228 C150,224 220,92 380,82 C470,76 545,150 630,228" fill="none" stroke="#118ab2" stroke-width="3"/>
      <path d="M50,40 C200,58 420,196 630,222" fill="none" stroke="#ef476f" stroke-width="3"/>
      <path d="M50,52 C190,70 420,204 630,230" fill="none" stroke="#ff9f1c" stroke-width="2.5" stroke-dasharray="7 4"/>
      <path d="M50,230 C260,226 460,170 630,36" fill="none" stroke="#06d6a0" stroke-width="3"/>
      <text x="122" y="258" text-anchor="middle" class="t-small">Starting the project</text>
      <text x="267" y="258" text-anchor="middle" class="t-small">Organizing &amp; preparing</text>
      <text x="412" y="258" text-anchor="middle" class="t-small">Carrying out the work</text>
      <text x="557" y="258" text-anchor="middle" class="t-small">Ending the project</text>
      <text x="340" y="282" text-anchor="middle" class="t-strong t-small">Time →</text>
      <text x="22" y="135" transform="rotate(-90 22 135)" text-anchor="middle" class="t-small">Level</text>
      <rect x="70" y="268" width="0" height="0"/>
      <g transform="translate(400,30)">
        <rect x="0" y="0" width="230" height="78" rx="6" class="box"/>
        <line x1="10" y1="16" x2="34" y2="16" stroke="#118ab2" stroke-width="3"/><text x="40" y="20" class="t-small">Cost &amp; staffing level</text>
        <line x1="10" y1="33" x2="34" y2="33" stroke="#ef476f" stroke-width="3"/><text x="40" y="37" class="t-small">Risk &amp; uncertainty</text>
        <line x1="10" y1="50" x2="34" y2="50" stroke="#ff9f1c" stroke-width="2.5" stroke-dasharray="7 4"/><text x="40" y="54" class="t-small">Stakeholder influence</text>
        <line x1="10" y1="67" x2="34" y2="67" stroke="#06d6a0" stroke-width="3"/><text x="40" y="71" class="t-small">Cost of changes</text>
      </g>
    </svg>`;
  }

  function svgCynefin() {
    const q = (x, y, color, title, verbs, practice) => `
      <rect x="${x}" y="${y}" width="230" height="140" rx="10" fill="${color}" fill-opacity="0.16" stroke="${color}"/>
      <text x="${x + 115}" y="${y + 34}" text-anchor="middle" class="t-title">${title}</text>
      <text x="${x + 115}" y="${y + 60}" text-anchor="middle" class="t-strong" style="fill:${color}">${verbs}</text>
      <text x="${x + 115}" y="${y + 84}" text-anchor="middle">${practice}</text>`;
    return `<svg class="ll-svg" viewBox="0 0 500 350" role="img" aria-label="Cynefin framework">
      ${q(10, 10, '#7b61ff', 'Complex', 'Probe → Sense → Respond', 'Emergent practice')}
      ${q(260, 10, '#118ab2', 'Complicated', 'Sense → Analyze → Respond', 'Good practice (experts)')}
      ${q(10, 170, '#ef476f', 'Chaotic', 'Act → Sense → Respond', 'Novel practice')}
      ${q(260, 170, '#06d6a0', 'Clear', 'Sense → Categorize → Respond', 'Best practice')}
      <circle cx="250" cy="160" r="44" fill="var(--bg-card)" stroke="#8896b3" stroke-dasharray="4 3"/>
      <text x="250" y="156" text-anchor="middle" class="t-strong t-small">Confusion</text>
      <text x="250" y="170" text-anchor="middle" class="t-small">(don't know</text>
      <text x="250" y="182" text-anchor="middle" class="t-small">which domain)</text>
      <text x="110" y="135" text-anchor="middle" class="t-small">Clear only in hindsight</text>
      <text x="390" y="135" text-anchor="middle" class="t-small">Cause↔effect needs analysis</text>
      <text x="110" y="292" text-anchor="middle" class="t-small">No visible cause↔effect</text>
      <text x="390" y="292" text-anchor="middle" class="t-small">Obvious to all</text>
      <path d="M300,318 Q250,334 200,318" fill="none" stroke="#ef476f" stroke-width="2" stroke-dasharray="4 3"/><text x="250" y="344" text-anchor="middle" class="t-small" style="fill:#ef476f">Complacency in Clear can tip a project over the "cliff" into Chaotic</text>
    </svg>`;
  }

  function svgCone() {
    return `<svg class="ll-svg" viewBox="0 0 620 260" role="img" aria-label="Cone of uncertainty showing estimate ranges narrowing over time">
      <path d="M60,30 Q300,98 570,130 Q300,140 60,160 Z" fill="#7b61ff" fill-opacity="0.18"/>
      <path d="M60,30 Q300,98 570,130" fill="none" stroke="#7b61ff" stroke-width="2.5"/>
      <path d="M60,160 Q300,140 570,130" fill="none" stroke="#7b61ff" stroke-width="2.5"/>
      <line x1="60" y1="130" x2="590" y2="130" stroke="#8896b3" stroke-dasharray="5 4"/>
      <text x="596" y="134" class="t-small">Actual</text>
      <line class="axis" x1="60" y1="200" x2="590" y2="200"/>
      <text x="66" y="24" class="t-strong t-small">+75%</text><text x="66" y="176" class="t-strong t-small">−25%</text>
      <text x="60" y="222" class="t-small">Initiating</text><text x="200" y="222" class="t-small">Planning</text><text x="360" y="222" class="t-small">Executing</text><text x="520" y="222" class="t-small">Closing</text>
      <line x1="430" y1="110" x2="430" y2="140" stroke="#06d6a0" stroke-width="2"/>
      <text x="438" y="104" class="t-small" style="fill:#06d6a0">Definitive: −5% to +10%</text>
      <text x="90" y="100" class="t-small" style="fill:#a594ff">Rough Order of Magnitude</text>
      <text x="90" y="114" class="t-small" style="fill:#a594ff">−25% to +75%</text>
      <text x="320" y="248" text-anchor="middle" class="t-strong t-small">Time / progressive elaboration →  estimates get narrower as uncertainty is reduced</text>
    </svg>`;
  }

  function svgReserves() {
    return `<svg class="ll-svg" viewBox="0 0 560 300" role="img" aria-label="How contingency and management reserves build up the project budget">
      <rect x="70" y="150" width="120" height="120" rx="6" fill="#118ab2" fill-opacity="0.3" stroke="#118ab2"/>
      <text x="130" y="205" text-anchor="middle" class="t-strong">Work package</text><text x="130" y="221" text-anchor="middle" class="t-small">cost estimates</text>
      <rect x="70" y="90" width="120" height="60" rx="6" fill="#ff9f1c" fill-opacity="0.3" stroke="#ff9f1c"/>
      <text x="130" y="117" text-anchor="middle" class="t-strong">Contingency</text><text x="130" y="133" text-anchor="middle" class="t-small">reserve</text>
      <rect x="70" y="40" width="120" height="50" rx="6" fill="#ef476f" fill-opacity="0.3" stroke="#ef476f"/>
      <text x="130" y="62" text-anchor="middle" class="t-strong">Management</text><text x="130" y="78" text-anchor="middle" class="t-small">reserve</text>
      <path d="M200,92 h10 v178 h-10" fill="none" stroke="#06d6a0" stroke-width="2"/>
      <text x="220" y="180" class="t-strong" style="fill:#06d6a0">Cost baseline</text>
      <text x="220" y="196" class="t-small">Approved, time-phased budget;</text><text x="220" y="210" class="t-small">used for EVM. PM can use contingency</text><text x="220" y="224" class="t-small">for identified risks (known-unknowns).</text>
      <path d="M40,40 h-10 v230 h10" fill="none" stroke="#e8edf5" stroke-width="2"/>
      <text x="20" y="160" transform="rotate(-90 20 160)" text-anchor="middle" class="t-strong">Project budget</text>
      <text x="220" y="56" class="t-strong" style="fill:#ef476f">Unknown-unknowns</text>
      <text x="220" y="72" class="t-small">Outside the baseline, inside the budget.</text><text x="220" y="86" class="t-small">Using it needs management approval → baseline change.</text>
      <text x="220" y="116" class="t-strong" style="fill:#ff9f1c">Known-unknowns</text><text x="220" y="132" class="t-small">Identified risks with planned responses.</text>
    </svg>`;
  }

  function svgLeanVenn() {
    return `<svg class="ll-svg" viewBox="0 0 560 300" role="img" aria-label="Lean, Agile and Kanban relationship">
      <ellipse cx="280" cy="150" rx="265" ry="140" fill="#118ab2" fill-opacity="0.1" stroke="#118ab2"/>
      <text x="60" y="58" class="t-title" style="fill:#4fb6d8">Lean</text><text x="60" y="76" class="t-small">value · flow · pull · eliminate waste</text>
      <ellipse cx="245" cy="165" rx="150" ry="95" fill="#06d6a0" fill-opacity="0.13" stroke="#06d6a0"/>
      <text x="145" y="118" class="t-title" style="fill:#06d6a0">Agile</text>
      <text x="150" y="150" class="t-small">Scrum · XP · FDD</text><text x="150" y="166" class="t-small">DSDM · Crystal · AUP</text><text x="150" y="182" class="t-small">Scrumban</text>
      <ellipse cx="380" cy="170" rx="95" ry="60" fill="#ff9f1c" fill-opacity="0.18" stroke="#ff9f1c"/>
      <text x="400" y="166" class="t-title" style="fill:#ff9f1c">Kanban</text><text x="400" y="182" class="t-small">method</text>
    </svg>`;
  }

  function svgVSM() {
    const steps = [['Request', 0.5], ['Analysis', 2], ['Develop', 4], ['Test', 1], ['Deploy', 0.5]];
    const waits = [3, 5, 3, 4];
    let out = `<svg class="ll-svg" viewBox="0 0 700 220" role="img" aria-label="Value stream map with value-adding and waiting time">${arrowDef('llArrVsm', '#5a6a8a')}`;
    steps.forEach((s, i) => {
      const x = 20 + i * 140;
      out += `<rect x="${x}" y="20" width="100" height="50" rx="6" fill="#06d6a0" fill-opacity="0.15" stroke="#06d6a0"/><text x="${x + 50}" y="50" text-anchor="middle" class="t-strong t-small">${s[0]}</text>`;
      if (i < steps.length - 1) {
        out += `<line x1="${x + 102}" y1="45" x2="${x + 138}" y2="45" stroke="#5a6a8a" stroke-width="1.5" marker-end="url(#llArrVsm)"/>`;
        out += `<path d="M${x + 112},88 l8,-12 l8,12z" fill="#ff9f1c"/><text x="${x + 120}" y="102" text-anchor="middle" class="t-small" style="fill:#ff9f1c">queue</text>`;
      }
      out += `<line x1="${x}" y1="140" x2="${x + 100}" y2="140" stroke="#06d6a0" stroke-width="4"/><text x="${x + 50}" y="160" text-anchor="middle" class="t-small" style="fill:#06d6a0">${s[1]}d work</text>`;
      if (i < waits.length) out += `<line x1="${x + 100}" y1="120" x2="${x + 140}" y2="120" stroke="#ef476f" stroke-width="4"/><line x1="${x + 100}" y1="120" x2="${x + 100}" y2="140" stroke="#5a6a8a"/><line x1="${x + 140}" y1="120" x2="${x + 140}" y2="140" stroke="#5a6a8a"/><text x="${x + 120}" y="114" text-anchor="middle" class="t-small" style="fill:#ef476f">${waits[i]}d wait</text>`;
    });
    out += `<text x="350" y="196" text-anchor="middle" class="t-strong">Value-add = 8 days · Lead time = 23 days · Process Cycle Efficiency ≈ 35%</text></svg>`;
    return out;
  }

  function svgCFD() {
    const total = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];
    const started = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
    const tested = [0, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12];
    const done = [0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11];
    const X = i => 60 + i * 50, Y = v => 230 - v * 6.5;
    const area = (top, bottom) => 'M' + top.map((v, i) => `${X(i)},${Y(v)}`).join(' L') + ' L' + bottom.map((v, i) => `${X(i)},${Y(v)}`).reverse().join(' L') + ' Z';
    const zero = total.map(() => 0);
    return `<svg class="ll-svg" viewBox="0 0 640 290" role="img" aria-label="Cumulative flow diagram">${arrowDef('llArrCfd', '#e8edf5')}
      <path d="${area(total, started)}" fill="#5a6a8a" fill-opacity="0.45"/>
      <path d="${area(started, tested)}" fill="#118ab2" fill-opacity="0.6"/>
      <path d="${area(tested, done)}" fill="#ff9f1c" fill-opacity="0.65"/>
      <path d="${area(done, zero)}" fill="#06d6a0" fill-opacity="0.6"/>
      <line class="axis" x1="60" y1="230" x2="570" y2="230"/><line class="axis" x1="60" y1="20" x2="60" y2="230"/>
      <text x="315" y="252" text-anchor="middle" class="t-small">Days →</text>
      <text x="30" y="125" transform="rotate(-90 30 125)" text-anchor="middle" class="t-small">Cumulative work items</text>
      <line x1="${X(8)}" y1="${Y(16)}" x2="${X(8)}" y2="${Y(8)}" stroke="#e8edf5" stroke-width="2" marker-start="url(#llArrCfd)" marker-end="url(#llArrCfd)"/>
      <text x="${X(8) + 6}" y="${Y(12)}" class="t-strong t-small">WIP</text>
      <line x1="${X(3)}" y1="${Y(8) - 2}" x2="${X(7)}" y2="${Y(8) - 2}" stroke="#e8edf5" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#llArrCfd)"/>
      <text x="${X(3)}" y="${Y(8) - 8}" class="t-strong t-small">≈ cycle time</text>
      <g transform="translate(440,30)"><rect width="150" height="82" rx="6" class="box"/>
        <rect x="10" y="10" width="12" height="12" fill="#5a6a8a"/><text x="28" y="20" class="t-small">Backlog</text>
        <rect x="10" y="28" width="12" height="12" fill="#118ab2"/><text x="28" y="38" class="t-small">In progress (growing!)</text>
        <rect x="10" y="46" width="12" height="12" fill="#ff9f1c"/><text x="28" y="56" class="t-small">Testing</text>
        <rect x="10" y="64" width="12" height="12" fill="#06d6a0"/><text x="28" y="74" class="t-small">Done</text></g>
      <text x="320" y="278" text-anchor="middle" class="t-small" style="fill:#ff9f1c">The "In progress" band widens over time → work piles up before Testing = bottleneck</text>
    </svg>`;
  }

  function svgScrum() {
    return `<svg class="ll-svg" viewBox="0 0 720 270" role="img" aria-label="Scrum framework flow">${arrowDef('llArrScrum', '#8896b3')}
      ${[0, 1, 2, 3].map(i => `<rect x="${20 + i * 3}" y="${70 + i * 18}" width="110" height="16" rx="3" fill="#118ab2" fill-opacity="${0.7 - i * 0.12}"/>`).join('')}
      <text x="78" y="158" text-anchor="middle" class="t-strong t-small">Product Backlog</text><text x="78" y="172" text-anchor="middle" class="t-small">→ Product Goal (PO orders)</text>
      <line x1="140" y1="105" x2="180" y2="105" stroke="#8896b3" stroke-width="2" marker-end="url(#llArrScrum)"/>
      <rect x="185" y="80" width="100" height="50" rx="8" class="box"/><text x="235" y="102" text-anchor="middle" class="t-strong t-small">Sprint Planning</text><text x="235" y="118" text-anchor="middle" class="t-small">why · what · how</text>
      <line x1="290" y1="105" x2="320" y2="105" stroke="#8896b3" stroke-width="2" marker-end="url(#llArrScrum)"/>
      ${[0, 1, 2].map(i => `<rect x="${325 + i * 2}" y="${85 + i * 14}" width="70" height="12" rx="3" fill="#7b61ff" fill-opacity="${0.75 - i * 0.15}"/>`).join('')}
      <text x="362" y="148" text-anchor="middle" class="t-strong t-small">Sprint Backlog</text><text x="362" y="162" text-anchor="middle" class="t-small">→ Sprint Goal</text>
      <line x1="402" y1="105" x2="430" y2="105" stroke="#8896b3" stroke-width="2" marker-end="url(#llArrScrum)"/>
      <circle cx="490" cy="105" r="55" fill="#06d6a0" fill-opacity="0.12" stroke="#06d6a0" stroke-width="2"/>
      <text x="490" y="96" text-anchor="middle" class="t-strong">Sprint</text><text x="490" y="112" text-anchor="middle" class="t-small">1–4 weeks, fixed</text>
      <circle cx="490" cy="38" r="18" fill="none" stroke="#ff9f1c" stroke-width="2" stroke-dasharray="4 3"/><text x="490" y="14" text-anchor="middle" class="t-small" style="fill:#ff9f1c">Daily Scrum 15 min</text>
      <line x1="548" y1="105" x2="585" y2="105" stroke="#8896b3" stroke-width="2" marker-end="url(#llArrScrum)"/>
      <path d="M600,80 l22,0 l12,25 l-12,25 l-22,0 l-12,-25z" fill="#06d6a0" fill-opacity="0.35" stroke="#06d6a0"/>
      <text x="611" y="148" text-anchor="middle" class="t-strong t-small">Increment</text><text x="611" y="162" text-anchor="middle" class="t-small">→ Definition of Done</text>
      <rect x="430" y="200" width="120" height="40" rx="8" class="box"/><text x="490" y="224" text-anchor="middle" class="t-strong t-small">Sprint Review</text>
      <rect x="250" y="200" width="140" height="40" rx="8" class="box"/><text x="320" y="224" text-anchor="middle" class="t-strong t-small">Sprint Retrospective</text>
      <path d="M611,170 Q611,220 555,220" fill="none" stroke="#8896b3" stroke-width="2" marker-end="url(#llArrScrum)"/>
      <line x1="428" y1="220" x2="394" y2="220" stroke="#8896b3" stroke-width="2" marker-end="url(#llArrScrum)"/>
      <path d="M248,220 Q120,230 90,182" fill="none" stroke="#8896b3" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#llArrScrum)"/>
      <text x="130" y="246" class="t-small">feedback updates backlog → next Sprint</text>
    </svg>`;
  }

  function svgBurn() {
    const ideal = 'M40,30 L280,190';
    return `<svg class="ll-svg" viewBox="0 0 640 250" role="img" aria-label="Burndown and burnup charts">
      <g><text x="160" y="16" text-anchor="middle" class="t-title">Burndown</text>
        <line class="axis" x1="40" y1="190" x2="290" y2="190"/><line class="axis" x1="40" y1="25" x2="40" y2="190"/>
        <path d="${ideal}" stroke="#8896b3" stroke-dasharray="5 4" fill="none" stroke-width="1.5"/>
        <polyline points="40,30 64,40 88,46 112,70 136,72 160,96 184,118 208,124 232,150 256,168 280,190" fill="none" stroke="#ef476f" stroke-width="3"/>
        <text x="165" y="212" text-anchor="middle" class="t-small">Days in sprint →</text>
        <text x="20" y="110" transform="rotate(-90 20 110)" text-anchor="middle" class="t-small">Work remaining</text>
        <text x="190" y="60" class="t-small">dashed = ideal</text>
        <text x="160" y="236" text-anchor="middle" class="t-small">Shows what's LEFT. Scope changes are hidden in the line.</text></g>
      <g transform="translate(330,0)"><text x="160" y="16" text-anchor="middle" class="t-title">Burnup</text>
        <line class="axis" x1="40" y1="190" x2="290" y2="190"/><line class="axis" x1="40" y1="25" x2="40" y2="190"/>
        <polyline points="40,62 136,62 136,44 290,44" fill="none" stroke="#ff9f1c" stroke-width="2.5"/>
        <text x="146" y="30" class="t-small" style="fill:#ff9f1c">total scope (scope added!)</text>
        <polyline points="40,190 64,180 88,170 112,150 136,140 160,124 184,104 208,96 232,80 256,64 280,50" fill="none" stroke="#06d6a0" stroke-width="3"/>
        <text x="165" y="212" text-anchor="middle" class="t-small">Iterations →</text>
        <text x="20" y="110" transform="rotate(-90 20 110)" text-anchor="middle" class="t-small">Work completed</text>
        <text x="160" y="236" text-anchor="middle" class="t-small">Shows DONE and scope separately — scope creep is visible.</text></g>
    </svg>`;
  }

  function svgKano() {
    return `<svg class="ll-svg" viewBox="0 0 560 300" role="img" aria-label="Kano model">
      <line class="axis" x1="40" y1="150" x2="520" y2="150"/><line class="axis" x1="280" y1="20" x2="280" y2="280"/>
      <text x="520" y="140" text-anchor="end" class="t-small">Fully implemented →</text><text x="42" y="168" class="t-small">← Absent</text>
      <text x="286" y="30" class="t-small">Satisfied ↑</text><text x="286" y="276" class="t-small">Dissatisfied ↓</text>
      <path d="M40,140 C300,140 420,80 520,24" fill="none" stroke="#06d6a0" stroke-width="3"/>
      <text x="420" y="54" class="t-strong t-small" style="fill:#06d6a0">Excitement (delighters)</text>
      <line x1="60" y1="270" x2="510" y2="30" stroke="#118ab2" stroke-width="3"/>
      <text x="380" y="118" class="t-strong t-small" style="fill:#4fb6d8">Performance (more = better)</text>
      <path d="M40,276 C160,220 260,160 520,158" fill="none" stroke="#ef476f" stroke-width="3"/>
      <text x="360" y="186" class="t-strong t-small" style="fill:#ef476f">Basic / must-be (expected)</text>
      <text x="280" y="296" text-anchor="middle" class="t-small">Indifferent features sit flat on the axis. Over time, delighters become performance features, then basic expectations.</text>
    </svg>`;
  }

  // ══════════════════════════════════════════════
  //  MODULES
  // ══════════════════════════════════════════════

  const MODULES = [
    // ─────────────────────────── 1
    {
      id: 'lifecycles', icon: '🔄', minutes: 20,
      title: 'Project & Development Life Cycles',
      summary: 'Predictive, iterative, incremental, agile and hybrid: what each one is, how they differ, and how a typical life cycle behaves.',
      body: () => [
        block('lc-defs', '🧩 Two life cycles, one project', `
          <p class="ll-lead">The exam separates the <strong>project life cycle</strong> from the <strong>development life cycle</strong>. Confusing the two costs you easy marks.</p>
          <div class="ll-grid-2">
            ${mini('blue', 'Project life cycle', '<p>The series of <strong>phases</strong> a project passes through from start to finish (e.g. Feasibility → Design → Build → Test → Deploy → Close). Phases often end with a <strong>phase gate</strong> (also called a phase review, stage gate or kill point), a go / no-go decision.</p>')}
            ${mini('green', 'Development life cycle', '<p>The phases that create the <strong>product, service or result</strong> itself. It can be predictive, iterative, incremental, adaptive or hybrid. One project life cycle can contain several development life cycles.</p>')}
          </div>
          ${memory('<strong>Phase</strong> = a collection of related activities ending in a deliverable. <strong>Phase gate</strong> = the decision point that follows it. <strong>Phases can be sequential or overlapping.</strong>')}
        `),
        block('lc-types', '🛣️ The life-cycle spectrum', `
          <p>Picture a spectrum running from <strong>plan-driven</strong> (predictive) to <strong>change-driven</strong> (adaptive). The Agile Practice Guide describes four core types plus hybrid:</p>
          ${figure(svgLifecycleLanes(), 'How each life cycle builds and delivers. Diamonds mark the points where the customer receives usable value.')}
          ${table(['Approach', 'Requirements', 'Activities', 'Delivery', 'Goal'], [
            ['🔵 Predictive', 'Fixed, defined up front', 'Performed once for the entire project', 'Single delivery at the end', 'Manage cost'],
            ['🟠 Iterative', 'Dynamic', 'Repeated until correct', 'Single delivery', 'Correctness of the solution'],
            ['🟣 Incremental', 'Dynamic', 'Performed once for each increment', 'Frequent smaller deliveries', 'Speed'],
            ['🟢 Agile', 'Dynamic', 'Repeated until correct', 'Frequent small deliveries', 'Customer value through frequent delivery and feedback'],
            ['🟪 Hybrid', 'Mix by component', 'Mix', 'Mix', 'Best fit for each part of the work']
          ])}
          ${memory('<strong>Iterative = get it RIGHT</strong> (refine through prototypes). <strong>Incremental = get it FAST</strong> (deliver in usable slices). <strong>Agile = both</strong>.')}
        `),
        block('lc-detail', '🔍 Characteristics in depth', `
          <div class="ll-grid-2">
            ${mini('blue', 'Predictive (waterfall, plan-driven)', '<ul><li>Scope, schedule and cost are fixed early and <strong>baselined</strong>.</li><li>Changes go through <strong>integrated change control</strong> (a change request goes to the CCB).</li><li>Works best when requirements are clear, the technology is known, and the work is regulated or safety-critical (construction, many government contracts).</li><li>Rolling wave planning is still allowed for later work.</li></ul>')}
            ${mini('amber', 'Iterative', '<ul><li>Scope is roughly known; <strong>time and cost estimates change</strong> as understanding grows.</li><li>Prototypes and proofs of concept are reviewed and refined.</li><li>Reduces risk on complex or novel solutions, but the customer usually gets value only at the end.</li></ul>')}
            ${mini('purple', 'Incremental', '<ul><li>The product is built in <strong>successive pieces</strong>, each adding functionality within a set timeframe.</li><li>The deliverable is complete only after the final increment.</li><li>Useful when the customer can use part of the solution early (e.g. module-by-module ERP rollout).</li></ul>')}
            ${mini('green', 'Agile (adaptive, change-driven)', '<ul><li>Detailed scope is defined just before each iteration (or pulled continuously).</li><li><strong>Iteration-based</strong> (Scrum: time-boxed sprints) or <strong>flow-based</strong> (Kanban: continuous pull, WIP limits).</li><li>The customer is engaged continuously; change is expected and welcomed.</li><li>Scope varies while time and cost stay fixed (the inverted triangle).</li></ul>')}
          </div>
          <h4>Hybrid: combine on purpose</h4>
          <ul>
            <li><strong>Agile development + predictive rollout</strong>: build the software in sprints, then use a planned deployment and training phase.</li>
            <li><strong>Predictive project with agile components</strong>: for example, a construction project whose smart-building software is built in sprints.</li>
            <li><strong>Largely agile with predictive elements</strong>: for example, a fixed regulatory approval milestone inside a Scrum project.</li>
          </ul>
          ${trap('Agile does <strong>not</strong> mean "no planning" or "no documentation". Agile teams plan continuously (release, iteration and daily planning) and document <em>just enough</em>. If an answer says "agile teams don\'t plan", it is wrong.')}
        `),
        block('lc-curves', '📈 How a typical project life cycle behaves', `
          <p>PMI expects you to know these generic patterns. They hold for almost any predictive project:</p>
          ${figure(svgLifecycleCurves(), 'Typical life-cycle characteristics. Influence and risk are highest early; change gets more expensive as the project moves on.')}
          <ul>
            <li><strong>Cost and staffing</strong> start low, peak while the work is carried out, then drop quickly at closing.</li>
            <li><strong>Risk and uncertainty</strong> are greatest at the start and fall as decisions are made and deliverables are accepted.</li>
            <li><strong>Stakeholder ability to influence</strong> the final product is highest at the start, without much effect on cost.</li>
            <li><strong>The cost of changes and correcting errors</strong> rises sharply as the project nears completion.</li>
          </ul>
          ${exam('When a question asks "when is the best time to involve stakeholders?" or "when is it cheapest to change scope?", the answer is <strong>as early as possible</strong>. Agile flattens the cost-of-change curve by delivering small increments and getting feedback continuously.')}
        `),
        block('lc-cadence', '⏱️ Delivery cadence (PMBOK 7)', `
          <div class="ll-grid-3">
            ${mini('blue', 'Single delivery', '<p>Everything at the end. Typical of predictive projects.</p>')}
            ${mini('purple', 'Multiple deliveries', '<p>Several components delivered at different times. Incremental or phased.</p>')}
            ${mini('amber', 'Periodic deliveries', '<p>Delivered on a fixed schedule, e.g. a release every month.</p>')}
            ${mini('green', 'Continuous delivery', '<p>Features released as soon as they are done (DevOps, Kanban).</p>')}
          </div>
          ${memory('<strong>Recap:</strong> Project life cycle = phases. Development life cycle = how the product is built. Predictive manages cost, iterative aims for correctness, incremental for speed, agile for customer value. Influence and risk are high early; the cost of change is high late.')}
        `)
      ],
      quiz: [
        { q: 'A team builds three successive prototypes of a medical-device interface, refining each after clinician feedback. The finished interface is released once, at the end. Which life cycle is this?', o: ['Predictive', 'Iterative', 'Incremental', 'Flow-based agile'], a: 1, why: 'Repeated refinement toward the correct solution with a single final delivery is <strong>iterative</strong>. Incremental would deliver usable pieces along the way.' },
        { q: 'When during a typical project is stakeholders\' ability to influence the final product highest, and the cost of changes lowest?', o: ['At the start of the project', 'During the build/execution phase', 'Just before acceptance', 'It is constant throughout'], a: 0, why: 'Influence is highest and change is cheapest <strong>at the start</strong>. Both trends reverse as the project progresses.' },
        { q: 'A payroll replacement project releases one working module (time sheets, then tax, then reports) every eight weeks. The content of each release is agreed before work starts. Which approach is this?', o: ['Iterative', 'Predictive', 'Incremental', 'Kanban'], a: 2, why: 'Delivering usable slices of functionality successively is <strong>incremental</strong>. The goal is speed of value delivery.' },
        { q: 'Which statement best describes an agile life cycle?', o: ['It is iterative but never incremental', 'It fixes scope first and lets time and cost vary', 'It is both iterative and incremental, refining work and delivering frequently', 'It removes the need for any planning'], a: 2, why: 'Agile combines iteration (refinement through feedback) with increments (frequent delivery). Time and cost are usually fixed while scope varies.' },
        { q: 'On a predictive bridge-construction project, the client asks for an extra lane after the design is baselined. How is this handled in the predictive life cycle?', o: ['The team adds it to the next sprint backlog', 'Through a change request evaluated in integrated change control', 'The PM approves it to keep the client happy', 'It is rejected because baselines cannot change'], a: 1, why: 'Predictive projects manage scope changes through <strong>integrated change control</strong>: analyze the impact, then submit a change request to the CCB. Baselines can change, but only formally.' }
      ]
    },

    // ─────────────────────────── 2
    {
      id: 'selection', icon: '🧭', minutes: 25,
      title: 'Choosing the Right Approach',
      summary: 'Stacey complexity model, the Agile Suitability Filter and PMBOK 7 tailoring factors, with interactive tools that give you a recommendation.',
      body: () => [
        block('sel-stacey', '📊 Stacey complexity model (interactive)', `
          <p class="ll-lead">Two questions decide where a project sits: <strong>How sure are we about WHAT to build?</strong> (requirements uncertainty) and <strong>How sure are we about HOW to build it?</strong> (technical uncertainty).</p>
          <p>Move the sliders to place a project on the model and see which approach PMI would recommend.</p>
          <div class="ll-controls">
            ${range('llStaceyReq', 'Requirements uncertainty (what)', 0, 100, 20, 'Agreed / clear', 'Far from agreement')}
            ${range('llStaceyTech', 'Technical uncertainty (how)', 0, 100, 25, 'Known technology', 'Unknown / new')}
          </div>
          <figure class="ll-figure"><svg class="ll-svg" id="llStaceySvg" viewBox="0 0 400 370" role="img" aria-label="Stacey complexity model">
            <defs><clipPath id="llStaceyClip"><rect x="60" y="20" width="300" height="300"/></clipPath></defs>
            <g clip-path="url(#llStaceyClip)">
              <rect x="60" y="20" width="300" height="300" fill="#ef476f" fill-opacity="0.22"/>
              <circle cx="60" cy="320" r="324" fill="#7b61ff" fill-opacity="0.35"/>
              <circle cx="60" cy="320" r="225" fill="#118ab2" fill-opacity="0.55"/>
              <circle cx="60" cy="320" r="120" fill="#06d6a0" fill-opacity="0.45"/>
            </g>
            <rect x="60" y="20" width="300" height="300" fill="none" class="axis"/>
            <text x="102" y="282" class="t-strong">Simple</text>
            <text x="160" y="205" class="t-strong">Complicated</text>
            <text x="245" y="130" class="t-strong">Complex</text>
            <text x="298" y="48" class="t-strong">Chaotic</text>
            <text x="210" y="345" text-anchor="middle" class="t-small">Technical uncertainty (HOW) →</text>
            <text x="30" y="170" transform="rotate(-90 30 170)" text-anchor="middle" class="t-small">Requirements uncertainty (WHAT) →</text>
            <circle id="llStaceyDot" cx="135" cy="260" r="9" fill="#ffffff" stroke="#0a0e1a" stroke-width="3"/>
          </svg><figcaption>Adapted from the Stacey model as used in PMI's Agile Practice Guide. Bands move outward from "close to certainty / agreement".</figcaption></figure>
          <div class="ll-result" id="llStaceyOut"></div>
          ${exam('Scenario cues: <strong>"requirements are unclear"</strong>, <strong>"the customer will know it when they see it"</strong> or <strong>"new technology"</strong> point to the Complex zone and an <strong>adaptive/agile</strong> approach. <strong>"Well-understood, repeatable, regulated work"</strong> points to <strong>predictive</strong>.')}
        `),
        block('sel-filter', '🧪 Agile Suitability Filter (interactive)', `
          <p>The Agile Practice Guide (Appendix X3) scores a project on <strong>nine attributes in three groups</strong>. Low scores point to agile; high scores point to predictive. A mix points to hybrid. Rate your project:</p>
          <div class="ll-controls" id="llFilterCtrls"></div>
          <div class="ll-grid-2" style="align-items:center">
            <figure class="ll-figure" style="margin-top:14px"><svg class="ll-svg" id="llRadar" viewBox="0 0 360 340" role="img" aria-label="Suitability radar chart"></svg><figcaption>Inner ring = agile · middle = hybrid · outer = predictive</figcaption></figure>
            <div class="ll-result" id="llFilterOut"></div>
          </div>
          ${trap('The filter is a <strong>conversation tool</strong>, not a verdict. If only one or two attributes score high (e.g. low trust), the PMI answer is usually to <strong>address that factor</strong> (coaching, building trust, getting a customer representative) or use a hybrid, not to drop agile entirely.')}
        `),
        block('sel-factors', '🧰 Tailoring factors (PMBOK 7: Development Approach & Life Cycle domain)', `
          <div class="ll-grid-3">
            ${mini('green', '📦 Product / deliverable', '<ul><li>Degree of innovation</li><li>Requirements certainty</li><li>Scope stability</li><li>Ease of change</li><li>Delivery options (can it be split?)</li><li>Risk</li><li>Safety requirements</li><li>Regulations</li></ul>')}
            ${mini('blue', '🗂️ Project', '<ul><li>Stakeholders (availability, needs)</li><li>Schedule constraints (need something early?)</li><li>Funding availability (incremental funding?)</li></ul>')}
            ${mini('purple', '🏢 Organization', '<ul><li>Organizational structure</li><li>Culture (command-and-control vs empowered)</li><li>Organizational capability</li><li>Project team size and location</li></ul>')}
          </div>
          ${table(['If you see…', 'Lean toward…', 'Why'], [
            ['High innovation, unclear requirements, frequent change', 'Adaptive / agile', 'Short feedback loops reduce the cost of being wrong'],
            ['Stable scope, known technology, strict regulation or safety', 'Predictive', 'Up-front design and formal verification are required'],
            ['Software inside a hardware or construction project', 'Hybrid', 'Each component gets the approach that suits it'],
            ['Customer wants early partial value / funding released in stages', 'Incremental or agile', 'Supports multiple or periodic deliveries'],
            ['Large distributed teams, low agile experience', 'Hybrid, coaching, scaled framework', 'Build capability gradually']
          ])}
          ${exam('PMI answers favour <strong>tailoring</strong>: the PM <strong>works with the team</strong> to pick and adapt the approach to the context. Be wary of answers like "always use agile", or a PM imposing a method alone.')}
          ${memory('<strong>Recap:</strong> Ask what (requirements) × how (technology). Simple → predictive. Complicated → predictive or iterative. Complex → agile. Chaotic → act to stabilize first, then reassess. Use the suitability filter (culture, team, project) as a conversation, and tailor using product, project and organization factors.')}
        `)
      ],
      mount(root) {
        // Stacey
        const req = $(root, '#llStaceyReq'), tech = $(root, '#llStaceyTech');
        const dot = $(root, '#llStaceyDot'), out = $(root, '#llStaceyOut');
        const ZONES = [
          { max: 40, name: 'Simple', color: '#06d6a0', approach: 'Predictive', text: 'Requirements are agreed and the technology is known. Plan up front, baseline, and control changes formally. A detailed WBS and schedule work well.' },
          { max: 75, name: 'Complicated', color: '#4fb6d8', approach: 'Predictive, iterative or hybrid', text: 'Some unknowns, but experts can analyze them. Plan carefully and add iterations or prototypes where uncertainty remains. Hybrid is common.' },
          { max: 108, name: 'Complex', color: '#a594ff', approach: 'Agile / adaptive', text: 'Things are only understood by doing. Use short iterations, frequent feedback, an emergent backlog, and spikes or experiments to learn quickly.' },
          { max: 999, name: 'Chaotic', color: '#ef476f', approach: 'Act to stabilize, then reassess', text: 'No agreement and no known way to build it. Run very short experiments, act decisively to establish order, then reassess. Feasibility work may come before committing to a project.' }
        ];
        const updateStacey = () => {
          const y = +req.value, x = +tech.value;
          $(root, '#llStaceyReq-v').textContent = y; $(root, '#llStaceyTech-v').textContent = x;
          dot.setAttribute('cx', 60 + x * 3); dot.setAttribute('cy', 320 - y * 3);
          const r = Math.sqrt(x * x + y * y);
          const z = ZONES.find(z => r <= z.max);
          out.innerHTML = `<span class="big" style="color:${z.color}">${z.name} zone → ${z.approach}</span>${z.text}`;
        };
        req.addEventListener('input', updateStacey); tech.addEventListener('input', updateStacey); updateStacey();

        // Suitability filter
        const ATTRS = [
          ['Culture', 'Buy-in to the approach', 'Full sponsor & business buy-in', 'No buy-in'],
          ['Culture', 'Trust in the team', 'Sponsors trust the team', 'Low trust'],
          ['Culture', 'Team decision-making power', 'Team decides how', 'Decisions made for the team'],
          ['Team', 'Team size', '≤ ~10 people', '200+ people'],
          ['Team', 'Experience levels', 'Experienced, cross-skilled', 'Mostly novices'],
          ['Team', 'Access to customer / business', 'Daily access', 'Rare access'],
          ['Project', 'Likelihood of change', 'Up to 50% change per month', 'Very stable'],
          ['Project', 'Criticality of product', 'Low (comfort, discretionary)', 'Lives at stake / heavy regulation'],
          ['Project', 'Incremental delivery possible', 'Can deliver in slices', 'Only useful when complete']
        ];
        const ctrls = $(root, '#llFilterCtrls');
        let lastGroup = '';
        ctrls.innerHTML = ATTRS.map((a, i) => {
          const g = a[0] !== lastGroup ? `<div class="ll-group-label">${a[0]}</div>` : '';
          lastGroup = a[0];
          return g + range('llF' + i, (i + 1) + '. ' + a[1], 0, 10, [2, 3, 3, 2, 4, 3, 2, 5, 2][i], a[2], a[3]);
        }).join('');
        const radar = $(root, '#llRadar'), fout = $(root, '#llFilterOut');
        const cx = 180, cy = 165, R = 120;
        const pt = (i, v) => { const ang = -Math.PI / 2 + i * 2 * Math.PI / 9; return [cx + Math.cos(ang) * R * v / 10, cy + Math.sin(ang) * R * v / 10]; };
        const updateFilter = () => {
          const vals = ATTRS.map((_, i) => +$(root, '#llF' + i).value);
          vals.forEach((v, i) => { $(root, '#llF' + i + '-v').textContent = v; });
          let s = '';
          [[10, '#ef476f'], [6.6, '#7b61ff'], [3.3, '#06d6a0']].forEach(([lvl, c]) => {
            s += `<polygon points="${ATTRS.map((_, i) => pt(i, lvl).join(',')).join(' ')}" fill="${c}" fill-opacity="0.12" stroke="${c}" stroke-opacity="0.5"/>`;
          });
          ATTRS.forEach((a, i) => {
            const [x, y] = pt(i, 10), [lx, ly] = pt(i, 12.3);
            s += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" class="grid"/><text x="${lx}" y="${ly}" text-anchor="middle" class="t-small">${i + 1}</text>`;
          });
          s += `<polygon points="${vals.map((v, i) => pt(i, v).join(',')).join(' ')}" fill="#00f0ff" fill-opacity="0.25" stroke="#00f0ff" stroke-width="2"/>`;
          vals.forEach((v, i) => { const [x, y] = pt(i, v); s += `<circle cx="${x}" cy="${y}" r="3.5" fill="#00f0ff"/>`; });
          radar.innerHTML = s;
          const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
          const outliers = ATTRS.filter((_, i) => vals[i] > 6.6).map(a => a[1]);
          let verdict, color, advice;
          if (avg <= 3.5 && outliers.length === 0) { verdict = 'Agile fit'; color = '#06d6a0'; advice = 'Most attributes sit in the inner ring. An adaptive approach (Scrum, Kanban, XP practices) should work well.'; }
          else if (avg >= 6.6) { verdict = 'Predictive fit'; color = '#ef476f'; advice = 'Most attributes are in the outer ring. Use a predictive approach, possibly with iterative prototyping for risky parts.'; }
          else { verdict = 'Hybrid fit'; color = '#a594ff'; advice = 'The project sits between the rings. Combine approaches, e.g. agile delivery of components with predictive governance, compliance or rollout.'; }
          fout.innerHTML = `<span class="big" style="color:${color}">${verdict}</span>Average score: <b>${avg.toFixed(1)}</b> / 10<br>${advice}` +
            (outliers.length ? `<br><br><b>Outer-ring attributes to address:</b><br>• ${outliers.join('<br>• ')}<br><span style="color:var(--text-secondary)">PMI answer: deal with these first (coaching, building trust, a customer proxy, smaller teams) or keep the related work predictive.</span>` : '');
        };
        ctrls.addEventListener('input', updateFilter); updateFilter();
      },
      quiz: [
        { q: 'A start-up wants a new mobile payments app. The founders are not sure which features customers want, and the team will use an unfamiliar blockchain library. Which approach is most appropriate?', o: ['Predictive with a detailed WBS', 'Agile / adaptive with short iterations and frequent feedback', 'Incremental with fixed release content', 'Predictive with a large management reserve'], a: 1, why: 'High requirements uncertainty plus high technical uncertainty puts the project in the <strong>Complex</strong> zone of the Stacey model, which calls for an adaptive approach.' },
        { q: 'A team scores in the inner ring on most suitability-filter attributes, but the product controls a medical infusion pump and is heavily regulated. What is the BEST approach?', o: ['Pure Scrum, since most attributes favour agile', 'Pure predictive, since regulation overrides everything', 'A hybrid approach: agile development with predictive verification, validation and compliance activities', 'Postpone the project until regulations change'], a: 2, why: 'When one or two attributes sit in the outer ring, PMI recommends <strong>hybrid</strong>: keep agile where it fits and add predictive controls where criticality demands them.' },
        { q: 'Which of these is NOT a factor PMBOK 7 lists for selecting a development approach?', o: ['Degree of innovation', 'Regulatory requirements', 'Team size and location', 'The project manager\'s favourite methodology'], a: 3, why: 'Selection is based on <strong>product, project and organization</strong> factors. Personal preference is not one of them.' },
        { q: 'A crisis-recovery initiative has no agreement on goals and no known technical solution. Where does it sit on the Stacey model, and what should the PM do first?', o: ['Simple: create a detailed plan', 'Complicated: hire experts to analyze', 'Chaotic: act quickly with short experiments to stabilize, then reassess the approach', 'Complex: commit to a 12-month Scrum roadmap'], a: 2, why: 'In the <strong>Chaotic</strong> zone you <strong>act first</strong> to establish order, then sense and respond. Detailed long-term planning is premature.' },
        { q: 'An organization with a strong command-and-control culture wants to try agile on its next project. As PM, what should you recommend?', o: ['Switch every project to agile immediately', 'Refuse, since the culture is unsuitable', 'Start with a hybrid or pilot approach, with coaching and executive sponsorship, and expand gradually', 'Let each team member choose their own method'], a: 2, why: 'PMI favours an <strong>incremental transition</strong>: pilot, coach, gain buy-in and tailor. Culture is a tailoring factor to manage, not a reason to give up.' }
      ]
    },

    // ─────────────────────────── 3
    {
      id: 'uncertainty', icon: '🌫️', minutes: 20,
      title: 'Navigating Uncertainty & Complexity',
      summary: 'The PMBOK 7 Uncertainty domain: risk, ambiguity, complexity and volatility, plus the Cynefin framework and the cone of uncertainty.',
      body: () => [
        block('unc-domain', '🌫️ The Uncertainty performance domain', `
          <p class="ll-lead"><strong>Uncertainty</strong> is a lack of understanding and awareness of issues, events, paths to follow or solutions to pursue. PMBOK 7 splits it into four faces, and each has its own response pattern.</p>
          <div class="ll-grid-2">
            ${mini('red', '🎲 Risk', '<p>An uncertain event or condition that, if it occurs, has a positive or negative effect on objectives. <strong>Response:</strong> the risk management processes (identify, analyze, plan responses, monitor). Covered in the next module.</p>')}
            ${mini('amber', '❓ Ambiguity', '<p><strong>Conceptual ambiguity:</strong> people use the same term differently ("done", "on schedule"). <strong>Situational ambiguity:</strong> more than one outcome is possible. <strong>Responses:</strong> progressive elaboration, experiments, prototypes, common definitions and agreed rules.</p>')}
            ${mini('purple', '🕸️ Complexity', '<p>Many interconnected parts, people and dependencies, so outcomes are hard to predict.<br><strong>Systems-based:</strong> decoupling, simulation.<br><strong>Reframing:</strong> diversity of views, balance (use data together with forecasting).<br><strong>Process-based:</strong> iterate, engage stakeholders, build in failsafes.</p>')}
            ${mini('blue', '🌪️ Volatility', '<p>Rapid, unpredictable change, e.g. material prices, skills availability or exchange rates. <strong>Responses:</strong> alternatives analysis (other suppliers or materials) and <strong>reserves</strong> for cost and schedule.</p>')}
          </div>
          <h4>General responses to any uncertainty</h4>
          <ul>
            <li><strong>Gather information</strong>: research, consult experts, market analysis.</li>
            <li><strong>Prepare for multiple outcomes</strong>: primary and backup plans for the most likely outcomes.</li>
            <li><strong>Set-based design</strong>: explore several designs or alternatives early and narrow down later.</li>
            <li><strong>Build in resilience</strong>: the ability to adapt and recover quickly from unexpected change.</li>
          </ul>
          ${exam('Match the response to the type. Stakeholders disagree on what "complete" means → <strong>ambiguity</strong> → agree definitions (e.g. a Definition of Done). Steel price swings → <strong>volatility</strong> → alternatives analysis and reserves.')}
        `),
        block('unc-cynefin', '🗺️ Cynefin: how to make sense of a situation', `
          <p>The Cynefin framework (Dave Snowden) helps you choose how to <strong>act</strong> based on how clear cause and effect are. It fits closely with the Stacey model.</p>
          ${figure(svgCynefin(), 'Cynefin domains and their decision models.')}
          ${table(['Domain', 'Decision model', 'Project approach'], [
            ['Clear (Obvious/Simple)', 'Sense → Categorize → Respond', 'Apply best practice; predictive, checklists'],
            ['Complicated', 'Sense → Analyze → Respond', 'Experts analyze; predictive or iterative'],
            ['Complex', 'Probe → Sense → Respond', 'Safe-to-fail experiments; agile'],
            ['Chaotic', 'Act → Sense → Respond', 'Stabilize first; crisis management'],
            ['Confusion (Disorder)', 'Break the situation down', 'Work out which domain each part belongs to']
          ])}
          ${memory('Clear = Categorize, Complicated = Consult experts, Complex = Probe (experiment), Chaotic = Act now.')}
        `),
        block('unc-cone', '🍦 Cone of uncertainty and progressive elaboration', `
          <p>Early estimates are uncertain. As you learn more, the range narrows. This is why PMI supports <strong>progressive elaboration</strong> and <strong>rolling wave planning</strong>.</p>
          ${figure(svgCone(), 'Estimate accuracy improves as the project progresses (PMBOK 6 ranges).')}
          <div class="ll-grid-3">
            ${mini('purple', 'Rough Order of Magnitude', '<p><strong>−25% to +75%</strong>. Initiating / business case.</p>')}
            ${mini('green', 'Definitive estimate', '<p><strong>−5% to +10%</strong>. Later, when the work is well understood.</p>')}
            ${mini('blue', 'Tools to narrow the cone', '<p>Rolling wave planning, prototypes, spikes, 3-point estimates, reserve analysis, iterations.</p>')}
          </div>
          ${trap('Do not present an early estimate as a single precise number. PMI answers show <strong>a range with stated assumptions</strong>, then refine it as information arrives.')}
        `),
        block('unc-vuca', '🌐 VUCA and prompt lists', `
          <p><strong>VUCA</strong> (Volatility, Uncertainty, Complexity, Ambiguity) is also a risk-identification prompt list, alongside <strong>PESTLE</strong> (Political, Economic, Social, Technological, Legal, Environmental) and <strong>TECOP</strong> (Technical, Environmental, Commercial, Operational, Political).</p>
          ${memory('<strong>Recap:</strong> Uncertainty = risk + ambiguity + complexity + volatility. Ambiguity → define and experiment. Complexity → decouple, simulate, iterate. Volatility → alternatives and reserves. Cynefin tells you how to act. Estimates narrow from ROM −25%/+75% to definitive −5%/+10%.')}
        `)
      ],
      quiz: [
        { q: 'Halfway through a project, it is clear that the business team and the developers mean different things by "feature complete". What type of uncertainty is this, and what is the BEST response?', o: ['Volatility: add schedule reserve', 'Conceptual ambiguity: establish shared definitions such as a Definition of Done', 'Risk: transfer to a vendor', 'Complexity: decouple the system'], a: 1, why: 'Different interpretations of the same term are <strong>conceptual ambiguity</strong>. Agreeing common definitions and rules removes it.' },
        { q: 'The price of copper used in your project has swung 30% in three months. Which response best addresses this volatility?', o: ['Perform alternatives analysis and hold cost reserves', 'Run a retrospective', 'Increase the frequency of status reports', 'Decouple system components'], a: 0, why: 'For <strong>volatility</strong>, PMBOK 7 recommends <strong>alternatives analysis</strong> (other materials or suppliers) and <strong>reserves</strong>.' },
        { q: 'Your team does not know how users will react to a new AI recommendation feature. According to Cynefin, which decision model fits?', o: ['Sense → Categorize → Respond', 'Sense → Analyze → Respond', 'Probe → Sense → Respond', 'Act → Sense → Respond'], a: 2, why: 'Cause and effect can only be understood afterwards, so this is <strong>Complex</strong>. Run safe-to-fail experiments (probe), observe, then respond.' },
        { q: 'During initiating, the sponsor asks how much the project will cost. What accuracy range should the PM attach to a rough order of magnitude estimate?', o: ['−5% to +10%', '−10% to +10%', '−25% to +75%', 'There is no range; give the exact figure'], a: 2, why: 'A ROM estimate in initiating is typically <strong>−25% to +75%</strong> (PMBOK 6). It narrows as the work is elaborated.' },
        { q: 'A system has many tightly coupled components, so a change in one part causes unpredictable effects elsewhere. Which response targets this systems-based complexity?', o: ['Decoupling and simulation', 'Buying insurance', 'Adding more status meetings', 'Accepting the risk passively'], a: 0, why: 'For <strong>systems-based complexity</strong>, PMBOK 7 suggests <strong>decoupling</strong> parts to reduce interconnections and <strong>simulation</strong> to understand behaviour.' }
      ]
    },

    // ─────────────────────────── 4
    {
      id: 'risk', icon: '🎲', minutes: 30,
      title: 'Risk Management Deep Dive',
      summary: 'Seven risk processes, the probability-impact matrix, response strategies, reserves, EMV and decision trees, plus how agile teams handle risk.',
      body: () => [
        block('risk-basics', '🎲 Risk vocabulary you must own', `
          <div class="ll-grid-2">
            ${mini('red', 'Individual vs overall project risk', '<p><strong>Individual risk:</strong> one uncertain event (e.g. "the supplier may be late"). <strong>Overall project risk:</strong> the effect of all uncertainty on the project as a whole, reported in the <strong>risk report</strong>.</p>')}
            ${mini('green', 'Threats and opportunities', '<p>Risk can be <strong>negative (threat)</strong> or <strong>positive (opportunity)</strong>. PMI expects you to manage both.</p>')}
            ${mini('amber', 'Risk appetite → thresholds', '<p><strong>Appetite</strong> is how much uncertainty the organization will accept (qualitative). <strong>Threshold</strong> is the measurable limit (e.g. "±5% cost variance").</p>')}
            ${mini('blue', 'Risk vs issue', '<p>A <strong>risk</strong> may happen in the future (risk register). An <strong>issue</strong> has already happened (issue log). An issue needs action now.</p>')}
          </div>
          ${table(['Term', 'Meaning'], [
            ['Risk owner', 'The person accountable for monitoring a risk and carrying out its response'],
            ['Trigger', 'A warning sign that a risk is about to occur or has occurred'],
            ['Contingency plan', 'A planned response carried out when the trigger occurs'],
            ['Fallback plan', 'Plan B, used if the contingency plan does not work'],
            ['Residual risk', 'Risk that remains after the response has been implemented'],
            ['Secondary risk', 'A <strong>new</strong> risk created by implementing a response'],
            ['Workaround', 'An <strong>unplanned</strong> response to an unidentified risk that has occurred']
          ])}
        `),
        block('risk-process', '🔁 The seven risk processes (PMBOK 6)', `
          <div class="ll-grid-3">
            ${mini('blue', '1 · Plan Risk Management', '<p>Produces the <strong>risk management plan</strong>: methodology, roles, funding, categories (RBS), probability and impact definitions, P-I matrix.</p>')}
            ${mini('blue', '2 · Identify Risks', '<p>Brainstorming, checklists, interviews, root cause, SWOT, assumption and constraint analysis, prompt lists. Produces the <strong>risk register</strong> and <strong>risk report</strong>.</p>')}
            ${mini('purple', '3 · Qualitative Analysis', '<p>Prioritize by probability × impact, urgency, proximity and data quality. Fast and subjective. Done on <strong>every</strong> project.</p>')}
            ${mini('purple', '4 · Quantitative Analysis', '<p>Numeric analysis of overall risk: <strong>Monte Carlo</strong> simulation, sensitivity (tornado diagram), <strong>EMV</strong>, decision trees. Not always needed.</p>')}
            ${mini('green', '5 · Plan Risk Responses', '<p>Choose a strategy, assign owners, and define triggers, contingency and fallback plans.</p>')}
            ${mini('green', '6 · Implement Risk Responses', '<p>The risk owner carries out the agreed plan when the trigger occurs.</p>')}
            ${mini('amber', '7 · Monitor Risks', '<p>Track risks, identify new ones, check whether responses work, and run <strong>risk audits</strong> and reserve analysis.</p>')}
          </div>
          ${exam('When an <strong>identified</strong> risk occurs, the PM ensures the risk owner <strong>implements the planned response</strong> from the risk register. When an <strong>unidentified</strong> risk occurs, use a <strong>workaround</strong>, then update the risk register and lessons learned.')}
        `),
        block('risk-pim', '🟥 Probability-impact matrix (interactive)', `
          <p>Click a cell to see its score and the typical posture. PMBOK 6 shows threats and opportunities as mirrored matrices.</p>
          <div class="ll-seg" id="llPimMode"><button class="active" data-m="threat">Threats</button><button data-m="opp">Opportunities</button></div>
          <div class="ll-pim" id="llPim"></div>
          <div class="ll-result" id="llPimOut">Select a cell.</div>
        `),
        block('risk-strategies', '🛡️ Response strategies', `
          ${table(['Threats (negative)', 'What it means', 'Opportunities (positive)', 'What it means'], [
            ['<strong>Escalate</strong>', 'Outside the PM\'s authority or project scope; pass it to the program, portfolio or sponsor', '<strong>Escalate</strong>', 'Same: the owner sits outside the project'],
            ['<strong>Avoid</strong>', 'Eliminate the threat (change the plan, drop a feature, extend the schedule)', '<strong>Exploit</strong>', 'Make sure the opportunity happens (assign top talent)'],
            ['<strong>Transfer</strong>', 'Shift ownership and impact to a third party (insurance, warranties, fixed-price contract)', '<strong>Share</strong>', 'Partner with whoever can best capture it (joint venture)'],
            ['<strong>Mitigate</strong>', 'Reduce probability and/or impact (more testing, redundancy, a prototype)', '<strong>Enhance</strong>', 'Increase probability and/or impact'],
            ['<strong>Accept</strong>', 'Active: contingency reserve. Passive: do nothing, review periodically', '<strong>Accept</strong>', 'Take it if it comes']
          ])}
          ${trap('<strong>Transfer does not remove the risk</strong>. It moves it, usually for a premium. A <strong>fixed-price contract</strong> transfers cost risk to the <strong>seller</strong>; <strong>cost-reimbursable</strong> leaves it with the <strong>buyer</strong>.')}
          ${memory('Threats: <strong>E-A-T-M-A</strong> (Escalate, Avoid, Transfer, Mitigate, Accept). Opportunities: <strong>E-E-S-E-A</strong> (Escalate, Exploit, Share, Enhance, Accept).')}
        `),
        block('risk-reserves', '💰 Contingency vs management reserve', `
          ${figure(svgReserves(), 'Reserves and the cost baseline.')}
          ${exam('The PM can use <strong>contingency reserve</strong> for identified risks. <strong>Management reserve</strong> covers unknown-unknowns: it is <strong>outside the cost baseline</strong>, and using it needs <strong>management approval</strong> and a baseline change. EVM is measured against the baseline, not the total budget.')}
        `),
        block('risk-emv', '🌳 EMV and decision trees (interactive)', `
          <p><strong>Expected Monetary Value</strong> = Probability × Impact. Threats are negative and opportunities positive. In a decision tree, compute the EMV of each branch and <strong>choose the best net value</strong>.</p>
          <div class="ll-controls">
            ${range('llDtP', 'Probability of strong demand (%)', 0, 100, 60, '0%', '100%', 5)}
            ${num('llDtBuildCost', 'Build new plant: investment ($k)', 120)}
            ${num('llDtUpgCost', 'Upgrade old plant: investment ($k)', 50)}
          </div>
          <figure class="ll-figure"><svg class="ll-svg" id="llDtSvg" viewBox="0 0 640 260" role="img" aria-label="Decision tree"></svg><figcaption>Build: strong demand $200k / weak $90k. Upgrade: strong $120k / weak $60k.</figcaption></figure>
          <div class="ll-result" id="llDtOut"></div>
        `),
        block('risk-agile', '⚡ Risk in agile projects', `
          <ul>
            <li><strong>Short iterations</strong> expose risk early. Each increment is a test of assumptions.</li>
            <li><strong>Risk-adjusted backlog</strong>: risk-response work is added to the backlog and prioritized alongside features.</li>
            <li><strong>Spikes</strong>: time-boxed research to reduce technical or requirements uncertainty.</li>
            <li><strong>Daily stand-ups and retrospectives</strong> surface impediments and risks continuously.</li>
            <li><strong>Risk burndown chart</strong>: total risk exposure should fall each sprint.</li>
            <li>High-risk or high-value items are often tackled <strong>early</strong> ("fail fast").</li>
          </ul>
          ${memory('<strong>Recap:</strong> Identified risk occurs → follow the plan. Unidentified → workaround. A response creates a new risk → secondary risk. What is left over → residual risk. Contingency = known-unknowns (PM). Management reserve = unknown-unknowns (needs approval). EMV = P × I.')}
        `)
      ],
      mount(root) {
        // P-I matrix
        const pim = $(root, '#llPim'), pout = $(root, '#llPimOut');
        let mode = 'threat', selected = null;
        const levels = ['Very low', 'Low', 'Medium', 'High', 'Very high'];
        const draw = () => {
          let html = '';
          for (let p = 5; p >= 1; p--) {
            html += `<div class="lab">P${p}</div>`;
            for (let i = 1; i <= 5; i++) {
              const s = p * i, cls = s >= 15 ? 'hi' : s >= 5 ? 'md' : 'lo';
              html += `<button class="${cls}${selected === p + '-' + i ? ' sel' : ''}" data-p="${p}" data-i="${i}" aria-label="Probability ${p}, impact ${i}">${s}</button>`;
            }
          }
          html += '<div></div>' + [1, 2, 3, 4, 5].map(i => `<div class="lab">I${i}</div>`).join('');
          pim.innerHTML = html;
        };
        pim.addEventListener('click', e => {
          const b = e.target.closest('button'); if (!b) return;
          const p = +b.dataset.p, i = +b.dataset.i, s = p * i; selected = p + '-' + i; draw();
          const band = s >= 15 ? 'HIGH' : s >= 5 ? 'MEDIUM' : 'LOW';
          const posture = mode === 'threat'
            ? { HIGH: 'Top priority: <strong>avoid or mitigate</strong>. Assign an owner, consider quantitative analysis, monitor closely.', MEDIUM: '<strong>Mitigate or transfer</strong> where cost-effective. Plan contingency.', LOW: 'Usually <strong>accept</strong> (active or passive) and place on a watch list.' }
            : { HIGH: 'Top priority: <strong>exploit or enhance</strong>. Assign strong resources.', MEDIUM: '<strong>Enhance or share</strong> to raise the odds or the benefit.', LOW: 'Usually <strong>accept</strong> and put on a watch list.' };
          pout.innerHTML = `<span class="big">${band} ${mode === 'threat' ? 'threat' : 'opportunity'} · score ${s}</span>Probability: ${levels[p - 1]} · Impact: ${levels[i - 1]}<br>${posture[band]}`;
        });
        $(root, '#llPimMode').addEventListener('click', e => {
          const b = e.target.closest('button'); if (!b) return;
          mode = b.dataset.m; root.querySelectorAll('#llPimMode button').forEach(x => x.classList.toggle('active', x === b));
          selected = null; draw(); pout.textContent = 'Select a cell.';
        });
        draw();

        // Decision tree
        const svg = $(root, '#llDtSvg'), dout = $(root, '#llDtOut');
        const pIn = $(root, '#llDtP'), bIn = $(root, '#llDtBuildCost'), uIn = $(root, '#llDtUpgCost');
        const updateDt = () => {
          const p = +pIn.value / 100, q = 1 - p; $(root, '#llDtP-v').textContent = Math.round(p * 100) + '%';
          const bc = +bIn.value || 0, uc = +uIn.value || 0;
          const emvB = p * 200 + q * 90 - bc, emvU = p * 120 + q * 60 - uc;
          const best = emvB >= emvU ? 'B' : 'U';
          const node = (x, y, label, val, color) => `<rect x="${x}" y="${y - 16}" width="150" height="32" rx="6" fill="${color}" fill-opacity="0.18" stroke="${color}"/><text x="${x + 75}" y="${y - 1}" text-anchor="middle" class="t-strong t-small">${label}</text><text x="${x + 75}" y="${y + 11}" text-anchor="middle" class="t-small">${val}</text>`;
          svg.innerHTML = `
            <rect x="10" y="114" width="32" height="32" fill="#7b61ff" fill-opacity="0.5" stroke="#7b61ff"/><text x="26" y="166" text-anchor="middle" class="t-small">Decision</text>
            <line x1="42" y1="130" x2="150" y2="70" stroke="${best === 'B' ? '#06d6a0' : '#5a6a8a'}" stroke-width="${best === 'B' ? 3 : 1.5}"/>
            <line x1="42" y1="130" x2="150" y2="190" stroke="${best === 'U' ? '#06d6a0' : '#5a6a8a'}" stroke-width="${best === 'U' ? 3 : 1.5}"/>
            <text x="70" y="88" class="t-small">Build −$${bc}k</text><text x="70" y="182" class="t-small">Upgrade −$${uc}k</text>
            <circle cx="170" cy="70" r="16" fill="#ff9f1c" fill-opacity="0.5" stroke="#ff9f1c"/><circle cx="170" cy="190" r="16" fill="#ff9f1c" fill-opacity="0.5" stroke="#ff9f1c"/>
            <line x1="186" y1="70" x2="380" y2="35" stroke="#5a6a8a"/><line x1="186" y1="70" x2="380" y2="105" stroke="#5a6a8a"/>
            <line x1="186" y1="190" x2="380" y2="155" stroke="#5a6a8a"/><line x1="186" y1="190" x2="380" y2="225" stroke="#5a6a8a"/>
            <text x="250" y="44" class="t-small">Strong ${Math.round(p * 100)}%</text><text x="250" y="104" class="t-small">Weak ${Math.round(q * 100)}%</text>
            <text x="250" y="164" class="t-small">Strong ${Math.round(p * 100)}%</text><text x="250" y="224" class="t-small">Weak ${Math.round(q * 100)}%</text>
            ${node(382, 35, '$200k', '', '#118ab2')}${node(382, 105, '$90k', '', '#118ab2')}${node(382, 155, '$120k', '', '#118ab2')}${node(382, 225, '$60k', '', '#118ab2')}
            <text x="170" y="24" text-anchor="middle" class="t-strong t-small" style="fill:${best === 'B' ? '#06d6a0' : 'var(--text-secondary)'}">EMV ${money(emvB * 1000)}</text>
            <text x="170" y="246" text-anchor="middle" class="t-strong t-small" style="fill:${best === 'U' ? '#06d6a0' : 'var(--text-secondary)'}">EMV ${money(emvU * 1000)}</text>`;
          dout.innerHTML = `<span class="big" style="color:#06d6a0">Choose: ${best === 'B' ? 'Build new plant' : 'Upgrade old plant'}</span>
            Build = (${p.toFixed(2)} × 200) + (${q.toFixed(2)} × 90) − ${bc} = <b>${money(emvB * 1000)}</b><br>
            Upgrade = (${p.toFixed(2)} × 120) + (${q.toFixed(2)} × 60) − ${uc} = <b>${money(emvU * 1000)}</b><br>
            <span style="color:var(--text-secondary)">Exam method: multiply each outcome by its probability, add them up, subtract the investment, then pick the highest net EMV (or the lowest cost when the tree shows costs).</span>`;
        };
        [pIn, bIn, uIn].forEach(el => el.addEventListener('input', updateDt)); updateDt();
      },
      quiz: [
        { q: 'A risk that was identified during planning, a key vendor going bankrupt, has just occurred. What should the project manager do FIRST?', o: ['Call an emergency meeting with the sponsor', 'Make sure the risk owner implements the planned response documented in the risk register', 'Create a workaround', 'Re-run quantitative risk analysis'], a: 1, why: 'The risk was identified and has a planned response, so <strong>implement the risk response</strong> through the risk owner. Workarounds are for <strong>unidentified</strong> risks.' },
        { q: 'A risk that nobody identified has occurred and is delaying the critical path. What is the BEST action?', o: ['Implement a workaround, then update the risk register and lessons learned', 'Use management reserve without telling anyone', 'Wait for the next monthly risk review', 'Ask the team to work overtime indefinitely'], a: 0, why: 'An unplanned response to an unidentified risk that has occurred is a <strong>workaround</strong>. Then document it.' },
        { q: 'The project buys insurance against storm damage on a construction site. Which strategy is this?', o: ['Avoid', 'Mitigate', 'Transfer', 'Accept'], a: 2, why: 'Insurance <strong>transfers</strong> the financial impact to a third party for a premium. The risk itself still exists.' },
        { q: 'There is a 30% chance of a $40,000 penalty and a 20% chance of a $10,000 early-completion bonus. What is the combined EMV?', o: ['−$14,000', '−$10,000', '+$2,000', '−$12,000'], a: 1, why: '(0.30 × −40,000) + (0.20 × +10,000) = −12,000 + 2,000 = <strong>−$10,000</strong>.' },
        { q: 'Installing a backup generator to mitigate power outages creates a new fire-safety risk. What is the fire-safety risk called?', o: ['Residual risk', 'Secondary risk', 'Overall project risk', 'Trigger'], a: 1, why: 'A new risk that comes from implementing a response is a <strong>secondary risk</strong>. Whatever risk of power loss remains is the residual risk.' },
        { q: 'A risk is identified that would affect the entire program, not just your project, and handling it is outside your authority. Which strategy applies?', o: ['Accept', 'Escalate', 'Exploit', 'Mitigate'], a: 1, why: '<strong>Escalate</strong> when the response is outside the PM\'s authority or project scope. The program or portfolio manager then owns it.' }
      ]
    },

    // ─────────────────────────── 5
    {
      id: 'kanban', icon: '📋', minutes: 20,
      title: 'Kanban & Flow',
      summary: 'Pull systems, WIP limits, an interactive board, Little\'s Law and how to read a cumulative flow diagram.',
      body: () => [
        block('kb-what', '📋 What Kanban is (and isn\'t)', `
          <p class="ll-lead">Kanban (Japanese for "visual signal" or "card") came from the Toyota Production System. David J. Anderson adapted it for knowledge work. It is a <strong>flow-based, pull</strong> method with <strong>no prescribed roles or time-boxes</strong>.</p>
          <div class="ll-grid-2">
            ${mini('green', 'Core principles', '<ul><li>Start with what you do now</li><li>Agree to pursue incremental, evolutionary change</li><li>Respect current processes, roles and titles</li><li>Encourage acts of leadership at all levels</li></ul>')}
            ${mini('blue', 'Core practices', '<ul><li><strong>Visualize</strong> the workflow (the board)</li><li><strong>Limit WIP</strong></li><li><strong>Manage flow</strong></li><li><strong>Make policies explicit</strong> (e.g. a Definition of Done per column)</li><li><strong>Implement feedback loops</strong></li><li><strong>Improve collaboratively</strong>, evolve experimentally</li></ul>')}
          </div>
          ${table(['', 'Kanban', 'Scrum'], [
            ['Cadence', 'Continuous flow', 'Fixed-length sprints'],
            ['Roles', 'None required', 'Product Owner, Scrum Master, Developers'],
            ['Change', 'Anytime, as capacity frees up', 'Normally between sprints'],
            ['Key metric', 'Lead time, cycle time, throughput', 'Velocity'],
            ['WIP control', 'Explicit WIP limits per column', 'Limited by sprint commitment']
          ])}
        `),
        block('kb-board', '🧑‍💻 Try it: a Kanban board with WIP limits', `
          <p>Click a card to <strong>pull</strong> it into the next column. Try to move work while the limits are enforced, then switch them off and watch what happens.</p>
          <label style="display:flex;gap:8px;align-items:center;font-size:0.84rem;color:var(--text-secondary);margin-top:8px"><input type="checkbox" id="llWipToggle" checked> Enforce WIP limits</label>
          <div class="ll-kanban" id="llKanban"></div>
          <div class="ll-kmsg" id="llKmsg">Tip: a card moves only if the next column has free capacity. That is a pull system.</div>
          <div class="ll-kstats" id="llKstats"></div>
          <div style="margin-top:10px"><button class="ll-btn sm" id="llKreset">↺ Reset board</button></div>
          ${exam('Scenario: <em>"The team starts many items but finishes few, and cycle time keeps growing."</em> Answer: <strong>introduce or lower WIP limits</strong>: "stop starting, start finishing".')}
        `),
        block('kb-metrics', '⏱️ Flow metrics and Little\'s Law', `
          <div class="ll-grid-3">
            ${mini('blue', 'Lead time', '<p>From <strong>customer request</strong> (item enters the backlog) to <strong>delivery</strong>. This is what the customer experiences.</p>')}
            ${mini('green', 'Cycle time', '<p>From <strong>work started</strong> to <strong>work finished</strong>. This is what the team controls.</p>')}
            ${mini('purple', 'Throughput', '<p>The number of items finished per unit of time (e.g. 5 per week).</p>')}
          </div>
          <h4>Little's Law calculator</h4>
          <p><strong>Average cycle time = Average WIP ÷ Average throughput</strong>. Cutting WIP cuts cycle time.</p>
          <div class="ll-controls">${num('llLlWip', 'Average WIP (items)', 12)}${num('llLlThr', 'Throughput (items / day)', 3, 0.5)}</div>
          <div class="ll-result" id="llLlOut"></div>
        `),
        block('kb-cfd', '📈 Reading a cumulative flow diagram (CFD)', `
          ${figure(svgCFD(), 'A CFD stacks the cumulative count of items in each state over time.')}
          <ul>
            <li><strong>Vertical distance</strong> between bands = <strong>WIP</strong> at that moment.</li>
            <li><strong>Horizontal distance</strong> = approximate <strong>cycle or lead time</strong>.</li>
            <li>A <strong>widening band</strong> means work is piling up there: a <strong>bottleneck</strong> just downstream.</li>
            <li>A <strong>flat "Done" line</strong> means nothing is being delivered.</li>
            <li>Smooth, parallel bands mean stable, predictable flow.</li>
          </ul>
          ${memory('<strong>Recap:</strong> Kanban = visualize, limit WIP, manage flow, pull. No roles or sprints. Lead time is measured from request, cycle time from start. Little\'s Law: CT = WIP ÷ Throughput. A widening CFD band = bottleneck.')}
        `)
      ],
      mount(root) {
        const COLS = [['Backlog', Infinity], ['Ready', 3], ['Doing', 2], ['Testing', 2], ['Done', Infinity]];
        const NAMES = ['Login page', 'Search API', 'Payment flow', 'Profile edit', 'Email alerts', 'Dark mode', 'Export CSV', 'Audit log', 'Help center', 'Onboarding'];
        let board, moves, msgEl = $(root, '#llKmsg');
        const reset = () => {
          board = [NAMES.slice(3), [NAMES[2]], [NAMES[1]], [NAMES[0]], []];
          moves = 0; msgEl.className = 'll-kmsg'; msgEl.textContent = 'Tip: a card moves only if the next column has free capacity. That is a pull system.'; draw();
        };
        const enforce = () => $(root, '#llWipToggle').checked;
        const draw = () => {
          const k = $(root, '#llKanban');
          k.innerHTML = COLS.map(([name, lim], c) => {
            const n = board[c].length, state = lim !== Infinity && n > lim ? 'over' : lim !== Infinity && n === lim ? 'full' : '';
            return `<div class="ll-kcol ${state}"><div class="ll-khead"><span>${name}</span><span>${lim === Infinity ? n : n + '/' + lim}</span></div>
              ${board[c].map((t, r) => `<button class="ll-kcard" data-c="${c}" data-r="${r}" ${c === 4 ? 'disabled' : ''}>${t}</button>`).join('')}</div>`;
          }).join('');
          const wip = board[1].length + board[2].length + board[3].length;
          const over = !enforce() && (board[2].length > 2 || board[3].length > 2);
          $(root, '#llKstats').innerHTML = `<span>WIP: <b>${wip}</b></span><span>Done: <b>${board[4].length}</b></span><span>Moves: <b>${moves}</b></span>` +
            (over ? '<span style="color:#ef476f">⚠ Over limit: more context-switching, longer cycle time (Little\'s Law)</span>' : '');
        };
        $(root, '#llKanban').addEventListener('click', e => {
          const b = e.target.closest('.ll-kcard'); if (!b || b.disabled) return;
          const c = +b.dataset.c, r = +b.dataset.r, next = c + 1, lim = COLS[next][1];
          if (enforce() && board[next].length >= lim) {
            msgEl.className = 'll-kmsg warn';
            msgEl.textContent = `⛔ "${COLS[next][0]}" is at its WIP limit (${lim}). Finish something downstream first. Swarm on the bottleneck.`;
            return;
          }
          const [card] = board[c].splice(r, 1); board[next].push(card); moves++;
          msgEl.className = 'll-kmsg';
          msgEl.textContent = next === 4 ? `✅ "${card}" delivered. Finishing work frees capacity upstream.` : `➡️ "${card}" pulled into ${COLS[next][0]}.`;
          draw();
        });
        $(root, '#llWipToggle').addEventListener('change', draw);
        $(root, '#llKreset').addEventListener('click', reset);
        reset();

        const w = $(root, '#llLlWip'), t = $(root, '#llLlThr'), o = $(root, '#llLlOut');
        const upd = () => {
          const wip = +w.value, thr = +t.value;
          o.innerHTML = thr > 0 ? `<span class="big">Average cycle time ≈ ${(wip / thr).toFixed(1)} days</span>${wip} items in progress ÷ ${thr} items finished per day. Halve the WIP to ${wip / 2} and cycle time drops to ${(wip / 2 / thr).toFixed(1)} days, with no extra effort.` : 'Enter a throughput above zero.';
        };
        [w, t].forEach(el => el.addEventListener('input', upd)); upd();
      },
      quiz: [
        { q: 'A support team has 25 tickets "in progress" across 5 people. Few tickets close each week and customers complain about delays. What should the PM or agile coach suggest FIRST?', o: ['Hire more staff', 'Introduce WIP limits so the team finishes work before starting new work', 'Switch to two-week sprints', 'Escalate to the sponsor'], a: 1, why: 'Too much WIP causes context-switching and long cycle times. <strong>Limiting WIP</strong> is the core Kanban fix: "stop starting, start finishing".' },
        { q: 'A team has an average of 12 items in progress and completes 3 items per day. Using Little\'s Law, what is the average cycle time?', o: ['36 days', '9 days', '4 days', '0.25 days'], a: 2, why: 'Cycle time = WIP ÷ throughput = 12 ÷ 3 = <strong>4 days</strong>.' },
        { q: 'On a cumulative flow diagram, the "Development" band is getting steadily wider while the "Done" band grows slowly. What does this show?', o: ['The team is ahead of schedule', 'A bottleneck: work is piling up between development and the next stage', 'Velocity is increasing', 'Scope has been reduced'], a: 1, why: 'A <strong>widening band</strong> means WIP is accumulating in that state, a sign of a <strong>bottleneck</strong> downstream.' },
        { q: 'Which statement about the Kanban method is correct?', o: ['It requires a Scrum Master and fixed-length sprints', 'It prescribes new job titles before you start', 'It starts with the current process, visualizes work and limits WIP, with no prescribed roles or time-boxes', 'It forbids changing priorities once work has started'], a: 2, why: 'Kanban starts with what you do now and evolves incrementally. It has <strong>no prescribed roles or iterations</strong>.' },
        { q: 'A customer asks how long a new request will take, from the moment they submit it until it is delivered. Which metric answers this?', o: ['Cycle time', 'Lead time', 'Velocity', 'Takt time'], a: 1, why: '<strong>Lead time</strong> runs from the request to delivery, which is what the customer experiences. Cycle time starts only when work begins.' }
      ]
    },

    // ─────────────────────────── 6
    {
      id: 'lean', icon: '♻️', minutes: 20,
      title: 'Lean Thinking',
      summary: 'The five Lean principles, the eight wastes (and their software equivalents), value stream mapping and how Lean, Agile and Kanban relate.',
      body: () => [
        block('lean-family', '🌳 Lean, Agile and Kanban: the family tree', `
          ${figure(svgLeanVenn(), 'Based on the Agile Practice Guide: Lean is the umbrella; Agile and the Kanban method are forms of lean thinking.')}
          <p>Lean came from the Toyota Production System. Agile and Kanban share its focus on <strong>value, flow and eliminating waste</strong>. Scrum, XP and the other frameworks sit inside Agile.</p>
        `),
        block('lean-principles', '5️⃣ The five Lean principles (Womack & Jones)', `
          <div class="ll-grid-3">
            ${mini('green', '1 · Identify value', '<p>Value is defined by the <strong>customer</strong>: what they are willing to pay for.</p>')}
            ${mini('blue', '2 · Map the value stream', '<p>Lay out every step from request to delivery and spot the waste.</p>')}
            ${mini('purple', '3 · Create flow', '<p>Remove interruptions, queues and handoffs so work moves smoothly.</p>')}
            ${mini('amber', '4 · Establish pull', '<p>Produce only when there is demand (just-in-time). WIP limits create pull.</p>')}
            ${mini('red', '5 · Seek perfection', '<p>Continuous improvement (<strong>kaizen</strong>). Repeat the cycle.</p>')}
          </div>
          <h4>Lean software development (Poppendieck)</h4>
          <p>Eliminate waste · Build quality in · Create knowledge (amplify learning) · <strong>Defer commitment</strong> (decide at the last responsible moment) · Deliver fast · Respect people · Optimize the whole.</p>
        `),
        block('lean-waste', '🗑️ The eight wastes: TIMWOODS', `
          ${table(['Waste (muda)', 'Manufacturing example', 'Project / software equivalent'], [
            ['<strong>T</strong>ransportation', 'Moving parts between buildings', '<strong>Handoffs</strong> between teams or departments'],
            ['<strong>I</strong>nventory', 'Piles of unfinished goods', '<strong>Partially done work</strong>: unmerged code, untested features'],
            ['<strong>M</strong>otion', 'Walking to fetch tools', 'Searching for information, tool switching'],
            ['<strong>W</strong>aiting', 'Machines idle', '<strong>Delays</strong>: waiting for approvals, environments, decisions'],
            ['<strong>O</strong>verproduction', 'Making more than ordered', '<strong>Extra features</strong> nobody asked for (gold plating)'],
            ['<strong>O</strong>ver-processing', 'Polishing hidden surfaces', 'Excessive documentation or approvals'],
            ['<strong>D</strong>efects', 'Scrap and rework', 'Bugs, rework, escaped defects'],
            ['<strong>S</strong>kills (unused talent)', 'Ignoring operator ideas', 'Not using team knowledge; <strong>task switching</strong> and <strong>relearning</strong>']
          ])}
          ${callout('memory', '🧠 Also know', '<strong>Muda</strong> = waste · <strong>Mura</strong> = unevenness · <strong>Muri</strong> = overburden. <strong>Kaizen</strong> = continuous improvement. <strong>Gemba</strong> = go where the work happens. <strong>Jidoka/Andon</strong> = stop the line on a defect. <strong>Poka-yoke</strong> = mistake-proofing.')}
          ${trap('<strong>Gold plating</strong> (adding unrequested extras) is waste and a scope-management failure. PMI never sees it as "exceeding expectations".')}
        `),
        block('lean-vsm', '🗺️ Value stream mapping and process cycle efficiency', `
          ${figure(svgVSM(), 'A value stream map separates value-adding time from waiting time.')}
          <p><strong>Process Cycle Efficiency (PCE) = Value-added time ÷ Total lead time</strong>. In most knowledge work the time is dominated by <em>waiting</em>, not working.</p>
          <div class="ll-controls">${num('llVsmVa', 'Value-added time (days)', 8, 0.5)}${num('llVsmWait', 'Waiting / queue time (days)', 15, 0.5)}</div>
          <div class="ll-result" id="llVsmOut"></div>
          ${exam('Scenario: <em>"Work spends days waiting for sign-off between each step."</em> Waste = <strong>waiting/delays</strong>. Fix: map the value stream, reduce handoffs and approvals, and empower the team.')}
          ${memory('<strong>Recap:</strong> Value → value stream → flow → pull → perfection. Waste = TIMWOODS. PCE = value-add ÷ lead time. Lean is the umbrella over Agile and Kanban.')}
        `)
      ],
      mount(root) {
        const va = $(root, '#llVsmVa'), wt = $(root, '#llVsmWait'), o = $(root, '#llVsmOut');
        const upd = () => {
          const v = +va.value, w = +wt.value, total = v + w;
          const pce = total > 0 ? v / total * 100 : 0;
          o.innerHTML = `<span class="big" style="color:${pce >= 25 ? '#06d6a0' : '#ff9f1c'}">PCE = ${pce.toFixed(0)}%</span>${v} value-adding days out of ${total} total lead-time days. ${pce < 25 ? 'Most of the time is waiting. Attack queues, handoffs and approvals before asking people to work faster.' : 'Good flow. Keep looking for remaining queues.'}`;
        };
        [va, wt].forEach(el => el.addEventListener('input', upd)); upd();
      },
      quiz: [
        { q: 'A value stream map shows that each feature waits an average of three days for managerial approval between every stage. Which Lean waste is most evident?', o: ['Overproduction', 'Waiting / delays', 'Motion', 'Defects'], a: 1, why: 'Idle time between steps is the waste of <strong>waiting</strong> (delays in Lean software terms).' },
        { q: 'A developer adds an animated dashboard the customer never requested, believing it will impress them. In Lean terms this is:', o: ['Exceeding expectations, which is good practice', 'Overproduction / extra features (gold plating)', 'Kaizen', 'Pull'], a: 1, why: 'Unrequested features are <strong>overproduction</strong> (extra features). PMI calls this <strong>gold plating</strong>, and it is discouraged.' },
        { q: 'A process has 6 days of value-added work and a total lead time of 30 days. What is the process cycle efficiency?', o: ['5%', '20%', '24%', '500%'], a: 1, why: 'PCE = 6 ÷ 30 = <strong>20%</strong>.' },
        { q: 'The Lean principle "defer commitment" means:', o: ['Avoid making decisions', 'Make irreversible decisions at the last responsible moment, when the most information is available', 'Delay the project start', 'Postpone testing until the end'], a: 1, why: 'Deferring commitment keeps options open until the <strong>last responsible moment</strong>, reducing the risk of committing too early.' },
        { q: 'Which statement best describes the relationship between Lean, Agile and Kanban?', o: ['They are unrelated methods', 'Kanban is a type of Scrum', 'Lean is the broader umbrella; Agile and the Kanban method are forms of lean thinking', 'Agile is the umbrella and Lean is one Scrum practice'], a: 2, why: 'The Agile Practice Guide shows <strong>Lean as the umbrella</strong>, with Agile and the Kanban method inside it.' }
      ]
    },

    // ─────────────────────────── 7
    {
      id: 'scrum', icon: '🏉', minutes: 25,
      title: 'Scrum & Agile Frameworks',
      summary: 'Scrum accountabilities, events and artifacts with a flow diagram, plus XP, DSDM, FDD, Crystal and scaling frameworks.',
      body: () => [
        block('sc-manifesto', '📜 Agile Manifesto: four values', `
          <div class="ll-grid-2">
            ${mini('green', 'Individuals and interactions', '<p>over processes and tools</p>')}
            ${mini('green', 'Working software', '<p>over comprehensive documentation</p>')}
            ${mini('green', 'Customer collaboration', '<p>over contract negotiation</p>')}
            ${mini('green', 'Responding to change', '<p>over following a plan</p>')}
          </div>
          <p style="margin-top:10px">The items on the right still have value, but the items on the left are valued <strong>more</strong>. There are also <strong>12 principles</strong>, e.g. deliver frequently, welcome changing requirements, face-to-face conversation, sustainable pace, simplicity, self-organizing teams and regular reflection.</p>
          ${exam('Agile PM = <strong>servant leader</strong>: remove impediments, shield the team, coach, facilitate. Do not assign tasks or command.')}
        `),
        block('sc-flow', '🔄 Scrum at a glance', `
          ${figure(svgScrum(), 'Scrum: three accountabilities, five events, three artifacts, each with a commitment.')}
          <div class="ll-grid-3">
            ${mini('blue', '👤 Product Owner', '<ul><li>Maximizes product value</li><li><strong>Owns and orders the Product Backlog</strong></li><li>One person, not a committee</li><li>Accepts or rejects work against acceptance criteria</li><li>Can cancel a sprint</li></ul>')}
            ${mini('purple', '🧭 Scrum Master', '<ul><li>Servant leader and coach</li><li>Removes impediments</li><li>Facilitates events as needed</li><li>Coaches the organization on Scrum</li></ul>')}
            ${mini('green', '👩‍💻 Developers', '<ul><li>Self-managing and cross-functional</li><li>Own the <strong>Sprint Backlog</strong> and the plan</li><li>Responsible for quality / Definition of Done</li><li>Whole Scrum Team ≈ 10 or fewer people</li></ul>')}
          </div>
          ${table(['Event', 'Time-box (1-month sprint)', 'Purpose'], [
            ['Sprint', '≤ 1 month (often 2 weeks)', 'Container for all other events; fixed length'],
            ['Sprint Planning', '≤ 8 hours', 'Why (Sprint Goal), what (items), how (plan)'],
            ['Daily Scrum', '15 minutes', 'Developers inspect progress toward the Sprint Goal and adapt the plan'],
            ['Sprint Review', '≤ 4 hours', 'Inspect the increment with stakeholders; adapt the backlog'],
            ['Sprint Retrospective', '≤ 3 hours', 'Improve how the team works (people, process, tools)']
          ])}
          ${trap('The Daily Scrum is <strong>not a status meeting for the PM</strong> and not a problem-solving session. Keep it to 15 minutes and take detailed discussions offline afterwards.')}
        `),
        block('sc-other', '🧰 Other frameworks you will see on the exam', `
          ${table(['Framework', 'Key ideas'], [
            ['<strong>XP (eXtreme Programming)</strong>', 'Pair programming, test-driven development, continuous integration, refactoring, small releases, collective code ownership, sustainable pace, simple design, spikes'],
            ['<strong>DSDM</strong>', 'Fixes time, cost and quality; <strong>varies features</strong> using <strong>MoSCoW</strong>; time-boxing; business-value focus'],
            ['<strong>FDD (Feature-Driven Development)</strong>', 'Develop an overall model, build a feature list, then plan, design and build by feature; class/code ownership'],
            ['<strong>Crystal</strong>', 'A family of methods; colour by team size and criticality (Clear, Yellow, Orange, Red…)'],
            ['<strong>Scrumban</strong>', 'Scrum structure plus Kanban flow and WIP limits'],
            ['<strong>Scrum of Scrums</strong>', 'Representatives of several Scrum teams coordinate dependencies'],
            ['<strong>SAFe</strong>', 'Scaled Agile Framework: Agile Release Trains, PI planning, portfolio/program levels'],
            ['<strong>LeSS</strong>', 'Large-Scale Scrum: one Product Owner and one product backlog for many teams'],
            ['<strong>Disciplined Agile (DA)</strong>', 'PMI\'s toolkit: "choose your WoW" (way of working); context counts']
          ])}
          ${memory('<strong>Recap:</strong> PO = what and in what order (backlog). Developers = how (sprint backlog). SM = servant leader removing impediments. Product Goal ← Product Backlog, Sprint Goal ← Sprint Backlog, Definition of Done ← Increment. DSDM = MoSCoW with fixed time and cost. XP = engineering practices.')}
        `)
      ],
      quiz: [
        { q: 'On a Scrum team, who is accountable for ordering the product backlog?', o: ['The Scrum Master', 'The Developers', 'The Product Owner', 'The project sponsor'], a: 2, why: 'The <strong>Product Owner</strong> is accountable for the Product Backlog, including its ordering, to maximize value.' },
        { q: 'The Daily Scrum regularly runs 45 minutes because developers debate technical solutions. As servant leader, what should you do?', o: ['Cancel the Daily Scrum', 'Coach the team to keep it to 15 minutes and hold detailed discussions with the relevant people afterwards', 'Run the meeting yourself and assign tasks', 'Extend it to one hour'], a: 1, why: 'The Daily Scrum is time-boxed to 15 minutes for planning the next 24 hours. Problem-solving happens <strong>after</strong>, with only the people involved.' },
        { q: 'Mid-sprint, a senior stakeholder asks a developer to add a new report "quickly". What should happen?', o: ['The developer adds it to keep the stakeholder happy', 'The stakeholder takes the request to the Product Owner, who adds it to the product backlog and orders it', 'The Scrum Master approves it', 'The sprint is cancelled immediately'], a: 1, why: 'New work goes through the <strong>Product Owner</strong> and the product backlog. The Sprint Goal should be protected.' },
        { q: 'A developer is blocked because another department will not grant database access. What is the Scrum Master\'s BEST action?', o: ['Tell the developer to wait', 'Work with the other department to remove the impediment', 'Reassign the developer to another project', 'Report the developer to their functional manager'], a: 1, why: 'Removing impediments is a core <strong>servant-leader</strong> duty of the Scrum Master or agile PM.' },
        { q: 'Which framework fixes time and cost and uses MoSCoW prioritization to vary the features delivered?', o: ['XP', 'FDD', 'DSDM', 'Crystal'], a: 2, why: '<strong>DSDM</strong> fixes time, cost and quality and flexes features using <strong>MoSCoW</strong>.' },
        { q: 'Five Scrum teams work on one product and keep running into integration dependencies. What would BEST help coordination?', o: ['Merge everyone into a single 50-person team', 'A Scrum of Scrums, or a scaling framework such as LeSS or SAFe', 'Stop daily stand-ups', 'Have each team pick its own sprint length and product owner'], a: 1, why: 'A <strong>Scrum of Scrums</strong> or a scaling framework coordinates dependencies across teams working on one product.' }
      ]
    },

    // ─────────────────────────── 8
    {
      id: 'agile-metrics', icon: '📊', minutes: 25,
      title: 'Agile Estimation, Prioritization & Metrics',
      summary: 'User stories, story points, planning poker, MoSCoW, Kano, WSJF, velocity, burndown and burnup charts, plus a release forecast calculator.',
      body: () => [
        block('am-stories', '📝 User stories and readiness', `
          <p class="ll-lead">"As a <em>&lt;role&gt;</em>, I want <em>&lt;goal&gt;</em> so that <em>&lt;benefit&gt;</em>."</p>
          <div class="ll-grid-3">
            ${mini('green', 'INVEST', '<p><strong>I</strong>ndependent · <strong>N</strong>egotiable · <strong>V</strong>aluable · <strong>E</strong>stimable · <strong>S</strong>mall · <strong>T</strong>estable</p>')}
            ${mini('blue', '3 Cs', '<p><strong>Card</strong> (short description) · <strong>Conversation</strong> (details through discussion) · <strong>Confirmation</strong> (acceptance criteria)</p>')}
            ${mini('purple', 'DoR vs DoD', '<p><strong>Definition of Ready:</strong> a story is clear enough to start. <strong>Definition of Done:</strong> the quality checklist every increment must meet.</p>')}
          </div>
          <p style="margin-top:10px"><strong>Epic</strong> (big) → <strong>Feature</strong> → <strong>User story</strong> → tasks. <strong>MVP</strong> = the smallest product that tests a hypothesis or delivers core value. <strong>MMF</strong> = minimum marketable feature.</p>
        `),
        block('am-estimate', '🃏 Relative estimation', `
          <ul>
            <li><strong>Story points</strong>: relative size (effort + complexity + uncertainty), usually on the <strong>Fibonacci</strong> scale 1, 2, 3, 5, 8, 13, 21…</li>
            <li><strong>Planning poker</strong>: everyone reveals cards at once to avoid anchoring, then discusses outliers. A Wideband Delphi variant.</li>
            <li><strong>T-shirt sizing</strong> (XS–XL) and <strong>affinity estimating</strong>: fast, for large backlogs.</li>
            <li><strong>Ideal days</strong>: time without interruptions (less common).</li>
          </ul>
          ${trap('<strong>Never compare velocity between teams</strong>. Story points are team-specific. Never use velocity to judge individual performance.')}
        `),
        block('am-prio', '🥇 Prioritization techniques', `
          <div class="ll-grid-2">
            ${mini('green', 'MoSCoW', '<p><strong>M</strong>ust have · <strong>S</strong>hould have · <strong>C</strong>ould have · <strong>W</strong>on\'t have (this time).</p>')}
            ${mini('blue', 'WSJF (SAFe)', '<p>Weighted Shortest Job First = <strong>Cost of Delay ÷ Job Size (duration)</strong>. Highest score first.</p>')}
            ${mini('purple', 'Value vs effort / risk', '<p>Do high-value, low-effort items first. High-risk, high-value items go <strong>early</strong> to reduce risk.</p>')}
            ${mini('amber', 'Other techniques', '<p>100-point method, dot voting, paired comparison, buy-a-feature.</p>')}
          </div>
          ${figure(svgKano(), 'Kano model: not every feature affects satisfaction the same way.')}
        `),
        block('am-metrics', '📉 Tracking progress', `
          ${figure(svgBurn(), 'Burndown shows work remaining; burnup shows work done against total scope.')}
          ${table(['Metric', 'What it tells you', 'Watch out for'], [
            ['<strong>Velocity</strong>', 'Points completed per iteration; used to forecast', 'Stabilizes after 3–5 sprints; team-specific'],
            ['<strong>Burndown</strong>', 'Remaining work vs ideal line', 'Scope changes are hidden'],
            ['<strong>Burnup</strong>', 'Completed work and total scope as separate lines', 'Shows scope creep clearly'],
            ['<strong>CFD</strong>', 'WIP and flow by state', 'Widening band = bottleneck'],
            ['<strong>Cycle / lead time</strong>', 'Speed of flow', 'Use averages and trends'],
            ['<strong>Escaped defects</strong>', 'Quality reaching customers', 'Signals a weak Definition of Done']
          ])}
          <h4>Release forecast calculator</h4>
          <div class="ll-controls">${num('llRfPts', 'Remaining backlog (story points)', 240)}${num('llRfVel', 'Average velocity (points / sprint)', 30)}${num('llRfLen', 'Sprint length (weeks)', 2)}</div>
          <div class="ll-result" id="llRfOut"></div>
          ${memory('<strong>Recap:</strong> INVEST, 3 Cs, DoR/DoD. Points are relative and Fibonacci. Planning poker avoids anchoring. MoSCoW, Kano, WSJF = CoD ÷ size. Sprints needed = backlog ÷ velocity, rounded up. Burnup shows scope changes.')}
        `)
      ],
      mount(root) {
        const p = $(root, '#llRfPts'), v = $(root, '#llRfVel'), l = $(root, '#llRfLen'), o = $(root, '#llRfOut');
        const upd = () => {
          const pts = +p.value, vel = +v.value, len = +l.value;
          if (vel <= 0) { o.textContent = 'Enter a velocity above zero.'; return; }
          const sprints = Math.ceil(pts / vel);
          o.innerHTML = `<span class="big">${sprints} sprints ≈ ${sprints * len} weeks</span>${pts} ÷ ${vel} = ${(pts / vel).toFixed(2)}, rounded <strong>up</strong> to ${sprints} (you can't run a partial sprint). Give a range based on the lowest and highest recent velocity, not a single date.`;
        };
        [p, v, l].forEach(el => el.addEventListener('input', upd)); upd();
      },
      quiz: [
        { q: 'A team\'s average velocity is 30 points per two-week sprint and 240 points remain in the release backlog. How many sprints will the release take?', o: ['6', '8', '10', '16'], a: 1, why: '240 ÷ 30 = <strong>8 sprints</strong> (about 16 weeks).' },
        { q: 'The sponsor keeps adding scope, but the burndown chart only shows the team "falling behind". Which chart would show the scope changes more clearly?', o: ['Burnup chart', 'Gantt chart', 'Pareto chart', 'Control chart'], a: 0, why: 'A <strong>burnup chart</strong> plots completed work and total scope as separate lines, so added scope is visible.' },
        { q: 'In the Kano model, an unexpected feature that delights customers when present but causes no dissatisfaction when absent is called:', o: ['A basic (must-be) feature', 'A performance feature', 'An excitement (delighter) feature', 'A reverse feature'], a: 2, why: '<strong>Excitement / delighter</strong> features raise satisfaction sharply when present, and nobody misses them when absent.' },
        { q: 'A functional manager wants to compare Team A (velocity 45) with Team B (velocity 20) to decide which is more productive. What should the agile PM say?', o: ['Team A is more than twice as productive', 'Velocity is team-specific and should not be compared across teams', 'Team B should be disbanded', 'Use lines of code instead'], a: 1, why: 'Story points are <strong>relative to each team</strong>, so comparing velocity between teams is meaningless and harmful.' },
        { q: 'In INVEST, what does the "N" stand for?', o: ['Necessary', 'Negotiable', 'Numbered', 'New'], a: 1, why: 'Stories are <strong>Negotiable</strong>: they invite conversation rather than acting as fixed contracts.' },
        { q: 'Feature X has a cost of delay of 20 and a job size of 5. Feature Y has a cost of delay of 30 and a job size of 10. Using WSJF, which comes first?', o: ['X (WSJF 4)', 'Y (WSJF 3)', 'They tie', 'Y, because its cost of delay is higher'], a: 0, why: 'WSJF = CoD ÷ size. X = 20 ÷ 5 = 4; Y = 30 ÷ 10 = 3. <strong>X</strong> has the higher score.' }
      ]
    },

    // ─────────────────────────── 9
    {
      id: 'playbook', icon: '🏆', minutes: 30,
      title: 'Exam Decision Playbook',
      summary: 'How to think like PMI on situational questions: the decision sequence, ranking rules, keyword cues and a scenario drill.',
      body: () => [
        block('pb-sequence', '🧠 The PMI decision sequence', `
          <p class="ll-lead">Most PMP questions are <strong>situational</strong>: "What should the project manager do NEXT / FIRST / BEST?" Use this sequence to eliminate answers:</p>
          <div class="ll-grid-3">
            ${mini('blue', '1 · Assess', '<p>Understand the situation and the facts. Analyze the impact <em>before</em> acting.</p>')}
            ${mini('purple', '2 · Check the plan', '<p>What do the plans and documents say (risk register, change process, communications plan, contract)?</p>')}
            ${mini('green', '3 · Collaborate', '<p>Talk to the people involved, privately and face to face where possible. Empower the team.</p>')}
            ${mini('amber', '4 · Act within your authority', '<p>Take the proactive step the PM can take: raise a change request, coach, facilitate, update documents.</p>')}
            ${mini('red', '5 · Escalate last', '<p>Only when the issue is beyond your authority or the team cannot resolve it.</p>')}
          </div>
          ${trap('Answers to eliminate: going straight to the <strong>sponsor</strong> or <strong>HR</strong>, ignoring the problem, unilaterally changing the baseline, "just do it yourself", firing people, and blaming. The PMI PM is <strong>proactive, collaborative and process-aware</strong>.')}
        `),
        block('pb-rules', '📐 Ranking rules of thumb', `
          ${table(['Situation', 'PMI-preferred answer'], [
            ['Conflict between team members', 'Let them try to resolve it; if needed, facilitate <strong>collaborate / problem-solve</strong> (win-win). Avoid forcing.'],
            ['Requested change (predictive)', '<strong>Analyze impact → change request → CCB</strong> → update baselines and communicate'],
            ['Requested change (agile)', 'Send it to the <strong>Product Owner</strong> → product backlog → prioritized'],
            ['Team member under-performing', 'Talk <strong>privately</strong> to find the root cause; coach, train or support'],
            ['Stakeholder resistant or disengaged', 'Meet to <strong>understand their concerns</strong>; update the stakeholder engagement plan'],
            ['Vendor issue', 'Review the <strong>contract</strong> terms first; use the agreed procedures'],
            ['New regulation or law', 'It is mandatory: assess impact → change request / backlog → comply'],
            ['Agile team asks what to work on', 'The team <strong>self-organizes</strong>; the PM facilitates and does not assign'],
            ['Remote / multicultural team', 'Team charter, ground rules, overlap hours, collaboration tools, cultural awareness']
          ])}
          ${exam('Keyword cues: <strong>"FIRST"</strong> usually means assess or analyze. <strong>"BEST"</strong> means the most proactive and collaborative option. <strong>"agile team"</strong> means servant leadership and self-organization. <strong>"predictive"</strong> means follow the formal process and plans.')}
        `),
        block('pb-mindset', '💡 Mindset checklist before choosing an answer', `
          <ul>
            <li>Does it <strong>solve the root cause</strong>, not just the symptom?</li>
            <li>Is it within the <strong>PM's authority</strong>?</li>
            <li>Does it follow the <strong>plan or process</strong> (or the agile values, if agile)?</li>
            <li>Does it <strong>empower and respect</strong> the team and stakeholders?</li>
            <li>Is it <strong>proactive</strong> (prevent) rather than reactive (cure)?</li>
            <li>Does it keep things <strong>transparent</strong>, with documents updated and lessons learned recorded?</li>
          </ul>
          ${memory('<strong>Assess → Plan → Collaborate → Act → Escalate.</strong> Servant leader in agile; process steward in predictive; always ethical (PMI Code of Ethics: responsibility, respect, fairness, honesty).')}
        `)
      ],
      quiz: [
        { q: 'Two senior developers disagree strongly about the system architecture and the debate is slowing the team. What should the PM do FIRST?', o: ['Choose the architecture yourself to save time', 'Escalate to the sponsor', 'Meet with both developers to understand each position and facilitate a collaborative solution', 'Remove one developer from the project'], a: 2, why: 'PMI prefers <strong>collaborate / problem-solve</strong>: understand the positions and facilitate a win-win solution, ideally one the team reaches itself.' },
        { q: 'On a predictive project, the sponsor emails asking for a significant new feature. What should the PM do NEXT?', o: ['Add it to the schedule immediately', 'Refuse because the scope is baselined', 'Analyze the impact on scope, schedule, cost, risk and quality, then submit a change request to the CCB', 'Ask the team to work overtime to absorb it'], a: 2, why: 'In predictive projects: <strong>assess impact → change request → integrated change control</strong>. Even sponsors follow the process.' },
        { q: 'A team member\'s work quality has dropped noticeably over the past month. What is the BEST first step?', o: ['Report it to HR', 'Discuss it with the team member privately to understand the cause', 'Raise it in the next team meeting', 'Reassign their work without telling them'], a: 1, why: 'Talk <strong>privately</strong> first to find the root cause. Escalation comes later, if at all.' },
        { q: 'Halfway through, a new government regulation affects your product\'s data handling. What should the PM do?', o: ['Ignore it until the next phase', 'Assess its impact and process the required changes, since compliance is mandatory', 'Ask the customer whether they want to comply', 'Cancel the project'], a: 1, why: 'Regulations are <strong>mandatory</strong>. Assess the impact and work it in through the change process or the backlog.' },
        { q: 'An agile team asks the project manager to tell each member which stories to work on this sprint. What should the PM do?', o: ['Assign stories based on each person\'s skills', 'Coach the team to self-organize and choose the work themselves', 'Ask the Product Owner to assign tasks', 'Let the most senior developer decide'], a: 1, why: 'Agile teams are <strong>self-organizing</strong>. The servant-leader PM coaches them and does not assign work.' },
        { q: 'A key stakeholder has stopped attending reviews and is criticizing the project to other executives. What should the PM do?', o: ['Remove them from the communications list', 'Escalate to the sponsor immediately', 'Meet the stakeholder to understand their concerns and update the stakeholder engagement approach', 'Ignore it and focus on delivery'], a: 2, why: 'Engage directly to <strong>understand their concerns</strong>, then adjust the stakeholder engagement plan. Escalation is a later step.' },
        { q: 'A vendor has missed two delivery dates. What should the PM do FIRST?', o: ['Terminate the contract', 'Review the contract terms and agreed procedures for late delivery', 'Find a new vendor', 'Withhold all payments'], a: 1, why: 'Procurement questions start with the <strong>contract</strong>: it defines remedies, penalties and procedures.' },
        { q: 'Your team spans four time zones and misunderstandings are increasing. What is the BEST action?', o: ['Bring everyone to one location permanently', 'Work with the team to set communication norms in a team charter (overlap hours, tools, response times)', 'Increase the number of status reports', 'Let each sub-team work independently'], a: 1, why: 'Agreeing <strong>working agreements and ground rules</strong> (team charter) and using collaboration tools is the proactive, team-empowering answer.' }
      ]
    }
  ];

  // ══════════════════════════════════════════════
  //  RENDERING
  // ══════════════════════════════════════════════

  let root = null;

  function moduleState(id) { return progress.modules[id] || { done: false, best: null }; }

  function renderOverview() {
    const doneCount = MODULES.filter(m => moduleState(m.id).done).length;
    const pct = Math.round(doneCount / MODULES.length * 100);
    const C = 2 * Math.PI * 34;
    const nextIdx = MODULES.findIndex(m => !moduleState(m.id).done);
    root.innerHTML = `
      <div class="ll-progress-card">
        <svg class="ll-ring" viewBox="0 0 84 84" aria-label="${pct}% complete"><circle class="ll-ring-bg" cx="42" cy="42" r="34"/><circle class="ll-ring-fg" cx="42" cy="42" r="34" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct / 100)}" transform="rotate(-90 42 42)"/><text x="42" y="42">${pct}%</text></svg>
        <div class="ll-progress-text">
          <h3>${doneCount === MODULES.length ? '🎉 Path complete. Now take a full mock exam.' : `${doneCount} of ${MODULES.length} modules complete`}</h3>
          <p>Work through the modules in order. Each has diagrams, interactive tools, exam tips and a knowledge check. Score <strong>80%+</strong> on a check to mark its module complete.</p>
        </div>
        ${nextIdx >= 0 ? `<button class="ll-btn primary" data-open="${nextIdx}">${doneCount ? 'Continue' : 'Start'}: ${MODULES[nextIdx].title} →</button>` : '<button class="ll-btn primary" data-goto="quiz">Go to Mock Exam →</button>'}
      </div>
      <div class="ll-path">
        ${MODULES.map((m, i) => {
          const s = moduleState(m.id);
          return `<button class="ll-path-card" data-open="${i}">
            <div class="ll-path-step">Module ${i + 1}</div>
            <h4>${m.icon} ${m.title}</h4>
            <p>${m.summary}</p>
            <div class="ll-path-meta">
              <span class="ll-chip">⏱ ${m.minutes} min</span>
              <span class="ll-chip">❓ ${m.quiz.length} questions</span>
              ${s.done ? '<span class="ll-chip done">✓ Complete</span>' : ''}
              ${s.best !== null ? `<span class="ll-chip score">Best ${s.best}%</span>` : ''}
            </div>
          </button>`;
        }).join('')}
      </div>`;
    updateBadge();
  }

  function renderLesson(idx) {
    const m = MODULES[idx];
    const s = moduleState(m.id);
    const blocks = m.body();
    root.innerHTML = `
      <div class="ll-lesson-top">
        <button class="ll-btn" data-back>← All modules</button>
        <span class="ll-chip">Module ${idx + 1} of ${MODULES.length} · ⏱ ${m.minutes} min${s.done ? ' · ✓ Complete' : ''}</span>
      </div>
      <h2 style="font-size:1.45rem;margin-bottom:6px">${m.icon} ${m.title}</h2>
      <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:14px">${m.summary}</p>
      <div class="ll-toc" id="llToc"></div>
      ${blocks.join('')}
      <div class="ll-block" id="ll-check" data-toc="✅ Knowledge check">
        <h3>✅ Knowledge check</h3>
        <p>Answer each question and read the explanation. PMP-style situational questions often have two plausible answers, so focus on <em>why</em> one is better.</p>
        <div id="llQuiz"></div>
      </div>
      <div class="ll-bottom-nav">
        <button class="ll-btn" ${idx === 0 ? 'disabled' : ''} data-open="${idx - 1}">← Previous</button>
        <button class="ll-btn" data-toggle-done="${idx}">${s.done ? 'Mark as not complete' : 'Mark as complete'}</button>
        ${idx < MODULES.length - 1 ? `<button class="ll-btn primary" data-open="${idx + 1}">Next: ${MODULES[idx + 1].title} →</button>` : '<button class="ll-btn primary" data-back>Finish →</button>'}
      </div>`;
    const toc = $(root, '#llToc');
    toc.innerHTML = Array.from(root.querySelectorAll('[data-toc]')).map(b => `<a href="#" data-jump="${b.id}">${b.dataset.toc.replace(/^\S+\s/, '')}</a>`).join('');
    if (m.mount) m.mount(root);
    mountQuiz(m, $(root, '#llQuiz'));
    window.scrollTo(0, 0);
  }

  function mountQuiz(m, el) {
    const answers = new Array(m.quiz.length).fill(null);
    // Shuffle option order on every attempt so the answer letter can't be memorized.
    const orders = m.quiz.map(q => {
      const idx = q.o.map((_, i) => i);
      for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
      return idx;
    });
    el.innerHTML = m.quiz.map((q, qi) => `
      <div class="ll-quiz-q" data-q="${qi}">
        <p>${qi + 1}. ${q.q}</p>
        ${orders[qi].map((oi, pos) => `<button class="ll-opt" data-q="${qi}" data-o="${oi}">${String.fromCharCode(65 + pos)}. ${q.o[oi]}</button>`).join('')}
        <div class="ll-why-slot"></div>
      </div>`).join('') + '<div id="llScore"></div>';
    el.addEventListener('click', e => {
      const b = e.target.closest('.ll-opt'); if (!b) return;
      const qi = +b.dataset.q, oi = +b.dataset.o;
      if (answers[qi] !== null) return;
      answers[qi] = oi;
      const q = m.quiz[qi], wrap = el.querySelector(`.ll-quiz-q[data-q="${qi}"]`);
      wrap.querySelectorAll('.ll-opt').forEach(x => {
        const o = +x.dataset.o;
        x.disabled = true;
        if (o === q.a) x.classList.add('correct');
        else if (o === oi) x.classList.add('wrong');
      });
      wrap.querySelector('.ll-why-slot').innerHTML = `<div class="ll-why">${oi === q.a ? '✅ Correct.' : '❌ Not quite.'} ${q.why}</div>`;
      if (answers.every(a => a !== null)) finish();
    });
    function finish() {
      const correct = answers.filter((a, i) => a === m.quiz[i].a).length;
      const pct = Math.round(correct / m.quiz.length * 100);
      const st = moduleState(m.id);
      st.best = st.best === null ? pct : Math.max(st.best, pct);
      if (pct >= 80) st.done = true;
      progress.modules[m.id] = st; saveProgress(); updateBadge();
      $(el, '#llScore').innerHTML = `<div class="ll-score ${pct >= 80 ? 'pass' : 'fail'}">${pct >= 80 ? '🎉' : '📚'} You scored ${correct}/${m.quiz.length} (${pct}%). ${pct >= 80 ? 'Module complete. Move on to the next one.' : 'Review the sections above and try again. 80% marks the module complete.'}
        <div style="margin-top:10px"><button class="ll-btn sm" data-retry>↺ Retry questions</button></div></div>`;
    }
  }

  function updateBadge() {
    const badge = document.getElementById('learnNavBadge');
    if (badge) badge.textContent = `${MODULES.filter(m => moduleState(m.id).done).length}/${MODULES.length}`;
  }

  function openModule(idx) {
    if (idx < 0 || idx >= MODULES.length) return;
    progress.last = idx; saveProgress();
    renderLesson(idx);
  }

  function init() {
    root = document.getElementById('learnRoot');
    if (!root) return;
    root.classList.add('ll-root');
    root.addEventListener('click', e => {
      const t = e.target.closest('[data-open],[data-back],[data-toggle-done],[data-jump],[data-retry],[data-goto]');
      if (!t) return;
      if (t.dataset.jump) { e.preventDefault(); const el = document.getElementById(t.dataset.jump); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
      if (t.hasAttribute('data-back')) { renderOverview(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      if (t.dataset.goto) { const nav = document.querySelector(`.nav-item[data-section="${t.dataset.goto}"]`); if (nav) nav.click(); return; }
      if (t.hasAttribute('data-retry')) {
        const old = $(root, '#llQuiz'), fresh = document.createElement('div');
        fresh.id = 'llQuiz'; old.replaceWith(fresh);
        mountQuiz(MODULES[progress.last], fresh);
        $(root, '#ll-check').scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (t.dataset.toggleDone !== undefined) {
        const m = MODULES[+t.dataset.toggleDone], st = moduleState(m.id);
        st.done = !st.done; progress.modules[m.id] = st; saveProgress(); renderLesson(+t.dataset.toggleDone); return;
      }
      if (t.dataset.open !== undefined) openModule(+t.dataset.open);
    });
    renderOverview();
    window.PMPLearn = {
      open(id) {
        const i = MODULES.findIndex(m => m.id === id);
        if (i < 0) return;
        const sec = document.getElementById('section-learn');
        const nav = document.querySelector('.nav-item[data-section="learn"]');
        if (sec && !sec.classList.contains('active') && nav) nav.click();
        openModule(i);
      }
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
