import { Mail, Phone } from "lucide-react";
import { sectionLabels } from "../data/demoPack.js";
import { createLayout } from "../layouts/layoutEngine.js";
import { parseContent } from "../utils/contentParser.js";
import { fallbackPspLogo } from "../utils/assets.js";

function LogoStrip({ pack }) {
  return (
    <div className="pdf-logo-strip">
      <img src={pack.basics.councilLogo} alt={`${pack.basics.councilName} logo`} className="pdf-council-logo" />
      <img
        src={pack.basics.pspLogo}
        alt="Public Sector People logo"
        className="pdf-psp-logo"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = fallbackPspLogo;
        }}
      />
    </div>
  );
}

function Footer({ pack, page, total }) {
  return (
    <footer className="pdf-footer">
      <span>Prepared for candidates by Public Sector People in partnership with {pack.basics.councilName}</span>
      <strong>{page} / {total}</strong>
    </footer>
  );
}

function ContentBlocks({ content, compact = false }) {
  return (
    <div className={compact ? "content-blocks compact-blocks" : "content-blocks"}>
      {parseContent(content).map((block, index) => {
        if (block.type === "bullets") {
          return (
            <ul key={index} className="pdf-bullets">
              {block.items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
            </ul>
          );
        }
        if (block.type === "keyValue") {
          return (
            <div key={index} className="smart-kv-grid">
              {block.rows.map((row, rowIndex) => (
                <div key={rowIndex} className="smart-kv-card">
                  <strong>{row.label}</strong>
                  <span>{row.value}</span>
                </div>
              ))}
            </div>
          );
        }
        if (block.type === "headedText") {
          return (
            <div key={index} className="headed-text">
              <h4>{block.heading}</h4>
              <p>{block.text}</p>
            </div>
          );
        }
        return <p key={index}>{block.text}</p>;
      })}
    </div>
  );
}

function RoleAtGlance({ pack }) {
  const rows = pack.sections.roleAtGlance.fields.filter((row) => row.label.trim() || row.value.trim());
  if (!rows.length) return null;
  return (
    <section className="pdf-section role-glance">
      <div className="section-label">Role At A Glance</div>
      <div className="glance-grid">
        {rows.map((row, index) => (
          <div className="glance-item" key={index}>
            <span>{row.label}</span>
            <strong>{row.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function TextSection({ pack, sectionKey, density }) {
  const section = pack.sections[sectionKey];
  if (!section?.enabled || !section.content?.trim()) return null;
  const highlight = ["whyUnique", "closingStatement"].includes(sectionKey);
  return (
    <section className={highlight ? "pdf-section statement-section" : "pdf-section"}>
      <div className="section-label">{sectionLabels[sectionKey]}</div>
      <ContentBlocks content={section.content} compact={density === "compact"} />
    </section>
  );
}

function SupportingImage({ pack, pageIndex }) {
  const image = pack.images.additionalImages?.[pageIndex % Math.max(1, pack.images.additionalImages.length)];
  if (!image?.src) return null;
  return (
    <figure className="supporting-image">
      <img src={image.src} alt={image.name || "Supporting candidate pack visual"} style={{ objectFit: image.fit || pack.settings.imageFitMode }} />
    </figure>
  );
}

function CoverPage({ pack, page, total, density }) {
  const showCover = pack.sections.coverImage.enabled && pack.basics.coverImage;
  return (
    <article className={`pdf-page density-${density} cover-page`}>
      <LogoStrip pack={pack} />
      <div className="cover-content">
        <div className="eyebrow">Candidate Pack</div>
        <h1>{pack.basics.jobTitle}</h1>
        <h2>{pack.basics.councilName}</h2>
        <p>{pack.basics.shortSummary}</p>
      </div>
      {showCover && (
        <figure className="cover-visual">
          <img src={pack.basics.coverImage} alt="" style={{ objectFit: pack.settings.imageFitMode }} />
        </figure>
      )}
      <div className="cover-meta">
        <div><span>Position</span><strong>{pack.basics.jobTitle}</strong></div>
        <div><span>Organisation</span><strong>{pack.basics.councilName}</strong></div>
        <div><span>Recruitment partner</span><strong>Public Sector People</strong></div>
      </div>
      <Footer pack={pack} page={page} total={total} />
    </article>
  );
}

function ContactPanel({ pack }) {
  return (
    <div className="contact-panel">
      {pack.sections.consultantProfileImage.enabled && pack.consultant.profileImage && (
        <img src={pack.consultant.profileImage} alt={`${pack.consultant.name} profile`} className="consultant-photo" style={{ objectFit: pack.settings.profileFitMode }} />
      )}
      <div className="contact-details">
        <div className="section-label">Consultant Contact</div>
        <h3>{pack.consultant.name}</h3>
        {pack.consultant.title && <p className="consultant-title">{pack.consultant.title}</p>}
        <p><Mail size={13} /> {pack.consultant.email}</p>
        <p><Phone size={13} /> {pack.consultant.phone}</p>
        {pack.sections.consultantBio.enabled && pack.consultant.bio && <p className="consultant-bio">{pack.consultant.bio}</p>}
      </div>
    </div>
  );
}

function ContentPage({ pack, pageData, page, total, density }) {
  const hasContact = pageData.type === "contact";
  const sections = pageData.sections.filter((key) => key !== "roleAtGlance");
  return (
    <article className={`pdf-page density-${density} ${hasContact ? "contact-page" : ""}`}>
      <LogoStrip pack={pack} />
      <header className="page-heading">
        <div className="eyebrow">{hasContact ? "Next steps" : "Candidate information"}</div>
        <h2>{pageData.title}</h2>
      </header>
      <main className={density === "compact" ? "page-grid compact-grid" : "page-grid"}>
        {pageData.sections.includes("roleAtGlance") && <RoleAtGlance pack={pack} />}
        {sections.map((key) => <TextSection key={key} pack={pack} sectionKey={key} density={density} />)}
        {hasContact && <ContactPanel pack={pack} />}
        {!hasContact && <SupportingImage pack={pack} pageIndex={page} />}
      </main>
      <Footer pack={pack} page={page} total={total} />
    </article>
  );
}

export default function PdfDocument({ pack, mode = "preview" }) {
  const layout = createLayout(pack);
  const total = layout.pages.length;
  return (
    <div className={`pdf-document ${mode === "export" ? "pdf-export" : ""}`}>
      {layout.pages.map((pageData, index) =>
        pageData.type === "cover" ? (
          <CoverPage key={index} pack={pack} page={index + 1} total={total} density={layout.density} />
        ) : (
          <ContentPage key={index} pack={pack} pageData={pageData} page={index + 1} total={total} density={layout.density} />
        ),
      )}
    </div>
  );
}
