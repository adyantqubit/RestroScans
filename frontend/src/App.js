import appStyle from "./App.module.css";

import Cover from "./component/cover/Cover";

import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import MenuItem from "./component/MenuItem/MenuItem";
import Footer from "./component/footer/Footer";
import Cart from "./component/cart/Cart";
import { FaClipboardList } from "react-icons/fa"
import { useContext } from "react";
import { GlobalContext } from "./context/Context";
import InvoiceDetails from "./component/InvoiceDetails/InvoiceDetails";
import Payment from "./component/Payment/Payment";
import Billing from "./component/Billing/Billing";
import BillSuccess from "./component/BillSuccess/BillSuccess";
import Billing2 from "./component/BillPage/Billing";
import "./App.css"
import landscapeMode from './images/landscape.png'

function App() {
  const { colors ,restaurant_name,subscribePlan} = useContext(GlobalContext)

  return (
    <BrowserRouter>

      <div className={`${appStyle.container}`}
      style={{background:colors.backgroundTheme}}
     >
        {/*added by rohan- on 6/4/23
          reason- here i am adding cart and back button   */}
        <div className="heading_container" id="header" style={{position:"sticky",top:"0",zIndex:"99",background:colors.backgroundTheme}} >
          <h2 style={{ color: colors.headingColor }}
            // className="restaurant_name"
            className={restaurant_name.length > 9 ? 'restaurant_name' : 'restaurant_fontsize'}>
            {restaurant_name.toUpperCase()}
          </h2>

          

        </div>
        {/* end of heading */}

        <Routes>
          <Route exact path="/*" element={<Cover />} />
          <Route exact path="/menu-item" element={<MenuItem />} />
          <Route exact path="/cart" element={subscribePlan?.includes("order")?<Cart />:<Navigate to="/menu-item"/>} />
          <Route exact path="/billing" element={<Billing/>} />
          {/* <Route exact path="/<str:tenant>/tenant-details/" element={<Cover />} /> */}

          {/* Added by :- Parineeta Gedam
              Date :- 07-04-2023
              Reason : show the invoice, payment, and bill success page.
          */}

          <Route exact path="/invoice" element={<InvoiceDetails />} />
          <Route exact path="/payment" element={<Payment />} />

          {/* End of added code */}

          {/* Added by :- Parineeta Gedam
              Date :- 11-04-2023
              Reason : show the bill success page and Billing.
          */}
          <Route exact path="/bill-success" element={<BillSuccess />} />
          {/* <Route exact path="/billing" element={<Billing2 />} /> */}


          {/* End of added code */}

        </Routes>
        <Footer />
      </div>
      
      {/* added by rohan- to show landscape error msg for all pages
          date-13/4/34 */}
      <div className="inlandscapemode" style={{ color: colors.subHeadingColor }}>
        <img src={landscapeMode} style={{ height: '80vh' }} alt="" className="landscapimg" />
      </div>
      {/* end of code */}
    </BrowserRouter>

  );
}

export default App;
