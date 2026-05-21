"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function BackgroundShapes() {
  const { scrollY } = useScroll();

  // High-performance scroll-linked motion values for parallax depth
  const yTan = useTransform(scrollY, [0, 2000], [0, -120]);
  const yClay = useTransform(scrollY, [0, 2000], [0, 150]);
  const ySage = useTransform(scrollY, [0, 2000], [0, -60]);

  // Rotates concentric blueprint rings as scroll progress increases
  const rotateRing = useTransform(scrollY, [0, 2000], [0, 75]);
  const yRing = useTransform(scrollY, [0, 2000], [0, -30]);

  // Translates & rotates the morphing blob outline on scroll
  const morphY = useTransform(scrollY, [0, 2000], [0, -100]);
  const morphRotate = useTransform(scrollY, [0, 2000], [0, 60]);

  // Individual particle vertical scroll drift factor
  const particleY1 = useTransform(scrollY, [0, 1500], [0, -180]);
  const particleY2 = useTransform(scrollY, [0, 1500], [0, -280]);
  const particleY3 = useTransform(scrollY, [0, 1500], [0, -120]);
  const particleY4 = useTransform(scrollY, [0, 1500], [0, -220]);
  const particleScrollYs = [particleY1, particleY2, particleY3, particleY4];

  // Tiny micro-crystals representing pure vitrified quartz/silica minerals
  const mineralParticles = [
    { left: "15%", top: "25%", delay: 0, duration: 14, scale: 0.8 },
    { left: "82%", top: "48%", delay: 4, duration: 18, scale: 1.2 },
    { left: "38%", top: "72%", delay: 8, duration: 22, scale: 0.9 },
    { left: "75%", top: "18%", delay: 2, duration: 16, scale: 1.0 }
  ];

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-[#fbfaf8]">
      
      {/* 1. Technical Catalog Outer double frame border (Architectural blueprint layout) */}
      <div className="absolute inset-4 border border-slate-200/30 rounded-[2rem] pointer-events-none">
        <div className="absolute inset-1 border border-slate-100/20 rounded-[1.8rem]" />
      </div>

      {/* 2. Warm Tan/Beige Ambient Glow (Vibrant & Cozy - Top-Left) */}
      <motion.div
        className="absolute w-[680px] h-[680px] rounded-full bg-[#c29979]/20 blur-[130px] -top-64 -left-48"
        style={{ y: yTan }}
        animate={{
          x: [0, 40, -20, 0],
          scale: [1, 1.12, 0.96, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 3. Terracotta Clay Ambient Glow (Rich Warmth - Bottom-Right) */}
      <motion.div
        className="absolute w-[580px] h-[580px] rounded-full bg-[#b87d67]/15 blur-[120px] -bottom-36 -right-36"
        style={{ y: yClay }}
        animate={{
          x: [0, -30, 40, 0],
          scale: [1, 1.08, 0.92, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 4. Soft Sage Green Balancing Glow (Fresh Accent - Center-Left) */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-[#708075]/12 blur-[110px] top-1/3 -left-36"
        style={{ y: ySage }}
        animate={{
          x: [0, 30, -30, 0],
          scale: [0.95, 1.05, 1, 0.95],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 5. Fine Architectural Drafting Concentric Blueprint Rings (Top-Right) */}
      <motion.div
        className="absolute top-[16%] right-[12%] w-80 h-80 flex items-center justify-center pointer-events-none"
        style={{ y: yRing, rotate: rotateRing }}
      >
        {/* Outer Fine Ring */}
        <div className="absolute inset-0 border border-[#c29979]/35 rounded-full shadow-[0_0_8px_rgba(194,153,121,0.04)]" />
        {/* Middle Ring */}
        <div className="absolute w-[85%] h-[85%] border border-[#708075]/30 border-dashed rounded-full" />
        {/* Inner Solid Ring */}
        <div className="absolute w-[60%] h-[60%] border border-slate-300/60 rounded-full" />
        {/* Centering crosshairs for CAD blueprint aesthetic */}
        <div className="absolute w-5 h-[1px] bg-slate-400/50" />
        <div className="absolute h-5 w-[1px] bg-slate-400/50" />
      </motion.div>

      {/* 6. Minimalist Geometric Morphing Blob Outline (Bottom-Left) */}
      <motion.div
        className="absolute bottom-[20%] left-[9%] w-64 h-64 border border-slate-300/75 shadow-[0_0_10px_rgba(0,0,0,0.01)]"
        style={{ borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%", y: morphY, rotate: morphRotate }}
        animate={{
          borderRadius: [
            "40% 60% 70% 30% / 40% 50% 60% 50%",
            "60% 40% 30% 70% / 50% 60% 40% 50%",
            "50% 50% 50% 50% / 40% 40% 60% 60%",
            "40% 60% 70% 30% / 40% 50% 60% 50%"
          ],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* 7. Tiny Crisp Floating Mineral Silica Particles (Slowly Drifting) */}
      {mineralParticles.map((part, idx) => (
        <motion.div
          key={idx}
          className="absolute pointer-events-none"
          style={{
            left: part.left,
            top: part.top,
            y: particleScrollYs[idx]
          }}
        >
          <motion.div
            className="w-1.5 h-1.5 border border-[#c29979]/45 bg-white/70 rotate-45 shadow-sm"
            animate={{
              y: [0, -25, 0],
              rotate: [45, 225, 45],
              opacity: [0.35, 0.75, 0.35],
              scale: [part.scale * 0.9, part.scale * 1.1, part.scale * 0.9]
            }}
            transition={{
              duration: part.duration,
              delay: part.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      ))}

      {/* 8. Fine Grid Layout & dot matrix */}
      <div 
        className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]"
      />
      <div 
        className="absolute inset-0 opacity-[0.055] bg-[radial-gradient(#0f172a_1.5px,transparent_1.5px)] bg-[size:24px_24px]"
      />

      {/* 9. Technical Drafting Intersection Crosshair Markers (+) */}
      <div className="absolute top-[25%] left-[25%] text-[9px] font-mono font-bold text-slate-300/40 pointer-events-none">+</div>
      <div className="absolute top-[25%] right-[25%] text-[9px] font-mono font-bold text-slate-300/40 pointer-events-none">+</div>
      <div className="absolute bottom-[25%] left-[25%] text-[9px] font-mono font-bold text-slate-300/40 pointer-events-none">+</div>
      <div className="absolute bottom-[25%] right-[25%] text-[9px] font-mono font-bold text-slate-300/40 pointer-events-none">+</div>

      {/* 10. Faint Blueprint CAD Specifications Labels */}
      <div className="absolute bottom-10 left-10 text-[9px] font-mono font-bold tracking-wider text-slate-300/40 uppercase">
        Sonata Vitrified Spec Desk // Scale 1:1
      </div>
      <div className="absolute top-10 right-10 text-[9px] font-mono font-bold tracking-wider text-slate-300/40 uppercase">
        Sbk. Factory Hub // Gadhoda - Sabarkantha
      </div>
    </div>
  );
}
