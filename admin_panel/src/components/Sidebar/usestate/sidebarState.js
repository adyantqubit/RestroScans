import { useState } from 'react';

export function readWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}

export function useSidebarState() {
  const [ReportSubVisible, setReportSubVisible] = useState(false);
  const [overlayEnable, setOverlayEnable] = useState(false);
  const [windowSize, setWindowSize] = useState(readWindowSize());

  return {
    ReportSubVisible,
    setReportSubVisible,
    overlayEnable,
    setOverlayEnable,
    windowSize,
    setWindowSize,
  };
}
