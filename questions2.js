// ═══════════════════════════════════════════════════════════════════
//  PMP EXAM MASTERY — MOCK TEST 2 (180 Questions)
//  Distribution: People ~42% (76q) | Process ~50% (90q) | Business ~8% (14q)
//  Exposed as window.PMP_MOCK_TEST_2
// ═══════════════════════════════════════════════════════════════════
window.PMP_MOCK_TEST_2 = [

// ─────────────────────────── PEOPLE DOMAIN (~76 questions) ───────────────────────────
  {
    domain: 'People',
    scenario: 'A project manager is leading a distributed team across four continents. During a critical design review, she notices that participation from team members in Asia is consistently low despite mandatory attendance.',
    question: 'What should the project manager do FIRST?',
    options: [
      'Report the lack of participation to the functional managers in Asia',
      'Investigate potential barriers such as time zones, language gaps, or technology issues, and adapt the meeting format accordingly',
      'Make meetings optional for the Asian team and share recordings instead',
      'Schedule separate calls only for the underperforming regions'
    ],
    correct: 1,
    explanation: 'Low participation in distributed teams is almost always caused by structural barriers — not disinterest. The PM must first diagnose: Is the meeting time unreasonable (3 AM in Tokyo)? Are language barriers creating hesitation? Is the video platform unstable in their region? Solutions might include rotating meeting times, adding async input options, or using breakout language groups. PMBOK 7 Principle #3 (Stakeholder Engagement) requires the PM to adapt approaches, not enforce a one-size-fits-all format.'
  },
  {
    domain: 'People',
    scenario: 'A project manager discovers that a vendor\'s project lead has been submitting false progress reports, showing 75% complete when actual completion is closer to 30%. The project is a year into a two-year contract.',
    question: 'What should the project manager do?',
    options: [
      'Accept the discrepancy since the vendor is external and not under direct PM authority',
      'Document the discrepancy, conduct an immediate audit with the vendor, formally notify the vendor of the breach in writing, and escalate to procurement and legal if unresolved',
      'Quietly add extra quality reviews going forward without confronting the vendor',
      'Replace the vendor immediately to protect the project timeline'
    ],
    correct: 1,
    explanation: 'False reporting is a contractual breach and an ethical violation. The PM has a duty under PMI\'s Code of Ethics to be honest and to act proactively when integrity issues arise. The correct sequence: document evidence → audit → formal written notice of breach referencing contract terms → escalate through procurement channels if unresolved. Ignoring it creates risk and legal liability. Immediate replacement without process can expose the organization to contract litigation.'
  },
  {
    domain: 'People',
    scenario: 'An agile team\'s Scrum Master is also acting as the technical lead for the most complex feature in the sprint. Team members are coming to them for technical decisions rather than self-organizing.',
    question: 'What is the BEST course of action?',
    options: [
      'Let the Scrum Master continue — combining roles saves resources',
      'Ask the Scrum Master to separate the two roles in their daily work: facilitate as SM, then contribute technically, but not in the same conversations',
      'Remove the Scrum Master from the technical role immediately',
      'Ask the team to stop consulting the Scrum Master on technical matters'
    ],
    correct: 1,
    explanation: 'The Scrum Master and Technical Lead roles have an inherent conflict: one facilitates team self-organization, the other provides direction. When combined in one person, teams naturally defer to that person as an authority, undermining self-organization. The most practical fix without restructuring is clear role separation — different "hats" at different times, with the SM consciously stepping back to let the team make technical decisions. This is consistent with servant leadership and PMBOK 7 Principle #2 (Collaborative Team).'
  },
  {
    domain: 'People',
    scenario: 'During a project kick-off, the project manager notices that three team members have worked together before and already have strong working relationships, while two new team members feel excluded from conversations.',
    question: 'What should the project manager do to build team cohesion?',
    options: [
      'Let the natural group dynamics play out — cohesion will develop on its own',
      'Pair new members with experienced members on joint tasks, facilitate structured team introductions, and establish team norms collaboratively with all members',
      'Focus only on experienced members since they are immediately productive',
      'Reorganize the team so that all members have equal prior experience'
    ],
    correct: 1,
    explanation: 'The project manager must actively manage team formation. When sub-groups exist from the start, explicit team-building activities are needed: structured introductions that highlight each person\'s unique contribution, pairing arrangements that create interdependence, and co-creating team norms (ground rules) so all members feel ownership. Tuckman\'s Forming stage requires PM engagement — it doesn\'t self-resolve quickly. This builds the psychological safety necessary for high performance.'
  },
  {
    domain: 'People',
    scenario: 'A project manager receives an urgent request from the CEO to accelerate a deliverable by 3 weeks. This would require bypassing the change control process and reallocating resources from another critical project.',
    question: 'What should the project manager do?',
    options: [
      'Immediately comply with the CEO\'s request since executive authority supersedes standard process',
      'Conduct a rapid impact analysis, document the risks and trade-offs of both options, and present these to the CEO along with a recommendation, then follow the agreed decision through proper channels',
      'Refuse the request and insist on following the full change control process',
      'Implement the change and update the baseline retroactively'
    ],
    correct: 1,
    explanation: 'Even executive requests require transparent impact analysis. The PM\'s role is to enable informed decision-making, not unilateral compliance. Present the CEO with: What is the actual benefit of 3 weeks early delivery? What are the risks to quality, other projects, and team capacity? What is the recommended path? Then execute the decision through appropriate channels (even if expedited). Bypassing governance without documentation creates accountability gaps. PMI values proactive transparency over blind compliance.'
  },
  {
    domain: 'People',
    scenario: 'A senior team member consistently undermines the project manager\'s decisions in team meetings by making sarcastic comments and encouraging others to question every plan. The behavior is affecting team morale.',
    question: 'What should the project manager do FIRST?',
    options: [
      'Publicly call out the behavior in the next team meeting to make an example',
      'Have a private, direct conversation with the team member about specific behaviors and their impact on team dynamics, and seek to understand the root cause',
      'Exclude the team member from team meetings going forward',
      'Ask the functional manager to deal with the issue'
    ],
    correct: 1,
    explanation: 'Disruptive behavior must be addressed directly but privately. A private conversation allows the PM to: identify specific behaviors (not personality), explain the impact on team effectiveness, and listen to the team member\'s perspective (sometimes there\'s a legitimate concern expressed destructively). Public confrontation escalates conflict and damages trust. Exclusion avoids the root cause. The PM is responsible for team performance — abdicating to the functional manager without first attempting direct resolution is premature. This follows the Collaborate/Problem-Solve conflict model.'
  },
  {
    domain: 'People',
    scenario: 'A project team member tells the PM that they will not complete their task because they believe the approach chosen by the PM is technically wrong. The team member has not raised this concern before, and the deadline is tomorrow.',
    question: 'What should the project manager do?',
    options: [
      'Tell the team member to complete the task as directed and document their objection separately',
      'Schedule a technical review with the relevant experts to evaluate the concern quickly, protect the deadline if the concern is unfounded, or initiate a change request if it has merit',
      'Accept the team member\'s position and change the approach immediately',
      'Escalate the non-compliance to HR'
    ],
    correct: 1,
    explanation: 'PMI values substance over hierarchy — a late-raised technical concern may be valid. The PM should quickly evaluate whether the concern has merit (bring in SMEs if needed), not automatically override or automatically comply. If unfounded, proceed with direction and document the PM\'s decision rationale. If founded, initiate proper change evaluation. Dismissing technical concerns destroys psychological safety. Escalating to HR for a technical disagreement is disproportionate. This balances deadline pressure with technical responsibility.'
  },
  {
    domain: 'People',
    scenario: 'A project has been transferred to a new project manager. During a review of project documentation, the new PM discovers the previous PM deliberately understated risks in status reports to avoid difficult conversations with the sponsor.',
    question: 'What must the new project manager do?',
    options: [
      'Continue the same reporting style to maintain stakeholder confidence',
      'Correct the reporting immediately: present accurate risk status to the sponsor, explain the new reporting approach, and begin honest baseline communication going forward',
      'Report the previous PM to PMI\'s ethics committee before doing anything else',
      'Wait to see if the risks materialize before changing reports'
    ],
    correct: 1,
    explanation: 'PMI\'s Code of Professional Conduct requires honesty and transparency. The new PM has an immediate ethical obligation to correct misleading information — regardless of the predecessor\'s behavior. The approach should be professional, not accusatory: acknowledge the transition, reset expectations, and establish honest baselines. The sponsor needs accurate information to make sound decisions. Continuing false reporting makes the new PM complicit. Reporting to PMI ethics is appropriate only if internal resolution fails; correcting the situation is the first step.'
  },
  {
    domain: 'People',
    scenario: 'Two team leads disagree strongly on a technical solution. Both have presented compelling arguments. The project manager does not have deep technical expertise in this area.',
    question: 'What should the project manager do?',
    options: [
      'Make the decision based on seniority of the two team leads',
      'Facilitate a structured evaluation: bring in a neutral SME, define objective decision criteria, evaluate both solutions against those criteria, and reach a documented team decision',
      'Let the two leads argue until one convinces the other',
      'Choose the solution that appears to have the lower cost'
    ],
    correct: 1,
    explanation: 'The PM adds value not by being the technical expert, but by facilitating a rigorous decision-making process. Bringing in a neutral SME, defining explicit evaluation criteria (e.g., performance, maintainability, risk, cost), and running both solutions through those criteria produces a defensible, team-owned decision. This is the PM\'s highest-value role in technical disagreements. Defaulting to seniority or cost alone ignores key factors. This reflects Servant Leadership and the Value-Focused mindset of PMBOK 7.'
  },
  {
    domain: 'People',
    scenario: 'A high-performing team member is approached by a competing project manager who offers them a more exciting role. The team member tells the PM they are considering leaving mid-project.',
    question: 'What should the project manager do?',
    options: [
      'Alert HR immediately and block the transfer',
      'Have an honest conversation about their career goals, explore what would make their current role more fulfilling, and if leaving is likely, create a knowledge transfer plan immediately',
      'Ignore the concern — the team member should honor their current commitment',
      'Offer unauthorized incentives (salary increase, title) to retain them'
    ],
    correct: 1,
    explanation: 'The PM should first understand the individual\'s motivations — often a conversation reveals addressable concerns (skill development, recognition, autonomy). If leaving is inevitable, the PM must protect the project by initiating knowledge transfer immediately (documentation, pair programming, handover plans). Blocking transfers damages relationships and may be impossible in matrix organizations. Offering unauthorized incentives creates HR and governance problems. PMI values proactive risk management and caring for team members as people, not just resources.'
  },
  {
    domain: 'People',
    scenario: 'A project manager is asked to lead a team spanning three functional departments. The PM has no direct authority over team members who report to their functional managers.',
    question: 'What type of organization is this, and what leadership approach is most effective?',
    options: [
      'Functional organization — use hierarchical authority through functional managers',
      'Matrix organization — use influence, collaboration, and relationship-building since formal authority is limited',
      'Projectized organization — exercise full PM authority over all resources',
      'Composite organization — wait for the functional managers to resolve all issues'
    ],
    correct: 1,
    explanation: 'A matrix organization shares resources between functional and project management structures. PMs in matrix environments have limited formal authority and must lead through influence: building strong relationships, demonstrating competence, aligning team members to the project\'s purpose, and negotiating effectively with functional managers. Understanding the authority structure is foundational to PMP exam questions on organizational dynamics. The PM\'s power here is personal (expertise, relationships) and referent (respect), not positional.'
  },
  {
    domain: 'People',
    scenario: 'During a project, the PM observes that a team member with excellent technical skills is constantly interrupting others during design discussions and dismissing ideas before they are fully explained.',
    question: 'What should the project manager do to improve group dynamics?',
    options: [
      'Remove the disruptive team member from design discussions entirely',
      'Implement structured discussion protocols (e.g., everyone speaks before discussion opens, ideas must be summarized before critique), and coach the individual privately on active listening and collaborative communication',
      'Ask the team to vote on whether the disruptive member should participate',
      'Assign the disruptive member to solo technical work to separate them from group discussions'
    ],
    correct: 1,
    explanation: 'Structured facilitation techniques (talking tokens, round-robins, idea summation before critique) systematically prevent dominance without singling out any individual. This is more sustainable and less damaging to team relationships than punitive measures. Private coaching addresses the root behavior directly. The goal is to extract the team member\'s technical value while protecting the psychological safety of others. This reflects PMBOK 7 Principle #2 (Collaborative Team Environment) and effective facilitation skills.'
  },
  {
    domain: 'People',
    scenario: 'A team member who was initially highly motivated has become increasingly withdrawn and is producing work below their historical standard. When asked in a one-on-one, they say "everything is fine."',
    question: 'What should the project manager do?',
    options: [
      'Accept the team member\'s word that everything is fine and document the performance decline formally',
      'Create a supportive environment by checking in regularly, sharing specific observations without judgment, offering resources (flexibility, support, mentoring), and following up if the pattern continues',
      'Immediately involve HR given the performance decline',
      'Reassign the team member to less critical work'
    ],
    correct: 1,
    explanation: 'Performance decline with withdrawal often signals personal distress, burnout, or disengagement that the team member may not feel safe disclosing. The PM\'s role is to create psychological safety: share specific observations ("I\'ve noticed X, and I\'m concerned") without accusation, offer support options, and give space. Jumping to HR before supportive intervention is premature and damages trust. Reassignment before understanding the cause may worsen the situation. This reflects PMBOK 7 Principle #1 (Stewardship — caring for people) and Herzberg\'s motivational theory.'
  },
  {
    domain: 'People',
    scenario: 'A stakeholder who was previously supportive of the project has become resistant after a major change to the project scope. They are now publicly criticizing the project in executive meetings.',
    question: 'What should the project manager do?',
    options: [
      'Escalate the stakeholder\'s behavior to the executive sponsor to have them silenced',
      'Meet privately with the stakeholder to understand their specific concerns about the scope change, explain the rationale and benefits, and collaboratively identify ways to address their concerns within project constraints',
      'Continue the project without engaging the resistant stakeholder',
      'Increase the scope to satisfy the stakeholder\'s original expectations'
    ],
    correct: 1,
    explanation: 'Stakeholder resistance usually signals unmet expectations or unaddressed concerns, not irrational opposition. The PM must re-engage the stakeholder directly: understand their specific objections, share context they may not have had, and seek common ground. Public criticism often stops when the stakeholder feels heard and respected. Escalating to silence them damages the relationship and creates a more powerful opponent. Changing scope to appease is a form of gold-plating that creates governance problems. Proactive stakeholder re-engagement is a core PM competency.'
  },
  {
    domain: 'People',
    scenario: 'A project manager is managing an international team. During a virtual meeting, a team member from a high-power-distance culture is asked for feedback on a decision made by a senior manager. The team member says they agree with everything.',
    question: 'What should the project manager do to get genuine feedback?',
    options: [
      'Document that the team member has approved the decision and proceed',
      'Use anonymous surveys, private written input channels, or hypothetical framing ("If a colleague had concerns about this approach, what might they be?") to create a safer space for candid feedback',
      'Tell the team member that cultural norms cannot override the team\'s need for honest input',
      'Stop inviting team members from high-power-distance cultures to feedback sessions'
    ],
    correct: 1,
    explanation: 'In high-power-distance cultures, openly disagreeing with a senior person is taboo — it is a sign of disrespect, not dishonesty. The PM must adapt feedback mechanisms to respect cultural norms while still capturing critical perspectives. Anonymous surveys, private conversations, indirect framing, and written pre-meeting input are culturally safe alternatives. Telling someone to override their cultural values is counterproductive and disrespectful. This is cultural intelligence in action — PMBOK 7 Principle #3 (Stakeholder Engagement) and Principle #7 (Tailoring).'
  },
  {
    domain: 'People',
    scenario: 'A project manager has a team member who has been with the organization for 20 years and openly resists any new tools or processes introduced for the project, saying "we\'ve always done it this way."',
    question: 'What is the BEST approach?',
    options: [
      'Mandate use of new tools and document non-compliance',
      'Explain the WHY behind the change (benefits to them and the project), involve them in piloting or customizing the new approach, and leverage their experience to improve implementation',
      'Exclude the resistant team member from any activities requiring the new tools',
      'Escalate to the functional manager and have the team member replaced'
    ],
    correct: 1,
    explanation: 'Resistance to change from experienced team members often comes from a legitimate desire for effectiveness — they\'ve seen poorly implemented changes before. The PM should: explain the value proposition clearly, involve them in the change (people support what they help create), leverage their organizational knowledge to improve the implementation, and be patient. Their experience can actually make the new approach better if channeled constructively. Mandating or replacing them discards valuable knowledge and damages morale. This reflects PMBOK 7 Principle #12 (Enable Change).'
  },
  {
    domain: 'People',
    scenario: 'During a retrospective, a team reveals that they consistently feel pressured to commit to more work in sprint planning than they can realistically complete, due to the project manager\'s presence in planning sessions.',
    question: 'What should the project manager do?',
    options: [
      'Reassure the team that the commitments are their choice and continue attending',
      'Stop attending sprint planning sessions to remove the authority presence that may be creating social pressure, and allow the team to self-determine their capacity',
      'Set the sprint commitment directly to ensure the right amount of work is done',
      'Ask the Scrum Master to push the team harder since the capacity seems underutilized'
    ],
    correct: 1,
    explanation: 'In Agile, sprint planning is a team ceremony — the team owns the commitment, not the PM. When a PM (or any authority figure) attends, it creates an implicit pressure to over-commit. The solution is to remove the authority presence from the ceremony, enabling genuine self-organization. The PM can review the results afterward and address systemic capacity issues through backlog management or stakeholder expectation management — not by attending sprint planning. This directly reflects servant leadership and psychological safety principles.'
  },
  {
    domain: 'People',
    scenario: 'A project team member comes to the PM and says they believe another team member is violating the organization\'s code of conduct by sharing confidential project information externally.',
    question: 'What should the project manager do?',
    options: [
      'Ask the reporting team member to gather more evidence before escalating',
      'Take the report seriously, document it confidentially, investigate facts through appropriate channels (HR, legal), and protect the reporting team member from retaliation',
      'Tell the reporter that this is an HR matter and the PM cannot be involved',
      'Confront the accused team member directly in the team meeting'
    ],
    correct: 1,
    explanation: 'PMI\'s Code of Ethics requires PMs to act on potential misconduct and protect whistleblowers. The PM\'s role is not to personally investigate (that\'s HR and legal\'s role) but to formally document the report, escalate through proper organizational channels, and ensure the reporter is protected from retaliation. Asking the reporter to gather more evidence before acting shifts a burden they shouldn\'t carry. Confronting the accused publicly or in team meetings violates due process. Acting through proper channels is both ethical and legally protective for all parties.'
  },
  {
    domain: 'People',
    scenario: 'A team is using an agile approach and has completed 8 sprints. The velocity has been consistently around 40 story points per sprint. In sprint planning, the Product Owner pushes the team to commit to 60 story points, citing business urgency.',
    question: 'What should the Scrum Master/project manager do?',
    options: [
      'Support the PO\'s request — business urgency overrides historical velocity',
      'Explain that artificially inflating commitment leads to incomplete sprints, technical debt, and declining team morale, and advocate for sustainable pace based on historical velocity',
      'Let the team decide without advocating a position',
      'Reduce the sprint to 2 weeks to fit in more work'
    ],
    correct: 1,
    explanation: 'Sustainable pace is an explicit Agile and Lean principle. Forcing teams beyond their capacity creates partial completions (incomplete Definition of Done), technical debt, and burnout — all of which slow future velocity and hurt long-term throughput. The PM/SM should educate the Product Owner on empirical velocity and its purpose, then advocate for realistic commitment. The PM can help the PO achieve business urgency through other means: scope negotiation, adding team capacity properly, or adjusting release scope. Blind compliance to an unrealistic commitment is not servant leadership.'
  },
  {
    domain: 'People',
    scenario: 'The project manager is about to conduct performance appraisals for team members. In a matrix organization, the PM provides performance input but the functional manager makes the final assessment.',
    question: 'What should the PM do to make their input as effective as possible?',
    options: [
      'Provide only general comments about team performance since formal evaluations are the functional manager\'s responsibility',
      'Provide specific, behavioral, evidence-based feedback for each team member covering both contributions and areas for growth, communicated timely and agreed with the functional manager',
      'Focus only on positive feedback to maintain team motivation',
      'Ask team members to rate each other and use those ratings as the input'
    ],
    correct: 1,
    explanation: 'In matrix organizations, the PM is the primary observer of project performance and has a responsibility to provide high-quality, specific input. Effective performance feedback is: specific (which behavior, which outcome), timely (close to the events), evidence-based (observable facts, not opinions), and balanced (growth areas + contributions). Vague feedback gives functional managers nothing useful. Positive-only feedback is dishonest. Peer ratings alone without PM perspective miss the project management dimension. This shapes team development and is a key PM accountability.'
  },
  {
    domain: 'People',
    scenario: 'A project manager is dealing with a situation where the team is geographically dispersed across 6 time zones, making real-time collaboration difficult. Virtual meetings frequently have poor engagement.',
    question: 'What combination of strategies is MOST effective?',
    options: [
      'Mandate all team members adjust to one standard time zone for all meetings',
      'Reduce synchronous meetings to only essential decisions, implement async communication tools (recorded loom videos, collaborative docs, async stand-up bots), and rotate meeting times to share the time-zone burden equitably',
      'Assign a regional lead in each time zone to represent their team',
      'Move all communication to email to avoid scheduling conflicts'
    ],
    correct: 1,
    explanation: 'Modern distributed team management requires a shift to async-first culture. Reducing synchronous meetings reduces the time-zone burden while async tools (Loom, Notion, Slack threads) enable high-quality collaboration without real-time presence. Rotating meeting times demonstrates fairness and shared burden. Regional leads can help but become communication bottlenecks. Email-only creates information silos. This is tailoring communication approaches to the project context — PMBOK 7 Principle #7 and #3.'
  },
  {
    domain: 'People',
    scenario: 'An agile team member is performing exceptionally well individually, consistently finishing their tasks early. However, they never help other team members who are struggling, creating an uneven workload distribution.',
    question: 'What should the project manager do?',
    options: [
      'Reward the high performer individually and leave team dynamics to self-resolve',
      'Facilitate a team norm discussion around collective ownership and swarming on blockers, and have a private conversation with the high performer about shifting from individual excellence to team success',
      'Increase the high performer\'s personal workload to keep them busy',
      'Publicly praise the high performer to motivate others to match their output'
    ],
    correct: 1,
    explanation: 'In agile, the team is the unit of delivery, not individuals. Individual optimization at the expense of team throughput is an anti-pattern. The PM/SM should establish team norms around collective ownership ("we finish together, not individually"), and coach the high performer on the value of swarming — helping others is the highest-value activity when one\'s own tasks are complete. This is a cultural conversation, not a performance issue. Public praise for individual speed reinforces the wrong behavior. This reflects PMBOK 7 Principle #2 (Collaborative Team).'
  },
  {
    domain: 'People',
    scenario: 'A key team member reveals they have a serious personal health issue that will require 6 weeks of medical leave during a critical project phase. The team member is the only person with expertise in a critical system component.',
    question: 'What should the project manager do?',
    options: [
      'Ask the team member to delay their medical leave until after the critical phase',
      'Express support for the team member\'s health needs, immediately assess the knowledge transfer risk, and implement a rapid cross-training and documentation plan before the leave begins',
      'Replace the team member immediately with someone who can be available',
      'Escalate to the project sponsor that the project is now at unacceptable risk'
    ],
    correct: 1,
    explanation: 'The PM must respond both humanely and professionally: first, unconditional support for the medical leave (PMBOK 7 Principle #1 — Stewardship), then immediately address the knowledge risk. A rapid but thorough knowledge transfer (pair programming, documented architecture decision records, recorded walkthroughs) protects the project. The sponsor should be informed of the risk and impact assessment, but only after the PM has already taken mitigating action — not as a panic response. This is proactive risk management combined with human-centered leadership.'
  },
  {
    domain: 'People',
    scenario: 'A new project manager joins a team of experienced professionals. During their first week, they observe that the team already has effective processes, strong relationships, and is delivering well ahead of schedule.',
    question: 'What leadership style is MOST appropriate for this PM?',
    options: [
      'Directive — immediately establish authority and introduce new processes to demonstrate leadership',
      'Delegative/Laissez-Faire — trust the team\'s self-management, provide support when needed, focus on stakeholder management and external impediments',
      'Coaching — spend significant time coaching each team member individually',
      'Supportive — hold regular one-on-ones to build relationships before contributing'
    ],
    correct: 1,
    explanation: 'Situational leadership (Hersey & Blanchard) says to match leadership style to team maturity. A high-performing, self-organizing team (Tuckman\'s Performing stage) needs minimal direction. The PM adds most value by managing stakeholders, removing organizational blockers, and protecting the team\'s environment — not by changing successful processes or asserting presence. Directive leadership here would disrupt high performance. Extensive coaching is appropriate for less mature teams. The highest-value role for the PM in this context is external buffering and enablement.'
  },
  {
    domain: 'People',
    scenario: 'During project execution, the PM discovers that a team member has been working on "unauthorized technical improvements" to the project deliverable — improvements that were not in scope but that the team member believes will benefit the client.',
    question: 'What should the project manager do?',
    options: [
      'Praise the team member\'s initiative and include the improvements in the delivery',
      'Require the team member to stop the unauthorized work, evaluate whether the improvements have merit through the change control process, and clarify that all scope additions require approval',
      'Ignore it if the improvements seem technically valid',
      'Report the team member to the functional manager for disciplinary action'
    ],
    correct: 1,
    explanation: 'Adding features beyond approved scope — even well-intentioned ones — is "gold-plating" and is a scope creep violation. It wastes resources, may introduce unintended risks, and undermines governance. The PM must stop the unauthorized work and route the idea through proper channels (change request). If the improvement is genuinely valuable, it can be evaluated, approved, and budgeted — which also protects the team member legally. This teaches proper governance without punishing initiative. It\'s about process, not punishment.'
  },
  {
    domain: 'People',
    scenario: 'A project team is approaching burnout after 4 months of intense sprints. Several team members mention feeling exhausted, and productivity metrics confirm declining velocity for the last 3 sprints.',
    question: 'What should the project manager prioritize?',
    options: [
      'Maintain the current sprint velocity targets — slowing down now would jeopardize the release date',
      'Schedule a team health retrospective, negotiate with stakeholders for scope reduction or deadline extension, introduce sustainable pace practices, and consider a brief recovery sprint or lighter sprint',
      'Replace the least productive team members to maintain output',
      'Set stricter accountability measures to improve productivity'
    ],
    correct: 1,
    explanation: 'Burnout is a systemic failure, not an individual failure. Forcing exhausted teams to maintain velocity produces technical debt, errors, turnover, and eventual collapse — all more damaging than a temporary slowdown. The PM must negotiate relief through the project triangle: scope reduction, timeline extension, or resource addition. A health retrospective rebuilds team morale and surfaces improvement opportunities. Sustainable pace is an explicit Agile principle. Replacing team members discards institutional knowledge and causes another team reset. PMI Principle #1 (Stewardship) requires caring for people.'
  },

// ─────────────────────────── PROCESS DOMAIN (~90 questions) ───────────────────────────
  {
    domain: 'Process',
    scenario: 'A project manager is in the Planning phase of a complex IT infrastructure project. The stakeholder register has been created and requirements have been collected. The PM is about to begin scope definition.',
    question: 'What is the correct sequence of scope planning processes?',
    options: [
      'Create WBS → Define Scope → Collect Requirements → Plan Scope Management',
      'Plan Scope Management → Collect Requirements → Define Scope → Create WBS',
      'Define Scope → Plan Scope Management → Create WBS → Collect Requirements',
      'Collect Requirements → Plan Scope Management → Create WBS → Define Scope'
    ],
    correct: 1,
    explanation: 'PMBOK 6 scope processes follow a logical sequence: (1) Plan Scope Management — establish how scope will be managed. (2) Collect Requirements — gather what stakeholders need. (3) Define Scope — develop the detailed scope statement from requirements. (4) Create WBS — decompose scope into work packages. This sequence reflects the progressive elaboration principle: plan how, then gather what, then define it, then break it down.'
  },
  {
    domain: 'Process',
    scenario: 'A project schedule shows the following activities and durations on the critical path: A(3d) → B(5d) → C(7d) → D(4d). Activity E has a total float of 3 days and is not on the critical path.',
    question: 'If Activity C is delayed by 8 days, what is the impact on the project?',
    options: [
      'The project is delayed by 8 days since C is on the critical path',
      'The project is delayed by 8 days, AND the critical path may shift if Activity E now has zero or negative float',
      'No impact since Activity E has 3 days of float that can be used',
      'The project is delayed by 5 days after absorbing Activity E\'s float'
    ],
    correct: 1,
    explanation: 'When a critical path activity is delayed by 8 days, the project end date moves by 8 days. Additionally, a near-critical path with 3 days of float would now have −5 days of float (3 − 8 = −5), meaning it becomes a new critical path with NEGATIVE float, requiring compression analysis. This demonstrates why tracking near-critical paths matters. The float of non-critical activities is not relevant to absorbing critical path delays.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is presented with the following EVM data: BAC = $400,000, AC = $200,000, EV = $160,000, PV = $220,000. The sponsor asks: "Will we finish within budget and on schedule?"',
    question: 'What should the PM report?',
    options: [
      'Yes on both counts — we have spent less than half the budget',
      'We are over budget (CPI = 0.80) and behind schedule (SPI = 0.73). Forecasted total cost EAC = $500,000, which is $100,000 over budget.',
      'We are under budget but behind schedule',
      'We cannot tell from this data whether we will finish within budget'
    ],
    correct: 1,
    explanation: 'CPI = EV/AC = 160K/200K = 0.80 (over budget — only $0.80 of value per $1 spent). SPI = EV/PV = 160K/220K = 0.727 (behind schedule — only 73% of planned work done). EAC = BAC/CPI = 400K/0.80 = $500,000 (forecast $100K overrun). This is a double-negative scenario. The PM must report this honestly with corrective action options. Note: spending less in dollar terms than the budget line does NOT mean you are under budget — EVM is about value earned, not dollars spent.'
  },
  {
    domain: 'Process',
    scenario: 'During project execution, a team member identifies a way to exceed a deliverable\'s performance specifications in a way that will add no cost or time. They want to include it as a "bonus" for the client.',
    question: 'What should the project manager do?',
    options: [
      'Approve the enhancement since it adds value at no cost',
      'Decline — any addition beyond approved specifications is gold-plating and a scope change requiring proper evaluation and approval, even if free',
      'Have the enhancement evaluated by the quality team before deciding',
      'Let the team member proceed but document it in the lessons learned'
    ],
    correct: 1,
    explanation: 'Gold-plating — adding features beyond agreed scope, even "free" ones — violates project governance. It uses team capacity, may introduce unforeseen quality risks, sets unmet expectations for future projects, and undermines the PM\'s control over scope. The correct path: evaluate the enhancement through the change control process. If genuinely beneficial and approved, it can be added properly. Even zero-cost changes must go through Perform Integrated Change Control (Process 4.6) if they affect the scope baseline.'
  },
  {
    domain: 'Process',
    scenario: 'A project team is estimating activity durations for a new technology integration with no historical data. The team has identified three scenarios: Optimistic: 6 weeks, Most Likely: 10 weeks, Pessimistic: 20 weeks.',
    question: 'Using PERT (Beta Distribution), what is the expected duration?',
    options: [
      '12 weeks (average of all three)',
      '11 weeks using formula (O + 4M + P) / 6 = (6 + 40 + 20) / 6 = 11 weeks',
      '10 weeks (most likely estimate)',
      '13 weeks (weighted toward pessimistic)'
    ],
    correct: 1,
    explanation: 'The PERT Beta Distribution formula is: Expected Duration = (O + 4M + P) / 6. Here: (6 + 4×10 + 20) / 6 = (6 + 40 + 20) / 6 = 66/6 = 11 weeks. Note the triangular distribution would give (6 + 10 + 20) / 3 = 12 weeks. PERT weights the most likely estimate 4× higher, reflecting that the most likely scenario is the most probable. This technique explicitly acknowledges uncertainty — critical for new technology projects.'
  },
  {
    domain: 'Process',
    scenario: 'A construction project has 12 activities on the critical path. The project is 3 weeks behind schedule. The PM is analyzing whether to crash or fast-track the schedule.',
    question: 'What is the key criterion for choosing between crashing and fast-tracking?',
    options: [
      'Crashing is always preferred because it is more reliable',
      'Crashing adds cost but reduces risk; fast-tracking avoids added cost but increases rework risk. Choose based on which constraint (cost or risk) is more acceptable given the project context.',
      'Fast-tracking is always preferred because it has no direct cost',
      'Choose based on which option the project sponsor prefers'
    ],
    correct: 1,
    explanation: 'The choice between crashing (adding resources) and fast-tracking (overlapping activities) depends on the project\'s cost and risk constraints. Crashing: predictable duration reduction, adds direct cost, no increased quality risk. Fast-tracking: no added cost, but requires activities to proceed in parallel that were designed sequentially — creating rework risk if earlier work changes. If the budget cannot absorb crashing cost, fast-track where activities can logically overlap. If rework risk is unacceptable (construction safety), crash. Both must be applied to CRITICAL PATH activities only.'
  },
  {
    domain: 'Process',
    scenario: 'A project quality audit reveals that 12% of deliverables consistently fail inspection. The project manager wants to find the root cause.',
    question: 'Which tool is MOST appropriate for root cause analysis?',
    options: [
      'Pareto Chart — to identify which defect categories account for 80% of problems',
      'Ishikawa (Fishbone) Diagram — to systematically explore all potential cause categories (People, Process, Equipment, Materials, Environment, Management)',
      'Control Chart — to monitor process stability over time',
      'Scatter Diagram — to identify correlation between two variables'
    ],
    correct: 1,
    explanation: 'The Ishikawa (Fishbone/Cause-and-Effect) Diagram is specifically designed for ROOT CAUSE analysis. It maps multiple potential cause categories systematically toward a single effect. While a Pareto chart identifies WHICH problems are most frequent (and would be the right tool for prioritizing which defect to address first), the Fishbone diagram explores WHY any given problem occurs. For a defect rate investigation, first use Pareto to prioritize which defect to focus on, then use Fishbone to find its root causes.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is in the process of closing a project. The sponsor asks the PM to skip the formal lessons learned session to save time, since the team is already dispersed.',
    question: 'What should the project manager do?',
    options: [
      'Skip the lessons learned since the project is complete and it would be difficult to gather the team',
      'Explain the organizational value of lessons learned (updating OPAs to benefit future projects), insist on at least an abbreviated virtual session, and document key retrospective items with team input',
      'Agree with the sponsor — close the project as quickly as possible',
      'Document lessons learned based on the PM\'s personal observations without team input'
    ],
    correct: 1,
    explanation: 'Lessons Learned are an explicit PMBOK 6 requirement in Close Project or Phase (Process 4.7) and feed directly into Organizational Process Assets (OPAs). Skipping them deprives the organization of institutional knowledge. The PM should advocate for at least a shortened virtual format — a 60-minute structured retrospective produces tremendous value. PM-only documentation without team input loses 80% of valuable perspectives. The PM\'s ethical obligation includes completing project governance properly, not just delivering the product.'
  },
  {
    domain: 'Process',
    scenario: 'A project team is using an agile approach. After 6 sprints, stakeholders request a detailed Gantt chart and formal milestone schedule. The team has never used predictive planning tools.',
    question: 'What should the project manager do?',
    options: [
      'Refuse — Gantt charts are incompatible with agile and would destroy team agility',
      'Create a release roadmap with estimated sprint targets for key milestones, which provides the predictability stakeholders need while preserving agile team autonomy at the sprint level',
      'Convert the project entirely to a waterfall approach to satisfy stakeholders',
      'Have the stakeholders attend sprint reviews instead of providing formal schedules'
    ],
    correct: 1,
    explanation: 'Hybrid project management recognizes that agile teams often operate within organizational reporting structures that require predictive artifacts. A release roadmap (high-level milestones mapped to estimated sprint targets based on velocity) satisfies stakeholder predictability needs without micromanaging sprint internals. This is the professional hybrid approach. Pure refusal alienates stakeholders. Full waterfall conversion destroys the agility benefits. Forcing stakeholders to attend sprint reviews instead of providing summaries may be practical for some but doesn\'t meet executive reporting needs.'
  },
  {
    domain: 'Process',
    scenario: 'A project has 8 unresolved change requests pending CCB approval. Three of them have interdependencies. The PM wants to process them efficiently.',
    question: 'What is the BEST approach?',
    options: [
      'Process all change requests independently since each must stand on its own merits',
      'Group the interdependent change requests for simultaneous evaluation, conduct an integrated impact analysis across all pending changes, and batch the CCB meeting to consider interactions between changes',
      'Process the smallest, quickest changes first to reduce the queue',
      'Implement all 8 changes and then seek retroactive approval'
    ],
    correct: 1,
    explanation: 'Integrated Change Control requires analyzing the impact of changes on ALL project constraints collectively. When changes are interdependent, evaluating them separately produces incomplete analysis — approving Change A without knowing it conflicts with Change B creates re-work. Grouping interdependent changes for a single integrated analysis is the most efficient and accurate approach. This is why the process is called INTEGRATED change control — it considers the holistic project impact. Retroactive approval violates governance and undermines the purpose of change control.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is planning a complex software project. The business analyst proposes collecting requirements through individual stakeholder interviews. The PM suggests also adding focus groups and prototyping.',
    question: 'Why is using multiple requirements elicitation techniques better than using only interviews?',
    options: [
      'Multiple techniques are always required by PMBOK regardless of project size',
      'Different stakeholders share information more comfortably and completely through different formats; some needs only surface through visual prototypes or group dynamics — no single technique captures all requirements completely',
      'Focus groups replace the need for individual interviews',
      'Prototyping is faster than interviews for all requirements types'
    ],
    correct: 1,
    explanation: 'Requirements elicitation is highly context-dependent. Individual interviews capture explicit requirements from articulate stakeholders. Focus groups surface shared needs and reveal conflicts between stakeholder groups. Prototypes elicit tacit requirements ("I\'ll know it when I see it") that stakeholders cannot verbalize until they interact with something tangible. Using multiple techniques produces more complete, higher-quality requirements. PMBOK 6 lists 10 different Collect Requirements tools specifically because no single technique is sufficient. This is fundamental to project quality.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is reviewing a contract with a vendor. The contract specifies a fixed price of $500,000 with a clause that adjusts the price based on a published construction cost index. The project runs for 3 years.',
    question: 'What type of contract is this, and what risk does it address?',
    options: [
      'Firm Fixed Price (FFP) — eliminates all cost risk for the buyer',
      'Fixed Price with Economic Price Adjustment (FP-EPA) — protects the seller from inflation/commodity price changes over long contracts, while maintaining cost predictability for the buyer',
      'Cost Plus Fixed Fee (CPFF) — compensates the seller for actual costs',
      'Time and Materials (T&M) — provides maximum flexibility'
    ],
    correct: 1,
    explanation: 'FP-EPA (Fixed Price with Economic Price Adjustment) is specifically designed for long-duration contracts where commodity/labor price inflation creates unfair seller risk. The published index provides an objective, pre-agreed mechanism for price adjustment — neither party can manipulate it. This is preferred over CPFF for long contracts because it maintains cost predictability for the buyer while protecting the seller from market forces outside their control. This contract type appears on the PMP exam in procurement management questions.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is conducting a risk workshop. A team member proposes that the risk of "key vendor going bankrupt" has a 10% probability and high impact. Another team member says the probability is closer to 2%.',
    question: 'What technique should the PM use to reach a consensus probability estimate?',
    options: [
      'Average the two estimates: (10% + 2%) / 2 = 6%',
      'Use the Delphi technique: collect estimates anonymously, share results, allow reflection, and repeat until consensus is reached — eliminating social pressure and anchoring bias',
      'Accept the higher estimate (10%) as the more conservative and risk-aware position',
      'Ask the most senior team member to make the final call'
    ],
    correct: 1,
    explanation: 'The Delphi Technique is specifically designed to achieve expert consensus while eliminating social biases (anchoring, deference to seniority, groupthink). By collecting estimates anonymously and sharing statistical summaries between rounds, it allows experts to revise estimates based on information without social pressure. Simply averaging ignores the reasoning behind the estimates. Taking the higher number without justification over-inflates the risk register. Seniority-based decisions are exactly what Delphi is designed to prevent.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager has created a detailed project schedule. The network diagram shows three paths: Path 1 = 45 days (critical path), Path 2 = 43 days, Path 3 = 38 days.',
    question: 'Which path requires the MOST management attention and why?',
    options: [
      'Path 1 only — it is the critical path with zero float',
      'Both Path 1 and Path 2 require intensive monitoring — Path 2 has only 2 days of float and any delay could make it the new critical path, threatening the project end date',
      'Path 3 because it has the most schedule compression available',
      'All three paths equally — all must be monitored'
    ],
    correct: 1,
    explanation: 'Critical path management is not binary — near-critical paths with minimal float are almost as risky as the critical path itself. Path 2 with only 2 days of float becomes critical with any single activity delay exceeding 2 days. This is the concept of "critical path risk" — the more near-critical paths exist, the higher the probability that at least one will become critical. Professional schedule management monitors the critical path AND all near-critical paths (typically anything with float ≤ 20% of project duration). Path 3 with 7 days of float has more buffer and less urgency.'
  },
  {
    domain: 'Process',
    scenario: 'During the project monitoring and control phase, the PM notices that the project\'s CPI has steadily declined from 1.0 to 0.85 over the last four reporting periods despite corrective actions taken in periods 2 and 3.',
    question: 'What does this trend indicate and what should the PM do?',
    options: [
      'The corrective actions are working — CPI decline has slowed, so continue the same approach',
      'The corrective actions have been ineffective — the trend indicates a systemic performance problem requiring root cause analysis, revised corrective strategy, and potentially a baseline revision',
      'CPI fluctuation is normal and no action beyond documentation is needed',
      'The project should be terminated since performance cannot recover'
    ],
    correct: 1,
    explanation: 'A continuously declining CPI despite corrective actions signals that the corrective strategy is not addressing the root cause. EVM trend analysis is not just about current values — it\'s about trajectory. A declining trend means the problem is structural, not temporary. The PM must: conduct root cause analysis (why are corrective actions failing?), redesign the corrective strategy, assess whether the baseline is still achievable, and potentially rebaseline after stakeholder consultation. Research shows that CPI at the 20% completion point is highly predictive of final CPI — this is not a wait-and-see situation.'
  },
  {
    domain: 'Process',
    scenario: 'A software project uses story points for estimation. At the end of Sprint 10, the team has completed 350 story points out of a total 800-point product backlog. Velocity has averaged 35 points per sprint.',
    question: 'How many sprints are needed to complete the remaining backlog?',
    options: [
      '12 more sprints (450 / 35 = ~12.9, rounded up)',
      'The remaining 450 points at 35 points/sprint will take approximately 13 more sprints, for a total of ~23 sprints from project start',
      '10 more sprints since it took 10 sprints for the first 350 points',
      'Cannot be calculated without knowing the sprint length'
    ],
    correct: 1,
    explanation: 'Remaining work = 800 − 350 = 450 story points. At 35 points/sprint velocity: 450/35 = 12.86 sprints, which rounds up to 13 more sprints. Total from project start: 10 + 13 = 23 sprints. This is agile forecasting using velocity. Note: the velocity-based forecast should include a confidence range (given velocity variance), and assumes the product backlog does not grow. This type of calculation appears on PMP exams in agile forecasting context.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is conducting the procurement process. Two vendor proposals have been received. Vendor A scores higher on technical approach but charges 20% more. Vendor B is cheaper but has less experienced staff.',
    question: 'What evaluation approach should the PM use?',
    options: [
      'Select Vendor A based solely on technical superiority since quality is paramount',
      'Select Vendor B since it is cheaper and stays within budget constraints',
      'Use a weighted scoring model with pre-defined, objective criteria that reflect the project\'s priorities (technical quality, cost, experience, risk profile) — award based on total weighted score',
      'Negotiate with both vendors until one meets both technical and cost requirements'
    ],
    correct: 2,
    explanation: 'Source selection should use a pre-defined weighted scoring model (Multi-Criteria Decision Analysis) developed before receiving proposals — this prevents retroactive rationalization of preferences. Criteria and weights reflect the project\'s actual priorities: if technical quality is mission-critical, it gets higher weight. The objective score drives the decision, not a single factor. Negotiation (option D) can be useful in procurement but should happen after source selection criteria are applied and a preferred vendor is identified. PMBOK 6 Section 12 addresses this in Conduct Procurements.'
  },
  {
    domain: 'Process',
    scenario: 'A construction project is 50% complete. The PM receives an unexpected request from the building authority requiring a major design change to comply with a newly enacted safety regulation.',
    question: 'What is the correct order of actions?',
    options: [
      'Immediately implement the regulatory change to avoid non-compliance penalties',
      'Document the regulatory requirement, conduct an impact analysis on scope/schedule/cost, submit a change request through ICC, obtain CCB approval, and then implement — communicating timeline impacts to stakeholders',
      'Request an exemption from the regulation to protect the project baseline',
      'Terminate the construction until the regulatory requirements are fully resolved'
    ],
    correct: 1,
    explanation: 'Even legally mandated changes must go through Perform Integrated Change Control (Process 4.6). The change control process exists to ensure all impacts are understood, documented, and communicated before implementation — it does not slow down the response to regulatory requirements. It enables it to be done correctly. The impact analysis determines cost, schedule, and quality implications that must be communicated to sponsors and clients. Skipping ICC means implementing changes with unknown impact. The urgency of compliance creates a priority change request, not an excuse to bypass governance.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is establishing the project management plan for a new product development project. The project has high technical uncertainty but well-defined business requirements.',
    question: 'What development approach is MOST appropriate?',
    options: [
      'Pure waterfall — requirements are well-defined so the full plan can be created upfront',
      'Iterative/incremental hybrid — use defined phases for architecture and requirements (predictive) while using sprints for technical development (adaptive), allowing technical uncertainty to be reduced progressively',
      'Pure agile — technical uncertainty requires maximum flexibility',
      'Use a phased waterfall with frequent testing gates'
    ],
    correct: 1,
    explanation: 'Tailoring the development approach to project characteristics is PMBOK 7 Principle #7. When business requirements are stable but technical execution has high uncertainty, a hybrid approach is optimal: predictive elements manage the known requirements, while iterative/agile elements manage technical discovery. Pure waterfall fails when technical uncertainty makes early detailed planning unreliable. Pure agile ignores the value of the stable requirements structure. This is the professional hybrid tailoring answer that PMP questions increasingly favor.'
  },
  {
    domain: 'Process',
    scenario: 'A PM notices that a team member has been logging 10-hour days for three weeks, while another team member with similar tasks is consistently finishing in 6 hours. Both are on critical path activities.',
    question: 'What does this suggest and what should the PM do?',
    options: [
      'The 10-hour team member is more diligent — reward their extra effort',
      'This suggests a potential skill gap, unclear task definition, or hidden complexity for the first team member. Investigate through a conversation, provide mentoring/pair programming support, and re-evaluate task estimates',
      'Reduce the 10-hour team member\'s workload and give it to the 6-hour team member',
      'Use this data to set new performance benchmarks for the whole team'
    ],
    correct: 1,
    explanation: 'Significant effort variance between team members on similar tasks signals a problem that needs diagnosis, not judgment. Possible causes: unclear acceptance criteria, technical complexity not captured in estimates, skill mismatch for this specific task, or personal issues affecting focus. The PM should investigate through a supportive conversation, offer pair programming or mentoring, and update the risk register if critical path is threatened. Using variance to set blanket benchmarks is unfair and ignores individual differences. This reflects both performance management and risk monitoring.'
  },
  {
    domain: 'Process',
    scenario: 'A project team is working on a data migration project. The project manager wants to establish quality standards. The client\'s existing system has a known 0.1% data error rate. The client wants the new system to have a 0.01% error rate.',
    question: 'What quality management concept describes this requirement?',
    options: [
      'Gold-plating — the 0.01% target exceeds what was requested',
      'Quality metric — a measurable, specific standard that defines acceptable performance; this should be documented in the Quality Management Plan and used in Control Quality acceptance criteria',
      'Cost of conformance — the investment required to meet specifications',
      'A stretch goal — aspirational but not binding'
    ],
    correct: 1,
    explanation: 'This is a quality metric — a specific, measurable standard of performance that defines what "done" and "acceptable" means. PMBOK\'s Plan Quality Management process creates quality metrics as a key output. These become the acceptance criteria for Control Quality. The 0.01% target is the client\'s stated requirement, not gold-plating. Cost of conformance (option C) refers to the investment in meeting quality standards, not the standard itself. Quality metrics must be measurable, achievable, and traceable to stakeholder requirements.'
  },
  {
    domain: 'Process',
    scenario: 'A project team has identified 45 risks during the risk identification workshop. The PM needs to decide which risks to prioritize for response planning.',
    question: 'What is the correct next step?',
    options: [
      'Immediately develop response plans for all 45 risks',
      'Perform Qualitative Risk Analysis to prioritize risks using Probability × Impact assessment, identify which risks warrant further analysis or immediate response planning, and update the risk register accordingly',
      'Perform Quantitative Risk Analysis to calculate the financial value of all 45 risks',
      'Present all 45 risks to the sponsor for prioritization'
    ],
    correct: 1,
    explanation: 'Qualitative Risk Analysis (Process 11.3) is the mandatory next step after Identify Risks (Process 11.2). It prioritizes risks using a Probability × Impact matrix. This culls the 45 risks into: high-priority (develop responses), medium (watch list/monitor), low (accept). Not all risks warrant full response planning — doing so wastes resources. Quantitative Analysis (Process 11.4) is only performed on the highest-priority risks that require numerical modeling. Presenting all 45 risks to the sponsor without filtering is an information overload failure.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is about to begin planning for a new ERP implementation. The organization has implemented two similar ERP systems in the past three years. A previous PM from one of those projects is available for consultation.',
    question: 'What should the PM do to leverage this organizational knowledge?',
    options: [
      'Avoid consulting the previous PM to prevent anchoring bias on previous project approaches',
      'Review historical OPAs (lessons learned, project archives, estimating databases) from both prior projects and consult the previous PM as a subject matter expert to build higher-quality initial estimates and risk identification',
      'Only use current team knowledge since each ERP implementation is unique',
      'Ask the previous PM to create the project plan based on their experience'
    ],
    correct: 1,
    explanation: 'Organizational Process Assets (OPAs) — lessons learned, historical estimates, project templates — are among the most valuable inputs to new project planning precisely because they encode hard-won organizational learning. ERP implementations share enough characteristics that historical data significantly improves planning accuracy and risk identification. The previous PM is a walking, talking OPA. Anchoring bias risk is managed by using historical data as a starting point, not a final answer. Having the previous PM create the plan would be delegation without ownership.'
  },
  {
    domain: 'Process',
    scenario: 'A project uses a hybrid approach. The PM needs to report project status to executives who require predictive format (milestones and dates), while the agile team tracks progress using velocity and burndown charts.',
    question: 'How should the PM handle dual reporting requirements?',
    options: [
      'Convert all agile metrics to predictive format for all reporting',
      'Maintain both reporting systems: agile metrics for team-level tracking and adaptation, predictive milestone tracking for executive reporting — translating between them using release roadmaps and velocity-based forecasting',
      'Use only agile metrics and educate executives on agile reporting',
      'Request that executives adopt agile reporting standards'
    ],
    correct: 1,
    explanation: 'Hybrid project management explicitly requires tailoring communication to audience needs (PMBOK 7 Principle #7). The team needs granular agile metrics to self-manage effectively. Executives need predictive milestones to make strategic decisions. Both are legitimate. The PM adds value by translating: "Our velocity of 40 points/sprint means we\'ll hit the Release 2 milestone by Sprint 18, with 85% confidence." Forcing one format on both audiences serves neither well. This is professional dual-mode reporting.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager receives a request to provide a cost estimate for a proposed new project before any detailed planning has been done. The only information available is a high-level scope description.',
    question: 'What type of estimate should be provided, and what must be communicated with it?',
    options: [
      'A precise estimate since stakeholders require a specific number',
      'A Rough Order of Magnitude (ROM) estimate with a range of −25% to +75%, along with key assumptions, constraints, and the Cone of Uncertainty — clearly stating that accuracy will improve as planning proceeds',
      'Refuse to estimate until detailed planning is complete',
      'Use the previous similar project\'s total cost as the estimate'
    ],
    correct: 1,
    explanation: 'Early estimates are inherently wide-range (Cone of Uncertainty). Providing a ROM estimate (−25%/+75%) with explicit assumptions is honest and professional. The estimate must be accompanied by: the basis (how it was derived), key assumptions (what must be true for this estimate to hold), constraints (what limitations affect it), and confidence level. Providing a false precision ($1,234,567) at this stage creates misleading commitment. Refusing to estimate at all abdicates the PM\'s planning responsibility. The previous project cost is a valid input but must be adjusted for differences.'
  },
  {
    domain: 'Process',
    scenario: 'During project execution, the PM discovers that a team member has been implementing an unauthorized technical workaround to a known defect rather than logging it as a defect and routing it through the defect management process.',
    question: 'What should the PM do?',
    options: [
      'Accept the workaround since it resolved the immediate problem',
      'Document the workaround, require the team member to formally log the defect, have the defect officially assessed and the workaround evaluated as a potential permanent fix or technical debt item, and coach the team member on proper defect management protocols',
      'Reverse the workaround since it was unauthorized',
      'Praise the team member\'s initiative and use the workaround as a best practice template'
    ],
    correct: 1,
    explanation: 'Unauthorized workarounds bypass defect tracking, which creates technical debt and blind spots in quality management. The PM must: document the workaround (it now exists in the system), require proper defect logging retroactively, have the defect management process evaluate the workaround as either a proper fix or temporary patch requiring future work, and coach on process adherence. Simply reversing the workaround is disruptive if it\'s already working. Accepting without documentation creates invisible technical debt. Process adherence is a quality management principle.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is reviewing the project schedule. Several activities that were planned to begin in the next reporting period are now blocked because a predecessor deliverable from an external vendor is 2 weeks late.',
    question: 'What should the PM do?',
    options: [
      'Wait for the vendor to deliver before starting any affected activities',
      'Perform an immediate schedule impact analysis, explore options to begin partial work on blocked activities where logically possible, escalate to the vendor formally with contract consequences, and update the project schedule and stakeholder communications',
      'Crash all available activities to compensate for the delay',
      'Submit a change request to extend the project end date by 2 weeks'
    ],
    correct: 1,
    explanation: 'Vendor delays require multi-pronged response: (1) Impact analysis — which activities are blocked, for how long, and is the critical path affected? (2) Partial acceleration — can any blocked activities begin with available information? (3) Vendor escalation — formal written notice with contract-specified consequences (liquidated damages, termination clauses). (4) Schedule update — reflect current reality. A change request for end date extension is premature before exploring recovery options. Waiting passively wastes time that could be spent on recoverable activities.'
  },
  {
    domain: 'Process',
    scenario: 'An agile team has just completed Sprint Planning for Sprint 7. Midway through the sprint, a critical production bug is discovered that was not in the sprint backlog. It affects real customers.',
    question: 'What should happen?',
    options: [
      'Add the bug fix to the current sprint backlog immediately since customer impact takes priority',
      'The Product Owner decides whether the bug severity warrants interrupting the sprint goal: if yes, negotiate with the team to add it (likely replacing lower-priority sprint items); if not, add it to the top of the product backlog for the next sprint',
      'Complete the current sprint without interruption since sprint plans are commitments',
      'Start a new sprint specifically for the bug fix'
    ],
    correct: 1,
    explanation: 'Only the Product Owner can authorize disrupting the sprint — this is not the SM\'s or PM\'s unilateral decision. For critical production bugs, the PO typically interrupts the sprint: the team negotiates scope out (which sprint backlog items are de-prioritized) to make room for the bug fix, while the Sprint Goal may be updated. In Scrum, sprints can be disrupted when business conditions require it — the rule is PO authority, not sprint sanctity. Starting a new sprint is operationally incorrect and creates ceremony overhead.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is closing a multi-year government contract. The contract specified a formal "lessons learned" deliverable as part of project closure. The team has been capturing lessons throughout the project.',
    question: 'What is the MOST complete set of actions for project closure?',
    options: [
      'Compile lessons learned and submit them as the contract deliverable',
      'Obtain formal acceptance of all deliverables, ensure final financial reconciliation, complete lessons learned and submit per contract, archive all project documents to OPAs, release resources formally, and send a formal project closure notice to all stakeholders',
      'Issue the final invoice and close the contract',
      'Only the lessons learned deliverable is required since it was explicitly specified in the contract'
    ],
    correct: 1,
    explanation: 'Project closure (Process 4.7 — Close Project or Phase) has multiple mandatory components: (1) Obtain formal acceptance of all deliverables. (2) Financial closure — reconcile all costs, close purchase orders. (3) Contract closure — ensure all contract terms are met. (4) Lessons learned compilation and OPA updates. (5) Archive project documents. (6) Release resources formally (update resource assignments, update team member records). (7) Formal stakeholder notification of closure. Missing any of these creates administrative, financial, or legal risk. The contract\'s specific lessons learned deliverable is one of many closure activities.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is managing a software product that will be sold commercially. Quality testing reveals that 0.5% of transactions generate incorrect calculations. The fix requires 3 weeks of development.',
    question: 'How should the PM approach this quality issue?',
    options: [
      'Release the product since 0.5% is below most industry tolerance thresholds',
      'Conduct a Cost of Quality analysis: compare Cost of Non-Conformance (customer impact, liability, reputation loss, warranty costs) against Cost of Conformance (3 weeks delay, development cost) — make a documented, evidence-based decision',
      'Release with a known-issue disclosure to customers',
      'Delay the entire release until all defects are at 0% rate'
    ],
    correct: 1,
    explanation: 'The Cost of Quality (COQ) framework compares the cost of building it right (Cost of Conformance: prevention + appraisal) against the cost of getting it wrong (Cost of Non-Conformance: internal failure + external failure). For a commercial financial product, 0.5% incorrect calculations creates regulatory, legal, and reputation risks that may far exceed 3 weeks of delay. This analysis provides the documented rationale for the decision — either direction. The decision must be made explicitly, not by defaulting to release. This is the professional PMI approach to quality trade-offs.'
  },
  {
    domain: 'Process',
    scenario: 'A project is 80% complete and the PM learns that a key subcontractor is at risk of financial failure. They hold $200K of project materials and have completed work representing $150K of value.',
    question: 'What should the PM do FIRST?',
    options: [
      'Wait to see if the subcontractor actually fails before taking action',
      'Immediately assess the subcontractor\'s financial status, secure/retrieve project materials in the subcontractor\'s possession, assess contract termination provisions, engage legal counsel and procurement, and identify replacement options in parallel',
      'Transfer all future payments to another vendor immediately',
      'Inform the project sponsor and let them handle it'
    ],
    correct: 1,
    explanation: 'Vendor financial failure is a high-severity risk requiring immediate, parallel action. The PM must: (1) Verify the financial situation (not rumor-based action). (2) Immediately assess the $200K material risk — can it be physically secured/retrieved? (3) Review contract termination-for-convenience clauses. (4) Engage procurement and legal to protect the organization\'s interests in a potential bankruptcy. (5) Begin identifying alternative vendors NOW — not after failure occurs. Waiting for confirmed failure costs critical response time. Delegating entirely to the sponsor without taking preparatory action is negligent risk management.'
  },
  {
    domain: 'Process',
    scenario: 'A project team using SAFe (Scaled Agile Framework) is planning a Program Increment (PI). The PM needs to synchronize the work of 4 agile teams that have interdependencies.',
    question: 'What is the primary purpose of a PI Planning event?',
    options: [
      'To create a detailed Gantt chart for all 4 teams for the next quarter',
      'To align all teams to a shared vision and goals, identify cross-team dependencies, surface risks, and create team-level iteration plans with committed PI objectives — enabling coordinated delivery at scale',
      'To assign user stories from the backlog to individual team members',
      'To conduct performance reviews for each agile team'
    ],
    correct: 1,
    explanation: 'PI Planning is SAFe\'s most critical event — a face-to-face (or virtual) event where all teams in the Agile Release Train plan together. Its primary goals: shared vision alignment, cross-team dependency identification and resolution, risk surfacing and tracking (ROAM: Resolved, Owned, Accepted, Mitigated), and creating team PI objectives (committed + stretch). It is NOT a detailed Gantt chart or assignment exercise — teams create their own iteration plans. Understanding scaling frameworks like SAFe is increasingly tested on the PMP exam.'
  },
  {
    domain: 'Process',
    scenario: 'A project schedule shows that Activity D has Total Float of 5 days and Free Float of 2 days.',
    question: 'What does this mean?',
    options: [
      'Activity D can be delayed 5 days without affecting any successor, and 2 days without affecting the project end date',
      'Activity D can be delayed 2 days without delaying any immediate successor activity, and up to 5 days total without delaying the project end date (but only if successors can absorb the remaining float)',
      'Activity D has 5 days before it becomes critical and 2 days before it delays the project',
      'Total float and free float are the same concept — D has between 2-5 days of flexibility'
    ],
    correct: 1,
    explanation: 'Free Float = the amount of time an activity can be delayed without delaying the Early Start of any successor activity (local impact). Total Float = the amount of time an activity can be delayed without delaying the project end date (project impact). Free Float ≤ Total Float always. Here: D can delay 2 days with no impact on any successor. It can delay up to 5 days without delaying the project end, but days 3–5 consume float that belongs to shared paths. Understanding both concepts is critical for PMP schedule management questions.'
  },
  {
    domain: 'Process',
    scenario: 'The sponsor wants to add a feature that was explicitly excluded from the project scope statement. They argue it is "small" and "critical to business success."',
    question: 'What should the project manager do?',
    options: [
      'Add the feature since the sponsor has ultimate authority over the project',
      'Formally evaluate the feature request through the change control process: assess impact, prepare a change request, obtain CCB approval, and update the baseline if approved — even for "small" items explicitly excluded from scope',
      'Deny the request since it was explicitly excluded from scope',
      'Add it if it truly takes less than one week to implement'
    ],
    correct: 1,
    explanation: 'Items explicitly excluded from scope are part of the scope baseline — changing them requires formal change control regardless of size or who requests the change. The sponsor has authority to APPROVE changes through the CCB, not to bypass governance. The PM\'s role is to facilitate the proper process: document the request, analyze impact (even "small" features have integration, testing, and documentation implications), present for approval. The baseline exists precisely to prevent scope creep — even one small exception sets a precedent that erodes governance.'
  },
  {
    domain: 'Process',
    scenario: 'A project team is using Kanban. The PM notices that the "In Progress" column consistently has 15-20 work items, while the team has a WIP limit of 7. Team members say the WIP limit is impractical.',
    question: 'What should the project manager do?',
    options: [
      'Raise the WIP limit to 20 to reflect actual team capacity',
      'Facilitate a team discussion on the purpose of WIP limits (reducing multitasking, improving flow, surfacing bottlenecks), investigate what is causing WIP limit violations, and consider whether the limit needs adjustment or whether processes need to change',
      'Enforce the WIP limit strictly by blocking any new items until In Progress drops below 7',
      'Remove the WIP limit since the team finds it unhelpful'
    ],
    correct: 1,
    explanation: 'WIP limits are one of Kanban\'s most powerful tools for exposing systemic problems — when the limit is consistently violated, it usually signals a process problem (handoffs blocked, work not chunked properly, dependencies not visible) rather than the limit being wrong. The PM should: educate on WHY WIP limits work (Little\'s Law: lower WIP → faster flow), investigate the specific violation causes, and then make an evidence-based decision about the limit. Simply raising the limit masks the problem. Strict enforcement without investigation creates friction without value.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager needs to validate scope for 15 major deliverables. The project sponsor is available for only 2 hours per week for review sessions.',
    question: 'What is the MOST effective approach to scope validation given this constraint?',
    options: [
      'Skip formal scope validation since the sponsor is unavailable for adequate review time',
      'Create a structured, prioritized validation agenda: validate the highest-risk/highest-value deliverables first in available sessions, use asynchronous review (written walkthroughs, video demos) for lower-complexity deliverables, and ensure formal sign-off documentation for each',
      'Perform only one combined scope validation session at project end',
      'Delegate scope validation to the project team since the sponsor is unavailable'
    ],
    correct: 1,
    explanation: 'Validate Scope requires formal customer/sponsor acceptance of each deliverable — it cannot be skipped. The PM must adapt the process to the constraint: prioritize high-risk deliverables for synchronous sessions, enable async review for lower-complexity items (pre-reading packages, recorded demos, written approval chains), and always obtain documented formal acceptance. Scope validation at project end only creates a massive acceptance risk where issues discovered late have no correction time. This is tailoring process to project context — PMBOK 7 Principle #7.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is analyzing a change request that would reduce the project scope by eliminating 2 of 15 deliverables. The requestor argues this reduces cost and schedule.',
    question: 'What must the PM assess before approving or recommending approval of scope reduction?',
    options: [
      'Only the cost and schedule savings since those are the stated benefits',
      'Full integrated impact: cost/schedule savings, impact on remaining deliverables (dependencies, integration points), impact on stated project benefits and value, stakeholder acceptance, and contractual implications if applicable',
      'Approval from only the project sponsor since scope reduction is favorable',
      'Whether the 2 deliverables have already been started and what sunk costs apply'
    ],
    correct: 1,
    explanation: 'Scope reduction is still a scope change and must go through Perform Integrated Change Control with full impact analysis. Even "positive" changes (reducing scope) can have negative cascading effects: other deliverables may depend on the eliminated ones; the project\'s stated business value may be reduced; contracts may have minimums; stakeholders who need those deliverables will be affected. The full integrated picture — not just cost and schedule — must be evaluated. Sunk costs (option D) are a consideration but not the primary analytical frame.'
  },
  {
    domain: 'Process',
    scenario: 'A project has a BAC of $1,000,000. The project is 60% complete. AC = $650,000. What is the Earned Value?',
    question: 'Which of the following correctly calculates EV?',
    options: [
      'EV = $600,000 (60% of BAC)',
      'EV = $650,000 (the actual cost incurred)',
      'EV = $1,000,000 × 0.60 = $600,000',
      'EV = $350,000 (remaining budget)'
    ],
    correct: 0,
    explanation: 'EV = % Complete × BAC = 60% × $1,000,000 = $600,000. Note that options A and C say the same thing — EV is the budgeted value of work completed (NOT the actual cost). AC = $650,000 (what was spent). EV = $600,000 (what was earned). CV = EV − AC = $600K − $650K = −$50K (over budget). CPI = 600/650 = 0.923 (over budget). The key insight: EV is always expressed in budget terms, never actual cost terms.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is conducting a Bidder Conference for a major IT services procurement. Two vendors ask the same technical question about the statement of work.',
    question: 'What is the correct procedure?',
    options: [
      'Answer each vendor privately to protect their competitive positioning',
      'Answer both vendors at the same time in the group session, and issue a formal addendum documenting the question and answer to all vendors to ensure equal information access',
      'Decline to answer technical questions during the Bidder Conference and direct vendors to submit written questions',
      'Answer only the vendor who asked first'
    ],
    correct: 1,
    explanation: 'The primary purpose of a Bidder Conference is to ensure ALL potential sellers have equal, common understanding of the procurement requirements. All questions and answers must be shared with all vendors — providing information to only some vendors creates an unfair competitive advantage and potentially invalidates the procurement. The formal addendum creates a contract-ready record of all scope clarifications. Private answers violate procurement fairness. PMBOK 6 Section 12.2 specifically calls out equal information access as a bidder conference requirement.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager receives a report that the project\'s cost variance (CV) is −$80,000 and the schedule variance (SV) is −$40,000. Both variances have been consistent for 4 periods.',
    question: 'What is the significance of CONSISTENT variance over 4 periods?',
    options: [
      'Temporary variances are normal — no action needed until they exceed 10% threshold',
      'Consistent variance over multiple periods indicates a systemic performance problem, not a temporary fluctuation — the root cause must be identified and the EAC should be recalculated, as the current CPI trend is likely to continue',
      'The project will automatically correct itself through normal execution',
      'Only the cost variance requires attention since it is larger'
    ],
    correct: 1,
    explanation: 'Variance trend analysis is one of the most important EVM insights. Random variance (oscillating around zero) can be tolerated. But consistent negative variance over 4+ periods indicates a systemic root cause: unrealistic estimates, inefficient processes, resource quality issues, or scope that wasn\'t fully understood. Research shows that CPI established at the 20–30% completion mark is highly predictive of final project CPI — meaning recovery without root cause changes is statistically unlikely. Both variances require investigation; dismissing the SV because it\'s "smaller" is incorrect.'
  },
  {
    domain: 'Process',
    scenario: 'A project manager is planning communications for a project with 15 stakeholders. The sponsor asks how many communication channels exist.',
    question: 'What is the correct calculation and what does it imply?',
    options: [
      '15 × 14 = 210 channels (all directional communication paths)',
      '15 × (15-1) / 2 = 105 bidirectional channels. This implies that adding any single stakeholder significantly increases complexity — every addition creates N new channels where N is the current number of stakeholders',
      '14 channels (each stakeholder to PM)',
      '15 channels (each stakeholder to the project)'
    ],
    correct: 1,
    explanation: 'Communication Channels = N × (N-1) / 2 = 15 × 14 / 2 = 105. The formula models the potential bidirectional communication paths in a network. The key insight for PMP exam: this is a quadratic function — adding one stakeholder to a 15-person project (16 total) creates 120 channels — 15 NEW channels added by ONE person. This is why stakeholder proliferation is a communications management risk and why the Communications Management Plan\'s first tool is "Communications Requirements Analysis." The formula is frequently tested with a calculation question.'
  },

// ─────────────────────────── BUSINESS ENVIRONMENT (~14 questions) ───────────────────────────
  {
    domain: 'Business Environment',
    scenario: 'An organization has approved three strategic projects for the year. Mid-year, the market shifts dramatically, and one project\'s business case is no longer viable. The project is 40% complete.',
    question: 'What should the project manager recommend?',
    options: [
      'Complete the project since 40% of investment is already made (sunk cost)',
      'Present an objective recommendation to terminate the project, based on the revised business case analysis — the sunk cost is irrelevant to the forward-looking decision',
      'Reduce the project scope to make the remaining investment worthwhile',
      'Continue and repurpose deliverables for other business uses'
    ],
    correct: 1,
    explanation: 'Sunk cost fallacy — continuing an investment because of past spending rather than future value — is an irrational but common decision bias. PMI\'s approach: project continuation decisions should be based on forward-looking value, not past investment. If the business case is no longer viable, the professional recommendation is termination, with clear documentation of why. Stopping a failing project frees resources for viable ones. The PM has a professional obligation to recommend termination when it serves the organization\'s interests, even if politically uncomfortable.'
  },
  {
    domain: 'Business Environment',
    scenario: 'A project manager is asked to lead a project that will automate 30 customer service positions, which will be eliminated. The project manager is concerned about the human impact.',
    question: 'What should the project manager do?',
    options: [
      'Decline to lead the project since it has a negative human impact',
      'Lead the project professionally, advocate for transparent communication and fair treatment of affected employees, work with HR and management to address the human impact through transition support, and ensure change management is included in project planning',
      'Complete the project as technically specified without addressing the human dimension',
      'Slow down the project timeline to delay the impact on employees'
    ],
    correct: 1,
    explanation: 'PMP exam philosophy: the PM should execute organizational strategy while advocating for responsible implementation. Refusing the project is not the PM\'s role (that\'s executive decision-making). Ignoring the human impact is inconsistent with PMBOK 7 Principle #1 (Stewardship — caring for social impacts). The right answer: lead the project, integrate change management (often a formal role), advocate for early and transparent communication, work with HR on transition support (retraining, severance, internal transfer). The PM\'s ethical obligation is to the organization AND its people.'
  },
  {
    domain: 'Business Environment',
    scenario: 'During a project, the PM learns that a competitor has launched a product that directly undercuts the project\'s planned product value proposition. The project is 70% complete.',
    question: 'What should the project manager do?',
    options: [
      'Continue the project as planned — competitors are not within the PM\'s scope of concern',
      'Immediately escalate to the project sponsor and steering committee with an updated business case analysis, assess whether project strategy needs adjustment (scope pivot, accelerated delivery, cancellation), and prepare options with trade-off analysis',
      'Accelerate delivery unilaterally to beat the competitor to market',
      'Add features to differentiate from the competitor using available budget'
    ],
    correct: 1,
    explanation: 'A competitive market disruption constitutes a change to the Business Environment (EEF) that may invalidate the business case. The PM has an obligation to surface this immediately to decision-makers with an objective analysis. The project team does not have authority to pivot strategy, add features, or accelerate without executive direction and formal change control. The PM\'s role is to provide timely, accurate information and options — enabling executives to make informed strategic decisions. This is benefits realization management and strategic alignment (PMBOK 7 Principle #4 — Focus on Value).'
  },
  {
    domain: 'Business Environment',
    scenario: 'A project manager is briefed on an organizational change management initiative that will affect how the project\'s deliverables are adopted by end users. The project has completed 50% of technical delivery.',
    question: 'What should the project manager do regarding change management?',
    options: [
      'Technical delivery is the PM\'s responsibility — change management is HR\'s concern',
      'Integrate change management activities (stakeholder readiness assessments, communication campaigns, training plans, resistance monitoring) into the project schedule and budget as formal project work, collaborating with the OCM team',
      'Add change management tasks only to the final 10% of the project',
      'Create a separate project for change management activities'
    ],
    correct: 1,
    explanation: 'Organizational Change Management (OCM) is a core component of benefits realization. Technical delivery without adoption produces zero value — a perfectly built system that users refuse to use is a failed project. PMBOK 7 Principle #12 (Enable Change) explicitly states that PMs must prepare stakeholders for adoption. OCM activities (readiness assessments, training, communication, resistance management) are project deliverables that must be scheduled and budgeted. Starting OCM at 90% is far too late for meaningful behavior change. The PM and OCM lead must collaborate from the beginning.'
  },
  {
    domain: 'Business Environment',
    scenario: 'A project manager is tracking a government-funded project. The funding authority has issued new compliance requirements that affect 3 of the 12 remaining deliverables. The new requirements add cost and extend the timeline.',
    question: 'How should the PM handle this situation?',
    options: [
      'Complete the non-affected deliverables on schedule and negotiate an extension only for the 3 affected ones',
      'Document the new regulatory requirements, conduct an integrated impact analysis, submit a formal change request to adjust the baseline, communicate transparently to the funding authority with evidence of the compliance-driven impact, and update the project governance documents',
      'Absorb the cost within the management reserve without informing stakeholders',
      'Exclude the 3 affected deliverables from scope to maintain the original timeline'
    ],
    correct: 1,
    explanation: 'Regulatory changes are legitimate, non-discretionary scope changes. The PM must: document the requirement (official source), analyze the full impact, submit a change request with supporting evidence, and communicate to stakeholders — especially the funding authority that is both the change source and the decision-maker on resource adjustment. Using management reserve without disclosure hides a material project change. Excluding affected deliverables may violate the grant/contract terms. Transparent, evidence-based communication with proper change documentation is the professional response.'
  },
  {
    domain: 'Business Environment',
    scenario: 'A project manager is initiating a project that will expand a company\'s operations into a new country. The PM must consider local labor laws, tax regulations, import restrictions, and cultural norms.',
    question: 'How should the PM approach these environmental factors in project planning?',
    options: [
      'Assign all regulatory compliance to the legal department and focus solely on technical delivery',
      'Formally identify and document all relevant EEFs as inputs to planning processes: include cultural intelligence assessment, engage local regulatory experts, build compliance activities into the WBS and schedule, and establish monitoring for regulatory changes throughout execution',
      'Use the organization\'s standard project management approach without modifications for international projects',
      'Delay project initiation until the legal team has resolved all regulatory questions'
    ],
    correct: 1,
    explanation: 'International expansion projects have complex Enterprise Environmental Factors that fundamentally shape planning. These EEFs are formal PMBOK inputs to virtually every planning process. The PM is responsible for understanding and integrating regulatory, cultural, and legal factors into project design — not outsourcing the problem to legal. A local legal or regulatory expert is a Subject Matter Expert (SME) for the PM to consult, not a substitute for integrated planning. Delaying initiation for full regulatory clarity in complex jurisdictions may be months — risk is managed progressively, not eliminated before starting.'
  },
  {
    domain: 'Business Environment',
    scenario: 'A project\'s primary stakeholder group is the company\'s board of directors. The PM has been preparing monthly status reports but receives feedback that board members want less detail and more strategic relevance.',
    question: 'What should the project manager do?',
    options: [
      'Continue the same reports since they contain all necessary project information',
      'Redesign the reporting format for the board audience: executive summary with strategic alignment, milestone status, key risks at the decision-making level, and clear "ask" for any board action needed — eliminate operational details',
      'Reduce the report length but keep all current content',
      'Switch to quarterly reporting to reduce the information burden'
    ],
    correct: 1,
    explanation: 'Board-level communication requires a completely different content structure than operational status reports. Boards make strategic decisions, not operational ones. They need: strategic alignment status (is the project still delivering the promised business value?), major risks that could affect strategic outcomes, milestone progress against strategic timeline, and explicit decisions they need to make. Operational details (sprint velocity, defect rates, individual assignments) are noise at this level. Communication Management (PMBOK 6 Section 10) requires tailoring information to audience needs, urgency, and decision-making authority.'
  },
  {
    domain: 'Business Environment',
    scenario: 'A project manager is preparing a Benefits Realization Plan for a digital transformation project. The project will deliver new software capabilities, but the business benefits (efficiency gains) will only be realized 6-12 months after implementation.',
    question: 'What should the Benefits Realization Plan address?',
    options: [
      'Only the technical deliverables within the project scope',
      'The complete value chain: how technical deliverables enable process changes, which process changes drive the efficiency gains, who is responsible for realizing benefits post-project, what metrics will measure realization, and when measurement checkpoints will occur',
      'Only the ROI calculation for executive reporting',
      'The transition plan from project to operations team'
    ],
    correct: 1,
    explanation: 'Benefits Realization Management extends beyond project closure — the PM must plan HOW benefits will be measured and WHO is responsible post-project. The Benefits Realization Plan should document: the benefit logic chain (deliverable → behavior change → business outcome), measurable KPIs with baselines, measurement schedule (e.g., 30/60/90/180-day post-implementation reviews), accountable benefit owner in operations, and the handover protocol. Without this, benefits often evaporate unmeasured after project closure. This is increasingly tested on PMP exams as PMBOK 7\'s value focus gains prominence.'
  },
  {
    domain: 'Business Environment',
    scenario: 'A portfolio manager is evaluating which projects to fund in the next fiscal year. Two projects have similar strategic scores but different NPV profiles: Project A has a higher NPV but 5-year payback period. Project B has a lower NPV but 2-year payback period.',
    question: 'What factors should drive the portfolio selection decision?',
    options: [
      'Always select the highest NPV project regardless of payback period',
      'The selection should be driven by the organization\'s strategic priorities, risk appetite, and cash flow needs: if cash flow is tight, shorter payback (Project B) may be preferred even at lower NPV; if the organization can sustain long-term investment, higher NPV (Project A) may create more value',
      'Always select the shorter payback project to minimize financial risk',
      'Select the project with the lowest resource requirements'
    ],
    correct: 1,
    explanation: 'Portfolio selection is a multi-criteria strategic decision, not just a financial formula. NPV maximizes value if the organization has the capacity and cash flow to sustain it. Payback period (how quickly the investment is recovered) matters for organizations with liquidity constraints or high uncertainty environments. The PM and portfolio manager must understand and apply the organization\'s specific strategic context. This demonstrates PMBOK 7 Principle #4 (Focus on Value) — value is defined in the organizational strategic context, not by a single metric.'
  },
  {
    domain: 'Business Environment',
    scenario: 'A PMO director asks the project manager to manipulate status reports to show the project as "green" when it is actually "yellow/red," to avoid a difficult conversation with an executive steering committee.',
    question: 'What must the project manager do?',
    options: [
      'Comply with the PMO director\'s request since they have organizational authority over the PM',
      'Refuse to misrepresent project status, document the request, and if necessary escalate through the organization\'s ethics or governance channel — reporting accurate status is a non-negotiable professional and ethical obligation',
      'Report accurate status privately to the steering committee without the PMO director\'s knowledge',
      'Modify the status to yellow (a compromise between green and red) to partially comply'
    ],
    correct: 1,
    explanation: 'PMI\'s Code of Ethics and Professional Conduct unambiguously requires honesty and transparency. Falsifying status reports is a fundamental violation that compromises the steering committee\'s ability to make informed decisions. Organizational authority does not override ethics. The PM must: refuse clearly, document the request (protective measure), and if needed, escalate through ethics or governance channels. Reporting secretly to the steering committee without documentation creates a different governance problem. Compromising to "yellow" is still misrepresentation. Professional ethics sometimes require courageous conversations.'
  },
  {
    domain: 'Business Environment',
    scenario: 'A project manager is integrating a new AI tool into the project workflow to automate weekly status reporting. Team members are concerned about job security and data privacy.',
    question: 'What should the project manager address FIRST?',
    options: [
      'Proceed with AI implementation — efficiency gains outweigh team concerns',
      'Proactively address both concerns: clarify which tasks are being automated (reporting) vs. which are not (judgment, relationship management), ensure data privacy compliance with organizational policies and regulations, and involve the team in designing how the tool is used',
      'Let HR address the job security concerns separately from the project',
      'Delay AI implementation until all concerns are resolved through organizational channels'
    ],
    correct: 1,
    explanation: 'Introducing new technology into a team requires change management at the micro level. Job security fears reduce adoption and create resistance that undermines the tool\'s effectiveness. The PM must: clearly communicate what the AI does (automates administrative tasks, not creative/judgment work), address data privacy concerns transparently (how is data used, who sees it, what are the governance rules), and involve the team in implementation design to build ownership. Delegating to HR fragments the team\'s experience. Proceeding without addressing concerns creates active resistance. This is responsible technology integration — aligned with PMBOK 7 Principle #1 and #12.'
  },
  {
    domain: 'Business Environment',
    scenario: 'A project manager is working on a project in a country with known corruption risk. A local government official indicates that project permits will be expedited if a "facilitation payment" is made.',
    question: 'What must the project manager do?',
    options: [
      'Make the payment if it is within the project budget — it is a local business practice',
      'Refuse the payment regardless of local custom, document the incident, immediately escalate to the organization\'s legal and compliance team, and follow the organization\'s anti-bribery protocols',
      'Let local team members handle it discretely since they understand local customs',
      'Make the payment but exclude it from project documentation'
    ],
    correct: 1,
    explanation: 'Facilitation/bribery payments violate international law (US FCPA, UK Bribery Act), organizational ethics policies, and PMI\'s Code of Ethics — regardless of local custom or competitive pressure. "It\'s the local way" is not a legal or ethical defense. The PM must: refuse clearly, document the incident with specifics (who said what, when, in what context), and immediately escalate to organizational compliance. Legal and compliance teams can pursue diplomatic solutions. Delegation to local team members makes them personally liable. Omitting it from documentation constitutes concealment of a potential crime.'
  },
  {
    domain: 'Business Environment',
    scenario: 'A project manager discovers that a critical component supplier is located in a region that will be severely impacted by upcoming climate-related regulatory changes that will significantly increase the supplier\'s costs and potentially disrupt supply.',
    question: 'What should the PM do?',
    options: [
      'Wait to see if the regulatory changes actually take effect before taking action',
      'Identify this as a project risk, assess the probability and impact, explore alternative suppliers, assess contract provisions, and escalate to procurement and risk management for strategic supplier diversification planning',
      'Renegotiate the contract to shift climate risk to the supplier',
      'Expand the project budget by 20% as a contingency for supplier cost increases'
    ],
    correct: 1,
    explanation: 'Climate and regulatory risk to supply chains is an emerging but critical category of EEF-driven project risk. This is not a "wait and see" situation — regulatory changes move on known timelines and proactive risk assessment is always better than reactive response. The PM must: formally add this to the risk register (PMBOK 6 Section 11), conduct probability/impact assessment, explore supplier diversification as a risk response, review contract force majeure and price adjustment clauses, and escalate to procurement for strategic supply chain resilience. This reflects Systems Thinking (PMBOK 7 Principle #5) — understanding external system interactions that affect the project.'
  },
  {
    domain: 'Business Environment',
    scenario: 'At the end of a project, the PM is conducting the benefits realization handover with the operations team. The operations team leader says they are not prepared to take over the deliverables because they have not been adequately involved in the project.',
    question: 'Who is responsible for this situation, and what should happen next?',
    options: [
      'The operations team — they should have been more proactive in engaging with the project',
      'The PM — transition planning and operations team involvement should have been built into the project plan from the beginning; the PM must now create an emergency knowledge transfer plan and delay formal closure until readiness is confirmed',
      'The project sponsor — they should have mandated operations involvement',
      'No one is responsible — this is a normal challenge during project closure'
    ],
    correct: 1,
    explanation: 'Operations transition planning is a PM responsibility beginning at project initiation — not something to arrange at closure. The PM should have: identified the operations team as key stakeholders early, included transition requirements in scope planning, conducted knowledge transfer throughout execution (not just at handover), and validated operations readiness before the formal closure date. In this situation, the PM is accountable and must remediate: create an urgent knowledge transfer plan, negotiate a transition period extension with the sponsor, and not issue formal project closure until genuine readiness is confirmed. Closing without operations readiness produces a failed benefit realization.'
  },
];
