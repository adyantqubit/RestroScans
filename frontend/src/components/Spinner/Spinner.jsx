import { Space, Spin } from "antd";
import "./Spinner.css";
import adyant from "../../images/adyant.jpeg";

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
