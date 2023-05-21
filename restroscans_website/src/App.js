// Added by:- Suman sahu On 05/04/2023

import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Header from "./Pages/Header";
import Footer from "./Pages/Footer";
import RestroScans from "./Pages/RestroScans";
import ContactUs from "./Pages/ContactUs";
import Gallery from "./Pages/Gallery";
import Pricing from "./Pages/Pricing";
import Features from "./Pages/Features";
import AboutUs from "./Pages/AboutUs";
import { useState } from "react";

function App() {
  // Added by:- Suman  On 16/04/2023
  // Reason: Hide open & close menues on header in responsive
  const [isOpen, setIsOpen] = useState(false);
  // End of added code 16/04/2023
  return (
    <>
      <BrowserRouter>
        <Header setIsOpen={setIsOpen} isOpen={isOpen} />
        <div
          className="App"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <Routes>
            {/* Added by:- Suman sahu  On  05/04/2023 
                Reason:- Create home page for restroscans website*/}
            <Route path="/" element={<Home />}></Route>

            {/* Added by:- Suman sahu  On  13/04/2023 
                Reason:- Create restroscans form for where user can apply for restroscans app*/}
            <Route path="/restroscans" element={<RestroScans />}></Route>

            {/* Added by:- Suman sahu  On  14/04/2023 
                Reason:- Create contact us page for restroscans website*/}
            <Route path="/contactus" element={<ContactUs />}></Route>

            {/* Added by:- Suman sahu  On  14/04/2023 
                Reason:- Create gallery page for restroscans website*/}
            <Route path="/gallery" element={<Gallery />}></Route>

            {/* Added by:- Suman sahu  On  15/04/2023 
                Reason:- Create Pricing page for restroscans website*/}
            <Route path="/pricing" element={<Pricing />}></Route>

            {/* Added by:- Suman sahu  On  15/04/2023 
                Reason:- Create Featurs page for restroscans website*/}
            <Route path="/features" element={<Features />}></Route>

            {/* Added by:- Suman sahu  On  16/04/2023 
                Reason:- Create About us page for restroscans website*/}
            <Route path="/aboutus" element={<AboutUs />}></Route>
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
/* End of added code 05/04/2023 */
