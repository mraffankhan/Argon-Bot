"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTournament() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    game: "Free Fire Max",
    format: "Single Elim",
    teamSize: "Squad",
    maxTeams: 64,
    prize: "",
    rules: "",
    guildId: "", // Organizer enters Discord Server ID
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/tournaments");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create tournament");
      }
    } catch (err) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white selection:bg-purple-500/30 flex items-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full mx-auto space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
            Host a New Tournament
          </h2>
          <p className="mt-4 text-sm text-gray-400 max-w-xl mx-auto">
            Configure your esports event and sync it directly to your Discord server for automated registration, brackets, and score reporting.
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">Tournament Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full bg-[#0E131F] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors shadow-inner text-white placeholder-gray-500"
                placeholder="e.g. Ravonixx BGMI Showdown"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="game" className="block text-sm font-medium text-gray-300">Game</label>
              <select
                id="game"
                name="game"
                className="mt-1 block w-full bg-[#0E131F] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors shadow-inner text-white"
                value={formData.game}
                onChange={handleChange}
              >
                <option value="Free Fire Max">Free Fire Max</option>
                <option value="BGMI">BGMI</option>
                <option value="Valorant">Valorant</option>
                <option value="Custom">Custom / Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="format" className="block text-sm font-medium text-gray-300">Format</label>
              <select
                id="format"
                name="format"
                className="mt-1 block w-full bg-[#0E131F] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors shadow-inner text-white"
                value={formData.format}
                onChange={handleChange}
              >
                <option value="Single Elim">Single Elimination</option>
                <option value="Double Elim">Double Elimination</option>
                <option value="Round Robin">Round Robin</option>
              </select>
            </div>

            <div>
              <label htmlFor="teamSize" className="block text-sm font-medium text-gray-300">Team Size</label>
              <select
                id="teamSize"
                name="teamSize"
                className="mt-1 block w-full bg-[#0E131F] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors shadow-inner text-white"
                value={formData.teamSize}
                onChange={handleChange}
              >
                <option value="Solo">Solo (1v1)</option>
                <option value="Duo">Duo (2v2)</option>
                <option value="Squad">Squad (4v4+)</option>
              </select>
            </div>

            <div>
              <label htmlFor="maxTeams" className="block text-sm font-medium text-gray-300">Max Teams</label>
              <input
                id="maxTeams"
                name="maxTeams"
                type="number"
                min="2"
                required
                className="mt-1 block w-full bg-[#0E131F] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors shadow-inner text-white placeholder-gray-500"
                value={formData.maxTeams}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="prize" className="block text-sm font-medium text-gray-300">Prize Pool (Optional)</label>
              <input
                id="prize"
                name="prize"
                type="text"
                className="mt-1 block w-full bg-[#0E131F] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors shadow-inner text-white placeholder-gray-500"
                placeholder="e.g. ₹10,000 INR"
                value={formData.prize}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="guildId" className="block text-sm font-medium text-purple-300">Discord Server ID</label>
              <p className="text-xs text-gray-400 mt-1 mb-2">The bot uses this to detect your server and run commands.</p>
              <input
                id="guildId"
                name="guildId"
                type="text"
                required
                className="block w-full bg-[#0E131F] border border-purple-500/30 rounded-xl px-4 py-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors shadow-inner text-white placeholder-gray-600"
                placeholder="e.g. 746337818388987967"
                value={formData.guildId}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="rules" className="block text-sm font-medium text-gray-300">Tournament Rules</label>
              <textarea
                id="rules"
                name="rules"
                rows={4}
                className="mt-1 block w-full bg-[#0E131F] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors shadow-inner text-white placeholder-gray-500"
                placeholder="List your specific rules, tiebreakers, and map rotations here."
                value={formData.rules}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-extrabold rounded-2xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-[#07090E] overflow-hidden transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50"
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-full group-hover:h-56 opacity-10 blur-xl"></span>
              {loading ? "Creating..." : "Launch Tournament"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
