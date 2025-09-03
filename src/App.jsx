import React, { useEffect, useMemo, useRef, useState } from "react";

/* ===== Minimal hash router: #/route ===== */
const ROUTES = ["/", "/portfolio", "/services", "/pricing", "/about", "/reviews", "/contact"];
const useHashRoute = () => {
  const getPath = () => {
    const h = window.location.hash || "#/";
    const path = h.replace(/^#/, "");
    return ROUTES.includes(path) ? path : "/404";
  };
  const [path, setPath] = useState(getPath);
  useEffect(() => {
    const onHash = () => setPath(getPath());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const nav = (to) => {
    if (!to.startsWith("#")) to = `#${to}`;
    if (window.location.hash !== to) window.location.hash = to;
  };
  return [path, nav];
};

/* ===================== CONFIG (kept from your file) ===================== */
const INTRO_ENABLED = true;
const INTRO_BRAND = "PRADEEP";
const INTRO_NAME = "Pradhu Photography";
const INTRO_AUTO_DISMISS_MS = 0;
const INTRO_LEFT_IMAGE_URL =
  "https://raw.githubusercontent.com/pradeepmurthy1992/pradhu-site-test/5a13fa5f50b380a30762e6d0f3d74ab44eb505a5/baseimg/187232337_402439238105_n.jpg";

const INTRO_REMEMBER = true;
const INTRO_FORCE_QUERY = "intro";
const INTRO_FORCE_HASH = "#intro";

const HERO_BG_URL =
  "https://raw.githubusercontent.com/pradeepmurthy1992/pradhu-site-test/212bc1f22bc6a32b70ae87d0bb104c38f7c3848e/baseimg/02.jpg";

/* Manifest-first image loading */
const MEDIA_MANIFEST_URL =
  "https://raw.githubusercontent.com/pradeepmurthy1992/pradhu-portfolio-media/main/manifest.json";
const GH_OWNER = "pradeepmurthy1992";
const GH_REPO = "pradhu-portfolio-media";
const GH_BRANCH = "main";

const GH_CATEGORIES = [
  { label: "Celeb Corner", path: "Celeb Corner" },
  { label: "Editorial", path: "Editorial" },
  { label: "Kidz Zone", path: "Kidz Zone" },
  { label: "Model Portfolio", path: "Model Portfolio" },
  { label: "Designer Portfolio", path: "Designer Portfolio" },
  { label: "Conceptual", path: "Conceptual" },
  { label: "Fantasy", path: "Fantasy" },
  { label: "Eyes", path: "Eyes" },
  { label: "Fashion", path: "Fashion" },
  { label: "High Fashion", path: "High Fashion" },
  { label: "Street Fashion", path: "Street Fashion" },
  { label: "Headshots", path: "Headshots" },
  { label: "Maternity", path: "Maternity" },
  { label: "Streets", path: "Streets" },
  { label: "Landscapes", path: "Landscapes" },
];

const GH_CATEGORIES_EXT = {
  Events: { blurb: "Candid coverage of people and moments—clean color, honest expressions, and storytelling frames." },
  Fashion: { blurb: "Editorial-leaning looks with modern skin tones and simple, confident direction." },
  "Celeb Corner": { blurb: "Clean, flattering light with discreet direction—portraits that feel iconic yet intimate." },
  Editorial: { blurb: "Story-led imagery with strong concepts, refined styling, and contemporary color." },
  "Model Portfolio": { blurb: "Polished tests that show range—clean frames, confident posing, and natural skin tones." },
  "Designer Portfolio": { blurb: "Lookbook-ready sets centered on garments—texture, drape, and movement." },
  Conceptual: { blurb: "Ideas-first visuals—graphic compositions, considered props, and mood-rich lighting." },
  Fantasy: { blurb: "Stylized worlds with cinematic color—ethereal styling and playful, imaginative direction." },
  Eyes: { blurb: "Close, expressive portraits—catchlights, subtle retouching, and micro-emotion in focus." },
  "High Fashion": { blurb: "Sharp silhouettes, bold styling, and controlled light—attitude-forward frames." },
  "Street Fashion": { blurb: "Real locations, ambient light, and candid energy—loose, effortless styling in motion." },
  Headshots: { blurb: "Crisp, consistent framing with flattering light—professional, approachable expressions." },
  "Kidz Zone": { blurb: "Playful, patient sessions that keep it fun—authentic smiles and gentle color." },
  Maternity: { blurb: "Soft, elegant lighting with thoughtful posing—quiet, intimate, and timeless frames." },
  Streets: { blurb: "Unscripted moments from the everyday—graphic shadows, rhythm, and gesture." },
  Landscapes: { blurb: "Quiet horizons, clean lines, and patient light—minimal color with depth and scale." },
};

const GH_CACHE_TTL_MS = 5 * 60 * 1000;
const CONTACT_EMAIL = "pradhuphotography@gmail.com";
const SERVICE_CITIES = "Base : Pune · Available [ Mumbai · Chennai · Bengaluru ]";
const IG_USERNAME = "pradhu_photography";
const WHATSAPP_NUMBER = "919322584410";
const SHEET_WEB_APP =
  "https://script.google.com/macros/s/AKfycbypBhkuSpztHIBlYU3nsJJBsJI1SULQRIpGynZvEY6sDb2hDnr1PXN4IZ8342sy5-Dj/exec";

const NAV_ITEMS = [
  { label: "Home", id: "/", icon: "home" },
  { label: "Portfolio", id: "/portfolio", icon: "grid" },
  { label: "Services & Pricing", id: "/services", icon: "briefcase" },
  { label: "About", id: "/about", icon: "user" },
  { label: "Reviews", id: "/reviews", icon: "help" },
  { label: "Contact", id: "/contact", icon: "mail" },
];

const CONTAINER = "mx-auto w-full max-w-[1800px] px-4 xl:px-8";

/* ===================== Fonts, Analytics ===================== */
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
function trackEvent(name, params = {}) {
  try { window.gtag?.("event", name, params); } catch {}
}

/* ===================== Theme ===================== */
function useThemeTokens(theme) {
  const light = {
    pageBg: "bg-[#faf7f2]",
    pageText: "text-neutral-900",
    navBg: "bg-white/85",
    navBorder: "border-rose-200",
    navTextStrong: "text-neutral-900",
    chipActive: "bg-rose-200 text-rose-900 border-rose-300",
    chipInactive: "bg-white border-neutral-300 text-neutral-700 hover:bg-rose-50",
    btnOutline: "border-neutral-300 text-neutral-900 hover:bg-rose-50",
    sectionAltBg: "bg-[#fdfaf7]",
    panelBg: "bg-white",
    panelBorder: "border-rose-200",
    muted: "text-neutral-600",
    muted2: "text-neutral-500",
    footerBg: "bg-white",
    footerBorder: "border-rose-200",
    link: "text-rose-900 underline",
    linkSubtle: "text-neutral-800 underline",
    inputBg: "bg-white",
    inputBorder: "border-neutral-300",
    inputText: "text-neutral-900",
    placeholder: "placeholder-neutral-400",
  };
  const dark = {
    pageBg: "bg-[#1c1e26]",
    pageText: "text-neutral-100",
    navBg: "bg-[#1c1e26]/90",
    navBorder: "border-teal-700",
    navTextStrong: "text-white",
    chipActive: "bg-teal-300 text-[#1c1e26] border-teal-400",
    chipInactive: "bg-[#2a2d36] border-[#3a3d46] text-neutral-200 hover:bg-[#333640]",
    btnOutline: "border-neutral-600 text-neutral-100 hover:bg-[#333640]",
    sectionAltBg: "bg-[#22242c]",
    panelBg: "bg-[#2a2d36]",
    panelBorder: "border-[#3a3d46]",
    muted: "text-neutral-300",
    muted2: "text-neutral-400",
    footerBg: "bg-[#1c1e26]",
    footerBorder: "border-teal-700",
    link: "text-teal-300 underline",
    linkSubtle: "text-teal-200 underline",
    inputBg: "bg-[#1c1e26]",
    inputBorder: "border-neutral-600",
    inputText: "text-neutral-100",
    placeholder: "placeholder-neutral-500",
  };
  return theme === "light" ? light : dark;
}

/* ===================== Icons ===================== */
function Icon({ name, className = "h-4 w-4" }) {
  const p = { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6,
    strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "home": return (<svg {...p}><path d="M3 11.5L12 4l9 7.5"/><path d="M5 10.5V20h5v-6h4v6h5v-9.5"/></svg>);
    case "grid": return (<svg {...p}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>);
    case "briefcase": return (<svg {...p}><path d="M3.5 8.5h17A1.5 1.5 0 0122 10v7a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 014 17v-7a1.5 1.5 0 011.5-1.5"/><path d="M8 8.5V6.5A2.5 2.5 0 0110.5 4h3A2.5 2.5 0 0116 6.5v2"/><path d="M2 12.5h20"/></svg>);
    case "tag": return (<svg {...p}><path d="M3 12l8.5 8.5a2 2 0 002.8 0L21 13.8a2 2 0 000-2.8L12.2 2H6a3 3 0 00-3 3v6z"/><circle cx="8" cy="8" r="1.2"/></svg>);
    case "user": return (<svg {...p}><circle cx="12" cy="8" r="3.2"/><path d="M4 20a8 8 0 0116 0"/></svg>);
    case "mail": return (<svg {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>);
    case "sun": return (<svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>);
    case "moon": return (<svg {...p}><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z"/></svg>);
    default: return null;
  }
}

/* ===================== Intro (unchanged behavior) ===================== */
function IntroOverlay({ onClose }) {
  const [phase, setPhase] = useState("typeName");
  const NAME = "PRADEEP MOORTHY";
  const BRAND = "PRADHU PHOTOGRAPHY";
  const [typed, setTyped] = useState("");
  const [step, setStep] = useState(0);
  const typingRef = useRef(null);
  const imgRef = useRef(null);
  const rippleLayerRef = useRef(null);
  const dialogRef = useRef(null);
  const enterBtnRef = useRef(null);

  useEffect(() => {
    enterBtnRef.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === "Enter") onClose();
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const makeRipple = (x, y, withFlash = false) => {
    const host = rippleLayerRef.current;
    if (!host) return;
    const rect = host.getBoundingClientRect();
    const mk = (cls) => {
      const el = document.createElement("span");
      el.className = cls;
      el.style.left = `${x - rect.left}px`;
      el.style.top = `${y - rect.top}px`;
      host.appendChild(el);
      setTimeout(() => el.remove(), cls.includes("flash") ? 360 : 800);
    };
    mk("cin-ripple circle");
    if (withFlash) mk("cin-flash");
  };

  useEffect(() => {
    const str = phase === "typeName" ? NAME : phase === "typeBrand" ? BRAND : "";
    if (!str) return;
    setTyped("");
    setStep(0);
    clearInterval(typingRef.current);
    let i = 0;
    typingRef.current = setInterval(() => {
      i++; setTyped(str.slice(0, i));
      if (i >= str.length) {
        clearInterval(typingRef.current);
        setStep(1);
        setTimeout(() => {
          setStep(2);
          setTimeout(() => { setPhase(phase === "typeName" ? "typeBrand" : "revealImg"); }, 520);
        }, phase === "typeName" ? 600 : 700);
      }
    }, 75);
    return () => clearInterval(typingRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase !== "revealImg") return;
    const t = setTimeout(() => setPhase("titles"), 1400);
    return () => clearTimeout(t);
  }, [phase]);

  const onAnyClick = (e) => makeRipple(e.clientX, e.clientY, true);

  const renderTyping = (text) => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-white text-center">
        <div className={["inline-flex items-center gap-1 font-['Playfair_Display'] uppercase tracking-[0.08em]",
          "text-[clamp(26px,7vw,88px)] leading-none whitespace-nowrap", step === 2 ? "cin-explode-out" : ""].join(" ")}>
          <span>{text}</span>
          {step === 0 ? <span className="cin-caret w-[0.5ch] inline-block align-bottom" /> : null}
        </div>
      </div>
    </div>
  );

  return (
    <div ref={dialogRef} className="fixed inset-0 bg-black text-white" style={{ zIndex: 9999 }}
      role="dialog" aria-modal="true" onClick={onAnyClick}>
      <div ref={rippleLayerRef} className="absolute inset-0 cin-ripple-layer" />
      {phase === "typeName" && renderTyping(typed)}
      {phase === "typeBrand" && renderTyping(typed)}
      <div className={["h-full w-full grid items-center justify-center p-6",
        "md:grid-cols-[640px_1fr] gap-4",
        phase === "typeName" || phase === "typeBrand" ? "opacity-0" : "opacity-100"].join(" ")}>
        <div className="relative cin-image-holder">
          <img ref={imgRef} src={INTRO_LEFT_IMAGE_URL} alt="Intro"
               className={["w-full h-auto object-contain max-h-[78vh]",
                 phase === "revealImg" ? "cin-radial-reveal cin-image-move-in" : "",
                 phase === "titles" ? "opacity-100" : ""].join(" ")} />
          <div className="pointer-events-none absolute inset-0 cin-vignette" />
        </div>
        <div className={["flex flex-col items-end gap-3 text-right whitespace-nowrap select-none",
          phase === "titles" ? "opacity-100" : "opacity-0"].join(" ")}>
          <div className={["text-[12px] tracking-[0.25em] opacity-80",
            phase === "titles" ? "cin-overshoot-in" : ""].join(" ")}>VISUAL & HONEST STORIES</div>
          <h1 className={["mt-1 font-['Playfair_Display'] uppercase",
            "text-[clamp(32px,6vw,72px)] leading-tight",
            phase === "titles" ? "cin-overshoot-in delay-[480ms]" : ""].join(" ")}>PRADEEP MOORTHY</h1>
          <div className={["mt-0.5 font-['Playfair_Display'] uppercase",
            "text-[clamp(24px,4.5vw,50px)] leading-tight",
            phase === "titles" ? "cin-overshoot-in delay-[850ms]" : ""].join(" ")}>PRADHU PHOTOGRAPHY</div>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }}
                  className={["rounded-full border border-white/40 px-5 py-2 text-sm",
                    "hover:bg-white/10 transition mt-6",
                    phase === "titles" ? "cin-fade-in-delayed" : "opacity-0"].join(" ")} ref={enterBtnRef}>
            Enter ↵
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================== GH helper ===================== */
const GH_API = "https://api.github.com";
const IMG_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
const isImageName = (n="") => IMG_EXTS.some((e) => n.toLowerCase().endsWith(e));
async function ghListFolder(owner, repo, path, ref) {
  const key = `pradhu:gh:${owner}/${repo}@${ref}/${path}`;
  const tkey = key + ":ts";
  const now = Date.now();
  const nocache = new URLSearchParams(window.location.search).get("refresh") === "1";
  try {
    const ts = Number(sessionStorage.getItem(tkey) || 0);
    if (!nocache && ts && now - ts < GH_CACHE_TTL_MS) {
      const cached = JSON.parse(sessionStorage.getItem(key) || "[]");
      return cached;
    }
  } catch {}
  try {
    if (MEDIA_MANIFEST_URL) {
      const r = await fetch(MEDIA_MANIFEST_URL, { cache: "no-store" });
      if (r.ok) {
        const manifest = await r.json();
        const list = (manifest[path] || []).filter(Boolean).map((fullPath) => ({
          name: fullPath.split("/").pop(),
          url: `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${fullPath}`,
          sha: fullPath, size: 0,
        }));
        if (list.length) {
          sessionStorage.setItem(key, JSON.stringify(list));
          sessionStorage.setItem(tkey, String(now));
          return list;
        }
      }
    }
  } catch {}
  const url = `${GH_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(ref)}`;
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) return [];
  const json = await res.json();
  const files = Array.isArray(json) ? json.filter((it) => it.type === "file") : [];
  const imgs = files.filter((f) => isImageName(f.name))
    .map((f) => ({ name: f.name, url: f.download_url, sha: f.sha, size: f.size }));
  sessionStorage.setItem(key, JSON.stringify(imgs));
  sessionStorage.setItem(tkey, String(now));
  return imgs;
}

/* ===================== Hero ===================== */
function Hero() {
  const waText = encodeURIComponent("Hi! I’d like to book a shoot via your website (Hero CTA).");
  const waHref =
    WHATSAPP_NUMBER && !WHATSAPP_NUMBER.includes("X")
      ? `https://wa.me/${WHATSAPP_NUMBER.replace(/[^\d]/g, "")}?text=${waText}&utm_source=site&utm_medium=hero_cta&utm_campaign=booking`
      : "";
  return (
    <section className="relative min-h-[68vh] md:min-h-[78vh]">
      <img src={HERO_BG_URL} alt="" aria-hidden="true"
           className="absolute inset-0 z-0 h-full w-full object-cover pointer-events-none" loading="eager" />
      <div className="absolute inset-0 z-[1] bg-black/45" />
      <div className="absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 z-[2]">
        <div className={`${CONTAINER} pb-10 md:pb-14 text-white`}>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            Collect the Treasure. <span className="opacity-90">ONE PIECE at a time.</span>
          </h1>
          <p className="mt-3 max-w-3xl text-sm md:text-base text-neutral-200">
            Fashion · Portraits · Candids · Portfolio · Professional headshots · Events .
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a href="#/contact"
               className="rounded-xl bg-white text-black px-5 py-2.5 font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/70"
               aria-label="Book a Shoot"
               onClick={() => trackEvent("cta_click", { location: "hero", cta: "book" })}>
              Book a Shoot
            </a>
            {waHref && (
              <a href={waHref} target="_blank" rel="noreferrer"
                 className="rounded-xl border border-white/40 px-3 py-2 text-sm text-white/90 hover:bg-white/10"
                 onClick={() => trackEvent("cta_click", { location: "hero", cta: "whatsapp" })}>
                WhatsApp
              </a>
            )}
            <a href="tel:+919322584410"
               className="rounded-xl border border-white/40 px-3 py-2 text-sm text-white/90 hover:bg-white/10"
               onClick={() => trackEvent("cta_click", { location: "hero", cta: "call" })}>
              Call
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== FAQ / Services / Pricing (from your code) ===================== */
function FaqSection({ T, showTitle = true }) {
  const items = [
    { q: "How do I receive photos?", a: "Private, watermark-free online gallery with high-res downloads." },
    { q: "How to book?", a: "Send an enquiry with date, service, and location." },
    { q: "Do you travel?", a: "Yes. Travel fee applies outside the base city." },
    { q: "Studio?", a: "Yes. Rentals available; I’ll shortlist spaces for your concept." },
  ];
  return (
    <section className="py-2">
      {showTitle && <h2 className={`text-3xl md:text-4xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}>FAQ</h2>}
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {items.map((it) => (
          <details key={it.q} className={`rounded-2xl border p-5 shadow-sm ${T.panelBg} ${T.panelBorder}`}>
            <summary className={`cursor-pointer font-medium ${T.navTextStrong}`}>{it.q}</summary>
            <p className={`mt-2 text-sm ${T.muted}`}>{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
function ServicesPricingPage({ T }) {
  const tiers = [
    {
      name: "Portrait Session",
      price: "from ₹4,500",
      includes: [
        "60–90 min · up to 2 outfits",
        "6 lightly retouched hero shots",
        "Curated 3–5 edited images per outfit",
        "Location & styling guidance",
      ],
    },
    {
      name: "Headshots (Solo/Team)",
      price: "from ₹5,000",
      includes: [
        "Consistent lighting & framing",
        "On-location or studio",
        "Curated 3–5 edited images per outfit",
      ],
    },
    {
      name: "Fashion / Editorial (Half-day)",
      price: "from ₹10,000",
      includes: [
        "Pre-production & moodboard",
        "Lighting & look management",
        "Team coordination on request",
      ],
    },
    {
      name: "Event Coverage (2 hrs)",
      price: "from ₹8,000",
      includes: [
        "Focused coverage of key moments",
        "Colour-graded selects",
        "Extendable by hour",
      ],
    },
  ];

  return (
    <section className="py-6">
      {/* One H1 for the page */}
      <h1 className={`text-4xl md:text-5xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}>
        Services & Pricing
      </h1>
      <p className={`mt-2 ${T.muted}`}>
        Multi-genre coverage designed around your brief. Share your concept and I’ll tailor looks,
        lighting windows and locations. Final quotes depend on scope, team and timelines.
      </p>

      {/* Services overview (cards) */}
      <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[
          ["Portraits & Headshots", [
            "60–90 min · up to 2 outfits",
            "Natural retouching with clean skin tones",
            "Wardrobe & posing guidance",
            "On-location or studio",
          ]],
          ["Fashion / Editorial", [
            "Moodboard & looks planning",
            "On-set lighting & styling coordination",
            "Clean, contemporary colour and skin tones",
            "Half-day / full-day options",
          ]],
          ["Events & Candids", [
            "By hours or blocks",
            "Key moments & people, storytelling frames",
            "Balanced set of colour-graded selects",
          ]],
        ].map(([title, lines]) => (
          <article key={title} className={`rounded-2xl border p-5 shadow-sm ${T.panelBg} ${T.panelBorder}`}>
            <h2 className={`text-lg font-medium ${T.navTextStrong}`}>{title}</h2>
            <ul className={`mt-2 text-sm list-disc pl-5 ${T.muted}`}>
              {lines.map((l) => <li key={l}>{l}</li>)}
            </ul>
          </article>
        ))}
      </div>

      {/* Pricing tiers */}
      <div className="mt-10">
        <h2 className={`text-2xl md:text-3xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}>
          Indicative Packages
        </h2>
        <p className={`mt-2 ${T.muted}`}>Request a custom estimate for multi-day shoots, larger teams or special deliverables.</p>

        <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <article key={t.name} className={`rounded-2xl border p-5 shadow-sm ${T.panelBg} ${T.panelBorder}`}>
              <div className="flex items-baseline justify-between">
                <h3 className={`text-lg font-medium ${T.navTextStrong}`}>{t.name}</h3>
                <span className="text-sm opacity-80">{t.price}</span>
              </div>
              <ul className={`mt-3 text-sm list-disc pl-5 ${T.muted}`}>
                {t.includes.map((l) => <li key={l}>{l}</li>)}
              </ul>
              <a
                href="#/contact"
                className={`${T.link} text-sm mt-4 inline-block`}
                onClick={() => trackEvent("nav_click", { to: "contact_from_services_pricing" })}
              >
                Request a quote →
              </a>
            </article>
          ))}
        </div>
      </div>

      {/* Add-ons + Policy */}
      <div className="mt-10 grid md:grid-cols-2 gap-6">
        <div className={`rounded-2xl border p-5 ${T.panelBg} ${T.panelBorder}`}>
          <h2 className={`text-lg font-medium ${T.navTextStrong}`}>Add-ons</h2>
          <ul className={`mt-2 text-sm list-disc pl-5 ${T.muted}`}>
            <li>HMUA / Styling coordination (billed at cost)</li>
            <li>Studio rental (venue rates apply)</li>
            <li>Assistant / extra lighting</li>
            <li>Travel & stay outside base city (at actuals)</li>
            <li>Rush teasers / same-day selects</li>
            <li>Prints, albums and frames</li>
          </ul>
        </div>

        <div className={`rounded-2xl border p-5 ${T.panelBg} ${T.panelBorder}`}>
          <h2 className={`text-lg font-medium ${T.navTextStrong}`}>Turnaround & Booking</h2>
          <ul className={`mt-2 text-sm list-disc pl-5 ${T.muted}`}>
            <li>Portraits / Fashion: 7–12 days; Weddings/Events: ~3–4 weeks for full gallery.</li>
            <li>Entire shoot previews shared within 3–5 days.</li>
            <li>Editing timeline starts after shortlisting.</li>
            <li>Advance to reserve date; adjustable in final invoice.</li>
            <li>One complimentary reschedule with 72h notice (subject to availability).</li>
            <li>Outstation travel/stay billed at actuals; two editing revision rounds included.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}




/* ===================== Portfolio Landing + Page (kept) ===================== */
const TILE_COVERS = {};
const pickCoverForCategory = (images = [], label = "") => {
  if (!images?.length) return "";
  const want = TILE_COVERS[label];
  if (want) {
    const m = images.find((it) => (it.name || "").toLowerCase() === want.toLowerCase().trim());
    if (m) return m.url;
  }
  const byToken = images.find((it) => /(^|[-_])(cover|tile|hero|thumb)([-_]|\.|$)/i.test(it.name || ""));
  if (byToken) return byToken.url;
  const byLeadingZero = images.find((it) => /^0+/.test(it.name || ""));
  if (byLeadingZero) return byLeadingZero.url;
  return images[0]?.url || "";
};

function PortfolioLanding({ T, cats, states, openCat, initialIdx = 0 }) {
  const [active, setActive] = useState(0);
  const trackRef = useRef(null);
  const wrapRef = useRef(null);
  const allLoaded = states.every((s) => !s.loading);
  const anyImages = states.some((s) => (s.images?.length || 0) > 0);
  const showMediaBanner = allLoaded && !anyImages;

  useEffect(() => {
    if (!trackRef.current) return;
    const idx = Math.min(cats.length - 1, Math.max(0, initialIdx));
    setActive(idx);
    requestAnimationFrame(() => {
      const el = trackRef.current?.querySelector(`[data-idx="${idx}"]`);
      el?.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" });
    });
  }, [initialIdx, cats.length]);

  useEffect(() => {
    const root = trackRef.current;
    if (!root) return;
    const update = () => {
      const slides = Array.from(root.querySelectorAll("[data-idx]"));
      if (!slides.length) return;
      const center = root.scrollLeft + root.clientWidth / 2;
      let best = 0, bestDist = Infinity;
      slides.forEach((el, i) => {
        const mid = el.offsetLeft + el.offsetWidth / 2;
        const d = Math.abs(mid - center);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      setActive(best);
    };
    update();
    root.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { root.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  const scrollToIdx = (idx) => {
    const el = trackRef.current?.querySelector(`[data-idx="${Math.max(0, Math.min(cats.length - 1, idx))}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };
  const go = (d) => scrollToIdx(active + d);

  return (
    <section className="py-2">
      <header className="mb-4">
        <h1 className={`text-4xl md:text-5xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}>Portfolio</h1>
        <p className={`mt-2 ${T.muted}`}>Browse by category.</p>
        {showMediaBanner && (
          <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-sm p-3">
            Couldn’t load images. Ensure your manifest.json paths are valid, or try <code>?refresh=1</code>.
          </div>
        )}
      </header>

      <div ref={wrapRef} className="relative">
        <div
          ref={trackRef}
          className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto px-2 sm:px-3 md:px-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="region" aria-roledescription="carousel" aria-label="Category cards" tabIndex={0}
        >
          <div className="flex-shrink-0 w-[6%] sm:w-[10%] md:w-[14%]" aria-hidden="true" />
          {cats.map((c, i) => {
            const st = states[i] || { images: [], loading: true, error: "" };
            const cover = pickCoverForCategory(st.images, c.label);
            const isActive = i === active;
            return (
              <article key={c.label} data-idx={i}
                       className="snap-center relative flex-shrink-0 w-[64%] sm:w-[44%] md:w-[30%] lg:w-[24%] xl:w-[20%]">
                <button type="button"
                        onClick={() => { openCat(c.label); trackEvent("portfolio_card_open", { category: c.label }); }}
                        className={["group block w-full rounded-2xl overflow-hidden border shadow-sm transition-transform duration-200",
                          isActive ? "ring-2 ring-white/80" : "", T.panelBg, T.panelBorder].join(" ")}
                        aria-label={`Open ${c.label}`}>
                  <div className="aspect-[3/4] relative">
                    {cover ? <img src={cover} alt={c.label} className="absolute inset-0 h-full w-full object-cover" loading="lazy" /> :
                      <div className="absolute inset-0 bg-neutral-600/30" />}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50" />
                    <div className="absolute left-3 right-3 bottom-3">
                      <h3 className="text-white font-['Playfair_Display'] uppercase tracking-[0.08em] text-[clamp(18px,2.2vw,28px)] drop-shadow">
                        {c.label}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-white/90 text-[11px] opacity-90">Enter →</span>
                    </div>
                  </div>
                </button>
              </article>
            );
          })}
          <div className="flex-shrink-0 w-[6%] sm:w-[10%] md:w-[14%]" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

function PortfolioPage({ T, cat, state, onBack }) {
  const items = state.images || [];
  const blurb = GH_CATEGORIES_EXT[cat.label]?.blurb || "";
  const [activeIndex, setActiveIndex] = useState(0);
  const [lbIdx, setLbIdx] = useState(-1);
  const containerRef = useRef(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const update = () => {
      const slides = Array.from(root.querySelectorAll("[data-idx]"));
      if (!slides.length) return;
      const center = root.scrollLeft + root.clientWidth / 2;
      let best = 0, bestDist = Infinity;
      slides.forEach((el, i) => {
        const mid = el.offsetLeft + el.offsetWidth / 2;
        const d = Math.abs(mid - center);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      setActiveIndex(best);
    };
    update();
    root.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { root.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  const goTo = (idx) => {
    const el = containerRef.current?.querySelector(`[data-idx="${idx}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <section className="py-2">
      <div className="mb-4 sticky top-[72px] z-[1] backdrop-blur">
        <div className="pt-3">
          <button className={`${T.linkSubtle} text-sm`} onClick={onBack}>Portfolio</button>
          <span className={`mx-2 ${T.muted2}`}>/</span>
          <span className={`text-sm ${T.navTextStrong}`}>{cat.label}</span>
        </div>
        <h1 className={`mt-1 text-4xl md:text-5xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}>
          {cat.label}
        </h1>
        {blurb ? <p className={`mt-1 ${T.muted}`}>{blurb}</p> : null}
      </div>

      {!items.length ? (
        <div className={`${T.muted}`}>No images yet for {cat.label}.</div>
      ) : (
        <>
          <div ref={containerRef}
               role="region" aria-roledescription="carousel" aria-label={`${cat.label} images`}
               className="mx-auto max-w-[1600px] overflow-x-auto snap-x snap-mandatory flex items-stretch gap-4 px-2 pb-6
                          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none">
            <div className="flex-shrink-0 w-[9%] sm:w-[14%] md:w-[18%] lg:w-[21%]" aria-hidden="true" />
            {items.map((it, i) => (
              <figure key={it.sha || i} data-idx={i}
                      className={`relative flex-shrink-0 w-[82%] sm:w-[72%] md:w-[64%] lg:w-[58%] snap-center transition-transform duration-300
                                 ${i === activeIndex ? "scale-[1.01]" : "scale-[0.995]"}`}>
                <div className={`rounded-2xl ${i === activeIndex ? "shadow-lg" : "shadow-sm"}`}>
                  <img src={it.url} alt={cat.label} className="mx-auto rounded-2xl object-contain max-h-[68vh] w-auto h-[64vh] cursor-zoom-in"
                       loading="lazy" onClick={() => setLbIdx(i)} />
                </div>
              </figure>
            ))}
            <div className="flex-shrink-0 w-[9%] sm:w-[14%] md:w-[18%] lg:w-[21%]" aria-hidden="true" />
          </div>

          {/* Thumbs */}
          <div className="mt-2 flex justify-center">
            <div className="flex gap-2 overflow-x-auto px-2 pb-1" style={{ scrollbarWidth: "none" }}>
              {items.map((it, i) => (
                <button key={`thumb-${i}`} onClick={() => goTo(i)}
                        className={`h-14 w-10 rounded-md overflow-hidden border transition
                                   ${i === activeIndex ? "opacity-100 ring-2 ring-white" : "opacity-60 hover:opacity-90"}`}>
                  <img src={it.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Lightbox */}
      {lbIdx >= 0 && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
             role="dialog" aria-modal="true" onClick={() => setLbIdx(-1)}>
          <img src={items[lbIdx].url} alt={cat.label} className="max-h-[92vh] max-w-[92vw] object-contain cursor-zoom-out" />
        </div>
      )}
    </section>
  );
}

function Portfolio({ T }) {
  const [states, setStates] = useState(() => GH_CATEGORIES.map(() => ({ loading: true, error: "", images: [] })));
  const [view, setView] = useState("landing"); // "landing" | "page"
  const [activeIdx, setActiveIdx] = useState(-1);

  const openCat = (label) => {
    const idx = GH_CATEGORIES.findIndex((c) => c.label.toLowerCase() === label.toLowerCase());
    if (idx < 0) return;
    try { sessionStorage.setItem("pradhu:lastCat", String(idx)); } catch {}
    setActiveIdx(idx);
    setView("page");
  };
  const goLanding = () => { setView("landing"); setActiveIdx(-1); };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const results = await Promise.all(GH_CATEGORIES.map(async (cat) => {
        try { const list = await ghListFolder(GH_OWNER, GH_REPO, cat.path, GH_BRANCH);
              return { loading: false, error: "", images: list }; }
        catch (e) { return { loading: false, error: e?.message || "Failed to load", images: [] }; }
      }));
      if (!cancelled) setStates(results);
    })();
    return () => { cancelled = true; };
  }, []);

  if (view === "page" && activeIdx >= 0) {
    const cat = GH_CATEGORIES[activeIdx];
    const st = states[activeIdx] || { loading: true, error: "", images: [] };
    return <PortfolioPage T={T} cat={cat} state={st} onBack={goLanding} />;
  }

  const lastIdx = (() => {
    try { const n = Number(sessionStorage.getItem("pradhu:lastCat") || 0); return Number.isFinite(n) ? n : 0; }
    catch { return 0; }
  })();

  return <PortfolioLanding T={T} cats={GH_CATEGORIES} states={states} openCat={openCat} initialIdx={lastIdx} />;
}

/* ===================== About + Contact (Booking) ===================== */
function AboutBlock({ T }) {
  return (
    <section className="py-6">
      <h1 className={`text-4xl md:text-5xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}>About PRADHU</h1>
      <p className={`mt-3 ${T.muted}`}>
        Aspiring photographer from Kanchipuram, working across fashion, portraits, candids and events. Client-first process
        with tailored recommendations on looks, lighting, locations and timelines.
      </p>
      <ul className={`mt-4 text-sm list-disc pl-5 space-y-1 ${T.muted}`}>
        <li>Genres: Fashion, High Fashion, Portraits, Editorials, Candids, Portfolio, Headshots, Street, Studio</li>
        <li>Kit: Nikon D7500, softboxes (octa & strip), multiple flashes, modifiers</li>
        <li>{SERVICE_CITIES}</li>
      </ul>
      <div className="mt-5 flex items-center gap-3">
        <a
          href={`https://www.instagram.com/${IG_USERNAME}/`}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex items-center justify-center h-12 w-12 rounded-2xl border ${T.panelBorder} ${T.panelBg}`}
          title="Instagram"
        >
          <Icon name="grid" className="h-5 w-5" />
        </a>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className={`inline-flex items-center justify-center h-12 w-12 rounded-2xl border ${T.panelBorder} ${T.panelBg}`}
          title="Email"
        >
          <Icon name="mail" className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
}

function Input({ T, label, name, value, onChange, type = "text", required = false, placeholder = "" }) {
  return (
    <div>
      <label htmlFor={name} className={`text-sm ${T.muted}`}>{label} {required ? <span className="text-red-500">*</span> : null}</label>
      <input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
             className={`mt-1 w-full rounded-xl border px-3 py-2 ${T.inputBg} ${T.inputBorder} ${T.inputText} ${T.placeholder}`} />
    </div>
  );
}

function ContactPage({ T }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "Portraits", city: "Pune", date: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [note, setNote] = useState({ kind: "", text: "" });
  const [whatsCTA, setWhatsCTA] = useState("");

  const minDateStr = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() + 2);
    const off = d.getTimezoneOffset(); const local = new Date(d.getTime() - off * 60000);
    return local.toISOString().slice(0, 10);
  }, []);
  const fmtHuman = (s) => {
    if (!s) return "";
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  };
  const onChange = (e) => { setWhatsCTA(""); setNote({ kind: "", text: "" }); setForm({ ...form, [e.target.name]: e.target.value }); };
  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const normalizePhone = (v) => v.replace(/[^\d]/g, "");
  const isValidINPhone = (v) => /^(?:\+?91)?[6-9]\d{9}$/.test(normalizePhone(v)) || /^0[6-9]\d{9}$/.test(normalizePhone(v));

  const onSubmit = async (e) => {
    e.preventDefault();
    const missing = [];
    if (!form.name.trim()) missing.push("Name");
    if (!form.email.trim()) missing.push("Email");
    if (!form.phone.trim()) missing.push("Phone");
    if (form.date && form.date < minDateStr) missing.push(`Preferred Date (≥ ${fmtHuman(minDateStr)})`);
    if (missing.length) return setNote({ kind: "error", text: `Please fill: ${missing.join(", ")}` });
    if (!isValidEmail(form.email)) return setNote({ kind: "error", text: "Enter a valid email address." });
    if (!isValidINPhone(form.phone)) return setNote({ kind: "error", text: "Enter a valid Indian mobile." });

    setSubmitting(true);
    try {
      await fetch(SHEET_WEB_APP, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, source: "website" }) });
      trackEvent("form_submit", { location: "contact", status: "success", service: form.service, city: form.city || "NA" });

      const waText = encodeURIComponent(
        `Hi Pradhu! This is ${form.name}. I just sent an enquiry from your website.\nService: ${form.service}\nCity: ${form.city}\nPreferred date: ${form.date ? fmtHuman(form.date) : "TBD"}\nDetails: ${form.message || "—"}`
      );
      const utm = "utm_source=site&utm_medium=booking_success_cta&utm_campaign=booking";
      const waHref = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^\d]/g, "")}?text=${waText}&${utm}`;
      setNote({ kind: "success", text: "Thanks! Your enquiry was submitted. I’ll reply shortly." });
      setWhatsCTA(waHref);
      setForm({ name: "", email: "", phone: "", service: "Portraits", city: "Pune", date: "", message: "" });
    } catch (err) {
      setNote({ kind: "error", text: "Couldn’t submit right now. Please try again." });
      trackEvent("form_submit", { location: "contact", status: "error", error: String(err?.message || "unknown") });
    } finally { setSubmitting(false); }
  };

  return (
    <section className="py-6" id="contact">
      <h1 className={`text-4xl md:text-5xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}>Contact</h1>
      <p className={`mt-2 ${T.muted}`}>Share details and I’ll reply with availability and a quote.</p>

      {/* About summary block on top for this page */}
      <div className="mt-6"><AboutBlock T={T} /></div>

      <form onSubmit={onSubmit} className={`mt-4 rounded-2xl border p-6 shadow-sm ${T.panelBg} ${T.panelBorder}`}>
        <div className="grid grid-cols-1 gap-4">
          <Input T={T} label="Name" name="name" value={form.name} onChange={onChange} required />
          <Input T={T} label="Email" name="email" type="email" value={form.email} onChange={onChange} required />
          <Input T={T} label="Phone" name="phone" type="tel" value={form.phone} onChange={onChange} required placeholder="+91-XXXXXXXXXX" />

          <div>
            <label className={`text-sm ${T.muted}`}>Preferred Date</label>
            <input name="date" type="date" min={minDateStr} value={form.date}
                   onKeyDown={(e) => e.preventDefault()} onPaste={(e) => e.preventDefault()}
                   onChange={(e) => {
                     let v = e.target.value;
                     if (v && v < minDateStr) { v = minDateStr; setNote({ kind: "info", text: `Earliest available date is ${fmtHuman(minDateStr)}.` }); }
                     setForm({ ...form, date: v });
                   }}
                   className={`mt-1 w-full rounded-xl border px-3 py-2 ${T.inputBg} ${T.inputBorder} ${T.inputText} ${T.placeholder}`} />
            <p className="text-xs opacity-70 mt-1">Earliest selectable: {fmtHuman(minDateStr)}</p>
          </div>

          <div>
            <label className={`text-sm ${T.muted}`}>Message</label>
            <textarea name="message" value={form.message} onChange={onChange} rows={5}
                      className={`mt-1 w-full rounded-xl border px-3 py-2 ${T.inputBg} ${T.inputBorder} ${T.inputText} ${T.placeholder}`}
                      placeholder="Shoot location, timings, concept, references, usage (personal/commercial), etc." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`text-sm ${T.muted}`}>Service</label>
              <select name="service" className={`mt-1 w-full rounded-xl border px-3 py-2 ${T.inputBg} ${T.inputBorder} ${T.inputText}`}
                      value={form.service} onChange={onChange}>
                {["Portraits", "Fashion", "Candids", "Street", "Events", "Other"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={`text-sm ${T.muted}`}>City</label>
              <select name="city" className={`mt-1 w-full rounded-xl border px-3 py-2 ${T.inputBg} ${T.inputBorder} ${T.inputText}`}
                      value={form.city} onChange={onChange}>
                <option>Pune</option><option>Mumbai</option><option>Chennai</option><option>Bengaluru</option><option>Other</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={submitting}
                    className="rounded-xl bg-neutral-900 text-white px-4 py-2 font-medium hover:opacity-90 disabled:opacity-60"
                    onClick={() => trackEvent("cta_click", { location: "contact_form", cta: "submit" })}>
              {submitting ? "Submitting…" : "Send Enquiry"}
            </button>
            {note.text ? (
              <span className={`text-sm ${note.kind === "error" ? "text-red-600" : note.kind === "success" ? "text-emerald-600" : "opacity-80"}`}>
                {note.text}
              </span>
            ) : null}
            {whatsCTA && (
              <a href={whatsCTA} target="_blank" rel="noreferrer"
                 className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50"
                 onClick={() => trackEvent("cta_click", { location: "contact_success", cta: "whatsapp" })}>
                Continue on WhatsApp
              </a>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}

/* ===================== Reviews Page (stub) ===================== */
function ReviewsPage({ T }) {
  return (
    <section className="py-6">
      <h1 className={`text-4xl md:text-5xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}>Reviews</h1>
      <p className={`mt-2 ${T.muted}`}>Coming soon — client testimonials with headshots and ratings.</p>
      {/* Later: add schema.org AggregateRating + individual Review items */}
    </section>
  );
}

/* ===================== Sticky CTA (hidden on Contact when form visible) ===================== */
function StickyCTA({ T, hide }) {
  if (hide) return null;
  const waText = encodeURIComponent("Hi! I’d like to book a shoot via your website (Sticky CTA).");
  const waHref = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^\d]/g, "")}?text=${waText}&utm_source=site&utm_medium=sticky_cta&utm_campaign=booking`;
  return (
    <>
      <div className="hidden sm:flex fixed right-4 bottom-6 z-[70] items-center gap-2 rounded-full shadow-lg border px-3 py-2 backdrop-blur bg-white/90 text-black">
        <a href="#/contact" className="rounded-full bg-black text-white px-4 py-2 text-sm font-medium hover:opacity-90"
           onClick={() => trackEvent("cta_click", { location: "sticky", cta: "book" })}>Book a Shoot</a>
        <a href={waHref} target="_blank" rel="noreferrer"
           className="rounded-full border px-3 py-2 text-sm hover:bg-black/5"
           onClick={() => trackEvent("cta_click", { location: "sticky", cta: "whatsapp" })}>WhatsApp</a>
      </div>
      <div className="sm:hidden fixed inset-x-0 bottom-0 z-[70]">
        <div className="mx-2 mb-2 rounded-2xl shadow-xl border overflow-hidden bg-white/95">
          <div className="flex">
            <a href="#/contact" className="flex-1 bg-black text-white py-3 font-medium text-center"
               onClick={() => trackEvent("cta_click", { location: "sticky_mobile", cta: "book" })}>Book a Shoot</a>
            <a href={waHref} target="_blank" rel="noreferrer"
               className="w-[44%] bg-white py-3 text-center text-sm font-medium"
               onClick={() => trackEvent("cta_click", { location: "sticky_mobile", cta: "whatsapp" })}>WhatsApp</a>
          </div>
        </div>
      </div>
    </>
  );
}

/* ===================== Main App (router) ===================== */
export default function App() {
  const [theme, setTheme] = useState(() => {
    try { return sessionStorage.getItem("pradhu:theme") || "dark"; } catch { return "dark"; }
  });
  const T = useThemeTokens(theme);
  const [showIntro, setShowIntro] = useState(() => {
    if (!INTRO_ENABLED) return false;
    const url = new URL(window.location.href);
    const forced = url.searchParams.get(INTRO_FORCE_QUERY) === "1" || url.hash === INTRO_FORCE_HASH;
    if (forced) return true;
    if (!INTRO_REMEMBER) return true;
    return sessionStorage.getItem("pradhu:intro:dismissed") !== "1";
  });
  const closeIntro = () => { setShowIntro(false); try { if (INTRO_REMEMBER) sessionStorage.setItem("pradhu:intro:dismissed", "1"); } catch {} };

  const [path, nav] = useHashRoute();
  useEffect(() => { if (!window.location.hash) nav("/"); }, []); // default to home
  useEffect(() => { try { sessionStorage.setItem("pradhu:theme", theme); } catch {} }, [theme]);

  const isContact = path === "/contact";
  const NAV_BRAND = "PRADHU PHOTOGRAPHY";

  return (
    <main aria-hidden={showIntro ? "true" : undefined}
          className={`min-h-screen ${T.pageBg} ${T.pageText} font-['Inter'] ${theme === "light" ? "bg-dots-light" : "bg-dots-dark"}`}>
      <HeadFonts />
      {showIntro && <IntroOverlay onClose={closeIntro} />}

      {/* NAVBAR (single menu) */}
      <header className={`sticky top-0 z-50 backdrop-blur border-b ${T.navBg} ${T.navBorder}`}>
        <nav className={`${CONTAINER} py-4 lg:py-5 grid grid-cols-[1fr_auto_auto] items-center gap-3`}>
          <div className="min-w-0">
            <p className={`font-['Playfair_Display'] uppercase tracking-[0.08em] leading-none ${T.navTextStrong}
                           text-[clamp(20px,2.4vw,40px)] whitespace-nowrap`}>{NAV_BRAND}</p>
          </div>
          <ul className="hidden lg:flex items-center gap-2 text-sm">
            {NAV_ITEMS.map(({ label, id, icon }) => (
              <li key={id}>
                <a href={`#${id}`}
                   onClick={() => trackEvent("nav_click", { to: id })}
                   className={`relative group flex items-center gap-2 px-3 py-2 rounded-2xl border transition shadow-sm ${
                     path === id ? T.chipActive : T.chipInactive}`}>
                  <Icon name={icon} className={`h-4 w-4 ${path === id ? "opacity-100" : "opacity-60"}`} />
                  <span className="text-sm">{label}</span>
                </a>
              </li>
            ))}
          </ul>
          <ThemeSlider theme={theme} setTheme={setTheme} />
        </nav>
      </header>

      {/* ROUTES */}
      {path === "/" && (
        <>
          <Hero />
          <div className={`${CONTAINER} py-10`}>
            {/* Quick tiles linking to pages */}
            <div className="flex gap-3 overflow-x-auto whitespace-nowrap pb-2" style={{ scrollbarWidth: "none" }}>
              {[
                { id: "/portfolio", label: "Portfolio", icon: "grid" },
                { id: "/services", label: "Services", icon: "briefcase" },
                { id: "/pricing", label: "Pricing", icon: "tag" },
                { id: "/about", label: "About", icon: "user" },
                { id: "/contact", label: "Contact", icon: "mail" },
              ].map((t) => (
                <a key={t.id} href={`#${t.id}`}
                   className={`flex items-center gap-2 rounded-2xl border px-4 py-2 transition shadow-sm ${T.chipInactive}`}
                   onClick={() => trackEvent("tiles_click", { to: t.id })}>
                  <Icon name={t.icon} className="h-4 w-4 opacity-60" />
                  <span className="text-sm">{t.label}</span>
                </a>
              ))}
            </div>
          </div>
        </>
      )}

      {path === "/portfolio" && (
        <div className={`${CONTAINER} py-12`}>
          <Portfolio T={T} />
        </div>
      )}
      {path === "/services" && (
  <div className={`${CONTAINER} py-12`}>
    <ServicesPricingPage T={T} />
  </div>
)}

      {path === "/about" && (
        <div className={`${CONTAINER} py-12`}>
          <AboutBlock T={T} />
          <FaqSection T={T} showTitle />
        </div>
      )}
      {path === "/reviews" && (
        <div className={`${CONTAINER} py-12`}>
          <ReviewsPage T={T} />
        </div>
      )}
      {path === "/contact" && (
        <div className={`${CONTAINER} py-12`}>
          <ContactPage T={T} />
        </div>
      )}
      {path === "/404" && (
        <div className={`${CONTAINER} py-20`}>
          <h1 className="text-3xl font-semibold">Page not found</h1>
          <p className="mt-2">Go back <a className="underline" href="#/">home</a>.</p>
        </div>
      )}

      {/* Sticky CTA (hidden on Contact) */}
      <StickyCTA T={T} hide={isContact} />

      {/* FOOTER with basic NAP note placeholder */}
      <footer className={`border-t ${T.footerBorder} ${T.footerBg}`}>
        <div className={`${CONTAINER} py-10 text-sm`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <p className={T.muted}>© {new Date().getFullYear()} PRADHU — All rights reserved.</p>
            <p className={T.muted}>Pune · pradhuphotography@gmail.com · +91 93225 84410</p>
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
      <div className="absolute inset-0 rounded-full border border-neutral-300 bg-neutral-100" />
      <div className={`absolute top-0 left-0 h-full w-1/2 rounded-full shadow-sm transition-transform duration-200 ${
        isDark ? "translate-x-full bg-neutral-900" : "translate-x-0 bg-white border border-neutral-300"}`} aria-hidden="true" />
      <div className="relative z-10 grid grid-cols-2 h-full">
        <button type="button" role="tab" aria-selected={!isDark} onClick={setLight}
                className="flex items-center justify-center gap-1.5 px-3 h-full">
          <Icon name="sun" className={`h-4 w-4 ${isDark ? "opacity-40 text-neutral-600" : "opacity-100 text-neutral-900"}`} />
          <span className={`text-xs ${isDark ? "opacity-50 text-neutral-700" : "opacity-100 text-neutral-900 font-medium"}`}>Light</span>
        </button>
        <button type="button" role="tab" aria-selected={isDark} onClick={setDark}
                className="flex items-center justify-center gap-1.5 px-3 h-full">
          <Icon name="moon" className={`h-4 w-4 ${isDark ? "opacity-100 text-white" : "opacity-40 text-neutral-600"}`} />
          <span className={`text-xs ${isDark ? "opacity-100 text-white font-medium" : "opacity-50 text-neutral-700"}`}>Dark</span>
        </button>
      </div>
    </div>
  );
}
