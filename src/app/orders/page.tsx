"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import CreateOrderForm from "@/components/forms/CreateOrderForm";

export default function OrderManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  const loadData = () => {
    fetch('/api/orders').then(res => res.json()).then(data => { if(Array.isArray(data)) setOrders(data) }).catch(e => console.error(e));
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      loadData();
    } catch(e) {
      console.error(e);
    }
  };

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
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Active Orders</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Petroleum Type</th>
                <th>Volume</th>
                <th>Total Cost</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id.slice(0, 8)}</td>
                  <td>{order.petroleumType}</td>
                  <td>{order.litersOrdered.toLocaleString()}L</td>
                  <td>₦{(order.orderCost + order.loadingCost + order.transportCost).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${order.status === 'CONFIRMED' ? 'badge-success' : (order.status === 'CANCELLED' ? 'badge-danger' : 'badge-warning')}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {order.status === 'PENDING' && (
                        <>
                          <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => updateStatus(order.id, 'CONFIRMED')}>Confirm</button>
                          <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={() => updateStatus(order.id, 'CANCELLED')}>Cancel</button>
                        </>
                      )}
                      {order.status !== 'PENDING' && (
                         <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>View Details</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                    <td colSpan={6} style={{ textAlign: 'center' }}>No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-cards">
        <div className="card">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Pending Orders</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{orders.filter(o => o.status === 'PENDING').length}</p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Volume (This Month)</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{orders.reduce((sum, o) => sum + o.litersOrdered, 0).toLocaleString()}L</p>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Order">
        <CreateOrderForm onSuccess={() => { setIsModalOpen(false); loadData(); }} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}
