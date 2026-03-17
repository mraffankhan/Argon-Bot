"use client";

import { motion } from "framer-motion";

export default function PolicyPage({ title, content }: { title: string; content: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="glass p-8 md:p-16 rounded-[40px] border border-white/5"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-1 h-3 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-primary/80 italic">Legal Documents</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter mb-12 italic leading-tight">
            {title}
          </h1>

          <div className="prose prose-invert prose-headings:text-white prose-p:text-gray-400 prose-li:text-gray-400 max-w-none space-y-10">
            {content}
          </div>

          <div className="mt-20 pt-10 border-t border-white/5 text-center">
            <p className="text-gray-600 text-xs font-bold uppercase tracking-widest italic">
              Effective Date: {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
