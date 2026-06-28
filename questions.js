// ═══════════════════════════════════════════════════════════════════
//  PMP EXAM MASTER QUESTION BANK — 180 Questions
//  Standard PMP Exam Distribution:
//    • People Domain     ~42% (~76 questions)
//    • Process Domain    ~50% (~90 questions)
//    • Business Environ. ~8%  (~14 questions)
// ═══════════════════════════════════════════════════════════════════
// Exposed as window.PMP_QUESTION_BANK for app.js to consume.

window.PMP_QUESTION_BANK = [

// ─────────────────────────── PEOPLE DOMAIN ───────────────────────────

  {
    domain: 'People',
    scenario: 'A project manager is leading a cross-functional team on a new product launch. Two senior team members have conflicting opinions on the technical architecture. The disagreement is escalating and causing tension across the team.',
    question: 'What is the BEST approach for the project manager?',
    options: [
      'Let the two team members resolve the conflict on their own',
      'Make the technical decision yourself to eliminate the conflict',
      'Facilitate a structured discussion where both sides present their cases, evaluate trade-offs objectively, and reach a collaborative decision',
      'Escalate the conflict to the project sponsor immediately'
    ],
    correct: 2,
    explanation: 'The PM should use collaborative problem-solving (confronting) to bring the conflicting parties together and resolve it constructively. PMI considers this the most effective conflict resolution technique. Simply deciding for them undermines team ownership. Escalating to the sponsor is premature — the PM should exhaust internal resolution first. Avoiding the conflict allows it to fester and damage team performance (PMBOK 7 Principle #2 — Collaborative Team Environment).'
  },
  {
    domain: 'People',
    scenario: 'During a project retrospective, several team members express frustration that their ideas and concerns raised in past retrospectives were never acted upon. They feel their input is not valued.',
    question: 'What should the project manager do to improve the situation?',
    options: [
      'Explain that not all suggestions can be implemented due to constraints',
      'Cancel future retrospectives since they are causing dissatisfaction',
      'Create a visible improvement backlog, assign owners to each action, and review progress at the start of each retrospective',
      'Have team members submit ideas via email instead of in meetings'
    ],
    correct: 2,
    explanation: 'Retrospectives are valuable only when action items are tracked and acted upon. Creating a transparent improvement backlog with assigned owners and regular review builds trust and demonstrates that input is genuinely valued. This embodies the Agile principle of continuous improvement and servant leadership. Canceling retrospectives removes a critical feedback loop. Deflecting to constraints without acknowledging concerns damages psychological safety.'
  },
  {
    domain: 'People',
    scenario: 'A project manager notices that a high-performing team member has been increasingly disengaged and missing deadlines. In a one-on-one meeting, the team member reveals they feel their skills are underutilized and they are bored.',
    question: 'What should the project manager do?',
    options: [
      'Document the performance issues and issue a formal warning',
      'Reassign the team member to another project immediately',
      'Discuss the team member\'s career aspirations and assign them more challenging responsibilities or a mentoring role',
      'Inform HR of the performance concerns right away'
    ],
    correct: 2,
    explanation: 'Disengagement due to underutilization is a motivation issue, best addressed through Herzberg\'s Two-Factor Theory (growth as a motivator). The PM should leverage the team member\'s strengths by providing stretch assignments or leadership roles (e.g., technical mentor). This retains a valuable resource and improves performance. A formal warning is punitive and inappropriate before a coaching conversation. Escalating to HR is premature without a performance improvement plan.'
  },
  {
    domain: 'People',
    scenario: 'A project manager joins a team that has been working together for two years. Team members have strong relationships, and the team operates autonomously. The PM feels excluded from key decisions.',
    question: 'What should the project manager do FIRST?',
    options: [
      'Assert authority and require all decisions to go through the PM',
      'Observe the team\'s dynamics, build trust gradually, and clarify the PM\'s role without disrupting the team\'s effectiveness',
      'Reorganize the team structure to establish clearer hierarchy',
      'Escalate to the project sponsor that the team is not following proper governance'
    ],
    correct: 1,
    explanation: 'A team that is performing well (Tuckman\'s Performing stage) should not be disrupted with a heavy-handed authority approach. The PM should first observe, understand the team culture, and build personal credibility before introducing any changes. Asserting authority abruptly can break trust and damage performance. This aligns with servant leadership principles — the PM facilitates and enables rather than commands and controls.'
  },
  {
    domain: 'People',
    scenario: 'A team member from a collectivist cultural background is uncomfortable speaking up to disagree with the project manager\'s decisions in group meetings. Important feedback is being lost.',
    question: 'What should the project manager do?',
    options: [
      'Tell the team member they must speak up in meetings as part of their job',
      'Create anonymous feedback mechanisms, one-on-one check-ins, and written input channels to capture all perspectives',
      'Have the team member\'s direct supervisor attend meetings to encourage them',
      'Document that the team member is not a collaborative contributor'
    ],
    correct: 1,
    explanation: 'Cultural intelligence is essential in diverse teams. Some cultures prioritize harmony and deference to authority in group settings. The PM should adapt communication approaches to enable participation — anonymous surveys, one-on-ones, or written pre-meeting input capture valuable perspectives without creating discomfort. Forcing behavior that conflicts with cultural values damages psychological safety and trust. This reflects PMBOK 7 Principle #3 (Stakeholder Engagement) and #7 (Tailoring).'
  },
  {
    domain: 'People',
    scenario: 'A new project manager is building a team for a 12-month product development project. She needs to decide between co-locating the team or allowing remote work.',
    question: 'What factor is MOST important in making this decision?',
    options: [
      'The company\'s standard remote work policy',
      'The nature of the work, team collaboration needs, and communication requirements of the project',
      'The cost savings from avoiding office space',
      'The personal preferences of individual team members'
    ],
    correct: 1,
    explanation: 'The decision should be driven by the project\'s specific characteristics — complexity, collaboration intensity, knowledge-sharing needs, and communication requirements. Complex, highly interdependent work may benefit from co-location; more independent tasks may suit remote work. Company policy provides a starting point but should be tailored to the project. Cost and personal preferences are secondary considerations. This reflects PMBOK 7 Principle #7 — Tailor Based on Context.'
  },
  {
    domain: 'People',
    scenario: 'A project manager is working with a team where one member consistently dominates discussions, dismisses others\' ideas, and takes credit for group work. Other team members are becoming withdrawn.',
    question: 'What should the project manager do FIRST?',
    options: [
      'Remove the dominant team member from the project immediately',
      'Have a private conversation with the dominant team member to address the specific behaviors and their impact on the team',
      'Ask the team to manage the situation themselves',
      'Reorganize the team into subgroups to reduce interaction'
    ],
    correct: 1,
    explanation: 'The PM should address disruptive behavior directly and privately first. A conversation focused on specific behaviors (not personal attacks) and their impact on team dynamics is most effective. This preserves the relationship while setting clear expectations. Removing the team member is drastic before coaching. Asking the team to manage it abdicates the PM\'s leadership responsibility. Reorganizing avoids the root cause. This aligns with PMI\'s conflict resolution approach: confront and problem-solve.'
  },
  {
    domain: 'People',
    scenario: 'A project is behind schedule. The project manager proposes working overtime for the next three weekends. The team agrees but several members express concerns about family commitments and burnout risk.',
    question: 'What should the project manager do?',
    options: [
      'Proceed with the overtime plan since the team agreed',
      'Drop the overtime plan and accept the schedule delay',
      'Explore alternatives first (crashing, fast-tracking, scope reduction) and if overtime is necessary, limit it and establish recovery time to protect team well-being',
      'Replace team members who cannot commit to overtime'
    ],
    correct: 2,
    explanation: 'Sustainable pace is an Agile principle and a general PMI best practice. While overtime may sometimes be necessary, it should be a last resort after exploring other schedule recovery techniques. The PM should care for the team\'s well-being (PMBOK 7 Principle #1 — Stewardship) while addressing the schedule issue. Repeatedly working overtime leads to burnout, errors, and attrition. Analyzing alternatives first demonstrates responsible leadership.'
  },
  {
    domain: 'People',
    scenario: 'During a project, a team member approaches the PM and admits they have been struggling with a technical skill required for their assigned tasks and have been hiding the difficulty to avoid embarrassment.',
    question: 'What should the project manager do?',
    options: [
      'Document the performance gap and involve HR',
      'Reassign all the team member\'s tasks to other team members',
      'Acknowledge the team member\'s courage in speaking up, arrange training or pair programming, and adjust assignments to support their development',
      'Set a deadline for the team member to learn the skill independently'
    ],
    correct: 2,
    explanation: 'The PM should reinforce the psychological safety that led the team member to come forward. Punishing honesty destroys trust and ensures future problems stay hidden. Development support (training, mentoring, pair programming) addresses the skill gap while building capability. Reassigning all tasks may be necessary for immediate risk management but should be combined with development support. This reflects servant leadership and PMBOK 7 Principle #2 (Collaborative Team).'
  },
  {
    domain: 'People',
    scenario: 'An agile team has become highly effective and self-organizing. The PM is concerned about upcoming organizational changes that may disrupt the team. The team has been together for 18 months.',
    question: 'Which stage of Tuckman\'s model is this team most likely in, and what should the PM do?',
    options: [
      'Forming — the PM should provide more direction',
      'Storming — the PM should facilitate conflict resolution',
      'Performing — the PM should protect the team from disruptions and advocate for team stability with leadership',
      'Norming — the PM should reinforce team agreements'
    ],
    correct: 2,
    explanation: 'A high-performing, self-organizing team that has been together 18 months is in the Performing stage. The PM\'s role at this stage is to protect the team, remove impediments, and advocate for conditions that allow continued high performance. Disrupting team composition has a real cost — teams must restart the Forming-Storming-Norming cycle. The PM should actively manage this risk by advocating for team stability with organizational leadership.'
  },
  {
    domain: 'People',
    scenario: 'A remote project team has members across five countries. During a virtual team-building session, the PM notices that participants from two specific countries barely participate and seem disconnected.',
    question: 'What should the project manager do?',
    options: [
      'End the virtual team-building sessions since they are not effective',
      'Require all team members to have cameras on during sessions',
      'Investigate barriers to participation (time zones, language, facilitation style, technology) and adapt the format to be more inclusive',
      'Focus team-building only on the most engaged participants'
    ],
    correct: 2,
    explanation: 'Low engagement in virtual sessions often signals barriers rather than disinterest. The PM should investigate: Are the times convenient? Are language barriers creating hesitation? Is the facilitation style culturally comfortable? Are there technology issues? Adapting the format — breakout groups, polls, written contributions, varied languages — creates a more inclusive environment. This reflects cultural intelligence and PMBOK 7 Principle #3 (Stakeholder Engagement).'
  },
  {
    domain: 'People',
    scenario: 'A project manager needs to deliver difficult news to a stakeholder: the project will be 6 weeks late due to unforeseen technical issues. The stakeholder has a history of angry reactions to bad news.',
    question: 'How should the project manager communicate this information?',
    options: [
      'Send the information via email to avoid a confrontational conversation',
      'Have the project sponsor deliver the message instead',
      'Schedule a meeting, deliver the information directly with context and impact analysis, present a recovery plan, and remain calm and empathetic throughout',
      'Wait until the delay is confirmed before communicating'
    ],
    correct: 2,
    explanation: 'Transparency and timely communication of bad news is a core PMI value. The PM should communicate directly, early, and constructively — presenting not just the problem but the impact analysis and proposed recovery options. Coming prepared with solutions demonstrates competence and shifts the conversation from blame to problem-solving. Avoiding or delegating the conversation undermines trust. Delaying bad news violates the ethical duty of honesty and makes the situation worse.'
  },
  {
    domain: 'People',
    scenario: 'A project manager is working with a matrix organization. A functional manager has redirected one of the PM\'s key team members to work on another department\'s priority, threatening the project timeline.',
    question: 'What should the project manager do?',
    options: [
      'Immediately file a formal complaint with HR about the functional manager',
      'Accept the situation since the functional manager outranks the PM in a matrix',
      'Meet with the functional manager to understand the competing priority, then escalate to the project sponsor with a documented impact analysis if the conflict cannot be resolved',
      'Secretly assign another team member to cover the work without informing management'
    ],
    correct: 2,
    explanation: 'Resource conflicts in matrix organizations are common. The PM should first attempt to resolve it collaboratively — understanding the competing need and exploring solutions (timing, partial availability). If unresolvable, escalate with a clear impact analysis to allow senior leadership to make an informed decision about competing priorities. Complaints without documented impact are less effective. Unauthorized workarounds create governance problems. This reflects proactive risk management and professional communication.'
  },
  {
    domain: 'People',
    scenario: 'A project team member has excellent technical skills but poor communication. They consistently fail to update the PM on progress, miss status meetings, and withhold information that could affect the project.',
    question: 'What should the project manager do?',
    options: [
      'Overlook the communication issues given the team member\'s technical value',
      'Have a direct conversation clarifying communication expectations, explaining why timely information sharing is critical to project success, and agreeing on specific behaviors',
      'Assign another team member to monitor and report the technical team member\'s progress',
      'Move the team member to a purely technical role with no project communication responsibilities'
    ],
    correct: 1,
    explanation: 'Poor communication is a performance issue that must be addressed directly regardless of technical excellence. Effective project execution depends on information flow. The PM should clarify expectations specifically (what information, by when, in what format), explain the business impact of communication gaps, and agree on measurable behaviors. Avoiding the issue or working around it creates unhealthy team dynamics and information silos. This is performance management and direct leadership.'
  },
  {
    domain: 'People',
    scenario: 'A project has an aggressive deadline. The project manager is considering using a "carrot and stick" approach — offering bonuses for early completion and threatening performance reviews for delays.',
    question: 'According to PMI and motivational theory, what is a BETTER approach?',
    options: [
      'The carrot-and-stick approach is the most proven motivational technique',
      'Create intrinsic motivation by providing meaningful work, clear goals, autonomy, mastery opportunities, and recognizing achievements',
      'Focus only on the stick approach since it is more effective under deadline pressure',
      'Let team members set their own deadlines to ensure buy-in'
    ],
    correct: 1,
    explanation: 'Research (Daniel Pink\'s Drive, Herzberg\'s motivators) consistently shows that intrinsic motivators — autonomy, mastery, purpose — are more effective than extrinsic ones for knowledge work. PMI emphasizes servant leadership and creating engaging environments. Extrinsic rewards (carrots/sticks) can actually reduce intrinsic motivation over time and create short-term compliance at the expense of long-term commitment. Creating meaning, recognizing achievement, and providing autonomy are more sustainable motivators.'
  },
  {
    domain: 'People',
    scenario: 'A project sponsor directly contacts team members to request status updates and assign work, bypassing the project manager. Team members are receiving conflicting direction.',
    question: 'What should the project manager do?',
    options: [
      'Allow it since the sponsor has authority over everyone',
      'Have the team members stop responding to the sponsor',
      'Meet with the sponsor to clarify roles, explain the negative impact of bypassing the PM structure, and agree on a communication protocol',
      'Escalate the issue to the sponsor\'s manager'
    ],
    correct: 2,
    explanation: 'Clear roles and communication channels are essential for effective project management. The PM should have a professional, direct conversation with the sponsor explaining that bypassing the PM confuses the team and creates conflicting priorities — ultimately harming the project the sponsor cares about. Proposing a communication protocol (e.g., sponsor requests go through PM) resolves this constructively. This requires diplomatic assertiveness — protecting the team\'s clarity while maintaining a good relationship with the sponsor.'
  },
  {
    domain: 'People',
    scenario: 'An agile team\'s Product Owner is unavailable for most of the sprint due to other organizational commitments. Team members are making product decisions independently, leading to inconsistent outcomes.',
    question: 'What should the Scrum Master/project manager do?',
    options: [
      'Have the team vote on product decisions since the PO is unavailable',
      'Make product decisions as the Scrum Master',
      'Escalate to senior management about the PO\'s unavailability and work to ensure the PO has sufficient time allocated to fulfill their role',
      'Continue with the sprint and catch up with the PO at the sprint review'
    ],
    correct: 2,
    explanation: 'Product Owner availability is critical to Scrum\'s effectiveness. An absent PO is an organizational impediment that the Scrum Master is responsible for surfacing and escalating. Team members should not be making product decisions independently — that role belongs to the PO. The Scrum Master should make the cost of this organizational dysfunction visible to leadership and advocate for the PO having sufficient time. This is a systemic organizational impediment that requires leadership intervention.'
  },
  {
    domain: 'People',
    scenario: 'A project manager must deliver a critical project status presentation to the executive team. The project is over budget but making good technical progress. The PM is nervous about the executive team\'s reaction.',
    question: 'How should the project manager prepare and deliver this presentation?',
    options: [
      'Focus only on the technical progress and avoid mentioning the budget issue',
      'Send the presentation in advance with a request to cancel the meeting',
      'Present the full picture honestly — including budget status, root causes, corrective actions underway, and revised forecast — with a clear ask for support',
      'Have the project sponsor present on behalf of the PM'
    ],
    correct: 2,
    explanation: 'Executive communication requires honesty, completeness, and a solution orientation. PMI\'s Code of Ethics requires honesty and transparency. Executives need full situational awareness to make strategic decisions. Hiding bad news destroys credibility and trust when discovered. The most effective executive communication: here is where we are, here is why, here is what we are doing about it, and here is what we need from you. This positions the PM as a trustworthy leader, not a crisis manager.'
  },
  {
    domain: 'People',
    scenario: 'A team member is consistently late to meetings, submitting work past deadlines, and has received coaching from the project manager twice. The behavior has not changed.',
    question: 'What should the project manager do NEXT?',
    options: [
      'Continue coaching and give the team member more time',
      'Immediately remove the team member from the project',
      'Document the pattern, escalate to the functional manager and HR, and initiate a formal performance improvement process',
      'Reassign the team member\'s work to other team members without formal action'
    ],
    correct: 2,
    explanation: 'After multiple coaching attempts without improvement, the PM should escalate through proper channels — involving HR and the functional manager in a formal performance improvement plan (PIP). This protects the project, is fair to the team member (providing clear expectations and consequences), and follows organizational procedures. Continuing to tolerate the behavior is unfair to the rest of the team. Immediate removal without due process is not appropriate at this stage.'
  },
  {
    domain: 'People',
    scenario: 'A project manager is asked to lead a team of highly experienced technical experts who have deep domain knowledge that exceeds the PM\'s technical expertise.',
    question: 'What leadership approach is MOST appropriate?',
    options: [
      'Develop technical expertise quickly to gain credibility with the team',
      'Adopt a servant leadership approach — removing obstacles, providing resources, facilitating decisions, and leveraging the team\'s expertise',
      'Establish authority clearly so the experts understand who is in charge',
      'Delegate all decisions to the most senior technical expert'
    ],
    correct: 1,
    explanation: 'The PM does not need to be the technical expert on every project. When leading highly skilled professionals, servant leadership is most effective: understand their needs, remove impediments, facilitate the right environment for them to succeed, and trust their expertise. The PM adds value through facilitation, stakeholder management, scheduling, risk management, and organizational navigation — not technical direction. This is consistent with PMI\'s Servant Leader model and situational leadership theory.'
  },
  {
    domain: 'People',
    scenario: 'A team is working on a very tight schedule. A team member informs the PM that they have a personal crisis requiring time off, but this will impact a critical deliverable.',
    question: 'What should the project manager do?',
    options: [
      'Tell the team member they must stay until the deliverable is completed',
      'Support the team member\'s need for time off, assess the project impact, and explore coverage options (redistributing work, cross-training) to minimize disruption',
      'Remove the team member from the project to get someone available',
      'Ask the team member to work remotely during their personal crisis'
    ],
    correct: 1,
    explanation: 'PMBOK 7 Principle #1 (Stewardship) includes caring for people — team members are not just resources. The PM should respond compassionately while also being responsible to the project. This means supporting the leave, assessing impact honestly, and finding creative solutions. Forcing someone to work through a personal crisis leads to poor performance and permanent damage to the relationship. The PM\'s role is to solve both the human and project problem — not choose one over the other.'
  },
  {
    domain: 'People',
    scenario: 'A project manager receives feedback from team members that team meetings are too long, unproductive, and not action-oriented. People are checking their phones throughout.',
    question: 'What should the project manager do to improve meetings?',
    options: [
      'Shorten meetings to 15 minutes regardless of topics',
      'Require phones to be locked away during meetings',
      'Evaluate which meetings are necessary, use structured agendas, assign time boxes to each topic, document decisions and action items, and end meetings early when objectives are met',
      'Switch to email updates instead of meetings'
    ],
    correct: 2,
    explanation: 'Effective meeting management is a core PM skill. The solution is structure and purpose: every meeting needs a clear objective, agenda, time limits per topic, defined attendees, and documented outcomes. Phones are a symptom of disengagement — fixing engagement fixes the symptom. Arbitrary time limits or switching entirely to async communication each have tradeoffs. The PM should assess meeting value and redesign them systematically. This reflects communication management best practices.'
  },
  {
    domain: 'People',
    scenario: 'A project sponsor tells the project manager that they will be unavailable for the next month due to a corporate merger. The sponsor is the primary decision authority for scope changes and funding approvals.',
    question: 'What should the project manager do?',
    options: [
      'Put the project on hold until the sponsor returns',
      'Make all required decisions independently during the sponsor\'s absence',
      'Clarify and document the decision-making authority during the absence, identify a delegate, and establish an escalation process for critical decisions',
      'Inform stakeholders that no decisions can be made for a month'
    ],
    correct: 2,
    explanation: 'Decision-making continuity is critical for project progress. The PM should work with the sponsor before their absence to: identify who holds delegated authority, define what decisions need escalation vs. PM authority, and establish emergency contact protocols. Documenting this protects the PM and keeps the project moving. Putting the project on hold or making unauthorized decisions both create risk. This is proactive governance planning.'
  },
  {
    domain: 'People',
    scenario: 'A project manager notices that two team members who previously worked well together now avoid each other and communicate only through formal written channels, creating a rift that slows collaboration.',
    question: 'What should the project manager do?',
    options: [
      'Separate the two team members into different work streams permanently',
      'Ignore it since it has not yet affected deliverables',
      'Have individual conversations with each person to understand the issue, then facilitate a mediated conversation to address it if appropriate',
      'Ask other team members to mediate'
    ],
    correct: 2,
    explanation: 'Interpersonal conflicts that change behavior patterns will eventually affect project performance. The PM should proactively address it before it escalates. Individual conversations first build trust and surface each person\'s perspective privately. A facilitated mediation — focused on the impact on project work, not personal grievances — can restore functional collaboration. Permanent separation doesn\'t address root causes. Ignoring it allows the problem to grow. This is collaborative conflict resolution.'
  },
  {
    domain: 'People',
    scenario: 'A project manager is taking over a project from a previous PM who had a very directive leadership style. The team is highly capable and experienced but has been accustomed to being told what to do.',
    question: 'What should the project manager do to transition the team toward greater autonomy?',
    options: [
      'Immediately adopt a fully delegative approach and let the team self-manage',
      'Continue the directive approach since the team is used to it',
      'Gradually shift leadership style — starting with clearer direction and explanation, then progressively increasing autonomy as the team builds confidence in self-direction',
      'Hire external consultants to teach the team how to self-manage'
    ],
    correct: 2,
    explanation: 'Situational leadership (Hersey & Blanchard) tells us to adapt leadership style based on team readiness. A team capable but conditioned to direction needs a gradual transition — first explaining WHY decisions are made (coaching/supporting), then progressively delegating as confidence grows. Jumping immediately to full delegation ignores the psychological transition needed. Maintaining full directive leadership foregoes the efficiency of empowered teams. Gradual empowerment with support is the approach.'
  },
  {
    domain: 'People',
    scenario: 'A project manager must negotiate with another project manager in the same organization for shared resources. Both projects have high priority and both need the same specialized engineer.',
    question: 'What is the BEST negotiation approach?',
    options: [
      'Whoever escalates to senior management first gets the resource',
      'Split the resource 50-50 regardless of project needs',
      'Focus on understanding both projects\' actual needs and constraints, and find a creative solution (phased sharing, prioritized weeks, identifying a comparable alternative)',
      'Refuse to share the resource since your project was scheduled first'
    ],
    correct: 2,
    explanation: 'Interest-based negotiation (Fisher & Ury\'s principled negotiation) focuses on underlying needs rather than positional demands. By understanding when each project critically needs the engineer, a phased schedule, alternating weeks, or identifying a comparable alternative often satisfies both parties. Immediate escalation damages the relationship and burdens senior management with decisions that should be resolved at the PM level. Rigid 50-50 splits may satisfy neither project\'s actual need.'
  },

// ─────────────────────────── PROCESS DOMAIN ───────────────────────────

  {
    domain: 'Process',
    scenario: 'A project manager is starting a new project. The project charter has been approved. The PM wants to ensure all stakeholders are properly identified before planning begins.',
    question: 'Which document should the project manager create FIRST?',
    options: [
      'Risk Register',
      'Stakeholder Register',
      'Project Management Plan',
      'Work Breakdown Structure'
    ],
    correct: 1,
    explanation: 'Stakeholder identification is the very first planning activity because all subsequent processes (requirements gathering, communications planning, risk identification) depend on knowing who the stakeholders are. The Stakeholder Register captures their identification, assessment, and classification. You cannot plan communications without knowing who to communicate with, or gather requirements without knowing who provides them. The Project Management Plan comes later, after stakeholders and requirements are identified.'
  },
  {
    domain: 'Process',
    scenario: 'A project team discovers during execution that a critical path activity has an unknown predecessor that was not captured during planning. This creates a 4-week gap that cannot be easily resolved.',
    question: 'What should the project manager do?',
    options: [
      'Request a scope reduction to compensate for the time loss',
      'Perform a schedule impact analysis, update the project schedule and critical path, assess recovery options, and submit a change request if the baseline must change',
      'Absorb the delay within the project reserves without informing stakeholders',
      'Blame the planning team and escalate to the PMO'
    ],
    correct: 1,
    explanation: 'Discovering new predecessors changes the network logic and critical path. The PM should: (1) analyze the full schedule impact, (2) update the schedule model, (3) identify recovery options (compression, scope trade-offs), (4) if the baseline cannot be maintained, submit a formal change request through Integrated Change Control. Using reserves without informing stakeholders about a fundamental schedule change is inappropriate. The change control process ensures all impacts are communicated and approved.'
  },
  {
    domain: 'Process',
    scenario: 'A project is using a waterfall approach. The project manager is developing the WBS. A team member suggests including project management activities as a WBS component.',
    question: 'Is this appropriate, and why?',
    options: [
      'No — project management is not a deliverable and should not be in the WBS',
      'Yes — project management activities are legitimate deliverables of the project and should be represented in the WBS',
      'Only if the project is over $1 million',
      'No — project management activities are in the Project Management Plan, not the WBS'
    ],
    correct: 1,
    explanation: 'The WBS should include ALL project work, including project management work. PMBOK explicitly states that project management is a deliverable component and should be included in the WBS. This allows project management effort and cost to be estimated, budgeted, and tracked like any other deliverable. Excluding it understates the project\'s total effort. The WBS decomposes the total scope of work — and managing the project is work that consumes resources.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is estimating a new project with very limited historical data. Several activities have never been done before by this organization. The project involves new technology.',
    question: 'Which estimation technique is MOST appropriate?',
    options: [
      'Analogous estimating based on similar historical projects',
      'Parametric estimating using productivity rates',
      'Three-point estimating (PERT) using optimistic, pessimistic, and most likely estimates from experts',
      'Bottom-up estimating using a detailed WBS'
    ],
    correct: 2,
    explanation: 'Three-point estimating (PERT) is specifically designed for high-uncertainty activities. By capturing optimistic (O), most likely (M), and pessimistic (P) estimates from subject matter experts, the technique acknowledges uncertainty explicitly: Expected = (O + 4M + P)/6. This produces statistically grounded estimates for unprecedented work. Analogous estimating requires similar historical projects (not available here). Parametric requires established productivity rates. Bottom-up requires enough understanding for detailed decomposition, which may not exist yet.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager receives a change request during execution that would add new features to the software but the requester claims it does not affect scope since it is "just an enhancement."',
    question: 'What should the project manager do?',
    options: [
      'Agree that enhancements are not scope changes and allow the work to proceed',
      'Evaluate the change through the Integrated Change Control process regardless of how it is labeled, assessing impact on all project constraints',
      'Reject it since the baseline is already approved',
      'Implement it immediately since it will increase stakeholder satisfaction'
    ],
    correct: 1,
    explanation: 'Any change to project deliverables — regardless of how it is labeled — constitutes a scope change and must go through Perform Integrated Change Control (Process 4.6). "Enhancement" is a framing, not a technical determination. The PM must assess the impact on scope, schedule, cost, quality, resources, and risk. Only the CCB (or authorized decision-maker) can approve changes to the approved baseline. Unilateral acceptance of unauthorized work creates scope creep and undermines project control.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is developing the project schedule. The project has 50 activities. After creating the network diagram, the critical path has 0 days of total float.',
    question: 'What does this mean for the project?',
    options: [
      'The project is on schedule and has no risk',
      'Every critical path activity must finish on time; any delay on these activities directly delays the project end date',
      'The project has excess capacity that can be reallocated',
      'The project can finish early since there is no float to use up'
    ],
    correct: 1,
    explanation: 'Total float (also called slack) of 0 on the critical path means there is no scheduling flexibility. Any delay to any critical path activity directly delays the project\'s planned finish date by the same amount. This is the definition of the critical path — the longest path through the network with zero float. The PM should focus monitoring and control attention on critical path activities and ensure risks to these activities have mitigation plans. Non-critical activities have positive float and can absorb some delay.'
  },
  {
    domain: 'Process',
    scenario: 'A project has BAC = $300,000, AC = $180,000, EV = $150,000, and PV = $200,000. A stakeholder asks whether the project will finish within its original budget.',
    question: 'What should the project manager report, including the EAC?',
    options: [
      'Yes, the project is on track; EAC = $300,000',
      'No, the project is over budget; EAC = $360,000',
      'Yes, but barely; EAC = $310,000',
      'The project is on budget but behind schedule; EAC = $300,000'
    ],
    correct: 1,
    explanation: 'CPI = EV/AC = $150K/$180K = 0.833 (over budget). SPI = EV/PV = $150K/$200K = 0.75 (behind schedule). EAC = BAC/CPI = $300,000/0.833 = $360,000. The project is both over budget AND behind schedule. The EAC forecast indicates the final cost will exceed the original budget by $60,000 (20% overrun) if current performance continues. The PM should report this honestly and present corrective actions to improve the CPI.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is about to start the Risk Identification process. The project team has not done a formal risk identification before.',
    question: 'Which of the following is the MOST comprehensive approach to risk identification?',
    options: [
      'Have the project manager create the risk register alone based on experience',
      'Use a combination of brainstorming with the project team, expert interviews, review of historical project records, assumption analysis, and SWOT analysis',
      'Review only the project charter for potential risks',
      'Ask the project sponsor to identify the top three risks'
    ],
    correct: 1,
    explanation: 'Comprehensive risk identification uses multiple techniques: brainstorming captures team insights; expert interviews leverage experience; historical records reveal patterns from similar projects; assumption analysis surfaces hidden risks embedded in planning assumptions; SWOT analysis identifies threats and opportunities from a strategic lens. No single technique is sufficient alone. The PM should leverage the collective intelligence of the team and experts, not rely on one source. Risks identified by only one person miss team and stakeholder perspectives.'
  },
  {
    domain: 'Process',
    scenario: 'A construction project is behind schedule by 2 weeks on the critical path. The project manager is considering schedule compression. Adding resources to the schedule-critical tasks would cost an additional $40,000.',
    question: 'What schedule compression technique is this, and when is fast-tracking preferable?',
    options: [
      'This is fast-tracking; fast-tracking is preferable when activities can be overlapped without increasing cost',
      'This is crashing; fast-tracking is preferable when activities can be performed in parallel without significantly increasing project risk',
      'This is resource leveling; crashing is always preferable',
      'This is crashing; fast-tracking is preferable when the budget cannot absorb additional cost'
    ],
    correct: 3,
    explanation: 'Adding resources to compress the schedule is crashing. Crashing always increases cost. Fast-tracking overlaps activities that were originally planned sequentially — it doesn\'t add cost but increases risk (rework if upstream changes affect downstream). When budget is constrained, fast-tracking is preferable if the activities can logically be overlapped. However, fast-tracking increases coordination complexity and rework risk. The PM should evaluate both options based on cost, risk tolerance, and the specific activities involved.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager has been asked to estimate a project\'s duration. The project sponsor needs a single number for a board presentation.',
    question: 'What should the project manager do?',
    options: [
      'Provide the most likely duration without any qualifier',
      'Provide a range estimate with confidence intervals and document the assumptions and constraints',
      'Refuse to estimate until detailed planning is complete',
      'Use the optimistic estimate to create a positive impression'
    ],
    correct: 1,
    explanation: 'Honest, transparent estimation is a PMI ethical obligation. Early estimates inherently have wide ranges (Cone of Uncertainty). Providing a single number without context implies false precision. The PM should provide a range with confidence levels: "Based on current information, 8-12 months with medium confidence." Document key assumptions and what would change the estimate. Using the optimistic estimate creates unrealistic expectations and future credibility problems. Range estimates enable better decision-making and set honest expectations.'
  },
  {
    domain: 'Process',
    scenario: 'A quality audit reveals that a significant percentage of deliverables from one vendor do not meet the specified acceptance criteria. The vendor has been contracted using a fixed-price contract.',
    question: 'What should the project manager do?',
    options: [
      'Accept the deliverables since a fixed-price contract protects the buyer',
      'Terminate the vendor contract immediately',
      'Formally document the non-conformance, notify the vendor in writing referencing contract terms, and require corrective action within a defined timeframe',
      'Accept partial payment to the vendor for the non-conforming deliverables'
    ],
    correct: 2,
    explanation: 'Quality management requires formal documentation and enforcement of contract terms. The PM must: (1) document non-conforming work officially, (2) communicate the issue to the vendor in writing referencing specific contract requirements, (3) define a corrective action timeline, (4) note consequences for continued non-conformance. This creates a formal record, protects the buyer\'s legal position, and gives the vendor a fair opportunity to correct. Accepting non-conforming work waives the contract rights. Termination is a last resort.'
  },
  {
    domain: 'Process',
    scenario: 'A project team is building a system where defects cost $50 to fix during development, $500 during testing, and $5,000 in production. The project manager proposes increasing QA investment during development.',
    question: 'What PMI quality concept supports this approach?',
    options: [
      'Gold Plating',
      'Cost of Conformance — the cost of prevention is far less than the cost of failure',
      'Quality Control — testing more thoroughly increases costs proportionally',
      'Continuous improvement — defects should be fixed iteratively after release'
    ],
    correct: 1,
    explanation: 'The Cost of Quality framework distinguishes between: (1) Cost of Conformance — prevention costs (design quality in) and appraisal costs (testing); and (2) Cost of Non-Conformance — internal failure (fixing before delivery) and external failure (fixing after delivery). PMI data consistently shows: prevent > inspect > fix. Investing in prevention (design reviews, automated testing, code reviews) dramatically reduces the expensive external failures. The tenfold cost escalation from dev → test → production demonstrates why shifting left quality investment is cost-effective.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is developing the communications management plan. The project has 15 stakeholders with varying needs and preferences.',
    question: 'What formula shows the number of communication channels, and what does it imply?',
    options: [
      'n × (n-1) — each person communicates with everyone else twice, so 15 stakeholders = 210 channels',
      'n × (n-1) / 2 — 15 stakeholders = 105 channels; the PM must actively manage this complexity',
      'n² — 15 stakeholders = 225 channels',
      'n/2 — 15 stakeholders = 7.5 channels (rounded to 8)'
    ],
    correct: 1,
    explanation: 'The communication channels formula is n × (n-1) / 2, where n = number of people. For 15 stakeholders: 15 × 14 / 2 = 105 potential channels. This demonstrates why communication management becomes exponentially more complex as team/stakeholder size grows. Adding just one person to a 15-person project adds 15 new channels. The PM must proactively manage this complexity through a communications management plan — defining who communicates with whom, when, how, and with what level of formality.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is managing a project with multiple vendors. One vendor\'s contract is a Cost-Plus-Incentive-Fee (CPIF) contract. The vendor claims additional expenses that were not originally planned.',
    question: 'What is the MAIN risk to the buyer in a CPIF contract, and how should the PM respond to the claim?',
    options: [
      'CPIF contracts shift all risk to the vendor; the claim should be rejected',
      'CPIF contracts allow the buyer to audit vendor costs; verify the claimed costs against contract terms before approving payment',
      'CPIF contracts have a fixed price ceiling so the buyer is protected; approve the claim within the ceiling',
      'CPIF contracts have no incentive mechanism; negotiate a new contract'
    ],
    correct: 1,
    explanation: 'In Cost-Plus contracts, the buyer bears significant cost risk since they reimburse actual costs. CPIF contracts share cost savings through an incentive fee structure but don\'t cap costs like FPIF. The buyer\'s remedy is rigorous cost oversight: auditing vendor cost records, verifying that claimed costs are allowable, allocable, and reasonable per contract terms. The PM should require supporting documentation, verify against contract allowables, and only approve legitimate costs. Unchecked cost-plus claims can substantially exceed budgets.'
  },
  {
    domain: 'Process',
    scenario: 'A risk identified during planning has materialized. It was a risk with High probability and High impact that was accepted because no effective mitigation was available. The risk event has caused a 3-week schedule delay.',
    question: 'What should the project manager do?',
    options: [
      'Add it back to the risk register as a new risk',
      'Implement the contingency plan that was developed when the risk was accepted, and update the risk register to reflect the risk\'s actualization',
      'Immediately submit a change request for additional time',
      'Inform stakeholders and wait to see if the impact worsens before acting'
    ],
    correct: 1,
    explanation: 'When a risk event occurs, the PM should execute the contingency plan (the pre-planned response to an accepted risk). "Acceptance" as a risk response strategy still requires a contingency plan for high-impact risks — either active acceptance (contingency plan) or passive acceptance (accept consequences). The risk register should be updated to show the risk as "occurred" rather than "active risk." If the contingency plan requires additional resources or budget, a formal change request may follow. The PM should not improvise a response without executing the planned contingency.'
  },
  {
    domain: 'Process',
    scenario: 'During a project performance review, the project manager presents a control chart showing that process output has been consistently above the upper control limit for the past 12 data points.',
    question: 'What should the project manager do?',
    options: [
      'No action is needed since the data is above the control limit, not below it',
      'This is normal variation — continue monitoring',
      'Investigate the root cause of the consistent out-of-control condition and implement corrective action',
      'Expand the control limits to accommodate the new performance level'
    ],
    correct: 2,
    explanation: 'Control charts show both upper and lower control limits (UCLs and LCLs) as statistical boundaries for normal process variation. Consistently above the UCL (or below the LCL) indicates an out-of-control condition — a systematic, non-random cause. The Rule of Seven states that 7+ consecutive points on one side of the mean signals a special cause, even if within limits. 12 points above UCL is clearly a special cause requiring root cause analysis and corrective action. Expanding limits masks the problem and abandons quality control.'
  },
  {
    domain: 'Process',
    scenario: 'A project team using Scrum has been tracking velocity over 8 sprints. The average velocity is 42 story points but the range varies from 28 to 58. The PM wants to set a sprint capacity for the next 6 sprints.',
    question: 'What is the BEST approach for setting capacity?',
    options: [
      'Use the highest velocity sprint (58 points) as the target to maximize output',
      'Use the average velocity (42 points) adjusted for known capacity changes (vacations, new team members, sprint 1 learning effects)',
      'Use the lowest velocity (28 points) as a conservative estimate',
      'Ask the development team to commit to the maximum they can handle each sprint'
    ],
    correct: 1,
    explanation: 'Velocity-based planning uses historical averages as the foundation, adjusted for known capacity changes: vacations, holidays, new team members (who reduce initially), team attrition, and known sprint risks. Using the maximum creates unrealistic commitments and sprint failures. Using the minimum is unnecessarily conservative and wastes capacity. The team\'s commitment should be based on their capacity assessment — not a number imposed externally. This enables sustainable, predictable delivery.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is documenting requirements for a new enterprise system. There are 22 stakeholders from 6 departments with conflicting requirements.',
    question: 'Which requirements collection technique is BEST for resolving conflicting requirements among many stakeholders?',
    options: [
      'Individual interviews with each stakeholder separately',
      'Requirements questionnaires sent to all stakeholders simultaneously',
      'Joint Application Design (JAD) / facilitated workshops bringing conflicting stakeholders together to reach consensus',
      'Document analysis of each department\'s existing system requirements'
    ],
    correct: 2,
    explanation: 'Facilitated workshops (JAD sessions) are specifically designed to bring stakeholders with conflicting requirements together to build shared understanding and reach consensus. Face-to-face facilitation enables negotiation, clarification, and compromise that asynchronous methods cannot. Individual interviews capture each person\'s view but don\'t resolve conflicts. Questionnaires are good for data gathering but not conflict resolution. Document analysis reveals existing needs but doesn\'t address stakeholder conflicts.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager notices that stakeholder engagement levels are declining. The Stakeholder Engagement Assessment Matrix shows most stakeholders have moved from "Supportive" to "Neutral."',
    question: 'What should the project manager do?',
    options: [
      'Accept the neutral stance — it means stakeholders are not opposed to the project',
      'Investigate the root causes of declining engagement, adjust the stakeholder engagement strategy, and increase targeted communication and involvement',
      'Escalate to the project sponsor to directly engage the disengaged stakeholders',
      'Remove neutral stakeholders from the communication plan to focus resources'
    ],
    correct: 1,
    explanation: 'Moving from Supportive to Neutral is an early warning sign — stakeholders may be transitioning toward resistance if their needs aren\'t being addressed. The PM should investigate why: Have stakeholders\' needs changed? Are they receiving insufficient information? Are concerns being ignored? The engagement strategy should be updated to proactively address root causes. Neutral stakeholders can quickly become resisters. The sponsor can support but should not replace the PM\'s engagement responsibility. Removing stakeholders from communications creates blind spots.'
  },
  {
    domain: 'Process',
    scenario: 'A project is completed and the project manager is preparing the final project report. The PM realizes that several original project requirements were not formally closed out and accepted by the customer.',
    question: 'What should the project manager do?',
    options: [
      'Close the project anyway since the work is done',
      'Obtain formal written acceptance from the customer for all deliverables before closing the project',
      'Document that requirements were completed and close the project',
      'Ask the project sponsor to accept on behalf of the customer'
    ],
    correct: 1,
    explanation: 'Validate Scope (PMBOK 6, Process 5.5) requires formal, written customer acceptance of each deliverable. This is critical for: (1) establishing that contract obligations are fulfilled, (2) protecting the performing organization against future claims, (3) triggering payment milestones in many contracts. The PM must obtain this documentation before project closure. The project sponsor cannot accept deliverables on behalf of the customer — the customer\'s representative must acknowledge receipt and acceptance. This is a contractual and governance requirement.'
  },
  {
    domain: 'Process',
    scenario: 'During project execution, actual costs are consistently running 15% below what was planned. The project manager believes this is because the estimates were too conservative.',
    question: 'What should the project manager do with this information?',
    options: [
      'Continue spending below budget — under-spending is always positive',
      'Investigate whether under-spending reflects fewer activities being completed (slow progress) or truly lower costs than expected, then update the forecast accordingly',
      'Return the unspent budget to the organization immediately',
      'Report only the positive cost performance and ignore the potential schedule impact'
    ],
    correct: 1,
    explanation: 'Under-spending alone is not necessarily good — it could mean less work was accomplished than planned (low SPI), not that the project is efficient. The PM must correlate cost performance with scope performance: Is EV tracking close to PV? If CPI is high but SPI is low, the project is efficient but behind schedule. The PM should update the forecasts (ETC, EAC), investigate root causes, and report the complete picture. Reporting only positive metrics without context is misleading — a PMI ethics violation.'
  },
  {
    domain: 'Process',
    scenario: 'A project is in the closing phase. The PM wants to ensure organizational knowledge is properly captured for future projects.',
    question: 'Which output BEST captures this organizational knowledge?',
    options: [
      'Project Management Plan',
      'Final Project Report',
      'Lessons Learned Register added to the Organizational Process Assets',
      'Risk Register'
    ],
    correct: 2,
    explanation: 'Lessons Learned (PMBOK 7) / Lessons Learned Register (PMBOK 6) is the primary vehicle for organizational knowledge transfer. Adding lessons learned to Organizational Process Assets (OPAs) makes them available to future project managers. PMBOK 7 specifically emphasizes knowledge stewardship through the Lessons Learned Register. The Final Project Report summarizes project performance but lessons learned provides the actionable insights. Lessons should be captured throughout the project, not just at closing, but the closing process ensures comprehensive documentation.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is preparing a make-or-buy analysis for a specialized software component. The in-house team estimates 1,500 hours at $85/hour. A vendor quotes $95,000 fixed price.',
    question: 'Based on cost alone, what should the project manager recommend?',
    options: [
      'Make it — the in-house team is cheaper',
      'Buy it — the vendor is cheaper',
      'Buy it — the fixed price also transfers cost risk to the vendor',
      'There is not enough information to make a recommendation'
    ],
    correct: 2,
    explanation: 'In-house cost: 1,500 hours × $85/hour = $127,500. Vendor cost: $95,000. The vendor is cheaper by $32,500. Additionally, a fixed-price contract transfers cost risk to the vendor — if the work takes longer, the vendor absorbs the overrun, not the buyer. Make-or-buy analysis should also consider: quality capability, capacity, confidentiality, strategic value, and timeline — but on cost and risk transfer alone, buying is preferable. PMI\'s make-or-buy analysis is a procurement management tool and part of Plan Procurement Management.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is developing a project schedule and must decide between the Critical Path Method (CPM) and Critical Chain Method (CCM).',
    question: 'What is the KEY difference, and when would CCM be preferred?',
    options: [
      'CPM uses resource leveling; CCM does not — use CPM when resources are constrained',
      'CCM explicitly manages resource constraints and uses project buffers instead of task-level padding; preferred when resource contention is high and student syndrome/Parkinson\'s Law are concerns',
      'CPM is for waterfall projects; CCM is for agile projects',
      'CCM uses probability distributions for task estimates; CPM does not — use CCM when uncertainty is high'
    ],
    correct: 1,
    explanation: 'Critical Chain Method (CCM) extends CPM by: (1) removing task-level safety (assuming individual estimates include padding) and consolidating it into project and feeding buffers; (2) explicitly scheduling based on resource constraints; (3) preventing student syndrome (procrastination) and Parkinson\'s Law (work expanding to fill time). CCM is particularly valuable when: resources are shared across activities/projects, there is high student syndrome risk, and traditional CPM consistently produces late projects despite adequate individual float.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager needs to report project status to a diverse group of stakeholders including executives, technical team members, and end users.',
    question: 'What is the BEST approach to status reporting?',
    options: [
      'Send the same detailed technical report to all stakeholders',
      'Tailor the content, level of detail, and format of status reports to each stakeholder group\'s needs and interests',
      'Send a one-page summary to all stakeholders to avoid inconsistency',
      'Allow stakeholders to request the type of report they want each time'
    ],
    correct: 1,
    explanation: 'Effective communication requires tailoring messages to the audience. Executives need high-level status, key decisions, and strategic implications. Technical teams need detailed technical progress, risks, and dependencies. End users need updates on features and timelines that affect them. The communications management plan should define the right content, format, frequency, and channel for each stakeholder group. A one-size-fits-all approach either overwhelms or under-informs. This reflects PMBOK\'s communications management principles.'
  },
  {
    domain: 'Process',
    scenario: 'A project is using agile. During sprint planning, the team disagrees on the relative size of several user stories. The discussion is taking over an hour with no resolution.',
    question: 'What estimation technique should the team use, and why?',
    options: [
      'Have the project manager estimate all stories based on experience',
      'Use Planning Poker — each team member estimates independently then discusses differences to reach consensus efficiently',
      'Average each person\'s estimates to avoid further discussion',
      'Skip estimation and start the sprint to learn actual velocity'
    ],
    correct: 1,
    explanation: 'Planning Poker is specifically designed to efficiently reach team consensus on relative estimates while leveraging collective team knowledge. Each person estimates independently (preventing anchoring bias), then simultaneously reveals their estimate. Differences trigger discussion that surfaces assumptions and complexity that one person might miss. The simultaneous reveal is critical — if estimates differ, the highest and lowest estimators explain their reasoning, quickly surfacing key unknowns. Averaging suppresses important outlier perspectives that reveal real complexity.'
  },
  {
    domain: 'Process',
    scenario: 'A project is in its final sprint. During the sprint review, the product owner realizes that a key feature meets all the acceptance criteria specified but does not actually satisfy the user\'s underlying need.',
    question: 'What does this situation illustrate, and what should happen?',
    options: [
      'This is the team\'s fault for not understanding requirements — they should fix it for free',
      'This is the product owner\'s fault for poor acceptance criteria — the sprint should be considered successful',
      'The acceptance criteria were incomplete — the PO and team should create a new story to address the actual user need and decide whether it\'s in scope or a new project',
      'The feature should be released as-is since it meets the documented criteria'
    ],
    correct: 2,
    explanation: 'This illustrates the difference between defined requirements and stakeholder needs — a classic validation vs. verification issue. The feature verified correctly against criteria but didn\'t validate against actual user need. The remedy: create a new user story capturing the actual need, have the PO prioritize it against the backlog, and decide if it fits within the current project or becomes a future enhancement. The sprint was technically successful against its criteria. Blame is unproductive — the Agile process of iterative learning and adaptation is working as intended.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is 70% through a project. The EAC calculated using BAC/CPI method is significantly higher than the EAC calculated using AC + ETC method. The PM must present to the steering committee.',
    question: 'What should the project manager do regarding the two different EAC figures?',
    options: [
      'Present the lower EAC to create a more positive impression',
      'Present the higher EAC as the worst-case scenario',
      'Present both EAC figures with their underlying assumptions, explain what each represents, and recommend the most credible forecast based on current performance trends',
      'Average the two EAC figures'
    ],
    correct: 2,
    explanation: 'Different EAC formulas represent different assumptions about future performance: BAC/CPI assumes current inefficiency continues (EAC = BAC / CPI); AC + ETC assumes future work will be performed at the remaining budget rate. The PM should transparently present both with their assumptions and recommend the most credible one based on project realities. PMI\'s ethics require honest, complete reporting. Selecting the favorable number alone is misleading. Averaging without explanation is statistically meaningless.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager realizes that the project\'s resource management plan does not address what happens when key resources become unavailable mid-project.',
    question: 'What should the project manager do?',
    options: [
      'Wait until a key resource becomes unavailable and then deal with it',
      'Update the resource management plan to include succession plans, cross-training strategies, and escalation procedures for critical resource loss',
      'Add a risk to the register that a key resource may leave and accept the risk',
      'Hire backup resources preemptively for all critical roles'
    ],
    correct: 1,
    explanation: 'Resource risk is a significant project risk that should be proactively planned for. The resource management plan should address: cross-training to create redundancy, documentation of key knowledge, succession plans for critical roles, and escalation procedures. Simply accepting the risk without contingency plans for a HIGH-impact risk is inadequate. Preemptive hiring of backups is cost-prohibitive and impractical. Updating the plan with specific mitigation measures reflects proactive risk management integrated into resource planning.'
  },
  {
    domain: 'Process',
    scenario: 'A project scope statement says the project will deliver a "high-quality report." During execution, the customer and PM disagree on what "high-quality" means, causing a dispute.',
    question: 'What should have been done during planning to prevent this?',
    options: [
      'The project charter should have defined quality standards',
      'Quality metrics and acceptance criteria should have been explicitly defined in the project scope statement with measurable thresholds',
      'The customer should have provided a quality standard template',
      'The project manager should have assumed the customer\'s standard and proceeded'
    ],
    correct: 1,
    explanation: 'Ambiguous quality descriptors like "high-quality" are a planning failure. The scope statement must define quality requirements with specific, measurable acceptance criteria — not subjective descriptors. For a report: "The report shall include executive summary, financial analysis, and recommendations. All data shall be sourced from verified databases. The report shall pass internal review without more than 3 revision requests." Vague scope creates disputes during execution. PMBOK emphasizes measurable acceptance criteria in scope and quality planning.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager receives a request to add a new feature that the development team considers technically trivial. The team wants to implement it immediately without a change request.',
    question: 'What should the project manager do?',
    options: [
      'Allow the team to implement it since the technical effort is minimal',
      'Require a formal change request regardless of perceived effort size, to properly document and approve the change',
      'Implement it but note it informally in the status report',
      'Ask the product owner to add it to the backlog for the next sprint without a change request'
    ],
    correct: 1,
    explanation: 'Scope changes cannot be approved based on perceived effort. Even "trivial" changes affect the scope baseline, may have unexpected downstream effects, require testing, documentation updates, and potentially affect other deliverables. More importantly, allowing informal scope additions — regardless of size — normalizes scope creep and erodes the project\'s control structure. The change request process ensures proper tracking, documentation, and approval, even for small changes. In agile, this would be added to the backlog through the Product Owner.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is planning procurement for specialized equipment. The requirement is highly technical and only two vendors in the market can supply it. The PM is drafting a procurement document.',
    question: 'Which procurement document is MOST appropriate given the limited vendor pool?',
    options: [
      'Invitation for Bid (IFB) — to get competitive pricing',
      'Request for Proposal (RFP) — to evaluate technical capability, approach, and price from both vendors',
      'Request for Quotation (RFQ) — to compare standardized pricing',
      'Letter of Intent (LOI) — to immediately commit to one vendor'
    ],
    correct: 1,
    explanation: 'When the requirement is technically complex and only two vendors qualify, an RFP is most appropriate. Unlike an IFB (price only) or RFQ (commodity pricing), an RFP evaluates the vendor\'s proposed approach, technical capability, management plan, and price — allowing an informed selection of the best value, not just the lowest price. With only two vendors, technical differentiation and approach matter as much as price. The PM needs to understand HOW each vendor would solve the problem, not just what they would charge.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager identifies that several team members are consistently working on non-project tasks during project hours, reducing their effective availability. The resource management plan assumed 80% availability.',
    question: 'What should the project manager do?',
    options: [
      'Document the availability gap and adjust the schedule accordingly',
      'Report the issue to HR for performance management',
      'Investigate the root cause, discuss with team members and their functional managers, update resource availability assumptions in the plan, and assess schedule impact',
      'Increase the number of team members to compensate for lost availability'
    ],
    correct: 2,
    explanation: 'Resource availability assumptions are foundational to schedule and cost planning. If actual availability differs from the plan, the PM must: understand why (organizational culture, competing priorities, unclear guidance), address the root cause (clarifying expectations with functional managers), update the resource management plan with accurate availability, and re-baseline if necessary. Adding more people without addressing the root cause may just create more unavailable people. This is resource management and integrated change control combined.'
  },
  {
    domain: 'Process',
    scenario: 'An agile project team has been asked to add automated testing to their Definition of Done (DoD). Some team members resist, saying it adds effort to each story.',
    question: 'What is the BEST response?',
    options: [
      'Make automated testing optional to respect team autonomy',
      'Override the team\'s resistance and mandate automated testing',
      'Facilitate a retrospective discussion on the long-term cost of technical debt from inadequate testing versus the short-term effort of adding automation to DoD',
      'Add automated testing only for high-priority stories'
    ],
    correct: 2,
    explanation: 'The DoD is the team\'s quality agreement — changing it requires team buy-in for it to be genuinely adopted. Facilitated discussion using data (cost of bugs found late, time spent on regression testing, deployment failures) typically persuades teams that investing in automation early reduces total effort. Mandating without understanding creates superficial compliance. Making it optional creates inconsistency. Restricting to high-priority stories is a partial measure that creates coverage gaps. Sustainable quality improvement requires team understanding and ownership.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is developing the project schedule using the Precedence Diagramming Method (PDM). One activity, "Concrete Curing," requires a 28-day wait after the previous activity before the next activity can start.',
    question: 'How should this be represented in the PDM?',
    options: [
      'Add a separate activity called "Wait 28 Days" in the network',
      'Use a Finish-to-Start (FS) dependency with a 28-day lag',
      'Use a Start-to-Start (SS) dependency with a 28-day lead',
      'Use a Finish-to-Finish (FF) dependency with no lag'
    ],
    correct: 1,
    explanation: 'A lag is a positive time delay imposed on a dependency. For concrete that must cure 28 days before the next activity starts, the appropriate representation is a Finish-to-Start dependency with a 28-day lag: Activity B cannot start until Activity A finishes AND 28 days have elapsed. This is preferable to adding a dummy "wait" activity because the lag is a scheduling constraint, not work. Lags are legitimate schedule parameters in CPM that accurately represent mandatory waiting periods (curing, drying, approvals, regulatory review).'
  },
  {
    domain: 'Process',
    scenario: 'During project monitoring, the project manager notices that the actual defect rates from quality inspections are consistently below the quality plan\'s targets. The team is spending less time on rework.',
    question: 'What should the project manager do with this positive variance?',
    options: [
      'Reduce the quality inspection frequency to save money',
      'Document it in lessons learned, investigate the root cause of improvement, and consider replicating successful practices across other areas',
      'Lower the quality standards to reduce effort further',
      'Report the improvement but take no further action'
    ],
    correct: 1,
    explanation: 'Positive quality variances represent process improvements worth understanding and replicating. The PM should: investigate what changed (new practices, better training, process improvements), document these in lessons learned, and consider applying successful practices to other project areas. Reducing inspection frequency prematurely could mask quality regressions. Lowering standards destroys the achievement. Passive reporting misses the organizational learning opportunity. This reflects Plan-Do-Check-Act (PDCA) continuous improvement.'
  },
  {
    domain: 'Process',
    scenario: 'A project team has been asked to deliver a new system that integrates with 5 existing legacy systems. The technical architecture is uncertain. The client insists on a fixed-price contract.',
    question: 'How should the project manager respond to the fixed-price contract request?',
    options: [
      'Accept a fixed-price contract since it protects the client',
      'Accept only if the client provides full technical specifications for all legacy system interfaces',
      'Explain the risk that uncertainty in scope and technical architecture makes a fixed price inappropriate; propose a Time & Materials or Cost-Plus contract, or a hybrid with defined phases',
      'Add a 50% contingency to the fixed price to cover uncertainty'
    ],
    correct: 2,
    explanation: 'Fixed-price contracts are appropriate when scope is well-defined. When scope and technical requirements are uncertain (legacy system integration complexity unknown), a fixed price forces the vendor to include massive contingency (making it expensive) or absorb losses on unknowns. A better approach: T&M for discovery/design phases until scope is known, then fixed price for implementation. Alternatively, Cost-Plus for the uncertain portions. Padding a fixed price by 50% is wasteful and ethically problematic if not disclosed. This reflects contract type selection based on risk allocation.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager has been tracking project risks for 6 months. During a risk review, the team identifies that 80% of risks that materialized came from risks NOT on the original risk register.',
    question: 'What does this indicate, and what should the project manager do?',
    options: [
      'This is normal — not all risks can be predicted. No change needed.',
      'The risk identification process was inadequate. Update the risk management plan to incorporate broader identification techniques, secondary risks from responses, and residual risks.',
      'Remove risks from the register that did not materialize to make the register more accurate.',
      'Hold the team responsible for not identifying risks during planning.'
    ],
    correct: 1,
    explanation: 'An 80% emergence rate from unidentified risks signals a systemic weakness in the risk identification process. The PM should: (1) retrospectively analyze WHERE these risks came from (assumptions, external factors, technical dependencies, stakeholder behaviors); (2) update the risk management process to include these sources; (3) consider secondary risks (risks from risk responses), residual risks, and emerging risks from project changes; (4) increase risk review frequency. This is continuous improvement applied to risk management — not blame assignment.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is presented with the following options for handling a high-probability, high-impact risk: transfer, mitigate, avoid, or accept. The risk is related to a regulatory change that would make the project\'s planned approach non-compliant.',
    question: 'Which risk response strategy is MOST appropriate?',
    options: [
      'Transfer — purchase insurance against regulatory non-compliance',
      'Accept — regulatory changes are outside the project\'s control',
      'Avoid — modify the project approach to ensure compliance with the anticipated regulation from the start',
      'Mitigate — partially reduce the probability by lobbying against the regulation'
    ],
    correct: 2,
    explanation: 'Risk avoidance eliminates the threat entirely by changing the project approach. If the regulation is virtually certain to take effect and non-compliance is not acceptable, proactively redesigning the approach to be compliant from the start eliminates the risk. Transfer (insurance) doesn\'t help with project non-delivery. Acceptance of a high-probability, high-impact risk without contingency is irresponsible. Mitigation through lobbying has very low probability of success and addresses probability, not impact. Avoidance through proactive compliance redesign is the strongest response.'
  },
  {
    domain: 'Process',
    scenario: 'A construction project has a signed contract. The client calls the project manager with a verbal request to change the color of a planned building facade from gray to blue, saying it\'s "just a color change."',
    question: 'How should the project manager handle this?',
    options: [
      'Make the change immediately since it\'s minor and the client requested it',
      'Inform the client that even minor changes require a formal change request documenting the impact on cost, schedule, and materials before implementation',
      'Check if paint is already purchased before responding',
      'Ask the construction crew to accommodate the change since it\'s their area of expertise'
    ],
    correct: 1,
    explanation: 'A "color change" may seem trivial but could affect: material procurement (different paint, already ordered), cost (price difference), schedule (availability lead times), and contract specifications. More importantly, allowing verbal change approvals sets a precedent that verbal requests are sufficient — inviting future scope creep. Every change, regardless of perceived size, must be documented and formally approved. The project manager\'s professionalism is demonstrated by maintaining process discipline on small changes, not just large ones.'
  },
  {
    domain: 'Process',
    scenario: 'A project team using Kanban notices that their Work-In-Progress (WIP) limit of 3 items per stage is being consistently violated, with an average of 7-8 items in each stage.',
    question: 'What is the impact and what should the team do?',
    options: [
      'Violating WIP limits shows the team is productive — increase the WIP limit to 10',
      'WIP violations are normal and self-correcting',
      'Violating WIP limits creates queuing, increases context switching, reduces flow efficiency, and extends cycle time. The team should stop starting new work and finish existing items, then retrospect on why WIP limits are being violated.',
      'Only enforce WIP limits at bottleneck stages'
    ],
    correct: 2,
    explanation: 'WIP limits in Kanban exist to create flow — limiting work in progress so items move faster through the system. Consistently violating them indicates a fundamental problem: the team is starting too much, not completing items, or has underlying bottlenecks creating accumulation. The fix is "Stop Starting, Start Finishing" — focus on completing existing items before starting new ones. The retrospective should address: WHY are WIP limits being violated (pressure from stakeholders? team habits? unclear Definition of Done?). Raising limits eliminates the protective mechanism.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is preparing for a formal project closure. The contract with the vendor has been fulfilled. The project manager needs to document the procurement closure.',
    question: 'What should be included in the Close Procurements process?',
    options: [
      'Only the final payment to the vendor',
      'Final product/service verification, formal written notice of contract closure, procurement audit findings, and updates to organizational process assets',
      'A performance review of all vendor personnel',
      'A new contract for future work'
    ],
    correct: 1,
    explanation: 'Close Procurements (PMBOK 6, Process 12.4) includes: (1) product verification that all work was completed correctly and acceptably; (2) formal written notice to vendor that contract is complete; (3) procurement audit reviewing the entire procurement process for lessons learned; (4) settlement of any open claims or disputes; (5) updates to organizational process assets (lessons learned, vendor performance records). This comprehensive closure protects both parties and builds organizational procurement knowledge for future projects.'
  },
  {
    domain: 'Process',
    scenario: 'A software project is using a hybrid approach. The legacy backend is developed using a predictive approach with a 6-month plan, while the new user interface is developed using Scrum. Integration testing requires both to be ready simultaneously.',
    question: 'What is the BIGGEST scheduling risk in this scenario?',
    options: [
      'The backend team may not follow the Scrum ceremonies',
      'The UI team\'s Scrum velocity may be too fast for the backend',
      'Timing synchronization between the predictive backend delivery and the agile UI delivery — if either is delayed, integration testing is blocked',
      'The stakeholders may not approve the hybrid approach'
    ],
    correct: 2,
    explanation: 'In hybrid environments, synchronization points between predictive and agile streams are the highest scheduling risk. Predictive schedules often slip due to late discoveries; agile teams may deliver features early or late depending on velocity. Both streams must converge for integration testing. The PM should: define explicit synchronization milestones, build buffer around the integration point, establish go/no-go criteria for proceeding to integration, and monitor both streams\' progress toward the synchronization point. This is the most complex aspect of hybrid project management.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager learns from a confidential source that a key vendor is on the verge of bankruptcy and may not be able to complete the contract.',
    question: 'What should the project manager do?',
    options: [
      'Keep the information confidential and do nothing since it\'s unverified',
      'Immediately terminate the vendor contract based on the confidential information',
      'Verify the information through legal/public channels, add a risk to the risk register, develop contingency plans, and discuss with the sponsor and legal team about contract protection options',
      'Quietly begin negotiations with an alternative vendor without telling the current vendor'
    ],
    correct: 2,
    explanation: 'The PM should take this seriously without overreacting to unverified information. Steps: (1) verify through public sources (financial filings, news, vendor\'s own statements); (2) add vendor financial risk to the risk register; (3) develop contingency plans (alternative vendor research, contract protections); (4) consult legal about contract termination clauses and protection mechanisms; (5) engage the sponsor for strategic decisions. Acting precipitously on unverified confidential information creates legal risk. Doing nothing ignores a potential project-ending risk.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is managing a project where team members frequently bypass the PM and go directly to the project sponsor with questions and concerns.',
    question: 'What should the project manager do to correct this?',
    options: [
      'Restrict team members from contacting the sponsor',
      'Clarify the communication protocol and escalation path with both the team and the sponsor, ensuring the team understands the PM is the first point of contact',
      'Report the team members to HR for insubordination',
      'Let it continue since it shows the team values the sponsor\'s opinion'
    ],
    correct: 1,
    explanation: 'Bypassing the PM creates information silos, inconsistent messaging to the sponsor, and confusion about who is accountable for what. The PM should: (1) reinforce the communication structure with the team (why routing through PM matters — for context, consistency, and issue tracking); (2) align with the sponsor on the desired protocol; (3) ensure team members feel heard through proper channels. The fix should be structural and relational, not punitive. The PM should also examine whether they are being accessible enough for team questions.'
  },

// ─────────────── BUSINESS ENVIRONMENT DOMAIN ───────────────────────

  {
    domain: 'Business Environment',
    scenario: 'A project manager is presenting the project business case to the board. The projected NPV is $2.5 million, IRR is 18%, and payback period is 3.2 years. The board asks how confident these figures are.',
    question: 'What should the project manager explain about these financial projections?',
    options: [
      'The projections are precise since they are based on detailed analysis',
      'The projections represent estimates with inherent uncertainty; sensitivity analysis and scenario analysis were used to assess the range of outcomes',
      'The IRR guarantees the project will deliver positive returns',
      'NPV and IRR always agree on project selection decisions'
    ],
    correct: 1,
    explanation: 'Financial projections are estimates based on assumptions. The PM should explain: (1) assumptions underlying each metric; (2) sensitivity analysis showing how outcomes change with different assumptions; (3) risk-adjusted scenarios (optimistic, base, pessimistic); (4) confidence levels based on data quality. IRR guarantees nothing — it\'s a forecast. NPV and IRR can sometimes conflict on mutually exclusive projects. Executives need to understand the uncertainty range to make informed go/no-go decisions. This reflects PMBOK 7\'s Business Case stewardship.'
  },
  {
    domain: 'Business Environment',
    scenario: 'A project manager\'s project has been delivering incremental value for 8 months. The organization announces a strategic pivot that makes the project\'s original objective less relevant to the new strategy.',
    question: 'What should the project manager do?',
    options: [
      'Continue the project as planned since it was originally approved',
      'Terminate the project immediately',
      'Analyze the project\'s remaining value in light of the new strategy, present options to the sponsor (continue, modify scope, terminate), and support the organization\'s decision-making with objective data',
      'Modify the project scope independently to align with the new strategy'
    ],
    correct: 2,
    explanation: 'PMBOK 7 Principle #4 (Focus on Value) and Principle #8 (Address Complexity) require the PM to continuously validate that the project remains aligned with organizational value. When strategy shifts, the PM\'s responsibility is to provide the organization with clear options and data — not to unilaterally continue, stop, or modify. The sponsor and business leadership make the strategic decision. The PM\'s job is to make that decision easy by providing: current status, remaining cost to complete, projected value under new strategy, and clear options. This is business stewardship.'
  },
  {
    domain: 'Business Environment',
    scenario: 'A project manager is implementing an organizational change project. Many employees are resistant to the new process being implemented. The project manager did not plan for change management.',
    question: 'What should the project manager do?',
    options: [
      'Proceed with technical implementation and let HR manage resistance',
      'Immediately incorporate change management activities: stakeholder analysis, communication campaigns, training, pilot groups, and resistance management strategies',
      'Delay the project until resistance subsides naturally',
      'Escalate resistance as a project risk without taking any action'
    ],
    correct: 1,
    explanation: 'Organizational change projects have both a technical solution and a people adoption component. Resistance is predictable and must be actively managed. The PM should immediately add change management activities to the project plan: stakeholder influence analysis, targeted communication for different stakeholder groups, early adopter/champion identification, training programs, pilot implementations, and feedback loops. Leaving change management to HR without PM leadership typically fails. PMBOK 7 explicitly addresses organizational change management as a PM competency.'
  },
  {
    domain: 'Business Environment',
    scenario: 'A project manager working on a government contract discovers that a subcontractor is using materials that technically meet the contract specifications but are known to the PM to be significantly inferior in long-term durability.',
    question: 'What should the project manager do?',
    options: [
      'Accept the materials since they meet the contract specifications',
      'Replace the materials without informing the subcontractor why',
      'Report the concern to the project sponsor and contracting authority, recommending specification updates or material substitution to ensure the government receives durable value',
      'Keep the information confidential to avoid contract disputes'
    ],
    correct: 2,
    explanation: 'PMI\'s Code of Ethics requires honesty and acting in the best interest of stakeholders. Materials that technically comply but deliver known inferior long-term value to the client (government/public) is an ethical concern that the PM has a professional duty to raise. The PM should document the concern, report to appropriate authorities (sponsor, contracting officer), and recommend solutions. Silently accepting creates long-term reputational and liability risk. This reflects Principle #1 (Stewardship — acting with integrity and care for public impact).'
  },
  {
    domain: 'Business Environment',
    scenario: 'A project manager is evaluating whether the organization should invest in a new digital platform project. The initial investment is $800,000. Expected annual benefit is $250,000. The organization\'s cost of capital is 10%.',
    question: 'What additional financial analysis should the project manager perform?',
    options: [
      'Simple payback period only',
      'NPV analysis discounting future benefits at 10% cost of capital, IRR, and sensitivity analysis on key assumptions',
      'ROI only (total benefit / investment)',
      'The investment is too small to require financial analysis'
    ],
    correct: 1,
    explanation: 'Sound business case analysis requires multiple financial metrics: (1) NPV — present value of $250K/year benefits discounted at 10%, compared to $800K investment (accounts for time value of money); (2) IRR — rate of return that makes NPV = 0, compared to the 10% hurdle rate; (3) Payback period — simple measure of capital recovery risk; (4) Sensitivity analysis — how outcomes change if benefits are 20% lower or costs 20% higher. Single-metric analysis is insufficient for investment decisions. The 10% cost of capital is the minimum acceptable return threshold.'
  },
  {
    domain: 'Business Environment',
    scenario: 'A project manager receives information that a competitor has just released a product similar to what the project is building. The project has 4 months remaining.',
    question: 'What should the project manager do?',
    options: [
      'Ignore it — the project plan should not be affected by competitor activities',
      'Immediately terminate the project since the competitive advantage is lost',
      'Conduct a competitive impact analysis with the product team and sponsor, assess whether scope or timeline adjustments are needed to differentiate the product, and update the business case',
      'Accelerate delivery by cutting all quality checks'
    ],
    correct: 2,
    explanation: 'Competitive market changes are external project risks that affect business value. The PM must bring this to the sponsor\'s attention with an analysis: What specifically did the competitor release? What features differentiate our product? Does the 4-month timeline still make business sense? Should scope be adjusted to add differentiating features? Should delivery be accelerated (with realistic trade-offs)? This is a business environment change that requires senior decision-making. The PM provides analysis; the sponsor decides strategy. This reflects PMBOK 7\'s value focus and business environment awareness.'
  },
  {
    domain: 'Business Environment',
    scenario: 'A project is operating in a highly regulated industry. New regulatory requirements have been announced that will take effect in 3 months, before the project completes.',
    question: 'What should the project manager do?',
    options: [
      'Comply with the regulation after project completion as part of operations',
      'Assess the regulatory impact on project deliverables, engage the compliance/legal team, and determine if project scope or approach must change to deliver a compliant product',
      'Wait for official regulatory guidance before taking any action',
      'Request a regulatory exception since the project was approved before the regulation'
    ],
    correct: 1,
    explanation: 'Regulatory compliance is a non-negotiable project constraint. When new regulations affect a project\'s deliverables, the PM must proactively assess impact: Which deliverables are affected? What changes are required? What is the cost and time impact? The compliance/legal team provides interpretation expertise. The PM should submit a change request if the baseline must change, update the risk register, and ensure stakeholders are informed. Delivering a non-compliant product is not an option. Regulatory exceptions in most industries are not granted simply because a project was pre-approved.'
  },
  {
    domain: 'Business Environment',
    scenario: 'The project management office (PMO) asks the project manager to follow a new project methodology that the PM believes is less efficient than their current approach for this specific project type.',
    question: 'What should the project manager do?',
    options: [
      'Ignore the PMO requirement and continue with the current approach',
      'Follow the PMO methodology exactly as prescribed without any discussion',
      'Implement the PMO methodology while documenting specific tailoring decisions for the project context, and provide feedback to the PMO on areas for improvement',
      'Escalate to the project sponsor to override the PMO requirement'
    ],
    correct: 2,
    explanation: 'PMOs establish methodology standards for organizational consistency and governance. The PM should follow the PMO framework while exercising the tailoring authority that most methodologies allow. PMBOK 7 emphasizes tailoring — applying the right practices for the context. The PM should: implement the required framework, document where and why specific tailoring decisions were made, and channel improvement feedback through proper channels to the PMO. Ignoring requirements undermines governance. Blind compliance without thought misses the point of tailoring. Escalating to override PMO authority is inappropriate without strong justification.'
  },
  {
    domain: 'Business Environment',
    scenario: 'A project manager is asked to lead a strategic transformation project that spans multiple business units and will take 3 years. The organization has never managed a project of this size.',
    question: 'What governance structures should the project manager recommend?',
    options: [
      'A single project manager can govern all aspects without additional structure',
      'Establish a steering committee with cross-functional representation, define clear escalation paths, create a governance charter, implement portfolio-level reporting, and consider a dedicated PMO for the program',
      'Use the standard project management approach scaled up',
      'Have each business unit manage their portion independently'
    ],
    correct: 1,
    explanation: 'Large-scale strategic transformations require robust governance structures. For a 3-year multi-business-unit transformation: (1) Steering Committee for strategic decisions and executive accountability; (2) Governance Charter defining decision rights and escalation paths; (3) Program Management approach with coordinated sub-projects; (4) Portfolio-level reporting to connect to organizational strategy; (5) Dedicated PMO for coordination, standards, and reporting. Standard project management "scaled up" without structural change typically fails at this scale. Each unit operating independently creates integration failures.'
  },
  {
    domain: 'Business Environment',
    scenario: 'A project manager working in a sustainability-focused organization is managing a product development project. Late in execution, a team member raises a concern that the manufacturing process will generate environmental waste beyond what was disclosed to regulators.',
    question: 'What should the project manager do?',
    options: [
      'Continue the project since environmental disclosures are Operations\' responsibility',
      'Immediately halt work and investigate the concern; if confirmed, engage the environmental compliance team, report to appropriate authorities, and determine required project changes',
      'Document the concern but complete the project to avoid delays',
      'Tell the team member that this will be addressed during operations'
    ],
    correct: 1,
    explanation: 'Environmental compliance and public safety obligations override project schedule. PMI\'s Code of Ethics includes responsibility to society and the environment. If confirmed, non-compliant environmental impact: (1) creates regulatory and legal risk; (2) conflicts with the organization\'s stated sustainability values; (3) may be a legal reporting obligation. The PM must stop, investigate, and engage compliance experts before proceeding. Deferring environmental remediation to operations allows a non-compliant product to proceed to deployment — an ethical failure.'
  },
  {
    domain: 'Business Environment',
    scenario: 'A project manager is asked to present a project status update to the board. The project is running 10% over budget and 2 weeks behind schedule. A board member asks if the project should be continued.',
    question: 'What framework should the project manager use to answer this question?',
    options: [
      'Recommend continuation since the project was approved and work is already done',
      'Recommend termination since the project is over budget and behind schedule',
      'Present a benefit realization analysis: compare the remaining cost to complete against the expected remaining value/benefit, and present options (continue as planned, replan, descope, terminate) with supporting data',
      'Defer to the CEO\'s judgment without providing analysis'
    ],
    correct: 2,
    explanation: 'The sunk cost fallacy warns against continuing a project just because money has been spent. The relevant question is: Does the REMAINING investment justify the REMAINING expected benefit? The PM should present: (1) cost to complete; (2) expected value of remaining deliverables; (3) strategic alignment; (4) opportunity cost (what else could we do with the remaining investment?); (5) options with trade-offs. This enables an informed board decision. Continuing automatically or terminating based on variance alone without value analysis both miss the governance responsibility.'
  },
  {
    domain: 'Business Environment',
    scenario: 'An international project requires the project manager to work with government officials in a country where facilitation payments to expedite permits are common practice locally.',
    question: 'What should the project manager do?',
    options: [
      'Make the payments since they are normal business practice in that country',
      'Refuse all such payments as they are considered bribes under PMI\'s Code of Ethics and laws such as the US FCPA, and escalate to the organization\'s legal and ethics team',
      'Make the payments but keep them off the official expense report',
      'Ask a local partner to make the payments instead'
    ],
    correct: 1,
    explanation: 'Facilitation payments (even when locally common) are explicitly prohibited under PMI\'s Code of Ethics (honesty, responsibility), the US Foreign Corrupt Practices Act (FCPA), the UK Bribery Act, and similar legislation in most jurisdictions. The PM must refuse and escalate to the organization\'s legal/ethics team, which may engage local legal counsel for compliant strategies. Using an intermediary is not protection — it transfers legal liability, not eliminates it. "Common local practice" is not a defense under international anti-corruption laws.'
  },
  {
    domain: 'Business Environment',
    scenario: 'A project manager is managing a benefits realization tracking effort after project delivery. Actual benefits are only 60% of the projected benefits from the business case.',
    question: 'What should the project manager do with these findings?',
    options: [
      'The project is closed — benefits are Operations\' responsibility now',
      'Document the shortfall and formally close the benefits realization tracking',
      'Analyze root causes of the benefits gap (adoption issues, scope changes, market changes), document lessons learned, and recommend corrective actions to close the gap',
      'Revise the original business case to match actuals'
    ],
    correct: 2,
    explanation: 'Benefits realization management extends beyond project closure into the operational period. A 40% benefits shortfall requires root cause analysis: Is it a technology adoption issue? Was scope reduced? Did market conditions change? Did the solution not solve the right problem? These findings are critical for: (1) improving future business cases; (2) identifying actions to improve adoption and close the gap; (3) organizational learning. PMBOK 7 emphasizes value delivery over the full lifecycle — the PM or a benefits realization manager should track and address gaps, not just accept them.'
  },
  {
    domain: 'Business Environment',
    scenario: 'An organization is selecting between two projects for its limited budget. Project A has NPV = $500,000 and duration 18 months. Project B has NPV = $600,000 and duration 36 months. The organization\'s strategic priority is speed-to-market.',
    question: 'Which project should be recommended, and why?',
    options: [
      'Project B — it has the higher NPV',
      'Project A — speed-to-market alignment and faster value realization outweigh the $100K NPV difference; also considering the uncertainty of 36-month projections',
      'Either project — NPV is the only metric that matters',
      'Neither — portfolio scoring should include more factors before deciding'
    ],
    correct: 1,
    explanation: 'Project selection is not purely a financial exercise. When the organization\'s strategic priority is speed-to-market, strategic alignment becomes a key selection criterion. Project A: faster delivery means earlier competitive advantage, faster revenue realization, lower forecast uncertainty (18 months vs. 36 months), and strategic fit. The $100K NPV difference over 36 months must be discounted for risk (more can go wrong in 36 months). Portfolio management integrates financial, strategic, and risk criteria. Pure NPV maximization ignores strategic context and execution risk.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is conducting a root cause analysis after a production failure. The team has identified 12 potential contributing factors. The PM needs to focus corrective action on the most impactful causes.',
    question: 'Which quality tool is MOST appropriate for this prioritization?',
    options: [
      'Scatter diagram — to show correlation between factors',
      'Pareto chart (80/20 rule) — to identify the vital few causes responsible for most of the failures',
      'Control chart — to show process variation over time',
      'Fishbone diagram — to map all potential cause categories'
    ],
    correct: 1,
    explanation: 'The Pareto Chart applies the 80/20 principle: typically, 80% of problems come from 20% of causes. By displaying causes in descending frequency order with a cumulative line, the Pareto Chart immediately identifies which few causes (the "vital few") account for most of the problem. This enables targeted corrective action on high-impact root causes rather than spreading resources across all 12 factors. The fishbone diagram was useful to identify causes; the Pareto chart prioritizes them for action. This is quality management tool selection.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager must complete a project in 8 months that was originally planned for 12 months. The scope cannot be reduced. The project sponsor has allocated additional budget.',
    question: 'What is the BEST schedule compression strategy?',
    options: [
      'Fast-track all project activities simultaneously',
      'Crash the critical path activities first by adding resources where most cost-efficient, then evaluate fast-tracking for activities where rework risk is low',
      'Add resources to all activities equally',
      'Work the team 7 days a week for 8 months'
    ],
    correct: 1,
    explanation: 'Intelligent schedule compression requires: (1) crash ONLY critical path activities (non-critical path compression wastes money without schedule benefit); (2) crash at the least-cost-per-day-saved first (crash slope analysis); (3) consider fast-tracking where activities can logically overlap without creating unacceptable rework risk; (4) reassess the critical path after each compression step (the critical path may shift). Adding resources to all activities wastes budget on non-critical work. Working 7 days indefinitely creates burnout and errors. Simultaneous fast-tracking increases coordination complexity and rework risk substantially.'
  },
  {
    domain: 'People',
    scenario: 'A project manager is considering whether to promote a high-performing individual contributor to a team lead role on the project. The candidate has excellent technical skills but has never led others.',
    question: 'What should the project manager consider MOST carefully?',
    options: [
      'Whether the promotion will motivate the individual to perform even better',
      'Whether the role requires technical skill or leadership ability, and what development support will be provided to bridge any leadership gaps',
      'What the rest of the team will think about the promotion',
      'Whether the salary increase is within budget'
    ],
    correct: 1,
    explanation: 'Technical excellence and leadership ability are different competencies. Many organizations create "accidental managers" by promoting technical stars who lack leadership skills. The PM should assess: What does the team lead role actually require? Where are the candidate\'s leadership gaps? What development support (coaching, training, mentoring) will be provided? Without intentional support, the promotion risks losing a great individual contributor while gaining a struggling manager. This reflects Principle #2 (Collaborative Team Environment) — investing in people\'s development.'
  },
  {
    domain: 'People',
    scenario: 'An agile team\'s Daily Scrum has become a status reporting meeting where team members report to the project manager rather than coordinating with each other.',
    question: 'What should the Scrum Master do?',
    options: [
      'Let the PM continue facilitating since they have authority',
      'Remind the team that the Daily Scrum is for the team to coordinate and plan; redirect conversations back to the team and coach the PM on the purpose of the ceremony',
      'Cancel the Daily Scrum since it is not working',
      'Change the Daily Scrum to a weekly meeting to reduce overhead'
    ],
    correct: 1,
    explanation: 'The Daily Scrum belongs to the development team for self-coordination — not a status report to management. When it becomes a reporting ceremony, it loses its purpose and the Scrum Master must intervene. The Scrum Master should: coach the PM on their proper role (observer/servant, not director); redirect conversations among team members; reinforce the three questions (What did I do yesterday? What will I do today? What impediments do I have?); and coach the team to speak to each other, not to the PM. The PM reporting pattern indicates a command-and-control dynamic that undermines self-organization.'
  },
  {
    domain: 'Process',
    scenario: 'During an agile project, the team completes the sprint but the Product Owner does not attend the sprint review. The PO sends an email saying to "carry on and get the next sprint started."',
    question: 'What should the Scrum Master do?',
    options: [
      'Start the next sprint as directed by the PO',
      'Present the increment to available stakeholders but do not formally accept work without the PO; facilitate the PO\'s understanding of the cost of their absence and arrange a rescheduled review',
      'Cancel the sprint review and plan it for later',
      'Have the team self-certify that the work is done'
    ],
    correct: 1,
    explanation: 'The Sprint Review requires the Product Owner\'s presence — they are accountable for accepting or rejecting work. Proceeding without PO acceptance could mean starting Sprint N+2 based on unreviewable work. The Scrum Master should: present available work to any attending stakeholders; not formally close the sprint without PO sign-off; and educate the PO that their absence creates organizational risk (starting the next sprint on potentially unaccepted work). This is an organizational impediment the Scrum Master must surface and resolve.'
  },
  {
    domain: 'People',
    scenario: 'A project manager has three team members on the same team who are performing at three very different levels. The top performer is frustrated that lower performers are receiving equal recognition and compensation.',
    question: 'How should the project manager address this?',
    options: [
      'Give equal recognition to all team members to maintain team harmony',
      'Differentiate recognition based on performance while also supporting lower performers\' development to close gaps',
      'Ignore the top performer\'s concern since compensation is an HR matter',
      'Create internal competition between team members to drive all to higher performance'
    ],
    correct: 1,
    explanation: 'Equitable management recognizes performance differences. High performers who see equal treatment regardless of contribution feel undervalued and may disengage or leave. The PM should: recognize and reward high performance specifically and genuinely; invest in developing lower performers (coaching, training); and not create a team where mediocrity and excellence are treated identically. Internal competition can be destructive in collaborative environments. HR handles formal compensation, but the PM can differentiate informal recognition, development opportunities, and project assignments.'
  },
  {
    domain: 'Process',
    scenario: 'A project has a large number of interdependent risks. When risk response plans are implemented for Risk A, they create two new risks (B and C). When Risk B is mitigated, it reduces Risk C.',
    question: 'What are "B and C" called, and what does this scenario demonstrate?',
    options: [
      'B and C are residual risks; this demonstrates risk escalation',
      'B and C are secondary risks from Risk A\'s response; this demonstrates that risk analysis must account for response-induced risks',
      'B and C are assumptions; this demonstrates assumption analysis',
      'B and C are issues; this demonstrates risk-to-issue conversion'
    ],
    correct: 1,
    explanation: 'Secondary risks are risks created by implementing a risk response. When a mitigation creates new risks, those new risks must be analyzed and responded to as part of the risk management process. This creates a risk response cascade that requires iterative analysis. The interdependency between B and C (mitigating B reduces C) demonstrates risk interactions — risks are not independent; they form a network. PMBOK requires that secondary risks be added to the risk register and managed like any other risk. This also illustrates why risk simulations (Monte Carlo) consider risk interactions.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager reviewing lessons learned from a previous project finds that a specific estimation technique consistently underestimated effort by 25-30% for research activities.',
    question: 'What should the project manager do with this organizational knowledge?',
    options: [
      'Discard the lessons learned since each project is different',
      'Apply a 25-30% adjustment factor to research activity estimates in the current project, and recommend the PMO update estimation guidelines for research activities',
      'Use the same estimation technique since lessons learned are only advisory',
      'Add a general contingency reserve of 30% to the entire project budget'
    ],
    correct: 1,
    explanation: 'Lessons learned from previous projects are organizational process assets (OPAs) that should directly inform current planning. A consistent 25-30% underestimate for research activities is a systematic bias, not random error. The PM should: apply the correction factor specifically to research estimates; document this tailoring decision; and recommend that the PMO update organizational estimation guidelines to prevent the same error organization-wide. Blanket contingency applied to the entire project is imprecise and wasteful. Ignoring OPAs wastes organizational learning.'
  },
  {
    domain: 'People',
    scenario: 'A project manager is working in an organization undergoing significant cultural change. Senior leaders express change management values but their behaviors (micromanagement, dismissing failures) contradict those values.',
    question: 'What is the MOST significant risk this creates for the project, and what should the PM do?',
    options: [
      'The risk is minor since leadership communication is positive; focus on project deliverables',
      'The leadership behavior gap creates an authenticity crisis — team members follow behaviors, not words, leading to disengagement and resistance. The PM should provide honest upward feedback to leadership and model the desired behaviors themselves.',
      'The PM should align their own behavior with what senior leaders DO, not what they say',
      'Document the leadership inconsistency and escalate to HR'
    ],
    correct: 1,
    explanation: 'Organizational culture is shaped by what leaders DO, not what they say. When senior leader actions contradict stated values, employees (correctly) adopt the behavioral model rather than the verbal model — creating cynicism and undermining the change. The PM should: (1) provide honest upward feedback privately to senior leaders about the behavioral gap; (2) model the desired behaviors themselves regardless of senior example; (3) create psychological safety on their own team. This requires courage — diplomatically telling leadership their behavior is undermining their stated goals. This is PMBOK 7 Principle #6 (Demonstrate Leadership Behaviors).'
  },
  {
    domain: 'Process',
    scenario: 'An agile project team is working on a product. The Definition of Done (DoD) includes: unit tested, code reviewed, integration tested, and deployed to staging. A team member says they will mark a story "Done" before integration testing since the unit tests all pass.',
    question: 'What should happen?',
    options: [
      'Allow it as an exception since unit tests passing is a good signal',
      'The story is not Done by the team\'s agreed DoD; it should remain In Progress until all DoD criteria are met',
      'Update the DoD to remove integration testing',
      'Have the team member ask the Product Owner for permission to skip integration testing'
    ],
    correct: 1,
    explanation: 'The Definition of Done is the team\'s quality contract — all criteria must be met for work to be considered complete. Marking work Done before all criteria are met creates hidden technical debt, corrupts velocity metrics (claiming points not truly earned), and risks releasing untested code. The Scrum framework is explicit: work is either Done (all DoD criteria met) or Not Done. There are no exceptions without a formal change to the DoD itself. This also sets a dangerous precedent that DoD criteria are optional.'
  },
  {
    domain: 'Business Environment',
    scenario: 'A project manager in a financial services company is implementing a new transaction processing system. During testing, the team discovers the system may expose customer data to unauthorized access under specific edge case conditions.',
    question: 'What should the project manager do?',
    options: [
      'Deploy to a limited user group first to confirm whether the edge case occurs in practice',
      'Document it as a known issue and deploy with a patch planned for the next release',
      'Stop deployment, immediately escalate to the CISO and legal team, assess data privacy regulatory implications, and do not deploy until the vulnerability is resolved',
      'Ask the development team to assess if the edge case is likely to occur before deciding'
    ],
    correct: 2,
    explanation: 'Customer data exposure is a critical security and regulatory issue in financial services (GDPR, PCI-DSS, etc.). Even potential exposure of customer data requires: immediate escalation to security and legal leadership; proper risk assessment by qualified security professionals; regulatory evaluation (may trigger mandatory breach notification requirements even for potential exposures); and resolution before deployment. Deploying with known security vulnerabilities exposes the organization to massive regulatory fines, reputational damage, and legal liability. This is a go/no-go deployment gate that cannot be bypassed.'
  },
  {
    domain: 'People',
    scenario: 'A project manager learns that their company is considering outsourcing the function that several team members work in. The team members are unaware of this possibility.',
    question: 'What is the project manager\'s ethical obligation?',
    options: [
      'Tell all team members immediately about the possible outsourcing',
      'Keep the information confidential since it\'s not confirmed, and focus team members on project delivery',
      'Raise the concern with HR and senior management about the morale risk to the project if team members discover this independently, and recommend a communication strategy',
      'Begin contingency planning for resource replacement without telling the team'
    ],
    correct: 2,
    explanation: 'This is an ethical dilemma between confidentiality and transparency. The PM has received non-public organizational information. Immediately telling team members may violate confidentiality obligations and could create panic based on unconfirmed information. Doing nothing ignores a real risk to project morale and retention. The appropriate path: (1) raise with HR and senior leadership the risk that team members discovering this independently would be more damaging; (2) recommend a proactive, controlled communication strategy. The PM advocates for transparency while respecting the organization\'s right to manage communications of unconfirmed decisions.'
  },
  {
    domain: 'Process',
    scenario: 'A project has been running for 6 months. The project manager has not updated the risk register since the initial planning phase. A major risk materializes that was on the original register as "unlikely."',
    question: 'What does this situation indicate about the PM\'s risk management?',
    options: [
      'The original risk assessment was simply wrong — this cannot be prevented',
      'Risk management was inadequate: risk registers must be periodically reviewed, probabilities and impacts reassessed as conditions change, and triggers monitored',
      'Risk management was fine — the risk was identified; the probability assessment was simply inaccurate',
      'This is acceptable since major risks cannot be predicted'
    ],
    correct: 1,
    explanation: 'Risk management is a continuous process, not a one-time planning activity. PMBOK\'s Monitor Risks process requires: periodic risk reviews (often every sprint or monthly on predictive projects), probability/impact reassessment as conditions change, trigger monitoring (early warning signs), and risk retirement (removing risks whose trigger window has passed). A 6-month gap without risk register updates is a significant control failure. Risk probabilities change as the project progresses and environmental conditions change. The PM\'s failure was not the original assessment but the absence of ongoing monitoring.'
  },
  {
    domain: 'Process',
    scenario: 'During planning, the project manager uses a Monte Carlo simulation for the project schedule. The simulation results show: P50 completion = December 15, P80 = January 15, P90 = February 1. The sponsor wants to commit to a December 15 date publicly.',
    question: 'What should the project manager advise?',
    options: [
      'Agree to December 15 since that\'s the most likely date',
      'Advise the sponsor that December 15 represents only a 50% probability of on-time completion; recommending publicly committing to a date with only 50/50 odds risks public credibility and should be set at a higher confidence level',
      'Use February 1 as the commitment date to be safe',
      'Run the simulation again to get a better result'
    ],
    correct: 1,
    explanation: 'Monte Carlo simulation provides probabilistic schedule forecasts. P50 means 50% probability of finishing by that date — committing to a date with 50/50 odds is essentially coin-flip planning. The PM should help the sponsor understand the risk/credibility trade-off: committing to P50 gives a 50% chance of missing publicly; P80 is a reasonable commitment for most business contexts; P90 for high-stakes public commitments. The PM\'s role is to ensure the sponsor makes an informed decision with full understanding of the probability and reputation implications of missing the public commitment.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is managing a large SAP implementation with 200 user stories. The team is using Scrum with 2-week sprints. Midway through the project, the customer wants to change the priority of 30 stories.',
    question: 'What is the correct process for handling this?',
    options: [
      'Refuse the reprioritization since stories were already planned',
      'The Product Owner should update the product backlog to reflect the new priorities, and the changes will be reflected in upcoming sprint planning sessions',
      'Add the 30 reprioritized stories to the current sprint regardless of sprint capacity',
      'The PM should independently re-sequence the stories without consulting the PO'
    ],
    correct: 1,
    explanation: 'Backlog reprioritization is a normal, expected part of agile delivery. The Product Owner owns the product backlog and is the sole authority for reprioritizing stories. The process: (1) Customer communicates priority changes to the PO; (2) PO reassesses business value and re-orders the backlog; (3) reprioritized items are sequenced into upcoming sprints through normal sprint planning. This demonstrates one of agile\'s core benefits — responding to change. Stories cannot be added mid-sprint without disrupting the sprint goal. The PM does not independently change the backlog.'
  },
  {
    domain: 'People',
    scenario: 'A project manager is managing a global virtual team. Two team members in different countries have an email exchange that escalates into a significant conflict due to a misunderstanding. The PM is CC\'d on the emails.',
    question: 'What should the project manager do?',
    options: [
      'Respond to the email thread with a resolution for both parties',
      'Forward the emails to HR for resolution',
      'Reach out to each team member individually by video call to understand their perspectives, then facilitate a direct video conversation between them to resolve the misunderstanding',
      'Tell both team members to communicate only through the PM going forward'
    ],
    correct: 2,
    explanation: 'Email conflicts often arise from misinterpretation of tone and context — especially across cultures. The PM should: (1) individually understand each person\'s perspective and how they interpreted the exchange; (2) facilitate a synchronous (video) conversation where tone and intent are clearer. Resolving via email continues the problematic medium. HR involvement is premature for a misunderstanding. Mandating all communication through the PM is unsustainable and prevents direct team relationships. This reflects the PM\'s role as a facilitator and team builder.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is selecting between two vendors. Vendor A has a lower price but has never worked with the organization. Vendor B is more expensive but has successfully completed 3 previous projects for the organization.',
    question: 'What procurement tool helps quantify this decision, and what factors should be weighted?',
    options: [
      'Source Selection Criteria weighted scoring — technical capability, past performance, price, risk, and organizational fit should all be weighted appropriately',
      'Price alone — always select the lowest bidder',
      'Past performance alone — always select the known vendor',
      'Coin flip — both vendors are viable options'
    ],
    correct: 0,
    explanation: 'Source selection criteria with weighted scoring is the standard PMI procurement selection tool. Factors and typical weights: technical capability (can they do the work?), past performance (reliability and quality history), management approach, price, risk assessment, organizational fit, and financial stability. The weight assigned to each factor reflects what matters most for THIS specific procurement. Past performance often receives high weight because it is the best predictor of future performance. Price alone ignores risk and quality. A weighted score provides a defensible, documented selection rationale.'
  },
  {
    domain: 'People',
    scenario: 'A team member disagrees with the project manager\'s technical decision. The team member believes the chosen approach will create significant technical debt. The PM has already communicated the decision to stakeholders.',
    question: 'What should the project manager do?',
    options: [
      'Tell the team member the decision is made and move on',
      'Actively listen to the team member\'s concerns, evaluate the technical debt implications objectively, and if the concern has merit, consider whether the decision should be revisited even if it means communicating a change to stakeholders',
      'Ask the team member to document their objection but proceed as planned',
      'Remove the team member from any technical decision-making going forward'
    ],
    correct: 1,
    explanation: 'Good PMs remain intellectually open even after decisions are made. If a team member with technical expertise raises a serious concern about technical debt, the PM should genuinely evaluate it. The cost of reversing a decision early (even with some loss of credibility from a course correction) is almost always less than the cost of accumulating technical debt that slows future delivery. PMI values servant leadership — hearing expert voices on the team is part of a PM\'s responsibility. Dismissing expertise because "the decision is made" is rigid and potentially costly.'
  },
  {
    domain: 'Business Environment',
    scenario: 'An organization is implementing a new ERP system. The project will cost $4 million over 18 months. Post-implementation savings are projected at $800,000 per year. The system lifespan is 7 years.',
    question: 'What should be included in the business case to justify this investment?',
    options: [
      'Total projected savings over 7 years ($5.6M) minus cost ($4M) = $1.6M profit',
      'NPV analysis discounting all cash flows at the cost of capital, IRR, payback period (5 years), risk-adjusted scenarios, and qualitative benefits (compliance, reporting capability)',
      'ROI = (Total savings / Investment) × 100% = 140% ROI',
      'The investment cost only — benefits are too uncertain to quantify'
    ],
    correct: 1,
    explanation: 'A complete business case for a multi-million dollar investment requires: (1) NPV — discounting all future savings at the cost of capital to compare properly against the upfront investment; (2) IRR — the effective return rate; (3) Payback Period — 5 years ($4M / $800K per year), indicating risk of technological obsolescence before payback; (4) Risk-adjusted scenarios (base, optimistic, pessimistic) since benefit projections are inherently uncertain; (5) Qualitative benefits (regulatory compliance, data quality, reporting capability). Simple arithmetic comparison without discounting ignores time value of money and produces misleading results.'
  },
  {
    domain: 'Process',
    scenario: 'A project is 40% complete. The project manager performs EVM analysis: PV=$400K, EV=$320K, AC=$380K. The sponsor asks if the project will finish within the approved budget of $1,000,000.',
    question: 'What should the project manager report, including the TCPI needed to stay within budget?',
    options: [
      'The project will finish within budget; TCPI=1.0',
      'Based on current performance, the project will exceed budget. CPI=0.84, EAC=$1,190K. To finish within the $1M budget, the team must achieve TCPI = ($1M-$320K)/($1M-$380K) = 1.10 — meaning 10% more efficient than planned for all remaining work',
      'The CPI is above 1.0 so budget is under control',
      'The SPI indicates the project is behind schedule but within budget'
    ],
    correct: 1,
    explanation: 'CPI = EV/AC = 320/380 = 0.842 (over budget). EAC = BAC/CPI = $1,000K/0.842 = $1,187K (projected overrun of $187K). TCPI (to-complete performance index for BAC) = (BAC-EV)/(BAC-AC) = ($1,000K-$320K)/($1,000K-$380K) = $680K/$620K = 1.097 ≈ 1.10. A TCPI > 1.0 means the team must be MORE efficient than planned for all remaining work to finish on budget. TCPI=1.10 is ambitious given current CPI=0.84. The PM should honestly report that finishing within the original budget is unlikely without significant corrective action.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager conducting a project audit discovers that required sign-offs were skipped during the quality inspection of three deliverables. The deliverables have already been delivered to the client.',
    question: 'What should the project manager do?',
    options: [
      'Retroactively get the sign-offs and backdate them',
      'Ignore it since the deliverables have already been accepted by the client',
      'Document the control failure, investigate why it occurred, implement corrective measures for the remaining project, and inform appropriate stakeholders about the process gap',
      'Blame the inspection team and issue formal disciplinary action'
    ],
    correct: 2,
    explanation: 'Backdating documents is unethical and potentially fraudulent — a serious PMI Code of Ethics violation. The audit finding should be: (1) formally documented; (2) root cause investigated (Was there time pressure? Unclear process? Individual judgment?); (3) corrective measures implemented for remaining deliverables; (4) informed to appropriate stakeholders (sponsor, QA manager). If the client\'s acceptance was predicated on proper inspection, they may also need to be informed. Ignoring it leaves the control gap open for future deliverables and documents an uncorrected process failure.'
  },
  {
    domain: 'People',
    scenario: 'A project manager is supporting a team through a major organizational restructuring that occurred mid-project. Team members are anxious about their job security and future roles.',
    question: 'What should the project manager do to maintain team performance?',
    options: [
      'Tell the team not to worry about the restructuring and focus on work',
      'Acknowledge the uncertainty, communicate honestly what is and is not known, provide as much clarity as possible about the project\'s continuation, and create stability within the project environment',
      'Ignore the restructuring impact — it\'s an HR matter',
      'Accelerate the project timeline so it completes before the restructuring takes effect'
    ],
    correct: 1,
    explanation: 'Acknowledging reality is more effective than dismissing concerns. Team members\' anxiety is legitimate and will affect performance regardless of whether it\'s acknowledged. The PM should: validate concerns with empathy; share what IS known (project status, continuation); be honest about what is uncertain (individual roles); create clarity within the PM\'s sphere of influence (project roles, work assignments, contribution value); and advocate for the team\'s interests in the restructuring where appropriate. False reassurance destroys trust when contradicted. Psychological safety during uncertainty requires honest, compassionate leadership.'
  },
  {
    domain: 'Process',
    scenario: 'A product manager asks the agile team to skip regression testing in the final sprint to make the release deadline. The team estimates regression testing will take 3 days.',
    question: 'What should the Scrum Master/project manager do?',
    options: [
      'Skip regression testing to meet the deadline since the PO has authority over scope',
      'Refuse to remove testing from the sprint regardless of deadline pressure',
      'Help the PO understand the specific risk of releasing without regression testing (types of defects that could escape, probability, business impact), and facilitate an informed decision rather than making it unilaterally',
      'Add regression testing to the next sprint after release'
    ],
    correct: 2,
    explanation: 'The PM/Scrum Master should not make this decision unilaterally (either way). The PO has the authority to make product decisions, but they need complete information to make an informed decision. The PM should provide: what could go wrong without regression testing (specific risk scenarios), the probability of regression failures based on the change set, the business impact of production bugs vs. 3-day delay, and options (partial regression on critical paths, risk-based testing). With full information, the PO makes the call. This is facilitated decision-making, not compliance or defiance.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is about to start a project in an industry new to the organization. There are no internal subject matter experts available.',
    question: 'What should the project manager do to manage this knowledge gap?',
    options: [
      'Proceed with the project using general PM skills and learn the industry as they go',
      'Hire or contract with industry experts, engage professional associations, conduct expert interviews, and build a learning plan for the team',
      'Decline the project until the organization develops internal expertise',
      'Copy the approach from a successful project in a different industry'
    ],
    correct: 1,
    explanation: 'Knowledge gaps are risks that must be proactively managed. The PM should: (1) identify specifically what domain knowledge is needed; (2) source it through industry experts (contract consultants, advisors, industry veterans); (3) leverage professional associations, published standards, and industry literature; (4) build a team learning plan; (5) add knowledge gap as a risk. Proceeding without addressing knowledge deficiencies creates unmanaged technical risk. Declining is sometimes appropriate but should only be considered after exploring all options for acquiring expertise.'
  },
  {
    domain: 'Process',
    scenario: 'During a project, the team identifies a potential improvement that would add significant value but exceeds the approved project scope. The improvement is not urgent and the project is near completion.',
    question: 'What is the BEST way to handle this?',
    options: [
      'Implement it now since the project team has the expertise and it adds value',
      'Document the improvement opportunity in lessons learned and the organizational knowledge base; recommend it as input to a future project or the product backlog',
      'Submit a change request to add it to the current project scope',
      'Ignore it since the project is almost complete'
    ],
    correct: 1,
    explanation: 'A good idea that exceeds approved scope and is non-urgent is NOT a reason to expand a near-complete project. Adding scope near completion creates quality risk, delays closure, and may require unnecessary change control overhead. The right approach: capture the idea in lessons learned and/or a product enhancement backlog for future consideration. This respects the current project\'s constraints while preserving the value of the insight. The improvement should be formally proposed and evaluated for a future project or operational improvement cycle through proper channels.'
  },
  {
    domain: 'People',
    scenario: 'A new project manager meets the team for the first time. The team has a history of successful delivery but has also experienced significant leadership turnover (3 PMs in 2 years).',
    question: 'What should the new PM\'s initial priorities be?',
    options: [
      'Establish authority quickly to prevent the team from taking advantage of the transition',
      'Immediately implement new processes to demonstrate leadership value',
      'Listen more than speak, understand what has worked and what has frustrated the team, build individual relationships, and demonstrate through actions (not words) that this leadership change will be different',
      'Review all historical project documentation before speaking to the team'
    ],
    correct: 2,
    explanation: 'Frequent leadership transitions create trust deficits and cynicism toward new leaders. The team has seen (and outlasted) three PMs — promises ring hollow; actions build trust. The new PM should: (1) listen to understand the team\'s history, preferences, and frustrations; (2) build individual relationships that signal genuine interest in each person; (3) earn trust through consistent, reliable behavior before introducing changes; (4) avoid "I\'m here to fix things" framing that implies the team was the problem. This is patient, relationship-based leadership appropriate for a trust-depleted environment.'
  },

// ─────────────── ADDITIONAL PROCESS QUESTIONS ───────────────────────

  {
    domain: 'Process',
    scenario: 'A project manager wants to determine if there is a relationship between the number of code review hours spent and the number of defects found in testing. The team has data from 20 previous sprints.',
    question: 'Which quality tool should be used to analyze this relationship?',
    options: [
      'Pareto Chart',
      'Scatter Diagram',
      'Control Chart',
      'Histogram'
    ],
    correct: 1,
    explanation: 'A Scatter Diagram (also called a scatter plot or correlation chart) shows the relationship between two variables — in this case, code review hours and defect count. It visually reveals whether increasing review hours correlates with fewer defects (negative correlation), more defects (positive correlation — perhaps reviews surface hidden defects), or no relationship. This is the correct tool for analyzing potential cause-effect relationships between two continuous variables. The correlation coefficient quantifies the strength of the relationship.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is developing a risk management plan. The project is 18 months long with a $5 million budget. How much contingency reserve should be established?',
    question: 'What approach should the PM use to determine the contingency reserve amount?',
    options: [
      'Always use 10% of the project budget as the standard contingency',
      'Set aside 20% because the project is large',
      'Base the contingency on quantitative risk analysis — Monte Carlo simulation or Expected Monetary Value (EMV) analysis of identified risks',
      'No contingency is needed if risks are properly mitigated'
    ],
    correct: 2,
    explanation: 'Contingency reserves are calculated based on the analyzed risk exposure, not arbitrary percentages. The correct approach: (1) identify risks; (2) quantify probability and impact for each risk (EMV = Probability × Impact); (3) sum the EMV of all risks for a data-driven contingency number; OR (4) use Monte Carlo simulation on the full project schedule/cost model to get a probability distribution and select the appropriate confidence interval. Rule-of-thumb percentages ignore the actual risk profile. Some projects need 2% contingency; others need 30% — it depends on the specific risks and their probabilities.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is reviewing the project management information system (PMIS). She notices that status reports are being generated weekly but no one appears to be reading them based on zero responses and low email open rates.',
    question: 'What should the project manager do?',
    options: [
      'Continue sending reports since the PM\'s obligation is to send them, not ensure they\'re read',
      'Review the communications management plan, survey stakeholders on preferred format and frequency, and redesign the reporting to be more actionable and accessible',
      'Stop sending status reports since they\'re not being read',
      'Copy senior management on all reports to force attention'
    ],
    correct: 1,
    explanation: 'The goal of project communication is effective information transfer — not document creation. Reports that aren\'t read are waste. The PM should: survey stakeholders on what information they actually need, preferred format (executive dashboard vs. detailed report), and preferred frequency; redesign reports to be concise, visually effective, and action-oriented; consider alternative formats (dashboards, brief video updates, standup meetings). Continuing to produce unread reports wastes time. Stopping removes necessary oversight. This is Monitor Communications — ensuring communication is effective, not just executed.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager performing a midpoint review discovers the project has a Total Float of 0 on its critical path and a Near-Critical Path with only 3 days of float. The project has 4 months remaining.',
    question: 'What does the near-critical path condition represent, and what should the PM do?',
    options: [
      'The near-critical path is unimportant since it still has positive float',
      'The near-critical path poses a significant secondary schedule risk — any delay >3 days on those activities creates a new critical path. The PM should monitor these activities closely and consider pre-emptive mitigation.',
      'The float can be used freely since 3 days is adequate buffer',
      'The near-critical path will not affect the project end date under any circumstances'
    ],
    correct: 1,
    explanation: 'With 4 months remaining and only 3 days of float on the near-critical path, even a small disruption to those activities could create a second critical path (or a longer critical path if resources are shared). The PM should: monitor near-critical path activities with almost the same attention as the critical path; develop contingency plans for near-critical activities; be cautious about consuming float on near-critical activities without consideration of the impact; and consider whether schedule reserve should be established. Near-critical paths with minimal float are a common source of project schedule failures.'
  },
  {
    domain: 'People',
    scenario: 'A project manager consistently has all decisions referred to them by the team, even small technical decisions that the team members are qualified to make. The PM is becoming a decision bottleneck.',
    question: 'What should the project manager do to improve this situation?',
    options: [
      'Continue making all decisions since the PM is accountable for project outcomes',
      'Create a decision authority matrix — clarifying which decisions require PM approval, which can be made by the team within defined parameters, and which require escalation; coach the team on exercising their authority',
      'Delegate all decisions to the team immediately',
      'Hire an additional project manager to share the decision load'
    ],
    correct: 1,
    explanation: 'A decision authority matrix (RACI, DACI) clarifies who can decide what. Many decisions made by team members are actually within their technical expertise and delegated authority — but unclear boundaries create risk aversion that channels everything to the PM. By explicitly defining: team authority limits (e.g., "technical approach decisions within scope and without schedule impact"), escalation triggers, and PM decisions, the team gains confidence to act within their authority. This reduces the PM\'s bottleneck while maintaining appropriate oversight. Immediate full delegation without boundaries can create chaos.'
  },
  {
    domain: 'Process',
    scenario: 'An agile team has just started using story points for estimation. After 4 sprints, their velocity data is: 22, 31, 28, 35. The team is asked to plan a release in 10 sprints.',
    question: 'What is the BEST way to forecast the release scope?',
    options: [
      'Use the highest velocity (35) to maximize planned scope',
      'Use the lowest velocity (22) to be conservative',
      'Use the average velocity (29) to forecast expected throughput, acknowledging uncertainty with a range (e.g., 260-320 points in 10 sprints at 26-32 velocity range)',
      'Wait for 10 more sprints before forecasting'
    ],
    correct: 2,
    explanation: 'Release planning uses historical velocity to forecast future throughput. With 4 sprints of data, the average (22+31+28+35)/4 = 29 points/sprint gives a baseline forecast: 10 sprints × 29 = 290 story points. Given the variance (22-35 range), a conservative/aggressive range (260-320 points) communicates forecast uncertainty. Using max velocity overpromises; using min undercommits. 4 sprints is sufficient for a directional forecast but the PM should acknowledge increasing uncertainty over the release horizon. Regular re-forecasting as more data accrues improves accuracy.'
  },
  {
    domain: 'Business Environment',
    scenario: 'A project manager is leading a digital transformation project. Senior stakeholders embrace the digital strategy verbally but continue to use and demand paper-based reports and manual processes.',
    question: 'What does this represent, and how should the PM address it?',
    options: [
      'Normal behavior — old habits take time to change; the project should proceed as planned',
      'This is espoused vs. enacted behavior — a classic change adoption gap. The PM should involve these stakeholders in redesigning workflows to digital equivalents that meet their actual needs, while providing hands-on training and demonstrating digital benefits concretely.',
      'Senior stakeholders have the right to keep their paper processes — the project should accommodate both digital and paper',
      'Report the stakeholders for undermining the digital strategy'
    ],
    correct: 1,
    explanation: 'Espoused vs. enacted behavior — the gap between stated values and actual behavior — is one of the most significant barriers to digital transformation. Senior stakeholders often endorse transformation strategically but resist changing their own habits. The PM should: understand WHY they prefer paper (control, familiarity, distrust of digital); co-design digital equivalents that address their underlying needs; provide hands-on training that builds confidence; start with small wins that demonstrate digital value to them personally. Accommodation of paper processes while claiming digital transformation contradicts the initiative\'s purpose.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is closing out a project. The project deliverables were accepted 3 months ago, but several team members are still working on related tasks. The project sponsor has moved on to a new initiative.',
    question: 'What should the project manager do to formally close the project?',
    options: [
      'The project can be considered closed since deliverables were accepted 3 months ago',
      'Ensure all project work is complete, obtain final documentation, release resources, update the lessons learned register, archive project records, and formally close contracts and accounts',
      'Ask the team members to transition outstanding tasks to operations without formal closure',
      'Wait for the sponsor to return to formally close the project'
    ],
    correct: 1,
    explanation: 'Project closure (Close Project or Phase, PMBOK 6 Process 4.7) requires: (1) verifying all work is complete and accepted; (2) transferring outstanding operational items to operations with proper handoff documentation; (3) releasing team members to functional/new project assignments; (4) finalizing lessons learned; (5) archiving all project documents to OPAs; (6) formally closing contracts; (7) closing financial accounts. Tasks continuing post-acceptance may indicate scope creep or inadequate handoff planning. The sponsor\'s unavailability doesn\'t eliminate the PM\'s closure obligations.'
  },
  {
    domain: 'People',
    scenario: 'A project team is working in a fast-paced environment. The project manager notices that team members skip documenting decisions, shortcuts in process, and workarounds are becoming normalized. The team calls it "being agile."',
    question: 'How should the project manager respond?',
    options: [
      'Support the team\'s agility and remove bureaucratic documentation requirements',
      'Enforce all documented processes strictly since deviations risk quality',
      'Differentiate between agility (delivering value quickly through adaptive processes) and undisciplined cutting of essential controls; work with the team to identify what documentation provides real value vs. bureaucratic overhead, then enforce necessary controls while eliminating waste',
      'Have the PMO implement stricter documentation controls'
    ],
    correct: 2,
    explanation: '"Being agile" does not mean skipping essential controls. Agile embraces: working code over documentation, but not NO documentation. The PM should facilitate a team discussion: What does this documentation protect against? What are the consequences of NOT having it? Which practices add value and which are waste? Some documentation is genuinely essential (architecture decisions, accepted criteria, tested functionality). Some is bureaucratic overhead. Distinguishing between the two — with the team — builds quality consciousness and prevents the normalization of deviance that often precedes project failures.'
  },
  {
    domain: 'Process',
    scenario: 'A project has a budget at completion (BAC) of $500,000. At the project midpoint, EV = $200,000, AC = $240,000, and PV = $250,000. The sponsor asks for the latest forecast and how much additional funding would be needed.',
    question: 'What should the project manager report?',
    options: [
      'EAC = $500,000; no additional funding needed',
      'CPI = 0.833; EAC = $600,000; VAC = -$100,000 — the project needs $100,000 additional funding if performance trends continue',
      'SPI = 0.80; the project is behind schedule but within budget',
      'TCPI = 0.92; the project can recover on budget with minor improvement'
    ],
    correct: 1,
    explanation: 'CPI = EV/AC = $200K/$240K = 0.833. SPI = EV/PV = $200K/$250K = 0.80 (also behind schedule). EAC = BAC/CPI = $500K/0.833 = $600K. VAC = BAC − EAC = $500K − $600K = −$100K (projected overrun). TCPI (for BAC) = (BAC-EV)/(BAC-AC) = ($300K)/($260K) = 1.154 — achieving TCPI of 1.15 when current CPI is 0.833 is extremely unlikely without major corrective action. The honest forecast is a $100K overrun. The PM should present this clearly and propose corrective actions.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is planning communications for a project with 12 stakeholders. Each stakeholder has different information needs, different levels of influence, and different communication preferences.',
    question: 'What tools should the PM use to plan effective communications?',
    options: [
      'Stakeholder Register and Communications Management Plan only',
      'Stakeholder Register, Power/Interest Grid, Stakeholder Engagement Assessment Matrix, and a Communications Management Plan defining tailored communication for each group',
      'An organization chart and email distribution list',
      'A single weekly status report sent to all stakeholders'
    ],
    correct: 1,
    explanation: 'Effective stakeholder communication requires a toolkit: (1) Stakeholder Register — who they are, their roles, interests, and influence; (2) Power/Interest Grid — prioritizing engagement effort based on influence/interest combinations; (3) Stakeholder Engagement Assessment Matrix — tracking desired vs. current engagement levels; (4) Communications Management Plan — defining what each stakeholder group needs, how frequently, in what format, and through which channels. Single weekly reports for all audiences is a one-size-fits-all approach that serves none well. Tailored communications respect stakeholders\' specific needs and maximize information value.'
  },
  {
    domain: 'Process',
    scenario: 'An agile team delivers a feature that passes all defined acceptance criteria but during UAT, end users find it confusing and unusable in practice. The product owner accepted the feature based on technical criteria.',
    question: 'What does this indicate about the project\'s quality practices?',
    options: [
      'The development team failed to deliver quality code',
      'Acceptance criteria were defined from a technical/functional perspective without adequately considering the user experience (usability), suggesting a gap in requirements definition and user involvement',
      'UAT should be skipped since acceptance criteria were met',
      'End users are always dissatisfied — this is normal and acceptable'
    ],
    correct: 1,
    explanation: 'This is a classic validation vs. verification problem. The feature was verified (meets defined criteria) but failed validation (doesn\'t meet actual user needs). Root cause: acceptance criteria didn\'t capture usability requirements. Prevention: involve real users in story writing and acceptance criteria definition; include usability testing as part of the DoD; conduct regular user testing during development rather than only at UAT. This highlights the importance of "user stories" being genuinely written from the user\'s perspective, with acceptance criteria that reflect real user tasks and success conditions.'
  },
  {
    domain: 'People',
    scenario: 'A project manager reads about a new project management methodology in an industry journal and is excited to implement it on their current project. The project is 60% complete.',
    question: 'What should the project manager do?',
    options: [
      'Immediately implement the new methodology since it represents best practice',
      'Test the methodology on a small team first before full implementation',
      'Evaluate the methodology\'s benefits and disruption costs for the current project; if promising, pilot it on a future project or present it to the PMO for consideration in organizational standards',
      'Ask the project sponsor for permission to change methodologies midstream'
    ],
    correct: 2,
    explanation: 'Changing project methodology at 60% completion is disruptive and risky. The team has established working patterns, tools, and processes. Introducing a fundamentally new approach requires training, adjustment time, and creates uncertainty — all at the highest-risk portion of delivery. The right approach: evaluate the methodology\'s genuine value for your project type; if compelling, introduce it as a pilot on a future project where it can be properly planned and the team trained from the start; or champion it to the PMO for broader organizational adoption. Methodology changes midstream require extraordinary justification.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager receives a complaint from the customer that deliverables are consistently below their quality expectations. However, all deliverables pass internal quality inspections.',
    question: 'What does this situation most likely indicate?',
    options: [
      'The customer has unrealistically high expectations',
      'There is a gap between the internal quality standards and the customer\'s actual quality requirements — the quality management plan needs to be updated to reflect customer-defined quality criteria',
      'The internal QA team is doing a good job; the customer complaint is unfounded',
      'Quality is subjective and customer opinions should not affect quality decisions'
    ],
    correct: 1,
    explanation: 'Internal quality standards should reflect customer requirements, not internal convenience. When deliverables pass internal inspections but fail customer expectations, it indicates the quality requirements were not adequately captured or the acceptance criteria don\'t reflect what the customer actually values. The PM should: conduct a joint quality review with the customer to identify specific gaps; update the quality management plan and acceptance criteria to reflect customer-defined quality standards; and ensure the quality inspection process validates against customer criteria, not just internal metrics. Quality is ultimately defined by the customer.'
  },


  {
    domain: 'People',
    scenario: "Two senior team leads are in a deadlock over which database technology to use for a new enterprise system. The project schedule is starting to slip because of this unresolved technical disagreement.",
    question: "What is the BEST conflict resolution technique for the project manager to use in this situation?",
    options: [
      "Forcing — decide on the database yourself to get the project schedule back on track",
      "Avoiding — wait for the team leads to resolve the conflict themselves to build their collaboration skills",
      "Collaborating — facilitate a technical review meeting where both leads present data, evaluate trade-offs, and reach a consensus",
      "Compromising — split the database duties so one lead owns the frontend DB and the other owns the backend DB"
    ],
    correct: 2,
    explanation: "Collaborating (confronting/problem-solving) is the most effective conflict resolution technique in PMI. It brings both parties together to review objective data and reach a consensus, ensuring high quality and commitment. Forcing gets a fast decision but destroys commitment. Avoiding leads to schedule slippage. Compromising (splitting database duties) is a sub-optimal split that can create architectural mess."
  },
  {
    domain: 'People',
    scenario: "A project manager is leading a distributed virtual team across three continents. During status meetings, some team members remain silent while others dominate the conversation. Communication gaps are causing integration delays.",
    question: "How should the project manager address this virtual team communication issue?",
    options: [
      "Require all team members to speak for at least two minutes in each meeting",
      "Establish a team charter that outlines communication norms, active listening guidelines, and response times, and use interactive polling tools in meetings",
      "Send meeting transcripts and ask the silent team members to review them independently",
      "Replace the quiet team members with resources who are more extroverted"
    ],
    correct: 1,
    explanation: "A team charter is an essential tool to establish shared rules, especially for virtual teams. Defining communication norms and using interactive facilitation tools ensures inclusive participation. Mandating speaking time creates anxiety. Transcripts are passive and do not build team alignment. Extroversion is not a selection criterion for project success."
  },
  {
    domain: 'People',
    scenario: "A high-performing developer on a critical project starts missing deadlines. In a private meeting, they disclose they are facing a severe family health crisis and are struggling to balance their work.",
    question: "What should the project manager do FIRST?",
    options: [
      "Inform HR about the developer's personal issues and request a backup resource immediately",
      "Demonstrate empathy, support the developer, and explore options such as flexible hours or temporary task redistribution while maintaining privacy",
      "Issue a formal warning that personal issues should not impact project deliverables",
      "Offer to contact the developer's family to verify the situation"
    ],
    correct: 1,
    explanation: "PMBOK 7 Principle #1 (Stewardship) and servant leadership emphasize empathy, integrity, and caring for team members. The PM should first show empathy, support the resource, and work out temporary flexible arrangements to support their well-being. Punitive action or immediate escalation without consulting them destroys trust. Verifying family details is invasive and unprofessional."
  },
  {
    domain: 'People',
    scenario: "A functional manager suddenly withdraws a key database administrator (DBA) from the project team to resolve an operational crisis, causing a critical path delay on the project.",
    question: "What should the project manager do FIRST?",
    options: [
      "Escalate the functional manager's behavior to the project sponsor for intervention",
      "Review the resource management plan, and meet with the functional manager to understand the crisis and negotiate a shared allocation or a temporary replacement",
      "Submit a formal complaint to HR about resource poaching",
      "Hire an external contractor immediately to replace the DBA"
    ],
    correct: 1,
    explanation: "The PM should act professionally and collaboratively first. Meeting the functional manager to understand the operational context and negotiate a compromise (like part-time availability or a temp replacement) is the correct initial action. Escalation or HR complaints are premature. Hiring a contractor requires budget and procurement approval and cannot be done instantly."
  },
  {
    domain: 'People',
    scenario: "A project manager is assigned to a project team that has had three project managers in the past year. The team is skeptical, resistant, and lacks trust in the new PM's leadership.",
    question: "What should the project manager do FIRST to build trust with the team?",
    options: [
      "Organize a mandatory team-building retreat to enforce collaboration",
      "Introduce a new set of strict tracking metrics to ensure team accountability",
      "Hold individual one-on-one sessions to listen to team members' experiences, challenges, and concerns without imposing immediate process changes",
      "Assert authority in the first status meeting and demand compliance with project protocols"
    ],
    correct: 2,
    explanation: "Building trust requires active listening and empathy, especially for a team suffering from leadership churn. Holding informal one-on-ones to understand their concerns and show support is the best way to build rapport. Mandating retreats or imposing strict metrics and authority before building trust will increase resistance and decrease morale."
  },
  {
    domain: 'People',
    scenario: "In an agile project, a team member approaches the Scrum Master during a break and complains that another developer is consistently pulling fewer story points and not doing their fair share of work.",
    question: "How should the Scrum Master handle this complaint?",
    options: [
      "Confront the accused developer privately and demand they increase their speed",
      "Encourage the team member to raise the team collaboration concern in the upcoming Sprint Retrospective, or offer to facilitate a direct, constructive conversation between them",
      "Reassign the accused developer's tasks to the complaining team member",
      "Inform the functional manager that the developer is underperforming"
    ],
    correct: 1,
    explanation: "In agile, the team is self-organizing and peer accountability is key. The Scrum Master should encourage the team to address collaboration or performance issues during the retrospective where working norms are reviewed, or facilitate a constructive peer-to-peer discussion. Dictatorial intervention, task dumping, or immediate manager escalation undermines self-organization."
  },
  {
    domain: 'People',
    scenario: "A highly skilled technical expert refuses to attend agile standup meetings, stating that the daily meetings are a waste of time and they prefer to focus entirely on coding.",
    question: "What is the BEST response from the project manager?",
    options: [
      "Excuse the expert from the meetings since their technical contribution is highly valuable",
      "Meet with the expert privately to explain how the daily standup facilitates team coordination, identifies blockers early, and benefits their own work, then coach them on active participation",
      "Issue a formal performance warning for refusing to follow project processes",
      "Mandate that the expert must facilitate all daily standup meetings going forward"
    ],
    correct: 1,
    explanation: "The PM (or Scrum Master) should coach team members to help them understand the \"why\" behind agile practices. Excusing the expert creates double standards and hurts team cohesion. Warnings are punitive. Forcing them to facilitate a meeting they dislike is counterproductive. Private coaching addresses the mindset shift."
  },
  {
    domain: 'People',
    scenario: "A key stakeholder is highly critical of the project's direction but consistently declines to attend project alignment meetings. The project manager is concerned about late-stage alignment issues.",
    question: "What should the project manager do?",
    options: [
      "Send the stakeholder the meeting minutes and document their absence as a project risk",
      "Schedule a one-on-one meeting with the stakeholder to understand their expectations, discuss their concerns, and agree on a tailored communication method",
      "Ignore the stakeholder's criticism since they chose not to participate in the alignment sessions",
      "Request the project sponsor to remove the stakeholder from the project review board"
    ],
    correct: 1,
    explanation: "Proactive stakeholder engagement is a key PMP principle (PMBOK 7 Principle #3). If a stakeholder is critical but absent, the PM must take the initiative to engage them one-on-one, discover their concerns, and adapt communication to match their needs. Documenting absence or ignoring criticism does not resolve the alignment risk."
  },
  {
    domain: 'People',
    scenario: "A project manager notices that the project team is experiencing frequent arguments, finger-pointing during status meetings, and general confusion about task ownership.",
    question: "According to Tuckman's Stages of Team Development, what stage is this team in, and what should the PM do?",
    options: [
      "Forming — the PM should provide high direction and set clear ground rules",
      "Storming — the PM should facilitate conflict resolution, clarify roles using a RACI matrix, and reinforce team agreements",
      "Norming — the PM should step back and let the team self-organize fully",
      "Performing — the PM should focus on delegation and strategic alignment"
    ],
    correct: 1,
    explanation: "Arguments, conflict, and confusion are classic signs of the Storming stage. The PM's role in Storming is to facilitate conflict resolution, clarify roles (e.g. using a RACI matrix), and help the team establish norms and agreements. Forming is characterized by politeness and anxiety; Norming is characterized by agreement; Performing is characterized by high autonomy."
  },
  {
    domain: 'People',
    scenario: "A project sponsor contacts the project manager and requests a change to the technical stack of the project. The project team had previously evaluated this option and rejected it due to stability concerns.",
    question: "What should the project manager do FIRST?",
    options: [
      "Comply with the sponsor's request immediately since they fund the project",
      "Explain to the sponsor the stability concerns identified by the technical experts, present the trade-offs, and facilitate a discussion to reach a balanced decision",
      "Refuse the request and tell the sponsor that the team owns all technical decisions",
      "Implement the change secretly to avoid conflict with the sponsor"
    ],
    correct: 1,
    explanation: "The PM acts as a bridge between stakeholders and the team. Bypassing the team's technical analysis creates quality risk. The PM should present the team's findings and stability trade-offs to the sponsor so they can make an informed decision, protecting the team's expertise while respecting the sponsor's influence."
  },
  {
    domain: 'People',
    scenario: "A lead developer on a critical path task informs the project manager that they have received a lucrative job offer from another company and are planning to resign.",
    question: "What should the project manager do FIRST?",
    options: [
      "Immediately lock the developer's system access to protect intellectual property",
      "Update the risk register, discuss career aspirations and retention options with the developer, and prepare a knowledge transfer and transition plan",
      "Offer to double the developer's salary immediately using project reserves",
      "File a complaint with HR about the developer's lack of loyalty"
    ],
    correct: 1,
    explanation: "The PM should manage this as a resource risk: update the risk register, discuss retention/motivation options with the developer, and prepare transition/knowledge transfer plans. Salary adjustments are typically HR policy and not within the PM's unilateral authority. Locking system access abruptly without cause is hostile and disrupts the critical path task."
  },
  {
    domain: 'People',
    scenario: "During a software testing phase, a junior team member makes a critical configuration error that accidentally deletes a test database, causing a 2-day delay for the testing team.",
    question: "How should the project manager handle this situation?",
    options: [
      "Publicly reprimand the team member during the daily standup to prevent others from making the same mistake",
      "Meet with the team member and technical leads to resolve the database issue, conduct a blameless root cause analysis, and implement guardrails to prevent recurrence",
      "Reassign the junior developer to a non-technical role with no database access",
      "Ignore the issue since the database was only a test environment"
    ],
    correct: 1,
    explanation: "A servant leader focuses on learning and improvement rather than blame. The PM should work with the team to restore the database, run a blameless review to identify why it happened, and implement technical safeguards (like backup automation or access control). Public reprimands destroy psychological safety and trust."
  },
  {
    domain: 'People',
    scenario: "A remote project team has team members in Europe, Asia, and North America. The PM receives feedback that team members in Asia feel disconnected and are struggling with late-night meeting times.",
    question: "What is the BEST action for the project manager to take?",
    options: [
      "Cancel all synchronous virtual meetings and communicate only through email",
      "Rotate meeting times weekly so that the burden of off-hours meetings is shared equitably, and establish asynchronous communication channels for updates",
      "Instruct the Asian team members to adjust their personal schedules to align with North American business hours",
      "Replace the remote team members in Asia with local resources to simplify coordination"
    ],
    correct: 1,
    explanation: "Rotating meetings fairly among international time zones and establishing asynchronous tools demonstrates cultural intelligence, respect, and equity (PMBOK 7 Principle #2 — Collaborative Team Environment). Forcing one group to bear all off-hours work damages motivation and retention. Canceling all meetings is an extreme that harms integration."
  },
  {
    domain: 'People',
    scenario: "A hybrid project is initiated with a mixed team: the hardware engineers use predictive methods, and the software engineers use Scrum. There is constant friction and blame-shifting regarding dependencies.",
    question: "How should the project manager address this cultural friction?",
    options: [
      "Instruct the hardware engineers to switch to Scrum immediately to match the software team",
      "Facilitate joint alignment workshops to help both teams understand each other's development lifecycle, map dependencies, and establish a shared communication cadence",
      "Separate the two teams completely and act as the sole conduit of information between them",
      "Let the teams resolve it themselves since self-organization is an agile value"
    ],
    correct: 1,
    explanation: "Hybrid projects require proactive integration. Facilitating cross-lifecycle alignment workshops helps teams understand boundaries, map interface dependencies, and build collaboration. Forcing hardware into Scrum is structurally inappropriate. Siloing teams creates communication bottlenecks and increases risk. Ignoring it allows toxic dynamics to grow."
  },
  {
    domain: 'People',
    scenario: "A team member's primary language is different from the rest of the team. They rarely contribute during brainstorming sessions, and the PM is concerned that valuable ideas are being missed.",
    question: "What is the BEST way for the project manager to encourage this team member's participation?",
    options: [
      "Call on the team member directly in meetings and insist they speak up",
      "Provide meeting agendas and materials in advance, allow written inputs before meetings, and use silent collaborative writing tools (like digital whiteboards)",
      "Assign the team member a language training course and excuse them from brainstorming until it is completed",
      "Assume the team member has no ideas to contribute and focus on other members"
    ],
    correct: 1,
    explanation: "Inclusive facilitation techniques (sending agendas early, allowing async written inputs, and using silent writing tools) remove language barriers and give non-native speakers time to process and formulate ideas. Direct calling can cause embarrassment and anxiety. Excusing them silos their input. Assuming they have no ideas is a failure of leadership."
  },
  {
    domain: 'People',
    scenario: "The project manager is working in a functional organization where resources are managed by department heads. A key developer on the project is not performing up to standards.",
    question: "What should the project manager do FIRST?",
    options: [
      "Directly issue a performance warning to the developer",
      "Discuss the performance concerns privately with the developer, offer coaching, and if performance does not improve, discuss the issue with their functional manager",
      "Ask the functional manager to replace the developer immediately",
      "Inform the project sponsor that the functional resource is jeopardizing the timeline"
    ],
    correct: 1,
    explanation: "In a functional organization, the functional manager holds formal authority, but the PM should still practice direct and supportive leadership. The PM should talk to the developer privately first, offer coaching/clarification of expectations, and collaborate with the functional manager if there is no improvement. Direct warnings or immediate replacement requests bypass proper channels and damage relationships."
  },
  {
    domain: 'People',
    scenario: "During a brainstorming meeting, a junior developer suggests an innovative approach to reduce API latency. A senior developer dismisses the idea immediately, calling it \"unrealistic and amateurish.\"",
    question: "What should the project manager do?",
    options: [
      "Agree with the senior developer since they have more experience",
      "Intervene immediately, re-establish meeting ground rules regarding respect, and facilitate an objective evaluation of the junior developer's idea",
      "End the meeting and schedule a separate session with only senior developers",
      "Talk to the junior developer privately after the meeting to console them"
    ],
    correct: 1,
    explanation: "Psychological safety is critical for team innovation. The PM must intervene immediately to enforce respect and team agreements, ensuring that all ideas are evaluated objectively based on merit rather than hierarchy. Agreeing with the senior developer or siloing juniors damages team culture and stops innovation."
  },
  {
    domain: 'People',
    scenario: "A project manager notices that several team members are showing signs of stress, fatigue, and are working late hours to meet an aggressive deadline set by the client.",
    question: "What is the project manager's ethical responsibility in this situation?",
    options: [
      "Encourage the team to push through the stress until the milestone is completed",
      "Acknowledge the stress, advocate for a sustainable pace, investigate root causes of overallocation, and discuss scope adjustments or schedule changes with the sponsor and client",
      "Provide free meals and coffee to the team to help them work longer hours",
      "Ignore the stress since team members are salaried professionals"
    ],
    correct: 1,
    explanation: "Stewardship (PMBOK 7 Principle #1) includes protecting team well-being. A PM has an ethical obligation to maintain a sustainable pace and prevent burnout. The PM should address overallocation, analyze schedule recovery/scope options, and discuss constraints with the client rather than ignoring the risk or encouraging unhealthy overwork."
  },
  {
    domain: 'People',
    scenario: "In an agile project, a debate arises in the team about how to write user stories. One group wants detailed technical specs, while the other wants user-centric scenarios. The team is divided and frustrated.",
    question: "What should the Scrum Master do?",
    options: [
      "Make the final decision on user story format to end the debate",
      "Facilitate a team workshop to review agile best practices for user stories (INVEST criteria), establish a shared Definition of Ready (DoR), and agree on a template",
      "Let the team continue debating until they reach consensus naturally",
      "Refer the team to the Product Owner to decide the technical format"
    ],
    correct: 1,
    explanation: "The Scrum Master acts as a coach and facilitator. Facilitating a session to review agile principles (like the INVEST framework) and helping the team collaborate to establish their own Definition of Ready (DoR) is the best approach. Making a dictatorial choice violates agile values, while letting conflict drag on wastes team velocity."
  },
  {
    domain: 'People',
    scenario: "A team member consistently submits incomplete work that fails quality checks. The project manager has already coached them privately once, but the quality of their work has not improved.",
    question: "What should the project manager do NEXT?",
    options: [
      "Assign the team member's tasks to a high performer to ensure project quality",
      "Establish a formal performance improvement plan with clear metrics and check-ins, document the performance gaps, and coordinate with their functional manager",
      "Escalate to HR to terminate the team member's contract immediately",
      "Ignore it and hope that peer pressure from the team corrects the behavior"
    ],
    correct: 1,
    explanation: "After initial coaching fails, the PM must take formal action: document performance gaps, create a formal performance improvement plan (PIP) with clear expectations, and align with their functional manager (who holds administrative authority). Silently dumping work onto others is unfair. Termination is a late-stage HR action requiring documentation first."
  },
  {
    domain: 'People',
    scenario: "A new project sponsor is appointed. They are unfamiliar with agile practices and demand that the agile team submit weekly Gantt charts and detailed individual status reports.",
    question: "How should the project manager (Scrum Master) respond?",
    options: [
      "Comply with the sponsor's request and require the team to create weekly Gantt charts",
      "Refuse the request and explain that agile teams do not use Gantt charts or status reports",
      "Meet with the sponsor to understand their information needs, explain agile tracking tools (burnup/burndown charts, velocity, sprint reviews), and provide a high-level release roadmap instead",
      "Delegate the status reporting to individual developers to save time"
    ],
    correct: 2,
    explanation: "The PM should serve as an educator. The sponsor needs visibility; the PM should meet them to explain agile metrics and dashboards that satisfy their information needs without imposing predictive overhead (like individual status reporting) on the self-organizing team. Blind compliance or flat refusal both harm the stakeholder relationship."
  },
  {
    domain: 'People',
    scenario: "A project manager is managing a hybrid project. The predictive team and the agile team are blaming each other for integration testing failures, creating a toxic \"us vs. them\" dynamic.",
    question: "What is the BEST action to resolve this cultural conflict?",
    options: [
      "Reorganize the teams so that predictive and agile members are fully integrated into cross-functional units, and establish shared goals and retrospectives",
      "Punish the vocal members of both teams to deter blame-shifting",
      "Act as the mediator and decide who was at fault for the testing failures",
      "Instruct both teams to communicate only through formal email channels"
    ],
    correct: 0,
    explanation: "Breaking down silos by integrating cross-functional units and aligning them around shared objectives and joint retrospectives promotes a collaborative team environment (PMBOK 7 Principle #2). Punishing members or acting as a judge doesn't address the root cause of the siloed culture. Restricting communication to email worsen relationships."
  },
  {
    domain: 'People',
    scenario: "A project team is working in a matrix organization. A functional manager demands that one of the project resources spend 50% of their time on operational work, although they were committed 100% to the project.",
    question: "What should the project manager do?",
    options: [
      "Refuse the request and assert that the resource is fully committed to the project",
      "Evaluate the impact of the resource reduction on the project schedule, meet with the functional manager to negotiate, and if a compromise cannot be reached, escalate to the project sponsor with a clear impact analysis",
      "Quietly accept the resource reduction and adjust the schedule without telling stakeholders",
      "Tell the resource to ignore the functional manager's demand"
    ],
    correct: 1,
    explanation: "In a matrix organization, resource sharing requires negotiation. The PM should first evaluate the schedule/cost impact of losing the resource, meet with the functional manager to discuss options, and escalate with a documented impact analysis if they cannot agree. Ignoring it or fighting it directly fails to manage project risk."
  },
  {
    domain: 'People',
    scenario: "A project manager is leading a global project with team members from five countries. During a project checkpoint, the PM realizes that cultural differences in communication styles have led to mismatched expectations on deliverables.",
    question: "What should the project manager do FIRST?",
    options: [
      "Standardize the communication protocols to follow the PM's own cultural communication style",
      "Facilitate a cultural awareness session with the team to co-create communication guidelines and a shared definition of terms in the team charter",
      "Document the cultural differences as a project risk and request a schedule extension",
      "Instruct team members to focus purely on technical output and avoid personal communications"
    ],
    correct: 1,
    explanation: "Co-creating communication guidelines and sharing terms in a team charter leverages diversity and builds cultural intelligence. Imposing one style ignores diversity. Scheduling extensions or avoiding personal contact does not address the root communication issue. This aligns with PMBOK 7 Principle #2 (Team)."
  },
  {
    domain: 'People',
    scenario: "An agile team's velocity has dropped significantly over the last three sprints because of recurring technical blockers related to legacy system access.",
    question: "What should the Scrum Master do?",
    options: [
      "Hold the team members accountable for the drop and demand they work faster",
      "Actively collaborate with the IT operations manager, system owners, and stakeholders to resolve the legacy access blockers and clear the team's path",
      "Log the legacy access blockers in the risk register and wait for the sponsor to resolve them",
      "Ask the Product Owner to remove all stories that require legacy access"
    ],
    correct: 1,
    explanation: "A primary responsibility of the Scrum Master is removing impediments. If the team is blocked by legacy system access (an external blocker), the SM must actively engage external parties to resolve it. Blaming the team is inappropriate since they don't control access. Waiting passively or deleting valuable features fails the project."
  },
  {
    domain: 'People',
    scenario: "A project manager is presenting a project status update to the executive team. The project has had a major schedule slip because of a database failure, but the developer has just resolved the issue.",
    question: "How should the project manager present this status?",
    options: [
      "Report that the project is on track and hide the database failure since it is resolved",
      "Present the schedule status honestly, explain the database failure, the resolution steps taken, the schedule impact, and the recovery plan to get back on track",
      "Blame the database developer for the schedule slip during the presentation",
      "Ask the developer to present and answer all questions from the executive team"
    ],
    correct: 1,
    explanation: "PMI's Code of Ethics requires honesty and transparency. The PM must present the status honestly, explain the issue, the resolution, the actual impact, and the corrective actions. Hiding delays destroys trust. Blaming others is unprofessional and violates stewardship. Delegating the difficult presentation to a developer is an abdication of PM duty."
  },
  {
    domain: 'People',
    scenario: "A project manager notices that one of the team members consistently works in isolation, does not share code, and is protective of their modules, making others unable to support their tasks.",
    question: "What should the project manager do FIRST?",
    options: [
      "Confront the team member in the next team status meeting about their lack of transparency",
      "Have a private conversation with the team member to understand their perspective, emphasize the value of collaborative ownership and knowledge sharing, and suggest pair programming or shared code reviews",
      "Reassign their modules to other developers to break the silo",
      "Ignore the behavior since their individual code quality is high"
    ],
    correct: 1,
    explanation: "Addressing behavior privately and constructively is the first step in conflict/collaboration issues. The PM should coach them on collective code ownership and suggest collaborative practices (like code reviews or pair programming). Public confrontation destroys trust. Reassigning modules without talking is punitive. Siloed work creates significant project risk."
  },
  {
    domain: 'People',
    scenario: "An agile project team is struggling with a high volume of bugs escaping to production. The team wants to add a QA testing specialist, but the project manager is concerned about maintaining a cross-functional team structure.",
    question: "What is the BEST action for the project manager?",
    options: [
      "Reject the request to protect the agile team size constraints",
      "Bring in a QA specialist to coach and train developers on test automation, integrate QA capabilities into the team, and update the Definition of Done",
      "Have the Product Owner perform all QA testing during UAT",
      "Hire an external agency to handle all testing offline"
    ],
    correct: 1,
    explanation: "Integrating QA capabilities into the team while coaching members on test automation builds cross-functional capability (PMBOK 7 Principle #8 — Build Quality into Processes). Rejecting the request ignores the quality issue. Having the PO do all testing is unsustainable. Offline agency testing creates feedback delays."
  },
  {
    domain: 'People',
    scenario: "During a retrospective, team members express that they are overwhelmed by administrative tasks (filling out multiple databases, logs, and timesheets) required by the PMO.",
    question: "What should the project manager (servant leader) do?",
    options: [
      "Tell the team that compliance is mandatory and they must manage their time better",
      "Work with the PMO to review the administrative requirements, identify duplicates, automate where possible, and streamline the reporting process for the team",
      "Instruct the team to ignore the PMO requirements to focus on deliverables",
      "Perform the administrative tasks yourself on behalf of the team"
    ],
    correct: 1,
    explanation: "A servant leader works to remove organizational blockers and streamline processes. The PM should engage the PMO to negotiate and optimize the administrative requirements. Demanding blind compliance ignores team fatigue. Telling them to ignore corporate policy is insubordinate. Doing the work yourself is unsustainable and doesn't fix the process."
  },
  {
    domain: 'People',
    scenario: "A client stakeholder is known to be aggressive, often raising their voice and demanding scope additions during status updates. The project team is becoming anxious before meetings.",
    question: "What should the project manager do?",
    options: [
      "Cancel all status meetings and send written updates instead",
      "Establish clear meeting ground rules regarding professional behavior, set a structured agenda, meet with the client stakeholder privately to align expectations, and manage scope changes strictly through the change control process",
      "Confront the client stakeholder publicly in the meeting when they raise their voice",
      "Tell the team to tolerate the behavior since the client is paying for the project"
    ],
    correct: 1,
    explanation: "The PM must protect the team's psychological safety and maintain professional standards. Setting ground rules, meeting the stakeholder privately to align on expectations, and enforcing scope control resolves the issue. Canceling meetings avoids communication. Public confrontation escalates the conflict. Tolerating abuse damages team morale."
  },
  {
    domain: 'People',
    scenario: "A project manager is coaching a newly appointed project coordinator who is struggling to delegate tasks to experienced team members and is working excessive overtime to compensate.",
    question: "What advice should the project manager give to the coordinator?",
    options: [
      "Delegate only administrative tasks and continue doing the critical technical work yourself",
      "Understand that team members are experts in their areas; establish clear goals, trust their capabilities, delegate tasks with clear boundaries, and focus on coordination and support",
      "Work faster to complete the work without needing to delegate",
      "Request HR to assign junior resources who are easier to delegate to"
    ],
    correct: 1,
    explanation: "Delegation requires trusting experts and focusing on enablement (servant leadership). The coordinator should establish goals and boundaries, then delegate and support. Technical experts should do technical work; the coordinator should facilitate. Working faster leads to burnout. Requesting new resources is wasteful."
  },
  {
    domain: 'People',
    scenario: "A customer stakeholder contacts a developer directly and requests a minor adjustment to a screen layout. The developer implements the change immediately because it is simple.",
    question: "How should the project manager address this with the developer?",
    options: [
      "Praise the developer for their agility and customer service focus",
      "Explain that even minor changes must go through the proper scope management channels to prevent scope creep, and reinforce that all requests must go to the PM or PO",
      "Request the functional manager to discipline the developer",
      "Ignore it since the change was minor and had no schedule impact"
    ],
    correct: 1,
    explanation: "Directly implementing requests without scope review is \"scope creep\" and bypasses change governance. The PM must educate the developer on why change management is necessary to prevent cumulative project risks (testing debt, documentation mismatch). Praise encourages bad process, while disciplinary actions are excessive."
  },
  {
    domain: 'People',
    scenario: "A key resource is overallocated across three projects. The resource is stressed and deliverables are slipping on all three projects.",
    question: "What is the BEST action for the project manager to take?",
    options: [
      "Demand that the resource work overtime to meet commitments on your project",
      "Meet with the project managers of the other two projects and the PMO to analyze priorities, negotiate a realistic allocation schedule, and update schedules accordingly",
      "Escalate to the resource's functional manager and request a replacement",
      "Log the overallocation as a risk and do nothing until it resolves"
    ],
    correct: 1,
    explanation: "Resource overallocation is an organizational risk. Collaborative negotiation with the other PMs and PMO allows resource leveling and prioritizing based on business needs, representing responsible stewardship. Demanding overtime causes burnout. Replacing the resource immediately is disruptive. Passivity leads to project failure."
  },
  {
    domain: 'People',
    scenario: "A project team is demotivated after a major milestone deployment failed, requiring a rollback and creating significant negative press for the company.",
    question: "What is the BEST leadership action the project manager can take?",
    options: [
      "Reassure the team, hold a blameless post-mortem retrospective to identify root causes, extract lessons learned, celebrate the team's resilience, and focus on the corrective plan",
      "Identify who made the deployment error and reassign them to a non-critical task",
      "Cancel team meetings to allow members to work individually without distraction",
      "Request senior management to issue a message emphasizing the critical nature of quality"
    ],
    correct: 0,
    explanation: "Resilience and learning are core principles (PMBOK 7 Principle #11). A servant leader reassures the team, runs a blameless retrospective to learn from the failure, and refocuses them on remediation. Finding a scapegoat destroys safety. Canceling meetings increases isolation. Pressure from senior management increases panic."
  },
  {
    domain: 'People',
    scenario: "A project manager is transition coaching a project lead from a directive style to a servant leadership style. The lead asks what their primary focus should be during team meetings.",
    question: "What should the project manager advise?",
    options: [
      "Directing the team members on what tasks to work on and checking their timesheets",
      "Listening to team challenges, asking how you can support them, removing blockers, and facilitating collaborative decision-making",
      "Ensuring that all team members agree with your technical decisions",
      "Updating the project schedule live during the meeting"
    ],
    correct: 1,
    explanation: "Servant leadership focuses on facilitating, listening, removing blockers, and empowering the team. Directive styles focus on command and control (dictating tasks). The PM should advise the lead to focus on support and blocker-removal during team interactions, consistent with agile/PMI values."
  },
  {
    domain: 'People',
    scenario: "An external contractor is consistently failing to deliver artifacts according to the project quality standards. They claim they were not informed of these standards.",
    question: "What should the project manager do FIRST?",
    options: [
      "Terminate the contract with the contractor for non-performance",
      "Review the procurement contract and statement of work, share the official quality standards documents with the contractor, and establish a formal review cadence",
      "Have the project team rework the contractor's deliverables secretly",
      "Escalate to the legal department to file a breach of contract"
    ],
    correct: 1,
    explanation: "The PM should resolve procurement issues through contract administration: verify contract terms, ensure expectations are clearly communicated, share standards, and set up a review process. Terminating or filing lawsuits without communication is premature. Reworking their deliverables secretly using project resources is a waste of budget."
  },
  {
    domain: 'Process',
    scenario: "The client requests a major schedule compression of 2 months. The project budget is constrained, but the sponsor can allocate a small additional reserve if justified. The critical path activities have low risk of rework.",
    question: "Which schedule compression strategy should the project manager choose?",
    options: [
      "Crash the schedule by adding resources to the critical path activities with the lowest cost-per-time slope",
      "Fast-track the schedule by overlapping critical path activities that can logically run in parallel, while monitoring the increased risk",
      "Reduce the project scope by 20% to meet the new deadline without change control",
      "Work the existing team 60 hours a week for the remaining duration"
    ],
    correct: 1,
    explanation: "Since the budget is constrained but the critical path activities have low rework risk, fast-tracking (overlapping activities) is the most appropriate first-line strategy because it does not add direct resource cost. Crashing increases costs. Scope reduction requires formal change control. Systematic overtime causes burnout and quality failures."
  },
  {
    domain: 'Process',
    scenario: "A supplier delivers a batch of custom steel brackets. Quality control inspections reveal that the brackets are 1 millimeter out of tolerance, which doesn't affect structural safety but conflicts with specifications.",
    question: "What should the project manager do?",
    options: [
      "Accept the brackets to avoid schedule delays, without documenting the variance",
      "Reject the brackets, issue a formal non-conformance report to the supplier, and enforce the contract quality requirements",
      "Ask the installation crew if they can adjust the brackets on-site using their own tools",
      "Submit a change request to modify the project quality specifications to match the brackets"
    ],
    correct: 1,
    explanation: "Procurement and quality management require strict control. The PM should reject the non-conforming items, issue a non-conformance report, and enforce specifications. Accepting undocumented variances wave quality constraints. Adjusting brackets on-site is unauthorized rework. Changing specifications just to match defective parts is bad quality governance."
  },
  {
    domain: 'Process',
    scenario: "A project manager is reviewing project risks mid-way through a 12-month development project. A new environmental regulation is announced that will affect material procurement in 3 months.",
    question: "What should the project manager do?",
    options: [
      "Immediately halt the project until the regulation is officially implemented",
      "Log the regulation as a new risk in the risk register, assess its probability and impact, identify responses, and update the risk management plan",
      "Ignore the regulation since the project was initiated under old rules",
      "Submit a change request to accelerate the project by 3 months to bypass the regulation"
    ],
    correct: 1,
    explanation: "Risk management is continuous. When a new potential threat appears, the PM must log it, perform qualitative/quantitative analysis, plan responses, and monitor it. Halting the project is excessive. Ignoring regulations creates legal and compliance risk. Accelerating the project by 3 months is likely unrealistic without major impacts."
  },
  {
    domain: 'Process',
    scenario: "The Change Control Board (CCB) has officially approved a change request to add a payment gateway interface to the project. The project is currently in the execution phase.",
    question: "What is the NEXT step for the project manager?",
    options: [
      "Ask the developer to start coding the gateway immediately",
      "Update the project management plan (scope baseline, schedule, cost baseline), update project documents, notify the affected stakeholders, and execute the change",
      "Submit the approved change request to the project sponsor for final funding approval",
      "Close the change request log and mark it as complete"
    ],
    correct: 1,
    explanation: "After a change request is approved by the CCB, the PM must update the baselines and plan components, update project files, communicate the changes to stakeholders, and direct execution. Coding without planning updates creates scope baseline drift. The CCB includes the sponsor/auth representatives, so second approval is redundant."
  },
  {
    domain: 'Process',
    scenario: "An agile team completes a sprint, but three user stories remain unfinished because of technical difficulties. The team is starting to plan the next sprint.",
    question: "How should the unfinished user stories be handled?",
    options: [
      "Automatically move the unfinished stories into the next sprint's backlog",
      "Return the stories to the product backlog for the Product Owner to re-evaluate, estimate, and reprioritize for upcoming sprints",
      "Mark the stories as \"Done\" and plan to fix the bugs in the next sprint",
      "Extend the completed sprint by 3 days to allow the developers to finish the stories"
    ],
    correct: 1,
    explanation: "In Scrum, incomplete stories are returned to the product backlog. The PO re-evaluates their priority and value. They are not automatically pushed to the next sprint, as that would disrupt sprint planning and capacity constraints. Marking incomplete stories \"Done\" violates the DoD. Sprints have fixed timeboxes and cannot be extended."
  },
  {
    domain: 'Process',
    scenario: "A project manager is developing the Work Breakdown Structure (WBS) for a software implementation project. The team is debating how detailed the decomposition should be.",
    question: "What guideline should the project manager follow to determine when to stop decomposing the work?",
    options: [
      "Decompose until every single activity can be completed in less than 2 hours",
      "Decompose until the work packages represent deliverables that can be reliably estimated, scheduled, managed, and assigned to a single owner (8/80 rule)",
      "Stop decomposing at the third level of the hierarchy regardless of project size",
      "Decompose until the WBS has at least 100 components to show detail to stakeholders"
    ],
    correct: 1,
    explanation: "The WBS should be decomposed to the level of Work Packages. A work package is the point where cost and duration can be reliably estimated and managed, typically between 8 and 80 hours of effort. Decomposing to 2-hour tasks is micromanagement. Third-level limits or arbitrary counts (like 100 components) ignore project context."
  },
  {
    domain: 'Process',
    scenario: "A project manager wants to evaluate whether the project's quality assurance processes are being followed effectively and identify opportunities for operational improvement.",
    question: "Which tool or technique should the project manager use?",
    options: [
      "Quality Control Checksheets",
      "Quality Audit",
      "Control Chart",
      "Scatter Diagram"
    ],
    correct: 1,
    explanation: "A Quality Audit is a structured, independent review to determine whether project activities comply with organizational and project policies, processes, and procedures. It targets process compliance and improvement. Checksheets and Control Charts are Quality Control tools used to measure deliverables, not processes. Scatter diagrams show correlations."
  },
  {
    domain: 'Process',
    scenario: "A project manager calculates the Earned Value metrics: CPI = 1.15, SPI = 0.85, BAC = $500,000. How is the project performing, and what should the PM do?",
    question: "Analyze the status and select the best action.",
    options: [
      "The project is over budget and ahead of schedule; the PM should request a scope expansion",
      "The project is under budget and behind schedule; the PM should evaluate schedule recovery options like fast-tracking or crashing critical path tasks using the cost surplus",
      "The project is on track; no action is needed",
      "The project is under budget and behind schedule; the PM should reduce the team size to save more money"
    ],
    correct: 1,
    explanation: "CPI = 1.15 (> 1) means under budget (cost surplus). SPI = 0.85 (< 1) means behind schedule. The PM should use the budget surplus to compress the schedule (e.g. by crashing or fast-tracking critical path activities). Expanding scope worsens schedule delays. Reducing team size will slow down the project further."
  },
  {
    domain: 'Process',
    scenario: "A project manager has identified a risk that a critical server might fail. During execution, the server fails, triggering the pre-defined risk response plan.",
    question: "What is the FIRST action the project manager should take?",
    options: [
      "Submit a change request to buy a new server model",
      "Implement the risk contingency response outlined in the risk register and update the issue log",
      "Call an emergency team meeting to brainstorm what to do",
      "Escalate the failure to the project sponsor"
    ],
    correct: 1,
    explanation: "When a risk trigger occurs and the risk materializes, the PM must immediately execute the planned contingency response recorded in the risk register, and log the materialized risk in the issue log. Brainstorming is redundant since a plan already exists. Change requests or escalation are secondary steps if the response fails."
  },
  {
    domain: 'Process',
    scenario: "A project manager notices that developers are adding advanced styling elements and animations that were not requested in the software requirement specifications, claiming it adds extra value for free.",
    question: "What does this situation represent, and why is it a concern?",
    options: [
      "Agile delivery; it should be encouraged since it pleases the client",
      "Gold plating; it increases testing debt, introduces potential defects, consumes project time, and should be stopped immediately",
      "Scope creep; it is acceptable if it does not delay the milestone",
      "Continuous improvement; it represents process optimization"
    ],
    correct: 1,
    explanation: "Adding unrequested features is \"gold plating\". It is a quality and scope control issue because it consumes resource time, increases maintenance/testing debt, and introduces quality risks without customer approval. Scope creep is the uncontrolled expansion of scope, but gold plating is specifically team-driven unrequested additions."
  },
  {
    domain: 'Process',
    scenario: "A project has completed all deliverables, and the customer has formally signed off on acceptance. The team is eager to move to their next projects.",
    question: "What should the project manager do to complete the Close Project or Phase process?",
    options: [
      "Allow the team to transition immediately since acceptance is complete",
      "Archive project documents, write lessons learned, close procurement contracts, perform final financial reconciliation, release resources, and issue the final project report",
      "Keep the team on the project for an additional month to handle operational support queries",
      "Archive the files and notify the sponsor via email"
    ],
    correct: 1,
    explanation: "Project closure is a formal process. Accepting deliverables is not closure. The PM must archive records, capture lessons learned, close contracts, complete financial reconciliation, release resources, and write the final report. Letting the team leave before this is completed means the project is not formally closed."
  },
  {
    domain: 'Process',
    scenario: "A project manager is transition planning from predictive to agile. A customer representative is concerned about losing the detailed progress visibility provided by Gantt charts.",
    question: "How should the project manager address this concern?",
    options: [
      "Continue generating Gantt charts manually alongside agile sprints",
      "Educate the customer on agile information radiators (Product Burnup, Sprint Burndown, Velocity charts) and invite them to Sprint Reviews to see working increments",
      "Tell the customer that Gantt charts are obsolete in modern project management",
      "Offer to train the customer on how to read the team's Jira backlog"
    ],
    correct: 1,
    explanation: "The PM should educate the customer on agile metrics that provide real transparency (burnup/burndown, velocity, sprint reviews showing working software) instead of double-tracking with predictive artifacts. Gantt charts on agile projects create waste. Telling them they are obsolete is confrontational and unhelpful."
  },
  {
    domain: 'Process',
    scenario: "A project manager needs to contract a software development team for an R&D project where requirements are expected to evolve significantly as technical spikes are completed.",
    question: "Which contract type is MOST appropriate for this procurement?",
    options: [
      "Firm Fixed Price (FFP)",
      "Time and Materials (T&M) or Cost Plus Incentive Fee (CPIF) with short statement of work horizons",
      "Fixed Price Incentive Fee (FPIF)",
      "Cost Plus Fixed Fee (CPFF) with a 2-year duration"
    ],
    correct: 1,
    explanation: "When scope is highly uncertain and expected to evolve (like R&D), Time & Materials (T&M) or Cost-Plus hybrids are appropriate because they allocate scope risk to the buyer while allowing agility. Fixed-price contracts (FFP, FPIF) require a well-defined scope; forcing fixed-price on uncertain scope leads to high vendor risk premiums or disputes."
  },
  {
    domain: 'Process',
    scenario: "During WBS creation, the project manager defines the Work Breakdown Structure Dictionary.",
    question: "What is the primary purpose of this document?",
    options: [
      "To list the glossary of project management terms for the team",
      "To provide detailed deliverable, activity, and scheduling information about each component/work package in the WBS",
      "To serve as a contact list for all resource owners",
      "To document the change control approval signatures"
    ],
    correct: 1,
    explanation: "The WBS Dictionary provides detailed information about each component in the WBS (e.g. description of work, deliverables, resources, cost estimates, quality criteria, acceptance criteria). It is a supporting document for the scope baseline. It is not a glossary of PM terms, a resource directory, or a change control log."
  },
  {
    domain: 'Process',
    scenario: "A hybrid project combines a hardware team using predictive milestones and a software team using Scrum. The integration testing of software on hardware is frequently blocked because the cadences do not match.",
    question: "How should the project manager manage this integration dependency?",
    options: [
      "Establish synchronization milestones in the predictive master schedule that align with specific software sprint outputs, and coordinate interface dependencies weekly",
      "Force the hardware team to work in 2-week sprints to match the software cadence",
      "Delay all software testing until the hardware is completely built and finalized",
      "Have the software team write mock interfaces and skip hardware testing"
    ],
    correct: 0,
    explanation: "In hybrid environments, defining clear synchronization milestones in the master schedule that align predictive dates with agile release outputs is the standard method for coordinating dependencies. Forcing hardware into short sprints is physically impractical. Delaying all software testing creates massive integration risks late in the project."
  },
  {
    domain: 'Process',
    scenario: "A project team is conducting risk analysis. The project manager wants to analyze the cumulative effect of individual project risks and other sources of uncertainty on the overall project schedule and cost.",
    question: "Which tool or technique should the project manager use?",
    options: [
      "Probability and Impact Matrix",
      "Quantitative Risk Analysis (such as Monte Carlo Simulation)",
      "Risk Checklist Analysis",
      "SWOT Analysis"
    ],
    correct: 1,
    explanation: "Quantitative Risk Analysis (like Monte Carlo Simulation) is used to simulate cost and schedule models thousands of times to determine the cumulative probability distribution of overall project outcomes. The Probability/Impact Matrix is a qualitative tool that looks at individual risks separately, not cumulatively."
  },
  {
    domain: 'Process',
    scenario: "A project manager is closing a procurement contract with a critical vendor. The PM wants to perform a structured review of the procurement process from planning through contract administration to identify operational successes and failures.",
    question: "What technique should the project manager use?",
    options: [
      "Bidder Conference",
      "Procurement Audit",
      "Claims Administration",
      "Make-or-Buy Analysis"
    ],
    correct: 1,
    explanation: "A Procurement Audit is a structured review of the procurement process from Procurement Planning through Contract Administration. Its goal is to identify lessons learned (successes and failures) for future procurements. Bidder conferences happen during solicitation. Claims administration handles disputes. Make-or-buy occurs in planning."
  },
  {
    domain: 'Process',
    scenario: "A project manager is assigned to a new project with no historical files or estimation data. The project involves building a specialized cleanroom environment, which has never been done by the company.",
    question: "What is the BEST estimation approach for cost and schedule?",
    options: [
      "Analogous estimating using a different project type",
      "Bottom-up estimating by decomposing the cleanroom requirements with subject matter experts and estimating each component in detail",
      "Parametric estimating using standard construction cost formulas",
      "Providing a rough guess and refining it during execution"
    ],
    correct: 1,
    explanation: "When historical data is missing and requirements are specialized, bottom-up estimating (decomposing requirements with subject matter experts and estimating detailed components) is the most accurate approach. Analogous estimating is inaccurate without similar projects. Parametric is invalid without custom coefficients for cleanrooms."
  },
  {
    domain: 'Process',
    scenario: "An agile software team wants to prioritize their product backlog based on user value, ease of implementation, and risk. They need a systematic prioritization technique.",
    question: "Which technique should the project manager recommend?",
    options: [
      "Work Breakdown Structure (WBS) decomposition",
      "Weighted Shortest Job First (WSJF) or relative weighting matrix",
      "Critical Path Analysis",
      "Resource Leveling"
    ],
    correct: 1,
    explanation: "Weighted Shortest Job First (WSJF) or relative weighting matrices prioritize backlog items based on user value, time criticality, risk reduction, and job size. WBS is a scope decomposition tool. Critical Path and Resource Leveling are predictive schedule management techniques, not backlog prioritization tools."
  },

]; // end of PMP_QUESTION_BANK
