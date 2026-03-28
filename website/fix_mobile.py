import os
import glob

# Fix `app/page.tsx`
page_path = r"d:\All-Code\website\app\page.tsx"
if os.path.exists(page_path):
    with open(page_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Hero Title
    content = content.replace(
        'className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter italic uppercase leading-[1.1] text-white"',
        'className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-6 sm:mb-8 tracking-tighter italic uppercase leading-[1.1] text-white"'
    )
    # Hero subtitle
    content = content.replace(
        'className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl font-medium leading-relaxed mx-auto"',
        'className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-12 max-w-2xl font-medium leading-relaxed mx-auto px-2"'
    )
    # CTA Buttons (adjust padding for narrow screens)
    content = content.replace(
        'className="px-10 py-5 bg-white text-black font-black text-lg rounded-2xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 group"',
        'className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 bg-white text-black font-black text-base sm:text-lg rounded-2xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 group"'
    )
    content = content.replace(
        'className="px-10 py-5 glass border border-white/10 text-white font-black text-lg rounded-2xl hover:bg-white/5 transition-all flex items-center justify-center gap-2"',
        'className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 glass border border-white/10 text-white font-black text-base sm:text-lg rounded-2xl hover:bg-white/5 transition-all flex items-center justify-center gap-2"'
    )
    
    # Ready to elevate section
    content = content.replace(
        'className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter mb-8 italic leading-tight"',
        'className="text-3xl sm:text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter mb-6 sm:mb-8 italic leading-tight"'
    )
    content = content.replace(
        'className="px-10 py-5 bg-white text-black font-black text-lg rounded-2xl hover:scale-105 transition-all"',
        'className="w-full sm:w-auto px-6 py-4 sm:px-10 sm:py-5 bg-white text-black font-black text-base sm:text-lg rounded-2xl hover:scale-105 transition-all text-center"'
    )
    content = content.replace(
        'className="px-10 py-5 glass border border-white/10 text-white font-black text-lg rounded-2xl hover:bg-white/5 transition-all"',
        'className="w-full sm:w-auto px-6 py-4 sm:px-10 sm:py-5 glass border border-white/10 text-white font-black text-base sm:text-lg rounded-2xl hover:bg-white/5 transition-all text-center"'
    )
    
    # Stat cards
    content = content.replace(
        'className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tighter italic"',
        'className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-1 sm:mb-2 tracking-tighter italic"'
    )
    content = content.replace(
        'className="glass border border-white/5 p-8 rounded-3xl"',
        'className="glass border border-white/5 p-6 sm:p-8 rounded-3xl"'
    )
    # Feature container 
    content = content.replace(
        'className="grid grid-cols-2 md:grid-cols-4 gap-4"',
        'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"'
    )
    
    with open(page_path, 'w', encoding='utf-8') as f:
        f.write(content)


# Fix service pages and docs
service_pages = glob.glob(r"d:\All-Code\website\app\services\*\page.tsx")
for sp in service_pages:
    with open(sp, 'r', encoding='utf-8') as f:
        content = f.read()

    # Title & Icon alignment container
    content = content.replace(
        'className="flex items-center gap-4 mb-6"',
        'className="flex flex-col sm:flex-row sm:items-center items-start gap-4 mb-6"'
    )
    # H1
    content = content.replace(
        'className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white"',
        'className="text-4xl sm:text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white"'
    )
    # Hero Subtitle
    content = content.replace(
        'className="text-xl text-gray-400 max-w-3xl leading-relaxed"',
        'className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl leading-relaxed"'
    )
    with open(sp, 'w', encoding='utf-8') as f:
        f.write(content)

print("Applied responsiveness fixes.")
