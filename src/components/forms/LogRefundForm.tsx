"use client";
import { useState } from "react";

export default function LogRefundForm({ order, onSuccess, onCancel }: { order: any, onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [amount, setAmount] = useState(order?.cashEquivalentReturned || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cashEquivalentReturned: parseFloat(amount)
        }),
      });
      if (!response.ok) throw new Error("Failed to log refund");
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
        <p><strong>Total Order Cost:</strong> ₦{(order.orderCost + order.loadingCost + order.transportCost).toLocaleString()}</p>
        <p><strong>Status:</strong> {order.status}</p>
        {order.cashEquivalentReturned ? <p><strong>Previously Returned:</strong> <span style={{ color: 'var(--color-primary)' }}>₦{order.cashEquivalentReturned.toLocaleString()}</span></p> : null}
      </div>

      <div className="form-group">
        <label>Record Cash Equivalent Returned (₦)</label>
        <input type="number" className="input" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
      </div>

      <div className="form-actions" style={{ marginTop: '2rem' }}>
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Log Refund"}</button>
      </div>
    </form>
  );
}
