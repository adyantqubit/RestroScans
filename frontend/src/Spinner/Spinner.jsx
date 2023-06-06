// Added by Parineeta Gedam
// date : 20-05-2223
// Reason : for show loading

import { Space, Spin } from "antd";
import "./Spinner.css";
import adyant from "../images/restroAdyant.png";

const Spinner = () => {
  return (
    <div class="load-wrapp">
      <div class="loading" >
        <img src={adyant} className="header_adyant_logo" alt="adyant" />
      </div>
      <div style={{ marginTop: "20px" }}>
        <Space size="middle">
          <Spin size="small" />
          <Spin />
          <Spin size="large" />
        </Space>
      </div>
    </div>
  );
};

export default Spinner;

// end of added code