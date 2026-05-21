"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { dataService } from "@/lib/dataService";
import { 
  ArrowLeft, Send, CheckCircle2, ChevronRight, HelpCircle, 
  AlertCircle, Sparkles, Layers, Info, ExternalLink
} from "lucide-react";

export default function TileDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tile, setTile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Magnifier State for raw slab
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });
  const containerRef = useRef(null);

  // Enquiry Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    message: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [shakeFields, setShakeFields] = useState({});

  useEffect(() => {
    async function loadTile() {
      if (!id) return;
      try {
        const data = await dataService.getTileById(id);
        if (data) {
          setTile(data);
        }
      } catch (e) {
        console.error("Failed to load tile detail:", e);
      } finally {
        setLoading(false);
      }
    }
    loadTile();
  }, [id]);

  // High-precision magnifying glass hover zoom
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: "block",
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "220%",
      backgroundImage: `url(${tile?.image_url})`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
  };

  // Enquiry Submission Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEnquiryForm(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!enquiryForm.userName.trim()) errors.userName = "Name is required.";
    
    if (!enquiryForm.userEmail.trim()) {
      errors.userEmail = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiryForm.userEmail)) {
      errors.userEmail = "Must contain @ and a domain (e.g. .com).";
    }

    if (!enquiryForm.userPhone.trim()) {
      errors.userPhone = "Phone number is required.";
    } else {
      const digits = enquiryForm.userPhone.replace(/\D/g, "");
      if (digits.length !== 10) {
        errors.userPhone = "Phone must be exactly 10 digits.";
      }
    }

    if (!enquiryForm.message.trim()) errors.message = "Message is required.";
    return errors;
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const nextShake = {};
      Object.keys(errors).forEach(key => {
        nextShake[key] = true;
      });
      setShakeFields(nextShake);
      setTimeout(() => setShakeFields({}), 2000);
      return;
    }

    setIsSubmitting(true);
    try {
      await dataService.addEnquiry({
        tile_name: tile?.name,
        user_name: enquiryForm.userName,
        user_email: enquiryForm.userEmail,
        user_phone: enquiryForm.userPhone,
        message: enquiryForm.message
      });
      
      setSubmitSuccess(true);
      setEnquiryForm({
        userName: "",
        userEmail: "",
        userPhone: "",
        message: ""
      });
      
      setTimeout(() => {
        setModalOpen(false);
        setSubmitSuccess(false);
      }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExternalLinkClick = () => {
    if (tile?.external_link && tile.external_link.trim() !== "") {
      let url = tile.external_link.trim();
      if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      // Prefill query for 3D request in corporate enquiry modal
      setEnquiryForm(prev => ({
        ...prev,
        message: `Hello, I am interested in viewing the 3D visualizer representation and receiving specs/samples for ${tile?.name || "this tile design"}. Please provide a 3D simulation link and quote.`
      }));
      setModalOpen(true);
    }
  };

  // Helper function to dynamically resolve catalog theme colors based on tile name & details
  const getTileTheme = (t) => {
    if (!t) return {};
    const name = (t.name || "").toLowerCase();
    const description = (t.description || "").toLowerCase();
    const matchId = (t.id || t.name || "default").toString();

    // Priority 1: Smart Keyword overrides for exact color matching
    const isForcedLight = 
      name.includes("white") || 
      name.includes("mint") || 
      name.includes("gold") || 
      name.includes("crema") || 
      name.includes("oak") ||
      name.includes("beige") ||
      name.includes("light") ||
      name.includes("ivory") ||
      name.includes("snow") ||
      description.includes("white") ||
      description.includes("creamy") ||
      description.includes("light");

    const isForcedDark =
      name.includes("grey") ||
      name.includes("gray") ||
      name.includes("antracita") ||
      name.includes("anthracite") ||
      name.includes("black") ||
      name.includes("sapphire") ||
      name.includes("dark") ||
      name.includes("slate") ||
      description.includes("grey") ||
      description.includes("dark") ||
      description.includes("black");

    // Priority 2: Deterministic hash distribution for rubbish names or unknown color names
    let themeIndex = 0;
    if (isForcedLight) {
      themeIndex = 0; // Tan-Beige Brochure theme
    } else if (isForcedDark) {
      themeIndex = 1; // Slate-Grey Brochure theme
    } else {
      // Create a deterministic hash from the tile id/name to pick one of the 4 gorgeous themes
      let hash = 0;
      for (let i = 0; i < matchId.length; i++) {
        hash = matchId.charCodeAt(i) + ((hash << 5) - hash);
      }
      themeIndex = Math.abs(hash) % 4; // Safely resolves to 0, 1, 2, or 3
    }

    if (themeIndex === 0) {
      // 1. Warm Tan/Beige Theme (#c29979)
      return {
        isLight: true,
        bgClass: "bg-[#c29979] text-white",
        circleBg: "bg-[#4a3629] text-white border-white/10",
        circleText: "text-white",
        cardBg: "bg-[#483c32] text-white border-[#5c4d42]/30 shadow-2xl",
        textAccent: "text-[#eac39d]",
        textMuted: "text-slate-300",
        tableRowOdd: "bg-white/[0.04]",
        tableRowEven: "bg-[#3e332a]/45",
        tableBorder: "border-white/10",
        btnPrimary: "bg-[#eac39d] hover:bg-[#f2d2b5] text-[#4a3629] font-black",
        btnSecondary: "border-2 border-white/20 text-white hover:bg-white/10",
        seriesAccent: "text-[#ebd0b5]",
        modalBg: "bg-[#483c32] border border-white/15 text-white",
        modalInputBg: "bg-white/5 border border-white/10 text-white focus:border-[#eac39d]",
        modalTextMuted: "text-slate-300",
        modalBtn: "bg-[#eac39d] hover:bg-[#ebd0b5] text-[#4a3629] border-[#eac39d]/20",
        modalLabel: "text-[#eac39d]"
      };
    } else if (themeIndex === 1) {
      // 2. Sophisticated Slate-Grey Theme (#595d5f)
      return {
        isLight: false,
        bgClass: "bg-[#595d5f] text-[#332211]",
        circleBg: "bg-[#eac39d] text-[#332211] border-black/5",
        circleText: "text-[#4a3629]",
        cardBg: "bg-[#f5dec8] text-[#332211] border-[#e1c5ab]/30 shadow-2xl",
        textAccent: "text-[#4a3629]",
        textMuted: "text-slate-700",
        tableRowOdd: "bg-black/[0.04]",
        tableRowEven: "bg-[#ebcca9]/45",
        tableBorder: "border-black/10",
        btnPrimary: "bg-[#4a3629] hover:bg-[#5a4639] text-white font-black",
        btnSecondary: "border-2 border-[#4a3629]/20 text-[#4a3629] hover:bg-black/10",
        seriesAccent: "text-[#4a3629]",
        modalBg: "bg-[#f5dec8] border border-[#4a3629]/15 text-[#332211]",
        modalInputBg: "bg-black/5 border border-[#4a3629]/10 text-[#332211] focus:border-[#4a3629]",
        modalTextMuted: "text-slate-700",
        modalBtn: "bg-[#4a3629] hover:bg-[#5a4639] text-white border-[#4a3629]/20",
        modalLabel: "text-[#4a3629]"
      };
    } else if (themeIndex === 2) {
      // 3. Earthy Sage-Green Theme (#708075)
      return {
        isLight: true,
        bgClass: "bg-[#708075] text-white",
        circleBg: "bg-[#2e3a34] text-white border-white/10",
        circleText: "text-white",
        cardBg: "bg-[#2d3531] text-white border-white/10 shadow-2xl",
        textAccent: "text-[#c8d6cd]",
        textMuted: "text-slate-300",
        tableRowOdd: "bg-white/[0.04]",
        tableRowEven: "bg-[#1f2623]/45",
        tableBorder: "border-white/10",
        btnPrimary: "bg-[#c8d6cd] hover:bg-[#d8e6dd] text-[#2e3a34] font-black",
        btnSecondary: "border-2 border-white/20 text-white hover:bg-white/10",
        seriesAccent: "text-[#c8d6cd]",
        modalBg: "bg-[#2d3531] border border-white/15 text-white",
        modalInputBg: "bg-white/5 border border-white/10 text-white focus:border-[#c8d6cd]",
        modalTextMuted: "text-slate-300",
        modalBtn: "bg-[#c8d6cd] hover:bg-[#d8e6dd] text-[#2e3a34] border-[#c8d6cd]/20",
        modalLabel: "text-[#c8d6cd]"
      };
    } else {
      // 4. Rich Terracotta/Clay Theme (#b87d67)
      return {
        isLight: true,
        bgClass: "bg-[#b87d67] text-white",
        circleBg: "bg-[#3d261c] text-white border-white/10",
        circleText: "text-white",
        cardBg: "bg-[#402a20] text-white border-white/10 shadow-2xl",
        textAccent: "text-[#edd3c9]",
        textMuted: "text-slate-300",
        tableRowOdd: "bg-white/[0.04]",
        tableRowEven: "bg-[#2c1d16]/45",
        tableBorder: "border-white/10",
        btnPrimary: "bg-[#edd3c9] hover:bg-[#fde3d9] text-[#3d261c] font-black",
        btnSecondary: "border-2 border-white/20 text-white hover:bg-white/10",
        seriesAccent: "text-[#edd3c9]",
        modalBg: "bg-[#402a20] border border-white/15 text-white",
        modalInputBg: "bg-white/5 border border-white/10 text-white focus:border-[#edd3c9]",
        modalTextMuted: "text-slate-300",
        modalBtn: "bg-[#edd3c9] hover:bg-[#fde3d9] text-[#3d261c] border-[#edd3c9]/20",
        modalLabel: "text-[#edd3c9]"
      };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 pt-20 bg-[#121315] text-slate-400">
        <div className="w-10 h-10 border-4 border-slate-800 border-t-[#c29979] rounded-full animate-spin" />
        <span className="text-sm font-bold tracking-widest uppercase text-slate-400/80">
          Loading catalog brochure...
        </span>
      </div>
    );
  }

  if (!tile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-4 pt-20 bg-[#121315] text-slate-400">
        <h3 className="font-extrabold text-2xl text-rose-500">Tile Design Not Found</h3>
        <p className="text-slate-500 font-medium">The requested spec sheet could not be located in our records.</p>
        <Link href="/tiles" className="px-6 py-2.5 bg-[#c29979] text-white text-xs font-bold rounded-lg hover:bg-[#b08766] transition-all">
          Return to Showroom
        </Link>
      </div>
    );
  }

  const theme = getTileTheme(tile);
  const formattedDim = (tile.dimension || "600x1200").toUpperCase() + "MM";

  // Compute the correct aspect ratio from the tile's actual physical dimension
  // so images are never cropped or squashed on the inspect page.
  const tileAspectStyle = (() => {
    const d = tile.dimension || "600x1200";
    if (d === "600x600")  return { aspectRatio: "1 / 1" };
    if (d === "195x1200") return { aspectRatio: "195 / 1200" };
    return { aspectRatio: "1 / 2" }; // 600x1200 default
  })();

  // Dynamic DDL Spec Sheet Deductions (Not Hard-Coded)
  const resolvedThickness = tile.thickness 
    ? (tile.thickness.toLowerCase().includes("calibrated") ? tile.thickness : `${tile.thickness} Calibrated`) 
    : "12mm Calibrated";

  const getResolvedMaterial = (t) => {
    if (t.specs?.material) return t.specs.material;
    const dim = (t.dimension || "").toLowerCase();
    const loc = (t.location || "").toLowerCase();
    if (dim.includes("195")) return "Vitrified Porcelain (Wood Look)";
    if (loc.includes("wall")) return "Monocottura Ceramic";
    return "Glazed Vitrified";
  };
  const resolvedMaterial = getResolvedMaterial(tile);

  const resolvedFinish = tile.specs?.finish || (tile.finish ? `${tile.finish} ` : "Glossy");

  const resolvedSizes = tile.specs?.size || (tile.dimension ? `${tile.dimension.toLowerCase()}mm` : "600x1200mm");

  return (
    <main className="relative min-h-screen bg-[#111215] text-slate-100 pt-28 pb-20 overflow-x-hidden font-sans">
      
      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Breadcrumb Navigation - Muted Elegant */}
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500/80 uppercase tracking-widest mb-6">
          <Link href="/tiles" className="hover:text-[#c29979] transition-colors flex items-center space-x-1">
            <ArrowLeft size={12} />
            <span>Showroom</span>
          </Link>
          <ChevronRight size={12} className="text-slate-600" />
          <span className="text-slate-400 tracking-wide">{tile.name} Catalog Sheet</span>
        </div>

        {/* The Catalog Brochure Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`w-full rounded-[24px] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.75)] border border-white/5 relative ${theme.bgClass} transition-colors duration-500`}
        >
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
            
            {/* LEFT COLUMN: Official Logo, Overlay Slab Showcase & Dynamic Series Index */}
            <div className="lg:col-span-5 relative flex flex-col justify-between pt-8 pb-10 px-6 sm:px-8 border-b lg:border-b-0 lg:border-r border-white/10">
              
              {/* 1. Official Brand Logo at Top Left */}
              <div className="absolute top-6 left-6 z-20 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-sm">
                <img
                  src="/SONATA LOGO.png"
                  alt="Sonata Tiles Logo"
                  className="h-7 w-auto object-contain"
                />
              </div>
              
              {/* 2. Overlapping Slab Spec Group */}
              <div className="relative w-full max-w-[380px] aspect-[4/5] mx-auto flex items-center justify-center mt-12 mb-6">
                
                {/* Large overlapping circle with specs */}
                <div className={`w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] rounded-full absolute right-0 top-10 flex flex-col justify-center pl-[125px] sm:pl-[145px] pr-4 shadow-xl border ${theme.circleBg} ${theme.circleText} z-0 transition-all duration-500`}>
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <span className="block text-[7.5px] sm:text-[8px] uppercase tracking-widest opacity-60 font-black">Design Name</span>
                      <h2 className="text-xs sm:text-lg font-black uppercase tracking-tight leading-tight">
                        {tile.name}
                      </h2>
                    </div>
                    <div>
                      <span className="block text-[7.5px] sm:text-[8px] uppercase tracking-widest opacity-60 font-black">Finish</span>
                      <span className="text-[10px] sm:text-xs font-black uppercase">{tile.finish || "GLOSSY"}</span>
                    </div>
                    <div>
                      <span className="block text-[7.5px] sm:text-[8px] uppercase tracking-widest opacity-60 font-black">Size</span>
                      <span className="text-[10px] sm:text-xs font-black uppercase">{formattedDim}</span>
                    </div>
                    <div>
                      <span className="block text-[7.5px] sm:text-[8px] uppercase tracking-widest opacity-60 font-black">Random</span>
                      <span className="text-[10px] sm:text-xs font-black uppercase">{tile.random_faces || "03"}</span>
                    </div>
                  </div>
                </div>

                {/* The Slab Image Frame with high-fidelity magnifying hover zoom */}
                <div
                   style={tileAspectStyle}
                   className="absolute left-2 z-10 w-[140px] sm:w-[165px] rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.55)] border-[4px] border-white/20 group transition-transform duration-500 hover:scale-[1.02]">
                  <div 
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="w-full h-full cursor-zoom-in relative bg-[#131b15]"
                  >
                    <img
                      src={tile.image_url}
                      alt={tile.name}
                      className="w-full h-full object-cover transition-transform duration-300"
                    />
                    {/* Floating Magnifier Window Overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none transition-opacity duration-200 border border-white/25"
                      style={{
                        ...zoomStyle,
                        backgroundRepeat: "no-repeat"
                      }}
                    />
                  </div>
                  
                  {/* Zoom guide overlay badge */}
                  <div className="absolute bottom-2 left-2 right-2 z-10 bg-black/80 backdrop-blur-md px-2 py-1.5 rounded-lg text-[8px] font-bold text-white flex items-center justify-center space-x-1 shadow-md pointer-events-none transition-opacity group-hover:opacity-0">
                    <HelpCircle size={10} className="text-[#eac39d] animate-pulse" />
                    <span className="tracking-wide">Hover to Magnify</span>
                  </div>
                </div>

              </div>

              {/* 3. Bottom Dynamic Series/Collection Layout */}
              <div className="w-full flex items-end justify-between px-2 mt-4 space-x-4">
                <div className="flex-1">
                  <span className="block text-[8px] uppercase tracking-widest font-black text-white/50 mb-0.5">series</span>
                  <h3 className="font-serif italic text-xl sm:text-2xl text-white font-medium leading-none drop-shadow-sm">
                    {tile.series || "Iconic"} <span className="font-sans font-normal text-[10px] sm:text-xs tracking-wider uppercase block not-italic mt-0.5 text-white/80">Series Collection</span>
                  </h3>
                </div>

                <div className="flex flex-col items-end space-y-2.5 flex-shrink-0">
                  

                  {/* BACK TO INDEX button style */}
                  <Link 
                    href="/tiles" 
                    className="px-3.5 py-1.5 bg-black/20 hover:bg-black/35 border border-white/15 rounded-full text-[8.5px] font-black uppercase tracking-widest text-white flex items-center space-x-1 transition-all duration-300 shadow-sm"
                  >
                    <ArrowLeft size={9} />
                    <span>BACK TO INDEX</span>
                  </Link>
                </div>
              </div>

              {/* 4. Technical Specifications Card — moved to left column */}
              <div className={`w-full rounded-2xl border p-5 sm:p-6 space-y-4 mt-4 ${theme.cardBg}`}>

                {/* Specifications Table */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-1.5 pb-1 border-b border-current/15">
                    <Layers size={13} className={theme.textAccent} />
                    <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-wider">Technical Specifications</h4>
                  </div>
                  <table className="w-full text-left border-collapse text-[10px] sm:text-xs">
                    <tbody>
                      <tr className={`border-b ${theme.tableBorder} ${theme.tableRowOdd}`}>
                        <td className="py-2.5 px-3 font-bold opacity-60 uppercase w-5/12">Thickness</td>
                        <td className="py-2.5 px-3 font-black text-right sm:text-left">{resolvedThickness}</td>
                      </tr>
                      <tr className={`border-b ${theme.tableBorder} ${theme.tableRowEven}`}>
                        <td className="py-2.5 px-3 font-bold opacity-60 uppercase">Material</td>
                        <td className="py-2.5 px-3 font-black text-right sm:text-left">{resolvedMaterial}</td>
                      </tr>
                      <tr className={`border-b ${theme.tableBorder} ${theme.tableRowOdd}`}>
                        <td className="py-2.5 px-3 font-bold opacity-60 uppercase">Finishing</td>
                        <td className="py-2.5 px-3 font-black text-right sm:text-left">{resolvedFinish}</td>
                      </tr>
                      <tr className={`${theme.tableRowEven}`}>
                        <td className="py-2.5 px-3 font-bold opacity-60 uppercase">Sizes</td>
                        <td className={`py-2.5 px-3 font-black text-right sm:text-left ${theme.textAccent}`}>{resolvedSizes}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Design Narrative */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center space-x-1.5 pb-1 border-b border-current/15">
                    <Info size={13} className={theme.textAccent} />
                    <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-wider">Design Narrative</h4>
                  </div>
                  <p className="text-[10.5px] sm:text-xs font-semibold leading-relaxed opacity-90 pl-1">
                    {tile.description || "A masterclass in modern vitrification technology, this slab exhibits organic textures, pristine colors, and architectural detailing ideal for premium installations."}
                  </p>
                </div>

                {/* CTA Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleExternalLinkClick}
                    className={`px-3.5 py-3 rounded-xl text-[9px] sm:text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center space-x-1 cursor-pointer shadow-md ${theme.btnPrimary}`}
                  >
                    <Sparkles size={11} />
                    <span>{tile.external_link ? "Open 3D Viewer" : "Request 3D Link"}</span>
                  </button>
                  <button
                    onClick={() => setModalOpen(true)}
                    className={`px-3.5 py-3 rounded-xl text-[9px] sm:text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center space-x-1 cursor-pointer ${theme.btnSecondary}`}
                  >
                    <Send size={11} />
                    <span>Enquire Specs</span>
                  </button>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: Tile Showcase, Pattern Repeat & Specifications Card */}
            <div className="lg:col-span-7 flex flex-col p-6 sm:p-8 space-y-5">

              {/* 1. Large Full-Width Tile Showcase */}
              <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-[#0d0f10] flex items-center justify-center" style={{ minHeight: "220px" }}>
                <img
                  src={tile.image_url}
                  alt={tile.name}
                  className="w-full object-contain max-h-[320px]"
                />
                {/* Overlaid spec badges - top row */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full shadow-sm">
                    {tile.series || "Designer Series"}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/80 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full shadow-sm">
                    {(tile.dimension || "600x1200").toUpperCase()} MM
                  </span>
                </div>
                {/* Overlaid spec badges - bottom row */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/80 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full shadow-sm">
                    {tile.finish || "Glossy"} Finish
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/80 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full shadow-sm">
                    {tile.location || "Indoor"}
                  </span>
                </div>
              </div>

              {/* 2. Pattern Repeat Grid — how the tile looks when installed at scale */}
              <div className="space-y-2">
                <span className="text-[8px] font-black uppercase tracking-widest opacity-40 block">
                  Pattern Repeat Simulation — {tile.random_faces || "01"} Random {Number(tile.random_faces) === 1 ? "Face" : "Faces"}
                </span>
                <div
                  className="grid gap-0.5 rounded-xl overflow-hidden border border-white/10 shadow-md"
                  style={{
                    gridTemplateColumns:
                      tile.dimension === "600x600"  ? "repeat(4, 1fr)" :
                      tile.dimension === "195x1200" ? "repeat(6, 1fr)" :
                                                      "repeat(3, 1fr)"   // 600x1200 default
                  }}
                >
                  {Array.from({
                    length:
                      tile.dimension === "600x600"  ? 8  :   // 4×2
                      tile.dimension === "195x1200" ? 12 :   // 6×2 — narrow planks
                                                      6       // 3×2 for 600x1200
                  }).map((_, i) => (
                    <div
                      key={i}
                      style={tileAspectStyle}
                      className="overflow-hidden w-full"
                    >
                      <img
                        src={tile.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                        style={{ transform: i % 2 === 0 ? "none" : "scaleX(-1)" }}
                      />
                    </div>
                  ))}
                </div>
              </div>



            </div>

          </div>

        </motion.div>

      </div>

      {/* Dynamic Themed B2B Enquiry Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            
            {/* Dark glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setModalOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden z-10 p-6 sm:p-7 ${theme.modalBg}`}
            >
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-current/10 mb-5">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-60">
                    B2B Spec Sheet Request
                  </span>
                  <h3 className="font-serif italic text-lg sm:text-xl font-bold leading-none">
                    Specifications Enquiry
                  </h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  disabled={isSubmitting}
                  className="text-current opacity-60 hover:opacity-100 font-bold text-xl focus:outline-none transition-colors cursor-pointer"
                >
                  &times;
                </button>
              </div>

              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-6 text-center space-y-2.5"
                >
                  <CheckCircle2 size={40} className="text-emerald-500 animate-bounce" />
                  <h4 className="font-extrabold text-sm uppercase tracking-wider">Enquiry Submitted</h4>
                  <p className={`text-[11px] font-semibold leading-relaxed max-w-[240px] ${theme.modalTextMuted}`}>
                    Your query has been recorded. Our architectural consultant will contact you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-3.5">
                  
                  {/* Tile Name */}
                  <div className="space-y-1">
                    <label className="text-[8.5px] font-black uppercase tracking-wider opacity-60">
                      Selected Tile
                    </label>
                    <input
                      type="text"
                      value={tile.name}
                      disabled
                      className={`w-full px-3.5 py-2 rounded-lg text-xs font-bold uppercase cursor-not-allowed opacity-65 ${theme.modalInputBg}`}
                    />
                  </div>

                  {/* User Name */}
                  <div className={`space-y-1 ${shakeFields.userName ? "animate-shake" : ""}`}>
                    <label className="text-[8.5px] font-black uppercase tracking-wider opacity-70 flex justify-between">
                      <span>Full Name *</span>
                      {formErrors.userName && (
                        <span className="text-rose-500 text-[8px] font-bold flex items-center space-x-0.5 lowercase">
                          <AlertCircle size={8} />
                          <span>{formErrors.userName}</span>
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="userName"
                      value={enquiryForm.userName}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      className={`w-full px-3.5 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 transition-all ${
                        formErrors.userName
                          ? "border-rose-500 focus:ring-rose-500"
                          : theme.modalInputBg
                      }`}
                    />
                  </div>

                  {/* User Email */}
                  <div className={`space-y-1 ${shakeFields.userEmail ? "animate-shake" : ""}`}>
                    <label className="text-[8.5px] font-black uppercase tracking-wider opacity-70 flex justify-between">
                      <span>Corporate Email *</span>
                      {formErrors.userEmail && (
                        <span className="text-rose-500 text-[8px] font-bold flex items-center space-x-0.5 lowercase">
                          <AlertCircle size={8} />
                          <span>{formErrors.userEmail}</span>
                        </span>
                      )}
                    </label>
                    <input
                      type="email"
                      name="userEmail"
                      value={enquiryForm.userEmail}
                      onChange={handleInputChange}
                      placeholder="e.g. buyer@company.com"
                      className={`w-full px-3.5 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 transition-all ${
                        formErrors.userEmail
                          ? "border-rose-500 focus:ring-rose-500"
                          : theme.modalInputBg
                      }`}
                    />
                  </div>

                  {/* User Phone */}
                  <div className={`space-y-1 ${shakeFields.userPhone ? "animate-shake" : ""}`}>
                    <label className="text-[8.5px] font-black uppercase tracking-wider opacity-70 flex justify-between">
                      <span>Phone Number *</span>
                      {formErrors.userPhone && (
                        <span className="text-rose-500 text-[8px] font-bold flex items-center space-x-0.5 lowercase">
                          <AlertCircle size={8} />
                          <span>{formErrors.userPhone}</span>
                        </span>
                      )}
                    </label>
                    <input
                      type="tel"
                      name="userPhone"
                      value={enquiryForm.userPhone}
                      onChange={handleInputChange}
                      placeholder="e.g. 5551234567"
                      className={`w-full px-3.5 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 transition-all ${
                        formErrors.userPhone
                          ? "border-rose-500 focus:ring-rose-500"
                          : theme.modalInputBg
                      }`}
                    />
                  </div>

                  {/* Message Box */}
                  <div className={`space-y-1 ${shakeFields.message ? "animate-shake" : ""}`}>
                    <label className="text-[8.5px] font-black uppercase tracking-wider opacity-70 flex justify-between">
                      <span>Details & Project Volume *</span>
                      {formErrors.message && (
                        <span className="text-rose-500 text-[8px] font-bold flex items-center space-x-0.5 lowercase">
                          <AlertCircle size={8} />
                          <span>{formErrors.message}</span>
                        </span>
                      )}
                    </label>
                    <textarea
                      name="message"
                      value={enquiryForm.message}
                      onChange={handleInputChange}
                      rows="2.5"
                      placeholder="Approximate square footage or design notes..."
                      className={`w-full px-3.5 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 transition-all resize-none ${
                        formErrors.message
                          ? "border-rose-500 focus:ring-rose-500"
                          : theme.modalInputBg
                      }`}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md ${theme.modalBtn}`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>Routing Query...</span>
                        </>
                      ) : (
                        <>
                          <Send size={12} />
                          <span>Submit Request</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}

            </motion.div>

          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
