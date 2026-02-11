import React, { useState, useEffect } from 'react';
import { type Customer } from './data/mockCustomers';
import { Search, Filter, Plus, Star, MoreVertical, X, Save, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'全部' | '自然人' | '法人'>('全部');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Fetch Customers
  useEffect(() => {
    fetch('http://localhost:3000/api/customers')
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(err => console.error('Failed to fetch', err));
  }, []);

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredCustomers.map(c => ({
      ID: c.id,
      客戶名稱: c.name,
      類別: c.type,
      產業: c.industry,
      狀態: c.status,
      成交機率: c.probability,
      預估業績: c.revenue,
      負責顧問: c.consultant,
      最後聯絡: c.lastContact
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");
    XLSX.writeFile(wb, "CustomerList.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.addFont('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto'); // Note: Standard jsPDF doesn't support CJK well without custom font embedding. 
                           // For demo, we might see garbled text if not handled, but we'll setup basic structure.
                           // In real prod, need to load a CJK font (e.g. Noto Sans TC) base64.
    
    // Using autoTable
    autoTable(doc, {
      head: [['ID', 'Name', 'Type', 'Industry', 'Status', 'Revenue', 'Consultant']],
      body: filteredCustomers.map(c => [
        c.id, c.name, c.type, c.industry, c.status, c.revenue, c.consultant
      ]),
    });
    doc.save('CustomerList.pdf');
  };

  // New Customer Form State
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '', type: '自然人', industry: '', probability: 3, status: '新名單', revenue: 0, consultant: 'Karen'
  });

  const handleAddCustomer = () => {
    if (!newCustomer.name) return;
    
    // Optimistic UI update or wait for server? Let's wait.
    fetch('http://localhost:3000/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCustomer)
    })
    .then(res => res.json())
    .then(savedCustomer => {
      setCustomers([savedCustomer, ...customers]);
      setIsModalOpen(false);
      setNewCustomer({ name: '', type: '自然人', industry: '', probability: 3, status: '新名單', revenue: 0, consultant: 'Karen' });
    });
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          customer.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === '全部' || customer.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="card-title" style={{ fontSize: '1.5rem', margin: 0 }}>客戶管理 (Customer List)</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={exportToExcel}
            className="secondary-btn" 
            style={{ 
              backgroundColor: '#10b981', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', 
              display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none'
            }}
          >
            <Download size={18} /> 匯出 Excel
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="primary-btn" 
            style={{ 
              backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', 
              display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none'
            }}
          >
            <Plus size={18} /> 新增客戶
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="card" style={{ display: 'flex', gap: '1rem', padding: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input 
            type="text" 
            placeholder="搜尋客戶姓名、產業..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', padding: '0.5rem 0.5rem 0.5rem 2.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['全部', '自然人', '法人'].map(type => (
            <button 
              key={type}
              onClick={() => setFilterType(type as any)}
              style={{ 
                padding: '0.5rem 1rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', 
                backgroundColor: filterType === type ? '#e2e8f0' : 'white', cursor: 'pointer'
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: '20%' }}>客戶名稱</th>
                <th style={{ width: '10%' }}>類別</th>
                <th style={{ width: '15%' }}>產業/職業</th>
                <th style={{ width: '15%' }}>成交機率</th>
                <th style={{ width: '10%' }}>狀態</th>
                <th style={{ width: '10%' }}>負責顧問</th>
                <th style={{ width: '15%' }}>預估業績</th>
                <th style={{ width: '5%' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td style={{ fontWeight: 500 }}>{customer.name}</td>
                  <td>
                    <span style={{ 
                      backgroundColor: customer.type === '法人' ? '#ede9fe' : '#dbeafe', 
                      color: customer.type === '法人' ? '#5b21b6' : '#1e40af',
                      padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600
                    }}>
                      {customer.type}
                    </span>
                  </td>
                  <td style={{ color: '#64748b' }}>{customer.industry}</td>
                  <td>
                    <div style={{ display: 'flex' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={16} 
                          fill={star <= customer.probability ? '#ca8a04' : 'none'} 
                          color={star <= customer.probability ? '#ca8a04' : '#cbd5e1'} 
                        />
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge`} style={{ 
                      backgroundColor: customer.status === '已成交' ? '#dcfce7' : 
                                     customer.status === '提案中' ? '#dbeafe' : 
                                     customer.status === '約訪中' ? '#fef9c3' : '#f3f4f6',
                      color: customer.status === '已成交' ? '#166534' : 
                             customer.status === '提案中' ? '#1e40af' : 
                             customer.status === '約訪中' ? '#854d0e' : '#374151'
                    }}>
                      {customer.status}
                    </span>
                  </td>
                  <td>{customer.consultant}</td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                    ${customer.revenue.toLocaleString()}
                  </td>
                  <td>
                    <button style={{ color: '#94a3b8', cursor: 'pointer' }}><MoreVertical size={18} /></button>
                  </td>
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
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>新增客戶資料</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>客戶名稱</label>
                <input 
                  type="text" 
                  value={newCustomer.name}
                  onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                  placeholder="請輸入公司或個人名稱"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>客戶類別</label>
                  <select 
                    value={newCustomer.type}
                    onChange={e => setNewCustomer({...newCustomer, type: e.target.value as any})}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                  >
                    <option value="自然人">自然人</option>
                    <option value="法人">法人</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>產業/職業</label>
                  <input 
                    type="text" 
                    value={newCustomer.industry}
                    onChange={e => setNewCustomer({...newCustomer, industry: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>預估業績</label>
                  <input 
                    type="number" 
                    value={newCustomer.revenue}
                    onChange={e => setNewCustomer({...newCustomer, revenue: Number(e.target.value)})}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>負責顧問</label>
                  <select 
                    value={newCustomer.consultant}
                    onChange={e => setNewCustomer({...newCustomer, consultant: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                  >
                    <option value="Karen">Karen</option>
                    <option value="Vincent">Vincent</option>
                    <option value="Alex">Alex</option>
                    <option value="Brain">Brain</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>成交機率 (1-5)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      onClick={() => setNewCustomer({...newCustomer, probability: star as any})}
                      style={{ cursor: 'pointer' }}
                    >
                      <Star 
                        size={24} 
                        fill={star <= (newCustomer.probability || 0) ? '#ca8a04' : 'none'} 
                        color={star <= (newCustomer.probability || 0) ? '#ca8a04' : '#cbd5e1'} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleAddCustomer}
                style={{ 
                  marginTop: '1rem', padding: '0.75rem', backgroundColor: '#2563eb', color: 'white', 
                  borderRadius: '0.5rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
                }}
              >
                <Save size={20} /> 儲存客戶資料
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
