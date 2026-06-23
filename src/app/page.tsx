export default function Dashboard() {
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Welcome to ASA-FUEL Logistics. Here is your system snapshot.</p>
        </div>
        <button className="btn btn-primary">
          Generate Report
        </button>
      </div>

      <div className="grid-cards" style={{ marginBottom: '2rem' }}>
        <div className="card animate-fade-in delay-100">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Active Orders</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>24</p>
          <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--color-success)' }}>+3 since yesterday</div>
        </div>
        <div className="card animate-fade-in delay-200">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Trucks in Transit</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>18</p>
          <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>Out of 32 total trucks</div>
        </div>
        <div className="card animate-fade-in delay-300">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Outstanding Receivables</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-danger)' }}>₦12.5M</p>
          <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>Across 5 clients</div>
        </div>
        <div className="card animate-fade-in delay-400">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Today's Inflows</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-success)' }}>₦4.2M</p>
          <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--color-success)' }}>+15% from average</div>
        </div>
      </div>

      {/* NEW DATA CHART */}
      <div className="card animate-fade-in delay-200" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Financial Overview</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Inflows (Orange) vs Outflows (Red) over the last 6 months</p>
        
        <div className="chart-wrapper">
          {[
            { month: 'Jan', in: '45%', out: '30%' },
            { month: 'Feb', in: '55%', out: '35%' },
            { month: 'Mar', in: '70%', out: '40%' },
            { month: 'Apr', in: '60%', out: '50%' },
            { month: 'May', in: '85%', out: '45%' },
            { month: 'Jun', in: '95%', out: '30%' },
          ].map((data, index) => (
            <div className="bar-container" key={data.month}>
              <div className="bar-group">
                <div className="bar bar-primary" style={{ height: data.in, animationDelay: `${index * 0.1}s` }} title={`Inflow: ${data.in}`}></div>
                <div className="bar bar-danger" style={{ height: data.out, animationDelay: `${index * 0.1 + 0.05}s` }} title={`Outflow: ${data.out}`}></div>
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

      <div className="card animate-fade-in delay-300">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Recent Activity</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>10:45 AM</td>
                <td>Payment Logged</td>
                <td>Alpha Logistics</td>
                <td><span className="badge badge-success">Completed</span></td>
              </tr>
              <tr>
                <td>09:30 AM</td>
                <td>Order Confirmed</td>
                <td>Order #1004 (PMS)</td>
                <td><span className="badge badge-info">In Progress</span></td>
              </tr>
              <tr>
                <td>08:15 AM</td>
                <td>Transport Assigned</td>
                <td>Truck KJA-123</td>
                <td><span className="badge badge-warning">Pending</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
