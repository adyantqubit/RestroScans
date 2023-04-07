import appStyle from "./App.module.css";

import Cover from "./component/pages/cover/Cover";

import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import Home from "./component/pages/Home";
import MenuItem from "./component/MenuItem/MenuItem";
import Footer from "./component/layout/footer/Footer";
import Cart from "./component/pages/cart/Cart";
import { FaClipboardList } from "react-icons/fa"
import { useContext } from "react";
import { GlobalContext } from "./context/Context";

function App() {
  const { colors } = useContext(GlobalContext)
  var restaurant_name = localStorage.getItem("restroName")
  // const nav = useNavigate()

  return (
    <BrowserRouter>

      <div className={`${appStyle.container}`}>
        {/*added by rohan- on 6/4/23
          reason- here i am adding cart and back button   */}
        <div className="heading_container" >
          <h2 style={{ color: colors.headingColor }}
            // className="restaurant_name"
            className={restaurant_name.length > 9 ? 'restaurant_name' : 'restaurant_fontsize'}>
            {restaurant_name.toUpperCase()}
          </h2>

          <div className="icon_container">
            <Link to="/cart">
              <span className="selected_amount">9</span>
              <FaClipboardList style={{ fontSize: "24px", color: colors.bannerColor }} />
            </Link>
          </div>

        </div>
        {/* end of heading */}

        <Routes>
          <Route exact path="/*" element={<Cover />} />
          <Route exact path="/menu-item" element={<MenuItem />} />
          <Route exact path="/cart" element={<Cart />} />
          {/* <Route exact path="/<str:tenant>/tenant-details/" element={<Cover />} /> */}

        </Routes>
        <Footer />
      </div>
    </BrowserRouter>

  );
}

export default App;
