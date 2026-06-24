"use client";
import { useState } from "react";

export default function EditOrderForm({ order, onSuccess, onCancel }: { order: any, onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           petroleumType: data.petroleumType,
           litersOrdered: parseFloat(data.litersOrdered as string),
           orderCost: parseFloat(data.orderCost as string),
           loadingCost: parseFloat(data.loadingCost as string),
           transportCost: parseFloat(data.transportCost as string),
        }),
      });

      if (!response.ok) throw new Error("Failed to edit order");
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
      {error && <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>{error}</div>}
      
      <div className="form-group">
        <label>Petroleum Type</label>
        <select name="petroleumType" className="input" defaultValue={order.petroleumType} required>
          <option value="PMS">PMS (Petrol)</option>
          <option value="AGO">AGO (Diesel)</option>
          <option value="DPK">DPK (Kerosene)</option>
        </select>
      </div>

      <div className="form-group">
        <label>Liters Ordered</label>
        <input name="litersOrdered" type="number" className="input" defaultValue={order.litersOrdered} required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Order Cost (₦ / Liter)</label>
          <input name="orderCost" type="number" className="input" defaultValue={order.orderCost} required />
        </div>
        <div className="form-group">
          <label>Loading Cost (₦)</label>
          <input name="loadingCost" type="number" className="input" defaultValue={order.loadingCost} required />
        </div>
        <div className="form-group">
          <label>Transport Cost (₦ / Liter)</label>
          <input name="transportCost" type="number" className="input" defaultValue={order.transportCost} required />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
      </div>
    </form>
  );
}
