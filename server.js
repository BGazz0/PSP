import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 4174;
const distPath = path.join(__dirname, "dist");

app.use(express.json({ limit: "60mb" }));
app.use(express.static(distPath));

app.post("/api/pdf", async (req, res) => {
  const { pack, filename = "PSP_Candidate_Pack.pdf" } = req.body || {};
  if (!pack) return res.status(400).send("Pack data is required.");

  let browser;
  try {
    const clientUrl = process.env.CLIENT_URL || (process.env.NODE_ENV === "production" ? `http://127.0.0.1:${port}` : "http://127.0.0.1:5173");
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--font-render-hinting=medium"],
    });
    const page = await browser.newPage();
    await page.evaluateOnNewDocument((data) => {
      window.localStorage.setItem("psp-pack-export", JSON.stringify(data));
    }, pack);
    await page.goto(`${clientUrl}/?pdf=1`, { waitUntil: "networkidle0" });
    await page.emulateMediaType("print");
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename.replace(/"/g, "")}"`);
    res.send(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || "PDF generation failed.");
  } finally {
    if (browser) await browser.close();
  }
});

app.use((_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`PSP Candidate Pack Generator server running on http://127.0.0.1:${port}`);
});
