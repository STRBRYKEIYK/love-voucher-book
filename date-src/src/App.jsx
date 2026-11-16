import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, CalendarDays, Check, ChevronLeft, ChevronRight, ChevronDown, Clock,
  Copy, Link2, MapPin, MessageCircle, Pencil, Send, Sparkles
} from "lucide-react";
import { CATEGORIES, TIMES } from "./data.js";

const STEPS = ["Vibe", "Place", "Date & time", "Your say"];
const EMPTY = { catId: "", catTitle: "", place: "", area: "", customPlace: false, date: "", time: "", note: "" };

/* ---------- helpers ---------- */
const parseISO = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const toISO = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const prettyDate = (iso) =>
  iso ? parseISO(iso).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "";

const enc = (p) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(p))))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const dec = (s) => {
  try {
    const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
    const p = JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))));
    if (!p || typeof p !== "object") return null;
    const out = { ...EMPTY };
    for (const k of Object.keys(EMPTY)) {
      if (k === "customPlace") out[k] = p[k] === true;
      else if (typeof p[k] === "string") out[k] = p[k].slice(0, k === "note" ? 800 : 140);
    }
    return out.place && /^\d{4}-\d{2}-\d{2}$/.test(out.date) && out.time ? out : null;
  } catch {
    return null;
  }
};

const isCustomPlan = (s) => s.customPlace || s.note.trim().length > 0;

const planText = (s) =>
  [
    "CHICOOO! HERE'S OUR DATE PLAN 🥰",
    `Vibe: ${s.catTitle}`,
    `Place: ${s.place}${s.area ? ` (${s.area})` : ""}${s.customPlace ? " - my own pick!" : ""}`,
    `When: ${prettyDate(s.date)} at ${s.time}`,
    s.note.trim() ? `My extras: ${s.note.trim()}` : ""
  ].filter(Boolean).join("\n");

/* ---------- decor ---------- */
function Sun({ className = "" }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="sunGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd27a" />
          <stop offset=".5" stopColor="#ff8a5b" />
          <stop offset="1" stopColor="#ff4f8b" />
        </linearGradient>
        <mask id="sunMask">
          <rect width="200" height="200" fill="#fff" />
          {[116, 132, 146, 158, 168, 176].map((y, i) => (
            <rect key={y} y={y} width="200" height={2 + i * 1.7} fill="#000" />
          ))}
        </mask>
      </defs>
      <circle cx="100" cy="100" r="90" fill="url(#sunGrad)" mask="url(#sunMask)" />
    </svg>
  );
}

const variants = {
  enter: (d) => ({ opacity: 0, x: d > 0 ? 36 : -36 }),
  center: { opacity: 1, x: 0 },
  exit: (d) => ({ opacity: 0, x: d > 0 ? -36 : 36 })
};

/* ---------- screens ---------- */
function Welcome({ onStart }) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-navy-900 text-cream">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] overflow-hidden">
        <div className="grid-floor h-[160%] w-[140%] -translate-x-[14%]" />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-[14%] w-[78vw] max-w-[360px] -translate-x-1/2">
        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: "easeOut" }}>
          <Sun className="w-full" />
        </motion.div>
      </div>

      <div className="relative mx-auto flex min-h-dvh max-w-xl flex-col justify-end px-6 pb-12 pt-24">
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-sun-amber"
        >
          An invitation, just for you
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.7 }}
          className="font-display text-5xl font-bold italic leading-[1.02] sm:text-6xl"
        >
          Chico invites <span className="text-sun-pink">Chica</span> on a date.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="mt-4 max-w-md text-lg leading-relaxed text-cream/85"
        >
          Pick the vibe, the place and the day, asawa ko. Add anything you want, because your plan always wins.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onStart}
          className="mt-8 inline-flex min-h-14 items-center justify-center gap-3 self-start rounded-3xl bg-sunset px-8 text-lg font-semibold text-navy-950 shadow-[0_10px_40px_-10px_rgba(255,92,138,.8)]"
        >
          Open invitation <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </motion.button>
      </div>
    </div>
  );
}

function Header({ step, onBack }) {
  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex min-h-11 items-center gap-2 rounded-full pr-3 text-sm font-semibold text-navy-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
        </button>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-navy-600">
          Step {step} of 4 · {STEPS[step - 1]}
        </p>
      </div>
      <div className="mt-3 flex gap-2" aria-hidden="true">
        {STEPS.map((_, i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i < step ? "bg-sun-pink" : "bg-navy-900/15"}`} />
        ))}
      </div>
    </header>
  );
}

function Title({ children, sub }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-4xl font-bold italic leading-tight text-navy-900">{children}</h2>
      {sub && <p className="mt-2 text-base text-navy-700">{sub}</p>}
    </div>
  );
}

function CategoryStep({ sel, onPick }) {
  return (
    <>
      <Title sub="What kind of date are we feeling?">Pick the vibe</Title>
      <div className="grid gap-4">
        {CATEGORIES.map((c, i) => (
          <motion.button
            key={c.id}
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
            whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
            onClick={() => onPick(c)}
            aria-pressed={sel.catId === c.id}
            style={{ backgroundImage: `radial-gradient(120% 100% at 100% 0%, ${c.glow} 0%, transparent 58%)` }}
            className={`relative overflow-hidden rounded-3xl bg-navy-900 p-6 text-left text-cream shadow-lg ${sel.catId === c.id ? "ring-4 ring-sun-pink" : ""}`}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-sun-peach">0{i + 1}</span>
            <span className="mt-2 block font-display text-2xl font-bold italic leading-snug">{c.title}</span>
            <span className="mt-2 block max-w-[28ch] text-base text-cream/85">{c.vibe}</span>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sun-amber">
              {c.places.length} places + your own pick <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </motion.button>
        ))}
      </div>
    </>
  );
}

function PlaceStep({ sel, patch }) {
  const cat = CATEGORIES.find((c) => c.id === sel.catId);
  const [custom, setCustom] = useState(sel.customPlace);
  if (!cat) return null;

  const pick = (p) => {
    setCustom(false);
    patch({ place: p.name, area: p.area, customPlace: false });
  };
  const openCustom = () => {
    setCustom(true);
    patch({ place: "", area: "", customPlace: true });
  };

  return (
    <>
      <Title sub={cat.vibe}>{cat.title}</Title>
      <div className="grid gap-4" role="group" aria-label="Choose a place">
        {cat.places.map((p, i) => {
          const active = !custom && sel.place === p.name;
          return (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i }}
              whileTap={{ scale: 0.98 }} onClick={() => pick(p)} aria-pressed={active}
              className={`rounded-3xl border-2 bg-white p-6 text-left shadow-sm transition-colors ${active ? "border-sun-pink ring-4 ring-sun-pink/25" : "border-navy-900/10 hover:border-sun-coral"}`}
            >
              <span className="flex items-start justify-between gap-3">
                <span className="font-display text-2xl font-bold italic leading-snug text-navy-900">{p.name}</span>
                <span className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full ${active ? "bg-sun-pink text-white" : "border-2 border-navy-900/15"}`}>
                  {active && <Check className="h-4 w-4" aria-hidden="true" />}
                </span>
              </span>
              <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-navy-600">
                <MapPin className="h-4 w-4" aria-hidden="true" /> {p.area}
              </span>
              <span className="mt-4 flex flex-wrap gap-2">
                {p.highlights.map((h) => (
                  <span key={h} className="rounded-full bg-cream-200 px-3 py-1 text-sm font-medium text-navy-800">{h}</span>
                ))}
              </span>
            </motion.button>
          );
        })}

        <motion.div
          layout
          className={`rounded-3xl border-2 border-dashed p-6 ${custom ? "border-sun-pink bg-white ring-4 ring-sun-pink/25" : "border-navy-900/25 bg-cream-200/60"}`}
        >
          <button onClick={openCustom} aria-expanded={custom} className="flex w-full items-center justify-between gap-3 text-left">
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.25em] text-sun-coral">Chica's Pick</span>
              <span className="mt-1 block font-display text-2xl font-bold italic text-navy-900">I have another place in mind!</span>
            </span>
            <Sparkles className="h-6 w-6 shrink-0 text-sun-pink" aria-hidden="true" />
          </button>
          <AnimatePresence initial={false}>
            {custom && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <label htmlFor="custom-place" className="mb-2 mt-5 block text-sm font-semibold text-navy-800">Where to, Chica?</label>
                <input
                  id="custom-place" autoFocus maxLength={120} value={sel.place}
                  onChange={(e) => patch({ place: e.target.value, area: "", customPlace: true })}
                  placeholder="A cafe, a beach, a secret spot..."
                  className="min-h-14 w-full rounded-2xl border-2 border-navy-900/15 bg-cream px-4 text-lg text-navy-900 placeholder:text-navy-600/60 focus:border-sun-pink focus:outline-none"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}

function Calendar({ value, onChange }) {
  const today = useMemo(() => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; }, []);
  const [view, setView] = useState(() => {
    const b = value ? parseISO(value) : today;
    return new Date(b.getFullYear(), b.getMonth(), 1);
  });
  const minView = new Date(today.getFullYear(), today.getMonth(), 1);
  const maxView = new Date(today.getFullYear(), today.getMonth() + 12, 1);
  const y = view.getFullYear();
  const m = view.getMonth();
  const days = new Date(y, m + 1, 0).getDate();
  const cells = [...Array(view.getDay()).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const shift = (n) => setView(new Date(y, m + n, 1));

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => shift(-1)} disabled={view <= minView} aria-label="Previous month"
          className="grid h-11 w-11 place-items-center rounded-full text-navy-800 disabled:opacity-25"
        ><ChevronLeft className="h-5 w-5" aria-hidden="true" /></button>
        <p className="font-display text-xl font-bold italic text-navy-900" aria-live="polite">
          {view.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
        <button
          onClick={() => shift(1)} disabled={view >= maxView} aria-label="Next month"
          className="grid h-11 w-11 place-items-center rounded-full text-navy-800 disabled:opacity-25"
        ><ChevronRight className="h-5 w-5" aria-hidden="true" /></button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-wider text-navy-600">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i} className="py-2">{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((d, i) => {
          if (!d) return <span key={`b${i}`} />;
          const iso = toISO(y, m, d);
          const past = new Date(y, m, d) < today;
          const on = value === iso;
          const isToday = new Date(y, m, d).getTime() === today.getTime();
          return (
            <button
              key={iso} disabled={past} onClick={() => onChange(iso)} aria-pressed={on}
              aria-label={prettyDate(iso)}
              className={`mx-auto grid h-11 w-11 place-items-center rounded-full text-base font-semibold transition-colors ${
                on ? "bg-sunset text-navy-950 shadow-md" : past ? "text-navy-900/25" : "text-navy-900 hover:bg-cream-200"
              } ${isToday && !on ? "ring-2 ring-sun-pink" : ""}`}
            >{d}</button>
          );
        })}
      </div>
    </div>
  );
}

function WhenStep({ sel, patch }) {
  return (
    <>
      <Title sub={sel.place ? `Our date at ${sel.place}.` : "Choose a day that works for you."}>Lock in the time</Title>
      <div className="grid gap-5">
        <Calendar value={sel.date} onChange={(date) => patch({ date })} />
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <label htmlFor="time" className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy-800">
            <Clock className="h-4 w-4" aria-hidden="true" /> What time, Chica?
          </label>
          <div className="relative">
            <select
              id="time" value={sel.time} onChange={(e) => patch({ time: e.target.value })}
              className="min-h-14 w-full appearance-none rounded-2xl border-2 border-navy-900/15 bg-cream px-4 pr-12 text-lg text-navy-900 focus:border-sun-pink focus:outline-none"
            >
              <option value="">Choose a time</option>
              {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-700" aria-hidden="true" />
          </div>
        </div>
        {sel.date && (
          <p className="flex items-center gap-2 rounded-2xl bg-navy-900 px-5 py-4 font-medium text-cream">
            <CalendarDays className="h-5 w-5 shrink-0 text-sun-amber" aria-hidden="true" />
            {prettyDate(sel.date)}{sel.time ? `, ${sel.time}` : ""}
          </p>
        )}
      </div>
    </>
  );
}

function NoteStep({ sel, patch }) {
  return (
    <>
      <Title sub="Totally optional. Your idea always counts.">Your say</Title>
      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <label htmlFor="note" className="mb-3 flex items-start gap-2 text-base font-semibold text-navy-900">
          <Pencil className="mt-1 h-4 w-4 shrink-0 text-sun-coral" aria-hidden="true" />
          Anything else you want to add, change, or do on this date, Chica?
        </label>
        <textarea
          id="note" rows={7} maxLength={800} value={sel.note} onChange={(e) => patch({ note: e.target.value })}
          placeholder="Extra stops, foods you want to try, a different mood, a surprise for me..."
          className="w-full resize-none rounded-2xl border-2 border-navy-900/15 bg-cream p-4 text-lg leading-relaxed text-navy-900 placeholder:text-navy-600/60 focus:border-sun-pink focus:outline-none"
        />
        <p className="mt-2 text-right text-xs font-medium text-navy-600">{sel.note.length}/800</p>
      </div>
    </>
  );
}

function Row({ icon, label, children }) {
  return (
    <div className="flex gap-4">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy-900 text-sun-amber">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sun-coral">{label}</p>
        <div className="mt-0.5 break-words text-lg font-semibold leading-snug text-navy-900">{children}</div>
      </div>
    </div>
  );
}

function Confirm({ sel, onRestart, onEdit }) {
  const [status, setStatus] = useState("idle");
  const [copied, setCopied] = useState("");
  const custom = isCustomPlan(sel);
  const text = planText(sel);
  const link = `${location.origin}${location.pathname}#p=${enc(sel)}`;

  const send = async () => {
    setStatus("sending");
    try {
      const r = await fetch("/api/date", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(sel) });
      const j = r.ok ? await r.json() : null;
      setStatus(j && j.ok === true ? "sent" : "fail");
    } catch {
      setStatus("fail");
    }
  };
  const copy = async (what, value) => {
    try { await navigator.clipboard.writeText(value); setCopied(what); setTimeout(() => setCopied(""), 1800); }
    catch { setCopied("manual"); }
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-navy-900 text-cream">
      <div className="pointer-events-none absolute -right-24 -top-24 w-[340px] opacity-60"><Sun className="w-full" /></div>
      <div className="relative mx-auto max-w-xl px-6 pb-14 pt-10">
        <button onClick={onEdit} className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-sun-peach">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Change something
        </button>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sun-amber">It's a date</p>
        <h2 className="mt-2 font-display text-4xl font-bold italic leading-tight">Here's our plan, Chica.</h2>

        <motion.div
          initial={{ opacity: 0, y: 30, rotate: -1.5 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ type: "spring", stiffness: 120, damping: 16 }}
          className="mt-8 overflow-hidden rounded-3xl bg-cream text-navy-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,.7)]"
          aria-label="Date itinerary ticket"
        >
          <div className="bg-sunset px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-navy-900/70">Date ticket · admit two</p>
            <p className="mt-1 font-display text-3xl font-bold italic text-navy-950">Chico + Chica</p>
            {custom && (
              <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-navy-950 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-sun-amber">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Chica's Custom Plan
              </span>
            )}
          </div>
          <div className="grid gap-5 p-6">
            <Row icon={<Sparkles className="h-4 w-4" aria-hidden="true" />} label="The vibe">{sel.catTitle}</Row>
            <Row icon={<MapPin className="h-4 w-4" aria-hidden="true" />} label={sel.customPlace ? "Chica's pick" : "The place"}>
              {sel.place}
              {sel.area && <span className="block text-base font-medium text-navy-600">{sel.area}</span>}
            </Row>
            <Row icon={<CalendarDays className="h-4 w-4" aria-hidden="true" />} label="The day">{prettyDate(sel.date)}</Row>
            <Row icon={<Clock className="h-4 w-4" aria-hidden="true" />} label="The time">{sel.time}</Row>
            {sel.note.trim() && (
              <Row icon={<Pencil className="h-4 w-4" aria-hidden="true" />} label="Chica's extras">
                <span className="whitespace-pre-wrap font-medium">{sel.note.trim()}</span>
              </Row>
            )}
          </div>
          <div className="ticket-notch relative border-t-2 border-dashed border-navy-900/25 px-6 py-4">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-navy-600">With love, Chico</p>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-3">
          <button
            onClick={send} disabled={status === "sending" || status === "sent"}
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-3xl bg-sunset px-6 text-lg font-semibold text-navy-950 shadow-[0_10px_40px_-10px_rgba(255,92,138,.8)] disabled:opacity-80"
          >
            {status === "sent" ? <Check className="h-5 w-5" aria-hidden="true" /> : <Send className="h-5 w-5" aria-hidden="true" />}
            {status === "sending" ? "Sending..." : status === "sent" ? "Sent to Chico!" : "Send to Chico"}
          </button>
          <p role="status" className="min-h-6 text-center text-sm font-medium text-cream/85">
            {status === "sent" && "Chico has your plan. Get ready, asawa ko."}
            {status === "fail" && "I couldn't send it automatically. Use WhatsApp below instead."}
            {copied === "manual" && "Couldn't copy here. Press and hold to copy the text instead."}
          </p>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener"
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-3xl border-2 border-cream/30 px-6 text-base font-semibold text-cream"
          ><MessageCircle className="h-5 w-5" aria-hidden="true" /> Send on WhatsApp</a>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => copy("plan", text)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-3xl border-2 border-cream/20 px-4 text-sm font-semibold text-cream">
              <Copy className="h-4 w-4" aria-hidden="true" /> {copied === "plan" ? "Copied!" : "Copy plan"}
            </button>
            <button onClick={() => copy("link", link)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-3xl border-2 border-cream/20 px-4 text-sm font-semibold text-cream">
              <Link2 className="h-4 w-4" aria-hidden="true" /> {copied === "link" ? "Copied!" : "Copy link"}
            </button>
          </div>
          <button onClick={onRestart} className="mt-2 min-h-11 text-sm font-semibold text-sun-peach underline underline-offset-4">Plan a different date</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- app ---------- */
export default function App() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [sel, setSel] = useState(EMPTY);
  const patch = (o) => setSel((s) => ({ ...s, ...o }));
  const go = (n) => { setDir(n > step ? 1 : -1); setStep(n); window.scrollTo(0, 0); };

  useEffect(() => {
    const m = /^#p=(.+)$/.exec(location.hash);
    if (m) {
      const p = dec(m[1]);
      if (p) { setSel(p); setStep(5); }
    }
  }, []);

  const canNext =
    (step === 2 && sel.place.trim().length >= 2) ||
    (step === 3 && !!sel.date && !!sel.time) ||
    step === 4;

  const hint =
    step === 2 && !canNext ? "Pick a place to continue" :
    step === 3 && !canNext ? (!sel.date ? "Pick a day to continue" : "Pick a time to continue") : "";

  const pickCategory = (c) => {
    if (sel.catId !== c.id) patch({ catId: c.id, catTitle: c.title, place: "", area: "", customPlace: false });
    go(2);
  };

  let body = null;
  if (step === 0) body = <Welcome onStart={() => go(1)} />;
  else if (step === 5) body = <Confirm sel={sel} onEdit={() => go(4)} onRestart={() => { history.replaceState(null, "", location.pathname); setSel(EMPTY); go(1); }} />;
  else {
    body = (
      <div className="min-h-dvh bg-cream text-navy-900">
        <div className="mx-auto w-full max-w-xl px-6 pb-40 pt-6">
          <Header step={step} onBack={() => go(step - 1)} />
          {step === 1 && <CategoryStep sel={sel} onPick={pickCategory} />}
          {step === 2 && <PlaceStep sel={sel} patch={patch} />}
          {step === 3 && <WhenStep sel={sel} patch={patch} />}
          {step === 4 && <NoteStep sel={sel} patch={patch} />}
        </div>
        {step >= 2 && (
          <div className="fixed inset-x-0 bottom-0 bg-gradient-to-t from-cream via-cream/95 to-transparent px-6 pb-6 pt-10">
            <div className="mx-auto max-w-xl">
              <p className="mb-2 min-h-5 text-center text-sm font-medium text-navy-600" role="status">{hint}</p>
              <button
                onClick={() => go(step + 1)} disabled={!canNext}
                className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-3xl bg-navy-900 px-6 text-lg font-semibold text-cream shadow-xl transition-opacity disabled:opacity-35"
              >
                {step === 4 ? "See our plan" : "Continue"} <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div key={step} custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.28, ease: "easeOut" }}>
          {body}
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}
