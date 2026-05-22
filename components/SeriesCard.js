"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function SeriesCard({ ser, index, tiles, selectedDim, onClick }) {
  const seriesTiles = tiles.filter(t => (t.dimension || "600x1200") === selectedDim && t.series === ser.name);
  const finishTypes = [...new Set(seriesTiles.map(t => t.finish || "Glossy"))];

  return (
    <motion.div
      key={ser.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className="group relative h-[260px] rounded-2xl bg-white border border-slate-200/55 shadow-xs overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 flex flex-col justify-end"
    >
      {/* Background Image with Hover Scale */}
      <div className="absolute inset-0">
        <img 
          src={ser.image_url || 'https://images.unsplash.com/photo-1501183007986-d0d080b147f9?auto=format&fit=crop&w=400&q=80'} 
          alt={ser.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent transition-opacity duration-300 group-hover:via-slate-950/50" />
      </div>

      {/* Bottom Info Content */}
      <div className="relative p-5 md:p-6 space-y-2.5 z-20">
        <div className="space-y-1">
          <h3 className="font-black text-lg md:text-xl text-white tracking-tight leading-tight transition-colors duration-300">
            {ser.name}
          </h3>
          <p className="text-slate-300 text-[10px] font-medium uppercase tracking-wider flex items-center space-x-1.5">
            <span>{finishTypes.join(" / ") || "Premium Finishes"}</span>
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/15">
          <span className="text-[9px] font-extrabold tracking-widest uppercase text-white bg-transparent border border-accent/20 px-2.5 py-1 rounded-md">
            {seriesTiles.length === 1 ? "1 Design Available" : `${seriesTiles.length} Designs Available`}
          </span>
          
          <span className="text-xs font-black text-white/80 hover:text-white transition-colors flex items-center space-x-1 cursor-pointer">
            <span>Explore Curation</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
