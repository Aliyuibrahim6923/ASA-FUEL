"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import CreateClientForm from "@/components/forms/CreateClientForm";
import CreateSaleForm from "@/components/forms/CreateSaleForm";

export default function SalesManagement() {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);

  const loadData = () => {
    fetch('/api/clients').then(res => res.json()).then(data => { if(Array.isArray(data)) setClients(data) }).catch(e => console.error(e));
    fetch('/api/sales').then(res => res.json()).then(data => { if(Array.isArray(data)) setSales(data) }).catch(e => console.error(e));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales & Client Management</h1>
          <p className="page-subtitle">Manage outbound deliveries and track client receivables.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-outline" onClick={() => setIsClientModalOpen(true)}>
            + Add Client
            </button>
            <button className="btn btn-primary" onClick={() => setIsSaleModalOpen(true)}>
            + Record Sale
            </button>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Client Receivables & Debt Ledger</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Total Expected</th>
                <th>Total Paid</th>
                <th>Outstanding Balance</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => {
                 const totalExpected = client.sales?.reduce((sum: number, s: any) => sum + s.totalExpectedAmount, 0) || 0;
                 const totalPaid = client.sales?.reduce((sum: number, s: any) => sum + s.paymentReceived, 0) || 0;
                 const outstanding = totalExpected - totalPaid;
                 const status = outstanding <= 0 && totalExpected > 0 ? "Cleared" : (outstanding < totalExpected && totalPaid > 0 ? "Part-Paid" : (outstanding > 0 ? "Unpaid" : "No Sales"));

                 return (
                  <tr key={client.id}>
                    <td>{client.name}</td>
                    <td>₦{totalExpected.toLocaleString()}</td>
                    <td>₦{totalPaid.toLocaleString()}</td>
                    <td style={{ color: outstanding > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                      ₦{outstanding.toLocaleString()}
                    </td>
                    <td><span className="badge">{status}</span></td>
                    <td><button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>View Details</button></td>
                  </tr>
                 )
              })}
              {clients.length === 0 && (
                <tr>
                    <td colSpan={6} style={{ textAlign: 'center' }}>No clients found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Recent Sales</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Sale ID</th>
                <th>Client Name</th>
                <th>Truck ID</th>
                <th>Liters Despatched</th>
                <th>Liters Received</th>
                <th>Amount / Liter</th>
                <th>Total Expected</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(sale => (
                <tr key={sale.id}>
                  <td>{sale.id.slice(0, 8)}</td>
                  <td>{sale.client?.name}</td>
                  <td>{sale.truck?.truckNameId}</td>
                  <td>{sale.litersDespatched}</td>
                  <td>{sale.litersReceived}</td>
                  <td>₦{sale.amountPerLiter}</td>
                  <td>₦{sale.totalExpectedAmount.toLocaleString()}</td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                    <td colSpan={7} style={{ textAlign: 'center' }}>No sales found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} title="Add New Client">
        <CreateClientForm onSuccess={() => { setIsClientModalOpen(false); loadData(); }} onCancel={() => setIsClientModalOpen(false)} />
      </Modal>

      <Modal isOpen={isSaleModalOpen} onClose={() => setIsSaleModalOpen(false)} title="Record Sale Delivery">
        <CreateSaleForm onSuccess={() => { setIsSaleModalOpen(false); loadData(); }} onCancel={() => setIsSaleModalOpen(false)} />
      </Modal>
    </>
  );
}
