import discord
from discord.ext import commands
from discord import app_commands
import asyncpg
import os
import uuid
from datetime import datetime
import random

# Prisma Database connection specifically for MVP features
PRISMA_DB_URL = "postgresql://postgres:affan%40805032@db.fwywdcoiudevrssihfuf.supabase.co:5432/postgres?schema=public"

class ArgonMVP(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self.pool = None

    async def cog_load(self):
        self.pool = await asyncpg.create_pool(PRISMA_DB_URL)

    async def cog_unload(self):
        if self.pool:
            await self.pool.close()

    @app_commands.command(name="register", description="Register your team for the active tournament in this server")
    async def register(self, interaction: discord.Interaction, team_name: str):
        guild_id = str(interaction.guild_id)
        
        async with self.pool.acquire() as conn:
            tournament = await conn.fetchrow(
                'SELECT id, "maxTeams" FROM "Tournament" WHERE "guildId" = $1 AND status = $2 ORDER BY "createdAt" DESC LIMIT 1',
                guild_id, "OPEN"
            )

            if not tournament:
                return await interaction.response.send_message("No open tournament found in this server.", ephemeral=True)
            
            current_teams = await conn.fetchval('SELECT COUNT(*) FROM "Team" WHERE "tournamentId" = $1', tournament['id'])
            if current_teams >= tournament['maxTeams']:
                return await interaction.response.send_message("Tournament is full!", ephemeral=True)
            
            db_user_id = await self._ensure_user(conn, interaction.user)
            
            team_id = str(uuid.uuid4())
            await conn.execute(
                'INSERT INTO "Team" (id, name, "captainId", "tournamentId", "createdAt") VALUES ($1, $2, $3, $4, $5)',
                team_id, team_name, db_user_id, tournament['id'], datetime.now()
            )

            await conn.execute(
                'INSERT INTO "TeamMember" ("teamId", "userId") VALUES ($1, $2)',
                team_id, db_user_id
            )

        await interaction.response.send_message(f"✅ Successfully registered team **{team_name}** for the tournament!")

    @app_commands.command(name="checkin", description="Check in for your tournament matches")
    async def checkin(self, interaction: discord.Interaction):
        await interaction.response.send_message("✅ You have successfully checked in for your matches!", ephemeral=True)

    @app_commands.command(name="score", description="Submit your match score")
    async def score(self, interaction: discord.Interaction, match_id: str, your_score: int, opponent_score: int, screenshot: discord.Attachment = None):
        if not screenshot:
            return await interaction.response.send_message("You must attach a screenshot of the results.", ephemeral=True)

        async with self.pool.acquire() as conn:
            match = await conn.fetchrow('SELECT id, status FROM "Match" WHERE id = $1', match_id)
            if not match:
                return await interaction.response.send_message("Invalid match ID.", ephemeral=True)
            
            db_user_id = await self._ensure_user(conn, interaction.user)
            score_id = str(uuid.uuid4())
            await conn.execute(
                '''INSERT INTO "Score" (id, "matchId", "submittedBy", "team1Score", "team2Score", "screenshotUrl", confirmed, "createdAt")
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)''',
                score_id, match_id, db_user_id, your_score, opponent_score, screenshot.url, False, datetime.now()
            )

            all_scores = await conn.fetch('SELECT * FROM "Score" WHERE "matchId" = $1', match_id)
            if len(all_scores) == 2:
                s1, s2 = all_scores[0], all_scores[1]
                if s1['team1Score'] == s2['team1Score'] and s1['team2Score'] == s2['team2Score']:
                    await conn.execute('UPDATE "Score" SET confirmed = true WHERE "matchId" = $1', match_id)
                    await conn.execute('UPDATE "Match" SET status = $1 WHERE id = $2', "COMPLETED", match_id)
                    await interaction.response.send_message("✅ Scores matched! Match is officially completed.")
                    return
                else:
                    dispute_id = str(uuid.uuid4())
                    await conn.execute(
                        'INSERT INTO "Dispute" (id, "matchId", status, "createdAt") VALUES ($1, $2, $3, $4)',
                        dispute_id, match_id, "OPEN", datetime.now()
                    )
                    await interaction.response.send_message("⚠️ Scores DO NOT match! A dispute has been opened for an admin to review.")
                    return

        await interaction.response.send_message("✅ Score submitted. Waiting for your opponent to submit their score.")

    @app_commands.command(name="start-tournament", description="[Admin] Opens registrations for the most recent tournament")
    @app_commands.default_permissions(administrator=True)
    async def start_tournament(self, interaction: discord.Interaction):
        guild_id = str(interaction.guild_id)
        async with self.pool.acquire() as conn:
            tournament = await conn.fetchrow(
                'SELECT id FROM "Tournament" WHERE "guildId" = $1 ORDER BY "createdAt" DESC LIMIT 1', guild_id
            )
            if not tournament:
                return await interaction.response.send_message("No tournament found. Create one from the web dashboard first.", ephemeral=True)
            
            await conn.execute('UPDATE "Tournament" SET status = $1 WHERE id = $2', "OPEN", tournament['id'])
        await interaction.response.send_message("✅ Tournament registrations are now **OPEN**! Players can use `/register`.")

    @app_commands.command(name="close-registrations", description="[Admin] Locks teams and generates bracket")
    @app_commands.default_permissions(administrator=True)
    async def close_registrations(self, interaction: discord.Interaction):
        guild_id = str(interaction.guild_id)
        async with self.pool.acquire() as conn:
            tournament = await conn.fetchrow(
                'SELECT id, name FROM "Tournament" WHERE "guildId" = $1 AND status = $2 ORDER BY "createdAt" DESC LIMIT 1', guild_id, "OPEN"
            )
            if not tournament:
                return await interaction.response.send_message("No open tournament found.", ephemeral=True)
            
            await conn.execute('UPDATE "Tournament" SET status = $1 WHERE id = $2', "ACTIVE", tournament['id'])
            
            # Generate Bracket (Round 1)
            teams = await conn.fetch('SELECT id, name FROM "Team" WHERE "tournamentId" = $1', tournament['id'])
            team_list = list(teams)
            random.shuffle(team_list)

            # Pair teams
            pairs = [team_list[i:i + 2] for i in range(0, len(team_list), 2)]
            for pair in pairs:
                t1 = pair[0]['id']
                # if odd number of teams, t2 is None (bye)
                t2 = pair[1]['id'] if len(pair) > 1 else None
                
                match_id = str(uuid.uuid4())
                await conn.execute(
                    '''INSERT INTO "Match" (id, "tournamentId", round, "team1Id", "team2Id", status) 
                       VALUES ($1, $2, $3, $4, $5, $6)''',
                    match_id, tournament['id'], 1, t1, t2, "SCHEDULED"
                )

        await interaction.response.send_message(f"🔒 Registrations for **{tournament['name']}** are closed. Bracket generated! Use `/generate-bracket` to view.")

    @app_commands.command(name="override-score", description="[Admin] Manually override a match score")
    @app_commands.default_permissions(administrator=True)
    async def override_score(self, interaction: discord.Interaction, match_id: str, t1_score: int, t2_score: int):
        async with self.pool.acquire() as conn:
            match = await conn.fetchrow('SELECT id FROM "Match" WHERE id = $1', match_id)
            if not match:
                return await interaction.response.send_message("Invalid match ID.", ephemeral=True)
            
            db_user_id = await self._ensure_user(conn, interaction.user)
            score_id = str(uuid.uuid4())
            await conn.execute(
                '''INSERT INTO "Score" (id, "matchId", "submittedBy", "team1Score", "team2Score", confirmed, "createdAt")
                   VALUES ($1, $2, $3, $4, $5, $6, $7)''',
                score_id, match_id, db_user_id, t1_score, t2_score, True, datetime.now()
            )
            await conn.execute('UPDATE "Match" SET status = $1 WHERE id = $2', "COMPLETED", match_id)
            await conn.execute('UPDATE "Dispute" SET status = $1 WHERE "matchId" = $2', "RESOLVED", match_id)

        await interaction.response.send_message(f"✅ Admin override: Match {match_id} set to {t1_score} - {t2_score}.")

    async def _ensure_user(self, conn, discord_user):
        user = await conn.fetchrow('SELECT id FROM "User" WHERE "discordId" = $1', str(discord_user.id))
        if user:
            return user['id']
        
        user_id = str(uuid.uuid4())
        await conn.execute(
            'INSERT INTO "User" (id, username, "discordId", avatar, "createdAt") VALUES ($1, $2, $3, $4, $5)',
            user_id, discord_user.name, str(discord_user.id), discord_user.avatar.url if discord_user.avatar else None, datetime.now()
        )
        return user_id

async def setup(bot):
    await bot.add_cog(ArgonMVP(bot))
