import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { Check, AlertTriangle, Compass, FileText, Search, Sparkles, Printer, X, Clock, Wallet, ArrowLeft, ShieldCheck, Pencil } from "lucide-react";
import { COUNTRIES, QUAL_TYPES, FIELDS, TARGETS, DOC_STATUS, ROLE_SUGGESTIONS, DEMO_PROFILE, DIRECTORY, TOOLKIT, analyze, type Inputs, type Result } from "@/lib/equiv";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EquivLens — SDG 4 & 8 Qualification Navigator" },
      { name: "description", content: "Map foreign degrees, TVET diplomas and informal skills to local standards, even when paper records are missing." },
      { property: "og:title", content: "EquivLens — Qualification Navigator" },
      { property: "og:description", content: "Turn unrecognized qualifications into clear career pathways." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});

type Tab = "wizard" | "toolkit" | "directory";
const EMPTY: Inputs = { country: "", qualType: "", field: "", target: "", role: "", docStatus: DOC_STATUS[0] };

function App() {
  const [tab, setTab] = useState<Tab>("wizard");
  const [inputs, setInputs] = useState<Inputs>(EMPTY);
  const [result, setResult] = useState<Result | null>(null);
  const [toast, setToast] = useState("");

  const run = (i: Inputs) => { setInputs(i); setResult(analyze(i)); setTab("wizard"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const loadDemo = () => { const { name: _n, ...i } = DEMO_PROFILE; setInputs(i); setResult(null); setTab("wizard"); setToast("Demo profile loaded: Amina — Kenya TVET Electrical → Germany/EU"); setTimeout(() => setToast(""), 3000); };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Compass className="h-5 w-5" />
              <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-secondary text-secondary-foreground ring-2 ring-card"><Check className="h-2.5 w-2.5" strokeWidth={4} /></span>
            </div>
            <div>
              <div className="font-display text-lg font-extrabold leading-none text-foreground">EquivLens</div>
              <div className="text-xs text-muted-foreground">SDG 4 & 8 Qualification Navigator</div>
            </div>
          </div>
          <nav className="order-3 flex w-full gap-1 overflow-x-auto md:order-none md:ml-6 md:w-auto">
            {([["wizard", "1. Equivalency Wizard"], ["toolkit", "2. Missing Records Alternatives"], ["directory", "3. Sample Directory"]] as const).map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${tab === k ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>{l}</button>
            ))}
          </nav>
          <button onClick={loadDemo} className="ml-auto inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground shadow-sm transition hover:opacity-90"><Sparkles className="h-4 w-4" />Load Demo Profile</button>
        </div>
      </header>

      {toast && <div className="fixed left-1/2 top-20 z-50 -translate-x-1/2 animate-rise rounded-lg bg-foreground px-4 py-2 text-sm text-background shadow-lg">{toast}</div>}

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div key={tab} className="animate-rise">
          {tab === "wizard" && (result ? <Results r={result} onEdit={() => setResult(null)} /> : <Wizard inputs={inputs} setInputs={setInputs} onRun={run} />)}
          {tab === "toolkit" && <Toolkit />}
          {tab === "directory" && <Directory onPick={run} />}
        </div>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-muted-foreground">Built for Power Learn Project (PLP) Hackathon • Advancing UN SDG 4 (Quality Education) & SDG 8 (Decent Work & Economic Growth).</div>
      </footer>
    </div>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-border bg-card p-6 shadow-card ${className}`}>{children}</div>;
}

function Field({ label, value, onChange, options, placeholder }: { label: string; value: string; onChange: (v: string) => void; options: readonly string[]; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

function StepTitle({ n, title }: { n: number; title: string }) {
  return <div className="mb-4 flex items-center gap-3"><span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{n}</span><h3 className="text-base font-bold text-foreground">{title}</h3></div>;
}

function Wizard({ inputs, setInputs, onRun }: { inputs: Inputs; setInputs: (i: Inputs) => void; onRun: (i: Inputs) => void }) {
  const set = (k: keyof Inputs) => (v: string) => setInputs({ ...inputs, [k]: v });
  const ready = inputs.country && inputs.qualType && inputs.field && inputs.target;
  const roles = ROLE_SUGGESTIONS[inputs.field] ?? [];
  return (
    <>
      <section className="mb-8 rounded-2xl border border-border bg-card bg-hero px-6 py-10 md:px-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-secondary"><ShieldCheck className="h-3.5 w-3.5" />SDG 4 · SDG 8</span>
        <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight text-foreground md:text-5xl">Turn Unrecognized Qualifications into Clear Career Pathways.</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">Map foreign degrees, TVET diplomas, and informal skills to local standards—even when paper records are missing.</p>
      </section>
      <Card className="space-y-8">
        <div>
          <StepTitle n={1} title="Origin Background" />
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Country / Region of Study" value={inputs.country} onChange={set("country")} options={COUNTRIES} placeholder="Select country" />
            <Field label="Qualification Type" value={inputs.qualType} onChange={set("qualType")} options={QUAL_TYPES} placeholder="Select type" />
            <Field label="Field of Study" value={inputs.field} onChange={set("field")} options={FIELDS} placeholder="Select field" />
          </div>
        </div>
        <div>
          <StepTitle n={2} title="Target Destination & Goal" />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Target Country / Framework" value={inputs.target} onChange={set("target")} options={TARGETS} placeholder="Select framework" />
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Target Role or Study Level</span>
              <input list="roles" value={inputs.role} onChange={(e) => set("role")(e.target.value)} placeholder="e.g. Junior Software Developer" className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <datalist id="roles">{roles.map((r) => <option key={r} value={r} />)}</datalist>
            </label>
          </div>
        </div>
        <div>
          <StepTitle n={3} title="Document Status" />
          <div className="grid gap-3 md:grid-cols-3">
            {DOC_STATUS.map((d, i) => {
              const on = inputs.docStatus === d;
              return <button key={d} onClick={() => set("docStatus")(d)} className={`rounded-xl border-2 p-4 text-left text-sm font-medium transition ${on ? (i === 0 ? "border-secondary bg-success-soft text-foreground" : "border-warning bg-warning-soft text-foreground") : "border-border text-muted-foreground hover:border-primary/40"}`}>
                <div className="flex items-center gap-2">{i === 0 ? <FileText className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}{d}</div>
              </button>;
            })}
          </div>
        </div>
        <button disabled={!ready} onClick={() => onRun(inputs)} className="w-full rounded-xl bg-primary px-6 py-4 font-display text-base font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">Analyze Equivalency & Action Plan</button>
        {!ready && <p className="-mt-5 text-center text-xs text-muted-foreground">Fill steps 1 and 2, or click “Load Demo Profile” above.</p>}
      </Card>
    </>
  );
}

function Gauge({ value }: { value: number }) {
  const r = 52, c = 2 * Math.PI * r;
  const color = value >= 75 ? "var(--secondary)" : value >= 60 ? "var(--primary)" : "var(--warning)";
  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--muted)" strokeWidth="12" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center"><div><div className="font-display text-3xl font-extrabold text-foreground">{value}%</div><div className="text-[11px] font-medium text-muted-foreground">Direct Alignment</div></div></div>
    </div>
  );
}

function Results({ r, onEdit }: { r: Result; onEdit: () => void }) {
  const [checked, setChecked] = useState<string[]>([]);
  const [modal, setModal] = useState(false);
  const readiness = r.needsAlt ? Math.min(100, (r.inputs.docStatus === DOC_STATUS[1] ? 40 : 10) + r.altProofs.filter((a) => checked.includes(a.id)).reduce((s, a) => s + a.weight * (r.inputs.docStatus === DOC_STATUS[1] ? 1.3 : 0.9), 0)) : 100;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-sm font-medium text-secondary">Analysis complete</p><h2 className="text-2xl font-extrabold text-foreground">{r.scenario}</h2><p className="text-sm text-muted-foreground">{r.inputs.role || r.inputs.field} · {r.inputs.target} · {r.inputs.docStatus}</p></div>
        <button onClick={onEdit} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"><Pencil className="h-4 w-4" />Edit Inputs</button>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">a · Equivalency Match</h3>
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <Gauge value={r.score} />
            <div className="grid w-full gap-3">
              <div className="rounded-lg border border-border p-3"><div className="text-xs text-muted-foreground">Origin Level</div><div className="font-semibold text-foreground">{r.originLevel}</div></div>
              <div className="text-center text-muted-foreground">↓</div>
              <div className="rounded-lg border-2 border-primary bg-accent p-3"><div className="text-xs text-accent-foreground">Target Level</div><div className="font-semibold text-foreground">{r.targetLevel}</div></div>
            </div>
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">b · Competency Breakdown</h3>
          <p className="mb-2 text-sm font-semibold text-foreground">Recognized Core Competencies</p>
          <ul className="mb-4 space-y-2">{r.core.map((c) => <li key={c} className="flex items-start gap-2 text-sm text-foreground"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground"><Check className="h-3 w-3" strokeWidth={3} /></span>{c}</li>)}</ul>
          <p className="mb-2 text-sm font-semibold text-foreground">Bridging Gaps Identified</p>
          <ul className="space-y-2">{r.gaps.map((g) => <li key={g} className="flex items-start gap-2 rounded-lg bg-warning-soft px-3 py-2 text-sm text-foreground"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />{g}</li>)}</ul>
        </Card>
        <Card>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">c · Missing Records Alternative Proof</h3>
          {r.needsAlt ? <>
            <p className="mb-3 text-sm text-muted-foreground">Your records are {r.inputs.docStatus === DOC_STATUS[1] ? "partial" : "unavailable"}. Tick the evidence you can gather:</p>
            <ul className="space-y-2">{r.altProofs.map((a) => { const on = checked.includes(a.id); return (
              <li key={a.id}><button onClick={() => setChecked(on ? checked.filter((x) => x !== a.id) : [...checked, a.id])} className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition ${on ? "border-secondary bg-success-soft" : "border-border hover:bg-muted"}`}>
                <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border-2 ${on ? "border-secondary bg-secondary text-secondary-foreground" : "border-input"}`}>{on && <Check className="h-3 w-3" strokeWidth={3} />}</span>
                <span><span className="block text-sm font-semibold text-foreground">{a.title}</span><span className="text-xs text-muted-foreground">{a.desc}</span></span>
              </button></li>); })}</ul>
          </> : <div className="flex items-center gap-3 rounded-lg bg-success-soft p-4 text-sm text-foreground"><ShieldCheck className="h-5 w-5 text-secondary" />Full transcripts available — submit them directly for credential evaluation.</div>}
          <div className="mt-4"><div className="mb-1 flex justify-between text-sm"><span className="font-medium text-foreground">Readiness Score</span><span className="font-bold text-foreground">{Math.round(readiness)}%</span></div>
            <div className="h-3 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full transition-all duration-500 ${readiness >= 70 ? "bg-secondary" : "bg-warning"}`} style={{ width: `${readiness}%` }} /></div></div>
        </Card>
        <Card>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">d · Bridging & Micro-Grant Plan</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-4"><Clock className="mb-2 h-5 w-5 text-primary" /><div className="font-display text-2xl font-extrabold text-foreground">{r.weeks} Weeks</div><div className="text-xs text-muted-foreground">Estimated bridging</div></div>
            <div className="rounded-lg border border-border p-4"><Wallet className="mb-2 h-5 w-5 text-primary" /><div className="font-display text-2xl font-extrabold text-foreground">{r.costRange}</div><div className="text-xs text-muted-foreground">Exam / assessment cost</div></div>
          </div>
          <p className="mt-4 text-sm text-foreground"><span className="font-semibold">Required assessment:</span> {r.regExam}</p>
          <p className="mt-2 rounded-lg bg-success-soft px-3 py-2 text-sm text-foreground">{r.microGrant}</p>
          <button onClick={() => setModal(true)} className="mt-4 w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground hover:opacity-90">Generate Shareable Equivalency Summary</button>
        </Card>
      </div>
      {modal && <Modal onClose={() => setModal(false)} title="Equivalency Summary">
        <div className="rounded-xl border-2 border-primary p-5">
          <div className="flex items-center justify-between"><div className="font-display font-extrabold text-primary">EquivLens</div><div className="font-mono text-xs text-muted-foreground">ID: {r.verificationId}</div></div>
          <h4 className="mt-3 text-lg font-bold text-foreground">{r.scenario}</h4>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {[["Match", `${r.score}% Direct Alignment`], ["Origin", r.originLevel], ["Target", r.targetLevel], ["Bridging", `${r.weeks} weeks · ${r.costRange}`], ["Records", r.inputs.docStatus], ["Readiness", `${Math.round(readiness)}%`]].map(([k, v]) => <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-medium text-foreground">{v}</dd></div>)}
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">Gaps: {r.gaps.join("; ")}</p>
          <p className="mt-2 text-[11px] text-muted-foreground">Indicative mapping for guidance only. Issued {new Date().toLocaleDateString()}.</p>
        </div>
        <div className="no-print mt-4 flex gap-2">
          <button onClick={() => window.print()} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Printer className="h-4 w-4" />Print / Save PDF</button>
          <button onClick={() => navigator.clipboard?.writeText(`EquivLens ${r.verificationId}: ${r.scenario} — ${r.score}% alignment, ${r.targetLevel}`)} className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Copy Summary</button>
        </div>
      </Modal>}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/50 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg animate-rise overflow-auto rounded-2xl bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="no-print mb-4 flex items-center justify-between"><h3 className="text-lg font-bold text-foreground">{title}</h3><button onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-muted-foreground hover:bg-muted"><X className="h-5 w-5" /></button></div>
        {children}
      </div>
    </div>
  );
}

function Toolkit() {
  const [open, setOpen] = useState<(typeof TOOLKIT)[number] | null>(null);
  return (
    <div>
      <h2 className="text-3xl font-extrabold text-foreground">Missing Records Toolkit</h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">Four real-world pathways when certificates are lost, destroyed, or the institution can't be reached.</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {TOOLKIT.map((t, i) => (
          <Card key={t.id} className="flex flex-col">
            <span className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-accent font-display font-bold text-accent-foreground">{i + 1}</span>
            <h3 className="text-lg font-bold text-foreground">{t.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t.summary}</p>
            <ol className="mt-4 flex-1 space-y-1.5">{t.steps.map((s) => <li key={s} className="flex gap-2 text-sm text-foreground"><Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />{s}</li>)}</ol>
            <button onClick={() => setOpen(t)} className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-accent"><FileText className="h-4 w-4" />Preview Template</button>
          </Card>
        ))}
      </div>
      {open && <Modal title={open.title} onClose={() => setOpen(null)}><pre className="whitespace-pre-wrap rounded-lg bg-muted p-4 font-mono text-xs leading-relaxed text-foreground">{open.template}</pre></Modal>}
    </div>
  );
}

function Directory({ onPick }: { onPick: (i: Inputs) => void }) {
  const [q, setQ] = useState("");
  const [field, setField] = useState("");
  const [target, setTarget] = useState("");
  const rows = useMemo(() => DIRECTORY.map((d) => ({ ...d, r: analyze(d.inputs) })).filter((d) =>
    (!field || d.inputs.field === field) && (!target || d.inputs.target === target) &&
    `${d.qualification} ${d.inputs.country} ${d.inputs.role}`.toLowerCase().includes(q.toLowerCase())), [q, field, target]);
  return (
    <div>
      <h2 className="text-3xl font-extrabold text-foreground">Sample Directory</h2>
      <p className="mt-2 text-muted-foreground">Pre-loaded cross-border mappings. Click any row to open its full analysis.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search qualification, country, role…" className="w-full rounded-lg border border-input bg-card py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <select value={field} onChange={(e) => setField(e.target.value)} className="rounded-lg border border-input bg-card px-3 py-2.5 text-sm"><option value="">All fields</option>{FIELDS.map((f) => <option key={f}>{f}</option>)}</select>
        <select value={target} onChange={(e) => setTarget(e.target.value)} className="rounded-lg border border-input bg-card px-3 py-2.5 text-sm"><option value="">All targets</option>{TARGETS.map((f) => <option key={f}>{f}</option>)}</select>
      </div>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card shadow-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3">Qualification</th><th className="px-4 py-3">From</th><th className="px-4 py-3">Target</th><th className="px-4 py-3">Mapped Level</th><th className="px-4 py-3">Match</th><th className="px-4 py-3" /></tr></thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id} onClick={() => onPick(d.inputs)} className="cursor-pointer border-t border-border transition hover:bg-accent">
                <td className="px-4 py-3"><div className="font-semibold text-foreground">{d.qualification}</div><div className="text-xs text-muted-foreground">{d.inputs.field}</div></td>
                <td className="px-4 py-3 text-foreground">{d.inputs.country}</td>
                <td className="px-4 py-3 text-foreground">{d.inputs.target}</td>
                <td className="px-4 py-3 text-muted-foreground">{d.r.targetLevel}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${d.r.score >= 75 ? "bg-success-soft text-secondary" : "bg-warning-soft text-foreground"}`}>{d.r.score}%</span></td>
                <td className="px-4 py-3 text-right text-primary"><ArrowLeft className="inline h-4 w-4 rotate-180" /></td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No mappings match your filters.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
