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
        

        <Routes>
          <Route exact path="/*" element={<Cover />} />
          <Route exact path="/menu-item" element={<MenuItem />} />
          <Route exact path="/cartTesting_001" element={<Cart />} />
          {/* <Route exact path="/<str:tenant>/tenant-details/" element={<Cover />} /> */}

        </Routes>
        <Footer />
      </div>
    </BrowserRouter>

  );
}

export default App;
