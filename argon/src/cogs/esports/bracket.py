import discord
from discord.ext import commands
from discord import app_commands
import asyncpg
import sys
import os

# Adjust path to find utils
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from utils.bracket_renderer import render_bracket

PRISMA_DB_URL = "postgresql://postgres:affan%40805032@db.fwywdcoiudevrssihfuf.supabase.co:5432/postgres?schema=public"

class Bracket(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self.pool = None

    async def cog_load(self):
        self.pool = await asyncpg.create_pool(PRISMA_DB_URL)

    async def cog_unload(self):
        if self.pool:
            await self.pool.close()

    @app_commands.command(name="bracket", description="Generate and view the visual tournament bracket")
    async def bracket(self, interaction: discord.Interaction):
        await interaction.response.defer()
        guild_id = str(interaction.guild_id)
        
        async with self.pool.acquire() as conn:
            tournament = await conn.fetchrow(
                'SELECT * FROM "Tournament" WHERE "guildId" = $1 AND status != $2 ORDER BY "createdAt" DESC LIMIT 1',
                guild_id, "OPEN" # Should be ACTIVE or COMPLETED
            )
            
            if not tournament:
                return await interaction.followup.send("No active tournament found to generate bracket for.")

            # Fetch all matches with team names
            matches = await conn.fetch('''
                SELECT m.id, m.round, m.status, 
                       t1.name as team1_name, t2.name as team2_name,
                       s.confirmed, s."team1Score", s."team2Score"
                FROM "Match" m
                LEFT JOIN "Team" t1 ON m."team1Id" = t1.id
                LEFT JOIN "Team" t2 ON m."team2Id" = t2.id
                LEFT JOIN "Score" s ON m.id = s."matchId" AND s.confirmed = true
                WHERE m."tournamentId" = $1
            ''', tournament['id'])

            if not matches:
                return await interaction.followup.send("No matches generated yet. Registration needs to be closed first.")

            # Parse matches for renderer
            parsed_matches = []
            for m in matches:
                winner_name = None
                if m['status'] == "COMPLETED" and m['confirmed']:
                    if m['team1Score'] > m['team2Score']:
                        winner_name = m['team1_name']
                    elif m['team2Score'] > m['team1Score']:
                        winner_name = m['team2_name']

                parsed_matches.append({
                    "id": m['id'],
                    "round": m['round'],
                    "team1_name": m['team1_name'],
                    "team2_name": m['team2_name'],
                    "status": m['status'],
                    "winner_name": winner_name
                })

        # Generate image
        buf = render_bracket(parsed_matches, tournament['name'])
        
        file = discord.File(fp=buf, filename="bracket.png")
        embed = discord.Embed(title=f"🏆 {tournament['name']} - Bracket", color=discord.Color.gold())
        embed.set_image(url="attachment://bracket.png")
        embed.set_footer(text="Powered by Ravonixx")
        
        await interaction.followup.send(embed=embed, file=file)

async def setup(bot):
    await bot.add_cog(Bracket(bot))
