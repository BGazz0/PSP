import { textSections } from "../data/demoPack.js";
import { wordCount } from "./contentParser.js";

export function getTotalWords(pack) {
  const basics = wordCount(pack.basics.shortSummary);
  const consultant = pack.sections.consultantBio.enabled ? wordCount(pack.consultant.bio) : 0;
  return textSections.reduce((sum, key) => {
    const section = pack.sections[key];
    return sum + (section?.enabled ? wordCount(section.content) : 0);
  }, basics + consultant);
}

export function recommendedPageCount(pack) {
  const words = getTotalWords(pack);
  let pages = words <= 600 ? 4 : words <= 1100 ? 5 : words <= 1700 ? 7 : words <= 2400 ? 8 : 10;
  const images =
    (pack.basics.coverImage && pack.sections.coverImage.enabled ? 1 : 0) +
    (pack.consultant.profileImage && pack.sections.consultantProfileImage.enabled ? 1 : 0) +
    (pack.images.additionalImages?.length || 0);
  if (images >= 3) pages += 1;
  if (pack.sections.roleAtGlance.enabled) pages += 0;
  if (pack.sections.applicationProcess.enabled && pack.sections.consultantBio.enabled) pages += 1;
  return Math.max(3, Math.min(10, pages));
}

export function pageCountMessage(pack) {
  const recommended = recommendedPageCount(pack);
  const selected = pack.settings.targetPageCount;
  if (selected < recommended - 1) return `Your selected ${selected}-page layout may feel condensed. Recommended: ${recommended} pages.`;
  if (selected > recommended + 2) return `Your selected ${selected}-page layout will allow more whitespace and larger imagery. Recommended: ${recommended} pages.`;
  return `Recommended: ${recommended} pages based on the amount of content entered.`;
}
