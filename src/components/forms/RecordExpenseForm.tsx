"use client";
import { useState } from "react";

export default function RecordExpenseForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [category, setCategory] = useState("PERSONAL_EXPENSE");
  
  const [orders, setOrders] = useState<any[]>([]);
  const [transports, setTransports] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/orders').then(res => res.json()).then(data => { if(Array.isArray(data)) setOrders(data) });
    fetch('/api/transports').then(res => res.json()).then(data => { if(Array.isArray(data)) setTransports(data) });
    fetch('/api/clients').then(res => res.json()).then(data => { if(Array.isArray(data)) setClients(data) });
  }, []);

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
        <select name="category" className="input" value={category} onChange={e => setCategory(e.target.value)} required style={{ backgroundColor: 'white' }}>
          <option value="PERSONAL_EXPENSE">Personal / Administrative</option>
          <option value="FLEET_EXPENSE">Fleet / Tolls / Union</option>
          <option value="TRANSPORT_PAYMENT">Transport Payment</option>
          <option value="ORDER_PAYMENT">Depot / Order Payment</option>
        </select>
      </div>

      {category === 'TRANSPORT_PAYMENT' && (
        <div className="form-row">
          <div className="form-group">
            <label>Linked Order</label>
            <select name="orderId" className="input" required style={{ backgroundColor: 'white' }}>
              <option value="">Select Order</option>
              {orders.map(o => <option key={o.id} value={o.id}>Order #{o.id.slice(0,6)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Transporter / Trip</label>
            <select name="transporterId" className="input" required style={{ backgroundColor: 'white' }}>
              <option value="">Select Trip</option>
              {transports.map(t => <option key={t.id} value={t.id}>Trip #{t.id.slice(0,6)} - {t.truck?.truckNameId}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Client Destination</label>
            <select name="clientId" className="input" required style={{ backgroundColor: 'white' }}>
              <option value="">Select Client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
      )}

      {category === 'ORDER_PAYMENT' && (
        <div className="form-group">
          <label>Select Depot / Order Source</label>
          <select name="orderId" className="input" required style={{ backgroundColor: 'white' }}>
            <option value="">Select Associated Order</option>
            {orders.map(o => <option key={o.id} value={o.id}>Order #{o.id.slice(0,6)} - {o.petroleumType} (Depot Link)</option>)}
          </select>
        </div>
      )}

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
