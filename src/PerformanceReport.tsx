import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { consultantPerformance } from './data/mockSales';
import { DollarSign, CheckCircle, Clock, Calendar, Plus, X, Save, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define Interface
interface SalesRecord {
  id: number;
  consultant: string;
  client: string;
  item: string;
  amount: number;
  serviceFee: number;
  rate: number;
  status: string;
  dealDate: string;
  paidAmount: number;
}

const PerformanceReport: React.FC = () => {
  const [sales, setSales] = useState<SalesRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('2026-01');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Sales
  useEffect(() => {
    fetch('http://localhost:3000/api/sales')
      .then(res => res.json())
      .then(data => setSales(data))
      .catch(err => console.error(err));
  }, []);

  // New Sale Form
  const [newSale, setNewSale] = useState({
    consultant: 'Karen', client: '', item: '', amount: 0, serviceFee: 0, status: '未付款'
  });

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(sales.map(s => ({
      ID: s.id,
      顧問: s.consultant,
      客戶: s.client,
      項目: s.item,
      金額: s.amount,
      服務費: s.serviceFee,
      佣金: s.amount * s.rate,
      狀態: s.status,
      日期: s.dealDate
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales");
    XLSX.writeFile(wb, "PerformanceReport.xlsx");
  };

  const handleAddSale = () => {
    if (!newSale.client) return;
    
    fetch('http://localhost:3000/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSale)
    })
    .then(res => res.json())
    .then(savedSale => {
      setSales([savedSale, ...sales]);
      setIsModalOpen(false);
      setNewSale({ consultant: 'Karen', client: '', item: '', amount: 0, serviceFee: 0, status: '未付款' });
    });
  };

  // Summary Metrics
  const totalRevenue = sales.reduce((acc, curr) => acc + curr.amount + curr.serviceFee, 0);
  const totalPaid = sales.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const pendingAmount = totalRevenue - totalPaid;
  const dealCount = sales.length;

  const COLORS = ['#2563eb', '#16a34a', '#ca8a04', '#dc2626', '#9333ea'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="card-title" style={{ fontSize: '1.5rem', margin: 0 }}>業績報表 (Performance Report)</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fff', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}>
            <Calendar size={18} color="#64748b" />
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: '0.9rem', color: '#1e293b' }}
            >
              <option value="2026-01">2026年 1月</option>
              <option value="2026-02">2026年 2月</option>
              <option value="2026-03">2026年 3月</option>
            </select>
          </div>
          
          <button 
            onClick={exportToExcel}
            className="secondary-btn"
            style={{ 
              backgroundColor: '#10b981', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', 
              display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none'
            }}
          >
            <Download size={18} /> 匯出報表
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="primary-btn"
            style={{ 
              backgroundColor: '#16a34a', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', 
              display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none'
            }}
          >
            <Plus size={18} /> 新增業績
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">總業績 (含服務費)</span>
          <div className="stat-value">${totalRevenue.toLocaleString()}</div>
          <div className="stat-trend trend-up">目標達成率 85%</div>
        </div>
        <div className="stat-card">
          <span className="stat-label">已收款金額</span>
          <div className="stat-value" style={{ color: '#16a34a' }}>${totalPaid.toLocaleString()}</div>
          <div className="stat-trend">
            <CheckCircle size={16} color="#16a34a" /> 收款率 {dealCount > 0 ? Math.round((totalPaid / totalRevenue) * 100) : 0}%
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-label">未收款金額</span>
          <div className="stat-value" style={{ color: '#dc2626' }}>${pendingAmount.toLocaleString()}</div>
          <div className="stat-trend">
            <Clock size={16} color="#dc2626" /> 需加強跟催
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-label">本月成交件數</span>
          <div className="stat-value">{dealCount} 件</div>
          <div className="stat-trend trend-up">平均客單價 ${dealCount > 0 ? (totalRevenue / dealCount).toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}</div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <h3 className="card-title">顧問業績排行 (Top 5)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={consultantPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="name" type="category" stroke="#64748b" width={60} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#2563eb" radius={[0, 4, 4, 0]} name="業績金額" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">業績來源佔比</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={consultantPerformance}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="revenue"
                  nameKey="name"
                >
                  {consultantPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ right: 0 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="card">
        <h3 className="card-title">詳細佣金計算表</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>顧問名稱</th>
                <th>客戶名稱</th>
                <th>服務項目</th>
                <th>顧問約金額</th>
                <th>服務費</th>
                <th>佣金率</th>
                <th>預估佣金</th>
                <th>收款狀態</th>
                <th>成交日期</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td style={{ fontWeight: 600 }}>{sale.consultant}</td>
                  <td>{sale.client}</td>
                  <td>{sale.item}</td>
                  <td style={{ textAlign: 'right' }}>${sale.amount.toLocaleString()}</td>
                  <td style={{ textAlign: 'right', color: '#64748b' }}>${sale.serviceFee.toLocaleString()}</td>
                  <td style={{ textAlign: 'center' }}>{(sale.rate * 100).toFixed(0)}%</td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: '#2563eb' }}>
                    ${(sale.amount * sale.rate).toLocaleString()}
                  </td>
                  <td>
                    <span className={`status-badge ${
                      sale.status === '已付款' ? 'status-success' : 
                      sale.status === '部分付款' ? 'status-warning' : 'status-danger'
                    }`}>
                      {sale.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.875rem', color: '#64748b' }}>{sale.dealDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '0.75rem', width: '500px', padding: '1.5rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>新增業績登錄</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>顧問名稱</label>
                <select 
                  value={newSale.consultant}
                  onChange={e => setNewSale({...newSale, consultant: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                >
                  <option value="Karen">Karen</option>
                  <option value="Vincent">Vincent</option>
                  <option value="Alex">Alex</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>客戶名稱</label>
                <input 
                  type="text" 
                  value={newSale.client}
                  onChange={e => setNewSale({...newSale, client: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>服務項目</label>
                <input 
                  type="text" 
                  value={newSale.item}
                  onChange={e => setNewSale({...newSale, item: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>顧問約金額</label>
                  <input 
                    type="number" 
                    value={newSale.amount}
                    onChange={e => setNewSale({...newSale, amount: Number(e.target.value)})}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>服務費</label>
                  <input 
                    type="number" 
                    value={newSale.serviceFee}
                    onChange={e => setNewSale({...newSale, serviceFee: Number(e.target.value)})}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                  />
                </div>
              </div>

              <button 
                onClick={handleAddSale}
                style={{ 
                  marginTop: '1rem', padding: '0.75rem', backgroundColor: '#16a34a', color: 'white', 
                  borderRadius: '0.5rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
                }}
              >
                <Save size={20} /> 儲存業績
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceReport;
