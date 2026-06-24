"use client";

import { useState } from "react";

export default function CreateOrderForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || "Failed to create order");
      }

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
      
      <div className="form-row">
        <div className="form-group">
          <label>Petroleum Type</label>
          <select name="petroleumType" className="input" required style={{ backgroundColor: 'white' }}>
            <option value="PMS">PMS</option>
            <option value="AGO">AGO</option>
            <option value="DPK">DPK</option>
            <option value="KEROSENE">Kerosene</option>
          </select>
        </div>
        <div className="form-group">
          <label>Volume (Liters)</label>
          <input name="litersOrdered" type="number" className="input" required placeholder="e.g., 45000" />
        </div>
      </div>

      <div className="form-group" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)' }}>Sourcing Details</h3>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Source Depot</label>
          <input name="sourceDepot" type="text" className="input" required placeholder="e.g., Apapa Terminal" />
        </div>
        <div className="form-group">
          <label>Depot Ticket / Waybill Ref</label>
          <input name="depotTicketNumber" type="text" className="input" placeholder="Ticket number" />
        </div>
      </div>

      <div className="form-group">
        <label>Expected Delivery Date</label>
        <input name="expectedDeliveryDate" type="date" className="input" required />
      </div>

      <div className="form-group" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)' }}>Cost Breakdown</h3>
      </div>

      <div className="form-group">
        <label>Base Order Cost (₦ / Liter)</label>
        <input name="orderCost" type="number" className="input" required placeholder="0.00" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Loading Cost (₦)</label>
          <input name="loadingCost" type="number" className="input" required placeholder="0.00" />
        </div>
        <div className="form-group">
          <label>Estimated Transport Cost (₦ / Liter)</label>
          <input name="transportCost" type="number" className="input" required placeholder="0.00" />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create Order"}
        </button>
      </div>
    </form>
  );
}
