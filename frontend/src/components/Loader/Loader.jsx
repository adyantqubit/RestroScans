import React from 'react';
import { Space, Spin } from "antd";
import './Loader.css'
import loader from '../../images/restroAdyant.png'

export default function Loader() {
    return (
        <div className='load-wrap'>
            <div className='loading'>
            <img src={loader} style={{ width: '200px', height: '300px' }} />

                <br />
                <Space size='middle'>
                    <Spin size='small' />
                    <Spin size='large' />

                </Space>
            </div>
        </div>
    )
}
