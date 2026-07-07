import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Check, Download, ImagePlus, Info, RotateCcw, WandSparkles } from "lucide-react";
import { initialPack, sectionLabels, textSections } from "./data/demoPack.js";
import Preview from "./components/Preview.jsx";
import PdfDocument from "./components/PdfDocument.jsx";
import { pageCountMessage, recommendedPageCount } from "./utils/pageCountRecommendation.js";
import { validatePack, optionalWarnings } from "./utils/validation.js";
import { buildFilename } from "./utils/filename.js";
import { fallbackPspLogo, PSP_LOGO_URL } from "./utils/assets.js";

const steps = [
  { id: "basics", label: "Pack Basics" },
  { id: "role", label: "Role Details" },
  { id: "organisation", label: "Organisation" },
  { id: "candidate", label: "Candidate Profile" },
  { id: "consultant", label: "Consultant" },
  { id: "export", label: "Preview & Export" },
];

const stepSections = {
  role: ["aboutOpportunity", "currentPriorities", "keyResponsibilities"],
  organisation: ["aboutCouncil", "whyJoin", "workingWithCouncil", "benefits"],
  candidate: ["aboutYou", "requirements", "keyExperience", "leadershipCapabilities", "whyUnique"],
  consultant: ["applicationProcess", "closingStatement"],
};

function readImage(file, callback) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => callback({ src: reader.result, width: img.width, height: img.height, name: file.name });
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function Field({ label, required, helper, children }) {
  return (
    <div className="field">
      <span>{label}{required && <em>Required</em>}</span>
      {children}
      {helper && <small>{helper}</small>}
    </div>
  );
}

function Toggle({ checked, onChange, label, locked = false }) {
  return (
    <label className={`toggle ${locked ? "locked" : ""}`}>
      <input type="checkbox" checked={checked} disabled={locked} onChange={(event) => onChange(event.target.checked)} />
      <span aria-hidden="true" />
      <strong>{label}</strong>
    </label>
  );
}

function ImageUploader({ label, value, fit, onFit, onUpload, helper, required }) {
  const inputRef = useRef(null);
  const src = typeof value === "string" ? value : value?.src;
  const lowRes = value?.width && (value.width < 900 || value.height < 500);
  const openFilePicker = () => inputRef.current?.click();
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
  };

  return (
    <div className="image-uploader">
      <Field label={label} required={required} helper={helper}>
        <div className="upload-row">
          <button type="button" className="upload-button" onClick={openFilePicker}>
            <ImagePlus size={17} />
            Upload image
          </button>
          <select value={fit} onChange={(event) => onFit(event.target.value)} aria-label={`${label} fit mode`}>
            <option value="cover">Cover crop</option>
            <option value="contain">Contain full image</option>
            <option value="scale-down">Original ratio</option>
          </select>
        </div>
      </Field>
      <input
        ref={inputRef}
        className="hidden-file-input"
        type="file"
        accept="image/*"
        onChange={(event) => readImage(event.target.files?.[0], onUpload)}
      />
      <div
        className={`upload-preview-card ${src ? "has-image" : ""}`}
        role="button"
        tabIndex={0}
        aria-label={`${src ? "Replace" : "Upload"} ${label}`}
        onClick={openFilePicker}
        onKeyDown={handleKeyDown}
      >
        {src ? <img className="upload-thumb" src={src} alt="" /> : <><ImagePlus size={20} /><span>Click to upload {label.toLowerCase()}</span></>}
      </div>
      {lowRes && <p className="inline-warning"><AlertCircle size={14} /> This image may be low resolution for print.</p>}
    </div>
  );
}

function SectionEditor({ pack, sectionKey, updateSection }) {
  const section = pack.sections[sectionKey];
  return (
    <div className="section-editor">
      <Toggle
        checked={section.enabled}
        label={sectionLabels[sectionKey]}
        onChange={(enabled) => updateSection(sectionKey, { enabled })}
      />
      <p className="helper">This section can be removed from the final PDF.</p>
      <textarea
        value={section.content}
        disabled={!section.enabled}
        onChange={(event) => updateSection(sectionKey, { content: event.target.value })}
        rows={sectionKey === "keyResponsibilities" ? 7 : 5}
        placeholder="Paste consultant notes here. Short lines become bullets; label: detail lines become cards."
      />
    </div>
  );
}

function RoleAtGlanceEditor({ pack, setPack }) {
  const rows = pack.sections.roleAtGlance.fields;
  const updateRow = (index, field, value) => {
    setPack((current) => {
      const nextRows = current.sections.roleAtGlance.fields.map((row, rowIndex) => rowIndex === index ? { ...row, [field]: value } : row);
      return { ...current, sections: { ...current.sections, roleAtGlance: { ...current.sections.roleAtGlance, fields: nextRows } } };
    });
  };
  return (
    <div className="section-editor">
      <Toggle
        checked={pack.sections.roleAtGlance.enabled}
        label="Role at a glance"
        onChange={(enabled) => setPack((current) => ({ ...current, sections: { ...current.sections, roleAtGlance: { ...current.sections.roleAtGlance, enabled } } }))}
      />
      <div className="glance-editor">
        {rows.map((row, index) => (
          <div key={index}>
            <input value={row.label} onChange={(event) => updateRow(index, "label", event.target.value)} placeholder="Label" />
            <input value={row.value} onChange={(event) => updateRow(index, "value", event.target.value)} placeholder="Value" />
          </div>
        ))}
      </div>
    </div>
  );
}

function BasicsStep({ pack, setPack }) {
  const updateBasics = (patch) => setPack((current) => ({ ...current, basics: { ...current.basics, ...patch } }));
  const updateSettings = (patch) => setPack((current) => ({ ...current, settings: { ...current.settings, ...patch } }));
  return (
    <div className="step-panel">
      <div className="form-grid">
        <Field label="Council / Organisation Name" required helper="This appears on the cover, footer and contact page.">
          <input value={pack.basics.councilName} onChange={(event) => updateBasics({ councilName: event.target.value })} />
        </Field>
        <Field label="Job Title" required helper="Use the formal advertised title.">
          <input value={pack.basics.jobTitle} onChange={(event) => updateBasics({ jobTitle: event.target.value })} />
        </Field>
        <Field label="Month / Year" helper="Used in the exported filename and cover metadata.">
          <input value={pack.basics.monthYear} onChange={(event) => updateBasics({ monthYear: event.target.value })} />
        </Field>
        <Field label="Target page count" helper={pageCountMessage(pack)}>
          <select value={pack.settings.targetPageCount} onChange={(event) => updateSettings({ targetPageCount: Number(event.target.value) })}>
            {[3, 4, 5, 6, 7, 8, 9, 10].map((count) => <option key={count} value={count}>{count} pages</option>)}
          </select>
        </Field>
      </div>
      <Field label="Short role summary" helper="One polished paragraph for the cover.">
        <textarea rows={4} value={pack.basics.shortSummary} onChange={(event) => updateBasics({ shortSummary: event.target.value })} />
      </Field>
      <div className="form-grid">
        <ImageUploader
          label="Council / Organisation Logo"
          required
          value={{ src: pack.basics.councilLogo }}
          fit={pack.settings.logoFitMode}
          onFit={(logoFitMode) => updateSettings({ logoFitMode })}
          onUpload={(image) => updateBasics({ councilLogo: image.src })}
          helper="Use a PNG or SVG logo on a clean background."
        />
        <div>
          <Toggle checked={pack.sections.coverImage.enabled} label="Include cover image" onChange={(enabled) => setPack((current) => ({ ...current, sections: { ...current.sections, coverImage: { enabled } } }))} />
          <ImageUploader
            label="Cover image"
            value={{ src: pack.basics.coverImage }}
            fit={pack.settings.imageFitMode}
            onFit={(imageFitMode) => updateSettings({ imageFitMode })}
            onUpload={(image) => updateBasics({ coverImage: image.src })}
            helper="Upload a landscape image if possible. The generator will preserve the original aspect ratio."
          />
        </div>
      </div>
    </div>
  );
}

function ConsultantStep({ pack, setPack }) {
  const updateConsultant = (patch) => setPack((current) => ({ ...current, consultant: { ...current.consultant, ...patch } }));
  const updateSection = (key, patch) => setPack((current) => ({ ...current, sections: { ...current.sections, [key]: { ...current.sections[key], ...patch } } }));
  return (
    <div className="step-panel">
      <div className="form-grid">
        <Field label="Consultant Name" required><input value={pack.consultant.name} onChange={(event) => updateConsultant({ name: event.target.value })} /></Field>
        <Field label="Consultant Title"><input value={pack.consultant.title} onChange={(event) => updateConsultant({ title: event.target.value })} /></Field>
        <Field label="Consultant Email" required><input value={pack.consultant.email} onChange={(event) => updateConsultant({ email: event.target.value })} /></Field>
        <Field label="Consultant Phone" required><input value={pack.consultant.phone} onChange={(event) => updateConsultant({ phone: event.target.value })} /></Field>
      </div>
      <div className="section-editor">
        <Toggle checked={pack.sections.consultantBio.enabled} label="Consultant bio" onChange={(enabled) => updateSection("consultantBio", { enabled })} />
        <textarea rows={5} value={pack.consultant.bio} disabled={!pack.sections.consultantBio.enabled} onChange={(event) => updateConsultant({ bio: event.target.value })} />
      </div>
      <Toggle checked={pack.sections.consultantProfileImage.enabled} label="Consultant profile picture" onChange={(enabled) => updateSection("consultantProfileImage", { enabled })} />
      <ImageUploader
        label="Profile picture"
        value={{ src: pack.consultant.profileImage }}
        fit={pack.settings.profileFitMode}
        onFit={(profileFitMode) => setPack((current) => ({ ...current, settings: { ...current.settings, profileFitMode } }))}
        onUpload={(image) => updateConsultant({ profileImage: image.src })}
        helper="A portrait image works best. It will be cropped as a professional contact card."
      />
      {stepSections.consultant.map((key) => <SectionEditor key={key} pack={pack} sectionKey={key} updateSection={updateSection} />)}
    </div>
  );
}

function ContentStep({ pack, sectionKeys, setPack }) {
  const updateSection = (key, patch) => setPack((current) => ({ ...current, sections: { ...current.sections, [key]: { ...current.sections[key], ...patch } } }));
  return (
    <div className="step-panel">
      {sectionKeys[0] === "aboutOpportunity" && <RoleAtGlanceEditor pack={pack} setPack={setPack} />}
      {sectionKeys.map((key) => <SectionEditor key={key} pack={pack} sectionKey={key} updateSection={updateSection} />)}
    </div>
  );
}

function ExportStep({ pack, onExport, exporting, errors, warnings }) {
  return (
    <div className="step-panel">
      <div className="export-card">
        <div className="export-copy">
          <div className="section-kicker"><WandSparkles size={16} /> Layout guidance</div>
          <h3>{pageCountMessage(pack)}</h3>
          <p>The generator adjusts page density, card layouts, image scale and section grouping to target {pack.settings.targetPageCount} pages.</p>
          <p className="filename-preview">{buildFilename(pack)}</p>
        </div>
        <div className="export-actions">
          <button className="primary-action" onClick={onExport} disabled={exporting || errors.length > 0}>
            <Download size={18} />
            {exporting ? "Generating PDF..." : "Generate Candidate Pack PDF"}
          </button>
        </div>
      </div>
      <div className="message-list">
        {errors.map((error) => <p className="error" key={error}><AlertCircle size={15} /> {error}</p>)}
        {!errors.length && <p className="success"><Check size={15} /> Mandatory fields are complete.</p>}
        {warnings.map((warning) => <p className="warning" key={warning}><Info size={15} /> {warning}</p>)}
      </div>
    </div>
  );
}

export default function App() {
  const isPdfMode = new URLSearchParams(window.location.search).has("pdf");
  const exportedPack = isPdfMode ? JSON.parse(window.localStorage.getItem("psp-pack-export") || "null") : null;
  const [pack, setPack] = useState(exportedPack || initialPack);
  const [activeStep, setActiveStep] = useState("basics");
  const [exporting, setExporting] = useState(false);
  const [pspLogoWarning, setPspLogoWarning] = useState("");
  const errors = useMemo(() => validatePack(pack), [pack]);
  const warnings = useMemo(() => {
    const items = optionalWarnings(pack, sectionLabels);
    if (pspLogoWarning) items.unshift(pspLogoWarning);
    return items;
  }, [pack, pspLogoWarning]);
  const recommended = recommendedPageCount(pack);

  useEffect(() => {
    const image = new Image();
    image.onload = () => setPspLogoWarning("");
    image.onerror = () => {
      setPspLogoWarning("The official PSP logo could not be loaded. A local fallback will be used until the logo URL is available.");
      setPack((current) => ({ ...current, basics: { ...current.basics, pspLogo: fallbackPspLogo } }));
    };
    image.src = PSP_LOGO_URL;
  }, []);

  if (isPdfMode) return <PdfDocument pack={pack} mode="export" />;

  const exportPdf = async () => {
    if (errors.length) return;
    setExporting(true);
    try {
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack, filename: buildFilename(pack) }),
      });
      if (!response.ok) throw new Error(await response.text());
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = buildFilename(pack);
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(`PDF export failed: ${error.message}`);
    } finally {
      setExporting(false);
    }
  };

  const currentStep = steps.find((step) => step.id === activeStep);
  return (
    <div className="app-shell">
      <aside className="builder">
        <header className="builder-header">
          <div>
            <p>Public Sector People</p>
            <h1>Candidate Pack Generator</h1>
          </div>
          <button className="ghost-action" onClick={() => setPack(initialPack)}><RotateCcw size={15} /> Demo reset</button>
        </header>
        <nav className="step-nav" aria-label="Builder steps">
          {steps.map((step, index) => (
            <button key={step.id} className={activeStep === step.id ? "active" : ""} onClick={() => setActiveStep(step.id)}>
              <span>{index + 1}</span>{step.label}
            </button>
          ))}
        </nav>
        <div className="recommendation-strip">
          <strong>Recommended {recommended} pages</strong>
          <span>Selected {pack.settings.targetPageCount} pages</span>
        </div>
        <section className="builder-card">
          <div className="card-heading">
            <h2>{currentStep.label}</h2>
            <p>Designed to keep the pack polished while consultants move quickly.</p>
          </div>
          {activeStep === "basics" && <BasicsStep pack={pack} setPack={setPack} />}
          {activeStep === "role" && <ContentStep pack={pack} setPack={setPack} sectionKeys={stepSections.role} />}
          {activeStep === "organisation" && <ContentStep pack={pack} setPack={setPack} sectionKeys={stepSections.organisation} />}
          {activeStep === "candidate" && <ContentStep pack={pack} setPack={setPack} sectionKeys={stepSections.candidate} />}
          {activeStep === "consultant" && <ConsultantStep pack={pack} setPack={setPack} />}
          {activeStep === "export" && <ExportStep pack={pack} onExport={exportPdf} exporting={exporting} errors={errors} warnings={warnings} />}
        </section>
        <div className="section-toggles">
          <h3>Included Sections</h3>
          {textSections.map((key) => (
            <Toggle
              key={key}
              checked={pack.sections[key].enabled}
              label={sectionLabels[key]}
              onChange={(enabled) => setPack((current) => ({ ...current, sections: { ...current.sections, [key]: { ...current.sections[key], enabled } } }))}
            />
          ))}
        </div>
      </aside>
      <main className="preview-column">
        <div className="preview-toolbar">
          <div>
            <strong>Live PDF-style preview</strong>
            <span>A4 portrait, PSP branded, page-aware templates</span>
          </div>
          <button className="primary-action small" disabled={errors.length > 0 || exporting} onClick={exportPdf}><Download size={16} /> Export</button>
        </div>
        <Preview pack={pack} />
      </main>
    </div>
  );
}
