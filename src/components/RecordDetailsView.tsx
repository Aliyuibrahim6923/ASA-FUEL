"use client";

export default function RecordDetailsView({ record }: { record: any }) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(record).map(([key, value]) => {
        // Skip internal fields usually
        if (['createdAt', 'updatedAt', 'deletedAt'].includes(key)) return null;
        
        return (
          <div key={key} className="p-5 bg-white shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </p>
            <div className="text-gray-900 text-lg">
              {renderValue(value)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
