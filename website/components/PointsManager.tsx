"use client";

import { useState } from "react";
import { Check, Loader2, Save } from "lucide-react";

export default function PointsManager({ tournament }: { tournament: any }) {
    const [selectedStage, setSelectedStage] = useState(tournament.stages[0]?.id);
    const stageData = tournament.stages.find((s: any) => s.id === selectedStage);
    const [selectedGroup, setSelectedGroup] = useState(stageData?.groups[0]?.id);
    const groupData = stageData?.groups.find((g: any) => g.id === selectedGroup);
    
    // State to hold points data for all teams in the selected group
    const [pointsData, setPointsData] = useState<Record<string, { kills: number, pp: number }>>({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (teamId: string, field: 'kills' | 'pp', value: string) => {
        const numVal = parseInt(value) || 0;
        setPointsData(prev => ({
            ...prev,
            [teamId]: { ...prev[teamId], [field]: numVal }
        }));
    };

    const submitPoints = async () => {
        if (!groupData) return alert("Select a group first");
        const confirm = window.confirm(`Update points for ${groupData.name}? This will instantly calculate their totals and update leaderboards.`);
        if(!confirm) return;

        setLoading(true);
        try {
            // Build the payload mapping teamIds to their match results
            const results = groupData.teams.map((t: any) => ({
                teamId: t.id,
                kills: pointsData[t.id]?.kills || 0,
                placementPoints: pointsData[t.id]?.pp || 0,
            }));

            const res = await fetch(`/api/dashboard/tournaments/${tournament.id}/points`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ groupId: groupData.id, stageId: stageData.id, results })
            });
            const d = await res.json();
            if(d.success) {
                alert("Leaderboard successfully updated!");
                setPointsData({});
            } else {
                alert(d.error);
            }
        } catch(e) {
            alert("Error submitting points");
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-4 glass p-6 rounded-2xl border border-white/5 shadow-lg">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Select Stage</label>
                    <select 
                        className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors"
                        value={selectedStage} 
                        onChange={e => {
                            setSelectedStage(e.target.value);
                            const newStage = tournament.stages.find((s: any) => s.id === e.target.value);
                            setSelectedGroup(newStage?.groups[0]?.id);
                        }}
                    >
                        {tournament.stages.map((s: any) => <option key={s.id} value={s.id}>{s.name} (Rank #{s.order})</option>)}
                    </select>
                </div>

                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Select Group</label>
                    <select 
                        className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors"
                        value={selectedGroup || ""} 
                        onChange={e => setSelectedGroup(e.target.value)}
                    >
                        {stageData?.groups.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                </div>
            </div>

            {groupData && groupData.teams.length > 0 ? (
                <div className="glass border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-xs font-black uppercase tracking-wider">
                                <th className="p-4 w-1/2">Team Name</th>
                                <th className="p-4 text-center">Match Kills</th>
                                <th className="p-4 text-center">Placement Pts</th>
                                <th className="p-4 border-l border-white/10 text-center text-primary">Total Points</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {groupData.teams.map((t: any) => {
                                const k = pointsData[t.id]?.kills || 0;
                                const p = pointsData[t.id]?.pp || 0;
                                return (
                                <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4 font-bold text-white text-base">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-primary/20 text-primary flex items-center justify-center font-black">
                                                {t.name[0]}
                                            </div>
                                            {t.name}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <input 
                                            type="number" min="0" placeholder="0"
                                            className="w-20 bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-center text-white font-bold focus:border-primary transition-colors focus:outline-none group-hover:border-white/30"
                                            value={pointsData[t.id]?.kills === undefined ? "" : pointsData[t.id].kills}
                                            onChange={e => handleInputChange(t.id, 'kills', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-4 text-center">
                                        <input 
                                            type="number" min="0" placeholder="0"
                                            className="w-20 bg-[#07090E] border border-white/10 rounded-lg px-3 py-2 text-center text-white font-bold focus:border-primary transition-colors focus:outline-none group-hover:border-white/30"
                                            value={pointsData[t.id]?.pp === undefined ? "" : pointsData[t.id].pp}
                                            onChange={e => handleInputChange(t.id, 'pp', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-4 border-l border-white/10 text-center">
                                        <div className="text-xl font-black text-primary drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                                            {k + p}
                                        </div>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="glass p-10 rounded-2xl text-center text-gray-500 font-medium">
                    No teams found in this group. Ensure teams have registered.
                </div>
            )}

            {groupData && groupData.teams.length > 0 && (
                <div className="flex justify-end gap-3 mt-4">
                    <button 
                        onClick={submitPoints}
                        disabled={loading}
                        className="bg-secondary hover:scale-105 active:scale-95 disabled:opacity-50 text-white font-black uppercase tracking-wider px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.4)] flex items-center gap-2 transition-all"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                        {loading ? "Saving to Database..." : "Publish Match Results"}
                    </button>
                </div>
            )}
        </div>
    );
}
