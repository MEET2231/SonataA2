"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  History, Award, Factory, ArrowRight, CheckCircle2, ShieldCheck, 
  Sparkles, Flame, Recycle, ChevronRight, MapPin, Phone, Mail
} from "lucide-react";
import BackgroundShapes from "@/components/BackgroundShapes";

export default function AboutPage() {
  const milestones = [
    {
      year: "2002",
      title: "The Pioneer Inception",
      description: "Established the very first ceramic floor tile manufacturing unit in Himatnagar, Gujarat, setting the foundation for the region's industrial tile boom."
    },
    {
      year: "2008",
      title: "ISO Certification & Global Reach",
      description: "Achieved ISO 9001-2008 Quality Management certification and initiated international trade operations to export premium vitrified materials."
    },
    {
      year: "2015",
      title: "Vitrified High-Tech Overhaul",
      description: "Introduced advanced double charge and high-density glazed vitrified porcelain production lines, expanding architectural load capacities."
    },
    {
      year: "2021",
      title: "The 3D Architecture Visualizer",
      description: "Launched high-fidelity digital tools, interactive 3D environment simulators, and streamlined B2B sample logistics pipelines."
    },
    {
      year: "Present Day",
      title: "Leading the Craft",
      description: "Trusted partner for global real estate developments, public complexes, and luxury private residences, serving 20+ countries."
    }
  ];

  const highlights = [
    {
      icon: <Flame className="w-6 h-6 text-black" />,
      title: "High-Temperature Vitrification",
      desc: "Fired at temperatures exceeding 1200°C for exceptional density, guaranteeing liquid absorption rates strictly below 0.5%."
    },
    {
      icon: <Award className="w-6 h-6 text-black" />,
      title: "ISO-9001 Precision Standards",
      desc: "Adhering to strict international grading criteria, assuring perfect flatness, micro-calibrated thickness, and rectified square edges."
    },
    {
      icon: <Recycle className="w-6 h-6 text-black" />,
      title: "Sustainable Manufacturing",
      desc: "Employing energy-efficient gas kilns, recycled process water loops, and zero-waste raw material optimization cycles."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-black" />,
      title: "B2B Professional Freight",
      desc: "Delivering double-reinforced wooden crates directly to construction sites worldwide with break-resistant guarantees."
    }
  ];

  const dimensions = [
    {
      size: "600 x 1200 mm",
      type: "Vitrified Slabs",
      finishes: "High Gloss, Super High Gloss, Rocker HL, Surface Satin",
      bestFor: "Luxury interior flooring, commercial lobbies, and seamless feature walls."
    },
    {
      size: "600 x 600 mm",
      type: "Standard Floor Slabs",
      finishes: "Crystal Polish, Plain Wood Punch, Optimus Ruston Matt",
      bestFor: "High-traffic retail environments, living spaces, and heavy-duty patios."
    },
    {
      size: "195 x 1200 mm",
      type: "Woodee Planks",
      finishes: "Rustic Wood Punch, Satin Matt, Metal Strip Inlay",
      bestFor: "Organic wood looks, warmth-oriented guest suites, and moisture-prone decks."
    }
  ];

  return (
    <main className="relative min-h-screen pt-24 pb-20 overflow-hidden bg-slate-50/50">
      <BackgroundShapes />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">

          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-primary leading-none"
          >
            Crafting the Foundations of <span className="text-accent">Luxury</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-500 font-medium leading-relaxed"
          >
            Established in 2002, Sonata Ceramica emerged as the first ceramic floor tile manufacturing pioneer in Himatnagar, Gujarat. We fuse advanced European vitrified engineering with artistic design to elevate spaces globally.
          </motion.p>
        </div>
      </section>

      {/* Grid Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-panel p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100/80 flex items-center justify-center mb-6 group-hover:bg-slate-200/80 transition-colors duration-300">
                {item.icon}
              </div>
              <h3 className="font-extrabold text-lg text-primary mb-3 tracking-tight">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
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
                  <span className="text-3xl font-black text-black font-mono leading-none">25</span>
                  <div className="text-[10px] font-bold text-primary uppercase tracking-wider leading-tight">
                    Years of<br />Experience
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Narrative Narrative Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="space-y-3">
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
                  href="/tiles"
                  className="group inline-flex items-center space-x-2 px-5 py-3 bg-transparent hover:bg-primary/5 text-primary font-bold text-xs uppercase tracking-wider rounded-xl border border-primary/30 hover:border-primary/60 transition-all duration-300"
                >
                  <span>Know More</span>
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story & Legacy Timeline Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Legacy Sidebar */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 space-y-6 lg:sticky lg:top-28"
          >
            <span className="text-black font-bold text-xs uppercase tracking-widest">
              Brand Journey 
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight leading-none">
              Over Two Decades of Ceramic Inception
            </h2>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">
              From our landmark status as Himatnagar's very first floor tiles production unit in 2002, Sonata has continually broken the limits of clay and mineral synthesis.
            </p>
            <div className="p-6 rounded-2xl bg-primary text-white space-y-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center space-x-2 text-white font-bold text-xs uppercase tracking-wider">
                <Factory size={16} />
                <span>Himatnagar Factory Hub</span>
              </div>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Operating high-speed industrial kilns and automated dry-press molds powered by local, energy-efficient initiatives in Sabarkantha, Gujarat.
              </p>
            </div>
          </motion.div>

          {/* Timeline Milestones */}
          <div className="lg:col-span-8 space-y-10 pl-4 border-l border-slate-200">
            {milestones.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.08 }}
                className="relative pl-8 group"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-slate-300 border-2 border-white group-hover:bg-slate-500 transition-colors duration-300" />
                
                <div className="space-y-2">
                  <div className="flex items-baseline space-x-3">
                    <span className="text-2xl font-black text-accent font-mono tracking-tight leading-none">
                      {m.year}
                    </span>
                    <h3 className="font-extrabold text-lg text-primary tracking-tight">
                      {m.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
                    {m.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Product Library Dimension Spotlights */}
      <section className="bg-slate-50/60 py-24 border-y border-slate-200/50 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-xl space-y-4 mb-16">
            <span className="text-black font-bold text-xs uppercase tracking-widest block">
              Standard Dimensions
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary leading-tight">
              Calibrated Product Formats
            </h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              We design tiles meticulously sized and finished to meet strict architectural requirements, ensuring high vitrification across every dimension.
            </p>
          </div>

          <div className="flex flex-col w-full border-y border-slate-200/80 divide-y divide-slate-200/80">
            {dimensions.map((dim, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center hover:bg-slate-100/40 transition-colors duration-200 px-4 rounded-xl group/slat"
              >
                {/* Index Column */}
                <div className="lg:col-span-1">
                  <span className="text-lg font-black text-slate-300 font-mono tracking-tight group-hover/slat:text-accent transition-colors duration-200">
                    0{idx + 1}
                  </span>
                </div>

                {/* Dimension Details Column */}
                <div className="lg:col-span-3 space-y-1">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest block">
                    {dim.type}
                  </span>
                  <h3 className="text-2xl font-black tracking-tight text-primary font-mono leading-none">
                    {dim.size}
                  </h3>
                </div>

                {/* Available Finishes Column */}
                <div className="lg:col-span-4 space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                    Available Finishes
                  </span>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                    {dim.finishes}
                  </p>
                </div>

                {/* Applications Column */}
                <div className="lg:col-span-3 space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                    Ideal Applications
                  </span>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {dim.bestFor}
                  </p>
                </div>

                {/* Action Link Column */}
                <div className="lg:col-span-1 flex lg:justify-end">
                  <Link
                    href={`/tiles?dimension=${dim.size.replace(/\s+/g, "")}`}
                    className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-primary hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 group/arrow shadow-sm hover:shadow-md"
                    title={`Browse ${dim.size} Catalog`}
                  >
                    <ChevronRight size={18} className="transition-transform group-hover/arrow:translate-x-0.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>




      {/* Corporate Contact CTA */}
      <section className="max-w-5xl mx-auto px-6 py-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel p-12 md:p-16 rounded-3xl border border-slate-200/60 shadow-xl space-y-8 relative overflow-hidden text-center"
        >
          {/* Elegant top accent indicator line using the brand accent color strictly as a highlight */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/20 via-black to-accent/20" />
          
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight leading-tight">
              Ready to Partner on Your Next Development?
            </h2>
            <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed max-w-xl mx-auto font-sans">
              Whether you are an architect sourcing custom finishes or a developer specifying heavy-duty flooring slabs, our Himatnagar B2B corporate team is ready to ship samples.
            </p>
          </div>

          {/* Symmetrical Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all duration-300 group inline-flex items-center justify-center space-x-2"
            >
              <span>Get in Touch</span>
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            
            <Link
              href="/tiles"
              className="w-full sm:w-auto px-8 py-4 border-2 border-slate-200 hover:border-slate-300 text-primary font-bold rounded-xl hover:bg-slate-50 transition-all duration-300 inline-flex items-center justify-center"
            >
              Explore Showroom
            </Link>
          </div>

          {/* Minimal specs strip */}
          <div className="pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fast Dispatch</span>
              <span className="text-xs font-semibold text-slate-700 font-sans">Samples ship within 48 hours</span>
            </div>
            <div className="flex flex-col items-center space-y-1 border-y sm:border-y-0 sm:border-x border-slate-100 py-3 sm:py-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Asset Library</span>
              <span className="text-xs font-semibold text-slate-700 font-sans">High-fidelity CAD & BIM files</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Direct Shipping</span>
              <span className="text-xs font-semibold text-slate-700 font-sans">Sabarkantha logistics hub</span>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
