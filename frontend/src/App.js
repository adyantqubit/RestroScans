import appStyle from "./App.module.css";

import Cover from "./component/pages/cover/Cover";

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./component/pages/Home";
import MenuItem from "./component/MenuItem/MenuItem";
import Footer from "./component/layout/footer/Footer";

function App() {
  return (
    <div className={`${appStyle.container}`}>
      <BrowserRouter>
        <Routes>
          <Route  exact path="/*" element={<Cover />} />
          <Route  exact path="/menu-item" element={<MenuItem />} />

          {/* <Route exact path="/<str:tenant>/tenant-details/" element={<Cover />} /> */}

        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
