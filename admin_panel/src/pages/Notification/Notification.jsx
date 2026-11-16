import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { markNoticesSeen, readNotices } from '../../live/orderLive';

const box = {
  maxWidth: 720,
  margin: '24px auto',
  padding: '0 16px 32px',
  fontFamily: 'var(--font-family)',
};

const row = {
  borderBottom: '1px solid #e6e6e6',
  padding: '12px 0',
  cursor: 'pointer',
};

export default function Notification() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    markNoticesSeen();
    setNotices(readNotices());
  }, []);

  return (
    <div style={box}>
      <h2>Notifications</h2>
      {notices.length === 0 ? <p>No order updates yet.</p> : null}
      {notices.map((notice) => (
        <div key={notice.id} style={row} onClick={() => navigate('/Dashboard')}>
          <div>{notice.summary || notice.event_type}</div>
          <div style={{ color: '#666', fontSize: 13 }}>
            {notice.order_id} · {notice.order_status}
            {notice.created_at ? ` · ${notice.created_at}` : ''}
          </div>
        </div>
      ))}
    </div>
  );
}
