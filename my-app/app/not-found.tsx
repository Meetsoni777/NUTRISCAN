import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-0 px-4 text-center">
      <p className="mb-4 font-data text-[80px] font-semibold text-accent-cyan/20">404</p>
      <h1 className="mb-2 font-voice text-2xl font-medium">Page not found</h1>
      <p className="mb-8 text-text-secondary">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <div className="flex gap-3">
        <Link href="/" className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-all hover:bg-muted">Go home</Link>
        <Link href="/scan" className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-accent-cyan px-4 py-2 text-sm font-semibold text-background transition-all hover:bg-accent-cyan-light">Scan a label</Link>
      </div>
    </div>
  );
}
