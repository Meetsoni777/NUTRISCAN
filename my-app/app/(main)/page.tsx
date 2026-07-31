import Link from "next/link";
import { ScanLine, BarChart3, AlertTriangle, Heart, Camera, TrendingUp } from "lucide-react";

const features = [
  { icon: ScanLine, title: "AI OCR scanner", description: "Extract text from food labels, even on curved packaging or in low light." },
  { icon: BarChart3, title: "Detailed nutrition", description: "Know calories, protein, fat, carbs, sodium, and sugar at a glance." },
  { icon: AlertTriangle, title: "Risk detection", description: "Identify harmful additives, trans fats, and excess sodium instantly." },
  { icon: Heart, title: "Healthy alternatives", description: "Find better options in the same category, ranked by nutrient profile." },
];

const steps = [
  { number: "01", title: "Scan the label", description: "Point your camera at the ingredient or nutrition panel — no manual entry needed." },
  { number: "02", title: "We parse the panel", description: "OCR extracts the text, then structures it into carbs, protein, fat, sodium, sugar, and additives." },
  { number: "03", title: "Get your verdict", description: "A plain-language health score, flagged ingredients, and healthier alternatives — all in one view." },
];

const stats = [
  { value: "2.1M+", label: "Labels scanned" },
  { value: "40K+", label: "Active users" },
  { value: "98%", label: "OCR accuracy" },
  { value: "4.8/5", label: "Average rating" },
];

export default function HomePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="px-6 py-22 md:px-8">
        <div className="mx-auto grid max-w-[1180px] items-center gap-14 md:grid-cols-[1fr_0.9fr]">
          <div>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent-dark px-3.5 py-1.5 text-[12.5px] font-semibold text-accent-cyan">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan" />
              Now reading labels in 2 seconds
            </span>
            <h1 className="mb-5.5 font-voice text-[56px] font-medium leading-[1.08] tracking-tight">
              Scan today,<br />stay <span className="text-accent-cyan">healthy</span>
            </h1>
            <p className="mb-9 max-w-[440px] text-[17px] leading-relaxed text-text-secondary">
              Make informed food choices for a better and healthier tomorrow. Point your camera at any label and get a plain-language verdict in seconds.
            </p>
            <div className="mb-11 flex gap-3.5">
              <Link href="/scan" className="inline-flex items-center gap-2 rounded-[10px] border border-transparent bg-accent-cyan px-[22px] py-3 text-sm font-semibold text-background transition-all hover:bg-accent-cyan-light active:scale-[0.98]">
                <Camera className="h-[18px] w-[18px]" />
                Scan product
              </Link>
              <Link href="#how-it-works" className="inline-flex items-center gap-2 rounded-[10px] border border-border-strong bg-transparent px-[22px] py-3 text-sm font-semibold text-foreground transition-all hover:bg-surface-2">
                How it works
              </Link>
            </div>
            <div className="flex items-center gap-4.5 text-[13px] text-text-tertiary">
              <div className="flex" aria-hidden="true">
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className="h-7 w-7 rounded-full border-2 border-background bg-surface-3 -ml-2 first:ml-0" />
                ))}
              </div>
              <span>Trusted by 40,000+ health-conscious shoppers</span>
            </div>
          </div>

                {/* poster image */}
          <div className="relative flex min-h-[380px] items-center justify-center">
            <div className="relative flex h-[340px] w-[280px] items-center justify-center overflow-hidden rounded-[16px] border border-border bg-surface-1">
              <div className="absolute left-3.5 top-3.5 h-7 w-7 rounded-l-md rounded-t-md border-2 border-accent-cyan border-r-0 border-b-0" />
              <div className="absolute bottom-3.5 right-3.5 h-7 w-7 rounded-r-md rounded-b-md border-2 border-accent-cyan border-l-0 border-t-0" />
              <div className="flex h-[120px] w-24 items-center justify-center rounded-lg border border-border bg-surface-2 text-text-tertiary">
                <svg width="40" height="46" viewBox="0 0 24 28" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M7 2h10l1 5H6l1-5Z" />
                  <path d="M6 7h12l1.5 17a2 2 0 0 1-2 2.2H6.5a2 2 0 0 1-2-2.2L6 7Z" />
                </svg>
              </div>
            </div>
            <div className="absolute -left-7 bottom-[-18px] w-[220px] rounded-[10px] border border-border bg-surface-2 p-3.5 shadow-2xl md:left-0">
              <p className="mb-1.5 text-[11px] uppercase tracking-wider text-text-tertiary">Scan complete</p>
              <span className="inline-flex items-center gap-[7px] rounded-full bg-verdict-healthy-bg px-3 py-[5px] text-[12.5px] font-semibold text-verdict-healthy-text">
                <span className="h-[7px] w-[7px] rounded-full bg-verdict-healthy" />
                Healthy
              </span>
            </div>
          </div>
        </div>
        
      </section>

      {/* ===== FEATURES ===== */}
      <section className="px-6 py-22 md:px-8" id="features">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-[52px] max-w-[560px]">
            <p className="mb-3 text-[12.5px] font-semibold uppercase tracking-[0.08em] text-accent-cyan">Features</p>
            <h2 className="mb-3 font-voice text-[32px] font-medium leading-tight">Everything you need to read a label properly</h2>
            <p className="text-[15.5px] leading-relaxed text-text-secondary">Four tools working together, from the moment you point your camera to the moment you decide what goes in your basket.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <article key={f.title} className="rounded-[16px] border border-border bg-surface-1 p-[26px] transition-all duration-200 hover:border-border-strong hover:-translate-y-[3px]">
                <div className="mb-[18px] flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent-dark text-accent-cyan">
                  <f.icon className="h-[18px] w-[18px]" />
                </div>
                <h3 className="mb-1.5 text-[15.5px] font-semibold">{f.title}</h3>
                <p className="text-[13.5px] leading-[1.55] text-text-tertiary">{f.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="px-6 py-22 md:px-8" id="how-it-works">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-[52px] max-w-[560px]">
            <p className="mb-3 text-[12.5px] font-semibold uppercase tracking-[0.08em] text-accent-cyan">How it works</p>
            <h2 className="font-voice text-[32px] font-medium leading-tight">From label to verdict in three steps</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.number} className="relative">
                <div className="mb-5 flex h-[44px] w-[44px] items-center justify-center rounded-full border border-border-strong bg-surface-1 font-data text-[13px] text-accent-cyan">{step.number}</div>
                <h3 className="mb-2 text-base font-semibold">{step.title}</h3>
                <p className="max-w-[260px] text-[13.5px] leading-[1.55] text-text-tertiary">{step.description}</p>
                {i < steps.length - 1 && <div className="absolute right-0 top-[22px] hidden h-px w-[60%] bg-gradient-to-r from-border-default to-transparent md:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SCAN RESULT SHOWCASE ===== */}
      <section className="px-6 py-22 md:px-8">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-[52px] max-w-[560px]">
            <p className="mb-3 text-[12.5px] font-semibold uppercase tracking-[0.08em] text-accent-cyan">See it in action</p>
            <h2 className="font-voice text-[32px] font-medium leading-tight">Verdicts you can actually understand</h2>
          </div>
          <div className="grid gap-12 rounded-[24px] border border-border bg-surface-1 p-11 md:grid-cols-2">
            <div>
              <p className="mb-2.5 text-[12.5px] uppercase tracking-wider text-text-tertiary">Multigrain crackers &middot; 200g pack</p>
              <h3 className="mb-4 font-voice text-[26px] font-medium leading-[1.3]">
                <span className="text-verdict-moderate-text">Moderate</span> — fine occasionally, not a daily staple
              </h3>
              <p className="mb-5.5 font-voice text-[15px] leading-[1.7] text-text-secondary">
                Sodium runs higher than similar crackers on the shelf, and there&apos;s one preservative worth knowing about. Protein and fiber are solid, though.
              </p>
              <Link href="/scan" className="inline-flex items-center gap-2 rounded-[10px] border border-accent-600 bg-transparent px-[18px] py-2 text-[13px] font-semibold text-accent-cyan transition-all hover:bg-accent-900">
                See healthier alternatives
              </Link>
            </div>
            <div>
              <table className="w-full border-collapse">
                <tbody>
                  {[
                    { label: "Sodium", value: "480 mg", flag: "Above threshold" },
                    { label: "Sugar", value: "3 g", flag: null },
                    { label: "Fiber", value: "4 g", flag: null },
                    { label: "Protein", value: "6 g", flag: null },
                    { label: "Trans fat", value: "0 g", flag: null },
                  ].map((row) => (
                    <tr key={row.label}>
                      <td className="border-b border-border py-2.5 text-[13.5px] text-text-secondary">{row.label}</td>
                      <td className="border-b border-border py-2.5 text-right font-data text-foreground">
                        {row.value}
                        {row.flag && <span className="mt-0.5 block text-[11px] text-verdict-avoid-text">{row.flag}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <section className="border-y border-border py-10">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-6 px-6 md:px-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-voice text-[30px] font-semibold text-accent-cyan">{stat.value}</div>
              <div className="mt-0.5 text-[12.5px] text-text-tertiary">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="px-6 py-22 md:px-8">
        <div className="mx-auto max-w-[1180px]">
          <div className="rounded-[24px] border border-border bg-surface-1 px-12 py-16 text-center">
            <h2 className="mb-3.5 font-voice text-[34px] font-medium">Your next grocery trip just got smarter</h2>
            <p className="mb-8 text-[15.5px] text-text-secondary">No sign-up required for your first scan. See what&apos;s really in your food.</p>
            <div className="flex flex-wrap justify-center gap-3.5">
              <Link href="/scan" className="inline-flex items-center gap-2 rounded-[10px] border border-transparent bg-accent-cyan px-[22px] py-3 text-sm font-semibold text-background transition-all hover:bg-accent-cyan-light active:scale-[0.98]">
                Scan your first product
              </Link>
              <Link href="/register" className="inline-flex items-center gap-2 rounded-[10px] border border-border-strong bg-transparent px-[22px] py-3 text-sm font-semibold text-foreground transition-all hover:bg-surface-2">
                Create free account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
