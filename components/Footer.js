import Link from "next/link";
import { Landmark, Mail, Phone, MapPin, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-primary-dark text-slate-300 border-t border-slate-800">
      {/* Decorative colored top line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />
      
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Column 1: Company Profile */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center group">
              <img
                src="/SONATA LOGO.png"
                alt="Sonata Tiles Logo"
                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Elevating premium architectural designs through high-end ceramic, wood, slate, and marble porcelain tiling systems. Crafted for lasting elegance.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Collections</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/tiles?design=Marble" className="hover:text-accent transition-colors duration-200">
                  Calacatta & Marble Series
                </Link>
              </li>
              <li>
                <Link href="/tiles?design=Wooden" className="hover:text-accent transition-colors duration-200">
                  Herringbone Wood Planks
                </Link>
              </li>
              <li>
                <Link href="/tiles?design=Textured" className="hover:text-accent transition-colors duration-200">
                  Volcanic Ash & Slate
                </Link>
              </li>
              <li>
                <Link href="/tiles?design=Ceramic" className="hover:text-accent transition-colors duration-200">
                  Artisan Glazed Ceramics
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Resources */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-accent transition-colors duration-200">
                  About Our Legacy
                </Link>
              </li>
              <li>
                <Link href="/catalogues" className="hover:text-accent transition-colors duration-200">
                  Download Catalogues
                </Link>
              </li>
              <li>
                <Link href="/tiles" className="hover:text-accent transition-colors duration-200">
                  Tiles Showroom
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-accent transition-colors duration-200">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors duration-200">
                  B2B Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Corporate Info */}
          <div className="space-y-3 text-sm">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Headquarters</h4>
            <div className="flex items-start space-x-3 text-slate-400">
              <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
              <span>Survey No. 120, Block No. 237, Near Sabar Dairy, Talod Road, At & Post Gadhoda, Himatnagar, Sabarkantha, Gujarat, India - 383001</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-400">
              <Phone size={16} className="text-accent shrink-0" />
              <span>+91 2772 226333, +91 98240 24333</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-400">
              <Mail size={16} className="text-accent shrink-0" />
              <span>info@sonatatile.com</span>
            </div>
          </div>
          
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-800 my-10" />

        {/* Copyright Panel */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Sonata Tiles. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">B2B Specifications</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
