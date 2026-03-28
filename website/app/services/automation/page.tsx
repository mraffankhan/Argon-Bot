import Link from "next/link";
import { ArrowLeft, Zap, CheckCircle2, Cog } from "lucide-react";

export default function AutomationService() {
  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-primary/10 blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link href="/#features" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="mr-2" size={20} /> Back to Ecosystem
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center items-start gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-primary/20 text-primary border border-primary/30">
              <Zap size={40} />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white">Automation System</h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl leading-relaxed">
            Stop doing manual work. The Ravonixx Automation System handles repetitive community workflows, reporting, and scheduled tasks at lightning speed.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-12">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><CheckCircle2 className="text-primary" /> Daily Scrim Automation</h3>
              <p className="text-gray-400 leading-relaxed">Automate the registration, slot allocation, and point tabulation for daily scrims without lifting a finger.</p>
            </div>
            <div className="glass p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><CheckCircle2 className="text-primary" /> Auto-Reporting</h3>
              <p className="text-gray-400 leading-relaxed">Automatically collect and format screenshots and match data into beautiful leaderboards and internal logs.</p>
            </div>
            <div className="glass p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><CheckCircle2 className="text-primary" /> Dynamic Role Assignment</h3>
              <p className="text-gray-400 leading-relaxed">Instantly reward active community members with roles based on their performance and participation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-3"><Cog className="animate-spin-slow" /> How It Works</h2>
          <div className="space-y-8 max-w-4xl">
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xl border border-primary/30">1</div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Integrate Rules</h4>
                <p className="text-gray-400">Define your automation parameters inside the Ravonixx dashboard (e.g., condition for role rewards or scrim schedule).</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xl border border-primary/30">2</div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Background Processing</h4>
                <p className="text-gray-400">Our edge servers continuously monitor your community endpoints for trigger conditions, maintaining sub-10ms response times.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xl border border-primary/30">3</div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Execution</h4>
                <p className="text-gray-400">The automation engine executes the target operations—from creating channels to publishing leaderboards—with full audit trails.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
