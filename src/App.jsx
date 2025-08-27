/* ===================== CONFIG ===================== */
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
