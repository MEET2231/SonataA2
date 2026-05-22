"use client";

import { motion } from "framer-motion";

export default function TilesHero() {
  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 bg-[#111625] h-[340px] md:h-[400px] flex items-center px-8 md:px-16 mb-8">
      {/* Immersive background image with premium dark overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
          alt="Luxury Interior Slab Architecture"
          className="w-full h-full object-cover opacity-35 filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111625] via-[#111625]/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111625] via-transparent to-[#111625]/20" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-2xl space-y-6">
        <div className="space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight"
          >
            Vitrified Material <br />
            <span className="text-slate-350 font-heading italic font-light">Marketplace</span>
          </motion.h1>
        </div>
        
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-slate-400 font-medium text-xs md:text-sm leading-relaxed max-w-lg"
        >
          Discover high-density vitrified porcelain slabs engineered for master developments. Calibrated for modern design layouts, refined flatness, and seamless joints.
        </motion.p>

        {/* Micro Specs Tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-2.5 pt-2 select-none"
        >
          {[
            { label: "Rectified Edges" },
            { label: "Water Absorption < 0.05%" },
            { label: "Calibrated Thickness" },
            { label: "Scratch & Stain Resistant" }
          ].map((spec, i) => (
            <span
              key={i}
              className="text-[9px] font-mono text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md"
            >
              {spec.label}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
