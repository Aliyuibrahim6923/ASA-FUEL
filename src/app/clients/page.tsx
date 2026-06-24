"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import CreateClientForm from "@/components/forms/CreateClientForm";
import LogPaymentForm from "@/components/forms/LogPaymentForm";
import Link from "next/link";

export default function ClientManagement() {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);

  const loadClients = () => {
    fetch('/api/clients').then(res => res.json()).then(data => { if(Array.isArray(data)) setClients(data) }).catch(e => console.error(e));
  };

  useEffect(() => {
    loadClients();
  }, []);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Client Management</h1>
          <p className="page-subtitle">Manage client profiles, KYC, and track outstanding debt.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => setIsClientModalOpen(true)}>
            + Add Client
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
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>

                        <button className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '0.375rem', background: 'linear-gradient(135deg, var(--color-success), #059669)', border: 'none', color: 'white' }} onClick={() => { setSelectedClient(client); setIsPaymentModalOpen(true); }}>Log Deposit</button>
                      </div>
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

      <Modal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} title="Add New Client">
        <CreateClientForm onSuccess={() => { setIsClientModalOpen(false); loadClients(); }} onCancel={() => setIsClientModalOpen(false)} />
      </Modal>

      <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title={`Log Deposit for ${selectedClient?.name || 'Client'}`}>
        <LogPaymentForm onSuccess={() => { setIsPaymentModalOpen(false); loadClients(); }} onCancel={() => setIsPaymentModalOpen(false)} />
      </Modal>
    </>
  );
}
