import Link from "next/link";
import { ArrowLeft, Box, Monitor, Map, Clock } from "lucide-react";

export default function LanEventsService() {
  return (
    <div className="min-h-screen bg-black pt-20">
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-emerald-500/10 blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link href="/#features" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="mr-2" size={20} /> Back to Ecosystem
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center items-start gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Box size={40} />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white">LAN Event Handling</h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl leading-relaxed">
            Take your tournaments offline. Dedicated modules for tracking on-site activities, dynamic scheduling, physical space management, and live LAN updates.
          </p>
        </div>
      </section>

      <section className="py-20 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-12">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Map className="text-emerald-400" /> Venue Mapping</h3>
              <p className="text-gray-400 leading-relaxed">Allocate stations, booths, and main stages to incoming teams. Digitally map your venue to prevent crowding and confusions.</p>
            </div>
            <div className="glass p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Clock className="text-emerald-400" /> Dynamic Scheduling</h3>
              <p className="text-gray-400 leading-relaxed">Adjust match times on the fly if setups run late. Push global push notifications to player phones to instantly inform them of delays.</p>
            </div>
            <div className="glass p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Monitor className="text-emerald-400" /> Broadcast Integration</h3>
              <p className="text-gray-400 leading-relaxed">Expose your live match states directly to OBS or vMix using our real-time WebSocket overlay APIs for a flawless broadcast.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-3"><Box /> How It Works</h2>
          <div className="space-y-8 max-w-4xl">
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl border border-emerald-500/30">1</div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Pre-Event Check-in</h4>
                <p className="text-gray-400">Generate QR codes for registered teams via the Ravonixx app. Scan them at the door to finalize attendance and initialize the main desk.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl border border-emerald-500/30">2</div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Running The Show</h4>
                <p className="text-gray-400">Admins use specialized offline-capable dashboards to track active stations. Teams are called to their PCs via the integrated announcement system.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl border border-emerald-500/30">3</div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Stage Finale</h4>
                <p className="text-gray-400">Send top teams to the main stage. The system automatically shifts overlay focus securely to the live PCs and syncs data to online audiences.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
