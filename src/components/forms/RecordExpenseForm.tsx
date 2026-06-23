"use client";
import { useState } from "react";

export default function RecordExpenseForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    data.type = "OUTFLOW";

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to record expense");
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
        <label>Expense Category</label>
        <select name="category" className="input" required style={{ backgroundColor: 'white' }}>
          <option value="PERSONAL_EXPENSE">Personal / Administrative</option>
          <option value="FLEET_EXPENSE">Fleet / Tolls / Union</option>
          <option value="TRANSPORT_PAYMENT">Transport Payment</option>
          <option value="ORDER_PAYMENT">Depot / Order Payment</option>
        </select>
      </div>

      <div className="form-group">
        <label>Amount (₦)</label>
        <input name="amount" type="number" className="input" required />
      </div>

      <div className="form-group">
        <label>Description / Reference</label>
        <input name="reference" type="text" className="input" required />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Record Expense"}</button>
      </div>
    </form>
  );
}
