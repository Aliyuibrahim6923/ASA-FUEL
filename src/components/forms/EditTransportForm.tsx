"use client";
import { useState } from "react";

export default function EditTransportForm({ transport, onSuccess, onCancel }: { transport: any, onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`/api/transports/${transport.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           destination: data.destination,
           transportType: data.transportType,
           ratePerLiter: parseFloat(data.ratePerLiter as string),
        }),
      });

      if (!response.ok) throw new Error("Failed to edit transport");
      onSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!transport) return null;

  return (
    <form onSubmit={handleSubmit} className="form-layout">
      {error && <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>{error}</div>}
      
      <div className="form-row">
        <div className="form-group">
          <label>Destination</label>
          <input name="destination" type="text" className="input" defaultValue={transport.destination} required />
        </div>
        <div className="form-group">
          <label>Transport Type</label>
          <select name="transportType" className="input" defaultValue={transport.transportType} required style={{ backgroundColor: 'white' }}>
            <option value="EXTERNAL">External</option>
            <option value="INTERNAL">Internal</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Base Rate per Liter (₦)</label>
        <input name="ratePerLiter" type="number" className="input" defaultValue={transport.ratePerLiter} required />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
      </div>
    </form>
  );
}
