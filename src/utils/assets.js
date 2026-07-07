const svgToData = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

export const PSP_LOGO_URL = "https://lirp.cdn-website.com/d3feaffe/dms3rep/multi/opt/output-onlinepngtools+%2810%29-1920w.png";

export const fallbackPspLogo = svgToData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 160">
  <rect width="540" height="160" rx="18" fill="#fff"/>
  <text x="34" y="76" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="800" fill="#004A98">PUBLIC</text>
  <text x="34" y="122" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="800" fill="#009CA6">SECTOR PEOPLE</text>
  <path d="M432 34h58c20 0 35 15 35 35v22c0 20-15 35-35 35h-58z" fill="#004A98"/>
  <circle cx="474" cy="80" r="29" fill="#009CA6"/>
</svg>`);

export const placeholderLogo = svgToData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 160">
  <rect width="420" height="160" rx="20" fill="#ffffff"/>
  <rect x="18" y="18" width="124" height="124" rx="22" fill="#EAF7F8"/>
  <path d="M43 106c25-50 49-50 74 0" fill="none" stroke="#009CA6" stroke-width="10" stroke-linecap="round"/>
  <circle cx="80" cy="65" r="24" fill="#004A98"/>
  <text x="166" y="73" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="800" fill="#003B7A">Council</text>
  <text x="166" y="112" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="700" fill="#009CA6">logo placeholder</text>
</svg>`);

export const placeholderProfile = svgToData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 420">
  <rect width="360" height="420" rx="26" fill="#EAF7F8"/>
  <circle cx="180" cy="145" r="72" fill="#BBDDE2"/>
  <path d="M72 364c14-86 64-129 108-129s94 43 108 129" fill="#004A98"/>
  <text x="180" y="398" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" fill="#003B7A">Profile photo</text>
</svg>`);

export const placeholderCover = svgToData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#003B7A"/>
      <stop offset="0.52" stop-color="#004A98"/>
      <stop offset="1" stop-color="#009CA6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="720" fill="#EAF7F8"/>
  <path d="M0 520c200-70 335-58 505-9s330 33 470-49c92-54 163-71 225-56v314H0z" fill="url(#g)" opacity="0.92"/>
  <path d="M65 180h260v260H65z" rx="28" fill="#fff" opacity="0.18"/>
  <path d="M378 118h696v94H378zM378 248h512v34H378zM378 315h602v34H378z" fill="#fff" opacity="0.78"/>
</svg>`);
