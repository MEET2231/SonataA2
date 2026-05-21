"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import HeroSlider from "@/components/HeroSlider";
import BackgroundShapes from "@/components/BackgroundShapes";
import { 
  ArrowRight, 
  BookOpen, 
  Layers, 
  Award, 
  ShieldCheck 
} from "lucide-react";

const categories = [
  {
    name: "Luxury Marble",
    tagline: "Opulence & Sophistication",
    image: "/images/hero_marble.png",
    link: "/tiles",
    color: "from-blue-900/60 to-slate-900/90"
  },
  {
    name: "Architectural Wood",
    tagline: "Natural Warmth Plank",
    image: "/images/hero_wooden.png",
    link: "/tiles",
    color: "from-amber-900/60 to-slate-900/90"
  },
  {
    name: "Textured Slate",
    tagline: "Structured Outdoor R11",
    image: "/images/hero_terrace.png",
    link: "/tiles",
    color: "from-slate-800/60 to-slate-900/90"
  },
  {
    name: "Artisan Ceramic",
    tagline: "Handcrafted Pigment Gloss",
    image: "https://images.unsplash.com/photo-1501183007986-d0d080b147f9?auto=format&fit=crop&w=800&q=80",
    link: "/tiles",
    color: "from-emerald-900/60 to-slate-900/90"
  }
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveCategory((prev) => (prev + 1) % categories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <main className="relative min-h-screen pt-20">
      <BackgroundShapes />

      {/* Hero Carousel Section */}
      <section className="relative w-full">
        <HeroSlider />
      </section>

      {/* Quick Preview Categories Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative">
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row items-end justify-between mb-16"
        >
          <div className="max-w-xl space-y-4">
            <span className="text-accent font-bold text-xs uppercase tracking-widest">
              Showroom Curations
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-primary tracking-tight leading-none">
              Explore by Core Design Style
            </h2>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">
              Discover premium slabs and layouts curated for luxury B2B and retail developments. Automatically rotating through indoor, outdoor, wall, or flooring implementations.
            </p>
          </div>
          <Link
            href="/tiles"
            className="group inline-flex items-center space-x-2 text-base font-bold text-slate-500 hover:text-slate-700 transition-colors mt-4 md:mt-0"
          >
            <span>Browse Full Showroom</span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Dual Column Carousel Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Interactive Categories Buttons list (Col-span 5) */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <div className="flex flex-col space-y-3">
              {categories.map((cat, idx) => {
                const isActive = activeCategory === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveCategory(idx)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-start space-x-4 cursor-pointer group ${
                      isActive 
                        ? "bg-white border-slate-200 shadow-md scale-[1.02]" 
                        : "bg-transparent border-transparent hover:bg-slate-100/50"
                    }`}
                  >
                    {/* Bullet indicator */}
                    <span className={`font-mono text-xs font-bold leading-none mt-1 transition-colors ${
                      isActive ? "text-accent" : "text-slate-400 group-hover:text-slate-600"
                    }`}>
                      0{idx + 1}
                    </span>

                    {/* Meta info */}
                    <div className="space-y-1 flex-grow">
                      <h4 className={`font-extrabold text-base tracking-tight leading-none transition-colors ${
                        isActive ? "text-primary animate-pulse" : "text-slate-400 group-hover:text-slate-600"
                      }`}>
                        {cat.name}
                      </h4>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-xs text-slate-500 font-medium leading-relaxed font-sans mt-2"
                        >
                          {cat.tagline}. High-fidelity glazed vitrified slabs capturing deep mineral details with pristine clarity.
                        </motion.p>
                      )}
                    </div>

                    {/* Arrow active mark */}
                    {isActive && (
                      <motion.div
                        layoutId="active-curation-indicator"
                        className="text-accent"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        <ArrowRight size={16} />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Dynamic Slider Showcase Card with zoom effect (Col-span 7) */}
          <div className="lg:col-span-7 flex justify-center items-center">
            <div 
              className="relative w-full max-w-[600px] h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-900 border border-slate-200/10 group/card cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  {/* Background Image */}
                  {categories[activeCategory].image.startsWith("/") ? (
                    <Image
                      src={categories[activeCategory].image}
                      alt={categories[activeCategory].name}
                      fill
                      priority
                      className="object-cover transition-transform duration-1000 group-hover/card:scale-105"
                    />
                  ) : (
                    <img
                      src={categories[activeCategory].image}
                      alt={categories[activeCategory].name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-105"
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${categories[activeCategory].color} opacity-85 group-hover/card:opacity-90 transition-opacity duration-300`} />

                  {/* Details Overlay */}
                  <div className="absolute inset-0 z-10 p-10 flex flex-col justify-end text-white text-left space-y-4">
                    <div className="space-y-2">
                      {/* <span className="text-[10px] font-bold uppercase tracking-widest text-accent-light bg-accent/20 border border-accent/20 px-3 py-1 rounded-full inline-block">
                        {categories[activeCategory].tagline}
                      </span> */}
                      <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-none">
                        {categories[activeCategory].name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-sm font-sans">
                      Engineered with double-charged vitrified architecture and micro-calibrated flatness for high-traffic environments.
                    </p>
                    <div className="pt-2">
                      <Link
                        href={categories[activeCategory].link}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md group/btn hover:shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:drop-shadow-xl"
                      >
                        <span>View Specifications</span>
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Architectural Layout Ticks */}
              <div className="absolute top-6 left-6 text-[8px] font-mono text-white/40 tracking-wider">
                SONATA SPEC STATION // CYCLE 0{activeCategory + 1}
              </div>
              <div className="absolute bottom-6 right-6 text-[8px] font-mono text-white/40 tracking-wider">
                AUTO ROTATING // ACTIVE
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 25 Years of Experience Section */}
      <section className="relative overflow-hidden py-24 border-t border-slate-200/50 bg-white">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"
          >
            {/* Left Column: Image wrapper with elegant framing */}
            <div className="lg:col-span-6 relative group">
              {/* Visual background elements */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-accent/5 to-slate-200/20 rounded-3xl blur-xl opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-100 shadow-lg">
                <Image
                  src="/images/plant_image.jpg"
                  alt="Sonata Tiles Himatnagar Manufacturing Unit"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay Badge */}
                <div className="absolute bottom-6 left-6 glass-panel py-3 px-5 rounded-xl border border-white/40 shadow-lg flex items-center space-x-3">
                  <span className="text-3xl font-black text-accent font-mono leading-none">25</span>
                  <div className="text-[10px] font-bold text-primary uppercase tracking-wider leading-tight">
                    Years of<br />Experience
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Narrative Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="space-y-3">
                <span className="text-accent font-bold text-xs uppercase tracking-widest block">
                  Corporate Legacy
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight leading-tight">
                  25 Years of Experience
                </h2>
              </div>
              
              <p className="text-slate-600 font-medium text-sm leading-relaxed font-sans">
                Being the first ceramic floor tile manufacturing unit in Himatnagar, Sonata Tiles has grown beyond the initial expectations. International manufacturing technology, energy efficient unit functioning and environment friendly production processes ensure that we keep our quality and quantity under stringent control. No doubt, we have ISO:9001-2008 certification that enables us to keep our norms of quality control, systems, management and production under strict disciplinary measures.
              </p>

              <p className="text-slate-500 font-medium text-sm leading-relaxed font-sans">
                Exemplary designs, latest technology and induction of industry and customer requirements into the product design and detailing ensures that our tiles come in great ranges and styles.
              </p>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="group inline-flex items-center space-x-2 px-5 py-3 bg-primary hover:bg-accent text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all duration-300"
                >
                  <span>Know More</span>
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pioneering Legacy Section */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-b from-white to-slate-50/65 border-y border-slate-200/50">
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {/* Visual Box */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute inset-0 bg-accent/10 rounded-3xl blur-2xl group-hover:bg-accent/15 transition-colors duration-500 pointer-events-none" />
              <div className="relative glass-panel p-8 rounded-3xl border border-slate-200/60 shadow-xl space-y-6 overflow-hidden">
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-2.5 py-1 rounded-full inline-block">
                  First Floor Tiles Unit in Himatnagar
                </span>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-primary tracking-tight">Since 2002</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed font-sans">
                    Sonata Tiles revolutionized the regional ceramic landscape by establishing the very first floor tile manufacturing hub in Himatnagar, Gujarat.
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-6 flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Himatnagar, Gujarat</span>
                  <span>ISO 9001-2008 Certified</span>
                </div>
              </div>
            </div>

            {/* Narrative & CTA */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="text-accent font-bold text-xs uppercase tracking-widest">
                Our Pioneering Legacy
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-primary tracking-tight leading-none">
                Blending Timeless Craft with Advanced Vitrification
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-2xl font-sans">
                For over two decades, Sonata Ceramica has stood at the intersection of precision engineering and luxury interior aesthetics. From high-temperature kilns to our interactive 3D digital architecture visualizers, we deliver superior porcelain slabs designed to withstand heavy traffic and freeze-thaw cycles.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="group inline-flex items-center space-x-3 px-6 py-3.5 bg-primary hover:bg-accent text-white font-bold rounded-xl shadow-lg active:scale-98 transition-all duration-300"
                >
                  <span>Explore Our Full Story</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium B2B Download Spec Station & Drafting Desk Section */}
      <section className="relative overflow-hidden py-24 bg-primary text-white border-y border-slate-800">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#c29979]/8 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#708075]/6 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Subtle grid pattern for the B2B tech block */}
        <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Fine Architectural layout specs, dimension lines and framing borders */}
        <div className="absolute inset-x-6 top-6 bottom-6 border border-white/5 rounded-2xl pointer-events-none">
          <div className="absolute top-4 left-4 text-[7px] font-mono text-slate-500 uppercase tracking-widest">
            Sonata B2B Spec Terminal // V2.26
          </div>
          <div className="absolute bottom-4 right-4 text-[7px] font-mono text-slate-500 uppercase tracking-widest">
            CAD/BIM Asset Distribution Node
          </div>
          {/* Symmetrical Ticks */}
          <div className="absolute top-0 left-1/4 -translate-y-1/2 text-[9px] font-mono text-slate-600">+</div>
          <div className="absolute top-0 right-1/4 -translate-y-1/2 text-[9px] font-mono text-slate-600">+</div>
          <div className="absolute bottom-0 left-1/4 translate-y-1/2 text-[9px] font-mono text-slate-600">+</div>
          <div className="absolute bottom-0 right-1/4 translate-y-1/2 text-[9px] font-mono text-slate-600">+</div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"
          >
            {/* Left Column: Clean, Elegant B2B Description */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  <span className="text-accent font-bold text-[10px] uppercase tracking-widest">
                    Design Architecture Libraries
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                  Premium B2B Product Catalogues
                </h2>
                <p className="text-slate-400 text-base font-medium leading-relaxed max-w-xl font-sans">
                  Gain access to high-fidelity CAD reference files, full-spectrum architectural manuals, and collection cover stories. Fast download speeds guaranteed.
                </p>
              </div>

              {/* Direct Link to B2B Catalogues Page */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-6">
                <Link
                  href="/catalogues"
                  className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-accent-light text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:scale-102 hover:shadow-accent/20 active:scale-98 transition-all duration-300 inline-flex items-center justify-center space-x-3 group"
                >
                  <BookOpen size={16} className="transition-transform group-hover:rotate-12" />
                  <span>Enter Download Center</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right Column: Elegant, tactile fanning 3D book stack */}
            <div className="lg:col-span-5 flex justify-center items-center h-full min-h-[420px] relative">
              <div className="absolute inset-0 border border-white/5 rounded-2xl bg-white/[0.01] pointer-events-none" />
              {/* Compass / CAD ticks overlays */}
              <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/10" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/10" />
              
              <div className="relative w-full max-w-[400px] h-[380px] mx-auto flex items-center justify-center group/deck">
                {/* Underlay glow */}
                <div className="absolute inset-0 bg-[#c29979]/5 rounded-3xl blur-3xl pointer-events-none" />

                {/* Book 3: Wood Series (Back layer, fans out to the left) */}
                <div className="absolute w-[180px] h-[240px] rounded-lg bg-gradient-to-br from-[#708075] to-[#242c28] border border-white/10 shadow-2xl p-4 flex flex-col justify-between transition-all duration-500 ease-out transform -rotate-12 -translate-x-12 translate-y-4 group-hover/deck:-rotate-[20deg] group-hover/deck:-translate-x-20 group-hover/deck:translate-y-2 opacity-60 group-hover/deck:opacity-85">
                  <div className="space-y-1">
                    <span className="text-[7px] font-mono text-[#ebd0b5]/70 tracking-widest uppercase">Series 03</span>
                    <h4 className="text-xs font-black text-white leading-tight">Wood & Timber</h4>
                  </div>
                  <div className="text-[7px] font-mono text-slate-400">SONATA CERAMICS</div>
                </div>

                {/* Book 2: Stone & Slate (Middle layer, fans out to the right) */}
                <div className="absolute w-[180px] h-[240px] rounded-lg bg-gradient-to-br from-[#8c7a6b] to-[#3a322d] border border-white/10 shadow-2xl p-4 flex flex-col justify-between transition-all duration-500 ease-out transform rotate-6 translate-x-10 -translate-y-4 group-hover/deck:rotate-[15deg] group-hover/deck:translate-x-20 group-hover/deck:-translate-y-6 opacity-75 group-hover/deck:opacity-95">
                  <div className="space-y-1">
                    <span className="text-[7px] font-mono text-[#ebd0b5]/70 tracking-widest uppercase">Series 02</span>
                    <h4 className="text-xs font-black text-white leading-tight">Stone & Slate</h4>
                  </div>
                  <div className="text-[7px] font-mono text-slate-400">SONATA CERAMICS</div>
                </div>

                {/* Book 1: Luxury Marble (Front active layer, centered, tilts on hover) */}
                <div className="absolute w-[190px] h-[260px] rounded-lg bg-gradient-to-br from-[#c29979] to-[#3a2f26] border border-white/15 shadow-2xl p-5 flex flex-col justify-between transition-all duration-500 ease-out transform -rotate-2 group-hover/deck:rotate-0 group-hover/deck:-translate-y-2 z-10">
                  <div className="space-y-3">
                    <img src="/SONATA LOGO.png" alt="Sonata Logo" className="h-4 w-auto object-contain brightness-0 invert opacity-60" />
                    <div className="space-y-1 pt-2">
                      <span className="text-[6px] font-mono text-[#ebd0b5] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full inline-block tracking-wider uppercase">
                        2026 Collection
                      </span>
                      <h4 className="text-sm font-extrabold text-white leading-tight tracking-tight">Luxury Vitrified Marble</h4>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[7px] font-mono text-[#ebd0b5]/80">
                    <span>600x1200MM</span>
                    <span>EDITION V6</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Elegant Trust Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Layers size={24} />,
              title: "Comprehensive Selection",
              desc: "Over 500+ finishes and dimensions optimized for custom home layouts and public complexes."
            },
            {
              icon: <Award size={24} />,
              title: "Premium Grade Certification",
              desc: "All slabs carry high PEI ratings, freeze-resistant vitrification, and precision rectified edges."
            },
            {
              icon: <ShieldCheck size={24} />,
              title: "Reliable Global Logistics",
              desc: "Secure, break-resistant freight packaging and timely international transport direct to your site."
            }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
              className="glass-panel p-8 rounded-2xl flex items-start space-x-4"
            >
              <div className="p-3.5 rounded-xl bg-slate-100 text-primary">
                {stat.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-lg text-primary">{stat.title}</h4>
                <p className="text-sm text-slate-500 font-medium font-sans">{stat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
