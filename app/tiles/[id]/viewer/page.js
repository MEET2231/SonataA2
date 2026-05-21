"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { dataService } from "@/lib/dataService";
import { 
  ArrowLeft, Sun, Moon, RotateCcw, Compass, Layers, 
  Sparkles, ExternalLink, Grid, Check, ShieldCheck, Heart 
} from "lucide-react";

export default function Interactive3DVisualizer() {
  const { id } = useParams();
  const router = useRouter();
  const [tile, setTile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Visualizer Customization States
  const [roomType, setRoomType] = useState("living"); // living, kitchen, bath
  const [lightMode, setLightMode] = useState("day"); // day, night
  const [rotation, setRotation] = useState(0); // 0, 90
  const [groutColor, setGroutColor] = useState("#d1d5db"); // light grey, dark slate, gold, white
  const [groutThickness, setGroutThickness] = useState("2px"); // 1px, 2px, 4px
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    async function loadTile() {
      if (!id) return;
      try {
        const data = await dataService.getTileById(id);
        if (data) {
          setTile(data);
        }
      } catch (e) {
        console.error("Failed to load tile in visualizer:", e);
      } finally {
        setLoading(false);
      }
    }
    loadTile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 pt-20 bg-slate-950 text-white">
        <div className="w-10 h-10 border-4 border-slate-800 border-t-accent rounded-full animate-spin" />
        <span className="text-xs text-slate-400 font-bold tracking-widest uppercase">
          Initializing 3D render engine...
        </span>
      </div>
    );
  }

  if (!tile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-4 pt-20 bg-slate-950 text-white">
        <h3 className="font-extrabold text-2xl text-accent">Tile Not Found</h3>
        <p className="text-slate-400 font-medium">Unable to initialize visualizer for this slab.</p>
        <Link href="/tiles" className="px-6 py-2.5 bg-accent text-white text-xs font-bold rounded-lg hover:bg-white hover:text-black transition-all">
          Return to Showroom
        </Link>
      </div>
    );
  }

  // Room visual presets
  const rooms = [
    { id: "living", label: "Minimalist Lounge", target: "Flooring" },
    { id: "kitchen", label: "Architectural Kitchen", target: "Backsplash & Wall" },
    { id: "bath", label: "Vitrified Spa Bath", target: "Floor & Wall Cladding" }
  ];

  // Grout color presets
  const groutColors = [
    { hex: "#ffffff", name: "Premium White" },
    { hex: "#d1d5db", name: "Classic Slate" },
    { hex: "#374151", name: "Charcoal Black" },
    { hex: "#d4af37", name: "Antique Gold" }
  ];

  // Format dimensions
  const formattedDim = (tile.dimension || "600x1200").toUpperCase();

  const handleSaveDesign = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* --- LEFT SIDE: THE IMMERSIVE 3D RENDER CANVAS --- */}
      <div className="grow relative flex flex-col justify-between p-6 lg:p-8 min-h-[550px] lg:min-h-screen overflow-hidden">
        
        {/* Render Canvas Background Gradients based on lighting */}
        <div className={`absolute inset-0 transition-colors duration-1000 z-0 ${
          lightMode === "day" 
            ? "bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900" 
            : "bg-gradient-to-tr from-slate-950 via-slate-950 to-slate-900"
        }`} />

        {/* Dynamic ambient sun/moon beam overlays */}
        <div className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none z-10 ${
          lightMode === "day" ? "opacity-30 bg-radial-gradient" : "opacity-15 bg-radial-gradient-night"
        }`} style={{
          background: lightMode === "day" 
            ? "radial-gradient(circle at 80% 20%, #fef08a 0%, transparent 60%)" 
            : "radial-gradient(circle at 80% 20%, #38bdf8 0%, transparent 50%)"
        }} />

        {/* 3D Rendering Canvas Wrapper */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none p-4 lg:p-20 overflow-hidden">
          
          {/* 3D Scene Viewport */}
          <div className="relative w-full h-full max-w-[850px] max-h-[600px] flex items-center justify-center">
            
            {/* 1. LIVING ROOM PERSPECTIVE VIEW */}
            {roomType === "living" && (
              <div className="relative w-full h-full flex items-center justify-center">
                
                {/* 3D Floor plane mapping repeated tile */}
                <div 
                  className="absolute bottom-0 w-[140%] h-[60%] origin-bottom transition-all duration-700 shadow-2xl border-t border-white/10"
                  style={{
                    transform: "perspective(900px) rotateX(65deg) scale(1.5) translateY(10%)",
                    backgroundImage: `url(${tile.image_url})`,
                    backgroundSize: tile.dimension === "600x600" ? "90px 90px" : tile.dimension === "195x1200" ? "35px 210px" : "90px 180px",
                    backgroundRepeat: "repeat",
                    transformOrigin: "bottom center",
                    boxShadow: `inset 0 0 100px rgba(0,0,0,${lightMode === "day" ? "0.4" : "0.7"}), 0px 4px 30px rgba(0,0,0,0.5)`,
                    filter: lightMode === "day" ? "brightness(1) contrast(1)" : "brightness(0.55) contrast(1.1)",
                    borderWidth: groutThickness,
                    borderColor: groutColor,
                    transform: `perspective(900px) rotateX(65deg) scale(1.5) translateY(10%) rotateZ(${rotation}deg)`
                  }}
                />

                {/* Back Living room wall */}
                <div className={`absolute top-0 w-full h-[65%] transition-colors duration-1000 ${
                  lightMode === "day" ? "bg-slate-800/40" : "bg-slate-900/60"
                } backdrop-blur-xs flex items-center justify-center border-b border-white/5`}>
                  <div className="text-center opacity-10 space-y-1">
                    <Compass className="mx-auto text-white animate-spin" size={60} style={{ animationDuration: "30s" }} />
                    <span className="text-[10px] font-bold tracking-widest uppercase block">Sonata 3D Viewport</span>
                  </div>
                </div>

                {/* Living Room Furniture Cutout Overlay (Layers perfectly on top of tile) */}
                <div className="absolute inset-0 flex flex-col justify-end items-center pb-[5%] z-10 w-full h-full pointer-events-none">
                  {/* Luxury modern sofa and rug mockup made with CSS/SVG */}
                  <svg viewBox="0 0 800 600" className="w-[85%] h-auto drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)]">
                    {/* Floor reflection shadowing */}
                    <ellipse cx="400" cy="510" rx="320" ry="30" fill="black" opacity={lightMode === "day" ? "0.4" : "0.75"} />
                    <ellipse cx="400" cy="510" rx="260" ry="12" fill="black" opacity="0.5" />
                    
                    {/* Modern Geometric Wool Rug */}
                    <polygon points="180,480 620,480 680,535 120,535" fill="#f3f4f6" opacity="0.9" />
                    <polygon points="190,485 610,485 660,530 140,530" fill="#e5e7eb" opacity="0.8" />
                    
                    {/* Sofa Base */}
                    <rect x="200" y="380" width="400" height="90" rx="20" fill={lightMode === "day" ? "#475569" : "#1e293b"} />
                    <rect x="220" y="470" width="30" height="25" rx="5" fill="#78350f" />
                    <rect x="550" y="470" width="30" height="25" rx="5" fill="#78350f" />
                    
                    {/* Cushions */}
                    <rect x="210" y="340" width="185" height="100" rx="15" fill={lightMode === "day" ? "#64748b" : "#334155"} />
                    <rect x="405" y="340" width="185" height="100" rx="15" fill={lightMode === "day" ? "#64748b" : "#334155"} />
                    
                    {/* Armrests */}
                    <rect x="180" y="360" width="45" height="90" rx="12" fill={lightMode === "day" ? "#334155" : "#0f172a"} />
                    <rect x="575" y="360" width="45" height="90" rx="12" fill={lightMode === "day" ? "#334155" : "#0f172a"} />
                    
                    {/* Decorative throw pillows */}
                    <rect x="230" y="360" width="55" height="55" rx="10" fill="#c084fc" transform="rotate(-10 230 360)" />
                    <rect x="510" y="360" width="55" height="55" rx="10" fill="#34d399" transform="rotate(15 510 360)" />
                    
                    {/* Minimalist Coffee Table */}
                    <ellipse cx="400" cy="495" rx="110" ry="25" fill="#1e293b" opacity="0.9" />
                    <ellipse cx="400" cy="490" rx="110" ry="25" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
                    <line x1="330" y1="495" x2="330" y2="525" stroke="#475569" strokeWidth="6" />
                    <line x1="470" y1="495" x2="470" y2="525" stroke="#475569" strokeWidth="6" />
                    <line x1="400" y1="498" x2="400" y2="528" stroke="#475569" strokeWidth="6" />
                    
                    {/* Potted Fiddle Leaf Fig plant */}
                    <rect x="110" y="440" width="40" height="50" rx="5" fill="#d97706" />
                    <ellipse cx="130" cy="440" rx="20" ry="8" fill="#78350f" />
                    <path d="M 130 440 Q 120 380 90 320" stroke="#047857" strokeWidth="4" fill="none" />
                    <path d="M 130 420 Q 145 350 170 300" stroke="#047857" strokeWidth="4" fill="none" />
                    <circle cx="90" cy="320" r="18" fill="#065f46" opacity="0.9" />
                    <circle cx="170" cy="300" r="22" fill="#065f46" opacity="0.9" />
                    <circle cx="105" cy="360" r="20" fill="#059669" opacity="0.9" />
                    <circle cx="150" cy="350" r="18" fill="#059669" opacity="0.9" />
                  </svg>
                </div>

              </div>
            )}

            {/* 2. KITCHEN BACKSPLASH WALL VIEW */}
            {roomType === "kitchen" && (
              <div className="relative w-full h-full flex items-center justify-center">
                
                {/* Backsplash wall plane mapping repeated tile */}
                <div 
                  className="absolute w-full h-[70%] transition-all duration-700 shadow-inner"
                  style={{
                    backgroundImage: `url(${tile.image_url})`,
                    backgroundSize: tile.dimension === "600x600" ? "120px 120px" : tile.dimension === "195x1200" ? "40px 240px" : "120px 240px",
                    backgroundRepeat: "repeat",
                    boxShadow: `inset 0 0 120px rgba(0,0,0,${lightMode === "day" ? "0.2" : "0.6"})`,
                    filter: lightMode === "day" ? "brightness(0.95) contrast(1.05)" : "brightness(0.5) contrast(1.15)",
                    borderWidth: groutThickness,
                    borderColor: groutColor,
                    transform: `rotate(${rotation}deg)`
                  }}
                />

                {/* Kitchen Counter and Cabinets Overlay (Layered on top of backsplash) */}
                <div className="absolute inset-0 flex flex-col justify-between z-10 w-full h-full pointer-events-none">
                  
                  {/* Top Cabinets */}
                  <div className={`w-full h-[18%] transition-colors duration-1000 shadow-md flex justify-between px-[5%] border-b border-black/20 ${
                    lightMode === "day" ? "bg-slate-900 text-slate-400" : "bg-slate-950 text-slate-500"
                  }`}>
                    <div className="w-[30%] border-r border-black/40 h-full flex items-center px-4 font-mono text-[9px] tracking-wider uppercase font-bold">Sonata Custom</div>
                    <div className="w-[40%] border-r border-black/40 h-full"></div>
                    <div className="w-[30%] h-full"></div>
                  </div>

                  {/* Countertop & Bottom Cabinets Cutout */}
                  <svg viewBox="0 0 800 600" className="w-full h-[55%] mt-auto drop-shadow-[-5px_-10px_20px_rgba(0,0,0,0.35)]">
                    
                    {/* Shadow under counter */}
                    <rect x="0" y="270" width="800" height="25" fill="black" opacity="0.6" />
                    
                    {/* Quartz Countertop Slab */}
                    <rect x="0" y="280" width="800" height="35" fill="#f8fafc" />
                    <rect x="0" y="315" width="800" height="6" fill="#cbd5e1" />
                    
                    {/* Modern kitchen sink cutout */}
                    <rect x="150" y="282" width="180" height="4" fill="#64748b" />
                    <path d="M 230 282 L 230 240 Q 230 220 245 220 L 250 220 Q 255 220 255 230 L 255 245" fill="none" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
                    
                    {/* Modern Espresso machine on counter */}
                    <rect x="580" y="210" width="80" height="80" rx="8" fill="#1e293b" />
                    <rect x="590" y="230" width="30" height="40" fill="#f1f5f9" />
                    <circle cx="635" cy="225" r="8" fill="#38bdf8" />
                    <rect x="570" y="280" width="100" height="8" fill="#475569" />
                    
                    {/* Bottom Dark Wooden Cabinets */}
                    <rect x="0" y="321" width="800" height="280" fill={lightMode === "day" ? "#1e293b" : "#0f172a"} />
                    
                    {/* Cabinet Doors Dividers */}
                    <line x1="200" y1="321" x2="200" y2="600" stroke="#0f172a" strokeWidth="4" />
                    <line x1="400" y1="321" x2="400" y2="600" stroke="#0f172a" strokeWidth="4" />
                    <line x1="600" y1="321" x2="600" y2="600" stroke="#0f172a" strokeWidth="4" />
                    
                    {/* Stainless Steel long handles */}
                    <rect x="175" y="350" width="10" height="120" rx="3" fill="#cbd5e1" />
                    <rect x="215" y="350" width="10" height="120" rx="3" fill="#cbd5e1" />
                    
                    <rect x="375" y="350" width="10" height="120" rx="3" fill="#cbd5e1" />
                    <rect x="415" y="350" width="10" height="120" rx="3" fill="#cbd5e1" />
                    
                    <rect x="575" y="350" width="10" height="120" rx="3" fill="#cbd5e1" />
                    <rect x="615" y="350" width="10" height="120" rx="3" fill="#cbd5e1" />
                  </svg>

                </div>

              </div>
            )}

            {/* 3. BATH SPA WALL & FLOOR VIEW */}
            {roomType === "bath" && (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                
                {/* Back Wall with tile cladding */}
                <div 
                  className="absolute top-0 w-full h-[65%] transition-all duration-700 shadow-md"
                  style={{
                    backgroundImage: `url(${tile.image_url})`,
                    backgroundSize: tile.dimension === "600x600" ? "90px 90px" : tile.dimension === "195x1200" ? "35px 210px" : "90px 180px",
                    backgroundRepeat: "repeat",
                    boxShadow: `inset 0 0 100px rgba(0,0,0,${lightMode === "day" ? "0.3" : "0.75"})`,
                    filter: lightMode === "day" ? "brightness(0.9) contrast(1.05)" : "brightness(0.5) contrast(1.15)",
                    borderWidth: groutThickness,
                    borderColor: groutColor,
                    transform: `rotate(${rotation}deg)`
                  }}
                />

                {/* Floor perspective with same tile */}
                <div 
                  className="absolute bottom-0 w-[140%] h-[40%] origin-bottom transition-all duration-700 shadow-2xl border-t border-white/20"
                  style={{
                    transform: "perspective(900px) rotateX(60deg) scale(1.4) translateY(8%)",
                    backgroundImage: `url(${tile.image_url})`,
                    backgroundSize: tile.dimension === "600x600" ? "80px 80px" : tile.dimension === "195x1200" ? "30px 180px" : "80px 160px",
                    backgroundRepeat: "repeat",
                    boxShadow: `inset 0 0 80px rgba(0,0,0,${lightMode === "day" ? "0.4" : "0.8"})`,
                    filter: lightMode === "day" ? "brightness(0.85) contrast(1.0)" : "brightness(0.45) contrast(1.1)",
                    borderWidth: groutThickness,
                    borderColor: groutColor,
                    transform: `perspective(900px) rotateX(60deg) scale(1.4) translateY(8%) rotateZ(${rotation}deg)`
                  }}
                />

                {/* Spa Bathroom fixtures overlay */}
                <div className="absolute inset-0 flex flex-col justify-end items-center pb-[3%] z-10 w-full h-full pointer-events-none">
                  <svg viewBox="0 0 800 600" className="w-[80%] h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                    
                    {/* Shadow under tub */}
                    <ellipse cx="400" cy="510" rx="260" ry="25" fill="black" opacity={lightMode === "day" ? "0.55" : "0.85"} />
                    
                    {/* Freestanding modern bathtub (luxurious spa element) */}
                    {/* Outer Shell */}
                    <path d="M 160 410 C 160 520, 640 520, 640 410 C 640 370, 160 370, 160 410 Z" fill="#ffffff" />
                    
                    {/* Inner basin rendering rim */}
                    <ellipse cx="400" cy="400" rx="230" ry="25" fill="#e2e8f0" />
                    <ellipse cx="400" cy="403" rx="222" ry="20" fill="#f8fafc" />
                    <ellipse cx="400" cy="405" rx="210" ry="15" fill="#38bdf8" opacity="0.3" /> {/* water reflection */}
                    
                    {/* Stainless freestanding tub filler faucet */}
                    <path d="M 600 450 L 600 320 Q 600 290 575 290 L 565 290" fill="none" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
                    <path d="M 565 290 L 565 305" fill="none" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
                    
                    {/* Modern wooden bath tray across tub */}
                    <rect x="280" y="394" width="240" height="15" rx="3" fill="#b45309" opacity="0.9" />
                    <rect x="350" y="380" width="30" height="14" rx="2" fill="#f8fafc" /> {/* Towel */}
                    <rect x="420" y="375" width="20" height="20" rx="4" fill="#c084fc" /> {/* Scented candle */}
                    <circle cx="430" cy="370" r="3" fill="#fbbf24" className="animate-pulse" /> {/* Flame */}

                  </svg>
                </div>

              </div>
            )}

          </div>

        </div>

        {/* --- FLOATING HEADER ACTIONS --- */}
        <div className="relative z-20 flex items-center justify-between">
          <Link
            href={`/tiles/${tile.id}`}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-900/90 backdrop-blur-md hover:bg-slate-800 border border-slate-700/50 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-300 transition-all shadow-md"
          >
            <ArrowLeft size={14} />
            <span>Brochure Info</span>
          </Link>

          <span className="hidden md:inline-flex items-center space-x-2 px-4 py-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Sparkles size={11} className="text-amber-500" />
            <span>Sonata Vitrified 3D Sandbox</span>
          </span>
        </div>

        {/* --- FLOATING RENDER PROPERTIES TAGS --- */}
        <div className="relative z-20 mt-auto flex flex-wrap gap-3 max-w-lg">
          <div className="bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-800/80 shadow-md">
            <span className="block text-[8px] font-extrabold uppercase tracking-widest text-slate-500">Active Design</span>
            <span className="block text-xs font-black text-white uppercase tracking-tight mt-0.5">{tile.name}</span>
          </div>

          <div className="bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-800/80 shadow-md">
            <span className="block text-[8px] font-extrabold uppercase tracking-widest text-slate-500">Slab Dimension</span>
            <span className="block text-xs font-black text-emerald-400 uppercase mt-0.5">{formattedDim} MM</span>
          </div>

          <div className="bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-800/80 shadow-md">
            <span className="block text-[8px] font-extrabold uppercase tracking-widest text-slate-500">Finish Styling</span>
            <span className="block text-xs font-black text-white uppercase mt-0.5">{tile.finish || "Glossy"}</span>
          </div>
        </div>

      </div>

      {/* --- RIGHT SIDE: GLASSMORPHIC CONTROL DECK (360px wide) --- */}
      <div className="w-full lg:w-[380px] shrink-0 bg-slate-900/80 backdrop-blur-lg border-t lg:border-t-0 lg:border-l border-slate-800/80 z-20 flex flex-col justify-between p-6 md:p-8 space-y-8 overflow-y-auto max-h-screen">
        
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2 border-b border-slate-800 pb-5">
            <div className="inline-flex items-center space-x-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
              <ShieldCheck size={11} />
              <span>Calibrated 3D Space</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Visualizer Deck</h1>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              Test and rotate vitrified textures in real architectural conditions.
            </p>
          </div>

          {/* Section 1: Room Selection Preset */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-1">
              <Layers size={12} className="text-emerald-500" />
              <span>Architectural Room Type</span>
            </span>
            <div className="grid grid-cols-1 gap-2">
              {rooms.map((room) => {
                const isActive = roomType === room.id;
                return (
                  <button
                    key={room.id}
                    onClick={() => setRoomType(room.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex justify-between items-center ${
                      isActive 
                        ? "bg-emerald-500/10 border-emerald-500 text-white shadow-md shadow-emerald-500/5" 
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div>
                      <span className="block text-xs font-black tracking-wide">{room.label}</span>
                      <span className="block text-[9px] font-bold text-slate-500 uppercase mt-0.5">Applies: {room.target}</span>
                    </div>
                    {isActive && (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Grout Line Customizer */}
          <div className="space-y-4 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-1">
              <Grid size={12} className="text-emerald-500" />
              <span>Grout Joint Customization</span>
            </span>

            {/* Grout Colors */}
            <div className="space-y-2">
              <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Joint Compound Tone</span>
              <div className="flex gap-2">
                {groutColors.map((col) => {
                  const isSel = groutColor === col.hex;
                  return (
                    <button
                      key={col.hex}
                      onClick={() => setGroutColor(col.hex)}
                      className={`w-8 h-8 rounded-full border-2 transition-all relative flex items-center justify-center cursor-pointer ${
                        isSel ? "border-emerald-500 scale-110" : "border-slate-800 hover:scale-105"
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    >
                      {isSel && (
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-950" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grout Thickness */}
            <div className="space-y-2 pt-1">
              <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Joint Width</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Seamless", val: "0px" },
                  { label: "2 mm Standard", val: "2px" },
                  { label: "4 mm Wide", val: "4px" }
                ].map((joint) => {
                  const isSel = groutThickness === joint.val;
                  return (
                    <button
                      key={joint.val}
                      onClick={() => setGroutThickness(joint.val)}
                      className={`py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        isSel 
                          ? "bg-slate-800 text-white border border-slate-600" 
                          : "bg-slate-900 text-slate-500 border border-slate-900 hover:text-slate-300"
                      }`}
                    >
                      {joint.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Interactive Toggles */}
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Environment Sandbox Settings</span>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Lighting Mode toggle */}
              <div className="space-y-1.5">
                <span className="block text-[8px] font-extrabold uppercase tracking-widest text-slate-500">Day / Night Ambient</span>
                <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800/80">
                  <button
                    onClick={() => setLightMode("day")}
                    className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center justify-center space-x-1 cursor-pointer transition-colors ${
                      lightMode === "day" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <Sun size={11} />
                    <span>Day</span>
                  </button>
                  <button
                    onClick={() => setLightMode("night")}
                    className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center justify-center space-x-1 cursor-pointer transition-colors ${
                      lightMode === "night" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <Moon size={11} />
                    <span>Night</span>
                  </button>
                </div>
              </div>

              {/* Rotation toggle */}
              <div className="space-y-1.5">
                <span className="block text-[8px] font-extrabold uppercase tracking-widest text-slate-500">Pattern Layout</span>
                <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800/80">
                  <button
                    onClick={() => setRotation(0)}
                    className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center justify-center space-x-1 cursor-pointer transition-colors ${
                      rotation === 0 ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <Compass size={11} />
                    <span>0° Std</span>
                  </button>
                  <button
                    onClick={() => setRotation(90)}
                    className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center justify-center space-x-1 cursor-pointer transition-colors ${
                      rotation === 90 ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <RotateCcw size={11} />
                    <span>90° Rot</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* --- BOTTOM SECTION: THE POWERFUL CTA FROM ADMIN --- */}
        <div className="pt-6 border-t border-slate-800/80 space-y-4 shrink-0">
          
          {/* Active Call-to-action button dynamically mapped */}
          {tile.external_link ? (
            <div className="space-y-2">
              <span className="block text-[8px] font-extrabold text-slate-500 uppercase tracking-widest text-center">
                Administrator Linked CTA
              </span>
              <a
                href={tile.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>ACQUIRE SPEC SAMPLES</span>
                <ExternalLink size={13} />
              </a>
            </div>
          ) : (
            <div className="space-y-2">
              <span className="block text-[8px] font-extrabold text-slate-500 uppercase tracking-widest text-center">
                B2B Quick Connect
              </span>
              <button
                onClick={handleSaveDesign}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg active:scale-98 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>BOOK SPEC ARCHITECT</span>
                <Compass size={13} />
              </button>
            </div>
          )}

          {/* Quick Design Bookmark action */}
          <div className="flex gap-2">
            <button
              onClick={handleSaveDesign}
              className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Heart size={12} className="text-rose-500 fill-rose-500" />
              <span>BOOKMARK SLAB</span>
            </button>
          </div>

          <div className="text-center">
            <span className="text-[8px] font-extrabold text-slate-600 uppercase tracking-widest">
              &copy; 2026 SONATA VITRIFIED CO.
            </span>
          </div>

        </div>

      </div>

      {/* Save design toast indicator */}
      <AnimatePresence>
        {showSavedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-2xl flex items-center space-x-2 pointer-events-none"
          >
            <ShieldCheck size={15} strokeWidth={3} />
            <span>Architectural design template bookmarked!</span>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
