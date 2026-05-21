"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const slides = [
  {
    image: "/images/hero_marble.png",
    title: "Calacatta Gold Supreme",
    subtitle: "Italian Luxury Redefined",
    description: "Polished porcelain sweeping with rich warm gold veins, bringing architectural grandeur into modern interiors.",
    ctaText: "Explore Marble Series",
    ctaLink: "/tiles?design=Marble"
  },
  {
    image: "/images/hero_wooden.png",
    title: "Nordic Herringbone Oak",
    subtitle: "Organic Sophistication",
    description: "High-density porcelain capturing the organic warmth and deep grain of timber with zero wear or maintenance.",
    ctaText: "Explore Wood Series",
    ctaLink: "/tiles?design=Wooden"
  },
  {
    image: "/images/hero_terrace.png",
    title: "Volcanic Ash Slate",
    subtitle: "Bold Natural Durability",
    description: "Earthy, R11 non-slip dark stone textures crafted specifically for swimming pool terraces and outdoor pathways.",
    ctaText: "Explore Outdoor Series",
    ctaLink: "/tiles?location=Outdoor"
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div
      className="relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-primary-dark"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image Carousel with Cross-Fade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slides[current].image}
            alt={slides[current].title}
            fill
            priority
            className="object-cover object-center brightness-[0.4]"
          />
        </motion.div>
      </AnimatePresence>

      {/* Decorative Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-transparent to-primary-dark/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/60 via-transparent to-transparent pointer-events-none" />

      {/* Slide Content */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl text-left space-y-6">
            
            {/* Animated Subtitle */}
            <div className="overflow-hidden">
              <motion.span
                key={`sub-${current}`}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block text-accent font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-accent/15 border border-accent/20"
              >
                {slides[current].subtitle}
              </motion.span>
            </div>

            {/* Animated Title */}
            <div className="overflow-hidden">
              <motion.h1
                key={`title-${current}`}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-4xl md:text-6xl font-black tracking-tight text-white leading-none"
              >
                {slides[current].title}
              </motion.h1>
            </div>

            {/* Animated Description */}
            <div className="overflow-hidden">
              <motion.p
                key={`desc-${current}`}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-base md:text-lg text-slate-300 font-medium leading-relaxed"
              >
                {slides[current].description}
              </motion.p>
            </div>

            {/* Animated CTA button */}
            <motion.div
              key={`cta-${current}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="pt-4"
            >
              <Link
                href={slides[current].ctaLink}
                className="inline-flex items-center space-x-2 px-6 py-3.5 bg-accent text-white font-bold rounded-xl shadow-lg hover:bg-accent-light hover:scale-102 hover:shadow-accent/20 active:scale-98 transition-all duration-300 group"
              >
                <span>{slides[current].ctaText}</span>
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Manual Arrow Controls (Desktop only) */}
      <button
        onClick={handlePrev}
        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 rounded-full border border-white/20 bg-primary-dark/20 text-white backdrop-blur-sm hover:bg-accent hover:border-accent hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={handleNext}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 rounded-full border border-white/20 bg-primary-dark/20 text-white backdrop-blur-sm hover:bg-accent hover:border-accent hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
              current === index ? "w-8 bg-accent" : "w-2.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
