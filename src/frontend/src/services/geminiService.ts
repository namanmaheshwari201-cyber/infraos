// InfraOS AI Copilot - Rule-Based Intelligence Engine
// Pure frontend, no external API calls, no actor dependency.

interface QAEntry {
  question: string;
  answer: string;
}

const QA_DATABASE: QAEntry[] = [
  // GREETINGS
  {
    question: "hello",
    answer: "Hello. Welcome to InfraOS. How can I assist you today?",
  },
  {
    question: "hi",
    answer: "Hi. Welcome to InfraOS. What would you like to review today?",
  },
  {
    question: "hey",
    answer: "Hey. You're in InfraOS. What would you like to analyze?",
  },
  {
    question: "good morning",
    answer: "Good morning. Welcome to InfraOS. How can I help you today?",
  },
  {
    question: "good afternoon",
    answer: "Good afternoon. What would you like to review in InfraOS?",
  },
  {
    question: "good evening",
    answer: "Good evening. How can I assist you in InfraOS today?",
  },
  { question: "hii", answer: "Hi. Welcome to InfraOS. How may I assist you?" },
  {
    question: "hello there",
    answer: "Hello. Welcome to InfraOS. What would you like to explore?",
  },
  {
    question: "hey there",
    answer: "Hey. How can I assist you in InfraOS today?",
  },
  {
    question: "yo",
    answer: "Hello. Welcome to InfraOS. What would you like to check?",
  },

  // INTRODUCTION
  {
    question: "who are you",
    answer:
      "I'm the InfraOS AI Assistant. I help analyze infrastructure risks, contracts, projects, claims, approvals, and asset performance.",
  },
  {
    question: "what are you",
    answer:
      "I'm the AI assistant inside InfraOS, built to support infrastructure intelligence and decision-making.",
  },
  {
    question: "what can you do",
    answer:
      "I can help analyze tenders, detect delays, review claims, track approvals, assess vendors, and monitor infrastructure risk.",
  },
  {
    question: "are you ai",
    answer:
      "Yes. I'm the InfraOS AI Assistant built to support infrastructure intelligence workflows.",
  },
  {
    question: "are you a chatbot",
    answer:
      "Yes. I'm the InfraOS AI Assistant for infrastructure analysis and operational support.",
  },
  {
    question: "what is your purpose",
    answer:
      "My purpose is to help teams identify infrastructure risks, improve decisions, and reduce execution failures.",
  },
  {
    question: "are you human",
    answer: "No. I'm an AI assistant built into InfraOS.",
  },
  { question: "what should i call you", answer: "You can call me InfraOS AI." },
  {
    question: "can you help me",
    answer: "Yes. Tell me what you'd like to review.",
  },

  // SMALL TALK
  {
    question: "how are you",
    answer: "I'm ready to assist. What would you like to review?",
  },
  {
    question: "how are you doing",
    answer: "I'm operational and ready. How can I help?",
  },
  {
    question: "whats up",
    answer:
      "Ready to assist with infrastructure analysis. What would you like to review?",
  },
  {
    question: "hows it going",
    answer: "All systems operational. What would you like to check?",
  },
  {
    question: "nice",
    answer: "Glad to help. What would you like to review next?",
  },
  {
    question: "cool",
    answer: "Understood. What would you like to analyze next?",
  },
  {
    question: "great",
    answer: "Good to hear. What would you like to review next?",
  },
  {
    question: "awesome",
    answer: "Glad to hear that. What would you like to do next?",
  },
  {
    question: "interesting",
    answer: "Let's review it. What would you like to analyze?",
  },
  {
    question: "okay",
    answer: "Understood. What would you like to proceed with?",
  },
  { question: "hmm", answer: "Please share what you'd like me to review." },

  // THANK YOU
  { question: "thanks", answer: "You're welcome." },
  { question: "thank you", answer: "You're welcome." },
  { question: "thanks a lot", answer: "You're welcome." },
  { question: "appreciate it", answer: "Glad to help." },
  {
    question: "that helps",
    answer: "Good. What would you like to review next?",
  },
  { question: "helpful", answer: "Glad to assist." },
  { question: "nice thanks", answer: "You're welcome." },
  { question: "perfect", answer: "Understood." },
  { question: "great thanks", answer: "You're welcome." },

  // CONFIRMATIONS
  { question: "yes", answer: "Understood." },
  { question: "yeah", answer: "Understood." },
  { question: "yup", answer: "Understood." },
  { question: "correct", answer: "Confirmed." },
  { question: "right", answer: "Understood." },
  { question: "proceed", answer: "Proceeding." },
  { question: "continue", answer: "Continuing." },
  { question: "go ahead", answer: "Proceeding." },
  { question: "sure", answer: "Understood." },

  // NEGATIONS
  { question: "no", answer: "Understood." },
  { question: "nope", answer: "Understood." },
  {
    question: "not now",
    answer: "Understood. Let me know when you'd like to continue.",
  },
  { question: "cancel", answer: "Cancelled." },
  { question: "stop", answer: "Stopped." },
  { question: "exit", answer: "Exiting current workflow." },
  { question: "never mind", answer: "Understood." },
  { question: "ignore that", answer: "Ignored." },
  { question: "leave it", answer: "Understood." },

  // GOODBYE
  { question: "bye", answer: "Goodbye." },
  { question: "goodbye", answer: "Goodbye. Session closed." },
  { question: "see you", answer: "See you next time." },
  { question: "catch you later", answer: "Understood. See you next time." },
  { question: "talk later", answer: "Understood. Goodbye." },
  { question: "end chat", answer: "Session ended." },
  { question: "close", answer: "Closing current session." },
  { question: "done", answer: "Understood. Session complete." },
  {
    question: "thats all",
    answer: "Understood. Let me know if you need anything else.",
  },

  // HELP
  {
    question: "help",
    answer:
      "I can assist with tenders, project delays, claims, approvals, vendors, governance, and asset intelligence. What would you like to review?",
  },
  {
    question: "what can i ask",
    answer:
      "You can ask about tenders, contracts, delays, vendors, claims, approvals, compliance, project risks, and asset health.",
  },
  {
    question: "what should i ask",
    answer:
      "You can ask me to analyze a tender, review delays, assess claims, check approvals, score vendors, or summarize project risks.",
  },
  {
    question: "show options",
    answer:
      "You can review Procurement, Execution, Commercial Risk, Governance, Asset Intelligence, Lifecycle View, or Reports.",
  },
  {
    question: "menu",
    answer:
      "Available modules: Procurement, Execution, Commercial Risk, Governance, Asset Intelligence, Lifecycle, Map, Reports.",
  },
  { question: "start", answer: "What would you like to review first?" },
  { question: "begin", answer: "What would you like to analyze?" },

  // CLARIFICATION
  {
    question: "i dont understand",
    answer: "Please specify what you'd like me to review.",
  },
  {
    question: "what do you mean",
    answer:
      "Please clarify the project, module, or workflow you'd like to analyze.",
  },
  { question: "explain", answer: "Please specify what you'd like explained." },
  {
    question: "explain that",
    answer: "Please specify which item you'd like explained.",
  },
  {
    question: "can you clarify",
    answer: "Yes. Please tell me what you'd like clarified.",
  },
  {
    question: "im confused",
    answer: "Please specify the project, risk, or module you'd like help with.",
  },
  { question: "what", answer: "Please rephrase your request." },
  { question: "huh", answer: "Please rephrase your request." },

  // FALLBACK KEYWORDS
  { question: "i didnt get that", answer: "Please rephrase your request." },
  {
    question: "unknown",
    answer:
      "I could not identify the request. Please specify a module or workflow.",
  },
  {
    question: "invalid input",
    answer: "Please enter a valid project, module, or query.",
  },
  { question: "not sure", answer: "Please clarify what you'd like to review." },
  { question: "something else", answer: "Please specify your request." },

  // STATUS
  { question: "are you working", answer: "Yes. InfraOS AI is operational." },
  { question: "are you online", answer: "Yes. InfraOS AI is online." },
  { question: "are you active", answer: "Yes. InfraOS AI is active." },
  { question: "system status", answer: "InfraOS AI is operational." },
  { question: "are you available", answer: "Yes. How can I assist?" },

  // POLITE ENTERPRISE
  { question: "understood", answer: "Proceeding." },
  { question: "noted", answer: "Acknowledged." },
  { question: "please continue", answer: "Continuing." },
  { question: "please proceed", answer: "Proceeding." },
  { question: "understood continue", answer: "Continuing." },
  { question: "noted proceed", answer: "Proceeding." },

  // ESCALATION
  {
    question: "i need human support",
    answer:
      "Please contact your InfraOS administrator or assigned project reviewer.",
  },
  {
    question: "connect me to support",
    answer:
      "Please contact platform support or your assigned InfraOS administrator.",
  },
  {
    question: "human agent",
    answer: "Please escalate this request to your assigned reviewer.",
  },
  {
    question: "speak to admin",
    answer: "Please contact your organization administrator.",
  },

  // ERROR RESPONSES
  {
    question: "something went wrong",
    answer: "The request could not be completed. Please retry.",
  },
  {
    question: "error",
    answer: "An error occurred while processing the request.",
  },
  { question: "retry", answer: "Retrying request." },
  { question: "failed", answer: "The request failed. Please try again." },
  {
    question: "its not working",
    answer: "Please retry or refresh the current workflow.",
  },

  // FRIENDLY PROFESSIONAL
  { question: "good job", answer: "Understood." },
  { question: "nice work", answer: "Glad to assist." },
  { question: "well done", answer: "Thank you." },
  { question: "thats useful", answer: "Glad to help." },
  { question: "thats good", answer: "Understood." },

  // BASIC PLATFORM QUESTIONS
  {
    question: "what is infraos",
    answer:
      "InfraOS is an AI operating system for infrastructure that helps manage tenders, contracts, project execution, claims, governance, and asset maintenance in one platform.",
  },
  {
    question: "what does infraos do",
    answer:
      "InfraOS helps infrastructure teams detect risk, monitor execution, prevent delays, manage claims, track approvals, and improve project governance.",
  },
  {
    question: "who is infraos built for",
    answer:
      "InfraOS is built for government agencies, EPC contractors, consultants, PMCs, regulators, and infrastructure developers.",
  },
  {
    question: "what problem does infraos solve",
    answer:
      "InfraOS solves delays, cost overruns, poor procurement visibility, contractor risk, claims escalation, and infrastructure governance inefficiencies.",
  },
  {
    question: "is infraos a project management tool",
    answer:
      "No. InfraOS is not just project management software. It is a full infrastructure intelligence platform.",
  },
  {
    question: "is infraos only for government projects",
    answer:
      "No. InfraOS supports both government and private infrastructure projects.",
  },
  {
    question: "what sectors does infraos support",
    answer:
      "Roads, highways, bridges, metros, railways, airports, water, smart cities, urban infra, and public works.",
  },
  {
    question: "what makes infraos different",
    answer:
      "InfraOS combines procurement, execution, commercial risk, governance, and asset intelligence in one platform.",
  },
  {
    question: "is infraos ai-based",
    answer:
      "Yes. InfraOS uses AI for risk detection, document analysis, forecasting, scoring, and decision support.",
  },
  {
    question: "is infraos real-time",
    answer:
      "Yes. InfraOS supports live project monitoring, alerts, and operational intelligence.",
  },

  // PROCUREMENT INTELLIGENCE
  {
    question: "what is procurement intelligence",
    answer:
      "Procurement Intelligence helps analyze tenders, contracts, BOQs, vendors, and compliance before project award.",
  },
  {
    question: "what can infraos detect in tenders",
    answer:
      "InfraOS detects risky clauses, hidden liabilities, vague scope, compliance gaps, BOQ inflation, and bid anomalies.",
  },
  {
    question: "can infraos analyze tender documents",
    answer:
      "Yes. InfraOS can read and analyze tender documents, contracts, annexures, and BOQs.",
  },
  {
    question: "what is clause extraction",
    answer:
      "Clause extraction identifies important contractual clauses such as payment terms, penalties, obligations, and risks.",
  },
  {
    question: "what is boq analysis",
    answer:
      "BOQ analysis checks quantities, line items, pricing anomalies, duplicates, and scope inflation.",
  },
  {
    question: "what is l1 anomaly detection",
    answer:
      "L1 anomaly detection identifies suspiciously low bids that may indicate underquoting or execution risk.",
  },
  {
    question: "what is vendor scoring",
    answer:
      "Vendor scoring evaluates contractors based on performance, financial health, litigation, and delivery credibility.",
  },
  {
    question: "can infraos detect tender fraud",
    answer:
      "Yes. InfraOS can flag suspicious pricing patterns, repeated vendor clusters, and cartel-like bid behavior.",
  },
  {
    question: "can infraos identify compliance requirements",
    answer:
      "Yes. InfraOS extracts mandatory statutory and technical compliance obligations from tender documents.",
  },
  {
    question: "what is contract risk scoring",
    answer:
      "Contract risk scoring evaluates overall legal, commercial, and execution risk before award.",
  },

  // EXECUTION INTELLIGENCE
  {
    question: "what is execution intelligence",
    answer:
      "Execution Intelligence monitors live project progress, delays, milestones, approvals, and site performance.",
  },
  {
    question: "can infraos predict delays",
    answer:
      "Yes. InfraOS predicts likely delays using milestone slippage, approvals, productivity, and historical patterns.",
  },
  {
    question: "how does delay prediction work",
    answer:
      "InfraOS compares planned vs actual progress, approval dependencies, and critical path slippage to forecast delays.",
  },
  {
    question: "what is milestone slippage",
    answer:
      "Milestone slippage means project milestones are likely to miss planned completion dates.",
  },
  {
    question: "can infraos track permits",
    answer:
      "Yes. InfraOS tracks approvals, permits, NOCs, and departmental dependencies.",
  },
  {
    question: "what is permit bottleneck tracking",
    answer:
      "It identifies delayed approvals and shows which departments are causing execution slowdowns.",
  },
  {
    question: "can infraos track utility shifting",
    answer:
      "Yes. InfraOS tracks utility relocation dependencies such as power lines, water lines, and telecom conflicts.",
  },
  {
    question: "what is live site validation",
    answer:
      "Live site validation compares reported progress with actual site evidence like photos, logs, and field updates.",
  },
  {
    question: "what is field-vs-report mismatch",
    answer:
      "It flags differences between reported progress and actual on-ground execution.",
  },
  {
    question: "can infraos monitor productivity",
    answer:
      "Yes. InfraOS tracks manpower, equipment, material flow, and execution efficiency.",
  },

  // COMMERCIAL RISK
  {
    question: "what is commercial risk",
    answer:
      "Commercial Risk tracks claims, billing anomalies, variations, EOT risk, and arbitration exposure.",
  },
  {
    question: "can infraos predict claims",
    answer:
      "Yes. InfraOS predicts claims using contract clauses, delays, correspondence, and scope changes.",
  },
  {
    question: "what is claim prediction",
    answer:
      "Claim prediction estimates the likelihood of future contractor claims and dispute escalation.",
  },
  {
    question: "what is eot risk",
    answer:
      "EOT risk indicates the probability of extension-of-time claims due to project delays.",
  },
  {
    question: "can infraos detect billing fraud",
    answer:
      "Yes. InfraOS detects overbilling, front-loading, ghost billing, and quantity inflation.",
  },
  {
    question: "what is variation order intelligence",
    answer:
      "It tracks scope changes, cost impact, approval status, and commercial exposure of variation orders.",
  },
  {
    question: "what is arbitration exposure",
    answer:
      "Arbitration exposure estimates legal and financial risk from disputes likely to escalate.",
  },
  {
    question: "can infraos detect boq inflation in bills",
    answer:
      "Yes. InfraOS compares billed quantities against approved BOQ and execution evidence.",
  },
  {
    question: "what is cost overrun forecasting",
    answer:
      "It predicts likely project cost escalation before budget breach occurs.",
  },
  {
    question: "can infraos monitor payment delays",
    answer:
      "Yes. InfraOS tracks RA bill approvals, payment aging, and delayed disbursements.",
  },

  // GOVERNANCE INTELLIGENCE
  {
    question: "what is governance intelligence",
    answer:
      "Governance Intelligence improves transparency, compliance, accountability, and audit readiness.",
  },
  {
    question: "can infraos detect bid rigging",
    answer:
      "Yes. InfraOS detects suspicious bid spreads, repeat winners, and cartel patterns.",
  },
  {
    question: "what is tender manipulation detection",
    answer:
      "It identifies unusual tender patterns that may indicate procurement manipulation.",
  },
  {
    question: "what is approval sla tracking",
    answer: "It tracks approval timelines and flags overdue actions.",
  },
  {
    question: "can infraos show approval ownership",
    answer:
      "Yes. InfraOS maps approvals to departments, officers, and pending responsibility.",
  },
  {
    question: "what are accountability maps",
    answer: "They show who approved what, when, and where delays occurred.",
  },
  {
    question: "can infraos support audits",
    answer:
      "Yes. InfraOS provides audit trails, compliance logs, and breach history.",
  },
  {
    question: "what is compliance monitoring",
    answer:
      "Compliance monitoring tracks statutory, contractual, and approval obligations.",
  },
  {
    question: "what are executive risk heatmaps",
    answer:
      "Executive risk heatmaps show project health across departments, states, and portfolios.",
  },
  {
    question: "can infraos support ministry dashboards",
    answer:
      "Yes. InfraOS supports high-level ministry and executive governance dashboards.",
  },

  // ASSET INTELLIGENCE
  {
    question: "what is asset intelligence",
    answer:
      "Asset Intelligence monitors infrastructure condition after project completion.",
  },
  {
    question: "can infraos track asset health",
    answer:
      "Yes. InfraOS tracks health of roads, bridges, drains, tunnels, and public assets.",
  },
  {
    question: "what is predictive maintenance",
    answer:
      "Predictive maintenance forecasts maintenance needs before asset failure occurs.",
  },
  {
    question: "what is asset degradation scoring",
    answer: "It measures asset condition deterioration and risk level.",
  },
  {
    question: "can infraos detect repair priorities",
    answer: "Yes. InfraOS prioritizes repairs based on risk, cost, and safety.",
  },
  {
    question: "what is sensor diagnostics",
    answer:
      "Sensor diagnostics monitor asset condition using IoT or structural data.",
  },
  {
    question: "can infraos process citizen complaints",
    answer:
      "Yes. InfraOS uses complaint data to validate asset issues and maintenance needs.",
  },
  {
    question: "what is infrastructure health monitoring",
    answer:
      "It continuously tracks the condition and performance of completed assets.",
  },
  {
    question: "can infraos detect high-risk assets",
    answer: "Yes. InfraOS flags assets with elevated failure probability.",
  },
  {
    question: "can infraos plan maintenance budgets",
    answer: "Yes. InfraOS helps prioritize repair budgets based on asset risk.",
  },

  // MAP / LIFECYCLE / VENDOR
  {
    question: "what is lifecycle view",
    answer:
      "Lifecycle View tracks project intelligence from Tender to Maintenance.",
  },
  {
    question: "what stages are covered",
    answer:
      "Tender, Bid, Award, Execution, Monitoring, Claims, and Maintenance.",
  },
  {
    question: "what is national map view",
    answer:
      "National Map View shows project concentration, delays, risks, and bottlenecks across India.",
  },
  {
    question: "can infraos show state-wise risk",
    answer:
      "Yes. InfraOS visualizes state-wise delays, cost overruns, and project risk.",
  },
  {
    question: "what is vendor intelligence graph",
    answer:
      "It maps contractor relationships, risk exposure, and bid networks.",
  },
  {
    question: "can infraos track contractor credibility",
    answer:
      "Yes. InfraOS tracks performance, disputes, and financial risk across contractors.",
  },

  // AI COPILOT
  {
    question: "what is ai copilot",
    answer:
      "AI Copilot is the built-in assistant that summarizes risks, explains anomalies, and recommends actions.",
  },
  {
    question: "can ai copilot explain risks",
    answer: "Yes. AI Copilot explains risk drivers and their likely impact.",
  },
  {
    question: "can ai copilot summarize projects",
    answer:
      "Yes. It generates project summaries, risk briefs, and executive updates.",
  },
  {
    question: "can ai copilot recommend actions",
    answer: "Yes. It suggests mitigation actions based on risk signals.",
  },
  {
    question: "can ai copilot explain alerts",
    answer:
      "Yes. It explains why an alert was triggered and what should be reviewed.",
  },

  // REPORTS / PLATFORM
  {
    question: "can infraos export reports",
    answer:
      "Yes. InfraOS exports audit, project, compliance, and risk reports.",
  },
  {
    question: "can infraos generate executive summaries",
    answer: "Yes. InfraOS generates board-level and ministry-level summaries.",
  },
  {
    question: "can infraos support multi-user teams",
    answer:
      "Yes. InfraOS supports role-based access and multi-user collaboration.",
  },
  {
    question: "is data secure",
    answer:
      "Yes. InfraOS uses enterprise-grade access controls and audit logs.",
  },
  {
    question: "can infraos integrate with erp",
    answer: "Yes. InfraOS can integrate with ERP, procurement, and PM systems.",
  },

  // ADVANCED QUESTIONS
  {
    question: "why is this project delayed despite 72% reported progress",
    answer:
      "Reported progress may not match critical path completion. InfraOS checks milestone dependency, approvals, and execution evidence before confirming actual health.",
  },
  {
    question: "why is this contractor high risk despite being l1",
    answer:
      "Low bid value alone does not indicate execution strength. InfraOS scores litigation, delivery history, financial health, and claim behavior.",
  },
  {
    question: "why is this claim likely to escalate",
    answer:
      "The claim shows weak documentation, delayed approvals, and contractual ambiguity, increasing dispute probability.",
  },
  {
    question: "which department is causing maximum approval delay",
    answer:
      "InfraOS identifies the department with the highest pending SLA breaches and approval lag.",
  },
  {
    question: "which projects have the highest arbitration exposure",
    answer:
      "InfraOS ranks projects by claim probability, unresolved disputes, and contract risk.",
  },
  {
    question: "which assets are most likely to fail in the next 12 months",
    answer:
      "InfraOS prioritizes assets with high degradation, repeated complaints, and overdue maintenance.",
  },

  // PROCUREMENT / TENDER / CONTRACTS
  {
    question: "what is a tender",
    answer:
      "A tender is a formal invitation issued by an owner or authority to invite bids for a project, service, or procurement package.",
  },
  {
    question: "what is an rfp",
    answer:
      "An RFP (Request for Proposal) is a tender document inviting technical and commercial proposals from bidders.",
  },
  {
    question: "what is an rfq",
    answer:
      "An RFQ (Request for Quotation) requests price quotations for defined goods, services, or works.",
  },
  {
    question: "what is nit",
    answer:
      "NIT (Notice Inviting Tender) is the public notice announcing a tender opportunity.",
  },
  {
    question: "what is boq",
    answer:
      "BOQ (Bill of Quantities) is the itemized list of work quantities used for pricing and billing.",
  },
  {
    question: "what is epc",
    answer:
      "EPC (Engineering, Procurement, Construction) is a delivery model where one contractor designs and executes the project.",
  },
  {
    question: "what is pmc",
    answer:
      "PMC (Project Management Consultant) is the consultant responsible for planning, supervision, and coordination.",
  },
  {
    question: "what is loa",
    answer:
      "LOA (Letter of Acceptance) is the formal acceptance of a bidder's offer.",
  },
  {
    question: "what is loi",
    answer:
      "LOI (Letter of Intent) is a preliminary communication of intent to award work.",
  },
  {
    question: "what is gcc",
    answer:
      "GCC (General Conditions of Contract) contains standard contractual terms applicable across projects.",
  },
  {
    question: "what is scc",
    answer:
      "SCC (Special Conditions of Contract) contains project-specific contractual terms.",
  },
  {
    question: "what is bid security",
    answer:
      "Bid security is a guarantee submitted with the bid to ensure bidder seriousness.",
  },
  {
    question: "what is performance security",
    answer:
      "Performance security is a guarantee submitted after award to ensure execution performance.",
  },
  {
    question: "what is retention money",
    answer:
      "Retention money is a portion withheld from payments as security against defects or incomplete work.",
  },
  {
    question: "what is mobilization advance",
    answer:
      "Mobilization advance is an upfront payment made to help the contractor mobilize resources.",
  },
  {
    question: "what is defect liability period",
    answer:
      "It is the post-completion period during which the contractor must rectify defects.",
  },
  {
    question: "what is liquidated damages",
    answer:
      "Liquidated damages are pre-defined penalties for delays or contractual non-performance.",
  },
  {
    question: "what is a variation order",
    answer:
      "A variation order is a formal change in scope, quantity, or specifications after award.",
  },
  {
    question: "what is a concession agreement",
    answer:
      "A concession agreement governs PPP projects where private parties build/operate assets for defined terms.",
  },
  {
    question: "what is fidic",
    answer:
      "FIDIC is an internationally used suite of construction contract standards.",
  },
  {
    question: "what is qcbs",
    answer:
      "QCBS (Quality and Cost Based Selection) evaluates bidders on both technical quality and price.",
  },
  {
    question: "what is bid rigging",
    answer:
      "Bid rigging is collusive manipulation of bids to predetermine outcomes.",
  },
  {
    question: "what is front loading in bids",
    answer:
      "Front loading is overpricing early BOQ items to improve contractor cash flow.",
  },
  {
    question: "what is unbalanced bidding",
    answer:
      "Unbalanced bidding is disproportionate pricing across BOQ items to exploit execution/payment sequencing.",
  },
  {
    question: "what is predatory underquoting",
    answer:
      "Predatory underquoting is unrealistic low pricing used to win work and recover later through claims/variations.",
  },
  {
    question: "what is cartel bidding",
    answer:
      "Cartel bidding is coordinated bidder collusion to manipulate prices or outcomes.",
  },
  {
    question: "what is a claim-prone clause",
    answer:
      "A claim-prone clause is a contractual clause likely to trigger disputes due to ambiguity, liability shift, or weak definitions.",
  },

  // BOQ / COST / ESTIMATION
  {
    question: "what is rate analysis",
    answer:
      "Rate analysis is the breakdown of material, labour, equipment, and overhead costs for a BOQ item.",
  },
  {
    question: "what is sor",
    answer:
      "SOR (Schedule of Rates) is the standard rate reference published by authorities.",
  },
  {
    question: "what is dsr",
    answer: "DSR (Delhi Schedule of Rates) is CPWD's standard rate book.",
  },
  {
    question: "what is item-rate contract",
    answer:
      "An item-rate contract pays based on actual measured quantities executed.",
  },
  {
    question: "what is lump sum contract",
    answer:
      "A lump sum contract pays a fixed total amount for the defined scope.",
  },
  {
    question: "what is quantity takeoff",
    answer:
      "Quantity takeoff is the process of measuring work quantities from drawings/specifications.",
  },
  {
    question: "what is cost overrun",
    answer:
      "Cost overrun is the amount by which actual cost exceeds sanctioned/projected cost.",
  },
  {
    question: "what is cost-to-complete",
    answer:
      "Cost-to-complete is the forecasted cost required to finish remaining work.",
  },
  {
    question: "what is price escalation",
    answer:
      "Price escalation is compensation for material/labour cost increases during execution.",
  },
  {
    question: "what is a revised estimate",
    answer:
      "A revised estimate updates project cost due to scope, rates, or design changes.",
  },
  {
    question: "what is boq inflation",
    answer:
      "BOQ inflation is artificial quantity/value inflation beyond realistic requirements.",
  },
  {
    question: "what is quantity padding",
    answer:
      "Quantity padding is deliberate overstatement of quantities in BOQ.",
  },
  {
    question: "what is ghost billing",
    answer: "Ghost billing is billing for work not executed.",
  },
  {
    question: "what is duplicate line item risk",
    answer:
      "It is the risk of repeated BOQ items causing double counting or double billing.",
  },
  {
    question: "what is hidden quantity risk",
    answer:
      "It is the risk of omitted or concealed quantities emerging later as claims/variations.",
  },

  // EXECUTION / PLANNING / SCHEDULING
  {
    question: "what is a baseline schedule",
    answer: "The baseline schedule is the approved original project schedule.",
  },
  {
    question: "what is milestone tracking",
    answer:
      "Milestone tracking monitors progress against key planned project milestones.",
  },
  {
    question: "what is critical path",
    answer:
      "Critical path is the sequence of activities determining the shortest project completion duration.",
  },
  {
    question: "what is float",
    answer:
      "Float is the amount of time an activity can slip without affecting project completion.",
  },
  {
    question: "what is a dpr",
    answer:
      "DPR (Detailed Project Report) is the planning and technical basis for project execution.",
  },
  {
    question: "what is slippage",
    answer: "Slippage is the delay between planned and actual progress.",
  },
  {
    question: "what is re-baselining",
    answer:
      "Re-baselining is revising the baseline schedule after major changes.",
  },
  {
    question: "what is workfront availability",
    answer:
      "Workfront availability is whether site access and conditions are ready for execution.",
  },
  {
    question: "what is mobilization",
    answer:
      "Mobilization is deployment of labour, equipment, materials, and site setup before execution.",
  },
  {
    question: "what is look-ahead planning",
    answer:
      "Look-ahead planning is short-term execution planning for upcoming weeks.",
  },
  {
    question: "what is concurrent delay",
    answer:
      "Concurrent delay is delay caused simultaneously by both contractor and owner-side events.",
  },
  {
    question: "what is critical path deviation",
    answer: "It is slippage in critical activities affecting completion dates.",
  },
  {
    question: "what is progress misreporting",
    answer: "It is overstated or inaccurate reporting of actual site progress.",
  },
  {
    question: "what is idle time risk",
    answer:
      "Idle time risk is productivity loss due to approvals, resources, or access constraints.",
  },

  // APPROVALS / PERMITS / CLEARANCES
  {
    question: "what is a permit",
    answer:
      "A permit is an official authorization required to perform project work.",
  },
  {
    question: "what is noc",
    answer:
      "NOC (No Objection Certificate) is approval from a concerned authority.",
  },
  {
    question: "what is forest clearance",
    answer: "Approval required for work affecting forest land.",
  },
  {
    question: "what is environmental clearance",
    answer: "Approval required for projects with environmental impact.",
  },
  {
    question: "what is utility shifting",
    answer: "Relocation of existing utilities obstructing execution.",
  },
  {
    question: "what is land acquisition",
    answer: "The process of acquiring land required for project execution.",
  },
  {
    question: "what is approval sla",
    answer: "The target timeline for completing an approval step.",
  },
  {
    question: "what is approval lag",
    answer: "Delay beyond expected approval timeline.",
  },
  {
    question: "what is approval chain",
    answer: "The sequence of departmental approvals required before execution.",
  },
  {
    question: "what is permit bottleneck",
    answer: "A delayed approval step blocking execution progress.",
  },

  // CLAIMS / COMMERCIAL / LEGAL
  {
    question: "what is a claim",
    answer:
      "A claim is a formal request for additional time or money under the contract.",
  },
  {
    question: "what is eot",
    answer: "EOT (Extension of Time) is a formal extension of completion time.",
  },
  {
    question: "what is prolongation cost",
    answer: "Cost incurred due to extended project duration.",
  },
  {
    question: "what is disruption claim",
    answer: "A claim for productivity loss due to disturbed work sequence.",
  },
  {
    question: "what is loss and expense claim",
    answer:
      "Claim for financial loss caused by owner-side events or contract issues.",
  },
  {
    question: "what is arbitration",
    answer: "A formal dispute resolution process outside court.",
  },
  {
    question: "what is dispute notice",
    answer: "Formal notice initiating dispute resolution.",
  },
  {
    question: "what is contractual correspondence",
    answer: "Official letters/emails exchanged under contract administration.",
  },
  {
    question: "what is claims register",
    answer: "Central log of claims and dispute events.",
  },

  // ROADS / HIGHWAYS
  {
    question: "what is nhai",
    answer:
      "National Highways Authority of India is the authority responsible for development and management of national highways in India.",
  },
  {
    question: "what is morth",
    answer:
      "Ministry of Road Transport and Highways is the ministry responsible for road transport and highways policy in India.",
  },
  {
    question: "what is row",
    answer:
      "ROW (Right of Way) is the land corridor reserved for road infrastructure.",
  },
  {
    question: "what is carriageway",
    answer: "The portion of roadway used by vehicular traffic.",
  },
  {
    question: "what is shoulder",
    answer:
      "The strip adjacent to carriageway for emergency or structural support.",
  },
  {
    question: "what is median",
    answer: "The divider separating opposing traffic lanes.",
  },
  {
    question: "what is camber",
    answer: "Cross slope provided to drain water off pavement.",
  },
  {
    question: "what is superelevation",
    answer: "Banking provided on curves to counter centrifugal force.",
  },
  {
    question: "what is pavement",
    answer: "The layered road structure carrying traffic loads.",
  },
  {
    question: "what is flexible pavement",
    answer: "Bituminous pavement structure with layered granular/base support.",
  },
  {
    question: "what is rigid pavement",
    answer: "Concrete pavement structure with slab-based load distribution.",
  },
  {
    question: "what is pothole",
    answer:
      "A pothole is a surface depression caused by pavement failure, water ingress, or load distress.",
  },
  {
    question: "what causes potholes",
    answer:
      "Potholes are caused by water infiltration, poor drainage, weak subgrade, poor compaction, and traffic loading.",
  },
  {
    question: "how are potholes repaired",
    answer:
      "Potholes are repaired by cutting, cleaning, tack coating, filling with mix, compacting, and sealing.",
  },
  {
    question: "what is rutting",
    answer: "Longitudinal surface depression caused by repeated wheel loading.",
  },
  {
    question: "what is cracking",
    answer:
      "Surface distress caused by fatigue, shrinkage, thermal stress, or structural weakness.",
  },
  {
    question: "what is irc",
    answer:
      "Indian Roads Congress publishes standards and codes for road design and construction in India.",
  },
  {
    question: "why do potholes return",
    answer:
      "Temporary patching, weak base, poor compaction, and water seepage.",
  },
  {
    question: "why do roads crack early",
    answer:
      "Poor compaction, weak pavement layers, rushed construction, and drainage failure.",
  },
  {
    question: "what is ravelling",
    answer: "Surface aggregate loss due to weak bitumen bonding.",
  },
  {
    question: "why does road surface peel off",
    answer: "Poor bonding, low-quality mix, or poor tack coat.",
  },
  {
    question: "why do roads fail in monsoon",
    answer: "Water ingress, clogged drains, and weak pavement base.",
  },
  {
    question: "why do roads flood",
    answer: "Poor stormwater drainage and blocked outfalls.",
  },
  {
    question: "what causes road settlement",
    answer: "Weak subgrade, poor compaction, or water erosion.",
  },
  {
    question: "why does fresh asphalt fail quickly",
    answer: "Poor mix design, low compaction, or poor drainage.",
  },
  {
    question: "why is camber important",
    answer: "It prevents water stagnation and pavement failure.",
  },
  {
    question: "why do shoulders fail",
    answer: "Poor compaction, edge erosion, and overload.",
  },
  {
    question: "what causes edge breaking",
    answer: "Weak shoulders and poor lateral support.",
  },
  {
    question: "what is pavement distress",
    answer: "Visible surface or structural road failure.",
  },
  {
    question: "why is one lane worse",
    answer: "Uneven traffic loading or localized drainage issues.",
  },
  {
    question: "what causes road undulation",
    answer: "Poor base, weak compaction, or settlement.",
  },
  {
    question: "why does concrete road crack",
    answer: "Poor joints, shrinkage, weak curing, or base failure.",
  },
  {
    question: "what is white-topping",
    answer: "Concrete overlay over bituminous pavement.",
  },
  {
    question: "why does white-topping fail",
    answer: "Poor jointing, drainage, base prep, or curing.",
  },
  {
    question: "what causes shoulder drop",
    answer: "Edge erosion and poor shoulder maintenance.",
  },
  {
    question: "what is pavement delamination",
    answer: "Layer separation due to poor bonding.",
  },
  {
    question: "why do repairs fail quickly",
    answer: "Temporary patching and weak supervision.",
  },
  {
    question: "what causes reflective cracking",
    answer: "Cracks from lower layers reflecting upward.",
  },
  {
    question: "what is road roughness",
    answer: "Uneven surface affecting ride quality.",
  },
  {
    question: "what causes skid risk",
    answer: "Smooth surface, water, or polished aggregates.",
  },
  {
    question: "why do road markings fade",
    answer: "Poor paint quality and traffic wear.",
  },
  {
    question: "what causes median damage",
    answer: "Vehicle impact or poor protection.",
  },
  {
    question: "why do service roads fail",
    answer: "Poor drainage and low maintenance.",
  },
  {
    question: "what causes culvert blockage",
    answer: "Silt, waste, or poor maintenance.",
  },
  {
    question: "why do drains overflow",
    answer: "Blockage or undersized drainage.",
  },
  {
    question: "what causes waterlogging",
    answer: "Inadequate drainage outflow.",
  },
  {
    question: "why do roads sink",
    answer: "Utility trench failure or weak subsoil.",
  },
  {
    question: "why are joints failing",
    answer: "Poor sealing and water ingress.",
  },
  {
    question: "why does road dust increase",
    answer: "Surface wear and shoulder erosion.",
  },
  {
    question: "what causes road shoulder erosion",
    answer: "Water flow and poor compaction.",
  },
  {
    question: "why do black spots persist",
    answer: "Poor geometry, speed, and weak enforcement.",
  },
  { question: "what is a black spot", answer: "High-accident road location." },
  {
    question: "why are diversions unsafe",
    answer: "Poor signage and weak barricading.",
  },
  {
    question: "what causes lane waviness",
    answer: "Uneven laying and compaction.",
  },
  {
    question: "why is drainage slope important",
    answer: "Prevents standing water.",
  },
  { question: "why does bitumen bleed", answer: "Excess binder and heat." },
  { question: "why is road noisy", answer: "Rough texture or damaged joints." },
  { question: "what causes shoulder rutting", answer: "Heavy edge loading." },
  {
    question: "why does median drain clog",
    answer: "Debris and poor cleaning.",
  },
  {
    question: "what causes embankment erosion",
    answer: "Poor slope protection.",
  },
  {
    question: "why do crash barriers fail",
    answer: "Impact or weak anchoring.",
  },
  {
    question: "why does pavement pumping occur",
    answer: "Water and repeated loading.",
  },
  {
    question: "why do repaired roads fail again",
    answer: "Root cause not fixed.",
  },

  // HIGHWAY EXECUTION / DELAYS
  {
    question: "how long does a highway take",
    answer: "Usually 18\u201336 months.",
  },
  {
    question: "why are highways delayed",
    answer: "Land, approvals, utilities, weather, and contractor delays.",
  },
  {
    question: "what delays highways most",
    answer: "Land acquisition and utility shifting.",
  },
  {
    question: "why does widening take years",
    answer: "Traffic management and phased execution.",
  },
  {
    question: "why is one side complete first",
    answer: "Land or utility constraints.",
  },
  {
    question: "why do bridges delay highways",
    answer: "Foundation, approvals, and design complexity.",
  },
  {
    question: "why do culverts delay work",
    answer: "Utility and traffic constraints.",
  },
  {
    question: "why is progress slow",
    answer: "Low manpower, equipment, or access.",
  },
  {
    question: "what is critical path delay",
    answer: "Delay in tasks controlling completion.",
  },
  { question: "what is float loss", answer: "Reduced scheduling buffer." },
  {
    question: "why do highways stop mid-work",
    answer: "Funding, approvals, or disputes.",
  },
  {
    question: "why do roads remain dug up",
    answer: "Utility conflicts or contractor delay.",
  },
  {
    question: "why does monsoon delay projects",
    answer: "Rain, flooding, and productivity loss.",
  },
  {
    question: "why is equipment idle",
    answer: "No workfront or approval bottleneck.",
  },
  {
    question: "why is actual progress lower",
    answer: "Critical work not complete.",
  },
  { question: "why is earthwork delayed", answer: "Land or weather." },
  {
    question: "why are structures late",
    answer: "Design and foundation delays.",
  },
  {
    question: "why is utility shifting slow",
    answer: "Multi-agency approvals.",
  },
  {
    question: "what causes idle labour",
    answer: "Poor planning or approvals.",
  },
  {
    question: "what is contractor slippage",
    answer: "Delay caused by contractor.",
  },
  {
    question: "what is owner-side delay",
    answer: "Delay caused by authority.",
  },
  { question: "why is project cost rising", answer: "Delay and scope change." },
  {
    question: "what causes chainage gaps",
    answer: "Pending land or structures.",
  },
  {
    question: "why are diversions prolonged",
    answer: "Slow mainline execution.",
  },
  {
    question: "what delays toll readiness",
    answer: "Systems, civil works, and approvals.",
  },
  {
    question: "why do handovers delay",
    answer: "Pending defects and approvals.",
  },
  {
    question: "why does mobilization fail",
    answer: "Poor contractor readiness.",
  },
  {
    question: "what is delayed mobilization",
    answer: "Late deployment of resources.",
  },
  {
    question: "why do highway packages stall",
    answer: "Claims, disputes, or finance.",
  },
  {
    question: "why do schedules keep changing",
    answer: "Scope or approval changes.",
  },
  {
    question: "why is night work slow",
    answer: "Safety and logistics limits.",
  },
  {
    question: "what delays pavement",
    answer: "Utilities, weather, or base readiness.",
  },
  { question: "what delays markings", answer: "Pending final surface." },
  {
    question: "what delays crash barriers",
    answer: "Procurement and civil readiness.",
  },
  { question: "why are robs delayed", answer: "Railway approvals." },
  {
    question: "why are flyovers delayed",
    answer: "Utility and traffic phasing.",
  },
  {
    question: "why are underpasses delayed",
    answer: "Water table and traffic diversion.",
  },
  {
    question: "why are medians incomplete",
    answer: "Final surfacing pending.",
  },
  {
    question: "what is package dependency",
    answer: "One package blocking another.",
  },
  { question: "why are approach roads late", answer: "Land and local access." },
  {
    question: "why do highway deadlines slip",
    answer: "Multi-agency dependencies.",
  },
  {
    question: "what is execution bottleneck",
    answer: "Constraint slowing work.",
  },
  { question: "why is concrete paving slow", answer: "Curing and sequencing." },
  { question: "why are shoulders pending", answer: "Mainline priority." },
  { question: "why are snag works delayed", answer: "Low closeout priority." },
  {
    question: "why do highways miss deadlines",
    answer: "Combined planning and execution failure.",
  },

  // TENDERS EXTENDED
  {
    question: "what is ham",
    answer:
      "HAM (Hybrid Annuity Model) is a PPP model where government funds part of construction cost and pays annuities.",
  },
  {
    question: "what is bot",
    answer:
      "BOT (Build Operate Transfer) is a concession model where contractor builds, operates, and transfers the asset.",
  },
  { question: "why was tender delayed", answer: "Approval or estimate lag." },
  {
    question: "why was tender cancelled",
    answer: "Poor bids or scope issues.",
  },
  { question: "why was tender reissued", answer: "Bid failure or revisions." },
  { question: "why was l1 rejected", answer: "Non-compliance." },
  {
    question: "why only one bidder",
    answer: "Strict criteria or low interest.",
  },
  {
    question: "what is dlp",
    answer:
      "DLP (Defect Liability Period) is the post-completion period for defect rectification.",
  },
  { question: "what is tender addendum", answer: "Tender correction/update." },
  { question: "what is corrigendum", answer: "Tender amendment." },
  { question: "what is technical bid", answer: "Qualification proposal." },
  { question: "what is financial bid", answer: "Price proposal." },
  { question: "what is bid validity", answer: "Validity period of bid." },
  {
    question: "what is tender compliance",
    answer: "Meeting all tender conditions.",
  },
  { question: "why was technical bid rejected", answer: "Non-compliance." },
  {
    question: "what is pre-bid query",
    answer: "Clarification before submission.",
  },
  { question: "what is bid opening", answer: "Formal bid disclosure." },
  { question: "what is package split", answer: "Division into work packages." },
  {
    question: "what is tender manipulation",
    answer: "Unfair bid process distortion.",
  },
  { question: "what is bid spread", answer: "Price difference among bids." },
  {
    question: "why do tenders fail",
    answer: "Weak planning and poor market response.",
  },
  {
    question: "what is claim-prone tender",
    answer: "High dispute risk tender.",
  },
  {
    question: "why is this tender high risk",
    answer: "Weak scope and poor clauses.",
  },

  // BOQ BILLING EXTENDED
  {
    question: "what is duplicate billing",
    answer: "Billing the same work twice.",
  },
  {
    question: "what is front-loaded billing",
    answer: "Claiming high value early in execution.",
  },
  {
    question: "what is under-measurement risk",
    answer: "Actual work exceeds measured quantities.",
  },
  {
    question: "what is over-measurement risk",
    answer: "Measured quantity exceeds executed work.",
  },
  {
    question: "what is ra bill",
    answer:
      "RA (Running Account) bill is used for periodic payment based on work executed.",
  },
  {
    question: "what is ipc",
    answer:
      "IPC (Interim Payment Certificate) is issued to authorize interim payments.",
  },
  {
    question: "what is invoice aging",
    answer: "Delay between billing and payment.",
  },
  {
    question: "what is payment lag",
    answer: "Delay in bill approval or release.",
  },
  {
    question: "what is quantity reconciliation",
    answer: "Matching executed vs billed quantities.",
  },
  {
    question: "what is rate mismatch",
    answer: "Billed rate differs from approved rate.",
  },
  {
    question: "what is item-rate anomaly",
    answer: "Unusual pricing in BOQ items.",
  },
  {
    question: "what is revised boq",
    answer: "Updated BOQ after scope or design change.",
  },
  {
    question: "what is deviation statement",
    answer: "Record of BOQ/scope changes.",
  },
  {
    question: "what is cost underrun",
    answer: "Actual cost below planned cost.",
  },
  {
    question: "what is budget variance",
    answer: "Difference between planned and actual spend.",
  },
  {
    question: "what is cash-flow mismatch",
    answer: "Spend timing differs from planned cash flow.",
  },
  {
    question: "what is idle cost",
    answer: "Cost incurred without productive work.",
  },
  {
    question: "what is sunk cost",
    answer: "Irrecoverable cost already spent.",
  },
  {
    question: "what is escalation cost",
    answer: "Cost increase due to time/material inflation.",
  },
  {
    question: "what is price escalation clause",
    answer: "Contract provision for inflation adjustment.",
  },
  {
    question: "what is non-payable quantity",
    answer: "Executed work not contractually payable.",
  },
  {
    question: "what is provisional sum",
    answer: "Budget allowance for undefined work.",
  },
  {
    question: "what is prime cost item",
    answer: "Allowance for supply-only item.",
  },
  {
    question: "what is quantity variance",
    answer: "Difference in planned vs executed quantity.",
  },
  {
    question: "why was this bill flagged",
    answer: "Quantity, rate, or documentation mismatch.",
  },
  {
    question: "why is payment delayed",
    answer: "Approval lag, dispute, or document gap.",
  },
  {
    question: "why is billed quantity high",
    answer: "Possible over-measurement or front-loading.",
  },
  {
    question: "why is billed quantity low",
    answer: "Under-measurement or incomplete documentation.",
  },
  {
    question: "why is cost rising",
    answer: "Delay, inflation, or scope change.",
  },
  {
    question: "why is cost-to-complete high",
    answer: "Productivity loss or revised scope.",
  },
  {
    question: "why is invoice aging high",
    answer: "Slow approval or funding delay.",
  },
  {
    question: "why is budget breached",
    answer: "Overrun, delay, or poor control.",
  },
  {
    question: "why is contractor cash-stressed",
    answer: "Payment lag and high idle cost.",
  },
  {
    question: "why is billing ahead of progress",
    answer: "Front-loaded billing risk.",
  },
  {
    question: "why is billing behind progress",
    answer: "Measurement or approval lag.",
  },
  {
    question: "why is rate different from boq",
    answer: "Variation or billing error.",
  },
  { question: "why is quantity disputed", answer: "Measurement mismatch." },
  {
    question: "why is this item overbilled",
    answer: "Rate/quantity inflation.",
  },
  { question: "why is this item underbilled", answer: "Missed measurement." },
  {
    question: "why is this bill high risk",
    answer: "Weak documentation or commercial anomaly.",
  },
  {
    question: "why is this package over budget",
    answer: "Cost overrun and delay.",
  },
  { question: "why is this estimate revised", answer: "Scope or rate change." },
  {
    question: "why is this boq risky",
    answer: "Ambiguity, omissions, or inflated quantities.",
  },
  {
    question: "why is billing quality poor",
    answer: "Weak controls and documentation.",
  },

  // CLAIMS / EOT / ARBITRATION EXTENDED
  {
    question: "what is acceleration claim",
    answer: "Cost claim for speeding up work.",
  },
  {
    question: "what is idle resource claim",
    answer: "Cost claim for idle manpower/equipment.",
  },
  { question: "what is variation claim", answer: "Claim due to scope change." },
  {
    question: "what is disruption event",
    answer: "Event affecting planned productivity.",
  },
  {
    question: "what is excusable delay",
    answer: "Delay eligible for time relief.",
  },
  {
    question: "what is compensable delay",
    answer: "Delay eligible for time and money.",
  },
  {
    question: "what is non-excusable delay",
    answer: "Contractor-caused delay.",
  },
  {
    question: "what is force majeure",
    answer: "Uncontrollable extraordinary event.",
  },
  {
    question: "what is claim notice",
    answer: "Formal notice to preserve claim rights.",
  },
  {
    question: "what is conciliation",
    answer: "Negotiated settlement process.",
  },
  {
    question: "what is adjudication",
    answer: "Interim dispute determination.",
  },
  {
    question: "what is dispute board",
    answer: "Contract dispute resolution panel.",
  },
  { question: "what is claim quantum", answer: "Monetary value of claim." },
  { question: "what is claim merit", answer: "Strength of claim basis." },
  {
    question: "what is claim defensibility",
    answer: "Strength of response against claim.",
  },
  { question: "what is claim exposure", answer: "Financial risk from claims." },
  {
    question: "why is this claim high risk",
    answer: "Weak documentation and high ambiguity.",
  },
  {
    question: "why was this eot rejected",
    answer: "Weak causation or poor records.",
  },
  {
    question: "why is prolongation cost high",
    answer: "Extended duration and idle resources.",
  },
  {
    question: "why is claim merit weak",
    answer: "Poor notices and weak evidence.",
  },
  {
    question: "why is claim merit strong",
    answer: "Clear causation and documentation.",
  },
  {
    question: "why is arbitration likely",
    answer: "Unresolved claim and poor contract clarity.",
  },
  {
    question: "why is dispute exposure rising",
    answer: "Claims unresolved and delays increasing.",
  },
  { question: "why was claim denied", answer: "Contractual non-entitlement." },
  {
    question: "why is this variation disputed",
    answer: "Scope ownership unclear.",
  },
  {
    question: "why is this claim recurring",
    answer: "Repeated unresolved root cause.",
  },
  {
    question: "why is contractor claim-heavy",
    answer: "Aggressive commercial posture.",
  },
  {
    question: "why is employer claim-heavy",
    answer: "Penalty and recovery actions.",
  },
  {
    question: "why is this package dispute-prone",
    answer: "Weak contract and delays.",
  },
  {
    question: "why is legal exposure high",
    answer: "Claim volume and unresolved disputes.",
  },
  {
    question: "why is claim documentation weak",
    answer: "Poor records and notices.",
  },
  {
    question: "why is arbitration cost high",
    answer: "Large claim and legal duration.",
  },
  {
    question: "why is settlement better",
    answer: "Lower time and legal cost.",
  },
  {
    question: "why is dispute unresolved",
    answer: "No decision or weak negotiation.",
  },
  { question: "why is claim aging high", answer: "Slow commercial closure." },
  {
    question: "why is dispute cycle long",
    answer: "Poor governance and legal lag.",
  },
  {
    question: "why is claim liability unclear",
    answer: "Ambiguous contract terms.",
  },
  {
    question: "why is this contract claim-prone",
    answer: "Vague obligations and risk transfer.",
  },
  {
    question: "why is this package litigation-prone",
    answer: "Claims unresolved and governance weak.",
  },

  // NHAI / TOLLS / FASTAG
  {
    question: "what is fastag",
    answer: "FASTag is an RFID-based electronic toll payment system.",
  },
  {
    question: "why is toll charged",
    answer: "To recover road development and O&M costs.",
  },
  {
    question: "can toll be charged on damaged roads",
    answer: "Yes, unless suspended by authority order.",
  },
  {
    question: "why is toll still active",
    answer: "Toll notification remains in force.",
  },
  {
    question: "who operates toll plazas",
    answer: "Concessionaires or appointed toll agencies.",
  },
  { question: "who audits tolls", answer: "NHAI and audit agencies." },
  {
    question: "what is toll leakage",
    answer: "Revenue loss from toll evasion or fraud.",
  },
  { question: "what is toll evasion", answer: "Avoiding toll payment." },
  {
    question: "what is toll diversion",
    answer: "Traffic avoiding toll routes.",
  },
  {
    question: "what is toll reconciliation",
    answer: "Matching collected vs expected toll.",
  },
  {
    question: "what is toll underreporting",
    answer: "Reported toll below actual collections.",
  },
  {
    question: "what is toll fraud",
    answer: "Manipulation of toll collections.",
  },
  {
    question: "why was toll agency blacklisted",
    answer: "Fraud or contract breach.",
  },
  {
    question: "why is toll queue long",
    answer: "Traffic overload or lane inefficiency.",
  },
  {
    question: "why is fastag not working",
    answer: "Tag issue, balance, or scanner fault.",
  },
  {
    question: "why is double toll deducted",
    answer: "Read error or duplicate scan.",
  },
  {
    question: "why is toll disputed",
    answer: "Wrong charge or service complaint.",
  },
  {
    question: "why is toll suspended",
    answer: "Maintenance or authority order.",
  },
  {
    question: "why is toll collection low",
    answer: "Traffic diversion or leakage.",
  },
  {
    question: "why is toll collection high",
    answer: "Traffic growth or underreported baseline.",
  },
  {
    question: "why was toll audit flagged",
    answer: "Revenue mismatch or fraud risk.",
  },
  {
    question: "why is toll om poor",
    answer: "Weak enforcement and contractor performance.",
  },
  {
    question: "why is plaza congestion high",
    answer: "Lane shortage or traffic spike.",
  },
  {
    question: "why is toll revenue down",
    answer: "Diversion or operational loss.",
  },
  {
    question: "why is toll revenue risk high",
    answer: "Leakage and weak controls.",
  },
  {
    question: "why was toll contract terminated",
    answer: "Non-performance or fraud.",
  },
  {
    question: "why was toll concession delayed",
    answer: "Approval or traffic dispute.",
  },
  {
    question: "what is shadow tolling",
    answer: "Toll paid indirectly by authority.",
  },
  {
    question: "what is toll concession",
    answer: "Right to collect toll under contract.",
  },
  { question: "what is traffic count", answer: "Vehicle flow measurement." },
  {
    question: "what is axle load risk",
    answer: "Heavy load causing pavement damage.",
  },
  {
    question: "why are overloaded trucks risky",
    answer: "They accelerate pavement failure.",
  },
  {
    question: "why is weighbridge important",
    answer: "Controls axle overloading.",
  },
  {
    question: "why is toll compliance low",
    answer: "Evasion and weak enforcement.",
  },
  {
    question: "why is toll lane blocked",
    answer: "Scanner, vehicle, or staffing issue.",
  },
  { question: "why is toll system offline", answer: "Network or power issue." },
  { question: "why is toll settlement delayed", answer: "Reconciliation lag." },
  {
    question: "why was toll agency penalized",
    answer: "Contract or collection breach.",
  },
  { question: "why is toll service poor", answer: "Weak O&M standards." },
  {
    question: "why is tolling controversial",
    answer: "Poor service despite charges.",
  },
  {
    question: "why is toll audit needed",
    answer: "Revenue assurance and compliance.",
  },
  {
    question: "why is toll performance weak",
    answer: "Low controls and poor operations.",
  },
  {
    question: "why are toll complaints rising",
    answer: "Service and charge issues.",
  },
  {
    question: "why is toll enforcement weak",
    answer: "Staffing and oversight gaps.",
  },
  {
    question: "why is fastag penetration important",
    answer: "Reduces congestion and leakage.",
  },
  {
    question: "why are toll disputes frequent",
    answer: "Poor grievance handling.",
  },
  {
    question: "why is toll governance critical",
    answer: "High revenue and public impact.",
  },

  // BRIDGES / STRUCTURES
  {
    question: "what is a bridge bearing",
    answer:
      "A bridge bearing transfers loads from superstructure to substructure while allowing movement.",
  },
  {
    question: "what is expansion joint",
    answer: "A joint allowing movement due to thermal expansion and shrinkage.",
  },
  {
    question: "what is pier",
    answer: "A vertical support between bridge spans.",
  },
  {
    question: "what is abutment",
    answer: "The end support connecting bridge to embankment.",
  },
  {
    question: "what is deck",
    answer: "The top structural surface carrying traffic.",
  },
  { question: "what is span", answer: "Distance between supports." },
  { question: "what is girder", answer: "Main horizontal structural member." },
  {
    question: "what is foundation settlement",
    answer: "Downward movement of support base.",
  },
  {
    question: "what is structural distress",
    answer:
      "Signs of weakening such as cracks, deflection, corrosion, or settlement.",
  },
  {
    question: "what is spalling",
    answer: "Concrete surface breaking off due to corrosion or distress.",
  },
  {
    question: "what is rebar corrosion",
    answer: "Corrosion of reinforcement steel reducing structural durability.",
  },
  {
    question: "what is delamination",
    answer: "Separation within concrete layers.",
  },
  {
    question: "what is bridge deflection",
    answer: "Structural movement under load.",
  },
  {
    question: "what is load rating",
    answer: "Assessment of safe structural load-carrying capacity.",
  },
  {
    question: "what is fatigue cracking",
    answer: "Crack due to repeated loading.",
  },
  {
    question: "what is bearing failure",
    answer: "Loss of load transfer function.",
  },
  { question: "what is joint failure", answer: "Failed movement joint." },
  {
    question: "why do bridge joints leak",
    answer: "Failed seal and drainage.",
  },
  {
    question: "why do bridge bearings fail",
    answer: "Corrosion, load, or maintenance neglect.",
  },
  {
    question: "why does bridge deck crack",
    answer: "Load, shrinkage, or poor design.",
  },
  {
    question: "why does bridge settlement occur",
    answer: "Weak foundation or scour.",
  },
  { question: "why do piers crack", answer: "Overstress or settlement." },
  {
    question: "why is bridge vibration high",
    answer: "Dynamic load or stiffness issue.",
  },
  { question: "why is bridge corrosion severe", answer: "Water and exposure." },
  {
    question: "why is bridge repair urgent",
    answer: "Structural safety risk.",
  },
  {
    question: "why is bridge inspection needed",
    answer: "Safety and maintenance planning.",
  },
  {
    question: "why is bridge load restricted",
    answer: "Reduced structural capacity.",
  },
  {
    question: "why is bridge distress recurring",
    answer: "Poor repair or unresolved root cause.",
  },
  { question: "why is expansion joint noisy", answer: "Wear or loose plates." },
  {
    question: "why is bridge deck uneven",
    answer: "Settlement or resurfacing issue.",
  },
  { question: "why is parapet damaged", answer: "Impact or poor maintenance." },
  {
    question: "why is drainage critical on bridges",
    answer: "Prevents corrosion and damage.",
  },
  {
    question: "why does bridge concrete peel",
    answer: "Corrosion and poor cover.",
  },
  {
    question: "why is bridge approach sinking",
    answer: "Embankment settlement.",
  },
  {
    question: "why are bridge cracks monitored",
    answer: "To track structural risk.",
  },
  {
    question: "why is bridge inspection delayed",
    answer: "Resource or access constraints.",
  },
  {
    question: "why is bridge repair expensive",
    answer: "Traffic and structural complexity.",
  },
  {
    question: "why is bridge fatigue risk high",
    answer: "Repeated heavy traffic.",
  },
  { question: "why is scour dangerous", answer: "Undermines foundation." },
  {
    question: "why is bridge maintenance critical",
    answer: "Prevents structural failure.",
  },
  { question: "what is culvert", answer: "Small drainage crossing structure." },
  {
    question: "why do culverts fail",
    answer: "Blockage, scour, or structural weakness.",
  },
  {
    question: "why is culvert choking dangerous",
    answer: "Causes flooding and erosion.",
  },
  {
    question: "why do retaining walls fail",
    answer: "Drainage and soil pressure issues.",
  },
  { question: "why do re walls fail", answer: "Poor foundation and drainage." },
  {
    question: "why is slope protection critical",
    answer: "Prevents collapse and erosion.",
  },
  {
    question: "why do embankments collapse",
    answer: "Weak soil and drainage failure.",
  },
  {
    question: "why is geotechnical review important",
    answer: "Prevents settlement and collapse.",
  },
  {
    question: "why is structural audit needed",
    answer: "Detects hidden risk.",
  },
  {
    question: "why is bridge safety high priority",
    answer: "Failure has severe consequences.",
  },

  // QA / QC / SAFETY
  {
    question: "what is qa",
    answer: "Quality Assurance ensures systems/processes prevent defects.",
  },
  {
    question: "what is qc",
    answer: "Quality Control verifies executed work meets specifications.",
  },
  {
    question: "what is cube test",
    answer: "Concrete compressive strength test on cube samples.",
  },
  {
    question: "what is slump test",
    answer: "Workability test for fresh concrete.",
  },
  {
    question: "what is compaction test",
    answer: "Test to verify soil density and compaction quality.",
  },
  {
    question: "what is core cutting",
    answer:
      "Concrete/pavement sampling for thickness or strength verification.",
  },
  {
    question: "what is dpr test",
    answer: "Daily progress review / project reporting check.",
  },
  {
    question: "what is hse",
    answer: "Health, Safety, and Environment management.",
  },
  {
    question: "what is toolbox talk",
    answer: "Short daily site safety briefing.",
  },
  {
    question: "what is near miss",
    answer: "An incident that could have caused harm but did not.",
  },
  { question: "what is sieve analysis", answer: "Aggregate gradation test." },
  {
    question: "what is bitumen content test",
    answer: "Binder proportion check.",
  },
  { question: "what is density test", answer: "Compaction verification." },
  {
    question: "what is fdt",
    answer: "FDT (Field Density Test) verifies compaction in the field.",
  },
  { question: "what is unsafe act", answer: "Unsafe worker behavior." },
  { question: "what is unsafe condition", answer: "Unsafe site condition." },
  { question: "why is qa needed", answer: "Prevents defects." },
  { question: "why is qc needed", answer: "Confirms compliance." },
  { question: "why did concrete fail", answer: "Poor mix or curing." },
  { question: "why did compaction fail", answer: "Poor rolling or moisture." },
  {
    question: "why is test frequency important",
    answer: "Ensures quality consistency.",
  },
  { question: "why was sample rejected", answer: "Non-compliance." },
  {
    question: "why is curing critical",
    answer: "Prevents cracking and weakness.",
  },
  {
    question: "why is material approval needed",
    answer: "Ensures spec compliance.",
  },
  {
    question: "why is source approval needed",
    answer: "Ensures material quality.",
  },
  { question: "why is safety compliance low", answer: "Weak enforcement." },
  { question: "why are incidents recurring", answer: "Poor controls." },
  { question: "why are ppe violations risky", answer: "Injury exposure." },
  {
    question: "why is barricading important",
    answer: "Public and worker safety.",
  },
  { question: "why is signage important", answer: "Traffic safety." },
  {
    question: "why are diversions dangerous",
    answer: "Poor control and visibility.",
  },
  { question: "why is night safety critical", answer: "Low visibility risk." },
  {
    question: "why is work zone safety important",
    answer: "Prevents accidents.",
  },
  {
    question: "why is permit-to-work needed",
    answer: "Controls hazardous tasks.",
  },
  {
    question: "why is lifting plan required",
    answer: "Prevents crane incidents.",
  },
  {
    question: "why is confined space risky",
    answer: "Toxicity and access risk.",
  },
  {
    question: "why is excavation risky",
    answer: "Collapse and utility strike risk.",
  },
  {
    question: "why is incident reporting needed",
    answer: "Corrective action.",
  },
  {
    question: "why is root cause analysis important",
    answer: "Prevents recurrence.",
  },
  { question: "why is qa audit needed", answer: "Process assurance." },
  { question: "why is qc audit needed", answer: "Output compliance." },
  { question: "why is ncr issued", answer: "Non-conformance found." },
  {
    question: "what is ncr",
    answer: "NCR (Non-Conformance Report) documents quality failures.",
  },
  { question: "what is punch list", answer: "Outstanding defect list." },
  { question: "why are defects recurring", answer: "Poor closure quality." },
  { question: "why is snagging needed", answer: "Closeout quality check." },
  { question: "why is quality score low", answer: "Defects and failed tests." },
  { question: "why is qa documentation weak", answer: "Poor records." },
  { question: "why is hse risk high", answer: "Unsafe site controls." },
  { question: "why is safety score low", answer: "Incidents and violations." },
  {
    question: "why is quality governance critical",
    answer: "Prevents failures.",
  },

  // ASSETS / MAINTENANCE
  {
    question: "what is preventive maintenance",
    answer: "Scheduled maintenance performed before failure.",
  },
  {
    question: "what is corrective maintenance",
    answer: "Repair after failure occurs.",
  },
  {
    question: "what is asset degradation",
    answer: "Reduction in asset condition over time.",
  },
  {
    question: "what is failure probability",
    answer: "Estimated likelihood of asset failure.",
  },
  {
    question: "what is maintenance backlog",
    answer: "Accumulated pending maintenance tasks.",
  },
  {
    question: "what is service life",
    answer: "Expected usable lifespan of an asset.",
  },
  {
    question: "what is remaining useful life",
    answer: "Estimated remaining operational life before major intervention.",
  },

  // AUDIT / GOVERNANCE / COMPLIANCE
  {
    question: "what is cag",
    answer:
      "Comptroller and Auditor General of India is India's constitutional audit authority.",
  },
  {
    question: "what is audit trail",
    answer: "A traceable record of actions, approvals, and changes.",
  },
  {
    question: "what is compliance breach",
    answer:
      "Failure to meet contractual, statutory, or regulatory obligations.",
  },
  {
    question: "what is sla breach",
    answer: "Failure to complete an action within target timeline.",
  },
  {
    question: "what is accountability map",
    answer:
      "A view showing responsibility for decisions, approvals, and delays.",
  },
  {
    question: "what is governance risk",
    answer:
      "Risk arising from weak oversight, poor controls, or opaque decisions.",
  },
  {
    question: "what is audit readiness",
    answer: "Preparedness for review with complete traceable records.",
  },
  {
    question: "why was this package audit-flagged",
    answer: "Delay, cost, or quality issue.",
  },
  {
    question: "why did cag flag this project",
    answer: "Governance and value failure.",
  },
  { question: "why is compliance low", answer: "Weak enforcement." },
  {
    question: "why is governance weak",
    answer: "Poor controls and visibility.",
  },
  {
    question: "why is accountability unclear",
    answer: "Weak ownership mapping.",
  },
  { question: "why is audit risk high", answer: "Weak records and anomalies." },
  {
    question: "why is project under investigation",
    answer: "Audit or quality issue.",
  },
  { question: "why was package escalated", answer: "Risk or breach severity." },
  {
    question: "why is ministry review triggered",
    answer: "High public or financial impact.",
  },
  {
    question: "why are citizen complaints rising",
    answer: "Poor service quality.",
  },
  { question: "why is complaint sla breached", answer: "Slow response." },
  {
    question: "why is public trust low",
    answer: "Poor quality and repeated failures.",
  },
  {
    question: "why is road always under repair",
    answer: "Weak execution and maintenance.",
  },
  {
    question: "why is road worse after repair",
    answer: "Temporary patching and poor quality.",
  },
  { question: "why is public anger high", answer: "Toll with poor service." },
  {
    question: "why is this road accident-prone",
    answer: "Geometry and safety gaps.",
  },
  {
    question: "why are black spots unresolved",
    answer: "Slow corrective action.",
  },
  { question: "why is grievance closure slow", answer: "Weak accountability." },
  {
    question: "why are complaints recurring",
    answer: "Root cause unresolved.",
  },
  {
    question: "why is defect closure delayed",
    answer: "Contractor response lag.",
  },
  { question: "why is enforcement weak", answer: "Low oversight." },
  {
    question: "why is public escalation rising",
    answer: "Persistent service failure.",
  },
  {
    question: "why is media attention high",
    answer: "Visible failure and public impact.",
  },
  {
    question: "why is social sentiment negative",
    answer: "Repeated poor performance.",
  },
  {
    question: "why is escalation to ministry needed",
    answer: "High severity issue.",
  },
  {
    question: "why is audit transparency important",
    answer: "Public accountability.",
  },
  {
    question: "why is governance dashboard useful",
    answer: "Portfolio visibility.",
  },
  {
    question: "why is risk heatmap needed",
    answer: "Fast issue prioritization.",
  },
  { question: "why is executive summary needed", answer: "Decision support." },
  {
    question: "why is escalation matrix important",
    answer: "Faster accountability.",
  },
  { question: "why is owner mapping critical", answer: "Fix responsibility." },
  { question: "why is audit evidence needed", answer: "Supports decisions." },
  {
    question: "why is compliance scoring useful",
    answer: "Quantifies governance health.",
  },
  {
    question: "why is ministry oversight critical",
    answer: "Public asset accountability.",
  },
  {
    question: "why is citizen trust important",
    answer: "Legitimacy and adoption.",
  },
  {
    question: "why is defect recurrence dangerous",
    answer: "Signals systemic failure.",
  },
  {
    question: "why is governance scoring low",
    answer: "Delays and weak controls.",
  },
  {
    question: "why is project confidence low",
    answer: "Delay, defects, disputes.",
  },
  {
    question: "why is executive intervention needed",
    answer: "Risk too high.",
  },
  {
    question: "why is corrective action urgent",
    answer: "Prevents escalation.",
  },
  {
    question: "why is public infrastructure scrutiny high",
    answer: "High public impact.",
  },
  {
    question: "why is governance the final control layer",
    answer: "It determines accountability.",
  },

  // LAND / UTILITIES / CLEARANCES
  {
    question: "why is land acquisition delayed",
    answer: "Compensation and disputes.",
  },
  {
    question: "why are trees delaying work",
    answer: "Pending cutting permissions.",
  },
  { question: "why is forest clearance slow", answer: "Regulatory review." },
  {
    question: "why is environmental clearance delayed",
    answer: "Compliance and hearings.",
  },
  { question: "why is row blocked", answer: "Encroachment or pending land." },
  { question: "why are utilities still live", answer: "Pending relocation." },
  { question: "why is approval delayed", answer: "Review lag." },
  { question: "why is permit pending", answer: "Department backlog." },
  { question: "why is clearance high risk", answer: "Critical dependency." },
  { question: "why is land dispute critical", answer: "Blocks workfront." },
  { question: "why is encroachment risky", answer: "Access and legal delay." },
  { question: "why is utility clash common", answer: "Poor coordination." },
  {
    question: "why is service relocation slow",
    answer: "Vendor and permit delays.",
  },
  { question: "why is approval ownership unclear", answer: "Weak governance." },
  { question: "why is permit aging high", answer: "Slow closure." },
  { question: "why is approval sla breached", answer: "Delayed action." },
  { question: "why is land handover partial", answer: "Pending acquisition." },
  {
    question: "why are structures blocked",
    answer: "Land or utility conflict.",
  },
  { question: "why is workfront unavailable", answer: "Access pending." },
  { question: "why is crossing approval slow", answer: "Multi-agency review." },
  {
    question: "why is railway approval slow",
    answer: "Safety and design review.",
  },
  {
    question: "why is airport clearance needed",
    answer: "Height and safety control.",
  },
  { question: "why is utility map important", answer: "Avoid clashes." },
  {
    question: "why is underground utility risky",
    answer: "Hidden conflict risk.",
  },
  { question: "why is drainage approval needed", answer: "Discharge control." },
  { question: "why is shifting cost high", answer: "Utility complexity." },
  {
    question: "why is land compensation disputed",
    answer: "Valuation issues.",
  },
  { question: "why is resettlement sensitive", answer: "Social impact." },
  {
    question: "why is clearance sequencing important",
    answer: "Prevents delay chain.",
  },
  {
    question: "why is land status critical",
    answer: "Determines start readiness.",
  },
  { question: "why is access road pending", answer: "Land not available." },
  { question: "why is local approval delayed", answer: "Municipal backlog." },
  { question: "why is permit governance weak", answer: "No accountability." },
  { question: "why is utility dependency high", answer: "Execution blocked." },
  { question: "why is land risk high", answer: "Legal and social delays." },
  {
    question: "why is permit risk high",
    answer: "Schedule-critical dependency.",
  },
  { question: "why is approval visibility needed", answer: "Delay control." },
  {
    question: "why is clearance tracking important",
    answer: "Prevents slippage.",
  },
  { question: "why are approvals critical", answer: "They unlock execution." },
];

const FALLBACK =
  "I'm here to help with InfraOS. You can ask about tenders, delays, claims, approvals, vendors, governance, or asset intelligence. Type 'help' to see all options.";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[?!.,;:'"]/g, "")
    .replace(/\s+/g, " ");
}

export function getRuleBasedResponse(userInput: string): string {
  const normalized = normalize(userInput);

  if (!normalized || normalized.length < 1) return FALLBACK;

  // Step 1: Exact match
  for (const entry of QA_DATABASE) {
    const normQ = normalize(entry.question);
    if (normalized === normQ) return entry.answer;
  }

  // Step 2: Contains match — question inside input OR input inside question (only if > 3 chars)
  if (normalized.length > 3) {
    for (const entry of QA_DATABASE) {
      const normQ = normalize(entry.question);
      if (normQ.length > 3) {
        if (normalized.includes(normQ) || normQ.includes(normalized)) {
          return entry.answer;
        }
      }
    }
  }

  // Step 3: Word match — 3+ significant words (>3 chars) from input appear in the question
  const inputWords = normalized.split(" ").filter((w) => w.length > 3);
  if (inputWords.length >= 2) {
    let bestEntry: QAEntry | null = null;
    let bestCount = 0;
    for (const entry of QA_DATABASE) {
      const normQ = normalize(entry.question);
      const matchCount = inputWords.filter((w) => normQ.includes(w)).length;
      const threshold = inputWords.length >= 3 ? 3 : 2;
      if (matchCount >= threshold && matchCount > bestCount) {
        bestCount = matchCount;
        bestEntry = entry;
      }
    }
    if (bestEntry) return bestEntry.answer;
  }

  // Step 4: Partial word match — any 2 significant words match
  if (inputWords.length >= 1) {
    for (const entry of QA_DATABASE) {
      const normQ = normalize(entry.question);
      const matchCount = inputWords.filter((w) => normQ.includes(w)).length;
      if (matchCount >= 2) return entry.answer;
    }
  }

  return FALLBACK;
}

export default getRuleBasedResponse;

// Legacy type exports for backward compatibility
export interface ChatMessage {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}
export type ConversationMessage = ChatMessage;
