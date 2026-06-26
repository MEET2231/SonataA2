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
      className="group relative flex flex-col justify-end rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-2xl hover:border-accent/40 hover:-translate-y-2 transition-all duration-500 cursor-pointer bg-slate-50"
    >
      {/* Full Image Background with Hover Zoom */}
      <div className="absolute inset-0 z-0 bg-slate-100">
        <img
          src={tile.image_url}
          alt={tile.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Subtle drop shadow behind the deck */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/20 to-transparent pointer-events-none" />
      </div>

      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
        <span className="text-[8px] font-black tracking-widest uppercase text-accent bg-slate-950/80 backdrop-blur-md border border-accent/25 px-2 py-0.5 rounded-md shadow-sm truncate max-w-[65%]">
          {tile.series || "Designer"}
        </span>
        <span className="text-[8px] font-extrabold text-white/90 tracking-wider bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 shadow-sm">
          {selectedDim}
        </span>
      </div>

      {/* Floating Glassmorphic Details Deck */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 p-3 bg-white/80 backdrop-blur-xl border border-white/40 rounded-xl shadow-lg flex flex-col transition-all duration-500 ease-in-out group-hover:bg-white/95 group-hover:border-white/60">
        <div className="space-y-0.5">
          <h3 className="font-extrabold text-xs text-slate-900 tracking-tight leading-snug transition-colors duration-300 line-clamp-1 group-hover:text-black">
            {tile.name}
          </h3>
        </div>

        {/* Specs row */}
        <div className="flex items-center flex-wrap gap-x-1.5 gap-y-0.5 text-[8px] text-slate-500 font-bold tracking-wider select-none border-t border-slate-100 pt-1.5 mt-1.5 transition-colors duration-500 group-hover:border-slate-200">
          <span>{tile.thickness || "10mm"}</span>
          <span className="w-0.5 h-0.5 rounded-full bg-slate-300"></span>
          <span className="truncate">{tile.finish || "Polished"}</span>
          <span className="w-0.5 h-0.5 rounded-full bg-slate-300"></span>
          <span className="truncate">{tile.location || "Indoor"}</span>
        </div>

        {/* Revealable Action buttons container on hover */}
        <div className={`grid gap-1.5 pt-2 border-t border-slate-100 mt-2 ${tile.external_link ? 'grid-cols-2' : 'grid-cols-1'} opacity-0 max-h-0 overflow-hidden pointer-events-none group-hover:opacity-100 group-hover:max-h-12 group-hover:pointer-events-auto transition-all duration-500 ease-in-out`}>
          <Link
            href={`/tiles/${tile.id}?fromDim=${selectedDim}&fromSeries=${encodeURIComponent(selectedSeries || "")}`}
            className="py-2 bg-slate-900 hover:bg-accent text-white font-extrabold text-[8px] uppercase tracking-widest rounded-lg transition-all duration-300 shadow-2xs hover:shadow-md flex items-center justify-center space-x-1 text-center cursor-pointer"
          >
            <Eye size={10} />
            <span>Inspect</span>
          </Link>
          {tile.external_link && (
            <a
              href={tile.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 bg-accent/15 hover:bg-accent border border-accent/20 hover:border-transparent text-accent-dark hover:text-white font-extrabold text-[8px] uppercase tracking-widest rounded-lg transition-all duration-300 shadow-2xs hover:shadow-md flex items-center justify-center space-x-1 text-center cursor-pointer"
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
