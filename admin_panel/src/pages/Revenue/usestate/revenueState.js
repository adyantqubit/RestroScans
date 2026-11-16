import { useState } from 'react';

export const initialRevenueState = {
  loading: false,
  error: '',
};

export function useRevenueState() {
  const [data, setData] = useState();
  const [todaySummary, setTodaySummary] = useState(null);
  const [thisWeekSummary, setThisWeekSummary] = useState(null);
  const [thisMonthSummary, setThisMonthSummary] = useState(null);
  const [thisYearSummary, setThisYearSummary] = useState(null);
  const [totalDashboardRevenue, setTotalDashboardRevenue] = useState(null);
  return {
    data,
    setData,
    todaySummary,
    setTodaySummary,
    thisWeekSummary,
    setThisWeekSummary,
    thisMonthSummary,
    setThisMonthSummary,
    thisYearSummary,
    setThisYearSummary,
    totalDashboardRevenue,
    setTotalDashboardRevenue,
  };
}
