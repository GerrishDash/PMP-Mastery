/* ============================================
   PMP EXAM MASTERY — Application Logic
   PMBOK 6th & 7th Edition Study Tool
   ============================================ */

const initApp = () => {

  // Safe LocalStorage wrapper
  const safeLS = {
    getItem(key) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn('localStorage is blocked or unavailable:', e);
        return null;
      }
    },
    setItem(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn('localStorage is blocked or unavailable:', e);
      }
    },
    removeItem(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('localStorage is blocked or unavailable:', e);
      }
    }
  };

  // ══════════════════════════════════════════════
  //  PMP BOOKSHELF & E-READER SHARED VARIABLES (DECLARED AT TOP TO PREVENT TDZ IN NAVIGATETO)
  // ══════════════════════════════════════════════
  // PDF.js worker setup
  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  // IndexedDB Setup for PDF storage with automatic reconnect protocol
  let db = null;

  function initIndexedDB() {
    return new Promise((resolve, reject) => {
      const dbRequest = indexedDB.open('pmp_reader_db', 1);
      dbRequest.onupgradeneeded = (e) => {
        const database = e.target.result;
        if (!database.objectStoreNames.contains('books')) {
          database.createObjectStore('books', { keyPath: 'id' });
        }
      };
      dbRequest.onsuccess = (e) => {
        db = e.target.result;
        
        // Handle database close/upgrade request events
        db.onversionchange = () => {
          if (db) {
            db.close();
            db = null;
          }
          console.warn('[IndexedDB] Connection closed due to version change.');
        };
        db.onclose = () => {
          db = null;
          console.warn('[IndexedDB] Connection closed.');
        };
        
        updateBookshelfUI().catch(() => {});
        resolve(db);
      };
      dbRequest.onerror = (e) => {
        console.error('IndexedDB open error:', e);
        reject(e);
      };
    });
  }

  // Initial load
  initIndexedDB().catch(err => console.error('Failed to initialize database:', err));

  function dbGetBook(bookId) {
    return new Promise((resolve, reject) => {
      if (!db) {
        setTimeout(() => {
          if (!db) reject(new Error('Database not initialized'));
          else dbGetBook(bookId).then(resolve).catch(reject);
        }, 150);
        return;
      }
      try {
        const transaction = db.transaction(['books'], 'readonly');
        const store = transaction.objectStore('books');
        const request = store.get(bookId);
        request.onsuccess = () => resolve(request.result ? request.result.file : null);
        request.onerror = () => reject(request.error);
      } catch (err) {
        // If connection is closing or closed, trigger re-initialization and retry once
        if (err.name === 'InvalidStateError' || err.message.includes('closing') || err.message.includes('closed')) {
          console.warn('[IndexedDB] Connection lost on get. Attempting reconnect...');
          db = null;
          initIndexedDB()
            .then(() => dbGetBook(bookId).then(resolve).catch(reject))
            .catch(() => reject(err));
        } else {
          reject(err);
        }
      }
    });
  }

  function dbSaveBook(bookId, fileBlob) {
    return new Promise((resolve, reject) => {
      if (!db) {
        setTimeout(() => {
          if (!db) reject(new Error('Database not initialized'));
          else dbSaveBook(bookId, fileBlob).then(resolve).catch(reject);
        }, 150);
        return;
      }
      try {
        const transaction = db.transaction(['books'], 'readwrite');
        const store = transaction.objectStore('books');
        const request = store.put({ id: bookId, file: fileBlob, updated: Date.now() });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (err) {
        // If connection is closing or closed, trigger re-initialization and retry once
        if (err.name === 'InvalidStateError' || err.message.includes('closing') || err.message.includes('closed')) {
          console.warn('[IndexedDB] Connection lost on save. Attempting reconnect...');
          db = null;
          initIndexedDB()
            .then(() => dbSaveBook(bookId, fileBlob).then(resolve).catch(reject))
            .catch(() => reject(err));
        } else {
          reject(err);
        }
      }
    });
  }

  function dbDeleteBook(bookId) {
    return new Promise((resolve, reject) => {
      if (!db) return reject(new Error('Database not initialized'));
      try {
        const transaction = db.transaction(['books'], 'readwrite');
        const store = transaction.objectStore('books');
        const request = store.delete(bookId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  let currentPdfDoc = null;
  let bookTOC = [];
  let currentBookId = 'pmbok7';
  let currentPageIndex = 0; // 0-based page index
  let readerZoomScale = parseFloat(safeLS.getItem('pmp_reader_zoom')) || 1.0;
  let readerTheme = safeLS.getItem('pmp_reader_theme') || 'dark';
  let readerFitMode = safeLS.getItem('pmp_reader_fit') || 'width'; // 'width' or 'page'
  let isRendering = false;
  let renderPendingIndex = null;
  let activeSearchQuery = '';

  function closeAllDrawers() {
    document.querySelectorAll('.kindle-drawer').forEach(d => d.classList.remove('visible'));
  }

  function toggleHUD(visible) {
    const kindleHUDHeader = document.getElementById('kindleHUDHeader');
    const kindleHUDFooter = document.getElementById('kindleHUDFooter');
    const kindleNavBar = document.getElementById('kindleNavBar');
    const kindleReaderOverlay = document.getElementById('kindleReaderOverlay');
    if (!kindleHUDHeader || !kindleHUDFooter) return;
    if (visible) {
      kindleHUDHeader.classList.add('visible');
      kindleHUDFooter.classList.add('visible');
      if (kindleNavBar) kindleNavBar.classList.add('visible');
      if (kindleReaderOverlay) kindleReaderOverlay.classList.remove('hud-hidden');
    } else {
      kindleHUDHeader.classList.remove('visible');
      kindleHUDFooter.classList.remove('visible');
      if (kindleNavBar) kindleNavBar.classList.remove('visible');
      if (kindleReaderOverlay) kindleReaderOverlay.classList.add('hud-hidden');
    }
  }

  // Kindle Overlay Elements
  const kindleReaderOverlay = document.getElementById('kindleReaderOverlay');
  const kindleBtnBack = document.getElementById('kindleBtnBack');
  const kindleBtnTOC = document.getElementById('kindleBtnTOC');
  const kindleBtnSearch = document.getElementById('kindleBtnSearch');
  const kindleBtnBookmark = document.getElementById('kindleBtnBookmark');
  const kindleBookmarkIcon = document.getElementById('kindleBookmarkIcon');
  const kindleBtnAa = document.getElementById('kindleBtnAa');
  const kindleBtnMore = document.getElementById('kindleBtnMore');
  const kindleBookTitle = document.getElementById('kindleBookTitle');
  const kindleHUDFooter = document.getElementById('kindleHUDFooter');
  const kindleHUDHeader = document.getElementById('kindleHUDHeader');
  const kindleProgressSlider = document.getElementById('kindleProgressSlider');
  const kindleProgressStatus = document.getElementById('kindleProgressStatus');
  const kindleTOCDrawer = document.getElementById('kindleTOCDrawer');
  const kindleTOCList = document.getElementById('kindleTOCList');
  const kindleBookmarksDrawer = document.getElementById('kindleBookmarksDrawer');
  const kindleBookmarksList = document.getElementById('kindleBookmarksList');
  const kindleSearchDrawer = document.getElementById('kindleSearchDrawer');
  const txtKindleSearch = document.getElementById('txtKindleSearch');
  const btnKindleSearchGo = document.getElementById('btnKindleSearchGo');
  const lblKindleSearchCount = document.getElementById('lblKindleSearchCount');
  const kindleSearchResults = document.getElementById('kindleSearchResults');
  const kindleAaPopover = document.getElementById('kindleAaPopover');
  const kindleAboutDrawer = document.getElementById('kindleAboutDrawer');
  const kindleAboutCover = document.getElementById('kindleAboutCover');
  const kindleAboutTitle = document.getElementById('kindleAboutTitle');
  const kindleAboutAuthor = document.getElementById('kindleAboutAuthor');
  const btnKindleSyncFurthest = document.getElementById('btnKindleSyncFurthest');
  const btnKindleAnnotations = document.getElementById('btnKindleAnnotations');
  const btnKindleDeleteFromReader = document.getElementById('btnKindleDeleteFromReader');
  const kindleLoader = document.getElementById('kindleLoader');
  const lblKindleLoaderText = document.getElementById('lblKindleLoaderText');
  const kindleViewport = document.getElementById('kindleViewport');
  const kindleCanvasContainer = document.getElementById('kindleCanvasContainer');
  const kindleCanvas = document.getElementById('kindleCanvas');
  const kindleBookmarkRibbon = document.getElementById('kindleBookmarkRibbon');
  const pdfFileInput = document.getElementById('pdfFileInput');
  const kindleZoneLeft = document.getElementById('kindleZoneLeft');
  const kindleZoneRight = document.getElementById('kindleZoneRight');
  const kindleZoneCenter = document.getElementById('kindleZoneCenter');
  const kindleBtnGridView = document.getElementById('kindleBtnGridView');
  const lblKindleZoomScale = document.getElementById('lblKindleZoomScale');
  const lblUploadBookTitle = document.getElementById('lblUploadBookTitle');
  // Nav bar elements
  const kindleBtnPrev = document.getElementById('kindleBtnPrev');
  const kindleBtnNext = document.getElementById('kindleBtnNext');
  const kindleNavPageInfo = document.getElementById('kindleNavPageInfo');

  // ══════════════════════════════════════════════
  //  DATA: 12 PRINCIPLES (PMBOK 7)
  // ══════════════════════════════════════════════
  const principles = [
    { num: 1, title: 'Be a Diligent, Respectful, and Caring Steward', icon: '🛡️',
      desc: 'Stewards act responsibly with integrity, care, and trustworthiness while maintaining compliance with internal and external guidelines. They demonstrate a broad commitment to financial, social, and environmental impacts.',
      keyPoints: ['Integrity & ethical behavior', 'Care for resources (financial, environmental, social)', 'Trustworthiness in authority & decisions', 'Compliance with rules & regulations'] },
    { num: 2, title: 'Create a Collaborative Project Team Environment', icon: '🤝',
      desc: 'Project teams with diverse skills who work collaboratively can accomplish shared objectives more effectively. Team agreements, organizational structures, and processes support a collaborative culture.',
      keyPoints: ['Diversity of skills & thought', 'Shared ownership of outcomes', 'Team agreements & working norms', 'Authority & accountability clarity'] },
    { num: 3, title: 'Effectively Engage with Stakeholders', icon: '👥',
      desc: 'Proactively engage stakeholders to understand their needs, expectations, and interests. Stakeholder satisfaction is a key measure of project success.',
      keyPoints: ['Identify & analyze stakeholders', 'Understand needs, expectations, attitudes', 'Proactive engagement throughout', 'Stakeholder satisfaction drives success'] },
    { num: 4, title: 'Focus on Value', icon: '💎',
      desc: 'Continually evaluate and adjust project alignment to business objectives and intended benefits. Value is the ultimate indicator of project success, not just deliverables.',
      keyPoints: ['Value = ultimate success indicator', 'Align project with business case', 'Outcomes over outputs', 'Continuously evaluate value delivery'] },
    { num: 5, title: 'Recognize, Evaluate, and Respond to System Interactions', icon: '🔄',
      desc: 'A project is a system of interdependent and interacting components. Systems thinking helps recognize, evaluate, and respond to dynamic circumstances.',
      keyPoints: ['Projects are systems, not silos', 'Internal & external interactions', 'Holistic view of cause & effect', 'Respond to dynamic changes'] },
    { num: 6, title: 'Demonstrate Leadership Behaviors', icon: '👑',
      desc: 'Effective leadership promotes project success. Any team member can demonstrate leadership. Adapt style to the situation — motivation, influence, negotiation, and resilience.',
      keyPoints: ['Leadership ≠ authority/title', 'Any team member can lead', 'Adapt leadership style to context', 'Motivate, influence, coach, negotiate'] },
    { num: 7, title: 'Tailor Based on Context', icon: '✂️',
      desc: 'Design the project development approach based on the needs of the project, its context, organization, and environment. No one-size-fits-all methodology.',
      keyPoints: ['Adapt approach to project context', 'Consider org culture, size, complexity', 'Tailor processes, tools & techniques', 'Just enough process — not too much, not too little'] },
    { num: 8, title: 'Build Quality into Processes and Deliverables', icon: '✅',
      desc: 'Maintain focus on quality that produces deliverables meeting project objectives and aligning to stakeholder needs. Quality includes meeting requirements and fitness for use.',
      keyPoints: ['Prevention over inspection', 'Cost of quality (CoQ) concept', 'Conformance to requirements', 'Fitness for use & purpose'] },
    { num: 9, title: 'Navigate Complexity', icon: '🧩',
      desc: 'Continuously evaluate and navigate project complexity so that approaches and plans enable the team to successfully navigate the project life cycle.',
      keyPoints: ['Human behavior, system interactions, ambiguity', 'Simplify where possible', 'Iterative approaches for high complexity', 'Build in buffers and flexibility'] },
    { num: 10, title: 'Optimize Risk Responses', icon: '⚠️',
      desc: 'Continually evaluate exposure to risk, both opportunities and threats, to maximize positive impacts and minimize negative impacts on the project.',
      keyPoints: ['Threats AND opportunities', 'Risk appetite & tolerance', 'Individual vs overall project risk', 'Continual evaluation throughout project'] },
    { num: 11, title: 'Embrace Adaptability and Resiliency', icon: '🌊',
      desc: 'Build adaptability and resiliency into the organization and project team to help accommodate change, recover from setbacks, and advance project work.',
      keyPoints: ['Expect and welcome change', 'Recover quickly from setbacks', 'Build capability to adapt', 'Continuous learning & improvement'] },
    { num: 12, title: 'Enable Change to Achieve the Envisioned Future State', icon: '🚀',
      desc: 'Prepare those impacted for the adoption and sustainment of new and different behaviors and processes required for the transition from current to intended future state.',
      keyPoints: ['Structured change management', 'Stakeholder readiness assessment', 'Address resistance proactively', 'Sustain change after project ends'] },
  ];

  // ══════════════════════════════════════════════
  //  DATA: 8 PERFORMANCE DOMAINS (PMBOK 7)
  // ══════════════════════════════════════════════
  const domains = [
    { num: 1, title: 'Stakeholder', icon: '👥',
      desc: 'Activities and functions associated with stakeholders. Effectively engaging stakeholders contributes to project success.',
      outcomes: ['Productive working relationships', 'Stakeholder agreement on objectives', 'Stakeholders are supportive', 'Anticipated opposition is addressed'] },
    { num: 2, title: 'Team', icon: '🏆',
      desc: 'Activities associated with establishing a project team culture, capabilities, and environment for high performance.',
      outcomes: ['Shared ownership', 'High-performing team', 'Applicable leadership demonstrated by all', 'Continuous team development'] },
    { num: 3, title: 'Development Approach & Life Cycle', icon: '🔁',
      desc: 'Activities and functions related to the development approach, cadence, and life cycle phases of the project.',
      outcomes: ['Appropriate development approach', 'Deliverables aligned with approach', 'Phases facilitate delivery cadence', 'Project life cycle connects to stakeholder value'] },
    { num: 4, title: 'Planning', icon: '📋',
      desc: 'Activities needed to produce a coordinated and evolving plan for delivering project deliverables and outcomes.',
      outcomes: ['Organized, elaborated, coordinated project', 'Holistic approach to delivery', 'Evolving information is elaborated', 'Sufficient time for planning'] },
    { num: 5, title: 'Project Work', icon: '⚡',
      desc: 'Activities associated with establishing project processes, managing physical resources, and fostering a learning environment.',
      outcomes: ['Efficient project performance', 'Appropriate project processes', 'Effective communication with stakeholders', 'Efficient management of resources'] },
    { num: 6, title: 'Delivery', icon: '📦',
      desc: 'Activities associated with delivering the scope, quality, and requirements the project was undertaken to achieve.',
      outcomes: ['Projects contribute to business objectives & value', 'Benefits realized as planned', 'Stakeholders accept project deliverables', 'Quality requirements met'] },
    { num: 7, title: 'Measurement', icon: '📊',
      desc: 'Activities related to assessing project performance and taking appropriate actions to maintain acceptable performance.',
      outcomes: ['Reliable understanding of project status', 'Actionable data for decisions', 'Timely & appropriate actions keep on track', 'Achieving targets and generating value'] },
    { num: 8, title: 'Uncertainty', icon: '🌀',
      desc: 'Activities associated with risk and uncertainty. Projects exist in environments with varying degrees of uncertainty.',
      outcomes: ['Awareness of interdependent factors creating uncertainty', 'Proactive exploration & response', 'Project risk reduced', 'Opportunities exploited'] },
  ];

  // ══════════════════════════════════════════════
  //  DATA: FLASHCARDS
  // ══════════════════════════════════════════════
  // ── Load flashcards from external flashcards.js (window.PMP_FLASHCARDS) ──
  // Fallback to built-in set if file not loaded
  const allFlashcards = (window.PMP_FLASHCARDS && window.PMP_FLASHCARDS.length > 0)
    ? window.PMP_FLASHCARDS
    : [
    // PMBOK 6 Flashcards
    { cat: 'pmbok6', q: 'What are the 5 Process Groups?', a: 'Initiating, Planning, Executing, Monitoring & Controlling, and Closing. They are NOT sequential phases — they overlap and repeat throughout the project.' },
    { cat: 'pmbok6', q: 'How many Knowledge Areas and Processes are in PMBOK 6?', a: '10 Knowledge Areas containing 49 processes total. Integration is the only KA with processes in ALL 5 process groups.' },
    { cat: 'pmbok6', q: 'What is the difference between Validate Scope and Control Quality?', a: 'Validate Scope = formal ACCEPTANCE of deliverables by the customer (external-facing). Control Quality = verifying deliverables meet quality REQUIREMENTS (internal-facing). Validate Scope happens AFTER Control Quality.' },
    { cat: 'pmbok6', q: 'What is a Project Charter?', a: 'A document issued by the project sponsor that formally authorizes the existence of a project and provides the PM with authority to apply organizational resources. It\'s created in the Initiating process group.' },
    { cat: 'pmbok6', q: 'What is Perform Integrated Change Control?', a: 'The process of reviewing all change requests, approving/rejecting changes, and managing changes to deliverables, documents, and the PM plan. The Change Control Board (CCB) makes these decisions.' },
    { cat: 'pmbok6', q: 'What is the Critical Path Method (CPM)?', a: 'A schedule network analysis technique that identifies the longest path through the project, determining the shortest possible project duration. Activities on the critical path have ZERO float/slack.' },
    { cat: 'pmbok6', q: 'Name the 5 conflict resolution techniques (in order of preference)', a: '1) Collaborate/Problem-Solve (best — win-win), 2) Compromise/Reconcile (lose-lose), 3) Smooth/Accommodate (temporary), 4) Force/Direct (win-lose), 5) Withdraw/Avoid (postpone). PMP exams favor Collaborate.' },
    { cat: 'pmbok6', q: 'What is the difference between OPA and EEF?', a: 'OPA (Organizational Process Assets) = internal processes, policies, templates, lessons learned — things the org CONTROLS. EEF (Enterprise Environmental Factors) = conditions the team CANNOT control (market, regulations, culture, infrastructure).' },
    { cat: 'pmbok6', q: 'What are the 4 types of project dependencies?', a: 'Mandatory (hard logic), Discretionary (preferred/soft logic), External (outside project), Internal (within project). Can be combined: e.g., External Mandatory.' },
    { cat: 'pmbok6', q: 'What is a Risk Register?', a: 'A document containing results of risk identification, qualitative & quantitative analysis, and risk response planning. It\'s a living document updated throughout the project — the primary output of Identify Risks.' },
    { cat: 'pmbok6', q: 'What are the risk response strategies for THREATS?', a: 'Avoid (eliminate the threat), Transfer (shift to third party — insurance), Mitigate (reduce probability or impact), Accept (passive or active), Escalate (beyond PM authority). PMI prefers proactive responses.' },
    { cat: 'pmbok6', q: 'What are the risk response strategies for OPPORTUNITIES?', a: 'Exploit (ensure the opportunity occurs), Share (allocate to a third party best able to capture), Enhance (increase probability or impact), Accept, and Escalate.' },

    // PMBOK 7 Flashcards
    { cat: 'pmbok7', q: 'How does PMBOK 7 differ from PMBOK 6?', a: 'PMBOK 6 is process-based (prescriptive — 49 processes, ITTOs). PMBOK 7 is principle-based (descriptive — 12 principles, 8 performance domains). PMBOK 7 focuses on OUTCOMES rather than deliverables and supports all development approaches.' },
    { cat: 'pmbok7', q: 'What is the System for Value Delivery?', a: 'A collection of strategic business activities aimed at building, sustaining, and/or advancing an organization. Projects, programs, portfolios, and operations are components that interact to deliver value to the organization and stakeholders.' },
    { cat: 'pmbok7', q: 'What is the Stewardship principle about?', a: 'Act responsibly with integrity, care, trustworthiness, and compliance. Stewards consider financial, social, technical, and environmental impacts. They balance organizational objectives with the larger needs of global stakeholders.' },
    { cat: 'pmbok7', q: 'What does "Focus on Value" mean in PMBOK 7?', a: 'Value is the ultimate indicator of project success — not just delivering a product. Continuously evaluate alignment to business objectives and intended benefits. Value can include financial returns, social good, or other benefits.' },
    { cat: 'pmbok7', q: 'What is the Tailoring principle?', a: 'Design the development approach based on the unique context — project size, complexity, org culture, risk. There is no one-size-fits-all methodology. Tailor processes, tools, techniques, and governance to "just enough."' },
    { cat: 'pmbok7', q: 'How do Performance Domains interact?', a: 'They form an interactive, interrelated, and interdependent system. Changes in one domain affect others. Teams must consider the WHOLE system, not just the domain where the change occurred. Evaluated by outcomes, not process adherence.' },

    // Agile Flashcards
    { cat: 'agile', q: 'What is a Servant Leader?', a: 'A leadership style where the leader\'s primary goal is to SERVE the team. In Scrum, the Scrum Master is a servant leader — they remove impediments, coach the team, shield them from interference, and facilitate (not direct) the team\'s work.' },
    { cat: 'agile', q: 'What is the Definition of Done (DoD)?', a: 'A shared understanding of what it means for work to be complete, including quality standards, testing criteria, and documentation needs. Every increment must meet the DoD before it can be considered potentially releasable.' },
    { cat: 'agile', q: 'What is a Sprint Burndown Chart?', a: 'A graph showing the amount of work remaining in the sprint plotted against time. The Y-axis = remaining work (story points or hours), X-axis = days in sprint. Helps the team track progress and predict if they will complete the sprint goal.' },
    { cat: 'agile', q: 'What is the purpose of a Sprint Retrospective?', a: 'A ceremony AFTER the Sprint Review where the team inspects HOW they worked (not WHAT they built). They identify what went well, what to improve, and create actionable improvement items. Key to continuous improvement.' },
    { cat: 'agile', q: 'Who can cancel a Sprint?', a: 'ONLY the Product Owner can cancel a Sprint. A Sprint may be cancelled if the Sprint Goal becomes obsolete. Cancelled sprints are rare and disruptive — any completed "Done" items are reviewed.' },
    { cat: 'agile', q: 'What is Backlog Refinement (Grooming)?', a: 'An ongoing activity where the Product Owner and Development Team review backlog items, add detail, estimate, and reorder. Typically consumes no more than 10% of the team\'s capacity. NOT one of the 5 Scrum events.' },
    { cat: 'agile', q: 'What is Kanban?', a: 'A visual workflow management method. Uses a board with columns (To Do, In Progress, Done). Key concept: WIP (Work in Progress) LIMITS — restricting how many items can be in any stage at once to optimize flow and reduce bottlenecks.' },
    { cat: 'agile', q: 'What is the Agile Triangle (Iron Triangle in Agile)?', a: 'In Traditional: Scope is fixed, Time & Cost are estimated. In Agile: Time & Cost are fixed (sprint length, team size), Scope is estimated/variable. Agile accepts scope flexibility to deliver the highest-value features first.' },

    // EVM Flashcards
    { cat: 'evm', q: 'What does CPI < 1.0 mean?', a: 'The project is OVER BUDGET. You are getting less than $1 worth of work for every $1 spent. Example: CPI = 0.80 means for every $1 spent, you get only $0.80 of earned value. This is the most critical EVM metric for PMI.' },
    { cat: 'evm', q: 'What does SPI > 1.0 mean?', a: 'The project is AHEAD OF SCHEDULE. You have earned more value than was planned by this point. Example: SPI = 1.20 means you have completed 20% more work than planned. However, SPI becomes unreliable near project end.' },
    { cat: 'evm', q: 'What is EAC and its most common formula?', a: 'EAC = Estimate at Completion — the expected total cost when the project finishes. Most common formula: EAC = BAC / CPI (assumes current cost performance trend continues). Other variants exist for atypical variances.' },
    { cat: 'evm', q: 'What is TCPI and what does it tell you?', a: 'TCPI = To-Complete Performance Index = (BAC − EV) / (BAC − AC). It tells you the cost performance you MUST achieve on remaining work to meet the original budget. TCPI > 1 means you must perform better than planned.' },
    { cat: 'evm', q: 'What is the difference between EAC, ETC, and VAC?', a: 'EAC = total forecasted cost (BAC/CPI). ETC = money still needed to finish (EAC − AC). VAC = expected surplus or deficit at end (BAC − EAC). Negative VAC = over budget at completion.' },
    { cat: 'evm', q: 'Planned Value (PV) vs Earned Value (EV) vs Actual Cost (AC)', a: 'PV = budgeted cost of work SCHEDULED (what you planned to do). EV = budgeted cost of work PERFORMED (what you actually completed, in budget terms). AC = actual cost of work PERFORMED (what you actually spent). Key: EV is the cornerstone — it\'s always on the left side of variance formulas.' },
  ];

  // ══════════════════════════════════════════════
  // Hardcoded quizQuestions removed. Reading from questions.js instead.

  //  NAVIGATION
  // ══════════════════════════════════════════════
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.section');

  function navigateTo(sectionId) {
    if (typeof closeKindleReader === 'function') {
      closeKindleReader();
    }
    sections.forEach(s => s.classList.remove('active'));
    navItems.forEach(n => n.classList.remove('active'));
    const target = document.getElementById('section-' + sectionId);
    if (target) target.classList.add('active');
    const navTarget = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
    if (navTarget) navTarget.classList.add('active');
    // Close mobile menu
    document.getElementById('sidebar').classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (sectionId === 'reader') {
      updateBookshelfUI();
    }
    if (sectionId === 'news') {
      renderPMNews();
    }
    if (sectionId === 'jobs') {
      renderPMJobs();
    }
    if (sectionId === 'dashboard') {
      renderDashboardPreviews();
    }
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.section));
  });

  // Mobile menu
  document.getElementById('mobileMenuBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  // ══════════════════════════════════════════════
  //  RENDER: 12 PRINCIPLES
  // ══════════════════════════════════════════════
  const principlesGrid = document.getElementById('principlesGrid');
  principles.forEach(p => {
    const card = document.createElement('div');
    card.className = 'concept-card';
    card.innerHTML = `
      <div class="concept-number">Principle ${p.num}</div>
      <h3>${p.icon} ${p.title}</h3>
      <p>${p.desc}</p>
      <ul style="margin-top:12px; padding-left:18px; color:var(--text-secondary); font-size:0.82rem; line-height:1.7;">
        ${p.keyPoints.map(kp => `<li>${kp}</li>`).join('')}
      </ul>
    `;
    principlesGrid.appendChild(card);
  });

  // ══════════════════════════════════════════════
  //  RENDER: 8 PERFORMANCE DOMAINS
  // ══════════════════════════════════════════════
  const domainsGrid = document.getElementById('domainsGrid');
  domains.forEach(d => {
    const card = document.createElement('div');
    card.className = 'concept-card';
    card.innerHTML = `
      <div class="concept-number">Domain ${d.num}</div>
      <h3>${d.icon} ${d.title}</h3>
      <p>${d.desc}</p>
      <div style="margin-top:14px;">
        <div style="font-size:0.75rem; font-weight:600; color:var(--accent-primary); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px;">Desired Outcomes</div>
        <ul style="padding-left:18px; color:var(--text-secondary); font-size:0.82rem; line-height:1.7;">
          ${d.outcomes.map(o => `<li>${o}</li>`).join('')}
        </ul>
      </div>
    `;
    domainsGrid.appendChild(card);
  });

  // ══════════════════════════════════════════════
  //  FLASHCARDS (SPACED REPETITION / LEITNER SYSTEM)
  // ══════════════════════════════════════════════
  let currentFilter = 'all'; // 'all', 'pmbok6', 'pmbok7', 'agile', 'evm'
  let activeBoxFilter = 'all'; // 'all', '1', '2', '3'
  let currentCardIndex = 0;

  // Spaced Repetition History Stack for 'All Boxes' mode
  let cardHistory = [];
  let historyPointer = -1;

  // Load Leitner boxes from LocalStorage
  let cardBoxes = {};
  try {
    cardBoxes = JSON.parse(safeLS.getItem('pmp_card_boxes')) || {};
  } catch (e) {
    console.error('Failed to parse card boxes:', e);
  }
  
  // Default all cards to Box 1 (Hard/Review Soon)
  allFlashcards.forEach((card, idx) => {
    if (cardBoxes[idx] === undefined) {
      cardBoxes[idx] = 1;
    }
  });
  safeLS.setItem('pmp_card_boxes', JSON.stringify(cardBoxes));

  const flashcard = document.getElementById('flashcard');
  const fcCategory = document.getElementById('fcCategory');
  const fcCategoryBack = document.getElementById('fcCategoryBack');
  const fcQuestion = document.getElementById('fcQuestion');
  const fcAnswer = document.getElementById('fcAnswer');
  const fcCounter = document.getElementById('fcCounter');

  const countBox1 = document.getElementById('countBox1');
  const countBox2 = document.getElementById('countBox2');
  const countBox3 = document.getElementById('countBox3');

  function getCategoryLabel(cat) {
    const labels = { pmbok6: 'PMBOK 6th Edition', pmbok7: 'PMBOK 7th Edition', agile: 'Agile / Scrum', evm: 'Earned Value Mgmt' };
    return labels[cat] || cat;
  }

  // Get list of cards matching category and Leitner filters
  function getFilteredCards() {
    return allFlashcards.map((card, originalIdx) => ({ ...card, originalIdx }))
      .filter(c => {
        const matchesCategory = currentFilter === 'all' || c.cat === currentFilter;
        const matchesBox = activeBoxFilter === 'all' || cardBoxes[c.originalIdx].toString() === activeBoxFilter;
        return matchesCategory && matchesBox;
      });
  }

  function updateLeitnerCounters() {
    let box1 = 0, box2 = 0, box3 = 0;
    allFlashcards.forEach((_, idx) => {
      const box = cardBoxes[idx];
      if (box === 1) box1++;
      if (box === 2) box2++;
      if (box === 3) box3++;
    });
    countBox1.textContent = box1;
    countBox2.textContent = box2;
    countBox3.textContent = box3;
  }

  // Select next card based on box frequency (Box 1: 70%, Box 2: 20%, Box 3: 10%)
  function selectNextLeitnerCard(filtered) {
    if (filtered.length === 0) return 0;
    if (filtered.length === 1) return 0;

    const box1 = filtered.filter(c => cardBoxes[c.originalIdx] === 1);
    const box2 = filtered.filter(c => cardBoxes[c.originalIdx] === 2);
    const box3 = filtered.filter(c => cardBoxes[c.originalIdx] === 3);

    const r = Math.random();
    let chosenBox = 1;
    if (r < 0.70) {
      chosenBox = 1;
    } else if (r < 0.90) {
      chosenBox = 2;
    } else {
      chosenBox = 3;
    }

    let selectedList = [];
    if (chosenBox === 1) {
      if (box1.length > 0) selectedList = box1;
      else if (box2.length > 0) selectedList = box2;
      else selectedList = box3;
    } else if (chosenBox === 2) {
      if (box2.length > 0) selectedList = box2;
      else if (box1.length > 0) selectedList = box1;
      else selectedList = box3;
    } else {
      if (box3.length > 0) selectedList = box3;
      else if (box2.length > 0) selectedList = box2;
      else selectedList = box1;
    }

    if (selectedList.length === 0) return 0;

    // Avoid immediate repetition if possible
    let currentOriginalIdx = filtered[currentCardIndex] ? filtered[currentCardIndex].originalIdx : -1;
    let pick = selectedList[Math.floor(Math.random() * selectedList.length)];
    if (selectedList.length > 1) {
      let attempts = 0;
      while (pick.originalIdx === currentOriginalIdx && attempts < 5) {
        pick = selectedList[Math.floor(Math.random() * selectedList.length)];
        attempts++;
      }
    }
    
    const targetIdx = filtered.findIndex(c => c.originalIdx === pick.originalIdx);
    return targetIdx !== -1 ? targetIdx : 0;
  }

  // Reset navigation history stack on filter changes
  function resetFlashcardNavigation() {
    cardHistory = [];
    historyPointer = -1;
    currentCardIndex = 0;
    
    const filtered = getFilteredCards();
    if (filtered.length > 0 && activeBoxFilter === 'all') {
      currentCardIndex = selectNextLeitnerCard(filtered);
      cardHistory.push(filtered[currentCardIndex].originalIdx);
      historyPointer = 0;
    }
  }

  function renderFlashcard() {
    const filtered = getFilteredCards();
    updateLeitnerCounters();

    if (filtered.length === 0) {
      fcCategory.textContent = 'Empty Deck';
      fcCategoryBack.textContent = 'Empty Deck';
      fcQuestion.textContent = `No flashcards currently in this group. Select a different Box or Category above to continue studying!`;
      fcAnswer.textContent = 'N/A';
      fcCounter.textContent = '0 / 0';
      flashcard.classList.remove('flipped');
      return;
    }

    if (currentCardIndex >= filtered.length || currentCardIndex < 0) {
      currentCardIndex = 0;
    }

    const card = filtered[currentCardIndex];
    fcCategory.textContent = getCategoryLabel(card.cat);
    fcCategoryBack.textContent = getCategoryLabel(card.cat);
    fcQuestion.textContent = card.q;
    fcAnswer.textContent = card.a;
    
    let counterLabel = `Box ${cardBoxes[card.originalIdx]}`;
    if (activeBoxFilter === 'all') {
      counterLabel += ` | History: Card ${historyPointer + 1} of ${cardHistory.length}`;
    } else {
      counterLabel += ` | Card ${currentCardIndex + 1} of ${filtered.length}`;
    }
    fcCounter.textContent = counterLabel;
    flashcard.classList.remove('flipped');
  }

  function gradeCard(boxNum) {
    const filtered = getFilteredCards();
    if (filtered.length === 0) return;

    const card = filtered[currentCardIndex];
    cardBoxes[card.originalIdx] = boxNum;
    safeLS.setItem('pmp_card_boxes', JSON.stringify(cardBoxes));
    
    if (activeBoxFilter === 'all') {
      // Draw a new card using Leitner frequency probabilities
      currentCardIndex = selectNextLeitnerCard(filtered);
      cardHistory.push(filtered[currentCardIndex].originalIdx);
      historyPointer = cardHistory.length - 1;
    } else {
      // In single box filter, the graded card is no longer in this box.
      // Recalculate list and move to next available card index
      const newFiltered = getFilteredCards();
      if (newFiltered.length > 0) {
        currentCardIndex = currentCardIndex % newFiltered.length;
      } else {
        currentCardIndex = 0;
      }
    }
    renderFlashcard();
  }

  flashcard.addEventListener('click', () => flashcard.classList.toggle('flipped'));

  document.getElementById('fcPrev').addEventListener('click', () => {
    const filtered = getFilteredCards();
    if (filtered.length === 0) return;
    
    if (activeBoxFilter === 'all') {
      if (historyPointer > 0) {
        historyPointer--;
        const prevOriginalIdx = cardHistory[historyPointer];
        const prevIdx = filtered.findIndex(c => c.originalIdx === prevOriginalIdx);
        if (prevIdx !== -1) {
          currentCardIndex = prevIdx;
        } else {
          currentCardIndex = 0; // Fallback
        }
      }
    } else {
      // Sequential previous
      currentCardIndex = (currentCardIndex - 1 + filtered.length) % filtered.length;
    }
    renderFlashcard();
  });

  document.getElementById('fcNext').addEventListener('click', () => {
    const filtered = getFilteredCards();
    if (filtered.length === 0) return;
    
    if (activeBoxFilter === 'all') {
      if (historyPointer < cardHistory.length - 1) {
        historyPointer++;
        const nextOriginalIdx = cardHistory[historyPointer];
        const nextIdx = filtered.findIndex(c => c.originalIdx === nextOriginalIdx);
        if (nextIdx !== -1) {
          currentCardIndex = nextIdx;
        } else {
          currentCardIndex = 0; // Fallback
        }
      } else {
        // Draw a new card using probabilities
        currentCardIndex = selectNextLeitnerCard(filtered);
        cardHistory.push(filtered[currentCardIndex].originalIdx);
        historyPointer = cardHistory.length - 1;
      }
    } else {
      // Sequential next
      currentCardIndex = (currentCardIndex + 1) % filtered.length;
    }
    renderFlashcard();
  });

  // Grading buttons
  document.getElementById('btnHard').addEventListener('click', (e) => { e.stopPropagation(); gradeCard(1); });
  document.getElementById('btnMedium').addEventListener('click', (e) => { e.stopPropagation(); gradeCard(2); });
  document.getElementById('btnEasy').addEventListener('click', (e) => { e.stopPropagation(); gradeCard(3); });

  // Filter Category Buttons
  document.querySelectorAll('.flashcard-controls .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.flashcard-controls .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      resetFlashcardNavigation();
      renderFlashcard();
    });
  });

  // Filter Leitner Box Buttons
  document.querySelectorAll('.leitner-deck-counter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.leitner-deck-counter').forEach(b => b.classList.remove('active'));
      
      const newBoxFilter = btn.dataset.box;
      if (activeBoxFilter === newBoxFilter) {
        // Toggle off to show all
        activeBoxFilter = 'all';
      } else {
        activeBoxFilter = newBoxFilter;
        btn.classList.add('active');
      }
      
      resetFlashcardNavigation();
      renderFlashcard();
    });
  });

  // Keyboard navigation for flashcards
  document.addEventListener('keydown', (e) => {
    const flashcardSection = document.getElementById('section-flashcards');
    if (!flashcardSection.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') document.getElementById('fcPrev').click();
    if (e.key === 'ArrowRight') document.getElementById('fcNext').click();
    if (e.key === ' ') { e.preventDefault(); flashcard.classList.toggle('flipped'); }
    if (e.key === '1') { e.preventDefault(); gradeCard(1); }
    if (e.key === '2') { e.preventDefault(); gradeCard(2); }
    if (e.key === '3') { e.preventDefault(); gradeCard(3); }
  });

  // Initial seeding for first display
  resetFlashcardNavigation();
  renderFlashcard();

  // ══════════════════════════════════════════════
  //  EVM CALCULATOR
  // ══════════════════════════════════════════════
  document.getElementById('evmCalculateBtn').addEventListener('click', () => {
    const pv  = parseFloat(document.getElementById('evmPV').value);
    const ev  = parseFloat(document.getElementById('evmEV').value);
    const ac  = parseFloat(document.getElementById('evmAC').value);
    const bac = parseFloat(document.getElementById('evmBAC').value);

    if ([pv, ev, ac, bac].some(isNaN)) {
      showToast('⚠️ Please enter valid numbers for all four fields.', 'warning');
      return;
    }

    // ── Division-by-zero guards ──────────────────────────────────
    if (ac === 0) {
      showToast('⚠️ Actual Cost (AC) cannot be zero — CPI would be undefined.', 'warning');
      return;
    }
    if (pv === 0) {
      showToast('⚠️ Planned Value (PV) cannot be zero — SPI would be undefined.', 'warning');
      return;
    }
    if (bac === ac) {
      showToast('⚠️ BAC equals AC — TCPI denominator is zero. Check your inputs.', 'warning');
      return;
    }
    // ────────────────────────────────────────────────────────────

    const cv   = ev - ac;
    const sv   = ev - pv;
    const cpi  = ev / ac;
    const spi  = ev / pv;
    const eac  = bac / cpi;
    const etc  = eac - ac;
    const vac  = bac - eac;
    const tcpi = (bac - ev) / (bac - ac);

    const fmt      = (v) => v.toLocaleString('en-US', { maximumFractionDigits: 2 });
    const fmtDollar = (v) => '$' + Math.abs(v).toLocaleString('en-US', { maximumFractionDigits: 0 });

    document.getElementById('resCV').textContent  = (cv  >= 0 ? '+' : '') + fmtDollar(cv).replace('$',  (cv  >= 0 ? '$' : '-$'));
    document.getElementById('resSV').textContent  = (sv  >= 0 ? '+' : '') + fmtDollar(sv).replace('$',  (sv  >= 0 ? '$' : '-$'));
    document.getElementById('resCPI').textContent = fmt(cpi);
    document.getElementById('resSPI').textContent = fmt(spi);
    document.getElementById('resEAC').textContent = '$' + eac.toLocaleString('en-US', { maximumFractionDigits: 0 });
    document.getElementById('resETC').textContent = '$' + etc.toLocaleString('en-US', { maximumFractionDigits: 0 });
    document.getElementById('resVAC').textContent = (vac >= 0 ? '+' : '') + fmtDollar(vac).replace('$', (vac >= 0 ? '$' : '-$'));
    document.getElementById('resTCPI').textContent = fmt(tcpi);

    // Interpretations
    setInterp('intCV',   cv  >= 0 ? 'Under Budget ✓'        : 'Over Budget ✗',                                     cv  >= 0 ? 'good' : 'bad');
    setInterp('intSV',   sv  >= 0 ? 'On/Ahead of Schedule ✓' : 'Behind Schedule ✗',                                sv  >= 0 ? 'good' : 'bad');
    setInterp('intCPI',  cpi >= 1  ? `Efficient: Getting $${fmt(cpi)} per $1 spent`   : `Inefficient: Getting $${fmt(cpi)} per $1 spent`, cpi >= 1 ? 'good' : 'bad');
    setInterp('intSPI',  spi >= 1  ? `${fmt(spi * 100)}% of planned work done`         : `Only ${fmt(spi * 100)}% of planned work done`,        spi >= 1 ? 'good' : 'bad');
    setInterp('intEAC',  eac <= bac ? 'Will finish at/under budget'                   : `Will exceed budget by $${(eac - bac).toLocaleString('en-US', {maximumFractionDigits:0})}`, eac <= bac ? 'good' : 'bad');
    setInterp('intETC',  `Still need $${etc.toLocaleString('en-US', {maximumFractionDigits:0})} to finish`, 'neutral');
    setInterp('intVAC',  vac >= 0  ? 'Expected surplus at completion'                 : 'Expected deficit at completion', vac >= 0 ? 'good' : 'bad');
    setInterp('intTCPI', tcpi > 1.1 ? 'Must perform significantly better!'           : (tcpi > 1 ? 'Must improve slightly' : 'Can maintain/relax pace'), tcpi > 1 ? 'bad' : 'good');
  });

  function setInterp(id, text, type) {
    const el = document.getElementById(id);
    el.textContent = text;
    el.className = 'interpretation interp-' + type;
  }

  // ── Themed toast notification (replaces alert() for non-blocking feedback) ──
  function showToast(message, type = 'info') {
    let toastContainer = document.getElementById('pmpToastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'pmpToastContainer';
      toastContainer.style.cssText = [
        'position:fixed', 'bottom:24px', 'right:24px', 'z-index:99999',
        'display:flex', 'flex-direction:column', 'gap:10px',
        'pointer-events:none'
      ].join(';');
      document.body.appendChild(toastContainer);
    }
    const colors = {
      info:    'var(--accent-primary)',
      warning: 'var(--accent-warm)',
      error:   '#ef4444',
      success: 'var(--accent-primary)'
    };
    const toast = document.createElement('div');
    toast.style.cssText = [
      'background:var(--bg-card)',
      'border:1px solid ' + (colors[type] || colors.info),
      'border-left:4px solid ' + (colors[type] || colors.info),
      'color:var(--text-primary)',
      'padding:12px 18px',
      'border-radius:8px',
      'font-size:0.85rem',
      'max-width:320px',
      'box-shadow:0 4px 20px rgba(0,0,0,0.4)',
      'opacity:0',
      'transform:translateX(20px)',
      'transition:all 0.25s ease',
      'pointer-events:auto'
    ].join(';');
    toast.textContent = message;
    toastContainer.appendChild(toast);
    // Animate in
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    });
    // Auto-dismiss after 4s
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ── Themed confirm modal (replaces browser confirm() dialog) ────────────────
  function showConfirmModal(message, onConfirm) {
    const overlay = document.createElement('div');
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:99998',
      'display:flex', 'align-items:center', 'justify-content:center',
      'background:rgba(15,23,42,0.8)', 'backdrop-filter:blur(4px)'
    ].join(';');
    overlay.innerHTML = `
      <div style="background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:16px;padding:28px 32px;max-width:400px;width:90%;text-align:center;">
        <div style="font-size:2rem;margin-bottom:12px;">⚠️</div>
        <p style="color:var(--text-primary);font-size:0.92rem;line-height:1.6;margin-bottom:24px;">${message}</p>
        <div style="display:flex;gap:12px;justify-content:center;">
          <button id="_confirmNo"  class="btn btn-secondary" style="padding:10px 24px;">Cancel</button>
          <button id="_confirmYes" class="btn btn-primary"   style="padding:10px 24px;">Confirm</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#_confirmNo').addEventListener('click',  () => overlay.remove());
    overlay.querySelector('#_confirmYes').addEventListener('click', () => { overlay.remove(); onConfirm(); });
  }


  let quizState = {
    mode: 'practice', // 'practice' or 'full'
    currentQ: 0,
    score: 0,
    selectedAnswer: -1,
    answered: false,
    answers: [],
    questions: [],
    timerInterval: null,
    timeLeft: 0, // in seconds
    breakInterval: null,
    breakTimeLeft: 0, // in seconds
    isPaused: false
  };

  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function showQuizSetup() {
    stopTimer();
    stopBreakTimer();
    quizState.timerInterval = null;
    quizState.breakInterval = null;
    document.getElementById('quizSetup').classList.remove('hidden');
    document.getElementById('quizActive').classList.add('hidden');
    document.getElementById('quizResults').classList.add('hidden');
    document.getElementById('breakOverlay').style.display = 'none';
    document.getElementById('pauseOverlay').style.display = 'none';
  }

  // ── Stratified sampler: enforces ECO domain distribution ────────
  function stratifiedSample(bank, distribution) {
    const combined = Object.entries(distribution).flatMap(([domain, count]) => {
      const pool = shuffleArray(bank.filter(q => q.domain === domain));
      return pool.slice(0, Math.min(count, pool.length));
    });
    return shuffleArray(combined); // intermix domains as on real exam
  }

  // ECO 2021: People 42% (~76q), Process 50% (~90q), Business Environment 8% (~14q)
  const ECO_DISTRIBUTION = { People: 76, Process: 90, 'Business Environment': 14 };

  function getMockTestBank(testNum) {
    const banks = {
      1: window.PMP_QUESTION_BANK   || [],
      2: window.PMP_MOCK_TEST_2     || [],
      3: window.PMP_MOCK_TEST_3     || [],
      4: window.PMP_MOCK_TEST_4     || [],
      5: window.PMP_MOCK_TEST_5     || []
    };
    // Fallback: combine all available banks if specific one is empty
    const bank = banks[testNum] || [];
    if (bank.length > 0) return bank;
    return Object.values(banks).flat();
  }

  function startQuiz(mode, testNum) {
    quizState.mode   = mode;
    quizState.testNum = testNum || 1;
    quizState.currentQ = 0;
    quizState.score    = 0;
    quizState.selectedAnswer = -1;
    quizState.answered = false;
    quizState.answers  = [];
    quizState.isPaused = false;

    const bank = getMockTestBank(quizState.testNum);

    if (mode === 'practice') {
      // Practice Quiz: 20 random questions from selected bank
      quizState.questions = shuffleArray(bank).slice(0, Math.min(20, bank.length));
      document.getElementById('quizTimerWrapper').classList.add('hidden');
      stopTimer();
    } else {
      // Full Mock Exam: 180 questions with stratified ECO distribution
      quizState.questions = stratifiedSample(bank, ECO_DISTRIBUTION);
      document.getElementById('quizTimerWrapper').classList.remove('hidden');
      quizState.timeLeft = 230 * 60;  // 230 minutes
      startTimer();
    }

    document.getElementById('quizSetup').classList.add('hidden');
    document.getElementById('quizActive').classList.remove('hidden');
    document.getElementById('quizResults').classList.add('hidden');
    document.getElementById('quizTotalNum').textContent = quizState.questions.length;
    renderQuestion();
  }

  // Timer functions
  function startTimer() {
    stopTimer();
    updateTimerDisplay();
    quizState.timerInterval = setInterval(() => {
      if (quizState.isPaused) return;
      if (quizState.timeLeft > 0) {
        quizState.timeLeft--;
        updateTimerDisplay();
      } else {
        stopTimer();
        alert('Time is up! Your exam is being submitted.');
        showQuizResults();
      }
    }, 1000);
  }

  function stopTimer() {
    if (quizState.timerInterval) {
      clearInterval(quizState.timerInterval);
      quizState.timerInterval = null;
    }
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(quizState.timeLeft / 60);
    const seconds = quizState.timeLeft % 60;
    const pad = (num) => num.toString().padStart(2, '0');
    document.getElementById('quizTimerDisplay').textContent = `${pad(minutes)}:${pad(seconds)}`;
  }

  function pauseExam() {
    quizState.isPaused = true;
    document.getElementById('pauseOverlay').style.display = 'flex';
  }

  function resumeExam() {
    quizState.isPaused = false;
    document.getElementById('pauseOverlay').style.display = 'none';
  }

  // Break functions
  function startBreak() {
    quizState.isPaused = true; // Pause main exam timer
    quizState.breakTimeLeft = 10 * 60; // 10 minutes
    updateBreakTimerDisplay();
    document.getElementById('breakOverlay').style.display = 'flex';

    stopBreakTimer();
    quizState.breakInterval = setInterval(() => {
      if (quizState.breakTimeLeft > 0) {
        quizState.breakTimeLeft--;
        updateBreakTimerDisplay();
      } else {
        resumeFromBreak();
      }
    }, 1000);
  }

  function stopBreakTimer() {
    if (quizState.breakInterval) {
      clearInterval(quizState.breakInterval);
      quizState.breakInterval = null;
    }
  }

  function updateBreakTimerDisplay() {
    const minutes = Math.floor(quizState.breakTimeLeft / 60);
    const seconds = quizState.breakTimeLeft % 60;
    const pad = (num) => num.toString().padStart(2, '0');
    document.getElementById('breakTimerDisplay').textContent = `${pad(minutes)}:${pad(seconds)}`;
  }

  function resumeFromBreak() {
    stopBreakTimer();
    quizState.isPaused = false; // Resume main exam timer
    document.getElementById('breakOverlay').style.display = 'none';
    
    // Proceed to the next question after break
    quizState.currentQ++;
    renderQuestion();
  }

  function renderQuestion() {
    if (!quizState.questions || quizState.questions.length === 0) {
      alert('Question database is not loaded yet. Please wait.');
      return;
    }

    const q = quizState.questions[quizState.currentQ];
    const total = quizState.questions.length;
    const num = quizState.currentQ + 1;

    document.getElementById('qNumber').textContent = `Question ${num} of ${total}`;
    document.getElementById('quizCurrentNum').textContent = num;
    document.getElementById('quizScoreDisplay').textContent = quizState.score;
    document.getElementById('quizProgressFill').style.width = `${(num / total) * 100}%`;

    document.getElementById('qScenario').textContent = q.scenario;
    document.getElementById('qText').textContent = q.question;

    const optionsContainer = document.getElementById('qOptions');
    optionsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `<span class="option-letter">${letters[i]}</span><span>${opt}</span>`;
      btn.addEventListener('click', () => selectAnswer(i));
      optionsContainer.appendChild(btn);
    });

    // Reset UI state for this question
    quizState.selectedAnswer = -1;
    quizState.answered = false;
    document.getElementById('qExplanation').classList.remove('visible');
    
    // In Full Exam Mode, the Submit button text acts like "Next" or "Finish" directly
    if (quizState.mode === 'full') {
      const isLast = quizState.currentQ === total - 1;
      document.getElementById('quizSubmitBtn').textContent = isLast ? 'Finish Exam 🏁' : 'Submit & Next →';
      document.getElementById('quizSubmitBtn').classList.remove('hidden');
      document.getElementById('quizSubmitBtn').disabled = true;
      document.getElementById('quizNextBtn').classList.add('hidden');
    } else {
      document.getElementById('quizSubmitBtn').textContent = 'Submit Answer';
      document.getElementById('quizSubmitBtn').classList.remove('hidden');
      document.getElementById('quizSubmitBtn').disabled = true;
      document.getElementById('quizNextBtn').classList.add('hidden');
    }
  }

  function selectAnswer(index) {
    if (quizState.answered) return;
    quizState.selectedAnswer = index;
    const options = document.querySelectorAll('.option-btn');
    options.forEach((opt, i) => {
      opt.classList.remove('selected');
      if (i === index) opt.classList.add('selected');
    });
    document.getElementById('quizSubmitBtn').disabled = false;
  }

  // Handles click on Submit button
  function handleSubmit() {
    if (quizState.selectedAnswer === -1) return;

    const q = quizState.questions[quizState.currentQ];
    const isCorrect = quizState.selectedAnswer === q.correct;
    if (isCorrect) quizState.score++;

    // Save answer data
    quizState.answers.push({
      questionIndex: quizState.currentQ,
      selected: quizState.selectedAnswer,
      correct: q.correct,
      isCorrect
    });

    if (quizState.mode === 'practice') {
      // Practice mode shows feedback immediately
      quizState.answered = true;
      const options = document.querySelectorAll('.option-btn');
      options.forEach((opt, i) => {
        opt.classList.add('disabled');
        if (i === q.correct) opt.classList.add('correct');
        if (i === quizState.selectedAnswer && !isCorrect) opt.classList.add('wrong');
      });

      document.getElementById('qExplanationText').textContent = q.explanation;
      document.getElementById('qExplanation').classList.add('visible');
      document.getElementById('quizSubmitBtn').classList.add('hidden');

      const isLast = quizState.currentQ === quizState.questions.length - 1;
      document.getElementById('quizNextBtn').classList.remove('hidden');
      document.getElementById('quizNextBtn').textContent = isLast ? 'View Results →' : 'Next Question →';
      document.getElementById('quizScoreDisplay').textContent = quizState.score;
    } else {
      // Full Exam Mode transitions immediately to next question or break without feedback
      const isLast = quizState.currentQ === quizState.questions.length - 1;
      if (isLast) {
        showQuizResults();
      } else {
        // Optional Break Check: Break after question 60 (index 59) and question 120 (index 119)
        const currentNum = quizState.currentQ + 1;
        if (currentNum === 60 || currentNum === 120) {
          startBreak();
        } else {
          quizState.currentQ++;
          renderQuestion();
        }
      }
    }
  }

  function showQuizResults() {
    stopTimer();
    stopBreakTimer();
    document.getElementById('quizActive').classList.add('hidden');
    document.getElementById('quizResults').classList.remove('hidden');

    const score = quizState.score;
    const total = quizState.questions.length;

    // Fill remaining answers in full exam if ended early
    while (quizState.answers.length < total) {
      const idx = quizState.answers.length;
      const q   = quizState.questions[idx];
      quizState.answers.push({ questionIndex: idx, selected: -1, correct: q.correct, isCorrect: false });
    }

    const pct = Math.round((score / total) * 100);
    document.getElementById('finalScoreNum').textContent = score;
    document.getElementById('finalTotalNum').textContent = total;
    document.getElementById('resultsCircle').style.setProperty('--score-pct', pct);

    // ── Domain breakdown ─────────────────────────────────────────
    const domainStats = {};
    quizState.answers.forEach((ans, i) => {
      const q  = quizState.questions[i];
      const d  = q.domain || 'Unknown';
      if (!domainStats[d]) domainStats[d] = { correct: 0, total: 0 };
      domainStats[d].total++;
      if (ans.isCorrect) domainStats[d].correct++;
    });

    // Find weakest domain
    let weakDomain = '', weakPct = 101;
    Object.entries(domainStats).forEach(([d, s]) => {
      const p = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
      if (p < weakPct) { weakPct = p; weakDomain = d; }
    });

    // ── Render domain breakdown widget ───────────────────────────
    const domainBreakdownEl = document.getElementById('quizDomainBreakdown');
    if (domainBreakdownEl) {
      const domainOrder = ['People', 'Process', 'Business Environment'];
      domainBreakdownEl.innerHTML = `
        <h4 style="font-size:0.9rem;font-weight:700;color:var(--text-primary);margin:0 0 12px;">📊 Domain Breakdown</h4>
        ${domainOrder.map(d => {
          const s   = domainStats[d] || { correct: 0, total: 0 };
          const dp  = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
          const isWeak = d === weakDomain && s.total > 0;
          const barColor = dp >= 70 ? 'var(--accent-primary)' : (dp >= 50 ? 'var(--accent-secondary)' : 'var(--accent-warm)');
          return `
            <div style="margin-bottom:10px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                <span style="font-size:0.82rem;color:var(--text-secondary);">${d}${isWeak ? ' ⚠️' : ''}</span>
                <span style="font-size:0.82rem;font-weight:700;color:${barColor};">${s.correct}/${s.total} (${dp}%)</span>
              </div>
              <div style="height:6px;background:var(--border-subtle);border-radius:3px;">
                <div style="height:100%;width:${dp}%;background:${barColor};border-radius:3px;transition:width 0.6s ease;"></div>
              </div>
            </div>`;
        }).join('')}
        ${weakDomain ? `<p style="font-size:0.78rem;color:var(--accent-warm);margin-top:10px;">🎯 Focus next on: <strong>${weakDomain}</strong> (${weakPct}%)</p>` : ''}
      `;
    }

    // ── Persist quiz history to localStorage ─────────────────────
    try {
      const historyRaw  = safeLS.getItem('pmp_quiz_history');
      const history     = historyRaw ? JSON.parse(historyRaw) : [];
      history.push({
        date:    new Date().toLocaleDateString(),
        score,
        total,
        pct,
        mode:    quizState.mode,
        testNum: quizState.testNum || 1,
        domainStats
      });
      // Keep last 10 attempts
      if (history.length > 10) history.splice(0, history.length - 10);
      safeLS.setItem('pmp_quiz_history', JSON.stringify(history));
      renderQuizHistory();
    } catch(e) { /* storage quota or parse error — silently continue */ }

    let message, sub;
    if (pct >= 80) {
      message = '🎉 Excellent! You\'re PMP Ready!';
      sub = `You scored ${pct}% — well above the passing threshold. Keep reviewing weak areas.`;
    } else if (pct >= 65) {
      message = '👍 Good Progress!';
      sub = `You scored ${pct}%. You\'re close — focus on questions you missed and the domains shown below.`;
    } else {
      message = '📚 Keep Studying!';
      sub = `You scored ${pct}%. Review the explanations below, revisit study sections for your weakest domain, and retake.`;
    }
    document.getElementById('resultsMessage').textContent = message;
    document.getElementById('resultsSub').textContent     = sub;

    // ── Build review section (lazy render on toggle) ──────────────
    const reviewSection = document.getElementById('quizReviewSection');
    reviewSection.innerHTML = '';
    reviewSection.classList.add('hidden');
    document.getElementById('quizReviewBtn').textContent = '📋 Review Answers';

    // Store answers reference for lazy rendering
    reviewSection._answers   = quizState.answers.slice();
    reviewSection._questions = quizState.questions.slice();
  }

  // ── Lazy paginated review renderer (avoids DOM freeze on 180q) ──
  function renderReviewPage(reviewSection, pageNum) {
    const answers   = reviewSection._answers   || [];
    const questions = reviewSection._questions || [];
    const PAGE_SIZE = 25;
    const start     = pageNum * PAGE_SIZE;
    const end       = Math.min(start + PAGE_SIZE, answers.length);
    const totalPages = Math.ceil(answers.length / PAGE_SIZE);
    reviewSection.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    for (let idx = start; idx < end; idx++) {
      const ans  = answers[idx];
      const q    = questions[ans.questionIndex];
      const statusColor  = ans.isCorrect ? 'var(--accent-primary)' : 'var(--accent-warm)';
      const statusSymbol = ans.isCorrect ? '✓' : '✗';
      const card = document.createElement('div');
      card.className = 'question-card';
      card.style.marginBottom = '16px';
      card.innerHTML = `
        <div class="question-number" style="color:${statusColor}">
          ${statusSymbol} Question ${idx + 1} (${q.domain} Domain)
        </div>
        <div class="question-scenario">${q.scenario}</div>
        <div class="question-text">${q.question}</div>
        <div style="margin-bottom:12px;">
          ${q.options.map((opt, i) => {
            let cls = '';
            if (i === q.correct)                         cls = 'color:var(--accent-primary);font-weight:600;';
            if (i === ans.selected && !ans.isCorrect)    cls = 'color:var(--accent-warm);text-decoration:line-through;';
            return `<div style="padding:6px 0;font-size:0.85rem;${cls}">${letters[i]}. ${opt}</div>`;
          }).join('')}
        </div>
        <div class="explanation-box visible" style="border-left:3px solid ${statusColor}">
          <h4>💡 Why ${letters[q.correct]} is the best answer:</h4>
          <p>${q.explanation}</p>
        </div>`;
      reviewSection.appendChild(card);
    }

    // Pagination controls
    if (totalPages > 1) {
      const pager = document.createElement('div');
      pager.style.cssText = 'display:flex;justify-content:center;gap:10px;margin:20px 0;flex-wrap:wrap;';
      for (let p = 0; p < totalPages; p++) {
        const btn = document.createElement('button');
        btn.className = `btn ${p === pageNum ? 'btn-primary' : 'btn-secondary'}`;
        btn.style.cssText = 'padding:6px 14px;font-size:0.8rem;';
        btn.textContent = `${p * PAGE_SIZE + 1}–${Math.min((p + 1) * PAGE_SIZE, answers.length)}`;
        btn.addEventListener('click', () => renderReviewPage(reviewSection, p));
        pager.appendChild(btn);
      }
      reviewSection.insertBefore(pager, reviewSection.firstChild);
      reviewSection.appendChild(pager.cloneNode(true));
      // Re-attach events on cloned pager
      reviewSection.lastChild.querySelectorAll('button').forEach((btn, p) => {
        btn.addEventListener('click', () => renderReviewPage(reviewSection, p));
      });
    }
  }

  // ── Quiz history renderer for dashboard ──────────────────────────
  function renderQuizHistory() {
    const historyEl = document.getElementById('quizHistoryWidget');
    if (!historyEl) return;
    try {
      const raw     = safeLS.getItem('pmp_quiz_history');
      const history = raw ? JSON.parse(raw) : [];
      if (!history.length) {
        historyEl.innerHTML = '<p style="color:var(--text-muted);font-size:0.82rem;">No quiz history yet. Take your first quiz!</p>';
        return;
      }
      const recent = history.slice(-5).reverse();
      historyEl.innerHTML = `
        <h4 style="font-size:0.85rem;font-weight:700;color:var(--text-primary);margin:0 0 10px;">📈 Recent Quiz History</h4>
        ${recent.map(h => {
          const col = h.pct >= 80 ? 'var(--accent-primary)' : (h.pct >= 65 ? 'var(--accent-secondary)' : 'var(--accent-warm)');
          return `<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border-subtle);">
            <span style="font-size:0.78rem;color:var(--text-secondary);">${h.date} · ${h.mode === 'full' ? 'Mock Test ' + (h.testNum || 1) : 'Practice'}</span>
            <span style="font-size:0.9rem;font-weight:700;color:${col};">${h.pct}%</span>
          </div>`;
        }).join('')}
      `;
    } catch(e) { /* ignore */ }
  }

  // Setup click listeners for new elements
  document.getElementById('quizSubmitBtn').addEventListener('click', handleSubmit);
  
  document.getElementById('quizNextBtn').addEventListener('click', () => {
    if (quizState.currentQ < quizState.questions.length - 1) {
      quizState.currentQ++;
      renderQuestion();
    } else {
      showQuizResults();
    }
  });

  // Quiz mode buttons — read selected test number from dropdown
  document.getElementById('btnModePractice').addEventListener('click', () => {
    const sel = document.getElementById('mockTestSelector');
    startQuiz('practice', sel ? parseInt(sel.value) : 1);
  });
  document.getElementById('btnModeFull').addEventListener('click', () => {
    const sel = document.getElementById('mockTestSelector');
    startQuiz('full', sel ? parseInt(sel.value) : 1);
  });
  document.getElementById('quizPauseBtn').addEventListener('click', pauseExam);
  document.getElementById('btnResumeExam').addEventListener('click', resumeExam);
  document.getElementById('btnResumeFromBreak').addEventListener('click', resumeFromBreak);
  
  document.getElementById('quizEndEarlyBtn').addEventListener('click', () => {
    const msg = quizState.mode === 'full'
      ? 'Are you sure you want to quit the exam? Your progress will be graded based on answered questions.'
      : 'Are you sure you want to end this practice quiz?';
    showConfirmModal(msg, () => showQuizResults());
  });

  document.getElementById('quizReviewBtn').addEventListener('click', () => {
    const reviewSection = document.getElementById('quizReviewSection');
    const isHidden = reviewSection.classList.contains('hidden');
    reviewSection.classList.toggle('hidden');
    document.getElementById('quizReviewBtn').textContent = isHidden ? '📋 Hide Review' : '📋 Review Answers';
    if (isHidden && reviewSection._answers && !reviewSection.querySelector('.question-card')) {
      renderReviewPage(reviewSection, 0);
    }
  });

  document.getElementById('quizRetakeBtn').addEventListener('click', () => {
    showQuizSetup();
  });

  //  INTERACTIVE PROCESS MATRIX (ITTO MODAL)
  // ══════════════════════════════════════════════
  const ittoDatabase = {
    "4.1": {
      name: "Develop Project Charter",
      pg: "Initiating",
      desc: "Formally authorizes the existence of a project and provides the project manager with the authority to apply organizational resources to project activities.",
      inputs: ["Business Documents (Business Case, Benefits Management Plan)", "Agreements", "Enterprise Environmental Factors (EEFs)", "Organizational Process Assets (OPAs)"],
      tools: ["Expert Judgment", "Data Gathering (Brainstorming, Focus groups, Interviews)", "Interpersonal & Team Skills (Conflict management, Facilitation, Meeting management)", "Meetings"],
      outputs: ["Project Charter (authorizes the project)", "Assumption Log (records assumptions and constraints)"]
    },
    "4.2": {
      name: "Develop Project Management Plan",
      pg: "Planning",
      desc: "Defines, prepares, and coordinates all plan components and consolidates them into an integrated project management plan.",
      inputs: ["Project Charter", "Outputs from other processes", "EEFs", "OPAs"],
      tools: ["Expert Judgment", "Data Gathering (Brainstorming, Checklists, Focus groups)", "Interpersonal & Team Skills (Conflict management, Facilitation)", "Meetings"],
      outputs: ["Project Management Plan (consolidated baselines and subsidiary plans)"]
    },
    "4.3": {
      name: "Direct and Manage Project Work",
      pg: "Executing",
      desc: "Leads and performs the work defined in the project management plan and implements approved changes to achieve the project's objectives.",
      inputs: ["Project Management Plan", "Project Documents (Schedule, Requirements traceability, Risk register)", "Approved Change Requests (key input!)", "EEFs", "OPAs"],
      tools: ["Expert Judgment", "Project Management Information System (PMIS)", "Meetings"],
      outputs: ["Deliverables (raw product/service)", "Work Performance Data (raw observations)", "Issue Log", "Change Requests", "PM Plan Updates"]
    },
    "4.4": {
      name: "Manage Project Knowledge",
      pg: "Executing",
      desc: "Uses existing knowledge and creates new knowledge to achieve the project's objectives and contribute to organizational learning.",
      inputs: ["Project Management Plan", "Project Documents (Lessons learned, Team assignments)", "Deliverables", "EEFs", "OPAs"],
      tools: ["Expert Judgment", "Knowledge Management (Networking, Communities of practice, Shadowing)", "Information Management (Lessons learned repository)", "Interpersonal Skills (Active listening, Facilitation)"],
      outputs: ["Lessons Learned Register (major output for organizational learning)", "Project Management Plan Updates", "OPA Updates"]
    },
    "4.5": {
      name: "Monitor & Control Project Work",
      pg: "Monitoring & Controlling",
      desc: "Tracks, reviews, and reports project progress against performance objectives defined in the project management plan.",
      inputs: ["Project Management Plan", "Work Performance Information (KPI status updates)", "Cost/Schedule Forecasts", "Agreements", "EEFs & OPAs"],
      tools: ["Expert Judgment", "Data Analysis (Earned Value, Root cause, Trend, Variance analysis)", "Decision Making", "Meetings"],
      outputs: ["Work Performance Reports (Dashboards, status reports)", "Change Requests", "Project Management Plan Updates"]
    },
    "4.6": {
      name: "Perform Integrated Change Control",
      pg: "Monitoring & Controlling",
      desc: "Reviews all change requests; approves changes and manages changes to deliverables, project documents, and the project management plan.",
      inputs: ["Project Management Plan (Change mgmt plan, Scope/Cost/Schedule baselines)", "Project Documents (Requirements traceability, Risk report)", "Work Performance Reports", "Change Requests (key input!)", "EEFs & OPAs"],
      tools: ["Expert Judgment", "Change Control Tools", "Data Analysis (Cost-benefit, Alternatives)", "Decision Making (Voting, Multicriteria decision analysis)", "Meetings (Change Control Board)"],
      outputs: ["Approved Change Requests", "Project Management Plan Updates", "Project Documents Updates"]
    },
    "4.7": {
      name: "Close Project or Phase",
      pg: "Closing",
      desc: "Finalizes all activities across all of the Project Management Process Groups to formally close the project or phase.",
      inputs: ["Project Charter", "Project Management Plan", "Accepted Deliverables (from Validate Scope)", "Business Documents", "Agreements", "OPA Updates"],
      tools: ["Expert Judgment", "Data Analysis (Document, Regression, Trend, Variance)", "Meetings"],
      outputs: ["Project Document Updates", "Final Product, Service, or Result Transition", "Final Report", "OPA Updates (archived files, lessons learned repository)"]
    },
    "5.1": {
      name: "Plan Scope Management",
      pg: "Planning",
      desc: "Creates a scope management plan that documents how the project scope will be defined, validated, and controlled.",
      inputs: ["Project Charter", "Project Management Plan", "EEFs", "OPAs"],
      tools: ["Expert Judgment", "Data Analysis (Alternatives)", "Meetings"],
      outputs: ["Scope Management Plan", "Requirements Management Plan"]
    },
    "5.2": {
      name: "Collect Requirements",
      pg: "Planning",
      desc: "Determines, documents, and manages stakeholder needs and requirements to meet project objectives.",
      inputs: ["Project Charter", "Project Management Plan", "Business Documents", "Agreements", "EEFs & OPAs"],
      tools: ["Expert Judgment", "Data Gathering (Brainstorming, Interviews, Focus groups, Questionnaires)", "Data Analysis (Document analysis)", "Decision Making (Voting, Multicriteria)", "Data Representation (Mind mapping, Affinity diagrams)", "Prototypes", "Context Diagrams"],
      outputs: ["Requirements Documentation", "Requirements Traceability Matrix (links requirements to business value and deliverables)"]
    },
    "5.3": {
      name: "Define Scope",
      pg: "Planning",
      desc: "Develops a detailed description of the project and product scope.",
      inputs: ["Project Charter", "Project Management Plan", "Project Documents (Assumption log, Requirements documentation)", "EEFs & OPAs"],
      tools: ["Expert Judgment", "Data Analysis (Alternatives)", "Decision Making", "Interpersonal Skills", "Product Analysis (Value engineering, Product breakdown)"],
      outputs: ["Project Scope Statement (detailed description of deliverables, exclusions, and acceptance criteria)", "Project Documents Updates"]
    },
    "5.4": {
      name: "Create WBS",
      pg: "Planning",
      desc: "Subdivides project deliverables and project work into smaller, more manageable components.",
      inputs: ["Project Management Plan", "Project Documents (Scope statement, Requirements)", "EEFs", "OPAs"],
      tools: ["Expert Judgment", "Decomposition (breaking work down to work package level)"],
      outputs: ["Scope Baseline (consists of: Project Scope Statement, WBS, and WBS Dictionary)", "Project Documents Updates"]
    },
    "5.5": {
      name: "Validate Scope",
      pg: "Monitoring & Controlling",
      desc: "Formally accepts the completed project deliverables. Done by the customer/sponsor.",
      inputs: ["Project Management Plan (Scope baseline)", "Project Documents (Lessons learned, Quality reports)", "Verified Deliverables (input from Control Quality!)", "Work Performance Data"],
      tools: ["Inspection (Testing, product reviews, audits)", "Decision Making (Voting)"],
      outputs: ["Accepted Deliverables (signed off by customer)", "Change Requests", "Work Performance Information", "Project Documents Updates"]
    },
    "5.6": {
      name: "Control Scope",
      pg: "Monitoring & Controlling",
      desc: "Monitors the status of the project and product scope and manages changes to the scope baseline.",
      inputs: ["Project Management Plan", "Project Documents (Requirements traceability, Risk register)", "Work Performance Data", "OPAs"],
      tools: ["Data Analysis (Variance and Trend analysis)"],
      outputs: ["Work Performance Information", "Change Requests", "PM Plan Updates", "Project Documents Updates"]
    },
    "6.1": {
      name: "Plan Schedule Management",
      pg: "Planning",
      desc: "Establishes the policies, procedures, and documentation for planning, developing, managing, executing, and controlling the project schedule.",
      inputs: ["Project Charter", "Project Management Plan", "EEFs", "OPAs"],
      tools: ["Expert Judgment", "Data Analysis (Alternatives)", "Meetings"],
      outputs: ["Schedule Management Plan"]
    },
    "6.2": {
      name: "Define Activities",
      pg: "Planning",
      desc: "Identifies and documents the specific actions to be performed to produce the project deliverables.",
      inputs: ["Project Management Plan (Scope baseline)", "EEFs", "OPAs"],
      tools: ["Expert Judgment", "Decomposition", "Rolling Wave Planning (iterative planning technique)", "Meetings"],
      outputs: ["Activity List", "Activity Attributes", "Milestone List", "Change Requests", "PM Plan Updates"]
    },
    "6.3": {
      name: "Sequence Activities",
      pg: "Planning",
      desc: "Identifies and documents relationships among the project activities.",
      inputs: ["Project Management Plan", "Project Documents (Activity list, Activity attributes, Milestone list)", "EEFs & OPAs"],
      tools: ["Precedence Diagramming Method (PDM - FS, FF, SS, SF)", "Dependency Determination (Mandatory, Discretionary, External, Internal)", "Leads and Lags", "Project Management Information System (PMIS)"],
      outputs: ["Project Schedule Network Diagram", "Project Documents Updates"]
    },
    "6.4": {
      name: "Estimate Activity Durations",
      pg: "Planning",
      desc: "Estimates the number of work periods needed to complete individual activities with estimated resources.",
      inputs: ["Project Management Plan", "Project Documents (Activity list, Resource requirements, Resource calendars)", "EEFs & OPAs"],
      tools: ["Expert Judgment", "Analogous Estimating (top-down, historical)", "Parametric Estimating (mathematical relationship)", "Three-Point Estimating (Beta/PERT: (O+4M+P)/6; Triangular: (O+M+P)/3)", "Bottom-Up Estimating", "Data Analysis (Alternatives, Reserve analysis)", "Decision Making", "Meetings"],
      outputs: ["Duration Estimates", "Basis of Estimates", "Project Documents Updates"]
    },
    "6.5": {
      name: "Develop Schedule",
      pg: "Planning",
      desc: "Analyzes activity sequences, durations, resource requirements, and schedule constraints to create the project schedule model.",
      inputs: ["Project Management Plan", "Project Documents (Network diagram, Duration estimates, Resource calendars)", "Agreements", "EEFs & OPAs"],
      tools: ["Schedule Network Analysis", "Critical Path Method (CPM)", "Resource Optimization (Resource Leveling - affects critical path; Resource Smoothing - does not affect critical path)", "Data Analysis (What-if scenario, Simulation/Monte Carlo)", "Leads and Lags", "Schedule Compression (Crashing - adds cost; Fast-tracking - adds risk)"],
      outputs: ["Project Schedule (Gantt chart, milestone chart, network diagram)", "Schedule Baseline", "Schedule Data", "Project Calendars", "Change Requests", "PM Plan Updates"]
    },
    "6.6": {
      name: "Control Schedule",
      pg: "Monitoring & Controlling",
      desc: "Monitors the status of the project schedule and manages changes to the schedule baseline.",
      inputs: ["Project Management Plan", "Project Documents (Schedule, Resource calendars)", "Work Performance Data", "OPAs"],
      tools: ["Data Analysis (Earned Value, Iterative burndown chart, Performance review, Trend, Variance)", "Critical Path Method", "Resource Optimization", "Leads and Lags", "Schedule Compression"],
      outputs: ["Work Performance Information", "Change Requests", "PM Plan Updates", "Project Documents Updates"]
    },
    "7.1": {
      name: "Plan Cost Management",
      pg: "Planning",
      desc: "Establishes the policies, procedures, and documentation for planning, managing, expending, and controlling project costs.",
      inputs: ["Project Charter", "Project Management Plan", "EEFs", "OPAs"],
      tools: ["Expert Judgment", "Data Analysis (Alternatives)", "Meetings"],
      outputs: ["Cost Management Plan"]
    },
    "7.2": {
      name: "Estimate Costs",
      pg: "Planning",
      desc: "Develops an approximation of the monetary resources needed to complete project work.",
      inputs: ["Project Management Plan", "Project Documents (Schedule, Resource requirements, Quality register)", "EEFs & OPAs"],
      tools: ["Expert Judgment", "Analogous Estimating", "Parametric Estimating", "Bottom-Up Estimating", "Three-Point Estimating", "Data Analysis (Alternatives, Reserve analysis - contingency and management reserves)", "Project Management Information System (PMIS)", "Decision Making"],
      outputs: ["Cost Estimates", "Basis of Estimates", "Project Documents Updates"]
    },
    "7.3": {
      name: "Determine Budget",
      pg: "Planning",
      desc: "Aggregates the estimated costs of individual activities or work packages to establish an authorized cost baseline.",
      inputs: ["Project Management Plan", "Project Documents (Cost estimates, Basis of estimates, Schedule)", "Business Documents", "Agreements", "EEFs & OPAs"],
      tools: ["Expert Judgment", "Cost Aggregation", "Data Analysis (Reserve analysis)", "Historical Information Review", "Funding Limit Reconciliation (reconciliation of budget limits against schedule funding requirements)"],
      outputs: ["Cost Baseline (S-curve, excludes management reserves)", "Project Funding Requirements", "Project Documents Updates"]
    },
    "7.4": {
      name: "Control Costs",
      pg: "Monitoring & Controlling",
      desc: "Monitors the status of the project budget and manages changes to the cost baseline.",
      inputs: ["Project Management Plan", "Project Documents (Cost baseline, Funding requirements)", "Work Performance Data", "OPAs"],
      tools: ["Data Analysis (Earned Value Management, Variance analysis, Trend analysis, Reserve analysis)", "To-Complete Performance Index (TCPI)", "Project Management Information System (PMIS)"],
      outputs: ["Work Performance Information", "Cost Forecasts (EAC)", "Change Requests", "PM Plan Updates", "Project Documents Updates"]
    },
    "8.1": {
      name: "Plan Quality Management",
      pg: "Planning",
      desc: "Identifies quality requirements and/or standards for the project and its deliverables, and documents how the project will demonstrate compliance.",
      inputs: ["Project Charter", "Project Management Plan", "Project Documents (Requirements, Risk register, Stakeholder register)", "EEFs & OPAs"],
      tools: ["Expert Judgment", "Data Gathering (Benchmarking, Brainstorming)", "Data Analysis (Cost-benefit analysis, Cost of Quality - COQ)", "Decision Making", "Data Representation (Flowcharts, Matrix diagrams, Logical data models)", "Test and Inspection Planning", "Meetings"],
      outputs: ["Quality Management Plan", "Quality Metrics (tolerances, defect rates)", "PM Plan Updates", "Project Documents Updates"]
    },
    "8.2": {
      name: "Manage Quality",
      pg: "Executing",
      desc: "Translates the quality management plan into executable quality activities that incorporate the organization's quality policies into the project.",
      inputs: ["Project Management Plan", "Project Documents (Quality metrics, Quality control measurements)", "OPAs"],
      tools: ["Quality Audits (key tool - independent review of compliance)", "Design for X", "Problem Solving", "Quality Improvement Methods", "Data Analysis (Alternatives, Process analysis, Root cause analysis)", "Data Representation (Cause-and-effect diagrams, Histograms, Scatter diagrams)"],
      outputs: ["Quality Reports", "Test and Evaluation Documents", "Change Requests", "PM Plan Updates", "Project Documents Updates"]
    },
    "8.3": {
      name: "Control Quality",
      pg: "Monitoring & Controlling",
      desc: "Monitors and records results of executing the quality management activities to assess performance and ensure the project outputs are complete and correct.",
      inputs: ["Project Management Plan", "Project Documents (Quality metrics, Test documents)", "Deliverables (raw work products)", "Work Performance Data", "Approved Change Requests"],
      tools: ["Data Gathering (Checklists, Statistical sampling)", "Data Analysis (Performance review, Root cause)", "Inspection (audits, walk-throughs)", "Data Representation (Control charts, Pareto charts, Checksheets)", "Testing/Product Evaluations", "Meetings"],
      outputs: ["Quality Control Measurements", "Verified Deliverables (input for Validate Scope!)", "Work Performance Information", "Change Requests", "Project Documents Updates"]
    },
    "9.1": {
      name: "Plan Resource Management",
      pg: "Planning",
      desc: "Establishes how to estimate, acquire, manage, and utilize physical and team resources.",
      inputs: ["Project Charter", "Project Management Plan", "Project Documents (Schedule, Requirements traceability, Risk register)", "EEFs & OPAs"],
      tools: ["Expert Judgment", "Data Representation (Hierarchical charts/WBS/OBS, Responsibility Assignment Matrix/RAM/RACI chart, Text-oriented formats)", "Organizational Theory", "Meetings"],
      outputs: ["Resource Management Plan", "Team Charter (defines team values, communication guidelines, conflict resolution)", "Project Documents Updates"]
    },
    "9.2": {
      name: "Estimate Activity Resources",
      pg: "Planning",
      desc: "Estimates the type and quantities of team resources and physical resources (materials, equipment, supplies) required to perform project work.",
      inputs: ["Project Management Plan", "Project Documents (Activity list, Activity attributes, Resource calendars)", "EEFs & OPAs"],
      tools: ["Expert Judgment", "Bottom-Up Estimating", "Analogous Estimating", "Parametric Estimating", "Data Analysis (Alternatives)", "Project Management Information System (PMIS)", "Meetings"],
      outputs: ["Resource Requirements", "Basis of Estimates", "Resource Breakdown Structure (RBS)", "Project Documents Updates"]
    },
    "9.3": {
      name: "Acquire Resources",
      pg: "Executing",
      desc: "Obtains team members, facilities, equipment, materials, supplies, and other resources necessary to complete project work.",
      inputs: ["Project Management Plan", "Project Documents (Schedule, Resource calendars, Requirements)", "EEFs & OPAs"],
      tools: ["Decision Making (Multi-criteria decision analysis)", "Interpersonal Skills (Negotiation with functional managers and other PMs)", "Pre-assignment", "Virtual Teams"],
      outputs: ["Physical Resource Assignments", "Project Team Assignments", "Resource Calendars", "Change Requests", "PM Plan Updates", "Project Documents Updates"]
    },
    "9.4": {
      name: "Develop Team",
      pg: "Executing",
      desc: "Improves competencies, team member interaction, and the overall team environment to enhance project performance.",
      inputs: ["Project Management Plan", "Project Documents (Assignments, Calendars)", "EEFs & OPAs"],
      tools: ["Colocation (War room)", "Virtual Teams", "Communication Technology", "Interpersonal Skills (Conflict resolution, Influencing, Motivation, Team building)", "Recognition and Rewards", "Individual and Team Assessments", "Meetings", "Training"],
      outputs: ["Team Performance Assessments", "Change Requests", "PM Plan Updates", "Project Documents Updates", "EEF & OPA Updates"]
    },
    "9.5": {
      name: "Manage Team",
      pg: "Executing",
      desc: "Tracks team member performance, provides feedback, resolves issues, and manages team changes to optimize project performance.",
      inputs: ["Project Management Plan", "Project Documents (Issue log, Team performance assessments)", "Work Performance Reports", "EEFs & OPAs"],
      tools: ["Interpersonal Skills (Conflict Management, Influence, Leadership)", "Project Management Information System (PMIS)"],
      outputs: ["Change Requests", "PM Plan Updates", "Project Documents Updates", "EEF Updates"]
    },
    "9.6": {
      name: "Control Resources",
      pg: "Monitoring & Controlling",
      desc: "Ensures that the physical resources assigned and allocated to the project are available as planned, and monitors their utilization.",
      inputs: ["Project Management Plan", "Project Documents (Resource assignments, Resource breakdown structure, Issue log)", "Work Performance Data", "Agreements", "OPAs"],
      tools: ["Data Analysis (Alternatives, Cost-benefit, Performance reviews, Trend)", "Problem Solving", "Interpersonal Skills (Negotiation, Influencing)", "PMIS"],
      outputs: ["Work Performance Information", "Change Requests", "PM Plan Updates", "Project Documents Updates"]
    },
    "10.1": {
      name: "Plan Communications Management",
      pg: "Planning",
      desc: "Develops an appropriate approach and plan for project communication activities based on the information needs of each stakeholder.",
      inputs: ["Project Charter", "Project Management Plan", "Project Documents (Stakeholder register)", "EEFs & OPAs"],
      tools: ["Expert Judgment", "Communication Requirements Analysis (Communication Channels: N*(N-1)/2)", "Communication Technology", "Communication Models (Sender-receiver, feedback loops)", "Communication Methods (Interactive, Push, Pull)", "Data Representation (Stakeholder engagement assessment matrix)", "Meetings"],
      outputs: ["Communications Management Plan", "PM Plan Updates", "Project Documents Updates"]
    },
    "10.2": {
      name: "Manage Communications",
      pg: "Executing",
      desc: "Ensures timely and appropriate collection, creation, distribution, storage, retrieval, management, monitoring, and ultimate disposition of project information.",
      inputs: ["Project Management Plan", "Project Documents (Issue log, Quality report, Risk register, Stakeholder register)", "Work Performance Reports", "EEFs & OPAs"],
      tools: ["Communication Technology", "Communication Methods", "Communication Skills (Competence, Feedback, Nonverbal, Presentations)", "Project Management Information System (PMIS)", "Project Reporting", "Interpersonal Skills (Active listening, Networking)", "Meetings"],
      outputs: ["Project Communications", "PM Plan Updates", "Project Documents Updates", "OPA Updates"]
    },
    "10.3": {
      name: "Monitor Communications",
      pg: "Monitoring & Controlling",
      desc: "Monitors and controls communications throughout the entire project life cycle to ensure the information needs of the project stakeholders are met.",
      inputs: ["Project Management Plan", "Project Documents (Issue log, Project communications)", "Work Performance Data", "EEFs & OPAs"],
      tools: ["Expert Judgment", "Project Management Information System (PMIS)", "Data Analysis (Stakeholder engagement matrix)", "Interpersonal Skills (Active listening)", "Meetings"],
      outputs: ["Work Performance Information", "Change Requests", "PM Plan Updates", "Project Documents Updates"]
    },
    "11.1": {
      name: "Plan Risk Management",
      pg: "Planning",
      desc: "Defines how to conduct risk management activities for a project.",
      inputs: ["Project Charter", "Project Management Plan", "Project Documents (Stakeholder register)", "EEFs & OPAs"],
      tools: ["Expert Judgment", "Data Analysis (Stakeholder analysis)", "Meetings"],
      outputs: ["Risk Management Plan (includes: risk strategy, methodology, roles, funding, timing, risk categories/RBS, appetite)"]
    },
    "11.2": {
      name: "Identify Risks",
      pg: "Planning",
      desc: "Identifies individual project risks as well as sources of overall project risk, and documents their characteristics.",
      inputs: ["Project Management Plan", "Project Documents (Assumption log, Issue log, Requirements, Stakeholder register)", "Agreements", "Procurement Contracts", "EEFs & OPAs"],
      tools: ["Expert Judgment", "Data Gathering (Brainstorming, Checklists, Interviews)", "Data Analysis (Root cause, Assumption/Constraint analysis, SWOT, Document analysis)", "Interpersonal Skills", "Prompt Lists", "Meetings"],
      outputs: ["Risk Register (list of identified risks, potential risk owners, list of responses)", "Risk Report", "Project Documents Updates"]
    },
    "11.3": {
      name: "Qualitative Risk Analysis",
      pg: "Planning",
      desc: "Prioritizes individual project risks for further analysis or action by assessing their probability of occurrence and impact.",
      inputs: ["Project Management Plan", "Project Documents (Risk register, Assumption log)", "EEFs & OPAs"],
      tools: ["Expert Judgment", "Data Gathering (Interviews)", "Data Analysis (Risk data quality assessment, Risk probability and impact assessment)", "Interpersonal Skills", "Risk Categorization", "Data Representation (Probability and impact matrix, Bubble charts)", "Meetings"],
      outputs: ["Project Documents Updates (Risk register updates - priority scores, categorization)"]
    },
    "11.4": {
      name: "Quantitative Risk Analysis",
      pg: "Planning",
      desc: "Numerically analyzes the combined effect of identified individual project risks and other sources of uncertainty on overall project objectives.",
      inputs: ["Project Management Plan", "Project Documents (Risk register, Risk report)", "EEFs & OPAs"],
      tools: ["Expert Judgment", "Data Gathering (Interviews)", "Interpersonal Skills", "Representations of Uncertainty (Beta, Triangular)", "Data Analysis (Simulation/Monte Carlo, Decision Tree Analysis, Sensitivity analysis/Tornado diagrams)"],
      outputs: ["Project Documents Updates (Quantitative assessment of probability of meeting targets, contingency reserves needed)"]
    },
    "11.5": {
      name: "Plan Risk Responses",
      pg: "Planning",
      desc: "Develops options, selects strategies, and agrees on actions to address overall project risk exposure and treat individual project risks.",
      inputs: ["Project Management Plan", "Project Documents (Risk register, Risk report, Lessons learned)", "EEFs & OPAs"],
      tools: ["Expert Judgment", "Strategies for Threats (Avoid, Escalate, Transfer, Mitigate, Accept)", "Strategies for Opportunities (Exploit, Escalate, Share, Enhance, Accept)", "Contingent Response Strategies (Fallback plans)", "Strategies for Overall Project Risk", "Data Gathering & Analysis", "Decision Making"],
      outputs: ["Change Requests", "PM Plan Updates", "Project Documents Updates (Risk register updates - agreed response strategies, triggers, owners)"]
    },
    "11.6": {
      name: "Implement Risk Responses",
      pg: "Executing",
      desc: "Implements agreed-upon risk response plans to address individual and overall project risk.",
      inputs: ["Project Management Plan", "Project Documents (Risk register, Lessons learned)", "OPAs"],
      tools: ["Expert Judgment", "Interpersonal Skills (Influencing risk owners to take action)", "Project Management Information System (PMIS)"],
      outputs: ["Change Requests", "Project Documents Updates (Risk register updates)"]
    },
    "11.7": {
      name: "Monitor Risks",
      pg: "Monitoring & Controlling",
      desc: "Monitors the implementation of agreed-upon risk response plans, tracks identified risks, identifies new risks, and evaluates risk process effectiveness.",
      inputs: ["Project Management Plan", "Project Documents (Risk register, Issue log)", "Work Performance Data", "Work Performance Reports"],
      tools: ["Data Analysis (Technical performance analysis, Reserve analysis)", "Risk Audits (evaluates effectiveness of risk processes)", "Meetings (Risk reviews)"],
      outputs: ["Work Performance Information", "Change Requests", "PM Plan Updates", "Project Documents Updates", "OPA Updates"]
    },
    "12.1": {
      name: "Plan Procurement Management",
      pg: "Planning",
      desc: "Documents project procurement decisions, specifies the approach, and identifies potential sellers.",
      inputs: ["Project Charter", "Project Management Plan", "Project Documents (Requirements, Risk register)", "Business Documents", "EEFs & OPAs"],
      tools: ["Expert Judgment", "Data Gathering (Market research)", "Data Analysis (Make-or-buy analysis)", "Source Selection Analysis", "Meetings"],
      outputs: ["Procurement Management Plan", "Procurement Strategy", "Bid Documents (RFI, RFQ, RFP)", "Procurement Statement of Work (SOW)", "Source Selection Criteria", "Make-or-Buy Decisions", "Independent Cost Estimates", "Change Requests"]
    },
    "12.2": {
      name: "Conduct Procurements",
      pg: "Executing",
      desc: "Obtains seller responses, selects a seller, and awards a contract.",
      inputs: ["Project Management Plan", "Project Documents (Risk register, Requirements)", "Procurement Documentation (Bid docs, SOW)", "Seller Proposals", "EEFs & OPAs"],
      tools: ["Advertising", "Bidder Conferences (ensures equal understanding for all sellers)", "Data Analysis (Proposal evaluation)", "Interpersonal Skills (Negotiation of terms and price)"],
      outputs: ["Selected Sellers", "Agreement (Contracts)", "Change Requests", "PM Plan Updates", "Project Documents Updates"]
    },
    "12.3": {
      name: "Control Procurements",
      pg: "Monitoring & Controlling",
      desc: "Manages procurement relationships, monitors contract performance, and makes changes and corrections to contracts as appropriate.",
      inputs: ["Project Management Plan", "Project Documents (Requirements, Risk register)", "Agreements", "Procurement Documentation", "Work Performance Data", "Approved Change Requests", "EEFs & OPAs"],
      tools: ["Claims Administration (handling disputes/changes - negotiation is preferred)", "Data Analysis (Performance review, Earned value)", "Inspections and Audits"],
      outputs: ["Closed Procurements (written notification of closure)", "Work Performance Information", "Change Requests", "PM Plan Updates", "Project Documents Updates"]
    },
    "13.1": {
      name: "Identify Stakeholders",
      pg: "Initiating",
      desc: "Identifies the people, groups, or organizations that could impact or be impacted by a decision, activity, or outcome of the project.",
      inputs: ["Project Charter", "Business Documents", "Project Management Plan", "Agreements", "EEFs & OPAs"],
      tools: ["Expert Judgment", "Data Gathering (Questionnaires, Brainstorming)", "Data Analysis (Stakeholder analysis)", "Data Representation (Stakeholder mapping/Power-interest grid, Salience model)", "Meetings"],
      outputs: ["Stakeholder Register (identification, assessment, and classification details)"]
    },
    "13.2": {
      name: "Plan Stakeholder Engagement",
      pg: "Planning",
      desc: "Develops approaches to involve project stakeholders based on their needs, expectation, interests, and potential impact.",
      inputs: ["Project Charter", "Project Management Plan", "Project Documents (Stakeholder register, Resource calendars)", "Agreements", "EEFs & OPAs"],
      tools: ["Expert Judgment", "Data Gathering", "Data Analysis (Mind mapping, Stakeholder analysis)", "Decision Making", "Data Representation (Stakeholder Engagement Assessment Matrix - Unaware, Resistant, Neutral, Supportive, Leading)", "Meetings"],
      outputs: ["Stakeholder Engagement Plan"]
    },
    "13.3": {
      name: "Manage Stakeholder Engagement",
      pg: "Executing",
      desc: "Communicates and works with stakeholders to meet their needs/expectations, address issues, and foster appropriate involvement.",
      inputs: ["Project Management Plan", "Project Documents (Stakeholder register, Issue log, Change log)", "EEFs & OPAs"],
      tools: ["Expert Judgment", "Communication Skills (Feedback)", "Interpersonal Skills (Conflict management, Active listening, Cultural awareness, Negotiation)", "Ground Rules"],
      outputs: ["Change Requests", "PM Plan Updates", "Project Documents Updates"]
    },
    "13.4": {
      name: "Monitor Stakeholder Engagement",
      pg: "Monitoring & Controlling",
      desc: "Monitors overall project stakeholder relationships and tailors strategies for engaging stakeholders.",
      inputs: ["Project Management Plan", "Project Documents (Issue log, Risk register, Stakeholder register)", "Work Performance Data", "EEFs & OPAs"],
      tools: ["Data Analysis (Alternative, Root cause, Stakeholder analysis)", "Decision Making", "Data Representation (Stakeholder engagement matrix)", "Communication Skills", "Interpersonal Skills", "Meetings"],
      outputs: ["Work Performance Information", "Change Requests", "PM Plan Updates", "Project Documents Updates"]
    }
  };

  // Modal DOM Elements
  const ittoModal = document.getElementById('ittoModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalPgBadge = document.getElementById('modalPgBadge');
  const modalDesc = document.getElementById('modalDesc');
  const modalInputs = document.getElementById('modalInputs');
  const modalTools = document.getElementById('modalTools');
  const modalOutputs = document.getElementById('modalOutputs');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  const pmpComponentsForProcess = {
    "4.3": ["Any components"],
    "4.4": ["All components"],
    "4.5": ["All components"],
    "4.6": ["Change management plan", "Configuration management plan", "Scope baseline", "Schedule baseline", "Cost baseline"],
    "4.7": ["All components"],
    "5.2": ["Scope management plan", "Requirements management plan", "Stakeholder engagement plan"],
    "5.3": ["Scope management plan"],
    "5.4": ["Scope management plan"],
    "5.5": ["Scope management plan", "Scope baseline"],
    "5.6": ["Scope management plan", "Scope baseline", "Change management plan", "Configuration management plan", "Performance measurement baseline"],
    "6.1": ["Scope management plan", "Development approach"],
    "6.2": ["Schedule management plan", "Scope baseline"],
    "6.3": ["Schedule management plan", "Scope baseline"],
    "6.4": ["Schedule management plan", "Scope baseline"],
    "6.5": ["Schedule management plan", "Scope baseline"],
    "6.6": ["Schedule management plan", "Schedule baseline", "Scope baseline", "Performance measurement baseline"],
    "7.1": ["Scope management plan", "Risk management plan"],
    "7.2": ["Cost management plan", "Quality management plan", "Scope baseline"],
    "7.3": ["Cost management plan", "Resource management plan", "Scope baseline"],
    "7.4": ["Cost management plan", "Cost baseline", "Performance measurement baseline"],
    "8.1": ["Requirements management plan", "Risk management plan", "Stakeholder engagement plan", "Scope baseline"],
    "8.2": ["Quality management plan"],
    "8.3": ["Quality management plan"],
    "9.1": ["Quality management plan", "Scope baseline"],
    "9.2": ["Resource management plan", "Scope baseline"],
    "9.3": ["Resource management plan", "Procurement management plan", "Cost baseline"],
    "9.4": ["Resource management plan"],
    "9.5": ["Resource management plan"],
    "9.6": ["Resource management plan"],
    "10.1": ["Resource management plan", "Stakeholder engagement plan"],
    "10.2": ["Resource management plan", "Communications management plan", "Stakeholder engagement plan"],
    "10.3": ["Communications management plan", "Stakeholder engagement plan"],
    "11.1": ["All components"],
    "11.2": ["Requirements management plan", "Schedule management plan", "Cost management plan", "Quality management plan", "Resource management plan", "Risk management plan", "Scope baseline", "Schedule baseline", "Cost baseline"],
    "11.3": ["Risk management plan"],
    "11.4": ["Risk management plan", "Scope baseline", "Schedule baseline", "Cost baseline"],
    "11.5": ["Resource management plan", "Risk management plan", "Cost baseline"],
    "11.6": ["Resource management plan", "Risk management plan"],
    "11.7": ["Risk management plan"],
    "12.1": ["Scope management plan", "Quality management plan", "Resource management plan", "Scope baseline"],
    "12.2": ["Scope management plan", "Requirements management plan", "Communications management plan", "Risk management plan", "Procurement management plan", "Stakeholder engagement plan", "Configuration management plan", "Scope baseline"],
    "12.3": ["Requirements management plan", "Risk management plan", "Procurement management plan", "Change management plan", "Schedule baseline"],
    "13.2": ["Resource management plan", "Communications management plan", "Risk management plan"],
    "13.3": ["Communications management plan", "Risk management plan", "Stakeholder engagement plan", "Change management plan"],
    "13.4": ["Resource management plan", "Communications management plan", "Stakeholder engagement plan"]
  };

  const pmpUpdatesForProcess = {
    "4.3": ["Any component"],
    "4.4": ["Any component"],
    "4.5": ["Any component"],
    "4.6": ["Any component"],
    "5.2": ["Scope management plan", "Requirements management plan"],
    "5.3": ["Scope management plan", "Scope baseline"],
    "5.4": ["Scope management plan", "Scope baseline"],
    "5.5": ["Scope baseline"],
    "5.6": ["Scope management plan", "Scope baseline", "Schedule baseline", "Cost baseline"],
    "6.2": ["Schedule baseline"],
    "6.4": ["Schedule baseline", "Cost baseline"],
    "6.5": ["Schedule management plan", "Schedule baseline"],
    "6.6": ["Schedule management plan", "Schedule baseline", "Cost baseline"],
    "7.2": ["Cost management plan", "Cost baseline"],
    "7.3": ["Cost baseline"],
    "7.4": ["Cost management plan", "Cost baseline"],
    "8.1": ["Quality management plan"],
    "8.2": ["Quality management plan"],
    "8.3": ["Quality management plan"],
    "9.2": ["Resource management plan"],
    "9.3": ["Resource management plan", "Cost baseline"],
    "9.4": ["Resource management plan"],
    "9.5": ["Resource management plan"],
    "9.6": ["Resource management plan"],
    "10.1": ["Communications management plan"],
    "10.2": ["Communications management plan"],
    "10.3": ["Communications management plan"],
    "11.3": ["Risk management plan"],
    "11.4": ["Risk management plan"],
    "11.5": ["Resource management plan", "Risk management plan", "Schedule baseline", "Cost baseline"],
    "11.6": ["Risk management plan"],
    "11.7": ["Risk management plan"],
    "12.1": ["Scope management plan", "Quality management plan", "Procurement management plan"],
    "12.2": ["Requirements management plan", "Quality management plan", "Resource management plan", "Communications management plan", "Risk management plan", "Procurement management plan", "Stakeholder engagement plan", "Scope baseline", "Schedule baseline", "Cost baseline"],
    "12.3": ["Requirements management plan", "Risk management plan", "Procurement management plan", "Schedule baseline", "Cost baseline"],
    "13.3": ["Stakeholder engagement plan"],
    "13.4": ["Resource management plan", "Communications management plan", "Stakeholder engagement plan"]
  };

  function openIttoModal(id) {
    const data = ittoDatabase[id];
    if (!data) return;

    modalTitle.textContent = `${id} ${data.name}`;
    modalDesc.textContent = data.desc;
    
    // Set up badge color depending on Process Group
    modalPgBadge.textContent = data.pg;
    modalPgBadge.className = 'modal-pg-badge'; // reset
    if (data.pg.includes('Initiating')) modalPgBadge.style.background = 'rgba(6, 214, 160, 0.15)', modalPgBadge.style.color = '#06d6a0';
    else if (data.pg.includes('Planning')) modalPgBadge.style.background = 'rgba(17, 138, 178, 0.15)', modalPgBadge.style.color = '#118ab2';
    else if (data.pg.includes('Executing')) modalPgBadge.style.background = 'rgba(123, 97, 255, 0.15)', modalPgBadge.style.color = '#7b61ff';
    else if (data.pg.includes('Monitoring')) modalPgBadge.style.background = 'rgba(255, 159, 28, 0.15)', modalPgBadge.style.color = '#ff9f1c';
    else if (data.pg.includes('Closing')) modalPgBadge.style.background = 'rgba(239, 71, 111, 0.15)', modalPgBadge.style.color = '#ef476f';

    // Populate lists (with expanded components for Project Management Plan inputs)
    modalInputs.innerHTML = data.inputs.map(item => {
      if (item.toLowerCase().includes('project management plan')) {
        const components = pmpComponentsForProcess[id];
        if (components && components.length > 0) {
          const subList = `<ul style="margin-top:6px; padding-left:20px; font-size:0.82rem; color:var(--text-secondary); list-style-type:circle;">` + 
            components.map(comp => `<li>${comp}</li>`).join('') + 
            `</ul>`;
          return `<li><strong>${item}</strong>:${subList}</li>`;
        }
      }
      return `<li>${item}</li>`;
    }).join('');
    
    modalTools.innerHTML = data.tools.map(item => `<li>${item}</li>`).join('');
    
    // Populate outputs (with expanded components for Project Management Plan updates / outputs)
    modalOutputs.innerHTML = data.outputs.map(item => {
      if (item.toLowerCase().includes('plan updates')) {
        const updates = pmpUpdatesForProcess[id];
        if (updates && updates.length > 0) {
          const subList = `<ul style="margin-top:6px; padding-left:20px; font-size:0.82rem; color:var(--text-secondary); list-style-type:circle;">` + 
            updates.map(upd => `<li>${upd}</li>`).join('') + 
            `</ul>`;
          return `<li><strong>${item}</strong>:${subList}</li>`;
        }
      }
      return `<li>${item}</li>`;
    }).join('');

    ittoModal.classList.add('open');
  }

  function closeIttoModal() {
    ittoModal.classList.remove('open');
  }

  // Setup click listeners on all proc-items in the matrix
  document.querySelectorAll('.proc-item').forEach(item => {
    item.addEventListener('click', () => {
      const text = item.textContent.trim();
      const match = text.match(/^(\d+\.\d+)/);
      if (match) {
        openIttoModal(match[1]);
      }
    });
  });

  // Setup column header click listeners to show summary of that process group
  document.querySelectorAll('.process-matrix th').forEach(th => {
    // Only target columns with group dropdowns (Initiating, Planning, etc.)
    const dropdown = th.querySelector('.group-dropdown');
    if (dropdown) {
      th.addEventListener('click', (e) => {
        // Prevent click if clicking inside dropdown tooltip
        if (e.target.closest('.group-dropdown')) return;

        const title = dropdown.querySelector('h4').textContent;
        const desc = dropdown.querySelector('p').textContent;
        const count = dropdown.querySelector('.badge').textContent;

        modalTitle.textContent = title;
        modalPgBadge.textContent = count;
        modalPgBadge.className = 'modal-pg-badge';
        modalPgBadge.style.background = 'var(--accent-primary)';
        modalPgBadge.style.color = 'var(--text-inverse)';

        modalDesc.innerHTML = `<p>${desc}</p><p style="margin-top:8px; font-weight:600; color:var(--accent-primary);">Click on any process item in this column to see its specific Inputs, Tools, and Outputs!</p>`;
        
        modalInputs.innerHTML = '<li>Refer to specific processes in this column.</li>';
        modalTools.innerHTML = '<li>Refer to specific processes in this column.</li>';
        modalOutputs.innerHTML = '<li>Refer to specific processes in this column.</li>';

        ittoModal.classList.add('open');
      });
    }
  });

  // Modal close handlers
  modalCloseBtn.addEventListener('click', closeIttoModal);
  ittoModal.addEventListener('click', (e) => {
    if (e.target === ittoModal) closeIttoModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ittoModal.classList.contains('open')) {
      closeIttoModal();
    }
  });

  // ══════════════════════════════════════════════
  //  PASSIVE LEARNING NOTIFICATION SYSTEM
  // ══════════════════════════════════════════════
  const notifStatusBadge = document.getElementById('notifStatusBadge');
  const notifIntervalSelect = document.getElementById('notifIntervalSelect');
  const notifToggleBtn = document.getElementById('notifToggleBtn');
  const notifTestBtn = document.getElementById('notifTestBtn');
  const notifScheduleInfo = document.getElementById('notifScheduleInfo');
  const notifCountdown = document.getElementById('notifCountdown');

  let countdownTimer = null;
  let secondsRemaining = 0;

  // Helper to compile PMP tips from existing dataset and new custom summaries
  function getPmpTips() {
    const tips = [
      // Key PMP concepts
      { title: "OPA vs EEF", body: "OPAs are internal procedures, templates, and lessons learned. EEFs are external or internal conditions you cannot control (laws, culture, software)." },
      { title: "Validate Scope vs Control Quality", body: "Validate Scope = customer signs off on deliverables. Control Quality = internal QC checks for correctness. QC is done first." },
      { title: "Risk: Mitigate vs Transfer", body: "Mitigate reduces risk probability/impact (e.g. testing). Transfer shifts financial exposure to a third party (e.g. insurance)." },
      { title: "EVM: CPI < 1.0", body: "Cost Performance Index (CPI) less than 1.0 means you are over budget. This is the most critical metric on the PMP exam!" },
      { title: "EVM: SPI > 1.0", body: "Schedule Performance Index (SPI) greater than 1.0 means you are ahead of schedule. (SPI = EV / PV)" },
      { title: "Agile: Servant Leadership", body: "A Scrum Master does not assign tasks. They remove blockers, protect the team from distractions, and coach them on self-organization." },
      { title: "Conflict Resolution: Collaborate", body: "PMI's preferred method is Collaborate/Problem Solve. It is a win-win, long-term solution that addresses root causes." },
      { title: "Change Requests", body: "Before implementing any change to baseline scope/schedule/cost, you MUST perform an impact analysis and submit a change request to the CCB." },
      { title: "WBS Work Packages", body: "The lowest level of the Work Breakdown Structure is the Work Package. It is where cost and duration can be reliably estimated." },
      { title: "Project Charter", body: "The Charter formally authorizes the project and gives the PM authority. It is issued by the Sponsor, not the PM." },
      { title: "Definition of Done (DoD)", body: "A shared list of criteria a user story must meet before it can be considered complete and ready for release." },
      { title: "Sprint Retrospective", body: "An agile event focused on HOW the team worked (processes, tools, relationships) and identifying action items for improvement." },
      { title: "To-Complete Performance Index (TCPI)", body: "TCPI = (BAC - EV) / (BAC - AC). If > 1.0, you must perform more efficiently to stay within budget." },
      { title: "Analogous vs Parametric Estimating", body: "Analogous uses historical data (fast but less accurate). Parametric uses a mathematical algorithm (e.g., $ per square foot)." },
      { title: "Resource Leveling vs Smoothing", body: "Leveling adjusts dates based on resource limits (can change critical path). Smoothing only uses float (critical path stays same)." }
    ];

    // Merge in flashcard contents dynamically to expand database to 50+ tips
    allFlashcards.forEach(fc => {
      tips.push({ title: fc.q.substring(0, 40) + (fc.q.length > 40 ? '...' : ''), body: fc.a });
    });

    // Merge in principles
    principles.forEach(p => {
      tips.push({ title: `Principle: ${p.title}`, body: p.desc });
    });

    return tips;
  }

  const tipsList = getPmpTips();

  function triggerLocalNotification() {
    const randomTip = tipsList[Math.floor(Math.random() * tipsList.length)];
    const title = `PMP Study Tip: ${randomTip.title}`;
    const options = {
      body: randomTip.body,
      icon: 'pmp_logo.png',
      badge: 'pmp_logo.png',
      tag: 'pmp-study-tip', // replaces previous notification
      renotify: true,
      silent: false
    };

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification(title, options);
      });
    } else {
      new Notification(title, options);
    }
  }

  function updateNotifUI() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

    if (!('Notification' in window)) {
      if (isIOS && !isStandalone) {
        notifStatusBadge.textContent = 'Install App';
        notifStatusBadge.className = 'status-badge blocked';
        notifToggleBtn.textContent = 'Add to Home Screen First';
        notifToggleBtn.disabled = true;
        notifIntervalSelect.disabled = true;
        notifTestBtn.disabled = true;
        notifScheduleInfo.classList.remove('hidden');
        notifScheduleInfo.innerHTML = `<span style="color:var(--accent-orange); font-size:0.78rem; line-height:1.4;">ℹ️ iOS requires you to run this as an installed app. Tap the <strong>Share</strong> button in Safari, select <strong>Add to Home Screen</strong>, and launch it from there!</span>`;
      } else {
        notifStatusBadge.textContent = 'Unsupported';
        notifStatusBadge.className = 'status-badge blocked';
        notifToggleBtn.textContent = 'Notifications Unsupported';
        notifToggleBtn.disabled = true;
        notifIntervalSelect.disabled = true;
        notifTestBtn.disabled = true;
      }
      return;
    }

    const permission = Notification.permission;
    if (permission === 'default') {
      notifStatusBadge.textContent = 'Disabled';
      notifStatusBadge.className = 'status-badge inactive';
      notifToggleBtn.textContent = 'Enable Notifications';
      notifIntervalSelect.disabled = true;
      notifTestBtn.disabled = true;
      notifScheduleInfo.classList.add('hidden');
    } else if (permission === 'granted') {
      const isEnabled = safeLS.getItem('pmp_notif_enabled') === 'true';
      if (isEnabled) {
        notifStatusBadge.textContent = 'Active';
        notifStatusBadge.className = 'status-badge active';
        notifToggleBtn.textContent = 'Disable Notifications';
        notifIntervalSelect.disabled = false;
        notifTestBtn.disabled = false;
        notifScheduleInfo.classList.remove('hidden');
      } else {
        notifStatusBadge.textContent = 'Paused';
        notifStatusBadge.className = 'status-badge inactive';
        notifToggleBtn.textContent = 'Resume Notifications';
        notifIntervalSelect.disabled = false;
        notifTestBtn.disabled = false;
        notifScheduleInfo.classList.add('hidden');
      }
    } else if (permission === 'denied') {
      notifStatusBadge.textContent = 'Blocked';
      notifStatusBadge.className = 'status-badge blocked';
      notifToggleBtn.textContent = 'Permission Blocked';
      notifToggleBtn.disabled = true;
      notifIntervalSelect.disabled = true;
      notifTestBtn.disabled = true;
      notifScheduleInfo.classList.add('hidden');
    }
  }

  // ─── Send schedule to Service Worker (survives page close/refresh) ─────────
  function _sendToSW(message) {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.ready.then(reg => {
      if (reg.active) reg.active.postMessage(message);
    });
  }

  // ─── Build a lightweight tip list to send to SW ─────────────────────────────
  function _buildTipPayload() {
    return getPmpTips().slice(0, 80).map(t => ({ title: t.title.substring(0, 60), body: t.body.substring(0, 200) }));
  }

  // ─── Compute remaining seconds from saved next-fire timestamp ────────────────
  function _getRemainingSeconds(intervalSec) {
    const nextFire = parseInt(safeLS.getItem('pmp_notif_next_fire') || '0', 10);
    if (!nextFire) return intervalSec;
    const remaining = Math.round((nextFire - Date.now()) / 1000);
    return (remaining > 0 && remaining < intervalSec) ? remaining : intervalSec;
  }

  function startScheduler() {
    stopScheduler();
    const isEnabled = safeLS.getItem('pmp_notif_enabled') === 'true';
    if (!isEnabled || Notification.permission !== 'granted') return;

    const intervalSec   = parseInt(notifIntervalSelect.value);
    safeLS.setItem('pmp_notif_interval', intervalSec);

    const remainingSec  = _getRemainingSeconds(intervalSec);

    // Save the expected next fire time so page reloads can resume correctly
    const nextFireAt = Date.now() + remainingSec * 1000;
    safeLS.setItem('pmp_notif_next_fire', String(nextFireAt));

    // Hand off to Service Worker — it owns the timer from here
    _sendToSW({
      type: 'SCHEDULE_NOTIF',
      intervalSec,
      remainingSec,
      tips: _buildTipPayload()
    });

    // Page-side countdown (visual only — SW is the real timer)
    secondsRemaining = remainingSec;
    updateCountdownDisplay();
    countdownTimer = setInterval(() => {
      secondsRemaining = Math.max(0, secondsRemaining - 1);
      updateCountdownDisplay();
      // Refresh once a minute to re-sync with the saved next-fire timestamp
      if (secondsRemaining % 60 === 0) {
        secondsRemaining = _getRemainingSeconds(intervalSec);
      }
    }, 1000);
  }

  function stopScheduler() {
    if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
    secondsRemaining = 0;
    updateCountdownDisplay();
    _sendToSW({ type: 'CANCEL_NOTIF' });
    safeLS.removeItem('pmp_notif_next_fire');
  }

  function updateCountdownDisplay() {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    notifCountdown.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // ─── Listen for SW feedback (notification fired / scheduled) ─────────────────
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      const data = event.data || {};
      if (data.type === 'NOTIF_FIRED') {
        // SW just fired a notification — update stored next-fire timestamp
        safeLS.setItem('pmp_notif_next_fire', String(data.nextFireAt));
        const intervalSec = parseInt(notifIntervalSelect.value);
        secondsRemaining  = Math.round((data.nextFireAt - Date.now()) / 1000);
      }
      if (data.type === 'NOTIF_SCHEDULED') {
        // Sync display with SW's confirmed schedule
        secondsRemaining = data.remainingSec || secondsRemaining;
      }
    });
  }

  notifToggleBtn.addEventListener('click', () => {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          safeLS.setItem('pmp_notif_enabled', 'true');
          startScheduler();
        }
        updateNotifUI();
      });
    } else {
      const isEnabled = safeLS.getItem('pmp_notif_enabled') === 'true';
      safeLS.setItem('pmp_notif_enabled', String(!isEnabled));
      if (!isEnabled) {
        startScheduler();
      } else {
        stopScheduler();
      }
      updateNotifUI();
    }
  });

  notifIntervalSelect.addEventListener('change', () => {
    startScheduler();
  });

  notifTestBtn.addEventListener('click', () => {
    triggerLocalNotification();
  });

  // Load Saved Settings from LocalStorage
  if (safeLS.getItem('pmp_notif_interval')) {
    notifIntervalSelect.value = safeLS.getItem('pmp_notif_interval');
  }

  updateNotifUI();

  // ─── Auto-resume scheduler on page load (persistent schedule) ────────────────
  // If notifications were enabled, resume the SW timer from where it left off.
  if (safeLS.getItem('pmp_notif_enabled') === 'true' && Notification.permission === 'granted') {
    startScheduler();
  }

  // ══════════════════════════════════════════════
  //  PMP EXAM MINDSET PLAYBOOK
  // ══════════════════════════════════════════════
  const mindsetRules = [
    {
      id: 1, icon: '🔍',
      title: 'Analyze and Assess FIRST',
      instruction: "When a new issue, risk, or change occurs, the PM's first step is ALWAYS to analyze impact, consult registers, or evaluate options. Never take immediate action or request changes without understanding the effect on scope, schedule, cost, and quality.",
      scenario: 'A key stakeholder requests a modification to the database schema mid-execution. What should the PM do first?',
      answer: 'Analyze the impact of the requested change on scope, timeline, budget, and quality BEFORE preparing a change request.'
    },
    {
      id: 2, icon: '🤝',
      title: 'Collaborate and Talk Privately',
      instruction: 'Resolve conflicts at the lowest level possible. Always speak to team members privately, listen actively, and seek consensus before escalating. PMI preference order: Collaborate → Compromise → Smooth → Force → Withdraw.',
      scenario: 'Two senior developers are arguing over an architecture decision, stalling sprint progress. What should the PM do first?',
      answer: 'Facilitate a private meeting between the two developers to discuss their concerns and guide them toward a collaborative decision.'
    },
    {
      id: 3, icon: '🛡️',
      title: 'Agile is Servant Leadership',
      instruction: 'In Agile, the PM (as Scrum Master) does NOT assign tasks, dictate schedules, or issue directives. Instead, you remove impediments, protect the team from distractions, and coach them toward self-organization. The team commits; the SM enables.',
      scenario: 'An agile team is struggling to meet their sprint goal because of frequent ad-hoc requests from a sales manager. What should the PM do?',
      answer: 'Shield the team from the sales manager\'s requests and coach the manager to direct all requests through the Product Owner.'
    },
    {
      id: 4, icon: '📋',
      title: 'All Changes Go Through the CCB',
      instruction: 'ANY modification to baselines (scope, schedule, or cost) requires a formal change request through Integrated Change Control (Process 4.6) and CCB approval — regardless of how small, or who requests it (including the sponsor or CEO).',
      scenario: 'The client asks a developer to add a minor extra field to a report. The developer says it takes only 10 minutes. What should the PM do?',
      answer: 'Instruct the developer not to add the feature yet; document the request and submit a formal change request to the CCB.'
    },
    {
      id: 5, icon: '❌',
      title: 'Never Fire or Escalate Unilaterally',
      instruction: 'When dealing with team performance issues, always coach privately first. Firing team members or formal HR/Sponsor escalations are final resorts ONLY after all internal coaching and support attempts have been documented and have failed.',
      scenario: 'A developer\'s productivity has fallen for three consecutive sprints, causing delayed deliverables. What should the PM do?',
      answer: 'Meet privately to understand the root cause of the performance drop and collaboratively create a support and improvement plan.'
    },
    {
      id: 6, icon: '⚠️',
      title: 'Check the Risk Register FIRST',
      instruction: 'When a problem occurs during execution, your FIRST action is to check the risk register — the problem may be a previously identified risk that has materialized and already has a contingency plan. Never treat a problem as new without checking existing plans.',
      scenario: 'A critical vendor announces a 3-week delay during project execution. What is the FIRST thing the PM should do?',
      answer: 'Check the risk register to see if this was an identified risk with a pre-planned contingency response; then assess impact before escalating.'
    },
    {
      id: 7, icon: '🚫',
      title: 'Never Gold-Plate the Deliverable',
      instruction: 'Gold-plating means adding features or enhancements BEYOND approved scope — even if they seem beneficial and cost nothing extra. Every change to scope must be formally evaluated and approved. The PM protects the baseline, not just the budget.',
      scenario: 'A team member proposes adding an extra analytics dashboard that was not in scope, saying it will delight the client. The PM\'s response?',
      answer: 'Decline to implement without authorization; submit a change request for CCB evaluation if the team member believes it adds value.'
    },
    {
      id: 8, icon: '🔮',
      title: 'Be Proactive, Not Reactive',
      instruction: 'The PMI mindset always favors proactive risk prevention over reactive crisis management. When given options, always choose the answer that involves planning ahead, identifying risks early, and taking preventive action before problems materialize.',
      scenario: 'A PM notices that a key vendor is experiencing financial difficulties early in the project. What should the PM do?',
      answer: 'Assess the risk immediately, add it to the risk register, begin developing contingency plans (alternative vendors), and monitor the vendor\'s financial status proactively.'
    },
    {
      id: 9, icon: '⚖️',
      title: 'Ethics Always Wins — Report Misconduct',
      instruction: 'PMI\'s Code of Ethics requires honesty, transparency, and reporting of misconduct — always. No organizational pressure, cultural norm, or authority hierarchy overrides ethical obligations. If you discover fraud, bribery, or misrepresentation, you MUST report it through appropriate channels.',
      scenario: 'A PMO director asks the PM to report project status as Green when it is actually Red. What must the PM do?',
      answer: 'Refuse to misrepresent project status, document the directive, and report accurate status to appropriate stakeholders through proper governance channels.'
    },
    {
      id: 10, icon: '📢',
      title: 'The Sponsor Owns the Business Case',
      instruction: 'The PM manages the project; the SPONSOR owns the business case, the charter, and the strategic justification. If business conditions change and the business case is no longer valid, the PM must inform the sponsor — who then decides whether to continue, reprioritize, or terminate.',
      scenario: 'Halfway through a project, market research shows the product\'s business case is no longer viable. What should the PM do?',
      answer: 'Present an objective updated business case analysis to the sponsor and steering committee — they make the continuation/termination decision, not the PM.'
    },
    {
      id: 11, icon: '🗓️',
      title: 'Lessons Learned Are Captured Throughout',
      instruction: 'Lessons Learned are NOT only captured at project closing. PMBOK 6 requires ongoing documentation throughout the project lifecycle. Capturing lessons when events are fresh produces higher quality OPAs that benefit future projects.',
      scenario: 'A sponsor asks the PM to skip lessons learned at closing since the team is already dispersed. What should the PM do?',
      answer: 'Conduct at least an abbreviated virtual lessons learned session — the PM has a governance obligation to update OPAs, regardless of team availability.'
    },
    {
      id: 12, icon: '🎯',
      title: 'EXAM STRATEGY: How to Beat PMP Questions',
      instruction: `PMI exams test MINDSET as much as knowledge. Use these elimination strategies:\n\n🔴 Eliminate immediately: answers that involve ignoring, bypassing governance, immediately firing/replacing, or doing nothing.\n\n🟡 Beware of: answers that skip analysis and jump to action, or involve unilateral decisions without consulting stakeholders.\n\n🟢 Prefer: answers that involve collaborative problem-solving, assessing before acting, following process (CCB, risk register), proactive planning, and private communication for conflicts.\n\n⏱️ TIME MANAGEMENT: 230 minutes ÷ 180 questions = 76 seconds per question. Flag and return to difficult ones. Never leave blanks — guess if needed.\n\n📊 DOMAIN WEIGHTS: People 42% · Process 50% · Business Environment 8%.`,
      scenario: 'A question asks what the PM should do FIRST when a team member raises a concern about a technical risk. Which answer type does PMI prefer?',
      answer: 'The answer that involves investigating/assessing the concern thoroughly before taking action — PMI always prefers analysis before action, and collaboration over unilateral decisions.'
    }
  ];

  const mindsetListContainer = document.getElementById('mindsetRulesList');
  if (mindsetListContainer) {
    mindsetRules.forEach(rule => {
      const card = document.createElement('div');
      card.className = 'mindset-rule-card';
      card.innerHTML = `
        <div class="rule-header">
          <div class="rule-header-left">
            <span class="rule-num">Rule ${rule.id}</span>
            <span class="rule-title">${rule.icon} ${rule.title}</span>
          </div>
          <span class="rule-arrow">►</span>
        </div>
        <div class="rule-body">
          <p class="rule-instruction">${rule.instruction}</p>
          <div class="rule-scenario-box">
            <span class="scenario-tag">PMP Exam Scenario Example</span>
            <blockquote>"${rule.scenario}"</blockquote>
            <div class="rule-scenario-qa">
              <strong>Best PMP Action:</strong> ${rule.answer}
            </div>
          </div>
        </div>
      `;
      
      const header = card.querySelector('.rule-header');
      header.addEventListener('click', () => {
        card.classList.toggle('expanded');
      });
      
      mindsetListContainer.appendChild(card);
    });
  }

  // ══════════════════════════════════════════════
  //  EVM PRACTICE SCENARIO SIMULATOR
  // ══════════════════════════════════════════════
  const evmProblemTemplates = [
    {
      calc: (bac) => {
        const pv = Math.round(bac * 0.5);
        const ev = Math.round(bac * 0.4);
        const ac = Math.round(bac * 0.45);
        return { pv, ev, ac, bac };
      },
      generator: (vals) => {
        const cv = vals.ev - vals.ac;
        const correctText = `CV = $${cv.toLocaleString()}; Over Budget`;
        const options = [
          correctText,
          `CV = $${Math.abs(cv).toLocaleString()}; Under Budget`,
          `CV = -$${Math.abs(vals.pv - vals.ac).toLocaleString()}; Over Budget`,
          `CV = $0; On Budget`
        ];
        return {
          questionText: `You are managing an infrastructure installation project. The Budget at Completion (BAC) is $${vals.bac.toLocaleString()}. At Month 6, your Planned Value (PV) is $${vals.pv.toLocaleString()}, your Earned Value (EV) is $${vals.ev.toLocaleString()}, and your Actual Cost (AC) is $${vals.ac.toLocaleString()}.\n\nQuestion: Calculate the Cost Variance (CV) and determine the cost status.`,
          options,
          correctIndex: 0,
          explanation: `Cost Variance (CV) = EV - AC.\nIn this case: CV = $${vals.ev.toLocaleString()} - $${vals.ac.toLocaleString()} = $${cv.toLocaleString()}.\nSince the CV is negative, the project is OVER BUDGET. A CPI of ${(vals.ev / vals.ac).toFixed(2)} means you are getting only 89 cents of value for every dollar spent.`
        };
      }
    },
    {
      calc: (bac) => {
        const pv = Math.round(bac * 0.6);
        const ev = Math.round(bac * 0.5);
        const ac = Math.round(bac * 0.58);
        return { pv, ev, ac, bac };
      },
      generator: (vals) => {
        const spi = vals.ev / vals.pv;
        const correctText = `SPI = ${spi.toFixed(2)}; Behind Schedule`;
        const options = [
          correctText,
          `SPI = ${(vals.ev / vals.ac).toFixed(2)}; Ahead of Schedule`,
          `SPI = ${(vals.pv / vals.ev).toFixed(2)}; Behind Schedule`,
          `SPI = ${spi.toFixed(2)}; On Schedule`
        ];
        return {
          questionText: `Your software construction project has a BAC of $${vals.bac.toLocaleString()}. Your schedule baseline dictates you should have completed work worth $${vals.pv.toLocaleString()} by today (Planned Value). The team has completed work worth $${vals.ev.toLocaleString()} (Earned Value) while spending $${vals.ac.toLocaleString()}.\n\nQuestion: Calculate the Schedule Performance Index (SPI) and project schedule status.`,
          options,
          correctIndex: 0,
          explanation: `Schedule Performance Index (SPI) = EV / PV.\nIn this case: SPI = $${vals.ev.toLocaleString()} / $${vals.pv.toLocaleString()} = ${spi.toFixed(2)}.\nSince the SPI is less than 1.0, the project is BEHIND SCHEDULE. You are performing work at only ${Math.round(spi * 100)}% of the planned rate.`
        };
      }
    },
    {
      calc: (bac) => {
        const pv = Math.round(bac * 0.7);
        const ev = Math.round(bac * 0.65);
        const ac = Math.round(bac * 0.75);
        return { pv, ev, ac, bac };
      },
      generator: (vals) => {
        const cpi = vals.ev / vals.ac;
        const eac = vals.bac / cpi;
        const correctText = `EAC = $${Math.round(eac).toLocaleString()}`;
        const options = [
          correctText,
          `EAC = $${Math.round(vals.bac + (vals.pv - vals.ev)).toLocaleString()}`,
          `EAC = $${Math.round(vals.ac + (vals.bac - vals.ev)).toLocaleString()}`,
          `EAC = $${Math.round(vals.bac).toLocaleString()}`
        ];
        return {
          questionText: `Your hardware deployment project has a BAC of $${vals.bac.toLocaleString()}. At the midpoint, the Earned Value (EV) is $${vals.ev.toLocaleString()} and the Actual Cost (AC) is $${vals.ac.toLocaleString()}. The cost variance is typical and expected to continue.\n\nQuestion: Calculate the forecasted Estimate at Completion (EAC).`,
          options,
          correctIndex: 0,
          explanation: `When current cost variance is typical and expected to continue, the formula is: EAC = BAC / CPI.\nFirst, calculate CPI = EV / AC = $${vals.ev.toLocaleString()} / $${vals.ac.toLocaleString()} = ${cpi.toFixed(3)}.\nNow, EAC = $${vals.bac.toLocaleString()} / ${cpi.toFixed(3)} = $${Math.round(eac).toLocaleString()}.\nThe project will cost an extra $${Math.round(eac - vals.bac).toLocaleString()} over the original budget.`
        };
      }
    },
    {
      calc: (bac) => {
        const pv = Math.round(bac * 0.8);
        const ev = Math.round(bac * 0.75);
        const ac = Math.round(bac * 0.85);
        return { pv, ev, ac, bac };
      },
      generator: (vals) => {
        const tcpi = (vals.bac - vals.ev) / (vals.bac - vals.ac);
        const correctText = `TCPI = ${tcpi.toFixed(2)}`;
        const options = [
          correctText,
          `TCPI = ${(vals.ev / vals.ac).toFixed(2)}`,
          `TCPI = ${((vals.bac - vals.ev) / vals.bac).toFixed(2)}`,
          `TCPI = ${(1 / tcpi).toFixed(2)}`
        ];
        return {
          questionText: `A project has a BAC of $${vals.bac.toLocaleString()}. You have completed work worth $${vals.ev.toLocaleString()} (EV) while spending $${vals.ac.toLocaleString()} (AC). The sponsor demands that the project must be completed within the original budget.\n\nQuestion: Calculate the required To-Complete Performance Index (TCPI) to meet the sponsor's target.`,
          options,
          correctIndex: 0,
          explanation: `To complete within the original budget (BAC), the formula is: TCPI = (BAC - EV) / (BAC - AC).\nIn this case: TCPI = ($${vals.bac.toLocaleString()} - $${vals.ev.toLocaleString()}) / ($${vals.bac.toLocaleString()} - $${vals.ac.toLocaleString()}) = $${(vals.bac - vals.ev).toLocaleString()} / $${(vals.bac - vals.ac).toLocaleString()} = ${tcpi.toFixed(2)}.\nSince TCPI is greater than 1.0, you must perform more efficiently than you have so far to avoid busting the budget.`
        };
      }
    }
  ];

  function generateEVMProblem() {
    const template = evmProblemTemplates[Math.floor(Math.random() * evmProblemTemplates.length)];
    const bases = [150000, 200000, 300000, 500000, 750000, 900000, 1200000];
    const bac = bases[Math.floor(Math.random() * bases.length)];
    const vals = template.calc(bac);
    const problem = template.generator(vals);

    document.getElementById('evmProblemText').innerHTML = problem.questionText.replace(/\n/g, '<br>');
    const optionsContainer = document.getElementById('evmProblemOptions');
    optionsContainer.innerHTML = '';

    // Create options with metadata
    const optsWithMeta = problem.options.map((opt, idx) => ({ text: opt, isCorrect: idx === problem.correctIndex }));
    shuffleArray(optsWithMeta);

    optsWithMeta.forEach(opt => {
      const btn = document.createElement('button');
      btn.textContent = opt.text;
      btn.addEventListener('click', () => {
        // Disable all buttons in this options panel
        optionsContainer.querySelectorAll('button').forEach(b => {
          b.disabled = true;
          const meta = optsWithMeta.find(o => o.text === b.textContent);
          if (meta && meta.isCorrect) {
            b.classList.add('correct');
          }
        });

        if (opt.isCorrect) {
          btn.classList.add('correct');
        } else {
          btn.classList.add('incorrect');
        }

        document.getElementById('evmExplanationText').innerHTML = problem.explanation.replace(/\n/g, '<br>');
        document.getElementById('evmExplanationContainer').classList.remove('hidden');
      });
      optionsContainer.appendChild(btn);
    });

    document.getElementById('evmExplanationContainer').classList.add('hidden');
    document.getElementById('evmProblemContainer').classList.remove('hidden');
  }

  document.getElementById('btnGenerateEVM').addEventListener('click', generateEVMProblem);
  document.getElementById('btnRevealEVM').addEventListener('click', () => {
    document.getElementById('evmExplanationContainer').classList.remove('hidden');
  });


  // ══════════════════════════════════════════════
  //  ITTO MATCHING GAME
  // ══════════════════════════════════════════════
  const ittoGameCards = [
    { name: "Project Charter", icon: "📜", type: "input", desc: "A critical input to many processes (like Develop PM Plan or Plan Scope Mgmt). It authorizes the project.", process: "Develop Project Management Plan" },
    { name: "WBS (Work Breakdown Structure)", icon: "📐", type: "output", desc: "A hierarchical decomposition of project scope. Part of the Scope Baseline output of Create WBS.", process: "Create WBS" },
    { name: "Decomposition", icon: "🪓", type: "tool", desc: "A tool and technique used to break deliverables down into work packages or activities.", process: "Create WBS / Define Activities" },
    { name: "Change Requests", icon: "📝", type: "output", desc: "Generated in executing/controlling processes when deviations occur or improvements are identified.", process: "Direct & Manage Project Work / Control Scope" },
    { name: "Approved Change Requests", icon: "✅", type: "input", desc: "The critical input required by Direct and Manage Project Work to implement authorized modifications.", process: "Direct and Manage Project Work" },
    { name: "Expert Judgment", icon: "🧠", type: "tool", desc: "Consulting experts. It is the most common tool & technique across almost all PMBOK processes.", process: "All Processes" },
    { name: "Lessons Learned Register", icon: "📓", type: "output", desc: "The core output of Manage Project Knowledge where team learnings are recorded to update OPAs.", process: "Manage Project Knowledge" },
    { name: "Accepted Deliverables", icon: "🤝", type: "output", desc: "Deliverables signed off by the customer, which is the main output of Validate Scope.", process: "Validate Scope" },
    { name: "Verified Deliverables", icon: "🔍", type: "input", desc: "Outputs of Control Quality that are inputs to Validate Scope for formal customer acceptance.", process: "Validate Scope" },
    { name: "Monte Carlo Simulation", icon: "🎲", type: "tool", desc: "A quantitative risk analysis simulation tool that computes project schedule/cost probabilities.", process: "Perform Quantitative Risk Analysis" },
    { name: "Earned Value Analysis", icon: "📊", type: "tool", desc: "A data analysis technique used to evaluate variance between planned progress and actual performance.", process: "Control Costs / Control Schedule" },
    { name: "Final Product Transition", icon: "🚚", type: "output", desc: "The ultimate output of Close Project or Phase where the final product is delivered to the customer.", process: "Close Project or Phase" },
    { name: "Tornado Diagram", icon: "🌪️", type: "tool", desc: "A sensitivity analysis display tool used in quantitative risk analysis to show which risks have the most impact.", process: "Perform Quantitative Risk Analysis" },
    { name: "Bidder Conferences", icon: "📢", type: "tool", desc: "Meetings with prospective sellers to ensure everyone has a clear, common understanding of procurement requirements.", process: "Conduct Procurements" },
    { name: "Stakeholder Register", icon: "👥", type: "output", desc: "The primary output of Identify Stakeholders, listing identification, assessment, and classification details.", process: "Identify Stakeholders" }
  ];

  let ittoScore = 0;
  let ittoStreak = 0;
  let currentIttoCard = null;
  let isIttoCardClicked = false;

  const ittoSourceCard = document.getElementById('ittoSourceCard');
  const ittoCardIcon = document.getElementById('ittoCardIcon');
  const ittoCardName = document.getElementById('ittoCardName');
  const ittoScoreEl = document.getElementById('ittoScore');
  const ittoStreakEl = document.getElementById('ittoStreak');
  const ittoFeedbackBox = document.getElementById('ittoFeedbackBox');
  const ittoFeedbackText = document.getElementById('ittoFeedbackText');

  function loadNextIttoCard() {
    const card = ittoGameCards[Math.floor(Math.random() * ittoGameCards.length)];
    currentIttoCard = card;
    ittoCardIcon.textContent = card.icon;
    ittoCardName.textContent = card.name;
    
    // Clear clicked highlights
    isIttoCardClicked = false;
    ittoSourceCard.classList.remove('clicked-target');
    document.querySelectorAll('.itto-target-box').forEach(box => box.classList.remove('clicked-target'));
  }

  function handleIttoMatch(selectedType, targetBoxElement) {
    if (!currentIttoCard) return;

    if (selectedType === currentIttoCard.type) {
      // Success!
      ittoScore++;
      ittoStreak++;
      ittoScoreEl.textContent = ittoScore;
      ittoStreakEl.textContent = `${ittoStreak} 🔥`;
      
      // Success animation on box
      targetBoxElement.classList.add('success-pulse');
      setTimeout(() => targetBoxElement.classList.remove('success-pulse'), 600);

      // Examiner Feedback
      ittoFeedbackText.innerHTML = `<strong>Correct!</strong> "${currentIttoCard.name}" is indeed classified as an <strong>${currentIttoCard.type.toUpperCase()}</strong>.<br>${currentIttoCard.desc} (Associated process: <em>${currentIttoCard.process}</em>).`;
      ittoFeedbackBox.classList.remove('hidden');

      loadNextIttoCard();
    } else {
      // Wrong match
      ittoStreak = 0;
      ittoStreakEl.textContent = `${ittoStreak} 🔥`;

      // Shake animation on box
      targetBoxElement.classList.add('shake');
      setTimeout(() => targetBoxElement.classList.remove('shake'), 500);

      // Examiner Feedback
      ittoFeedbackText.innerHTML = `<strong>Incorrect!</strong> "${currentIttoCard.name}" is NOT an ${selectedType.toUpperCase()}. Think like an examiner: It belongs to the <strong>${currentIttoCard.type.toUpperCase()}</strong> category.<br>Review its use in: <em>${currentIttoCard.process}</em>.`;
      ittoFeedbackBox.classList.remove('hidden');
    }
  }

  // 1. Drag and Drop Bindings
  ittoSourceCard.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', currentIttoCard.type);
    ittoSourceCard.style.opacity = '0.5';
  });

  ittoSourceCard.addEventListener('dragend', () => {
    ittoSourceCard.style.opacity = '1';
  });

  const targetBoxes = document.querySelectorAll('.itto-target-box');
  targetBoxes.forEach(box => {
    box.addEventListener('dragover', (e) => {
      e.preventDefault(); // Required to allow drop
    });

    box.addEventListener('dragenter', () => {
      box.classList.add('hover');
    });

    box.addEventListener('dragleave', () => {
      box.classList.remove('hover');
    });

    box.addEventListener('drop', (e) => {
      box.classList.remove('hover');
      const selectedType = e.dataTransfer.getData('text/plain');
      handleIttoMatch(box.dataset.type, box);
    });

    // 2. Click-to-Match fallback (Best for Mobile)
    box.addEventListener('click', () => {
      if (isIttoCardClicked) {
        handleIttoMatch(box.dataset.type, box);
      }
    });
  });

  // Source card click state
  ittoSourceCard.addEventListener('click', (e) => {
    e.stopPropagation();
    isIttoCardClicked = !isIttoCardClicked;
    ittoSourceCard.classList.toggle('clicked-target', isIttoCardClicked);
    
    // Highlight boxes to show they are targets
    targetBoxes.forEach(box => {
      box.classList.toggle('clicked-target', isIttoCardClicked);
    });
  });

  document.getElementById('btnResetIttoGame').addEventListener('click', () => {
    ittoScore = 0;
    ittoStreak = 0;
    ittoScoreEl.textContent = '0';
    ittoStreakEl.textContent = '0 🔥';
    ittoFeedbackBox.classList.add('hidden');
    loadNextIttoCard();
  });

  // Initialize ITTO Game
  loadNextIttoCard();


  // ══════════════════════════════════════════════
  //  PMP BOOKSHELF & E-READER (PDF EXPERIENCE)
  // ══════════════════════════════════════════════

  // Local Markdown Books Config Database
  const localBooks = {
    'pmbok7': {
      title: 'PMBOK 7th Edition',
      folder: 'Project-Management-Institute-A-Guide-to-the-Project-Management-Body-of-Knowledge-PMBOK-R-Guide-PMBOK®️-Guide-Project-Management-Institute-2021 (1).pdf',
      pages: 370,
      author: 'Project Management Institute',
      tag: 'Agile & Standard',
      coverClass: 'agile-cover',
      toc: [
        { title: 'Title Page', page: 0, depth: 0 },
        { title: 'Notice & Disclaimer', page: 2, depth: 0 },
        { title: 'Table of Contents', page: 4, depth: 0 },
        { title: 'Part 1: The Standard for Project Management', page: 9, depth: 0 },
        { title: '1. Introduction', page: 11, depth: 1 },
        { title: '2. A System for Value Delivery', page: 17, depth: 1 },
        { title: '3. Project Management Principles', page: 29, depth: 1 },
        { title: 'Part 2: Guide to the PMBOK', page: 64, depth: 0 },
        { title: '1. Introduction', page: 65, depth: 1 },
        { title: '2. Project Performance Domains', page: 66, depth: 1 },
        { title: '3. Tailoring', page: 129, depth: 1 },
        { title: '4. Models, Methods, and Artifacts', page: 159, depth: 1 },
        { title: 'Appendix / Index', page: 219, depth: 0 }
      ]
    },
    'pmbok6': {
      title: 'PMBOK 6th Edition',
      folder: 'Project-Management-Institute-A-Guide-to-the-Project-Management-Body-of-Knowledge-PMBOK®-Guide–Sixth-Edition-Project-Management-Institute-2017.pdf',
      pages: 711,
      author: 'Project Management Institute',
      tag: 'Predictive Processes',
      coverClass: 'predictive-cover',
      toc: [
        { title: 'Title Page', page: 0, depth: 0 },
        { title: 'Table of Contents', page: 5, depth: 0 },
        { title: 'Part 1: Guide to the PMBOK', page: 14, depth: 0 },
        { title: '1. Introduction', page: 16, depth: 1 },
        { title: '2. Project Environment', page: 34, depth: 1 },
        { title: '3. Role of the Project Manager', page: 58, depth: 1 },
        { title: '4. Project Integration Management', page: 78, depth: 1 },
        { title: '5. Project Scope Management', page: 138, depth: 1 },
        { title: '6. Project Schedule Management', page: 182, depth: 1 },
        { title: '7. Project Cost Management', page: 240, depth: 1 },
        { title: '8. Project Quality Management', page: 280, depth: 1 },
        { title: '9. Project Resource Management', page: 318, depth: 1 },
        { title: '10. Project Communications Management', page: 370, depth: 1 },
        { title: '11. Project Risk Management', page: 406, depth: 1 },
        { title: '12. Project Procurement Management', page: 468, depth: 1 },
        { title: '13. Project Stakeholder Management', page: 514, depth: 1 },
        { title: 'Part 2: The Standard for Project Management', page: 550, depth: 0 }
      ]
    },
    'processgroups': {
      title: 'Process Groups Practice Guide',
      folder: 'ProcessGroupsPracticeGuide.pdf',
      pages: 367,
      author: 'Project Management Institute',
      tag: 'Processes',
      coverClass: 'custom-cover',
      toc: [
        { title: 'Title Page', page: 0, depth: 0 },
        { title: 'Table of Contents', page: 5, depth: 0 },
        { title: '1. Introduction', page: 21, depth: 0 },
        { title: '2. The Project Environment', page: 33, depth: 0 },
        { title: '3. Role of the Project Manager', page: 43, depth: 0 },
        { title: '4. Initiating Process Group', page: 49, depth: 0 },
        { title: '5. Planning Process Group', page: 57, depth: 0 },
        { title: '6. Executing Process Group', page: 153, depth: 0 },
        { title: '7. Monitoring and Controlling Process Group', page: 185, depth: 0 },
        { title: '8. Closing Process Group', page: 223, depth: 0 },
        { title: '9. Inputs and Outputs', page: 229, depth: 0 },
        { title: '10. Tools and Techniques', page: 273, depth: 0 },
        { title: 'Appendix & Glossary', page: 319, depth: 0 }
      ]
    }
  };

  // 1. Bookshelf Dashboard UI Updater
  async function updateBookshelfUI() {
    const books = ['pmbok7', 'pmbok6', 'processgroups', 'custom'];
    for (const bookId of books) {
      const isLocal = (bookId in localBooks);
      let hasBook = isLocal;
      if (!isLocal) {
        try {
          const fileBlob = await dbGetBook(bookId);
          hasBook = !!fileBlob;
        } catch (dbErr) {
          console.warn(`[IndexedDB] Could not check status for book ${bookId}:`, dbErr);
          hasBook = false;
        }
      }
      
      const progressFill = document.getElementById('progressFill-' + bookId);
      const progressTxt = document.getElementById('progressTxt-' + bookId);
      
      if (hasBook) {
        const savedBookmark = safeLS.getItem(`pmp_bookmark_${bookId}`);
        const totalPages = isLocal ? localBooks[bookId].pages : (parseInt(safeLS.getItem(`pmp_total_pages_${bookId}`)) || 1);
        const pageVal = savedBookmark !== null ? parseInt(savedBookmark) : 0;
        const pct = totalPages > 1 ? Math.round((pageVal / (totalPages - 1)) * 100) : 0;
        
        if (progressFill) progressFill.style.width = pct + '%';
        if (progressTxt) progressTxt.textContent = savedBookmark !== null ? `Page ${pageVal + 1} of ${totalPages} (${pct}%)` : `Not started (0%)`;
        
        if (bookId === 'custom') {
          const btnRead = document.getElementById('btnRead-custom');
          const btnUpload = document.getElementById('btnUpload-custom');
          const btnDelete = document.getElementById('btnDelete-custom');
          const customTitleEl = document.querySelector('#bookCard-custom h3');
          if (btnRead) btnRead.classList.remove('hidden');
          if (btnUpload) btnUpload.classList.add('hidden');
          if (btnDelete) btnDelete.classList.remove('hidden');
          if (customTitleEl) customTitleEl.textContent = safeLS.getItem('pmp_custom_filename') || 'Other PDF Study Guide';
        }
      } else {
        if (progressFill) progressFill.style.width = '0%';
        if (progressTxt) progressTxt.textContent = 'Upload PDF to start reading';
        
        if (bookId === 'custom') {
          const btnRead = document.getElementById('btnRead-custom');
          const btnUpload = document.getElementById('btnUpload-custom');
          const btnDelete = document.getElementById('btnDelete-custom');
          const customTitleEl = document.querySelector('#bookCard-custom h3');
          if (btnRead) btnRead.classList.add('hidden');
          if (btnUpload) btnUpload.classList.remove('hidden');
          if (btnDelete) btnDelete.classList.add('hidden');
          if (customTitleEl) customTitleEl.textContent = 'Other PDF Study Guide';
        }
      }
    }
  }

  // 2. Kindle Launch & Close Engine
  async function openKindleReader(bookId) {
    currentBookId = bookId;
    closeAllDrawers();
    toggleHUD(true);

    kindleLoader.querySelector('#lblKindleLoaderText').textContent = 'Opening book reader...';
    kindleLoader.classList.remove('hidden');
    kindleReaderOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Toggle viewport HTML container classes
    const isLocal = (bookId in localBooks);
    const kindleTextContent = document.getElementById('kindleTextContent');
    if (isLocal) {
      kindleCanvas.classList.add('hidden');
      kindleTextContent.classList.remove('hidden');
      kindleCanvasContainer.classList.add('kindle-text-mode');
    } else {
      kindleCanvas.classList.remove('hidden');
      kindleTextContent.classList.add('hidden');
      kindleCanvasContainer.classList.remove('kindle-text-mode');
    }

    // Update title
    const titleStr = getBookTitle(bookId);
    kindleBookTitle.textContent = titleStr;

    try {
      if (isLocal) {
        currentPdfDoc = null;
        const total = localBooks[bookId].pages;

        await buildKindleTOC();

        // Restore bookmark
        const savedBookmark = safeLS.getItem(`pmp_bookmark_${currentBookId}`);
        if (savedBookmark !== null) {
          currentPageIndex = Math.min(parseInt(savedBookmark), total - 1);
        } else {
          currentPageIndex = 0;
        }

        // Initial Render
        await renderKindlePage();
        kindleLoader.classList.add('hidden');
      } else {
        const fileBlob = await dbGetBook(bookId);
        if (!fileBlob) {
          closeKindleReader();
          // Trigger upload flow
          lblUploadBookTitle.textContent = `Upload ${titleStr}`;
          bookshelfUploadZone.classList.remove('hidden');
          window.scrollTo({ top: bookshelfUploadZone.offsetTop - 50, behavior: 'smooth' });
          return;
        }

        kindleLoader.querySelector('#lblKindleLoaderText').textContent = 'Opening PDF document...';
        const fileReader = new FileReader();
        fileReader.onload = async function() {
          try {
            const typedArray = new Uint8Array(this.result);
            const loadingTask = pdfjsLib.getDocument({
              data: typedArray,
              cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
              cMapPacked: true
            });
            currentPdfDoc = await loadingTask.promise;
            safeLS.setItem(`pmp_total_pages_${currentBookId}`, currentPdfDoc.numPages);

            await buildKindleTOC();

            // Restore bookmark
            const savedBookmark = safeLS.getItem(`pmp_bookmark_${currentBookId}`);
            if (savedBookmark !== null) {
              currentPageIndex = Math.min(parseInt(savedBookmark), currentPdfDoc.numPages - 1);
            } else {
              currentPageIndex = 0;
            }

            // Initial Render
            await renderKindlePage();
            kindleLoader.classList.add('hidden');
          } catch (err) {
            console.error('Error parsing PDF:', err);
            alert('Failed to parse PDF document. It might be corrupted or encrypted.');
            closeKindleReader();
          }
        };
        fileReader.readAsArrayBuffer(fileBlob);
      }
    } catch (err) {
      console.error('Database read error:', err);
      alert('Failed to load document.');
      closeKindleReader();
    }
  }

  function closeKindleReader() {
    kindleReaderOverlay.classList.add('hidden');
    document.body.style.overflow = '';
    
    if (currentPdfDoc) {
      try { currentPdfDoc.cleanup(); } catch(e){}
      currentPdfDoc = null;
    }
    updateBookshelfUI();
  }

  // Helper: Resolve a book title from its bookId
  function getBookTitle(bookId) {
    if (bookId in localBooks) return localBooks[bookId].title;
    if (bookId === 'custom') return safeLS.getItem('pmp_custom_filename') || 'Custom Study Guide';
    return 'PMBOK 7th Edition';
  }

  // Helper: Shared post-render UI update for the reader
  function updateReaderUI(totalPages) {
    const pct = Math.round((currentPageIndex / (totalPages - 1 || 1)) * 100);
    kindleProgressStatus.textContent = `Location ${currentPageIndex + 1} of ${totalPages} · ${pct}%`;
    kindleProgressSlider.value = pct;
    safeLS.setItem(`pmp_bookmark_${currentBookId}`, currentPageIndex);
    const dateStr = new Date().toLocaleString('en-US', { hour12: true, month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    safeLS.setItem(`pmp_bookmark_time_${currentBookId}`, dateStr);
    updateBookmarkRibbonUI();
    document.querySelectorAll('#kindleTOCList li').forEach(li => {
      const pageIdx = parseInt(li.dataset.page);
      li.classList.toggle('active', pageIdx === currentPageIndex);
    });
    // Sync nav bar
    if (kindleNavPageInfo) {
      kindleNavPageInfo.textContent = `Page ${currentPageIndex + 1} of ${totalPages}`;
    }
    if (kindleBtnPrev) kindleBtnPrev.disabled = currentPageIndex <= 0;
    if (kindleBtnNext) kindleBtnNext.disabled = currentPageIndex >= totalPages - 1;
  }

  // 3. Viewport Render Page with Scale & Fitting calculations
  async function renderKindlePage() {
    const isLocal = (currentBookId in localBooks);
    const totalPages = isLocal ? localBooks[currentBookId].pages : (currentPdfDoc ? currentPdfDoc.numPages : 1);

    if (currentPageIndex < 0) currentPageIndex = 0;
    if (currentPageIndex >= totalPages) currentPageIndex = totalPages - 1;

    if (isRendering) {
      renderPendingIndex = currentPageIndex;
      return;
    }

    isRendering = true;

    try {
      if (isLocal) {
        // Local Markdown Book reflow rendering
        const bookInfo = localBooks[currentBookId];
        const pageNum = currentPageIndex + 1;
        const pageUrl = encodeURI(`${bookInfo.folder}/pages/page-${pageNum}/markdown.md`);

        kindleLoader.querySelector('#lblKindleLoaderText').textContent = `Loading Page ${pageNum}...`;
        kindleLoader.classList.remove('hidden');
        // Reset scroll to top on new page load
        if (kindleViewport) kindleViewport.scrollTop = 0;

        // Fetch bypassing SW cache to avoid ERR_FAILED on special-char folder names
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const response = await fetch(pageUrl, { signal: controller.signal, cache: 'no-store' });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error(`Page markdown file not found (HTTP ${response.status}).`);
        const md = await response.text();

        // Convert to HTML via marked.parse
        let htmlContent = marked.parse(md);

        // Adjust relative image source links
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        tempDiv.querySelectorAll('img').forEach(img => {
          const src = img.getAttribute('src');
          if (src && !src.startsWith('http') && !src.startsWith('data:')) {
            img.src = encodeURI(`${bookInfo.folder}/pages/page-${pageNum}/${src}`);
          }
        });

        // Set content and zoom font scale
        const kindleTextContent = document.getElementById('kindleTextContent');
        kindleTextContent.innerHTML = tempDiv.innerHTML;

        if (readerFitMode === 'width' || readerFitMode === 'page') {
          readerZoomScale = 1.0;
          updateZoomDisplay();
        }
        kindleTextContent.style.fontSize = `${1.12 * readerZoomScale}rem`;

        updateReaderUI(totalPages);
        kindleLoader.classList.add('hidden');
      } else {
        // PDF Canvas rendering (for custom uploaded PDF)
        if (!currentPdfDoc) return;
        // Reset scroll to top on new page load
        if (kindleViewport) kindleViewport.scrollTop = 0;
        const page = await currentPdfDoc.getPage(currentPageIndex + 1);

        // Compute Fitting scales — use actual viewport size (no assumed padding on mobile)
        const viewWidth = kindleViewport.clientWidth;
        const viewHeight = kindleViewport.clientHeight;
        let viewport = page.getViewport({ scale: readerZoomScale });

        if (readerFitMode === 'width') {
          const scale = viewWidth / page.getViewport({ scale: 1.0 }).width;
          viewport = page.getViewport({ scale });
          readerZoomScale = scale;
          updateZoomDisplay();
        } else if (readerFitMode === 'page') {
          const scale = viewHeight / page.getViewport({ scale: 1.0 }).height;
          viewport = page.getViewport({ scale });
          readerZoomScale = scale;
          updateZoomDisplay();
        }

        kindleCanvas.width = viewport.width;
        kindleCanvas.height = viewport.height;

        const canvasContext = kindleCanvas.getContext('2d');
        canvasContext.clearRect(0, 0, kindleCanvas.width, kindleCanvas.height);

        const renderContext = {
          canvasContext,
          viewport
        };

        await page.render(renderContext).promise;

        updateReaderUI(totalPages);
      }
    } catch (err) {
      console.error('Page render error:', err);
      kindleLoader.classList.add('hidden');
      // Show error inline instead of closing reader - lets user try navigating
      const kindleTextContent = document.getElementById('kindleTextContent');
      if (kindleTextContent && !kindleTextContent.classList.contains('hidden')) {
        kindleTextContent.innerHTML = `<div style="padding:2rem;text-align:center;color:#e74c3c;"><h3>⚠️ Failed to load page ${currentPageIndex + 1}</h3><p style="color:#aaa">${err.message}</p><p style="color:#aaa">Try navigating to another page.</p></div>`;
      } else {
        alert('Error: Failed to load page ' + (currentPageIndex + 1) + '. ' + err.message);
      }
    } finally {
      isRendering = false;
      if (renderPendingIndex !== null) {
        const nextIndex = renderPendingIndex;
        renderPendingIndex = null;
        currentPageIndex = nextIndex;
        renderKindlePage();
      }
    }
  }

  function updateZoomDisplay() {
    lblKindleZoomScale.textContent = `${Math.round(readerZoomScale * 100)}%`;
    safeLS.setItem('pmp_reader_zoom', readerZoomScale);
    safeLS.setItem('pmp_reader_fit', readerFitMode);
  }

  // 4. Back Button → close reader and return to dashboard
  kindleBtnBack.addEventListener('click', () => {
    closeKindleReader();
  });

  // 5. Persistent Prev / Next Navigation Buttons
  kindleBtnPrev.addEventListener('click', () => {
    if (currentPageIndex > 0) {
      currentPageIndex--;
      renderKindlePage();
    }
  });

  kindleBtnNext.addEventListener('click', () => {
    const total = getTotalPages();
    if (currentPageIndex < total - 1) {
      currentPageIndex++;
      renderKindlePage();
    }
  });

  // 6. Margin Tap Navigation & HUD Toggle via Viewport Clicks
  kindleViewport.addEventListener('click', (e) => {
    // If selecting text, don't trigger navigation
    if (window.getSelection() && window.getSelection().toString().trim().length > 0) {
      return;
    }

    // Ignore clicks on control panels, bookmark ribbon, navigation buttons, etc.
    if (e.target.closest('#kindleBookmarkRibbon') || 
        e.target.closest('.hud-btn') || 
        e.target.closest('.kindle-nav-bar') || 
        e.target.closest('.kindle-drawer') || 
        e.target.closest('#kindleAaPopover')) {
      return;
    }

    const rect = kindleViewport.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    // Ignore clicks on the scrollbar
    if (clickX > kindleViewport.clientWidth) {
      return;
    }

    const width = rect.width;
    const ratio = clickX / width;

    if (ratio < 0.16) {
      // Left 16% -> Prev Page
      if (currentPageIndex > 0) {
        currentPageIndex--;
        renderKindlePage();
      }
    } else if (ratio > 0.84) {
      // Right 16% -> Next Page
      const total = getTotalPages();
      if (currentPageIndex < total - 1) {
        currentPageIndex++;
        renderKindlePage();
      }
    } else {
      // Center 68% -> Toggle HUD
      const isVisible = kindleHUDHeader.classList.contains('visible');
      toggleHUD(!isVisible);
      // Close any open popovers/drawers when toggling HUD
      kindleAaPopover.classList.remove('visible');
      closeAllDrawers();
    }
  });

  function getTotalPages() {
    return (currentBookId in localBooks) ? localBooks[currentBookId].pages : (currentPdfDoc ? currentPdfDoc.numPages : 1);
  }

  // Re-render on resize (handles orientation changes & mobile browser bar show/hide)
  let resizeRenderTimer = null;
  const viewportResizeObserver = new ResizeObserver(() => {
    clearTimeout(resizeRenderTimer);
    resizeRenderTimer = setTimeout(() => {
      if (!kindleReaderOverlay.classList.contains('hidden') && !isRendering) {
        renderKindlePage();
      }
    }, 200);
  });
  viewportResizeObserver.observe(kindleViewport);

  // Swipe gestures
  let touchStartX = 0;
  let touchEndX = 0;
  kindleViewport.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  kindleViewport.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const threshold = 60;
    const total = getTotalPages();
    if (touchStartX - touchEndX > threshold) {
      // Swipe Left -> Next Page
      if (currentPageIndex < total - 1) {
        currentPageIndex++;
        renderKindlePage();
      }
    } else if (touchEndX - touchStartX > threshold) {
      // Swipe Right -> Prev Page
      if (currentPageIndex > 0) {
        currentPageIndex--;
        renderKindlePage();
      }
    }
  }, { passive: true });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (kindleReaderOverlay.classList.contains('hidden')) return;
    const total = getTotalPages();
    if (e.key === 'ArrowLeft') {
      if (currentPageIndex > 0) {
        currentPageIndex--;
        renderKindlePage();
      }
    }
    if (e.key === 'ArrowRight') {
      if (currentPageIndex < total - 1) {
        currentPageIndex++;
        renderKindlePage();
      }
    }
    if (e.key === 'Escape') {
      closeKindleReader();
    }
  });

  // Footer range progress slider scrub (debounced to prevent excessive renders)
  let sliderDebounceTimer = null;
  kindleProgressSlider.addEventListener('input', () => {
    const total = getTotalPages();
    const pct = parseInt(kindleProgressSlider.value);
    currentPageIndex = Math.round((pct / 100) * (total - 1));
    // Update status text immediately for responsiveness
    kindleProgressStatus.textContent = `Location ${currentPageIndex + 1} of ${total} · ${pct}%`;
    // Debounce the expensive page render
    if (sliderDebounceTimer) clearTimeout(sliderDebounceTimer);
    sliderDebounceTimer = setTimeout(() => {
      renderKindlePage();
    }, 150);
  });

  // 5. Bookmark Ribbon Logic (Visual ribbon + HUD toggle)
  function getBookmarkedPages() {
    const listJson = safeLS.getItem(`pmp_bookmarks_list_${currentBookId}`);
    return listJson ? JSON.parse(listJson) : [];
  }

  function saveBookmarkedPages(pagesArr) {
    safeLS.setItem(`pmp_bookmarks_list_${currentBookId}`, JSON.stringify(pagesArr));
  }

  function updateBookmarkRibbonUI() {
    const pages = getBookmarkedPages();
    const isBookmarked = pages.includes(currentPageIndex);
    kindleBookmarkRibbon.classList.toggle('active', isBookmarked);
    kindleBookmarkIcon.classList.toggle('active', isBookmarked);
    
    // Toggle color in SVG
    if (isBookmarked) {
      kindleBookmarkRibbon.style.color = '#3b82f6';
      kindleBookmarkIcon.style.color = '#3b82f6';
    } else {
      kindleBookmarkRibbon.style.color = '';
      kindleBookmarkIcon.style.color = '';
    }
  }

  function toggleCurrentPageBookmark() {
    if (!currentBookId) return;
    let pages = getBookmarkedPages();
    const index = pages.indexOf(currentPageIndex);
    if (index >= 0) {
      pages.splice(index, 1);
    } else {
      pages.push(currentPageIndex);
      pages.sort((a, b) => a - b);
    }
    saveBookmarkedPages(pages);
    updateBookmarkRibbonUI();
    if (kindleBookmarksDrawer.classList.contains('visible')) {
      buildBookmarksList();
    }
  }

  kindleBookmarkRibbon.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleCurrentPageBookmark();
  });

  kindleBtnBookmark.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleCurrentPageBookmark();
  });

  // 6. Drawers & Menus (TOC, Settings, Search, About, Bookmarks list)
  // Table of Contents Drawer
  kindleBtnTOC.addEventListener('click', (e) => {
    e.stopPropagation();
    const wasVisible = kindleTOCDrawer.classList.contains('visible');
    closeAllDrawers();
    if (!wasVisible) kindleTOCDrawer.classList.add('visible');
  });

  document.getElementById('kindleBtnCloseTOC').addEventListener('click', () => {
    kindleTOCDrawer.classList.remove('visible');
  });

  async function buildKindleTOC() {
    kindleTOCList.innerHTML = '';
    bookTOC = [];

    const isLocal = (currentBookId in localBooks);

    if (isLocal) {
      const bookTOCConfig = localBooks[currentBookId].toc;
      bookTOCConfig.forEach(item => {
        bookTOC.push({ title: item.title, pageIndex: item.page, depth: item.depth });
      });
    } else {
      try {
        if (currentPdfDoc) {
          const outline = await currentPdfDoc.getOutline();
          if (outline && outline.length > 0) {
            async function processNode(nodes, depth = 0) {
              for (const node of nodes) {
                let pageIndex = -1;
                if (node.dest) {
                  try {
                    let dest = node.dest;
                    if (typeof dest === 'string') {
                      dest = await currentPdfDoc.getDestination(dest);
                    }
                    if (Array.isArray(dest)) {
                      pageIndex = await currentPdfDoc.getPageIndex(dest[0]);
                    }
                  } catch (e) {
                    console.warn('Dest resolution error:', node.title, e);
                  }
                }
                if (pageIndex >= 0) {
                  bookTOC.push({ title: node.title, pageIndex, depth });
                }
                if (node.items && node.items.length > 0 && bookTOC.length < 60) {
                  await processNode(node.items, depth + 1);
                }
              }
            }
            await processNode(outline);
          }
        }
      } catch (e) {
        console.warn('Outline fetch failed:', e);
      }

      if (bookTOC.length === 0 && currentPdfDoc) {
        // Fallback page partitions
        const pageCount = currentPdfDoc.numPages;
        const step = Math.max(1, Math.round(pageCount / 20));
        for (let i = 0; i < pageCount; i += step) {
          bookTOC.push({ title: `Section — Page ${i + 1}`, pageIndex: i, depth: 0 });
        }
      }
    }

    bookTOC.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.title;
      li.dataset.page = item.pageIndex;
      li.style.paddingLeft = `${10 + item.depth * 14}px`;
      li.addEventListener('click', () => {
        currentPageIndex = item.pageIndex;
        renderKindlePage();
        kindleTOCDrawer.classList.remove('visible');
      });
      kindleTOCList.appendChild(li);
    });
  }

  // Display Settings Aa Panel
  kindleBtnAa.addEventListener('click', (e) => {
    e.stopPropagation();
    kindleAaPopover.classList.toggle('visible');
  });

  // Bind theme clicks in popover
  document.querySelectorAll('#kindleAaPopover .btn-theme-hud').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('#kindleAaPopover .btn-theme-hud').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      readerTheme = btn.dataset.theme;
      safeLS.setItem('pmp_reader_theme', readerTheme);
      applyKindleTheme();
    });
  });

  function applyKindleTheme() {
    kindleReaderOverlay.classList.remove('theme-dark', 'theme-light', 'theme-sepia');
    document.querySelectorAll('#kindleAaPopover .btn-theme-hud').forEach(b => {
      b.classList.toggle('active', b.dataset.theme === readerTheme);
    });

    let activeTheme = readerTheme;
    if (readerTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      activeTheme = prefersDark ? 'dark' : 'light';
    }
    kindleReaderOverlay.classList.add('theme-' + activeTheme);
  }

  // Bind Fit controls
  const btnKindleFitWidth = document.getElementById('btnKindleFitWidth');
  const btnKindleFitPage = document.getElementById('btnKindleFitPage');
  const btnKindleZoomDec = document.getElementById('btnKindleZoomDec');
  const btnKindleZoomInc = document.getElementById('btnKindleZoomInc');

  btnKindleFitWidth.addEventListener('click', (e) => {
    e.stopPropagation();
    btnKindleFitWidth.classList.add('active');
    btnKindleFitPage.classList.remove('active');
    readerFitMode = 'width';
    renderKindlePage();
  });

  btnKindleFitPage.addEventListener('click', (e) => {
    e.stopPropagation();
    btnKindleFitPage.classList.add('active');
    btnKindleFitWidth.classList.remove('active');
    readerFitMode = 'page';
    renderKindlePage();
  });

  // Bind zoom buttons
  btnKindleZoomDec.addEventListener('click', (e) => {
    e.stopPropagation();
    if (readerZoomScale > 0.3) {
      readerFitMode = 'custom';
      btnKindleFitWidth.classList.remove('active');
      btnKindleFitPage.classList.remove('active');
      readerZoomScale = Math.max(0.3, readerZoomScale - 0.15);
      updateZoomDisplay();
      renderKindlePage();
    }
  });

  btnKindleZoomInc.addEventListener('click', (e) => {
    e.stopPropagation();
    if (readerZoomScale < 3.0) {
      readerFitMode = 'custom';
      btnKindleFitWidth.classList.remove('active');
      btnKindleFitPage.classList.remove('active');
      readerZoomScale = Math.min(3.0, readerZoomScale + 0.15);
      updateZoomDisplay();
      renderKindlePage();
    }
  });

  // Annotations / Bookmarks List Drawer (via Grid button in footer HUD or More menu option)
  kindleBtnGridView.addEventListener('click', (e) => {
    e.stopPropagation();
    const wasVisible = kindleBookmarksDrawer.classList.contains('visible');
    closeAllDrawers();
    if (!wasVisible) {
      buildBookmarksList();
      kindleBookmarksDrawer.classList.add('visible');
    }
  });

  document.getElementById('kindleBtnCloseBookmarks').addEventListener('click', () => {
    kindleBookmarksDrawer.classList.remove('visible');
  });

  function buildBookmarksList() {
    kindleBookmarksList.innerHTML = '';
    const pages = getBookmarkedPages();
    
    if (pages.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No pages bookmarked yet.';
      li.style.fontStyle = 'italic';
      li.style.color = 'var(--text-muted)';
      kindleBookmarksList.appendChild(li);
      return;
    }

    pages.forEach(pageIdx => {
      const li = document.createElement('li');
      li.innerHTML = `<span style="font-weight:700; color:var(--accent-primary);">Page ${pageIdx + 1}</span>`;
      li.addEventListener('click', () => {
        currentPageIndex = pageIdx;
        renderKindlePage();
        kindleBookmarksDrawer.classList.remove('visible');
      });
      kindleBookmarksList.appendChild(li);
    });
  }

  // Text Search Drawer
  kindleBtnSearch.addEventListener('click', (e) => {
    e.stopPropagation();
    const wasVisible = kindleSearchDrawer.classList.contains('visible');
    closeAllDrawers();
    if (!wasVisible) {
      kindleSearchDrawer.classList.add('visible');
      txtKindleSearch.focus();
    }
  });

  document.getElementById('kindleBtnCloseSearch').addEventListener('click', () => {
    kindleSearchDrawer.classList.remove('visible');
    activeSearchQuery = '';
  });

  btnKindleSearchGo.addEventListener('click', (e) => {
    e.stopPropagation();
    performKindleSearch(txtKindleSearch.value.trim());
  });

  txtKindleSearch.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      performKindleSearch(txtKindleSearch.value.trim());
    }
  });

  // PDF and Markdown Text Search Engine (Async cross-page scanning)
  async function performKindleSearch(query) {
    kindleSearchResults.innerHTML = '';
    lblKindleSearchCount.textContent = 'Searching...';

    if (!query) {
      lblKindleSearchCount.textContent = 'Enter keyword to search.';
      return;
    }

    const isLocal = (currentBookId in localBooks);
    let matchCount = 0;
    activeSearchQuery = query;

    if (isLocal) {
      const bookInfo = localBooks[currentBookId];
      const total = bookInfo.pages;
      const folder = bookInfo.folder;
      const chunkSize = 30;

      for (let i = 0; i < total; i += chunkSize) {
        if (activeSearchQuery !== query) return; // query changed, abort

        const promises = [];
        const limit = Math.min(total, i + chunkSize);
        for (let p = i; p < limit; p++) {
          const pageNum = p + 1;
          const pageUrl = encodeURI(`${folder}/pages/page-${pageNum}/markdown.md`);
          promises.push(
            fetch(pageUrl)
              .then(res => res.text())
              .then(text => ({ pageIndex: p, text }))
              .catch(() => ({ pageIndex: p, text: '' }))
          );
        }

        const results = await Promise.all(promises);
        for (const res of results) {
          if (activeSearchQuery !== query) return;
          const index = res.text.toLowerCase().indexOf(query.toLowerCase());
          if (index >= 0) {
            matchCount++;
            lblKindleSearchCount.textContent = `Found ${matchCount} matches...`;

            const start = Math.max(0, index - 25);
            const end = Math.min(res.text.length, index + query.length + 35);
            let snippet = res.text.substring(start, end).replace(/[\r\n]+/g, ' ');
            if (start > 0) snippet = '...' + snippet;
            if (end < res.text.length) snippet = snippet + '...';

            const li = document.createElement('li');
            li.style.cursor = 'pointer';
            li.innerHTML = `<div style="font-weight:700; color:var(--accent-tertiary); font-size:0.75rem;">Page ${res.pageIndex + 1}</div><div style="font-size:0.72rem; color:var(--text-secondary); white-space:normal; overflow:visible; text-overflow:clip; line-height:1.45;">${escapeHTML(snippet)}</div>`;
            li.dataset.page = res.pageIndex;
            li.addEventListener('click', () => {
              currentPageIndex = res.pageIndex;
              renderKindlePage();
              kindleSearchDrawer.classList.remove('visible');
            });
            kindleSearchResults.appendChild(li);
          }
        }
      }
    } else {
      if (!currentPdfDoc) {
        lblKindleSearchCount.textContent = 'No active document to search.';
        return;
      }

      for (let i = 0; i < currentPdfDoc.numPages; i++) {
        if (activeSearchQuery !== query) return; // query changed, abort
        try {
          const page = await currentPdfDoc.getPage(i + 1);
          const textContent = await page.getTextContent();
          const textItems = textContent.items.map(item => item.str).join(' ');
          const index = textItems.toLowerCase().indexOf(query.toLowerCase());
          
          if (index >= 0) {
            matchCount++;
            lblKindleSearchCount.textContent = `Found ${matchCount} matches...`;

            const start = Math.max(0, index - 25);
            const end = Math.min(textItems.length, index + query.length + 35);
            let snippet = textItems.substring(start, end);
            if (start > 0) snippet = '...' + snippet;
            if (end < textItems.length) snippet = snippet + '...';

            const li = document.createElement('li');
            li.style.cursor = 'pointer';
            li.innerHTML = `<div style="font-weight:700; color:var(--accent-tertiary); font-size:0.75rem;">Page ${i + 1}</div><div style="font-size:0.72rem; color:var(--text-secondary); white-space:normal; overflow:visible; text-overflow:clip; line-height:1.45;">${escapeHTML(snippet)}</div>`;
            li.dataset.page = i;
            li.addEventListener('click', () => {
              currentPageIndex = i;
              renderKindlePage();
              kindleSearchDrawer.classList.remove('visible');
            });
            kindleSearchResults.appendChild(li);
          }
        } catch (err) {
          console.warn('Search error page:', i + 1, err);
        }
      }
    }

    if (matchCount === 0) {
      lblKindleSearchCount.textContent = 'No matches found.';
    } else {
      lblKindleSearchCount.textContent = `Search completed. Found ${matchCount} matches.`;
    }
  }

  function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // More Options Drawer
  kindleBtnMore.addEventListener('click', (e) => {
    e.stopPropagation();
    const wasVisible = kindleAboutDrawer.classList.contains('visible');
    closeAllDrawers();
    if (!wasVisible) {
      const titleStr = getBookTitle(currentBookId);

      kindleAboutTitle.textContent = titleStr;
      
      const coverDiv = document.getElementById('kindleAboutCover');
      coverDiv.className = `kindle-about-cover ${currentBookId === 'pmbok7' ? 'agile-cover' : currentBookId === 'pmbok6' ? 'predictive-cover' : 'custom-cover'}`;
      coverDiv.innerHTML = `<div style="padding:15px; color:#fff; display:flex; flex-direction:column; justify-content:space-between; height:100%;"><div style="font-size:0.5rem; font-weight:800; opacity:0.6; text-align:right;">PMP</div><div style="font-size:0.8rem; font-weight:800; line-height:1.2;">${titleStr}</div></div>`;

      // Predefined books are local files, so hide delete button in about menu
      if (currentBookId in localBooks) {
        btnKindleDeleteFromReader.classList.add('hidden');
      } else {
        btnKindleDeleteFromReader.classList.remove('hidden');
      }

      kindleAboutDrawer.classList.add('visible');
    }
  });

  document.getElementById('kindleBtnCloseAbout').addEventListener('click', () => {
    kindleAboutDrawer.classList.remove('visible');
  });

  btnKindleSyncFurthest.addEventListener('click', (e) => {
    e.stopPropagation();
    alert('Progress is already synchronized with this device.');
  });

  btnKindleAnnotations.addEventListener('click', (e) => {
    e.stopPropagation();
    closeAllDrawers();
    buildBookmarksList();
    kindleBookmarksDrawer.classList.add('visible');
  });

  btnKindleDeleteFromReader.addEventListener('click', async (e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this book from browser storage? You will need to upload it again to read it.')) {
      try {
        await dbDeleteBook(currentBookId);
        safeLS.removeItem(`pmp_bookmark_${currentBookId}`);
        safeLS.removeItem(`pmp_bookmark_time_${currentBookId}`);
        safeLS.removeItem(`pmp_bookmarks_list_${currentBookId}`);
        alert('Book deleted successfully.');
        closeKindleReader();
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete book.');
      }
    }
  });

  // 7. Bookshelf Dashboard Triggers
  document.querySelectorAll('.btn-read-book').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openKindleReader(btn.dataset.book);
    });
  });

  document.querySelectorAll('.btn-upload-book').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentBookId = btn.dataset.book;
      lblUploadBookTitle.textContent = `Upload ${getBookTitle(currentBookId)}`;
      bookshelfUploadZone.classList.remove('hidden');
      window.scrollTo({ top: bookshelfUploadZone.offsetTop - 50, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('.btn-delete-book').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const bookId = btn.dataset.book;
      if (confirm('Delete this book from local browser memory?')) {
        try {
          await dbDeleteBook(bookId);
          safeLS.removeItem(`pmp_bookmark_${bookId}`);
          safeLS.removeItem(`pmp_bookmark_time_${bookId}`);
          safeLS.removeItem(`pmp_bookmarks_list_${bookId}`);
          updateBookshelfUI();
        } catch (err) {
          alert('Delete failed.');
        }
      }
    });
  });

  // Bookshelf Dropzone Events
  const bookshelfUploadZone = document.getElementById('bookshelfUploadZone');
  const btnSelectUploadFile = document.getElementById('btnSelectUploadFile');
  const btnCancelUpload = document.getElementById('btnCancelUpload');

  bookshelfUploadZone.addEventListener('click', (e) => {
    // Only trigger input if clicking elements in the initial upload state
    if (e.target.closest('#uploadInitialState') || e.target === bookshelfUploadZone) {
      pdfFileInput.click();
    }
  });

  if (btnCancelUpload) {
    btnCancelUpload.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('uploadProgressState').classList.add('hidden');
      document.getElementById('uploadInitialState').classList.remove('hidden');
      document.getElementById('uploadFeedbackAlert').classList.add('hidden');
      btnCancelUpload.classList.add('hidden');
    });
  }

  bookshelfUploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    bookshelfUploadZone.style.borderColor = 'var(--accent-primary)';
  });

  bookshelfUploadZone.addEventListener('dragleave', () => {
    bookshelfUploadZone.style.borderColor = '';
  });

  bookshelfUploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    bookshelfUploadZone.style.borderColor = '';
    // Only drop if in initial state
    if (document.getElementById('uploadProgressState').classList.contains('hidden')) {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleBookshelfUpload(e.dataTransfer.files[0]);
      }
    }
  });

  pdfFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleBookshelfUpload(e.target.files[0]);
    }
  });

  async function handleBookshelfUpload(file) {
    if (!file || file.type !== 'application/pdf') {
      alert('Please select a valid PDF file.');
      return;
    }

    // Toggle states
    document.getElementById('uploadInitialState').classList.add('hidden');
    document.getElementById('uploadProgressState').classList.remove('hidden');
    
    const progressPercent = document.getElementById('uploadProgressPercent');
    const progressBarFill = document.getElementById('uploadProgressBarFill');
    const progressMsg = document.getElementById('uploadProgressMsg');
    const feedbackAlert = document.getElementById('uploadFeedbackAlert');

    progressPercent.textContent = '0%';
    progressBarFill.style.width = '0%';
    progressMsg.textContent = 'Reading PDF file...';
    feedbackAlert.classList.add('hidden');
    if (btnCancelUpload) btnCancelUpload.classList.add('hidden');

    const fileReader = new FileReader();

    fileReader.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        progressPercent.textContent = `${pct}%`;
        progressBarFill.style.width = `${pct}%`;
        progressMsg.textContent = `Reading PDF (${Math.round(e.loaded / 1024)} KB / ${Math.round(e.total / 1024)} KB)...`;
      }
    };

    fileReader.onload = async function() {
      progressPercent.textContent = '100%';
      progressBarFill.style.width = '100%';
      progressMsg.textContent = 'Caching file to offline storage...';

      try {
        await dbSaveBook(currentBookId, file);
        safeLS.setItem('pmp_custom_filename', file.name);

        feedbackAlert.className = 'upload-feedback-alert success';
        feedbackAlert.style.background = 'rgba(6, 214, 160, 0.1)';
        feedbackAlert.style.color = 'var(--accent-primary)';
        feedbackAlert.style.border = '1px solid rgba(6, 214, 160, 0.3)';
        feedbackAlert.innerHTML = `<strong>Success!</strong> "${file.name}" has been cached locally. Launching reader...`;
        feedbackAlert.classList.remove('hidden');

        setTimeout(async () => {
          // Reset status
          document.getElementById('uploadProgressState').classList.add('hidden');
          document.getElementById('uploadInitialState').classList.remove('hidden');
          feedbackAlert.classList.add('hidden');
          bookshelfUploadZone.classList.add('hidden');
          
          await openKindleReader(currentBookId);
        }, 1500);

      } catch (err) {
        console.error('Save error:', err);
        feedbackAlert.className = 'upload-feedback-alert error';
        feedbackAlert.style.background = 'rgba(239, 71, 111, 0.1)';
        feedbackAlert.style.color = 'var(--accent-warm)';
        feedbackAlert.style.border = '1px solid rgba(239, 71, 111, 0.3)';
        feedbackAlert.innerHTML = `<strong>Write Failed!</strong> Failed to save PDF to IndexedDB offline cache.`;
        feedbackAlert.classList.remove('hidden');
        if (btnCancelUpload) btnCancelUpload.classList.remove('hidden');
      }
    };

    fileReader.onerror = () => {
      feedbackAlert.className = 'upload-feedback-alert error';
      feedbackAlert.style.background = 'rgba(239, 71, 111, 0.1)';
      feedbackAlert.style.color = 'var(--accent-warm)';
      feedbackAlert.style.border = '1px solid rgba(239, 71, 111, 0.3)';
      feedbackAlert.innerHTML = `<strong>Read Failed!</strong> FileReader failed to parse document.`;
      feedbackAlert.classList.remove('hidden');
      if (btnCancelUpload) btnCancelUpload.classList.remove('hidden');
    };

    fileReader.readAsArrayBuffer(file);
  }

  // Dynamic Popover close handlers
  document.addEventListener('click', (e) => {
    if (kindleReaderOverlay.classList.contains('hidden')) return;
    
    // If click is outside popover and AA button, hide popover
    if (!kindleAaPopover.contains(e.target) && e.target !== kindleBtnAa && !kindleBtnAa.contains(e.target)) {
      kindleAaPopover.classList.remove('visible');
    }
  });

  // Initialize display settings
  applyKindleTheme();
  updateZoomDisplay();
  updateBookshelfUI();

  if (window.location.protocol === 'file:') {
    const alertEl = document.getElementById('fileProtocolAlert');
    if (alertEl) {
      alertEl.classList.remove('hidden');
    }
  }

  // ══════════════════════════════════════════════
  //  PM NEWS & INNOVATIONS & REMOTE JOBS DATABASES
  // ══════════════════════════════════════════════
  
  // Date helper to ensure all dates are within 3 weeks
  function getDynamicDate(daysAgo) {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  const pmNewsDatabase = [
    {
      id: 1,
      title: "AI-Driven Predictive Scheduling: The Next Frontier in Hybrid Projects",
      source: "PMI Network",
      category: "AI",
      summary: "A new study by PMI reveals that 62% of high-performing organizations are adopting generative AI tools to automate scope verification and schedule risk forecasting.",
      content: "AI-driven predictive scheduling is changing how PMOs work. By analyzing historical project performance, team velocities, and dependency patterns, AI tools can predict potential bottlenecks weeks in advance.",
      readTime: "4 min",
      daysAgo: 2,
      link: "https://www.pmi.org/learning/thought-leadership/pulse"
    },
    {
      id: 2,
      title: "Scaling Agile in Hard Engineering: Lessons from SpaceTech",
      source: "Scrum Alliance",
      category: "Agile",
      summary: "SpaceTech teams have successfully scaled Scrum to hardware manufacturing by using iterative testing cycles and modular design principles.",
      content: "Traditional hardware development has long been considered purely predictive. However, SpaceTech startups are demonstrating that agile scaling frameworks (like SAFe or LeSS) can be adapted to rocket manufacturing and satellite engineering.",
      readTime: "5 min",
      daysAgo: 4,
      link: "https://www.scrumalliance.org/about-scrum/stories"
    },
    {
      id: 3,
      title: "PMBOK 7th Edition: Tailoring the Life Cycle for Hybrid Projects",
      source: "ProjectManagement.com",
      category: "Hybrid",
      summary: "This paper outlines practical methodologies for tailoring project life cycles by combining PMBOK 7th edition principles with Kanban boards.",
      content: "Tailoring is the key performance driver in PMBOK 7. Rather than choosing between Waterfall and Scrum, project leaders are mixing development life cycles.",
      readTime: "6 min",
      daysAgo: 6,
      link: "https://www.projectmanagement.com/articles/"
    },
    {
      id: 4,
      title: "Generative AI Guidelines Issued by the Project Management Institute",
      source: "PMI Network",
      category: "AI",
      summary: "PMI has released an official framework detailing the ethical use of LLMs in drafting project charters, stakeholder registers, and risk matrices.",
      content: "As Generative AI becomes ubiquitous, PMI has established guidelines to ensure data privacy, intellectual property protection, and human oversight.",
      readTime: "3 min",
      daysAgo: 8,
      link: "https://www.pmi.org/learning/thought-leadership/pulse"
    },
    {
      id: 5,
      title: "The Evolution of PMOs: Moving from Value Delivery to Strategic Advisory",
      source: "Harvard Business Review",
      category: "Agile",
      summary: "Modern PMOs are shifting from administrative compliance centers to strategic centers of excellence focused on Agile business transformation.",
      content: "According to HBR, the traditional PMO focused on monitoring budgets and schedules is dying. The next-generation PMO acts as a strategic business partner.",
      readTime: "7 min",
      daysAgo: 11,
      link: "https://hbr.org/topic/project-management"
    },
    {
      id: 6,
      title: "Measuring Agile Team Performance: Beyond Velocity",
      source: "Scrum Alliance",
      category: "Agile",
      summary: "Velocity is a planning metric, not a performance metric. Scrum guides suggest shifting to cycle time and customer value metrics.",
      content: "Many organizations fall into the trap of using velocity to compare Scrum teams. Experts advise looking at cycle time and throughput.",
      readTime: "5 min",
      daysAgo: 14,
      link: "https://www.scrumalliance.org/about-scrum/stories"
    },
    {
      id: 7,
      title: "Hybrid Risk Management: Integrating Risk Registers with Agile Backlogs",
      source: "ProjectManagement.com",
      category: "Hybrid",
      summary: "A step-by-step framework to link high-level risk registers with low-level Scrum sprints and backlog refinement.",
      content: "In hybrid projects, Waterfall risk logs often sit isolated from Scrum sprint planning. A modern approach involves mapping risk register entries to specific backlog user stories.",
      readTime: "5 min",
      daysAgo: 18,
      link: "https://www.projectmanagement.com/blogs/"
    },
    {
      id: 8,
      title: "Managing Stakeholder Expectations in High-Uncertainty Environments",
      source: "PMI Network",
      category: "Hybrid",
      summary: "Tips on using frequent stakeholder demos and value delivery metrics over standard progress reports.",
      content: "In volatile projects, standard status reports quickly become obsolete. PMI suggests utilizing interactive stakeholder demos.",
      readTime: "4 min",
      daysAgo: 3,
      link: "https://www.pmi.org/learning/thought-leadership/pulse"
    },
    {
      id: 9,
      title: "The PMP Certification in 2026: Trends and Market Value",
      source: "LinkedIn News",
      category: "Agile",
      summary: "LinkedIn analysis shows a 22% increase in hiring listings requiring a PMP certification for remote engineering and healthcare roles.",
      content: "A recent analysis of job listings on LinkedIn indicates that the PMP certification remains the gold standard.",
      readTime: "3 min",
      daysAgo: 5,
      link: "https://www.linkedin.com/news/"
    },
    {
      id: 10,
      title: "Ethical Considerations in Project Data Analytics",
      source: "Harvard Business Review",
      category: "AI",
      summary: "Using AI to track developer code output or team sentiment risks serious ethical backlash if transparency and safety are missing.",
      content: "As tools emerge that claim to measure team productivity or burn-out using AI, HR and project leaders must exercise caution.",
      readTime: "6 min",
      daysAgo: 10,
      link: "https://hbr.org/topic/project-management"
    },
    {
      id: 11,
      title: "Kanban for Remote Teams: Optimizing Workflow in 2026",
      source: "Scrum Alliance",
      category: "Agile",
      summary: "Best practices for designing digital Kanban boards to prevent bottlenecks and manage WIP limits remotely.",
      content: "Remote work amplifies workflow bottlenecks. Setting clear WIP (Work In Progress) limits helps remote teams stay focused.",
      readTime: "4 min",
      daysAgo: 15,
      link: "https://www.scrumalliance.org/resources"
    },
    {
      id: 12,
      title: "Green Project Management: Sustainability as a Project Objective",
      source: "PMI Network",
      category: "Hybrid",
      summary: "How to integrate ecological impact assessments into project charter templates and risk logs.",
      content: "PMI's focus on social impact is driving project managers to add 'sustainability' as a core project constraint alongside scope, time, cost, and quality.",
      readTime: "5 min",
      daysAgo: 19,
      link: "https://www.pmi.org/learning/thought-leadership"
    }
  ];

  const pmJobsDatabase = [
  {
    "id": 1,
    "title": "VP Paid Media",
    "company": "Kanahoma",
    "board": "LinkedIn",
    "exp": "Mid",
    "salary": "$95,000 - $120,000/yr",
    "requirements": [
      "Active PMP certification or equivalent path",
      "3-5 years managing software or business operations projects",
      "Solid understanding of hybrid Waterfall/Agile lifecycles",
      "Strong verbal and written English communication skills"
    ],
    "daysAgo": 4,
    "description": "Role DescriptionThe Vice President, Paid Media, is the senior-most Paid Media leader at Kanahoma, responsible for the strategic direction, performance, and continuous evolution of the agencyâs Paid Media practice. Reporting directly to the SVP, ...",
    "link": "https://www.linkedin.com/jobs/search/?keywords=VP%20Paid%20Media%20Kanahoma"
  },
  {
    "id": 2,
    "title": "Project Manager",
    "company": "Jobberman Nigeria Recruitment",
    "board": "Indeed",
    "exp": "Mid",
    "salary": "$95,000 - $120,000/yr",
    "requirements": [
      "Active PMP certification or equivalent path",
      "3-5 years managing software or business operations projects",
      "Solid understanding of hybrid Waterfall/Agile lifecycles",
      "Strong verbal and written English communication skills"
    ],
    "daysAgo": 1,
    "description": "Leading Jobberman Nigeria Recruitment project team on key operational, software-enabled or organizational growth milestones. Coordinate stakeholder alignment, monitor critical path schedules, and resolve execution blockers.",
    "link": "https://www.indeed.com/jobs?q=Project%20Manager%20Jobberman%20Nigeria%20Recruitment"
  },
  {
    "id": 3,
    "title": "Project Manager Donut Studios",
    "company": "New Engen",
    "board": "Glassdoor",
    "exp": "Mid",
    "salary": "$95,000 - $120,000/yr",
    "requirements": [
      "Active PMP certification or equivalent path",
      "3-5 years managing software or business operations projects",
      "Solid understanding of hybrid Waterfall/Agile lifecycles",
      "Strong verbal and written English communication skills"
    ],
    "daysAgo": 4,
    "description": "WHY DONUT STUDIOS? At New Engen, we help brands grow, not just bigger, but smarter. Weâre a digital marketing agency that drives meaningful impact across the entire customer journey by integrating media, creative, analytics, influencer, and reta...",
    "link": "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=Project%20Manager%20Donut%20Studios%20New%20Engen"
  },
  {
    "id": 4,
    "title": "Product Owner",
    "company": "Rednoxx Limited",
    "board": "LinkedIn",
    "exp": "Mid",
    "salary": "$95,000 - $120,000/yr",
    "requirements": [
      "Active PMP certification or equivalent path",
      "3-5 years managing software or business operations projects",
      "Solid understanding of hybrid Waterfall/Agile lifecycles",
      "Strong verbal and written English communication skills"
    ],
    "daysAgo": 2,
    "description": "Leading Rednoxx Limited project team on key operational, software-enabled or organizational growth milestones. Coordinate stakeholder alignment, monitor critical path schedules, and resolve execution blockers.",
    "link": "https://www.linkedin.com/jobs/search/?keywords=Product%20Owner%20Rednoxx%20Limited"
  },
  {
    "id": 5,
    "title": "Engineer 2",
    "company": "Catalyst Brands India",
    "board": "Indeed",
    "exp": "Mid",
    "salary": "$95,000 - $120,000/yr",
    "requirements": [
      "Active PMP certification or equivalent path",
      "3-5 years managing software or business operations projects",
      "Solid understanding of hybrid Waterfall/Agile lifecycles",
      "Strong verbal and written English communication skills"
    ],
    "daysAgo": 4,
    "description": "OverviewPay RangeINR â¹0.00 - INR â¹0.00 /Yr.Please mention the word **CONGENIAL** and tag RNC4yMzYuMTY0LjE2Mg== when applying to show you read the job post completely (#RNC4yMzYuMTY0LjE2Mg==). This is a beta feature to avoid spam applicants. Co...",
    "link": "https://www.indeed.com/jobs?q=Engineer%202%20Catalyst%20Brands%20India"
  },
  {
    "id": 6,
    "title": "Senior Project Manager",
    "company": "Hedge & Pembrook Limited",
    "board": "Glassdoor",
    "exp": "Senior",
    "salary": "$135,000 - $165,000/yr",
    "requirements": [
      "Project Management Professional (PMP) certification required",
      "7+ years leading enterprise cross-functional programs",
      "Strong budget management, scheduling, and risk planning",
      "Strong verbal and written English communication skills"
    ],
    "daysAgo": 4,
    "description": "Leading Hedge & Pembrook Limited project team on key operational, software-enabled or organizational growth milestones. Coordinate stakeholder alignment, monitor critical path schedules, and resolve execution blockers.",
    "link": "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=Senior%20Project%20Manager%20Hedge%20%26%20Pembrook%20Limited"
  },
  {
    "id": 7,
    "title": "Join Our Team",
    "company": "Mixed Media Labs, Inc.",
    "board": "LinkedIn",
    "exp": "Mid",
    "salary": "$95,000 - $120,000/yr",
    "requirements": [
      "Active PMP certification or equivalent path",
      "3-5 years managing software or business operations projects",
      "Solid understanding of hybrid Waterfall/Agile lifecycles",
      "Strong verbal and written English communication skills"
    ],
    "daysAgo": 10,
    "description": "ECHEMI is a global chemical industry B2B website. You can find leading manufacturing companies, top suppliers &amp; quality chemical products here. We help you complete chemical business in the world. https://www.echemi.com/Please mention the word...",
    "link": "https://www.linkedin.com/jobs/search/?keywords=Join%20Our%20Team%20Mixed%20Media%20Labs%2C%20Inc."
  },
  {
    "id": 8,
    "title": "Project Manager",
    "company": "Monas Consulting",
    "board": "Indeed",
    "exp": "Mid",
    "salary": "$95,000 - $120,000/yr",
    "requirements": [
      "Active PMP certification or equivalent path",
      "3-5 years managing software or business operations projects",
      "Solid understanding of hybrid Waterfall/Agile lifecycles",
      "Strong verbal and written English communication skills"
    ],
    "daysAgo": 3,
    "description": "Leading Monas Consulting project team on key operational, software-enabled or organizational growth milestones. Coordinate stakeholder alignment, monitor critical path schedules, and resolve execution blockers.",
    "link": "https://www.indeed.com/jobs?q=Project%20Manager%20Monas%20Consulting"
  },
  {
    "id": 9,
    "title": "Preparador de Vehiculos Hatillo",
    "company": "Enterprise",
    "board": "Glassdoor",
    "exp": "Mid",
    "salary": "$95,000 - $120,000/yr",
    "requirements": [
      "Active PMP certification or equivalent path",
      "3-5 years managing software or business operations projects",
      "Solid understanding of hybrid Waterfall/Agile lifecycles",
      "Strong verbal and written English communication skills"
    ],
    "daysAgo": 11,
    "description": "OverviewPatrono con Igualdad de Oportunidad de EmpleoEnterprise Mobility (National Car Rental &amp; Alamo Rent A Car) es la compaÃ±Ã­a de renta de automÃ³viles privada mas grande y con el crecimiento mas rÃ¡pido de NorteamÃ©rica. Con mas de 9,000 ...",
    "link": "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=Preparador%20de%20Vehiculos%20Hatillo%20Enterprise"
  },
  {
    "id": 10,
    "title": "Project Manager",
    "company": "Turbo Energy Limited",
    "board": "LinkedIn",
    "exp": "Mid",
    "salary": "$95,000 - $120,000/yr",
    "requirements": [
      "Active PMP certification or equivalent path",
      "3-5 years managing software or business operations projects",
      "Solid understanding of hybrid Waterfall/Agile lifecycles",
      "Strong verbal and written English communication skills"
    ],
    "daysAgo": 1,
    "description": "Leading Turbo Energy Limited project team on key operational, software-enabled or organizational growth milestones. Coordinate stakeholder alignment, monitor critical path schedules, and resolve execution blockers.",
    "link": "https://www.linkedin.com/jobs/search/?keywords=Project%20Manager%20Turbo%20Energy%20Limited"
  },
  {
    "id": 11,
    "title": "Kerendia Task Force",
    "company": "Bayer",
    "board": "Indeed",
    "exp": "Mid",
    "salary": "$95,000 - $120,000/yr",
    "requirements": [
      "Active PMP certification or equivalent path",
      "3-5 years managing software or business operations projects",
      "Solid understanding of hybrid Waterfall/Agile lifecycles",
      "Strong verbal and written English communication skills"
    ],
    "daysAgo": 11,
    "description": "At Bayer weâre visionaries, driven to solve the worldâs toughest challenges and striving for a world where ,Health for all, Hunger for noneâ is no longer a dream, but a real possibility. Weâre doing it with energy, curiosity and sheer dedi...",
    "link": "https://www.indeed.com/jobs?q=Kerendia%20Task%20Force%20Bayer"
  },
  {
    "id": 12,
    "title": "Project Manager",
    "company": "CoreNett Limited",
    "board": "Glassdoor",
    "exp": "Mid",
    "salary": "$95,000 - $120,000/yr",
    "requirements": [
      "Active PMP certification or equivalent path",
      "3-5 years managing software or business operations projects",
      "Solid understanding of hybrid Waterfall/Agile lifecycles",
      "Strong verbal and written English communication skills"
    ],
    "daysAgo": 1,
    "description": "Leading CoreNett Limited project team on key operational, software-enabled or organizational growth milestones. Coordinate stakeholder alignment, monitor critical path schedules, and resolve execution blockers.",
    "link": "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=Project%20Manager%20CoreNett%20Limited"
  },
  {
    "id": 13,
    "title": "hh2",
    "company": "Biztech",
    "board": "LinkedIn",
    "exp": "Mid",
    "salary": "$95,000 - $120,000/yr",
    "requirements": [
      "Active PMP certification or equivalent path",
      "3-5 years managing software or business operations projects",
      "Solid understanding of hybrid Waterfall/Agile lifecycles",
      "Strong verbal and written English communication skills"
    ],
    "daysAgo": 11,
    "description": "Civalgo is your all-in-one construction management solution, designed by industry experts to streamline project planning, resource allocation, and daily reporting. Simplify your operations, enhance team collaboration, and boost productivity with o...",
    "link": "https://www.linkedin.com/jobs/search/?keywords=hh2%20Biztech"
  },
  {
    "id": 14,
    "title": "Technical Project Manager",
    "company": "Virtual IP",
    "board": "Indeed",
    "exp": "Mid",
    "salary": "$95,000 - $120,000/yr",
    "requirements": [
      "Active PMP certification or equivalent path",
      "3-5 years managing software or business operations projects",
      "Solid understanding of hybrid Waterfall/Agile lifecycles",
      "Strong verbal and written English communication skills"
    ],
    "daysAgo": 4,
    "description": "Leading Virtual IP project team on key operational, software-enabled or organizational growth milestones. Coordinate stakeholder alignment, monitor critical path schedules, and resolve execution blockers.",
    "link": "https://www.indeed.com/jobs?q=Technical%20Project%20Manager%20Virtual%20IP"
  },
  {
    "id": 15,
    "title": "System Software Engineer",
    "company": "Hewlett Packard Enterprise",
    "board": "Glassdoor",
    "exp": "Mid",
    "salary": "$95,000 - $120,000/yr",
    "requirements": [
      "Active PMP certification or equivalent path",
      "3-5 years managing software or business operations projects",
      "Solid understanding of hybrid Waterfall/Agile lifecycles",
      "Strong verbal and written English communication skills"
    ],
    "daysAgo": 11,
    "description": "This role has been designed as âHybridâ with an expectation that you will work on average 2 days per week from an HPE office.Who We AreHewlett Packard Enterprise is the global edge-to-cloud company advancing the way people live and work. We he...",
    "link": "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=System%20Software%20Engineer%20Hewlett%20Packard%20Enterprise"
  },
  {
    "id": 16,
    "title": "Global Rewards Project Manager",
    "company": "Cervecería y Maltería Quilmes",
    "board": "LinkedIn",
    "exp": "Mid",
    "salary": "$95,000 - $120,000/yr",
    "requirements": [
      "Active PMP certification or equivalent path",
      "3-5 years managing software or business operations projects",
      "Solid understanding of hybrid Waterfall/Agile lifecycles",
      "Strong verbal and written English communication skills"
    ],
    "daysAgo": 5,
    "description": "Leading Cervecería y Maltería Quilmes project team on key operational, software-enabled or organizational growth milestones. Coordinate stakeholder alignment, monitor critical path schedules, and resolve execution blockers.",
    "link": "https://www.linkedin.com/jobs/search/?keywords=Global%20Rewards%20Project%20Manager%20Cervecer%C3%ADa%20y%20Malter%C3%ADa%20Quilmes"
  },
  {
    "id": 17,
    "title": "LABORER",
    "company": "Portales Fire Department",
    "board": "Indeed",
    "exp": "Mid",
    "salary": "$95,000 - $120,000/yr",
    "requirements": [
      "Active PMP certification or equivalent path",
      "3-5 years managing software or business operations projects",
      "Solid understanding of hybrid Waterfall/Agile lifecycles",
      "Strong verbal and written English communication skills"
    ],
    "daysAgo": 12,
    "description": "This cms8.revize.com page canât be foundNo webpage was found for the web address: https://cms8.revize.com/revize/portales/Job%20Posting%20%202025-09%20SW%20Laborer.pdfHTTP ERROR 404No webpage was found for the web address: https://cms8.revize.co...",
    "link": "https://www.indeed.com/jobs?q=LABORER%20Portales%20Fire%20Department"
  },
  {
    "id": 18,
    "title": "Junior Project Manager",
    "company": "VISION 2063 FOUNDATION",
    "board": "Glassdoor",
    "exp": "Entry",
    "salary": "$60,000 - $78,000/yr",
    "requirements": [
      "Certified Associate in Project Management (CAPM) preferred",
      "1-2 years experience in professional project tracking",
      "Excellent organization, notes capture, and scheduling skills",
      "Strong verbal and written English communication skills"
    ],
    "daysAgo": 3,
    "description": "Leading VISION 2063 FOUNDATION project team on key operational, software-enabled or organizational growth milestones. Coordinate stakeholder alignment, monitor critical path schedules, and resolve execution blockers.",
    "link": "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=Junior%20Project%20Manager%20VISION%202063%20FOUNDATION"
  },
  {
    "id": 19,
    "title": "Product manager",
    "company": "DUÄAST",
    "board": "LinkedIn",
    "exp": "Mid",
    "salary": "$95,000 - $120,000/yr",
    "requirements": [
      "Active PMP certification or equivalent path",
      "3-5 years managing software or business operations projects",
      "Solid understanding of hybrid Waterfall/Agile lifecycles",
      "Strong verbal and written English communication skills"
    ],
    "daysAgo": 12,
    "description": "Suitable Quality is determined by product users, clients or customers, not by society in general. For example, a low priced product may be viewed as having high quality because it is disposable where another may be viewed as having poor quality be...",
    "link": "https://www.linkedin.com/jobs/search/?keywords=Product%20manager%20DU%C3%84%C2%92AST"
  },
  {
    "id": 20,
    "title": "Technical Project Manager",
    "company": "Med Bill, L.L.C",
    "board": "Indeed",
    "exp": "Mid",
    "salary": "$95,000 - $120,000/yr",
    "requirements": [
      "Active PMP certification or equivalent path",
      "3-5 years managing software or business operations projects",
      "Solid understanding of hybrid Waterfall/Agile lifecycles",
      "Strong verbal and written English communication skills"
    ],
    "daysAgo": 4,
    "description": "Leading Med Bill, L.L.C project team on key operational, software-enabled or organizational growth milestones. Coordinate stakeholder alignment, monitor critical path schedules, and resolve execution blockers.",
    "link": "https://www.indeed.com/jobs?q=Technical%20Project%20Manager%20Med%20Bill%2C%20L.L.C"
  }
];

  // News Filtering State
// News Filtering State
// News Filtering State
  let newsActiveCategory = 'all';

  // Jobs Filtering State
  let jobsActiveBoard = 'all';
  let jobsActiveExp = 'all';

  // 📰 RENDER NEWS PAGE
  // Secure Link Authentication Protocol (SLAP)
  // Ensures links are safe (HTTPS), properly formed, and belong to trusted domains.
  function authenticateLink(url) {
    try {
      if (!url) return '#';
      
      const parsedUrl = new URL(url);
      
      // Enforce secure HTTPS protocol
      if (parsedUrl.protocol !== 'https:') {
        console.warn(`[Security Alert] Link rejected due to insecure protocol: ${url}`);
        return '#';
      }
      
      // Strict list of trusted domain authorities
      const trustedDomains = [
        'pmi.org',
        'projectmanagement.com',
        'scrumalliance.org',
        'hbr.org',
        'linkedin.com',
        'indeed.com',
        'glassdoor.com',
        'remoteok.com',
        'jobberman.com',
        'jobberman.com.gh',
        'brightermonday.co.ke'
      ];
      
      const hostname = parsedUrl.hostname.toLowerCase();
      
      // Check if domain is trusted
      const isTrusted = trustedDomains.some(domain => {
        return hostname === domain || hostname.endsWith('.' + domain);
      });
      
      if (!isTrusted) {
        console.warn(`[Security Alert] Link rejected - untrusted domain: ${hostname}`);
        return '#';
      }
      
      return parsedUrl.href;
    } catch (e) {
      console.error(`[Security Alert] Invalid link format: ${url}`);
      return '#';
    }
  }

  function renderPMNews() {
    const container = document.getElementById('newsGridContainer');
    const searchVal = document.getElementById('newsSearchInput').value.toLowerCase();
    
    // Filter database
    const filtered = pmNewsDatabase.filter(art => {
      const matchesCat = (newsActiveCategory === 'all' || art.category === newsActiveCategory);
      const matchesSearch = (
        art.title.toLowerCase().includes(searchVal) ||
        art.summary.toLowerCase().includes(searchVal) ||
        art.content.toLowerCase().includes(searchVal) ||
        art.source.toLowerCase().includes(searchVal)
      );
      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--text-secondary); background: var(--bg-card); border-radius: var(--radius-xl); border: 1px solid var(--border-subtle);">No articles found matching filters.</div>`;
      return;
    }

    container.innerHTML = filtered.map(art => {
      return `
        <div class="news-card">
          <div class="news-card-header">
            <span class="news-category-badge ${art.category.toLowerCase()}">${art.category}</span>
            <span class="news-card-date">${getDynamicDate(art.daysAgo)}</span>
          </div>
          <h3 class="news-card-title">${art.title}</h3>
          <p class="news-card-summary">${art.summary}</p>
          <div class="news-card-footer">
            <span>By <strong>${art.source}</strong></span>
            <div style="display:flex; gap:12px; align-items:center;">
              <span class="news-read-time">⏱️ ${art.readTime}</span>
              <a class="btn btn-secondary" href="${authenticateLink(art.link)}" target="_blank" rel="noopener noreferrer" style="padding:4px 10px; font-size:0.75rem; margin:0; border-radius:4px; height:auto; display:inline-block; text-decoration:none; line-height:1.2;">Read</a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // 💼 RENDER REMOTE JOBS PAGE
  function renderPMJobs() {
    const container = document.getElementById('jobsGridContainer');
    const searchVal = document.getElementById('jobsSearchInput').value.toLowerCase();

    // Filter database
    const filtered = pmJobsDatabase.filter(job => {
      const matchesBoard = (jobsActiveBoard === 'all' || job.board === jobsActiveBoard);
      const matchesExp = (jobsActiveExp === 'all' || job.exp === jobsActiveExp);
      const matchesSearch = (
        job.title.toLowerCase().includes(searchVal) ||
        job.company.toLowerCase().includes(searchVal) ||
        job.description.toLowerCase().includes(searchVal) ||
        job.requirements.some(req => req.toLowerCase().includes(searchVal))
      );
      return matchesBoard && matchesExp && matchesSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div style="padding: 40px; text-align: center; color: var(--text-secondary); background: var(--bg-card); border-radius: var(--radius-xl); border: 1px solid var(--border-subtle);">No job postings found matching filters.</div>`;
      return;
    }

    container.innerHTML = filtered.map(job => {
      const reqBullets = job.requirements.map(req => `<li>${req}</li>`).join('');
      return `
        <div class="job-card">
          <div class="job-card-header">
            <div>
              <h3 style="font-size: 1.12rem; font-weight: 700; color: var(--text-primary); margin:0;">${job.title}</h3>
              <div style="font-size: 0.88rem; color: var(--accent-primary); font-weight:600; margin-top:2px;">${job.company}</div>
            </div>
            <span class="job-source-tag ${job.board.toLowerCase()}">${job.board}</span>
          </div>
          <div class="job-meta-row">
            <span class="job-meta-item salary">💰 ${job.salary}</span>
            <span class="job-meta-item">📍 Remote (US/Global)</span>
            <span class="job-meta-item">⏳ ${job.exp}-level</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px;">${job.description}</p>
          <ul class="job-requirements-list">
            ${reqBullets}
          </ul>
          <div class="job-card-actions">
            <span class="job-post-date">Posted ${getDynamicDate(job.daysAgo)}</span>
            <a class="btn btn-primary" href="${authenticateLink(job.link)}" target="_blank" rel="noopener noreferrer" style="padding: 6px 14px; font-size: 0.8rem; margin:0; border-radius:6px; height:auto; display:inline-block; text-decoration:none; line-height:1.2;">Apply Now</a>
          </div>
        </div>
      `;
    }).join('');
  }

  // 📊 RENDER DASHBOARD PREVIEWS
  function renderDashboardPreviews() {
    const newsContainer = document.getElementById('dashNewsList');
    const jobsContainer = document.getElementById('dashJobsList');

    if (!newsContainer || !jobsContainer) return;

    // Get latest 3 news items
    const topNews = pmNewsDatabase.slice(0, 3);
    newsContainer.innerHTML = topNews.map(art => {
      return `
        <div class="dash-insight-item" data-id="${art.id}">
          <div class="dash-insight-title">${art.title}</div>
          <div class="dash-insight-meta">
            <span>${art.source}</span>
            <span>${getDynamicDate(art.daysAgo)}</span>
          </div>
        </div>
      `;
    }).join('');

    // Add click listeners to dashboard news items
    newsContainer.querySelectorAll('.dash-insight-item').forEach(item => {
      item.addEventListener('click', () => {
        const art = pmNewsDatabase.find(x => x.id === parseInt(item.dataset.id));
        if (art) window.open(authenticateLink(art.link), '_blank');
      });
    });

    // Get latest 3 jobs items
    const topJobs = pmJobsDatabase.slice(0, 3);
    jobsContainer.innerHTML = topJobs.map(job => {
      return `
        <div class="dash-insight-item" data-id="${job.id}">
          <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
            <div class="dash-insight-title" style="font-weight:700;">${job.title}</div>
            <span class="job-source-tag ${job.board.toLowerCase()}" style="font-size:0.6rem; padding: 1px 5px;">${job.board}</span>
          </div>
          <div style="font-size:0.75rem; color:var(--accent-primary); font-weight:600; margin-top:2px;">${job.company}</div>
          <div class="dash-insight-meta">
            <span>💰 ${job.salary}</span>
            <span>Posted ${getDynamicDate(job.daysAgo)}</span>
          </div>
        </div>
      `;
    }).join('');

    // Add click listeners to dashboard job items (goes directly to jobs board)
    jobsContainer.querySelectorAll('.dash-insight-item').forEach(item => {
      item.addEventListener('click', () => {
        navigateTo('jobs');
      });
    });
  }

  // 📰 ARTICLE MODAL POPUP
  const articleModal = document.getElementById('articleModal');
  const articleModalCloseBtn = document.getElementById('articleModalCloseBtn');
  
  function openArticleModal(id) {
    const art = pmNewsDatabase.find(x => x.id === parseInt(id));
    if (!art) return;

    document.getElementById('articleModalCategory').className = `news-category-badge ${art.category.toLowerCase()}`;
    document.getElementById('articleModalCategory').textContent = art.category;
    document.getElementById('articleModalTitle').textContent = art.title;
    document.getElementById('articleModalDate').textContent = getDynamicDate(art.daysAgo);
    document.getElementById('articleModalSource').textContent = art.source;
    document.getElementById('articleModalReadTime').textContent = art.readTime;
    
    // Split text content into paragraphs
    const pars = art.content.split('. ').map(p => `<p>${p}.</p>`).join('');
    document.getElementById('articleModalBody').innerHTML = pars;

    articleModal.classList.add('open');
  }

  articleModalCloseBtn.addEventListener('click', () => {
    articleModal.classList.remove('open');
  });

  // 💼 JOB APPLY MODAL POPUP
  const applyJobModal = document.getElementById('applyJobModal');
  const applyJobModalCloseBtn = document.getElementById('applyJobModalCloseBtn');
  const applyJobForm = document.getElementById('applyJobForm');

  function openApplyJobModal(id, title) {
    document.getElementById('applyJobId').value = id;
    document.getElementById('applyJobTitle').textContent = title;
    
    // Clear inputs
    document.getElementById('applyName').value = '';
    document.getElementById('applyEmail').value = '';
    document.getElementById('applyCover').value = '';

    applyJobModal.classList.add('open');
  }

  applyJobModalCloseBtn.addEventListener('click', () => {
    applyJobModal.classList.remove('open');
  });

  applyJobForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('applyName').value;
    alert(`Thank you, ${name}! Your (simulated) application has been successfully submitted to the recruitment pipeline. 🚀`);
    applyJobModal.classList.remove('open');
  });

  // CLOSE MODALS ON BACKDROP CLICK
  window.addEventListener('click', (e) => {
    if (e.target === articleModal) {
      articleModal.classList.remove('open');
    }
    if (e.target === applyJobModal) {
      applyJobModal.classList.remove('open');
    }
  });

  // 🔍 ATTACH SEARCH & FILTER LISTENERS
  
  // News Search
  document.getElementById('newsSearchInput').addEventListener('input', renderPMNews);
  
  // News category tabs
  document.querySelectorAll('.news-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.news-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      newsActiveCategory = btn.dataset.category;
      renderPMNews();
    });
  });

  // Jobs Search
  document.getElementById('jobsSearchInput').addEventListener('input', renderPMJobs);

  // Job boards tabs
  document.querySelectorAll('.job-board-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.job-board-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      jobsActiveBoard = btn.dataset.board;
      renderPMJobs();
    });
  });

  // Job experience tabs
  document.querySelectorAll('.job-exp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.job-exp-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      jobsActiveExp = btn.dataset.exp;
      renderPMJobs();
    });
  });

  // Wire dashboard 'View All' links
  document.querySelectorAll('.nav-link-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateTo(btn.dataset.section);
    });
  });

  // Render initial dashboard widget previews
  renderDashboardPreviews();

  // Initialize quiz
  showQuizSetup();

  // Render quiz history on load (so returning students see their results immediately)
  renderQuizHistory();

  // ══════════════════════════════════════════════════════════════════════════════
  //  CHAPTER SUMMARIES
  // ══════════════════════════════════════════════════════════════════════════════
  const chapterSummaries = {

    // ── PMBOK 6 ──────────────────────────────────────────────────────────────
    pmbok6: [
      {
        title: 'Project Integration Management',
        icon: '🔗',
        processes: '7 processes across all 5 Process Groups',
        summary: `Integration Management is the glue of the entire project. The Project Manager is responsible for integrating all other Knowledge Areas into a coherent plan and directing its execution. This KA includes developing the Charter (how the project is authorised), creating the Project Management Plan (the master blueprint), directing and managing the actual work, monitoring overall progress, and formally closing the project. In the PMP exam, Integration is the most tested KA because every decision ultimately comes back here.`,
        bullets: [
          'Process 4.1 Develop Charter → 4.2 Develop PMP → 4.3 Direct & Manage → 4.4 Manage Knowledge → 4.5 Monitor & Control → 4.6 Perform Integrated Change Control → 4.7 Close Project/Phase',
          'The PM is the ONLY person who can approve changes to the PMP; the CCB approves baseline changes',
          'Lessons Learned (process 4.4) are captured throughout, not only at close',
          'Change requests flow through Integrated Change Control (4.6) — never bypass the CCB',
          'The Project Charter grants the PM authority; it is signed by the Sponsor, not the PM',
          'Every other KA feeds into Integration — if stuck, default to an integration answer'
        ],
        tip: 'If a question says "what should the PM do FIRST?" the integration answer is almost always: assess impact, update the plan, submit a change request.'
      },
      {
        title: 'Project Scope Management',
        icon: '📐',
        processes: '6 processes',
        summary: `Scope Management is about defining exactly what is — and is not — included in the project. The PM works with stakeholders to collect requirements, create a Scope Statement, build a WBS, and then guard those boundaries throughout execution. The biggest exam traps here are scope creep (adding work without proper change control) and gold-plating (adding features beyond what was agreed). Validate Scope is a customer-facing process; Control Quality is an internal one.`,
        bullets: [
          'Plan → Collect Requirements → Define Scope → Create WBS → Validate Scope → Control Scope',
          'WBS decomposes deliverables into Work Packages — the lowest level you can estimate',
          'Scope baseline = Scope Statement + WBS + WBS Dictionary',
          'Validate Scope = stakeholder sign-off on deliverables (customer-facing)',
          'Control Quality = internal checks that deliverables meet specifications (done before Validate Scope)',
          'Scope creep = unauthorised scope growth; must go through change control',
          'Gold-plating = adding extras beyond approved scope — always wrong on PMP exam'
        ],
        tip: 'Validate Scope happens AFTER Control Quality but BEFORE the customer officially accepts. Remember: QC first, then customer sign-off.'
      },
      {
        title: 'Project Schedule Management',
        icon: '🗓️',
        processes: '6 processes',
        summary: `Schedule Management involves building a realistic timeline, identifying the critical path, and managing variances to keep the project on track. Key techniques include the Critical Path Method (CPM), Monte Carlo simulation for uncertainty, and Earned Value Analysis (SPI) for measuring schedule performance. When behind schedule, options include crashing (adding resources) and fast-tracking (doing tasks in parallel), each with different risk/cost trade-offs.`,
        bullets: [
          'Critical Path = longest sequence of dependent activities with zero float; determines project duration',
          'Float (Slack) = how long an activity can delay without delaying the project end date',
          'Crashing = adding resources to critical path activities to shorten duration; increases cost',
          'Fast-tracking = doing activities in parallel that were originally sequential; increases risk',
          'SPI = EV / PV: SPI > 1.0 = ahead of schedule; SPI < 1.0 = behind schedule',
          'Schedule Baseline is approved in planning and changed only via formal change control',
          'Lag = a waiting period between activities; Lead = an overlap (negative lag)'
        ],
        tip: 'If asked about schedule compression, prefer fast-tracking when cost is a constraint, crashing when time is critical. Never compress non-critical path activities — it wastes resources.'
      },
      {
        title: 'Project Cost Management',
        icon: '💰',
        processes: '4 processes',
        summary: `Cost Management covers estimating budgets, securing funding, and tracking expenditures through Earned Value Management (EVM). EVM is the most heavily tested framework in the entire PMP exam. The budget baseline (BAC) is set in planning; actual performance is measured through CPI (cost efficiency) and SPI (schedule efficiency). The four EAC formulas are essential memory items.`,
        bullets: [
          'EV = BAC × % complete | CV = EV − AC | SV = EV − PV',
          'CPI = EV / AC (>1 = under budget) | SPI = EV / PV (>1 = ahead)',
          'EAC = BAC / CPI (if current variance continues) — most common exam formula',
          'EAC = AC + (BAC − EV) assumes remaining work at budget',
          'EAC = AC + ETC (when original estimate is fundamentally flawed)',
          'TCPI = (BAC − EV) / (BAC − AC): efficiency needed to finish within budget',
          'Cost Baseline is an S-curve; Management Reserve is NOT in the baseline'
        ],
        tip: 'Management Reserve covers unknown unknowns — it is NOT part of the cost baseline and requires executive approval to access. Contingency Reserve (known unknowns) IS part of the baseline.'
      },
      {
        title: 'Project Quality Management',
        icon: '✅',
        processes: '3 processes',
        summary: `Quality Management ensures deliverables meet requirements and stakeholder expectations. PMBOK emphasises prevention over inspection — catching defects early is far cheaper. Quality is planned in, not inspected in. Key tools include Control Charts (to detect process variance), Pareto Charts (80/20 rule for defect causes), and Fishbone Diagrams (root cause analysis). Cost of Quality (COQ) categorises all quality-related spending.`,
        bullets: [
          'Plan Quality → Manage Quality (audit processes) → Control Quality (inspect outputs)',
          'Quality is defined by the customer — meeting requirements, not exceeding them',
          'Cost of Conformance = prevention + appraisal costs (doing it right)',
          'Cost of Non-Conformance = failure costs: internal (rework) + external (warranty, recalls)',
          'Control Chart: Upper/Lower Control Limits define acceptable variance (±3σ)',
          'Rule of Seven: 7 consecutive data points on one side of the mean = investigate',
          'Pareto: 80% of defects come from 20% of causes — focus resources there first'
        ],
        tip: 'Manage Quality is about auditing PROCESSES (are we following our quality plan?). Control Quality is about inspecting RESULTS (does this deliverable pass?). The exam loves asking which is which.'
      },
      {
        title: 'Project Resource Management',
        icon: '👥',
        processes: '6 processes',
        summary: `Resource Management covers both the human team and physical resources (equipment, materials). The PM must build the team, develop their capabilities, manage conflicts, and motivate performance. Tuckman's model describes how teams form, storm, norm, perform, and adjourn. Motivation theories (Maslow, Herzberg, McGregor) frequently appear in exam questions. The PM uses Responsibility Assignment Matrices (RAM/RACI) to clarify accountability.`,
        bullets: [
          'RACI Matrix: Responsible, Accountable, Consulted, Informed — one A per task',
          "Tuckman's stages: Forming → Storming → Norming → Performing → Adjourning",
          'Conflict resolution: Collaborate/Problem-Solve > Compromise > Smooth > Force > Avoid',
          'Herzberg: Hygiene factors (salary, safety) prevent dissatisfaction; Motivators (achievement) create satisfaction',
          'McGregor Theory X (people dislike work) vs Theory Y (people want responsibility)',
          'Acquire Resources is done in Executing; the PM does not always control resource assignments in matrix orgs',
          'Co-location / "War room" = placing team members together to improve communication'
        ],
        tip: 'On PMP questions, PMI strongly prefers the Collaborate resolution style. Avoid/Withdraw is almost always the wrong answer.'
      },
      {
        title: 'Project Communications Management',
        icon: '📡',
        processes: '3 processes',
        summary: `Communications Management ensures the right information reaches the right people at the right time in the right format. Statistics show that PMs spend up to 90% of their time communicating. The Communications Management Plan documents who gets what, when, and how. With n stakeholders, the number of communication channels = n(n-1)/2.`,
        bullets: [
          'Formula: Communication channels = n(n-1)/2 (where n = number of stakeholders)',
          'Push = sending information to recipients (email, reports)',
          'Pull = recipients access information on demand (repositories, intranets)',
          'Interactive = real-time two-way (meetings, calls) — most effective for complex issues',
          'Communications Management Plan defines format, frequency, sender, and escalation path',
          'Noise = anything that distorts a message between sender and receiver',
          'Formal written = contract changes, scope changes; Formal verbal = presentations'
        ],
        tip: 'Adding stakeholders mid-project dramatically increases communication complexity. If you go from 5 to 6 stakeholders, channels increase from 10 to 15 — a 50% jump. The exam tests this formula.'
      },
      {
        title: 'Project Risk Management',
        icon: '⚠️',
        processes: '7 processes',
        summary: `Risk Management is proactive by nature — you plan for uncertainty before it happens. Risks are uncertain events that can be positive (opportunities) or negative (threats). The Risk Register is the central artefact. Every identified risk is assessed for probability × impact, and then a response strategy is chosen. The exam heavily tests the difference between risk responses for threats vs. opportunities.`,
        bullets: [
          'Threat responses: Avoid, Transfer, Mitigate, Accept (Active or Passive)',
          'Opportunity responses: Exploit, Share, Enhance, Accept',
          'Risk = Probability × Impact — high P×I risks get priority treatment',
          'Residual risk = risk remaining after response; Secondary risk = new risk created by a response',
          'Contingency Reserve covers identified risks (known unknowns)',
          'Management Reserve covers unidentified risks (unknown unknowns)',
          'Qualitative Risk Analysis = subjective (High/Med/Low). Quantitative = numerical (EMV, Monte Carlo)'
        ],
        tip: 'Transfer does NOT eliminate the risk — it shifts the financial consequence to a third party (e.g., insurance). The risk event can still happen. Avoid eliminates the risk entirely.'
      },
      {
        title: 'Project Procurement Management',
        icon: '🤝',
        processes: '3 processes (PMBOK 6)',
        summary: `Procurement Management covers everything related to buying goods or services from external vendors. The PM must plan what to procure, select sellers, and manage contract performance. Contract types determine who bears cost risk: Fixed Price favours the buyer (seller bears overruns), while Cost Reimbursable favours the seller (buyer pays actual costs). Time and Material contracts are hybrid.`,
        bullets: [
          'FFP (Firm Fixed Price): seller bears all cost risk — most common for defined scope',
          'FPIF (Fixed Price Incentive Fee): seller shares savings with buyer up to ceiling price',
          'CPFF (Cost Plus Fixed Fee): buyer pays all costs + fixed fee to seller',
          'CPIF (Cost Plus Incentive Fee): buyer pays costs + fee that varies with performance',
          'T&M (Time & Material): hybrid — used for small, undefined, or evolving scope',
          'Procurement Statement of Work (SOW) defines scope of work for the seller',
          'Privity of contract: PM has no direct legal relationship with sub-contractors'
        ],
        tip: 'Fixed Price contracts motivate sellers to finish on time and on budget because they keep any savings. If scope is poorly defined, prefer Cost Reimbursable to avoid disputes.'
      },
      {
        title: 'Project Stakeholder Management',
        icon: '🌐',
        processes: '4 processes',
        summary: `Stakeholder Management involves identifying everyone impacted by the project, understanding their interests and influence, and engaging them appropriately throughout the lifecycle. Engagement must be tailored — a resistant executive needs a different approach than a supportive end user. The Stakeholder Engagement Assessment Matrix tracks current vs. desired engagement levels.`,
        bullets: [
          'Identify Stakeholders is done early in Initiating AND should be repeated throughout the project',
          'Stakeholder Engagement levels: Unaware → Resistant → Neutral → Supportive → Leading',
          'Power/Interest Grid: High power + High interest = Manage Closely',
          'Salience Model: Power, Legitimacy, Urgency — stakeholders with all three are "definitive"',
          'Engagement plan is part of the overall PMP — it is confidential (not shared with stakeholders)',
          'Resistant stakeholders need face-to-face communication and involvement in decision-making',
          'Monitor Stakeholder Engagement: track current vs. desired engagement and adjust strategies'
        ],
        tip: 'Identify Stakeholders is one of the FIRST processes in a project (Initiating). Missing key stakeholders early is a major source of scope changes and conflicts later — PMI is adamant about this.'
      }
    ],

    // ── PMBOK 7 ──────────────────────────────────────────────────────────────
    pmbok7: [
      {
        title: 'The 12 PMBOK 7 Principles',
        icon: '🧭',
        processes: 'Foundation for all project delivery',
        summary: `PMBOK 7 shifted from process-based to principle-based guidance. Instead of prescribing 49 processes, it defines 12 principles that should guide every project manager's decisions, regardless of methodology. These principles are not rules — they are professional values and behaviours that underpin effective project management in both predictive and agile environments.`,
        bullets: [
          '1. Be a Diligent, Respectful, and Caring Steward',
          '2. Create a Collaborative Project Team Environment',
          '3. Effectively Engage with Stakeholders',
          '4. Focus on Value (not just deliverables)',
          '5. Recognise, Evaluate, and Respond to System Interactions',
          '6. Demonstrate Leadership Behaviours',
          '7. Tailor Based on Context',
          '8. Build Quality into Processes and Deliverables',
          '9. Navigate Complexity',
          '10. Optimise Risk Responses',
          '11. Embrace Adaptability and Resiliency',
          '12. Enable Change to Achieve the Envisioned Future State'
        ],
        tip: 'Exam questions on Principle 4 (Focus on Value) often contrast value delivery with simply completing deliverables on schedule. If the project is delivering outputs but no one will use them, the PM should escalate — not just finish.'
      },
      {
        title: 'The 8 PMBOK 7 Performance Domains',
        icon: '🎯',
        processes: 'Replaces the 10 Knowledge Areas',
        summary: `Performance Domains describe critical areas of focus that must work together for successful project delivery. Unlike PMBOK 6's sequential Knowledge Areas, domains are holistic — they operate simultaneously and continuously throughout the project. The domains cover stakeholder engagement, team dynamics, value delivery, planning, project work, measurement, uncertainty, and the broader delivery environment.`,
        bullets: [
          'Stakeholder Domain: identification, analysis, and engagement planning throughout the lifecycle',
          'Team Domain: servant leadership, collaboration, and building high-performing teams',
          'Development Approach & Lifecycle Domain: choosing predictive, adaptive, or hybrid',
          'Planning Domain: estimating, scheduling, and keeping plans useful and current',
          'Project Work Domain: execution, procurement, and communication management',
          'Delivery Domain: delivering value incrementally and validating with stakeholders',
          'Measurement Domain: defining meaningful metrics, tracking performance, responding to data',
          'Uncertainty Domain: risk, ambiguity, complexity — being adaptive when reality diverges from plan'
        ],
        tip: 'The PMP exam (ECO 2021) is built around these 8 domains and 3 domains (People, Process, Business Environment). PMBOK 7 domains are the "why", while the ECO defines the exam\'s "what".'
      }
    ],

    // ── AGILE ─────────────────────────────────────────────────────────────────
    agile: [
      {
        title: 'Scrum Framework',
        icon: '🏃',
        processes: 'Core agile framework',
        summary: `Scrum is the most popular agile framework and the one most heavily tested on the PMP exam. It operates in fixed-length iterations called Sprints (1–4 weeks). The Scrum Team has three roles: Product Owner (what to build), Scrum Master (servant leader, removes blockers), and Developers (build the product). Four ceremonies structure each sprint. The Product Backlog is the single prioritised source of work.`,
        bullets: [
          'Sprint: time-boxed iteration (1–4 weeks); no scope changes allowed mid-sprint',
          'Product Owner: owns the backlog, prioritises by value, defines "done"',
          'Scrum Master: servant leader; coaches team, facilitates ceremonies, removes impediments',
          'Developers: self-organising; determine how to complete backlog items',
          'Sprint Planning → Daily Scrum (15 min) → Sprint Review → Sprint Retrospective',
          'Sprint Review: demo to stakeholders, inspect increment, update backlog',
          'Sprint Retrospective: reflect on HOW the team worked (process improvement)',
          'Velocity: how many story points the team completes per sprint (used for forecasting)'
        ],
        tip: 'On PMP questions, if an agile team has a problem, the Scrum Master NEVER assigns work or makes decisions for the team. The SM facilitates and removes obstacles — the team self-organises.'
      },
      {
        title: 'Kanban Essentials',
        icon: '📋',
        processes: 'Flow-based agile method',
        summary: `Kanban is a visual, flow-based approach that uses a board with columns to represent different stages of work. Unlike Scrum, Kanban has no fixed iterations or roles — work flows continuously as capacity allows. The defining feature is Work In Progress (WIP) limits: limiting how many items are in each stage prevents bottlenecks and overloading team members. Cycle Time is the key metric.`,
        bullets: [
          'Kanban Board: columns represent workflow stages (To Do → In Progress → Done)',
          'WIP Limits: cap the number of items in each column to prevent overload',
          'Pull System: team members pull work when they have capacity (not pushed by managers)',
          'Cycle Time: time from work start to completion — lower is better',
          'Lead Time: time from request creation to delivery (includes wait time)',
          'No prescribed roles, sprints, or ceremonies — continuous flow',
          'Cumulative Flow Diagram (CFD): visual tool to spot bottlenecks in the system'
        ],
        tip: 'Kanban is ideal for support/maintenance work with unpredictable arrival rates. Scrum is better for product development with defined goals. Hybrid: use Kanban board with Scrum ceremonies.'
      },
      {
        title: 'Hybrid & SAFe Basics',
        icon: '⚡',
        processes: 'Enterprise-scale agile',
        summary: `Hybrid approaches combine elements of predictive and adaptive delivery. Milestones and governance may follow a predictive structure, while execution uses agile sprints. The Scaled Agile Framework (SAFe) is the most common enterprise agile framework. It organises agile teams into Agile Release Trains (ARTs) and coordinates their work through Programme Increment (PI) Planning — a two-day planning event that aligns all teams on objectives for the next 8–12 weeks.`,
        bullets: [
          'Hybrid: governance/milestones from predictive + execution from agile sprints',
          'SAFe ART (Agile Release Train): 5–12 teams (50–125 people) aligned to a common mission',
          'PI Planning: all ART teams plan together every 8–12 weeks — a core SAFe ceremony',
          'Release Train Engineer (RTE): servant leader for the ART (like a Scrum Master for SAFe)',
          'System Demo: every iteration, teams demonstrate integrated progress',
          'Inspect & Adapt (I&A): quarterly retrospective + problem-solving workshop',
          'Innovation & Planning (IP) Iteration: buffer sprint for learning, exploration, PI prep'
        ],
        tip: 'The PMP exam does not require deep SAFe knowledge, but tests awareness of when to use hybrid. Key: use adaptive for high uncertainty/fast-changing requirements; predictive for stable, well-defined scope.'
      },
      {
        title: 'Agile Manifesto & 12 Principles',
        icon: '📜',
        processes: 'Foundation of all agile methods',
        summary: `The Agile Manifesto (2001) states four core values: Individuals over processes, Working software over comprehensive documentation, Customer collaboration over contract negotiation, and Responding to change over following a plan. The 12 principles elaborate on these values and define the agile mindset. Every agile framework — Scrum, Kanban, XP, SAFe — is built on these foundations.`,
        bullets: [
          'Value 1: Individuals and interactions > processes and tools',
          'Value 2: Working software (product) > comprehensive documentation',
          'Value 3: Customer collaboration > contract negotiation',
          'Value 4: Responding to change > following a plan',
          'Principle: Deliver working software frequently — in weeks, not months',
          'Principle: Business people and developers work together daily',
          'Principle: Self-organising teams produce the best designs and architectures',
          'Principle: The most efficient conveyance is face-to-face conversation'
        ],
        tip: 'The exam will sometimes present a choice between "following the documented process" and "talking to the customer directly". In agile context, the customer collaboration answer almost always wins.'
      }
    ],

    // ── FORMULAS ──────────────────────────────────────────────────────────────
    formulas: [
      {
        title: 'EVM Formula Sheet',
        icon: '📐',
        processes: 'Earned Value Management — PMBOK 6 Process 7.4',
        summary: `Earned Value Management (EVM) is a quantitative project performance measurement system. It integrates scope, schedule, and cost to give a real-time picture of project health. The PMP exam typically presents 3–8 EVM calculation questions. The most important formulas to memorise are CV, SV, CPI, SPI, and the four EAC variants. Always start by identifying PV, EV, and AC from the question.`,
        bullets: [
          'PV = Planned Value (what work should have been done by now × its budget)',
          'EV = Earned Value (% complete × BAC = value of work actually done)',
          'AC = Actual Cost (what you actually spent)',
          'CV = EV − AC (negative = over budget) | CPI = EV ÷ AC (>1 = under budget)',
          'SV = EV − PV (negative = behind) | SPI = EV ÷ PV (>1 = ahead)',
          'EAC = BAC ÷ CPI — if current cost efficiency continues to project end',
          'EAC = AC + (BAC − EV) — if remaining work at original budget rate',
          'EAC = AC + [(BAC − EV) ÷ CPI] — if remaining work at current efficiency',
          'TCPI = (BAC − EV) ÷ (BAC − AC) — efficiency needed to finish within budget',
          'VAC = BAC − EAC (positive = expected surplus, negative = expected overrun)'
        ],
        tip: 'Mnemonic: "Every Video Camera Shoots Portraits" → EV, CV (EV−AC), CPI (EV/AC), SV (EV−PV), and EAC (BAC/CPI) are the core five. Start every EVM question by listing PV, EV, AC, BAC.'
      },
      {
        title: 'Critical Path & Float',
        icon: '🔗',
        processes: 'PMBOK 6 Process 6.5 — Develop Schedule',
        summary: `The Critical Path Method (CPM) identifies the longest sequence of dependent activities from project start to finish. This path has zero float — any delay directly delays project end. Float (Slack) is the flexibility an activity has to slip before it impacts the critical path or a key milestone. Understanding forward pass, backward pass, and free float calculations is essential for the exam.`,
        bullets: [
          'Critical Path = longest duration path from start to finish; has ZERO total float',
          'Total Float = LS − ES or LF − EF (how long activity can slip without delaying project)',
          'Free Float = ES(next) − EF(current) (how long it can slip without delaying the next activity)',
          'Forward Pass: start at Day 0, add durations left-to-right to get ES and EF',
          'Backward Pass: start at project end, subtract durations right-to-left to get LS and LF',
          'Near-critical path: a path with very little float that could become critical if risks materialise',
          'Schedule Compression: Crash (cost ↑) or Fast-track (risk ↑); both only on critical path'
        ],
        tip: 'Mnemonic for Float: "Late minus Early = Slack". If LF − EF = 0, it\'s on the critical path. Always compress the critical path only — compressing non-critical activities wastes money with no time benefit.'
      },
      {
        title: 'Risk & Procurement Formulas',
        icon: '🎲',
        processes: 'Risk: PMBOK 11 | Procurement: PMBOK 12',
        summary: `Risk formulas focus on Expected Monetary Value (EMV) for quantitative risk analysis, and Point of Total Assumption (PTA) for procurement contracts. EMV calculates the average outcome when considering the probability of different scenarios. PTA defines the cost point above which a FPIF contractor absorbs all additional costs — a critical concept for cost-type contract questions.`,
        bullets: [
          'EMV = Probability × Impact (sum all scenarios for Decision Tree analysis)',
          'Decision Tree: calculate EMV for each branch, choose the path with best outcome',
          'PTA (Point of Total Assumption) = [(Ceiling Price − Target Price) ÷ Buyer Share] + Target Cost',
          'PTA marks where seller\'s profit = 0; seller absorbs all costs above PTA in FPIF contracts',
          'Sigma levels: ±1σ = 68.27%, ±2σ = 95.45%, ±3σ = 99.73%, ±6σ = 99.9997%',
          'PERT (3-point estimate): (O + 4M + P) ÷ 6 | SD = (P − O) ÷ 6',
          'Triangular estimate: (O + M + P) ÷ 3 (no weight given to Most Likely)'
        ],
        tip: 'For EMV questions, a negative EMV = a threat (loss), a positive EMV = an opportunity (gain). In a Decision Tree, always pick the branch with the HIGHEST (least negative, most positive) EMV.'
      },
      {
        title: 'Communication & Stakeholder Formulas',
        icon: '📡',
        processes: 'Communications: PMBOK 10 | Stakeholders: PMBOK 13',
        summary: `A small set of communication and organisational formulas frequently appear on the exam. The most tested is the communication channels formula, which demonstrates why adding stakeholders exponentially increases complexity. Understanding organisational structures (Functional, Projectized, Matrix) and their impact on PM authority is also critical.`,
        bullets: [
          'Communication Channels = n(n−1) ÷ 2 where n = number of people',
          'Example: 5 people → 10 channels; 10 people → 45 channels; 20 people → 190 channels',
          'Functional Org: PM has little authority; functional managers control resources',
          'Projectized Org: PM has full authority; team dedicated full-time to project',
          'Strong Matrix: PM has more authority than FM; Weak Matrix: FM has more authority',
          'Balanced Matrix: PM and FM share authority equally — most conflict-prone structure',
          'Co-location ("war room") increases communication bandwidth and team cohesion'
        ],
        tip: 'Exam trick: if a question describes a PM who "requests" or "negotiates" for resources and "reports to" a functional manager — that\'s a Weak or Balanced Matrix org. Recognise the authority signals.'
      }
    ]
  };

  // ── Renderer ─────────────────────────────────────────────────────────────────
  let activeSummaryTab = 'pmbok6';

  function renderSummaries(tab) {
    activeSummaryTab = tab;
    const container = document.getElementById('summaryCardsContainer');
    if (!container) return;
    const chapters = chapterSummaries[tab] || [];
    container.innerHTML = '';

    chapters.forEach((ch, idx) => {
      const card = document.createElement('div');
      card.className = 'mindset-rule-card';
      card.style.marginBottom = '12px';
      card.innerHTML = `
        <div class="rule-header" style="cursor:pointer;">
          <div class="rule-header-left">
            <span class="rule-num">${ch.icon}</span>
            <span class="rule-title">${ch.title}</span>
            <span style="font-size:0.72rem;color:var(--text-muted);margin-left:10px;">${ch.processes}</span>
          </div>
          <span class="rule-arrow">►</span>
        </div>
        <div class="rule-body">
          <p style="color:var(--text-secondary);line-height:1.75;margin-bottom:16px;">${ch.summary}</p>

          <div style="margin-bottom:16px;">
            <h4 style="font-size:0.82rem;font-weight:700;color:var(--accent-primary);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">🔑 Key Points</h4>
            <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:6px;">
              ${ch.bullets.map(b => `
                <li style="display:flex;gap:8px;align-items:flex-start;font-size:0.85rem;color:var(--text-secondary);line-height:1.5;">
                  <span style="color:var(--accent-primary);flex-shrink:0;margin-top:2px;">▸</span>
                  <span>${b}</span>
                </li>`).join('')}
            </ul>
          </div>

          <div style="background:rgba(6,214,160,0.08);border:1px solid rgba(6,214,160,0.25);border-left:4px solid var(--accent-primary);border-radius:8px;padding:12px 14px;">
            <span style="font-size:0.75rem;font-weight:700;color:var(--accent-primary);text-transform:uppercase;letter-spacing:0.06em;display:block;margin-bottom:4px;">💡 Exam Tip</span>
            <p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.6;margin:0;">${ch.tip}</p>
          </div>
        </div>`;

      const header = card.querySelector('.rule-header');
      header.addEventListener('click', () => card.classList.toggle('expanded'));
      container.appendChild(card);
    });
  }

  // Wire up tab buttons
  const tabBar = document.getElementById('summaryTabBar');
  if (tabBar) {
    tabBar.querySelectorAll('.summary-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        tabBar.querySelectorAll('.summary-tab-btn').forEach(b => {
          b.className = 'btn btn-secondary summary-tab-btn';
        });
        btn.className = 'btn btn-primary summary-tab-btn';
        renderSummaries(btn.dataset.tab);
      });
    });
    // Render default tab on load
    renderSummaries('pmbok6');
  }

};
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
