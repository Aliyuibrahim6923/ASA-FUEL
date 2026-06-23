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
  clients.forEach(client => {
      const totalExpected = client.sales?.reduce((sum: number, s: any) => sum + s.totalExpectedAmount, 0) || 0;
      const totalPaid = client.sales?.reduce((sum: number, s: any) => sum + s.paymentReceived, 0) || 0;
      outstandingReceivables += (totalExpected - totalPaid);
  });

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

      <div className="grid-cards" style={{ marginBottom: '2rem' }}>
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
