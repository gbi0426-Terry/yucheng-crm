import React, { useState, useEffect } from 'react';
import { mockAnnouncements, type ResourceFile } from './data/mockResources';
import { Bell, FileText, Download, ExternalLink, Megaphone, Folder, ChevronRight, Search, Upload, Plus } from 'lucide-react';

const ResourceCenter: React.FC = () => {
  const [resources, setResources] = useState<ResourceFile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'全部' | '銷售資源' | '行政規章' | 'SOP' | '申請表格'>('全部');

  // Fetch Resources
  useEffect(() => {
    fetch('http://localhost:3000/api/resources')
      .then(res => res.json())
      .then(data => setResources(data))
      .catch(err => console.error(err));
  }, []);

  const handleUpload = () => {
    // Mock upload
    const name = prompt("請輸入檔案名稱:");
    if (name) {
      const newFile = {
        name: name,
        category: '銷售資源'
      };
      
      fetch('http://localhost:3000/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFile)
      })
      .then(res => res.json())
      .then(savedFile => {
        setResources([savedFile, ...resources]);
      });
    }
  };

  const filteredResources = resources.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === '全部' || file.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const getFileIcon = (type: ResourceFile['type']) => {
    switch (type) {
      case 'PDF': return <FileText size={24} color="#ef4444" />;
      case 'PPT': return <FileText size={24} color="#ea580c" />; // Orange
      case 'Excel': return <FileText size={24} color="#16a34a" />; // Green
      case 'Link': return <ExternalLink size={24} color="#2563eb" />; // Blue
      default: return <FileText size={24} color="#64748b" />;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '0' }}>資源中心 (Resource Center)</h1>
        <button 
          onClick={handleUpload}
          className="primary-btn"
          style={{ 
            backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', 
            display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none'
          }}
        >
          <Upload size={18} /> 上傳檔案
        </button>
      </div>

      {/* Announcements Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Megaphone size={20} color="#f59e0b" />
          最新公告 (Announcements)
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mockAnnouncements.map(announcement => (
            <div key={announcement.id} style={{ 
              padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem',
              borderLeft: `4px solid ${announcement.category === '昱成公告' ? '#2563eb' : announcement.category === '公勝公告' ? '#ef4444' : '#10b981'}`,
              backgroundColor: announcement.isImportant ? '#fffbeb' : 'white'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ 
                    fontSize: '0.75rem', fontWeight: 700, padding: '0.125rem 0.5rem', borderRadius: '9999px',
                    backgroundColor: announcement.category === '昱成公告' ? '#dbeafe' : announcement.category === '公勝公告' ? '#fee2e2' : '#d1fae5',
                    color: announcement.category === '昱成公告' ? '#1e40af' : announcement.category === '公勝公告' ? '#991b1b' : '#065f46'
                  }}>
                    {announcement.category}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{announcement.title}</span>
                  {announcement.isImportant && (
                    <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700, border: '1px solid #dc2626', padding: '0 4px', borderRadius: '4px' }}>重要</span>
                  )}
                </div>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{announcement.date}</span>
              </div>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
                {announcement.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Library Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Folder size={20} color="#2563eb" />
            檔案資料庫 (Files)
          </h3>
          
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="搜尋檔案名稱..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', padding: '0.5rem 0.5rem 0.5rem 2.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1'
              }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          {['全部', '銷售資源', '行政規章', 'SOP', '申請表格'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              style={{
                padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: 500,
                color: activeTab === tab ? '#2563eb' : '#64748b',
                backgroundColor: activeTab === tab ? '#eff6ff' : 'transparent',
                transition: 'all 0.2s',
                cursor: 'pointer', border: 'none'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* File Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {filteredResources.map(file => (
            <div key={file.id} style={{ 
              border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem',
              display: 'flex', alignItems: 'flex-start', gap: '1rem', transition: 'box-shadow 0.2s',
              cursor: 'pointer'
            }} 
            className="hover:shadow-md"
            >
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '0.5rem', backgroundColor: '#f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {getFileIcon(file.type)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={file.name}>
                  {file.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{file.updatedAt}</span>
                  {file.size && <span>{file.size}</span>}
                </div>
                <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                  {file.type === 'Link' ? (
                    <a href={file.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.875rem', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      前往連結 <ExternalLink size={14} />
                    </a>
                  ) : (
                    <button style={{ fontSize: '0.875rem', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.25rem', border: 'none', background: 'none', cursor: 'pointer' }}>
                      下載 <Download size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceCenter;
