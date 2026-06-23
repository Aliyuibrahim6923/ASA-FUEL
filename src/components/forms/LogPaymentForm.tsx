"use client";
import { useState, useEffect } from "react";

export default function LogPaymentForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [clients, setClients] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/clients').then(res => res.json()).then(data => { if(Array.isArray(data)) setClients(data) }).catch(e => console.error(e));
    fetch('/api/sales').then(res => res.json()).then(data => { if(Array.isArray(data)) setSales(data) }).catch(e => console.error(e));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Auto-inject fields for Inflow
    data.type = "INFLOW";
    data.category = "CLIENT_PAYMENT";

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to log payment");
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
          <label>Client</label>
          <select name="clientId" className="input" required style={{ backgroundColor: 'white' }}>
            <option value="">Select a Client</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Linked Sale / Order Ref</label>
          <select name="saleId" className="input" required style={{ backgroundColor: 'white' }}>
            <option value="">Select Sale</option>
            {sales.filter(s => s.status !== 'CLEARED').map(s => <option key={s.id} value={s.id}>Sale {s.id.slice(0,6)} ({s.client?.name})</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Amount Received (₦)</label>
        <input name="amount" type="number" className="input" required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Payment Purpose</label>
          <select name="paymentPurpose" className="input" required style={{ backgroundColor: 'white' }}>
            <option value="PART_PAYMENT">Part Payment</option>
            <option value="FULL_SETTLEMENT">Full Settlement</option>
            <option value="ADVANCE_DEPOSIT">Advance Deposit</option>
            <option value="DEBT_CLEARANCE">Debt Clearance</option>
          </select>
        </div>
        <div className="form-group">
          <label>Payment Method</label>
          <select name="paymentMethod" className="input" required style={{ backgroundColor: 'white' }}>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CASH">Cash</option>
            <option value="CHEQUE">Cheque</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Log Payment"}</button>
      </div>
    </form>
  );
}
