"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import CreateOrderForm from "@/components/forms/CreateOrderForm";

export default function OrderManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Order Management</h1>
          <p className="page-subtitle">Track procurement of fuel from the depot/source to the station or client.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          + Create New Order
        </button>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Active Orders</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Petroleum Type</th>
                <th>Volume</th>
                <th>Source</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#1001</td>
                <td>PMS</td>
                <td>33,000L</td>
                <td>Depot A</td>
                <td><span className="badge badge-warning">Pending</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Edit</button>
                    <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>Cancel</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>#1002</td>
                <td>Kerosene</td>
                <td>45,000L</td>
                <td>Depot B</td>
                <td><span className="badge badge-info">Changed</span></td>
                <td><button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>View Swap</button></td>
              </tr>
              <tr>
                <td>#1003</td>
                <td>AGO</td>
                <td>15,000L</td>
                <td>Depot C</td>
                <td><span className="badge badge-danger">Cancelled</span></td>
                <td><button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Refund Log</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid-cards" style={{ marginTop: '2rem' }}>
        <div className="card">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Procured Volume</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>1,250,000 L</p>
          <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>This month</div>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Average Loading Cost</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>₦15.50 / L</p>
          <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--color-success)' }}>-2% from last month</div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Create New Order"
      >
        <CreateOrderForm 
          onSuccess={() => setIsModalOpen(false)} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </>
  );
}
