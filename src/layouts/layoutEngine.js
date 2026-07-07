import { sectionLabels } from "../data/demoPack.js";

const densityFor = (count) => (count <= 4 ? "compact" : count >= 8 ? "spacious" : "standard");

const groupsByCount = {
  3: [
    ["aboutOpportunity", "roleAtGlance", "currentPriorities", "keyResponsibilities", "requirements"],
    ["aboutCouncil", "applicationProcess", "closingStatement"],
  ],
  4: [
    ["aboutOpportunity", "roleAtGlance", "currentPriorities"],
    ["aboutCouncil", "whyJoin", "workingWithCouncil", "keyResponsibilities", "requirements", "aboutYou"],
    ["applicationProcess", "closingStatement"],
  ],
  5: [
    ["aboutOpportunity", "roleAtGlance"],
    ["aboutCouncil", "whyJoin"],
    ["workingWithCouncil", "benefits", "currentPriorities", "keyResponsibilities"],
    ["applicationProcess", "closingStatement"],
  ],
  6: [
    ["aboutOpportunity", "roleAtGlance"],
    ["aboutCouncil", "whyJoin"],
    ["workingWithCouncil", "benefits"],
    ["keyResponsibilities", "currentPriorities"],
    ["applicationProcess", "closingStatement"],
  ],
  7: [
    ["aboutOpportunity", "roleAtGlance"],
    ["aboutCouncil"],
    ["whyJoin", "workingWithCouncil", "benefits"],
    ["aboutOpportunity", "currentPriorities"],
    ["keyResponsibilities", "aboutYou"],
    ["applicationProcess", "closingStatement"],
  ],
  8: [
    ["aboutOpportunity", "roleAtGlance"],
    ["aboutCouncil"],
    ["whyJoin", "workingWithCouncil"],
    ["benefits", "currentPriorities"],
    ["keyResponsibilities"],
    ["aboutYou", "requirements"],
    ["applicationProcess", "closingStatement"],
  ],
  9: [
    ["aboutOpportunity", "roleAtGlance", "whyUnique"],
    ["aboutCouncil"],
    ["whyJoin", "workingWithCouncil", "benefits"],
    ["aboutOpportunity", "currentPriorities"],
    ["keyResponsibilities"],
    ["aboutYou", "requirements"],
    ["keyExperience", "leadershipCapabilities"],
    ["applicationProcess", "closingStatement"],
  ],
  10: [
    ["aboutOpportunity", "roleAtGlance"],
    ["aboutCouncil"],
    ["whyJoin"],
    ["workingWithCouncil", "benefits"],
    ["aboutOpportunity", "currentPriorities"],
    ["keyResponsibilities"],
    ["aboutYou"],
    ["requirements", "keyExperience", "leadershipCapabilities", "whyUnique"],
    ["applicationProcess", "closingStatement"],
  ],
};

function isEnabled(pack, key) {
  if (key === "roleAtGlance") return pack.sections.roleAtGlance.enabled && pack.sections.roleAtGlance.fields.some((row) => row.label || row.value);
  return Boolean(pack.sections[key]?.enabled && pack.sections[key]?.content?.trim());
}

export function createLayout(pack) {
  const target = Number(pack.settings.targetPageCount) || 9;
  const contentPageCount = Math.max(2, target - 1);
  const baseGroups = groupsByCount[target] || groupsByCount[9];
  const groups = baseGroups.slice(0, contentPageCount).map((items) => [...new Set(items)].filter((key) => isEnabled(pack, key)));

  const assigned = new Set(groups.flat());
  Object.keys(sectionLabels).forEach((key) => {
    if (["coverImage", "consultantBio", "consultantProfileImage"].includes(key)) return;
    if (isEnabled(pack, key) && !assigned.has(key)) {
      const nonFinalGroups = groups.slice(0, Math.max(1, groups.length - 1));
      const targetGroup = nonFinalGroups.reduce((best, group, index) => {
        const currentWeight = group.reduce((sum, item) => sum + (item === "roleAtGlance" ? 1 : 2), 0);
        const bestWeight = nonFinalGroups[best].reduce((sum, item) => sum + (item === "roleAtGlance" ? 1 : 2), 0);
        return currentWeight < bestWeight ? index : best;
      }, 0);
      groups[targetGroup].push(key);
    }
  });

  const pages = [
    { type: "cover", title: "Candidate Pack", sections: [] },
    ...groups.map((sections, index) => ({ type: "content", title: pageTitle(sections, index), sections })),
  ];

  const finalPage = pages[pages.length - 1];
  finalPage.type = "contact";
  finalPage.title = "Application & Contact";

  return {
    density: densityFor(target),
    pages: pages.slice(0, target),
  };
}

function pageTitle(sections, index) {
  if (sections.includes("roleAtGlance")) return "The Opportunity";
  if (sections.includes("aboutCouncil")) return "About the Organisation";
  if (sections.includes("keyResponsibilities")) return "Key Responsibilities";
  if (sections.includes("aboutYou") || sections.includes("requirements")) return "Candidate Profile";
  if (sections.includes("applicationProcess")) return "Application & Contact";
  return index === 0 ? "The Opportunity" : "Candidate Information";
}
