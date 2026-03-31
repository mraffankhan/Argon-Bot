import discord
from discord.ext import commands
from discord import app_commands
import asyncpg
import os
import uuid
from datetime import datetime

PRISMA_DB_URL = "postgresql://postgres:affan%40805032@db.fwywdcoiudevrssihfuf.supabase.co:5432/postgres?schema=public"

# ─── BR Placement Points Table ───
PLACEMENT_POINTS = {
    1: 10, 2: 6, 3: 5, 4: 4, 5: 3,
    6: 2, 7: 2, 8: 2, 9: 2, 10: 2,
    11: 1, 12: 1, 13: 1, 14: 1, 15: 1
}

def get_placement_pts(placement: int) -> int:
    return PLACEMENT_POINTS.get(placement, 0)


def generate_id():
    import hashlib, time
    return hashlib.md5(f"{time.time()}{uuid.uuid4()}".encode()).hexdigest()[:25]


class ArgonMVP(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self.pool = None

    async def cog_load(self):
        self.pool = await asyncpg.create_pool(PRISMA_DB_URL)

    async def cog_unload(self):
        if self.pool:
            await self.pool.close()

    # ─── HELPER: Get active tournament in guild ───
    async def _get_tournament(self, conn, guild_id, status=None):
        if status:
            return await conn.fetchrow(
                'SELECT * FROM "Tournament" WHERE "guildId" = $1 AND status = $2 ORDER BY "createdAt" DESC LIMIT 1',
                guild_id, status
            )
        return await conn.fetchrow(
            'SELECT * FROM "Tournament" WHERE "guildId" = $1 AND status IN ($2, $3) ORDER BY "createdAt" DESC LIMIT 1',
            guild_id, "OPEN", "ACTIVE"
        )

    # ─── HELPER: Get user's team in tournament ───
    async def _get_user_team(self, conn, user_db_id, tournament_id):
        return await conn.fetchrow(
            'SELECT t.* FROM "Team" t WHERE t."captainId" = $1 AND t."tournamentId" = $2',
            user_db_id, tournament_id
        )

    # ─── HELPER: Ensure user exists ───
    async def _ensure_user(self, conn, discord_user):
        user = await conn.fetchrow('SELECT id FROM "User" WHERE "discordId" = $1', str(discord_user.id))
        if user:
            return user['id']
        user_id = str(uuid.uuid4())
        now = datetime.now()
        await conn.execute(
            'INSERT INTO "User" (id, username, "discordId", avatar, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6)',
            user_id, discord_user.name, str(discord_user.id), 
            discord_user.avatar.url if discord_user.avatar else None, now, now
        )
        return user_id

    # ════════════════════════════════════════════════
    # PLAYER COMMANDS
    # ════════════════════════════════════════════════

    @app_commands.command(name="register", description="Register your team for the active tournament")
    async def register(self, interaction: discord.Interaction, team_name: str):
        guild_id = str(interaction.guild_id)
        async with self.pool.acquire() as conn:
            tournament = await self._get_tournament(conn, guild_id, "OPEN")
            if not tournament:
                return await interaction.response.send_message("❌ No open tournament found in this server.", ephemeral=True)
            
            current_teams = await conn.fetchval('SELECT COUNT(*) FROM "Team" WHERE "tournamentId" = $1', tournament['id'])
            if current_teams >= tournament['maxTeams']:
                return await interaction.response.send_message("❌ Tournament is full!", ephemeral=True)
            
            db_user_id = await self._ensure_user(conn, interaction.user)
            
            # Check if already registered
            existing = await self._get_user_team(conn, db_user_id, tournament['id'])
            if existing:
                return await interaction.response.send_message("❌ You already have a team registered.", ephemeral=True)

            team_id = str(uuid.uuid4())
            await conn.execute(
                'INSERT INTO "Team" (id, name, "captainId", "tournamentId", "createdAt") VALUES ($1, $2, $3, $4, $5)',
                team_id, team_name, db_user_id, tournament['id'], datetime.now()
            )
            await conn.execute('INSERT INTO "TeamMember" ("teamId", "userId") VALUES ($1, $2)', team_id, db_user_id)
            
            # Create initial standing
            standing_id = generate_id()
            await conn.execute(
                'INSERT INTO "TournamentStanding" (id, "tournamentId", "teamId") VALUES ($1, $2, $3)',
                standing_id, tournament['id'], team_id
            )

        await interaction.response.send_message(f"✅ Team **{team_name}** registered for **{tournament['name']}**!")

    @app_commands.command(name="checkin", description="Check in for your tournament")
    async def checkin(self, interaction: discord.Interaction):
        await interaction.response.send_message("✅ You're checked in! Good luck out there 🎮", ephemeral=True)

    @app_commands.command(name="score", description="Submit your BR match result (placement + kills)")
    @app_commands.describe(
        placement="Your team's final placement (1-25)",
        kills="Total team kills this match",
        screenshot="Screenshot proof of results (required)"
    )
    async def score(self, interaction: discord.Interaction, placement: int, kills: int, screenshot: discord.Attachment):
        if placement < 1 or placement > 25:
            return await interaction.response.send_message("❌ Placement must be between 1-25.", ephemeral=True)
        if kills < 0 or kills > 99:
            return await interaction.response.send_message("❌ Kills must be between 0-99.", ephemeral=True)
        if not screenshot.content_type or not screenshot.content_type.startswith("image"):
            return await interaction.response.send_message("❌ You must attach a screenshot image.", ephemeral=True)

        guild_id = str(interaction.guild_id)
        await interaction.response.defer()

        async with self.pool.acquire() as conn:
            tournament = await self._get_tournament(conn, guild_id, "ACTIVE")
            if not tournament:
                return await interaction.followup.send("❌ No active tournament found.", ephemeral=True)

            # Find current LIVE match
            match = await conn.fetchrow(
                'SELECT * FROM "Match" WHERE "tournamentId" = $1 AND status = $2 ORDER BY "matchNumber" ASC LIMIT 1',
                tournament['id'], "LIVE"
            )
            if not match:
                return await interaction.followup.send("❌ No live match right now. Wait for the organizer to start a match.", ephemeral=True)

            db_user_id = await self._ensure_user(conn, interaction.user)
            team = await self._get_user_team(conn, db_user_id, tournament['id'])
            if not team:
                return await interaction.followup.send("❌ You don't have a registered team.", ephemeral=True)

            # Check if already submitted
            existing_entry = await conn.fetchrow(
                'SELECT id FROM "MatchEntry" WHERE "matchId" = $1 AND "teamId" = $2',
                match['id'], team['id']
            )
            if existing_entry:
                return await interaction.followup.send(f"❌ You already submitted for Match #{match['matchNumber']}.", ephemeral=True)

            # Calculate points
            placement_pts = get_placement_pts(placement)
            kill_pts = kills * match['killMultiplier']
            total_pts = placement_pts + kill_pts

            entry_id = generate_id()
            await conn.execute(
                '''INSERT INTO "MatchEntry" (id, "matchId", "teamId", placement, kills, "placementPts", "killPts", "totalPts", "screenshotUrl", "submittedBy", status, "createdAt")
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)''',
                entry_id, match['id'], team['id'], placement, kills, placement_pts, kill_pts, total_pts,
                screenshot.url, str(interaction.user.id), "PENDING", datetime.now()
            )

            # Count submissions
            total_teams = await conn.fetchval('SELECT COUNT(*) FROM "Team" WHERE "tournamentId" = $1', tournament['id'])
            submitted = await conn.fetchval('SELECT COUNT(*) FROM "MatchEntry" WHERE "matchId" = $1', match['id'])

            # Fire event
            self.bot.dispatch("score_submitted", {
                "team_name": team['name'], "match_number": match['matchNumber'],
                "placement": placement, "kills": kills, "total_pts": total_pts,
                "submitted": submitted, "total_teams": total_teams
            }, interaction.guild_id)

            # Check if all teams submitted
            if submitted >= total_teams:
                self.bot.dispatch("match_ready_to_close", {
                    "match_number": match['matchNumber']
                }, interaction.guild_id)

        booyah = "🏆" if placement == 1 else ""
        await interaction.followup.send(
            f"✅ Score submitted for Match #{match['matchNumber']}!\n"
            f"📍 Placement: **#{placement}** ({placement_pts}pts) | 💀 Kills: **{kills}** ({kill_pts}pts)\n"
            f"🔢 Total: **{total_pts} points** {booyah}\n"
            f"📊 {submitted}/{total_teams} teams submitted"
        )

    @app_commands.command(name="mystats", description="View your BR tournament stats")
    async def mystats(self, interaction: discord.Interaction):
        user_discord_id = str(interaction.user.id)
        async with self.pool.acquire() as conn:
            user_row = await conn.fetchrow('SELECT id FROM "User" WHERE "discordId" = $1', user_discord_id)
            if not user_row:
                return await interaction.response.send_message("❌ No stats found. Register for a tournament first!", ephemeral=True)
            
            stats = await conn.fetch('SELECT * FROM "PlayerStat" WHERE "userId" = $1', user_row['id'])
            
            total_tournaments = len(stats)
            total_kills = sum(s['totalKills'] for s in stats)
            booyah_count = sum(s['booyahCount'] for s in stats)
            total_mvps = sum(s['mvpCount'] for s in stats)
            total_wins = sum(s['wins'] for s in stats)
            
            # Get best and avg placement
            best_placements = [s['bestPlacement'] for s in stats if s['bestPlacement'] is not None]
            best_placement = min(best_placements) if best_placements else "N/A"
            avg_placements = [s['avgPlacement'] for s in stats if s['avgPlacement'] > 0]
            avg_placement = round(sum(avg_placements) / len(avg_placements), 1) if avg_placements else "N/A"

        embed = discord.Embed(
            title=f"🏆 {interaction.user.display_name}'s BR Stats",
            color=discord.Color.from_rgb(171, 72, 209)
        )
        if interaction.user.avatar:
            embed.set_thumbnail(url=interaction.user.avatar.url)
        
        embed.add_field(name="🎮 Tournaments", value=str(total_tournaments), inline=True)
        embed.add_field(name="💀 Total Kills", value=str(total_kills), inline=True)
        embed.add_field(name="🏆 Booyahs", value=str(booyah_count), inline=True)
        embed.add_field(name="📍 Best Placement", value=f"#{best_placement}", inline=True)
        embed.add_field(name="📊 Avg Placement", value=f"#{avg_placement}", inline=True)
        embed.add_field(name="🌟 MVPs", value=str(total_mvps), inline=True)
        embed.add_field(name="🏅 Tournament Wins", value=str(total_wins), inline=True)
        embed.set_footer(text="View full profile → ravonixx.xyz/players/" + user_discord_id)

        await interaction.response.send_message(embed=embed)

    # ════════════════════════════════════════════════
    # ORGANIZER COMMANDS
    # ════════════════════════════════════════════════

    @app_commands.command(name="start-tournament", description="[Admin] Open registrations for the latest tournament")
    @app_commands.default_permissions(administrator=True)
    async def start_tournament(self, interaction: discord.Interaction):
        guild_id = str(interaction.guild_id)
        async with self.pool.acquire() as conn:
            tournament = await conn.fetchrow(
                'SELECT * FROM "Tournament" WHERE "guildId" = $1 ORDER BY "createdAt" DESC LIMIT 1', guild_id
            )
            if not tournament:
                return await interaction.response.send_message("❌ No tournament found. Create one from the web dashboard.", ephemeral=True)
            
            await conn.execute('UPDATE "Tournament" SET status = $1 WHERE id = $2', "OPEN", tournament['id'])
            self.bot.dispatch("tournament_started", dict(tournament), interaction.guild_id)
        await interaction.response.send_message(f"✅ **{tournament['name']}** registrations are now **OPEN**! Players use `/register`.")

    @app_commands.command(name="close-registrations", description="[Admin] Lock teams and schedule Match 1")
    @app_commands.default_permissions(administrator=True)
    async def close_registrations(self, interaction: discord.Interaction):
        guild_id = str(interaction.guild_id)
        async with self.pool.acquire() as conn:
            tournament = await self._get_tournament(conn, guild_id, "OPEN")
            if not tournament:
                return await interaction.response.send_message("❌ No open tournament found.", ephemeral=True)
            
            await conn.execute('UPDATE "Tournament" SET status = $1 WHERE id = $2', "ACTIVE", tournament['id'])
            
            teams = await conn.fetch('SELECT * FROM "Team" WHERE "tournamentId" = $1', tournament['id'])
            team_list = [dict(t) for t in teams]

            # Create Match #1 as SCHEDULED
            match_id = generate_id()
            await conn.execute(
                'INSERT INTO "Match" (id, "tournamentId", "matchNumber", status) VALUES ($1, $2, $3, $4)',
                match_id, tournament['id'], 1, "SCHEDULED"
            )

            self.bot.dispatch("tournament_closed", dict(tournament), team_list, interaction.guild_id)

        await interaction.response.send_message(
            f"🔒 Registrations for **{tournament['name']}** are closed!\n"
            f"📋 {len(team_list)} teams locked in.\n"
            f"🎮 Match #1 is scheduled. Use `/start-match 1` when ready."
        )

    @app_commands.command(name="create-lobby", description="[Admin] Create a match lobby")
    @app_commands.default_permissions(administrator=True)
    async def create_lobby(self, interaction: discord.Interaction, match_number: int, lobby_name: str = None):
        guild_id = str(interaction.guild_id)
        async with self.pool.acquire() as conn:
            tournament = await self._get_tournament(conn, guild_id, "ACTIVE")
            if not tournament:
                return await interaction.response.send_message("❌ No active tournament.", ephemeral=True)

            # Check if match already exists
            existing = await conn.fetchrow(
                'SELECT id FROM "Match" WHERE "tournamentId" = $1 AND "matchNumber" = $2',
                tournament['id'], match_number
            )
            if existing:
                return await interaction.response.send_message(f"❌ Match #{match_number} already exists.", ephemeral=True)

            match_id = generate_id()
            await conn.execute(
                'INSERT INTO "Match" (id, "tournamentId", "matchNumber", "lobbyName", status) VALUES ($1, $2, $3, $4, $5)',
                match_id, tournament['id'], match_number, lobby_name, "SCHEDULED"
            )

        lobby_str = f" **{lobby_name}**" if lobby_name else ""
        await interaction.response.send_message(f"✅ Match #{match_number}{lobby_str} created and scheduled.")

    @app_commands.command(name="start-match", description="[Admin] Set a match to LIVE")
    @app_commands.default_permissions(administrator=True)
    async def start_match(self, interaction: discord.Interaction, match_number: int):
        guild_id = str(interaction.guild_id)
        await interaction.response.defer()

        async with self.pool.acquire() as conn:
            tournament = await self._get_tournament(conn, guild_id, "ACTIVE")
            if not tournament:
                return await interaction.followup.send("❌ No active tournament.", ephemeral=True)

            match = await conn.fetchrow(
                'SELECT * FROM "Match" WHERE "tournamentId" = $1 AND "matchNumber" = $2',
                tournament['id'], match_number
            )
            if not match:
                return await interaction.followup.send(f"❌ Match #{match_number} not found.", ephemeral=True)

            await conn.execute('UPDATE "Match" SET status = $1 WHERE id = $2', "LIVE", match['id'])

            # DM all team captains
            teams = await conn.fetch('''
                SELECT t.name, u."discordId" FROM "Team" t
                JOIN "User" u ON t."captainId" = u.id
                WHERE t."tournamentId" = $1
            ''', tournament['id'])
            
            for team in teams:
                try:
                    user = await self.bot.fetch_user(int(team['discordId']))
                    await user.send(
                        f"🎮 **Match #{match_number}** is now **LIVE**!\n\n"
                        f"Submit your result with:\n`/score [placement] [kills]` + attach screenshot\n\n"
                        f"Good luck, **{team['name']}**! 🔥"
                    )
                except:
                    pass

        self.bot.dispatch("match_started", {"match_number": match_number, "tournament_name": tournament['name']}, interaction.guild_id)
        await interaction.followup.send(f"🔴 **Match #{match_number}** is now **LIVE**! All captains have been DM'd.")

    @app_commands.command(name="close-match", description="[Admin] Close a match, calculate standings")
    @app_commands.default_permissions(administrator=True)
    async def close_match(self, interaction: discord.Interaction, match_number: int):
        guild_id = str(interaction.guild_id)
        await interaction.response.defer()

        async with self.pool.acquire() as conn:
            tournament = await self._get_tournament(conn, guild_id, "ACTIVE")
            if not tournament:
                return await interaction.followup.send("❌ No active tournament.", ephemeral=True)

            match = await conn.fetchrow(
                'SELECT * FROM "Match" WHERE "tournamentId" = $1 AND "matchNumber" = $2',
                tournament['id'], match_number
            )
            if not match:
                return await interaction.followup.send(f"❌ Match #{match_number} not found.", ephemeral=True)

            # Complete the match
            await conn.execute(
                'UPDATE "Match" SET status = $1, "completedAt" = $2 WHERE id = $3',
                "COMPLETED", datetime.now(), match['id']
            )

            # Auto-verify all PENDING entries
            await conn.execute(
                'UPDATE "MatchEntry" SET status = $1 WHERE "matchId" = $2 AND status = $3',
                "VERIFIED", match['id'], "PENDING"
            )

            # Update standings for each team's entry
            entries = await conn.fetch(
                'SELECT * FROM "MatchEntry" WHERE "matchId" = $1 AND status = $2',
                match['id'], "VERIFIED"
            )

            for entry in entries:
                total = entry['totalPts'] or 0
                kills = entry['kills'] or 0
                await conn.execute('''
                    UPDATE "TournamentStanding" 
                    SET "totalPoints" = "totalPoints" + $1,
                        "totalKills" = "totalKills" + $2,
                        "totalMatches" = "totalMatches" + 1,
                        "bestMatch" = GREATEST("bestMatch", $1)
                    WHERE "tournamentId" = $3 AND "teamId" = $4
                ''', total, kills, tournament['id'], entry['teamId'])

            # Recalculate ranks
            standings = await conn.fetch(
                'SELECT id, "totalPoints" FROM "TournamentStanding" WHERE "tournamentId" = $1 ORDER BY "totalPoints" DESC',
                tournament['id']
            )
            for rank, s in enumerate(standings, 1):
                await conn.execute('UPDATE "TournamentStanding" SET rank = $1 WHERE id = $2', rank, s['id'])

            # Get updated standings for event
            final_standings = await conn.fetch('''
                SELECT ts.*, t.name as team_name FROM "TournamentStanding" ts
                JOIN "Team" t ON ts."teamId" = t.id
                WHERE ts."tournamentId" = $1 ORDER BY ts.rank ASC
            ''', tournament['id'])

            standings_data = [dict(s) for s in final_standings]

            # Count completed matches
            completed = await conn.fetchval(
                'SELECT COUNT(*) FROM "Match" WHERE "tournamentId" = $1 AND status = $2',
                tournament['id'], "COMPLETED"
            )

            self.bot.dispatch("match_completed", {
                "match_number": match_number,
                "tournament_name": tournament['name'],
                "tournament_id": tournament['id'],
                "standings": standings_data,
                "completed_matches": completed,
                "total_matches": tournament['totalMatches']
            }, interaction.guild_id)

            # Check if this was the last match
            if completed >= tournament['totalMatches']:
                await conn.execute('UPDATE "Tournament" SET status = $1 WHERE id = $2', "COMPLETED", tournament['id'])
                self.bot.dispatch("tournament_end", {
                    "tournament_name": tournament['name'],
                    "tournament_id": tournament['id'],
                    "standings": standings_data,
                    "game": tournament['game'],
                    "prize": tournament['prize']
                }, interaction.guild_id)

        await interaction.followup.send(
            f"✅ Match #{match_number} is **COMPLETED**!\n"
            f"📊 Standings recalculated. Use `/standings` to view."
        )

    @app_commands.command(name="next-match", description="[Admin] Close current match & start the next one")
    @app_commands.default_permissions(administrator=True)
    async def next_match(self, interaction: discord.Interaction):
        guild_id = str(interaction.guild_id)
        await interaction.response.defer()

        async with self.pool.acquire() as conn:
            tournament = await self._get_tournament(conn, guild_id, "ACTIVE")
            if not tournament:
                return await interaction.followup.send("❌ No active tournament.", ephemeral=True)

            # Find current live match
            live_match = await conn.fetchrow(
                'SELECT * FROM "Match" WHERE "tournamentId" = $1 AND status = $2',
                tournament['id'], "LIVE"
            )
            
            if live_match:
                # Close it (reuse close_match logic inline)
                await conn.execute(
                    'UPDATE "Match" SET status = $1, "completedAt" = $2 WHERE id = $3',
                    "COMPLETED", datetime.now(), live_match['id']
                )
                await conn.execute(
                    'UPDATE "MatchEntry" SET status = $1 WHERE "matchId" = $2 AND status = $3',
                    "VERIFIED", live_match['id'], "PENDING"
                )
                entries = await conn.fetch('SELECT * FROM "MatchEntry" WHERE "matchId" = $1 AND status = $2', live_match['id'], "VERIFIED")
                for entry in entries:
                    total = entry['totalPts'] or 0
                    kills = entry['kills'] or 0
                    await conn.execute('''
                        UPDATE "TournamentStanding" 
                        SET "totalPoints" = "totalPoints" + $1, "totalKills" = "totalKills" + $2,
                            "totalMatches" = "totalMatches" + 1, "bestMatch" = GREATEST("bestMatch", $1)
                        WHERE "tournamentId" = $3 AND "teamId" = $4
                    ''', total, kills, tournament['id'], entry['teamId'])
                
                # Recalculate ranks
                standings = await conn.fetch(
                    'SELECT id, "totalPoints" FROM "TournamentStanding" WHERE "tournamentId" = $1 ORDER BY "totalPoints" DESC',
                    tournament['id']
                )
                for rank, s in enumerate(standings, 1):
                    await conn.execute('UPDATE "TournamentStanding" SET rank = $1 WHERE id = $2', rank, s['id'])

                current_num = live_match['matchNumber']
            else:
                # Get the last completed match number
                last = await conn.fetchrow(
                    'SELECT "matchNumber" FROM "Match" WHERE "tournamentId" = $1 ORDER BY "matchNumber" DESC LIMIT 1',
                    tournament['id']
                )
                current_num = last['matchNumber'] if last else 0

            next_num = current_num + 1

            # Create and start next match
            next_match_row = await conn.fetchrow(
                'SELECT id FROM "Match" WHERE "tournamentId" = $1 AND "matchNumber" = $2',
                tournament['id'], next_num
            )
            if not next_match_row:
                match_id = generate_id()
                await conn.execute(
                    'INSERT INTO "Match" (id, "tournamentId", "matchNumber", status) VALUES ($1, $2, $3, $4)',
                    match_id, tournament['id'], next_num, "LIVE"
                )
            else:
                await conn.execute('UPDATE "Match" SET status = $1 WHERE id = $2', "LIVE", next_match_row['id'])

        await interaction.followup.send(
            f"✅ Match #{current_num} closed → Match #{next_num} is now **LIVE**!\n"
            f"All captains: use `/score [placement] [kills]` + screenshot."
        )

    @app_commands.command(name="standings", description="View current tournament standings")
    async def standings(self, interaction: discord.Interaction):
        guild_id = str(interaction.guild_id)
        async with self.pool.acquire() as conn:
            tournament = await conn.fetchrow(
                'SELECT * FROM "Tournament" WHERE "guildId" = $1 AND status IN ($2, $3) ORDER BY "createdAt" DESC LIMIT 1',
                guild_id, "ACTIVE", "COMPLETED"
            )
            if not tournament:
                return await interaction.response.send_message("❌ No active tournament.", ephemeral=True)

            standings = await conn.fetch('''
                SELECT ts.*, t.name as team_name FROM "TournamentStanding" ts
                JOIN "Team" t ON ts."teamId" = t.id
                WHERE ts."tournamentId" = $1 ORDER BY ts.rank ASC NULLS LAST
            ''', tournament['id'])

            completed = await conn.fetchval(
                'SELECT COUNT(*) FROM "Match" WHERE "tournamentId" = $1 AND status = $2',
                tournament['id'], "COMPLETED"
            )

        if not standings:
            return await interaction.response.send_message("📊 No standings yet.", ephemeral=True)

        # Build table
        lines = []
        medals = {1: "🥇", 2: "🥈", 3: "🥉"}
        for s in standings:
            rank = s['rank'] or "-"
            medal = medals.get(s['rank'], f"#{rank}")
            lines.append(f"{medal} **{s['team_name']}** — {s['totalPoints']}pts | {s['totalKills']}💀")

        embed = discord.Embed(
            title=f"🏆 {tournament['name']} — Standings",
            description="\n".join(lines),
            color=discord.Color.gold()
        )
        embed.set_footer(text=f"Match {completed}/{tournament['totalMatches']} Complete • ravonixx.xyz/tournaments/{tournament['id']}")
        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="override-entry", description="[Admin] Manually set a team's match entry")
    @app_commands.default_permissions(administrator=True)
    async def override_entry(self, interaction: discord.Interaction, match_number: int, team_name: str, placement: int, kills: int):
        guild_id = str(interaction.guild_id)
        await interaction.response.defer()

        async with self.pool.acquire() as conn:
            tournament = await self._get_tournament(conn, guild_id, "ACTIVE")
            if not tournament:
                return await interaction.followup.send("❌ No active tournament.", ephemeral=True)

            match = await conn.fetchrow(
                'SELECT * FROM "Match" WHERE "tournamentId" = $1 AND "matchNumber" = $2',
                tournament['id'], match_number
            )
            if not match:
                return await interaction.followup.send(f"❌ Match #{match_number} not found.", ephemeral=True)

            team = await conn.fetchrow(
                'SELECT * FROM "Team" WHERE "tournamentId" = $1 AND LOWER(name) = LOWER($2)',
                tournament['id'], team_name
            )
            if not team:
                return await interaction.followup.send(f"❌ Team **{team_name}** not found.", ephemeral=True)

            placement_pts = get_placement_pts(placement)
            kill_pts = kills * match['killMultiplier']
            total_pts = placement_pts + kill_pts

            # Upsert the entry
            existing = await conn.fetchrow(
                'SELECT id FROM "MatchEntry" WHERE "matchId" = $1 AND "teamId" = $2',
                match['id'], team['id']
            )

            admin_id = str(interaction.user.id)
            if existing:
                await conn.execute('''
                    UPDATE "MatchEntry" SET placement = $1, kills = $2, "placementPts" = $3,
                    "killPts" = $4, "totalPts" = $5, "verifiedBy" = $6, status = $7
                    WHERE id = $8
                ''', placement, kills, placement_pts, kill_pts, total_pts, admin_id, "VERIFIED", existing['id'])
            else:
                entry_id = generate_id()
                await conn.execute('''
                    INSERT INTO "MatchEntry" (id, "matchId", "teamId", placement, kills, "placementPts", "killPts", "totalPts", "submittedBy", "verifiedBy", status, "createdAt")
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                ''', entry_id, match['id'], team['id'], placement, kills, placement_pts, kill_pts, total_pts, admin_id, admin_id, "VERIFIED", datetime.now())

        await interaction.followup.send(
            f"✅ Admin override for **{team_name}** in Match #{match_number}:\n"
            f"📍 #{placement} ({placement_pts}pts) | 💀 {kills} kills ({kill_pts}pts) | Total: **{total_pts}pts**"
        )

    @app_commands.command(name="leaderboard", description="View top 5 players on the platform")
    async def leaderboard_cmd(self, interaction: discord.Interaction):
        async with self.pool.acquire() as conn:
            rows = await conn.fetch('''
                SELECT u.username, u."discordId",
                       COALESCE(SUM(ps."totalKills"), 0) as kills,
                       COALESCE(SUM(ps."booyahCount"), 0) as booyahs,
                       COUNT(ps."tournamentId") as tournaments
                FROM "PlayerStat" ps
                JOIN "User" u ON ps."userId" = u.id
                GROUP BY u.id
                ORDER BY kills DESC
                LIMIT 5
            ''')

        if not rows:
            return await interaction.response.send_message("📊 No player data yet.", ephemeral=True)

        lines = []
        medals = {0: "🥇", 1: "🥈", 2: "🥉"}
        for i, r in enumerate(rows):
            medal = medals.get(i, f"#{i+1}")
            lines.append(f"{medal} **{r['username']}** — {r['kills']}💀 | {r['booyahs']}🏆 | {r['tournaments']} tourneys")

        embed = discord.Embed(
            title="🏆 Ravonixx Leaderboard — Top 5",
            description="\n".join(lines),
            color=discord.Color.gold()
        )
        embed.set_footer(text="Full leaderboard → ravonixx.xyz/leaderboard")
        await interaction.response.send_message(embed=embed)

async def setup(bot):
    await bot.add_cog(ArgonMVP(bot))
