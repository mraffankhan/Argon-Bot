import Link from "next/link";
import { ArrowLeft, Shield, Users, Activity, Target } from "lucide-react";

export default function StaffManagementService() {
  return (
    <div className="min-h-screen bg-black pt-20">
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-secondary/10 blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link href="/#features" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="mr-2" size={20} /> Back to Ecosystem
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center items-start gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-secondary/20 text-secondary border border-secondary/30">
              <Shield size={40} />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white">Real Staff Management</h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl leading-relaxed">
            Gain complete oversight of your organization. Advanced tools to assign roles, track staff activity, and manage your moderation/admin team efficiently.
          </p>
        </div>
      </section>

      <section className="py-20 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-12">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Users className="text-secondary" /> Hierarchical Structures</h3>
              <p className="text-gray-400 leading-relaxed">Create and enforce strict staff hierarchies, ensuring junior moderators only have access to entry-level commands and views.</p>
            </div>
            <div className="glass p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Activity className="text-secondary" /> Activity Tracking</h3>
              <p className="text-gray-400 leading-relaxed">Monitor ticket resolution times, command usages, and overall activity to identify your most valuable staff members.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-3"><Target /> How It Works</h2>
          <div className="space-y-8 max-w-4xl">
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold text-xl border border-secondary/30">1</div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Onboarding</h4>
                <p className="text-gray-400">Staff are entered into the Ravonixx database, mapped securely to their Discord IDs and assigned access levels.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold text-xl border border-secondary/30">2</div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Audit Logging</h4>
                <p className="text-gray-400">Every action performed by a staff member via the ecosystem is securely logged with timestamps and contextual data.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="shrink-0 w-12 h-12 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold text-xl border border-secondary/30">3</div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Performance Reviews</h4>
                <p className="text-gray-400">Administrators can generate weekly or monthly staff reports directly from the dashboard to optimize operations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
