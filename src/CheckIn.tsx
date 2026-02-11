import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { type CheckInRecord } from './data/mockCheckIns';
import { Clock, MapPin, Search, CheckCircle } from 'lucide-react';

const CheckIn: React.FC = () => {
  const [records, setRecords] = useState<CheckInRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('2025-12'); // Default to latest in mock
  const [currentConsultant, setCurrentConsultant] = useState('Karen'); // Simulate logged in user

  // Fetch Checkins
  useEffect(() => {
    fetch('http://localhost:3000/api/checkins')
      .then(res => res.json())
      .then(data => setRecords(data))
      .catch(err => console.error(err));
  }, []);

  const handleCheckIn = () => {
    const targetMonth = '2025-12'; 
    
    fetch('http://localhost:3000/api/checkins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consultant: currentConsultant, month: targetMonth })
    })
    .then(res => res.json())
    .then(updatedRecord => {
      // Update local state: find and replace or add
      const exists = records.find(r => r.consultant === updatedRecord.consultant && r.month === updatedRecord.month);
      if (exists) {
        setRecords(records.map(r => (r.consultant === updatedRecord.consultant && r.month === updatedRecord.month) ? updatedRecord : r));
      } else {
        setRecords([...records, updatedRecord]);
      }
      alert(`${currentConsultant} 打卡成功！`);
    });
  };

  // Filter data for selected month
  const filteredData = records.filter(record => record.month === selectedMonth);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="card-title" style={{ fontSize: '1.5rem', margin: 0 }}>業務打卡紀錄 (Check-in)</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fff', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}>
            <Clock size={18} color="#64748b" />
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: '0.9rem', color: '#1e293b' }}
            >
              <option value="2025-09">2025-09</option>
              <option value="2025-10">2025-10</option>
              <option value="2025-11">2025-11</option>
              <option value="2025-12">2025-12</option>
            </select>
          </div>
          
          <button 
            onClick={handleCheckIn}
            className="primary-btn"
            style={{ 
              backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', 
              display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none',
              fontWeight: 600, boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
            }}
          >
            <MapPin size={18} /> 立即打卡
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Chart */}
        <div className="card">
          <h3 className="card-title">每月打卡次數統計</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="consultant" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#2563eb" name="打卡次數" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* List */}
        <div className="card">
          <h3 className="card-title">詳細紀錄 ({selectedMonth})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredData.sort((a, b) => b.count - a.count).map((record, index) => (
              <div key={index} style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem',
                backgroundColor: index < 3 ? '#f0f9ff' : 'white'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ 
                    width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#e2e8f0', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600
                  }}>
                    {index + 1}
                  </div>
                  <span style={{ fontWeight: 600 }}>{record.consultant}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#2563eb', fontWeight: 700 }}>
                  {record.count} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 400 }}>次</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
