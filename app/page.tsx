// app/page.tsx — Server Component shell
// This renders at build time / on the server so the HTML is immediately available.
// Only the interactive inner shell (ClientShell) is a client component.
import HeaderClock from "@/components/HeaderClock";
import ClientShell from "@/components/ClientShell";

export default function Page() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-accent/20 overflow-hidden font-sans">
      {/* Static background — rendered in SSR HTML, no JS needed */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden>
        <div className="absolute inset-0 noise opacity-5 after:absolute after:inset-0 after:bg-linear-to-t after:from-background after:via-transparent after:to-background" />
        <div className="absolute -top-[10%] -left-[5%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] rounded-full bg-accent/2 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-8 lg:px-12">
        {/* Clock is client-only but renders a stable placeholder immediately */}
        <HeaderClock />

        {/* All interactive client state lives here */}
        <ClientShell />

        <footer className="py-24 border-t border-border/40 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] select-none">TimeBridge</span>
              <div className="h-px w-8 bg-border" />
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] select-none">v1.2.0</span>
            </div>
            <p className="text-[11px] text-muted-text max-w-xs leading-relaxed font-medium opacity-40">Designed for precision. Built for the global freelancer.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
