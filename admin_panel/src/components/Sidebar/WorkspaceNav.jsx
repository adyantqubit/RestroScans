import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome, FiAlignLeft, FiAward, FiBarChart2, FiBookOpen, FiBox,
  FiCalendar, FiClipboard, FiCreditCard, FiDollarSign, FiGrid,
  FiMaximize, FiPercent, FiSettings, FiShare2, FiStar, FiTag, FiUsers,
} from 'react-icons/fi';
import style from './sidebar.module.css';
import { hasFeature } from '../../plans';

const groups = [
  { label: 'Overview', links: [['Dashboard', '/Dashboard', 'admin', FiHome]] },
  {
    label: 'Service', links: [
      ['Orders', '/Order', 'order', FiClipboard],
      ['Floors & Tables', '/Tables', 'order', FiGrid],
      ['Reservations', '/ReservationList', 'reservation', FiCalendar],
    ]
  },
  {
    label: 'Menu', links: [
      ['Menus', '/Menu', 'menu', FiBookOpen],
      ['Categories', '/Category', 'menu', FiTag],
      ['Items', '/Item', 'menu', FiBox],
      ['Offers', '/BannerOffer', 'menu', FiPercent],
    ]
  },
  {
    label: 'Guests', links: [
      ['Customers', '/CustomerDetail', 'order', FiUsers],
      ['Ratings', '/RatingReview', 'rating', FiStar],
    ]
  },
  {
    label: 'Money', links: [
      ['Revenue', '/Revenue', 'report', FiDollarSign],
      ['Expenses', '/Expenses', 'expense', FiCreditCard],
      ['Reports', '/Reports', 'report', FiBarChart2],
    ]
  },
  { label: 'Staff', links: [['Staff & Payroll', '/Workforce', 'staff', FiUsers]] },
  {
    label: 'Restaurant', links: [
      ['Settings', '/SettingForm', 'admin', FiSettings],
      ['Loyalty', '/Loyalty', 'loyalty', FiAward],
      ['Menu QR', '/QRcode', 'menu', FiMaximize],
      ['Social', '/social-media', 'social', FiShare2],
      ['Footer', '/FooterDescription', 'menu', FiAlignLeft],
    ]
  },
];

export default function WorkspaceNav({ onNavigate }) {
  const handleNavigate = () => {
    localStorage.setItem('globalPageIndex', '1');
    localStorage.setItem('listPerPage', '10');
    onNavigate?.();
  };

  if (localStorage.getItem('waiterData')) {
    return <nav className={style.workspaceNav} aria-label="Waiter navigation">
      <NavLink to="/WaiterDashboard" onClick={handleNavigate}
        className={({ isActive }) => isActive ? style.navLinkActive : style.navLink}>Dashboard</NavLink>
    </nav>;
  }

  return (
    <nav className={style.workspaceNav} aria-label="Restaurant navigation">
      {groups.map((group) => {
        const links = group.links.filter(([, , feature]) => hasFeature(feature));
        if (!links.length) return null;
        return <div key={group.label}>
          <div className={style.navLabel}>{group.label}</div>
          {links.map(([label, to, , Icon]) => (
            <NavLink
              key={to}
              to={to}
              onClick={handleNavigate}
              className={({ isActive }) => {
                const hash = typeof window !== 'undefined' ? window.location.hash : '';
                const active = to === '/SettingForm' ? isActive && !hash : isActive;
                return active ? style.navLinkActive : style.navLink;
              }}
            >
              <Icon className={style.navIcon} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>;
      })}
    </nav>
  );
}
