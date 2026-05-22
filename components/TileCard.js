"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, ExternalLink } from "lucide-react";

export default function TileCard({ tile, selectedDim, selectedSeries, cardStyle }) {
  return (
    <motion.div
      layout
      key={tile.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={cardStyle}
      className="group relative flex flex-col justify-end rounded-xl overflow-hidden border border-slate-200/40 shadow-2xs hover:shadow-xl hover:shadow-slate-350/30 hover:-translate-y-1 transition-all duration-400 cursor-pointer"
    >
      {/* Full Image Background */}
      <div className="absolute inset-0 z-0 ">
        <img
          src={tile.image_url}
          alt={tile.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent transition-opacity duration-300 group-hover:via-slate-950/40" />
      </div>

      {/* Top Badge */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
        <span className="text-[7px] font-black tracking-widest uppercase text-white bg-white/10 backdrop-blur-md border border-white/15 px-2 py-0.5 rounded shadow-xs truncate max-w-[60%]">
          {tile.series || "Designer"}
        </span>
        <span className="text-[7px] font-bold text-white/70 tracking-wider bg-black/25 backdrop-blur-xs px-1.5 py-0.5 rounded border border-white/5">
          {selectedDim}
        </span>
      </div>

      {/* Bottom Overlay */}
      <div className="p-3 space-y-2 w-full z-10 relative ">
        <div className="space-y-0.5">
          <h3 className="font-bold text-sm text-white tracking-tight leading-snug transition-colors duration-300 line-clamp-1">
            {tile.name}
          </h3>
        </div>

        {/* Specs row */}
        <div className="flex items-center space-x-1.5 text-[8px] text-slate-400 font-bold tracking-wider select-none border-t border-white/10 pt-1.5">
          <span>{tile.thickness || "10mm"}</span>
          <span className="w-0.5 h-0.5 rounded-full bg-white/30"></span>
          <span className="truncate">{tile.finish || "Polished"}</span>
          <span className="w-0.5 h-0.5 rounded-full bg-white/30"></span>
          <span>{tile.location || "Indoor"}</span>
        </div>

        {/* Action buttons */}
        <div className={`grid gap-2 shrink-0 ${tile.external_link ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <Link
            href={`/tiles/${tile.id}?fromDim=${selectedDim}&fromSeries=${encodeURIComponent(selectedSeries || "")}`}
            className="py-2 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/15 text-white font-extrabold text-[8px] uppercase tracking-widest rounded-lg transition-all duration-300 shadow-2xs hover:shadow-md flex items-center justify-center space-x-1 text-center cursor-pointer"
          >
            <Eye size={10} />
            <span>Inspect</span>
          </Link>
          {tile.external_link && (
            <a
              href={tile.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/15 text-white font-extrabold text-[8px] uppercase tracking-widest rounded-lg transition-all duration-300 shadow-2xs hover:shadow-md flex items-center justify-center space-x-1 text-center cursor-pointer"
            >
              <ExternalLink size={10} />
              <span>3D</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
