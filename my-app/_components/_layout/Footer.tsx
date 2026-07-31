import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1180px] px-6 py-14 md:px-8">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center">

              <Image src="/nlogo.png" alt="NutriScan Logo" width={36} height={36} className="h-9 w-9 rounded-md object-contain" />

              <h1 className="text-2xl font-heading leading-none w-10 m-3">
                <span className="text-white">NUTRI</span>
                <span className="text-sky-400">SCAN</span>
              </h1>
             
            </Link>
            <p className="mt-4 max-w-[220px] text-[13.5px] leading-relaxed text-text-tertiary">
              Plain-language food label analysis, built for the grocery aisle.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-semibold text-foreground">Product</h3>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/#features" className="text-[13.5px] text-text-tertiary transition-colors hover:text-accent-cyan">Features</Link></li>
              <li><Link href="/#how-it-works" className="text-[13.5px] text-text-tertiary transition-colors hover:text-accent-cyan">How it works</Link></li>
              <li><Link href="/scan" className="text-[13.5px] text-text-tertiary transition-colors hover:text-accent-cyan">Scan now</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-semibold text-foreground">Company</h3>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="#" className="text-[13.5px] text-text-tertiary transition-colors hover:text-accent-cyan">About</Link></li>
              <li><Link href="#" className="text-[13.5px] text-text-tertiary transition-colors hover:text-accent-cyan">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-semibold text-foreground">Legal</h3>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="#" className="text-[13.5px] text-text-tertiary transition-colors hover:text-accent-cyan">Privacy policy</Link></li>
              <li><Link href="#" className="text-[13.5px] text-text-tertiary transition-colors hover:text-accent-cyan">Terms of service</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-7 text-[12.5px] text-text-tertiary">
          <span>&copy; 2026 NutriScan.</span>
          <span>Nutrition data referenced from Open Food Facts and WHO guidelines.</span>
        </div>
      </div>
    </footer>
  );
}
