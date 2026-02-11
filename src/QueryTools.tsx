import React, { useState } from 'react';
import { mockBankInfo, mockCommissionRates } from './data/mockCheckIns';
import { Search, Info, Landmark, Percent } from 'lucide-react';

const QueryTools: React.FC = () => {
  const [searchTermBank, setSearchTermBank] = useState('');
  const [searchTermRate, setSearchTermRate] = useState('');

  const filteredBanks = mockBankInfo.filter(b => 
    b.bank.includes(searchTermBank) || b.product.includes(searchTermBank)
  );

  const filteredRates = mockCommissionRates.filter(r => 
    r.product.includes(searchTermRate) || r.code.includes(searchTermRate)
  );

  return (
    <div>
      <h1 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>查詢工具 (Query Tools)</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Bank Info */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Landmark size={20} color="#059669" /> 銀行產品查詢
            </h3>
            <div style={{ position: 'relative', width: '200px' }}>
              <Search size={16} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input 
                type="text" 
                placeholder="搜尋銀行..." 
                value={searchTermBank}
                onChange={(e) => setSearchTermBank(e.target.value)}
                style={{ width: '100%', padding: '0.25rem 0.25rem 0.25rem 2rem', borderRadius: '0.25rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
              />
            </div>
          </div>
          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>銀行</th>
                  <th>產品</th>
                  <th>利率</th>
                  <th>額度</th>
                  <th>窗口</th>
                </tr>
              </thead>
              <tbody>
                {filteredBanks.map((b, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{b.bank}</td>
                    <td>{b.product}</td>
                    <td style={{ color: '#dc2626', fontWeight: 600 }}>{b.rate}</td>
                    <td>{b.limit}</td>
                    <td style={{ fontSize: '0.875rem', color: '#6b7280' }}>{b.contact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commission Rates */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Percent size={20} color="#d97706" /> 佣金率查詢
            </h3>
            <div style={{ position: 'relative', width: '200px' }}>
              <Search size={16} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input 
                type="text" 
                placeholder="搜尋產品/代碼..." 
                value={searchTermRate}
                onChange={(e) => setSearchTermRate(e.target.value)}
                style={{ width: '100%', padding: '0.25rem 0.25rem 0.25rem 2rem', borderRadius: '0.25rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
              />
            </div>
          </div>
          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>產品名稱</th>
                  <th>代碼</th>
                  <th>FYC (首年)</th>
                  <th>續年 (Y2)</th>
                  <th>續年 (Y3)</th>
                </tr>
              </thead>
              <tbody>
                {filteredRates.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{r.product}</td>
                    <td style={{ fontSize: '0.875rem', color: '#6b7280' }}>{r.code}</td>
                    <td style={{ color: '#2563eb', fontWeight: 600 }}>{r.year1}</td>
                    <td>{r.year2}</td>
                    <td>{r.year3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryTools;
