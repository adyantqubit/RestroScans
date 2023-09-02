// Commented by Om Shrivastava on 02-09-23
// Reason : I inhance this code
// const Loader = () => <div className="loader"></div>;

// export default Loader;
// End of Commented by Om Shrivastava on 02-09-23

// Added by Om Shrivastava on 02-09-23
// Reason : Create the loader
import React from "react";
import { Space, Spin } from "antd";
import "./loader.module.css";
// import loader from '../../images/adyant.jpeg'
import loader from "../../images/restroAdyant.png";

export default function Loader() {
  return (
    <div className="load-wrap" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
      <div className="loading" style={{display:"flex",flexDirection:'column'}}>
        <img src={loader} style={{ width: "200px", height: "300px" }} />

        {/* <p>Adyant</p> */}
        <br />
        <Space size="middle" style={{margin:'0 auto'}}>
          <Spin size="small" />
          <Spin size="large" />
        </Space>
      </div>
      {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={loader} style={{ width: '200px', height: '50px' }} />
            </div> */}
    </div>
  );
}
// End of addition by Om Shrivastava on 02-09-23
// Reason : Create the loader