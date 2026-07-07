export function cleanText(value = "") {
  return value.replace(/\r/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

export function wordCount(value = "") {
  return cleanText(value).split(/\s+/).filter(Boolean).length;
}

export function parseContent(value = "") {
  const text = cleanText(value);
  if (!text) return [];

  const paragraphs = text.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  return paragraphs.map((part) => {
    const lines = part.split("\n").map((line) => line.trim().replace(/^[-*•]\s*/, "")).filter(Boolean);
    const colonRows = lines.filter((line) => /^[A-Za-z][^:]{2,52}:\s+/.test(line));
    const shortLines = lines.filter((line) => line.length <= 120);

    if (lines.length >= 2 && colonRows.length / lines.length >= 0.5) {
      return {
        type: "keyValue",
        rows: lines.map((line) => {
          const [label, ...rest] = line.split(":");
          return { label: label.trim(), value: rest.join(":").trim() || line };
        }),
      };
    }

    if (lines.length >= 2 && shortLines.length / lines.length >= 0.7) {
      return { type: "bullets", items: lines };
    }

    const headingMatch = part.match(/^([A-Z][^\n]{4,70})\n(.+)/s);
    if (headingMatch) {
      return { type: "headedText", heading: headingMatch[1].trim(), text: headingMatch[2].trim() };
    }

    return { type: "paragraph", text: part.replace(/\n/g, " ") };
  });
}

export function sectionWeight(section = {}) {
  if (!section?.enabled) return 0;
  if (Array.isArray(section.fields)) return section.fields.filter((row) => row.label || row.value).length * 10;
  return wordCount(section.content || "");
}
