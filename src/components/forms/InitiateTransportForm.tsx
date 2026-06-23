"use client";
import { useState, useEffect } from "react";

export default function InitiateTransportForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [orders, setOrders] = useState<any[]>([]);
  const [trucks, setTrucks] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/orders').then(res => res.json()).then(setOrders).catch(e => console.error(e));
    fetch('/api/transporters').then(res => res.json()).then(transporters => {
        if(Array.isArray(transporters)) {
          setTrucks(transporters.flatMap((t: any) => t.trucks.map((truck: any) => ({ ...truck, transporterId: t.id }))));
        }
    }).catch(e => console.error(e));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // find transporterId from selected truck
    const selectedTruck = trucks.find(t => t.id === data.truckId);
    data.transporterId = selectedTruck?.transporterId;

    try {
      const response = await fetch('/api/transports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to initiate transport");
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
        <label>Select Order</label>
        <select name="orderId" className="input" required style={{ backgroundColor: 'white' }}>
          <option value="">Select an Order</option>
          {orders.map(o => <option key={o.id} value={o.id}>{o.petroleumType} - {o.litersOrdered}L</option>)}
        </select>
      </div>

      <div className="form-group">
        <label>Assign Truck</label>
        <select name="truckId" className="input" required style={{ backgroundColor: 'white' }}>
          <option value="">Select Truck</option>
          {trucks.map(t => <option key={t.id} value={t.id}>{t.truckNameId} ({t.capacityLiters}L)</option>)}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Destination</label>
          <input name="destination" type="text" className="input" required />
        </div>
        <div className="form-group">
          <label>Transport Type</label>
          <input name="transportType" type="text" className="input" required />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Liters Carried</label>
          <input name="litersCarried" type="number" className="input" required />
        </div>
        <div className="form-group">
          <label>Rate per Liter (₦)</label>
          <input name="ratePerLiter" type="number" className="input" required />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Initiate Transport"}</button>
      </div>
    </form>
  );
}
