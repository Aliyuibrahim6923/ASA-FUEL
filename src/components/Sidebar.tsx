"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  const pathname = usePathname();
  
  const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "Fleet Management", href: "/fleet" },
    { name: "Order Management", href: "/orders" },
    { name: "Sales & Clients", href: "/sales" },
    { name: "Financials", href: "/financials" },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="sidebar-logo-icon">A</div>
          <div className="sidebar-logo-text">ASA-FUEL</div>
        </div>
        {onClose && (
          <button className="mobile-close-btn" onClick={onClose} aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        )}
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
