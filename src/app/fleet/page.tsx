"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import AddTransporterForm from "@/components/forms/AddTransporterForm";

export default function FleetManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Fleet Management</h1>
          <p className="page-subtitle">Manage transporters, trucks, drivers, and transport financials.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          + Add Transporter
        </button>
      </div>
      
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Active Transporters</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Transporter Name</th>
                <th>Active Trucks</th>
                <th>Total Trips</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dan-Gotech Transport</td>
                <td>12</td>
                <td>450</td>
                <td><span className="badge badge-success">Active</span></td>
                <td><button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>View Details</button></td>
              </tr>
              <tr>
                <td>Independent Driver (John)</td>
                <td>1</td>
                <td>24</td>
                <td><span className="badge badge-success">Active</span></td>
                <td><button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>View Details</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid-cards" style={{ marginTop: '2rem' }}>
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Transport Fees & Earnings (Tab A)</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>View the profitability and losses associated with each trip.</p>
          <button className="btn btn-outline" style={{ marginTop: '1rem' }}>Open Finance View</button>
        </div>
        
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Maintenance & Deductions (Tab B)</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Track maintenance costs, lost liters, and related deductions.</p>
          <button className="btn btn-outline" style={{ marginTop: '1rem' }}>Manage Deductions</button>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Add New Transporter"
      >
        <AddTransporterForm 
          onSuccess={() => setIsModalOpen(false)} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </>
  );
}
