import { PSP_LOGO_URL, placeholderCover, placeholderLogo, placeholderProfile } from "../utils/assets.js";

export const sectionLabels = {
  coverImage: "Cover image",
  roleAtGlance: "Role at a glance",
  aboutCouncil: "About the council",
  whyJoin: "Why join the council",
  workingWithCouncil: "Working with the council",
  aboutOpportunity: "About the opportunity",
  currentPriorities: "Current priorities",
  keyResponsibilities: "Key responsibilities",
  aboutYou: "About you",
  requirements: "Requirements",
  keyExperience: "Key experience",
  leadershipCapabilities: "Leadership capabilities",
  whyUnique: "Why this role is unique",
  benefits: "Benefits",
  applicationProcess: "Application process",
  consultantBio: "Consultant bio",
  consultantProfileImage: "Consultant profile picture",
  closingStatement: "Closing statement",
};

export const textSections = [
  "aboutOpportunity",
  "currentPriorities",
  "keyResponsibilities",
  "aboutCouncil",
  "whyJoin",
  "workingWithCouncil",
  "benefits",
  "aboutYou",
  "requirements",
  "keyExperience",
  "leadershipCapabilities",
  "whyUnique",
  "applicationProcess",
  "closingStatement",
];

export const initialPack = {
  basics: {
    councilName: "Sunshine Coast Council",
    jobTitle: "Manager Waste Operations",
    monthYear: new Intl.DateTimeFormat("en-AU", { month: "long", year: "numeric" }).format(new Date()),
    councilLogo: placeholderLogo,
    pspLogo: PSP_LOGO_URL,
    coverImage: placeholderCover,
    shortSummary:
      "A senior leadership opportunity to lead essential waste services, operational performance and sustainability outcomes across one of Australia's fastest-growing and most environmentally significant regions.",
  },
  consultant: {
    name: "Alex Morgan",
    title: "Principal Consultant - Public Sector People",
    email: "alex.morgan@publicsectorpeople.com.au",
    phone: "0400 000 000",
    bio:
      "Alex partners with councils and public sector organisations across Australia to appoint senior operational, technical and executive leaders. The process will be handled with discretion, clarity and close communication.",
    profileImage: placeholderProfile,
  },
  sections: {
    coverImage: { enabled: true },
    roleAtGlance: {
      enabled: true,
      fields: [
        { label: "Position", value: "Manager Waste Operations" },
        { label: "Organisation", value: "Sunshine Coast Council" },
        { label: "Directorate", value: "Infrastructure and Natural Assets" },
        { label: "Branch", value: "Waste Operations Management" },
        { label: "Reports to", value: "Director Infrastructure and Natural Assets" },
        { label: "Employment type", value: "Full Time | Non-Award Contract" },
      ],
    },
    aboutCouncil: {
      enabled: true,
      content:
        "Sunshine Coast Council serves one of South-East Queensland's most distinctive regions, combining strong community identity, economic momentum and an internationally recognised natural environment.\n\nCouncil's Corporate Plan sets a clear vision: Australia's most sustainable region. Connected. Liveable. Thriving. Every role contributes to strong community, environment and liveability, resilient economy, growth and organisational excellence.",
    },
    whyJoin: {
      enabled: true,
      content:
        "People at our heart: A values-led workplace with a strong commitment to wellbeing, health and safety, diversity and inclusion.\nSustainability in action: A region globally recognised for balancing responsible development, sustainable living and active conservation.\nGrowth and opportunity: One of Australia's largest regional economies, positioned for continued investment and community growth.",
    },
    workingWithCouncil: {
      enabled: true,
      content:
        "This role works across multi-disciplinary operational teams, strategic planning functions, contractors, community partners and senior leadership. The successful candidate will balance daily service reliability with the longer-term infrastructure, commercial and sustainability decisions that shape the region.",
    },
    aboutOpportunity: {
      enabled: true,
      content:
        "Public Sector People is partnering with Council to appoint a Manager Waste Operations.\n\nThis pivotal leadership role is responsible for delivering safe, reliable and sustainable waste collection, diversion, recovery and disposal services. The successful candidate will provide operational leadership while influencing long-term planning, infrastructure investment, waste strategy and service optimisation.",
    },
    currentPriorities: {
      enabled: true,
      content:
        "Stabilise day-to-day operating performance across essential waste services.\nStrengthen contract governance, commercial controls and service reporting.\nTranslate operational insights into infrastructure planning and capital priorities.\nBuild team capability, accountability and a culture of safe service delivery.",
    },
    keyResponsibilities: {
      enabled: true,
      content:
        "Strategic leadership: Contribute to Directorate senior leadership, priorities and cross-directorate collaboration.\nOperational performance: Lead reliable waste collection, diversion, recovery and disposal services.\nCommercial and financial management: Oversee operational and capital budgets with strong accountability.\nCommunity outcomes: Lead community engagement and waste education programs.\nGovernance and compliance: Ensure compliance with legislation, Council policy and governance standards.",
    },
    aboutYou: {
      enabled: true,
      content:
        "You are a calm, commercially astute operational leader who can bring structure, confidence and momentum to complex service environments. You combine a practical understanding of frontline delivery with the ability to influence strategy, investment and stakeholder outcomes.",
    },
    requirements: {
      enabled: true,
      content:
        "Senior operational leadership experience in waste, infrastructure, utilities, logistics, environmental services or a comparable essential service setting.\nDemonstrated capability in safety leadership, contractor management, governance and financial accountability.\nExperience leading multi-disciplinary teams through service improvement, growth and change.\nHighly developed stakeholder engagement, communication and executive reporting skills.",
    },
    keyExperience: {
      enabled: true,
      content:
        "Operational leadership in complex service environments.\nBudget, contract and commercial performance management.\nCapital planning input and asset/infrastructure lifecycle awareness.\nService optimisation, risk management and continuous improvement.\nCouncil, government or regulated service experience will be highly regarded.",
    },
    leadershipCapabilities: {
      enabled: true,
      content:
        "Sets clear direction and builds trust.\nCreates disciplined operating rhythms.\nWorks constructively across organisational boundaries.\nBalances community expectations, commercial realities and sustainability outcomes.\nCommunicates with clarity and confidence.",
    },
    whyUnique: {
      enabled: true,
      content:
        "This role sits at the interface of essential service delivery, environmental stewardship and future-ready regional growth. It offers the opportunity to shape a visible community service while influencing the strategic choices that will support the region for years to come.",
    },
    benefits: {
      enabled: true,
      content:
        "Executive-level impact in a high-growth region.\nOpportunity to lead essential services with direct community value.\nCollaborative leadership team and strong organisational purpose.\nConnection to sustainability, liveability and long-term regional planning.",
    },
    applicationProcess: {
      enabled: true,
      content:
        "For a confidential discussion, contact Public Sector People. Applications should include a current resume and a brief cover letter outlining relevant leadership experience. Shortlisted candidates will be contacted by the PSP consultant managing this appointment.",
    },
    consultantBio: { enabled: true },
    consultantProfileImage: { enabled: true },
    closingStatement: {
      enabled: true,
      content:
        "Public Sector People is proud to partner with Council on this appointment. We welcome enquiries from candidates who are motivated by public value, service excellence and practical leadership.",
    },
  },
  images: {
    additionalImages: [],
  },
  settings: {
    targetPageCount: 9,
    imageFitMode: "cover",
    logoFitMode: "contain",
    profileFitMode: "cover",
  },
};
