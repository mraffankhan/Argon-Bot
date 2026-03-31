import io
from PIL import Image, ImageDraw, ImageFont

def render_bracket(matches, tournament_name="Argon Tournament"):
    if not matches:
        img = Image.new('RGB', (1200, 800), color=(14, 19, 31))
        draw = ImageDraw.Draw(img)
        draw.text((600, 400), "No Matches Generated", fill=(255, 255, 255), anchor="mm")
        buf = io.BytesIO()
        img.save(buf, format='PNG')
        buf.seek(0)
        return buf

    max_round = max(m['round'] for m in matches)
    r1_matches = [m for m in matches if m['round'] == 1]
    num_r1 = max(len(r1_matches), 1)

    box_width = 180
    box_height = 60
    x_margin = 80
    y_margin = 120
    x_spacing = 250
    y_spacing = max(90, min(150, 700 // num_r1))

    width = max(1200, x_margin * 2 + max_round * x_spacing)
    height = max(800, y_margin * 2 + num_r1 * y_spacing)

    img = Image.new('RGB', (width, height), color=(14, 19, 31))
    draw = ImageDraw.Draw(img)

    positions = {}

    try:
        font_large = ImageFont.truetype("arial.ttf", 36)
        font_team = ImageFont.truetype("arial.ttf", 16)
    except:
        font_large = ImageFont.load_default()
        font_team = ImageFont.load_default()

    draw.text((width//2, 50), tournament_name, fill=(171, 72, 209), font=font_large, anchor="mm")
    
    matches_by_round = {r: [] for r in range(1, max_round + 1)}
    for m in matches:
        matches_by_round[m['round']].append(m)

    for r in matches_by_round:
        matches_by_round[r] = sorted(matches_by_round[r], key=lambda x: str(x['id']))

    for r in range(1, max_round + 1):
        round_matches = matches_by_round[r]
        for i, m in enumerate(round_matches):
            if r == 1:
                y = y_margin + i * y_spacing
            else:
                y1 = positions.get((r-1, i*2), (0, y_margin))[1]
                y2 = positions.get((r-1, i*2+1), (0, y1 + y_spacing))[1]
                y = (y1 + y2) / 2

            x = x_margin + (r - 1) * x_spacing
            positions[(r, i)] = (x, y)

            if r > 1:
                prev_x = x - x_spacing + box_width
                prev_y1 = positions.get((r-1, i*2), (0, y))[1]
                prev_y2 = positions.get((r-1, i*2+1), (0, y))[1]

                draw.line([(prev_x, prev_y1), (x - 20, prev_y1)], fill=(100, 100, 100), width=2)
                draw.line([(prev_x, prev_y2), (x - 20, prev_y2)], fill=(100, 100, 100), width=2)
                draw.line([(x - 20, prev_y1), (x - 20, prev_y2)], fill=(100, 100, 100), width=2)
                draw.line([(x - 20, y), (x, y)], fill=(100, 100, 100), width=2)

            box_color = (30, 41, 59)
            border_color = (255, 215, 0) if m['status'] == "SCHEDULED" else (100, 100, 100)
            
            box_rect = [x, y - box_height//2, x + box_width, y + box_height//2]
            draw.rectangle(box_rect, fill=box_color, outline=border_color, width=2)

            t1 = m.get('team1_name') or "TBD"
            t2 = m.get('team2_name') or "TBD"
            
            c1 = (0, 255, 0) if m.get('winner_name') == t1 else (255, 255, 255)
            c2 = (0, 255, 0) if m.get('winner_name') == t2 else (255, 255, 255)

            draw.text((x + 10, y - box_height//4), t1, fill=c1, font=font_team, anchor="lm")
            draw.line([(x, y), (x + box_width, y)], fill=(50, 50, 50), width=1)
            draw.text((x + 10, y + box_height//4), t2, fill=c2, font=font_team, anchor="lm")

    draw.text((width - 150, height - 30), "Powered by Ravonixx", fill=(100, 100, 100), font=font_team)

    buf = io.BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    return buf
