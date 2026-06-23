"use client";
import { useState, useEffect } from "react";

export default function ManageDeductionsForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [trucks, setTrucks] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/transporters').then(res => res.json()).then(transporters => {
        if(Array.isArray(transporters)) {
          setTrucks(transporters.flatMap((t: any) => t.trucks || []));
        }
    }).catch(e => console.error(e));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to log maintenance");
      onSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-layout">
      {error && <div className="alert alert-danger" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '0.5rem' }}>{error}</div>}
      
      <div className="form-group">
        <label>Truck ID</label>
        <select name="truckId" className="input" required style={{ backgroundColor: 'white' }}>
          <option value="">Select Truck</option>
          {trucks.map(t => <option key={t.id} value={t.id}>{t.truckNameId}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label>Description</label>
        <input name="description" type="text" className="input" required placeholder="e.g. Tire Replacement" />
      </div>

      <div className="form-group">
        <label>Maintenance Cost (₦)</label>
        <input name="cost" type="number" className="input" required />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Log Deduction"}</button>
      </div>
    </form>
  );
}
