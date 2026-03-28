import Link from "next/link";
import { ArrowLeft, Trophy, Swords, Share2, Grid } from "lucide-react";

export default function TournamentsService() {
  return (
    <div className="min-h-screen bg-black pt-20">
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link href="/#features" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="mr-2" size={20} /> Back to Ecosystem
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center items-start gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Trophy size={40} />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white">Tournament Operations</h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl leading-relaxed">
            Professional-grade tournament infrastructure. Comprehensive operations for single-elimination, double-elimination, round-robin, and massive battle royale brackets.
          </p>
        </div>
      </section>

      <section className="py-20 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-12">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Grid className="text-blue-400" /> Auto Bracket Generation</h3>
              <p className="text-gray-400 leading-relaxed">Instantly generate seeded brackets based on team MMR or sign-up times, supporting hundreds of teams simultaneously.</p>
            </div>
            <div className="glass p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Share2 className="text-blue-400" /> Match Reporting</h3>
              <p className="text-gray-400 leading-relaxed">Players can self-report scores via Discord or the web dashboard, automatically advancing winners to the next stage.</p>
            </div>
            <div className="glass p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Swords className="text-blue-400" /> Live Point Tables</h3>
              <p className="text-gray-400 leading-relaxed">For point-based games (like Battle Royales), point tables are calculated and published dynamically after every match.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-3"><Trophy /> How It Works</h2>
          <div className="space-y-8 max-w-4xl">
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xl border border-blue-500/30">1</div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Create constraints</h4>
                <p className="text-gray-400">Set team sizes, format, registration windows, and required entry roles. The system opens registration gates automatically.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xl border border-blue-500/30">2</div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Signups & Check-ins</h4>
                <p className="text-gray-400">Players sign up and complete a mandatory check-in phase 30 minutes before start time to prune inactive teams.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xl border border-blue-500/30">3</div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Tournament Phase</h4>
                <p className="text-gray-400">The bracket is locked and initialized. Match rooms/channels are created, and algorithms wait for score submissions to finalize matches.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
