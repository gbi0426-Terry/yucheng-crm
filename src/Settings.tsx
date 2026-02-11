import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, Save, Percent, List, Shield } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    email_enabled: false,
    email_address: '',
    line_enabled: false,
    line_token: '',
    notify_new_customer: false,
    notify_case_status: false,
    notify_deal_closed: false,
    notify_announcement: false,
    commission_rate_consultant: '63',
    commission_rate_service: '50',
    case_stages: '',
    roles_permissions: ''
  });

  const API_URL = 'http://localhost:3000/api';

  useEffect(() => {
    fetch(`${API_URL}/settings`)
      .then(res => res.json())
      .then(data => {
        // Convert string 'true'/'false' to boolean for UI
        const parsedSettings = { ...data };
        Object.keys(parsedSettings).forEach(key => {
          if (parsedSettings[key] === 'true') parsedSettings[key] = true;
          if (parsedSettings[key] === 'false') parsedSettings[key] = false;
        });
        setSettings(parsedSettings);
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await fetch(`${API_URL}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      alert('設定已儲存');
    } catch (err) {
      console.error(err);
      alert('儲存失敗');
    }
  };

  return (
    <div className="settings-page">
      <h1 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>系統通知設定</h1>

      <div style={{ display: 'grid', gap: '20px', maxWidth: '800px' }}>
        
        {/* Channel Settings */}
        <div className="card" style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px', color: '#1e293b' }}>
            <Bell size={20} style={{ verticalAlign: 'text-bottom', marginRight: '8px' }} />
            通知管道設定
          </h3>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <input 
                type="checkbox" 
                id="email_enabled"
                checked={settings.email_enabled} 
                onChange={(e) => handleChange('email_enabled', e.target.checked)}
                style={{ marginRight: '10px', width: '18px', height: '18px' }}
              />
              <label htmlFor="email_enabled" style={{ fontWeight: 500, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={18} /> 啟用 Email 通知
              </label>
            </div>
            {settings.email_enabled && (
              <div style={{ marginLeft: '28px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#64748b' }}>接收信箱：</label>
                <input 
                  type="email" 
                  value={settings.email_address || ''} 
                  onChange={(e) => handleChange('email_address', e.target.value)}
                  placeholder="admin@example.com"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <input 
                type="checkbox" 
                id="line_enabled"
                checked={settings.line_enabled} 
                onChange={(e) => handleChange('line_enabled', e.target.checked)}
                style={{ marginRight: '10px', width: '18px', height: '18px' }}
              />
              <label htmlFor="line_enabled" style={{ fontWeight: 500, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} color="#06c755" /> 啟用 LINE 通知
              </label>
            </div>
            {settings.line_enabled && (
              <div style={{ marginLeft: '28px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#64748b' }}>LINE Notify Token：</label>
                <input 
                  type="password" 
                  value={settings.line_token || ''} 
                  onChange={(e) => handleChange('line_token', e.target.value)}
                  placeholder="輸入 LINE Notify 權杖"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
                <small style={{ color: '#94a3b8' }}>請至 LINE Notify 官網申請發行權杖</small>
              </div>
            )}
          </div>
        </div>

        {/* Trigger Settings */}
        <div className="card" style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px', color: '#1e293b' }}>
            🔔 通知觸發事件
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {/* ... triggers ... */}
            <label style={{ display: 'flex', alignItems: 'center', padding: '10px', background: '#f8fafc', borderRadius: '6px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={settings.notify_new_customer} 
                onChange={(e) => handleChange('notify_new_customer', e.target.checked)}
                style={{ marginRight: '10px', width: '16px', height: '16px' }}
              />
              <div>
                <div style={{ fontWeight: 500 }}>新客戶指派</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>當有新名單分配給顧問時</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', padding: '10px', background: '#f8fafc', borderRadius: '6px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={settings.notify_case_status} 
                onChange={(e) => handleChange('notify_case_status', e.target.checked)}
                style={{ marginRight: '10px', width: '16px', height: '16px' }}
              />
              <div>
                <div style={{ fontWeight: 500 }}>案件狀態變更</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>案件進度更新或異動時</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', padding: '10px', background: '#f8fafc', borderRadius: '6px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={settings.notify_deal_closed} 
                onChange={(e) => handleChange('notify_deal_closed', e.target.checked)}
                style={{ marginRight: '10px', width: '16px', height: '16px' }}
              />
              <div>
                <div style={{ fontWeight: 500 }}>成交完成</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>案件標記為已成交付款時</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', padding: '10px', background: '#f8fafc', borderRadius: '6px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={settings.notify_announcement} 
                onChange={(e) => handleChange('notify_announcement', e.target.checked)}
                style={{ marginRight: '10px', width: '16px', height: '16px' }}
              />
              <div>
                <div style={{ fontWeight: 500 }}>新公告發布</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>系統發布重要公告時</div>
              </div>
            </label>
          </div>
        </div>

        {/* Business Settings */}
        <div className="card" style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px', color: '#1e293b' }}>
            <Percent size={20} style={{ verticalAlign: 'text-bottom', marginRight: '8px' }} />
            分潤與業務設定
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>顧問分潤比例 (%)</label>
              <input 
                type="number" 
                value={settings.commission_rate_consultant} 
                onChange={(e) => handleChange('commission_rate_consultant', e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>服務費分潤比例 (%)</label>
              <input 
                type="number" 
                value={settings.commission_rate_service} 
                onChange={(e) => handleChange('commission_rate_service', e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>
              <List size={16} style={{ marginRight: '6px' }} />
              案件階段流程 (以逗號分隔)
            </label>
            <input 
              type="text" 
              value={settings.case_stages || '新名單,約訪中,提案中,已成交,已結案'} 
              onChange={(e) => handleChange('case_stages', e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>
              <Shield size={16} style={{ marginRight: '6px' }} />
              顧問角色權限 (JSON)
            </label>
            <textarea 
              value={settings.roles_permissions || ''} 
              onChange={(e) => handleChange('roles_permissions', e.target.value)}
              rows={4}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }}
            />
            <small style={{ color: '#94a3b8' }}>請謹慎修改權限設定 JSON 格式</small>
          </div>
        </div>

        <button 
          onClick={handleSave}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '10px'
          }}
        >
          <Save size={20} /> 儲存設定
        </button>

      </div>
    </div>
  );
};

export default Settings;
