import React from 'react';
import style from './sidebar.module.css';
import WorkspaceNav from './WorkspaceNav';

export default function Sidebar({ setSidebar, staffMode = false, staffTab, staffItems = [], onStaffNavigate }) {
  const closeMenu = () => setSidebar(false);

  return (
    <div className={style.container} id="sidebar" style={{ display: 'block', width: '100%', minWidth: 0 }}>
      <div className={style.workspaceNav}>
        {staffMode ? (
          <nav aria-label="Staff navigation">
            {staffItems.map((item) => (
              <button
                type="button"
                key={item.key}
                className={staffTab === item.key ? style.navLinkActive : style.navLink}
                aria-current={staffTab === item.key ? 'page' : undefined}
                onClick={() => {
                  onStaffNavigate?.(item.key);
                  closeMenu();
                }}
                style={{ display: 'flex', width: '100%', cursor: 'pointer', textAlign: 'left' }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        ) : (
          <WorkspaceNav onNavigate={closeMenu} />
        )}
      </div>
    </div>
  );
}
