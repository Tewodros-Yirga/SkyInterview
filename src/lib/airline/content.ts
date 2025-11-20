export type AirlineQuiz = {
  question: string;
  answer: string;
};

export type AirlineDefinition = {
  term: string;
  definition: string;
};

export type AirlineTopic = {
  id: string;
  sectionId: string;
  title: string;
  intro: string;
  explanation: string[];
  realExamples: string[];
  definitions: AirlineDefinition[];
  misunderstandings: string[];
  practice: AirlineQuiz[];
  steps?: string[];
};

export type AirlineSection = {
  id: string;
  title: string;
  summary: string;
  topics: AirlineTopic[];
};

const makeTopic = (
  sectionId: string,
  id: string,
  data: Omit<AirlineTopic, "id" | "sectionId">,
): AirlineTopic => ({
  id,
  sectionId,
  ...data,
});

export const airlineSections: AirlineSection[] = [
  {
    id: "industry-intro",
    title: "Introduction to Airline Industry",
    summary: "Differentiate airlines from the broader aviation ecosystem and recognize every major business model.",
    topics: [
      makeTopic("industry-intro", "what-is-an-airline", {
        title: "What an Airline Is",
        intro: "An airline is a certificated commercial operator that sells transportation of passengers or cargo using aircraft.",
        explanation: [
          "Unlike general aviation, airlines follow strict commercial regulations, scheduled services, and corporate governance. They must hold an Air Operator Certificate (AOC) and meet economic licensing in their region.",
          "Airlines manage fleets, crews, schedules, sales, and customer service while coordinating with airports, air traffic services, and regulators.",
        ],
        realExamples: [
          "Ethiopian Airlines operates as a state-owned flag carrier with worldwide scheduled services and cargo divisions.",
          "Low-cost carriers like Ryanair focus on point-to-point, high-utilization models with simplified fleets.",
        ],
        definitions: [
          { term: "Air Operator Certificate (AOC)", definition: "Authorization issued by a civil aviation authority for commercial air transport operations." },
          { term: "Commercial Air Transport", definition: "Transport of passengers/cargo for remuneration on a published or charter basis." },
        ],
        misunderstandings: [
          "Confusing ‘airline’ with ‘aviation company’; not every aviation business sells scheduled transport.",
        ],
        practice: [
          { question: "What certificate must an airline hold to operate scheduled services?", answer: "An Air Operator Certificate issued by the national CAA." },
        ],
      }),
      makeTopic("industry-intro", "types-of-operations", {
        title: "Types of Airline Operations",
        intro: "Airlines operate under different commercial models depending on market, cost structure, and network strategy.",
        explanation: [
          "Full-service carriers offer multi-class cabins, global alliances, through-check services, and hub-and-spoke networks. They balance yield and service.",
          "Low-cost carriers emphasize single-class cabins, direct routes, and minimal extras to reduce unit cost.",
          "Cargo airlines focus on freight, often operating at night using dedicated freighters. Charter operators fly on-demand services for groups or seasonal traffic.",
        ],
        realExamples: [
          "Ethiopian’s passenger division is full-service, while Ethiopian Cargo operates a large African freighter network.",
          "TUI operates charter flights for leisure packages; Southwest Airlines is a classic LCC.",
        ],
        definitions: [
          { term: "Hub-and-Spoke", definition: "Network model where traffic flows through a central hub." },
          { term: "Point-to-Point", definition: "Direct services between city pairs without hub transfer." },
        ],
        misunderstandings: [
          "Assuming cargo airlines use only freighters; many full-service airlines belly-load cargo in passenger flights.",
        ],
        practice: [
          { question: "Name two advantages of a hub-and-spoke network.", answer: "Higher connectivity and better aircraft utilization." },
        ],
      }),
    ],
  },
  {
    id: "global-industry",
    title: "Global Airline Industry Knowledge",
    summary: "Master the organizations, alliances, and terminology that govern global airline operations.",
    topics: [
      makeTopic("global-industry", "international-organizations", {
        title: "International Organizations",
        intro: "Global safety and commercial standards are set by ICAO, IATA, FAA/EASA, and regional African bodies.",
        explanation: [
          "ICAO sets Standards and Recommended Practices (SARPs) adopted by member states. IATA harmonizes ticketing, safety audits, and commercial rules between airlines.",
          "FAA and EASA regulate operations in the US and EU respectively, influencing aircraft certification globally. African CAAs collaborate through AFCAC and AFRAA initiatives.",
        ],
        realExamples: [
          "Ethiopian Airlines follows ICAO Annexes while working with EASA for aircraft approvals and IATA for IOSA audits.",
          "FAA’s Part 121 rules inspired many global regulatory frameworks for airlines.",
        ],
        definitions: [
          { term: "ICAO Annex", definition: "Document containing standards on specific aviation domains." },
          { term: "IOSA", definition: "IATA Operational Safety Audit, a global airline audit program." },
        ],
        misunderstandings: [
          "Believing ICAO enforces regulations directly; enforcement is through national authorities.",
        ],
        practice: [
          { question: "What does IATA primarily focus on?", answer: "Airline commercial and operational standardization, including IOSA safety audits." },
        ],
      }),
      makeTopic("global-industry", "alliances", {
        title: "Airline Alliances",
        intro: "Star Alliance, Oneworld, and SkyTeam allow airlines to share networks and loyalty benefits.",
        explanation: [
          "Alliances coordinate schedules, code share, and share lounges. They improve connectivity and loyalty recognition.",
          "Code-sharing lets one airline sell seats on another’s flight using its code, expanding reach without operating aircraft.",
        ],
        realExamples: [
          "Ethiopian Airlines joined Star Alliance in 2011, offering seamless connections with Lufthansa, United, etc.",
          "Qantas (Oneworld) and Kenya Airways (SkyTeam) use alliances to feed traffic in their respective regions.",
        ],
        definitions: [
          { term: "Code Share", definition: "Agreement allowing one airline to market and sell seats operated by another." },
          { term: "Frequent Flyer Reciprocity", definition: "Benefit where miles/status earned on one airline are recognized across partners." },
        ],
        misunderstandings: [
          "Assuming alliances eliminate competition; member airlines still compete but cooperate for network efficiency.",
        ],
        practice: [
          { question: "Why do alliances exist from a passenger perspective?", answer: "Seamless connections, shared loyalty benefits, and integrated itineraries." },
        ],
      }),
      makeTopic("global-industry", "airline-glossary", {
        title: "Airline Glossary",
        intro: "Fluency with airline terms shows professionalism. Know the meaning of hub, sector, turnaround, ETOPS, MEL, etc.",
        explanation: [
          "Hub: central airport where flights connect. Spoke: the outstation connected to the hub. A sector or flight segment refers to one takeoff and landing pair.",
          "Turnaround: time from arrival to next departure. Load factor indicates seat occupancy. ETOPS defines extended-range twin-engine operations. MEL/CDL govern dispatch with inoperative items.",
        ],
        realExamples: [
          "Ethiopian’s primary hub is Addis Ababa Bole, with multiple spokes into Africa, Europe, and Asia.",
          "Dispatchers calculate block time (gate-to-gate) and ground time to schedule crews and maintenance.",
        ],
        definitions: [
          { term: "Load Factor", definition: "Percentage of available seats sold on a flight." },
          { term: "Block Time", definition: "Elapsed time from pushback to arrival at the gate." },
          { term: "Deadheading", definition: "Transportation of crew as passengers to reposition them for duty." },
          { term: "APU", definition: "Auxiliary Power Unit providing electrical/pneumatic power on the ground." },
        ],
        misunderstandings: [
          "Using ‘sector’ and ‘route’ interchangeably; a route may include multiple sectors.",
        ],
        practice: [
          { question: "Define turnaround time.", answer: "Time between aircraft block-in and next block-out, covering unloading, servicing, and boarding." },
          { question: "What does MEL stand for?", answer: "Minimum Equipment List." },
        ],
      }),
    ],
  },
  {
    id: "hierarchy",
    title: "Airline Hierarchy & Job Roles",
    summary: "Recognize each department’s responsibilities and pilot career path within large airlines.",
    topics: [
      makeTopic("hierarchy", "flight-department", {
        title: "Flight Department Roles",
        intro: "Flight crewing includes captain, first officer, second officer, and historically flight engineers.",
        explanation: [
          "Captains hold ultimate authority, managing safety, decision-making, and mentoring first officers. First officers share flying duties and step into command if needed.",
          "Second officers/relief pilots support long-haul flights, handling cruise segments. Flight engineers (older fleets) monitored systems before modern automation.",
        ],
        realExamples: [
          "On ultra-long-range trips, Ethiopian may roster a relief pilot to allow primary crew rest.",
          "Historic aircraft like Boeing 727 required a flight engineer seat.",
        ],
        definitions: [
          { term: "Pilot-in-Command (PIC)", definition: "Pilot responsible for operation and safety of the flight." },
          { term: "Relief Pilot", definition: "Additional pilot providing in-flight rest coverage on long sectors." },
        ],
        misunderstandings: [
          "Thinking first officers are trainees; they are fully rated and share legal responsibility.",
        ],
        practice: [
          { question: "Who signs the technical log and flight release?", answer: "The captain as PIC." },
        ],
      }),
      makeTopic("hierarchy", "ground-support", {
        title: "Ground & Support Departments",
        intro: "Airlines rely on OCC, dispatch, crew scheduling, maintenance, cabin service, safety, and QA teams.",
        explanation: [
          "Operations Control Center (OCC) monitors every flight, weather, and irregular operations. Dispatchers prepare flight plans and coordinate with pilots.",
          "Crew scheduling manages legal limits, rest, and assignments. Maintenance ensures airworthiness. Safety and QA monitor compliance and improvement.",
        ],
        realExamples: [
          "Ethiopian’s OCC in Addis monitors its global network, coordinating diversions or delay mitigation.",
          "Maintenance Control may issue MEL deferrals with time limits while awaiting parts.",
        ],
        definitions: [
          { term: "OCC", definition: "Operations Control Center overseeing day-to-day flight execution." },
          { term: "Crew Scheduling", definition: "Department assigning pilots and cabin crew while respecting duty limits." },
        ],
        misunderstandings: [
          "Assuming dispatch decisions override captains; authority is shared but PIC has final say on safety.",
        ],
        practice: [
          { question: "Who manages reroutes due to weather changes mid-flight?", answer: "Dispatch/OCC in coordination with the flight crew." },
        ],
      }),
      makeTopic("hierarchy", "career-progression", {
        title: "Crew Career Progression",
        intro: "Pilots progress from cadet to captain, then into training or management roles.",
        explanation: [
          "Cadets undergo ab-initio training, becoming Junior First Officers upon type-rating. After experience and line checks they upgrade to Senior First Officer and eventually Captain.",
          "Leadership paths include Training Captain, Fleet Manager, and Chief Pilot overseeing standardization, safety, and crew performance.",
        ],
        realExamples: [
          "Ethiopian Aviation University pipelines cadets directly into the airline, with structured upgrade programs.",
          "Training captains conduct line checks and mentor new entrants on company SOPs.",
        ],
        definitions: [
          { term: "Line Check", definition: "Evaluation performed during regular line flights to ensure SOP compliance." },
          { term: "Type Rating", definition: "Certification to operate a specific aircraft type." },
        ],
        misunderstandings: [
          "Believing upgrade is purely seniority; performance, exams, and availability also play roles.",
        ],
        practice: [
          { question: "After becoming captain, what roles can pilots aspire to?", answer: "Training captain, examiner, fleet manager, chief pilot, operations manager." },
        ],
      }),
    ],
  },
  {
    id: "operations",
    title: "Core Airline Operations",
    summary: "Master the full flight operations cycle, dispatch responsibility, and core operational concepts.",
    topics: [
      makeTopic("operations", "flight-operations-cycle", {
        title: "Flight Operations Cycle",
        intro: "Each flight follows a repeatable cycle from crew assignment to post-flight reports.",
        explanation: [
          "Crew assignment ensures qualified pilots/cabin crew with legal rest. Flight planning calculates route, altitude, fuel, payload, and alternates.",
          "On the day: crew arrives, reviews weather/NOTAMs, conducts briefing, walks around the aircraft, and prepares cockpit. Turnaround includes deplaning/boarding, fueling, catering, and checks. After landing, crews complete post-flight reports and maintenance log entries.",
        ],
        steps: [
          "Crew scheduling issues roster.",
          "Dispatch prepares flight release package.",
          "Crew briefing (MET, NOTAM, MEL, threats).",
          "Aircraft turnaround (ground handling).",
          "Taxi, takeoff, enroute monitoring.",
          "Descent, approach, landing.",
          "Post-flight paperwork and debrief.",
        ],
        realExamples: [
          "Ethiopian’s OCC issues electronic flight bags (EFB) packages to crews for review before reporting.",
          "Post-flight technical log entries note MEL items for maintenance planning.",
        ],
        definitions: [
          { term: "Flight Release", definition: "Document jointly signed by captain and dispatcher authorizing a flight." },
          { term: "Turnaround", definition: "Ground time to service aircraft between flights." },
        ],
        misunderstandings: [
          "Skipping thorough briefings because ‘route is familiar’; every flight can contain new threats.",
        ],
        practice: [
          { question: "List three items discussed in a crew briefing.", answer: "Weather, NOTAMs, MEL/CDL status, fuel plan, threats, alternates." },
        ],
      }),
      makeTopic("operations", "aircraft-dispatch", {
        title: "Aircraft Dispatch",
        intro: "Dispatchers and captains jointly ensure each flight is airworthy, properly planned, and legally released.",
        explanation: [
          "Dispatch reviews weather, routes, NOTAMs, payload, and MEL items to prepare a flight plan. The captain reviews and either accepts or requests changes before signing the release.",
          "In many jurisdictions (including Ethiopia), operational control is shared; dispatch can recommend diversion, but PIC decides in-flight while coordinating with OCC.",
        ],
        steps: [
          "Collect weather/NOTAM data.",
          "Compute route, altitude, and fuel.",
          "Check MEL/CDL impact.",
          "Generate release package.",
          "Captain reviews and signs.",
        ],
        realExamples: [
          "ETOPS flights require dispatch to ensure enroute alternates are within ETOPS time and have required facilities.",
          "If weather deteriorates below minima, dispatch will update alternates or delay the release.",
        ],
        definitions: [
          { term: "Operational Control", definition: "Authority over initiating, conducting, and terminating a flight." },
        ],
        misunderstandings: [
          "Thinking dispatch can overrule a captain; final in-flight authority remains with PIC.",
        ],
        practice: [
          { question: "Who signs the flight release?", answer: "Both the dispatcher (operator representative) and the captain." },
        ],
      }),
      makeTopic("operations", "operational-control-concepts", {
        title: "Operational Control Concepts",
        intro: "Fuel planning, route selection, ETOPS, and alternate planning keep flights safe and efficient.",
        explanation: [
          "Fuel planning covers taxi, trip, contingency, alternate, and final reserve. Route selection considers winds, airspace restrictions, and cost index.",
          "ETOPS planning ensures twin-engine aircraft remain within approved diversion time from suitable alternates. Alternates must meet weather minima and services.",
        ],
        realExamples: [
          "Ethiopian’s transatlantic flights plan ETOPS alternates in Africa and South America depending on route track.",
          "Dispatch may choose a more southerly route to avoid jetstream headwinds even if distance increases.",
        ],
        definitions: [
          { term: "Contingency Fuel", definition: "Additional fuel to account for unforeseen conditions, typically a percentage of trip fuel." },
          { term: "Alternate Airport", definition: "Designated airport to use if landing at destination becomes unsafe or impossible." },
        ],
        misunderstandings: [
          "Misreading ETOPS as ‘engine failure guarantee’; it simply ensures adequate planning and equipment reliability.",
        ],
        practice: [
          { question: "List five fuel components in an ICAO fuel plan.", answer: "Taxi, trip, contingency, alternate, final reserve (and additional if required)." },
        ],
      }),
      makeTopic("operations", "mel-cdl", {
        title: "MEL vs CDL",
        intro: "The Minimum Equipment List (MEL) and Configuration Deviation List (CDL) govern dispatch with inoperative equipment or missing components.",
        explanation: [
          "MEL lists systems that may be inoperative for dispatch, with limitations and repair intervals. CDL lists allowable external component deviations (e.g., missing fairings).",
          "Dispatch and captain ensure compliance; if an item isn’t listed or conditions can’t be met, the aircraft is grounded.",
        ],
        realExamples: [
          "If an APU is MEL’d inoperative, dispatch ensures ground power/air start is available at departure and destination.",
          "CDL may permit missing vortex generator with performance penalty noted in release.",
        ],
        definitions: [
          { term: "MEL Category", definition: "Defines repair time limit (A/B/C/D) for rectifying the defect." },
        ],
        misunderstandings: [
          "Thinking MEL grants blanket permission; limitations (e.g., no icing, weight penalties) must be respected.",
        ],
        practice: [
          { question: "What list governs missing external components like access panels?", answer: "The Configuration Deviation List (CDL)." },
        ],
      }),
      makeTopic("operations", "crm", {
        title: "Crew Resource Management",
        intro: "CRM underpins safe airline operations with teamwork, communication, and workload management.",
        explanation: [
          "CRM training teaches assertiveness, conflict resolution, leadership, decision-making, and situational awareness. It complements technical proficiency.",
          "Airlines embed CRM in SOPs—callouts, briefings, feedback loops—to prevent errors.",
        ],
        realExamples: [
          "Ethiopian’s CRM emphasizes cross-cockpit communication, especially in multi-cultural crews.",
          "Go-around decisions triggered by monitoring pilots reflect healthy CRM culture.",
        ],
        definitions: [
          { term: "Situational Awareness", definition: "Perception of elements in the environment, comprehension of their meaning, and projection of future status." },
        ],
        misunderstandings: [
          "Confusing CRM with mere politeness; it’s a structured behavioral competency.",
        ],
        practice: [
          { question: "Give an example of a CRM technique that prevents errors.", answer: "Challenge-and-response checklists, standardized callouts, assertive communication." },
        ],
      }),
      makeTopic("operations", "sop", {
        title: "Standard Operating Procedures (SOP)",
        intro: "SOPs standardize normal, abnormal, and emergency operations to ensure predictable crew performance.",
        explanation: [
          "SOPs define checklists, flows, briefings, callouts, and handling of abnormal events. They are based on manufacturer guidance, regulatory requirements, and company safety philosophy.",
          "Consistency allows crews to interchange without confusion and supports automation and CRM.",
        ],
        realExamples: [
          "Ethiopian’s SOP defines stabilized approach criteria, after-takeoff flows, and callout phrasing like '1000 stable'.",
          "Abnormal checklists follow Airbus ECAM logic or Boeing QRH procedures tailored to company policy.",
        ],
        definitions: [
          { term: "Flow Pattern", definition: "Sequential cockpit scan to configure switches before running a checklist." },
        ],
        misunderstandings: [
          "Treating SOPs as optional; deviations require formal approval and strong justification.",
        ],
        practice: [
          { question: "Why do airlines insist on identical checklist phraseology?", answer: "To prevent ambiguity and ensure both pilots have the same understanding." },
        ],
      }),
    ],
  },
  {
    id: "safety-management",
    title: "Safety Management",
    summary: "SMS, TEM, and reporting culture drive modern airline safety beyond compliance.",
    topics: [
      makeTopic("safety-management", "sms", {
        title: "Safety Management System (SMS)",
        intro: "SMS is a proactive approach built on policy, risk management, assurance, and promotion.",
        explanation: [
          "Safety policy defines leadership commitment. Risk management identifies hazards and assesses risk. Safety assurance monitors performance through audits and data. Safety promotion trains staff and communicates lessons.",
          "ICAO Annex 19 requires airlines to implement SMS integrated with their operations.",
        ],
        realExamples: [
          "Ethiopian’s SMS collects data from flight operations quality assurance (FOQA) and maintenance reliability programs.",
          "Safety committees review hazard logs and assign mitigation actions.",
        ],
        definitions: [
          { term: "Hazard", definition: "Condition that could lead to an undesired event." },
          { term: "Mitigation", definition: "Action taken to reduce risk to acceptable levels." },
        ],
        misunderstandings: [
          "Seeing SMS as paperwork; it should influence daily operational decisions.",
        ],
        practice: [
          { question: "Name the four pillars of SMS.", answer: "Safety policy, risk management, safety assurance, safety promotion." },
        ],
      }),
      makeTopic("safety-management", "tem", {
        title: "Threat & Error Management (TEM)",
        intro: "TEM complements SMS by focusing on frontline operations.",
        explanation: [
          "Threats are external elements like weather or ATC changes. Errors are pilot actions/inactions. If not trapped, they create undesired aircraft states, which must be corrected before becoming incidents.",
        ],
        realExamples: [
          "Briefings identify forecast CBs as threats; pilots plan deviations. Failure to arm spoilers is an error that can lead to long landing (undesired state).",
        ],
        definitions: [
          { term: "Undesired Aircraft State", definition: "A condition where aircraft parameters deviate from safe limits." },
        ],
        misunderstandings: [
          "Believing error-free flying is realistic; TEM accepts humans err but prompts early detection/correction.",
        ],
        practice: [
          { question: "What should pilots do when an undesired aircraft state occurs?", answer: "Take immediate corrective action (e.g., go-around) to restore safe flight parameters." },
        ],
      }),
      makeTopic("safety-management", "reporting-culture", {
        title: "Safety Reporting Culture",
        intro: "A just culture encourages voluntary reporting without fear, enabling continuous improvement.",
        explanation: [
          "Just culture balances accountability with learning. Reports feed into databases, de-identified for trend analysis. Voluntary reporting systems like ASAP/ASR allow frontline staff to share hazards.",
        ],
        realExamples: [
          "Ethiopian pilots file ASRs for unstable approaches or ATC conflicts; safety analyzes them for systemic fixes.",
          "Cabin crew submit reports about service or safety deviations which feed into training updates.",
        ],
        definitions: [
          { term: "Just Culture", definition: "Environment where individuals are not punished for honest mistakes but are accountable for gross negligence." },
        ],
        misunderstandings: [
          "Assuming reports lead to discipline; in a just culture, they lead to system improvements.",
        ],
        practice: [
          { question: "Why is confidentiality important in safety reporting?", answer: "It encourages more honest and frequent reporting." },
        ],
      }),
    ],
  },
  {
    id: "regulatory",
    title: "Regulatory Requirements",
    summary: "Know licensing, medical, and duty regulations governing airline pilots.",
    topics: [
      makeTopic("regulatory", "pilot-licences", {
        title: "Pilot Licences & Ratings",
        intro: "Airline pilots progress from PPL to CPL/ATPL with instrument, multi-engine, and type ratings.",
        explanation: [
          "PPL allows private flying, CPL permits commercial operations, ATPL is required to command airline aircraft. MPL integrates multi-crew training. Ratings add privileges like instrument or type ratings.",
        ],
        realExamples: [
          "Ethiopian Aviation University cadets graduate with MPL directly onto multi-crew jets.",
          "Upgrading to a new aircraft requires a type rating course with simulator and line training.",
        ],
        definitions: [
          { term: "ATPL", definition: "Airline Transport Pilot Licence, highest pilot certification level." },
          { term: "Type Rating", definition: "Endorsement for specific aircraft type requiring dedicated training." },
        ],
        misunderstandings: [
          "Thinking MPL is inferior; it is tailored for multi-crew airline environments but limited to approved operators.",
        ],
        practice: [
          { question: "Which licence is required to act as captain in airline operations?", answer: "ATPL (or MPL with restrictions until experience built)." },
        ],
      }),
      makeTopic("regulatory", "medical-requirements", {
        title: "Medical Requirements",
        intro: "Class 1 medicals ensure pilots meet stringent health standards for commercial operations.",
        explanation: [
          "Class 1 covers vision (including color), hearing, cardiovascular health, BMI, mental health, and screenings for conditions that could impair safety. Class 2 applies to private pilots.",
          "Regular intervals depend on age (e.g., annual or biannual). Significant findings may require special issuance or grounding.",
        ],
        realExamples: [
          "Airline pilots undergo ECGs, eye exams, and psychological assessments as part of periodic renewal.",
          "If a pilot develops hypertension, the AME may issue restrictions pending treatment.",
        ],
        definitions: [
          { term: "AME", definition: "Aviation Medical Examiner authorized to issue pilot medical certificates." },
        ],
        misunderstandings: [
          "Believing minor issues automatically end careers; many conditions can be managed with monitoring.",
        ],
        practice: [
          { question: "Why is color vision important for pilots?", answer: "To interpret signals, displays, and runway lights correctly." },
        ],
      }),
      makeTopic("regulatory", "duty-rest", {
        title: "Duty Time & Rest",
        intro: "Flight time limitations prevent fatigue by limiting duty periods and mandating rest.",
        explanation: [
          "Regulations specify maximum duty hours, flight hours per day/week/month, and minimum rest between duties. Augmented crews extend limits for ultra-long-haul flights.",
          "Operators must track compliance and manage fatigue reports.",
        ],
        realExamples: [
          "Ethiopian schedules augmented crews for flights exceeding 12 hours block time.",
          "Fatigue risk management programs (FRMS) may allow flexibility but require data support.",
        ],
        definitions: [
          { term: "Flight Duty Period (FDP)", definition: "Time from reporting for duty until release after the flight or series of flights." },
          { term: "Rest Period", definition: "Continuous time free from duty with opportunity for sleep." },
        ],
        misunderstandings: [
          "Assuming FRMS replaces regulations; it supplements them with data-driven approvals.",
        ],
        practice: [
          { question: "Why must rest periods be free from work obligations?", answer: "To allow genuine recovery and prevent cumulative fatigue." },
        ],
      }),
    ],
  },
  {
    id: "ethiopian-airlines",
    title: "Ethiopian Airlines Focus",
    summary: "Become an expert on Ethiopia’s flag carrier—history, fleet, academy, and achievements.",
    topics: [
      makeTopic("ethiopian-airlines", "overview", {
        title: "Company Overview",
        intro: "Founded in 1945, Ethiopian Airlines (ET) is Africa’s largest and most profitable carrier.",
        explanation: [
          "Headquarters: Addis Ababa. Hub: Bole International Airport. Member of Star Alliance. State-owned, with subsidiaries in cargo, MRO, and training.",
          "Operates an extensive network linking Africa with Europe, Asia, Americas, and Middle East.",
        ],
        realExamples: [
          "ET operates 125+ destinations and a fleet including Boeing 787, 777, 737 MAX, Airbus A350, and De Havilland Q400.",
        ],
        definitions: [
          { term: "Flag Carrier", definition: "State-owned or state-backed airline representing the country internationally." },
        ],
        misunderstandings: [
          "Underestimating ET’s scale; it rivals major global carriers in network breadth.",
        ],
        practice: [
          { question: "Which alliance is Ethiopian Airlines part of?", answer: "Star Alliance." },
        ],
      }),
      makeTopic("ethiopian-airlines", "mission-vision", {
        title: "Mission, Vision & Values",
        intro: "ET aims to be the leading aviation group in Africa with customer-centric service and pan-African pride.",
        explanation: [
          "Mission emphasizes safe, reliable, and profitable operations, developing Ethiopian and African aviation.",
          "Values include safety, customer focus, excellence, integrity, teamwork, and continuous learning.",
        ],
        realExamples: [
          "Strategic plan ‘Vision 2035’ includes expanding cargo, MRO, and training to serve the continent.",
        ],
        definitions: [
          { term: "Vision 2035", definition: "Ethiopian’s long-term strategy for growth and diversification." },
        ],
        misunderstandings: [
          "Thinking mission statements are marketing only; airlines embed them into KPIs and training.",
        ],
        practice: [
          { question: "What is a key pillar of Ethiopian’s mission?", answer: "Becoming Africa’s aviation leader while delivering safe, customer-focused services." },
        ],
      }),
      makeTopic("ethiopian-airlines", "fleet", {
        title: "Fleet Information",
        intro: "Ethiopian operates one of Africa’s youngest fleets, blending Boeing, Airbus, and turboprop aircraft.",
        explanation: [
          "Historic fleet included DC-3, Boeing 720/707 pioneers. Current fleet: B737NG/MAX, B777 (F/C), B787, A350, Q400, and cargo 777F/767-300BCF.",
          "Fleet planning balances range, payload, and maintenance commonality.",
        ],
        realExamples: [
          "ET was the first African carrier to operate the Boeing 787 Dreamliner and Airbus A350 simultaneously.",
        ],
        definitions: [
          { term: "Fleet Planning", definition: "Strategic selection of aircraft types to match network requirements." },
        ],
        misunderstandings: [
          "Assuming older aircraft remain; ET continuously retires and acquires to stay modern.",
        ],
        practice: [
          { question: "Name two widebody types Ethiopian currently operates.", answer: "Boeing 787, Boeing 777, Airbus A350." },
        ],
      }),
      makeTopic("ethiopian-airlines", "academy", {
        title: "Training Academy",
        intro: "Ethiopian Aviation University trains pilots, cabin crew, technicians, and managers.",
        explanation: [
          "Facilities include flight simulators, engineering labs, dispatch training, and leadership development. The academy supplies personnel for ET and regional carriers.",
        ],
        realExamples: [
          "Many African airlines partner with ET for pilot and MRO training.",
        ],
        definitions: [
          { term: "Ab-initio", definition: "Training from zero flight experience to commercial level." },
        ],
        misunderstandings: [
          "Thinking ET relies on expatriate pilots; the academy produces large domestic talent pools.",
        ],
        practice: [
          { question: "What disciplines does the Ethiopian Aviation Academy cover?", answer: "Pilots, cabin crew, aircraft maintenance, dispatch, management." },
        ],
      }),
      makeTopic("ethiopian-airlines", "awards-milestones", {
        title: "Awards & Milestones",
        intro: "Ethiopian has repeatedly been named ‘Best Airline in Africa’ and holds numerous firsts.",
        explanation: [
          "Achievements: first African jet operator, largest cargo fleet in Africa, Star Alliance membership, and global training center recognition.",
          "Awards from Skytrax, African Airlines Association, and industry magazines confirm consistent performance.",
        ],
        realExamples: [
          "Ethiopian Cargo is Africa’s largest cargo network with dedicated B777 freighters.",
        ],
        definitions: [
          { term: "Skytrax", definition: "International airline rating organization awarding performance categories." },
        ],
        misunderstandings: [
          "Assuming awards are PR only; they reflect audited customer feedback and operational metrics.",
        ],
        practice: [
          { question: "Name one recent Ethiopian Airlines accolade.", answer: "Best Airline in Africa (multiple years), Best Cargo Airline in Africa, etc." },
        ],
      }),
      makeTopic("ethiopian-airlines", "challenges-cases", {
        title: "Challenges & Case Studies",
        intro: "Airlines face economic, political, and operational challenges requiring resilience.",
        explanation: [
          "Ethiopian navigated currency fluctuations, competitive pressure, and the global spotlight after accidents. Fleet modernization and diversification helped maintain profitability.",
          "Case studies highlight response to ET302 accident—grounding MAX fleet, enhancing safety oversight, and supporting families while working with regulators.",
        ],
        realExamples: [
          "Rapid conversion of passenger aircraft to cargo-only during COVID kept revenue flowing.",
        ],
        definitions: [
          { term: "Crisis Response", definition: "Coordinated actions to manage incidents, including communication and operational adjustments." },
        ],
        misunderstandings: [
          "Believing state ownership shields airlines from market forces; ET still competes globally.",
        ],
        practice: [
          { question: "How did Ethiopian leverage cargo operations during downturns?", answer: "Reconfigured passenger aircraft, expanded freighter routes, sustaining revenue." },
        ],
      }),
    ],
  },
  {
    id: "passenger-ground",
    title: "Passenger Handling & Ground Ops",
    summary: "Airport processes and customer metrics reflect an airline’s reliability.",
    topics: [
      makeTopic("passenger-ground", "airport-flow", {
        title: "Airport Flow",
        intro: "Check-in, security, boarding, ramp, and on-time departure require synchronized teams.",
        explanation: [
          "Passengers move through check-in (counter or self-service), baggage drop, security, immigration, and boarding gates. On the ramp, ground handlers load bags, fuel, and cater while coordinating pushback.",
        ],
        steps: [
          "Check-in/Document verification.",
          "Security/Immigration.",
          "Gate boarding.",
          "Ramp turnaround (fuel, catering, cleaning).",
          "Pushback and taxi approval.",
        ],
        realExamples: [
          "Ethiopian uses advanced scanning at Addis to streamline transfer passengers.",
        ],
        definitions: [
          { term: "On-Time Departure (D0)", definition: "Percentage of flights departing at scheduled time or within a tolerance (e.g., 0 or 15 minutes)." },
        ],
        misunderstandings:
          [
            "Assuming ramp delays are always airline fault; airport congestion or ATC slots also contribute."
          ],
        practice: [
          { question: "List two critical ramp safety considerations.", answer: "Jet blast avoidance, proper marshalling, GSE positioning, chocks before engine shutdown." },
        ],
      }),
      makeTopic("passenger-ground", "customer-metrics", {
        title: "Customer Service Metrics",
        intro: "Airlines track punctuality, baggage handling, complaints, and service-level agreements (SLAs).",
        explanation: [
          "On-time performance (OTP) is a key KPI. Baggage mishandling rates measure lost/delayed bags. Complaints feed into service recovery programs. SLAs with airports or partners define acceptable response times.",
        ],
        realExamples: [
          "Ethiopian invests in baggage scanners and centralized operations to maintain high OTP despite hub congestion.",
        ],
        definitions: [
          { term: "SLA", definition: "Service Level Agreement specifying performance targets between partners." },
          { term: "Net Promoter Score (NPS)", definition: "Metric measuring passenger loyalty and recommendation likelihood." },
        ],
        misunderstandings: [
          "Thinking OTP alone defines service quality; airlines balance punctuality with passenger care, safety, and cost.",
        ],
        practice: [
          { question: "How can an airline reduce baggage mishandling?", answer: "Invest in tracking (RFID), streamline transfers, ensure accurate load control." },
        ],
      }),
    ],
  },
  {
    id: "security",
    title: "Aviation Security",
    summary: "Security protects passengers, crew, and assets from unlawful interference.",
    topics: [
      makeTopic("security", "security-programs", {
        title: "Security Programs & Annex 17",
        intro: "ICAO Annex 17 mandates state and operator security programs covering screening, access control, and response.",
        explanation: [
          "Airlines coordinate with airport authorities for passenger/baggage screening, cargo security, background checks, and access control to restricted areas.",
          "Security plans outline measures for hijacking prevention, bomb threats, and cyber protection.",
        ],
        realExamples: [
          "Post-9/11, airlines implemented hardened cockpit doors and reinforced crew training.",
        ],
        definitions: [
          { term: "Annex 17", definition: "ICAO annex covering security safeguarding civil aviation." },
          { term: "Unlawful Interference", definition: "Acts like hijacking, sabotage, or bomb threats against aviation." },
        ],
        misunderstandings: [
          "Assuming security is solely airport’s job; airlines manage crew vetting, cargo screening, and onboard procedures.",
        ],
        practice: [
          { question: "Why must crew display ID in secure areas?", answer: "To verify authorization and prevent unauthorized access." },
        ],
      }),
    ],
  },
  {
    id: "finance",
    title: "Airline Finance & Economics",
    summary: "Advanced module covering revenue, costs, and yield management.",
    topics: [
      makeTopic("finance", "revenue-streams", {
        title: "Revenue Streams",
        intro: "Airlines earn revenue from passengers, cargo, charters, and ancillary services.",
        explanation: [
          "Ancillary revenue includes baggage fees, seat selection, onboard sales, loyalty program partnerships, and co-branded credit cards.",
        ],
        realExamples: [
          "Ethiopian’s cargo division contributes significant revenue diversification; loyalty program ShebaMiles partners with banks.",
        ],
        definitions: [
          { term: "Ancillary Revenue", definition: "Non-ticket income from services beyond base fares." },
        ],
        misunderstandings: [
          "Assuming only LCCs rely on ancillaries; full-service airlines also monetize upgrades, lounge access, and loyalty program currency.",
        ],
        practice: [
          { question: "Name two non-passenger revenue sources for airlines.", answer: "Cargo, charters, loyalty program partnerships, maintenance services." },
        ],
      }),
      makeTopic("finance", "cost-structure", {
        title: "Cost Structure & Yield Management",
        intro: "Fuel, maintenance, crew, and airport fees dominate airline costs. Yield management maximizes revenue per seat.",
        explanation: [
          "Unit revenue (RASK) and unit cost (CASK) metrics gauge profitability. Yield management adjusts fares based on demand and booking curves.",
        ],
        realExamples: [
          "Ethiopian uses cost index to balance speed vs fuel burn. Fuel hedging protects against price spikes.",
        ],
        definitions: [
          { term: "Yield", definition: "Average fare per passenger kilometer." },
          { term: "GDS", definition: "Global Distribution System (Amadeus, Sabre) distributing fares and inventory." },
        ],
        misunderstandings: [
          "Believing cheaper fares always mean low profits; yield management can fill seats while protecting premium cabins.",
        ],
        practice: [
          { question: "What does CASK stand for?", answer: "Cost per Available Seat Kilometer." },
        ],
      }),
    ],
  },
  {
    id: "career-knowledge",
    title: "Airline Interview & Career Knowledge",
    summary: "Prepare for behavioral and technical questions about airline life.",
    topics: [
      makeTopic("career-knowledge", "pilot-qualities", {
        title: "Qualities of a Good Airline Pilot",
        intro: "Airlines value leadership, calm decision-making, teamwork, and safety mindset.",
        explanation: [
          "Pilots must demonstrate professionalism, cultural awareness, and resilience under pressure. Decision-making combines SOP knowledge with judgment.",
        ],
        realExamples: [
          "During irregular ops, a good pilot communicates clearly with crew, passengers, and OCC while managing workload.",
        ],
        definitions: [
          { term: "Leadership", definition: "Ability to guide the crew towards safe, efficient outcomes while listening to input." },
        ],
        misunderstandings: [
          "Thinking technical skills alone secure jobs; airlines evaluate soft skills heavily.",
        ],
        practice: [
          { question: "Describe a time you demonstrated leadership during a stressful scenario.", answer: "Use STAR format—Situation, Task, Action, Result." },
        ],
      }),
      makeTopic("career-knowledge", "interview-questions", {
        title: "Typical Interview Questions",
        intro: "Prepare for ‘Why this airline?’, ‘Why pilot?’, failure stories, and knowledge of company specifics.",
        explanation: [
          "Structured answers reference airline mission, fleet, and achievements. Behavioral questions use STAR method. Technical questions cover CRM, TEM, and company knowledge.",
        ],
        realExamples: [
          "ET interview panels expect candidates to discuss Vision 2035, fleet modernization, and African leadership initiatives.",
        ],
        definitions: [
          { term: "STAR Technique", definition: "Method to structure responses: Situation, Task, Action, Result." },
        ],
        misunderstandings: [
          "Reciting generic answers; interviewers want specific alignment with their airline.",
        ],
        practice: [
          { question: "Why do you want to join Ethiopian Airlines?", answer: "Craft a personal response referencing mission, growth, and cultural fit." },
        ],
      }),
    ],
  },
];

export const airlineTopics = airlineSections.flatMap((section) => section.topics);

export function getAirlineTopic(slug: string) {
  return airlineTopics.find((topic) => topic.id === slug);
}

export function getAirlineSectionById(sectionId: string) {
  return airlineSections.find((section) => section.id === sectionId);
}

