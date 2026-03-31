import discord
from discord.ext import commands
from discord import app_commands
import asyncpg

PRISMA_DB_URL = "postgresql://postgres:affan%40805032@db.fwywdcoiudevrssihfuf.supabase.co:5432/postgres?schema=public"

class PlayerStats(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self.pool = None

    async def cog_load(self):
        self.pool = await asyncpg.create_pool(PRISMA_DB_URL)

    async def cog_unload(self):
        if self.pool:
            await self.pool.close()

    @app_commands.command(name="mystats", description="View your cumulative tournament stats")
    async def mystats(self, interaction: discord.Interaction):
        user_discord_id = str(interaction.user.id)

        async with self.pool.acquire() as conn:
            # Check if user exists
            user_row = await conn.fetchrow('SELECT id FROM "User" WHERE "discordId" = $1', user_discord_id)
            if not user_row:
                return await interaction.response.send_message("No stats found. Register for a tournament first!", ephemeral=True)
            
            user_db_id = user_row['id']
            stats = await conn.fetch('SELECT * FROM "PlayerStat" WHERE "userId" = $1', user_db_id)

            sum_wins = sum(s['wins'] for s in stats)
            sum_losses = sum(s['losses'] for s in stats)
            sum_mvps = sum(s['mvpCount'] for s in stats)
            total_matches = sum_wins + sum_losses
            total_tournaments = len(stats)
            win_rate = round((sum_wins / total_matches * 100), 2) if total_matches > 0 else 0.0

        embed = discord.Embed(
            title=f"🏆 {interaction.user.display_name}'s Stats",
            color=discord.Color.from_rgb(171, 72, 209)
        )
        if interaction.user.avatar:
            embed.set_thumbnail(url=interaction.user.avatar.url)
            
        embed.add_field(name="Tournaments Played", value=str(total_tournaments), inline=True)
        embed.add_field(name="Matches Won", value=str(sum_wins), inline=True)
        embed.add_field(name="Matches Lost", value=str(sum_losses), inline=True)
        embed.add_field(name="Win Rate", value=f"{win_rate}%", inline=True)
        embed.add_field(name="MVPs", value=str(sum_mvps), inline=True)
        embed.add_field(name="Most Played Game", value="Free Fire Max", inline=True) # Static for now
        
        embed.set_footer(text="Powered by Ravonixx Argon")
        await interaction.response.send_message(embed=embed)

async def setup(bot):
    await bot.add_cog(PlayerStats(bot))
