export function buildFilename(pack) {
  const clean = (value) =>
    (value || "")
      .replace(/[^a-z0-9]+/gi, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 70);
  const month = clean(pack.basics.monthYear || new Intl.DateTimeFormat("en-AU", { month: "long", year: "numeric" }).format(new Date()));
  return `PSP_Candidate_Pack_${clean(pack.basics.councilName)}_${clean(pack.basics.jobTitle)}_${month}.pdf`;
}
