"use client";
import { useState } from "react";

export default function EditSaleForm({ sale, onSuccess, onCancel }: { sale: any, onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`/api/sales/${sale.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           amountPerLiter: parseFloat(data.amountPerLiter as string),
           litersDespatched: parseFloat(data.litersDespatched as string)
        }),
      });

      if (!response.ok) throw new Error("Failed to edit sale");
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
      {error && <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>{error}</div>}
      
      <div className="form-group">
        <label>Amount per Liter (₦)</label>
        <input name="amountPerLiter" type="number" className="input" defaultValue={sale.amountPerLiter} required />
      </div>

      <div className="form-group">
        <label>Liters Dispatched</label>
        <input name="litersDespatched" type="number" className="input" defaultValue={sale.litersDespatched} required />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
      </div>
    </form>
  );
}
