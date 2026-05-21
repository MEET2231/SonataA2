"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dataService } from "@/lib/dataService";
import BackgroundShapes from "@/components/BackgroundShapes";
import { Download, FileText, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function CataloguesPage() {
  const [catalogues, setCatalogues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Download Progress states
  const [downloadingId, setDownloadingId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [downloadSuccessId, setDownloadSuccessId] = useState(null);

  useEffect(() => {
    async function loadCatalogues() {
      try {
        const data = await dataService.getCatalogues();
        setCatalogues(data);
      } catch (e) {
        console.error("Failed to load catalogues:", e);
      } finally {
        setLoading(false);
      }
    }
    loadCatalogues();
  }, []);

  const handleDownload = (id, pdfUrl, title) => {
    if (downloadingId) return; // Prevent concurrent downloads

    setDownloadingId(id);
    setProgress(0);

    // Simulate direct secure binary stream download progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingId(null);
            setDownloadSuccessId(id);
            
            // Create direct file download trigger
            const link = document.createElement("a");
            link.href = pdfUrl.startsWith("http") ? pdfUrl : "#"; // Mock direct open if fallback
            link.target = "_blank";
            link.setAttribute("download", `${title.replace(/\s+/g, "_")}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clear success checkmark after 4 seconds
            setTimeout(() => setDownloadSuccessId(null), 4000);
          }, 400);
          return 100;
        }
        const chunk = Math.floor(Math.random() * 15) + 8;
        return Math.min(prev + chunk, 100);
      });
    }, 200);
  };

  return (
    <main className="relative min-h-screen pt-28 pb-20">
      <BackgroundShapes />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3 mb-16 text-left"
        >
          <h1 className="text-3xl md:text-5xl font-black text-primary tracking-tight leading-none">
            Catalogues Collection
          </h1>
          <p className="text-slate-500 font-medium text-sm max-w-2xl leading-relaxed">
            Gain direct access to our premium series magazine layouts and product specification manuals. Standardized for high-end architects, home layout planners, and B2B buyers.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-accent rounded-full animate-spin" />
            <span className="text-sm text-slate-400 font-bold tracking-widest uppercase">
              Assembling Magazine Covers...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {catalogues.map((cat, idx) => {
              const isDownloading = downloadingId === cat.id;
              const isSuccess = downloadSuccessId === cat.id;

              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: idx * 0.08 }}
                  className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-8 hover:shadow-md transition-shadow"
                >
                  {/* Spine-Book Container */}
                  <div className="book-container w-44 h-60 grow-0 shrink-0">
                    <div className="book w-full h-full shadow-lg rounded-r-md bg-primary-dark">
                      
                      {/* Cover Panel */}
                      <div className="book-cover absolute inset-0 w-full h-full rounded-r-md overflow-hidden bg-primary-light">
                        <img
                          src={cat.cover_image_url}
                          alt={cat.title}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Title text overlay inside cover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-4 flex flex-col justify-end text-white">
                          <h4 className="font-extrabold text-xs tracking-tight leading-tight">
                            {cat.title}
                          </h4>
                        </div>
                      </div>

                      {/* Cover spine shadows */}
                      <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-black/40 to-transparent z-10" />
                      
                      {/* 3D stacked pages */}
                      <div className="book-pages" />
                    </div>
                  </div>

                  {/* Document specifications and descriptions */}
                  <div className="flex flex-col justify-between h-full space-y-6 text-center sm:text-left">
                    
                    <div className="space-y-3">
                      <h3 className="font-black text-xl text-primary tracking-tight leading-snug">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    {/* Action buttons with progress bars */}
                    <div className="space-y-3 shrink-0 pt-4 border-t border-slate-100">
                      
                      {isDownloading ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-bold text-accent">
                            <span>Downloading Catalogue...</span>
                            <span>{progress}%</span>
                          </div>
                          {/* Progress Bar */}
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                            <motion.div
                              className="h-full bg-accent"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      ) : isSuccess ? (
                        <div className="w-full py-3 bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-500/10">
                          <CheckCircle2 size={16} />
                          <span>PDF Download Triggered</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDownload(cat.id, cat.pdf_url, cat.title)}
                          className="w-full px-5 py-3 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 hover:shadow-lg active:scale-98 transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm group"
                        >
                          <Download size={14} className="transition-transform group-hover:-translate-y-0.5" />
                          <span>Download Collection Catalogue</span>
                        </button>
                      )}


                    </div>

                  </div>

                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}
