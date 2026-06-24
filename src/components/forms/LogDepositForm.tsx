"use client";
import { useState } from "react";

export default function LogDepositForm({ transport, onSuccess, onCancel }: { transport: any, onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<"CASH" | "PETROLEUM">("CASH");
  const [amount, setAmount] = useState("");

  const calculatedCash = type === "PETROLEUM" ? (parseFloat(amount || "0") * transport.ratePerLiter) : parseFloat(amount || "0");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/transports/${transport.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addDeposit: calculatedCash }),
      });
      if (!response.ok) throw new Error("Failed to log deposit");
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
      {error && <div className="alert alert-danger" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '0.5rem' }}>{error}</div>}
      
      <div className="form-group">
        <label>Deposit Type</label>
        <select className="input" value={type} onChange={e => setType(e.target.value as any)}>
          <option value="CASH">Flat Cash Amount (₦)</option>
          <option value="PETROLEUM">Petroleum Equivalent (Liters)</option>
        </select>
      </div>

      <div className="form-group">
        <label>{type === "CASH" ? "Amount (₦)" : "Liters"}</label>
        <input type="number" className="input" required value={amount} onChange={e => setAmount(e.target.value)} />
      </div>

      {type === "PETROLEUM" && amount && (
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '-0.5rem' }}>
          Calculated Cash Value: <strong>₦{calculatedCash.toLocaleString()}</strong> (at ₦{transport.ratePerLiter}/L)
        </p>
      )}

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Log Deposit"}</button>
      </div>
    </form>
  );
}
