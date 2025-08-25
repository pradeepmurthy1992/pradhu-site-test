/* ===================== Portfolio (Landing + Pages + Lightbox) ===================== */
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

function Lightbox({ open, items, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, onPrev, onNext]);

  if (!open || !items?.length) return null;
  const it = items[index];

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
      role="dialog"
      aria-label="Lightbox"
      onClick={onClose}
    >
      <button
        aria-label="Close"
        className="absolute top-4 right-4 text-white/90 hover:text-white text-2xl"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        ×
      </button>

      <button
        aria-label="Previous"
        className="absolute left-4 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
      >
        ‹
      </button>

      <img
        src={it.url}
        alt={it.name}
        className="max-h-[90vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      <button
        aria-label="Next"
        className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
      >
        ›
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-xs">
        {it.name} · {index + 1} / {items.length}
      </div>
    </div>
  );
}

function PortfolioLanding({ T, cats, states, openCat }) {
  return (
    <section className="py-2">
      <header className="mb-6">
        <h2 className={`text-3xl md:text-4xl font-semibold tracking-tight ${T.navTextStrong}`}>
          Portfolio
        </h2>
        <p className={`mt-2 ${T.muted}`}>
          Browse by category. Click to view a focused page.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {cats.map((c, i) => {
          const st = states[i] || { images: [], loading: true, error: "" };
          const cover = st.images?.[0]?.url || "";
          const count = st.images?.length || 0;
          return (
            <article
              key={c.label}
              className={`group relative rounded-2xl overflow-hidden border ${T.cardBorder} ${T.cardBg} shadow-sm`}
            >
              <button
                type="button"
                onClick={() => openCat(c.label)}
                className="text-left w-full"
                aria-label={`Open ${c.label}`}
              >
                <div className="aspect-[16/10] w-full overflow-hidden">
                  {cover ? (
                    <img
                      src={cover}
                      alt={c.label}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-sm opacity-70">
                      No cover yet
                    </div>
                  )}
                </div>
                <div className="p-4 flex items-baseline justify-between">
                  <h3 className={`text-lg font-medium ${T.navTextStrong}`}>{c.label}</h3>
                  <span className={`text-xs ${T.muted2}`}>{count} photos</span>
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
  const [lbOpen, setLbOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const openAt = (i) => {
    setIdx(i);
    setLbOpen(true);
  };
  const close = () => setLbOpen(false);
  const prev = () => setIdx((i) => (i - 1 + items.length) % items.length);
  const next = () => setIdx((i) => (i + 1) % items.length);

  return (
    <section className="py-2">
      {/* Breadcrumb + Title */}
      <div className="mb-6 sticky top-[72px] z-[1] backdrop-blur border-b pb-3">
        <div className="pt-3">
          <button
            className={`${T.linkSubtle} text-sm`}
            onClick={onBack}
            aria-label="Back to Portfolio"
          >
            Portfolio
          </button>
          <span className={`mx-2 ${T.muted2}`}>/</span>
          <span className={`text-sm ${T.navTextStrong}`}>{cat.label}</span>
        </div>
        <h2 className={`mt-2 text-3xl md:text-4xl font-semibold tracking-tight ${T.navTextStrong}`}>
          {cat.label}
        </h2>
        {blurb && <p className={`mt-1 ${T.muted}`}>{blurb}</p>}
      </div>

      {/* Grid */}
      {state.error ? (
        <div className="text-red-500">{String(state.error)}</div>
      ) : state.loading ? (
        <div className={`${T.muted2}`}>Loading…</div>
      ) : items.length ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 [column-fill:_balance] [&>figure:not(:first-child)]:mt-6">
          {items.map((it, i) => (
            <figure
              key={it.sha || i}
              className={`group relative break-inside-avoid rounded-2xl overflow-hidden border ${T.cardBorder} ${T.panelBg}`}
            >
              <button
                type="button"
                onClick={() => openAt(i)}
                className="w-full text-left"
                aria-label={`Open ${it.name}`}
              >
                <img
                  src={it.url}
                  alt={`${cat.label} — ${it.name}`}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <figcaption
                  className={`absolute bottom-0 left-0 right-0 px-4 py-2 text-xs ${T.muted2} bg-gradient-to-t from-black/60 to-transparent text-white opacity-0 group-hover:opacity-100 transition`}
                >
                  {it.name}
                </figcaption>
              </button>
            </figure>
          ))}
        </div>
      ) : (
        <div className={`${T.muted}`}>No images yet for {cat.label}.</div>
      )}

      <Lightbox
        open={lbOpen}
        items={items}
        index={idx}
        onClose={close}
        onPrev={prev}
        onNext={next}
      />
    </section>
  );
}

function Portfolio({ T, showTitle = true }) {
  // data states per category (same fetch as before)
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
    // scroll to top of portfolio section for nicer UX
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

  // Render landing or page
  if (view === "page" && activeIdx >= 0) {
    const cat = GH_CATEGORIES[activeIdx];
    const st = states[activeIdx] || { loading: true, error: "", images: [] };
    return <PortfolioPage T={T} cat={cat} state={st} onBack={goLanding} />;
  }

  return (
    <PortfolioLanding T={T} cats={GH_CATEGORIES} states={states} openCat={openCat} />
  );
}
