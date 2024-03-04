import React from 'react';
import { useIntl } from "react-intl";


const Modal = ({ isOpen, onClose, onYesClick }) => {
  const intl = useIntl();

    if (!isOpen) return null;
    const handleClickOutside=()=>{
        onClose()
    }
    return (
        <div className="modal-overlay" onClick={handleClickOutside} style={{zIndex:9999999999999}}>
            <div style={{ backgroundColor: "white", padding: 20, flexWrap: "wrap" , borderRadius:10 , zIndex:99999999999 , overflow:"hidden" }}>
                <h4>
                {intl.formatMessage({ id: "Please Confirm Your Age" })}</h4>
                <div style={{ borderWidth: 1, borderColor: "grey", borderTop: '1px solid #ccc', margin: '10px 0' }}></div>
                <h6 style={{ color: "grey", fontWeight: "normal" }}>
                {intl.formatMessage({ id: "Sartaj foods is socially responsible and does not sell alcohol to minors." })} <br></br>
                {intl.formatMessage({ id: "please confirm you are over 20 years of age." })}</h6>
                <div style={{ borderWidth: 1, borderColor: "grey", borderTop: '1px solid #ccc', margin: '10px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <button onClick={onClose} style={{ backgroundColor: "#3e4493", padding: 10, borderRadius: 10, borderWidth: 0, paddingRight: 15, paddingLeft: 15 , color:"white" }}>{intl.formatMessage({id:"Close"})}</button>

      <button onClick={onYesClick} style={{ backgroundColor: "#3e4493", padding: 10, borderRadius: 10, borderWidth: 0, paddingRight: 15, paddingLeft: 15 , color:"white" }}>{intl.formatMessage({id:"I Confirm"})}</button>
    </div>
            </div>
        </div>
    );
};

export default Modal;
