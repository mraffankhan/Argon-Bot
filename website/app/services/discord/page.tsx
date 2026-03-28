import Link from "next/link";
import { ArrowLeft, Layers, Server, TerminalSquare, ShieldCheck } from "lucide-react";

export default function DiscordService() {
  return (
    <div className="min-h-screen bg-black pt-20">
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-amber-500/10 blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link href="/#features" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="mr-2" size={20} /> Back to Ecosystem
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center items-start gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/30">
              <Layers size={40} />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white">Discord Setup & Control</h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl leading-relaxed">
            Full-scale Discord server architecture. We provide automated onboarding, intricate role control workflows, and the Argon Bot to bridge your community with our ecosystem.
          </p>
        </div>
      </section>

      <section className="py-20 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-12">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Server className="text-amber-500" /> Structure Templates</h3>
              <p className="text-gray-400 leading-relaxed">Deploy robust channel structures and permission trees specialized for esports communities in a matter of seconds.</p>
            </div>
            <div className="glass p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><ShieldCheck className="text-amber-500" /> Verification Gates</h3>
              <p className="text-gray-400 leading-relaxed">Secure your community against raids with custom captcha and web-based secure Discord authentication workflows.</p>
            </div>
            <div className="glass p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><TerminalSquare className="text-amber-500" /> The Argon Bot</h3>
              <p className="text-gray-400 leading-relaxed">Integrate the powerful Argon bot to serve as the local execution layer for the entire Ravonixx ecosystem inside your server.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-3"><Layers /> How It Works</h2>
          <div className="space-y-8 max-w-4xl">
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-xl border border-amber-500/30">1</div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Connect Your Server</h4>
                <p className="text-gray-400">Authorize the ecosystem using standard Discord OAuth to grant our backend precise access to manage your channels and roles.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-xl border border-amber-500/30">2</div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Architecting</h4>
                <p className="text-gray-400">Select an esports template or clone a previous layout. Permissions are strictly mapped to ensure competitive integrity across all hidden sections.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-xl border border-amber-500/30">3</div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Live Community</h4>
                <p className="text-gray-400">The Argon bot comes online, rendering native interactive UI elements (Buttons, Menus) for your users to interface directly with the centralized database.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
