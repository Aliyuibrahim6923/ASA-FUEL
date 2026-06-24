export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {onMenuClick && (
          <button className="mobile-menu-btn" onClick={onMenuClick} aria-label="Open menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        )}
        <div className="header-search">
          <input type="text" placeholder="Search..." className="input search-input" style={{ width: '300px' }} />
        </div>
      </div>
      <div className="header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ECFDF5', padding: '0.25rem 0.75rem', borderRadius: '999px', border: '1px solid #A7F3D0' }}>
          <div className="animate-pulse-green" style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-success)' }}></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-success)' }}>System Online</span>
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(255,106,0,0.1)' }}>
          AD
        </div>
      </div>
    </header>
  );
}
