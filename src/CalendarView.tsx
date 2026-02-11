import React, { useState, useEffect } from 'react';
import { type CalendarEvent } from './data/mockEvents';
import { ChevronLeft, ChevronRight, Plus, MapPin, User, Clock, X, Save } from 'lucide-react';

const CalendarView: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1));
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Fetch Events
  useEffect(() => {
    fetch('http://localhost:3000/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, []);

  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '', date: new Date().toISOString().split('T')[0], time: '09:00', type: '約訪', consultant: 'Karen'
  });

  const handleAddEvent = () => {
    if (!newEvent.title) return;
    
    fetch('http://localhost:3000/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent)
    })
    .then(res => res.json())
    .then(savedEvent => {
      setEvents([...events, savedEvent]);
      setIsModalOpen(false);
      setNewEvent({ title: '', date: new Date().toISOString().split('T')[0], time: '09:00', type: '約訪', consultant: 'Karen' });
    });
  };
  
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  const days = [];
  const totalDays = daysInMonth(currentYear, currentMonth);
  const startDay = firstDayOfMonth(currentYear, currentMonth);

  // Pad previous month days
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  // Current month days
  for (let day = 1; day <= totalDays; day++) {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = events.filter(e => e.date === dateString);
    
    days.push(
      <div key={day} className="calendar-day">
        <div className="day-number">{day}</div>
        <div className="day-events">
          {dayEvents.map(event => (
            <div 
              key={event.id} 
              className={`event-item ${event.type === '約訪' ? 'event-client' : event.type === '訓練' ? 'event-training' : 'event-other'}`}
              title={`${event.time} ${event.title}`}
            >
              <div className="event-time">{event.time}</div>
              <div className="event-title">{event.title}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="card-title" style={{ fontSize: '1.5rem', margin: 0 }}>行事曆 (Calendar)</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="secondary-btn" onClick={handlePrevMonth}><ChevronLeft size={20}/></button>
          <span style={{ fontSize: '1.25rem', fontWeight: 600, minWidth: '150px', textAlign: 'center' }}>{monthName}</span>
          <button className="secondary-btn" onClick={handleNextMonth}><ChevronRight size={20}/></button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="primary-btn" 
            style={{ 
              backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', 
              display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem', cursor: 'pointer', border: 'none'
            }}
          >
            <Plus size={18} /> 新增行程
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="calendar-header">
          <div>週日</div><div>週一</div><div>週二</div><div>週三</div><div>週四</div><div>週五</div><div>週六</div>
        </div>
        <div className="calendar-grid">
          {days}
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 className="card-title">近期行程列表</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {events.slice(0, 3).map(event => (
            <div key={event.id} className="event-card" style={{ 
              borderLeft: `4px solid ${event.type === '約訪' ? '#3b82f6' : event.type === '訓練' ? '#10b981' : '#6b7280'}`,
              padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: '1rem' }}>{event.title}</span>
                <span className={`status-badge`} style={{ 
                  backgroundColor: event.type === '約訪' ? '#dbeafe' : event.type === '訓練' ? '#d1fae5' : '#f3f4f6',
                  color: event.type === '約訪' ? '#1e40af' : event.type === '訓練' ? '#065f46' : '#374151'
                }}>{event.type}</span>
              </div>
              
              <div style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={14} /> {event.date} {event.time}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={14} /> {event.consultant}
                </div>
                {event.details && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={14} /> {event.details}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Modal */}
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
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>新增行程</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>標題</label>
                <input 
                  type="text" 
                  value={newEvent.title}
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>日期</label>
                  <input 
                    type="date" 
                    value={newEvent.date}
                    onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>時間</label>
                  <input 
                    type="time" 
                    value={newEvent.time}
                    onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>類型</label>
                  <select 
                    value={newEvent.type}
                    onChange={e => setNewEvent({...newEvent, type: e.target.value as any})}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                  >
                    <option value="約訪">約訪</option>
                    <option value="訓練">訓練</option>
                    <option value="會議">會議</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>顧問</label>
                  <select 
                    value={newEvent.consultant}
                    onChange={e => setNewEvent({...newEvent, consultant: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                  >
                    <option value="Karen">Karen</option>
                    <option value="Vincent">Vincent</option>
                    <option value="Alex">Alex</option>
                    <option value="All">All</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>備註/地點</label>
                <input 
                  type="text" 
                  value={newEvent.details}
                  onChange={e => setNewEvent({...newEvent, details: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                />
              </div>

              <button 
                onClick={handleAddEvent}
                style={{ 
                  marginTop: '1rem', padding: '0.75rem', backgroundColor: '#2563eb', color: 'white', 
                  borderRadius: '0.5rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
                }}
              >
                <Save size={20} /> 儲存行程
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .calendar-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 0.5rem 0;
          font-weight: 600;
          color: #64748b;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          background-color: #e2e8f0;
          gap: 1px;
        }
        .calendar-day {
          background-color: white;
          min-height: 120px;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
        }
        .calendar-day.empty {
          background-color: #f8fafc;
        }
        .day-number {
          font-weight: 600;
          color: #64748b;
          margin-bottom: 0.5rem;
        }
        .day-events {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }
        .event-item {
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .event-client {
          background-color: #eff6ff;
          color: #1e40af;
          border-left: 2px solid #3b82f6;
        }
        .event-training {
          background-color: #ecfdf5;
          color: #065f46;
          border-left: 2px solid #10b981;
        }
        .event-other {
          background-color: #f3f4f6;
          color: #374151;
          border-left: 2px solid #6b7280;
        }
        .event-time {
          font-weight: 700;
          margin-right: 0.25rem;
          display: inline;
        }
        .event-title {
          display: inline;
        }
        .secondary-btn {
          padding: 0.25rem;
          border-radius: 0.25rem;
          color: #64748b;
          cursor: pointer;
          border: none;
        }
        .secondary-btn:hover {
          background-color: #e2e8f0;
          color: #1e293b;
        }
      `}</style>
    </div>
  );
};

export default CalendarView;
