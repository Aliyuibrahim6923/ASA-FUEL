"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import CreateClientForm from "@/components/forms/CreateClientForm";
import CreateSaleForm from "@/components/forms/CreateSaleForm";
import EditSaleForm from "@/components/forms/EditSaleForm";
import LogLitersReceivedForm from "@/components/forms/LogLitersReceivedForm";
import Link from "next/link";

export default function SalesManagement() {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogLitersModalOpen, setIsLogLitersModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);

  const loadData = () => {
    fetch('/api/clients').then(res => res.json()).then(data => { if(Array.isArray(data)) setClients(data) }).catch(e => console.error(e));
    loadSales();
  };

  const loadSales = () => {
    fetch('/api/sales').then(res => res.json()).then(data => { if(Array.isArray(data)) setSales(data) }).catch(e => console.error(e));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales Management</h1>
          <p className="page-subtitle">Manage outbound deliveries.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>

            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            + Record Sale
            </button>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', backgroundColor: '#f3f4f6', borderRadius: '0.25rem', fontSize: '0.75rem', fontFamily: 'monospace', width: 'fit-content' }}>{sale.truck?.truckNameId || 'N/A'}</span>
                      {sale.transportId && (
                        <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>Trip #{sale.transportId.slice(0, 6)}</span>
                      )}
                    </div>
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
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                       {!sale.litersReceived && (
                         <button className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '0.375rem', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.15)', background: 'linear-gradient(135deg, var(--color-info), #2563EB)', color: 'white', border: 'none' }} onClick={() => { setSelectedSale(sale); setIsLogLitersModalOpen(true); }}>Log Delivery</button>
                       )}
                       <div style={{ display: 'flex', gap: '0.5rem' }}>
                         <Link href={`/sales/${sale.id}`} className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#374151', textDecoration: 'none' }}>View Details</Link>
                         <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#374151' }} onClick={() => { setSelectedSale(sale); setIsEditModalOpen(true); }}>Edit</button>
                       </div>
                     </div>
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


      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Sale Delivery">
        <CreateSaleForm onSuccess={() => { setIsModalOpen(false); loadSales(); }} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit Sale #${selectedSale?.id?.slice(0,8) || ''}`}>
        <EditSaleForm sale={selectedSale} onSuccess={() => { setIsEditModalOpen(false); loadSales(); }} onCancel={() => setIsEditModalOpen(false)} />
      </Modal>

      <Modal isOpen={isLogLitersModalOpen} onClose={() => setIsLogLitersModalOpen(false)} title="Log Liters Received">
        <LogLitersReceivedForm sale={selectedSale} onSuccess={() => { setIsLogLitersModalOpen(false); loadSales(); }} onCancel={() => setIsLogLitersModalOpen(false)} />
      </Modal>
    </>
  );
}
