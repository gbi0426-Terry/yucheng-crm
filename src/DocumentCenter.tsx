import React, { useState, useEffect } from 'react';
import { Upload, Download, FileText, FolderOpen } from 'lucide-react';

interface Document {
  id: number;
  originalName: string;
  size: number;
  category: string;
  uploadedAt: string;
  customerId?: number;
  salesId?: number;
  uploadedBy?: string;
}

interface Customer {
  id: number;
  name: string;
}

interface Sale {
  id: number;
  client: string;
  item: string;
}

const DocumentCenter: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState('Contract');
  const [customerId, setCustomerId] = useState('');
  const [salesId, setSalesId] = useState('');

  const API_URL = 'http://localhost:3000/api';

  useEffect(() => {
    fetchDocuments();
    fetchCustomers();
    fetchSales();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${API_URL}/documents`);
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_URL}/customers`);
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSales = async () => {
    try {
      const res = await fetch(`${API_URL}/sales`);
      const data = await res.json();
      setSales(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('請選擇檔案');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    if (customerId) formData.append('customerId', customerId);
    if (salesId) formData.append('salesId', salesId);
    formData.append('uploadedBy', 'Admin');

    try {
      const res = await fetch(`${API_URL}/documents`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        alert('上傳成功');
        setFile(null);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        fetchDocuments();
      } else {
        alert('上傳失敗');
      }
    } catch (err) {
      console.error(err);
      alert('上傳錯誤');
    }
  };

  const handleDownload = (id: number) => {
    window.open(`${API_URL}/documents/${id}/download`, '_blank');
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="document-center">
      <div className="card" style={{ marginBottom: '20px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' }}>
          <Upload size={20} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} /> 
          上傳文件
        </h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="file" onChange={handleFileChange} />
          
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
            <option value="Contract">合約文件</option>
            <option value="Identity">身分證明文件</option>
            <option value="Application">申請資料</option>
            <option value="Other">其他</option>
          </select>

          <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
            <option value="">-- 關聯客戶 --</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select value={salesId} onChange={(e) => setSalesId(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
            <option value="">-- 關聯案件 --</option>
            {sales.map(s => (
              <option key={s.id} value={s.id}>{s.client} - {s.item}</option>
            ))}
          </select>

          <button onClick={handleUpload} style={{ 
            padding: '8px 16px', 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontWeight: 500 
          }}>
            上傳
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' }}>
          <FolderOpen size={20} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} /> 
          文件列表
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>文件名稱</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>分類</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>關聯客戶/案件</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>大小</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>上傳時間</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>目前沒有文件</td>
              </tr>
            ) : (
              documents.map((doc) => {
                const customer = customers.find(c => c.id === doc.customerId);
                const sale = sales.find(s => s.id === doc.salesId);
                return (
                  <tr key={doc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={16} color="#64748b" /> {doc.originalName}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '9999px', 
                        backgroundColor: doc.category === 'Contract' ? '#dbeafe' : 
                                         doc.category === 'Identity' ? '#fce7f3' : 
                                         doc.category === 'Application' ? '#dcfce7' : '#f3f4f6',
                        color: doc.category === 'Contract' ? '#1e40af' : 
                               doc.category === 'Identity' ? '#9d174d' : 
                               doc.category === 'Application' ? '#166534' : '#374151',
                        fontSize: '0.8rem',
                        fontWeight: 500
                      }}>
                        {doc.category === 'Contract' ? '合約' : 
                         doc.category === 'Identity' ? '身分' : 
                         doc.category === 'Application' ? '申請' : '其他'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '0.9rem', color: '#475569' }}>
                      {customer && <div style={{ marginBottom: '2px' }}>👤 {customer.name}</div>}
                      {sale && <div>💼 {sale.item}</div>}
                    </td>
                    <td style={{ padding: '12px', color: '#64748b' }}>{formatSize(doc.size)}</td>
                    <td style={{ padding: '12px', color: '#64748b' }}>{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                    <td style={{ padding: '12px' }}>
                      <button 
                        onClick={() => handleDownload(doc.id)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer', 
                          color: '#3b82f6',
                          padding: '4px'
                        }}
                        title="下載"
                      >
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentCenter;
