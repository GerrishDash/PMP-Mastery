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

  // IndexedDB Setup for PDF storage
  let db = null;
  const dbRequest = indexedDB.open('pmp_reader_db', 1);
  dbRequest.onupgradeneeded = (e) => {
    const database = e.target.result;
    if (!database.objectStoreNames.contains('books')) {
      database.createObjectStore('books', { keyPath: 'id' });
    }
  };
  dbRequest.onsuccess = (e) => {
    db = e.target.result;
    updateBookshelfUI();
  };
  dbRequest.onerror = (e) => {
    console.error('IndexedDB open error:', e);
  };

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
        reject(err);
      }
    });
  }

  function dbSaveBook(bookId, fileBlob) {
    return new Promise((resolve, reject) => {
      if (!db) return reject(new Error('Database not initialized'));
      try {
        const transaction = db.transaction(['books'], 'readwrite');
        const store = transaction.objectStore('books');
        const request = store.put({ id: bookId, file: fileBlob, updated: Date.now() });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (err) {
        reject(err);
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
    if (!kindleHUDHeader || !kindleHUDFooter) return;
    if (visible) {
      kindleHUDHeader.classList.add('visible');
      kindleHUDFooter.classList.add('visible');
    } else {
      kindleHUDHeader.classList.remove('visible');
      kindleHUDFooter.classList.remove('visible');
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
  const allFlashcards = [
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
  //  DATA: 20 PMP MOCK EXAM QUESTIONS
  // ══════════════════════════════════════════════
  const quizQuestions = [
    {
      scenario: 'A project manager is leading a software development project using an agile approach. During a sprint review, a key stakeholder expresses frustration that a critical feature was not included in the latest increment. The feature was in the product backlog but was not prioritized for this sprint.',
      question: 'What should the project manager do FIRST?',
      options: [
        'Add the feature to the current sprint immediately',
        'Ask the Product Owner to work with the stakeholder to prioritize the feature for the next sprint',
        'Escalate the issue to the project sponsor',
        'Extend the current sprint to include the feature'
      ],
      correct: 1,
      explanation: 'In Scrum, the Product Owner is responsible for managing and prioritizing the product backlog. The PM should facilitate a conversation between the stakeholder and the Product Owner to ensure the feature is properly prioritized for an upcoming sprint. Adding work to a current sprint violates sprint boundaries, and extending a sprint undermines the timebox concept. Escalation is premature — this is a normal backlog prioritization activity.'
    },
    {
      scenario: 'You are managing a construction project using a predictive approach. The project is 60% complete. The EVM metrics show: PV = $600,000, EV = $540,000, AC = $620,000, BAC = $1,000,000.',
      question: 'What is the project status and what is the EAC?',
      options: [
        'Over budget and behind schedule; EAC = $1,148,148',
        'Under budget and ahead of schedule; EAC = $870,968',
        'Over budget and ahead of schedule; EAC = $1,148,148',
        'Over budget and behind schedule; EAC = $1,080,000'
      ],
      correct: 0,
      explanation: 'CV = EV − AC = $540K − $620K = −$80K (OVER BUDGET). SV = EV − PV = $540K − $600K = −$60K (BEHIND SCHEDULE). CPI = EV/AC = 540/620 = 0.871. EAC = BAC/CPI = $1,000,000 / 0.871 = $1,148,148. The project is both over budget AND behind schedule. The CPI < 1 and SPI < 1 confirm poor performance on both dimensions.'
    },
    {
      scenario: 'A project team is working on an innovative product. Requirements are unclear, technology is new, and stakeholders have varying expectations. The project sponsor asks the PM to recommend a development approach.',
      question: 'Which development approach should the project manager recommend?',
      options: [
        'Predictive (Waterfall) with detailed upfront planning',
        'Agile/Adaptive with iterative sprints and frequent feedback',
        'A phased approach with gate reviews between each phase',
        'Focus only on creating a detailed WBS before starting any work'
      ],
      correct: 1,
      explanation: 'When requirements are unclear and technology is new, an Agile/Adaptive approach is most appropriate. Agile embraces uncertainty through iterative development, frequent stakeholder feedback, and the ability to adapt as understanding grows. Predictive approaches require well-understood requirements upfront. This aligns with PMBOK 7 Principle #7 (Tailor Based on Context) and the Development Approach & Life Cycle performance domain.'
    },
    {
      scenario: 'During a project status meeting, a team member privately tells the project manager that another team member has been submitting falsified time reports. The PM has not independently verified this claim.',
      question: 'What should the project manager do FIRST?',
      options: [
        'Immediately terminate the accused team member',
        'Ignore the claim since it is unverified',
        'Investigate the claim by reviewing the time reports and relevant data',
        'Report the claim to upper management right away'
      ],
      correct: 2,
      explanation: 'Per the PMI Code of Ethics (Responsibility & Fairness), the PM should first investigate the facts before taking action. Terminating without investigation is unfair. Ignoring it violates the duty of honesty and integrity. Reporting unverified claims to management is premature and could harm someone unjustly. The PM should gather data, review records, and then take appropriate action based on findings. This aligns with PMBOK 7 Principle #1 — Stewardship (integrity and care).'
    },
    {
      scenario: 'A project manager is managing a large infrastructure project. A critical vendor has informed the team that a key material delivery will be delayed by 3 weeks. This material is on the critical path.',
      question: 'What should the project manager do NEXT?',
      options: [
        'Wait for the vendor to resolve the issue and update the schedule later',
        'Immediately terminate the vendor contract and find a new supplier',
        'Evaluate the impact on the project schedule, assess alternatives (crashing, fast-tracking, alternative suppliers), and update the risk register',
        'Add 3 weeks of buffer to all remaining project activities'
      ],
      correct: 2,
      explanation: 'The PM should assess the full impact on the project schedule and evaluate alternatives. Since the item is on the critical path, a 3-week delay directly extends the project. Options include: crashing (adding resources), fast-tracking (performing activities in parallel), finding alternative suppliers, or negotiating with the vendor. The risk register should be updated. Waiting is passive. Terminating the contract is drastic and may have legal/cost implications. Adding buffer to ALL activities is excessive and unnecessary.'
    },
    {
      scenario: 'An agile team has been performing well for several sprints. The team\'s velocity has been consistent at around 40 story points per sprint. A senior manager asks the Scrum Master to increase the team\'s velocity to 60 story points to meet a deadline.',
      question: 'What should the Scrum Master do?',
      options: [
        'Comply with the manager\'s request and assign more story points to the next sprint',
        'Explain that velocity is a planning tool and cannot be artificially inflated; discuss alternative solutions like adding team members, reducing scope, or extending the timeline',
        'Add pressure on the team to work overtime to meet the higher velocity target',
        'Ignore the manager\'s request and continue as normal'
      ],
      correct: 1,
      explanation: 'Velocity is a diagnostic/planning metric, NOT a target to be mandated. Artificially inflating velocity (by assigning more points) doesn\'t increase actual throughput — it just corrupts the metric. As a Servant Leader, the Scrum Master should educate the manager and facilitate a discussion about realistic alternatives: adding capacity, reducing scope, extending timeline, or removing impediments. This protects the team while addressing the business need.'
    },
    {
      scenario: 'During project planning, the project manager identifies that the project has a high degree of complexity with many interdependent components across multiple departments. Several stakeholders have conflicting requirements.',
      question: 'Which approach BEST addresses this situation?',
      options: [
        'Document all requirements in detail and get formal sign-off from all stakeholders before proceeding',
        'Use systems thinking to understand interactions, facilitate collaborative workshops to resolve conflicts, and plan iteratively',
        'Escalate the conflicting requirements to the project sponsor for resolution',
        'Prioritize requirements from the most senior stakeholder and proceed'
      ],
      correct: 1,
      explanation: 'PMBOK 7 Principle #5 (Recognize, Evaluate, and Respond to System Interactions) and Principle #9 (Navigate Complexity) both apply here. Systems thinking helps understand how components interact. Collaborative workshops bring stakeholders together to resolve conflicts (Principle #3 — Effectively Engage Stakeholders). Iterative planning allows the team to adapt as understanding grows. Escalating is premature, and prioritizing based on seniority doesn\'t address the root issue.'
    },
    {
      scenario: 'A project is using a hybrid approach. The infrastructure components use a predictive approach, while the software components use Scrum. The infrastructure team has completed their phase, but the software team is still in Sprint 4 of 6. A change request comes in that affects both the infrastructure and software.',
      question: 'How should the change be managed?',
      options: [
        'Process it through the Change Control Board (CCB) since infrastructure is predictive',
        'Add it to the product backlog since the software team is using agile',
        'Evaluate the change holistically — process through CCB for infrastructure impacts and add to the product backlog for software impacts',
        'Reject the change since infrastructure is already complete'
      ],
      correct: 2,
      explanation: 'In a hybrid environment, change management must respect both approaches. Infrastructure changes that affect completed work should go through formal change control (CCB). Software changes should follow the agile process — adding to the product backlog for prioritization by the Product Owner. A holistic evaluation ensures both components are properly addressed. Rejecting outright ignores potential value, and using only one approach ignores the hybrid nature of the project.'
    },
    {
      scenario: 'A project team is in the Executing phase. A team member approaches the PM and says they have discovered a way to significantly improve a deliverable\'s functionality, which would require a minor scope change but could greatly increase stakeholder satisfaction.',
      question: 'What should the project manager do?',
      options: [
        'Allow the team member to implement the improvement since it benefits stakeholders',
        'Tell the team member to focus only on the approved scope',
        'Have the team member submit a formal change request for evaluation through the Integrated Change Control process',
        'Present the idea directly to the project sponsor for immediate approval'
      ],
      correct: 2,
      explanation: 'ALL scope changes — even beneficial ones — must go through Perform Integrated Change Control (PMBOK 6 Process 4.6). This ensures the impact on schedule, cost, quality, and risk is properly evaluated before approval. Allowing unauthorized changes is "gold plating" — adding unrequested features, which PMI discourages. The CCB (or PM if delegated authority) makes the decision, not the sponsor unilaterally. This preserves the integrity of the project management plan.'
    },
    {
      scenario: 'A newly assigned project manager takes over a project in mid-execution. After reviewing the project documents, the PM notices that the risk register has not been updated in 3 months, the issue log has unresolved items from weeks ago, and team morale seems low.',
      question: 'What should the new project manager do FIRST?',
      options: [
        'Conduct a team meeting to understand the current project status, challenges, and team concerns',
        'Update the risk register immediately',
        'Escalate the poor project management to the PMO',
        'Create a corrective action plan and present it to the sponsor'
      ],
      correct: 0,
      explanation: 'Before taking any corrective action, the PM must first understand the current situation. A team meeting allows the PM to assess the state of the project holistically — understanding team concerns (addressing morale), identifying current risks and issues, and building trust with the team. This aligns with PMBOK 7 Principle #2 (Collaborative Team Environment) and #6 (Demonstrate Leadership). Updating individual documents or escalating without full understanding could lead to misguided actions.'
    },
    {
      scenario: 'An agile project team is having difficulty with a technical challenge. The Scrum Master notices that team members are hesitant to ask for help or admit they are stuck. The team\'s velocity has dropped for two consecutive sprints.',
      question: 'What should the Scrum Master do to address this?',
      options: [
        'Assign a senior technical lead to solve the problems for the team',
        'Report the velocity drop to management and request additional resources',
        'Foster psychological safety by facilitating open discussions, encouraging experimentation, and ensuring team members feel safe to fail and ask for help',
        'Set individual performance targets to hold team members accountable'
      ],
      correct: 2,
      explanation: 'Psychological safety is essential for high-performing agile teams. When team members fear asking for help or admitting struggles, innovation and collaboration suffer. The Scrum Master should create an environment where vulnerability is safe — through facilitated retrospectives, modeling openness, and separating learning from blame. Individual performance targets and external pressure work against the collaborative, self-organizing nature of agile teams. This aligns with PMBOK 7 Principle #2 (Collaborative Team Environment).'
    },
    {
      scenario: 'A project manager learns that a regulation change will take effect in 6 months that could significantly impact the project\'s deliverables. The project is currently in the planning phase and is scheduled to complete in 8 months.',
      question: 'What should the project manager do?',
      options: [
        'Wait until the regulation takes effect and then assess the impact',
        'Log it as a risk in the risk register, assess the probability and impact, and develop a risk response strategy',
        'Immediately change the project scope to comply with the new regulation',
        'Inform the team but take no action until the regulation is officially published'
      ],
      correct: 1,
      explanation: 'This is a known risk (an identifiable uncertainty with a future trigger). The PM should log it in the risk register with its probability (likely high since it\'s a regulation), impact assessment, and a risk response plan. The response might include proactive compliance planning, engaging legal/compliance experts, or building flexibility into the design. Waiting is too reactive. Immediately changing scope without proper analysis is premature. Logging and planning is the disciplined PMI approach (PMBOK 7 Principle #10 — Optimize Risk Responses).'
    },
    {
      scenario: 'During the closing phase of a project, the project manager discovers that several lessons learned sessions were skipped during the project. The team is eager to move on to new assignments.',
      question: 'What should the project manager do?',
      options: [
        'Skip the lessons learned since they were already missed during execution and close the project',
        'Conduct a comprehensive lessons learned session now, document findings, and add them to the organizational knowledge base',
        'Assign one team member to write up lessons learned based on their own perspective',
        'Close the project and note in the final report that lessons learned were not captured'
      ],
      correct: 1,
      explanation: 'Lessons learned are a critical output of the Close Project or Phase process (PMBOK 6, 4.7). Even though sessions were missed during execution, a comprehensive final lessons learned session captures valuable organizational knowledge for future projects. This is part of responsible stewardship (PMBOK 7 Principle #1) and organizational process asset creation. One person\'s perspective is incomplete. Skipping entirely wastes organizational learning opportunities. PMI strongly emphasizes knowledge transfer.'
    },
    {
      scenario: 'A project manager is working on a project with a fixed budget of $500,000 and a firm deadline of December 31st. The project sponsor requests additional features that would add significant scope.',
      question: 'What should the project manager do?',
      options: [
        'Accept the additional features since the sponsor has authority over the project',
        'Reject the features to protect the budget and deadline',
        'Analyze the impact of the additional features on schedule, cost, and quality; present the trade-off analysis to the sponsor for an informed decision',
        'Ask the team to work overtime to accommodate the features within the current constraints'
      ],
      correct: 2,
      explanation: 'The PM\'s role is to provide objective analysis to enable informed decision-making, not to unilaterally accept or reject scope changes. When scope is added but budget and time are fixed, something must give — this is the Triple Constraint (Scope, Time, Cost + Quality). The PM should present a trade-off analysis: "Adding these features will require X more budget or Y more time, OR we can reduce scope elsewhere." The sponsor then decides with full knowledge of implications. This is Perform Integrated Change Control in action.'
    },
    {
      scenario: 'An agile team is in Sprint 3 of a project. During the Daily Scrum, a developer mentions they found a critical security vulnerability in the code that was deployed in Sprint 1. This could affect current users.',
      question: 'What should happen NEXT?',
      options: [
        'Add the fix to the current sprint backlog without changing the sprint goal',
        'Log it in the product backlog for the Product Owner to prioritize in the next sprint',
        'The Product Owner should immediately assess the severity; if critical, it may warrant disrupting the current sprint to address the vulnerability',
        'The Scrum Master should escalate to management for a decision'
      ],
      correct: 2,
      explanation: 'A critical security vulnerability affecting users is a high-severity issue that requires immediate assessment by the Product Owner (who represents stakeholder/user interests). If it\'s truly critical, the PO may decide to bring it into the current sprint or even cancel the sprint if the sprint goal becomes obsolete. This is one of the rare situations where disrupting a sprint may be justified. Simply logging it for "next sprint" could leave users at risk. The PO has the authority to make this call, not the Scrum Master or management.'
    },
    {
      scenario: 'A project team using a predictive approach has completed 80% of the project work. The customer requests a major scope change that would require reworking 30% of completed deliverables and extending the schedule by 2 months.',
      question: 'What should the project manager do FIRST?',
      options: [
        'Reject the change because the project is 80% complete',
        'Accept the change to ensure customer satisfaction',
        'Perform impact analysis and submit the change request through the Integrated Change Control process for CCB review',
        'Negotiate a new contract to cover the additional work'
      ],
      correct: 2,
      explanation: 'Regardless of project completion percentage, ALL change requests must go through Perform Integrated Change Control. The PM should analyze the full impact on scope, schedule, cost, quality, resources, and risk, then present it to the CCB for decision. The CCB (not the PM alone) decides whether to approve, reject, or defer. If approved, a contract amendment may follow. Outright rejection or acceptance without analysis is inappropriate. The process exists to ensure informed decisions with full awareness of consequences.'
    },
    {
      scenario: 'A PM is managing a multicultural, distributed team across 4 time zones. Team members from one region rarely speak during virtual meetings, and there have been misunderstandings due to communication style differences.',
      question: 'What is the BEST approach to address this?',
      options: [
        'Require all team members to follow the communication style of the headquarters location',
        'Create a communication management plan that accounts for cultural differences, rotating meeting times, and multiple communication channels',
        'Have the quiet team members send their updates via email only',
        'Assign a team lead in each region and communicate only through the leads'
      ],
      correct: 1,
      explanation: 'Effective project communication must account for cultural diversity and geographical distribution (PMBOK 7 Principle #2 — Collaborative Team Environment, and Principle #3 — Engage Stakeholders). A tailored communications plan considers: rotating meeting times for fairness, multiple channels (async + sync), culturally-sensitive facilitation techniques, and encouraging participation from all members. Imposing one culture\'s norms alienates others. Isolating quiet members reduces collaboration. This also aligns with Principle #7 — Tailor Based on Context.'
    },
    {
      scenario: 'During a sprint retrospective, the team identifies that their biggest impediment is constantly changing priorities from multiple stakeholders who each claim their work is the highest priority.',
      question: 'What is the BEST way to resolve this?',
      options: [
        'Let the development team decide which stakeholder\'s work to do first',
        'Ensure the Product Owner maintains a single, ordered product backlog and is the sole authority on prioritization',
        'Have each stakeholder submit a formal priority request to the Scrum Master',
        'Escalate to senior management to determine which stakeholder has highest authority'
      ],
      correct: 1,
      explanation: 'In Scrum, the Product Owner is THE single authority responsible for maximizing the value of the product by managing the product backlog. Multiple stakeholders competing for priority is a classic problem solved by having ONE Product Owner who weighs all inputs and creates a SINGLE ordered backlog. The development team should not be caught between competing stakeholders — that is the PO\'s job. The Scrum Master can coach stakeholders on working through the PO. This is fundamental to the Scrum framework.'
    },
    {
      scenario: 'A project manager calculates the following EVM metrics at the midpoint of a project: CPI = 0.85, SPI = 1.10, BAC = $200,000. The project sponsor wants to know if the project can finish within the original budget.',
      question: 'What should the project manager report?',
      options: [
        'Yes, because the SPI is above 1.0 indicating good progress',
        'No, the EAC is approximately $235,294 (BAC/CPI) which exceeds the BAC; the project is trending over budget despite being ahead of schedule',
        'It\'s uncertain; more data is needed before making any forecast',
        'Yes, because the project is ahead of schedule so the cost will balance out'
      ],
      correct: 1,
      explanation: 'CPI = 0.85 means the project is getting only $0.85 of value for every $1 spent — it is over budget. EAC = BAC/CPI = $200,000/0.85 = $235,294. The project will exceed its budget by approximately $35,294 if current cost trends continue. Being ahead of schedule (SPI = 1.10) does NOT fix cost problems — schedule and cost performance are independent measures. PMI research shows CPI rarely improves by more than 10% after 20% completion. The PM should report the over-budget trend honestly and propose corrective actions.'
    },
    {
      scenario: 'A project is transitioning from waterfall to agile. The team members are used to being told exactly what to do by the project manager. In the first sprint, the team waits for the PM to assign tasks and provide detailed instructions.',
      question: 'What should the project manager (acting as Scrum Master) do?',
      options: [
        'Continue assigning tasks since the team is not yet ready for self-organization',
        'Immediately stop assigning tasks and let the team figure things out on their own',
        'Coach the team on self-organization principles, gradually empowering them to pull work and make decisions while providing guidance and support',
        'Revert to waterfall since the team clearly prefers a predictive approach'
      ],
      correct: 2,
      explanation: 'Transitioning to agile requires a shift in mindset and behavior that doesn\'t happen overnight. The PM/Scrum Master should coach the team on self-organization — explaining WHY it matters, modeling the behaviors, gradually reducing direction, and creating safety for the team to experiment. Immediately removing all guidance could cause the team to fail, destroying confidence. Reverting to waterfall avoids the needed growth. This is Servant Leadership in action — meeting the team where they are and developing them over time (PMBOK 7 Principle #6 — Leadership, and Principle #11 — Adaptability).'
    },
  ];


  // ══════════════════════════════════════════════
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
    const pv = parseFloat(document.getElementById('evmPV').value);
    const ev = parseFloat(document.getElementById('evmEV').value);
    const ac = parseFloat(document.getElementById('evmAC').value);
    const bac = parseFloat(document.getElementById('evmBAC').value);

    if ([pv, ev, ac, bac].some(isNaN)) {
      alert('Please enter valid numbers for all four fields.');
      return;
    }

    const cv = ev - ac;
    const sv = ev - pv;
    const cpi = ev / ac;
    const spi = ev / pv;
    const eac = bac / cpi;
    const etc = eac - ac;
    const vac = bac - eac;
    const tcpi = (bac - ev) / (bac - ac);

    const fmt = (v) => v.toLocaleString('en-US', { maximumFractionDigits: 2 });
    const fmtDollar = (v) => '$' + Math.abs(v).toLocaleString('en-US', { maximumFractionDigits: 0 });

    document.getElementById('resCV').textContent = (cv >= 0 ? '+' : '') + fmtDollar(cv).replace('$', (cv >= 0 ? '$' : '-$'));
    document.getElementById('resSV').textContent = (sv >= 0 ? '+' : '') + fmtDollar(sv).replace('$', (sv >= 0 ? '$' : '-$'));
    document.getElementById('resCPI').textContent = fmt(cpi);
    document.getElementById('resSPI').textContent = fmt(spi);
    document.getElementById('resEAC').textContent = '$' + eac.toLocaleString('en-US', { maximumFractionDigits: 0 });
    document.getElementById('resETC').textContent = '$' + etc.toLocaleString('en-US', { maximumFractionDigits: 0 });
    document.getElementById('resVAC').textContent = (vac >= 0 ? '+' : '') + fmtDollar(vac).replace('$', (vac >= 0 ? '$' : '-$'));
    document.getElementById('resTCPI').textContent = fmt(tcpi);

    // Interpretations
    setInterp('intCV', cv >= 0 ? 'Under Budget ✓' : 'Over Budget ✗', cv >= 0 ? 'good' : 'bad');
    setInterp('intSV', sv >= 0 ? 'On/Ahead of Schedule ✓' : 'Behind Schedule ✗', sv >= 0 ? 'good' : 'bad');
    setInterp('intCPI', cpi >= 1 ? `Efficient: Getting $${fmt(cpi)} per $1 spent` : `Inefficient: Getting $${fmt(cpi)} per $1 spent`, cpi >= 1 ? 'good' : 'bad');
    setInterp('intSPI', spi >= 1 ? `${fmt(spi * 100)}% of planned work done` : `Only ${fmt(spi * 100)}% of planned work done`, spi >= 1 ? 'good' : 'bad');
    setInterp('intEAC', eac <= bac ? 'Will finish at/under budget' : `Will exceed budget by $${(eac - bac).toLocaleString('en-US', { maximumFractionDigits: 0 })}`, eac <= bac ? 'good' : 'bad');
    setInterp('intETC', `Still need $${etc.toLocaleString('en-US', { maximumFractionDigits: 0 })} to finish`, 'neutral');
    setInterp('intVAC', vac >= 0 ? 'Expected surplus at completion' : 'Expected deficit at completion', vac >= 0 ? 'good' : 'bad');
    setInterp('intTCPI', tcpi > 1.1 ? 'Must perform significantly better!' : (tcpi > 1 ? 'Must improve slightly' : 'Can maintain/relax pace'), tcpi > 1 ? 'bad' : 'good');
  });

  function setInterp(id, text, type) {
    const el = document.getElementById(id);
    el.textContent = text;
    el.className = 'interpretation interp-' + type;
  }

  // ══════════════════════════════════════════════
  //  QUIZ ENGINE
  // ══════════════════════════════════════════════
  let quizState = {
    currentQ: 0,
    score: 0,
    selectedAnswer: -1,
    answered: false,
    answers: [],
    questions: []
  };

  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function startQuiz() {
    quizState = {
      currentQ: 0,
      score: 0,
      selectedAnswer: -1,
      answered: false,
      answers: [],
      questions: shuffleArray(quizQuestions)
    };
    document.getElementById('quizActive').classList.remove('hidden');
    document.getElementById('quizResults').classList.add('hidden');
    renderQuestion();
  }

  function renderQuestion() {
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

    // Reset state
    quizState.selectedAnswer = -1;
    quizState.answered = false;
    document.getElementById('qExplanation').classList.remove('visible');
    document.getElementById('quizSubmitBtn').classList.remove('hidden');
    document.getElementById('quizSubmitBtn').disabled = true;
    document.getElementById('quizNextBtn').classList.add('hidden');
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

  document.getElementById('quizSubmitBtn').addEventListener('click', () => {
    if (quizState.selectedAnswer === -1) return;
    quizState.answered = true;

    const q = quizState.questions[quizState.currentQ];
    const isCorrect = quizState.selectedAnswer === q.correct;
    if (isCorrect) quizState.score++;

    quizState.answers.push({
      questionIndex: quizState.currentQ,
      selected: quizState.selectedAnswer,
      correct: q.correct,
      isCorrect
    });

    // Highlight answers
    const options = document.querySelectorAll('.option-btn');
    options.forEach((opt, i) => {
      opt.classList.add('disabled');
      if (i === q.correct) opt.classList.add('correct');
      if (i === quizState.selectedAnswer && !isCorrect) opt.classList.add('wrong');
    });

    // Show explanation
    document.getElementById('qExplanationText').textContent = q.explanation;
    document.getElementById('qExplanation').classList.add('visible');

    // Update buttons
    document.getElementById('quizSubmitBtn').classList.add('hidden');

    if (quizState.currentQ < quizState.questions.length - 1) {
      document.getElementById('quizNextBtn').classList.remove('hidden');
      document.getElementById('quizNextBtn').textContent = 'Next Question →';
    } else {
      document.getElementById('quizNextBtn').classList.remove('hidden');
      document.getElementById('quizNextBtn').textContent = 'View Results →';
    }

    document.getElementById('quizScoreDisplay').textContent = quizState.score;
  });

  document.getElementById('quizNextBtn').addEventListener('click', () => {
    if (quizState.currentQ < quizState.questions.length - 1) {
      quizState.currentQ++;
      renderQuestion();
    } else {
      showQuizResults();
    }
  });

  function showQuizResults() {
    document.getElementById('quizActive').classList.add('hidden');
    document.getElementById('quizResults').classList.remove('hidden');

    const score = quizState.score;
    const total = quizState.questions.length;
    const pct = Math.round((score / total) * 100);

    document.getElementById('finalScoreNum').textContent = score;
    document.getElementById('resultsCircle').style.setProperty('--score-pct', pct);

    let message, sub;
    if (pct >= 80) {
      message = '🎉 Excellent! You\'re PMP Ready!';
      sub = `You scored ${pct}% — well above the passing threshold. Keep reviewing weak areas.`;
    } else if (pct >= 65) {
      message = '👍 Good Progress!';
      sub = `You scored ${pct}%. You\'re close — focus on the questions you missed and review those topics.`;
    } else {
      message = '📚 Keep Studying!';
      sub = `You scored ${pct}%. Review the explanations below, revisit the study sections, and retake the exam.`;
    }
    document.getElementById('resultsMessage').textContent = message;
    document.getElementById('resultsSub').textContent = sub;

    // Build review section
    const reviewSection = document.getElementById('quizReviewSection');
    reviewSection.innerHTML = '';
    reviewSection.classList.add('hidden');

    quizState.answers.forEach((ans, idx) => {
      const q = quizState.questions[ans.questionIndex];
      const letters = ['A', 'B', 'C', 'D'];
      const card = document.createElement('div');
      card.className = 'question-card';
      card.style.marginBottom = '16px';
      card.innerHTML = `
        <div class="question-number" style="color: ${ans.isCorrect ? 'var(--accent-primary)' : 'var(--accent-warm)'}">
          ${ans.isCorrect ? '✓' : '✗'} Question ${idx + 1}
        </div>
        <div class="question-scenario">${q.scenario}</div>
        <div class="question-text">${q.question}</div>
        <div style="margin-bottom:12px;">
          ${q.options.map((opt, i) => {
            let cls = '';
            if (i === q.correct) cls = 'color: var(--accent-primary); font-weight:600;';
            if (i === ans.selected && !ans.isCorrect) cls = 'color: var(--accent-warm); text-decoration: line-through;';
            return `<div style="padding:6px 0; font-size:0.85rem; ${cls}">${letters[i]}. ${opt}</div>`;
          }).join('')}
        </div>
        <div class="explanation-box visible">
          <h4>💡 Why ${letters[q.correct]} is the best answer:</h4>
          <p>${q.explanation}</p>
        </div>
      `;
      reviewSection.appendChild(card);
    });
  }

  document.getElementById('quizReviewBtn').addEventListener('click', () => {
    const reviewSection = document.getElementById('quizReviewSection');
    reviewSection.classList.toggle('hidden');
    document.getElementById('quizReviewBtn').textContent =
      reviewSection.classList.contains('hidden') ? '📋 Review Answers' : '📋 Hide Review';
  });

  // ══════════════════════════════════════════════
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

    // Populate lists
    modalInputs.innerHTML = data.inputs.map(item => `<li>${item}</li>`).join('');
    modalTools.innerHTML = data.tools.map(item => `<li>${item}</li>`).join('');
    modalOutputs.innerHTML = data.outputs.map(item => `<li>${item}</li>`).join('');

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

  function startScheduler() {
    stopScheduler(); // Clear existing

    const isEnabled = safeLS.getItem('pmp_notif_enabled') === 'true';
    if (!isEnabled || Notification.permission !== 'granted') return;

    const intervalSec = parseInt(notifIntervalSelect.value);
    secondsRemaining = intervalSec;

    // Local Storage persistence of last interval setting
    safeLS.setItem('pmp_notif_interval', intervalSec);

    // Update Countdown display
    updateCountdownDisplay();
    
    countdownTimer = setInterval(() => {
      secondsRemaining--;
      if (secondsRemaining <= 0) {
        triggerLocalNotification();
        secondsRemaining = intervalSec; // reset
      }
      updateCountdownDisplay();
    }, 1000);
  }

  function stopScheduler() {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  }

  function updateCountdownDisplay() {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    notifCountdown.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
      safeLS.setItem('pmp_notif_enabled', !isEnabled);
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
  if (safeLS.getItem('pmp_notif_enabled') === 'true') {
    startScheduler();
  }

  // ══════════════════════════════════════════════
  //  PMP EXAM MINDSET PLAYBOOK
  // ══════════════════════════════════════════════
  const mindsetRules = [
    {
      id: 1,
      title: "Analyze and Assess FIRST",
      icon: "🔍",
      instruction: "When a new issue, risk, or change occurs, the Project Manager's first step is ALWAYS to analyze the impact, consult registers, or evaluate options. Never take immediate action or request changes without understanding the effect.",
      scenario: "A key stakeholder requests a modification to the database schema mid-execution. What should the PM do first?",
      answer: "Analyze the impact of the requested change on the scope, timeline, budget, and quality before preparing a change request."
    },
    {
      id: 2,
      title: "Collaborate and Talk Privately",
      icon: "🤝",
      instruction: "Resolve conflicts and disagreements at the lowest level possible. Always speak to team members privately, listen actively, and seek consensus. Avoid immediately escalating to management or the sponsor.",
      scenario: "Two senior developers are arguing over an architecture decision, stalling sprint progress. What should the PM do first?",
      answer: "Facilitate a private meeting between the two developers to discuss their concerns and guide them toward a collaborative decision."
    },
    {
      id: 3,
      title: "Agile is Servant Leadership",
      icon: "🛡️",
      instruction: "In Agile, the PM (acting as Scrum Master) does not assign tasks, dictate schedules, or issue directives. Instead, you remove impediments, protect the team from distractions, and coach them on self-organization.",
      scenario: "An agile team is struggling to meet their sprint goal because of frequent ad-hoc requests from a sales manager. What should the PM do?",
      answer: "Intervene to shield the team from the sales manager's requests, and coach the manager to direct all requests through the Product Owner."
    },
    {
      id: 4,
      title: "Follow the Change Control Board (CCB)",
      icon: "📋",
      instruction: "For predictive projects, any modification to baselines (scope, schedule, or cost) requires a formal change request processed through the Integrated Change Control process and approved by the CCB.",
      scenario: "The client asks a developer to add a minor extra field to a report. The developer says it takes only 10 minutes. What should the PM do?",
      answer: "Instruct the developer not to add the feature yet; document the request and submit a formal change request to the CCB."
    },
    {
      id: 5,
      title: "Do Not Fire or Escalate Unilaterally",
      icon: "❌",
      instruction: "When dealing with team performance issues, always follow coaching and performance improvement paths. Firing team members or formal escalations to HR/Sponsor are final resorts after all internal coaching attempts fail.",
      scenario: "A developer's productivity has fallen for three consecutive sprints, causing delayed deliverables. What should the PM do?",
      answer: "Meet with the developer privately to understand the root cause of the performance drop and collaboratively create a support plan."
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
        const fileBlob = await dbGetBook(bookId);
        hasBook = !!fileBlob;
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

  // 6. Margin Tap Navigation & Gestures
  kindleZoneLeft.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentPageIndex > 0) {
      currentPageIndex--;
      renderKindlePage();
    }
  });

  kindleZoneRight.addEventListener('click', (e) => {
    e.stopPropagation();
    const total = getTotalPages();
    if (currentPageIndex < total - 1) {
      currentPageIndex++;
      renderKindlePage();
    }
  });

  // Center tap zone toggles HUD visibility
  kindleZoneCenter.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = kindleHUDHeader.classList.contains('visible');
    toggleHUD(!isVisible);
    // Close any open popovers/drawers when toggling HUD
    kindleAaPopover.classList.remove('visible');
    closeAllDrawers();
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

  // Initialize quiz
  startQuiz();

};
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
