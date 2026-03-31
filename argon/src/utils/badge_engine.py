import asyncpg

PRISMA_DB_URL = "postgresql://postgres:affan%40805032@db.fwywdcoiudevrssihfuf.supabase.co:5432/postgres?schema=public"

# ─── Badge Definitions ───
BADGES = {
    "first_drop":   {"name": "First Drop",    "emoji": "🏆", "desc": "Played first tournament"},
    "booyah":       {"name": "Booyah!",       "emoji": "🐔", "desc": "Won a match (#1 placement)"},
    "champion":     {"name": "Champion",      "emoji": "👑", "desc": "Won a full tournament"},
    "dynasty":      {"name": "Dynasty",       "emoji": "🔥", "desc": "Won 3 tournaments"},
    "slayer":       {"name": "Slayer",         "emoji": "💀", "desc": "10+ kills in a single match"},
    "headhunter":   {"name": "Headhunter",    "emoji": "🎯", "desc": "50 total kills across platform"},
    "consistent":   {"name": "Consistent",    "emoji": "📈", "desc": "Top 5 in 5 consecutive matches"},
    "mvp":          {"name": "MVP",           "emoji": "🌟", "desc": "Received MVP award"},
    "early_adopter":{"name": "Early Adopter", "emoji": "⚡", "desc": "First 100 users on Ravonixx"},
    "linked_up":    {"name": "Linked Up",     "emoji": "🔗", "desc": "Connected Discord to profile"},
    "veteran":      {"name": "Veteran",       "emoji": "🏅", "desc": "10 tournaments played"},
}


async def _award_badge(conn, bot, user_id, discord_id, slug):
    """Award a badge if not already owned. DM the player."""
    badge_def = BADGES.get(slug)
    if not badge_def:
        return False

    # Check if already has badge
    existing = await conn.fetchrow(
        'SELECT id FROM "Badge" WHERE "userId" = $1 AND slug = $2',
        user_id, slug
    )
    if existing:
        return False

    import hashlib, time, datetime
    badge_id = hashlib.md5(f"{time.time()}{user_id}{slug}".encode()).hexdigest()[:25]

    await conn.execute(
        'INSERT INTO "Badge" (id, "userId", slug, name, emoji, "awardedAt") VALUES ($1, $2, $3, $4, $5, $6)',
        badge_id, user_id, slug, badge_def['name'], badge_def['emoji'], datetime.datetime.now()
    )

    # DM the player
    try:
        user = await bot.fetch_user(int(discord_id))
        await user.send(
            f"{badge_def['emoji']} You just earned the **{badge_def['name']}** badge on Ravonixx!\n"
            f"_{badge_def['desc']}_\n\n"
            f"View your profile: ravonixx.xyz/players/{discord_id}"
        )
    except:
        pass

    return True


async def check_and_award_badges(bot, tournament_id, standings):
    """
    Run after a tournament ends. Check all participants for badge eligibility.
    standings: list of dicts with teamId, team_name, totalPoints, totalKills, rank
    """
    pool = await asyncpg.create_pool(PRISMA_DB_URL)

    try:
        async with pool.acquire() as conn:
            # Get all team members for this tournament
            members = await conn.fetch('''
                SELECT tm."userId", u."discordId", u.username FROM "TeamMember" tm
                JOIN "Team" t ON tm."teamId" = t.id
                JOIN "User" u ON tm."userId" = u.id
                WHERE t."tournamentId" = $1
            ''', tournament_id)

            for member in members:
                uid = member['userId']
                did = member['discordId']

                # Get their aggregated stats
                stats = await conn.fetch('SELECT * FROM "PlayerStat" WHERE "userId" = $1', uid)
                total_tournaments = len(stats)
                total_kills = sum(s['totalKills'] for s in stats)
                total_booyahs = sum(s['booyahCount'] for s in stats)
                total_wins = sum(s['wins'] for s in stats)

                # First Drop — first tournament
                if total_tournaments >= 1:
                    await _award_badge(conn, bot, uid, did, "first_drop")

                # Veteran — 10 tournaments
                if total_tournaments >= 10:
                    await _award_badge(conn, bot, uid, did, "veteran")

                # Headhunter — 50 kills
                if total_kills >= 50:
                    await _award_badge(conn, bot, uid, did, "headhunter")

                # Booyah — any #1 placement
                if total_booyahs >= 1:
                    await _award_badge(conn, bot, uid, did, "booyah")

                # Dynasty — 3 tournament wins
                if total_wins >= 3:
                    await _award_badge(conn, bot, uid, did, "dynasty")

            # Champion badge — winning team members
            if standings and len(standings) > 0:
                winner_team_id = standings[0].get('teamId')
                if winner_team_id:
                    winner_members = await conn.fetch('''
                        SELECT tm."userId", u."discordId" FROM "TeamMember" tm
                        JOIN "User" u ON tm."userId" = u.id
                        WHERE tm."teamId" = $1
                    ''', winner_team_id)
                    for wm in winner_members:
                        await _award_badge(conn, bot, wm['userId'], wm['discordId'], "champion")

            # Check for Slayer badge — any entry with 10+ kills this tournament
            slayer_entries = await conn.fetch('''
                SELECT DISTINCT me."submittedBy" FROM "MatchEntry" me
                JOIN "Match" m ON me."matchId" = m.id
                WHERE m."tournamentId" = $1 AND me.kills >= 10
            ''', tournament_id)
            for se in slayer_entries:
                if se['submittedBy']:
                    user_row = await conn.fetchrow('SELECT id FROM "User" WHERE "discordId" = $1', se['submittedBy'])
                    if user_row:
                        await _award_badge(conn, bot, user_row['id'], se['submittedBy'], "slayer")

    finally:
        await pool.close()
