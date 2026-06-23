"use client";

import { useState } from "react";

export default function AddTransporterForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/transporters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add transporter");
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
        <label>Transporter Name</label>
        <input name="name" type="text" className="input" required placeholder="e.g., Dan-Gotech Transport" />
      </div>

      <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Initial Truck Details</h3>
      
      <div className="form-group">
        <label>Truck Plate/ID</label>
        <input name="truckNameId" type="text" className="input" required placeholder="e.g., KJA-123-XY" />
      </div>

      <div className="form-group">
        <label>Capacity (Liters)</label>
        <input name="capacityLiters" type="number" className="input" required placeholder="e.g., 33000" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Driver Name</label>
          <input name="driverName" type="text" className="input" required placeholder="e.g., John Doe" />
        </div>
        <div className="form-group">
          <label>Driver Phone</label>
          <input name="driverPhone" type="tel" className="input" required placeholder="e.g., 08012345678" />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Add Transporter"}
        </button>
      </div>
    </form>
  );
}
