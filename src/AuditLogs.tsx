import React, { useState, useEffect } from 'react';
import { History, Search, User, Calendar, Tag } from 'lucide-react';

interface AuditLog {
  id: number;
  action: string;
  target: string;
  targetId: number;
  user: string;
  details: string;
  timestamp: string;
}

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/audit-logs')
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(err => console.error(err));
  }, []);

  const formatDetails = (json: string) => {
    try {
      const data = JSON.parse(json);
      return Object.entries(data).map(([k, v]) => `${k}: ${v}`).join(', ');
    } catch {
      return json;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case '新增': return '#16a34a';
      case '修改': return '#ca8a04';
      case '刪除': return '#dc2626';
      case '上傳': return '#2563eb';
      case '下載': return '#9333ea';
      default: return '#475569';
    }
  };

  const filteredLogs = logs.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.includes(searchTerm)
  );

  return (
    <div className="audit-logs">
      <h1 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
        <History size={24} style={{ verticalAlign: 'text-bottom', marginRight: '10px' }} />
        系統稽核紀錄
      </h1>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '15px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input 
            type="text" 
            placeholder="搜尋操作人員、行為或目標..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', padding: '10px 10px 10px 35px', 
              borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem'
            }}
          />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569' }}>時間</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569' }}>操作人員</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569' }}>行為</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569' }}>目標對象</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569' }}>詳細內容</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>目前沒有稽核紀錄</td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontSize: '0.9rem', color: '#64748b' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={16} color="#475569" />
                        <span style={{ fontWeight: 500, color: '#1e293b' }}>{log.user}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ 
                        padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600,
                        backgroundColor: `${getActionColor(log.action)}20`,
                        color: getActionColor(log.action)
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                        <Tag size={14} /> {log.target} <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>#{log.targetId}</span>
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.9rem', color: '#475569', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={formatDetails(log.details)}>
                      {formatDetails(log.details)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
