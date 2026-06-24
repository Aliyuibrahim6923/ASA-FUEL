"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function NavigationLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <main className="main-content">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <div className="page-content animate-fade-in">
          {children}
        </div>
      </main>
      
      {isMobileMenuOpen && (
        <div 
          className="mobile-sidebar-overlay" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
