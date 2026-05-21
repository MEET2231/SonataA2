"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const slides = [
  {
    image: "/images/hero_COLORTON.png",
    title: "COLORTON",
    subtitle: "Italian Luxury Redefined",
    description: "The Colorton Series by Sonata combines bold, fluid stone textures with striking, high-contrast liquid gold veining in a premium 600x1200 mm glossy finish. It effortlessly transforms everyday floors and walls into high-end, multi-dimensional artistic statements.",
    ctaText: "Explore More",
    ctaLink: "/tiles?design=Colorton"
  },
  {
    image: "/images/hero_ICONIC.jpeg",
    title: "ICONIC SERIES",
    subtitle: "Organic Sophistication",
    description: "The Iconic Endless Series by Sonata features premium 600x1200 mm glossy vitrified tiles showcasing sophisticated, classic marble textures and delicate veining. Designed with continuous random faces, it creates an expansive, seamless look that brings a timeless sense of bright luxury and open space to any interior.",
    ctaText: "Explore More",
    ctaLink: "/tiles?design=Iconic"
  },
  {
    image: "/images/hero_ROCKER.jpeg",
    title: "ROCKER",
    subtitle: "Bold Natural Durability",
    description: "The Rocker Series by Sonata offers premium glossy vitrified tiles that combine bold, dynamic stone textures with the durability of high-quality ceramic. With its striking patterns and robust construction, Rocker is designed to make a powerful statement while standing up to the demands of everyday living.",
    ctaText: "Explore More",
    ctaLink: "/tiles?design=Rocker"
  },
  {
    image: "/images/hero_CRYSTAL.jpeg",
    title: "CRYSTAL",
    subtitle: "Elegant Simplicity",
    description: "The Crysta Series by Sonata features premium 600x1200 mm glossy vitrified tiles with a clean, minimalist design. Its subtle textures and refined finish create a sophisticated look that complements any modern interior.",
    ctaText: "Explore More",
    ctaLink: "/tiles?design=Crystal"
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
            
            {/* Animated Subtitle
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
            </div> */}

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
                className="inline-flex items-center space-x-2 px-6 py-3.5 bg-transparent text-white font-bold rounded-xl border border-white/50 shadow-lg hover:bg-white/10 hover:scale-102 hover:shadow-white/10 active:scale-98 transition-all duration-300 group"
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
        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 rounded-full border border-white/40 bg-transparent text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/70 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={handleNext}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 rounded-full border border-white/40 bg-transparent text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/70 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2.5 rounded-full border border-white/50 transition-all duration-500 cursor-pointer ${
              current === index
                ? "w-8 bg-white/15"
                : "w-2.5 bg-transparent hover:bg-white/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
