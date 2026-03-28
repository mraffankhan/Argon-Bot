import os
import re

files = [
    "components/Navbar.tsx",
    "components/Footer.tsx",
    "app/support/page.tsx",
    "app/status/page.tsx",
    "app/refund/page.tsx",
    "app/premium/page.tsx",
    "app/layout.tsx",
    "app/docs/page.tsx",
    "app/docs/api/page.tsx",
    "app/cookies/page.tsx",
    "app/community/page.tsx",
    "app/api/auth/discord/route.ts",
    "app/api/auth/callback/route.ts"
]

base_dir = r"d:\All-Code\website"
for f in files:
    path = os.path.join(base_dir, f)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Replace cases
        content = content.replace("Ravonixx Development", "Argon Automation")
        content = content.replace("RAVONIXX DEVELOPMENT", "ARGON AUTOMATION")
        content = content.replace("Ravonixx", "Argon")
        content = content.replace("RAVONIXX", "ARGON")
        # For lower case specific paths or variables
        content = content.replace("ravonixx.xyz", "argon.xyz")
        content = content.replace("ravonixx.contact", "argon.contact")
        content = content.replace("ravonixx.tournaments", "argon.tournaments")
        
        with open(path, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Updated {f}")
