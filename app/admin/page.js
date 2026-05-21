"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dataService } from "@/lib/dataService";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import BackgroundShapes from "@/components/BackgroundShapes";
import { 
  Plus, Trash2, ShieldAlert, Key, FolderOpen, Layers, 
  BookOpen, Inbox, LogOut, CheckCircle2, AlertTriangle, FileUp, Link as LinkIcon
} from "lucide-react";

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("tiles"); // tiles, series, catalogues, enquiries
  
  // Login Form
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Core Data
  const [tiles, setTiles] = useState([]);
  const [series, setSeries] = useState([]);
  const [catalogues, setCatalogues] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [tileForm, setTileForm] = useState({
    name: "",
    description: "",
    location: ["Indoor"],
    thickness: "10mm",
    dimension: "600x1200",
    series: "",
    finish: "Glossy",
    random_faces: "03",
    external_link: ""
  });
  const [tileImage, setTileImage] = useState(null);
  const [seriesImage, setSeriesImage] = useState(null);

  const [seriesForm, setSeriesForm] = useState({
    name: "",
    dimension: "600x1200"
  });

  const [catForm, setCatForm] = useState({
    title: "",
    description: "",
    dimension: "600x1200"
  });
  const [catCover, setCatCover] = useState(null);
  const [catPdf, setCatPdf] = useState(null);

  // Operation States
  const [actionSuccess, setActionSuccess] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Load Admin Data on login
  useEffect(() => {
    if (!isAuthenticated) return;
    
    async function loadAdminData() {
      setLoading(true);
      try {
        const tilesData = await dataService.getTiles();
        const seriesData = await dataService.getSeries();
        const catsData = await dataService.getCatalogues();
        const enqsData = await dataService.getEnquiries();
        
        setTiles(tilesData);
        setSeries(seriesData);
        setCatalogues(catsData);
        setEnquiries(enqsData);

        // Prepopulate first series for tileForm
        const initialSeries = seriesData.filter(s => s.dimension === "600x1200");
        if (initialSeries.length > 0) {
          setTileForm(prev => ({ ...prev, series: initialSeries[0].name }));
        }
      } catch (e) {
        console.error("Failed to load admin dashboard data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, [isAuthenticated]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password
        });
        
        if (error) {
          setLoginError(error.message);
          setIsLoggingIn(false);
          return;
        }
        setIsAuthenticated(true);
      } catch (err) {
        setLoginError("Connection to authentication server failed.");
        console.error(err);
      } finally {
        setIsLoggingIn(false);
      }
    } else {
      // Local fallback mode
      setTimeout(() => {
        if (credentials.email === "admin@sonata.com" && credentials.password === "admin2026") {
          setIsAuthenticated(true);
        } else {
          setLoginError("Invalid administrator credentials. Access Denied.");
        }
        setIsLoggingIn(false);
      }, 800);
    }
  };

  // Add Tile Handler
  const handleAddTile = async (e) => {
    e.preventDefault();
    if (!tileForm.name.trim()) return;

    // Validate that a series exists
    if (!tileForm.series) {
      setActionError("Cannot create a tile without an associated series. Create a series first!");
      setTimeout(() => setActionError(""), 5500);
      return;
    }

    setActionLoading(true);
    setActionSuccess("");
    setActionError("");

    try {
      const tilePayload = { ...tileForm, location: tileForm.location.join(", ") };
      const newTile = await dataService.addTile(tilePayload, tileImage);
      setTiles(prev => [newTile, ...prev]);
      
      // Reset Form
      setTileForm({
        name: "",
        description: "",
        location: ["Indoor"],
        thickness: "10mm",
        dimension: tileForm.dimension,
        series: tileForm.series,
        finish: "Glossy",
        random_faces: "03",
        external_link: ""
      });
      setTileImage(null);
      // Clear file inputs manually
      const fileInput = document.getElementById("tile-image-input");
      if (fileInput) fileInput.value = "";

      setActionSuccess("Product tile created successfully.");
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      console.error(err);
      setActionError(err.message || "Failed to create product tile.");
      setTimeout(() => setActionError(""), 5500);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Tile
  const handleDeleteTile = async (id, imageUrl) => {
    if (!confirm("Are you sure you want to delete this design template?")) return;
    setActionSuccess("");
    setActionError("");
    
    try {
      await dataService.removeTile(id, imageUrl);
      setTiles(prev => prev.filter(item => item.id !== id));
      
      setActionSuccess("Product tile deleted successfully.");
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      console.error(err);
      setActionError(err.message || "Failed to delete product tile.");
      setTimeout(() => setActionError(""), 5500);
    }
  };

  // Add Series
  const handleAddSeries = async (e) => {
    e.preventDefault();
    if (!seriesForm.name.trim()) return;

    setActionLoading(true);
    setActionSuccess("");
    setActionError("");

    try {
      const newSeries = await dataService.addSeries(seriesForm, seriesImage);
      setSeries(prev => [...prev, newSeries]);

      setSeriesForm({
        name: "",
        dimension: seriesForm.dimension
      });
      setSeriesImage(null);
      
      const fileIn = document.getElementById("series-image-input");
      if (fileIn) fileIn.value = "";

      // Update tileForm's series if it was empty
      if (!tileForm.series && tileForm.dimension === seriesForm.dimension) {
        setTileForm(prev => ({ ...prev, series: seriesForm.name }));
      }

      setActionSuccess("Series collection added successfully.");
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      console.error(err);
      setActionError(err.message || "Failed to add series.");
      setTimeout(() => setActionError(""), 5500);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Series (cascade: deletes all tiles in that series too)
  const handleDeleteSeries = async (id) => {
    const targetSeries = series.find(s => s.id === id);
    if (!targetSeries) return;

    const seriesName = targetSeries.name;
    const tileCount = tiles.filter(t => t.series === seriesName).length;

    const warningMsg = tileCount > 0
      ? `⚠️ This series "${seriesName}" has ${tileCount} tile${tileCount > 1 ? "s" : ""}.\n\nALL ${tileCount} tile${tileCount > 1 ? "s" : ""} will be PERMANENTLY DELETED along with the series.\n\nThis action cannot be undone. Continue?`
      : `Delete the series "${seriesName}"? This action cannot be undone.`;

    if (!confirm(warningMsg)) return;
    setActionSuccess("");
    setActionError("");

    try {
      await dataService.removeSeries(id, seriesName);
      setSeries(prev => prev.filter(item => item.id !== id));
      // Also remove cascaded tiles from local state
      if (tileCount > 0) {
        setTiles(prev => prev.filter(t => t.series !== seriesName));
      }

      setActionSuccess(
        tileCount > 0
          ? `Series "${seriesName}" and ${tileCount} tile${tileCount > 1 ? "s" : ""} permanently deleted.`
          : `Series "${seriesName}" deleted successfully.`
      );
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      console.error(err);
      setActionError(err.message || "Failed to delete series.");
      setTimeout(() => setActionError(""), 5500);
    }
  };

  // Add Catalogue
  const handleAddCatalogue = async (e) => {
    e.preventDefault();
    if (!catForm.title.trim()) return;

    setActionLoading(true);
    setActionSuccess("");
    setActionError("");

    try {
      const newCat = await dataService.addCatalogue(catForm, catCover, catPdf);
      setCatalogues(prev => [newCat, ...prev]);

      setCatForm({
        title: "",
        description: "",
        dimension: "600x1200"
      });
      setCatCover(null);
      setCatPdf(null);
      
      // Clear files
      const coverIn = document.getElementById("cover-input");
      if (coverIn) coverIn.value = "";
      const pdfIn = document.getElementById("pdf-input");
      if (pdfIn) pdfIn.value = "";

      setActionSuccess("Catalogue collection added successfully.");
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      console.error(err);
      setActionError(err.message || "Failed to add catalogue.");
      setTimeout(() => setActionError(""), 5500);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Catalogue
  const handleDeleteCatalogue = async (id, coverUrl, pdfUrl) => {
    if (!confirm("Are you sure you want to purge this catalogue?")) return;
    setActionSuccess("");
    setActionError("");

    try {
      await dataService.removeCatalogue(id, coverUrl, pdfUrl);
      setCatalogues(prev => prev.filter(item => item.id !== id));

      setActionSuccess("Catalogue purged from system.");
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      console.error(err);
      setActionError(err.message || "Failed to delete catalogue.");
      setTimeout(() => setActionError(""), 5500);
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    setCredentials({ email: "", password: "" });
  };

  // Handle Enquiry Status Update
  const handleUpdateEnquiryStatus = async (id, newStatus) => {
    setActionSuccess("");
    setActionError("");
    try {
      await dataService.updateEnquiryStatus(id, newStatus);
      setEnquiries(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      setActionSuccess(`Enquiry status updated to ${newStatus}.`);
      setTimeout(() => setActionSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setActionError(err.message || "Failed to update enquiry status.");
      setTimeout(() => setActionError(""), 5500);
    }
  };

  // Handle Delete Enquiry
  const handleDeleteEnquiry = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this customer enquiry?")) return;
    setActionSuccess("");
    setActionError("");
    try {
      await dataService.removeEnquiry(id);
      setEnquiries(prev => prev.filter(item => item.id !== id));
      setActionSuccess("Enquiry deleted successfully.");
      setTimeout(() => setActionSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setActionError(err.message || "Failed to delete customer enquiry.");
      setTimeout(() => setActionError(""), 5500);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="relative min-h-screen pt-28 pb-20 flex items-center justify-center">
        <BackgroundShapes />
        
        <div className="w-full max-w-md px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-200/50 shadow-2xl relative overflow-hidden text-center space-y-6"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-accent" />
            
            {/* Key Icon header */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 text-accent">
              <Key size={28} />
            </div>

            <div className="space-y-2">
              <h2 className="font-extrabold text-2xl text-primary tracking-tight">Log In</h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Admin Email</label>
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@sonata.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-400 shadow-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Password</label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-400 shadow-xs"
                />
              </div>

              {loginError && (
                <div className="text-accent text-[10px] font-bold flex items-center space-x-1">
                  <AlertTriangle size={12} />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-accent hover:scale-102 active:scale-98 transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer"
              >
                {isLoggingIn ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Key size={14} />
                    <span>Authorize Access</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen pt-28 pb-20 bg-slate-50/30">
      <BackgroundShapes />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Portal Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200/80 mb-10">
          <div className="space-y-1">
            <span className="text-accent font-bold text-xs uppercase tracking-widest">
              Role-Based Control Room
            </span>
            <h1 className="text-3xl font-black text-primary tracking-tight">
              Administrator Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-slate-900 hover:bg-accent text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-colors flex items-center space-x-1.5 cursor-pointer shrink-0"
          >
            <LogOut size={13} />
            <span>Terminate Session</span>
          </button>
        </div>

        {/* Dynamic Success notifications */}
        <AnimatePresence>
          {actionSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 p-4 bg-emerald-500 text-white rounded-xl shadow-md font-bold text-xs flex items-center space-x-2"
            >
              <CheckCircle2 size={16} />
              <span>{actionSuccess}</span>
            </motion.div>
          )}
          {actionError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 p-4 bg-rose-500 text-white rounded-xl shadow-md font-bold text-xs flex items-center space-x-2"
            >
              <ShieldAlert size={16} />
              <span>{actionError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Tabs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Section Navigator */}
          <div className="lg:col-span-3 space-y-3">
            <div className="glass-panel p-4 rounded-2xl border border-slate-200/50 shadow-xs flex flex-col space-y-2">
              <button
                onClick={() => setActiveTab("tiles")}
                className={`w-full px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-wider text-left transition-all flex items-center space-x-3 cursor-pointer ${
                  activeTab === "tiles"
                    ? "bg-accent text-white shadow-md shadow-accent/15"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Layers size={14} />
                <span>Showroom Collection</span>
              </button>

              <button
                onClick={() => setActiveTab("series")}
                className={`w-full px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-wider text-left transition-all flex items-center space-x-3 cursor-pointer ${
                  activeTab === "series"
                    ? "bg-accent text-white shadow-md shadow-accent/15"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FolderOpen size={14} />
                <span>Series Manager</span>
              </button>

              <button
                onClick={() => setActiveTab("catalogues")}
                className={`w-full px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-wider text-left transition-all flex items-center space-x-3 cursor-pointer ${
                  activeTab === "catalogues"
                    ? "bg-accent text-white shadow-md shadow-accent/15"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <BookOpen size={14} />
                <span>Document Library</span>
              </button>

              <button
                onClick={() => setActiveTab("enquiries")}
                className={`w-full px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-wider text-left transition-all flex items-center space-x-3 cursor-pointer ${
                  activeTab === "enquiries"
                    ? "bg-accent text-white shadow-md shadow-accent/15"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Inbox size={14} />
                <span>Customer Enquiries</span>
              </button>
            </div>
          </div>

          {/* Right: Active panel view */}
          <div className="lg:col-span-9">
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-3 bg-white border border-slate-200/50 rounded-3xl">
                <div className="w-8 h-8 border-3 border-slate-200 border-t-accent rounded-full animate-spin" />
                <span className="text-xs text-slate-400 font-bold tracking-widest uppercase">
                  Loading dashboard data...
                </span>
              </div>
            ) : (
              <div className="space-y-8">
                
                {/* 1. TILES MANAGEMENT TAB */}
                {activeTab === "tiles" && (
                  <div className="space-y-8">
                    
                    {/* Add Form */}
                    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/50 shadow-xs relative">
                      <h3 className="font-extrabold text-lg text-primary mb-6 flex items-center space-x-2">
                        <Plus size={18} className="text-accent" />
                        <span>Create New Tile Template</span>
                      </h3>
                      
                      <form onSubmit={handleAddTile} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tile Name *</label>
                            <input
                              type="text"
                              value={tileForm.name}
                              onChange={e => setTileForm(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="e.g. Carrara Diamond Gloss"
                              required
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-400 shadow-xs bg-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tile Dimension *</label>
                            <select
                              value={tileForm.dimension}
                              onChange={e => setTileForm(prev => {
                                const available = series.filter(s => s.dimension === e.target.value);
                                return { 
                                  ...prev, 
                                  dimension: e.target.value,
                                  series: available.length > 0 ? available[0].name : ""
                                };
                              })}
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-400 shadow-xs bg-white"
                            >
                              <option value="600x600">600 x 600 mm</option>
                              <option value="600x1200">600 x 1200 mm</option>
                              <option value="195x1200">195 x 1200 mm</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Associated Series *</label>
                            <select
                              value={tileForm.series}
                              onChange={e => setTileForm(prev => ({ ...prev, series: e.target.value }))}
                              required
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-400 shadow-xs bg-white"
                            >
                              {series
                                .filter(s => s.dimension === tileForm.dimension)
                                .map(s => (
                                  <option key={s.id} value={s.name}>{s.name}</option>
                                ))
                              }
                              {series.filter(s => s.dimension === tileForm.dimension).length === 0 && (
                                <option value="">-- No series defined --</option>
                              )}
                            </select>
                            {series.filter(s => s.dimension === tileForm.dimension).length === 0 && (
                              <p className="text-[9px] text-accent font-semibold mt-1">Please create a series for this dimension first in the Series Manager!</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Location (select all that apply)</label>
                            <div className="flex flex-wrap gap-2 pt-1">
                              {["Indoor", "Outdoor", "Wall", "Floor"].map(loc => {
                                const isChecked = tileForm.location.includes(loc);
                                return (
                                  <button
                                    key={loc}
                                    type="button"
                                    onClick={() => {
                                      setTileForm(prev => ({
                                        ...prev,
                                        location: isChecked
                                          ? prev.location.filter(l => l !== loc)
                                          : [...prev.location, loc]
                                      }));
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                                      isChecked
                                        ? "bg-accent text-white border-accent shadow-sm"
                                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                                    }`}
                                  >
                                    {loc}
                                  </button>
                                );
                              })}
                            </div>
                            {tileForm.location.length === 0 && (
                              <p className="text-[9px] text-accent font-semibold mt-1">Select at least one location.</p>
                            )}
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Finish</label>
                            <select
                              value={tileForm.finish}
                              onChange={e => setTileForm(prev => ({ ...prev, finish: e.target.value }))}
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-400 shadow-xs bg-white"
                            >
                              <option>Glossy</option>
                              <option>High-Gloss</option>
                              <option>Satin</option>
                              <option>Matte</option>
                              <option>Textured</option>
                              <option>Carving</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Random Faces</label>
                            <select
                              value={tileForm.random_faces}
                              onChange={e => setTileForm(prev => ({ ...prev, random_faces: e.target.value }))}
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-400 shadow-xs bg-white"
                            >
                              <option>01</option>
                              <option>02</option>
                              <option>03</option>
                              <option>04</option>
                              <option>06</option>
                              <option>08</option>
                              <option>10</option>
                              <option>12</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Thickness</label>
                            <select
                              value={tileForm.thickness}
                              onChange={e => setTileForm(prev => ({ ...prev, thickness: e.target.value }))}
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-400 shadow-xs bg-white"
                            >
                              <option>8mm</option>
                              <option>10mm</option>
                              <option>12mm</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">3D Viewer action link (URL)</label>
                            <input
                              type="url"
                              value={tileForm.external_link}
                              onChange={e => setTileForm(prev => ({ ...prev, external_link: e.target.value }))}
                              placeholder="e.g. https://buy.sonatatiles.com/grizly-mint"
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-400 shadow-xs bg-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Product Description</label>
                          <textarea
                            value={tileForm.description}
                            onChange={e => setTileForm(prev => ({ ...prev, description: e.target.value }))}
                            rows="2"
                            placeholder="Detail grain, onyx highlights, vitrification features, etc..."
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-400 shadow-xs bg-white resize-none"
                          />
                        </div>

                        {/* Image file upload */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Product Showcase Image</label>
                          <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center bg-white/40 hover:bg-white/80 transition-colors relative cursor-pointer">
                            <input
                              type="file"
                              id="tile-image-input"
                              accept="image/*"
                              onChange={e => setTileImage(e.target.files[0])}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full"
                            />
                            <div className="flex flex-col items-center justify-center space-y-1 text-slate-400 text-xs">
                              <FileUp size={20} className="text-accent" />
                              <span className="font-bold text-slate-500">
                                {tileImage ? tileImage.name : "Click or Drag to Upload Showcase Image"}
                              </span>
                              <span>Accepts PNG, JPG, WEBP (Max 5MB)</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={actionLoading}
                            className="w-full sm:w-auto px-8 py-3 bg-accent hover:bg-accent-light text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
                          >
                            {actionLoading ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <Plus size={14} />
                                <span>Create Product Slab</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Show Active List */}
                    <div className="bg-white border border-slate-200/50 rounded-3xl overflow-hidden shadow-xs">
                      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <h4 className="font-extrabold text-sm text-primary uppercase tracking-wider">Active Slabs Showroom ({tiles.length})</h4>
                      </div>
                      
                      <div className="divide-y divide-slate-100 text-xs md:text-sm max-h-[500px] overflow-y-auto">
                        {tiles.map((item) => (
                          <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center space-x-3.5">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 relative shrink-0">
                                <img src={item.image_url} className="w-full h-full object-cover" />
                              </div>
                              <div className="space-y-0.5">
                                <h5 className="font-bold text-primary leading-tight">{item.name}</h5>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                  {item.dimension} &bull; {item.series || "No Series"} &bull; {item.finish} &bull; {item.random_faces ? `${item.random_faces} Randoms` : ""}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              {item.external_link && (
                                <a 
                                  href={item.external_link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="p-2 text-slate-400 hover:text-primary transition-all"
                                  title="Open Viewer Call to Action link"
                                >
                                  <LinkIcon size={14} />
                                </a>
                              )}
                              <button
                                onClick={() => handleDeleteTile(item.id, item.image_url)}
                                className="p-2 text-slate-400 hover:text-accent hover:bg-rose-50 rounded-lg transition-all cursor-pointer shrink-0"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* SERIES MANAGEMENT TAB */}
                {activeTab === "series" && (
                  <div className="space-y-8">
                    
                    {/* Add Form */}
                    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/50 shadow-xs">
                      <h3 className="font-extrabold text-lg text-primary mb-6 flex items-center space-x-2">
                        <Plus size={18} className="text-accent" />
                        <span>Create New Series Collection</span>
                      </h3>
                      
                      <form onSubmit={handleAddSeries} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Series Name *</label>
                            <input
                              type="text"
                              value={seriesForm.name}
                              onChange={e => setSeriesForm(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="e.g. Colorton Series"
                              required
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-400 shadow-xs bg-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Tile Dimension *</label>
                            <select
                              value={seriesForm.dimension}
                              onChange={e => setSeriesForm(prev => ({ ...prev, dimension: e.target.value }))}
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-400 shadow-xs bg-white"
                            >
                              <option value="600x600">600 x 600 mm</option>
                              <option value="600x1200">600 x 1200 mm</option>
                              <option value="195x1200">195 x 1200 mm</option>
                            </select>
                          </div>
                        </div>

                        {/* Series image file uploader */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Series Card Image *</label>
                          <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center bg-white/40 hover:bg-white/80 transition-colors relative cursor-pointer">
                            <input
                              type="file"
                              id="series-image-input"
                              accept="image/*"
                              onChange={e => setSeriesImage(e.target.files[0])}
                              required
                              className="absolute inset-0 opacity-0 cursor-pointer w-full"
                            />
                            <div className="flex flex-col items-center justify-center space-y-1 text-slate-400 text-xs">
                              <FileUp size={20} className="text-accent" />
                              <span className="font-bold text-slate-500">
                                {seriesImage ? seriesImage.name : "Click or Drag to Upload Series Card Image"}
                              </span>
                              <span>Accepts PNG, JPG, WEBP (Max 5MB)</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={actionLoading}
                            className="w-full sm:w-auto px-8 py-3 bg-accent hover:bg-accent-light text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
                          >
                            {actionLoading ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <Plus size={14} />
                                <span>Create Collection Series</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Show Active List */}
                    <div className="bg-white border border-slate-200/50 rounded-3xl overflow-hidden shadow-xs">
                      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <h4 className="font-extrabold text-sm text-primary uppercase tracking-wider">Active Product Series ({series.length})</h4>
                      </div>
                      
                      <div className="divide-y divide-slate-100 text-xs md:text-sm max-h-[500px] overflow-y-auto">
                        {["600x600", "600x1200", "195x1200"].map((dim) => {
                          const dimSeries = series.filter(s => s.dimension === dim);
                          return (
                            <div key={dim} className="p-4 space-y-2">
                              <h5 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] border-b pb-1">
                                Dimension: {dim === "600x600" ? "600 x 600 mm" : dim === "600x1200" ? "600 x 1200 mm" : "195 x 1200 mm"} ({dimSeries.length})
                              </h5>
                              {dimSeries.length === 0 ? (
                                <p className="text-slate-400 font-medium italic text-[11px] py-1">No series created for this dimension yet.</p>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                                  {dimSeries.map((item) => (
                                    <div key={item.id} className="p-2 bg-slate-50 border border-slate-200/50 rounded-lg flex items-center justify-between gap-3">
                                      <div className="flex items-center space-x-2.5 min-w-0">
                                        <div className="w-10 h-10 rounded overflow-hidden bg-slate-100 relative shrink-0 border border-slate-200/40">
                                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="font-bold text-primary truncate text-xs">{item.name}</span>
                                      </div>
                                      <button
                                        onClick={() => handleDeleteSeries(item.id)}
                                        className="text-slate-400 hover:text-accent p-1.5 rounded transition-colors shrink-0 cursor-pointer"
                                        title="Delete Series"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}

                {/* 2. CATALOGUE TAB */}
                {activeTab === "catalogues" && (
                  <div className="space-y-8">
                    
                    {/* Add Form */}
                    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/50 shadow-xs">
                      <h3 className="font-extrabold text-lg text-primary mb-6 flex items-center space-x-2">
                        <Plus size={18} className="text-accent" />
                        <span>Upload Catalogue Document</span>
                      </h3>
                      
                      <form onSubmit={handleAddCatalogue} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Catalogue Title</label>
                          <input
                            type="text"
                            value={catForm.title}
                            onChange={e => setCatForm(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g. Master Slate Collection 2026"
                            required
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-400 shadow-xs bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Catalogue Description</label>
                          <textarea
                            value={catForm.description}
                            onChange={e => setCatForm(prev => ({ ...prev, description: e.target.value }))}
                            rows="2"
                            placeholder="Briefly describe collections, color palettes, and applications..."
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-400 shadow-xs bg-white resize-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Dimension</label>
                          <select
                            value={catForm.dimension}
                            onChange={e => setCatForm(prev => ({ ...prev, dimension: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-400 shadow-xs bg-white cursor-pointer"
                          >
                            <option value="600x600">600 x 600 mm — Square Slabs</option>
                            <option value="600x1200">600 x 1200 mm — Standard Premium</option>
                            <option value="195x1200">195 x 1200 mm — Wood Planks</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Cover Upload */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cover image</label>
                            <div className="border border-dashed border-slate-200 rounded-xl p-3 text-center bg-white/40 relative cursor-pointer">
                              <input
                                type="file"
                                id="cover-input"
                                accept="image/*"
                                onChange={e => setCatCover(e.target.files[0])}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full"
                              />
                              <span className="text-[10px] font-bold text-slate-500 truncate block">
                                {catCover ? catCover.name : "Cover Image File"}
                              </span>
                            </div>
                          </div>

                          {/* PDF Upload */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PDF Document</label>
                            <div className="border border-dashed border-slate-200 rounded-xl p-3 text-center bg-white/40 relative cursor-pointer">
                              <input
                                type="file"
                                id="pdf-input"
                                accept="application/pdf"
                                onChange={e => setCatPdf(e.target.files[0])}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full"
                              />
                              <span className="text-[10px] font-bold text-slate-500 truncate block">
                                {catPdf ? catPdf.name : "PDF Document File"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={actionLoading}
                            className="w-full sm:w-auto px-8 py-3 bg-accent hover:bg-accent-light text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
                          >
                            {actionLoading ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <Plus size={14} />
                                <span>Add B2B Catalogue</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Catalogue list */}
                    <div className="bg-white border border-slate-200/50 rounded-3xl overflow-hidden shadow-xs">
                      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <h4 className="font-extrabold text-sm text-primary uppercase tracking-wider">Active Catalogues ({catalogues.length})</h4>
                      </div>

                      <div className="divide-y divide-slate-100 text-xs md:text-sm">
                        {catalogues.map((item) => (
                          <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center space-x-3.5">
                              <div className="w-8 h-10 rounded-sm overflow-hidden bg-slate-100 relative shrink-0 shadow-xs border border-slate-200/30">
                                <img src={item.cover_image_url} className="w-full h-full object-cover" />
                              </div>
                              <div className="space-y-0.5">
                                <h5 className="font-bold text-primary leading-tight">{item.title}</h5>
                                <p className="text-[9px] text-slate-400 font-bold max-w-sm truncate">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteCatalogue(item.id, item.cover_image_url, item.pdf_url)}
                              className="p-2 text-slate-400 hover:text-accent hover:bg-rose-50 rounded-lg transition-all cursor-pointer shrink-0"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* 3. ENQUIRIES PANEL */}
                {activeTab === "enquiries" && (
                  <div className="space-y-6">
                    <div className="bg-white border border-slate-200/50 rounded-3xl overflow-hidden shadow-xs">
                      
                      <div className="p-5 border-b border-slate-100">
                        <h4 className="font-extrabold text-sm text-primary uppercase tracking-wider">Customer Inquiry Inbox ({enquiries.length})</h4>
                      </div>

                      {enquiries.length === 0 ? (
                        <div className="p-16 text-center space-y-2 text-slate-400 text-xs md:text-sm font-bold">
                          <Inbox size={32} className="mx-auto text-slate-300" />
                          <p>Inbox is empty. No specification enquiries logged.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {enquiries.map((enq) => {
                            const status = enq.status || "Pending";
                            let statusColor = "bg-amber-500/10 text-amber-600 border-amber-500/20";
                            if (status === "On Going") statusColor = "bg-blue-500/10 text-blue-600 border-blue-500/20";
                            if (status === "Addressed") statusColor = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";

                            return (
                              <div key={enq.id} className="p-6 space-y-4 hover:bg-slate-50/50 transition-colors">
                                
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                  <div className="space-y-0.5 text-xs">
                                    <div className="flex items-center space-x-2">
                                      <h5 className="font-extrabold text-sm text-primary">{enq.user_name}</h5>
                                      <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-full uppercase tracking-wider ${statusColor}`}>
                                        {status}
                                      </span>
                                    </div>
                                    <p className="text-slate-400 font-semibold">{enq.user_email} &bull; {enq.user_phone || "No phone logged"}</p>
                                  </div>
                                  <div className="flex items-center space-x-2.5 shrink-0">
                                    <span className="text-[9px] font-bold text-accent bg-accent/5 border border-accent/15 px-2.5 py-1 rounded-md uppercase tracking-wider">
                                      {enq.tile_name}
                                    </span>
                                    <button
                                      onClick={() => handleDeleteEnquiry(enq.id)}
                                      className="p-1.5 text-slate-400 hover:text-accent hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                                      title="Delete Enquiry"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>

                                <div className="p-4 bg-slate-50 border border-slate-200/40 rounded-xl text-xs md:text-sm text-slate-600 leading-relaxed font-semibold">
                                  {enq.message}
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] pt-1">
                                  <div className="text-slate-400 font-bold uppercase tracking-wider flex items-center space-x-4">
                                    <span>Inquiry Logged</span>
                                    <span>{new Date(enq.created_at).toLocaleString()}</span>
                                  </div>
                                  
                                  {/* Status controls */}
                                  <div className="flex items-center space-x-1.5">
                                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Update Status:</span>
                                    <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-[9px] font-bold">
                                      {["Pending", "On Going", "Addressed"].map((st) => (
                                        <button
                                          key={st}
                                          onClick={() => handleUpdateEnquiryStatus(enq.id, st)}
                                          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                                            status === st
                                              ? "bg-white text-primary shadow-xs border border-slate-200/50"
                                              : "text-slate-500 hover:text-slate-800"
                                          }`}
                                        >
                                          {st}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                              </div>
                            );
                          })}
                        </div>
                      )}

                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>
    </main>
  );
}
