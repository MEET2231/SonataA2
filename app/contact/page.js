"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dataService } from "@/lib/dataService";
import BackgroundShapes from "@/components/BackgroundShapes";
import { Send, MapPin, Phone, Mail, Clock, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shakeFields, setShakeFields] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    
    // Validate email has @ and a domain
    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Must contain @ and a domain (e.g. .com).";
    }

    // Validate phone number is exactly 10 digits and required
    if (!form.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    } else {
      const digits = form.phone.replace(/\D/g, "");
      if (digits.length !== 10) {
        nextErrors.phone = "Phone must be exactly 10 digits.";
      }
    }

    if (!form.subject.trim()) nextErrors.subject = "Subject is required.";
    if (!form.message.trim()) nextErrors.message = "Message details are required.";
    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Trigger shake animation for fields with errors
      const nextShake = {};
      Object.keys(validationErrors).forEach(key => {
        nextShake[key] = true;
      });
      setShakeFields(nextShake);
      setTimeout(() => setShakeFields({}), 2000);
      return;
    }

    setIsSubmitting(true);
    try {
      // Write B2B inquiry to database
      await dataService.addEnquiry({
        tile_name: `General Inquiry: ${form.subject}`,
        user_name: form.name,
        user_email: form.email,
        user_phone: form.phone,
        message: form.message
      });

      // Asynchronously send email notification via server API
      try {
        fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_name: form.name,
            user_email: form.email,
            user_phone: form.phone,
            tile_name: `General Inquiry: ${form.subject}`,
            message: form.message
          })
        }).catch(err => console.error("Email notification dispatch error:", err));
      } catch (emailErr) {
        console.error("Email notification dispatch failed:", emailErr);
      }

      setSuccess(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });

      // Clear toast success after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
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
            Contact Us
          </h1>
          <p className="text-slate-500 font-medium text-sm max-w-2xl leading-relaxed">
            Get in touch with an architectural expert to discuss material volumes, customized dimensions, and shipping pipelines. Let us structure your project.
          </p>
        </motion.div>

        {/* Layout: Info Columns & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Office Contacts */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="glass-panel p-8 rounded-2xl border border-slate-200/50 shadow-sm space-y-6">
              
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-black">
                  Global Headquarters
                </span>
                <h3 className="font-extrabold text-xl text-primary leading-none">
                  Sonata Corporate Offices
                </h3>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="space-y-5 text-sm font-medium">
                
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-slate-50 text-accent rounded-xl shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-primary text-xs uppercase tracking-wider">Address</h5>
                    <p className="text-slate-500 leading-relaxed">
                      Survey No. 120, Block No. 237, Near Sabar Dairy,<br />
                      Talod Road, At & Post Gadhoda, Himatnagar,<br />
                      Sabarkantha, Gujarat, India - 383001
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-slate-50 text-accent rounded-xl shrink-0">
                    <Phone size={20} />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-primary text-xs uppercase tracking-wider">Call Desk</h5>
                    <p className="text-slate-500 font-semibold">+91 2772 226333 (Support)</p>
                    <p className="text-slate-400 text-xs">Direct Office: +91 98240 24333</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-slate-50 text-accent rounded-xl shrink-0">
                    <Mail size={20} />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-primary text-xs uppercase tracking-wider">Emails</h5>
                    <p className="text-slate-500 font-semibold">info@sonatatile.com</p>
                    <p className="text-slate-400 text-xs">B2B Specifications: marketing@sonatatile.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-slate-50 text-accent rounded-xl shrink-0">
                    <Clock size={20} />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-primary text-xs uppercase tracking-wider">Business Hours</h5>
                    <p className="text-slate-500">Monday - Saturday: 9:00 AM - 6:00 PM IST</p>
                    <p className="text-slate-400 text-xs">Sunday Holiday (Office Closed)</p>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="glass-panel p-8 sm:p-10 rounded-2xl border border-slate-200/50 shadow-sm relative overflow-hidden">
              
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-accent" />

              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Name field */}
                  <div className={`space-y-1 ${shakeFields.name ? "animate-shake" : ""}`}>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex justify-between">
                      <span>Full Name *</span>
                      {errors.name && (
                        <span className="text-accent text-[9px] font-bold flex items-center space-x-0.5 lowercase">
                          <AlertCircle size={8} />
                          <span>{errors.name}</span>
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className={`w-full px-4 py-3 rounded-lg border text-xs font-semibold focus:outline-none transition-all shadow-xs ${
                        errors.name
                          ? "border-accent focus:ring-1 focus:ring-accent"
                          : "border-slate-200 focus:border-slate-400"
                      }`}
                    />
                  </div>

                  {/* Email field */}
                  <div className={`space-y-1 ${shakeFields.email ? "animate-shake" : ""}`}>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex justify-between">
                      <span>Corporate Email *</span>
                      {errors.email && (
                        <span className="text-accent text-[9px] font-bold flex items-center space-x-0.5 lowercase">
                          <AlertCircle size={8} />
                          <span>{errors.email}</span>
                        </span>
                      )}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="buyer@company.com"
                      className={`w-full px-4 py-3 rounded-lg border text-xs font-semibold focus:outline-none transition-all shadow-xs ${
                        errors.email
                          ? "border-accent focus:ring-1 focus:ring-accent"
                          : "border-slate-200 focus:border-slate-400"
                      }`}
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Phone field */}
                  <div className={`space-y-1 ${shakeFields.phone ? "animate-shake" : ""}`}>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex justify-between">
                      <span>Phone Number *</span>
                      {errors.phone && (
                        <span className="text-accent text-[9px] font-bold flex items-center space-x-0.5 lowercase">
                          <AlertCircle size={8} />
                          <span>{errors.phone}</span>
                        </span>
                      )}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 5551234567"
                      className={`w-full px-4 py-3 rounded-lg border text-xs font-semibold focus:outline-none transition-all shadow-xs ${
                        errors.phone
                          ? "border-accent focus:ring-1 focus:ring-accent"
                          : "border-slate-200 focus:border-slate-400"
                      }`}
                    />
                  </div>

                  {/* Subject field */}
                  <div className={`space-y-1 ${shakeFields.subject ? "animate-shake" : ""}`}>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex justify-between">
                      <span>Subject *</span>
                      {errors.subject && (
                        <span className="text-accent text-[9px] font-bold flex items-center space-x-0.5 lowercase">
                          <AlertCircle size={8} />
                          <span>{errors.subject}</span>
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleInputChange}
                      placeholder="e.g. Bulk porcelain volume purchase"
                      className={`w-full px-4 py-3 rounded-lg border text-xs font-semibold focus:outline-none transition-all shadow-xs ${
                        errors.subject
                          ? "border-accent focus:ring-1 focus:ring-accent"
                          : "border-slate-200 focus:border-slate-400"
                      }`}
                    />
                  </div>

                </div>

                {/* Message field */}
                <div className={`space-y-1 ${shakeFields.message ? "animate-shake" : ""}`}>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex justify-between">
                    <span>Message details *</span>
                    {errors.message && (
                      <span className="text-accent text-[9px] font-bold flex items-center space-x-0.5 lowercase">
                        <AlertCircle size={8} />
                        <span>{errors.message}</span>
                      </span>
                    )}
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleInputChange}
                    rows="5"
                    placeholder="Enter project specs, square footage, style, and timeline..."
                    className={`w-full px-4 py-3 rounded-lg border text-xs font-semibold focus:outline-none transition-all resize-none shadow-xs ${
                      errors.message
                        ? "border-accent focus:ring-1 focus:ring-accent"
                        : "border-slate-200 focus:border-slate-400"
                    }`}
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 hover:shadow-lg active:scale-99 transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Transmitting Data...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Transmit Message</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          </motion.div>
        </div>

        {/* Interactive Google Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 rounded-3xl overflow-hidden border border-slate-200/50 shadow-md bg-white p-4"
        >
          <div className="w-full h-[400px] rounded-2xl overflow-hidden relative">
            <iframe
              src="https://maps.google.com/maps?q=Sonata%20Ceramica%20Pvt.%20Ltd,%20Gadhoda,%20Himatnagar,%20Gujarat%20383001&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sonata Ceramica Pvt. Ltd. Location Map"
              className="w-full h-full"
            />
          </div>
        </motion.div>

      </div>

      {/* Floating success toast */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 p-5 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-2xl max-w-sm flex items-start space-x-3.5"
          >
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div className="space-y-1 text-left">
              <h5 className="font-extrabold text-sm leading-none">Inquiry Logs Transmitted</h5>
              <p className="text-[11px] text-slate-400 leading-normal">
                Your B2B message has been processed successfully. A designer will contact you shortly.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
