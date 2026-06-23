export default function SalesManagement() {
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales & Client Management</h1>
          <p className="page-subtitle">Manage outbound fuel deliveries and client receivables.</p>
        </div>
        <button className="btn btn-primary">
          + Record Delivery
        </button>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Client Receivables & Debt Ledger</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Sales ID</th>
                <th>Total Expected</th>
                <th>Total Paid</th>
                <th>Outstanding</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Alpha Logistics</td>
                <td>#S-101</td>
                <td>₦5,000,000</td>
                <td>₦3,000,000</td>
                <td style={{ color: 'var(--color-danger)', fontWeight: 'bold' }}>₦2,000,000</td>
                <td><span className="badge badge-warning">Part-Paid</span></td>
                <td><button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Log Payment</button></td>
              </tr>
              <tr>
                <td>Beta Transport</td>
                <td>#S-102</td>
                <td>₦2,500,000</td>
                <td>₦2,500,000</td>
                <td style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>₦0</td>
                <td><span className="badge badge-success">Cleared</span></td>
                <td><button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>View Receipt</button></td>
              </tr>
              <tr>
                <td>Gamma Haulage</td>
                <td>#S-103</td>
                <td>₦8,000,000</td>
                <td>₦0</td>
                <td style={{ color: 'var(--color-danger)', fontWeight: 'bold' }}>₦8,000,000</td>
                <td><span className="badge badge-danger">Unpaid</span></td>
                <td><button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Send Reminder</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
