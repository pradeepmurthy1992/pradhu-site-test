import React, { useEffect, useMemo, useRef, useState } from "react";

/* ============================================================
   PRADHU — One Piece Theme (Light/Dark) + Cinematic Intro + Portfolio
   - Straw Hat navbar (rope divider)
   - Sea-gradient background + map dots
   - Portfolio tiles & pages styled as "Wanted" posters
   - Parchment panels for Services / Pricing / FAQ / Booking
   - Uses your existing GitHub loader + Intro overlay logic
============================================================ */

/* ===================== ONE PIECE UTILITIES (add to global CSS) =====================
Add this once to your global CSS (e.g., index.css) under @layer utilities:

@layer utilities {
  .bg-grand-line {
    background-image:
      radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
      linear-gradient(180deg, #004b8d 0%, #0077b6 50%, #00b4d8 100%);
    background-size: 22px 22px, 100% 100%;
    background-position: 0 0, center;
  }
  .texture-parchment {
    background: radial-gradient(1200px 600px at 10% 10%, rgba(0,0,0,.06), transparent 40%),
                radial-gradient(1000px 800px at 90% 20%, rgba(0,0,0,.05), transparent 45%),
                radial-gradient(800px 500px at 30% 90%, rgba(0,0,0,.05), transparent 40%),
                linear-gradient(#f6edd2, #eadbb6);
  }
  .rope-divider { position: relative; }
  .rope-divider:after {
    content: ""; position: absolute; inset-inline: 0; bottom: -2px; height: 8px;
    background-image: repeating-linear-gradient(45deg,#c8a96e 0 6px,#a77f3e 6px 12px);
    border-radius: 9999px; filter: drop-shadow(0 2px 0 rgba(0,0,0,.25));
  }
  .wanted-edge { border: 2px solid #3a2b13; border-radius: 8px; box-shadow: inset 0 0 0 2px rgba(255,255,255,.35), 0 10px 18px rgba(0,0,0,.25); }
  .stamp-berry { position: absolute; inset: auto 8px 8px auto; rotate: -12deg; border: 2px solid #7c0000; color: #7c0000; padding: 2px 10px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; background: rgba(174,0,0,.08); }
  .tilt { transform-style: preserve-3d; transition: transform .3s ease; }
  .tilt:hover { transform: rotate3d(1,1,0,6deg) translateY(-2px); }
}
*/
      
/* ===================== CONFIG ===================== */
const INTRO_ENABLED = true;
const INTRO_BRAND = "PRADEEP";
const INTRO_NAME = "Pradhu Photography";
const INTRO_AUTO_DISMISS_MS = 0;
const INTRO_LEFT_IMAGE_URL =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop";

const INTRO_REMEMBER = true;
const INTRO_FORCE_QUERY = "intro"; // use ?intro=1
const INTRO_FORCE_HASH = "#intro";

const HERO_BG_URL =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2400&q=80";

// GitHub media repo (live portfolio)
const GH_OWNER = "pradeepmurthy1992";
const GH_REPO = "pradhu-portfolio-media";
const GH_BRANCH = "main";
const GH_CATEGORIES = [
  { label: "Events", path: "Events" },
  { label: "Fashion", path: "Fashion" },
];
const GH_CATEGORIES_EXT = {
  Events: { blurb: "Candid coverage of people and moments—clean color, honest expressions, and storytelling frames." },
  Fashion: { blurb: "Editorial-leaning looks with modern skin tones and simple, confident direction." },
};
const GH_CACHE_TTL_MS = 5 * 60 * 1000;

// Brand / contact
const CONTACT_EMAIL = "pradhuphotography@gmail.com";
const SERVICE_CITIES = "Base : Pune · Available [ Mumbai · Chennai · Bengaluru ]";
const IG_USERNAME = "pradhu_photography";

// Enquiry (kept for future; not exposed in UI)
const WHATSAPP_NUMBER = "91XXXXXXXXXX";
const UPI_ID = "yourvpa@upi";
const RAZORPAY_LINK = "";
const BOOKING_ADVANCE_INR = 2000;

// Google Sheets Web App endpoint
const SHEET_WEB_APP =
  "https://script.google.com/macros/s/AKfycbypBhkuSpztHIBlYU3nsJJBsJI1SULQRIpGynZvEY6sDb2hDnr1PXN4IZ8342sy5-Dj/exec";

// Navbar
const NAV_BRAND = "PRADHU PIRATE PHOTOGRAPHY";
const NAV_ITEMS = [
  { label: "Home", id: "home", icon: "home" },
  { label: "Contact Me", id: "booking", icon: "mail" },
];
const SECTION_IDS = ["portfolio", "services", "pricing", "faq"]; // tiles

// Wide container helper
const CONTAINER = "mx-auto w-full max-w-[1800px] px-4 xl:px-8";

/* ===================== Load Fonts (Inter + Playfair Display) ===================== */
function HeadFonts() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700;800;900&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
  return null;
}

/* ===================== THEME TOKENS (One Piece hues) ===================== */
function useThemeTokens(theme) {
  const pirate = {
    navAccent: "text-amber-300",
    rope: "rope-divider",
    posterCard: "texture-parchment wanted-edge",
  };
  const light = {
    pageBg: "bg-grand-line", // sea background
    pageText: "text-white",
    navBg: "bg-black/30",
    navBorder: "border-transparent",
    navText: "text-white/90",
    navTextStrong: "text-white",
    hoverOverlay: "bg-amber-300/10",
    sectionAltBg: "",
    panelBg: "texture-parchment",
    panelBorder: "border-[#3a2b13]",
    cardBg: "texture-parchment",
    cardBorder: "border-[#3a2b13]",
    muted: "text-white/90",
    muted2: "text-white/80",
    chipActive: "bg-amber-300 text-black border-amber-400",
    chipInactive: "bg-black/30 border-white/30 text-white hover:bg-black/40",
    btnOutline: "border-white/50 text-white hover:bg-white/10",
    inputBg: "bg-white",
    inputBorder: "border-[#3a2b13]",
    inputText: "text-black",
    placeholder: "placeholder-neutral-500",
    footerBg: "bg-black/30",
    footerBorder: "border-white/20",
    link: "text-amber-300 underline",
    linkSubtle: "text-amber-200 underline",
    ...pirate,
  };

  const dark = {
    ...light, // keep same pirate surface to keep style consistent
  };
  return theme === "light" ? light : dark;
}

/* ===================== Small Helpers ===================== */
function useHash() {
  const [hash, setHash] = useState(() => window.location.hash || "");
  useEffect(() => {
    const onHash = () => setHash(window.location.hash || "");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return [hash, (h) => { if (h !== window.location.hash) window.location.hash = h; }];
}

/* ===================== Icons ===================== */
function Icon({ name, className = "h-4 w-4" }) {
  const p = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (name) {
    case "home":
      return (
        <svg {...p}>
          <path d="M3 11.5L12 4l9 7.5" />
          <path d="M5 10.5V20h5v-6h4v6h5v-9.5" />
        </svg>
      );
    case "grid":
      return (
        <svg {...p}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "briefcase":
      return (
        <svg {...p}>
          <path d="M3.5 8.5h17A1.5 1.5 0 0122 10v7a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 014 17v-7a1.5 1.5 0 011.5-1.5" />
          <path d="M8 8.5V6.5A2.5 2.5 0 0110.5 4h3A2.5 2.5 0 0116 6.5v2" />
          <path d="M2 12.5h20" />
        </svg>
      );
    case "tag":
      return (
        <svg {...p}>
          <path d="M3 12l8.5 8.5a2 2 0 002.8 0L21 13.8a2 2 0 000-2.8L12.2 2H6a3 3 0 00-3 3v6z" />
          <circle cx="8" cy="8" r="1.2" />
        </svg>
      );
    case "user":
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="3.2" />
          <path d="M4 20a8 8 0 0116 0" />
        </svg>
      );
    case "camera":
      return (
        <svg {...p}>
          <path d="M4 8.5A2.5 2.5 0 016.5 6H8l1.2-1.6A2 2 0 0110.7 3h2.6a2 2 0 011.6.8L16 6h1.5A2.5 2.5 0 0120 8.5v7A2.5 2.5 0 0117.5 18h-11A2.5 2.5 0 014 15.5v-7z" />
          <circle cx="12" cy="12" r="3.5" />
        </svg>
      );
    case "help":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9A2.5 2.5 0 0112 7.5 2.5 2.5 0 0114.5 9.7c0 1.3-1 1.9-1.7 2.3-.7.3-1.3.9-1.3 1.7V15" />
          <circle cx="12" cy="17.5" r="0.8" />
        </svg>
      );
    case "mail":
      return (
        <svg {...p}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      );
    case "sun":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      );
    case "moon":
      return (
        <svg {...p}>
          <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...p}>
          <path d="M20.5 11.5a8.5 8.5 0 11-4.2-7.4l.2.1" />
          <path d="M7.5 19.5l-3 1 1-3" />
          <path d="M9.5 7.8c-.3 1 .2 2.2 1.4 3.6 1.2 1.4 2.4 2 3.5 1.8" />
          <path d="M12.6 12.9l.9-1.1 1.7.6" />
        </svg>
      );
    case "wheel":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="2" />
          <path d="M12 4v4M12 16v4M4 12h4M16 12h4M6.8 6.8l2.8 2.8M14.4 14.4l2.8 2.8M17.2 6.8l-2.8 2.8M9.6 14.4l-2.8 2.8" />
        </svg>
      );
    case "skull":
      return (
        <svg {...p}>
          <path d="M8 19v-2a2 2 0 012-2h4a2 2 0 012 2v2" />
          <circle cx="9" cy="12" r="1.6" />
          <circle cx="15" cy="12" r="1.6" />
          <path d="M12 4c-4.4 0-8 3.3-8 7.4 0 3 2 5.6 4.9 6.5h6.2C18 17 20 14.4 20 11.4 20 7.3 16.4 4 12 4z" />
        </svg>
      );
    default:
      return null;
  }
}

/* ===================== Intro Overlay (unchanged core, kept cinematic) ===================== */
function IntroOverlay({ onClose }) {
  const [phase, setPhase] = useState("typeName");
  const NAME = "PRADEEP MOORTHY";
  const BRAND = "PRADHU PHOTOGRAPHY";
  const [typed, setTyped] = useState("");
  const [step, setStep] = useState(0);
  const typingRef = useRef(null);
  const imgRef = useRef(null);
  const rippleLayerRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Enter") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onAnyClick = (e) => makeRipple(e.clientX, e.clientY, true);
  const onPressEnterButton = (e) => { e.stopPropagation(); onClose(); };

  function makeRipple(x, y, withFlash = false) {
    const host = rippleLayerRef.current; if (!host) return;
    const rect = host.getBoundingClientRect();
    const ripple = document.createElement("span"); ripple.className = "cin-ripple circle";
    ripple.style.left = `${x - rect.left}px`; ripple.style.top = `${y - rect.top}px`; host.appendChild(ripple);
    if (withFlash) { const flash = document.createElement("span"); flash.className = "cin-flash"; flash.style.left = `${x - rect.left}px`; flash.style.top = `${y - rect.top}px`; host.appendChild(flash); setTimeout(() => flash.remove(), 360); }
    setTimeout(() => ripple.remove(), 800);
  }

  useEffect(() => {
    const str = phase === "typeName" ? NAME : phase === "typeBrand" ? BRAND : "";
    if (!str) return; setTyped(""); setStep(0); clearInterval(typingRef.current);
    const SPEED = 75; let i = 0; typingRef.current = setInterval(() => {
      i++; setTyped(str.slice(0, i));
      if (i >= str.length) { clearInterval(typingRef.current); setStep(1); setTimeout(() => { setStep(2); setTimeout(() => { if (phase === "typeName") setPhase("typeBrand"); else if (phase === "typeBrand") setPhase("revealImg"); }, 520); }, phase === "typeName" ? 600 : 700); }
    }, SPEED);
    return () => clearInterval(typingRef.current);
  }, [phase]);

  useEffect(() => { if (phase !== "revealImg") return; const t = setTimeout(() => setPhase("titles"), 1400); return () => clearTimeout(t); }, [phase]);

  const impactRipple = (delayMs = 0) => {
    setTimeout(() => {
      const img = imgRef.current; const host = rippleLayerRef.current; if (!img || !host) return;
      const r = img.getBoundingClientRect(); const cx = r.left + r.width * 0.55; const cy = r.top + r.height * 0.45; makeRipple(cx, cy, true);
    }, delayMs);
  };
  useEffect(() => { if (phase !== "titles") return; impactRipple(420); impactRipple(900); impactRipple(1250); }, [phase]);

  const renderTyping = (text) => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-white text-center">
        <div className={["inline-flex items-center gap-1 font-['Playfair_Display'] uppercase tracking-[0.08em]","text-[clamp(26px,7vw,88px)] leading-none whitespace-nowrap", step === 2 ? "cin-explode-out" : ""].join(" ")}>
          <span>{text}</span>
          {step === 0 ? <span className="cin-caret w-[0.5ch] inline-block align-bottom" /> : null}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black text-white" style={{ zIndex: 9999 }} role="dialog" aria-label="Intro overlay" onClick={onAnyClick}>
      <div ref={rippleLayerRef} className="absolute inset-0 cin-ripple-layer" />
      {(phase === "typeName") && renderTyping(typed)}
      {(phase === "typeBrand") && renderTyping(typed)}
      <div className={["h-full w-full grid items-center justify-center p-6","md:grid-cols-[640px_1fr] gap-4", phase === "typeName" || phase === "typeBrand" ? "opacity-0" : "opacity-100"].join(" ")}>
        <div className="relative cin-image-holder">
          <img ref={imgRef} src={INTRO_LEFT_IMAGE_URL} alt="Intro" className={["w-full h-auto object-contain max-h-[78vh]", phase === "revealImg" ? "cin-radial-reveal cin-image-move-in" : "", phase === "titles" ? "opacity-100" : ""].join(" ")} />
          <div className="pointer-events-none absolute inset-0 cin-vignette" />
        </div>
        <div className={["flex flex-col items-end gap-3 text-right whitespace-nowrap select-none", phase === "titles" ? "opacity-100" : "opacity-0"].join(" ")}>
          <div className={["text-[12px] tracking-[0.25em] opacity-80", phase === "titles" ? "cin-overshoot-in" : ""].join(" ")}>VISUAL & HONEST STORIES</div>
          <h1 className={["mt-1 font-['Playfair_Display'] uppercase","text-[clamp(32px,6vw,72px)] leading-tight", phase === "titles" ? "cin-overshoot-in delay-[480ms]" : ""].join(" ")}>PRADEEP MOORTHY</h1>
          <div className={["mt-0.5 font-['Playfair_Display'] uppercase","text-[clamp(24px,4.5vw,50px)] leading-tight", phase === "titles" ? "cin-overshoot-in delay-[850ms]" : ""].join(" ")}>PRADHU PHOTOGRAPHY</div>
          <button onClick={onPressEnterButton} className={["rounded-full border border-white/40 px-5 py-2 text-sm","hover:bg-white/10 transition mt-6", phase === "titles" ? "cin-fade-in-delayed" : "opacity-0"].join(" ")}>Enter ↵</button>
        </div>
      </div>
    </div>
  );
}

/* ===================== GitHub helpers ===================== */
const GH_API = "https://api.github.com";
const IMG_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
const isImageName = (name = "") => IMG_EXTS.some((ext) => name.toLowerCase().endsWith(ext));
async function ghListFolder(owner, repo, path, ref) {
  const key = `pradhu:gh:${owner}/${repo}@${ref}/${path}`;
  const tkey = key + ":ts";
  const now = Date.now();
  const nocache = new URLSearchParams(window.location.search).get("refresh") === "1";
  try { const ts = Number(sessionStorage.getItem(tkey) || 0); if (!nocache && ts && now - ts < GH_CACHE_TTL_MS) { const cached = JSON.parse(sessionStorage.getItem(key) || "[]"); return cached; } } catch {}
  const url = `${GH_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(ref)}`;
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) { if (res.status === 404) return []; const text = await res.text(); throw new Error(`GitHub API ${res.status}: ${text}`); }
  const json = await res.json();
  const files = Array.isArray(json) ? json.filter((it) => it.type === "file") : [];
  const imgs = files.filter((f) => isImageName(f.name)).map((f) => ({ name: f.name, url: f.download_url, sha: f.sha, size: f.size }));
  try { sessionStorage.setItem(key, JSON.stringify(imgs)); sessionStorage.setItem(tkey, String(now)); } catch {}
  return imgs;
}

/* ===================== Hero (One Piece vibe) ===================== */
function Hero() {
  return (
    <section id="home" className="relative min-h-[68vh] md:min-h-[78vh]">
      <img src={HERO_BG_URL} alt="" aria-hidden="true" className="absolute inset-0 z-0 h-full w-full object-cover pointer-events-none" loading="eager" />
      <div className="absolute inset-0 z-[1] bg-black/45" />
      <div className="absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 z-[2]">
        <div className={`${CONTAINER} pb-10 md:pb-14 text-white`}>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            Capture Your Treasure <span className="opacity-90">— One Piece at a time</span>
          </h1>
          <p className="mt-3 max-w-3xl text-sm md:text-base text-neutral-200">Fashion · Portraits · Candids · Portfolio · Events.</p>
        </div>
      </div>
    </section>
  );
}

/* ===================== FAQ (parchment panels) ===================== */
function FaqSection({ T, showTitle = true }) {
  const items = [
    { q: "How do I receive photos?", a: "Private, watermark-free gallery with high‑res downloads (typically Google Drive)." },
    { q: "How to book?", a: "Send an enquiry below with your date, service, and location." },
    { q: "Do you travel for shoots?", a: "Yes. Travel fee applies outside the base city." },
    { q: "Do you provide makeup/hair or a stylist?", a: "I can recommend trusted HMUA/styling partners; billed separately." },
    { q: "Studio vs Outdoor?", a: "Both. I shortlist spaces or set up portable studio lights on location." },
    { q: "Prints/albums?", a: "Available via pro labs; sizes and papers on request." },
  ];
  return (
    <section id="faq" className="py-2">
      {showTitle && (<h2 className={`text-3xl md:text-4xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}>FAQ</h2>)}
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {items.map((item) => (
          <details key={item.q} className={`rounded-2xl border p-5 shadow-sm ${T.panelBg} ${T.panelBorder}`}>
            <summary className={`cursor-pointer font-medium ${T.navTextStrong}`}>{item.q}</summary>
            <p className={`mt-2 text-sm ${T.muted}`}>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ===================== Services (parchment) ===================== */
function ServicesSection({ T, showTitle = true }) {
  return (
    <section id="services" className="py-2">
      {showTitle && (<h2 className={`text-3xl md:text-4xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}>Services</h2>)}
      <p className={`mt-2 ${T.muted}`}>Multi-genre coverage designed around your brief. I’ll suggest looks, lighting windows and locations so the day feels effortless.</p>
      <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[
          { t:"Portraits & Headshots", pts:["60–90 min · up to 2 outfits","Clean, natural retouching","Guidance on wardrobe, posing & locations","Curated 3 - 5 edited images per outfit"]},
          { t:"Fashion / Editorial", pts:["Moodboard & looks planning","On-set lighting & styling coordination","Contemporary colour and skin tones","Half-day / full-day options"]},
          { t:"Events & Candids", pts:["Coverage by hours or blocks","Emphasis on key moments & people","Balanced, colour‑graded selects"]},
        ].map((c)=> (
          <article key={c.t} className={`rounded-2xl border p-5 shadow-sm ${T.panelBg} ${T.panelBorder}`}>
            <h3 className={`text-lg font-medium ${T.navTextStrong}`}>{c.t}</h3>
            <ul className={`mt-2 text-sm list-disc pl-5 ${T.muted}`}>{c.pts.map((l)=>(<li key={l}>{l}</li>))}</ul>
          </article>
        ))}
      </div>
      <div className={`mt-6 rounded-2xl border p-5 ${T.panelBg} ${T.panelBorder}`}>
        <h3 className={`font-medium ${T.navTextStrong}`}>Add-ons</h3>
        <ul className={`mt-2 text-sm list-disc pl-5 ${T.muted}`}>
          <li>HMUA / Styling coordination (at cost)</li>
          <li>Studio rental (venue rates apply)</li>
          <li>Assistant / extra lighting</li>
          <li>Travel & stay outside base city (actuals)</li>
          <li>Rush teasers / same-day selects</li>
          <li>Prints, albums and frames</li>
        </ul>
        <a href="#booking" className={`${T.link} text-sm mt-3 inline-block`}>Enquire for availability →</a>
      </div>
    </section>
  );
}

/* ===================== Pricing (parchment) ===================== */
function PricingSection({ T, showTitle = true }) {
  const tiers = [
    { name: "Portrait Session", price: "from ₹4,500", includes:["60–90 min · up to 2 outfits","6 lightly retouched hero shots","Curated 3 - 5 edited images per outfit","Location & styling guidance"] },
    { name: "Headshots (Solo/Team)", price: "from ₹5,000", includes:["60–90 min · up to 2 outfits","Consistent lighting & framing","Curated 3 - 5 edited images per outfit","On-location option available"] },
    { name: "Fashion / Editorial (Half-day)", price: "from ₹10,000", includes:["Pre-prod planning & moodboard","Lighting & look management","Curated 3 - 5 edited images per outfit","Team coordination on request","Hour based - no limits for outfit changes"] },
    { name: "Event Coverage (2 hrs)", price: "from ₹8,000", includes:["Focused coverage of key moments","Colour-graded selects","Extendable by hour","Editing based on request - add on"] },
  ];
  return (
    <section id="pricing" className="py-2">
      {showTitle && (<h2 className={`text-3xl md:text-4xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}>Pricing (indicative)</h2>)}
      <p className={`mt-2 ${T.muted}`}>Final quote depends on scope, locations, team and timelines. Share your brief for a tailored estimate.</p>
      <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <article key={t.name} className={`rounded-2xl border p-5 shadow-sm ${T.panelBg} ${T.panelBorder}`}>
            <div className="flex items-baseline justify-between"><h3 className={`text-lg font-medium ${T.navTextStrong}`}>{t.name}</h3><span className="text-sm opacity-80">{t.price}</span></div>
            <ul className={`mt-3 text-sm list-disc pl-5 ${T.muted}`}>{t.includes.map((line)=>(<li key={line}>{line}</li>))}</ul>
            <a href="#booking" className={`${T.link} text-sm mt-4 inline-block`}>Request a quote →</a>
          </article>
        ))}
      </div>
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className={`rounded-2xl border p-5 ${T.panelBg} ${T.panelBorder}`}>
          <h4 className={`font-medium ${T.navTextStrong}`}>Turnaround</h4>
          <ul className={`mt-2 text-sm list-disc pl-5 ${T.muted}`}>
            <li>Portraits / Fashion : 7–12 days. Weddings/events: full gallery in ~3–4 weeks.</li>
            <li>Entire shoot pics will be shared in 3 - 5 days</li>
            <li>Editing timeline starts post the shortlisting of images</li>
          </ul>
        </div>
        <div className={`rounded-2xl border p-5 ${T.panelBg} ${T.panelBorder}`}>
          <h4 className={`font-medium ${T.navTextStrong}`}>Booking & Policy</h4>
          <ul className={`mt-2 text-sm list-disc pl-5 ${T.muted}`}>
            <li>Advance to reserve the date (adjustable in final invoice).</li>
            <li>One complimentary reschedule with 72h notice (subject to availability).</li>
            <li>Outstation travel/stay billed at actuals.</li>
            <li>Editing requests upto two revisions are accepted</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ===================== Small Input ===================== */
function Input({ T, label, name, value, onChange, type = "text", required = false, placeholder = "" }) {
  return (
    <div>
      <label htmlFor={name} className={`text-sm ${T.muted}`}>{label} {required ? <span className="text-red-500">*</span> : null}</label>
      <input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} className={`mt-1 w-full rounded-xl border px-3 py-2 ${T.inputBg} ${T.inputBorder} ${T.inputText} ${T.placeholder}`} />
    </div>
  );
}

/* ===================== Portfolio: Wanted Poster styles ===================== */
const fmtBerry = (n) => `B ${Number(n||0).toLocaleString("en-IN")}`;

function WantedTile({ label, coverUrl, onClick }){
  return (
    <article className={`relative overflow-hidden ${"wanted-edge texture-parchment"}`}>
      <button type="button" onClick={onClick} className="group block text-left w-full">
        <div className="p-3 text-center">
          <div className="text-2xl font-extrabold tracking-widest text-[#3a2b13]">WANTED</div>
          <div className="text-[10px] tracking-[0.35em] text-[#5a4b2a]">DEAD OR ALIVE</div>
        </div>
        <div className="mx-3 mb-3 aspect-[4/5] overflow-hidden border-2 border-[#3a2b13] bg-[#e8d9b4]">
          {coverUrl && <img src={coverUrl} alt={label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />}
        </div>
        <div className="text-center pb-4">
          <div className="text-xl font-black text-[#3a2b13] leading-none">{label}</div>
          <div className="mt-1 text-sm font-extrabold tracking-wider text-[#3a2b13]">BOUNTY {fmtBerry(1000000000)}</div>
        </div>
        <div className="stamp-berry">MARINES</div>
      </button>
    </article>
  );
}

// Landing (tiles)
function PortfolioLanding({ T, cats, states, openCat }) {
  return (
    <section className="py-2" id="portfolio">
      <header className="mb-8">
        <h2 className={`text-4xl md:text-5xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}>Portfolio</h2>
        <p className={`mt-2 ${T.muted}`}>Choose a collection.</p>
      </header>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {cats.map((c, i) => {
          const st = states[i] || { images: [], loading: true, error: "" };
          const cover = st.images?.[0]?.url || "";
          return (
            <WantedTile key={c.label} label={c.label} coverUrl={cover} onClick={() => openCat(c.label)} />
          );
        })}
      </div>
    </section>
  );
}

// Page (tall images within poster frame)
function PortfolioPage({ T, cat, state, onBack }) {
  const items = state.images || [];
  const blurb = GH_CATEGORIES_EXT[cat.label]?.blurb || "";
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const root = containerRef.current; if (!root) return;
    const update = () => {
      const slides = Array.from(root.querySelectorAll('[data-idx]'));
      if (!slides.length) return; const center = root.scrollLeft + root.clientWidth / 2;
      let best = 0, bestDist = Infinity;
      slides.forEach((el, i) => { const mid = el.offsetLeft + el.offsetWidth / 2; const d = Math.abs(mid - center); if (d < bestDist) { bestDist = d; best = i; } });
      setActiveIndex(best);
    };
    update(); root.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update);
    return () => { root.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);

  const goTo = (idx) => { const el = containerRef.current?.querySelector(`[data-idx="${idx}"]`); el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); };

  return (
    <section className="py-2" id="portfolio">
      <div className="mb-4 sticky top-[72px] z-[1] backdrop-blur">
        <div className="pt-3"><button className={`${T.linkSubtle} text-sm`} onClick={onBack}>Portfolio</button><span className={`mx-2 ${T.muted2}`}>/</span><span className={`text-sm ${T.navTextStrong}`}>{cat.label}</span></div>
        <h2 className={`mt-1 text-4xl md:text-5xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}>{cat.label}</h2>
        {blurb && <p className={`mt-1 ${T.muted}`}>{blurb}</p>}
      </div>
      <div className="fixed right-4 md:right-6 top-[calc(72px+12px)] text-[11px] tracking-[0.25em] opacity-80 pointer-events-none">{items.length ? `${activeIndex + 1} / ${items.length}` : "0 / 0"}</div>
      {state.error ? (
        <div className="text-red-500">{String(state.error)}</div>
      ) : state.loading ? (
        <div className={`${T.muted2}`}>Loading…</div>
      ) : items.length ? (
        <>
          <div ref={containerRef} className="mx-auto max-w-[1600px] overflow-x-auto snap-x snap-mandatory flex gap-5 px-3 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.map((it, i) => (
              <div key={it.sha || i} data-idx={i} className="flex-shrink-0 w-[78%] sm:w-[66%] md:w-[58%] lg:w-[52%] snap-center">
                <article className="wanted-edge texture-parchment p-3 relative">
                  <div className="text-center">
                    <div className="text-2xl font-extrabold tracking-widest text-[#3a2b13]">WANTED</div>
                    <div className="text-[10px] tracking-[0.35em] text-[#5a4b2a]">DEAD OR ALIVE</div>
                  </div>
                  <div className="mt-2 overflow-hidden border-2 border-[#3a2b13] bg-[#e8d9b4]">
                    <img src={it.url} alt={`${cat.label} — ${it.name}`} className="w-full h-[64vh] object-contain" loading="lazy" />
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-xl font-black text-[#3a2b2a] leading-none">{cat.label}</div>
                    <div className="mt-1 text-sm font-extrabold tracking-wider text-[#3a2b2a]">BOUNTY {fmtBerry(1000000000 + i*1000)}</div>
                  </div>
                  <div className="stamp-berry">MARINES</div>
                </article>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-2">
            {items.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Go to image ${i + 1}`} className={`h-2.5 w-2.5 rounded-full transition ${i === activeIndex ? "bg-white" : "bg-white/35 hover:bg-white/60"}`} />
            ))}
          </div>
        </>
      ) : (
        <div className={`${T.muted}`}>No images yet for {cat.label}.</div>
      )}
    </section>
  );
}

// Wrapper (hash-driven view switch)
function Portfolio({ T }) {
  const [states, setStates] = useState(() => GH_CATEGORIES.map(() => ({ loading: true, error: "", images: [] })));
  const [hash, setHash] = useHash();
  const [view, setView] = useState("landing");
  const [activeIdx, setActiveIdx] = useState(-1);

  const openCat = (label) => {
    const idx = GH_CATEGORIES.findIndex((c) => c.label === label); if (idx < 0) return;
    setActiveIdx(idx); setView("page"); setHash(`#portfolio/${encodeURIComponent(label)}`);
    const el = document.getElementById("portfolio"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const goLanding = () => { setView("landing"); setActiveIdx(-1); setHash("#portfolio"); };

  useEffect(() => {
    if (!hash.startsWith("#portfolio")) return;
    const seg = hash.split("/");
    if (seg.length >= 2 && seg[1]) { const label = decodeURIComponent(seg[1].replace(/^#?portfolio\/?/, "")); const idx = GH_CATEGORIES.findIndex((c) => c.label === label); if (idx >= 0) { setActiveIdx(idx); setView("page"); return; } }
    setView("landing"); setActiveIdx(-1);
  }, [hash]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const results = await Promise.all(
        GH_CATEGORIES.map(async (cat) => {
          try { const list = await ghListFolder(GH_OWNER, GH_REPO, cat.path, GH_BRANCH); return { loading: false, error: "", images: list }; }
          catch (e) { return { loading: false, error: e?.message || "Failed to load", images: [] }; }
        })
      );
      if (!cancelled) setStates(results);
    })();
    return () => { cancelled = true; };
  }, []);

  if (view === "page" && activeIdx >= 0) { const cat = GH_CATEGORIES[activeIdx]; const st = states[activeIdx] || { loading: true, error: "", images: [] }; return <PortfolioPage T={T} cat={cat} state={st} onBack={goLanding} />; }
  return <PortfolioLanding T={T} cats={GH_CATEGORIES} states={states} openCat={openCat} />;
}

/* ===================== Tiles ===================== */
function SectionTiles({ openId, setOpenId, T }) {
  const tiles = [
    { id: "portfolio", label: "WANTED Gallery", icon: "grid" },
    { id: "services", label: "Services", icon: "briefcase" },
    { id: "pricing", label: "Pricing", icon: "tag" },
    { id: "faq", label: "FAQ", icon: "help" },
  ];
  return (
    <div id="tiles" className={`${CONTAINER} pt-10`}>
      <div className="flex gap-3 overflow-x-auto whitespace-nowrap pb-2" style={{ scrollbarWidth: "none" }}>
        {tiles.map((t) => {
          const active = openId === t.id;
          return (
            <button key={t.id} type="button" onClick={() => { setOpenId(t.id); if (t.id === "portfolio") window.location.hash = "#portfolio"; }}
              className={`flex items-center gap-2 rounded-2xl border px-4 py-2 transition shadow-sm ${active ? T.chipActive : T.chipInactive}`}
              aria-pressed={active} aria-controls={`section-${t.id}`} aria-expanded={active}>
              <Icon name={t.icon} className={`h-4 w-4 ${active ? "opacity-100" : "opacity-60"}`} />
              <span className="text-sm">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ===================== Booking (parchment) ===================== */
function BookingSection({ T }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "Portraits", city: "Pune", date: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [note, setNote] = useState("");

  const minDateStr = useMemo(() => { const d = new Date(); d.setDate(d.getDate() + 2); const off = d.getTimezoneOffset(); const local = new Date(d.getTime() - off * 60000); return local.toISOString().slice(0, 10); }, []);
  const fmtHuman = (yyyy_mm_dd) => { if (!yyyy_mm_dd) return ""; const [y, m, d] = yyyy_mm_dd.split("-").map(Number); return new Date(y, m - 1, d).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }); };
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault(); setNote("");
    const missing = []; if (!form.name.trim()) missing.push("Name"); if (!form.email.trim()) missing.push("Email"); if (!form.phone.trim()) missing.push("Phone"); if (form.date && form.date < minDateStr) missing.push(`Preferred Date (≥ ${fmtHuman(minDateStr)})`);
    if (missing.length) { setNote(`Please fill: ${missing.join(", ")}`); return; }
    setSubmitting(true);
    try { await fetch(SHEET_WEB_APP, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, source: "website" }) }); setForm({ name: "", email: "", phone: "", service: "Portraits", city: "Pune", date: "", message: "" }); setNote("Thanks! Your enquiry was submitted. I’ll reply shortly."); }
    catch (err) { console.error(err); setNote("Couldn’t submit right now. Please try again."); }
    finally { setSubmitting(false); }
  };

  return (
    <section id="booking" className={`border-t ${T.footerBorder}`}>
      <div className={`${CONTAINER} py-16`}>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div id="about">
            <h2 className={`text-3xl md:text-4xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}>About PRADHU</h2>
            <div className={`mt-3 wanted-edge texture-parchment p-5`}>
              <p className={` ${T.muted}`}>As an aspiring photographer from Kanchipuram, I work across fashion, portraits, candids and events. I run a client-first process: I listen to your brief and offer tailored recommendations on looks, lighting, locations and timelines so the day feels effortless. On set, I work with calm, unobtrusive direction to create space for genuine expression. My aim is to capture the beauty, joy and decisive moments that define your story—delivering images that feel personal, polished and purposeful.</p>
              <ul className={`mt-4 text-sm list-disc pl-5 space-y-1 ${T.muted}`}>
                <li>Genres: Fashion, High Fashion, Portraits, Editorials, Candids, Portfolio, Professional Headshots, Street Fashion, Studio</li>
                <li>Kit: Nikon D7500, Softboxes (octa & strip), flashes, modifiers</li>
                <li>{SERVICE_CITIES}</li>
              </ul>
              <div className="mt-4 flex items-center gap-3">
                <a href={`https://www.instagram.com/${IG_USERNAME}/`} target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram" className={`inline-flex items-center justify-center h-12 px-4 rounded-2xl border ${T.panelBorder} texture-parchment transition hover:scale-[1.04] hover:shadow-sm`}>
                  <Icon name="camera" className="h-5 w-5" /> <span className="ml-2">Instagram</span>
                </a>
                {WHATSAPP_NUMBER.includes("X") ? (
                  <span className={`inline-flex items-center justify-center h-12 px-4 rounded-2xl border ${T.panelBorder} texture-parchment opacity-60`} title="WhatsApp unavailable" aria-hidden="true"><Icon name="whatsapp" className="h-5 w-5" /><span className="ml-2">WhatsApp</span></span>
                ) : (
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" title="WhatsApp" className={`inline-flex items-center justify-center h-12 px-4 rounded-2xl border ${T.panelBorder} texture-parchment transition hover:scale-[1.04] hover:shadow-sm`}>
                    <Icon name="whatsapp" className="h-5 w-5" /><span className="ml-2">WhatsApp</span>
                  </a>
                )}
                <a href={`mailto:${CONTACT_EMAIL}`} aria-label="Email" title="Email" className={`inline-flex items-center justify-center h-12 px-4 rounded-2xl border ${T.panelBorder} texture-parchment transition hover:scale-[1.04] hover:shadow-sm`}><Icon name="mail" className="h-5 w-5" /><span className="ml-2">Email</span></a>
              </div>
            </div>
          </div>
          <div>
            <h2 className={`text-3xl md:text-4xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}>Enquire / Book</h2>
            <p className={`mt-2 ${T.muted}`}>Share details and I’ll reply with availability and a quote.</p>
            <form onSubmit={onSubmit} className={`mt-6 wanted-edge texture-parchment p-6`}>
              <div className="grid grid-cols-1 gap-4">
                <Input T={T} label="Name" name="name" value={form.name} onChange={onChange} required />
                <Input T={T} label="Email" name="email" type="email" value={form.email} onChange={onChange} required />
                <Input T={T} label="Phone" name="phone" type="tel" value={form.phone} onChange={onChange} required placeholder="+91-XXXXXXXXXX" />
                <div>
                  <label className={`text-sm ${T.muted}`}>Preferred Date</label>
                  <input name="date" type="date" min={minDateStr} value={form.date} onKeyDown={(e) => e.preventDefault()} onPaste={(e) => e.preventDefault()} onChange={(e) => { let v = e.target.value; if (v && v < minDateStr) { v = minDateStr; setNote(`Earliest available date is ${fmtHuman(minDateStr)}.`); } setForm({ ...form, date: v }); }} className={`mt-1 w-full rounded-xl border px-3 py-2 bg-white border-[#3a2b13] text-black placeholder-neutral-500`} />
                  <p className="text-xs opacity-70 mt-1">Earliest selectable: {fmtHuman(minDateStr)}</p>
                </div>
                <div>
                  <label className={`text-sm ${T.muted}`}>Message</label>
                  <textarea name="message" value={form.message} onChange={onChange} rows={5} className={`mt-1 w-full rounded-xl border px-3 py-2 bg-white border-[#3a2b13] text-black placeholder-neutral-500`} placeholder="Shoot location, timings, concept, references, usage (personal/commercial), etc." />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`text-sm ${T.muted}`}>Service</label>
                    <select name="service" className={`mt-1 w-full rounded-xl border px-3 py-2 bg-white border-[#3a2b13] text-black`} value={form.service} onChange={onChange}>
                      {["Portraits","Fashion","Candids","Street","Events","Other"].map((s)=>(<option key={s} value={s}>{s}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className={`text-sm ${T.muted}`}>City</label>
                    <select name="city" className={`mt-1 w-full rounded-xl border px-3 py-2 bg-white border-[#3a2b13] text-black`} value={form.city} onChange={onChange}>
                      <option>Pune</option><option>Mumbai</option><option>Chennai</option><option>Bengaluru</option><option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button type="submit" disabled={submitting} className="rounded-xl bg-amber-400 text-black px-4 py-2 font-extrabold hover:translate-y-[-1px] transition disabled:opacity-60">{submitting ? "Submitting…" : "Send Enquiry"}</button>
                  {note && <span className="text-sm opacity-90 text-white">{note}</span>}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== Main App ===================== */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => { try { return sessionStorage.getItem("pradhu:theme") || "dark"; } catch { return "dark"; } });
  const T = useThemeTokens(theme);
  const [showIntro, setShowIntro] = useState(() => {
    if (!INTRO_ENABLED) return false; const url = new URL(window.location.href);
    const forced = url.searchParams.get(INTRO_FORCE_QUERY) === "1" || url.hash === INTRO_FORCE_HASH; if (forced) return true;
    if (!INTRO_REMEMBER) return true; return sessionStorage.getItem("pradhu:intro:dismissed") !== "1";
  });
  const [openId, setOpenId] = useState("");
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => {
    const ids = ["home","portfolio","services","pricing","faq","about","booking"]; const els = ids.map((id)=>[id, document.getElementById(id)]).filter(([,el])=>!!el);
    if (els.length === 0) return; let current = activeNav;
    const io = new IntersectionObserver((entries) => {
      const mid = window.innerHeight / 2; let best = { id: current, dist: Number.POSITIVE_INFINITY };
      entries.forEach((e) => { if (!e.isIntersecting) return; const rect = e.target.getBoundingClientRect(); const center = rect.top + rect.height / 2; const dist = Math.abs(center - mid); const id = e.target.getAttribute("id"); if (dist < best.dist) best = { id, dist }; });
      if (best.id && best.id !== current) { current = best.id; setActiveNav(best.id); }
    }, { root: null, threshold: [0.35], rootMargin: "-10% 0px -50% 0px" });
    els.forEach(([, el]) => io.observe(el)); return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToSectionFromNav = (id) => {
    setActiveNav(id);
    if (SECTION_IDS.includes(id)) { setOpenId(id); if (id === "portfolio") window.location.hash = "#portfolio"; const el = document.getElementById("tiles"); if (el) el.scrollIntoView({ behavior: "smooth" }); }
    else { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth" }); }
    setMenuOpen(false);
  };

  const closeIntro = () => { setShowIntro(false); try { if (INTRO_REMEMBER) sessionStorage.setItem("pradhu:intro:dismissed", "1"); } catch {} };
  useEffect(() => { try { sessionStorage.setItem("pradhu:theme", theme); } catch {} }, [theme]);

  return (
    <main className={`min-h-screen ${T.pageBg} ${T.pageText} font-['Inter']`}>
      <HeadFonts />
      {showIntro && <IntroOverlay onClose={closeIntro} />}

      {/* NAVBAR */}
      <header className={`sticky top-0 z-50 backdrop-blur border-b ${T.navBg} ${T.navBorder}`}>
        <nav className={`${CONTAINER} py-4 lg:py-5 grid grid-cols-[1fr_auto_auto] items-center gap-3`}>
          <div className="min-w-0 flex items-center gap-2 select-none">
            <Icon name="wheel" className="w-6 h-6" />
            <p className={`font-['Playfair_Display'] uppercase tracking-[0.08em] leading-none ${T.navTextStrong} text-[clamp(20px,2.4vw,40px)] whitespace-nowrap`}>
              {NAV_BRAND} <span className={T.navAccent}> • STRAW HAT</span>
            </p>
          </div>
          <ul className="hidden lg:flex items-center gap-2 text-sm">
            {NAV_ITEMS.map(({ label, id, icon }) => (
              <li key={id}>
                <button onClick={() => scrollToSectionFromNav(id)} aria-pressed={activeNav === id} aria-current={activeNav === id ? "page" : undefined} className={`relative group flex items-center gap-2 px-3 py-2 rounded-2xl border transition shadow-sm ${activeNav === id ? T.chipActive : T.chipInactive}`}>
                  <Icon name={icon} className={`h-4 w-4 ${activeNav === id ? "opacity-100" : "opacity-60"}`} />
                  <span className="text-sm">{label}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <ThemeSlider theme={theme} setTheme={setTheme} />
            <button className={`lg:hidden rounded-lg px-3 py-2 text-sm border ${T.btnOutline}`} onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen} aria-controls="mobile-menu">Menu</button>
          </div>
        </nav>
        <div className="rope-divider" />
        {menuOpen && (
          <div id="mobile-menu" className={`lg:hidden border-t ${T.navBorder} w-full`}>
            <div className={`${CONTAINER} px-2 py-3`}>
              <ul className="grid gap-1">
                {NAV_ITEMS.map(({ label, id, icon }) => (
                  <li key={id}>
                    <button onClick={() => scrollToSectionFromNav(id)} aria-pressed={activeNav === id} className={`relative group w-full text-left flex items-center gap-2 px-3 py-2 rounded-2xl border transition shadow-sm ${activeNav === id ? T.chipActive : T.chipInactive}`}>
                      <Icon name={icon} className={`h-4 w-4 ${activeNav === id ? "opacity-100" : "opacity-60"}`} />
                      <span>{label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <Hero />

      {/* TILES */}
      <SectionTiles openId={openId} setOpenId={setOpenId} T={T} />

      {/* SECTION CONTENT */}
      <div id="sections-content" className={`${CONTAINER} py-12`}>
        <div className={openId === "portfolio" ? "block" : "hidden"}><Portfolio T={T} /></div>
        <div id="services" className={openId === "services" ? "block" : "hidden"}><ServicesSection T={T} showTitle={false} /></div>
        <div id="pricing" className={openId === "pricing" ? "block" : "hidden"}><PricingSection T={T} showTitle={false} /></div>
        <div id="faq" className={openId === "faq" ? "block" : "hidden"}><FaqSection T={T} showTitle={false} /></div>
      </div>

      {/* CONTACT / ENQUIRY */}
      <BookingSection T={T} />

      {/* FOOTER */}
      <footer className={`border-t ${T.footerBorder} bg-black/30 text-white`}>
        <div className={`${CONTAINER} py-10 text-sm`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <p className="opacity-90">© {new Date().getFullYear()} PRADHU — All rights reserved. Sail the Grand Line of memories.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ===================== Theme Slider ===================== */
function ThemeSlider({ theme, setTheme }) {
  const isDark = theme === "dark";
  const setLight = () => setTheme("light");
  const setDark = () => setTheme("dark");
  const onKeyDown = (e) => { if (e.key === "ArrowLeft") setLight(); if (e.key === "ArrowRight") setDark(); };
  return (
    <div className="relative h-9 w-[150px] select-none" role="tablist" aria-label="Theme" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 rounded-full border border-white/40 bg-white/10" />
      <div className={`absolute top-0 left-0 h-full w-1/2 rounded-full shadow-sm transition-transform duration-200 ${isDark ? "translate-x-full bg-black/60" : "translate-x-0 bg-white/70"}`} aria-hidden="true" />
      <div className="relative z-10 grid grid-cols-2 h-full">
        <button type="button" role="tab" aria-selected={!isDark} aria-pressed={!isDark} onClick={setLight} className="flex items-center justify-center gap-1.5 px-3 h-full">
          <Icon name="sun" className={`h-4 w-4 ${isDark ? "opacity-60 text-white" : "opacity-100 text-yellow-700"}`} />
          <span className={`text-xs ${isDark ? "opacity-80 text-white" : "opacity-100 text-black font-medium"}`}>Light</span>
        </button>
        <button type="button" role="tab" aria-selected={isDark} aria-pressed={isDark} onClick={setDark} className="flex items-center justify-center gap-1.5 px-3 h-full">
          <Icon name="moon" className={`h-4 w-4 ${isDark ? "opacity-100 text-white" : "opacity-60 text-black"}`} />
          <span className={`text-xs ${isDark ? "opacity-100 text-white font-medium" : "opacity-80 text-black"}`}>Dark</span>
        </button>
      </div>
    </div>
  );
}
