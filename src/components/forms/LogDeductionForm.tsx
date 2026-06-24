"use client";
import { useState } from "react";

export default function LogDeductionForm({ transport, onSuccess, onCancel }: { transport: any, onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [litersLost, setLitersLost] = useState("");
  const [maintenanceCost, setMaintenanceCost] = useState("");

  const calculatedLitersCash = parseFloat(litersLost || "0") * transport.ratePerLiter;
  const totalDeduction = calculatedLitersCash + parseFloat(maintenanceCost || "0");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/transports/${transport.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          addLitersLost: parseFloat(litersLost || "0"),
          addMaintenanceCost: parseFloat(maintenanceCost || "0")
        }),
      });
      if (!response.ok) throw new Error("Failed to log deduction");
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
        <label>Liters Lost (Volume)</label>
        <input type="number" className="input" value={litersLost} onChange={e => setLitersLost(e.target.value)} placeholder="0" />
        {litersLost && <span style={{fontSize: '0.75rem', color: 'var(--color-danger)'}}>Cash Equivalent: ₦{calculatedLitersCash.toLocaleString()}</span>}
      </div>

      <div className="form-group">
        <label>Maintenance Cost / Cash Deduction (₦)</label>
        <input type="number" className="input" value={maintenanceCost} onChange={e => setMaintenanceCost(e.target.value)} placeholder="0" />
      </div>

      <div style={{ padding: '1rem', backgroundColor: '#FEF2F2', borderRadius: '0.5rem', marginTop: '1rem' }}>
        <p style={{ margin: 0, color: '#991B1B', fontWeight: 600 }}>Total Calculated Deduction: ₦{totalDeduction.toLocaleString()}</p>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Log Deduction"}</button>
      </div>
    </form>
  );
}
