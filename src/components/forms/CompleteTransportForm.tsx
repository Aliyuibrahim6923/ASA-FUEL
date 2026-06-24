"use client";
import { useState } from "react";

export default function CompleteTransportForm({ transport, onSuccess, onCancel }: { transport: any, onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [litersDelivered, setLitersDelivered] = useState(transport?.litersCarried || "");
  const [subsequentLocs, setSubsequentLocs] = useState<{location: string, rate: string}[]>([]);

  const handleAddLocation = () => {
    setSubsequentLocs([...subsequentLocs, { location: "", rate: "" }]);
  };

  const handleRemoveLocation = (index: number) => {
    setSubsequentLocs(subsequentLocs.filter((_, i) => i !== index));
  };

  const updateLocation = (index: number, field: string, value: string) => {
    const newLocs = [...subsequentLocs];
    newLocs[index] = { ...newLocs[index], [field]: value };
    setSubsequentLocs(newLocs);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Filter out empty locations
    const validLocs = subsequentLocs.filter(loc => loc.location.trim() !== "" && loc.rate !== "");
    const formattedLocs = validLocs.map(loc => ({ location: loc.location, rate: parseFloat(loc.rate) }));

    try {
      const response = await fetch(`/api/transports/${transport.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          litersDelivered: parseFloat(litersDelivered.toString()),
          subsequentLocs: formattedLocs
        }),
      });

      if (!response.ok) throw new Error("Failed to complete transport");
      onSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!transport) return <p>No transport selected.</p>;

  return (
    <form onSubmit={handleSubmit} className="form-layout">
      {error && <div className="alert alert-danger" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '0.5rem' }}>{error}</div>}
      
      <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#4b5563' }}>
        <p><strong>Truck:</strong> {transport.truck?.truckNameId}</p>
        <p><strong>Initial Destination:</strong> {transport.destination}</p>
        <p><strong>Initial Liters Carried:</strong> {transport.litersCarried}L</p>
      </div>

      <div className="form-group">
        <label>Liters Delivered</label>
        <input type="number" className="input" required value={litersDelivered} onChange={e => setLitersDelivered(e.target.value)} />
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <label style={{ margin: 0, fontWeight: 500, color: 'var(--color-foreground)' }}>Subsequent Delivery Locations</label>
          <button type="button" onClick={handleAddLocation} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>+ Add Location</button>
        </div>
        
        {subsequentLocs.map((loc, index) => (
          <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem', backgroundColor: '#f3f4f6', padding: '0.75rem', borderRadius: '0.5rem' }}>
            <div style={{ flex: 2 }}>
                <input type="text" className="input" placeholder="Location Name" value={loc.location} onChange={e => updateLocation(index, 'location', e.target.value)} required />
            </div>
            <div style={{ flex: 1 }}>
                <input type="number" className="input" placeholder="Fee/Liter" value={loc.rate} onChange={e => updateLocation(index, 'rate', e.target.value)} required />
            </div>
            <button type="button" onClick={() => handleRemoveLocation(index)} style={{ color: 'var(--color-danger)', border: 'none', background: 'none', cursor: 'pointer', padding: '0.5rem', fontWeight: 'bold' }}>X</button>
          </div>
        ))}
        {subsequentLocs.length === 0 && <p style={{ fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic' }}>No additional locations. Final delivery at initial destination.</p>}
      </div>

      <div className="form-actions" style={{ marginTop: '2rem' }}>
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Mark as Completed"}</button>
      </div>
    </form>
  );
}
