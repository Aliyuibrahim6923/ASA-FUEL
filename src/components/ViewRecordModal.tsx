"use client";

export default function ViewRecordModal({ record, title }: { record: any, title: string }) {
  if (!record) return null;

  // Recursively render nested objects
  const renderValue = (val: any): React.ReactNode => {
    if (val === null || val === undefined) return <span style={{ color: '#9ca3af' }}>N/A</span>;
    if (typeof val === 'boolean') return val ? <span className="badge badge-success">Yes</span> : <span className="badge badge-danger">No</span>;
    if (typeof val === 'object') {
       if (Array.isArray(val)) {
           if (val.length === 0) return <span style={{ color: '#9ca3af' }}>Empty</span>;
           return (
             <div style={{ paddingLeft: '1rem', borderLeft: '2px solid #e5e7eb', marginTop: '0.25rem' }}>
                {val.map((item, i) => (
                  <div key={i} style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>Item {i+1}</span>
                    <div>{renderValue(item)}</div>
                  </div>
                ))}
             </div>
           );
       }
       return (
         <div style={{ paddingLeft: '1rem', borderLeft: '2px solid #e5e7eb', marginTop: '0.25rem' }}>
           {Object.entries(val).map(([k, v]) => (
             <div key={k} style={{ marginBottom: '0.25rem' }}>
               <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1').trim()}: </span>
               <span style={{ fontWeight: 500 }}>{renderValue(v)}</span>
             </div>
           ))}
         </div>
       );
    }
    
    // Formatting numbers as currency where appropriate
    if (typeof val === 'number') {
       if (val > 1000) return <span style={{ fontFamily: 'monospace' }}>{val.toLocaleString()}</span>;
       return val.toString();
    }
    
    return val.toString();
  };

  return (
    <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
       <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#111827', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
         {title}
       </h3>
       <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
         {Object.entries(record).map(([key, value]) => {
           // Skip internal fields usually
           if (['createdAt', 'updatedAt', 'deletedAt'].includes(key)) return null;
           
           return (
             <div key={key} style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
               <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                 {key.replace(/([A-Z])/g, ' $1').trim()}
               </p>
               <div style={{ marginTop: '0.25rem', color: '#111827' }}>
                 {renderValue(value)}
               </div>
             </div>
           );
         })}
       </div>
    </div>
  );
}
