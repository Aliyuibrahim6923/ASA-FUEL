"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import CreateOrderForm from "@/components/forms/CreateOrderForm";
import EditOrderForm from "@/components/forms/EditOrderForm";
import ViewRecordModal from "@/components/ViewRecordModal";
import ChangeOrderForm from "@/components/forms/ChangeOrderForm";
import LogRefundForm from "@/components/forms/LogRefundForm";

export default function OrderManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isChangeOrderModalOpen, setIsChangeOrderModalOpen] = useState(false);
  const [isLogRefundModalOpen, setIsLogRefundModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  const loadOrders = () => {
    fetch('/api/orders').then(res => res.json()).then(data => { if(Array.isArray(data)) setOrders(data) }).catch(e => console.error(e));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      loadOrders();
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
                <th>Source</th>
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
                  <td>{order.sourceDepot}</td>
                  <td>₦{(((order.orderCost + order.transportCost) * order.litersOrdered) + order.loadingCost).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${order.status === 'CONFIRMED' ? 'badge-success' : (order.status === 'CANCELLED' ? 'badge-danger' : (order.status === 'CHANGED' ? 'badge-info' : 'badge-warning'))}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {order.status === 'PENDING' && (
                        <>
                          <button className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => updateStatus(order.id, 'CONFIRMED')}>Confirm Order</button>
                          <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => { setSelectedOrder(order); setIsChangeOrderModalOpen(true); }}>Change Order</button>
                          <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={() => updateStatus(order.id, 'CANCELLED')}>Cancel Order</button>
                        </>
                      )}
                      {(order.status === 'CANCELLED' || order.status === 'CHANGED') && (
                         <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => { setSelectedOrder(order); setIsLogRefundModalOpen(true); }}>{order.status === 'CANCELLED' ? 'Refund Log' : 'Record Cash Equivalent Returned'}</button>
                      )}
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#374151' }} onClick={() => { setSelectedOrder(order); setIsViewModalOpen(true); }}>View Details</button>
                        <button className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '0.375rem' }} onClick={() => { setSelectedOrder(order); setIsEditModalOpen(true); }}>Edit</button>
                      </div>
                      {order.status === 'CHANGED' && (
                        <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>View Swap</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                    <td colSpan={7} style={{ textAlign: 'center' }}>No orders found</td>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Procure New Order">
        <CreateOrderForm onSuccess={() => { setIsModalOpen(false); loadOrders(); }} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit Order #${selectedOrder?.id?.slice(0,8) || ''}`}>
        <EditOrderForm order={selectedOrder} onSuccess={() => { setIsEditModalOpen(false); loadOrders(); }} onCancel={() => setIsEditModalOpen(false)} />
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Order Details">
        <ViewRecordModal record={selectedOrder} title={`Order #${selectedOrder?.id?.slice(0,8) || ''}`} />
      </Modal>

      <Modal isOpen={isChangeOrderModalOpen} onClose={() => setIsChangeOrderModalOpen(false)} title="Change Order (Switch Fuel)">
        <ChangeOrderForm order={selectedOrder} onSuccess={() => { setIsChangeOrderModalOpen(false); loadOrders(); }} onCancel={() => setIsChangeOrderModalOpen(false)} />
      </Modal>

      <Modal isOpen={isLogRefundModalOpen} onClose={() => setIsLogRefundModalOpen(false)} title="Record Cash Equivalent Returned">
        <LogRefundForm order={selectedOrder} onSuccess={() => { setIsLogRefundModalOpen(false); loadOrders(); }} onCancel={() => setIsLogRefundModalOpen(false)} />
      </Modal>
    </>
  );
}
