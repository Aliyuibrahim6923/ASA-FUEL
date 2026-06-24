"use client";

import { useState, useEffect } from "react";

export default function Dashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [transports, setTransports] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/orders').then(res => res.json()).then(data => { if(Array.isArray(data)) setOrders(data) }).catch(e => console.error(e));
    fetch('/api/transports').then(res => res.json()).then(data => { if(Array.isArray(data)) setTransports(data) }).catch(e => console.error(e));
    fetch('/api/clients').then(res => res.json()).then(data => { if(Array.isArray(data)) setClients(data) }).catch(e => console.error(e));
    fetch('/api/transactions').then(res => res.json()).then(data => { if(Array.isArray(data)) setTransactions(data) }).catch(e => console.error(e));
  }, []);

  const totalActiveOrders = orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length;
  const trucksInTransit = transports.filter(t => t.status === 'IN_TRANSIT').length;
  
  // Calculate total outstanding receivables across all clients
  let outstandingReceivables = 0;
  let topDebtor = { name: 'None', amount: 0 };
  let totalVolumeDelivered = 0;

  clients.forEach(client => {
      const totalExpected = client.sales?.reduce((sum: number, s: any) => sum + s.totalExpectedAmount, 0) || 0;
      const totalPaid = client.sales?.reduce((sum: number, s: any) => sum + s.paymentReceived, 0) || 0;
      const debt = totalExpected - totalPaid;
      outstandingReceivables += debt;
      
      if (debt > topDebtor.amount) {
        topDebtor = { name: client.name, amount: debt };
      }

      client.sales?.forEach((s: any) => {
        totalVolumeDelivered += (s.litersReceived || 0);
      });
  });

  const orderFulfillmentRate = orders.length > 0 
    ? Math.round((orders.filter(o => o.status === 'COMPLETED').length / orders.length) * 100) 
    : 0;

  const totalDeductions = transports.reduce((sum, t) => sum + (t.totalDeduction || 0), 0);

  const todaysInflows = transactions.filter(t => {
      const today = new Date();
      const txDate = new Date(t.date);
      return t.type === 'INFLOW' && txDate.toDateString() === today.toDateString();
  }).reduce((sum, t) => sum + t.amount, 0);

  // Helper to dynamically calculate graph bar heights (dummy logic scaling to 100% max)
  const calculateBarHeights = () => {
      let maxAmount = 1;
      const months = [
          { month: 'Jan', inAmt: 0, outAmt: 0 },
          { month: 'Feb', inAmt: 0, outAmt: 0 },
          { month: 'Mar', inAmt: 0, outAmt: 0 },
          { month: 'Apr', inAmt: 0, outAmt: 0 },
          { month: 'May', inAmt: 0, outAmt: 0 },
          { month: 'Jun', inAmt: 0, outAmt: 0 }
      ];
      
      // Map actual transactions to the months logic here
      transactions.forEach(t => {
          const mIdx = new Date(t.date).getMonth() % 6; // simplified mapping for demo
          if(t.type === 'INFLOW') months[mIdx].inAmt += t.amount;
          if(t.type === 'OUTFLOW') months[mIdx].outAmt += t.amount;
          maxAmount = Math.max(maxAmount, months[mIdx].inAmt, months[mIdx].outAmt);
      });

      return months.map(m => ({
          month: m.month,
          in: `${Math.max((m.inAmt / maxAmount) * 100, 5)}%`,
          out: `${Math.max((m.outAmt / maxAmount) * 100, 5)}%`,
          rawIn: m.inAmt,
          rawOut: m.outAmt
      }));
  };

  const chartData = calculateBarHeights();

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title animate-fade-in">Dashboard Overview</h1>
          <p className="page-subtitle animate-fade-in delay-100">Welcome back. Here is your operational summary.</p>
        </div>
      </div>

      <div className="grid-cards" style={{ marginBottom: '1.5rem' }}>
        <div className="card animate-fade-in delay-100">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Active Orders</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{totalActiveOrders}</p>
        </div>
        <div className="card animate-fade-in delay-200">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Trucks in Transit</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{trucksInTransit}</p>
        </div>
        <div className="card animate-fade-in delay-300">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Outstanding Receivables</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-danger)' }}>₦{outstandingReceivables.toLocaleString()}</p>
        </div>
        <div className="card animate-fade-in delay-400">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Today's Inflows</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-success)' }}>₦{todaysInflows.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid-cards" style={{ marginBottom: '2rem' }}>
        <div className="card animate-fade-in delay-200">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Volume Delivered</h3>
          <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#111827' }}>{totalVolumeDelivered.toLocaleString()} <span style={{ fontSize: '1rem', color: '#6b7280' }}>Liters</span></p>
        </div>
        <div className="card animate-fade-in delay-300">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Order Fulfillment Rate</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#111827' }}>{orderFulfillmentRate}%</p>
            <div style={{ flex: 1, height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${orderFulfillmentRate}%`, height: '100%', backgroundColor: 'var(--color-success)' }}></div>
            </div>
          </div>
        </div>
        <div className="card animate-fade-in delay-400">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Fleet Deductions</h3>
          <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--color-warning)' }}>₦{totalDeductions.toLocaleString()}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card animate-fade-in delay-200" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Debtor</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#991b1b', fontWeight: 'bold', fontSize: '1.25rem' }}>
              {topDebtor.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>{topDebtor.name}</p>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-danger)' }}>₦{topDebtor.amount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card animate-fade-in delay-300" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Activity Feed</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: '180px', paddingRight: '0.5rem' }}>
            {transactions.slice(0, 4).map(t => (
              <div key={t.id} style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--color-divider)', paddingBottom: '0.75rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: t.type === 'INFLOW' ? 'var(--color-success)' : 'var(--color-danger)', marginTop: '0.35rem' }}></div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', margin: 0 }}>
                    {t.type === 'INFLOW' ? 'Payment Received' : 'Expense Recorded'}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, marginTop: '0.125rem' }}>
                    {t.reference || t.category.replace('_', ' ')} • ₦{t.amount.toLocaleString()}
                  </p>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{new Date(t.date).toLocaleDateString()}</span>
              </div>
            ))}
            {transactions.length === 0 && <p style={{ fontSize: '0.875rem', color: '#9ca3af', textAlign: 'center', marginTop: '1rem' }}>No recent activity.</p>}
          </div>
        </div>
      </div>

      <div className="card animate-fade-in delay-200" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Financial Overview</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Dynamic Inflows vs Outflows</p>
        
        <div className="chart-wrapper">
          {chartData.map((data, index) => (
            <div className="bar-container" key={data.month}>
              <div className="bar-group">
                <div className="bar bar-primary" style={{ height: data.in, animationDelay: `${index * 0.1}s` }} title={`Inflow: ₦${data.rawIn}`}></div>
                <div className="bar bar-danger" style={{ height: data.out, animationDelay: `${index * 0.1 + 0.05}s` }} title={`Outflow: ₦${data.rawOut}`}></div>
              </div>
              <span className="bar-label">{data.month}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', background: 'var(--color-primary)' }}></span> Inflows
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', background: 'var(--color-danger)' }}></span> Outflows
          </div>
        </div>
      </div>
    </>
  );
}
