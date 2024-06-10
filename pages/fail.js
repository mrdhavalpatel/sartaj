import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import axios from 'axios';
import { API_BASE_URL } from "../lib/api";
import { Modal, Button } from "react-bootstrap";
import { useIntl } from 'react-intl';

const OrderFailScreen = ({ onContinueCOD }) => {
    const intl = useIntl();
    const [orderid, setOrderId] = useState(0);
    const [name12, setname] = useState("");
    const [locale, setLocale] = useState(intl.locale);
    const [modalOpenCancel, setModalOpenCancel] = useState(false);
    const [modalOpenSuccess, setModalOpenSuccess] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const handleClose = () => {
        setModalOpenCancel(false);
        setModalOpenSuccess(false);
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('order_id');
        const name1 = urlParams.get('name');
        const locale = urlParams.get('locale') || intl.locale;

        setOrderId(orderId);
        setname(name1);
        setLocale(locale);
        console.log("order_id", orderId, "name", name1, "locale", locale);
    }, [intl.locale]);

    const ConfirmAsCod = async () => {
        let token = localStorage.getItem("token");
        try {
            console.log("url", API_BASE_URL, "id", orderid);
            const response = await axios.get(`${API_BASE_URL}customer/order/order-status/${orderid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data.message);
            setModalOpenSuccess(true);
        } catch (error) {
            console.error('Error fetching order status:', error);
        }
    };

    const CancelOrder = async () => {
        let token = localStorage.getItem("token");
        try {
            console.log("url", API_BASE_URL, "id", orderid);
            const response = await axios.get(`${API_BASE_URL}customer/order/cancel-order/${orderid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data.message);
            setModalMessage("Your order has been successfully canceled. We're here to help if you need anything else. Thank you for shopping with Sartaj!");
            setModalOpenCancel(true);
        } catch (error) {
            console.error('Error fetching order status:', error);
        }
    };

    const filterStyle = {
        filter: 'invert(9%) sepia(100%) saturate(7483%) hue-rotate(359deg)'
    };

    return (
        <Layout parent="Home" sub="Shop" subChild="fail" >
            <div className="container">
                <div className='row'>
                    <div className='col-md-6 offset-md-3'>
                        <div className="order-fail-screen" style={{ justifyContent: "center", minHeight: "80vh", display: "flex", flexFlow: "column" }}>
                            <img src='/assets/danger.png' style={{ height: "100px", width: "100px", alignSelf: "center", ...filterStyle }} />
                            <h3 style={{ color: "#ff0000", marginTop: "20px", marginBottom: "20px", textAlign: "center" }}>{intl.formatMessage({ id: "Transaction Failed" })}</h3>
                            <h2 style={{}}>{intl.formatMessage({ id: "Dear "})}{name12},</h2>
                            <p style={{ fontSize: "20px", color: "grey", marginTop: "15px", marginBottom: "15px" }}>{intl.formatMessage({ id: "Your Payment has failed, do you still want to place an order as a " })}<span style={{ color: "#3e4493" }}><b>{intl.formatMessage({ id: "Cash On Delivery" })}</b></span>{intl.formatMessage({ id: " Order?" })} </p>
                            <p style={{ fontSize: "20px", color: "grey", marginTop: "15px", marginBottom: "15px" }}>{intl.formatMessage({ id: "Order ID : "})}{orderid} </p>
                            <div className="cod-prompt">
                                <button className="btn btn-success ms-0" onClick={ConfirmAsCod}>
                                {intl.formatMessage({ id: "Yes, Continue"})}
                                </button>
                                <button className="btn btn-secondary" onClick={CancelOrder}>
                                {intl.formatMessage({ id: " No, Cancel Order"})}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal centered show={modalOpenCancel} onHide={handleClose} style={{ backgroundColor: "rgba(80, 80, 80, 0.5)", justifyContent: "center" }} backdrop="static">
                <Modal.Header>
                    <Modal.Title>
                        <h3>{intl.formatMessage({ id: "Cancel Order Successful"})}</h3>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-center' style={{ padding: "30px" }}>
                    <center>
                        {intl.locale == "eng" ? 
                        <img src='/assets/orderCan.png' style={{ height: "250px", width: "100%", alignSelf: "center", objectFit: "contain" }} />:
                        <img src='/assets/ordercanjp.png' style={{ height: "250px", width: "100%", alignSelf: "center", objectFit: "contain" }} />

                        }
                        </center>
                    <p style={{ fontSize: "20px" }}>{intl.formatMessage({ id: "Your order has been successfully canceled. We're here to help if you need anything else. Thank you for shopping with Sartaj!" })}</p>
                    <div className="cart-action mobile_btn onebtn mt-20">
                        <a className="btn" href={`/${locale}/shop`}>
                            <i className="fi-rs-shopping-bag mr-10"></i>
                            {intl.formatMessage({ id: "Continue Shopping" })}
                        </a>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal centered show={modalOpenSuccess} onHide={handleClose} style={{ backgroundColor: "rgba(80, 80, 80, 0.5)", justifyContent: "center" }} backdrop="static">
                <Modal.Header>
                    <Modal.Title>
                        <h3>{intl.formatMessage({ id: "Cash On Delivery Order Successful"})}</h3>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-center' style={{ padding: "30px" }}>
                    <center>
                        {intl.locale =="eng" ?
                        <img src='/assets/orderSuc.png' style={{ height: "250px", width: "100%", alignSelf: "center", objectFit: "contain" }} />:
                        <img src='/assets/ordersucjp.png' style={{ height: "250px", width: "100%", alignSelf: "center", objectFit: "contain" }} />

                    }
                        </center>
                    <p style={{ fontSize: "20px" }}>{intl.formatMessage({ id: "Your order has been successfully converted to Cash On Delivery. We're here to assist you with any further inquiries. Thank you for shopping with Sartaj!"})}</p>
                    <div className="cart-action mobile_btn onebtn mt-20">
                        <a className="btn" href={`/${locale}/shop`}>
                            <i className="fi-rs-shopping-bag mr-10"></i>
                            {intl.formatMessage({ id: "Continue Shopping" })}
                        </a>
                    </div>
                </Modal.Body>
            </Modal>
        </Layout>
    );
};

export default OrderFailScreen;
