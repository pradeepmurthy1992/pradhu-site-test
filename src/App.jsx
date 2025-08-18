import React, { useEffect, useMemo, useRef, useState } from "react";

/* ============================================================
   PRADHU — Dual Theme (Light / Dark) + Intro Overlay + Wide Layout
   - Brand text in navbar now very large (near hero size), items unchanged
   - Force-refresh switch ?refresh=1 bypasses 5-min cache
============================================================ */

/* ===================== CONFIG ===================== */
// Intro overlay
const INTRO_ENABLED = true;
const INTRO_BRAND = "PRADEEP";
const INTRO_NAME = "Pradhu Photography";
const INTRO_AUTO_DISMISS_MS = 0;
const INTRO_LEFT_IMAGE_URL =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop";

// Force-open controls
const INTRO_REMEMBER = true;
const INTRO_FORCE_QUERY = "intro"; // use ?intro=1
const INTRO_FORCE_HASH = "#intro";

// Hero background (use a direct image URL)
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

// Enquiry/payments
const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // 9198xxxxxxx (no + / spaces)
const UPI_ID = "yourvpa@upi";
const RAZORPAY_LINK = "";
const BOOKING_ADVANCE_INR = 2000;

// Navbar
const NAV_BRAND = "Pradhu Photography";
const NAV_ITEMS = [
  { label: "Home", id: "home", icon: "home" },
  { label: "Portfolio", id: "portfolio", icon: "grid" },
  { label: "Services", id: "services", icon: "briefcase" },
  { label: "Pricing", id: "pricing", icon: "tag" },
  { label: "About", id: "about", icon: "user" },
  // Testimonials intentionally hidden for now
  { label: "Instagram", id: "instagram", icon: "camera" },
  { label: "FAQ", id: "faq", icon: "help" },
  { label: "Contact", id: "booking", icon: "mail" },
];

// Wide container helper for big screens
const CONTAINER = "mx-auto w-full max-w-[1800px] px-4 xl:px-8";

/* ===================== THEME TOKENS ===================== */
function useThemeTokens(theme) {
  const light = {
    pageBg: "bg-white",
    pageText: "text-neutral-900",
    navBg: "bg-white/85",
    navBorder: "border-neutral-200",
    navText: "text-neutral-700",
    navTextStrong: "text-neutral-900",
    hoverOverlay: "bg-black/5",
    sectionAltBg: "bg-neutral-50",
    panelBg: "bg-white",
    panelBorder: "border-neutral-200",
    cardBg: "bg-white",
    cardBorder: "border-neutral-200",
    muted: "text-neutral-600",
    muted2: "text-neutral-500",
    chipActive: "bg-neutral-900 text-white border-neutral-900",
    chipInactive:
      "bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50",
    btnOutline: "border-neutral-300 text-neutral-900 hover:bg-neutral-50",
    inputBg: "bg-white",
    inputBorder: "border-neutral-300",
    inputText: "text-neutral-900",
    placeholder: "placeholder-neutral-400",
    footerBg: "bg-white",
    footerBorder: "border-neutral-200",
    link: "text-neutral-900 underline",
    linkSubtle: "text-neutral-800 underline",
  };

  const dark = {
    pageBg: "bg-neutral-950",
    pageText: "text-neutral-100",
    navBg: "bg-neutral-950/85",
    navBorder: "border-neutral-800",
    navText: "text-neutral-300",
    navTextStrong: "text-white",
    hoverOverlay: "bg-white/10",
    sectionAltBg: "bg-neutral-950",
    panelBg: "bg-neutral-900",
    panelBorder: "border-neutral-800",
    cardBg: "bg-neutral-900",
    cardBorder: "border-neutral-800",
    muted: "text-neutral-300",
    muted2: "text-neutral-400",
    chipActive: "bg-white text-neutral-900 border-white",
    chipInactive:
      "bg-neutral-900 border-neutral-700 text-neutral-200 hover:bg-neutral-800",
    btnOutline: "border-neutral-700 text-neutral-100 hover:bg-neutral-900",
    inputBg: "bg-neutral-950",
    inputBorder: "border-neutral-700",
    inputText: "text-neutral-100",
    placeholder: "placeholder-neutral-500",
    footerBg: "bg-neutral-950",
    footerBorder: "border-neutral-800",
    link: "text-neutral-100 underline",
    linkSubtle: "text-neutral-100 underline",
  };

  return theme === "light" ? light : dark;
}

/* ===================== Icons ===================== */
function Icon({ name, className = "h-4 w-4" }) {
  const p = { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "home": return (<svg {...p}><path d="M3 11.5L12 4l9 7.5"/><path d="M5 10.5V20h5v-6h4v6h5v-9.5"/></svg>);
    case "grid": return (<svg {...p}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>);
    case "briefcase": return (<svg {...p}><path d="M3.5 8.5h17A1.5 1.5 0 0122 10v7a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 014 17v-7a1.5 1.5 0 011.5-1.5"/><path d="M8 8.5V6.5A2.5 2.5 0 0110.5 4h3A2.5 2.5 0 0116 6.5v2"/><path d="M2 12.5h20"/></svg>);
    case "tag": return (<svg {...p}><path d="M3 12l8.5 8.5a2 2 0 002.8 0L21 13.8a2 2 0 000-2.8L12.2 2H6a3 3 0 00-3 3v6z"/><circle cx="8" cy="8" r="1.2"/></svg>);
    case "user": return (<svg {...p}><circle cx="12" cy="8" r="3.2"/><path d="M4 20a8 8 0 0116 0"/></svg>);
    case "camera": return (<svg {...p}><path d="M4 8.5A2.5 2.5 0 016.5 6H8l1.2-1.6A2 2 0 0110.7 3h2.6a2 2 0 011.6.8L16 6h1.5A2.5 2.5 0 0120 8.5v7A2.5 2.5 0 0117.5 18h-11A2.5 2.5 0 014 15.5v-7z"/><circle cx="12" cy="12" r="3.5"/></svg>);
    case "help": return (<svg {...p}><circle cx="12" cy="12" r="9"/><path d="M9.5 9A2.5 2.5 0 0112 7.5 2.5 2.5 0 0114.5 9.7c0 1.3-1 1.9-1.7 2.3-.7.3-1.3.9-1.3 1.7V15"/><circle cx="12" cy="17.5" r="0.8"/></svg>);
    case "mail": return (<svg {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>);
    case "sun": return (<svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>);
    case "moon": return (<svg {...p}><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z"/></svg>);
    default: return null;
  }
}

/* ===================== Intro Overlay ===================== */
function IntroOverlay({ onClose }) {
  const BLINK_MS = 1600;
  const brandRef = useRef(null);
  const nameRef = useRef(null);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setBlink((b) => !b), BLINK_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function onKey(e) { if (e.key === "Enter") onClose(); }
    function onWheel() { onClose(); }
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { once: true });
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("wheel", onWheel); };
  }, [onClose]);

  useEffect(() => {
    if (!INTRO_AUTO_DISMISS_MS) return;
    const t = setTimeout(onClose, INTRO_AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [onClose]);

  useEffect(() => {
    const fit = () => {
      const brand = brandRef.current;
      const name = nameRef.current;
      if (!brand || !name) return;
      name.style.whiteSpace = "nowrap";
      name.style.display = "inline-block";
      const brandWidth = brand.getBoundingClientRect().width;
      const brandFontPx = parseFloat(getComputedStyle(brand).fontSize) || 80;
      let lo = 8, hi = brandFontPx;
      for (let i = 0; i < 16; i++) {
        const mid = (lo + hi) / 2;
        name.style.fontSize = mid + "px";
        const w = name.getBoundingClientRect().width;
        if (w > brandWidth) hi = mid; else lo = mid;
      }
      name.style.fontSize = Math.floor(lo) + "px";
    };
    const ready = document.fonts?.ready;
    if (ready && typeof ready.then === "function") ready.then(fit);
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <div className="fixed inset-0 bg-black text-white" style={{ zIndex: 9999 }} role="dialog" aria-label="Intro overlay" onClick={onClose}>
      <div className="h-full grid grid-rows-1 md:grid-cols-2">
        <div className="hidden md:flex items-center justify-center bg-black relative">
          <img src={INTRO_LEFT_IMAGE_URL} alt="Intro visual" className="w-1/2 max-w-[520px] h-auto object-contain pointer-events-none" />
        </div>
        <div className="relative flex items-center justify-center p-8">
          <div className="w-full max-w-[880px] text-center select-none">
            <h1 ref={brandRef} className="font-semibold tracking-[0.06em] leading-none text-[18vw] sm:text-[14vw] md:text-[10vw] lg:text-[8.5vw]" style={{ wordSpacing: "0.06em" }}>
              {INTRO_BRAND}
            </h1>
            <div className="mt-2">
              <span ref={nameRef} className="inline-block font-medium tracking-[0.08em] opacity-95" style={{ lineHeight: 1.1 }}>
                {INTRO_NAME}
              </span>
            </div>
            <div className="mt-6"><p className="text-sm md:text-lg">Light • Style • Story</p></div>
            <p className={`mt-10 text-xs md:text-sm text-neutral-300 transition-opacity duration-500 ${blink ? "opacity-100" : "opacity-20"}`}>
              Tap / click / press <kbd className="px-1.5 py-0.5 rounded border border-white/40">Enter</kbd> to enter
            </p>
          </div>
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

  // ---- Quick patch: force-refresh switch (?refresh=1) ----
  const nocache = new URLSearchParams(window.location.search).get("refresh") === "1";
  // --------------------------------------------------------

  try {
    const ts = Number(sessionStorage.getItem(tkey) || 0);
    if (!nocache && ts && now - ts < GH_CACHE_TTL_MS) {
      const cached = JSON.parse(sessionStorage.getItem(key) || "[]");
      return cached;
    }
  } catch {}

  const url = `${GH_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(ref)}`;
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) {
    if (res.status === 404) return [];
    const text = await res.text();
    throw new Error(`GitHub API ${res.status}: ${text}`);
  }
  const json = await res.json();
  const files = Array.isArray(json) ? json.filter((it) => it.type === "file") : [];
  const imgs = files.filter((f) => isImageName(f.name)).map((f) => ({ name: f.name, url: f.download_url, sha: f.sha, size: f.size }));
  try {
    sessionStorage.setItem(key, JSON.stringify(imgs));
    sessionStorage.setItem(tkey, String(now));
  } catch {}
  return imgs;
}

/* ===================== Hero (image with bottom-aligned text) ===================== */
function Hero() {
  return (
    <section id="home" className="relative min-h-[68vh] md:min-h-[78vh]">
      <img src={HERO_BG_URL} alt="" aria-hidden="true" className="absolute inset-0 z-0 h-full w-full object-cover pointer-events-none" loading="eager" />
      <div className="absolute inset-0 z-[1] bg-black/45" />
      <div className="absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 z-[2]">
        <div className={`${CONTAINER} pb-10 md:pb-14 text-white`}>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            Freeze the moment. <span className="opacity-90">Tell the story.</span>
          </h1>
          <p className="mt-3 max-w-3xl text-sm md:text-base text-neutral-200">
            Fashion · Portraits · Candids · Portfolio · Professional headshots · Street
          </p>
          <p className="text-neutral-300 text-sm mt-1">{SERVICE_CITIES}</p>
        </div>
      </div>
    </section>
  );
}

/* ===================== Portfolio (cards + chips) ===================== */
function CategoryGrid({ T, label, images, loading, error }) {
  return (
    <div className={`mb-8 rounded-2xl border overflow-hidden shadow-sm ${T.cardBorder} ${T.cardBg}`}>
      <div className={`flex items-center justify-between px-4 py-3 border-b ${T.panelBorder}`}>
        <h3 className={`font-medium ${T.navTextStrong}`}>{label}</h3>
        {loading ? <span className={`text-xs ${T.muted2}`}>Loading…</span> : null}
      </div>

      {error ? (
        <div className={`px-4 py-6 text-sm text-red-500`}>{String(error)}</div>
      ) : images && images.length ? (
        <div className="p-4">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4 [column-fill:_balance] [&>figure:not(:first-child)]:mt-4">
            {images.map((it, i) => (
              <figure key={it.sha || i} className={`break-inside-avoid rounded-2xl overflow-hidden border ${T.cardBorder} ${T.panelBg}`}>
                <img src={it.url} alt={`${label} — ${it.name}`} className="w-full h-auto object-cover" />
                <figcaption className={`px-4 py-2 text-xs ${T.muted2}`}>{it.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      ) : (
        <div className={`px-4 py-6 text-sm ${T.muted}`}>
          No images found in <strong className={T.navTextStrong}>{label}</strong> yet. Upload JPG/PNG/WebP to <code className={T.navTextStrong}>{label}</code> folder in the repo.
        </div>
      )}
    </div>
  );
}

function Portfolio({ T }) {
  const [active, setActive] = useState("All");
  const tags = useMemo(() => ["All", ...GH_CATEGORIES.map((c) => c.label)], []);

  const [states, setStates] = useState(() =>
    GH_CATEGORIES.map(() => ({ loading: true, error: "", images: [] }))
  );

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
    return () => { cancelled = true; };
  }, []);

  const visible = useMemo(() => {
    if (active === "All") return GH_CATEGORIES.map((c, i) => ({ ...c, ...states[i] }));
    const idx = GH_CATEGORIES.findIndex((c) => c.label === active);
    if (idx < 0) return [];
    return [{ ...GH_CATEGORIES[idx], ...states[idx] }];
  }, [active, states]);

  return (
    <section id="portfolio" className={`${CONTAINER} py-16`}>
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className={`text-3xl md:text-4xl font-semibold tracking-tight ${T.navTextStrong}`}>Portfolio</h2>
          <p className={`mt-1 ${T.muted}`}>Images load straight from your GitHub repo folders.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => {
            const isActive = active === t;
            return (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${isActive ? T.chipActive : T.chipInactive}`}
                aria-pressed={isActive}
              >
                {t}
              </button>
            );
          })}
        </div>
      </header>

      {visible.map((v) => (
        <CategoryGrid key={v.label} T={T} label={v.label} images={v.images} loading={v.loading} error={v.error} />
      ))}
    </section>
  );
}

/* ===================== Booking ===================== */
function BookingSection({ T }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "Portraits", city: "Pune", date: "", message: "" });
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Shoot enquiry: ${form.service} — ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nService: ${form.service}\nCity: ${form.city}\nDate: ${form.date}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const onWhatsApp = () => {
    if (!WHATSAPP_NUMBER || WHATSAPP_NUMBER.includes("X")) { alert("Set WHATSAPP_NUMBER at the top."); return; }
    const bits = [];
    if (form.name) bits.push(`Name: ${form.name}`);
    if (form.service) bits.push(`Service: ${form.service}`);
    if (form.city) bits.push(`City: ${form.city}`);
    if (form.date) bits.push(`Date: ${form.date}`);
    if (form.message) bits.push(`Notes: ${form.message}`);
    const text = bits.length ? `Hi PRADHU, I'd like to book a shoot.\n\n${bits.join(" • ")}` : "Hi PRADHU, I'd like to book a shoot.";
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section id="booking" className={`${T.sectionAltBg} border-t ${T.footerBorder}`}>
      <div className={`${CONTAINER} py-16`}>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className={`text-3xl md:text-4xl font-semibold tracking-tight ${T.navTextStrong}`}>Enquire / Book</h2>
            <p className={`mt-2 ${T.muted}`}>Share details and I’ll reply with availability and a quote.</p>
            <ul className={`mt-4 text-sm space-y-1 ${T.muted}`}>
              <li>✆ WhatsApp: {WHATSAPP_NUMBER.includes("X") ? <span className="opacity-70">Set WHATSAPP_NUMBER above to enable</span> : <a className={T.link} href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">+{WHATSAPP_NUMBER}</a>}</li>
              <li>✉ Email: <a className={T.link} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
              <li>⌁ Instagram: <a className={T.link} href={`https://www.instagram.com/${IG_USERNAME}/`} target="_blank" rel="noreferrer">@{IG_USERNAME}</a></li>
            </ul>
            <div className={`mt-6 rounded-2xl border p-4 ${T.panelBg} ${T.panelBorder}`}>
              <p className={`text-sm ${T.muted}`}>Commercial clients: ask for the <strong className={T.navTextStrong}>Rate Card</strong> & usage licensing options.</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => {
                  if (RAZORPAY_LINK) window.open(RAZORPAY_LINK, "_blank", "noopener,noreferrer");
                  else {
                    if (!UPI_ID || UPI_ID === "yourvpa@upi") { alert("Set UPI_ID or RAZORPAY_LINK at the top."); return; }
                    const pn = encodeURIComponent("PRADHU Photography");
                    const tn = encodeURIComponent("Booking Advance");
                    const amount = Number(BOOKING_ADVANCE_INR || 0).toFixed(2);
                    window.location.href = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${pn}&am=${amount}&cu=INR&tn=${tn}`;
                  }
                }}
                className={`rounded-xl px-4 py-2 ${T.btnOutline}`}
              >
                Pay Booking Advance
              </button>
            </div>
          </div>

          <form onSubmit={onSubmit} className={`rounded-2xl border p-6 shadow-sm ${T.panelBg} ${T.panelBorder}`}>
            <div className="grid grid-cols-1 gap-4">
              <Input T={T} label="Name" name="name" value={form.name} onChange={onChange} required />
              <Input T={T} label="Email" name="email" type="email" value={form.email} onChange={onChange} required />
              <Input T={T} label="Phone" name="phone" type="tel" value={form.phone} onChange={onChange} placeholder="+91-XXXXXXXXXX" />
              <div>
                <label className={`text-sm ${T.muted}`}>Service</label>
                <select name="service" className={`mt-1 w-full rounded-xl border px-3 py-2 ${T.inputBg} ${T.inputBorder} ${T.inputText}`} value={form.service} onChange={onChange}>
                  {["Portraits","Fashion","Candids","Street","Events","Other"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm ${T.muted}`}>City</label>
                  <select name="city" className={`mt-1 w-full rounded-xl border px-3 py-2 ${T.inputBg} ${T.inputBorder} ${T.inputText}`} value={form.city} onChange={onChange}>
                    <option>Pune</option><option>Mumbai</option><option>Chennai</option><option>Bengaluru</option><option>Other</option>
                  </select>
                </div>
                <Input T={T} label="Preferred Date" name="date" type="date" value={form.date} onChange={onChange} />
              </div>
              <div>
                <label className={`text-sm ${T.muted}`}>Message</label>
                <textarea name="message" value={form.message} onChange={onChange} rows={5} className={`mt-1 w-full rounded-xl border px-3 py-2 ${T.inputBg} ${T.inputBorder} ${T.inputText} ${T.placeholder}`} placeholder="Shoot location, timings, concept, references, usage (personal/commercial), etc." />
              </div>

              <div className="flex flex-wrap gap-2">
                <button type="submit" className="rounded-xl bg-neutral-900 text-white px-4 py-2 font-medium hover:opacity-90">Send Enquiry</button>
                <button type="button" onClick={onWhatsApp} className={`rounded-xl px-4 py-2 ${T.btnOutline}`}>WhatsApp</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ===================== Small Input ===================== */
function Input({ T, label, name, value, onChange, type = "text", required = false, placeholder = "" }) {
  return (
    <div>
      <label htmlFor={name} className={`text-sm ${T.muted}`}>
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      <input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} className={`mt-1 w-full rounded-xl border px-3 py-2 ${T.inputBg} ${T.inputBorder} ${T.inputText} ${T.placeholder}`} />
    </div>
  );
}

/* ===================== Main App ===================== */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
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

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const closeIntro = () => {
    setShowIntro(false);
    try { if (INTRO_REMEMBER) sessionStorage.setItem("pradhu:intro:dismissed", "1"); } catch {}
  };

  useEffect(() => {
    try { sessionStorage.setItem("pradhu:theme", theme); } catch {}
  }, [theme]);

  return (
    <main className={`min-h-screen ${T.pageBg} ${T.pageText}`}>
      {showIntro && <IntroOverlay onClose={closeIntro} />}

      {/* NAVBAR (brand very large, items unchanged; items show from lg to avoid overlap) */}
      <header className={`sticky top-0 z-50 backdrop-blur border-b ${T.navBg} ${T.navBorder}`}>
        <nav className={`${CONTAINER} py-4 lg:py-5 grid grid-cols-[1fr_auto_auto] items-center gap-3`}>
          {/* Brand — BIG */}
          <div className="min-w-0">
            <p className={`font-semibold tracking-tight leading-none ${T.navTextStrong} 
              text-3xl md:text-5xl lg:text-6xl xl:text-7xl truncate`}>
              {NAV_BRAND}
            </p>
          </div>

          {/* Desktop nav with icons (show from lg so brand has room) */}
          <ul className="hidden lg:flex items-center gap-1 text-sm">
            {NAV_ITEMS.map(({ label, id, icon }) => (
              <li key={id}>
                <button
                  className={`relative group flex items-center gap-2 px-3 py-2 rounded-lg ${T.navText} focus:outline-none`}
                  onClick={() => scrollTo(id)}
                >
                  <span className={`pointer-events-none absolute inset-0 rounded-lg ${T.hoverOverlay} opacity-0 group-hover:opacity-100 transition`} />
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon name={icon} className="h-4 w-4" />
                    <span>{label}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm border ${T.btnOutline}`}
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              <Icon name={theme === "dark" ? "sun" : "moon"} className="h-4 w-4" />
              <span>{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
            {/* Mobile menu toggle (visible < lg) */}
            <button
              className={`lg:hidden rounded-lg px-3 py-2 text-sm border ${T.btnOutline}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              Menu
            </button>
          </div>

          {/* Mobile sheet (spans all columns) */}
          {menuOpen && (
            <div id="mobile-menu" className={`lg:hidden col-span-3 mt-3 border-t ${T.navBorder} ${T.sectionAltBg} w-full`}>
              <ul className="px-2 py-3 grid gap-1">
                {NAV_ITEMS.map(({ label, id, icon }) => (
                  <li key={id}>
                    <button
                      className={`relative group w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg ${T.navTextStrong}`}
                      onClick={() => { scrollTo(id); }}
                    >
                      <span className={`pointer-events-none absolute inset-0 rounded-lg ${T.hoverOverlay} opacity-0 group-hover:opacity-100 transition`} />
                      <span className="relative z-10 flex items-center gap-2">
                        <Icon name={icon} className="h-4 w-4" />
                        <span>{label}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </header>

      {/* HERO */}
      <Hero />

      {/* PORTFOLIO */}
      <Portfolio T={T} />

      {/* Hidden sections for now */}
      <section id="services" className="hidden" />
      <section id="pricing" className="hidden" />

      {/* ABOUT */}
      <section id="about" className={`${CONTAINER} py-16`}>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className={`text-3xl md:text-4xl font-semibold tracking-tight ${T.navTextStrong}`}>About PRADHU</h2>
            <p className={`mt-3 ${T.muted}`}>I’m a photographer specialising in fashion, portraits, candids and events. Expect direction, calm energy, and images that feel like you.</p>
            <ul className={`mt-4 text-sm list-disc pl-5 space-y-1 ${T.muted}`}>
              <li>Genres: Fashion, Portraits, Candids, Street, Landscape, Studio</li>
              <li>Toolbox: softboxes (octa & strip), multiple flashes, Nikon system</li>
              <li>{SERVICE_CITIES}</li>
            </ul>
          </div>
          <div className={`rounded-2xl overflow-hidden border ${T.panelBorder} ${T.panelBg}`}>
            <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop" alt="Photographer at work" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section id="instagram" className={`${CONTAINER} py-16`}>
        <h2 className={`text-3xl md:text-4xl font-semibold tracking-tight ${T.navTextStrong}`}>Instagram</h2>
        <p className={T.muted}>@{IG_USERNAME}</p>
        <p className={`text-sm mt-2 ${T.muted2}`}>
          Add an IG token/widget later for live thumbnails. For now,{" "}
          <a className={T.link} href={`https://www.instagram.com/${IG_USERNAME}/`} target="_blank" rel="noreferrer">open profile</a>.
        </p>
      </section>

      {/* FAQ */}
      <section id="faq" className={`${CONTAINER} py-16`}>
        <h2 className={`text-3xl md:text-4xl font-semibold tracking-tight ${T.navTextStrong}`}>FAQ</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {[
            { q: "How do I receive photos?", a: "Via a private, watermark-free online gallery with high-res downloads." },
            { q: "Do you travel for shoots?", a: "Yes. Travel fee applies outside base city; details in your quote." },
            { q: "What’s the turnaround?", a: "Portraits: 5–7 days. Weddings: teaser in 48h, full gallery in 3–4 weeks." },
            { q: "How to book?", a: "Send an enquiry below with your date, service, and location — or use WhatsApp." },
          ].map((item) => (
            <details key={item.q} className={`rounded-2xl border p-5 shadow-sm ${T.panelBg} ${T.panelBorder}`}>
              <summary className={`cursor-pointer font-medium ${T.navTextStrong}`}>{item.q}</summary>
              <p className={`mt-2 text-sm ${T.muted}`}>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CONTACT / ENQUIRY */}
      <BookingSection T={T} />

      {/* FOOTER */}
      <footer className={`border-t ${T.footerBorder} ${T.footerBg}`}>
        <div className={`${CONTAINER} py-10 text-sm`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <p className={T.muted}>© {new Date().getFullYear()} PRADHU — All rights reserved.</p>
            <div className="flex items-center gap-3">
              <a className={T.link} href={`https://www.instagram.com/${IG_USERNAME}/`} target="_blank" rel="noreferrer">Instagram</a>
              {WHATSAPP_NUMBER.includes("X") ? (
                <span className={`${T.linkSubtle} opacity-70`}>WhatsApp</span>
              ) : (
                <a className={T.link} href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">WhatsApp</a>
              )}
              <a className={T.link} href={`mailto:${CONTACT_EMAIL}`}>Email</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
