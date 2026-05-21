"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { dataService } from "@/lib/dataService";
import BackgroundShapes from "@/components/BackgroundShapes";
import { Eye, AlertTriangle, ArrowRight, Sparkles, ExternalLink, ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";

const ITEMS_PER_PAGE = 24;
const SERIES_PER_PAGE = 9;

export default function TilesMarketplace() {
  const [tiles, setTiles] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  // States
  const [selectedDim, setSelectedDim] = useState("600x1200"); // 600x600, 600x1200, 195x1200
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSeriesPage, setCurrentSeriesPage] = useState(1);

  useEffect(() => {
    async function loadData() {
      try {
        const tilesData = await dataService.getTiles();
        const seriesData = await dataService.getSeries();
        
        setTiles(tilesData);
        setSeries(seriesData);
      } catch (e) {
        console.error("Failed to load tiles catalog:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter series dynamically by selected dimension
  const currentSeriesList = series.filter(s => s.dimension === selectedDim);

  // Series pagination calculation
  const totalSeriesPages = Math.ceil(currentSeriesList.length / SERIES_PER_PAGE);
  const paginatedSeriesList = currentSeriesList.slice(
    (currentSeriesPage - 1) * SERIES_PER_PAGE,
    currentSeriesPage * SERIES_PER_PAGE
  );

  // Sync dimension change
  const handleDimChange = (dim) => {
    setSelectedDim(dim);
    setSelectedSeries(null); // Reset active series on dimension swap
    setCurrentPage(1);
    setCurrentSeriesPage(1); // Reset series page
  };

  const handleSeriesPageChange = (page) => {
    if (page >= 1 && page <= totalSeriesPages) {
      setCurrentSeriesPage(page);
      // Smooth scroll back to top of listings
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  // Map dimension to the correct CSS aspect-ratio value.
  // We use inline styles instead of dynamic Tailwind classes because Tailwind's
  // static scanner never sees runtime-constructed class strings and won't generate
  // the corresponding CSS — inline styles are always safe for dynamic values.
  const dimAspectStyle = {
    "600x600":  { aspectRatio: "1 / 1" },   // perfect square
    "600x1200": { aspectRatio: "1 / 2" },   // tall portrait slab
    "195x1200": { aspectRatio: "195 / 600" }, // narrow plank (true ratio normalised to visible height)
  };
  const cardStyle = dimAspectStyle[selectedDim] ?? { aspectRatio: "4 / 5" };

  // Filter tiles by selected series and dimension
  const activeTiles = selectedSeries
    ? tiles.filter(t => (t.dimension || "600x1200") === selectedDim && t.series === selectedSeries)
    : [];

  // Pagination calculation
  const totalPages = Math.ceil(activeTiles.length / ITEMS_PER_PAGE);
  const paginatedTiles = activeTiles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelectSeries = (seriesName) => {
    setSelectedSeries(seriesName);
    setCurrentPage(1); // Reset page to 1
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Smooth scroll back to top of listings
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  return (
    <main className="relative min-h-screen pt-28 pb-20 bg-slate-50/20 overflow-hidden">
      <BackgroundShapes />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <AnimatePresence mode="wait">
          {selectedSeries === null ? (
            /* ============================================================ */
            /* VIEW 1: CURATED SERIES COLLECTIONS GRID                      */
            /* ============================================================ */
            <motion.div
              key="series-catalog"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12"
            >
              {/* Page Header */}
              <div className="text-center space-y-4 max-w-3xl mx-auto">
                {/* <span className="text-accent font-bold text-xs uppercase tracking-widest bg-rose-50 border border-rose-100 px-3.5 py-1.5 rounded-full inline-block">
                  Vitrified Architectural Series
                </span> */}
                <h1 className="text-4xl md:text-6xl font-black text-primary tracking-tight leading-none">
                  Tiles Curation Marketplace
                </h1>
                <p className="text-slate-500 font-semibold text-sm md:text-base leading-relaxed">
                  Discover curated material concepts engineered for master developments. Browse by technical dimensional slabs to explore architectural portfolios.
                </p>
              </div>

              {/* Premium Tab Switcher for Dimensions */}
              <div className="flex justify-center">
                <div className="inline-flex p-1.5 bg-slate-100/80 backdrop-blur-md rounded-2xl border border-slate-200/40 shadow-xs">
                  {[
                    { id: "600x600", label: "600 x 600 mm", desc: "Square Slabs" },
                    { id: "600x1200", label: "600 x 1200 mm", desc: "Standard Premium" },
                    { id: "195x1200", label: "195 x 1200 mm", desc: "Wood Planks" }
                  ].map((dim) => {
                    const isSelected = selectedDim === dim.id;
                    return (
                      <button
                        key={dim.id}
                        onClick={() => handleDimChange(dim.id)}
                        className={`relative px-6 py-3 rounded-xl transition-all cursor-pointer text-center flex flex-col items-center justify-center min-w-[140px] md:min-w-[180px] ${
                          isSelected 
                            ? "bg-white text-primary shadow-sm border border-slate-200/50 font-black" 
                            : "text-slate-500 hover:text-primary font-bold"
                        }`}
                      >
                        <span className="text-xs md:text-sm tracking-tight">{dim.label}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{dim.desc}</span>
                        {isSelected && (
                          <motion.div
                            layoutId="active-dimension-pill"
                            className="absolute inset-0 border-2 border-black rounded-xl pointer-events-none"
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Series Listing Grid */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-36 space-y-4">
                  <div className="w-10 h-10 border-4 border-slate-200 border-t-black rounded-full animate-spin" />
                  <span className="text-sm text-slate-400 font-bold tracking-widest uppercase animate-pulse">
                    Refining Material Series...
                  </span>
                </div>
              ) : currentSeriesList.length === 0 ? (
                <div className="glass-panel p-20 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 shadow-xs max-w-2xl mx-auto border border-slate-200/50">
                  <AlertTriangle size={48} className="text-black animate-pulse" />
                  <h3 className="font-extrabold text-xl text-primary">No Series Defined</h3>
                  <p className="text-sm text-slate-500 font-semibold max-w-sm leading-relaxed">
                    There are no custom series registered for this dimension.
                  </p>
                </div>
              ) : (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {paginatedSeriesList.map((ser, index) => {
                      const seriesTiles = tiles.filter(t => (t.dimension || "600x1200") === selectedDim && t.series === ser.name);
                      const finishTypes = [...new Set(seriesTiles.map(t => t.finish || "Glossy"))];
                      
                      return (
                        <motion.div
                          key={ser.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                          onClick={() => handleSelectSeries(ser.name)}
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
                    })}
                  </div>

                  {/* Series Pagination Footer */}
                  {totalSeriesPages > 1 && (
                    <div className="flex flex-col items-center space-y-4 pt-6 border-t border-slate-200/60">
                      
                      <div className="flex items-center space-x-2">
                        {/* Previous Button */}
                        <button
                          onClick={() => handleSeriesPageChange(currentSeriesPage - 1)}
                          disabled={currentSeriesPage === 1}
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 shadow-2xs select-none ${
                            currentSeriesPage === 1
                              ? "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
                              : "bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:scale-105 active:scale-95 cursor-pointer"
                          }`}
                        >
                          <ChevronLeft size={16} />
                        </button>

                        {/* Numbered Pages */}
                        {Array.from({ length: totalSeriesPages }, (_, index) => {
                          const pageNum = index + 1;
                          const isActive = pageNum === currentSeriesPage;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handleSeriesPageChange(pageNum)}
                              className={`w-10 h-10 rounded-xl border flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 shadow-2xs cursor-pointer ${
                                isActive
                                  ? "bg-accent border-accent text-white scale-105 shadow-md shadow-accent/15"
                                  : "bg-white border-slate-200 text-slate-600 hover:text-primary hover:border-slate-300 hover:bg-slate-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        {/* Next Button */}
                        <button
                          onClick={() => handleSeriesPageChange(currentSeriesPage + 1)}
                          disabled={currentSeriesPage === totalSeriesPages}
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 shadow-2xs select-none ${
                            currentSeriesPage === totalSeriesPages
                              ? "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
                              : "bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:scale-105 active:scale-95 cursor-pointer"
                          }`}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>

                      {/* Pagination Description */}
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest select-none">
                        Page {currentSeriesPage} of {totalSeriesPages}
                      </span>

                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            /* ============================================================ */
            /* VIEW 2: PAGINATED PRODUCTS GRID VIEW (AMAZON/FLIPKART STYLE) */
            /* ============================================================ */
            <motion.div
              key="series-explorer-paginated"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              {/* Back Button & Curation Metadata Panel */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <button
                  onClick={() => setSelectedSeries(null)}
                  className="inline-flex items-center space-x-2.5 text-slate-600 hover:text-slate-900 font-extrabold text-xs uppercase tracking-widest bg-white hover:bg-slate-50 border border-slate-200/60 shadow-xs px-5 py-3 rounded-full transition-all duration-300 cursor-pointer group w-fit"
                >
                  <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1 text-slate-500" />
                  <span>Back to Series Curation</span>
                </button>

                <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100/65 backdrop-blur-md border border-slate-200/30 px-4 py-2 rounded-full w-fit">
                  <LayoutGrid size={13} className="text-accent" />
                  <span>Series: {selectedSeries}</span>
                  <span className="text-slate-300">|</span>
                  <span>Dim: {selectedDim} mm</span>
                </div>
              </div>

              {/* Page Section Title */}
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight">
                  {selectedSeries} Catalog
                </h2>
                <p className="text-slate-400 text-xs md:text-sm font-semibold uppercase tracking-wider">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, activeTiles.length)} of {activeTiles.length} Architectural Tiles
                </p>
              </div>

              {/* Product Grid */}
              {activeTiles.length === 0 ? (
                <div className="glass-panel p-20 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 shadow-xs max-w-2xl mx-auto border border-slate-200/50">
                  <AlertTriangle size={48} className="text-accent animate-pulse" />
                  <h3 className="font-extrabold text-xl text-primary">No Designs Registered</h3>
                  <p className="text-sm text-slate-500 font-semibold max-w-sm leading-relaxed">
                    No vitrified slabs are currently registered under the "{selectedSeries}" series.
                  </p>
                  <button
                    onClick={() => setSelectedSeries(null)}
                    className="px-6 py-3 bg-accent hover:opacity-90 text-white rounded-xl text-xs font-extrabold tracking-widest transition-all shadow-md cursor-pointer"
                  >
                    Return to Catalog
                  </button>
                </div>
              ) : (
                <div className="space-y-12">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <AnimatePresence mode="popLayout">
                      {paginatedTiles.map((tile) => (
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
                                href={`/tiles/${tile.id}`}
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
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Amazon/Flipkart-style Premium Pagination Footer */}
                  {totalPages > 1 && (
                    <div className="flex flex-col items-center space-y-4 pt-6 border-t border-slate-200/60">
                      
                      <div className="flex items-center space-x-2">
                        {/* Previous Button */}
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 shadow-2xs select-none ${
                            currentPage === 1
                              ? "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
                              : "bg-white border-slate-200 text-slate-505 hover:border-slate-400 hover:scale-105 active:scale-95 cursor-pointer"
                          }`}
                        >
                          <ChevronLeft size={16} />
                        </button>

                        {/* Numbered Pages */}
                        {Array.from({ length: totalPages }, (_, index) => {
                          const pageNum = index + 1;
                          const isActive = pageNum === currentPage;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-10 h-10 rounded-xl border flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 shadow-2xs cursor-pointer ${
                                isActive
                                  ? "bg-accent border-accent text-white scale-105 shadow-md shadow-accent/15"
                                  : "bg-white border-slate-200 text-slate-600 hover:text-primary hover:border-slate-300 hover:bg-slate-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        {/* Next Button */}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 shadow-2xs select-none ${
                            currentPage === totalPages
                              ? "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
                              : "bg-white border-slate-200 text-slate-505 hover:border-slate-400 hover:scale-105 active:scale-95 cursor-pointer"
                          }`}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>

                      {/* Pagination Description */}
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest select-none">
                        Page {currentPage} of {totalPages}
                      </span>

                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
