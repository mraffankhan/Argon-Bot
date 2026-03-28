import os

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
        
        # Replace cases in reverse mapping from previous
        content = content.replace("Argon Automation", "Ravonixx")
        content = content.replace("ARGON AUTOMATION", "RAVONIXX")
        content = content.replace("Argon", "Ravonixx")
        content = content.replace("ARGON", "RAVONIXX")
        content = content.replace("argon.xyz", "ravonixx.xyz")
        content = content.replace("argon.contact", "ravonixx.contact")
        content = content.replace("argon.tournaments", "ravonixx.tournaments")
        
        with open(path, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Reverted {f}")
