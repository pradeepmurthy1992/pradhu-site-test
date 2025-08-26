import React, { useEffect, useMemo, useRef, useState } from "react";

/* ============================================================
   PRADHU — Dual Theme (Light / Dark) + Editorial Intro + Portfolio Landing & Pages
   - Portfolio landing: magazine-style tiles (cover image + big uppercase serif)
   - Portfolio page: single centered tall images + right progress rail
   - About + Enquire/Book remains always visible
============================================================ */

/* ===================== CONFIG ===================== */
const INTRO_ENABLED = true;
const INTRO_BRAND = "PRADEEP";
const INTRO_NAME = "Pradhu Photography";
const INTRO_AUTO_DISMISS_MS = 0;
const INTRO_LEFT_IMAGE_URL =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop";

const INTRO_REMEMBER = false;
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
const GH_CACHE_TTL_MS = 5 * 60 * 1000;

// Brand / contact
const CONTACT_EMAIL = "pradhuphotography@gmail.com";
const SERVICE_CITIES =
  "Pune · Mumbai · Chennai · Bengaluru · available pan-India";
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
const NAV_BRAND = "PRADHU PHOTOGRAPHY";
const NAV_ITEMS = [
  { label: "Home", id: "home", icon: "home" },
  // { label: "Portfolio", id: "portfolio", icon: "grid" },
  //{ label: "Services", id: "services", icon: "briefcase" },
  //{ label: "Pricing", id: "pricing", icon: "tag" },
  //{ label: "About", id: "about", icon: "user" },
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

/* ===================== THEME TOKENS ===================== */
function useThemeTokens(theme) {
  const light = {
    pageBg: "bg-[#faf7f2]", // pastel beige background
    pageText: "text-neutral-900",
    navBg: "bg-white/85",
    navBorder: "border-rose-200",
    navText: "text-neutral-700",
    navTextStrong: "text-neutral-900",
    hoverOverlay: "bg-rose-100/50",
    sectionAltBg: "bg-[#fdfaf7]",
    panelBg: "bg-white",
    panelBorder: "border-rose-200",
    cardBg: "bg-white",
    cardBorder: "border-rose-200",
    muted: "text-neutral-600",
    muted2: "text-neutral-500",
    chipActive: "bg-rose-200 text-rose-900 border-rose-300",
    chipInactive:
      "bg-white border-neutral-300 text-neutral-700 hover:bg-rose-50",
    btnOutline: "border-neutral-300 text-neutral-900 hover:bg-rose-50",
    inputBg: "bg-white",
    inputBorder: "border-neutral-300",
    inputText: "text-neutral-900",
    placeholder: "placeholder-neutral-400",
    footerBg: "bg-white",
    footerBorder: "border-rose-200",
    link: "text-rose-900 underline",
    linkSubtle: "text-neutral-800 underline",
  };

  const dark = {
    pageBg: "bg-[#1c1e26]", // deep muted navy
    pageText: "text-neutral-100",
    navBg: "bg-[#1c1e26]/90",
    navBorder: "border-teal-700",
    navText: "text-neutral-300",
    navTextStrong: "text-white",
    hoverOverlay: "bg-teal-500/20",
    sectionAltBg: "bg-[#22242c]",
    panelBg: "bg-[#2a2d36]",
    panelBorder: "border-[#3a3d46]",
    cardBg: "bg-[#2a2d36]",
    cardBorder: "border-[#3a3d46]",
    muted: "text-neutral-300",
    muted2: "text-neutral-400",
    chipActive: "bg-teal-300 text-[#1c1e26] border-teal-400",
    chipInactive:
      "bg-[#2a2d36] border-[#3a3d46] text-neutral-200 hover:bg-[#333640]",
    btnOutline:
      "border-neutral-600 text-neutral-100 hover:bg-[#333640]",
    inputBg: "bg-[#1c1e26]",
    inputBorder: "border-neutral-600",
    inputText: "text-neutral-100",
    placeholder: "placeholder-neutral-500",
    footerBg: "bg-[#1c1e26]",
    footerBorder: "border-teal-700",
    link: "text-teal-300 underline",
    linkSubtle: "text-teal-200 underline",
  };

  return theme === "light" ? light : dark;
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
      // Simple WhatsApp-like bubble + phone glyph
      return (
        <svg {...p}>
          <path d="M20.5 11.5a8.5 8.5 0 11-4.2-7.4l.2.1" />
          <path d="M7.5 19.5l-3 1 1-3" />
          <path d="M9.5 7.8c-.3 1 .2 2.2 1.4 3.6 1.2 1.4 2.4 2 3.5 1.8" />
          <path d="M12.6 12.9l.9-1.1 1.7.6" />
        </svg>
      );
    default:
      return null;
  }
}

/* ===================== Intro Overlay (Editorial - Black) ===================== */
/* ===================== Intro Overlay (Cinematic) ===================== */
/* ===================== Intro Overlay (Cinematic, no imports/exports) ===================== */
/* ===================== Intro Overlay (Cinematic v2) ===================== */
/* ===================== Intro Overlay (Cinematic — revert texts, fix image) ===================== */
function IntroOverlay({ onClose }) {
  // Phases: typing #1 → typing #2 → image reveal → titles → final
  const [phase, setPhase] = useState("type1");

  // typing buffers
  const [typed1, setTyped1] = useState("");
  const [typed2, setTyped2] = useState("");

  // ripples
  const imgRef = useRef(null);
  const rippleLayerRef = useRef(null);

  /* ---------- Exit: only Enter key or Enter button ---------- */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* ---------- Typing #1: PRADEEP MOORTHY ---------- */
  useEffect(() => {
    if (phase !== "type1") return;
    const text = "PRADEEP MOORTHY";
    const step = 90;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTyped1(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(t);
        // brief hold before next typing
        setTimeout(() => setPhase("type2"), 800);
      }
    }, step);
    return () => clearInterval(t);
  }, [phase]);

  /* ---------- Typing #2: PRADHU PHOTOGRAPHY (with tiny double pulse) ---------- */
  useEffect(() => {
    if (phase !== "type2") return;
    const text = "PRADHU PHOTOGRAPHY";
    const step = 90;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTyped2(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(t);
        // let explode-out finish, then reveal image
        setTimeout(() => setPhase("image"), 900);
      }
    }, step);
    return () => clearInterval(t);
  }, [phase]);

  /* ---------- Auto move from image reveal → titles ---------- */
  useEffect(() => {
    if (phase !== "image") return;
    const toTitles = setTimeout(() => setPhase("titles"), 1100);
    return () => clearTimeout(toTitles);
  }, [phase]);

  /* ---------- Ripple helpers ---------- */
  const triggerRipple = (x, y) => {
    const layer = rippleLayerRef.current;
    if (!layer) return;
    const dot = document.createElement("span");
    dot.className = "cin-ripple-el";
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    layer.appendChild(dot);
    dot.addEventListener("animationend", () => dot.remove(), { once: true });
  };

  const rippleAtImageCenter = () => {
    const img = imgRef.current;
    const layer = rippleLayerRef.current;
    if (!img || !layer) return;
    const rectL = layer.getBoundingClientRect();
    const rectI = img.getBoundingClientRect();
    const cx = (rectI.left + rectI.right) / 2 - rectL.left;
    const cy = (rectI.top + rectI.bottom) / 2 - rectL.top;
    triggerRipple(cx, cy);
  };

  // when titles slide in and “hit”, ripple the image
  useEffect(() => {
    if (phase !== "titles") return;
    const r1 = setTimeout(rippleAtImageCenter, 480);
    const r2 = setTimeout(rippleAtImageCenter, 1050);
    return () => {
      clearTimeout(r1);
      clearTimeout(r2);
    };
  }, [phase]);

  /* ---------- Clicks ----------
     - Overlay clicks do nothing (no accidental close)
     - Clicking the image makes a ripple where you clicked
  */
  const onOverlayClick = () => {};
  const onImageClick = (e) => {
    const layer = rippleLayerRef.current;
    if (!layer) return;
    const rect = layer.getBoundingClientRect();
    triggerRipple(e.clientX - rect.left, e.clientY - rect.top);
  };

  const onPressEnterButton = (e) => {
    e.stopPropagation();
    onClose();
  };

  /* ---------- Image visibility logic (FIXED):
       - Always render the <img> so layout is stable
       - Start fully transparent
       - On "image": apply radial reveal + move-in + force opacity 1
       - On "titles/final": stay opaque
  ---------- */
  const imgPhaseClass =
    phase === "image"
      ? "opacity-100 cin-radial-reveal cin-image-move-in"
      : phase === "titles" || phase === "final"
      ? "opacity-100"
      : "opacity-0";

  return (
    <div
      className="fixed inset-0 bg-black text-white"
      style={{ zIndex: 9999 }}
      role="dialog"
      aria-label="Intro overlay"
      onClick={onOverlayClick}
    >
      <div className="h-full flex items-center justify-center p-6">
        <div className="w-full max-w-[1100px] grid md:grid-cols-[1fr_640px_1fr] items-center gap-6">
          {/* Left spacer */}
          <div className="hidden md:block" />

          {/* Center: image (now correctly revealed; not visible until phase "image") */}
          <div className="relative cin-image-holder select-none" onClick={onImageClick}>
            <img
              ref={imgRef}
              src={INTRO_LEFT_IMAGE_URL}
              alt="Intro"
              className={`w-full h-auto object-contain max-h-[78vh] transition-opacity duration-300 ${imgPhaseClass}`}
            />
            <div className="pointer-events-none absolute inset-0 cin-vignette" />
            <div ref={rippleLayerRef} className="cin-ripple-layer absolute inset-0 overflow-hidden" />
          </div>

          {/* Right rail: text scenes */}
          <div className="flex flex-col items-end justify-between gap-6">
            <div className="text-right select-none">
              {/* TYPING PHASES (centered in the right column) */}
              {(phase === "type1" || phase === "type2") && (
                <div className="min-h-[120px] flex flex-col items-end justify-center">
                  <div
                    className="font-['Playfair_Display'] uppercase tracking-[0.08em] whitespace-nowrap text-[clamp(28px,5vw,56px)]"
                    style={{ letterSpacing: "0.08em" }}
                  >
                    <span className="align-middle">{typed1}</span>
                    {phase === "type1" && <span className="cin-caret align-middle ml-[3px] w-[1px]" />}
                  </div>

                  <div
                    className={`mt-2 font-['Playfair_Display'] uppercase whitespace-nowrap tracking-[0.08em] text-[clamp(20px,3.5vw,39px)] ${
                      phase === "type2" && typed2 ? "cin-pulse-zoom-twice" : ""
                    }`}
                    style={{ letterSpacing: "0.08em", opacity: 0.95 }}
                  >
                    <span className="align-middle">{typed2}</span>
                    {phase === "type2" && typed2.length < "PRADHU PHOTOGRAPHY".length && (
                      <span className="cin-caret align-middle ml-[3px] w-[1px]" />
                    )}
                  </div>
                </div>
              )}

              {/* TITLES (overshoot + “hit” → ripple) */}
              {(phase === "titles" || phase === "final") && (
                <>
                  <div
                    className="text-[12px] tracking-[0.25em] opacity-80 cin-fade-in"
                    style={{ animationDuration: "900ms", animationDelay: "120ms" }}
                  >
                    VISUAL & HONEST STORIES
                  </div>

                  <h1
                    className="mt-2 leading-[0.95] font-['Playfair_Display'] tracking-[0.08em] uppercase whitespace-nowrap text-[clamp(28px,5vw,56px)] cin-overshoot-in"
                    style={{ letterSpacing: "0.08em", animationDuration: "820ms" }}
                  >
                    PRADEEP MOORTHY
                  </h1>

                  <div
                    className="mt-1 font-['Playfair_Display'] uppercase whitespace-nowrap tracking-[0.08em] text-[clamp(20px,3.5vw,39px)] cin-overshoot-in delay-[520ms]"
                    style={{ letterSpacing: "0.08em", opacity: 0.95, animationDuration: "820ms" }}
                  >
                    PRADHU PHOTOGRAPHY
                  </div>
                </>
              )}
            </div>

            {(phase === "titles" || phase === "final") && (
              <button
                onClick={onPressEnterButton}
                className="rounded-full border border-white/40 px-5 py-2 text-sm hover:bg-white/10 transition cin-fade-in-delayed"
                aria-label="Enter"
              >
                Enter ↵
              </button>
            )}
          </div>
        </div>
      </div>

      {/* EXPLODE-OUT overlays (vanish in the middle) */}
      {phase === "type1" && typed1 && (
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
          <div className="cin-explode-out text-white font-['Playfair_Display'] uppercase tracking-[0.08em] text-[min(9vw,64px)]">
            {typed1}
          </div>
        </div>
      )}
      {phase === "type2" && typed2 && (
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
          <div className="cin-explode-out text-white font-['Playfair_Display'] uppercase tracking-[0.08em] text-[min(7vw,48px)]">
            {typed2}
          </div>
        </div>
      )}
    </div>
  );
}


/* ===================== GitHub helpers ===================== */
const GH_API = "https://api.github.com";
const IMG_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
const isImageName = (name = "") =>
  IMG_EXTS.some((ext) => name.toLowerCase().endsWith(ext));

async function ghListFolder(owner, repo, path, ref) {
  const key = `pradhu:gh:${owner}/${repo}@${ref}/${path}`;
  const tkey = key + ":ts";
  const now = Date.now();

  const nocache =
    new URLSearchParams(window.location.search).get("refresh") === "1";

  try {
    const ts = Number(sessionStorage.getItem(tkey) || 0);
    if (!nocache && ts && now - ts < GH_CACHE_TTL_MS) {
      const cached = JSON.parse(sessionStorage.getItem(key) || "[]");
      return cached;
    }
  } catch {}

  const url = `${GH_API}/repos/${encodeURIComponent(
    owner
  )}/${encodeURIComponent(repo)}/contents/${encodeURIComponent(
    path
  )}?ref=${encodeURIComponent(ref)}`;
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) {
    if (res.status === 404) return [];
    const text = await res.text();
    throw new Error(`GitHub API ${res.status}: ${text}`);
  }
  const json = await res.json();
  const files = Array.isArray(json) ? json.filter((it) => it.type === "file") : [];
  const imgs = files
    .filter((f) => isImageName(f.name))
    .map((f) => ({ name: f.name, url: f.download_url, sha: f.sha, size: f.size }));
  try {
    sessionStorage.setItem(key, JSON.stringify(imgs));
    sessionStorage.setItem(tkey, String(now));
  } catch {}
  return imgs;
}

/* ===================== Hero ===================== */
function Hero() {
  return (
    <section id="home" className="relative min-h-[68vh] md:min-h-[78vh]">
      <img
        src={HERO_BG_URL}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full object-cover pointer-events-none"
        loading="eager"
      />
      <div className="absolute inset-0 z-[1] bg-black/45" />
      <div className="absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 z-[2]">
        <div className={`${CONTAINER} pb-10 md:pb-14 text-white`}>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            Freeze the moment. <span className="opacity-90">Tell the story.</span>
          </h1>
          <p className="mt-3 max-w-3xl text-sm md:text-base text-neutral-200">
            Fashion · Portraits · Candids · Portfolio · Professional headshots ·
            Street
          </p>
          <p className="text-neutral-300 text-sm mt-1">{SERVICE_CITIES}</p>
        </div>
      </div>
    </section>
  );
}

/* ===================== FAQ ===================== */
function FaqSection({ T, showTitle = true }) {
  const items = [
    {
      q: "How do I receive photos?",
      a: "Via a private, watermark-free online gallery with high-res downloads (usually a private Google Drive link).",
    },
    { q: "How to book?", a: "Send an enquiry below with your date, service, and location." },
    { q: "Do you travel for shoots?", a: "Yes. Travel fee applies outside the base city." },
    {
      q: "Do you provide makeup/hair or a stylist?",
      a: "I can recommend trusted HMUA/styling partners and coordinate as an add-on. Their fees are billed separately.",
    },
    {
      q: "Can we shoot in a studio?",
      a: "Yes. Studio rentals are available and billed at the venue’s rates. I’ll shortlist spaces based on your concept; for minimal headshot setups, I can set up on location.",
    },
    {
      q: "Can you print albums or framed photos?",
      a: "Absolutely. I offer curated print and album options through professional labs. Sizes, papers and pricing are available on request.",
    },
  ];

  return (
    <section id="faq" className={`py-2`}>
      {showTitle && (
        <h2
          className={`text-3xl md:text-4xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}
        >
          FAQ
        </h2>
      )}
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {items.map((item) => (
          <details
            key={item.q}
            className={`rounded-2xl border p-5 shadow-sm ${T.panelBg} ${T.panelBorder}`}
          >
            <summary className={`cursor-pointer font-medium ${T.navTextStrong}`}>
              {item.q}
            </summary>
            <p className={`mt-2 text-sm ${T.muted}`}>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ===================== Services ===================== */
function ServicesSection({ T, showTitle = true }) {
  return (
    <section id="services" className={`py-2`}>
      {showTitle && (
        <h2
          className={`text-3xl md:text-4xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}
        >
          Services
        </h2>
      )}
      <p className={`mt-2 ${T.muted}`}>
        Multi-genre coverage designed around your brief. I’ll suggest looks, lighting windows and locations so the day feels effortless.
      </p>

      <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        <article className={`rounded-2xl border p-5 shadow-sm ${T.panelBg} ${T.panelBorder}`}>
          <h3 className={`text-lg font-medium ${T.navTextStrong}`}>Portraits & Headshots</h3>
          <ul className={`mt-2 text-sm list-disc pl-5 ${T.muted}`}>
            <li>60–90 min session · up to 2 outfits</li>
            <li>Clean, natural retouching</li>
            <li>Guidance on wardrobe, posing & locations</li>
            <li>Deliverables: curated 25–40 edited images</li>
          </ul>
        </article>

        <article className={`rounded-2xl border p-5 shadow-sm ${T.panelBg} ${T.panelBorder}`}>
          <h3 className={`text-lg font-medium ${T.navTextStrong}`}>Fashion / Editorial</h3>
          <ul className={`mt-2 text-sm list-disc pl-5 ${T.muted}`}>
            <li>Moodboard & looks planning</li>
            <li>On-set lighting & styling coordination</li>
            <li>Clean, contemporary colour and skin tones</li>
            <li>Half-day / full-day options</li>
          </ul>
        </article>

        <article className={`rounded-2xl border p-5 shadow-sm ${T.panelBg} ${T.panelBorder}`}>
          <h3 className={`text-lg font-medium ${T.navTextStrong}`}>Events & Candids</h3>
          <ul className={`mt-2 text-sm list-disc pl-5 ${T.muted}`}>
            <li>Coverage by hours or session blocks</li>
            <li>Emphasis on key moments & people</li>
            <li>Balanced set of colour-graded selects</li>
            <li>Teasers available as an add-on</li>
          </ul>
        </article>
      </div>

      <div className={`mt-6 rounded-2xl border p-5 ${T.panelBg} ${T.panelBorder}`}>
        <h3 className={`font-medium ${T.navTextStrong}`}>Add-ons</h3>
        <ul className={`mt-2 text-sm list-disc pl-5 ${T.muted}`}>
          <li>HMUA / Styling coordination (billed at cost)</li>
          <li>Studio rental (venue rates apply)</li>
          <li>Assistant / extra lighting</li>
          <li>Travel & stay outside base city (at actuals)</li>
          <li>Rush teasers / same-day selects</li>
          <li>Prints, albums and frames</li>
        </ul>
        <a href="#booking" className={`${T.link} text-sm mt-3 inline-block`}>Enquire for availability →</a>
      </div>
    </section>
  );
}

/* ===================== Pricing (Indicative) ===================== */
function PricingSection({ T, showTitle = true }) {
  const tiers = [
    {
      name: "Portrait Session",
      price: "from ₹4,500",
      includes: [
        "60–90 min · up to 2 outfits",
        "6 lightly retouched hero shots",
        "Curated 25–40 edited images",
        "Location & styling guidance",
      ],
    },
    {
      name: "Headshots (Solo/Team)",
      price: "from ₹3,000",
      includes: [
        "Efficient, minimal setup",
        "Consistent lighting & framing",
        "Light retouching for final selects",
        "On-location option available",
      ],
    },
    {
      name: "Fashion / Editorial (Half-day)",
      price: "from ₹12,000",
      includes: [
        "Pre-prod planning & moodboard",
        "Lighting & look management",
        "Editorial-leaning colour grade",
        "Team coordination on request",
      ],
    },
    {
      name: "Event Coverage (2 hrs)",
      price: "from ₹6,000",
      includes: [
        "Focused coverage of key moments",
        "Colour-graded selects",
        "Optional teasers within 48h",
        "Extendable by hour",
      ],
    },
  ];

  return (
    <section id="pricing" className={`py-2`}>
      {showTitle && (
        <h2
          className={`text-3xl md:text-4xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}
        >
          Pricing (indicative)
        </h2>
      )}
      <p className={`mt-2 ${T.muted}`}>
        Final quote depends on scope, locations, team and timelines. Share your brief for a tailored estimate.
      </p>

      <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <article key={t.name} className={`rounded-2xl border p-5 shadow-sm ${T.panelBg} ${T.panelBorder}`}>
            <div className="flex items-baseline justify-between">
              <h3 className={`text-lg font-medium ${T.navTextStrong}`}>{t.name}</h3>
              <span className="text-sm opacity-80">{t.price}</span>
            </div>
            <ul className={`mt-3 text-sm list-disc pl-5 ${T.muted}`}>
              {t.includes.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <a href="#booking" className={`${T.link} text-sm mt-4 inline-block`}>Request a quote →</a>
          </article>
        ))}
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className={`rounded-2xl border p-5 ${T.panelBg} ${T.panelBorder}`}>
          <h4 className={`font-medium ${T.navTextStrong}`}>Turnaround</h4>
          <p className={`mt-2 text-sm ${T.muted}`}>
            Portraits: 5–7 days. Weddings/events: teaser in ~48h, full gallery in ~3–4 weeks.
          </p>
        </div>
        <div className={`rounded-2xl border p-5 ${T.panelBg} ${T.panelBorder}`}>
          <h4 className={`font-medium ${T.navTextStrong}`}>Booking & Policy</h4>
          <ul className={`mt-2 text-sm list-disc pl-5 ${T.muted}`}>
            <li>Advance to reserve the date (adjustable in final invoice).</li>
            <li>One complimentary reschedule with 72h notice (subject to availability).</li>
            <li>Outstation travel/stay billed at actuals.</li>
            <li>Commercial usage/licensing quoted per brief.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ===================== Tiles (one line) ===================== */
function SectionTiles({ openId, setOpenId, T }) {
  const tiles = [
    { id: "portfolio", label: "Portfolio", icon: "grid" },
    { id: "services", label: "Services", icon: "briefcase" },
    { id: "pricing", label: "Pricing", icon: "tag" },
    { id: "faq", label: "FAQ", icon: "help" },
  ];

  return (
    <div id="tiles" className={`${CONTAINER} pt-10`}>
      <div
        className="flex gap-3 overflow-x-auto whitespace-nowrap pb-2"
        style={{ scrollbarWidth: "none" }}
      >
        {tiles.map((t) => {
          const active = openId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setOpenId(t.id);
                if (t.id === "portfolio") window.location.hash = "#portfolio";
              }}
              className={`flex items-center gap-2 rounded-2xl border px-4 py-2 transition shadow-sm ${
                active ? T.chipActive : T.chipInactive
              }`}
              aria-pressed={active}
              aria-controls={`section-${t.id}`}
              aria-expanded={active}
            >
              <Icon
                name={t.icon}
                className={`h-4 w-4 ${active ? "opacity-100" : "opacity-60"}`}
              />
              <span className="text-sm">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ===================== Booking (About at left + Enquiry form) ===================== */
function BookingSection({ T }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Portraits",
    city: "Pune",
    date: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [note, setNote] = useState("");

  const minDateStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    const off = d.getTimezoneOffset();
    const local = new Date(d.getTime() - off * 60000);
    return local.toISOString().slice(0, 10);
  }, []);
  const fmtHuman = (yyyy_mm_dd) => {
    if (!yyyy_mm_dd) return "";
    const [y, m, d] = yyyy_mm_dd.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setNote("");

    const missing = [];
    if (!form.name.trim()) missing.push("Name");
    if (!form.email.trim()) missing.push("Email");
    if (!form.phone.trim()) missing.push("Phone");
    if (form.date && form.date < minDateStr)
      missing.push(`Preferred Date (≥ ${fmtHuman(minDateStr)})`);
    if (missing.length) {
      setNote(`Please fill: ${missing.join(", ")}`);
      return;
    }

    setSubmitting(true);
    try {
      await fetch(SHEET_WEB_APP, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "website" }),
      });
      setForm({
        name: "",
        email: "",
        phone: "",
        service: "Portraits",
        city: "Pune",
        date: "",
        message: "",
      });
      setNote("Thanks! Your enquiry was submitted. I’ll reply shortly.");
    } catch (err) {
      console.error(err);
      setNote("Couldn’t submit right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="booking" className={`${T.sectionAltBg} border-t ${T.footerBorder}`}>
      <div className={`${CONTAINER} py-16`}>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* LEFT: About (has id=about for navbar scroll) */}
          <div id="about">
            <h2
              className={`text-3xl md:text-4xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}
            >
              About PRADHU
            </h2>
            <p className={`mt-3 ${T.muted}`}>
              As an aspiring photographer from Kanchipuram, I work across fashion,
              portraits, candids and events. I run a client-first process: I listen
              to your brief and offer tailored recommendations on looks, lighting,
              locations and timelines so the day feels effortless. On set, I work
              with calm, unobtrusive direction to create space for genuine
              expression. My aim is to capture the beauty, joy and decisive moments
              that define your story—delivering images that feel personal, polished
              and purposeful.
            </p>
            <ul className={`mt-4 text-sm list-disc pl-5 space-y-1 ${T.muted}`}>
              <li>
                Genres: Fashion, High Fashion, Editorials, Portraits, Headshots,
                Candids, Street, Studio
              </li>
              <li>
                Kit: Nikon D7500, softboxes (octa & strip), multiple flashes, light
                modifiers
              </li>
              <li>{SERVICE_CITIES}</li>
            </ul>

            {/* Social icon tiles */}
            <div className="mt-5 flex items-center gap-3">
              {/* Instagram */}
              <a
                href={`https://www.instagram.com/${IG_USERNAME}/`}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className={`inline-flex items-center justify-center h-12 w-12 rounded-2xl border ${T.panelBorder} ${T.panelBg} transition hover:scale-[1.04] hover:shadow-sm`}
              >
                <Icon name="camera" className="h-5 w-5" />
              </a>

              {/* WhatsApp */}
              {WHATSAPP_NUMBER.includes("X") ? (
                <span
                  className={`inline-flex items-center justify-center h-12 w-12 rounded-2xl border ${T.panelBorder} ${T.panelBg} opacity-60`}
                  title="WhatsApp unavailable"
                  aria-hidden="true"
                >
                  <Icon name="whatsapp" className="h-5 w-5" />
                </span>
              ) : (
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                  className={`inline-flex items-center justify-center h-12 w-12 rounded-2xl border ${T.panelBorder} ${T.panelBg} transition hover:scale-[1.04] hover:shadow-sm`}
                >
                  <Icon name="whatsapp" className="h-5 w-5" />
                </a>
              )}

              {/* Email */}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                aria-label="Email"
                title="Email"
                className={`inline-flex items-center justify-center h-12 w-12 rounded-2xl border ${T.panelBorder} ${T.panelBg} transition hover:scale-[1.04] hover:shadow-sm`}
              >
                <Icon name="mail" className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* RIGHT: Enquire / Book */}
          <div>
            <h2
              className={`text-3xl md:text-4xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}
            >
              Enquire / Book
            </h2>
            <p className={`mt-2 ${T.muted}`}>
              Share details and I’ll reply with availability and a quote.
            </p>

            <form
              onSubmit={onSubmit}
              className={`mt-6 rounded-2xl border p-6 shadow-sm ${T.panelBg} ${T.panelBorder}`}
            >
              <div className="grid grid-cols-1 gap-4">
                <Input
                  T={T}
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  required
                />
                <Input
                  T={T}
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  required
                />
                <Input
                  T={T}
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={onChange}
                  required
                  placeholder="+91-XXXXXXXXXX"
                />

                <div>
                  <label className={`text-sm ${T.muted}`}>Preferred Date</label>
                  <input
                    name="date"
                    type="date"
                    min={minDateStr}
                    value={form.date}
                    onKeyDown={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                    onChange={(e) => {
                      let v = e.target.value;
                      if (v && v < minDateStr) {
                        v = minDateStr;
                        setNote(
                          `Earliest available date is ${fmtHuman(minDateStr)}.`
                        );
                      }
                      setForm({ ...form, date: v });
                    }}
                    className={`mt-1 w-full rounded-xl border px-3 py-2 ${T.inputBg} ${T.inputBorder} ${T.inputText} ${T.placeholder}`}
                  />
                  <p className="text-xs opacity-70 mt-1">
                    Earliest selectable: {fmtHuman(minDateStr)}
                  </p>
                </div>

                <div>
                  <label className={`text-sm ${T.muted}`}>Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    rows={5}
                    className={`mt-1 w-full rounded-xl border px-3 py-2 ${T.inputBg} ${T.inputBorder} ${T.inputText} ${T.placeholder}`}
                    placeholder="Shoot location, timings, concept, references, usage (personal/commercial), etc."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`text-sm ${T.muted}`}>Service</label>
                    <select
                      name="service"
                      className={`mt-1 w-full rounded-xl border px-3 py-2 ${T.inputBg} ${T.inputBorder} ${T.inputText}`}
                      value={form.service}
                      onChange={onChange}
                    >
                      {[
                        "Portraits",
                        "Fashion",
                        "Candids",
                        "Street",
                        "Events",
                        "Other",
                      ].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`text-sm ${T.muted}`}>City</label>
                    <select
                      name="city"
                      className={`mt-1 w-full rounded-xl border px-3 py-2 ${T.inputBg} ${T.inputBorder} ${T.inputText}`}
                      value={form.city}
                      onChange={onChange}
                    >
                      <option>Pune</option>
                      <option>Mumbai</option>
                      <option>Chennai</option>
                      <option>Bengaluru</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-neutral-900 text-white px-4 py-2 font-medium hover:opacity-90 disabled:opacity-60"
                  >
                    {submitting ? "Submitting…" : "Send Enquiry"}
                  </button>
                  {note && <span className="text-sm opacity-80">{note}</span>}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== Small Input ===================== */
function Input({
  T,
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
}) {
  return (
    <div>
      <label htmlFor={name} className={`text-sm ${T.muted}`}>
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`mt-1 w-full rounded-xl border px-3 py-2 ${T.inputBg} ${T.inputBorder} ${T.inputText} ${T.placeholder}`}
      />
    </div>
  );
}

/* ===================== Portfolio (Landing + Pages + Hash) ===================== */
function useHash() {
  const [hash, setHash] = useState(() => window.location.hash || "");
  useEffect(() => {
    const onHash = () => setHash(window.location.hash || "");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return [hash, (h) => { if (h !== window.location.hash) window.location.hash = h; }];
}

// Optional extended metadata per category (subtitle text for the page header)
const GH_CATEGORIES_EXT = {
  Events: {
    blurb:
      "Candid coverage of people and moments—clean color, honest expressions, and storytelling frames.",
  },
  Fashion: {
    blurb:
      "Editorial-leaning looks with modern skin tones and simple, confident direction.",
  },
};

function PortfolioLanding({ T, cats, states, openCat }) {
  return (
    <section className="py-2" id="portfolio">
      <header className="mb-8">
        <h2
          className={`text-4xl md:text-5xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}
        >
          Portfolio
        </h2>
        <p className={`mt-2 ${T.muted}`}>Choose a collection.</p>
      </header>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {cats.map((c, i) => {
          const st = states[i] || { images: [], loading: true, error: "" };
          const cover = st.images?.[0]?.url || "";
          return (
            <article
              key={c.label}
              className={`relative rounded-2xl overflow-hidden border ${T.cardBorder} ${T.cardBg} shadow-sm`}
            >
              <button
                type="button"
                onClick={() => openCat(c.label)}
                className="group block text-left w-full"
                aria-label={`Open ${c.label}`}
              >
                <div className="aspect-[4/5] w-full bg-neutral-200/20 relative">
                  {cover ? (
                    <img
                      src={cover}
                      alt={c.label}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  ) : null}

                  {/* Top-left big serif title */}
                  <div className="absolute top-3 left-3 right-3">
                    <div className="inline-block px-1.5 py-1">
                      <h3
                        className={`text-[clamp(24px,4vw,40px)] leading-none font-['Playfair_Display'] uppercase tracking-[0.1em] text-white drop-shadow`}
                      >
                        {c.label}
                      </h3>
                      <div className="mt-1 text-[10px] tracking-[0.2em] text-white/90">
                        PORTFOLIO
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PortfolioPage({ T, cat, state, onBack }) {
  const items = state.images || [];
  const blurb = GH_CATEGORIES_EXT[cat.label]?.blurb || "";

  // Track which image is centered for the progress indicator
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const nodes = Array.from(root.querySelectorAll("figure"));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number(e.target.getAttribute("data-idx") || 0);
            setActiveIndex(idx);
          }
        });
      },
      { root: null, threshold: 0.6 }
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, [state.loading]);

  return (
    <section className="py-2" id="portfolio">
      {/* Sticky breadcrumb + title */}
      <div className="mb-6 sticky top-[72px] z-[1] backdrop-blur border-b pb-3">
        <div className="pt-3">
          <button className={`${T.linkSubtle} text-sm`} onClick={onBack}>
            Portfolio
          </button>
          <span className={`mx-2 ${T.muted2}`}>/</span>
          <span className={`text-sm ${T.navTextStrong}`}>{cat.label}</span>
        </div>
        <h2
          className={`mt-2 text-4xl md:text-5xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}
        >
          {cat.label}
        </h2>
        {blurb && <p className={`mt-1 ${T.muted}`}>{blurb}</p>}
      </div>

      {/* Right progress rail */}
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-3 pointer-events-none">
        <div className="flex flex-col items-center gap-2">
          <div className="h-32 w-px bg-neutral-400/30" />
          <div className={`${T.muted2} text-[11px] tracking-[0.25em]`}>
            {items.length ? `${activeIndex + 1} / ${items.length}` : "0 / 0"}
          </div>
          <div className="h-32 w-px bg-neutral-400/30" />
        </div>
      </div>

      {/* Centered tall images with air/whitespace */}
      {state.error ? (
        <div className="text-red-500">{String(state.error)}</div>
      ) : state.loading ? (
        <div className={`${T.muted2}`}>Loading…</div>
      ) : items.length ? (
        <div ref={containerRef} className="mx-auto max-w-[980px]">
          {items.map((it, i) => (
            <figure key={it.sha || i} data-idx={i} className="my-10 sm:my-16 md:my-24">
  <img
    src={it.url}
    alt={`${cat.label} — ${it.name}`}
    className="max-h-[85vh] w-auto mx-auto object-contain"
    loading="lazy"
  />
</figure>

          ))}
        </div>
      ) : (
        <div className={`${T.muted}`}>No images yet for {cat.label}.</div>
      )}
    </section>
  );
}

function Portfolio({ T }) {
  // states per category
  const [states, setStates] = useState(() =>
    GH_CATEGORIES.map(() => ({ loading: true, error: "", images: [] }))
  );

  // Hash router: #portfolio or #portfolio/Fashion
  const [hash, setHash] = useHash();
  const [view, setView] = useState("landing"); // "landing" | "page"
  const [activeIdx, setActiveIdx] = useState(-1);

  const openCat = (label) => {
    const idx = GH_CATEGORIES.findIndex((c) => c.label === label);
    if (idx < 0) return;
    setActiveIdx(idx);
    setView("page");
    setHash(`#portfolio/${encodeURIComponent(label)}`);
    const el = document.getElementById("portfolio");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goLanding = () => {
    setView("landing");
    setActiveIdx(-1);
    setHash("#portfolio");
  };

  // hash → view sync (deep-link support)
  useEffect(() => {
    if (!hash.startsWith("#portfolio")) return;
    const seg = hash.split("/");
    if (seg.length >= 2 && seg[1]) {
      const label = decodeURIComponent(seg[1].replace(/^#?portfolio\/?/, ""));
      const idx = GH_CATEGORIES.findIndex((c) => c.label === label);
      if (idx >= 0) {
        setActiveIdx(idx);
        setView("page");
        return;
      }
    }
    setView("landing");
    setActiveIdx(-1);
  }, [hash]);

  // fetch images per category
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const results = await Promise.all(
        GH_CATEGORIES.map(async (cat) => {
          try {
            const list = await ghListFolder(
              GH_OWNER,
              GH_REPO,
              cat.path,
              GH_BRANCH
            );
            return { loading: false, error: "", images: list };
          } catch (e) {
            return {
              loading: false,
              error: e?.message || "Failed to load",
              images: [],
            };
          }
        })
      );
      if (!cancelled) setStates(results);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (view === "page" && activeIdx >= 0) {
    const cat = GH_CATEGORIES[activeIdx];
    const st = states[activeIdx] || { loading: true, error: "", images: [] };
    return <PortfolioPage T={T} cat={cat} state={st} onBack={goLanding} />;
  }
  return <PortfolioLanding T={T} cats={GH_CATEGORIES} states={states} openCat={openCat} />;
}

/* ===================== Theme Slider ===================== */
function ThemeSlider({ theme, setTheme }) {
  const isDark = theme === "dark";
  const setLight = () => setTheme("light");
  const setDark = () => setTheme("dark");

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") setLight();
    if (e.key === "ArrowRight") setDark();
  };

  return (
    <div
      className="relative h-9 w-[150px] select-none"
      role="tablist"
      aria-label="Theme"
      onKeyDown={onKeyDown}
    >
      <div className="absolute inset-0 rounded-full border border-neutral-300 bg-neutral-100" />
      <div
        className={`absolute top-0 left-0 h-full w-1/2 rounded-full shadow-sm transition-transform duration-200 ${
          isDark
            ? "translate-x-full bg-neutral-900"
            : "translate-x-0 bg-white border border-neutral-300"
        }`}
        aria-hidden="true"
      />
      <div className="relative z-10 grid grid-cols-2 h-full">
        <button
          type="button"
          role="tab"
          aria-selected={!isDark}
          aria-pressed={!isDark}
          onClick={setLight}
          className="flex items-center justify-center gap-1.5 px-3 h-full"
        >
          <Icon
            name="sun"
            className={`h-4 w-4 ${
              isDark ? "opacity-40 text-neutral-600" : "opacity-100 text-neutral-900"
            }`}
          />
          <span
            className={`text-xs ${
              isDark
                ? "opacity-50 text-neutral-700"
                : "opacity-100 text-neutral-900 font-medium"
            }`}
          >
            Light
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={isDark}
          aria-pressed={isDark}
          onClick={setDark}
          className="flex items-center justify-center gap-1.5 px-3 h-full"
        >
          <Icon
            name="moon"
            className={`h-4 w-4 ${
              isDark ? "opacity-100 text-white" : "opacity-40 text-neutral-600"
            }`}
          />
          <span
            className={`text-xs ${
              isDark ? "opacity-100 text-white font-medium" : "opacity-50 text-neutral-700"
            }`}
          >
            Dark
          </span>
        </button>
      </div>
    </div>
  );
}

/* ===================== Main App ===================== */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return sessionStorage.getItem("pradhu:theme") || "dark";
    } catch {
      return "dark";
    }
  });
  const T = useThemeTokens(theme);

  const [showIntro, setShowIntro] = useState(() => {
    if (!INTRO_ENABLED) return false;
    const url = new URL(window.location.href);
    const forced =
      url.searchParams.get(INTRO_FORCE_QUERY) === "1" ||
      url.hash === INTRO_FORCE_HASH;
    if (forced) return true;
    if (!INTRO_REMEMBER) return true;
    return sessionStorage.getItem("pradhu:intro:dismissed") !== "1";
  });

  // Selected tile / section
  const [openId, setOpenId] = useState("portfolio");

  // Active navbar highlight
  const [activeNav, setActiveNav] = useState("home");

  // Observe sections and update activeNav on scroll
  useEffect(() => {
    const ids = ["home", "portfolio", "services", "pricing", "faq", "about", "booking"];
    const els = ids
      .map((id) => [id, document.getElementById(id)])
      .filter(([, el]) => !!el);

    if (els.length === 0) return;

    let current = activeNav;
    const io = new IntersectionObserver(
      (entries) => {
        const mid = window.innerHeight / 2;
        let best = { id: current, dist: Number.POSITIVE_INFINITY };
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const rect = e.target.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const dist = Math.abs(center - mid);
          const id = e.target.getAttribute("id");
          if (dist < best.dist) best = { id, dist };
        });
        if (best.id && best.id !== current) {
          current = best.id;
          setActiveNav(best.id);
        }
      },
      { root: null, threshold: [0.35], rootMargin: "-10% 0px -50% 0px" }
    );

    els.forEach(([, el]) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToSectionFromNav = (id) => {
    setActiveNav(id); // immediate feedback

    // If nav targets a tile section, select it and scroll to tile bar
    if (SECTION_IDS.includes(id)) {
      setOpenId(id);
      if (id === "portfolio") window.location.hash = "#portfolio";
      const el = document.getElementById("tiles");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  const closeIntro = () => {
    setShowIntro(false);
    try {
      if (INTRO_REMEMBER) sessionStorage.setItem("pradhu:intro:dismissed", "1");
    } catch {}
  };

  useEffect(() => {
    try {
      sessionStorage.setItem("pradhu:theme", theme);
    } catch {}
  }, [theme]);

  return (
    <main
  className={`min-h-screen ${T.pageBg} ${T.pageText} font-['Inter'] ${
    theme === "light" ? "bg-dots-light" : "bg-dots-dark"
  }`}
>

      <HeadFonts />
      {showIntro && <IntroOverlay onClose={closeIntro} />}

      {/* NAVBAR */}
      <header
        className={`sticky top-0 z-50 backdrop-blur border-b ${T.navBg} ${T.navBorder}`}
      >
        <nav
          className={`${CONTAINER} py-4 lg:py-5 grid grid-cols-[1fr_auto_auto] items-center gap-3`}
        >
          {/* Brand */}
          <div className="min-w-0">
            <p
              className={`font-['Playfair_Display'] uppercase tracking-[0.08em] leading-none ${T.navTextStrong}
                    text-[clamp(20px,2.4vw,40px)] whitespace-nowrap`}
            >
              {NAV_BRAND}
            </p>
          </div>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-2 text-sm">
            {NAV_ITEMS.map(({ label, id, icon }) => (
              <li key={id}>
                <button
                  onClick={() => scrollToSectionFromNav(id)}
                  aria-pressed={activeNav === id}
                  aria-current={activeNav === id ? "page" : undefined}
                  className={`relative group flex items-center gap-2 px-3 py-2 rounded-2xl border transition shadow-sm ${
                    activeNav === id ? T.chipActive : T.chipInactive
                  }`}
                >
                  <Icon
                    name={icon}
                    className={`h-4 w-4 ${activeNav === id ? "opacity-100" : "opacity-60"}`}
                  />
                  <span className="text-sm">{label}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <ThemeSlider theme={theme} setTheme={setTheme} />
            <button
              className={`lg:hidden rounded-lg px-3 py-2 text-sm border ${T.btnOutline}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              Menu
            </button>
          </div>
        </nav>

        {/* Mobile sheet */}
        {menuOpen && (
          <div
            id="mobile-menu"
            className={`lg:hidden border-t ${T.navBorder} ${T.sectionAltBg} w-full`}
          >
            <div className={`${CONTAINER} px-2 py-3`}>
              <ul className="grid gap-1">
                {NAV_ITEMS.map(({ label, id, icon }) => (
                  <li key={id}>
                    <button
                      onClick={() => scrollToSectionFromNav(id)}
                      aria-pressed={activeNav === id}
                      className={`relative group w-full text-left flex items-center gap-2 px-3 py-2 rounded-2xl border transition shadow-sm ${
                        activeNav === id ? T.chipActive : T.chipInactive
                      }`}
                    >
                      <Icon
                        name={icon}
                        className={`h-4 w-4 ${activeNav === id ? "opacity-100" : "opacity-60"}`}
                      />
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

      {/* TILES (one line) */}
      <SectionTiles openId={openId} setOpenId={setOpenId} T={T} />

      {/* SECTION CONTENT (only selected visible) */}
      <div id="sections-content" className={`${CONTAINER} py-12`}>
        <div className={openId === "portfolio" ? "block" : "hidden"}>
          <Portfolio T={T} />
        </div>

        <div id="services" className={openId === "services" ? "block" : "hidden"}>
          <ServicesSection T={T} showTitle={false} />
        </div>

        <div id="pricing" className={openId === "pricing" ? "block" : "hidden"}>
          <PricingSection T={T} showTitle={false} />
        </div>

        <div id="faq" className={openId === "faq" ? "block" : "hidden"}>
          <FaqSection T={T} showTitle={false} />
        </div>
      </div>

      {/* CONTACT / ENQUIRY (with About on the left, no image) */}
      <BookingSection T={T} />

      {/* FOOTER (minimal) */}
      <footer className={`border-t ${T.footerBorder} ${T.footerBg}`}>
        <div className={`${CONTAINER} py-10 text-sm`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <p className={T.muted}>
              © {new Date().getFullYear()} PRADHU — All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
