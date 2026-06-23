"use client";

import { useState, useEffect } from "react";

export default function CreateSaleForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [clients, setClients] = useState<any[]>([]);
  const [trucks, setTrucks] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/clients').then(res => res.json()).then(setClients).catch(e => console.error(e));
    fetch('/api/transporters').then(res => res.json()).then(transporters => {
        if(Array.isArray(transporters)) {
          const allTrucks = transporters.flatMap((t: any) => t.trucks || []);
          setTrucks(allTrucks);
        }
    }).catch(e => console.error(e));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create sale");
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
        <label>Client</label>
        <select name="clientId" className="input" required style={{ backgroundColor: 'white' }}>
          <option value="">Select a Client</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label>Delivering Truck</label>
        <select name="truckId" className="input" required style={{ backgroundColor: 'white' }}>
          <option value="">Select Truck</option>
          {trucks.map(t => <option key={t.id} value={t.id}>{t.truckNameId}</option>)}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Liters Despatched</label>
          <input name="litersDespatched" type="number" className="input" required />
        </div>
        <div className="form-group">
          <label>Liters Received</label>
          <input name="litersReceived" type="number" className="input" required />
        </div>
      </div>

      <div className="form-group">
        <label>Amount per Liter (₦)</label>
        <input name="amountPerLiter" type="number" className="input" required />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Create Sale"}</button>
      </div>
    </form>
  );
}
