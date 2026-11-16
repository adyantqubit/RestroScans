import { useState } from 'react';

export function readWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}

export function useHeaderState() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  const [adminSetting, setAdminSettings] = useState(null);
  const [windowSize, setWindowSize] = useState(readWindowSize());

  return {
    menuOpen,
    setMenuOpen,
    sidebar,
    setSidebar,
    adminSetting,
    setAdminSettings,
    windowSize,
    setWindowSize,
  };
}
