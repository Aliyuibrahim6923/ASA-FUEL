"use client";

import { useState } from "react";

export default function CreateClientForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || "Failed to create client");
      }
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
        <label>Client / Company Name</label>
        <input name="name" type="text" className="input" required placeholder="e.g., Alpha Logistics" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Phone Number</label>
          <input name="phone" type="tel" className="input" placeholder="e.g., +234..." />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input name="email" type="email" className="input" placeholder="contact@company.com" />
        </div>
      </div>

      <div className="form-group">
        <label>Physical Address / Station Location</label>
        <input name="address" type="text" className="input" placeholder="123 Industrial Layout..." />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Contact Person (Manager)</label>
          <input name="contactPerson" type="text" className="input" placeholder="Name of Manager" />
        </div>
        <div className="form-group">
          <label>Client Type</label>
          <select name="clientType" className="input" style={{ backgroundColor: 'white' }}>
            <option value="RETAIL_STATION">Retail Station</option>
            <option value="COMMERCIAL">Commercial / Corporate</option>
            <option value="INDEPENDENT">Independent Bulk Buyer</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Create Client"}</button>
      </div>
    </form>
  );
}
