"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import AddTransporterForm from "@/components/forms/AddTransporterForm";
import InitiateTransportForm from "@/components/forms/InitiateTransportForm";
import ManageDeductionsForm from "@/components/forms/ManageDeductionsForm";
import CompleteTransportForm from "@/components/forms/CompleteTransportForm";
import LogDepositForm from "@/components/forms/LogDepositForm";
import LogDeductionForm from "@/components/forms/LogDeductionForm";

export default function FleetManagement() {
  const [isTransporterModalOpen, setIsTransporterModalOpen] = useState(false);
  const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);
  const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false);
  const [isCompleteTransportModalOpen, setIsCompleteTransportModalOpen] = useState(false);
  const [isLogDepositModalOpen, setIsLogDepositModalOpen] = useState(false);
  const [isLogDeductionModalOpen, setIsLogDeductionModalOpen] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<any>(null);
  
  const [transporters, setTransporters] = useState<any[]>([]);
  const [transports, setTransports] = useState<any[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);

  const loadData = () => {
    fetch('/api/transporters').then(res => res.json()).then(data => { if(Array.isArray(data)) setTransporters(data) }).catch(e => console.error(e));
    fetch('/api/transports').then(res => res.json()).then(data => { if(Array.isArray(data)) setTransports(data) }).catch(e => console.error(e));
    fetch('/api/maintenance').then(res => res.json()).then(data => { if(Array.isArray(data)) setMaintenance(data) }).catch(e => console.error(e));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Fleet Management</h1>
          <p className="page-subtitle">Manage transporters, trucks, drivers, and transport financials.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-outline" onClick={() => setIsTransportModalOpen(true)}>
            Initiate Transport
            </button>
            <button className="btn btn-primary" onClick={() => setIsTransporterModalOpen(true)}>
            + Add Transporter
            </button>
        </div>
      </div>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Active Transporters & Trucks</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Transporter Name</th>
                <th>Truck ID</th>
                <th>Capacity</th>
                <th>Driver Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transporters.flatMap(transporter => 
                (transporter.trucks && transporter.trucks.length > 0 ? transporter.trucks : [{}]).map((truck: any, idx: number) => (
                  <tr key={`${transporter.id}-${idx}`}>
                    <td>{transporter.name}</td>
                    <td>{truck.truckNameId || '-'}</td>
                    <td>{truck.capacityLiters ? `${truck.capacityLiters}L` : '-'}</td>
                    <td>{truck.driverName || '-'}</td>
                    <td><span className="badge badge-success">Active</span></td>
                  </tr>
                ))
              )}
              {transporters.length === 0 && (
                <tr>
                    <td colSpan={5} style={{ textAlign: 'center' }}>No transporters found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid-cards" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="card" style={{ background: 'linear-gradient(to bottom right, #ffffff, #fafafa)', border: '1px solid #eaeaea', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', borderRadius: '1.25rem', overflow: 'hidden', padding: 0 }}>
          <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--color-divider)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.8)' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></span>
                Transport Earnings (Tab A)
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, marginTop: '0.25rem' }}>Financial ledger for all external and internal trips.</p>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'right' }}>
              <div>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', fontWeight: 600, letterSpacing: '0.05em' }}>Total Net Paid</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>₦{transports.reduce((sum, t) => sum + (t.netTransportFeePaid || ((t.ratePerLiter * t.litersCarried) - (t.totalDeduction || 0))), 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '1rem 2rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Transporter Name</th>
                  <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Base Rate</th>
                  <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Deposits Made</th>
                  <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Deductions</th>
                  <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Net Paid</th>
                  <th style={{ padding: '1rem 2rem', color: '#6b7280', fontSize: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Action</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: 'white' }}>
                {transports.map(t => (
                  <tr key={t.id} style={{ transition: 'background-color 0.2s', borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '1.25rem 2rem', fontWeight: 500, color: '#111827' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>
                          TR
                        </div>
                        {t.transporter?.name || t.truck?.truckNameId}
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1rem', color: '#4b5563' }}>₦{(t.ratePerLiter * t.litersCarried).toLocaleString()}</td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <span style={{ display: 'inline-flex', padding: '0.25rem 0.75rem', backgroundColor: '#e0e7ff', color: '#4338ca', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                        ₦{t.depositsMade ? t.depositsMade.toLocaleString() : 0}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <span style={{ display: 'inline-flex', padding: '0.25rem 0.75rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                        -₦{t.totalDeduction ? t.totalDeduction.toLocaleString() : 0}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 1rem', fontWeight: 700, color: '#111827', fontSize: '1.125rem' }}>₦{t.netTransportFeePaid ? t.netTransportFeePaid.toLocaleString() : ((t.ratePerLiter * t.litersCarried) - (t.totalDeduction || 0)).toLocaleString()}</td>
                    <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        {t.status !== 'COMPLETED' && (
                          <button className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '0.375rem', boxShadow: '0 2px 4px rgba(255, 106, 0, 0.15)' }} onClick={() => { setSelectedTransport(t); setIsCompleteTransportModalOpen(true); }}>Complete</button>
                        )}
                        <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#374151' }} onClick={() => { setSelectedTransport(t); setIsLogDepositModalOpen(true); }}>Log Deposit</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {transports.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>No transport earnings logged yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(to bottom right, #ffffff, #fafafa)', border: '1px solid #eaeaea', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', borderRadius: '1.25rem', overflow: 'hidden', padding: 0 }}>
          <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--color-divider)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.8)' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', backgroundColor: 'var(--color-danger)' }}></span>
                Maintenance & Deductions (Tab B)
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, marginTop: '0.25rem' }}>Trip incidents, lost liters, and mechanic costs.</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ textAlign: 'right', marginRight: '1.5rem' }}>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', fontWeight: 600, letterSpacing: '0.05em' }}>Total Deducted</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-danger)' }}>₦{transports.reduce((sum, t) => sum + (t.totalDeduction || 0), 0).toLocaleString()}</p>
              </div>
              <button className="btn btn-outline" style={{ height: 'fit-content', alignSelf: 'center', fontSize: '0.875rem', borderRadius: '0.5rem', backgroundColor: 'white' }} onClick={() => setIsDeductionModalOpen(true)}>Manage General Logs</button>
            </div>
          </div>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '1rem 2rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Truck ID</th>
                  <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Maint. Cost</th>
                  <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Liters Lost</th>
                  <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Cash Deduction</th>
                  <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Petroleum Eq.</th>
                  <th style={{ padding: '1rem', color: '#6b7280', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>Total Deduction</th>
                  <th style={{ padding: '1rem 2rem', color: '#6b7280', fontSize: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Action</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: 'white' }}>
                {transports.map(t => {
                  const cashDeduction = (t.litersLost || 0) * t.ratePerLiter;
                  return (
                    <tr key={`deduction-${t.id}`} style={{ transition: 'background-color 0.2s', borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '1.25rem 2rem', fontWeight: 500, color: '#111827' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', backgroundColor: '#f3f4f6', borderRadius: '0.25rem', fontSize: '0.75rem', fontFamily: 'monospace' }}>{t.truck?.truckNameId || 'N/A'}</span>
                         </div>
                      </td>
                      <td style={{ padding: '1.25rem 1rem', color: '#4b5563' }}>₦{t.maintenanceCost ? t.maintenanceCost.toLocaleString() : 0}</td>
                      <td style={{ padding: '1.25rem 1rem', color: '#4b5563' }}>{t.litersLost || 0}L</td>
                      <td style={{ padding: '1.25rem 1rem' }}><span style={{ color: '#991b1b', fontWeight: 500 }}>₦{cashDeduction.toLocaleString()}</span></td>
                      <td style={{ padding: '1.25rem 1rem', color: '#4b5563' }}>{t.volumeEquivalent ? t.volumeEquivalent.toLocaleString() : 0}L</td>
                      <td style={{ padding: '1.25rem 1rem', fontWeight: 700, color: '#111827', fontSize: '1.125rem' }}>₦{t.totalDeduction ? t.totalDeduction.toLocaleString() : 0}</td>
                      <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                        <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#374151' }} onClick={() => { setSelectedTransport(t); setIsLogDeductionModalOpen(true); }}>Log Deduction</button>
                      </td>
                    </tr>
                  );
                })}
                {transports.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>No deductions logged yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={isTransporterModalOpen} onClose={() => setIsTransporterModalOpen(false)} title="Add New Transporter">
        <AddTransporterForm onSuccess={() => { setIsTransporterModalOpen(false); loadData(); }} onCancel={() => setIsTransporterModalOpen(false)} />
      </Modal>

      <Modal isOpen={isTransportModalOpen} onClose={() => setIsTransportModalOpen(false)} title="Initiate Transport">
        <InitiateTransportForm onSuccess={() => { setIsTransportModalOpen(false); loadData(); }} onCancel={() => setIsTransportModalOpen(false)} />
      </Modal>

      <Modal isOpen={isCompleteTransportModalOpen} onClose={() => setIsCompleteTransportModalOpen(false)} title="Complete Transport">
        <CompleteTransportForm transport={selectedTransport} onSuccess={() => { setIsCompleteTransportModalOpen(false); loadData(); }} onCancel={() => setIsCompleteTransportModalOpen(false)} />
      </Modal>

      <Modal isOpen={isDeductionModalOpen} onClose={() => setIsDeductionModalOpen(false)} title="Log General Maintenance">
        <ManageDeductionsForm onSuccess={() => { setIsDeductionModalOpen(false); loadData(); }} onCancel={() => setIsDeductionModalOpen(false)} />
      </Modal>

      <Modal isOpen={isLogDepositModalOpen} onClose={() => setIsLogDepositModalOpen(false)} title="Log Transport Deposit">
        <LogDepositForm transport={selectedTransport} onSuccess={() => { setIsLogDepositModalOpen(false); loadData(); }} onCancel={() => setIsLogDepositModalOpen(false)} />
      </Modal>

      <Modal isOpen={isLogDeductionModalOpen} onClose={() => setIsLogDeductionModalOpen(false)} title="Log Trip Deduction">
        <LogDeductionForm transport={selectedTransport} onSuccess={() => { setIsLogDeductionModalOpen(false); loadData(); }} onCancel={() => setIsLogDeductionModalOpen(false)} />
      </Modal>
    </>
  );
}
