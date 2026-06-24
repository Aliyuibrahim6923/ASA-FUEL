"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import LogPaymentForm from "@/components/forms/LogPaymentForm";
import RecordExpenseForm from "@/components/forms/RecordExpenseForm";
import ViewRecordModal from "@/components/ViewRecordModal";

export default function FinancialManagement() {
  const [isInflowModalOpen, setIsInflowModalOpen] = useState(false);
  const [isOutflowModalOpen, setIsOutflowModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  
  const [transactions, setTransactions] = useState<any[]>([]);

  const loadData = () => {
    fetch('/api/transactions').then(res => res.json()).then(data => { if(Array.isArray(data)) setTransactions(data) }).catch(e => console.error(e));
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalInflows = transactions.filter(t => t.type === 'INFLOW').reduce((sum, t) => sum + t.amount, 0);
  const totalOutflows = transactions.filter(t => t.type === 'OUTFLOW').reduce((sum, t) => sum + t.amount, 0);
  const netCashflow = totalInflows - totalOutflows;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Financial Management</h1>
          <p className="page-subtitle">Centralized cash flow, expenses, and payment tracking.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-outline" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={() => setIsOutflowModalOpen(true)}>
              - Record Expense
            </button>
            <button className="btn btn-primary" onClick={() => setIsInflowModalOpen(true)}>
              + Log Payment
            </button>
        </div>
      </div>

      <div className="grid-cards" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Inflows</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-success)' }}>₦{totalInflows.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Outflows</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-danger)' }}>₦{totalOutflows.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Net Cashflow</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: netCashflow >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
            ₦{netCashflow.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="card" style={{ background: 'linear-gradient(to bottom right, #ffffff, #fafafa)', border: '1px solid #eaeaea', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', borderRadius: '1.25rem', overflow: 'hidden', padding: 0, marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--color-divider)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.8)' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></span>
            Payments Received (Inflow)
          </h2>
        </div>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{ padding: '1rem 2rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Sales ID</th>
                <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Client Name</th>
                <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Amount</th>
                <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Purpose</th>
                <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Date</th>
                <th style={{ padding: '1rem 2rem', color: '#6b7280', fontSize: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Action</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: 'white' }}>
              {transactions.filter(t => t.type === 'INFLOW').map(t => (
                <tr key={t.id} style={{ transition: 'background-color 0.2s', borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '1.25rem 2rem', color: '#4b5563', fontFamily: 'monospace' }}>{t.saleId?.slice(0,8) || '-'}</td>
                  <td style={{ padding: '1.25rem 1rem', fontWeight: 600, color: '#111827' }}>{t.client?.name || t.reference || 'N/A'}</td>
                  <td style={{ padding: '1.25rem 1rem', fontWeight: 700, color: '#065f46' }}>₦{t.amount.toLocaleString()}</td>
                  <td style={{ padding: '1.25rem 1rem' }}><span className="badge badge-success">{t.paymentPurpose?.replace('_', ' ') || 'Deposit'}</span></td>
                  <td style={{ padding: '1.25rem 1rem', color: '#6b7280' }}>{new Date(t.date).toLocaleDateString()}</td>
                  <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                    <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#374151' }} onClick={() => { setSelectedRecord(t); setIsViewModalOpen(true); }}>View Details</button>
                  </td>
                </tr>
              ))}
              {transactions.filter(t => t.type === 'INFLOW').length === 0 && (
                <tr>
                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>No inflows found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ background: 'linear-gradient(to bottom right, #ffffff, #fafafa)', border: '1px solid #eaeaea', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', borderRadius: '1.25rem', overflow: 'hidden', padding: 0 }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--color-divider)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.8)' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', backgroundColor: 'var(--color-danger)' }}></span>
            Payments Made & Expenses (Outflow)
          </h2>
        </div>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{ padding: '1rem 2rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Date</th>
                <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Category</th>
                <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Amount</th>
                <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Reference / Details</th>
                <th style={{ padding: '1rem 2rem', color: '#6b7280', fontSize: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Action</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: 'white' }}>
              {transactions.filter(t => t.type === 'OUTFLOW').map(t => (
                <tr key={t.id} style={{ transition: 'background-color 0.2s', borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '1.25rem 2rem', color: '#6b7280' }}>{new Date(t.date).toLocaleDateString()}</td>
                  <td style={{ padding: '1.25rem 1rem' }}><span className="badge badge-warning">{t.category.replace('_', ' ')}</span></td>
                  <td style={{ padding: '1.25rem 1rem', fontWeight: 700, color: '#991b1b' }}>₦{t.amount.toLocaleString()}</td>
                  <td style={{ padding: '1.25rem 1rem', color: '#4b5563' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ fontWeight: 500, color: '#111827' }}>{t.reference || t.client?.name || 'Administrative'}</span>
                      {t.orderId && <span style={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>Ord: {t.orderId.slice(0,8)}</span>}
                      {t.transporterId && <span style={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>Trp: {t.transporter?.name || t.transporterId.slice(0,8)}</span>}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                    <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#374151' }} onClick={() => { setSelectedRecord(t); setIsViewModalOpen(true); }}>View Details</button>
                  </td>
                </tr>
              ))}
              {transactions.filter(t => t.type === 'OUTFLOW').length === 0 && (
                <tr>
                    <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>No outflows found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isInflowModalOpen} onClose={() => setIsInflowModalOpen(false)} title="Log Payment (Inflow)">
        <LogPaymentForm onSuccess={() => { setIsInflowModalOpen(false); loadData(); }} onCancel={() => setIsInflowModalOpen(false)} />
      </Modal>

      <Modal isOpen={isOutflowModalOpen} onClose={() => setIsOutflowModalOpen(false)} title="Record Expense (Outflow)">
        <RecordExpenseForm onSuccess={() => { setIsOutflowModalOpen(false); loadData(); }} onCancel={() => setIsOutflowModalOpen(false)} />
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Transaction Details">
        <ViewRecordModal record={selectedRecord} title={`Transaction #${selectedRecord?.id?.slice(0,8) || ''}`} />
      </Modal>
    </>
  );
}
