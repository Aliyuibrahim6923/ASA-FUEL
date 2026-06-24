"use client";
import { useState } from "react";

export default function ChangeOrderForm({ order, onSuccess, onCancel }: { order: any, onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [petroleumType, setPetroleumType] = useState(order?.petroleumType || "PMS");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'CHANGED',
          petroleumType 
        }),
      });
      if (!response.ok) throw new Error("Failed to change order fuel type");
      onSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;

  return (
    <form onSubmit={handleSubmit} className="form-layout">
      {error && <div className="alert alert-danger" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '0.5rem' }}>{error}</div>}
      
      <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <p><strong>Order ID:</strong> {order.id.slice(0, 8)}</p>
        <p><strong>Current Fuel Type:</strong> {order.petroleumType}</p>
        <p><strong>Volume:</strong> {order.litersOrdered.toLocaleString()}L</p>
      </div>

      <div className="form-group">
        <label>Switch Fuel Type To</label>
        <select className="input" required value={petroleumType} onChange={e => setPetroleumType(e.target.value)}>
          <option value="PMS">PMS (Petrol)</option>
          <option value="AGO">AGO (Diesel)</option>
          <option value="DPK">DPK (Kerosene)</option>
        </select>
      </div>

      <div className="form-actions" style={{ marginTop: '2rem' }}>
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Confirm Change"}</button>
      </div>
    </form>
  );
}
