import React, { useEffect, useMemo, useRef, useState } from "react";

/* ============================================================
   PRADHU — Dual Theme (Light/Dark) + Cinematic Intro + Portfolio
   (manifest-first image loading + centered edge handling)
   v2025-08-30: Fixes 1,2,3,5
   - #1 Pricing Turnaround: valid UL markup
   - #2 Booking: email/phone validation + WhatsApp CTA
   - #3 Intro overlay: focus trap + a11y polish
   - #5 Portfolio: empty/failed media notice banner
============================================================ */

/* ===================== CONFIG ===================== */
const INTRO_ENABLED = true;
const INTRO_BRAND = "PRADEEP";
const INTRO_NAME = "Pradhu Photography";
const INTRO_AUTO_DISMISS_MS = 0;
const INTRO_LEFT_IMAGE_URL =
  "https://raw.githubusercontent.com/pradeepmurthy1992/pradhu-site-test/5a13fa5f50b380a30762e6d0f3d74ab44eb505a5/baseimg/187232337_402439238105_n.jpg";

const INTRO_REMEMBER = true;
const INTRO_FORCE_QUERY = "intro"; // use ?intro=1
const INTRO_FORCE_HASH = "#intro";

const HERO_BG_URL =
  "https://raw.githubusercontent.com/pradeepmurthy1992/pradhu-site-test/212bc1f22bc6a32b70ae87d0bb104c38f7c3848e/baseimg/02.jpg";


/* Manifest-first: avoids GitHub API rate limits */
const MEDIA_MANIFEST_URL =
  "https://raw.githubusercontent.com/pradeepmurthy1992/pradhu-portfolio-media/main/manifest.json";

/* GitHub media repo (used to build raw URLs) */
const GH_OWNER = "pradeepmurthy1992";
const GH_REPO = "pradhu-portfolio-media";
const GH_BRANCH = "main";

/* Categories (paths must match manifest keys/folders) */
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
  Events: {
    blurb:
      "Candid coverage of people and moments—clean color, honest expressions, and storytelling frames.",
  },
  Fashion: {
    blurb:
      "Editorial-leaning looks with modern skin tones and simple, confident direction.",
  },
  "Celeb Corner": {
    blurb:
      "Clean, flattering light with discreet direction—portraits that feel iconic yet intimate.",
  },
  Editorial: {
    blurb:
      "Story-led imagery with strong concepts, refined styling, and contemporary color.",
  },
  "Model Portfolio": {
    blurb:
      "Polished tests that show range—clean frames, confident posing, and natural skin tones.",
  },
  "Designer Portfolio": {
    blurb:
      "Lookbook-ready sets centered on garments—texture, drape, and movement with minimal, modern palettes.",
  },
  Conceptual: {
    blurb:
      "Ideas-first visuals—graphic compositions, considered props, and mood-rich lighting.",
  },
  Fantasy: {
    blurb:
      "Stylized worlds with cinematic color—ethereal styling and playful, imaginative direction.",
  },
  Eyes: {
    blurb:
      "Close, expressive portraits—catchlights, subtle retouching, and micro-emotion in focus.",
  },
  "High Fashion": {
    blurb:
      "Sharp silhouettes, bold styling, and controlled light—attitude-forward frames.",
  },
  "Street Fashion": {
    blurb:
      "Real locations, ambient light, and candid energy—loose, effortless styling in motion.",
  },
  Headshots: {
    blurb:
      "Crisp, consistent framing with flattering light—professional, approachable expressions.",
  },
  "Kidz Zone": {
    blurb:
      "Playful, patient sessions that keep it fun—authentic smiles and gentle color.",
  },
  Maternity: {
    blurb:
      "Soft, elegant lighting with thoughtful posing—quiet, intimate, and timeless frames.",
  },
  Streets: {
    blurb:
      "Unscripted moments from the everyday—graphic shadows, rhythm, and gesture.",
  },
  Landscapes: {
    blurb:
      "Quiet horizons, clean lines, and patient light—minimal color with depth and scale.",
  },
};

const GH_CACHE_TTL_MS = 5 * 60 * 1000;

/* Brand / contact */
const CONTACT_EMAIL = "pradhuphotography@gmail.com";
const SERVICE_CITIES =
  "Base : Pune · Available [ Mumbai · Chennai · Bengaluru ]";
const IG_USERNAME = "pradhu_photography";

/* Enquiry (not exposed in UI) */
const WHATSAPP_NUMBER = "91XXXXXXXXXX";

/* Google Sheets Web App endpoint */
const SHEET_WEB_APP =
  "https://script.google.com/macros/s/AKfycbypBhkuSpztHIBlYU3nsJJBsJI1SULQRIpGynZvEY6sDb2hDnr1PXN4IZ8342sy5-Dj/exec";

/* Navbar */
const NAV_BRAND = "PRADHU PHOTOGRAPHY";
const NAV_ITEMS = [
  { label: "Home", id: "home", icon: "home" },
  { label: "Contact Me", id: "booking", icon: "mail" },
];
const SECTION_IDS = ["portfolio", "services", "pricing", "faq"]; // tiles

/* Wide container helper */
const CONTAINER = "mx-auto w-full max-w-[1800px] px-4 xl:px-8";

// --- Category tile covers (optional explicit picks; case-insensitive) ---
const TILE_COVERS = {
  // Events: "00_cover.jpg",
  // Fashion: "lookbook_cover.jpg",
};

// Choose tile cover: explicit > token > leading zeros > first image
function pickCoverForCategory(images = [], label = "") {
  if (!images?.length) return "";
  const want = TILE_COVERS[label];
  if (want) {
    const wantLc = want.toLowerCase().trim();
    const match = images.find((it) => (it.name || "").toLowerCase() === wantLc);
    if (match) return match.url;
  }
  const byToken = images.find((it) =>
    /(^|[-_])(cover|tile|hero|thumb)([-_]|\.|$)/i.test(it.name || "")
  );
  if (byToken) return byToken.url;
  const byLeadingZero = images.find((it) => /^0+/.test(it.name || ""));
  if (byLeadingZero) return byLeadingZero.url;
  return images[0]?.url || "";
}

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
    pageBg: "bg-[#faf7f2]",
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
    pageBg: "bg-[#1c1e26]",
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
    btnOutline: "border-neutral-600 text-neutral-100 hover:bg-[#333640]",
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

/* ===================== Small Helpers ===================== */
function useHash() {
  const [hash, setHash] = useState(() => window.location.hash || "");
  useEffect(() => {
    const onHash = () => setHash(window.location.hash || "");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return [
    hash,
    (h) => {
      if (h !== window.location.hash) window.location.hash = h;
    },
  ];
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
    default:
      return null;
  }
}

/* ===================== Intro Overlay (Fix #3: focus trap + aria-modal) ===================== */
function IntroOverlay({ onClose }) {
  const [phase, setPhase] = useState("typeName"); // typeName → typeBrand → revealImg → titles
  const NAME = "PRADEEP MOORTHY";
  const BRAND = "PRADHU PHOTOGRAPHY";
  const [typed, setTyped] = useState("");
  const [step, setStep] = useState(0); // 0 typing, 1 pause, 2 explode
  const typingRef = useRef(null);

  const imgRef = useRef(null);
  const rippleLayerRef = useRef(null);

  const dialogRef = useRef(null);
  const enterBtnRef = useRef(null);

  useEffect(() => {
    // focus the dialog (for SR) and the first button
    enterBtnRef.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === "Enter") onClose();
      // Trap focus with Tab
      if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || !focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onAnyClick = (e) => makeRipple(e.clientX, e.clientY, true);
  const onPressEnterButton = (e) => {
    e.stopPropagation();
    onClose();
  };

  function makeRipple(x, y, withFlash = false) {
    const host = rippleLayerRef.current;
    if (!host) return;
    const rect = host.getBoundingClientRect();

    const ripple = document.createElement("span");
    ripple.className = "cin-ripple circle";
    ripple.style.left = `${x - rect.left}px`;
    ripple.style.top = `${y - rect.top}px`;
    host.appendChild(ripple);

    if (withFlash) {
      const flash = document.createElement("span");
      flash.className = "cin-flash";
      flash.style.left = `${x - rect.left}px`;
      flash.style.top = `${y - rect.top}px`;
      host.appendChild(flash);
      setTimeout(() => flash.remove(), 360);
    }
    setTimeout(() => ripple.remove(), 800);
  }

  useEffect(() => {
    const str = phase === "typeName" ? NAME : phase === "typeBrand" ? BRAND : "";
    if (!str) return;
    setTyped("");
    setStep(0);
    clearInterval(typingRef.current);

    const SPEED = 75;
    let i = 0;
    typingRef.current = setInterval(() => {
      i++;
      setTyped(str.slice(0, i));
      if (i >= str.length) {
        clearInterval(typingRef.current);
        setStep(1);
        setTimeout(() => {
          setStep(2);
          setTimeout(() => {
            if (phase === "typeName") setPhase("typeBrand");
            else if (phase === "typeBrand") setPhase("revealImg");
          }, 520);
        }, phase === "typeName" ? 600 : 700);
      }
    }, SPEED);

    return () => clearInterval(typingRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase !== "revealImg") return;
    const t = setTimeout(() => setPhase("titles"), 1400);
    return () => clearTimeout(t);
  }, [phase]);

  const impactRipple = (delayMs = 0) => {
    setTimeout(() => {
      const img = imgRef.current;
      const host = rippleLayerRef.current;
      if (!img || !host) return;
      const r = img.getBoundingClientRect();
      const cx = r.left + r.width * 0.55;
      const cy = r.top + r.height * 0.45;
      makeRipple(cx, cy, true);
    }, delayMs);
  };
  useEffect(() => {
    if (phase !== "titles") return;
    impactRipple(420);
    impactRipple(900);
    impactRipple(1250);
  }, [phase]);

  const renderTyping = (text) => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-white text-center">
        <div
          className={[
            "inline-flex items-center gap-1 font-['Playfair_Display'] uppercase tracking-[0.08em]",
            "text-[clamp(26px,7vw,88px)] leading-none whitespace-nowrap",
            step === 2 ? "cin-explode-out" : "",
          ].join(" ")}
        >
          <span>{text}</span>
          {step === 0 ? (
            <span className="cin-caret w-[0.5ch] inline-block align-bottom" />
          ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 bg-black text-white"
      style={{ zIndex: 9999 }}
      role="dialog"
      aria-label="Intro overlay"
      aria-modal="true"
      onClick={onAnyClick}
    >
      <div ref={rippleLayerRef} className="absolute inset-0 cin-ripple-layer" />
      {phase === "typeName" && renderTyping(typed)}
      {phase === "typeBrand" && renderTyping(typed)}

      <div
        className={[
          "h-full w-full grid items-center justify-center p-6",
          "md:grid-cols-[640px_1fr] gap-4",
          phase === "typeName" || phase === "typeBrand" ? "opacity-0" : "opacity-100",
        ].join(" ")}
      >
        <div className="relative cin-image-holder">
          <img
            ref={imgRef}
            src={INTRO_LEFT_IMAGE_URL}
            alt="Intro"
            className={[
              "w-full h-auto object-contain max-h-[78vh]",
              phase === "revealImg" ? "cin-radial-reveal cin-image-move-in" : "",
              phase === "titles" ? "opacity-100" : "",
            ].join(" ")}
          />
          <div className="pointer-events-none absolute inset-0 cin-vignette" />
        </div>

        <div
          className={[
            "flex flex-col items-end gap-3 text-right whitespace-nowrap select-none",
            phase === "titles" ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          <div
            className={[
              "text-[12px] tracking-[0.25em] opacity-80",
              phase === "titles" ? "cin-overshoot-in" : "",
            ].join(" ")}
          >
            VISUAL & HONEST STORIES
          </div>

          <h1
            className={[
              "mt-1 font-['Playfair_Display'] uppercase",
              "text-[clamp(32px,6vw,72px)] leading-tight",
              phase === "titles" ? "cin-overshoot-in delay-[480ms]" : "",
            ].join(" ")}
          >
            PRADEEP MOORTHY
          </h1>

          <div
            className={[
              "mt-0.5 font-['Playfair_Display'] uppercase",
              "text-[clamp(24px,4.5vw,50px)] leading-tight",
              phase === "titles" ? "cin-overshoot-in delay-[850ms]" : "",
            ].join(" ")}
          >
            PRADHU PHOTOGRAPHY
          </div>

          <button
            ref={enterBtnRef}
            onClick={onPressEnterButton}
            className={[
              "rounded-full border border-white/40 px-5 py-2 text-sm",
              "hover:bg-white/10 transition mt-6",
              phase === "titles" ? "cin-fade-in-delayed" : "opacity-0",
            ].join(" ")}
          >
            Enter ↵
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================== Manifest-first image helper ===================== */
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

  try {
    if (MEDIA_MANIFEST_URL) {
      const mRes = await fetch(MEDIA_MANIFEST_URL, { cache: "no-store" });
      if (mRes.ok) {
        const manifest = await mRes.json();
        const list = (manifest[path] || [])
          .filter(Boolean)
          .map((fullPath) => ({
            name: fullPath.split("/").pop(),
            url: `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${fullPath}`,
            sha: fullPath,
            size: 0,
          }));
        if (list.length) {
          try {
            sessionStorage.setItem(key, JSON.stringify(list));
            sessionStorage.setItem(tkey, String(now));
          } catch {}
          return list;
        }
      }
    }
  } catch {}

  const url = `${GH_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
    repo
  )}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(ref)}`;
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) {
    if (res.status === 403) {
      console.warn("GitHub rate limit hit. Manifest recommended.");
      return [];
    }
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
            Collect the Treasure. <span className="opacity-90">ONE PIECE at a time.</span>
          </h1>
          <p className="mt-3 max-w-3xl text-sm md:text-base text-neutral-200">
            Fashion · Portraits · Candids · Portfolio · Professional headshots · Events .
          </p>
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
    <section id="faq" className="py-2">
      {showTitle && (
        <h2 className={`text-3xl md:text-4xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}>
          FAQ
        </h2>
      )}
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

/* ===================== Services ===================== */
function ServicesSection({ T, showTitle = true }) {
  return (
    <section id="services" className="py-2">
      {showTitle && (
        <h2 className={`text-3xl md:text-4xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}>
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
            <li>Deliverables: curated 3 - 5 edited images per outfit</li>
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
        <a href="#booking" className={`${T.link} text-sm mt-3 inline-block`}>
          Enquire for availability →
        </a>
      </div>
    </section>
  );
}

/* ===================== Pricing ===================== */
function PricingSection({ T, showTitle = true }) {
  const tiers = [
    {
      name: "Portrait Session",
      price: "from ₹4,500",
      includes: [
        "60–90 min · up to 2 outfits",
        "6 lightly retouched hero shots",
        "Curated 3 - 5 edited images per outfit",
        "Location & styling guidance",
      ],
    },
    {
      name: "Headshots (Solo/Team)",
      price: "from ₹5,000",
      includes: [
        "60–90 min · up to 2 outfits",
        "Consistent lighting & framing",
        "Curated 3 - 5 edited images per outfit",
        "On-location option available",
      ],
    },
    {
      name: "Fashion / Editorial (Half-day)",
      price: "from ₹10,000",
      includes: [
        "Pre-prod planning & moodboard",
        "Lighting & look management",
        "Curated 3 - 5 edited images per outfit",
        "Team coordination on request",
        "Hour based - no limits for outfit changes",
      ],
    },
    {
      name: "Event Coverage (2 hrs)",
      price: "from ₹8,000",
      includes: [
        "Focused coverage of key moments",
        "Colour-graded selects",
        "Extendable by hour",
        "Editing based on request - add on",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-2">
      {showTitle && (
        <h2 className={`text-3xl md:text-4xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}>
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
            <a href="#booking" className={`${T.link} text-sm mt-4 inline-block`}>
              Request a quote →
            </a>
          </article>
        ))}
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {/* FIX #1: p→ul with list items */}
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

/* ===================== Portfolio ===================== */

// (Optional utility, kept if needed later)
function useEdgeSpacers(containerRef, slideSelector) {
  const [spacer, setSpacer] = useState(0);
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const compute = () => {
      const slide = root.querySelector(slideSelector);
      if (!slide) return setSpacer(0);
      const cw = root.clientWidth;
      const sw = slide.clientWidth || 0;
      setSpacer(Math.max(0, (cw - sw) / 2));
    };
    const rafCompute = () => requestAnimationFrame(compute);
    compute();
    const ro = new ResizeObserver(rafCompute);
    ro.observe(root);
    window.addEventListener("resize", rafCompute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", rafCompute);
    };
  }, [containerRef, slideSelector]);
  return spacer;
}

// Toggles for landing UI
const SHOW_ARROW_NAV = true;
const SHOW_CHIP_BAR = true;

function PortfolioLanding({ T, cats, states, openCat, initialIdx = 0 }) {
  const [hoverIdx, setHoverIdx] = useState(-1);
  const [active, setActive] = useState(0);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [edge, setEdge] = useState(null); // 'left' | 'right' | null
  const trackRef = useRef(null);
  const wrapRef = useRef(null);

  // FIX #5: compute global failed/empty state
  const allLoaded = states.every((s) => !s.loading);
  const anyImages = states.some((s) => (s.images?.length || 0) > 0);
  const showMediaBanner = allLoaded && !anyImages;

  // Center the given initial index when landing
  useEffect(() => {
    if (!trackRef.current) return;
    const idx = Math.min(cats.length - 1, Math.max(0, initialIdx));
    setActive(idx);
    requestAnimationFrame(() => {
      const el = trackRef.current?.querySelector(`[data-idx="${idx}"]`);
      el?.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" });
    });
  }, [initialIdx, cats.length]);

  // Track centered tile & scrollability
  useEffect(() => {
    const root = trackRef.current;
    if (!root) return;

    const update = () => {
      const slides = Array.from(root.querySelectorAll("[data-idx]"));
      if (!slides.length) return;

      const center = root.scrollLeft + root.clientWidth / 2;
      let best = 0,
        bestDist = Infinity;
      slides.forEach((el, i) => {
        const mid = el.offsetLeft + el.offsetWidth / 2;
        const d = Math.abs(mid - center);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);

      const sl = root.scrollLeft;
      const max = root.scrollWidth - root.clientWidth;
      setCanLeft(sl > 8);
      setCanRight(sl < max - 8);
    };

    update();
    root.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      root.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollToIdx = (idx) => {
    const clamped = Math.min(cats.length - 1, Math.max(0, idx));
    const el = trackRef.current?.querySelector(`[data-idx="${clamped}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  const go = (dir) => scrollToIdx(active + dir);

  // Edge-hover reveal for arrows
  const EDGE_ZONE = 88;
  const onPointerMove = (e) => {
    const host = wrapRef.current;
    if (!host) return;
    const r = host.getBoundingClientRect();
    const x = e.clientX - r.left;
    if (x <= EDGE_ZONE) setEdge("left");
    else if (x >= r.width - EDGE_ZONE) setEdge("right");
    else setEdge(null);
  };
  const onPointerLeave = () => setEdge(null);

  const showLeft = SHOW_ARROW_NAV && edge === "left" && canLeft;
  const showRight = SHOW_ARROW_NAV && edge === "right" && canRight;

  return (
    <section id="portfolio" className="py-2">
      <header className="mb-4">
        <h2 className={`text-4xl md:text-5xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}>
          Portfolio
        </h2>
        <p className={`mt-2 ${T.muted}`}>Hover near the edges for arrows, or use chips to jump.</p>

        {showMediaBanner && (
          <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-sm p-3">
            Couldn’t load images right now. If this is a new deploy, ensure your
            <span className="font-medium"> manifest.json</span> contains category paths, or try a refresh (<code>?refresh=1</code>).
          </div>
        )}
      </header>

      {SHOW_CHIP_BAR && (
        <nav
          aria-label="Categories"
          className="mb-3 -mx-2 sm:-mx-3 md:-mx-4 px-2 sm:px-3 md:px-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <ul className="flex gap-2">
            {cats.map((c, i) => {
              const isActive = i === active;
              return (
                <li key={`chip-${c.label}`}>
                  <button
                    onClick={() => scrollToIdx(i)}
                    className={`px-3 py-1.5 rounded-2xl border text-sm transition shadow-sm ${
                      isActive ? T.chipActive : T.chipInactive
                    }`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {c.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      <div ref={wrapRef} className="relative" onMouseMove={onPointerMove} onMouseLeave={onPointerLeave}>
        {SHOW_ARROW_NAV && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className={[
                "pointer-events-auto absolute left-2 md:left-3 top-1/2 -translate-y-1/2",
                "h-9 w-9 md:h-10 md:w-10 rounded-full border grid place-items-center transition",
                "backdrop-blur-sm text-white",
                showLeft ? "bg-black/40 hover:bg-black/55 border-white/20 opacity-100" : "opacity-0 pointer-events-none",
              ].join(" ")}
              aria-label="Previous category"
              style={{ zIndex: 5 }}
            >
              ←
            </button>

            <button
              type="button"
              onClick={() => go(1)}
              className={[
                "pointer-events-auto absolute right-2 md:right-3 top-1/2 -translate-y-1/2",
                "h-9 w-9 md:h-10 md:w-10 rounded-full border grid place-items-center transition",
                "backdrop-blur-sm text-white",
                showRight ? "bg-black/40 hover:bg-black/55 border-white/20 opacity-100" : "opacity-0 pointer-events-none",
              ].join(" ")}
              aria-label="Next category"
              style={{ zIndex: 5 }}
            >
              →
            </button>
          </>
        )}

        <div
          ref={trackRef}
          className="
            flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto px-2 sm:px-3 md:px-4
            snap-x snap-mandatory
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          "
          role="region"
          aria-roledescription="carousel"
          aria-label="Category cards"
          tabIndex={0}
        >
          <div className="flex-shrink-0 w-[6%] sm:w-[10%] md:w-[14%]" aria-hidden="true" />

          {cats.map((c, i) => {
            const st = states[i] || { images: [], loading: true, error: "" };
            const cover = pickCoverForCategory(st.images, c.label);
            const [rx, ry, s] = hoverIdx === i ? [4, -4, 1.02] : [0, 0, 1];
            const isActive = i === active;

            return (
              <article
                key={c.label}
                data-idx={i}
                className="snap-center relative flex-shrink-0 w-[64%] sm:w-[44%] md:w-[30%] lg:w-[24%] xl:w-[20%]"
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(-1)}
                onFocus={() => setHoverIdx(i)}
                onBlur={() => setHoverIdx(-1)}
              >
                <button
                  type="button"
                  onClick={() => openCat(c.label)}
                  className={[
                    "group block w-full rounded-2xl overflow-hidden border shadow-sm transition-transform duration-200",
                    isActive ? "ring-2 ring-white/80" : "",
                    T.cardBorder,
                    T.cardBg,
                  ].join(" ")}
                  style={{ transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${s})` }}
                  aria-label={`Open ${c.label}`}
                >
                  <div className="aspect-[3/4] relative">
                    {cover ? (
                      <img
                        src={cover}
                        alt={c.label}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-neutral-600/30" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50" />
                    <div className="absolute left-3 right-3 bottom-3">
                      <h3 className="text-white font-['Playfair_Display'] uppercase tracking-[0.08em] text-[clamp(18px,2.2vw,28px)] drop-shadow">
                        {c.label}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-white/90 text-[11px] opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        Enter →
                      </span>
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

/* Page (horizontal carousel) — with floating quick-exit pill */
/* ===================== Portfolio Page (adds Vertical feed) ===================== */
/* ===================== Portfolio Page (Vertical default + all layouts) ===================== */
/* ===================== Portfolio Page (desktop+mobile lightbox fixes; no filenames) ===================== */
/* ===================== Portfolio Page (desktop+mobile lightbox fixes; no filenames) ===================== */
function PortfolioPage({ T, cat, state, onBack }) {
  const items = state.images || [];
  const blurb = GH_CATEGORIES_EXT[cat.label]?.blurb || "";

  // --- Shared state ---
  const containerRef = useRef(null);        // horizontal carousel container
  const [activeIndex, setActiveIndex] = useState(0);
  const [lbIdx, setLbIdx] = useState(-1);   // -1 = lightbox closed

  // --- Layout mode: 'carousel' | 'grid' | 'masonry' | 'vertical'
  const LAYOUTS = ["carousel", "masonry", "vertical"];
  const [layout, setLayout] = useState(() => {
    const u = new URL(window.location.href);
    const q = (u.searchParams.get("layout") || "").toLowerCase();
    return LAYOUTS.includes(q) ? q : "carousel";
  });
  useEffect(() => {
    const u = new URL(window.location.href);
    u.searchParams.set("layout", layout);
    window.history.replaceState(null, "", u.toString());
  }, [layout]);

  // --- Track centered tile for horizontal carousel ---
  useEffect(() => {
    if (layout !== "carousel") return;
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
    return () => {
      root.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [layout]);

  // --- Page-level keyboard nav (disabled while lightbox is open) ---
  useEffect(() => {
    if (lbIdx >= 0) return; // do not attach when lightbox is open

    const goHoriz = (dir) => {
      const idx = Math.min(items.length - 1, Math.max(0, activeIndex + dir));
      const el = containerRef.current?.querySelector(`[data-idx="${idx}"]`);
      el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    };

    const onKey = (e) => {
      if (lbIdx >= 0) return; // double guard
      if (layout === "vertical") {
        if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); vertGo(1); }
        if (e.key === "ArrowUp"   || e.key === "PageUp")   { e.preventDefault(); vertGo(-1); }
        if (e.key === "Home") vertGoTo(0);
        if (e.key === "End")  vertGoTo(items.length - 1);
      } else {
        if (e.key === "ArrowRight") goHoriz(1);
        if (e.key === "ArrowLeft")  goHoriz(-1);
        if (e.key === "Home")       goHoriz(-999);
        if (e.key === "End")        goHoriz(+999);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, items.length, lbIdx, layout]);

  // --- Helpers for horizontal carousel direct jump from thumbs ---
  const goTo = (idx) => {
    const el = containerRef.current?.querySelector(`[data-idx="${idx}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  // --- Lightbox controls ---
  const navLightbox = (dir) => {
    setLbIdx((i) => {
      if (i < 0) return i;
      const next = Math.min(items.length - 1, Math.max(0, i + dir));
      return next;
    });
  };
  const closeLbAndSync = () => {
    const idx = lbIdx;
    setLbIdx(-1);
    document.body.classList.remove("lb-open");
    document.body.style.overflow = "";
    if (layout === "carousel" && idx >= 0) {
      const el = containerRef.current?.querySelector(`[data-idx="${idx}"]`);
      el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  // --- Lightbox: keyboard (ESC + arrows) ---
  useEffect(() => {
    if (lbIdx < 0) return;
    const onKey = (e) => {
      // prevent background handlers
      e.stopPropagation();
      if (e.key === "Escape") { e.preventDefault(); closeLbAndSync(); }
      if (e.key === "ArrowRight") { e.preventDefault(); navLightbox(1); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); navLightbox(-1); }
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [lbIdx]);

  // --- Lightbox: mobile swipe ---
  const touchStartX = useRef(null);
  const onLbTouchStart = (e) => { touchStartX.current = e.touches?.[0]?.clientX ?? null; };
  const onLbTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = (e.changedTouches?.[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(dx) > 50) navLightbox(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  // prevent background scroll when lightbox open
  useEffect(() => {
    if (lbIdx >= 0) {
      document.body.classList.add("lb-open");
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.classList.remove("lb-open");
      document.body.style.overflow = "";
    };
  }, [lbIdx]);

  // --- Vertical feed: refs + tracking (Insta-style) ---
  const vWrapRef = useRef(null);
  const vItemRefs = useRef([]);
  vItemRefs.current = [];
  const registerVItem = (el) => { if (el) vItemRefs.current.push(el); };

  const vertGoTo = (idx) => {
    const el = vItemRefs.current[idx];
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const vertGo = (dir) => {
    const next = Math.min(items.length - 1, Math.max(0, activeIndex + dir));
    vertGoTo(next);
  };

  useEffect(() => {
    if (layout !== "vertical") return;
    const root = vWrapRef.current;
    if (!root) return;

    const snapLine = () => root.getBoundingClientRect().top + window.innerHeight * 0.2;

    let ticking = false;
    const handle = () => {
      ticking = false;
      const line = snapLine();
      let best = 0, bestDist = Infinity;
      vItemRefs.current.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top - line);
        if (d < bestDist) { best = i; bestDist = d; }
      });
      setActiveIndex(best);
    };

    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(handle); }
    };

    const io = new IntersectionObserver(onScroll, { root: null, threshold: [0, 0.5, 1] });
    vItemRefs.current.forEach((el) => io.observe(el));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    handle();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [layout, items.length]);

  return (
    <section className="py-2" id="portfolio">
      {/* Floating quick-exit button */}
      <div className="fixed left-3 md:left-4 top-[calc(72px+10px)] z-[60]">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to categories"
          className="rounded-full px-3 py-1.5 text-sm border border-white/30 bg-black/30 text-white backdrop-blur-sm hover:bg-black/50"
        >
          ← All categories
        </button>
      </div>

      {/* Sticky breadcrumb + title */}
      <div className="mb-4 sticky top-[72px] z-[1] backdrop-blur">
        <div className="pt-3">
          <button className={`${T.linkSubtle} text-sm`} onClick={onBack}>
            Portfolio
          </button>
          <span className={`mx-2 ${T.muted2}`}>/</span>
          <span className={`text-sm ${T.navTextStrong}`}>{cat.label}</span>
        </div>
        <h2 className={`mt-1 text-4xl md:text-5xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}>
          {cat.label}
        </h2>
        {blurb ? <p className={`mt-1 ${T.muted}`}>{blurb}</p> : null}
      </div>

      {/* Layout picker (desktop + mobile chips already in your app) */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xs opacity-70">Layout:</span>
        {LAYOUTS.map((k) => (
          <button
            key={k}
            onClick={() => setLayout(k)}
            className={[
              "text-xs rounded-full border px-3 py-1 transition",
              layout === k
                ? "bg-black text-white border-black"
                : "border-neutral-300 hover:bg-neutral-100"
            ].join(" ")}
            aria-pressed={layout === k}
          >
            {k.charAt(0).toUpperCase() + k.slice(1)}
          </button>
        ))}
      </div>

      {/* Right side counter */}
      <div className="fixed right-4 md:right-6 top-[calc(72px+12px)] text-[11px] tracking-[0.25em] opacity-80 pointer-events-none z-[60]">
        {items.length ? `${activeIndex + 1} / ${items.length}` : "0 / 0"}
      </div>

      {/* ======== GALLERY CONDITIONAL ======== */}
      {state.error ? (
        <div className="text-red-500">{String(state.error)}</div>
      ) : state.loading ? (
        <div className={`${T.muted2}`}>Loading…</div>
      ) : !items.length ? (
        <div className={`${T.muted}`}>No images yet for {cat.label}.</div>
      ) : layout === "vertical" ? (
        /* ===== VERTICAL (Insta-style) ===== */
        <div
          ref={vWrapRef}
          className="
            mx-auto max-w-[980px]
            px-2 sm:px-3 md:px-4
            space-y-6 sm:space-y-8
            overflow-y-auto
            scroll-smooth
            snap-y snap-mandatory
          "
          style={{ maxHeight: "calc(100vh - 110px)" }}
        >
          {items.map((it, i) => (
            <article key={it.sha || i} ref={registerVItem} data-idx={i} className="snap-start">
              <div className={`rounded-2xl border shadow-sm ${T.cardBg} ${T.cardBorder}`}>
                {/* optional mini header */}
                <div className="flex items-center justify-between px-4 pt-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="inline-flex h-7 w-7 rounded-full bg-neutral-300/40" />
                    <span className={`${T.navTextStrong}`}>{cat.label}</span>
                  </div>
                  <span className={`text-[11px] ${T.muted2}`}>{i + 1} / {items.length}</span>
                </div>

                <div className="mt-2">
                  <button
                    onClick={() => { setActiveIndex(i); setLbIdx(i); }}
                    className="block w-full"
                    aria-label={`Open image ${i + 1}`}
                  >
                    <img
                      src={it.url}
                      alt={cat.label}          // no filename
                      loading="lazy"
                      className="w-full h-auto max-h-[88vh] object-contain bg-black/5"
                    />
                  </button>
                </div>

                {/* show caption only if provided */}
                {it.caption && (
                  <div className="px-4 py-3">
                    <p className={`text-sm ${T.muted}`}>{it.caption}</p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : layout === "carousel" ? (
        /* ===== HORIZONTAL CAROUSEL ===== */
        <>
          <div
            ref={containerRef}
            role="region"
            aria-roledescription="carousel"
            aria-label={`${cat.label} images`}
            aria-live="polite"
            tabIndex={0}
            className="
              mx-auto max-w-[1600px]
              overflow-x-auto
              snap-x snap-mandatory
              flex items-stretch gap-4 sm:gap-5 md:gap-6
              px-2 sm:px-3 md:px-4
              pb-6
              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
              select-none
            "
          >
            <div className="flex-shrink-0 w-[9%] sm:w-[14%] md:w-[18%] lg:w-[21%]" aria-hidden="true" />
            {items.map((it, i) => (
              <figure
                key={it.sha || i}
                data-idx={i}
                className={`
                  relative flex-shrink-0
                  w-[82%] sm:w-[72%] md:w-[64%] lg:w-[58%]
                  snap-center transition-transform duration-300
                  ${i === activeIndex ? "scale-[1.01]" : "scale-[0.995]"}
                `}
              >
                <div className={`rounded-2xl ${i === activeIndex ? "shadow-lg" : "shadow-sm"}`}>
                  <img
                    src={it.url}
                    alt={cat.label}          // no filename
                    className="mx-auto rounded-2xl object-contain max-h-[68vh] w-auto h-[58vh] sm:h-[64vh] md:h-[68vh] cursor-zoom-in"
                    loading="lazy"
                    onClick={() => setLbIdx(i)}
                  />
                </div>
              </figure>
            ))}
            <div className="flex-shrink-0 w-[9%] sm:w-[14%] md:w-[18%] lg:w-[21%]" aria-hidden="true" />
          </div>

          {/* Thumbnails */}
          <div className="mt-2 flex justify-center">
            <div className="flex gap-2 overflow-x-auto px-2 pb-1" style={{ scrollbarWidth: "none" }}>
              {items.map((it, i) => (
                <button
                  key={`thumb-${i}`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={`
                    h-14 w-10 rounded-md overflow-hidden border transition
                    ${i === activeIndex ? "opacity-100 ring-2 ring-white" : "opacity-60 hover:opacity-90"}
                  `}
                >
                  <img src={it.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </>
      ) : layout === "grid" ? (
        /* ===== SIMPLE GRID ===== */
        <div className="mx-auto max-w-[1600px] px-2 sm:px-3 md:px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {items.map((it, i) => (
              <button
                key={it.sha || i}
                onClick={() => { setActiveIndex(i); setLbIdx(i); }}
                className="group block w-full rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition"
              >
                <div className="h-44 sm:h-52 md:h-60">
                  <img src={it.url} alt={cat.label} className="h-full w-full object-cover" loading="lazy" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ===== MASONRY (CSS columns) ===== */
        <div className="mx-auto max-w-[1600px] px-2 sm:px-3 md:px-4">
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 md:gap-5 [column-fill:_balance]">
            {items.map((it, i) => (
              <button
                key={it.sha || i}
                onClick={() => { setActiveIndex(i); setLbIdx(i); }}
                className="mb-3 sm:mb-4 md:mb-5 w-full overflow-hidden rounded-2xl border shadow-sm hover:shadow-md transition"
                style={{ breakInside: "avoid" }}
              >
                <img src={it.url} alt={cat.label} className="w-full h-auto block" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===== Lightbox ===== */}
      {lbIdx >= 0 && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={closeLbAndSync}
          onTouchStart={onLbTouchStart}
          onTouchEnd={onLbTouchEnd}
        >
          {/* edge controls */}
          <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); navLightbox(-1); }}
              className="pointer-events-auto mx-2 md:mx-4 h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center"
              aria-label="Previous image"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); navLightbox(1); }}
              className="pointer-events-auto mx-2 md:mx-4 h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center"
              aria-label="Next image"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>

          <img
            src={items[lbIdx].url}
            alt={cat.label}  // no filename
            className="max-h-[92vh] max-w-[92vw] object-contain cursor-zoom-out"
            onClick={(e) => { e.stopPropagation(); closeLbAndSync(); }}
          />
        </div>
      )}
    </section>
  );
}

function MobileLayoutFab({ visible, layout, setLayout }) {
  const order = ["vertical", "carousel", "masonry"];
  const nextLayout = () => {
    const i = order.indexOf(layout);
    setLayout(order[(i + 1) % order.length]);
    try { window.navigator.vibrate?.(10); } catch {}
  };
  if (!visible) return null;
  return (
    <div className="sm:hidden fixed right-4 bottom-20 z-[60]">
      <button onClick={nextLayout} className="h-12 w-12 rounded-full bg-black/70 text-white">
        {layout[0].toUpperCase()}
      </button>
    </div>
  );
}


/* Wrapper (hash-driven view switch) */
function Portfolio({ T }) {
  const [states, setStates] = useState(() =>
    GH_CATEGORIES.map(() => ({ loading: true, error: "", images: [] }))
  );
  const [hash, setHash] = useHash();
  const [view, setView] = useState("landing"); // "landing" | "page"
  const [activeIdx, setActiveIdx] = useState(-1);

  const openCat = (label) => {
    // normalize label from hash (case-insensitive)
    const idx = GH_CATEGORIES.findIndex((c) => c.label.toLowerCase() === label.toLowerCase());
    if (idx < 0) return;
    try {
      sessionStorage.setItem("pradhu:lastCat", String(idx));
    } catch {}
    setActiveIdx(idx);
    setView("page");
    setHash(`#portfolio/${encodeURIComponent(GH_CATEGORIES[idx].label)}`);
    const el = document.getElementById("portfolio");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goLanding = () => {
    setView("landing");
    setActiveIdx(-1);
    setHash("#portfolio");
  };

  // hash → view
  useEffect(() => {
    if (!hash.startsWith("#portfolio")) return;
    const seg = hash.split("/");
    if (seg.length >= 2 && seg[1]) {
      const label = decodeURIComponent(seg[1].replace(/^#?portfolio\/?/, ""));
      const idx = GH_CATEGORIES.findIndex((c) => c.label.toLowerCase() === label.toLowerCase());
      if (idx >= 0) {
        setActiveIdx(idx);
        setView("page");
        return;
      }
    }
    setView("landing");
    setActiveIdx(-1);
  }, [hash]);

  // fetch images (manifest-first)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const results = await Promise.all(
        GH_CATEGORIES.map(async (cat) => {
          try {
            const list = await ghListFolder(GH_OWNER, GH_REPO, cat.path, GH_BRANCH);
            return { loading: false, error: "", images: list };
          } catch (e) {
            return { loading: false, error: e?.message || "Failed to load", images: [] };
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

  const lastIdx = (() => {
    try {
      const n = Number(sessionStorage.getItem("pradhu:lastCat") || 0);
      return Number.isFinite(n) ? n : 0;
    } catch {
      return 0;
    }
  })();

  return (
    <PortfolioLanding
      T={T}
      cats={GH_CATEGORIES}
      states={states}
      openCat={openCat}
      initialIdx={lastIdx}
    />
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
      <div className="flex gap-3 overflow-x-auto whitespace-nowrap pb-2" style={{ scrollbarWidth: "none" }}>
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
              <Icon name={t.icon} className={`h-4 w-4 ${active ? "opacity-100" : "opacity-60"}`} />
              <span className="text-sm">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ===================== Booking (About + Enquiry) ===================== */
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
  const [note, setNote] = useState({ kind: "", text: "" }); // {kind: 'error'|'info'|'success', text}
  const [whatsCTA, setWhatsCTA] = useState(""); // FIX #2: success CTA

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

  const onChange = (e) => {
    setWhatsCTA("");
    setNote({ kind: "", text: "" });
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // simple validators for India context
  const isValidEmail = (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const normalizePhone = (v) => v.replace(/[^\d]/g, "");
  const isValidINPhone = (v) => {
    const d = normalizePhone(v);
    // accept 10-digit starting 6-9 or prefixed by 0/91
    if (/^(?:\+?91)?[6-9]\d{9}$/.test(d)) return true;
    if (/^0[6-9]\d{9}$/.test(d)) return true;
    return false;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setNote({ kind: "", text: "" });
    setWhatsCTA("");

    const missing = [];
    if (!form.name.trim()) missing.push("Name");
    if (!form.email.trim()) missing.push("Email");
    if (!form.phone.trim()) missing.push("Phone");
    if (form.date && form.date < minDateStr) missing.push(`Preferred Date (≥ ${fmtHuman(minDateStr)})`);
    if (missing.length) {
      setNote({ kind: "error", text: `Please fill: ${missing.join(", ")}` });
      return;
    }
    if (!isValidEmail(form.email)) {
      setNote({ kind: "error", text: "Please enter a valid email address." });
      return;
    }
    if (!isValidINPhone(form.phone)) {
      setNote({ kind: "error", text: "Please enter a valid 10-digit Indian mobile (with or without +91)." });
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

      // success UI
      const cleanPhone = normalizePhone(form.phone);
      const waText = encodeURIComponent(
        `Hi Pradhu! This is ${form.name}. I just sent an enquiry from your website.\nService: ${form.service}\nCity: ${form.city}\nPreferred date: ${form.date ? fmtHuman(form.date) : "TBD"}\nDetails: ${form.message || "—"}`
      );
      const waHref =
        WHATSAPP_NUMBER.includes("X")
          ? ""
          : `https://wa.me/${WHATSAPP_NUMBER.replace(/[^\d]/g, "")}?text=${waText}`;

      setNote({ kind: "success", text: "Thanks! Your enquiry was submitted. I’ll reply shortly." });
      setWhatsCTA(waHref);

      // reset form
      setForm({
        name: "",
        email: "",
        phone: "",
        service: "Portraits",
        city: "Pune",
        date: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      setNote({ kind: "error", text: "Couldn’t submit right now. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="booking" className={`${T.sectionAltBg} border-t ${T.footerBorder}`}>
      <div className={`${CONTAINER} py-16`}>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div id="about">
            <h2 className={`text-3xl md:text-4xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}>
              About PRADHU
            </h2>
            <p className={`mt-3 ${T.muted}`}>
              As an aspiring photographer from Kanchipuram, I work across fashion, portraits, candids and events. I run a client-first process: I listen to your brief and offer tailored recommendations on looks, lighting, locations and timelines so the day feels effortless. On set, I work with calm, unobtrusive direction to create space for genuine expression. My aim is to capture the beauty, joy and decisive moments that define your story—delivering images that feel personal, polished and purposeful.
            </p>
            <ul className={`mt-4 text-sm list-disc pl-5 space-y-1 ${T.muted}`}>
              <li>Genres: Fashion, High Fashion, Portraits, Editorials, Candids, Portfolio, Professional Headshots, Street Fashion, Studio </li>
              <li>Kit: Nikon D7500, Softboxes (octa & strip), multiple flashes, light modifiers</li>
              <li>{SERVICE_CITIES}</li>
            </ul>

            <div className="mt-5 flex items-center gap-3">
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

          <div>
            <h2 className={`text-3xl md:text-4xl font-['Playfair_Display'] uppercase tracking-[0.08em] ${T.navTextStrong}`}>
              Enquire / Book
            </h2>
            <p className={`mt-2 ${T.muted}`}>Share details and I’ll reply with availability and a quote.</p>

            <form onSubmit={onSubmit} className={`mt-6 rounded-2xl border p-6 shadow-sm ${T.panelBg} ${T.panelBorder}`}>
              <div className="grid grid-cols-1 gap-4">
                <Input T={T} label="Name" name="name" value={form.name} onChange={onChange} required />
                <Input T={T} label="Email" name="email" type="email" value={form.email} onChange={onChange} required />
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
                        setNote({ kind: "info", text: `Earliest available date is ${fmtHuman(minDateStr)}.` });
                      }
                      setForm({ ...form, date: v });
                    }}
                    className={`mt-1 w-full rounded-xl border px-3 py-2 ${T.inputBg} ${T.inputBorder} ${T.inputText} ${T.placeholder}`}
                  />
                  <p className="text-xs opacity-70 mt-1">Earliest selectable: {fmtHuman(minDateStr)}</p>
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
                      {["Portraits", "Fashion", "Candids", "Street", "Events", "Other"].map((s) => (
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

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-neutral-900 text-white px-4 py-2 font-medium hover:opacity-90 disabled:opacity-60"
                  >
                    {submitting ? "Submitting…" : "Send Enquiry"}
                  </button>

                  {/* Note / validations */}
                  {note.text ? (
                    <span
                      className={`text-sm ${
                        note.kind === "error"
                          ? "text-red-600"
                          : note.kind === "success"
                          ? "text-emerald-600"
                          : "opacity-80"
                      }`}
                    >
                      {note.text}
                    </span>
                  ) : null}

                  {/* FIX #2: WhatsApp CTA on success */}
                  {whatsCTA && (
                    <a
                      href={whatsCTA}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50"
                    >
                      <Icon name="whatsapp" className="h-4 w-4" />
                      Continue on WhatsApp
                    </a>
                  )}
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
    const forced = url.searchParams.get(INTRO_FORCE_QUERY) === "1" || url.hash === INTRO_FORCE_HASH;
    if (forced) return true;
    if (!INTRO_REMEMBER) return true;
    return sessionStorage.getItem("pradhu:intro:dismissed") !== "1";
  });

  const [openId, setOpenId] = useState("");
  const [activeNav, setActiveNav] = useState("home");

  // Active nav via IntersectionObserver
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
    setActiveNav(id);
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
      // When intro is visible, hide background for SR users
      aria-hidden={showIntro ? "true" : undefined}
      className={`min-h-screen ${T.pageBg} ${T.pageText} font-['Inter'] ${theme === "light" ? "bg-dots-light" : "bg-dots-dark"}`}
    >
      <HeadFonts />
      {showIntro && <IntroOverlay onClose={closeIntro} />}

      {/* NAVBAR */}
      <header className={`sticky top-0 z-50 backdrop-blur border-b ${T.navBg} ${T.navBorder}`}>
        <nav className={`${CONTAINER} py-4 lg:py-5 grid grid-cols-[1fr_auto_auto] items-center gap-3`}>
          <div className="min-w-0">
            <p
              className={`font-['Playfair_Display'] uppercase tracking-[0.08em] leading-none ${T.navTextStrong}
                    text-[clamp(20px,2.4vw,40px)] whitespace-nowrap`}
            >
              {NAV_BRAND}
            </p>
          </div>

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
                  <Icon name={icon} className={`h-4 w-4 ${activeNav === id ? "opacity-100" : "opacity-60"}`} />
                  <span className="text-sm">{label}</span>
                </button>
              </li>
            ))}
          </ul>

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

        {menuOpen && (
          <div id="mobile-menu" className={`lg:hidden border-t ${T.navBorder} ${T.sectionAltBg} w-full`}>
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

      {/* CONTACT / ENQUIRY */}
      <BookingSection T={T} />

      {/* FOOTER */}
      <footer className={`border-t ${T.footerBorder} ${T.footerBg}`}>
        <div className={`${CONTAINER} py-10 text-sm`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <p className={T.muted}>© {new Date().getFullYear()} PRADHU — All rights reserved.</p>
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
  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") setLight();
    if (e.key === "ArrowRight") setDark();
  };
  return (
    <div className="relative h-9 w-[150px] select-none" role="tablist" aria-label="Theme" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 rounded-full border border-neutral-300 bg-neutral-100" />
      <div
        className={`absolute top-0 left-0 h-full w-1/2 rounded-full shadow-sm transition-transform duration-200 ${
          isDark ? "translate-x-full bg-neutral-900" : "translate-x-0 bg-white border border-neutral-300"
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
          <Icon name="sun" className={`h-4 w-4 ${isDark ? "opacity-40 text-neutral-600" : "opacity-100 text-neutral-900"}`} />
          <span className={`text-xs ${isDark ? "opacity-50 text-neutral-700" : "opacity-100 text-neutral-900 font-medium"}`}>
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
          <Icon name="moon" className={`h-4 w-4 ${isDark ? "opacity-100 text-white" : "opacity-40 text-neutral-600"}`} />
          <span className={`text-xs ${isDark ? "opacity-100 text-white font-medium" : "opacity-50 text-neutral-700"}`}>Dark</span>
        </button>
      </div>
    </div>
  );
}
