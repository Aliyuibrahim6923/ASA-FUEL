"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import LogPaymentForm from "@/components/forms/LogPaymentForm";
import RecordExpenseForm from "@/components/forms/RecordExpenseForm";

export default function FinancialManagement() {
  const [isInflowModalOpen, setIsInflowModalOpen] = useState(false);
  const [isOutflowModalOpen, setIsOutflowModalOpen] = useState(false);
  
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

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Transaction Ledger</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td>{new Date(t.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${t.type === 'INFLOW' ? 'badge-success' : 'badge-danger'}`}>
                        {t.type}
                    </span>
                  </td>
                  <td>{t.category.replace('_', ' ')}</td>
                  <td>₦{t.amount.toLocaleString()}</td>
                  <td>{t.reference || '-'}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                    <td colSpan={5} style={{ textAlign: 'center' }}>No transactions found</td>
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
    </>
  );
}
