"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import AddTransporterForm from "@/components/forms/AddTransporterForm";
import InitiateTransportForm from "@/components/forms/InitiateTransportForm";
import ManageDeductionsForm from "@/components/forms/ManageDeductionsForm";

export default function FleetManagement() {
  const [isTransporterModalOpen, setIsTransporterModalOpen] = useState(false);
  const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);
  const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false);
  
  const [transporters, setTransporters] = useState<any[]>([]);
  const [transports, setTransports] = useState<any[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);

  const loadData = () => {
    fetch('/api/transporters').then(res => res.json()).then(data => { if(Array.isArray(data)) setTransporters(data) }).catch(e => console.error(e));
    fetch('/api/transports').then(res => res.json()).then(data => { if(Array.isArray(data)) setTransports(data) }).catch(e => console.error(e));
    fetch('/api/maintenance').then(res => res.json()).then(data => { if(Array.isArray(data)) setMaintenance(data) }).catch(e => console.error(e));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Fleet Management</h1>
          <p className="page-subtitle">Manage transporters, trucks, drivers, and transport financials.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-outline" onClick={() => setIsTransportModalOpen(true)}>
            Initiate Transport
            </button>
            <button className="btn btn-primary" onClick={() => setIsTransporterModalOpen(true)}>
            + Add Transporter
            </button>
        </div>
      </div>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Active Transporters & Trucks</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Transporter Name</th>
                <th>Truck ID</th>
                <th>Capacity</th>
                <th>Driver Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transporters.flatMap(transporter => 
                (transporter.trucks && transporter.trucks.length > 0 ? transporter.trucks : [{}]).map((truck: any, idx: number) => (
                  <tr key={`${transporter.id}-${idx}`}>
                    <td>{transporter.name}</td>
                    <td>{truck.truckNameId || '-'}</td>
                    <td>{truck.capacityLiters ? `${truck.capacityLiters}L` : '-'}</td>
                    <td>{truck.driverName || '-'}</td>
                    <td><span className="badge badge-success">Active</span></td>
                  </tr>
                ))
              )}
              {transporters.length === 0 && (
                <tr>
                    <td colSpan={5} style={{ textAlign: 'center' }}>No transporters found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid-cards" style={{ marginTop: '2rem' }}>
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Transport Earnings (Tab A)</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Truck</th>
                  <th>Base Rate</th>
                  <th>Net Paid</th>
                </tr>
              </thead>
              <tbody>
                {transports.map(t => (
                  <tr key={t.id}>
                    <td>{t.truck?.truckNameId}</td>
                    <td>₦{(t.ratePerLiter * t.litersCarried).toLocaleString()}</td>
                    <td>₦{t.netTransportFeePaid || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Maintenance (Tab B)</h2>
            <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setIsDeductionModalOpen(true)}>Manage</button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Truck ID</th>
                  <th>Cost</th>
                  <th>Desc</th>
                </tr>
              </thead>
              <tbody>
                {maintenance.map(m => (
                  <tr key={m.id}>
                    <td>{m.truck?.truckNameId}</td>
                    <td><span style={{ color: 'var(--color-danger)' }}>₦{m.cost.toLocaleString()}</span></td>
                    <td>{m.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={isTransporterModalOpen} onClose={() => setIsTransporterModalOpen(false)} title="Add New Transporter">
        <AddTransporterForm onSuccess={() => { setIsTransporterModalOpen(false); loadData(); }} onCancel={() => setIsTransporterModalOpen(false)} />
      </Modal>

      <Modal isOpen={isTransportModalOpen} onClose={() => setIsTransportModalOpen(false)} title="Initiate Transport">
        <InitiateTransportForm onSuccess={() => { setIsTransportModalOpen(false); loadData(); }} onCancel={() => setIsTransportModalOpen(false)} />
      </Modal>

      <Modal isOpen={isDeductionModalOpen} onClose={() => setIsDeductionModalOpen(false)} title="Log Maintenance Deduction">
        <ManageDeductionsForm onSuccess={() => { setIsDeductionModalOpen(false); loadData(); }} onCancel={() => setIsDeductionModalOpen(false)} />
      </Modal>
    </>
  );
}
