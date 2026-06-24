"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import CreateClientForm from "@/components/forms/CreateClientForm";
import CreateSaleForm from "@/components/forms/CreateSaleForm";
import LogLitersReceivedForm from "@/components/forms/LogLitersReceivedForm";

export default function SalesManagement() {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isLogLitersModalOpen, setIsLogLitersModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);
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

      <div className="card" style={{ background: 'linear-gradient(to bottom right, #ffffff, #fafafa)', border: '1px solid #eaeaea', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', borderRadius: '1.25rem', overflow: 'hidden', padding: 0 }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--color-divider)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.8)' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></span>
              Client Receivables & Debt Ledger
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, marginTop: '0.25rem' }}>Track all client debt and paid balances.</p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'right' }}>
            <div>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', fontWeight: 600, letterSpacing: '0.05em' }}>Total Outstanding Debt</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-danger)' }}>
                ₦{clients.reduce((acc, c) => {
                  const expected = c.sales?.reduce((sum: number, s: any) => sum + s.totalExpectedAmount, 0) || 0;
                  const paid = c.sales?.reduce((sum: number, s: any) => sum + s.paymentReceived, 0) || 0;
                  return acc + Math.max(0, expected - paid);
                }, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{ padding: '1rem 2rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Client Name</th>
                <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Total Expected</th>
                <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Total Paid</th>
                <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Outstanding Balance</th>
                <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                <th style={{ padding: '1rem 2rem', color: '#6b7280', fontSize: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Action</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: 'white' }}>
              {clients.map(client => {
                 const totalExpected = client.sales?.reduce((sum: number, s: any) => sum + s.totalExpectedAmount, 0) || 0;
                 const totalPaid = client.sales?.reduce((sum: number, s: any) => sum + s.paymentReceived, 0) || 0;
                 const outstanding = totalExpected - totalPaid;
                 const status = outstanding <= 0 && totalExpected > 0 ? "Cleared" : (outstanding < totalExpected && totalPaid > 0 ? "Part-Paid" : (outstanding > 0 ? "Unpaid" : "No Sales"));

                 return (
                  <tr key={client.id} style={{ transition: 'background-color 0.2s', borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '1.25rem 2rem', fontWeight: 600, color: '#111827' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#4338ca' }}>
                          {client.name.charAt(0)}
                        </div>
                        {client.name}
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1rem', color: '#4b5563' }}>₦{totalExpected.toLocaleString()}</td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <span style={{ color: '#065f46', fontWeight: 500 }}>₦{totalPaid.toLocaleString()}</span>
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      {outstanding > 0 ? (
                        <span style={{ display: 'inline-flex', padding: '0.25rem 0.75rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                          ₦{outstanding.toLocaleString()}
                        </span>
                      ) : (
                         <span style={{ color: '#4b5563', fontWeight: 500 }}>₦0</span>
                      )}
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <span className={`badge ${status === 'Cleared' ? 'badge-success' : (status === 'Part-Paid' ? 'badge-warning' : (status === 'Unpaid' ? 'badge-danger' : ''))}`} style={{ fontSize: '0.7rem' }}>{status}</span>
                    </td>
                    <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                      <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#374151' }}>View Details</button>
                    </td>
                  </tr>
                 )
              })}
              {clients.length === 0 && (
                <tr>
                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>No clients found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="card" style={{ background: 'linear-gradient(to bottom right, #ffffff, #fafafa)', border: '1px solid #eaeaea', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', borderRadius: '1.25rem', overflow: 'hidden', padding: 0, marginTop: '2rem' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--color-divider)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.8)' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', backgroundColor: 'var(--color-info)' }}></span>
              Recent Sales & Outbound Deliveries
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, marginTop: '0.25rem' }}>Track all fuel dispatched to end clients.</p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'right' }}>
            <div>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', fontWeight: 600, letterSpacing: '0.05em' }}>Total Receivables Active</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-info)' }}>₦{sales.reduce((sum, s) => sum + s.totalExpectedAmount, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{ padding: '1rem 2rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Sale ID / Client</th>
                <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Truck ID</th>
                <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Dispatched</th>
                <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Received</th>
                <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Rate/L</th>
                <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Total Expected</th>
                <th style={{ padding: '1rem 2rem', color: '#6b7280', fontSize: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Action</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: 'white' }}>
              {sales.map(sale => (
                <tr key={sale.id} style={{ transition: 'background-color 0.2s', borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <p style={{ fontWeight: 600, color: '#111827', margin: 0 }}>{sale.client?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, marginTop: '0.25rem' }}>#{sale.id.slice(0, 8)}</p>
                  </td>
                  <td style={{ padding: '1.25rem 1rem', color: '#4b5563' }}>
                    <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', backgroundColor: '#f3f4f6', borderRadius: '0.25rem', fontSize: '0.75rem', fontFamily: 'monospace' }}>{sale.truck?.truckNameId || 'N/A'}</span>
                  </td>
                  <td style={{ padding: '1.25rem 1rem', color: '#4b5563' }}>{sale.litersDespatched.toLocaleString()}L</td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    {sale.litersReceived ? (
                      <span style={{ display: 'inline-flex', padding: '0.25rem 0.75rem', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>{sale.litersReceived.toLocaleString()}L</span>
                    ) : (
                      <span style={{ display: 'inline-flex', padding: '0.25rem 0.75rem', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>Pending</span>
                    )}
                  </td>
                  <td style={{ padding: '1.25rem 1rem', color: '#4b5563' }}>₦{sale.amountPerLiter}</td>
                  <td style={{ padding: '1.25rem 1rem', fontWeight: 700, color: '#111827', fontSize: '1.125rem' }}>₦{sale.totalExpectedAmount.toLocaleString()}</td>
                  <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                     {!sale.litersReceived && (
                       <button className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '0.375rem', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.15)', background: 'linear-gradient(135deg, var(--color-info), #2563EB)', color: 'white', border: 'none' }} onClick={() => { setSelectedSale(sale); setIsLogLitersModalOpen(true); }}>Log Delivery</button>
                     )}
                     {sale.litersReceived > 0 && (
                       <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#374151' }}>View Record</button>
                     )}
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>No outbound sales found.</td>
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

      <Modal isOpen={isLogLitersModalOpen} onClose={() => setIsLogLitersModalOpen(false)} title="Log Received Delivery">
        <LogLitersReceivedForm sale={selectedSale} onSuccess={() => { setIsLogLitersModalOpen(false); loadData(); }} onCancel={() => setIsLogLitersModalOpen(false)} />
      </Modal>
    </>
  );
}
