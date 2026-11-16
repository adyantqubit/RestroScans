import React, { lazy, Suspense, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import style from "../style/dashboard.module.css"
import TodayOrder from '../components/TodayOrder'
import DashboardMetrics from '../components/DashboardMetrics'
import { useApp } from '../../../../Context/AppContext'
import OrderCreation from '../components/OrderCreation'
import CustomButton from '../../../../components/erp/CustomButton'
import { useDashboardState } from "../../usestate/dashboardState";
import { hasFeature } from '../../../../plans';

const StaffTableDashboard = lazy(() => import('../../../StaffPortal/StaffTableDashboard'));

function restaurantName() {
  try {
    const user = JSON.parse(localStorage.getItem("userData") || "{}");
    const tenant = JSON.parse(localStorage.getItem("tenantInfo") || "{}");
    return user.restaurant_name || tenant.tenant_name || "Restaurant";
  } catch (err) {
    return "Restaurant";
  }
}

const Dashboard = () => {
  const { enableHeader } = useApp();
  const [showFloorOperations, setShowFloorOperations] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    enableHeader()
  }, [])

  var {
    IsOrderPopupVisible,
    setOrderPopupvisible,
    recall,
    setRecall,
  } = useDashboardState();
  const location = useLocation();
  const seatTable = location.state?.seatTable || "";
  const seatAt = location.state?.seatAt || 0;

  useEffect(() => {
    if (seatTable) setOrderPopupvisible(true);
  }, [seatAt]);

  useEffect(() => {
    const onLive = () => setRecall((current) => [...current, String(Date.now())])
    window.addEventListener('order-live', onLive)
    return () => window.removeEventListener('order-live', onLive)
  }, [])

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className={`service-desk ${style.Container}`}>
      <div className="page-header">
        <div className="page-header__title-wrap">
          <span className="page-header__kicker">In service</span>
          <h2 className="page-header__title">{restaurantName()}</h2>
          <p className="page-header__subtitle">{today}</p>
        </div>
        <div className="page-header__meta">
          <CustomButton type="button" onClick={() => setOrderPopupvisible(true)}>New order</CustomButton>
        </div>
      </div>

      <OrderCreation recall={recall} setRecall={setRecall} IsOrderPopupVisible={IsOrderPopupVisible} setOrderPopupvisible={setOrderPopupvisible} seatTable={seatTable} seatAt={seatAt} />
      <DashboardMetrics recall={recall} />

      <section className="custom-screen-section custom-screen-section--table">
        <div className="erp-list-section-head">
          <div className="erp-list-section-head__copy">
            <span className="page-header__kicker">Floor</span>
            <strong>Today's orders</strong>
          </div>
        </div>
        <TodayOrder recall={recall} />
      </section>
      {hasFeature('order') && <section className="custom-screen-section" style={{ marginTop: 24 }}>
        <button type="button" aria-expanded={showFloorOperations} aria-controls="admin-floor-operations"
          onClick={() => setShowFloorOperations(value => !value)}
          style={{ width: '100%', padding: '18px 22px', borderRadius: 12, border: '1px solid #d9e3eb', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}>
          <span><strong style={{ display: 'block', fontSize: 18 }}>Floor &amp; Table Operations</strong>
            <span style={{ color: '#667085', fontSize: 13 }}>Select a floor and table to place or manage orders</span></span>
          <strong>{showFloorOperations ? '▲ Collapse' : '▼ Expand'}</strong>
        </button>
        {showFloorOperations && <div id="admin-floor-operations" style={{ marginTop: 16 }}>
          <Suspense fallback={<p>Loading floor operations...</p>}>
            <StaffTableDashboard adminMode onOrders={(orderId) => navigate('/Order', { state: { focusedOrderId: orderId } })} />
          </Suspense>
        </div>}
      </section>}
    </div>
  )
}

export default Dashboard
