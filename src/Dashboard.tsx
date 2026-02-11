import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { UserPlus, Calendar, CheckCircle, TrendingUp, DollarSign, User } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Fetch Dashboard Stats
    fetch('http://localhost:3000/api/dashboard-stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Failed to fetch Stats data", err));
  }, []);

  const COLORS = ['#2563eb', '#16a34a', '#ca8a04', '#d946ef', '#f97316'];

  return (
    <div>
      <h1 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>戰情室 (Dashboard)</h1>
      
      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">總客戶數</span>
          <div className="stat-value">{stats?.totalCustomers || 0}</div>
          <div className="stat-trend trend-up">
            <UserPlus size={16} /> +{stats?.newCustomersThisMonth || 0} (本月)
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-label">本月約訪數</span>
          <div className="stat-value">86</div>
          <div className="stat-trend trend-up">
            <Calendar size={16} /> +5%
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-label">本月成交數</span>
          <div className="stat-value">{stats?.monthlySalesCount || 0}</div>
          <div className="stat-trend trend-down">
            <CheckCircle size={16} /> -
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-label">本月總業績 (萬元)</span>
          <div className="stat-value">${((stats?.monthlyRevenue || 0) / 10000).toFixed(1)}</div>
          <div className="stat-trend trend-up">
            <DollarSign size={16} /> +18%
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Main Trend Chart */}
        <div className="card">
          <h3 className="card-title">業績趨勢分析 (2026上半年)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={stats?.monthlyTrend || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="顧問費" stackId="a" fill="#2563eb" radius={[0, 0, 4, 4]} />
                <Bar dataKey="服務費" stackId="a" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Distribution */}
        <div className="card">
          <h3 className="card-title">營收佔比分析</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={stats?.revenueComposition || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats?.revenueComposition?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Charts: Customer Industry & Source */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
        <div className="card">
          <h3 className="card-title">客戶產業分佈</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={stats?.customerIndustry || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {stats?.customerIndustry?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">最新成交紀錄</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>客戶名稱</th>
                  <th>顧問</th>
                  <th>服務項目</th>
                  <th>成交金額</th>
                  <th>日期</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentActivity?.length === 0 ? (
                  <tr><td colSpan={5} style={{textAlign:'center'}}>無近期資料</td></tr>
                ) : (
                  stats?.recentActivity?.map((sale: any) => (
                    <tr key={sale.id}>
                      <td>{sale.client}</td>
                      <td>{sale.consultant}</td>
                      <td>{sale.item}</td>
                      <td>${sale.amount?.toLocaleString()}</td>
                      <td>{sale.dealDate}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
