import React, { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Settings, LogOut, FileText, Calendar, Bell, Clock, Search, FolderOpen, ShieldCheck, AlertTriangle } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { name: '戰情室 (Dashboard)', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: '客戶管理', path: '/customers', icon: <Users size={20} /> },
    { name: '業績報表', path: '/performance', icon: <BarChart3 size={20} /> },
    { name: '行事曆', path: '/calendar', icon: <Calendar size={20} /> },
    { name: '打卡紀錄', path: '/checkin', icon: <Clock size={20} /> },
    { name: '查詢工具', path: '/tools', icon: <Search size={20} /> },
    { name: '文件中心', path: '/documents', icon: <FolderOpen size={20} /> },
    { name: '資源中心', path: '/resources', icon: <FileText size={20} /> },
    { name: '稽核紀錄', path: '/audit', icon: <ShieldCheck size={20} /> },
    
    // Future Modules Placeholders
    { name: '客戶風險評分', path: '/risk-score', icon: <AlertTriangle size={20} />, disabled: true },
    { name: '合約到期提醒', path: '/contract-expiry', icon: <Calendar size={20} />, disabled: true },
    
    { name: '系統設定', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span>昱成 CRM</span>
        </div>
        <nav className="nav-menu">
          {menuItems.map((item) => (
            item.disabled ? (
              <div key={item.name} className="nav-item disabled" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                <span className="nav-icon">{item.icon}</span>
                {item.name} 
                <span style={{ marginLeft: 'auto', fontSize: '0.7rem', border: '1px solid #64748b', padding: '1px 4px', borderRadius: '4px' }}>即將推出</span>
              </div>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.name}
              </NavLink>
            )
          ))}
        </nav>
        <div className="nav-menu" style={{ flex: '0', borderTop: '1px solid #334155' }}>
          <button className="nav-item" style={{ width: '100%', textAlign: 'left' }}>
            <span className="nav-icon"><LogOut size={20} /></span>
            登出
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="page-title">
            {menuItems.find((item) => item.path === location.pathname)?.name || '昱成企業管理系統'}
          </div>
          <div className="user-profile">
            <button style={{ marginRight: '1rem', position: 'relative' }}>
              <Bell size={20} color="#64748b" />
              <span style={{ 
                position: 'absolute', top: -5, right: -5, 
                width: 8, height: 8, backgroundColor: 'red', borderRadius: '50%' 
              }}></span>
            </button>
            <div className="avatar">A</div>
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Admin</span>
          </div>
        </header>

        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
