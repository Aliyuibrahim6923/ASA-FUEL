export default function FinancialManagement() {
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Financial Management</h1>
          <p className="page-subtitle">Centralized cash flow tracking for inflows and outflows.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline">
            Record Expense (Outflow)
          </button>
          <button className="btn btn-primary">
            + Log Payment (Inflow)
          </button>
        </div>
      </div>

      <div className="grid-cards" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ borderTop: '4px solid var(--color-success)' }}>
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Inflows</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-success)' }}>₦24.5M</p>
        </div>
        <div className="card" style={{ borderTop: '4px solid var(--color-danger)' }}>
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Outflows</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-danger)' }}>₦18.2M</p>
        </div>
        <div className="card" style={{ borderTop: '4px solid var(--color-primary)' }}>
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Net Cashflow</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>₦6.3M</p>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Recent Inflows Log</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Receipt ID</th>
                <th>Date</th>
                <th>Client Name</th>
                <th>Amount Received</th>
                <th>Payment Method</th>
                <th>Linked Sales ID</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#REC-001</td>
                <td>08/06/2026</td>
                <td>Alpha Logistics</td>
                <td style={{ color: 'var(--color-success)', fontWeight: '500' }}>+₦3,000,000</td>
                <td>Transfer</td>
                <td>#S-101</td>
              </tr>
              <tr>
                <td>#REC-002</td>
                <td>09/06/2026</td>
                <td>Beta Transport</td>
                <td style={{ color: 'var(--color-success)', fontWeight: '500' }}>+₦2,500,000</td>
                <td>Transfer/Cash</td>
                <td>#S-102</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
