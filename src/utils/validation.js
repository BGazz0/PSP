export function validatePack(pack) {
  const errors = [];
  if (!pack.basics.councilName.trim()) errors.push("Please enter the council or organisation name.");
  if (!pack.basics.jobTitle.trim()) errors.push("Please enter the job title.");
  if (!pack.basics.councilLogo) errors.push("Please upload the council logo before generating the PDF.");
  if (!pack.basics.pspLogo) errors.push("The PSP logo is required for every pack.");
  if (!pack.consultant.name.trim()) errors.push("Please enter the consultant name.");
  if (!pack.consultant.email.trim()) errors.push("Please enter the consultant email.");
  if (!pack.consultant.phone.trim()) errors.push("Please enter the consultant phone.");
  return errors;
}

export function optionalWarnings(pack, labels) {
  const warnings = [];
  Object.entries(pack.sections).forEach(([key, section]) => {
    if (!section?.enabled) return;
    if (Array.isArray(section.fields) && !section.fields.some((row) => row.label.trim() && row.value.trim())) {
      warnings.push(`${labels[key] || key} is included but has no completed rows.`);
    }
    if ("content" in section && !section.content.trim()) warnings.push(`${labels[key] || key} is included but empty.`);
  });
  if (pack.sections.coverImage.enabled && !pack.basics.coverImage) warnings.push("Cover image is included but no image has been uploaded.");
  if (pack.sections.consultantBio.enabled && !pack.consultant.bio.trim()) warnings.push("Consultant bio is included but empty.");
  if (pack.sections.consultantProfileImage.enabled && !pack.consultant.profileImage) warnings.push("Consultant profile picture is included but no image has been uploaded.");
  return warnings;
}
