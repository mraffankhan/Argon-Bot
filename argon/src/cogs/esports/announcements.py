import discord
from discord.ext import commands
import datetime

class Announcements(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    async def get_or_create_channel(self, guild: discord.Guild, channel_name: str):
        channel = discord.utils.get(guild.text_channels, name=channel_name)
        if not channel:
            try:
                channel = await guild.create_text_channel(name=channel_name)
            except discord.Forbidden:
                return None
        return channel

    # ─── Tournament Opened ───
    @commands.Cog.listener()
    async def on_tournament_started(self, tournament: dict, guild_id: int):
        guild = self.bot.get_guild(int(guild_id))
        if not guild: return

        channel = await self.get_or_create_channel(guild, "tournament-announcements")
        if not channel: return

        embed = discord.Embed(
            title="🎮 REGISTRATIONS OPEN!",
            description=(
                f"**{tournament['name']}** is now accepting teams!\n\n"
                f"Use `/register [team-name]` to secure your slot."
            ),
            color=discord.Color.blue(),
            timestamp=datetime.datetime.now()
        )
        embed.add_field(name="🎯 Game", value=tournament['game'], inline=True)
        embed.add_field(name="📋 Format", value=tournament['format'], inline=True)
        if tournament.get('prize'):
            embed.add_field(name="💰 Prize Pool", value=tournament['prize'], inline=True)
        embed.add_field(name="👥 Max Teams", value=str(tournament.get('maxTeams', '?')), inline=True)
        embed.set_footer(text="Powered by Ravonixx Argon")
        await channel.send(embed=embed)

    # ─── Registrations Closed ───
    @commands.Cog.listener()
    async def on_tournament_closed(self, tournament: dict, team_list: list, guild_id: int):
        guild = self.bot.get_guild(int(guild_id))
        if not guild: return

        channel = await self.get_or_create_channel(guild, "tournament-announcements")
        if not channel: return

        team_names = "\n".join([f"• **{t['name']}**" for t in team_list[:20]])
        embed = discord.Embed(
            title="🔒 REGISTRATIONS CLOSED",
            description=(
                f"**{tournament['name']}** is locked!\n"
                f"**{len(team_list)} teams** ready to battle.\n\n"
                f"{team_names}\n\n"
                f"Match #1 is scheduled. Waiting for organizer to start."
            ),
            color=discord.Color.purple(),
            timestamp=datetime.datetime.now()
        )
        embed.set_footer(text="Powered by Ravonixx Argon")
        await channel.send(embed=embed)

    # ─── Score Submitted ───
    @commands.Cog.listener()
    async def on_score_submitted(self, data: dict, guild_id: int):
        guild = self.bot.get_guild(int(guild_id))
        if not guild: return

        channel = await self.get_or_create_channel(guild, "live-scores")
        if not channel: return

        embed = discord.Embed(
            title="✅ Score Submitted",
            description=(
                f"**{data['team_name']}** submitted for Match #{data['match_number']}\n\n"
                f"📍 Placement: **#{data['placement']}** | 💀 Kills: **{data['kills']}** | 🔢 Points: **{data['total_pts']}**\n\n"
                f"📊 {data['submitted']}/{data['total_teams']} teams submitted"
            ),
            color=discord.Color.green(),
            timestamp=datetime.datetime.now()
        )
        await channel.send(embed=embed)

    # ─── All Teams Submitted ───
    @commands.Cog.listener()
    async def on_match_ready_to_close(self, data: dict, guild_id: int):
        guild = self.bot.get_guild(int(guild_id))
        if not guild: return

        admin_chan = await self.get_or_create_channel(guild, "admin")
        if not admin_chan: return

        embed = discord.Embed(
            title="📋 All Teams Submitted!",
            description=(
                f"All teams have submitted scores for **Match #{data['match_number']}**!\n\n"
                f"Use `/close-match {data['match_number']}` to finalize results."
            ),
            color=discord.Color.yellow(),
            timestamp=datetime.datetime.now()
        )
        await admin_chan.send(embed=embed)

    # ─── Match Started ───
    @commands.Cog.listener()
    async def on_match_started(self, data: dict, guild_id: int):
        guild = self.bot.get_guild(int(guild_id))
        if not guild: return

        channel = await self.get_or_create_channel(guild, "live-scores")
        if not channel: return

        embed = discord.Embed(
            title=f"🔴 MATCH #{data['match_number']} IS LIVE!",
            description=(
                f"**{data['tournament_name']}**\n\n"
                f"All captains: submit results with `/score [placement] [kills]` + screenshot."
            ),
            color=discord.Color.red(),
            timestamp=datetime.datetime.now()
        )
        await channel.send(embed=embed)

    # ─── Match Completed ───
    @commands.Cog.listener()
    async def on_match_completed(self, data: dict, guild_id: int):
        guild = self.bot.get_guild(int(guild_id))
        if not guild: return

        channel = await self.get_or_create_channel(guild, "live-scores")
        if not channel: return

        # Build standings table
        lines = []
        medals = {1: "🥇", 2: "🥈", 3: "🥉"}
        for s in data['standings'][:15]:
            rank = s.get('rank', '?')
            medal = medals.get(rank, f"#{rank}")
            lines.append(f"{medal} **{s['team_name']}** — {s['totalPoints']}pts | {s['totalKills']}💀")

        embed = discord.Embed(
            title=f"✅ MATCH #{data['match_number']} COMPLETE — STANDINGS",
            description="\n".join(lines),
            color=discord.Color.gold(),
            timestamp=datetime.datetime.now()
        )
        embed.set_footer(text=f"Match {data['completed_matches']}/{data['total_matches']} • ravonixx.xyz/tournaments/{data['tournament_id']}")

        # Try to generate and send standings card
        try:
            from utils.card_renderer import render_standings_card
            buf = render_standings_card(data['standings'], data['tournament_name'], data['completed_matches'], data['total_matches'])
            file = discord.File(buf, filename="standings.png")
            await channel.send(embed=embed, file=file)
        except Exception:
            await channel.send(embed=embed)

    # ─── Tournament End ───
    @commands.Cog.listener()
    async def on_tournament_end(self, data: dict, guild_id: int):
        guild = self.bot.get_guild(int(guild_id))
        if not guild: return

        channel = await self.get_or_create_channel(guild, "tournament-announcements")
        if not channel: return

        winner = data['standings'][0] if data['standings'] else None
        
        embed = discord.Embed(
            title="🏆 TOURNAMENT CHAMPION! 🏆",
            description=(
                f"**{data['tournament_name']}** has concluded!\n\n"
                + (f"👑 **{winner['team_name']}** wins with **{winner['totalPoints']} points** and **{winner['totalKills']} kills**!\n\n" if winner else "")
                + f"Full results → ravonixx.xyz/tournaments/{data['tournament_id']}"
            ),
            color=discord.Color.gold(),
            timestamp=datetime.datetime.now()
        )
        if data.get('prize'):
            embed.add_field(name="💰 Prize", value=data['prize'])

        # Try to generate champion card
        try:
            from utils.card_renderer import render_champion_card
            buf = render_champion_card(winner, data['tournament_name'], data.get('game', ''), data.get('prize', ''))
            file = discord.File(buf, filename="champion.png")
            await channel.send(embed=embed, file=file)
        except Exception:
            await channel.send(embed=embed)

        # Award badges via badge engine
        try:
            from utils.badge_engine import check_and_award_badges
            await check_and_award_badges(self.bot, data['tournament_id'], data['standings'])
        except Exception as e:
            print(f"Badge engine error: {e}")

async def setup(bot):
    await bot.add_cog(Announcements(bot))
