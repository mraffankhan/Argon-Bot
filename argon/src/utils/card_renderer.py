import io
from PIL import Image, ImageDraw, ImageFont


def _get_fonts():
    """Try to load proper fonts, fallback to defaults."""
    try:
        title = ImageFont.truetype("arial.ttf", 36)
        header = ImageFont.truetype("arial.ttf", 24)
        body = ImageFont.truetype("arial.ttf", 18)
        small = ImageFont.truetype("arial.ttf", 14)
    except:
        title = ImageFont.load_default()
        header = title
        body = title
        small = title
    return title, header, body, small


# ═══════════════════════════════════════════════════════
# CARD 1: Match Result Card (1200×675)
# ═══════════════════════════════════════════════════════
def render_match_result_card(entries, tournament_name, match_number):
    """
    entries: list of dicts with keys: team_name, placement, kills, totalPts
    """
    W, H = 1200, 675
    img = Image.new('RGB', (W, H), color=(10, 10, 18))
    draw = ImageDraw.Draw(img)
    title_f, header_f, body_f, small_f = _get_fonts()

    # Gradient accent bar at top
    for y in range(6):
        draw.line([(0, y), (W, y)], fill=(171, 72, 209))

    # Header
    draw.text((W // 2, 50), f"MATCH #{match_number} RESULTS", fill=(255, 255, 255), font=title_f, anchor="mm")
    draw.text((W // 2, 85), tournament_name, fill=(171, 72, 209), font=small_f, anchor="mm")

    # Column headers
    y_start = 120
    cols = [60, 320, 520, 670, 850]
    headers = ["RANK", "TEAM", "PLACEMENT", "KILLS", "POINTS"]
    for i, h in enumerate(headers):
        draw.text((cols[i], y_start), h, fill=(120, 120, 140), font=small_f)

    draw.line([(40, y_start + 25), (W - 40, y_start + 25)], fill=(40, 40, 60), width=1)

    # Sort entries by totalPts desc
    sorted_entries = sorted(entries, key=lambda x: x.get('totalPts', 0) or 0, reverse=True)

    row_height = 35
    for i, entry in enumerate(sorted_entries[:14]):
        y = y_start + 40 + i * row_height
        rank = i + 1

        # Highlight top 3
        if rank == 1:
            row_color = (255, 215, 0)   # Gold
        elif rank == 2:
            row_color = (192, 192, 192) # Silver
        elif rank == 3:
            row_color = (205, 127, 50)  # Bronze
        else:
            row_color = (200, 200, 210)

        draw.text((cols[0], y), f"#{rank}", fill=row_color, font=body_f)
        draw.text((cols[1], y), str(entry.get('team_name', 'Unknown'))[:20], fill=row_color, font=body_f)
        draw.text((cols[2], y), f"#{entry.get('placement', '?')}", fill=(180, 180, 200), font=body_f)
        draw.text((cols[3], y), str(entry.get('kills', 0)), fill=(180, 180, 200), font=body_f)
        draw.text((cols[4], y), str(entry.get('totalPts', 0)), fill=row_color, font=body_f)

    # Footer
    draw.text((W // 2, H - 30), "ravonixx.xyz • Powered by Argon", fill=(80, 80, 100), font=small_f, anchor="mm")

    buf = io.BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    return buf


# ═══════════════════════════════════════════════════════
# CARD 2: Champion Card (1080×1080)
# ═══════════════════════════════════════════════════════
def render_champion_card(winner, tournament_name, game, prize):
    """
    winner: dict with team_name, totalPoints, totalKills
    """
    W, H = 1080, 1080
    img = Image.new('RGB', (W, H), color=(8, 8, 16))
    draw = ImageDraw.Draw(img)
    title_f, header_f, body_f, small_f = _get_fonts()

    # Top accent
    for y in range(8):
        draw.line([(0, y), (W, y)], fill=(255, 215, 0))

    # "CHAMPION" text
    try:
        champ_font = ImageFont.truetype("arial.ttf", 72)
    except:
        champ_font = title_f

    draw.text((W // 2, 200), "🏆", fill=(255, 215, 0), font=champ_font, anchor="mm")
    draw.text((W // 2, 310), "CHAMPION", fill=(255, 215, 0), font=champ_font, anchor="mm")

    # Team name
    team_name = winner.get('team_name', 'Unknown') if winner else 'Unknown'
    draw.text((W // 2, 430), team_name.upper(), fill=(255, 255, 255), font=title_f, anchor="mm")

    # Divider
    draw.line([(W // 4, 490), (3 * W // 4, 490)], fill=(255, 215, 0), width=2)

    # Stats
    stats_y = 540
    total_pts = winner.get('totalPoints', 0) if winner else 0
    total_kills = winner.get('totalKills', 0) if winner else 0

    draw.text((W // 2, stats_y), f"Total Points: {total_pts}", fill=(200, 200, 220), font=header_f, anchor="mm")
    draw.text((W // 2, stats_y + 45), f"Total Kills: {total_kills} 💀", fill=(200, 200, 220), font=header_f, anchor="mm")

    # Tournament info
    draw.text((W // 2, 700), tournament_name, fill=(171, 72, 209), font=header_f, anchor="mm")
    if game:
        draw.text((W // 2, 740), game, fill=(120, 120, 150), font=body_f, anchor="mm")
    if prize:
        draw.text((W // 2, 790), f"Prize Pool: {prize}", fill=(255, 215, 0), font=body_f, anchor="mm")

    # Bottom accent
    for y in range(H - 8, H):
        draw.line([(0, y), (W, y)], fill=(255, 215, 0))

    # Branding
    draw.text((W // 2, H - 40), "ravonixx.xyz", fill=(80, 80, 100), font=small_f, anchor="mm")

    buf = io.BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    return buf


# ═══════════════════════════════════════════════════════
# CARD 3: Standings Card (1080×1350 portrait)
# ═══════════════════════════════════════════════════════
def render_standings_card(standings, tournament_name, completed_matches, total_matches):
    """
    standings: list of dicts with team_name, totalPoints, totalKills, totalMatches, rank
    """
    W, H = 1080, 1350
    img = Image.new('RGB', (W, H), color=(10, 10, 18))
    draw = ImageDraw.Draw(img)
    title_f, header_f, body_f, small_f = _get_fonts()

    # Accent
    for y in range(6):
        draw.line([(0, y), (W, y)], fill=(171, 72, 209))

    # Header
    draw.text((W // 2, 50), "LIVE STANDINGS", fill=(255, 255, 255), font=title_f, anchor="mm")
    draw.text((W // 2, 90), tournament_name, fill=(171, 72, 209), font=small_f, anchor="mm")
    draw.text((W // 2, 115), f"Match {completed_matches}/{total_matches} Complete", fill=(120, 120, 150), font=small_f, anchor="mm")

    # Table headers
    y_start = 160
    cols = [50, 100, 400, 600, 780, 920]
    headers = ["#", "TEAM", "TOTAL PTS", "KILLS", "MATCHES", "BEST"]
    for i, h in enumerate(headers):
        draw.text((cols[i], y_start), h, fill=(100, 100, 120), font=small_f)

    draw.line([(30, y_start + 25), (W - 30, y_start + 25)], fill=(30, 30, 50), width=1)

    row_height = 42
    for i, s in enumerate(standings[:25]):
        y = y_start + 40 + i * row_height
        rank = s.get('rank', i + 1)

        if rank == 1:
            row_color = (255, 215, 0)
        elif rank == 2:
            row_color = (192, 192, 192)
        elif rank == 3:
            row_color = (205, 127, 50)
        else:
            row_color = (180, 180, 200)

        draw.text((cols[0], y), str(rank), fill=row_color, font=body_f)
        draw.text((cols[1], y), str(s.get('team_name', '?'))[:22], fill=row_color, font=body_f)
        draw.text((cols[2], y), str(s.get('totalPoints', 0)), fill=row_color, font=body_f)
        draw.text((cols[3], y), str(s.get('totalKills', 0)), fill=(180, 180, 200), font=body_f)
        draw.text((cols[4], y), str(s.get('totalMatches', 0)), fill=(140, 140, 160), font=body_f)
        draw.text((cols[5], y), str(s.get('bestMatch', 0)), fill=(140, 140, 160), font=body_f)

    # Footer
    draw.text((W // 2, H - 30), "ravonixx.xyz • Powered by Argon", fill=(80, 80, 100), font=small_f, anchor="mm")

    buf = io.BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    return buf
