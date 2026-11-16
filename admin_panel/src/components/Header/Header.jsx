import React, { useEffect, useState } from "react";
import { unreadCount } from "../../live/orderLive";
import { homePath } from "../../plans";
import { readWindowSize, useHeaderState } from "./usestate/headerState";
import style from "./shell.module.css";
import Sidebar from "../Sidebar/Sidebar";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import RestroscansLogo from "../../assets/restroscansLogo.png";
import { FaBell } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { Popconfirm } from "../../ui";
import { useApp } from "../../Context/AppContext";
import { loadAdminSettings } from "../Shell/services/globalComponentService";

const Header = (props) => {
  const staffMode = Boolean(props.staffMode);
  const { Message, tokenRecheck } = useApp();
  const {
    menuOpen,
    setMenuOpen,
    sidebar,
    setSidebar,
    adminSetting,
    setAdminSettings,
    windowSize,
    setWindowSize,
  } = useHeaderState();

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    setSidebar(false);
  }, [location.pathname, location.search, location.hash, setSidebar]);
  const [unread, setUnread] = useState(0);
  const [staffProfileOpen, setStaffProfileOpen] = useState(false);

  useEffect(() => {
    const refresh = () => setUnread(unreadCount());
    refresh();
    window.addEventListener('order-notices', refresh);
    return () => window.removeEventListener('order-notices', refresh);
  }, []);

  useEffect(() => {
    if (!staffMode) getAdminSettingData()
  }, [])

  const linkOpen = (url) => {
    window.open(url, "_blank", "noreferrer");
  };

  const confirm = () => {
    if (staffMode) {
      if (props.onStaffLogout) props.onStaffLogout();
      setMenuOpen(false);
      setStaffProfileOpen(false);
      return;
    }
    localStorage.removeItem("token");
    setMenuOpen(false);
    navigate("/Login");
    localStorage.clear();
    tokenRecheck();
    Message("Successfully logged out", "warning");
  };
  const cancel = (e) => { };

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(readWindowSize());
    }
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [window.innerWidth]);

  useEffect(() => {
    if (windowSize.innerWidth > 767) setSidebar(false)
  }, [windowSize])

  async function getAdminSettingData() {
    await loadAdminSettings().then(r => { setAdminSettings(r); console.log(r) })
  }

  const home = staffMode ? "/StaffPortal" : (localStorage.getItem("waiterData") ? "/waiterDashboard" : homePath());
  let restaurant = "Restaurant";
  let loggedInName = "";
  let loggedInEmail = "";
  try {
    const user = JSON.parse(localStorage.getItem("userData") || "{}");
    const tenant = JSON.parse(localStorage.getItem("tenantInfo") || "{}");
    restaurant = user.restaurant_name || tenant.tenant_name || restaurant;
    loggedInName = user.name || user.full_name || user.username || user.first_name || "";
    loggedInEmail = user.email || user.email_id || "";
  } catch (err) {
    restaurant = "Restaurant";
  }
  if (staffMode) {
    restaurant = props.staffRestaurant || "Restaurant";
    loggedInName = "";
    loggedInEmail = "";
  }
  const adminProfileName = String(loggedInName || loggedInEmail || "Restaurant Admin").trim();
  const adminProfileRole = String((() => {
    try {
      const user = JSON.parse(localStorage.getItem("userData") || "{}");
      const role = user.role_name || user.role || user.user_role || user.user_type || user.designation || user.position;
      return typeof role === "string" && role.trim() ? role : "Restaurant Admin";
    } catch (_) { return "Restaurant Admin"; }
  })());
  const adminInitials = adminProfileName.split(/\\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
  const staffName = String(props.staffEmployee?.name || "Staff Member").trim();
  const staffRole = String(props.staffEmployee?.role || "Staff").trim();
  const staffInitials = staffName.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
  const today = new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

  return (
    <div className={style.shell}>
      <aside className={`${style.sider} ${sidebar ? style.siderOpen : ""}`}>
        <Link to={home} className={style.brand}>
          <img src={RestroscansLogo} alt="" />
          <div>
            <strong>{restaurant}</strong>
            <span>RestroScans</span>
          </div>
        </Link>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} staffMode={staffMode} staffTab={props.staffTab} staffItems={props.staffItems} onStaffNavigate={(tab) => { if (props.onStaffNavigate) props.onStaffNavigate(tab); setSidebar(false); }} />
      </aside>
      {sidebar ? <button type="button" className={style.backdrop} aria-label="Close menu" onClick={() => setSidebar(false)} /> : null}
      <div className={style.mainCol}>
        <header className={style.topbar}>
          <button type="button" id="drawer" className={style.menuBtn} onClick={() => setSidebar(!sidebar)}>
            <GiHamburgerMenu />
          </button>
          <div className={style.topTitle}>
            <strong>{restaurant}</strong>
            <span>{today}</span>

          </div>
          <div className={style.topActions}>
            {!staffMode && <NavLink to="/notification" className={style.iconBtn} aria-label="Notifications">
              <FaBell />
              {unread > 0 ? <span className={style.badge}>{unread > 9 ? "9+" : unread}</span> : null}
            </NavLink>}
            {!staffMode && adminSetting && adminSetting.adyant_support_link ? (
              <button type="button" className={style.textBtn} onClick={() => linkOpen(adminSetting.adyant_support_link)}>
                Support
              </button>
            ) : null}
            {staffMode ? (
              <div className={style.staffProfile}>
                <button type="button" className={style.staffProfileTrigger} aria-expanded={staffProfileOpen} aria-haspopup="true" onClick={() => setStaffProfileOpen(open => !open)}>
                  <span className={style.staffAvatar} aria-hidden="true">{staffInitials || "S"}</span>
                  <span className={style.staffIdentity}><strong>{staffName}</strong><small>{staffRole}</small></span>
                  <span className={style.staffChevron} aria-hidden="true">{staffProfileOpen ? "▴" : "▾"}</span>
                </button>
                {staffProfileOpen && <div className={style.staffProfileMenu}>
                  <div className={style.staffProfileMenuInfo}><strong>{staffName}</strong><small>{staffRole}</small></div>
                  <button type="button" className={style.staffLogoutAction} onClick={confirm}>Log out</button>
                </div>}
              </div>
            ) : (
              <div className={style.staffProfile}>
                <button type="button" className={style.staffProfileTrigger} aria-expanded={staffProfileOpen} aria-haspopup="true" onClick={() => setStaffProfileOpen(open => !open)}>
                  <span className={style.staffAvatar} aria-hidden="true">{adminInitials || "A"}</span>
                  <span className={style.staffIdentity}><strong>{adminProfileName}</strong><small>{adminProfileRole}</small></span>
                  <span className={style.staffChevron} aria-hidden="true">{staffProfileOpen ? "▴" : "▾"}</span>
                </button>
                {staffProfileOpen && <div className={style.staffProfileMenu}>
                  <div className={style.staffProfileMenuInfo}><strong>{adminProfileName}</strong><small>{adminProfileRole}</small></div>
                  <Popconfirm title="Log out of this restaurant?" onConfirm={confirm} onCancel={cancel} cancelText="Cancel" okText="Log out">
                    <button type="button" className={style.staffLogoutAction}>Log out</button>
                  </Popconfirm>
                </div>}
              </div>
            )}
          </div>
        </header>
        <main className={`${style.workspace} workspace`}>{props.children}</main>
      </div>
    </div>
  );
};

export default Header;
