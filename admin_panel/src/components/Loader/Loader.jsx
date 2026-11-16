import React from "react";
import { Space, Spin } from "../../ui";
import "./loader.module.css";
import loader from "../../images/restroAdyant.png";

export default function Loader() {
  return (
    <div className="load-wrap" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
      <div className="loading" style={{display:"flex",flexDirection:'column'}}>
        <img src={loader} style={{ width: "200px", height: "300px" }} />

        <br />
        <Space size="middle" style={{margin:'0 auto'}}>
          <Spin size="small" />
          <Spin size="large" />
        </Space>
      </div>
    </div>
  );
}
