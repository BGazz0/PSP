import PdfDocument from "./PdfDocument.jsx";

export default function Preview({ pack }) {
  return (
    <div className="preview-shell" aria-label="Live PDF preview">
      <PdfDocument pack={pack} />
    </div>
  );
}
