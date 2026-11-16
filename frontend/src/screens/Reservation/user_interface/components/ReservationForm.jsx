import { React, useContext, useState } from 'react';
import { GlobalContext } from "../../../../context/Context";
import { Form, Input, Card, message, Modal, InputNumber } from "antd";
import { AiOutlineClose } from "react-icons/ai"
import "../style/Reservation.css";
import { postReservationsAPI } from '../../services/reservationService';
import { CheckCircleOutlined } from '@ant-design/icons';

export default function ReservationForm({ isModalOpenn, handleCancell }) {
    const [form] = Form.useForm();

    // get data from context
    var { colors } = useContext(GlobalContext);

    var todaydate = new Date();
    var month = todaydate.getMonth() + 1; //current month
    var year = todaydate.getUTCFullYear(); //current year
    var tdate = todaydate.getDate(); //current date

    if (month < 10) {
        month = "0" + month;
    }
    if (tdate < 10) {
        tdate = "0" + tdate;
    }
    var minDate = year + "-" + month + "-" + tdate;

    const handleFormSubmit = async (formdata) => {
        var reservationData = {
            name: formdata.name,
            email: formdata.email,
            contact_number: formdata.contact_number,
            number_of_person: formdata.number_of_person,
            special_instructions: formdata.special_instructions,
            reservation_status: "Pending",
            date: formdata.date,
            time: formdata.time,
        };
        var tenantName = localStorage.getItem("tenantName")
        const response = await postReservationsAPI(reservationData, tenantName);
        if (response.msg) {
            message.success({
                content: "Your request has been successfully submitted",
                key: 1,
                icon: <CheckCircleOutlined />,
                style: {
                    marginTop: '5vh',
                    fontSize: "16px",
                    letterSpacing: "1.3px",
                    fontFamily: "Times News Roman",
                    color: colors.headingColor,
                },
            });
            handleCancell()
            form.resetFields();
        }
    };

    return (
        <Modal title="Please enter reservation details" footer={null} open={isModalOpenn} onCancel={handleCancell}>
            <div style={{ backgroundColor: colors.backgroundTheme }}>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrLoginerCol={{
                        span: 16,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={handleFormSubmit}
                >
                    <Form.Item
                        name="name"
                        label={<div className="labelContainer"><span>Name &nbsp;</span></div>}
                        rules={[
                            {
                                required: true,
                                message: "Please enter your name",
                            },
                        ]}
                    >
                        <Input
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your email",
                            },

                            {
                                type: "email",
                                message: "Please must be sure Email is valid",
                            },
                        ]}
                    >
                        <Input allowClear />
                    </Form.Item>

                     <Form.Item
                        name="contact_number"
                        label={<div className="labelContainer"><span>Contact Number &nbsp;</span></div>}
                        rules={[
                            {
                                required: true,
                                message: "Please enter your contact number",
                            },
                            () => ({
                                validator(_, value) {
                                    if (!value) {
                                        return Promise.reject();
                                    }
                                    if (isNaN(value)) {
                                        return Promise.reject("Contact number has to be in digits.");
                                    }
                                    if (value.length < 10) {
                                        return Promise.reject(
                                            "Contact number should be in 10 digits"
                                        );
                                    }
                                    if (value.length > 10) {
                                        return Promise.reject(
                                            "Contact number can't be more than 10 digits"
                                        );
                                    }
                                    if (value) {
                                        if (/^[0-9]*[.,]?[0-9]*$/.test(value)) {
                                          return Promise.resolve();
                                        }
                                          return Promise.reject(new Error("Contact number has to be in digits"));
                                      }
                                    return Promise.resolve();
                                },
                            }),
                        ]}
                    >
                        <Input maxLength={10}
                        />
                    </Form.Item>
                    <Form.Item
                        name="number_of_person"
                        label={<div className="labelContainer"><span>Number of Person &nbsp;</span></div>}
                        rules={[
                            {
                                required: true,
                                message: "Please enter number of person",
                            },
                        ]}
                    >
                        <Input style={{ width: "100%" }} type='number'
                        />
                    </Form.Item>

                    <Form.Item
                        name="date"
                        label={<div className="labelContainer"><span>Date &nbsp;</span></div>}
                        rules={[
                            {
                                required: true,
                                message: "Please enter date",
                            },
                        ]}
                    >
                        <input className='reservation_inputbox' format='DD-MM-YYYY' min={minDate}
                            max="3000-08-15" type='date' style={{ width: "98%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="time"
                        label={<div className="labelContainer"><span>Time &nbsp;</span></div>}
                        rules={[
                            {
                                required: true,
                                message: "Please enter time",
                            },
                        ]}
                    >
                        <input className='reservation_inputbox' type='time' style={{ width: "98%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="special_instructions"
                        label={<div className="labelContainer"><span>Special Instructions &nbsp;</span></div>}
                        rules={[
                            {
                                required: false,
                                message: "Please add some special instructions",
                            },
                        ]}
                    >
                        <Input style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <div className="btn_div">
                        <button
                            className="submit_btn"
                            style={{
                                backgroundColor: colors.bannerColor,
                                color: colors.backgroundTheme,
                                border: "none",
                                width: "80%"
                            }}>Submit</button>
                    </div>
                </Form>

            </div>
        </Modal>
    )
}
