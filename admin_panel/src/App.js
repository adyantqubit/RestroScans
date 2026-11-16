
import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Auth/user_interface/containers/Login';
import Forget from './pages/Auth/user_interface/containers/ForgetPassword';
import { lazy, Suspense, useEffect, useState } from 'react';
import httpClient from './http/http_client';
import { hasFeature, homePath, storeFeatures } from './plans';
import { useOrderLive } from './live/orderLive';
import Notification from './pages/Notification/Notification';
import { Spin } from './ui';
import Header from './components/Header/Header';
import { useApp } from './Context/AppContext';

const Dashboard = lazy(() => import('./pages/Home/user_interface/containers/Dashboard'));
const OwnerDashboard = lazy(() => import('./pages/OwnerDashboard/OwnerDashboard'));
const Billing = lazy(() => import('./pages/Billing/user_interface/containers/Billing'));
const QRCode = lazy(() => import('./pages/Home/user_interface/containers/QRcode'));
const Kot = lazy(() => import('./pages/Kot/user_interface/containers/Kot'));
const OrderItemReport = lazy(() => import('./pages/Report/user_interface/containers/OrderItemReport'));
const ReportsHome = lazy(() => import('./pages/Report/user_interface/containers/ReportsHome'));
const CustomerReport = lazy(() => import('./pages/Report/user_interface/containers/CustomerReport'));
const BannerOffer = lazy(() => import('./pages/BannerOffer/user_interface/containers/BannerOffer'));
const BannerOfferItem = lazy(() => import('./pages/BannerOffer/user_interface/containers/BannerOfferItem'));
const Menu = lazy(() => import('./pages/Menu/user_interface/containers/Menu'));
const Category = lazy(() => import('./pages/Category/user_interface/containers/Category'));
const Item = lazy(() => import('./pages/Item/user_interface/containers/Item'));
const FooterDescription = lazy(() => import('./pages/FooterDescription/user_interface/containers/FooterDescription'));
const CustomerDetail = lazy(() => import('./pages/CustomerDetail/user_interface/containers/CustomerDetail'));
const Order = lazy(() => import('./pages/Order/user_interface/containers/Order'));
const Tables = lazy(() => import('./pages/Tables/user_interface/containers/Tables'));
const OrderItemForm = lazy(() => import('./pages/Order/user_interface/components/OrderItemForm'));
const PaymentMethod = lazy(() => import('./pages/PaymentDetail/user_interface/containers/PaymentMethod'));
const Revenue = lazy(() => import('./pages/Revenue/user_interface/containers/Revenue'));
const SettingForm = lazy(() => import('./pages/Setting/user_interface/components/SettingForm'));
const DiscountSetup = lazy(() => import('./pages/Setting/user_interface/components/DiscountSetup'));
const LoyaltySetup = lazy(() => import('./pages/Setting/user_interface/components/LoyaltySetup'));
const SocialMediaList = lazy(() => import('./pages/socialMedia/user_interface/containers/SocialMediaList'));
const SocialMediaForm = lazy(() => import('./pages/socialMedia/user_interface/components/SocialMediaForm'));
const OrderForm = lazy(() => import('./pages/Order/user_interface/components/OrderForm'));
const MenuForm = lazy(() => import('./pages/Menu/user_interface/components/MenuForm'));
const CategoryForm = lazy(() => import('./pages/Category/user_interface/components/CategoryForm'));
const EditItemForm = lazy(() => import('./pages/Item/user_interface/components/EditItemForm'));
const RestaurantRatingReview = lazy(() => import('./pages/RestaurantRatingReview/user_interface/containers/RestaurantRatingReview'));
const NewOrderReport = lazy(() => import('./pages/Report/user_interface/containers/NewOrderReport'));
const Waiter = lazy(() => import('./pages/Waiter/user_interface/containers/Waiter'));
const WaiterDashboard = lazy(() => import('./pages/Waiter/user_interface/containers/WaiterDashboard'));
const ReservationForm = lazy(() => import('./pages/TableReservation/user_interface/components/ReservationForm'));
const ReservationList = lazy(() => import('./pages/TableReservation/user_interface/containers/ReservationList'));
const OfferItem = lazy(() => import('./pages/BannerOffer/user_interface/containers/OfferItem'));
const Expenses = lazy(() => import('./pages/Expenses/Expenses'));
const Workforce = lazy(() => import('./pages/Workforce/Workforce'));
const StaffPortal = lazy(() => import('./pages/StaffPortal/StaffPortal'));

function PageLoading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
      <Spin size="large" />
    </div>
  );
}

function App() {
  const { tokenExist } = useApp();
  const location = useLocation();
  const staffPage = ['/StaffLogin', '/StaffPortal', '/WaiterLogin'].includes(location.pathname);
  const authPage = ['/Login', '/Forget'].includes(location.pathname);
  const showAdminShell = !staffPage && !authPage && Boolean(tokenExist);
  const staffActive = Boolean(sessionStorage.getItem('restroStaffSession'));
  const [planReady, setPlanReady] = useState(false);

  useOrderLive(Boolean(tokenExist && hasFeature('order')));

  useEffect(() => {
    if (!tokenExist) return undefined;

    let cancelled = false;

    const done = (list) => {
      if (cancelled) return;

      if (Array.isArray(list)) {
        storeFeatures(list);
      } else if (!localStorage.getItem('planFeatures')) {
        storeFeatures(['menu', 'whatsapp', 'social', 'admin']);
      }

      setPlanReady(true);
    };

    httpClient
      .get('/api/v1/plan-features/')
      .then((res) => done(res && res.data ? res.data.features : null))
      .catch(() => done(null));

    return () => {
      cancelled = true;
    };
  }, [tokenExist]);

  if (!staffPage && tokenExist && !localStorage.getItem('planFeatures') && !planReady) {
    return <PageLoading />;
  }

  const signedInHome = homePath();

  const requireLogin = (element) => {
    return tokenExist ? element : <Navigate to="/Login" replace />;
  };

  const allow = (feature, element) => {
    if (!tokenExist) return <Navigate to="/Login" replace />;
    if (!hasFeature(feature)) return <Navigate to={signedInHome} replace />;
    return element;
  };

  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route
            path="/"
            element={
              tokenExist
                ? <Navigate to={signedInHome} replace />
                : staffActive
                  ? <Navigate to="/StaffPortal" replace />
                  : <Navigate to="/Login" replace />
            }
          />
          <Route
            path="/Login"
            element={tokenExist ? <Navigate to={signedInHome} replace /> : <Login />}
          />
          <Route
            path="/Forget"
            element={tokenExist ? <Navigate to={signedInHome} replace /> : <Forget />}
          />
          <Route path="/WaiterLogin" element={<Navigate to="/StaffLogin" replace />} />
          <Route path="/StaffLogin" element={<StaffPortal />} />
          <Route path="/StaffPortal" element={<StaffPortal />} />
          <Route path="/kot" element={allow('order', <Kot />)} />
          <Route path="/Billing" element={allow('order', <Billing />)} />
        </Routes>
      </Suspense>

      {showAdminShell && (
        <Header>
          <Suspense fallback={<PageLoading />}>
            <Routes>
              <Route path="/Dashboard" element={allow('admin', <OwnerDashboard />)} />
              <Route path="/Floor" element={allow('order', <Dashboard />)} />
              <Route path="/notification" element={requireLogin(<Notification />)} />
              <Route path="/Reports" element={allow('report', <ReportsHome />)} />
              <Route path="/NewOrderReport" element={allow('report', <NewOrderReport />)} />
              <Route path="/OrderItemReport" element={allow('report', <OrderItemReport />)} />
              <Route path="/CustomerReport" element={allow('report', <CustomerReport />)} />
              <Route path="/QRcode" element={requireLogin(<QRCode />)} />
              <Route path="/BannerOffer" element={requireLogin(<BannerOffer />)} />
              <Route path="/BannerOfferItem" element={requireLogin(<BannerOfferItem />)} />
              <Route path="/Menu" element={requireLogin(<Menu />)} />
              <Route path="/MenuForm" element={requireLogin(<MenuForm />)} />
              <Route path="/Category" element={requireLogin(<Category />)} />
              <Route path="/CategoryForm" element={requireLogin(<CategoryForm />)} />
              <Route path="/Item" element={requireLogin(<Item />)} />
              <Route path="/editItemForm" element={requireLogin(<EditItemForm />)} />
              <Route path="/SettingForm" element={requireLogin(<SettingForm />)} />
              <Route path="/Discount" element={allow('discount', <DiscountSetup />)} />
              <Route path="/Loyalty" element={allow('loyalty', <LoyaltySetup />)} />
              <Route path="/FooterDescription" element={requireLogin(<FooterDescription />)} />
              <Route path="/CustomerDetail" element={allow('order', <CustomerDetail />)} />
              <Route path="/Order" element={allow('order', <Order />)} />
              <Route path="/Tables" element={allow('order', <Tables />)} />
              <Route path="/OrderItem" element={allow('order', <Navigate to="/Order" replace />)} />
              <Route path="/PaymentMethod" element={allow('payment', <PaymentMethod />)} />
              <Route path="/Revenue" element={allow('report', <Revenue />)} />
              <Route path="/social-media" element={allow('social', <SocialMediaList />)} />
              <Route path="/add-social-media" element={allow('social', <SocialMediaForm />)} />
              <Route path="/update-social-media/:id" element={allow('social', <SocialMediaForm />)} />
              <Route path="/update-order/:id" element={allow('order', <OrderForm />)} />
              <Route path="/update-order-item/:id" element={allow('order', <OrderItemForm />)} />
              <Route path="/RatingReview" element={allow('rating', <RestaurantRatingReview />)} />
              <Route path="/Waiter" element={allow('order', <Waiter />)} />
              <Route
                path="/waiterDashboard"
                element={
                  !tokenExist
                    ? <Navigate to="/WaiterLogin" replace />
                    : hasFeature('order')
                      ? <WaiterDashboard />
                      : <Navigate to={signedInHome} replace />
                }
              />
              <Route path="/ReservationForm" element={allow('reservation', <ReservationForm />)} />
              <Route path="/ReservationList" element={allow('reservation', <ReservationList />)} />
              <Route path="/OfferItem" element={requireLogin(<OfferItem />)} />
              <Route path="/Expenses" element={allow('expense', <Expenses />)} />
              <Route path="/Workforce" element={requireLogin(<Workforce />)} />
            </Routes>
          </Suspense>
        </Header>
      )}
    </>
  );
}

export default App;
