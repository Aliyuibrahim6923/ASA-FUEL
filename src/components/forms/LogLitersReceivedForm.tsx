"use client";
import { useState } from "react";

export default function LogLitersReceivedForm({ sale, onSuccess, onCancel }: { sale: any, onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [litersReceived, setLitersReceived] = useState(sale?.litersReceived || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/sales/${sale.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ litersReceived }),
      });
      if (!response.ok) throw new Error("Failed to log liters received");
      onSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!sale) return null;

  return (
    <form onSubmit={handleSubmit} className="form-layout">
      {error && <div className="alert alert-danger" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '0.5rem' }}>{error}</div>}
      
      <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <p><strong>Sale ID:</strong> {sale.id.slice(0, 8)}</p>
        <p><strong>Client:</strong> {sale.client?.name}</p>
        <p><strong>Amount / Liter:</strong> ₦{sale.amountPerLiter}</p>
        <p><strong>Liters Dispatched:</strong> {sale.litersDespatched}L</p>
      </div>

      <div className="form-group">
        <label>Exact Liters Received by Client</label>
        <input type="number" className="input" required value={litersReceived} onChange={e => setLitersReceived(e.target.value)} placeholder="0" />
      </div>

      {litersReceived && (
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '-0.5rem' }}>
          New Total Expected: <strong>₦{(parseFloat(litersReceived) * sale.amountPerLiter).toLocaleString()}</strong>
        </p>
      )}

      <div className="form-actions" style={{ marginTop: '2rem' }}>
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Confirm Delivery"}</button>
      </div>
    </form>
  );
}
