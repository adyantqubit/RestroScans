import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdReceiptLong, MdPendingActions, MdRestaurant, MdPayments, MdCheckCircle, MdCancel } from "react-icons/md";
import { loadDashboard } from "../../services/homeService";
import { hasFeature } from "../../../../plans";

const cards = [
  ["Placed", "todays_newly_placed_orders", MdReceiptLong, "blue", "/Order"],
  ["Pending", "todays_pending_orders", MdPendingActions, "orange", "/Order"],
  ["Served", "todays_served_orders", MdRestaurant, "teal", "/Order"],
  ["Paid", "todays_paid_orders", MdPayments, "green", "/Order"],
  ["Completed", "todays_completed_orders", MdCheckCircle, "blue", "/Order"],
  ["Cancelled", "todays_cancelled_orders", MdCancel, "orange", "/Order"],
];

export default function DashboardMetrics({ recall }) {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo") || "{}").tenant_name;
    if (!tenant) return undefined;
    let cancelled = false;
    loadDashboard(tenant).then((response) => {
      if (cancelled || !response) return;
      const next = {};
      cards.forEach(([, key]) => {
        next[key] = Array.isArray(response[key]) ? response[key].length : 0;
      });
      setCounts(next);
    });
    return () => { cancelled = true; };
  }, [recall]);

  return (
    <div className="home-dashboard">
      <div className="dashboard-metric-grid">
        {cards.map(([title, key, Icon, tone, to]) => (
          <Link key={key} to={to} className="dashboard-metric-card-link">
            <div className={`dashboard-metric-card dashboard-metric-card--${tone}`}>
              <div className="dashboard-metric-card__top">
                <div className="dashboard-metric-card__icon"><Icon size={20} /></div>
                <span className="dashboard-metric-card__arrow">→</span>
              </div>
              <div className="dashboard-metric-card__value">{counts[key] ?? "—"}</div>
              <div className="dashboard-metric-card__title">{title} today</div>
            </div>
          </Link>
        ))}
        {hasFeature("report") ? (
          <Link to="/Reports" className="dashboard-metric-card-link">
            <div className="dashboard-metric-card dashboard-metric-card--teal">
              <div className="dashboard-metric-card__top">
                <div className="dashboard-metric-card__icon"><MdReceiptLong size={20} /></div>
                <span className="dashboard-metric-card__arrow">→</span>
              </div>
              <div className="dashboard-metric-card__value">Reports</div>
              <div className="dashboard-metric-card__title">Orders, items, customers</div>
            </div>
          </Link>
        ) : null}
        {hasFeature("rating") ? (
          <Link to="/RatingReview" className="dashboard-metric-card-link">
            <div className="dashboard-metric-card dashboard-metric-card--green">
              <div className="dashboard-metric-card__top">
                <div className="dashboard-metric-card__icon"><MdCheckCircle size={20} /></div>
                <span className="dashboard-metric-card__arrow">→</span>
              </div>
              <div className="dashboard-metric-card__value">Ratings</div>
              <div className="dashboard-metric-card__title">Feedback from diners</div>
            </div>
          </Link>
        ) : null}
        {hasFeature("reservation") ? (
          <Link to="/ReservationList" className="dashboard-metric-card-link">
            <div className="dashboard-metric-card dashboard-metric-card--blue">
              <div className="dashboard-metric-card__top">
                <div className="dashboard-metric-card__icon"><MdRestaurant size={20} /></div>
                <span className="dashboard-metric-card__arrow">→</span>
              </div>
              <div className="dashboard-metric-card__value">Reservations</div>
              <div className="dashboard-metric-card__title">Tables booked ahead</div>
            </div>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
