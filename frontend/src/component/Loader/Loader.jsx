import React from 'react';
import { Space, Spin } from "antd";
import './Loader.css'
// import loader from '../../images/adyant.jpeg'
import loader from '../../images/restroAdyant.png'


export default function Loader() {
    return (
        <div className='load-wrap'>
            <div className='loading'>
            <img src={loader} style={{ width: '200px', height: '300px' }} />

                {/* <p>Adyant</p> */}
                <br />
                <Space size='middle'>
                    <Spin size='small' />
                    <Spin size='large' />

                </Space>
            </div>
            {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={loader} style={{ width: '200px', height: '50px' }} />
            </div> */}
        </div>
    )
}
